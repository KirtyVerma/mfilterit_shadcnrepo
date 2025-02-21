"use client";
import {
  MFAreaChart,
  MFBarChart,
  MFLineChart,
  MFPieChart,
  MFStackedBarChart,
} from "@/components/mf/charts";
import React from "react";
import { Filter } from "@/components/mf/Filters";

const chartConfig = {
  clean: {
    label: "Clean",
    color: "hsl(var(--chart-2))",
  },
  fraud: {
    label: "Fraud",
    color: "hsl(var(--chart-1))",
  },
};

const chartData = [
  { month: "January", clean: 186, fraud: 80 },
  { month: "February", clean: 305, fraud: 200 },
  { month: "March", clean: 237, fraud: 120 },
  { month: "April", clean: 73, fraud: 190 },
  { month: "May", clean: 209, fraud: 130 },
  { month: "June", clean: 214, fraud: 140 },
];

export default function App() {
  return (
    <div className="relative">
      <div className="container sticky top-0 z-10 flex w-full items-center justify-start gap-2 rounded-md bg-background px-2 py-1">
        <Filter />
      </div>
      <div className="grid grid-cols-3 gap-2 pt-2">
        <MFBarChart
          className="col-span-2"
          title="Monthly Trend"
          description="January - June 2024"
          chartConfig={chartConfig}
          data={chartData}
          onDropdownClick={console.log}
          xAxisProps={{
            dataKey: "month",
            tickLine: false,
            axisLine: false,
            tickMargin: 10,
            tickFormatter: (v) => v.slice(0, 3),
          }}
          yAxis
        />
        <MFPieChart />
        <MFStackedBarChart />
        <MFAreaChart />
        <MFLineChart />
      </div>
    </div>
  );
}
