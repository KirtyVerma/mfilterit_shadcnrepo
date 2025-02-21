"use client"

import { CartesianGrid, Line, LineChart, XAxis,YAxis,LabelList } from "recharts"
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
import HeaderRow from "./HeaderRow";
import { InformationCard } from "./InformationCard";

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

}

const DoubleLineChart: React.FC<DoubleLineProps> = ({ 
  chartData=[], 
  chartConfig={},
  handleExport,
  onExport,
  onExpand,
  LinechartTitle,
  title ,
  isSelect= false,
  isRadioButton =false,
  AxisLabel= "Value",
  InformCard=[],
  isInformCard=false,
 }) => {
    
  return (
    <Card className="border-none ">
         <HeaderRow
        title={title}
        onExpand={onExpand}
        handleExport={handleExport}
        isRadioButton={isRadioButton}
        isSelect={isSelect}
        onExport={onExport}
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
      <CardContent >
        <ChartContainer config={chartConfig} style={{height:"100%"}}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
              className="text-small-font"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => formatValue(value as number, AxisLabel)}
              className="text-small-font mt-2"
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent/>} />
            <ChartLegend
              content={<ChartLegendContent  />}
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
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
export default DoubleLineChart;
