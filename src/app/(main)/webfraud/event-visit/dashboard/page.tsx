'use client'
import React, { useEffect, useState} from 'react'
import KeyValueCard from '../../components/keyvalueCard';
import ResizableTable from '../../components/TableComponent';
import DonutChart from '../../components/DonutChart';
import StackedBarWithLine from '../../components/StackedBarwithLine';
import { useCallback, useRef } from "react";
import domToImage from "dom-to-image";
import { ChartConfig } from '@/components/ui/chart';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import HeaderRow from '../../components/HeaderRow';
import StackedBarChart from '../../components/stackedBarChart'
import { onExpand, downloadURI } from '@/lib/utils';
import Endpoint  from '../../common/endpoint';
import { Api_base } from '../../queries/api_base';
import { Loader2 } from 'lucide-react';

// Define the API response type


const chartDataEvent = [
  { label: "Geo Fraud", visit: 170000, percentage: "(20%)", fill: "hsl(var(--chart-1))" },
  { label: "BlackListed Fraud ", visit: 170000, percentage: "(20%)", fill: "hsl(var(--chart-2)" },
  { label: "Pop Under", visit: 80000, percentage: "(10%)", fill: "hsl(var(--chart-3))" },
  { label: "Device Spoofing", visit: 190000, percentage: "(22%)", fill: "hsl(var(--chart-4))" },
  { label: "VPN Proxy", visit: 70000, percentage: "(10%)", fill: "hsl(var(--chart-5))" },
]

const chartConfigEvent = {
 
  GeoFraud: {
    label: "Geo Fraud",
    color: "hsl(var(--chart-1))",
  },
  BlackListedFraud: {
    label: "BlackListed Fraud ",
    color: "hsl(var(--chart-2))",
  },
  PopUnder: {
    label: "Pop Under",
    color: "hsl(var(--chart-3))",
  },
  DeviceSpoofing: {
    label: "Device Spoofing",
    color: "hsl(var(--chart-4))",
  },
  VPNProxy: {
    label: "VPN Proxy",
    color: "hsl(var(--chart-5))",
  },
}

//Top 5 Campaign 
interface ColumnC {
  title: string,
  key: keyof CampaignData;
}
interface CampaignData {
  "Campaign ID": string;
  "Total Visits": number;
  "Invalid Visit %": string;
  "Total Events": number;
  "Invalid Event %": string;
}
const CampaignColumns: ColumnC[] = [
  { title: "Campaign ID", key: "Campaign ID" },
  { title: "Total Visits", key: "Total Visits" },
  { title: "Invalid Visit %", key: "Invalid Visit %" },
  { title: "Total Events", key: "Total Events" },
  { title: "Invalid Event %", key: "Invalid Event %" }
]

//Top 5 Sources
interface ColumnS {
  title: string,
  key: keyof SourceData,
}
interface SourceData {
  "Source": string;
  "Total Visits": number;
  "Invalid Visit %": string;
  "Total Events": number;
  "Invalid Event %": string;
  "Valid Traffic Conv. Rate": string;
  "Invalid Traffic Conv. Rate":string
  page:string;

}
const PublisherColumns: ColumnS[] = [
  { title: "Source", key: "Source" },
  { title: "Total Visits", key: "Total Visits" },
  { title: "Invalid Visit %", key: "Invalid Visit %" },
  { title: "Total Events", key: "Total Events" },
  { title: "Invalid Event %", key: "Invalid Event %" },
  { title: "Valid Traffic Conv. Rate", key: "Valid Traffic Conv. Rate" },
  {title:"Invalid Traffic Conv. Rate",key:"Invalid Traffic Conv. Rate"}
]

//Traffic Trend
interface TrafficTrendData {
  month: string,
  Invalid: number,
  Valid: number,
  "Invalid %": number,
}

