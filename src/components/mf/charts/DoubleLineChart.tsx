"use client"

import { CartesianGrid, Line, LineChart, XAxis,YAxis,Tooltip,LabelList, ResponsiveContainer } from "recharts"
import { formatValue } from "@/lib/utils";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import HeaderRow from "../HeaderRow";
import { InformationCard } from "../InformationCard";
import { Loader2 } from "lucide-react";

interface DoubleLineProps {
    chartData?: 
    {label: string;
    [key: string]: string | number;}[]
    chartConfig?: {
        [key: string]: {
          label: string;
          color: string;
        };
      };
      InformCard?:{title:string,desc:string}[];
      isInformCard?:boolean;
    handleExport?: () => void;
    onExpand: () => void;
    onExport?: (s: string, title: string, index: number) => void;
    title?: string;
    isSelect?: boolean;
    isRadioButton?: boolean;
    LinechartTitle?:string;
    AxisLabel?:string;
    isLoading:boolean;
    selectoptions?:string[];
    selectedFrequency?:string;
    placeholder?:string;
    isPercentage?:boolean;
    handleFrequencyChange?: (value: string) => void; 

}

const DoubleLineChart: React.FC<DoubleLineProps> = ({ 
  chartData=[], 
  chartConfig={},
  handleExport,
  onExport,
  onExpand,
  LinechartTitle,
  selectoptions,
  selectedFrequency,
  isPercentage,
  handleFrequencyChange,
  isLoading,
  placeholder,
  title ,
  isSelect= false,
  isRadioButton =false,
  AxisLabel= "Value",
  InformCard=[],
  isInformCard=false,
 }) => {
  const chartHeight = Math.min(chartData.length * 10, 400); 
  // Determine the minimum height based on the number of entries
 
  const CustomTick = ({ x, y, payload, chartConfig }) => {
    const label = chartConfig[payload.value]?.label || payload.value;
  
    return (
      <g transform={`translate(${x},${y})`}>
        <title>{label}</title> {/* Tooltip on hover */}
        <text
          x={0}
          y={0}
          dy={4} // Adjusts vertical alignment
          textAnchor="end"
          fontSize={8}
          className="truncate w-24"
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            width: "60px", // Set width to limit label
          }}
        >
          {label.length > 8 ? `${label.slice(0, 6)}...` : label}
        </text>
      </g>
    );
  };
  
  return (
    <Card className="border-none ">
         <HeaderRow
        title={title}
        onExpand={onExpand}
        handleExport={handleExport}
        isRadioButton={isRadioButton}
        isSelect={isSelect}
        handleFrequencyChange={handleFrequencyChange}
        selectoptions={selectoptions}
        selectedFrequency={selectedFrequency}
        onExport={onExport}
        placeholder={placeholder}
      />
       {isInformCard &&(
          <div className="flex-1 px-4 flex flex-row ">
          {InformCard?.map((item, index) => (
                <InformationCard
                  key={index}
                  InformTitle={item.title}
                  informDescription={item.desc}
                />
              ))}
          </div>
        )}
      <CardHeader className="items-center pt-0">
        <CardTitle className="text-body font-semibold">{LinechartTitle}</CardTitle>
      </CardHeader>
      <CardContent className=" h-[280px] w-full overflow-y-auto scrollbar p-0" >
      {isLoading ?(
         <div className="flex items-center justify-center h-[250px]">
                    <Loader2 className=" h-8 w-8 animate-spin text-primary" />
               </div>
      ):(
        <div className="overflow-x-auto"> 
        <ChartContainer config={chartConfig} style={{height:'250px', width:'100%'}} >
        {chartData.length > 0 ? (
          <ResponsiveContainer height={250} width={"100%"}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              top:15,
              bottom:10,
            }}
            height={chartHeight}
            barGap={10}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              interval={0}
              tickMargin={20}
              angle={270}
              tickFormatter={(value) => {
                return value.length > 3 ? value.slice(0, 3) + "..." : value;
              }}
              className="text-body"
              tick={<CustomTick chartConfig={chartConfig} />}
            />
            
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => formatValue(value as number, AxisLabel)}
              className="text-body mt-2"
              style={{fontSize:'8px'}}
              
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent isPercentage={isPercentage}/>} />
            <ChartLegend
              content={<ChartLegendContent/>}
            />
            {Object.keys(chartConfig).map((key, index) => {
              return (
                <Line 
                  key={index}
                  dataKey={key}
                  type="linear"
                  stroke={chartConfig[key].color}
                  strokeWidth={2}
                  dot={{
                    fill: chartConfig[key].color, // Just pass the color string directly here
                  }}
                >
            <LabelList
                position="top"
                offset={12}
                className="fill-foreground "
                fontSize={8}
              />
                    </Line>
              );
            })}
          </LineChart>
          </ResponsiveContainer>
            ) : (<div className="flex items-center justify-center h-[400px]">
              <span className="text-small-font">No Data Found.!</span>
            </div>)}
        </ChartContainer>
        </div>
      )}
      </CardContent>
    </Card>
  )
}
export default DoubleLineChart;
