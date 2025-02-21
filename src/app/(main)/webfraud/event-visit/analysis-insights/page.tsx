"use client"
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import ResizableTable from '@/components/mf/TableComponent';
import HeaderRow from '../../components/HeaderRow';
import { onExpand, downloadURI, handleExportData } from '@/lib/utils';
import { useState,useCallback,useRef } from 'react';
import domToImage from "dom-to-image";
import PieCharts from '../../components/PieChart';
import { ChartConfig } from '@/components/ui/chart';
import DynamicBarChart from '../../components/DynamicBarChart';
import DonutChart from '../../components/DonutChart';
import HorizontalVerticalBarChart from '../../components/HorizontalVerticalBarChart';
import DoubleLineChart from '../../components/DoubleLineChart';
import StackedBarChart from '../../components/stackedBarChart'

interface ColumnUser {
    title: string,
    key: keyof UserData,
  }
  interface UserData {
    "Device Signature": string;
    "Publisher Name": string;
    "Sub Publisher": string;
    "Visit": number;
  }
  const RepeatUser: ColumnUser[] = [
    { title: "Device Signature", key: "Device Signature"},
    { title: "Publisher Name", key: "Publisher Name" },
    { title: "Sub Publisher" , key:  "Sub Publisher" },
    { title: "Visit", key: "Visit" },
  ]
  const RepeatUserData = [
    {
        "Device Signature":"d512f0db04d3593dd16fb7920ea5357b",
        "Publisher Name":"Google Discovery",
        "Sub Publisher":"CPC",
         "Visit":50,  
    },
    {
        "Device Signature":"bcc2f0db04d3593dd16fb7920ea5357f",
        "Publisher Name":"Google Search",
        "Sub Publisher":"CPC",
         "Visit":14,  
    },
    {
        "Device Signature":"6d34f0db04d3593dd16fb7920ea53574",
        "Publisher Name":"Google Search",
        "Sub Publisher":"PG",
         "Visit":12,  
    },
    {
        "Device Signature":"8bf12f0db04d3593dd16fb7920ea53570",
        "Publisher Name":"Google Discovery",
        "Sub Publisher":"CPC",
         "Visit":12,  
    },
    {
        "Device Signature":"6dggf0db04d3593dd16fb7920ea5357z",
        "Publisher Name":"Google Search",
        "Sub Publisher":"CPC",
         "Visit":10,  
    },
    {
        "Device Signature":"4fghy0db04d3593dd16fb7920ea53571",
        "Publisher Name":"Google Search",
        "Sub Publisher":"PG",
         "Visit":10,  
    },
]
const chartDataPieChart = [
    { label: "Desktop", visitors: 2.0, fill: "var(--color-Desktop)" },
    { label: "Mobile", visitors: 5.9, fill: "var(--color-Mobile)" },
    
  ]
  
  const chartConfigPiechart = {
    visitors: {
      label: "Visitors",
      color:"#000"
    },
    Desktop: {
      label: "Desktop",
      color: "hsl(var(--chart-1))",
    },
    Mobile: {
      label: "Mobile",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig

  const chartDataIpReport = [
    { label: "1", "Total Event": 1, Visit: 60 },
    { label: "2", "Total Event": 18, Visit: 50 },
    { label: "3", "Total Event": 16, Visit: 40 },
    { label: "4", "Total Event": 9, Visit: 80 },
    { label: "5", "Total Event": 12, Visit: 90 },
    { label: "6", "Total Event": 1, Visit: 20 },
  ]

  const chartConfigIpReport = {
    "Total Event": {
      label: "Total Visit",
      color: "hsl(var(--chart-3))",
    },
    Visit: {
      label: "Visit",
      color: "hsl(var(--chart-4))",
    },
  }

  const chartDataServerFarm =[
    {label:"HC192",Mobile:82, Desktop:18},
    {label:"HC128",Mobile:99, Desktop:1},
    {label:"HC72",Mobile:80, Desktop:20},
    {label:"HC9",Mobile:94, Desktop:6},
    {label:"HC3",Mobile:98, Desktop:2},
    {label:"HC1",Mobile:96, Desktop:4}, 
  ]

  const chartConfigServerFarm = {
    Mobile: {
        label:"Mobile" ,
        color: "hsl(var(--chart-2))",
      },
      Desktop: {
        label: "Desktop",
        color: "hsl(var(--chart-1))",
      },
  }
  const chartDataVPN= [
    { label: "DCH",  percentage: 93, fill: "hsl(var(--chart-1))" },
    { label: "SES",  percentage: 4, fill: "hsl(var(--chart-2)" },
    { label: "VPN",  percentage: 3, fill: "hsl(var(--chart-3))" },

  ]
  
  const chartConfigVPN = {
    visitors: {
      label: "Visitors",
      color:"#000"
    },
    DCH: {
      label: "DCH",
      color: "hsl(var(--chart-1))",
    },
    SES: {
      label: " SES ",
      color: "hsl(var(--chart-2))",
    },
    VPN: {
      label: "VPN",
      color: "hsl(var(--chart-3))",
    },
  }
  const DataInvalidGeo = [
    { label: "US", "Invalid Geo": 65, fill: "var(--color-FR)" },
    { label: "IN", "Invalid Geo": 15, fill: "var(--color-Others)" },
    { label: "AR", "Invalid Geo": 12, fill: "var(--color-AR)" },
    { label: "Others", "Invalid Geo": 9, fill: "var(--color-IN)" },
    { label: "FR", "Invalid Geo": 5, fill: "var(--color-US)" },
  ]
  const ConfigInvalidGeo = {
    visitors: {
      label: "Visitors",
      color:"#000"
    },
    US: {
      label: "US",
      color: "hsl(var(--chart-1))",
    },
    IN: {
      label: "IN",
      color: "hsl(var(--chart-2))",
    },
    AR: {
      label: "AR",
      color: "hsl(var(--chart-3))",
    },
    Others: {
      label: "Others",
      color: "hsl(var(--chart-4))",
    },
    FR: {
      label: "FR",
      color: "hsl(var(--chart-5))",
    },
  } satisfies ChartConfig
  
  const chartDataPopUnder = [
    { label: "M1", Standard: 45, DemandGen: 80 },
    { label: "M2", Standard: 0, DemandGen: 20 },
    { label: "M3", Standard: 0, DemandGen: 12 },
    { label: "M4", Standard: 0, DemandGen: 19 },
    { label: "M5", Standard: 0, DemandGen: 13 },
    { label: "M6", Standard: 14, DemandGen: 14 },
  ]
  
  const chartConfigPopUnder = {
    Standard: {
      label: "Standard",
      color: "hsl(var(--chart-1))",
    },
    DemandGen: {
      label: "DemandGen",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig

  const chartDataWindow = [
    { label: "NO.393,18", desktop: 18, mobile: 80 },
    { label: "NO.456,23", desktop: 30, mobile: 20 },
    { label: "NO. 678,90", desktop: 23, mobile: 12 },
    { label: "NO.789,13", desktop: 73, mobile: 19 },
    { label: "NO.543,10", desktop: 20, mobile: 13 },
    { label: "NO. 234,11", desktop: 21, mobile: 14 },
  ]
  const chartConfigWindow = {
    desktop: {
      label: "Desktop",
      color: "hsl(var(--chart-1))",
    },
    mobile: {
      label: "Mobile",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig
  const yAxisConfig = {
    dataKey: "label", // Assuming you want to use 'label' as the key for the Y-Axis

  };

   const InformSuspicous =
   [
    {
      title:"Mouse Movement: FALSE" ,
      desc:"User has not Interacted with the website."
    },
    {
      title:"Touch Support: FALSE",
      desc:"User has not Interacted with the website.",
    },
    {
      title:"HasFocus: FALSE",
      desc:"Page is not Opening in the Active Tab",
    },
   ]

  const InformPopUnder =
  [
    {
      title:"HasFocus: FALSE",
      desc:"Page is not Opening in the Active Tab",
    },
   {
    title:"17%",
    desc:"Height & Width of the browser window is small",
  },
   {
    title:"Time Spent On Page: 0 sec",
    desc:"User has not Interacted with the website." 
  },
   {
    title:"Slide/ Scroll / Touch: FALSE",
    desc:"User has not Interacted with the website."
   }
  ]

 const InformWindow =
   [
    {
      title:"HasFocus: FALSE",
      desc:"Page is not Opening in the Active Tab",
    },
    {
      title:"Has Iframe: 0x0",
      desc:"Height & Width of the browser window is small",
    },
    {
      title:"Time Spent On Page: 0 sec",
      desc:"User has not Interacted with the website." 
    },
     {
      title:"Slide/ Scroll / Touch: FALSE",
      desc:"User has not Interacted with the website."
     }
   ]

 const Analysis_insights = () => {
     const cardRefs = useRef<HTMLElement[]>([]);
      const [expandedCard, setExpandedCard] = useState<number | null>(null);

     const onExport = useCallback(
        async (s: string, title: string, index: number) => {
          console.log("onExport function called", { s, title, index });
          if (!cardRefs.current[index]) return;
          const ref = cardRefs.current[index];
    
          if (!ref) return;
          switch (s) {
            case "png":
              const screenshot = await domToImage.toPng(ref);
              downloadURI(screenshot, title + ".png");
              break;
            default:
          }
        },
        [cardRefs] // Include `cardRefs` as a dependency here
      );    
         const handleExpand = (index: number) => {
           onExpand(index, cardRefs, expandedCard, setExpandedCard);
         };      
  return (
    <div className='grid gap-2'>
    <div className="gap-1 w-full">
    <div className='w-full bg-gray-200 text-sub-header font-semibold grid justify-items-center sm:text-body p-2'>Invalid Traffic(SIVT)</div>
    <div className=" grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2  sm:grid-cols-1 w-full gap-2 min-h-[250px] lg:min-h-[280px] xl:min-h-[200px]">
    <Card  ref={(el) => (cardRefs.current[0] = el!)} className='p-2'>
    <HeaderRow
            title="Repeated User: 8%"
          //  handleExport={handleExportRepeatedUser}
            onExport={() => onExport("png", "Repeated User: 8%", 0)}
            onExpand={() => handleExpand(0)}
            isRadioButton={false}
            isSelect={false}
          />
    <ResizableTable
           isPaginated={false}
            columns={RepeatUser}
            data={RepeatUserData}
            isLoading={false}
            headerColor="#DCDCDC"
            height={300}
            isEdit={false}
            isSearchable
          />
    </Card>
    <Card  ref={(el) => (cardRefs.current[1] = el!)} className='p-2'>
        <PieCharts
         chartData={chartDataPieChart}
         chartConfig={chartConfigPiechart}
         title="Suspicious Behaviour: 4%"
        // handleExport={handleExportPieChart}
         onExport={() => onExport("png", "Suspicious Behaviour %", 1)}
         onExpand={() => handleExpand(1)}
         isSelect={false}
         piechartitle ="Bot Behaviour %"
         InformCard={InformSuspicous}
         
          />
    </Card>
    <Card  ref={(el) => (cardRefs.current[2] = el!)}>
        <CardContent className='overflow-x-auto scrollbar'>
        <DynamicBarChart
        data={chartDataIpReport}
        config={chartConfigIpReport}
        title="IP Repeat: 7%"
        isSelect={false}
        isRadioButton={false}
       // handleExport={handleExportIpRepeat}
        onExport={() => onExport("png", "Ip Repeat", 2)}
        onExpand={() => handleExpand(2)}
        isHorizontal={true}
        dynamicTitle="Repeat IPs"
        formatterType="number"  
         />
        </CardContent>
    </Card>
    <Card  ref={(el) => (cardRefs.current[3] = el!)}>
        <CardContent className='overflow-x-auto scrollbar'>
        <DynamicBarChart
        data={chartDataServerFarm}
        config={chartConfigServerFarm}
        title="Server Farm: 3%"
        isSelect={false}
        isRadioButton={false}
       // handleExport={handleExportServerFarm}
        onExport={() => onExport("png", "Server Farm", 3)}
        onExpand={() => handleExpand(3)}
        isHorizontal={true}
        dynamicTitle="Hardware Concurrency %"
        formatterType="percentage"  
        
        />
        </CardContent>
    </Card>
    </div>
    </div>
    <div className="gap-1 w-full">
    <div className='w-full bg-gray-200 text-sub-header font-semibold grid justify-items-center sm:text-body p-2'>Compliance Issues</div>
    <div className=" grid grid-cols-1 lg:grid-cols-3 md:grid-cols-3  sm:grid-cols-1 w-full gap-2 min-h-[250px] lg:min-h-[250px] xl:min-h-[200px] ">
    <Card  ref={(el) => (cardRefs.current[3] = el!)} className='p-2 w-full '>
    <DonutChart
                chartData={chartDataVPN}
                chartConfig={chartConfigVPN}
              //  handleExport={handleExportVPN}
                onExport={() => onExport("png", "VPN Proxy", 3)}
                onExpand={() => handleExpand(3)}
                title="VPN Proxy (DCH): 3%"
                DonutTitle = "VPN Proxies %"
                dataKey="percentage"   
                 nameKey="label" 
                 isView={false}
                 isPercentage={false}
                 isLabelist={true}
                 direction="flex-row"
              />
    </Card>
    <Card ref={(el) => (cardRefs.current[4] = el!)} className='p-2 w-full col-span-2' >
     <HorizontalVerticalBarChart
     chartData = {DataInvalidGeo}
     chartConfig={ConfigInvalidGeo}
    // handleExport={handleExportInvalidGeo}
     title="Invalid Geo: 2%"
     onExport={() => onExport("png", "Invalid Geo", 4)}
     onExpand={() => handleExpand(4)}
     BarchartTitle="Invalid Geo %"
     isHorizontal={true}
     formatterType="percentage"  
     isRadioButton={false}
     isSelect={false}
     dataKey ="Invalid Geo"
     />
    </Card>
    </div>
    </div>
    <div className="gap-1 w-full">
    <div className='w-full bg-gray-200 text-sub-header font-semibold grid justify-items-center sm:text-body p-2'>Low Intent User</div>
    <div className=" grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2  sm:grid-cols-1 w-full gap-2 min-h-[250px] lg:min-h-[280px] xl:min-h-[200px]">
    <Card  ref={(el) => (cardRefs.current[5] = el!)} className='p-2 overflow-x-auto scrollbar'>
     <DoubleLineChart
     chartData = {chartDataPopUnder}
     chartConfig={chartConfigPopUnder}
     //handleExport={handleExportInvalidGeo}
     title="Pop Under: 5%"
     onExport={() => onExport("png", "Pop Under", 5)}
     onExpand={() => handleExpand(5)}
     LinechartTitle="Device Type:Moblie"
     isRadioButton={false}
     isSelect={false}
     AxisLabel="Percentage"
     InformCard={InformPopUnder}
     isInformCard={true}
     />
    </Card>
    <Card  ref={(el) => (cardRefs.current[6] = el!)} className='p-2 overflow-x-auto scrollbar '>
     <StackedBarChart
     chartData = {chartDataWindow}
     chartConfig={chartConfigWindow}
    //  handleExport={handleExportWindow}
     title="Imperceptiable Window: 4%"
     onExport={() => onExport("png", "Imperceptiable Window", 6)}
     onExpand={() => handleExpand(6)}
     isRadioButton={false}
     isSelect={false}
     AxisLabel="Percentage"
     InformCard={InformWindow}
     isInformCard={true}
     yAxis={yAxisConfig}
     layoutDirection="flex-col"
     isLegend={true}
     ischangeLegend={false}
     />
    </Card>
    </div>
    </div>
    </div>
  );
}
export default Analysis_insights;