const chartDataStack: TrafficTrendData[] = [
  { month: "Jan 01 2025", Invalid: 1860000, Valid: 8000000, "Invalid %": 90 },
  { month: "Jan 02 2025", Invalid: 3050000, Valid: 2000000, "Invalid %": 40 },
  { month: "Jan 03 2025", Invalid: 2370000, Valid: 1200000, "Invalid %": 50 },
  { month: "Jan 04 2025", Invalid: 7300000, Valid: 1900000, "Invalid %": 60 },
  { month: "Jan 05 2025", Invalid: 2090000, Valid: 1300000, "Invalid %": 40 },
  { month: "Jan 06 2025", Invalid: 2140000, Valid: 1400000, "Invalid %": 30 },
  { month: "Jan 07 2025", Invalid: 7300000, Valid: 1900000, "Invalid %": 50 },
  { month: "Jan 08 2025", Invalid: 3050000, Valid: 2000000, "Invalid %": 100 },
  { month: "Jan 09 2025", Invalid: 7300000, Valid: 1900000, "Invalid %": 50 },
  { month: "Jan 10 2025", Invalid: 2090000, Valid: 1300000, "Invalid %": 40 },
  { month: "Jan 11 2025", Invalid: 2140000, Valid: 1400000, "Invalid %": 30 },
  { month: "Jan 12 2025", Invalid: 1860000, Valid: 8000000, "Invalid %": 90 },
]

const chartConfigStack = {
  Invalid: {
    label: "Invalid",
    color: "hsl(var(--chart-1))",
  },
  Valid: {
    label: "Valid",
    color: "hsl(var(--chart-2))",
  },
  "Invalid %": {
    label: "Invalid %",
    color: "#000",
  },
}

const Dashboard = () => {
  const [selectedType, setSelectedType] = useState<string>("visit")
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const cardRefs = useRef<HTMLElement[]>([]);
  const [cards, setCards] = useState<any>(null);
  const [visitcategory, setVisitCategory] = useState<any[]>([]); 
  const [existingvisit, setExistingvisit] = useState<any>([]); 
  const [eventcategory, setEventCategory] = useState<any[]>([]);
  const [Existingevent, setExistingevent] = useState<any>([]); 
  const [campaign, setCampaign] = useState<any[]>([]);
  const [existingCampaign, setExistingCampaign] = useState<any>([]); 
  const [publisher, setPublisher] = useState<any[]>([]);
  const [existingPublisher, setExistingPublisher] = useState<any>([]); 
  const [publisher_visit, setpublisher_visit] = useState<any[]>([]);
  const [PublisherVisit, setExistingPublisherVisit] = useState<any>([]); 
  const [traffictrend, setTraffictrend] = useState<any[]>([]);
  const [existingtrend, setExistingtrend] = useState<any>([]); 
  const [rootData, setRootData] = useState<any>(null);
 const [currentPage, setCurrentPage] = useState(1);

  
  
 
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
    [cardRefs] 
  );

  // Trigger API call for card values
  const urlTraffic_count = process.env.NEXT_PUBLIC_WEB_PERF + Endpoint.TRAFFIC_COUNT; 
  const methodTraffic_count: 'POST'|'GET' = 'POST'; 
  const paramsTraffic_count = {
    "package_name": "com.abcd_rt",
    "start_date": "2024-11-12",
    "end_date": "2024-11-14"
    // "publishers": ["Affiliate_DR", "facebook"],
    // "campaign": ["02092024","01102024"],
    // "channel":  ["Affiliate","Affiliates"],
    // "sub_publishers": ["sdfghj"]
  }; 
  const handleTrafficCountError = (error: ErrorResponse) => {
    console.error('Error:', error);
  };

  const handleTrafficCountSuccess = (data: any) => {
    console.log('Success:', data);
    setCards(data?.data);
    console.log('--------------------', cards);
  };

  const { mutate:mutateTrafficCount, isLoading:isLoadingTrafficCount } = Api_base({
    url:urlTraffic_count,
    method:methodTraffic_count,
    params:paramsTraffic_count,
    onError: handleTrafficCountError,
    onSuccess: handleTrafficCountSuccess,
  });
  
  const stats = [
    {
      title: "Total Traffic",
      leftKey: "Visit :",
      leftValue: cards?.visits?.total_traffic,
      colors: "#490080",
      rightKey: "Event :",
      rightValue: cards?.events?.total_traffic,
      backgroundColor: "dark:bg-card",
    },
    {
      title: "Valid Traffic",
      leftKey: "Visit :",
      leftValue: cards?.visits?.valid_traffic,
      leftpercentage:cards?.visits?.valid_traffic_percent,
      percentage: `(${cards?.visits?.valid_traffic_percent})`,
      colors: "#00A86B",
      rightKey: "Event :",
      rightValue: cards?.events?.valid_traffic,
      percentage1: `(${cards?.events?.valid_traffic_percent})`,
      backgroundColor: "dark:bg-card",
    },
    {
      title: "Invalid Traffic",
      leftKey: "Visit :",
      leftValue: cards?.visits?.invalid_traffic,
      percentage:`(${cards?.visits?.invalid_traffic_percent})` ,
      colors: "#FF0000",
      rightKey: "Event :",
      rightValue: cards?.events?.invalid_traffic,
      percentage1: `(${cards?.events?.invalid_traffic_percent})`,
      backgroundColor: "dark:bg-card",
    },
    {
      title: "Conversion Rate",
      leftKey: "Valid Traffic :",
      percentage: cards?.comparision?.valid_conversion_rate,
      colors: "#490080",
      rightKey: "Invalid Traffic :",
      percentage1: cards?.comparision?.invalied_conversion_rate,
      backgroundColor: "dark:bg-card",
    },
    {
      title: "Conv. Rate (Valid to Invalid Delta)",
      leftSide: cards?.comparision?.conversion_rate,
      colors: "#00A86B",
      backgroundColor: "dark:bg-card",
    },
  ];
  //trigger Api Traffic Trends
  const urlTrafficTrend = process.env.NEXT_PUBLIC_WEB_PERF + Endpoint.TRAFFIC_TRENDS; 
  const methodTrafficTrend  : 'POST'|'GET' = 'POST'; 
  const paramsTrafficTrend   = {
   "package_name":"com.abcd_rt",
    "start_date": "2024-11-12",
    "end_date": "2024-12-13",
    "summary_type": "visit",
    "frequency": "week"
    // "publishers": ["08901396387169","--sanitized--"],
    // "campaign": ["02092024","01102024"],
    // "channel":  ["Affiliate","Affiliates"],
    // "sub_publisher": ["dfghjk"]
  }; 
  const handleTrafficTrendError = (error: ErrorResponse) => {
    console.error('Error:', error);
  };

  const handleTrafficTrendSuccess = (data: any) => {
    console.log('Success:', data);
    if (data?.data && Array.isArray(data.data)) {
      console.log('Data inside .data:', data.data); // This should show the array of fraud categories
      setTraffictrend(data.data); // Update state with data
    } else {
      console.error('No data or unexpected data structure');
    }
  };
  useEffect(() => {
    console.log("Updated visit category:", traffictrend);
    if(traffictrend)
    {
      const updatedtraffictrend = publisher.map((trendItem: any) => ({
        month:  trendItem.week,
        Invalid: trendItem.invalid_count, 
        Valid: trendItem.valid_count, 
        "Invalid %": trendItem.invalid_percent, 
      }));
      setExistingtrend(updatedtraffictrend); // Update the state with the newly formatted data
    }
  }, [traffictrend]); 


  const { mutate:mutataeTrafficTrend , isLoading:isLoadingTrafficTrend  } = Api_base({
    url:urlTrafficTrend ,
    method:methodTrafficTrend ,
    params:paramsTrafficTrend ,
    onError: handleTrafficTrendError,
    onSuccess: handleTrafficTrendSuccess,
  });

