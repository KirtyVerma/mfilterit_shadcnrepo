'use client'
import React, { useState } from 'react'
import KeyValueCard from '../../components/keyvalueCard'
import {
  Card,
  CardContent,
  // CardDescription,
  // CardFooter,
  // CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { LineChartComponent } from '../../components/LineChartComponent'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend, ResponsiveContainer } from "recharts"
import { DynamicBarChart } from '../../components/DynamicBarChart'
import { RadioButtons } from '../../components/RadioButton'
import { Button } from '@/components/ui/button'
import { ChartBarStacked } from '../../components/stackedBarChart'
const Simple_Dashboard = () => {
  const [selectedType, setSelectedType] = useState<string>("visit")

  const visitEventOptions = [
    { value: "visit", label: "Visit" },
    { value: "event", label: "Event" },
  ]

  const handleTypeChange = (value: string) => {
    setSelectedType(value)
    console.log("Selected type:", value)
    // You can perform any other actions here based on the selected value
  }
  const chartDatastaged = [
    { month: "January", desktop: 186, mobile: 500 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 730, mobile: 890 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
    { month: "July", desktop: 251, mobile: 165 },
    { month: "August", desktop: 290, mobile: 185 },
    { month: "September", desktop: 270, mobile: 200 },
    { month: "October", desktop: 310, mobile: 420 },
    { month: "November", desktop: 685, mobile: 210 },
    { month: "December", desktop: 320, mobile: 240 },
  ]

  const chartConfigstaged = {
    desktop: {
      label: "Desktop",
      color: "hsl(var(--chart-1))",
    },
    mobile: {
      label: "Mobile",
      color: "hsl(var(--chart-2))",
    },
  }

  const xAxisConfig = {
    dataKey: "month",
    title: "Months",
    tickFormatter: (value: string) => value.slice(0, 3)
  }

  const yAxisConfig = {
    dataKey: "month",
    title: "Visitors",
    tickFormatter: (value: string) => value
  }


  const cards = [
    {
      title: "Total Traffic",
      leftKey: "Visit",
      leftValue: 5000,
      rightKey: "Event",
      rightValue: 12000,
      backgroundColor: "#f8fafc",
    },
    {
      title: "Valid Traffic",
      leftKey: "Visit",
      leftValue: 750,
      rightKey: "Event",
      rightValue: 1500,
      backgroundColor: "#eef2ff",
    },
    {
      title: "Invalid Traffic",
      leftKey: "Visit",
      leftValue: 3000,
      rightKey: "Event",
      rightValue: 4500,
      backgroundColor: "pink",
    },
  ];

  const chartDataLine = [
    { month: "January", Total_Traffic: 10, Invalid_Traffic: 5, },
    { month: "February", Total_Traffic: 20, Invalid_Traffic: 15, },
    { month: "March", Total_Traffic: 30, Invalid_Traffic: 25, },
    { month: "April", Total_Traffic: 40, Invalid_Traffic: 35, },
    { month: "May", Total_Traffic: 50, Invalid_Traffic: 45, },
    { month: "June", Total_Traffic: 60, Invalid_Traffic: 55, },
    { month: "july", Total_Traffic: 10, Invalid_Traffic: 5, },
    { month: "aug", Total_Traffic: 20, Invalid_Traffic: 15, },
    { month: "Sept", Total_Traffic: 30, Invalid_Traffic: 25, },
    { month: "Oct", Total_Traffic: 40, Invalid_Traffic: 35, },
    { month: "Nov", Total_Traffic: 50, Invalid_Traffic: 45, },
    { month: "Dec", Total_Traffic: 60, Invalid_Traffic: 55, },
  ];
  const chartDataLine2 = [
    { month: "01", Invalid_Traffic: 5, },
    { month: "02", Invalid_Traffic: 15, },
    { month: "03", Invalid_Traffic: 8, },
    { month: "04", Invalid_Traffic: 35, },
    { month: "05", Invalid_Traffic: 16, },
    { month: "06", Invalid_Traffic: 55, },

  ];
  const chartConfigLine = {
    Total_Traffic: {
      label: "Total Traffic",
      color: "hsl(var(--chart-1))",
    },
    Invalid_Traffic: {
      label: "Invalid Traffic",
      color: "hsl(var(--chart-2))",
    },

  };
  const chartConfigLine2 = {

    Invalid_Traffic: {
      label: "Invalid Traffic",
      color: "hsl(var(--chart-2))",
    },

  };

  const chartData = [
    { label: "Geo Fraud", Visit: 186, Event: 80 },
    { label: "Behavior Fraud", Visit: 305, Event: 200 },
    { label: "Pop Under", Visit: 237, Event: 120 },

  ]

  const chartConfig = {
    Visit: {
      label: "Visit",
      color: "hsl(var(--chart-1))",
    },
    Event: {
      label: "Event",
      color: "hsl(var(--chart-2))",
    },
  }

  const StagedchartData = [
    { category: "Desktop", Q1: 186, Q2: 305, Q3: 237, Q4: 173 },
    { category: "Mobile", Q1: 80, Q2: 200, Q3: 120, Q4: 190 },
    { category: "Tablet", Q1: 50, Q2: 100, Q3: 80, Q4: 60 },
  ]

  const StagedchartConfig = {
    Q1: {
      label: "Q1",
      color: "hsl(var(--chart-1))",
    },
    Q2: {
      label: "Q2",
      color: "hsl(var(--chart-2))",
    },
    Q3: {
      label: "Q3",
      color: "hsl(var(--chart-3))",
    },
    Q4: {
      label: "Q4",
      color: "hsl(var(--chart-4))",
    },
  }

  return (
    <div className="grid gap-4 p-1">

      <div className="grid grid-cols-12 gap-4">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`col-span-12 sm:col-span-12 md:${index === cards.length - 1 ? "col-span-12" : "col-span-6"} 
          } lg:col-span-4`}
          >
            <KeyValueCard
              title={card.title}
              leftKey={card.leftKey}
              leftValue={card.leftValue}
              rightKey={card.rightKey}
              rightValue={card.rightValue}
              backgroundColor={card.backgroundColor}
            />
          </div>
        ))}
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-12 gap-2">
        <Card className="col-span-6 h-96 shadow-md rounded-none bg-white">
          <div className='flex justify-between p-1'>
            <CardTitle className='text-sub-header'>Total Traffic vs Invalid Traffic</CardTitle>
            <CardTitle className="flex space-x-4">
              <RadioButtons
                // title="Select Type"
                options={visitEventOptions}
                defaultValue={selectedType}
                onValueChange={handleTypeChange}
              />


            </CardTitle>
          </div>
          <CardContent className="w-full h-[355px] overflow-x-auto overflow-y-hidden scrollbar">
            <LineChartComponent
              data={chartDataLine}
              config={chartConfigLine}
              xAxisTitle="Month"
              yAxisTitle="Values"
              hoverEnabled={true}
            />
          </CardContent>
        </Card>

        <Card className="col-span-6 h-96 shadow-md rounded-none bg-white">
          <div className='flex justify-between p-1'>
            <CardTitle>Fraud Categories</CardTitle>
            <CardTitle>
              <RadioButtons
                // title="Select Type"
                options={visitEventOptions}
                defaultValue={selectedType}
                onValueChange={handleTypeChange}
              />
            </CardTitle>
          </div>
          <CardContent className="w-full h-[355px] overflow-x-auto overflow-y-hidden scrollbar">
            <DynamicBarChart
              data={chartData}
              config={chartConfig}
              xAxisTitle="Fraud Types"
              yAxisTitle=""
              isHorizontal={false}
            />
          </CardContent>
        </Card>


      </div>
      <Card className="grid grid-cols-12 h-96 shadow-md rounded-none bg-white gap-4 overflow-x-auto overflow-y-auto scrollbar ">
        <ChartBarStacked
          data={chartDatastaged}
          chartConfig={chartConfigstaged}
          xAxis={xAxisConfig}
          yAxis={yAxisConfig}
          isHorizontal={false}
        />
      </Card>
      <Card className="grid grid-cols-12 h-96 shadow-md rounded-none bg-white gap-4">
        <div className="col-span-6 h-96">
          <div className="flex justify-between p-1">
            <CardTitle>Fraud Categories</CardTitle>
            <CardTitle>
              <RadioButtons
                options={visitEventOptions}
                defaultValue={selectedType}
                onValueChange={handleTypeChange}
              />
            </CardTitle>
          </div>
          <CardContent className="w-full h-[355px] overflow-x-auto overflow-y-hidden scrollbar">
            <DynamicBarChart
              data={chartData}
              config={chartConfig}
              xAxisTitle="Fraud Types"
              yAxisTitle=""
              isHorizontal={true}
            />
          </CardContent>
        </div>
        <div className="col-span-6 h-96">
          <div className='flex justify-between p-1'>
            <CardTitle>Hourly Invalid Traffic</CardTitle>
            <CardTitle className="flex space-x-4">
              <RadioButtons
                // title="Select Type"
                options={visitEventOptions}
                defaultValue={selectedType}
                onValueChange={handleTypeChange}
              />


            </CardTitle>
          </div>
          <CardContent className="w-full h-[355px] overflow-x-auto overflow-y-hidden scrollbar">
            <LineChartComponent
              data={chartDataLine2}
              config={chartConfigLine2}
              xAxisTitle=""
              yAxisTitle=""
              hoverEnabled={true}
            />
          </CardContent>
        </div>
      </Card>



    </div>
  )
}

