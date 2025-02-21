"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend, ResponsiveContainer,LabelList } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import HeaderRow from "./HeaderRow";
import { Card,
      CardContent,
      CardHeader,
      CardTitle,
 } from "@/components/ui/card";

interface data {
  label: string;
  [key: string]: string | number;
}

interface config {
  [key: string]: {
    label: string;
    color: string;
  };
}

interface DynamicBarChartProps {
  data: data[];
  config: config;
  xAxisTitle?: string;
  yAxisTitle?: string;
  isHorizontal: boolean;
  title?:string;
  handleExport?: () => void;
  onExpand: () => void;
  onExport?: (s: string, title: string, index: number) => void;
  isRadioButton:boolean;
  isSelect:boolean;
  dynamicTitle?:string
  formatterType?:"number" | "percentage"
}

export function DynamicBarChart({ 
  data, 
  config, 
  xAxisTitle, 
  yAxisTitle, 
  isHorizontal = false,
  handleExport,
  onExport,
  onExpand,
  isSelect,
  isRadioButton, 
  title,
  dynamicTitle,
  formatterType="number",

 }: DynamicBarChartProps) {
  const CustomSquareLegend = ({ payload }: { payload?: any[] }) => {
    if (!payload) return null;
  
    return (
      <div className="flex flex-wrap justify-center items-center gap-4 mt-4">
        {payload.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center gap-2">
            <div
              style={{
                width: 8,
                height: 8,
                backgroundColor: entry.color,
                borderRadius: 2,
              }}
            ></div>
            <span className="text-small-font">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };
  
  const chartWidth = (data ? data.length : 0) * 70;
  const dataKeys = Object.keys(config || {});
  
  const formatLabel = (value: number) => {
    if (formatterType === "percentage") {
      return `${value}%`;  // Format as percentage
    }
    return `${value}`;  // Format as number
  };
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
        <CardTitle className="text-body font-semibold">{dynamicTitle}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
    <ChartContainer config={config} style={{ height: "100%" }}>
  <ResponsiveContainer>
    <BarChart
      data={data}
      layout={isHorizontal ? "vertical" : "horizontal"}
      width={chartWidth}
      height={200}
      >

      <CartesianGrid strokeDasharray="3 3" />
      {isHorizontal ? (
        <XAxis className="text-small-font"
          type="number"
          label={{ value: xAxisTitle, position: "insideBottom", offset: -5 }}
        />
      ) : (
        <XAxis className="text-small-font"
          dataKey="label"
          label={{ value: xAxisTitle, position: "insideBottom", offset: -5 , }}
        />
      )}
      {isHorizontal ? (
        <YAxis className="mr-10 text-small-font"
          type="category"
          dataKey="label"
          label={{
            value: yAxisTitle,
            angle: -90,
            position: "insideLeft",
            offset: 0
          }}
          interval={0}
        />
      ) : (
        <YAxis className="text-small-font"
          label={{
            value: yAxisTitle,
            angle: -90,
            position: "insideLeft",
          }}
        />
      )}
      <ChartTooltip content={<ChartTooltipContent />} />
      <Legend content={(props) => <CustomSquareLegend {...props} />}
       />
      {dataKeys.map((key) => (
                <Bar key={key} dataKey={key} fill={config[key].color} radius={0}>
                  {/* Add LabelList here to show labels on the bars */}
                  <LabelList
                    dataKey={key} 
                    position="right" 
                    style={{ fontSize: "8px", fill: "#000" }}
                    formatter={formatLabel}  
                  />
                </Bar>
              ))}
    </BarChart>
  </ResponsiveContainer>
</ChartContainer>
</CardContent>
</Card>
  );
}
export default DynamicBarChart;