//trigger api for visit Traffic
  const urlVisitTraffic = process.env.NEXT_PUBLIC_WEB_PERF + Endpoint.VISIT_TRAFFIC; 
  const methodVisitTraffic : 'POST'|'GET' = 'POST'; 
  const paramsVisitTraffic  = {
    "package_name":"com.abcd_rt",
    "start_date": "2024-11-12",
    "end_date":"2024-11-13",
    "publishers": ["facebook","ABCD"],
    "channel": ["facebook"]
  }; 
  const handleVisitTrafficError = (error: ErrorResponse) => {
    console.error('Error:', error);
  };

  const handleVisitTrafficSuccess = (data: any) => {
    console.log('Success:', data);
    if (data?.data && Array.isArray(data.data)) {
      console.log('Data inside .data:', data.data); // This should show the array of fraud categories
      setVisitCategory(data.data); // Update state with data
      console.log("visit",visitcategory);
    } else {
      console.error('No data or unexpected data structure');
    }
  };
  useEffect(() => {
    console.log("Updated visit category:", visitcategory);
    if(visitcategory)
    {
      const updatedvisit = visitcategory.map((visitItem: any) => ({
        label:  visitItem.fraud_sub_category,
        visit: visitItem.total_count, 
         percentage:`(${visitItem.percentage})` , 
  
      }));
      setExistingvisit(updatedvisit); 
    }
  }, [visitcategory]); 


  const { mutate:mutataevisitTraffic, isLoading:isLoadingvisitTraffic } = Api_base({
    url:urlVisitTraffic,
    method:methodVisitTraffic,
    params:paramsVisitTraffic,
    onError: handleVisitTrafficError,
    onSuccess: handleVisitTrafficSuccess,
  });
  //Donut chart
  
