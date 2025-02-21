"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Label, ResponsiveContainer} from "recharts"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import HeaderRow from "./HeaderRow";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatValue } from "@/lib/utils";
import { InformationCard } from "./InformationCard";
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
  isLoading?:boolean;
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
    tickFormatter: (value: string | number) => string  

  }
  yAxis?: {
    dataKey: string
    title: string
    tickFormatter: (value: string ) => string
  }
  isHorizontal?: boolean;
  AxisLabel?:string;
}

 const ChartBarStacked:React.FC<ChartBarStackedProps> = ({ 
  heading ="heading",
  //sub_heading,
    handleTypeChange,
    visitEventOptions,
    selectedType,
    handleExport,
    onExport,
    onExpand,
    title ,
    isSelect= false,
    isRadioButton =false,
    chartData=[],
    chartConfig,
    xAxis,
    yAxis,
    isHorizontal,
    AxisLabel= "Value",
    InformCard=[],
    isInformCard=false,
    layoutDirection ="flex-col",
    isLegend=true,
    ischangeLegend=false,
    isLoading,
  }) => {
  return (
   <Card className="border-none">
   <HeaderRow
      visitEventOptions={visitEventOptions}
      handleTypeChange={handleTypeChange}
      selectedType={selectedType}
      title={title}
      onExpand={onExpand}
      handleExport={handleExport}
      isRadioButton={isRadioButton}
      isSelect={isSelect}
      onExport={onExport}
      heading={heading}
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
<CardHeader>
  <CardTitle>
  </CardTitle>
</CardHeader>
<CardContent className="w-full  overflow-x-auto scrollbar">
  <div className="flex flex-col w-full h-[340px] ">
    {/* Chart Container */}
    <div className="flex flex-1 w-full ">
      <ChartContainer config={chartConfig} style={{width:"100%", height:"100%"}}>
         <ResponsiveContainer height="100%"> 
          <BarChart
            data={chartData}
            layout={isHorizontal ? 'horizontal' : 'vertical'}
            margin={{ left: 20, right: 5, top: 10, bottom: 20 }}
            barSize={20}
            barGap={30}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={isHorizontal} vertical={!isHorizontal} />
            <XAxis className="text-small-font"
              dataKey={isHorizontal ? xAxis?.dataKey : undefined}
              type={isHorizontal ? 'category' : 'number'}
              tickLine={false}
              axisLine={false}
              tickFormatter={isHorizontal ? undefined : (value) => formatValue(value as number, AxisLabel)}
              interval={0}
              angle={isHorizontal ? -45 : 0}
              textAnchor={isHorizontal ? 'end' : 'start'}
              height={isHorizontal ? 80 : 30}
            >
              {isHorizontal && <Label value={xAxis?.title} offset={-20} position="insideBottom" />}
            </XAxis>
            <YAxis
              className="text-small-font"
              dataKey={isHorizontal ? undefined : yAxis?.dataKey ?? 0}
              type={isHorizontal ? 'number' : 'category'}
              tickLine={false}
              axisLine={false}
              tickFormatter={isHorizontal ? (value: number) => `${(value * 1).toFixed(0)}%` : yAxis?.tickFormatter}
              width={isHorizontal ? 50 : 80}
              tickMargin={5}
              interval={0}
              height={isHorizontal ? 80 : 500}
            >
              {!isHorizontal && <Label value={yAxis?.title} angle={-90} position="insideLeft" offset={-5} />}
            </YAxis>
            <ChartTooltip content={<ChartTooltipContent />} />
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
      <div className="flex flex-col justify-center w-full mt-4">
        {chartConfig &&
          Object.keys(chartConfig).map((key) => (
            <div key={key} className="flex items-center mr-2 mb-2">
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
</CardContent>
    </Card>
  );
}
export default ChartBarStacked
