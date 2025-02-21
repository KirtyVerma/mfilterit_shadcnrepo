"use client"

import { Pie, PieChart,LabelList } from "recharts"
import HeaderRow from "./HeaderRow";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart"
import { InformationCard } from "./InformationCard";

interface PieChartProps {
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
    handleExport?: () => void;
    onExpand: () => void;
    onExport?: (s: string, title: string, index: number) => void;
    title?: string;
    isSelect?: boolean;
    isRadioButton?: boolean;
    piechartitle?:string;
}

const PieCharts: React.FC<PieChartProps> = ({ 
  chartData, 
  chartConfig,
  handleExport,
  onExport,
  onExpand,
  piechartitle,
  title ,
  isSelect= false,
  isRadioButton =false,
  InformCard=[],
 }) => {
  return (
    <Card className="flex flex-col border-none">
         <HeaderRow
        title={title}
        onExpand={onExpand}
         handleExport={handleExport}
        isRadioButton={isRadioButton}
        isSelect={isSelect}
        onExport={onExport}
       />
        <CardHeader className="items-center pb-0">
        <CardTitle className="text-body font-semibold">{piechartitle}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
      <div className="flex flex-col lg:flex-row md:flex-col space-y-4 md:space-y-0">
      <div className="flex-1 px-4 flex flex-col lg:flex-col md:flex-row  xl:mt-0 ">
      {InformCard?.map((item, index) => (
            <InformationCard
              key={index}
              InformTitle={item.title}
              informDescription={item.desc}
            />
          ))}
      </div>
      <div className="flex-1 mx-auto aspect-square">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square xl:h-[300px] h-[250px] sm:h-[200px] lg:h-[220px] lg:mt-3 sm:mt-3 max-w-full max-h-full"
          style={{height:"100%"}}
        >
          <PieChart>
            <Pie data={chartData} dataKey="visitors" >
            <LabelList
            dataKey="visitors"  // Use 'visitors' as the dataKey
            style={{ fontSize: '12px', fill: '#000',  fontWeight:'bold'}}
            stroke="none"
             formatter={(value: number) => `${value}%`}  // Format as a percentage
              />
            </Pie>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="label"  hideLabel/>}
            />
            <ChartLegend
              content={<ChartLegendContent nameKey="label" />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
        </div>
        </div>
      </CardContent>
    </Card>
  )
}
export default PieCharts;