const chartConfigVisit = {
  visitors: {
    label: "Visitors",
    color:"#000"
  },
  GeoFraud: {
    label: "Geo Fraud",
    color: "hsl(var(--chart-1))",
  },
  BlackListedFraud: {
    label: "BlackListed Fraud ",
    color: "hsl(var(--chart-2))",
  },
  PopUnder: {
    label: "Pop Under",
    color: "hsl(var(--chart-3))",
  },
  DeviceSpoofing: {
    label: "Device Spoofing",
    color: "hsl(var(--chart-4))",
  },
  VPNProxy: {
    label: "VPN Proxy",
    color: "hsl(var(--chart-5))",
  },
}
//Trigger for Api Event Traffic
const urlEventTraffic = process.env.NEXT_PUBLIC_WEB_PERF + Endpoint.EVENT_TRAFFIC; 
  const methodEventTraffic : 'POST'|'GET' = 'POST'; 
  const paramsEventTraffic  = {
    "package_name":"com.abcd_rt",
    "start_date": "2024-11-12",
    "end_date":"2024-11-13",
    "publishers": ["facebook","ABCD"],
    "channel": ["facebook"]   
  }; 
  const handleEventTrafficError = (error: ErrorResponse) => {
    console.error('Error:', error);
  };

  const handleEventTrafficSuccess = (data: any) => {
    console.log('Success:', data);
    if (data?.data && Array.isArray(data.data)) {
      console.log('Data inside .data:', data.data); 
      setEventCategory(data.data); // Update state with data
      console.log("visit",eventcategory);
    } else {
      console.error('No data or unexpected data structure');
    }
  };
  useEffect(() => {
    console.log("Updated visit category:", eventcategory);
    console.log("Updated visit category:", visitcategory);
    if(eventcategory)
    {
      const updatedevent = eventcategory.map((eventItem: any) => ({
        label:  eventItem.fraud_sub_category,
        visit: eventItem.total_count, 
         percentage:`(${eventItem.percentage})` , 
  
      }));
      setExistingevent(updatedevent); 
    }
  }, [eventcategory]); 


  const { mutate:mutataeEventTraffic, isLoading:isLoadingEventTraffic } = Api_base({
    url:urlEventTraffic,
    method:methodEventTraffic,
    params:paramsEventTraffic,
    onError: handleEventTrafficError,
    onSuccess: handleEventTrafficSuccess,
  });
  //top 5 publisher
  const urlPublisher = process.env.NEXT_PUBLIC_WEB_PERF + Endpoint.TOP_PUBLISHERS; 
const methodPublisher : 'POST'|'GET' = 'POST'; 
const paramsPublisher  = {
  "package_name":"com.abcd_rt",
  "start_date": "2024-11-12",
  "end_date":"2024-11-13",
  "page": "1",
  "limit": "10"
  //"search_term": "google_search"
  // "publishers": ["08901396387169","--sanitized--"],
  // "campaign": ["02092024","01102024"]
 // "channel":  ["Affiliate","Affiliates"]
  //"sub_publisher": ["dfghjk"]
}; 
const handlePublisherError = (error: ErrorResponse) => {
  console.error('Error:', error);
};
  const handlePublisherSuccess = (data: any) => {
    console.log('Success top 5 publisher:', data);
    const response = data?.data?.data;
    const rootData = data?.data;
    if (response && Array.isArray(response) && rootData) {
      console.log('Data inside .data:', response);
      setPublisher(response); 
      setRootData(rootData);
      console.log("/////rootdata",rootData)
    } else {
      console.error('No data or unexpected data structure');
    }
  };
