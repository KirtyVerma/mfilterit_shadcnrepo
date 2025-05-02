"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Label, ResponsiveContainer} from "recharts"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import HeaderRow from "../HeaderRow";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatValue, formatNumber } from "@/lib/utils";
import { InformationCard } from "../InformationCard";
import { Loader2 } from "lucide-react";


interface ChartBarStackedProps {
  handleExport?: () => void;
  onExpand: () => void;
  onExport?: (s: string, title: string, index: number) => void;
  visitEventOptions?: { value: string; label: string }[];
  handleTypeChange?: (value: string) => void;
  selectedType?: string;
  title?: string;
  isSelect?: boolean;
  isRadioButton?: boolean;
  heading?:string
  isInformCard?:boolean;
  layoutDirection?:string;
  isLegend?:boolean;
  ischangeLegend?:boolean;
  placeholder?:string;
  isLoading?:boolean;
  selectoptions?:string[];
  selectedFrequency?:string;
  handleFrequencyChange?: (value: string) => void; 
  isCartesian?:boolean;
  isPercentage?:boolean;

  //sub_heading?:string
 InformCard?:{title:string,desc:string}[];
  chartData?: 
    {label: string;
    [key: string]: string | number;}[]
    chartConfig?: {
      [key: string]: {
        label: string;
        color: string;
      };
    };
  xAxis?: {
    dataKey: string
    title: string
    tickFormatter?: (value: string | number) => string
    isPercentage?: boolean  // Add this to control percentage display
  }
  yAxis?: {
    dataKey: string
    title?: string
    tickFormatter?: (value: string ) => string
  }
  isHorizontal?: boolean;
  AxisLabel?:string;
}

 const ChartBarStacked:React.FC<ChartBarStackedProps> = ({ 
  heading ="heading",
  //sub_heading,
    handleTypeChange,
    visitEventOptions,
    isCartesian,
    selectedType,
    handleExport,
    onExport,
    selectoptions =[],
    onExpand,
    handleFrequencyChange,
    title ,
    isSelect= false,
    isRadioButton =false,
    chartData=[],
    chartConfig,
    xAxis,
    yAxis,
    isPercentage=false,
    selectedFrequency,
    placeholder,
    isHorizontal,
    AxisLabel= "Value",
    InformCard=[],
    isInformCard=false,
    layoutDirection ="flex-col",
    isLegend=true,
    ischangeLegend=false,
    isLoading,
  }) => {
    const chartHeight = chartData.length > 0 ? Math.min(chartData.length * 20, 500) : 300; 

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
   <Card className="border-none">
   <HeaderRow
      visitEventOptions={visitEventOptions}
      handleTypeChange={handleTypeChange}
      selectoptions={selectoptions}
      selectedType={selectedType}
      title={title}
      handleFrequencyChange={handleFrequencyChange}
      selectedFrequency={selectedFrequency}
      onExpand={onExpand}
      handleExport={handleExport}
      isRadioButton={isRadioButton}
      isSelect={isSelect}
      onExport={onExport}
      heading={heading}
      placeholder={placeholder}

/>
{isInformCard &&(
  <div className="flex-1 px-4 flex flex-row">
  {InformCard?.map((item, index) => (
        <InformationCard
          key={index}
          InformTitle={item.title}
          informDescription={item.desc}
        />
      ))}
  </div>
    )}
{/* <CardHeader>
  <CardTitle>
  </CardTitle>
</CardHeader> */}
 {isLoading ? (
      <div className="flex items-center justify-center h-[300px] sm:h-[300px] lg:h-[4
      00px]">
            <Loader2 className=" h-8 w-8 animate-spin text-primary" />
       </div>
     ):(
<CardContent className="w-full h-[300px] overflow-y-auto scrollbar p-0">
  {chartData.length>0 ?(
  <div className="flex flex-col w-full ">
    {/* Chart Container */}
    <div className="flex flex-col w-full ">
      <ChartContainer config={chartConfig} style={{ height: "280px",width: "100%" }}>
         <ResponsiveContainer height={280} width="100%"> 
          <BarChart
            data={chartData}
            layout={isHorizontal ? 'horizontal' : 'vertical'}
            margin={{ left: 20, right: 40, top: 10, bottom: 20 }}
            barSize={20}
            barGap={30}
            height={chartHeight} 
          >
            {isCartesian &&(
             
            <CartesianGrid strokeDasharray="2 2" stroke="#555" strokeWidth={0.5} horizontal={isHorizontal} vertical={!isHorizontal} />
            )}
            <XAxis 
              className="text-small-font"
              dataKey={isHorizontal ? xAxis?.dataKey : undefined}
              type={isHorizontal ? 'category' : 'number'}
              tickLine={false} 
              axisLine={true}
              tickFormatter={isHorizontal 
                ? undefined 
                : (value: string | number) => {
                    if (typeof value === 'number') {
                      if (xAxis?.isPercentage) {
                        return `${value}%`;
                      }
                      // Use the formatNumber utility for large numbers
                      return formatNumber(value);
                    }
                    return value;
                  }
              }
              interval={0}
              angle={isHorizontal ? -45 : 0}
              textAnchor={isHorizontal ? 'end' : 'start'}
              height={isHorizontal ? 80 : 30}
            >
              {isHorizontal && <Label style={{fontSize:'10px'}} value={xAxis?.title} offset={-20} position="insideBottom" />}
            </XAxis>
            {yAxis && (
  <YAxis
    className="text-body"
    dataKey={isHorizontal ? undefined : yAxis.dataKey}
    type={isHorizontal ? 'number' : 'category'}
    tickLine={false}
    axisLine={true}
    tickFormatter={isHorizontal 
      ? (value: number) => `${(value * 1).toFixed(0)}%`
      : (value: string) => {
          return value.length > 10 ? value.substring(0, 5) + "..." : value;
        }
    }  
    width={isHorizontal ? 50 : 80}
    tickMargin={12}
    interval={0}
    height={isHorizontal ? 80 : 500}
    tick={<CustomTick chartConfig={chartConfig} />}
  >
    {!isHorizontal && <Label style={{fontSize:'10px'}} value={yAxis.title} angle={-90} position="left"  offset={-10} />}
  </YAxis>
)}
            <ChartTooltip content={<ChartTooltipContent isPercentage={isPercentage} />} />
            {isLegend && (
              <ChartLegend
                content={<ChartLegendContent />}
              />
            )}
            {/* Chart Bars */}
            {chartConfig &&
              Object.keys(chartConfig).map((key) => (
                <Bar key={key} dataKey={key} stackId="a" fill={chartConfig[key].color} />
              ))}
              
          </BarChart>
         </ResponsiveContainer> 
      </ChartContainer>
    </div>

    {/* Legend Container Below or Side Based on layoutDirection */}
    {ischangeLegend && (
     <div className="grid grid-cols-5  w-full p-0 "> {/* 5 columns with a gap */}
     {chartConfig &&
       Object.keys(chartConfig).map((key) => (
         <div key={key} className="flex items-center">
           <div
             className="w-2 h-2 mr-2"
             style={{ backgroundColor: chartConfig[key].color }}
           ></div>
           <span className="text-small-font">{chartConfig[key].label}</span>
         </div>
       ))}
   </div>
    )}
  </div>
 
  ):( <div className="flex items-center justify-center h-[500px]">
    <span className="text-small-font">No Data Found.!</span>
  </div>)}
</CardContent>
     )}
    </Card>
  );
}
export default ChartBarStacked
