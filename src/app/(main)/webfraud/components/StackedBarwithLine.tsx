import * as React from "react";
import { Bar, CartesianGrid, XAxis, YAxis, Line, ComposedChart, LabelList,ResponsiveContainer } from "recharts";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartLegend,ChartTooltip,ChartTooltipContent } from "@/components/ui/chart";
import { getXAxisAngle, formatNumber } from '@/lib/utils';
import HeaderRow from "./HeaderRow";
import { Loader2 } from "lucide-react";
interface XAxisConfig {
  dataKey?: string;
  tickLine?: boolean;
  tickMargin?: number;
  axisLine?: boolean;
  tickFormatter?: (value: string) => string;
  angle?: number;
  textAnchor?: string;
  dy: number;
}
interface YAxis1 {
  yAxisId?: "left" | "right";
  orientation?: "left" | "right";
  stroke?: string,
  tickFormatter?: (value: string) => string;
}
interface YAxis2 {
  yAxisId?: "left" | "right";
  orientation?: "left" | "right";
  stroke?: string,
  tickFormatter?: (value: string) => string;
}
interface TrafficTrendData {
  month?: string;
  Invalid?: number;
  Valid?: number;
  "Invalid %"?: number;
  
}


interface StackBarLineProps {
  chartData?: TrafficTrendData[];
  chartConfig?: {
    [key: string]: {
      label: string;
      color: string;
    };
  };
  handleExport?: () => void;
  onExpand: () => void;
  onExport?: (s: string, title: string, index: number) => void;
  visitEventOptions?: { value: string; label: string }[];
  handleTypeChange?: (value: string) => void;
  selectedType?: string;
  selectoptions?:string[];
  title?: string;
  isSelect?: boolean;
  isRadioButton?: boolean;
  placeholder?:string;
  isHorizontal?:boolean;
  xAxisConfig?: XAxisConfig;
  YAxis1?: YAxis1;
  YAxis2?: YAxis2;
  isLoading?:boolean;
}

const StackedBarWithLine: React.FC<StackBarLineProps> = ({
  chartData = [],
    chartConfig = {},
    handleTypeChange,
    visitEventOptions,
    selectedType,
    selectoptions=[],
    handleExport,
    onExport,
    onExpand,
    isLoading= false,
    title ,
    isSelect= false,
    isRadioButton =false,
    placeholder="",
    isHorizontal=false,
    xAxisConfig = {
    dataKey: "month", 
    tickLine: true,
    tickMargin: 10,
    axisLine: true,
    angle: 0,
    textAnchor: "middle",
    dy: 10,
  },
  YAxis1 = {
    yAxisId: "left",
    orientation: "left",
    stroke: "hsl(var(--chart-1))",
    tickFormatter: (value: number) => formatNumber(value)
  },
  YAxis2 = {
    yAxisId: "right",
    orientation: "right",
    stroke: "hsl(var(--chart-3))",
    tickFormatter: (value: number) => `${value}%`,
  }, }) => {
  const labels = Object.values(chartConfig || {}).map(item => item.label);
  const colors = Object.values(chartConfig || {}).map(item => item.color);
  const months = chartData?.map(item => item.month).filter((month): month is string => month !== undefined) || [];
  const xAxisAngle = getXAxisAngle(months);
  const mergedXAxisConfig = { ...xAxisConfig };
  const mergedYAxis1Props = { ...YAxis1 };
  const mergedYAxis2Props = { ...YAxis2 };

  const CustomLegendContent = ({ labels,colors }: { labels: string[] , colors: string[];}) => {
    return (
      <div className="flex space-x-4 pt-10 justify-center">
      {labels?.map((labelText:string, index) => {
        return (
          <div className="flex items-center space-x-2" key={index}>
            <span  style={{ backgroundColor: colors[index] }} className={`w-4 h-4 rounded-full `}></span>
            <span>{labelText}</span>
          </div>
        );
      })}
    </div>
    );
  };
  return (
    <Card className="border-none w-full ">
      <CardTitle className="p-2">
     <HeaderRow
      visitEventOptions={visitEventOptions}
     handleTypeChange={handleTypeChange}
     selectedType={selectedType}
     title={title}
     onExpand={onExpand}
      handleExport={handleExport}
      selectoptions={selectoptions}
     isRadioButton={isRadioButton}
     isSelect={isSelect}
     onExport={onExport}
     placeholder={placeholder}/>
     </CardTitle>
     {isLoading ? (
      <div className="flex items-center justify-center min-h-full">
            <Loader2 className=" h-8 w-8 animate-spin text-primary" />
       </div>
     ):(
      <CardContent className="overflow-x-auto overflow-y-hidden scrollbar lg:w-full">
        <ChartContainer config={chartConfig} className="relative h-[320px] sm:w-full lg:w-full">
        <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              accessibilityLayer
              data={chartData}
              margin={{ top: 30, right: 2, left: 2 }}
              barGap={20}
            >
             <ChartLegend content={<CustomLegendContent labels={labels} colors={colors} />} />

              <CartesianGrid vertical={false} />
              <XAxis  className="text-small-font" {...mergedXAxisConfig}
                angle={xAxisAngle} 
                interval={0}
              />
              <YAxis className="text-small-font" {...mergedYAxis1Props}
                tickFormatter={(value: number) => formatNumber(value)}
              />
              <YAxis className="text-small-font"
                {...mergedYAxis2Props}
                tickFormatter={(value) => `${value}%`}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent  indicator="dot" />} />

              {chartData && chartConfig && Object.keys(chartConfig).map((key, index) => {
                if (key !== "Invalid %") {
                  return (
                    <Bar
                      key={index}
                      dataKey={key}
                      stackId="a"
                      fill={chartConfig[key].color}
                      radius={index % 2 === 0 ? [0, 0, 4, 4] : [4, 4, 0, 0]}
                      yAxisId="left"
                      barSize={60}
                    >
                      <LabelList
                        dataKey={key}
                        position="center"
                        formatter={(value: number) => formatNumber(value)}
                        style={{ fontSize: '8px', fill: '#000' }}
                      />
                    </Bar>
                  );
                }
                return (
                  <Line
                    key={index}
                    type="monotone"
                    dataKey={key}
                    stroke={chartConfig[key].color}
                    strokeWidth={2}
                    dot={{ fill: chartConfig[key].color, r: 1 }}
                    yAxisId="right"
                  />
                );
              })}
            </ComposedChart>
            </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      )}
    </Card>
  );
};

export default StackedBarWithLine;
