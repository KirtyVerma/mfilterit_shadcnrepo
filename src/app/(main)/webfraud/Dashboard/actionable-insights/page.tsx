"use client"
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import ResizableTable from '@/components/mf/TableComponent';
import HeaderRow from '@/components/mf/HeaderRow';
import { onExpand, downloadURI,debounce,handleExportData} from '@/lib/utils';
import { useState,useCallback,useRef,useEffect } from 'react';
import domToImage from "dom-to-image";
import DonutChart from '@/components/mf/charts/DonutChart';
import { useApiCall } from "../../queries/api_base";
import { usePackage } from "@/components/mf/PackageContext";
import { Filter } from "@/components/mf/Filters";
import { useDateRange } from "@/components/mf/DateRangeContext";
import Endpoint from '../../common/endpoint';

interface FilterItem {
    label: string;
    checked: boolean;
  }
  
  interface FilterState {
    filters: FilterItem[];
    is_select_all: boolean;
    selected_count: number;
    loading: boolean;
  }
  
  interface FilterPayload {
    [key: string]: FilterState;
  }
  // Add type for API response
  interface FilterApiResponse {
    data: string[];
    isLoading: boolean;
  }
  
  interface ChartConfig {
    [key: string]: {
      label: string;
      color: string;
    };
  }
  //meta data
  interface MetaData{
    label: string;
    visit: number;
    fill: string;
    [key: string]: string | number;
  }
interface ColumnUserBR {
    title: string,
    key: keyof UserDataBR,
  }
 
  interface UserDataBR {
    inserted_date: string;
    "Total Visits": number;
    "Unique IPs": number;
    "Total Blocked IPs": number;
    "Blocked IP Percentage" :number;
  }
  interface BlockedG {
    data: UserDataBR[];
    total_records: number;
    page_number: number;
    limit: number;
    total_pages: number;
    search_term: string;
  }
  const BlockedRepeatG: ColumnUserBR[] = [
    { title: "Date", key: "inserted_date"},
    { title: "Total Visits", key: "Total Visits" },
    { title: "Unique IPs" , key:  "Unique IPs" },
    { title: "Total Blocked IPs", key: "Total Blocked IPs" },
    { title: "Blocked IP Percentage", key: "Blocked IP Percentage" },
  ]
  //overall placement
  interface ColumnGood {
    title: string,
    key: keyof userDataGoodP,
  }
 interface userDataGoodP{
   // Publisher:string;
    Placement:string;
    Status:string;
    Score:string;
 }
 interface OverallData{
  data: userDataGoodP[];
  total_records: number;
  page_number: number;
  limit: number;
  total_pages: number;
  search_term: string;
 }
 const OverallGoodP : ColumnGood[]= [
  { title: "Placement", key: "Placement" },
  { title: "Status" , key:  "Status" },
  { title: "Score", key: "Score" },
]
 interface ColumnBad{
    title: any,
    key: keyof userDataBad,
 }
 interface userDataBad{
    Placement:string;
    Status:string;
    Score:string;
    Category:string;
 }
 interface BadPData{
  data: userDataBad[];
  total_records: number;
  page_number: number;
  limit: number;
  total_pages: number;
  search_term: string;
 }
 const BadP : ColumnBad[]= [
   { title: "Placement", key: "Placement" },
   { title: "Status" , key:  "Status" },
   { title: "Score", key: "Score" },
   { title: "Category" , key:  "Category" },

]
 interface ColumnGAO {
    title: any,
    key: keyof userDataAO,
  }
 interface userDataAO{
    Date:string;
    "Total Traffic":number;
    "High Intent":number;
    "Medium Intent":number;
    "Low Intent":number;
 }
 interface AO{
  data:userDataAO[];
  total_records: number;
  page_number: number;
  limit: number;
  total_pages: number;
  search_term: string;

 }
 const GoogleAO : ColumnGAO[]= [
  { title: "Date", key: "Date"},
  { title: "Total Traffic", key: "Total Traffic" },
  { title: "High Intent" , key:  "High Intent" },
  { title: "Medium Intent", key: "Medium Intent" },
  { title: "Low Intent" , key:  "Low Intent" },

]
 
