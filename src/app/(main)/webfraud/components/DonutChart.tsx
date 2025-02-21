"use client";

import * as React from "react";
import { Label, Pie, PieChart, ResponsiveContainer,LabelList } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { formatNumber } from "@/lib/utils";
import HeaderRow from "./HeaderRow";
import { Loader2 } from "lucide-react";

interface DonutChartProps {
  chartData?: { label?: string; [key: string]: string | number | undefined }[];
  dataKey: string;  // Dynamic key for chart data
  nameKey?: string;  // Dynamic key for name
  chartConfig?: {
    [key: string]: {
      label: string;
      color: string;
    };
  };
  isLoading?:boolean;
  isView:boolean;
  handleExport?: () => void;
  onExpand: () => void;
  onExport?: (s: string, title: string, index: number) => void;
  visitEventOptions?: { value: string; label: string }[];
  handleTypeChange?: (value: string) => void;
  selectedType?: string;
  title?: string;
  isSelect?: boolean;
  isRadioButton?: boolean;
  selectoptions?: string[];
  placeholder?: string;
  DonutTitle?:string;
  isPercentage?:boolean;
  isLabelist?:boolean;
  direction?:string;
}

const DonutChart: React.FC<DonutChartProps> = ({
  chartData,
  chartConfig,
  handleTypeChange,
  visitEventOptions,
  selectedType,
  selectoptions = [],
  handleExport,
  onExport,
  onExpand,
  title,
  isSelect = false,
  isRadioButton = false,
  placeholder = "",
  dataKey,
  nameKey,
  DonutTitle,
  isView = true,
  isPercentage=true,
  isLabelist=false,
  direction="flex-col",
  isLoading,
}) => {
  const totalVisitors = React.useMemo(() => {
    return chartData?.reduce((acc, curr) => {
      const visit = Number(curr.visit);
      return !isNaN(visit) ? acc + visit : acc; 
    }, 0);
  }, [chartData]);

  const formatVisitors = React.useMemo(() => (value: number) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}k`;
    }
    return value.toString();
  }, []);

  const [innerRadius, setInnerRadius] = React.useState(60);
  const [outerRadius, setOuterRadius] = React.useState(70);
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setInnerRadius(40);
      } else if (window.innerWidth >= 640 && window.innerWidth <= 1024) {
        setInnerRadius(60);
      } else {
        setInnerRadius(50);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setOuterRadius(60); // Mobile size
      } else if (window.innerWidth >= 640 && window.innerWidth < 1024) {
        setOuterRadius(70); // Tablet size
      } else if (window.innerWidth >= 1024 && window.innerWidth < 1280) {
        setOuterRadius(70); // Default for medium to large screens
      } else {
        setOuterRadius(80); // XL size
      }
    };
    
    window.addEventListener("resize", handleResize);
    handleResize();
  
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  if (!chartData || chartData.length === 0) {
    return <div>No data available</div>;
  }

  return (
    <Card className="flex flex-wrap justify-between border-none w-full ">
      
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
        selectoptions={selectoptions}
        placeholder={placeholder}

      />
     
       <CardHeader className=" items-center w-full t-0">
        <CardTitle className="text-body  p-0 font-semibold">{DonutTitle}</CardTitle>
      </CardHeader>
      {isLoading ?(
         <div className="flex items-center justify-center min-h-full">
                    <Loader2 className=" h-8 w-8 animate-spin text-primary" />
               </div>
      ):(
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 w-full h-[200px]   ">
          {chartConfig ? ( 
            <ChartContainer
              config={chartConfig}
              style={{width:"100%", height:"100%"}}
              className="flex justify-start items-center mt-0"
            >
               <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                  <Pie
                    data={chartData}
                    dataKey= {dataKey}
                    nameKey={nameKey} 
                    innerRadius={innerRadius}
                    outerRadius={outerRadius}
                    strokeWidth={10}
                  >
                    {isLabelist &&(
                     <LabelList
                      dataKey={dataKey}
                      position="inside"
                      style={{ fontSize: '8px', fill: '#000', fontWeight: 'bold' }}
                       stroke="none"
                      formatter={(value: number) => `${value}%`} 
                    />
                  )}
                    <Label
  content={({ viewBox }) => {
    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
      if (totalVisitors && totalVisitors > 0) {
        return (
          <text
            x={viewBox.cx}
            y={viewBox.cy}
            textAnchor="middle"
            dominantBaseline="middle"
          >
            <tspan
              x={viewBox.cx}
              y={viewBox.cy}
              className="fill-foreground lg:text-2xl md:text-text-body font-bold sm:text-body"
            >
              {formatNumber(totalVisitors)}
            </tspan>
          </text>
        );
      }
      return null;
    }
    return null;
  }}
/>
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <div>No chart configuration available</div>
          )}
          {/* Legend Container */}
          <div className="flex flex-col justify-end sm:col-span-1 md:col-span-1 lg:col-span-1 sm:text-body border-none mt-7 ">
            <div className={`flex ${direction} md:${direction} sm:${direction}  lg:flex-col xl:flex-col mt-1`}>
              {chartData?.map((item) => (
                <div key={item.label} className="flex items-center gap-2 p-2 text-sub-header">
                  {/* Colored rectangle for each label */}
                  <span
                    className="inline-block w-4 h-4 rounded-full border-r p-2"
                    style={{ backgroundColor: item?.fill }}
                  />
                  <p className="text-small-font">
                    {String(item?.label).charAt(0) + String(item?.label).slice(1)} 
                    {isPercentage &&(
                    <span>
                    -{" "}
                    {formatVisitors(Number(item?.visit))} {item?.percentage}
                    </span>
                  )}
                  </p>
                </div>
              ))}
            </div>
            {isView &&(
            <div className="text-small-font text-right">
              <a href="#" className="text-blue-500 hover:text-blue-700 cursor-pointer underline">View All</a>
            </div>
            )}
          </div>
        </div>
      </CardContent>
      )}
    </Card>
  );
};

export default DonutChart;