//   const page_number = rootData?.page_number;
// const total_pages = rootData?.total_pages;
// const total_count = rootData?.total_records;
// const limit = rootData?.limit;

  
  useEffect(() => {
    if (publisher) {
      const updatedPublisher = publisher.map((publisherItem: any) => ({
        "Source":  publisherItem.publisher_name,
        "Total Visits": publisherItem.total_visits.toLocaleString(), 
        "Invalid Visit %": publisherItem.visit_invalid_percent, 
        "Total Events": publisherItem.total_events.toLocaleString(), 
        "Invalid Event %": publisherItem.event_invalid_percent, 
        "Valid Traffic Conv. Rate": publisherItem.valid_conv_rate,
        "Invalid Traffic Conv. Rate":publisherItem.invalid_conv_rate,  
      }));
      setExistingPublisher(updatedPublisher); 
    }

  }, [publisher,setRootData]);

  const { mutate:mutatePublisher, isLoading:isLoadingPublisher } = Api_base({
    url:urlPublisher,
    method:methodPublisher,
    params:paramsPublisher,
    onError: handlePublisherError,
    onSuccess: handlePublisherSuccess,
  });

  // trigger api visit traffic Publisher
const urlPublisherVisit = process.env.NEXT_PUBLIC_WEB_PERF + Endpoint.VISIT_TRAFFIC_PUBLISHER; 
const methodPublisherVisit : 'POST'|'GET' = 'POST'; 
const paramsPublisherVisit  = {
  "package_name":"com.abcd_rt",
    "start_date": "2024-11-12",
    "end_date":"2024-12-13",
    "publishers": ["facebook","ABCD"],
    "channel": ["facebook"]
}; 
const handlePublisherVisitError = (error: ErrorResponse) => {
  console.error('Error:', error);
};
  const handlePublisherVisitSuccess = (data: any) => {
    console.log('Success visit traffic publisher :', data);
    const response = data.data;
    if (response && Array.isArray(response)) {
      console.log('Data inside .data:', response);
      setpublisher_visit(response); 
    } else {
      console.error('No data or unexpected data structure');
    }
  };

  useEffect(() => {
    if (Array.isArray(publisher_visit)) {  // Ensure publisher_visit is an array
      const updatedVisit: any = {};
  
      publisher_visit.forEach((visitItem: any) => {
        if (!updatedVisit[visitItem.publisher_name]) {
          updatedVisit[visitItem.publisher_name] = {};
        }
  
        updatedVisit[visitItem.publisher_name][visitItem.fraud_sub_category] = visitItem.fraud_sub_category_count;
      });
  
      setExistingPublisherVisit(updatedVisit);
    } else {
      console.error('publisher_visit is not an array:', publisher_visit);
    }
  }, [publisher_visit]);
  


