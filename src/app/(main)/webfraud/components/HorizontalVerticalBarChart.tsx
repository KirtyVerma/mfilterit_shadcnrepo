"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartLegend,
  ChartLegendContent,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import HeaderRow from "./HeaderRow";

interface chartData {
  label: string;
  [key: string]: string | number;
}

interface chartconfig {
  [key: string]: {
    label: string;
    color: string;
  };
}

interface HorizontalBarChartProps {
  chartData: chartData[];
  chartConfig: chartconfig;
  xAxisTitle?: string;
  yAxisTitle?: string;
  isHorizontal: boolean;
  title?: string;
  handleExport?: () => void;
  onExpand: () => void;
  onExport?: (s: string, title: string, index: number) => void;
  isRadioButton: boolean;
  isSelect: boolean;
  BarchartTitle?: string;
  formatterType?: "number" | "percentage";
  dataKey?: string;
}

const HorizontalVerticalBarChart: React.FC<HorizontalBarChartProps> = ({
  chartData,
  chartConfig,
  xAxisTitle,
  yAxisTitle,
  isHorizontal = false,
  handleExport,
  onExport,
  onExpand,
  isSelect,
  isRadioButton,
  title,
  BarchartTitle,
  formatterType = "number",
  dataKey
}) => {
  return (
    <Card className="border-none">
      <HeaderRow
        title={title}
        onExpand={onExpand}
        handleExport={handleExport}
        isRadioButton={isRadioButton}
        isSelect={isSelect}
        onExport={onExport}
      />
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-body font-semibold">{BarchartTitle}</CardTitle>
      </CardHeader>
      <CardContent  className="h-[220px]">
        <ChartContainer config={chartConfig}  style={{ height: "100%",width: "100%" }}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout={isHorizontal ? "vertical" : "horizontal"} // Toggle between vertical and horizontal chart
            margin={{
              left: 0,
            }}
            barSize={12}
            barGap={1} // Reduce gap between bars in the same group
            barCategoryGap="2%" // 
          >
            {/* Conditionally set axis based on orientation */}
            {isHorizontal ? (
              <>
                <YAxis
                  dataKey="label"
                  type="category"
                  tickLine={false}
                  tickMargin={3}
                  axisLine={false}
                  tickFormatter={(value) =>
                  chartConfig[value as keyof typeof chartConfig]?.label
                  }
                />
                <XAxis 
                  dataKey={dataKey}
                  axisLine={true}
                  type="number"  // Use a numerical axis for horizontal layout
                />
              </>
            ) : (
              <>
                <XAxis
                  dataKey="label"
                  type="category"
                  tickLine={false}
                  tickMargin={3}
                  axisLine={false}
                  tickFormatter={(value) =>
                    chartConfig[value as keyof typeof chartConfig]?.label
                  }
                />
                <YAxis
                  dataKey={dataKey}
                  axisLine={true}
                  type="number" // Use a numerical axis for vertical layout
                />
              </>
            )}
            
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <ChartLegend
              content={<ChartLegendContent />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />

            <Bar
              dataKey={dataKey}
              layout={isHorizontal ? "vertical" : "horizontal"} // Bar layout based on the orientation
              radius={2}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
export default HorizontalVerticalBarChart;