//overall placement
interface UserdataP{
label:string;
visit:number;
percentage:string;
fill: string;
[key: string]: string | number;
}
interface OverallP{
  data:UserdataP[];
  total_records:string;
}
  //unsafe
  interface UnsafeP{
    data:UserdataP[];
    total_count:{
      total_count:number;
      count_percentage:string
    }
  }
  // google optimization
  interface UserDataG{
    inent_status:string;
    percentage:number;
  }
  interface OptimG{
    data:UserDataG[];
    total_placements:string;
  }
  
  const chartConfigMetaIP = {
    clean_percentage: {
      label: "Cleaned",
      color: "#d46cb4",
    },
    blocked_percentage: {
      label: " Blocked ",
      color: "#854442",
    },
    blocked_ips_count: {
        label: "Blocked IPs",
        color: "#82735c",
      },
  }

  
  const chartConfigOverallPlacement= {
    "brand_safe": {
      label: "Brand Safe",
      color: " #a459d1",
    },
    "brand_unsafe": {
      label: "Brand Unsafe",
      color: " #3c2f2f",
    }, 
  }

  const chartConfigUnsafePlacement = {
    "Highly Unsafe": {
      label:"Highly Unsafe",
      color: " #ffbe4f",
    },
    "Medium Unsafe": {
      label: "Medium Unsafe",
      color: " #0ea7b5",
    },
    "Low Unsafe": {
      label: "Low Unsafe",
      color: " #0c457d",
    },  
  }


  const chartConfigGoogleOptimization = {
    "High_Intent": {
      label:"High Intent",
      color: " #cc0086",
    },
    "Medium_Intent": {
      label: "Medium Intent",
      color: " #320261",
    },
    "Low_Intent": {
      label: "Low Intent",
      color: " #787a41",
    },
    
  }
 const Actionable_insights = () => {
      const cardRefs = useRef<Record<string, HTMLElement | null>>({});
      const [expandedCard, setExpandedCard] = useState<string | null>(null);
      const { startDate, endDate } = useDateRange();
      const [existingPublisherdata, setExistingPublisherdata] = useState<string[]>([]);
      const [existingSubPublisherdata, setExistingSubPublisherdata] = useState<string[]>([]);
      const [existingCampaigndata, setExistingCampaigndata] = useState<string[]>([]);
      const [existingChanneldata, setExistingChanneldata] = useState<string[]>([]);
      const [ExistingEventTypedata, setExistingEventTypedata] = useState<string[]>([]);
      const [loadedFilter, setLoadedFilter] = useState<any>({});
      const[OverallPercentage,setOverallPercentage] =useState<string>("");
      const[UnsafePercentage,setUnsafePercentage] =useState<string>("");
      const[Unsafe,setUnsafe ]= useState<UserdataP[]>([]);
      const[blockG,setBlockedG ]= useState<UserdataP[]>([]);
      const[blockM,setBlockedM ]= useState<UserdataP[]>([]);
      const[GoogleP,setGoogleP ]= useState<UserDataG[]>([]);
      const[FacebookP,setFacebookP ]= useState<UserDataG[]>([]);
      const[TotalP,setTotalP] =useState<string>();
      const[TotalF,setTotalF] =useState<string>();
      const[GoogleA,setGoogleA]= useState<userDataAO[]>([]);
      const [currentPageAO, setCurrentPageAO] = useState(1);
      const [limitAO, setLimitAO] = useState(10);
      const [searchTermAO, setSearchTermAO] = useState("");
      const[FacebookAO,setFacebookAO]= useState<userDataAO[]>([]);
      const [currentPageFO, setCurrentPageFO] = useState(1);
      const [limitFO, setLimitFO] = useState(10);
      const [searchTermFO, setSearchTermFO] = useState("");
      const[Overall,setOverall ]= useState<UserdataP[]>([]);
      const [currentPageBR, setCurrentPageBR] = useState(1);
      const [limitBR, setLimitBR] = useState(10);
      const [searchTermBR, setSearchTermBR] = useState("");
      const[UnsafeB,setUnsafeB ]= useState<userDataBad[]>([]);
      const [currentPageB, setCurrentPageB] = useState(1);
      const [limitB, setLimitB] = useState(10);
      const [searchTermB, setSearchTermB] = useState("");
      const[OverallG,setOverallG ]= useState<userDataGoodP[]>([]);
      const [currentPageG, setCurrentPageG] = useState(1);
      const [limitG, setLimitG] = useState(10);
      const [searchTermG, setSearchTermG] = useState("");
      const [currentPageM, setCurrentPageM] = useState(1);
      const [limitM, setLimitM] = useState(10);
      const [searchTermM, setSearchTermM] = useState("");
      const { selectedPackage } = usePackage();
      const [MetaIP, setMetaIP] = useState<string[]>([]);
      const [GoogleIP, setGoogleIP] = useState<string[]>([]);
      const [query, setQuery] = useState({
         publishers: ["all"],
         sub_publishers: ["all"],
         campaigns: ["all"],
         channels: ["all"],
        //  event_type: ["all"],
       });
       const[TotalRecordAF,setTotalRecordAF] =useState();
       const[TotalRecordAG,setTotalRecordAG]=useState();
       const[TotalRecordBP,setTotalRecordBP] =useState();
       const[TotalRecordOG,setTotalRecordOG]=useState();
       const[TotalRecordBRM,setTotalRecordBRM] =useState();
       const[TotalRecordBRG,setTotalRecordBRG]=useState();
       const [ExportcsvGoogle, setExportcsvGoogle] = useState(false);
       const [ExportcsvMeta, setExportcsvMeta] = useState(false);
       const [ExportcsvBRG, setExportcsvBRG] = useState(false);
       const [ExportcsvBRM, setExportcsvBRM] = useState(false);
       const [ExportcsvOP, setExportcsvOP] = useState(false);
       const [ExportcsvGP, setExportcsvGP] = useState(false);
       const [ExportcsvBP, setExportcsvBP] = useState(false);
       const [ExportcsvAOG, setExportcsvAOG] = useState(false);
       const [ExportcsvAOF, setExportcsvAOF] = useState(false);
       const [ExportcsvAOGT, setExportcsvAOGT] = useState(false);
       const [ExportcsvAOFT, setExportcsvAOFT] = useState(false);
       const [ExportcsvUP, setExportcsvUP] = useState(false);
       const exportCsvRef = useRef(false);
  
 const onExport = useCallback(
    async (s: string, title: string, key: string) => {
      const ref = cardRefs.current[key];
      if (!ref) return;
  
      switch (s) {
        case "png":
          const screenshot = await domToImage.toPng(ref);
          downloadURI(screenshot, title + ".png");
          break;
        default:
      }
    },
    []
  );
  
  const handleExpand = (key: string) => {
    onExpand(key, cardRefs, expandedCard, setExpandedCard);
  };
         
           // Publishers Filter API
  const publishersFilterApi = useApiCall<FilterApiResponse>({
    url: process.env.NEXT_PUBLIC_WEB_PERF + Endpoint.PUBLISHERS,
    method: "POST",
    params: {
      package_name: selectedPackage,
      start_date: startDate,
      end_date: endDate,
    },
    onSuccess: (data) => {
      setExistingPublisherdata(data);
      if (data.length > 0) {
             }
    },
    onError: (error) => {
    },
  });

  // Sub Publishers Filter API
  const subPublishersFilterApi = useApiCall<FilterApiResponse>({
    url: process.env.NEXT_PUBLIC_WEB_PERF + Endpoint.SUB_PUBLISHERS,
    method: "POST",
    params: {
      package_name: selectedPackage,
      start_date: startDate,
      end_date: endDate,
      publishers: query.publishers,
    },
    onSuccess: (data) => {
      setExistingSubPublisherdata(data);
      if (data.length > 0) {
      }
    },
    onError: (error) => {
    },
  });

  // Campaigns Filter API
  const campaignsFilterApi = useApiCall<FilterApiResponse>({
    url: process.env.NEXT_PUBLIC_WEB_PERF + Endpoint.CAMPAIGNS,
    method: "POST",
    params: {
      package_name: selectedPackage,
      start_date: startDate,
      end_date: endDate,
    },
    onSuccess: (data) => {
      setExistingCampaigndata(data);
      if (data.length > 0) {
      }
    },
    onError: (error) => {
    },
  });

  // Channels Filter API
  const channelsFilterApi = useApiCall<FilterApiResponse>({
    url: process.env.NEXT_PUBLIC_WEB_PERF + Endpoint.CHANNELS,
    method: "POST",
    params: {
      package_name: selectedPackage,
      start_date: startDate,
      end_date: endDate,
    },
    onSuccess: (data) => {
      setExistingChanneldata(data);
      if (data.length > 0) {
      }
    },
    onError: (error) => {
    },
  });
  // event type Filter API
  // const eventTypeFilterApi = useApiCall<FilterApiResponse>({
  //   url: process.env.NEXT_PUBLIC_WEB_PERF + Endpoint.EVENT_TYPE,
  //   method: "POST",
  //   params: {
  //     package_name: selectedPackage,
  //     start_date: startDate,
  //     end_date: endDate,
  //   },
  //   onSuccess: (data) => {
  //     setExistingEventTypedata(data);
  //     if (data?.data.length > 0) {

  //     }
  //   },
  //   onError: (error) => {
  //   },
  // });

 const filter = React.useMemo(
   () => ({
     Publishers: {
       filters:
         existingPublisherdata?.map((publisher: string) => ({
           label: publisher,
           // Change: Only check if it exists in the current selection
           checked: query.publishers?.includes("all") || 
                  query.publishers?.includes(publisher) || 
                  !query.publishers, // Default true if no selection exists
         })) || [],
       // Change: Determine if all are selected
       is_select_all: !query.publishers || 
                    query.publishers.includes("all") ||
                    query.publishers?.length === existingPublisherdata?.length,
       // Change: Actual selected count
       selected_count: query.publishers?.includes("all") 
                     ? existingPublisherdata?.length ?? 0
                     : query.publishers?.length ?? existingPublisherdata?.length ?? 0,
       loading: false,
     },
     "Sub Publishers": {
       filters:
         existingSubPublisherdata?.map((subPublisher: string) => ({
           label: subPublisher,
           checked: query.sub_publishers?.includes("all") || 
                  query.sub_publishers?.includes(subPublisher) || 
                  !query.sub_publishers,
         })) || [],
       is_select_all: !query.sub_publishers || 
                    query.sub_publishers.includes("all") ||
                    query.sub_publishers?.length === existingSubPublisherdata?.length,
       selected_count: query.sub_publishers?.includes("all")
                     ? existingSubPublisherdata?.length ?? 0
                     : query.sub_publishers?.length ?? existingSubPublisherdata?.length ?? 0,
       loading: false,
     },
     Campaigns: {
       filters:
         existingCampaigndata?.map((campaign: string) => ({
           label: campaign,
           checked: query.campaigns?.includes("all") || 
                  query.campaigns?.includes(campaign) || 
                  !query.campaigns,
         })) || [],
       is_select_all: !query.campaigns || 
                    query.campaigns.includes("all") ||
                    query.campaigns?.length === existingCampaigndata?.length,
       selected_count: query.campaigns?.includes("all")
                     ? existingCampaigndata?.length ?? 0
                     : query.campaigns?.length ?? existingCampaigndata?.length ?? 0,
       loading: false,
     },
     Channels: {
       filters:
         existingChanneldata?.map((channel: string) => ({
           label: channel,
           checked: query.channels?.includes("all") || 
                  query.channels?.includes(channel) || 
                  !query.channels,
         })) || [],
       is_select_all: !query.channels || 
                    query.channels.includes("all") ||
                    query.channels?.length === existingChanneldata?.length,
       selected_count: query.channels?.includes("all")
                     ? existingChanneldata?.length ?? 0
                     : query.channels?.length ?? existingChanneldata?.length ?? 0,
       loading: false,
     },
//      "Event Type": {
//       filters:
//         ExistingEventTypedata?.map((event_type: string) => ({
//           label: event_type,
//           checked: query.event_type?.includes("all") || 
//                  query.event_type?.includes(event_type) || 
//                  !query.event_type,
//         })) || [],
//         is_select_all: !query.event_type || 
//         query.event_type.includes("all") ||
//         query.event_type?.length === ExistingEventTypedata?.length,
// selected_count: query.event_type?.includes("all")
//            ? ExistingEventTypedata?.length ?? 0
//            : query.event_type?.length ?? ExistingEventTypedata?.length ?? 0,
// loading: false,
//       },
   }),
   [
     existingPublisherdata,
     existingSubPublisherdata,
     existingCampaigndata,
     existingChanneldata,
     ExistingEventTypedata,
     query.publishers,
     query.sub_publishers,
     query.campaigns,
     query.channels,
    // query.event_type,
   ]
 );
     
 //ip details google
 const {result:GoogleIp,loading:isLoadingGoogleIp} = useApiCall<MetaData>({
  url: process.env.NEXT_PUBLIC_WEB_PERF + Endpoint.GOOGLE,
  method: "POST",
  params: {
    package_name: selectedPackage,
    start_date: startDate,
    end_date: endDate,
    publishers: query.publishers,
    sub_publisher: query.sub_publishers,
    campaign: query.campaigns,
    channel: query.channels,
    //event_type: query.event_type,
    export:ExportcsvGoogle,
  },
  onSuccess: (response) => {
    if(ExportcsvGoogle && typeof response === 'string'){
      const rows = response.split('\n');
      const datas = rows.slice(1)
        .filter((row: string) => row.trim()) // Remove empty rows
        .map
        (row => {
          const values = row.split(',');
          return {
            blocked_ips_count: values[0],
            total_visit: values[1],
            blocked_percentage: values[2],
            clean_percentage: values[3]
          };
        });
        const exportHeaders = ["Blocked IPs Count", "Total Visit", "Blocked Percentage", "Percentage"];
        const exportRows = datas.map(item => [
          item.blocked_ips_count,
          item.total_visit,
          item.blocked_percentage,
          item.clean_percentage
        ]);
        handleExportData(exportHeaders, exportRows, "GoogleData.csv");
        setExportcsvGoogle(false);
        return;
    }
    if (Array.isArray(response)) {
      setGoogleIP([]);
      // Create chart data by mapping over the response
      const updatedChartData = Object.keys(response[0]).map((key) => {
        const config = chartConfigMetaIP[key];
    
        if (config) {
          const percentage = response[0][key]; // Access the value from the API response
    
          return {
            label: config.label,
            percentage: percentage,
            fill: config.color,
          };
        }
    
        return null;
      }).filter(item => item !== null); // Filter out null values

        setGoogleIP([...updatedChartData]);
    }
  },
  onError: (error) => {
    setGoogleIP([]);
  }
});
//ip Blocked report google
const {result:IPBlockedG,loading:isLoadingIPBlockedG} = useApiCall<BlockedG>({
  url: process.env.NEXT_PUBLIC_WEB_PERF + Endpoint.BLOCKED_REPORT_GOOGLE,
  method: "POST",
  params: {
    package_name: selectedPackage,
    start_date: startDate,
    end_date: endDate,
    page: currentPageBR,
    limit: limitBR,
    search_term: searchTermBR,
    publishers: query.publishers,
    sub_publisher: query.sub_publishers,
    campaign: query.campaigns,
    channel: query.channels,
    //event_type: query.event_type,
    export:ExportcsvBRG,
  },
  onSuccess: (response) => {
    if(ExportcsvBRG && typeof response === 'string'){
      const rows = response.split('\n');
      const datas = rows.slice(1)
        .filter((row: string) => row.trim()) // Remove empty rows
        .map(row => {
          const values = row.split(',');
          return {
            inserted_date: values[0],
            "Total Visits": values[1],
            "Unique IPs": values[2],
            "Total Blocked IPs": values[3],
            "Blocked IP Percentage": values[4],
          };
        });
        const exportHeaders = ["Inserted Date", "Total Visits", "Unique IPs", "Total Blocked IPs", "Blocked IP Percentage"];
        const exportRows = datas.map(item => [
          item.inserted_date,
          item["Total Visits"],
          item["Unique IPs"],
          item["Total Blocked IPs"],
          item["Blocked IP Percentage"],
        ]);
        handleExportData(exportHeaders, exportRows, "BlockedGoogleData.csv");
        setExportcsvBRG(false);
        return;
    }
    const data = response.data;
    if (Array.isArray(data)) {
      setBlockedG([]);
      const updatedtop: UserDataBR[] = data.map((topItem: any) => ({
        inserted_date: topItem.inserted_date,
        "Total Visits": topItem.total_visit,
        "Unique IPs":topItem.unique_ip_count,
        "Total Blocked IPs": topItem.blocked_ips_count,
        "Blocked IP Percentage":topItem.blocked_ip_percentage
      }))
        setBlockedG([...updatedtop]);
    }
    
    setTotalRecordBRG(response.total_pages)
      // Stop correct loader based on the trigger
  },
  onError: (error) => {
    setBlockedG([]);
  },
});
 //ip details meta
 const {result:MetaIp,loading:isLoadingMetaIp} = useApiCall<MetaData>({
    url: process.env.NEXT_PUBLIC_WEB_PERF + Endpoint.META,
    method: "POST",
    params: {
      package_name: selectedPackage,
      start_date: startDate,
      end_date: endDate,
      publishers: query.publishers,
      sub_publisher: query.sub_publishers,
      campaign: query.campaigns,
      channel: query.channels,
      //event_type: query.event_type,
      export:ExportcsvMeta,
    },
    onSuccess: (response) => {
      if(ExportcsvMeta && typeof response === 'string'){
        const rows = response.split('\n');
        const datas = rows.slice(1)
          .filter((row: string) => row.trim()) // Remove empty rows
          .map 
          (row => {
            const values = row.split(',');
            return {
              blocked_ips_count: values[0],
              total_visit: values[1],
              blocked_percentage: values[2],
              clean_percentage: values[3]
            };
          });
          const exportHeaders = ["Blocked IPs Count", "Total Visit", "Blocked Percentage", "Percentage"];
          const exportRows = datas.map(item => [
            item.blocked_ips_count,
            item.total_visit,
            item.blocked_percentage,
            item.clean_percentage
          ]);
          handleExportData(exportHeaders, exportRows, "MetaData.csv");
          setExportcsvMeta(false);
          return;
      }

      if (Array.isArray(response)) {
        setMetaIP([]);
        // Create chart data by mapping over the response
        const updatedChartData = Object.keys(response[0]).map((key) => {
          const config = chartConfigMetaIP[key];
      
          if (config) {
            const percentage = response[0][key]; // Access the value from the API response
      
            return {
              label: config.label,
              percentage: percentage,
              fill: config.color,
            };
          }
      
          return null;
        }).filter(item => item !== null); // Filter out null values

          setMetaIP([...updatedChartData]);
      }
    },
  onError: (error) => {
    setMetaIP([]);
  },
});

//ip Blocked report meta
const {result:IPBlockedM,loading:isLoadingIPBlockedM} = useApiCall<BlockedG>({
  url: process.env.NEXT_PUBLIC_WEB_PERF + Endpoint.BLOCKED_REPORT_META,
  method: "POST",
  params: {
    package_name: selectedPackage,
    start_date: startDate,
    end_date: endDate,
    page: currentPageM,
    limit: limitM,
    search_term: searchTermM,
    publishers: query.publishers,
    sub_publisher: query.sub_publishers,
    campaign: query.campaigns,
    channel: query.channels,
    //event_type: query.event_type,
    export:ExportcsvBRM,
  },
  onSuccess: (response) => {
    if(ExportcsvBRM && typeof response === 'string'){
      const rows = response.split('\n');
      const datas = rows.slice(1)
        .filter((row: string) => row.trim()) // Remove empty rows
        .map(row => {
          const values = row.split(',');
          return {
            inserted_date: values[0],
            "Total Visits": values[1],
            "Unique IPs": values[2],
            "Total Blocked IPs": values[3],
            "Blocked IP Percentage": values[4],
          };
        });
        const exportHeaders = ["Inserted Date", "Total Visits", "Unique IPs", "Total Blocked IPs", "Blocked IP Percentage"];
        const exportRows = datas.map(item => [
          item.inserted_date,
          item["Total Visits"],
          item["Unique IPs"],
          item["Total Blocked IPs"],
          item["Blocked IP Percentage"],
        ]);
        handleExportData(exportHeaders, exportRows, "BlockedMetaData.csv");
        setExportcsvBRM(false);
        return;
    }
    const data = response.data;
    if (Array.isArray(data)) {
      setBlockedM([]);
      const updatedtop: UserDataBR[] = data.map((topItem: any) => ({
        inserted_date: topItem.inserted_date,
        "Total Visits": topItem.total_visit,
        "Unique IPs":topItem.unique_ip_count,
        "Total Blocked IPs": topItem.blocked_ips_count,
        "Blocked IP Percentage":topItem.blocked_ip_percentage
      }))
     
        setBlockedM([...updatedtop]);
    }
    setTotalRecordBRM(response.total_pages);
  },

  onError: (error) => {
    setBlockedM([]);
   
  },
  
});

//Overall Placement
const {result:OverallPlacement,loading:isLoadingOverallPlacement} = useApiCall<OverallP>({
  url: process.env.NEXT_PUBLIC_WEB_PERF + Endpoint.OVERALL_PLACEMENT,
  method: "POST",
  params: {
    package_name: selectedPackage,
    start_date: startDate,
    end_date: endDate,
    publishers: query.publishers,
    sub_publisher: query.sub_publishers,
    campaign: query.campaigns,
    channel: query.channels,
    export: ExportcsvOP,
  },
  onSuccess: (response) => {
    if(ExportcsvOP && typeof response === 'string'){
      const rows = response.split('\n');
      const datas = rows.slice(1)
        .filter((row: string) => row.trim()) // Remove empty rows
        .map(row => {
          const values = row.split(',');
          return {
            pl_status: values[0],
            count: values[1],
            count_percentage: values[2],
          };
        });
        const exportHeaders = ["Placement Status", "Count", "Percentage"];
        const exportRows = datas.map(item => [
          item.pl_status,
          item.count,
          item.count_percentage,
        ]);
        handleExportData(exportHeaders, exportRows, "OverallPlacementData.csv");
        setExportcsvOP(false);
        return;
    }
    const data = response.data;
    if (Array.isArray(data)) {
      setOverall([]);
      const colorConfig = data.reduce((acc, item) => {
        const category = item.pl_status;
      
        acc[category] = {
          label: category,
          color:
            category === "brand_safe"
              ? "#a459d1"
              : category === "brand_unsafe"
              ? "  #3c2f2f" 
              : `#${Math.floor(Math.random() * 16777215).toString(16)}` // random color for others
        };  
        return acc;
      }, {} as ChartConfig);

      
      // Process all data for export
      const allData: UserdataP[] = data.map((topItem) => {
        const fraudDesc = topItem.pl_status ;
        const counts = topItem.count;
        const visits = parseFloat(topItem.count_percentage.replace('%', ''));
        return {
          label: String(fraudDesc),
          visit: counts,
          percentage: `${visits.toFixed(2)}%`,
          fill: colorConfig[fraudDesc] ?. color || "#000",
        };
      });

      // Get top 10 for display
      const top10Data = [...allData]
        .sort((a, b) => parseFloat(b.percentage) - parseFloat(a.percentage))
        .slice(0, 10);

      setOverall(top10Data);
      setOverallPercentage(response.total_records);
    }
  },
  
  onError: (error) => {
    setOverall([]);
  }
})
//Good Placement
const {result:GoodP,loading:isLoadingGoodP} = useApiCall<OverallData>({
  url: process.env.NEXT_PUBLIC_WEB_PERF + Endpoint.OVERALL_PLACEMENT_TABLE,
  method: "POST",
  params: {
    package_name: selectedPackage,
    start_date: startDate,
    end_date: endDate,
    page: currentPageG,
    limit: limitG,
    search_term: searchTermG,
    publishers: query.publishers,
    sub_publisher: query.sub_publishers,
    campaign: query.campaigns,
    channel: query.channels,
    export:ExportcsvGP,
  },
  onSuccess: (response) => {
    if(ExportcsvGP && typeof response === 'string'){
      const rows = response.split('\n');
      const datas = rows.slice(1)
        .filter((row: string) => row.trim()) // Remove empty rows
        .map(row => {
          const values = row.split(',');
          return {
            placement_id: values[0],
            pl_status: values[1],
            score_category: values[2],
          };
        });
        const exportHeaders = ["Placement ID", "Placement Status", "Score Category"];
        const exportRows = datas.map(item => [
          item.placement_id,
          item.pl_status,
          item.score_category,
        ]);
        handleExportData(exportHeaders, exportRows, "GoodPlacementData.csv");
        setExportcsvGP(false);
        return;
    }
    const data = response.data;
    if (Array.isArray(data)) {
      setOverallG([]);
      const updatedtop: userDataGoodP[] = data.map((topItem: any) => ({
        Placement: topItem.placement_id,
        Status:topItem.pl_status,
        Score: topItem.score_category,
        
      }))
      
        setOverallG([...updatedtop]);
      }
  setTotalRecordOG(response.total_pages);
   // Stop correct loader based on the trigger
},
  onError: (error) => {
    setOverallG([]);
    // Stop correct loader based on the trigger
},
});
//unsafe Placement
const {result:UnsafePlacement,loading:isLoadingUnsafePlacement} = useApiCall<UnsafeP>({
  url: process.env.NEXT_PUBLIC_WEB_PERF + Endpoint.UNSAFE_PLACEMENT,
  method: "POST",
  params: {
    package_name: selectedPackage,
    start_date: startDate,
    end_date: endDate,
    publishers: query.publishers,
    sub_publisher: query.sub_publishers,
    campaign: query.campaigns,
    channel: query.channels,
    //event_type: query.event_type,
    export: ExportcsvUP,
  },
  onSuccess: (response) => {
    if(ExportcsvUP && typeof response === 'string'){
      const rows = response.split('\n');
      const datas = rows.slice(1)
        .filter((row: string) => row.trim()) // Remove empty rows
        .map(row => {
          const values = row.split(',');
          return {
            pl_status: values[0],
            count: values[1],
            score_category: values[2],
            count_percentage: values[3],
          };
        });
        const exportHeaders = ["Placement Status", "Count"," Score Category", "Percentage"];
        const exportRows = datas.map(item => [
          item.pl_status,
          item.count,
          item.score_category,
          item.count_percentage,
        ]);
        handleExportData(exportHeaders, exportRows, "UnsafePlacementData.csv");
        setExportcsvUP(false);
        return;
      }
    const data = response.data;
    if (Array.isArray(data) && data.length > 0) {
      setUnsafe([]);
      // First create the color configuration
      const colorConfig = data.reduce((acc, item) => {
        const category = item.pl_status;
      
        acc[category] = {
          label: category,
          color:
            category === "brand_safe"
              ? "#a459d1"
              : category === "brand_unsafe"
              ? "  #3c2f2f" 
              : `#${Math.floor(Math.random() * 16777215).toString(16)}` // random color for others
        };  
        return acc;
      }, {} as ChartConfig);

      const updatedtop: UserdataP[] = data.map((topItem) => {
        const fraudDesc = topItem.pl_status;
        const counts = topItem.count;
        // Convert percentage string to number and format it
        const visits = parseFloat(topItem.count_percentage.replace('%', ''));
        return {
          label: String(fraudDesc),
          visit: counts,
          percentage: `${visits.toFixed(2)}%`,
          fill: colorConfig[fraudDesc]?.color || "#000000",
        };
      });
      setUnsafe(updatedtop);
    } else {
      setUnsafe([]); // Reset to empty array when no data
    }
  },
  onError: (error) => {
    setUnsafe([]); // Reset on error
  }
})
//Bad Placement
const {result:UnsafeP,loading:isLoadingUnsafeP} = useApiCall<BadPData>({
  url: process.env.NEXT_PUBLIC_WEB_PERF + Endpoint.UNSAFE_PLACEMENT_TABLE,
  method: "POST",
  params: {
    package_name: selectedPackage,
    start_date: startDate,
    end_date: endDate,
    page: currentPageB,
    limit: limitB,
    search_term: searchTermB,
    publishers: query.publishers,
    sub_publisher: query.sub_publishers,
    campaign: query.campaigns,
    channel: query.channels,
    //event_type: query.event_type,
    export:ExportcsvBP,
  },
  onSuccess: (response) => {
 if(ExportcsvBP && typeof response === 'string'){
  const rows = response.split('\n');
  const datas = rows.slice(1)
    .filter((row: string) => row.trim()) // Remove empty rows
    .map(row => {
      const values = row.split(',');
      return {
        placement_id: values[0],
        pl_status: values[1],
        score_category: values[2],
        category: values[3],
      };
    });
    const exportHeaders = ["Placement ID", "Placement Status", "Score Category", "Category"];
    const exportRows = datas.map(item => [
      item.placement_id,
      item.pl_status,
      item.score_category,
      item.category,
    ]);
    handleExportData(exportHeaders, exportRows, "UnsafePlacementData.csv");
    setExportcsvBP(false);
    return;
}

    const data = response.data;
    if (Array.isArray(data)) {
      setUnsafeB([]);
      const updatedtop: userDataBad[] = data.map((topItem: any) => ({
        Placement: topItem.placement_id,
        Status:topItem.pl_status,
        Score: topItem.score_category,
        Category : topItem.category,
        
      }))
  
        setUnsafeB([...updatedtop]);
    }
    setTotalRecordBP(response.total_pages)
  },
  onError: (error) => {
    setUnsafeB([]);
  },
});
//Google Optimization
const {result:GoogleOptim,loading:isLoadingGoogleOptim} = useApiCall<OptimG>({
  url: process.env.NEXT_PUBLIC_WEB_PERF + Endpoint.AUDIENCE_OPTIMIZATION_GOOGLE,
  method: "POST",
  params: {
    package_name: selectedPackage,
    start_date: startDate,
    end_date: endDate,
    publishers: query.publishers,
    sub_publisher: query.sub_publishers,
    campaign: query.campaigns,
    channel: query.channels,
    //event_type: query.event_type,
    export:ExportcsvAOG,
  },
  onSuccess: (response) => {
    if(ExportcsvAOG && typeof response === 'string'){
      const rows = response.split('\n');
      const datas = rows.slice(1)
        .filter((row: string) => row.trim()) // Remove empty rows
        .map(row => {
          const values = row.split(',');
          return {
            intent_status: values[0],
            percentage: values[1],
          };
        });
        const exportHeaders = ["Intent Status", "Percentage"];
        const exportRows = datas.map(item => [
          item.intent_status,
          item.percentage,
        ]);
        handleExportData(exportHeaders, exportRows, "AudienceOptimizationGoogle.csv");
        setExportcsvAOG(false);
        return;
    }

    const data = response.data;
    if (Array.isArray(data)) {
      setGoogleP([]);
      const updatedtop: UserDataG[] = data.map((topItem) => {
        const fraudDesc = topItem.intent_status as keyof typeof chartConfigGoogleOptimization;
        const visits = parseFloat(topItem.percentage.replace("%","")); // Convert percentage string to number
        if (fraudDesc in chartConfigGoogleOptimization) {
          return {
            label: fraudDesc,
            percentage:visits,
            fill: chartConfigGoogleOptimization[fraudDesc].color,
          };
        }
        return {
          label: fraudDesc,
          percentage:visits,
          fill: "#000",
        };
      });
   
      
        setGoogleP([...updatedtop]);
      setTotalP(response.total_placements);
    }
  },
  onError: (error) => {
  setGoogleP([]);
  },
})
//google optimization table
const {result:GoogleAOs,loading:isLoadingGoogleAOs} = useApiCall<AO>({
  url: process.env.NEXT_PUBLIC_WEB_PERF + Endpoint.AUDIENCE_OPTIMIZATION_GOOGLE_TABLE,
  method: "POST",
  params: {
    package_name: selectedPackage,
    start_date: startDate,
    end_date: endDate,
    page: currentPageAO,
    limit: limitAO,
    search_term: searchTermAO,
    publishers: query.publishers,
    sub_publisher: query.sub_publishers,
    campaign: query.campaigns,
    channel: query.channels,
   // event_type: query.event_type,
    export:ExportcsvAOGT,
  },
  onSuccess: (response) => {
    if(ExportcsvAOGT && typeof response === 'string'){
      const rows = response.split('\n');
      const datas = rows.slice(1)
        .filter((row: string) => row.trim()) // Remove empty rows
        .map(row => {
          const values = row.split(',');
          return {
            inserted_date: values[0],
            total_traffic: values[1],
            high_intent: values[2],
            medium_intent: values[3],
            low_intent: values[4],
          };
        });
        const exportHeaders = ["Inserted Date", "Total Traffic", "High Intent", "Medium Intent", "Low Intent"];
        const exportRows = datas.map(item => [
          item.inserted_date,
          item.total_traffic,
          item.high_intent,
          item.medium_intent,
          item.low_intent,
        ]);
        handleExportData(exportHeaders, exportRows, "AudienceOptimizationGoogle.csv");
        setExportcsvAOGT(false);
        return;
    }

    const data = response.data;
    if (Array.isArray(data)) {
      setGoogleA([]);
      const updatedtop:userDataAO[] = data.map((topItem: any) => ({
        Date: topItem.inserted_date,
        "Total Traffic":topItem.total_traffic,
        "High Intent": topItem.high_intent,
        "Medium Intent":topItem.medium_intent,
        "Low Intent":topItem.low_intent
        
      }))
     
        setGoogleA([...updatedtop]);
      
    }
    setTotalRecordAG(response.total_pages);
  },
  onError: (error) => {
    setGoogleA([]);
  },
});
//FaceBook Optimization
const {result:FacebookOptim,loading:isLoadingFacebookOptim} = useApiCall<OptimG>({
  url: process.env.NEXT_PUBLIC_WEB_PERF + Endpoint.AUDIENCE_OPTIMIZATION_FACEBOOK,
  method: "POST",
  params: {
    package_name: selectedPackage,
    start_date: startDate,
    end_date: endDate,
    publishers: query.publishers,
    sub_publisher: query.sub_publishers,
    campaign: query.campaigns,
    channel: query.channels,
   // event_type: query.event_type,
    export:ExportcsvAOF,
  },
  onSuccess: (response) => {
    if(ExportcsvAOF && typeof response === 'string'){
      const rows = response.split('\n');
      const datas = rows.slice(1)
        .filter((row: string) => row.trim()) // Remove empty rows
        .map(row => {
          const values = row.split(',');
          return {
            intent_status: values[0],
            percentage: values[1],
          };
        });
        const exportHeaders = ["Intent Status", "Percentage"];
        const exportRows = datas.map(item => [
          item.intent_status,
          item.percentage,
          ]);
        handleExportData(exportHeaders, exportRows, "AudienceOptimizationFacebook.csv");
        setExportcsvAOF(false);
        return;
    }

    const data = response.data;
    if (Array.isArray(data)) {
      setFacebookP([]);
      const updatedtop: UserDataG[] = data.map((topItem) => {
        const fraudDesc = topItem.intent_status as keyof typeof chartConfigGoogleOptimization;
        const visits = parseFloat(topItem.percentage.replace("%","")); // Convert percentage string to number
        if (fraudDesc in chartConfigGoogleOptimization) {
          return {
            label: fraudDesc,
            percentage:visits,
            fill: chartConfigGoogleOptimization[fraudDesc].color,
          };
        }
        return {
          label: fraudDesc,
          percentage:visits,
          fill: "#000",
        };
      });
     
          setFacebookP([...updatedtop]);
      }
      setTotalF(response.total_placements);
    },
  onError: (error) => {
    setFacebookP([]);
  }
})
//Facebook optimization table
const {result:FacebookAOs,loading:isLoadingFacebookAOs} = useApiCall<AO>({
  url: process.env.NEXT_PUBLIC_WEB_PERF + Endpoint.OPTIMIZATION_FACEBOOK_TABLE,
  method: "POST",
  params: {
    package_name: selectedPackage,
    start_date: startDate,
    end_date: endDate,
    page: currentPageFO,
    limit: limitFO,
    search_term: searchTermFO,
    publishers: query.publishers,
    sub_publisher: query.sub_publishers,
    campaign: query.campaigns,
    channel: query.channels,
   // event_type: query.event_type,
    export:ExportcsvAOFT,
  },
  onSuccess: (response) => {
    if(ExportcsvAOFT && typeof response === 'string'){
      const rows = response.split('\n');
      const datas = rows.slice(1)
        .filter((row: string) => row.trim()) // Remove empty rows
        .map
        (row => {
          const values = row.split(',');
          return {
            inserted_date: values[0],
            total_traffic: values[1],
            high_intent: values[2],
            medium_intent: values[3],
            low_intent: values[4],
          };
        });
        const exportHeaders = ["Inserted Date", "Total Traffic", "High Intent", "Medium Intent", "Low Intent"];
        const exportRows = datas.map(item => [
          item.inserted_date,
          item.total_traffic,
          item.high_intent,
          item.medium_intent,
          item.low_intent,
        ]);
        handleExportData(exportHeaders, exportRows, "AudienceOptimizationFacebook.csv");
        setExportcsvAOFT(false);
        return;
    }
    const data = response.data;
    if (Array.isArray(data)) {
      setFacebookAO([]);
      const updatedtop: userDataAO[]= data.map((topItem: any) => ({
        Date: topItem.inserted_date,
        "Total Traffic":topItem.total_traffic,
        "High Intent": topItem.high_intent,
        "Medium Intent":topItem.medium_intent,
        "Low Intent":topItem.low_intent
        
      }))
     
        setFacebookAO([...updatedtop]);
    }
   setTotalRecordAF(response.total_pages);
  },

  onError: (error) => {
    setFacebookAO([]);
  },
});

const deepEqual = (arr1: any[], arr2: any[]) => {
  // Check if either arr1 or arr2 is undefined or not an array
  if (!Array.isArray(arr1) || !Array.isArray(arr2)) return false;
  if (arr1.length !== arr2.length) return false;
  
  // Proceed with deep comparison
  return arr1.every((item, index) => item.checked === arr2[index].checked && item.label === arr2[index].label);
};
  // Update the handleFilterChange function
  const handleFilterChange = useCallback((newState: Record<string, any>) => {
    if (!newState || deepEqual(newState, loadedFilter)) {
      return;
    }

    const payload = {
      publishers: newState.Publishers?.is_select_all 
        ? ['all']
        : newState.Publishers?.filters
            .filter((f: any) => f.checked)
            .map((f: any) => f.label),
      sub_publishers: newState['Sub Publishers']?.is_select_all
        ? ['all']
        : newState['Sub Publishers']?.filters
            .filter((f: any) => f.checked)
            .map((f: any) => f.label),
      campaigns: newState.Campaigns?.is_select_all
        ? ['all']
        : newState.Campaigns?.filters
            .filter((f: any) => f.checked)
            .map((f: any) => f.label),
      channels: newState.Channels?.is_select_all
        ? ['all']
        : newState.Channels?.filters
            .filter((f: any) => f.checked)
            .map((f: any) => f.label)
    };

    setQuery(payload);
    setLoadedFilter(newState);
  }, [loadedFilter]);

   //fetch Blocked Report Google api
   const fetchBlockedG = useCallback(() => {
    if ('mutate' in IPBlockedG) {

      IPBlockedG.mutate({}); 
    }
  }, [IPBlockedG])
   const debouncedFetchBlockedG = useCallback(debounce(fetchBlockedG, 500), []);

    //fetch Blocked Report meta api
  const fetchBlockedM = useCallback(() => {
    if ('mutate' in IPBlockedM) {

      IPBlockedM.mutate({});
    }
  }, [IPBlockedM])

   const debouncedFetchBlockedM = useCallback(debounce(fetchBlockedM, 500), []);

     //fetch Overall  api
  const fetchUnsafeB = useCallback(() => {
    if ('mutate' in UnsafeP) {
      UnsafeP.mutate({});
    }
  }, [UnsafeP])

   const debouncedFetchUnsafeB = useCallback(debounce(fetchUnsafeB, 500), []);


     //fetch Blocked Report overall api
  const fetchOverallG = useCallback(() => {
    if ('mutate' in GoodP) {

      GoodP.mutate({});
    }
  }, [GoodP])

   const debouncedFetchOverallG = useCallback(debounce(fetchOverallG, 500), []);

   
  const fetchGoogleAO = useCallback(() => {if ('mutate' in GoogleAOs) {      
    GoogleAOs.mutate({});}}, [GoogleAOs])
   const debouncedFetchGoogleAO = useCallback(debounce(fetchGoogleAO, 5000), []);
   const fetchFacebookAO = useCallback(() => {if ('mutate' in FacebookAOs) {   
    FacebookAOs.mutate({});} }, [FacebookAOs])
   const debouncedFetchFacebookAO = useCallback(debounce(fetchFacebookAO, 5000), []);
    const fetchGoogleData = useCallback(() => {if ('mutate' in GoogleIp) {     
      GoogleIp.mutate({})}},[]);
    const fetchMetaData = useCallback(() => { if ('mutate' in MetaIp) {   
      MetaIp.mutate({})}},[]);
    const fetchOverallData = useCallback(() => { if ('mutate' in OverallPlacement) {  
      OverallPlacement.mutate({})}},[]);
    const fetchUnsafeData = useCallback(() => {if ('mutate' in UnsafePlacement) {    
      UnsafePlacement.mutate({})}},[]);
    const fetchGOptimData = useCallback(() => {if ('mutate' in GoogleOptim) {     
      GoogleOptim.mutate({})}},[]);
    const fetchFoptimData = useCallback(() => {if ('mutate' in FacebookOptim) {    
      FacebookOptim.mutate({})}},[]);

//filter 
  const fetchPublisher = useCallback(() => {if (publishersFilterApi.type === "mutation"){publishersFilterApi.result.mutate({})}},[]);
  const fetchSubPublisher = useCallback(() => {if (subPublishersFilterApi.type === "mutation"){subPublishersFilterApi.result.mutate({})}},[]);
    const fetchCampaign = useCallback(() => {if (campaignsFilterApi.type === "mutation"){campaignsFilterApi.result.mutate({})}},[]);
    const fetchChannel = useCallback(() => { if (channelsFilterApi.type === "mutation"){channelsFilterApi.result.mutate({})}},[]);
  //  const fetchEventType = useCallback(() => { if (eventTypeFilterApi.type === "mutation"){eventTypeFilterApi.result.mutate({})}},[]);


   useEffect(() => {
      if (limitBR|| currentPageBR||searchTermBR) {
        exportCsvRef.current = false;  
        setExportcsvBRG(false);

        debouncedFetchBlockedG();
      }
    }, [limitBR, currentPageBR,searchTermBR]);
    useEffect(() => {
      if (limitM|| currentPageM||searchTermM) {
        exportCsvRef.current = false;  
        setExportcsvBRM(false);

        debouncedFetchBlockedM();
      }
    }, [limitM, currentPageM,searchTermM]);
  
    useEffect(() => {
      if (limitG ||currentPageG||searchTermG) {
        exportCsvRef.current = false;  
        setExportcsvGP(false);

        debouncedFetchOverallG();
      }
    }, [ limitG, currentPageG,searchTermG]);

    useEffect(() => {
      if (limitB||currentPageB||searchTermB) {
        exportCsvRef.current = false;  
        setExportcsvBP(false);

        debouncedFetchUnsafeB();
      }
    }, [ limitB, currentPageB,searchTermB]);
  
    useEffect(() => {
      if (limitAO|| currentPageAO||searchTermAO) {
        exportCsvRef.current = false;  
        setExportcsvUP(false);

        debouncedFetchGoogleAO();
      }
    }, [ limitAO, currentPageAO,searchTermAO]);

    useEffect(() => {
      if (limitFO|| currentPageFO||searchTermFO) {
        exportCsvRef.current = false;  
        setExportcsvAOFT(false);
        debouncedFetchFacebookAO();
      }
    }, [limitFO, currentPageFO,searchTermFO]);

    const fetchAllData = useCallback(() => {
      fetchBlockedG();
      fetchBlockedM();
      fetchUnsafeB();
      fetchOverallG();
      fetchGoogleAO();
      fetchFacebookAO();
      fetchGoogleData();
      fetchMetaData();
      fetchOverallData();
      fetchUnsafeData();
      fetchGOptimData();
      fetchFoptimData();
      fetchPublisher();
      fetchSubPublisher();
      fetchCampaign();
      fetchChannel();
     // fetchEventType();
    }, []);
  // Separate effect for handling exports
  useEffect(() => {
    if (ExportcsvGoogle) {
      fetchGoogleData();
    }},[ExportcsvGoogle]);
    useEffect(() => {
    if(ExportcsvMeta){
      fetchMetaData();
    }},[ExportcsvMeta]);
    useEffect(() => {
    if(ExportcsvBRG){
      fetchBlockedG();
    }},[ExportcsvBRG]);
    useEffect(() => {
    if(ExportcsvBRM){
      fetchBlockedM();
    }},[ExportcsvBRM]);
    useEffect(() => {
    if(ExportcsvOP){
      fetchOverallData();
    }},[ExportcsvOP]);
    useEffect(() => {
    if(ExportcsvGP){
      fetchOverallG();
    }},[ExportcsvGP]);
    useEffect(() => {
    if(ExportcsvBP){
      fetchUnsafeB();
    }},[ExportcsvBP]);
    useEffect(() => {
    if(ExportcsvUP){
      fetchUnsafeData();
    }},[ExportcsvUP]);
    useEffect(() => {
     if(ExportcsvAOG){
      fetchGOptimData();
    }},[ExportcsvAOG]);
    useEffect(() => {
     if(ExportcsvAOF){
      fetchFoptimData();
    }},[ExportcsvAOF]);
    useEffect(() => {
     if(ExportcsvAOGT){
      fetchGoogleAO();
    }},[ExportcsvAOGT]);
    useEffect(() => {
    if(ExportcsvAOFT){
      fetchFacebookAO();
    }},[ExportcsvAOFT]);
    
  

 useEffect(() => {
   if (
     selectedPackage &&
     startDate &&
     endDate ) {
     fetchAllData(); 
   }
 }, [selectedPackage, startDate, endDate]);

useEffect(() => {
  if (
    selectedPackage &&
    startDate &&
    endDate ) {
    fetchAllData();
  }
}, [loadedFilter]);

 
  return (
    <div className='grid gap-2 w-full'>
      <div className=" sticky top-0 z-50 sm:w-full flex flex-cols-4 w-full flex-wrap items-center justify-start gap-4 rounded-md bg-background px-5 py-2">
      <Filter filter={filter} onChange={handleFilterChange} />
              </div>
    <div className="gap-1 w-full">
    <div className='w-full bg-gray-200 text-sub-header font-semibold grid justify-items-center sm:text-body p-2'>IP Details</div>
    <div className=" grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2  sm:grid-cols-1 w-full gap-2 min-h-[140px] ">
    <Card ref={(el: HTMLDivElement | null): void => {
      if (el) cardRefs.current["google_ip"] = el;
    }} className='p-2 h-[300px] '>
      <DonutChart
        chartData={GoogleIP}
        chartConfig={chartConfigMetaIP}
        onExport={() => onExport("png", " Google Ip Details", "google_ip")}
        onExpand={() => handleExpand("google_ip")}
        title="Google"
        handleExport={() => {
          setExportcsvGoogle(true);
        }}
        dataKey="percentage"   
        nameKey="label" 
        isView={false}
        isPercentage={true}
        isPercentageValue={false}
        isLabelist={false}
        marginTop='mt-0'
        isLoading={isLoadingGoogleIp}
      />
      </Card>
      <Card ref={(el: HTMLDivElement | null): void => {
      if (el) cardRefs.current["meta_ip"] = el!;
    }} className='p-2 h-[300px]'>
       <DonutChart
        chartData={MetaIP}
        chartConfig={chartConfigMetaIP}
        onExport={() => onExport("png", "Meta Ip Details", "meta_ip")}
        onExpand={() => handleExpand("meta_ip")}
        title="Meta"
        handleExport={() => {
          setExportcsvMeta(true);
        }}
        dataKey="percentage"   
        nameKey="label" 
        isView={false}
        isPercentage={true}
        isPercentageValue={false}
        isLabelist={false}
        marginTop='mt-0'
        isLoading={isLoadingMetaIp}
      />
     
    </Card>
    <Card ref={(el)=>(cardRefs.current["blocked_report_google"] = el!)} className='p-2 min-h-[140px]'>
         <HeaderRow
        title=' Google Blocked Report'
        onExport={() => onExport("png", "Blocked Report Google", "blocked_report_google")}
        onExpand={() => handleExpand("blocked_report_google")}
        handleExport={() => {
          setExportcsvBRG(true);
        }}
        />
      <ResizableTable
        isPaginated={true}
        columns={BlockedRepeatG}
        data={blockG}
        isLoading={isLoadingIPBlockedG}
        headerColor="#DCDCDC"
        height={210}
        isEdit={false}
        isSearchable={true}
        setSearchTerm={setSearchTermBR}
        SearchTerm={searchTermBR}
        onLimitChange={(newLimit: number) => {
          setLimitBR(newLimit);
        }}
        onPageChangeP={(newPage: number) => {
          setCurrentPageBR(newPage);
        }}
        pageNo={currentPageBR}
        totalPages={TotalRecordBRG}
        
      />
      </Card>
      <Card ref={(el: HTMLDivElement | null): void => {
      if (el) cardRefs.current["blocked_report_meta"] = el!;
    }} className='p-2 min-h-[140px]'>
         <HeaderRow
        title=' Meta Blocked Report'
        onExport={() => onExport("png", "Blocked Report META", "blocked_report_meta")}
        onExpand={() => handleExpand("blocked_report_meta")}
        handleExport={() => {
          setExportcsvBRM(true);
        }}
        />
      <ResizableTable
        isPaginated={true}
        columns={BlockedRepeatG}
        data={blockM}
        isLoading={isLoadingIPBlockedM}
        headerColor="#DCDCDC"
        height={210}
        isEdit={false}
        isSearchable={true}
        setSearchTerm={setSearchTermM}
        SearchTerm={searchTermM}
        onLimitChange={(newLimit: number) => {
          setLimitM(newLimit);
        }}
        onPageChangeP={(newPage: number) => {
          setCurrentPageM(newPage);
        }}
        pageNo={currentPageM}
        totalPages={TotalRecordBRM}
      />
    </Card>
    </div>
    </div>
    {/* Row 2 */}
    <div className="labelgap-1 w-full">
    <div className='w-full bg-gray-200 text-sub-header font-semibold grid justify-items-center sm:text-body p-2'>Placement Details</div>
    <div className=" grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2  sm:grid-cols-1 w-full gap-2 min-h-[140px] ">
    <Card ref={(el: HTMLDivElement | null): void => {
      if (el) cardRefs.current["overall_placement"] = el!;
    }}  className='p-2 h-[300px]'>
      <DonutChart
        chartData={Overall}
        chartConfig={chartConfigOverallPlacement}
        onExport={() => onExport("png", " Overall Placements", "overall_placement")}
        onExpand={() => handleExpand("overall_placement")}
        handleExport={() => {
          setExportcsvOP(true);
        }}
        title="Overall Placements"
        isdonut={false}
        dataKey="visit"   
        nameKey="label" 
        isView={false}
        isPercentage={false}
        isPercentageValue={true}
        isLabelist={false}
        marginTop='mt-0'
        isLoading={isLoadingOverallPlacement}
      />
      </Card>
      <Card ref={(el: HTMLDivElement | null): void => {
      if (el) cardRefs.current["unsafe_placement"] = el!;}}
      className='p-2 h-[300px]'>
         <DonutChart
        chartData={Unsafe}
        chartConfig={chartConfigUnsafePlacement}
        onExport={() => onExport("png", "Unsafe Placements", "unsafe_placement")}
        onExpand={() => handleExpand("unsafe_placement")}
        handleExport={() => {
          setExportcsvUP(true);
        }}
        title="Unsafe Placements"
        dataKey="visit"   
        nameKey="label" 
        isView={false}
        isPercentage={false}
        isPercentageValue={true}
        isLabelist={false}
        marginTop='mt-0'
        isLoading={isLoadingUnsafePlacement}
        
      />
        
    </Card>
    <Card ref={(el: HTMLDivElement | null): void => {
      if (el) cardRefs.current["good_placement"] = el!;
    }} className='p-2' >
        <HeaderRow
        title='Good Placements'
        onExport={() => onExport("png", "Good Placements", "good_placement")}
        onExpand={() => handleExpand("good_placement")}
        handleExport={() => {
          setExportcsvGP(true);
        }}
        />
      <ResizableTable
        isPaginated={true}
        columns={OverallGoodP}
        data={OverallG}
        isLoading={isLoadingGoodP}
        headerColor="#DCDCDC"
        height={210}
        isEdit={false}
        isSearchable={true}
        setSearchTerm={setSearchTermG}
        SearchTerm={searchTermG}
        onLimitChange={(newLimit: number) => {
          setLimitG(newLimit);
        }}
        onPageChangeP={(newPage: number) => {
          setCurrentPageG(newPage);
        }}
        pageNo={currentPageG}
        totalPages={TotalRecordOG}
        
      />
      </Card>
     <Card ref={(el: HTMLDivElement | null): void => {
      if (el) cardRefs.current["unsafe_bad_placement"] = el!;}}
       className='p-2'>
     <HeaderRow
        title='Unsafe / Bad Placements'
        onExport={() => onExport("png", "Unsafe / Bad Placements", "unsafe_bad_placement")}
        onExpand={() => handleExpand("unsafe_bad_placement")}
        handleExport={() => {
          setExportcsvBP(true);
        }}
        />
      <ResizableTable
        isPaginated={true}
        columns={BadP}
        data={UnsafeB}
        isLoading={isLoadingUnsafeP}
        headerColor="#DCDCDC"
        height={210}
        isEdit={false}
        isSearchable={true}
        setSearchTerm={setSearchTermB}
        SearchTerm={searchTermB}
        onLimitChange={(newLimit: number) => {
          setLimitB(newLimit);
        }}
        onPageChangeP={(newPage: number) => {
          setCurrentPageB(newPage);
        }}
        pageNo={currentPageB}
        totalPages={TotalRecordBP}
      />
    </Card>
    </div>
    </div>
    {/* Row 3 */}
    <div className="gap-1 w-full">
    <div className='w-full bg-gray-200 text-sub-header font-semibold grid justify-items-center sm:text-body p-2'>Audience Optimization</div>
    <div className=" grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2  sm:grid-cols-1 w-full gap-2 min-h-[140px]">
    <Card ref={(el: HTMLDivElement | null): void => {
      if (el) cardRefs.current["google_audience_optimization"] = el!;
    }} className='p-2 h-[300px]'>
      <DonutChart
        chartData={GoogleP}
        chartConfig={chartConfigGoogleOptimization}
        onExport={() => onExport("png", "Google Audience Optimization", "google_audience_optimization")}
        onExpand={() => handleExpand("google_audience_optimization")}
        handleExport={() => {
          setExportcsvAOG(true);
        }}
        title="Google"
        dataKey="percentage"   
        nameKey="label" 
        isView={false}
        isPercentage={true}
        isPercentageValue={false}
        isLabelist={true}
        marginTop='mt-0'
        totalV={TotalP}
        isLoading={isLoadingGoogleOptim}
        
      />
      </Card>
      <Card ref={(el: HTMLDivElement | null): void => {
      if (el) cardRefs.current["facebook_audience_optimization"] = el!;
    }} className='p-2 h-[300px] '>
      <DonutChart
        chartData={FacebookP}
        chartConfig={chartConfigGoogleOptimization}
        onExport={() => onExport("png", " FaceBook Audience Optimization", "facebook_audience_optimization")}
        onExpand={() => handleExpand("facebook_audience_optimization")}
        handleExport={() => {
          setExportcsvAOF(true);
        }}
        title="Facebook"
        dataKey="percentage"   
        nameKey="label" 
        isView={false}
        isPercentage={true}
        isPercentageValue={false}
        isLabelist={true}
        marginTop='mt-0'
        totalV={TotalF}
        isLoading={isLoadingFacebookOptim}
      />
     
    </Card>
    <Card ref={(el: HTMLDivElement | null): void => {
      if (el) cardRefs.current["google_audience_optimization_table"] = el!;
    }} className='p-2 '>
         <HeaderRow
        title='Google'
        onExport={() => onExport("png", "Google", "google_audience_optimization_table")}
        onExpand={() => handleExpand("google_audience_optimization_table")}
        handleExport={() => {
          setExportcsvAOGT(true);
        }}
        />
       <ResizableTable
        isPaginated={true}
        columns={GoogleAO}
        data={GoogleA}
        isLoading={isLoadingGoogleAOs}
        headerColor="#DCDCDC"
        height={210}
        isEdit={false}
        isSearchable={true}
        setSearchTerm={setSearchTermAO}
        SearchTerm={searchTermAO}
        onLimitChange={(newLimit: number) => {
          setLimitAO(newLimit);
        }}
        onPageChangeP={(newPage: number) => {
          setCurrentPageAO(newPage);
        }}
        pageNo={currentPageG}
        totalPages={TotalRecordAG}
      />
      </Card>
      <Card ref={(el: HTMLDivElement | null): void => {
      if (el) cardRefs.current["facebook_audience_optimization_table"] = el!;
    }} className='p-2 '>
       <HeaderRow
        title='Facebook'
        onExport={() => onExport("png", "Facebook", "facebook_audience_optimization_table")}
        onExpand={() => handleExpand("facebook_audience_optimization_table")}
        handleExport={() => {
          setExportcsvAOFT(true);
        }}
        />
      <ResizableTable
        isPaginated={true}
        columns={GoogleAO}
        data={FacebookAO}
        isLoading={isLoadingFacebookAOs}
        headerColor="#DCDCDC"
        height={210}
        isEdit={false}
        isSearchable={true}
        setSearchTerm={setSearchTermFO}
        SearchTerm={searchTermFO}
        onLimitChange={(newLimit: number) => {
          setLimitFO(newLimit);
        }}
        onPageChangeP={(newPage: number) => {
          setCurrentPageFO(newPage);
        }}
        pageNo={currentPageG}
        totalPages={TotalRecordAF}
      />
    </Card>
    </div>
    </div>
    </div>
  );
}
export default Actionable_insights;