const { mutate:mutatePublisherVisit , isLoading:isLoadingPublisherVisit  } = Api_base({
  url:urlPublisherVisit ,
  method:methodPublisherVisit ,
  params:paramsPublisherVisit ,
  onError: handlePublisherVisitError,
  onSuccess: handlePublisherVisitSuccess,
});

 // trigger Top 5 campaign
 const urlCampaign = process.env.NEXT_PUBLIC_WEB_PERF + Endpoint.TOP_CAMPAIGNS; 
 const methodCampaign : 'POST'|'GET' = 'POST'; 
 const paramsCampaign  = {
   "package_name":"com.flashwin",
     "start_date": "2024-11-12",
     "end_date":"2024-11-13",
     "page": "1",
     "limit": "10"
     //"search_term": "None"
    //"publishers": ["08901396387169","--sanitized--"]
     // "campaign": ["02092024","01102024"],
     // "channel":  ["Affiliate","Affiliates"]
 //    "sub_publisher": ["dfghjk"]
 }; 
 const handleCampaignError = (error: ErrorResponse) => {
   console.error('Error:', error);
 };
   const handleCampaignSuccess = (data: any) => {
     console.log('Success top 5 Campaign:', data);
     const response = data?.data?.data;
     if (response && Array.isArray(response)) {
       console.log('Data inside .data:', response);
       setCampaign(response); 
     } else {
       console.error('No data or unexpected data structure');
     }
   };
 
   useEffect(() => {
     if (campaign) {
       const updatedCampaign = campaign.map((campaignItem: any) => ({
         "Campaign ID": campaignItem.campaign_id,
         "Total Visits": campaignItem.total_visits.toLocaleString(), 
         "Invalid Visit %": campaignItem.visit_invalid_percent, 
         "Total Events": campaignItem.total_events.toLocaleString(), 
         "Invalid Event %": campaignItem.event_invalid_percent, 
       }));
 
       setExistingCampaign(updatedCampaign);
     }
   }, [campaign]);
 
 
 const { mutate:mutataeCampaign, isLoading:isLoadingCampaign } = Api_base({
   url:urlCampaign,
   method:methodCampaign,
   params:paramsCampaign,
   onError: handleCampaignError,
   onSuccess: handleCampaignSuccess,
 });
  useEffect(() => {
    mutataevisitTraffic({
      body: paramsVisitTraffic, 
    });
    mutateTrafficCount({
      body: paramsTraffic_count, 
    });
    mutataeEventTraffic({
      body: paramsEventTraffic, 
    });
    mutataeCampaign({
      body: paramsCampaign, 
    });
    mutatePublisher({
      body: paramsPublisher, 
    });
    mutatePublisherVisit({
      body: paramsPublisherVisit, 
    });
    mutataeTrafficTrend({
      body: paramsTrafficTrend, 
    });
  }, [mutataevisitTraffic,mutataevisitTraffic,mutataeEventTraffic,mutataeCampaign,mutatePublisher,mutatePublisherVisit,mutataeTrafficTrend]);

  const  chartDatastacked = 
  [
    { label: "Perfmax", "Behavior Fraud": 18, "Bot Device":12, "Deprecated Browser":2,"Device Repetition":12,"Device Spoofing":11, "Distribution Fraud":10,"Geo Fraud":13,"Imperceptiable Window":4, "IP Repeat":4,"Not Fraud":5,"Pop Under":8,"Server Form":22,"TimeZone Missmatch":11,"VPN Proxy":0},
    { label: "Google", "Behavior Fraud": 1, "Bot Device":2, "Deprecated Browser":3},
    { label: "Social", "Behavior Fraud": 18, "Bot Device":12, "Deprecated Browser":2,"Device Repetition":12,"Device Spoofing":11, "Distribution Fraud":10,"Geo Fraud":13,"Imperceptiable Window":4, "IP Repeat":4,"Not Fraud":5,"Pop Under":8,"Server Form":22,"TimeZone Missmatch":11,"VPN Proxy":0},
    
  ]
  
  const chartConfigstaged = {
    "Behavior Fraud": {
      label: "Behavior Fraud",
      color: "hsl(var(--chart-1))",
    },
    "Deprecated OS": {
      label: "Deprecated OS",
      color: "hsl(var(--chart-2))",
    },
    "Deprecated Browser": {
      label: "Deprecated Browser",
      color: "hsl(var(--chart-3))",
    },
    "Device Repetition": {
      label: "Device Repetition",
      color: "hsl(var(--chart-4))",
    },
    "Device Spoofing": {
      label: "Device Spoofing ",
      color: "hsl(var(--chart-5))",
    },
    "Distribution Fraud": {
      label: "DistributionFraud",
      color: "#ff6347",
    },
    "Geo Fraud": {
      label: " Geo Fraud ",
      color: "#ee82ee",
    },
    "Imperceptiable Window": {
      label: "Imperceptiable Window ",
      color: "#6a5acd",
    },
    "IP Repeat": {
      label: "IP Repeat ",
      color: "#ffb447",
    },
    "Not Fraud": {
      label: "Not Fraud ",
      color: "#ffb494",
    },
    "Pop Under": {
      label: "Pop Under ",
      color: "#88b494",
    },
    "Server Form": {
      label: "Server Form ",
      color: "#886c0a",
    },
    "VPN Proxy": {
      label: "VPN Proxy ",
      color: "#88190a",
    },
  }satisfies ChartConfig

  const yAxisConfig = {
    dataKey: "label", // Assuming you want to use 'label' as the key for the Y-Axis

  };

  const xAxisConfigstack = {
    dataKey: "value", 
    title: "Fraud Category", 
    tickFormatter: (value: number | string) => `${value}%`,  
  };

  const handleExpand = (index: number) => {
    onExpand(index, cardRefs, expandedCard, setExpandedCard);
  };

  const visitEventOptions = [
    { value: "visit", label: "Visit" },
    { value: "event", label: "Event" },

  ]

  const handleTypeChange = (value: string) => {
    setSelectedType(value)
    console.log("Selected type:", value)
  }
  const selectOptions = ["Weekly", "Monthly", "Yearly"];

  const yAxisConfigstackEvent = {
    dataKey: "Publisher Name",
    title: "Event Publisher Name",
    tickFormatter: (value: string) => value
  }

  return(
   <div className='grid gap-2'> 

       {/* Row 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 w-full gap-2 min-h-[240px]">
           <Card className="w-full shadow-md rounded-none bg-white dark:bg-card dark:text-white p-2">
             {cards ? (
                stats?.map((card, index) => {
                 return (
                   <div key={index}>
                     <KeyValueCard
                       title={card.title}
                       leftKey={card.leftKey}
                       leftValue={card.leftValue}
                       percentage={card.percentage}
                       leftSide={card.leftSide}
                       colors={card.colors}
                       rightKey={card.rightKey}
                       rightValue={card.rightValue}
                       percentage1={card.percentage1}
                       backgroundColor={card.backgroundColor}
                      />
                   </div>);
                })) : (
                  <div className="flex items-center justify-center min-h-full">
                            <Loader2 className=" h-8 w-8 animate-spin text-primary" />
                          </div>
               )}
           </Card>

             {/* Chart Section */}
           <Card ref={(el) => (cardRefs.current[0] = el!)}
             className=" w-full col-span-1 md:col-span-2 lg:col-span-3 shadow-md rounded-none bg-white gap-2 dark:bg-card dark:text-white  text-header">
                    <StackedBarWithLine
                      visitEventOptions={visitEventOptions}
                      handleTypeChange={handleTypeChange}
                      selectedType={selectedType}
                      selectoptions={selectOptions}
                      title="Traffic Trend"
                      onExport={() => onExport("png", "Traffic Trend", 0)}
                      onExpand={() => handleExpand(0)}
                      isRadioButton={true}
                      isSelect={true}
                      chartData={existingtrend}
                      chartConfig={chartConfigStack}
                      isHorizontal={false}
                      isLoading={isLoadingTrafficTrend}
                      placeholder="Weekly"
                      xAxisConfig={{
                        dataKey: 'month',
                        tickLine: false,
                        tickMargin: 10,
                        axisLine: false,
                        tickFormatter: (value: string) => value,
                        textAnchor: 'middle',
                        dy: 10
                      }}
                      YAxis1={{
                        yAxisId: "left",
                        orientation: "left",
                        stroke: "hsl(var(--chart-1))",
                      }}
                      YAxis2={{
                        yAxisId: "right",
                        orientation: "right",
                        stroke: "hsl(var(--chart-3))"
                      }}
                   />          
            </Card>
        </div>

           {/* Row 2  */}
         <div className="gap-1 w-full">
           <div className='w-full bg-gray-200 text-sub-header font-semibold grid justify-items-center sm:text-body p-2'>Distribution By Category</div>
            <div className=" grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2  sm:grid-cols-1 w-full gap-2 min-h-[250px] lg:min-h-[280px] xl:min-h-[300px]">
             <Card ref={(el) => (cardRefs.current[1] = el!)} 
             className=" w-full shadow-md rounded-none bg-white gap-4  dark:bg-card dark:text-white text-header ">
              <CardContent className='mb-2 w-full overflow-y-auto  lg:overflow-y-hidden lg:min-h-[300px] scrollbar '>
                    <DonutChart
                         chartData={existingvisit}
                         chartConfig={chartConfigVisit}
                         title="Visit Traffic"
                         onExport={() => onExport("png", "Visit Traffic", 1)}
                         onExpand={() => handleExpand(1)}
                         isSelect={true}
                         selectoptions={selectOptions}
                         dataKey="visit"   
                          nameKey="label" 
                         placeholder="Weekly"
                         isView={true} 
                         isPercentage={true}
                         direction="flex-col"
                         isLoading={isLoadingvisitTraffic}
                       />
                   </CardContent>
             </Card>

              <Card ref={(el) => (cardRefs.current[2] = el!)} 
                    className="w-full shadow-md rounded-none bg-white gap-4 dark:bg-card dark:text-white text-header ">
                <CardContent className=' w-full mb-2  overflow-y-auto lg:overflow-y-hidden lg:min-h-[300px] scrollbar'>
                       <DonutChart
                             chartData={Existingevent}
                             chartConfig={chartConfigEvent}
                             title="Event Traffic"
                             onExport={() => onExport("png", "Event Traffic", 2)}
                             onExpand={() => handleExpand(2)}
                             isSelect={true}
                             selectoptions={selectOptions}
                             dataKey="visit"    
                              nameKey="label" 
                             placeholder="Weekly"
                             isView={true}
                             isPercentage={true}
                             direction="flex-col"
                             isLoading={isLoadingEventTraffic}
                             />
                       </CardContent>
                </Card>
           </div>
       </div>

         <div className=" grid grid-cols-1 lg:grid-cols-2 md:grid-cols-1 w-full gap-2">
             <Card ref={(el) => (cardRefs.current[3] = el!)} className="shadow-md rounded-none bg-white gap-2 dark:bg-card dark:text-white p-2 text-header ">
                  <HeaderRow
                         title="Top 5 Sources / Publisher"
                         onExport={() => onExport("png", "Top 5 Sources / Publisher", 3)}
                         onExpand={() => handleExpand(3)}
                         visitEventOptions={visitEventOptions}
                         handleTypeChange={handleTypeChange}
                         selectedType={selectedType}
                         isRadioButton={true}
                       />
                 <ResizableTable
                     isPaginated={true}
                     isPause={false}
                     isPlay={false}
                     columns={PublisherColumns}
                     data={existingPublisher}
                     isLoading={isLoadingPublisher}
                     headerColor="#DCDCDC"
                     height={320}
                     isEdit={false}
                     isSearchable
                   //  onLimitChange={limit}
                     //onPageChangeP={total_count}
                    // pageNo={page_number}
                     />
              </Card>
             <Card ref={(el) => (cardRefs.current[4] = el!)} className="shadow-md rounded-none bg-white gap-4 dark:bg-card dark:text-white p-2 text-header ">
                 <HeaderRow
                     title="Top 5 Campaigns"
                     onExport={() => onExport("png", "Top 5 Campaigns", 4)}
                     onExpand={() => handleExpand(4)}
                     visitEventOptions={visitEventOptions}
                     handleTypeChange={handleTypeChange}
                     selectedType={selectedType}
                     isRadioButton={true}
                     />
                     <ResizableTable
                         isPaginated={true}
                         isPause={false}
                         isPlay={false}
                         columns={CampaignColumns}
                         data={existingCampaign}
                         isLoading={isLoadingCampaign}
                         headerColor="#DCDCDC"
                         height={320}
                         isEdit={false}
                         isSearchable
                        //onLimitChange={}
                        //  onPageChangeP={}
                        //  pageNo={}
            
                         />
               </Card>
          </div>

          <div className="gap-1 w-full h-[400px]">
               <div className='w-full bg-gray-200 text-sub-header font-semibold grid justify-items-center sm:text-body p-2'>Distribution By Publishber</div>
              <div className="grid grid-cols-1 sm:grid-cols-1  lg:grid-cols-2 gap-2">
               <div>
                  <Card ref={(el) => (cardRefs.current[4] = el!)} className=" shadow-md  rounded-none bg-white gap-2 dark:bg-card dark:text-white p-2 w-full ">
                      <StackedBarChart
                            chartData={chartDatastacked}
                            chartConfig={chartConfigstaged}
                            xAxis={xAxisConfigstack}
                            isHorizontal={false}
                            title="Visit Traffic"
                            onExport={() => onExport("png", "Visit Traffic", 4)}
                            onExpand={() => handleExpand(4)}
                            visitEventOptions={visitEventOptions}
                            handleTypeChange={handleTypeChange}
                            selectedType={selectedType}
                            isRadioButton={false}
                             layoutDirection="flex-col"
                             isLegend={true}
                             yAxis={yAxisConfig}
                            ischangeLegend={false}
                            isLoading={isLoadingPublisherVisit}
                           />
                     </Card>
                </div>
               <div>
                  <Card ref={(el) => (cardRefs.current[5] = el!)} className=" shadow-md overflow-x-auto scrollbar rounded-none bg-white gap-2 dark:bg-card dark:text-white p-2  w-full ">
                   <StackedBarChart
                          chartData={chartDatastacked}
                          chartConfig={chartConfigstaged}
                          xAxis={xAxisConfigstack}
                          yAxis={yAxisConfigstackEvent}
                          isHorizontal={false}
                          title="Event Traffic"
                          onExport={() => onExport("png", "Event Traffic", 5)}
                          onExpand={() => handleExpand(5)}
                          visitEventOptions={visitEventOptions}
                          handleTypeChange={handleTypeChange}
                          selectedType={selectedType}
                          isRadioButton={false}
                          AxisLabel= "Value"
                          layoutDirection="flex-col"
                          isLegend={true}
                          ischangeLegend={false}
                           />
                    </Card>
                </div>
             </div>
           </div>
     </div>
  )
}

export default Dashboard;