export default Simple_Dashboard;
// "use client";
// import {
 
//   MFBarChart,
 
// } from "@/components/mf/charts";
// import ResizableTable, { Column } from "@/components/mf/TableComponent";

// const chartConfig = {
//   clean: {
//     label: "Clean",
//     color: "hsl(var(--chart-2))",
//   },
//   fraud: {
//     label: "Fraud",
//     color: "hsl(var(--chart-1))",
//   },
// };

// const chartData = [
//   { month: "January", clean: 186, fraud: 80 },
//   { month: "February", clean: 305, fraud: 200 },
//   { month: "March", clean: 237, fraud: 120 },
//   { month: "April", clean: 73, fraud: 190 },
//   { month: "May", clean: 209, fraud: 130 },
//   { month: "June", clean: 214, fraud: 140 },
// ];

// export default function App() {

//   return (
//     <div className="relative">
//       <div className="container sticky top-0 z-10 flex w-full items-center justify-start gap-2 rounded-md bg-background px-2 py-1">
        
//       </div>
//       <div className="grid grid-cols-3 gap-2 pt-2">
//         <MFBarChart
//           className="col-span-2"
//           title="Monthly Trend"
//           description="January - June 2024"
//           chartConfig={chartConfig}
//           data={chartData}
//           onDropdownClick={console.log}
//           xAxisProps={{
//             dataKey: "month",
//             tickLine: false,
//             axisLine: false,
//             tickMargin: 10,
//             tickFormatter: (v) => v.slice(0, 3),
//           }}
//           yAxis
//         />
      
//       </div>
     
//     </div>
//   );
// }
// "use client"

// import { TrendingUp } from "lucide-react"
// import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// const chartData = [
//   { month: "January", desktop: 186, mobile: 80, ta: 50 },
//   { month: "February", desktop: 305, mobile: 200, ta: 75 },
//   { month: "March", desktop: 237, mobile: 120, ta: 90 },
//   { month: "April", desktop: 73, mobile: 190, ta: 60 },
//   { month: "May", desktop: 209, mobile: 130, ta: 85 },
//   { month: "June", desktop: 214, mobile: 140, ta: 100 },
// ]

// const generateChartConfig = (data: typeof chartData): ChartConfig => {
//   const keys = Object.keys(data[0]).filter((key) => key !== "month")
//   const colors = [
//     "hsl(var(--chart-1))",
//     "hsl(var(--chart-2))",
//     "hsl(var(--chart-3))",
//     "hsl(var(--chart-4))",
//     "hsl(var(--chart-5))",
//     // Add more colors if needed
//   ]

//   return keys.reduce((config, key, index) => {
//     config[key] = {
//       label: key.charAt(0).toUpperCase() + key.slice(1),
//       color: colors[index % colors.length],
//     }
//     return config
//   }, {} as ChartConfig)
// }

// const chartConfig = generateChartConfig(chartData)

// const Simple_Dashboard=()=> {
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Bar Chart - Multiple</CardTitle>
//         <CardDescription>January - June 2024</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <ChartContainer config={chartConfig}>
//           <BarChart accessibilityLayer data={chartData}>
//             <CartesianGrid vertical={false} />
//             <XAxis
//               dataKey="month"
//               tickLine={false}
//               tickMargin={10}
//               axisLine={false}
//               tickFormatter={(value) => value.slice(0, 3)}
//             />
//             <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
//             {Object.keys(chartConfig).map((key) => (
//               <Bar key={key} dataKey={key} fill={`var(--color-${key})`} radius={4} />
//             ))}
//           </BarChart>
//         </ChartContainer>
//       </CardContent>
//       <CardFooter className="flex-col items-start gap-2 text-sm">
//         <div className="flex gap-2 font-medium leading-none">
//           Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
//         </div>
//         <div className="leading-none text-muted-foreground">Showing total visitors for the last 6 months</div>
//       </CardFooter>
//     </Card>
//   )
// }
// export default Simple_Dashboard;