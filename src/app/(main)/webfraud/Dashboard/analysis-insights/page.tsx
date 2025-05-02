"use client"
import React, { useMemo, useRef, useEffect, useCallback, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import ResizableTable from '@/components/mf/TableComponent';
import HeaderRow from '@/components/mf/HeaderRow';
import { onExpand, downloadURI, debounce, handleExportData } from '@/lib/utils';
import domToImage from "dom-to-image";
//import { ChartConfig } from '@/components/ui/chart';
import DynamicBarChart from '@/components/mf/charts/DynamicBarChart';
import DonutChart from '@/components/mf/charts/DonutChart';
import HorizontalVerticalBarChart from '@/components/mf/charts/HorizontalVerticalBarChart';
import DoubleLineChart from '@/components/mf/charts/DoubleLineChart';
import StackedBarChart from '@/components/mf/charts/stackedBarChart'
import { useApiCall } from "../../queries/api_base";
import { usePackage } from "@/components/mf/PackageContext";
import { Filter } from "@/components/mf/Filters";
import { useDateRange } from "@/components/mf/DateRangeContext";
import Endpoint from '../../common/endpoint';
import { useLoading } from '@/components/mf/LoadingContext';
import { it } from 'node:test';

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
interface ColumnUser {
  title: string,
  key: keyof UserData,
}
interface UserData {
  device_signature: string;
  publisher_name: string;
  sub_publisher_name: string;
  visit: number;
}
interface Repeatuser {
  device_repetition_percentage: string;
  data: UserData[];
  total_records: number;
  page_number: number;
  limit: number;
  total_pages: number;
  search_term: string;
}
const RepeatUser: ColumnUser[] = [
  { title: "Device Signature", key: "device_signature" },
  { title: "Publisher Name", key: "publisher_name" },
  { title: "Sub Publisher", key: "sub_publisher_name" },
  { title: "Visit", key: "visit" },
]
//SuspiciousB
interface Botuser {
  label: string;
  visit: number;
  percentage: number;
  fill: string;
  [key: string]: string | number;
}
interface SuspiciousB {
  suspicious_behaviour: SuspiciousBehaviour;
  bot_fraud_percentage: string;
  data: Botuser[];
}
const chartConfigPiechart: ChartConfig = {

  desktop: {
    label: "Desktop",
    color: "#e76e50",
  },
  mobile: {
    label: "Mobile",
    color: "#2a9d90",
  },
  bot: {
    label: "Bot",
    color: "#a8a032"
  }
} satisfies ChartConfig

//Ip Repeat
interface IPData {
  label: string;
  "Total Event": number;
  "Total Visit": number;
  [key: string]: string | number;
}

interface IPResponse {
  repeat_ip_percentage: string;
  data: IPData[];
}

const chartConfigIpReport: ChartConfig = {
  "Total Event": {
    label: "Total Event",
    color: "#274754",
  },
  "Total Visit": {
    label: "Total Visit",
    color: "#e8c468",
  },
}
//server farm
interface ServerData {
  label: string;
  Desktop: number;
  Mobile: number;
  Total: number;
  [key: string]: string | number;
}

interface ServerResponse {
  //server_farm_percentage: server;
  server_farm_percentage: string;
  data: ServerData[];
}
const chartConfigServerFarm: ChartConfig = {
  Mobile: {
    label: "Mobile",
    color: "#2a9d90",
  },
  Desktop: {
    label: "Desktop",
    color: "#e76e50",
  },
  Total: {
    label: "Total",
    color: "#2dc048",
  }

}
//VPN Proxy
interface VPNData {
  label: string;
  visit: number;
  fill: string;
  [key: string]: string | number;
}
interface VPNProxys {
  vpn_proxy_percentage: string;
  data: VPNData[];
}

const chartConfigVPN: ChartConfig = {
  NA: {
    label: "NA",
    color: "#ef4444"
  },
  DCH: {
    label: "DCH",
    color: "#84cc16",
  },
  PUB: {
    label: "PUB",
    color: "#0d9488",
  },
  VP: {
    label: "VP",
    color: "#0ea5e9",
  },
  SES: {
    label: "SES",
    color: "#9333ea",
  },
  VPN: {
    label: "VPN",
    color: "#d97706",
  }
}
//Invalid GEO
interface GeoData {
  label: string;
  "Fraud %": number;
  "Fraud Count": number;
  fill: string;
  [key: string]: string | number;
}
interface InvalidData {
  data: GeoData[];
  invalid_geo_percentage: string;
}

//pop under
interface PopDataItem {
  device_type: string;
  screen_resolution: string; // e.g. "360|780"
  pop_under_percentage: number | string; // e.g. 3.86 for standard or "0.00%" for demandgen
}

interface PopResponse {
  standard: PopDataItem[];  // Array of PopDataItems for standard
  demandgen: PopDataItem[];  // Array of PopDataItems for demandgen
  pop_under_percentage: {
    pop_under_percentage: string;  // e.g. "0.00%"
  };
}

interface ChartDataItem {
  label: string;
  standard: number;
  demandgen: number;
  [key: string]: string | number;
}


const chartConfigPopUnder = {
  standard: {
    label: "Standard",
    color: "#8b5cf6",
  },
  demandgen: {
    label: "DemandGen",
    color: "#c2410c",
  },
} satisfies ChartConfig

//Imperceptiable Window
interface WindowData {
  label: string;
  count_hasIframe: number;
  device_type: string;
  [key: string]: string | number;
}
interface WindowResponse {
  data: WindowData[];
  percentage: string;
}

const chartConfigWindow = {
  desktop: {
    label: "Desktop",
    color: "#e76e50",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

const yAxisConfig = {
  dataKey: "label", // Assuming you want to use 'label' as the key for the Y-Axis

};
const xAxisConfigstack = {

  isPercentage: false,

};
const InformSuspicous =
  [
    {
      title: "Mouse Movement: FALSE",
      desc: "User has not Interacted with the website."
    },
    {
      title: "Touch Support: FALSE",
      desc: "User has not Interacted with the website.",
    },
    {
      title: "HasFocus: FALSE",
      desc: "Page is not Opening in the Active Tab",
    },
  ]

const InformPopUnder =
  [
    {
      title: "HasFocus: FALSE",
      desc: "Page is not Opening in the Active Tab",
    },
    {
      title: "17%",
      desc: "Height & Width of the browser window is small",
    },
    {
      title: "Time Spent On Page: 0 sec",
      desc: "User has not Interacted with the website."
    },
    {
      title: "Slide/ Scroll / Touch: FALSE",
      desc: "User has not Interacted with the website."
    }
  ]

const InformWindow =
  [
    {
      title: "HasFocus: FALSE",
      desc: "Page is not Opening in the Active Tab",
    },
    {
      title: "Has Iframe: 0x0",
      desc: "Height & Width of the browser window is small",
    },
    {
      title: "Time Spent On Page: 0 sec",
      desc: "User has not Interacted with the website."
    },
    {
      title: "Slide/ Scroll / Touch: FALSE",
      desc: "User has not Interacted with the website."
    }
  ]

const Analysis_insights = () => {
  const cardRefs = useRef<Record<string, HTMLElement | null>>({});
  const { startDate, endDate } = useDateRange();
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [existingPublisherdata, setExistingPublisherdata] = useState<string[]>([]);
  const [existingSubPublisherdata, setExistingSubPublisherdata] = useState<string[]>([]);
  const [ExistingEventTypedata, setExistingEventTypedata] = useState<string[]>([]);
  const [existingCampaigndata, setExistingCampaigndata] = useState<string[]>([]);
  const [existingChanneldata, setExistingChanneldata] = useState<string[]>([]);
  const [loadedFilter, setLoadedFilter] = useState<any>({});
  const { selectedPackage } = usePackage();
  const [repeatUser, setRepeatUser] = useState<UserData[]>([]);
  const [IPrepeat, setIPRepeat] = useState<IPData[]>([]);
  const [Serverfarm, setServerfarm] = useState<ServerData[]>([]);
  const [Botusers, setBotUser] = useState<Botuser[]>([]);
  const [VPNP, setVPNP] = useState<VPNData[]>([]);
  const [Invalidgeo, setInvalidgeo] = useState<GeoData[]>([]);
  const [Popunder, setPopunder] = useState<ChartDataItem[]>([]);
  const [ImpWindow, setImpWindow] = useState<WindowData[]>([]);
  const [currentPagep, setCurrentPagep] = useState(1);
  const [filteredData, setFilteredData] = useState<ServerData[]>();
  const [limitps, setLimitp] = useState(10);
  const [device_tyeI, setDevice_tyeI] = useState("desktop");
  const [device_tyeP, setDevice_tyeP] = useState("desktop");
  const [label_value, setlabel_value] = useState<string | null>(null);
  const [Repeatp, setRepeatp] = useState<string>("");
  const [Suspiciousp, setSuspiciousp] = useState<string>("");
  const [searchTermRU, setSearchTermRU] = useState("");
  const [IPPercentage, setIPPercentage] = useState<string>("");
  const [ServerPercentage, setServerPercentage] = useState<string>("");
  const [VPNPercentage, setVPNPercentage] = useState<string>("");
  const [GeoPercentage, setGeoPercentage] = useState<string>("");
  const [PopPercentage, setPopPercentage] = useState<string>("");
  const [ImpPercentage, setImpPercentage] = useState<string>("");
  const [TotalRecordRU, setTotalRecordRU] = useState<number>(0);
  const [ExportcsvRU, setExportcsvRU] = useState(false);
  const [ExportcsvSB, setExportcsvSB] = useState(false);
  const [ExportcsvIPRepeat, setExportcsvIPRepeat] = useState(false);
  const [ExportcsvSF, setExportcsvSF] = useState(false);
  const [ExportcsvVPN, setExportcsvVPN] = useState(false);
  const [ExportcsvIG, setExportcsvIG] = useState(false);
  const [ExportcsvPU, setExportcsvPU] = useState(false);
  const [ExportcsvIW, setExportcsvIW] = useState(false);
  const exportCsvRef = useRef(false);
  const [configInvalidGeo, setConfigInvalidGeo] = useState<ChartConfig>({});

  const [query, setQuery] = useState({
    publishers: ["all"],
    sub_publishers: ["all"],
    campaigns: ["all"],
    channels: ["all"],
    event_type: ["all"],
  });
  const isInitialLoad = useRef(true);
  const isFetched = useRef(false); // Prevent multiple fetch calls
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
  // Add new state for timeout

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
  const eventTypeFilterApi = useApiCall<FilterApiResponse>({
    url: process.env.NEXT_PUBLIC_WEB_PERF + Endpoint.EVENT_TYPE,
    method: "POST",
    params: {
      package_name: selectedPackage,
      start_date: startDate,
      end_date: endDate,
    },
    onSuccess: (data) => {
      setExistingEventTypedata(data);
      if (data?.data.length > 0) {

      }
  
    },
    onError: (error) => {

    },
  });

  const filter = React.useMemo(
    () => ({
      Publishers: {
        filters:
          existingPublisherdata?.map((publisher: string) => ({
            label: publisher,
            checked: query.publishers?.includes("all") ||
              query.publishers?.includes(publisher) ||
              !query.publishers, 
          })) || [],
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
      "Event Type": {
        filters:
          ExistingEventTypedata?.map((event_type: string) => ({
            label: event_type,
            checked: query.event_type?.includes("all") ||
              query.event_type?.includes(event_type) ||
              !query.event_type,
          })) || [],
        is_select_all: !query.event_type ||
          query.event_type.includes("all") ||
          query.event_type?.length === ExistingEventTypedata?.length,
        selected_count: query.event_type?.includes("all")
          ? ExistingEventTypedata?.length ?? 0
          : query.event_type?.length ?? ExistingEventTypedata?.length ?? 0,
        loading: false,
      },
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
      query.event_type,
    ]
  );
  const deepEqual = (arr1: any[], arr2: any[]) => {
    if (!Array.isArray(arr1) || !Array.isArray(arr2)) return false;
    if (arr1.length !== arr2.length) return false;

    return arr1.every((item, index) =>
      JSON.stringify(item) === JSON.stringify(arr2[index])
    );
  };


  //Repeated User
  const { result: RepeatedUser, loading: isLoadingRU } = useApiCall<Repeatuser>({
    url: process.env.NEXT_PUBLIC_WEB_PERF + Endpoint.REPEAT_USERS_TABLE,
    method: "POST",
    params: {
      package_name: selectedPackage,
      start_date: startDate,
      end_date: endDate,
      page: currentPagep,
      limit: limitps,
      search_term: searchTermRU,
      publishers: query.publishers,
      sub_publisher: query.sub_publishers,
      campaign: query.campaigns,
      channel: query.channels,
     // event_type: query.event_type,
      export: ExportcsvRU,
    },
    onSuccess: (response) => {
     
    if(ExportcsvRU && typeof response === 'string'){
      const rows = response.split('\n');
      const datas = rows.slice(1)
        .filter((row: string) => row.trim()) // Remove empty rows
        .map(row => {
          const values = row.split(',');
          return {
            device_signature: values[0],
            publisher_name: values[1],
            sub_publisher_name: values[2],
            visit: values[3],
          };
        });
        const exportHeaders = ["Device Signature", "Publisher Name", " Sub Publisher Name", "Visit"];
        const exportRows = datas.map(item => [
          item.device_signature,
          item.publisher_name,
          item.sub_publisher_name,
          item.visit
        ]);
        handleExportData(exportHeaders, exportRows, "RepeatUserData.csv");
        setExportcsvRU(false);
        return;
      }
      const data = response.data;
      if (Array.isArray(data)) {
        setRepeatUser([]);
        const updatedtop: UserData[] = data.map((topItem: any) => ({
          device_signature: topItem.device_signature,
          publisher_name: topItem.publisher_name,
          sub_publisher_name: topItem.sub_publisher_name,
          visit: topItem.visit,
        }))

        setRepeatUser([...updatedtop]);
        setRepeatp(response.device_repetition_percentage??"0%")

      }
      setTotalRecordRU(response.total_pages);
    },
    onError: (error) => {
      setRepeatUser([])
    },
  });

  //Suspicious Behaviour
  const { result: SuspiciousBehaviour, loading: isLoadingSuspiciousBehaviour } = useApiCall<SuspiciousB>({
    url: process.env.NEXT_PUBLIC_WEB_PERF + Endpoint.BOT_BEHAVIOUR,
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
      export: ExportcsvSB,
    },
    onSuccess: (response) => {
     if(ExportcsvSB && typeof response === 'string'){
      const rows = response.split('\n');
      const datas = rows.slice(1)
        .filter((row: string) => row.trim()) // Remove empty rows
        .map(row => {
          const values = row.split(',');
          return {
            device_type: values[0],
            count: values[1],
            percentage: values[2].replace(/b'|'|%/g, ''),
          };
        });
        const exportHeaders = ["Device Type", "Visit Count", "Percentage"];
        const exportRows = datas.map(item => [
          item.device_type,
          item.count,
          `${item.percentage}%`
        ]);
        handleExportData(exportHeaders, exportRows, "SuspiciousBehavior.csv");
        setExportcsvSB(false);
        return;
      }
      const data = response.data;
      if (Array.isArray(data)) {
        setBotUser([]);
        const updatedtop: Botuser[] = data.map((topItem: any) => ({
          label: topItem.device_type,
          visit: topItem.count,
          percentage: parseFloat(topItem.percentage.replace("%", "")),
          fill: chartConfigPiechart[topItem.device_type]?.color || '#000',

        }))
        if (ExportcsvSB) {
          const headers = ["Device Type", "Visit Count", "Percentage"];
          const rows = updatedtop.map(item => [item.label, item.visit, item.percentage]);
          handleExportData(headers, rows, "SuspiciousBehavior.csv");
          setExportcsvSB(false);
        }
     
        setBotUser([...updatedtop]);
        setSuspiciousp(response.suspicious_behaviour.bot_fraud_percentage??"0%");

      }
    },
    onError: (error) => {
      setBotUser([]);
    }
  })
  // Ip Repeat API call
  const { result: RepeatIP, loading: isLoadingRepeatIP } = useApiCall<IPResponse>({
    url: process.env.NEXT_PUBLIC_WEB_PERF + Endpoint.REPEAT_IP,
    method: "POST",
    params: {
      package_name: selectedPackage,
      start_date: startDate,
      end_date: endDate,
      publishers: query.publishers,
      sub_publisher: query.sub_publishers,
      campaign: query.campaigns,
      channel: query.channels,
      event_type: query.event_type,
      export: ExportcsvIPRepeat,
    },
    onSuccess: (response) => {
     
    if(ExportcsvIPRepeat && typeof response === 'string'){
      const rows = response.split('\n');
      const datas = rows.slice(1)
        .filter((row: string) => row.trim()) // Remove empty rows
        .map(row => {
          const values = row.split(',');
          return {
            ip_address: values[0],
            event_count: values[1],
            visit_count: values[2],
          };
        });
        const exportHeaders = ["IP Address", "Total Event", "Total Visit"];
        const exportRows = datas.map(item => [
          item.ip_address,
          item.event_count,
          item.visit_count
        ]);
        handleExportData(exportHeaders, exportRows, "RepeatIPData.csv");
        setExportcsvIPRepeat(false);
        return;
      }
      const data = response.data;

      if (Array.isArray(data)) {
        setIPRepeat([]);
        let updatedtop: IPData[] = data.map((entry: any) => ({
          label: entry.ip_address,
          "Total Event": entry.event_count,
          "Total Visit": entry.visit_count,
        }));
        
    
        setIPRepeat([...updatedtop]);

        // Ensure percentage always has % symbol
        const percentage = response.repeat_ip_percentage ?? "0%";
        setIPPercentage(percentage.endsWith("%") ? percentage : `${percentage}%`);
      }
    },
    onError: (error) => {
      setIPRepeat([]); // Also ensure error state shows 0%
    },
  });

  //Server Farm api
  const { result: ServerFarm, loading: isLoadingServerFarm } = useApiCall<ServerResponse>({
    url: process.env.NEXT_PUBLIC_WEB_PERF + Endpoint.HARDWARE_CONCURRENCY,
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
      export: ExportcsvSF,
    },
    onSuccess: (response) => {
      if(ExportcsvSF && typeof response === 'string'){
        const rows = response.split('\n');
        const datas = rows.slice(1)
          .filter((row: string) => row.trim()) // Remove empty rows
          .map(row => {
            const values = row.split(',');
            return {
              hardware_concurrency: values[0],
              total_count: values[1],
              desktop_count: values[2],
              mobile_count: values[3],
            };
          });
        const exportHeaders = ["Hardware Concurrency", "Total", "Desktop", "Mobile"];
        const exportRows = datas.map(item => [
          item.hardware_concurrency,
          item.total_count,
          item.desktop_count,
          item.mobile_count
        ]);
        handleExportData(exportHeaders, exportRows, "ServerFarmData.csv");
        setExportcsvSF(false);
        return;
      }
      const data = response.data;

      if (Array.isArray(data)) {
        setServerfarm([]);
        const newData: ServerData[] = data.map((item) => ({
          label: item.hardware_concurrency,
          Mobile: item.mobile_count,
          Desktop: item.desktop_count,
          Total: item.total_count,
        }));
        setServerfarm(newData);
        
        // Only set initial values if we have data and haven't done so yet
        if (!isFetched.current && newData.length > 0) {
          setlabel_value(newData[0].label);
          setFilteredData([newData[0]]);
          isFetched.current = true;
        } else {
          // Update filtered data based on current label_value
          const currentData = newData.filter(item => item.label === label_value);
          setFilteredData(currentData.length > 0 ? currentData : [newData[0]]);
        }
      }
      setServerPercentage(response.server_farm_percentage.server_farm_percentage ?? "0%");
    },
    onError: () => {
      setServerfarm([]);
      setFilteredData([]);
    }
  });
  const SELECT_ALL_LABELS = "All";

  const selectedOptionSF = useMemo(() => {
    setFilteredData([]);
    const uniqueLabels = new Set(Serverfarm.map((item) => item.label));
    return Array.from(uniqueLabels).concat(SELECT_ALL_LABELS);
  }, [JSON.stringify(Serverfarm)]); // ✅ Only recalculates if Serverfarm data changes

  useEffect(() => {
    if (Serverfarm.length > 0) {
      const firstLabel = Serverfarm[0].label;
      setlabel_value(firstLabel);
      handleLabelChangeSF(firstLabel); // ✅ call this instead
    } else {
      setFilteredData([]);
    }
  }, [Serverfarm]);

  const handleLabelChangeSF = useCallback((value: string) => {
    setlabel_value(value);
    setFilteredData(
      value === SELECT_ALL_LABELS ? Serverfarm : Serverfarm.filter((item) => item.label === value)
    );
  }, [Serverfarm]);

  //Vpn Proxy
  const { result: VPNProxy, loading: isLoadingVPNProxy } = useApiCall<VPNProxys>({
    url: process.env.NEXT_PUBLIC_WEB_PERF + Endpoint.VPN_PROXIES,
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
      export: ExportcsvVPN,
    },
    onSuccess: (response) => {
      if(ExportcsvVPN && typeof response === 'string'){
        const rows = response.split('\n');
        const datas = rows.slice(1)
          .filter((row: string) => row.trim()) // Remove empty rows
          .map(row => {
            const values = row.split(',');
            return {
              additional_fraud_desc: values[0],
              percentage: values[1].replace(/b'|'|%/g, ''),
            };
          });
        const exportHeaders = ["Additional Fraud Desc", "Visit %"];
        const exportRows = datas.map(item => [
          item.additional_fraud_desc,
          `${item.percentage}%`
        ]);
        handleExportData(exportHeaders, exportRows, "VPNProxyData.csv");
        setExportcsvVPN(false);
        return;
      }
      const data = response.data;

      // Check if data exists and is not empty
      if (!Array.isArray(data) || data.length === 0) {
        setVPNP([]);
        setVPNPercentage("0%");
        return;
      }

      const updatedtop: VPNData[] = data.map((topItem) => {
        const fraudDesc = topItem.additional_fraud_desc as keyof typeof chartConfigVPN;
        const visit = parseFloat(topItem.percentage.replace("%", "")); // Convert percentage string to number
        if (fraudDesc in chartConfigVPN) {
          return {
            label: fraudDesc,
            visit,
            fill: chartConfigVPN[fraudDesc].color,
          };
        }
        return {
          label: fraudDesc,
          visit,
          fill: "#000",
        };
      });

      setVPNP([...updatedtop]);
      // Check if vpn_proxy_percentage exists and has a value
      const percentage = response.vpn_proxy_percentage?.vpn_proxy_percentage;
      setVPNPercentage(percentage ? percentage : "0%");
    },
    onError: (error) => {
      setVPNP([]);
    }
  })

  //Invalid Geo api
  const generateColor = (index: number) => {
    const hue = (index * 137) % 360;
    return `hsl(${hue}, 70%, 50%)`;
  };
  
  const { result: InvalidGeo, loading: isLoadingInvalidGeo } = useApiCall<InvalidData>({
    url: process.env.NEXT_PUBLIC_WEB_PERF + Endpoint.INVALID_GEO,
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
      export: ExportcsvIG,
    },
    onSuccess: (response) => {
      if(ExportcsvIG && typeof response === 'string'){
        const rows = response.split('\n');
        const datas = rows.slice(1)
          .filter((row: string) => row.trim()) // Remove empty rows
          .map(row => {
            const values = row.split(',');
            return {
              country: values[0],
              fraud_count: values[1],
              fraud_percentage: values[2].replace(/b'|'|%/g, ''),
            };
          });
        const exportHeaders = ["Country", "Fraud Count", "Fraud %"];
        const exportRows = datas.map(item => [
          item.country,
          item.fraud_count,
          `${item.fraud_percentage}%`
        ]);
        handleExportData(exportHeaders, exportRows, "InvalidGeoData.csv");
        setExportcsvIG(false);
        return;
      }
      setInvalidgeo([]);
      const data = response.data;
      if (Array.isArray(data)) {
       
        // Create the config object
        const newConfig = data.reduce((acc, item, index) => {
          const color = generateColor(index);
          acc[item.country] = {
            label: item.country,
            color: color,
            fill: color
          };
          return acc;
        }, {} as ChartConfig);

        // Set the config state
        setConfigInvalidGeo(newConfig);

        const updatedtop: GeoData[] = data.map((topItem: any) => {
          const country = topItem.country;
          return {
            label: country,
            "Fraud %": parseFloat(topItem.fraud_percentage),
            "Fraud Count": topItem.fraud_count,
            fill: newConfig[country]?.color || "#000",
          };
        });
        setInvalidgeo(updatedtop);
        setGeoPercentage(response.invalid_geo_percentage.invalid_geo_percentage ?? "0%")
      }
    },
    onError: (error) => {
      setInvalidgeo([]);
    }
  })




  //fetch pop Under api
  const handleDeviceChangeP = (value: string) => {
    const deviceMap: { [key: string]: string } = {
      Desktop: "desktop",
      Mobile: "mobile"
    };

    setDevice_tyeP(deviceMap[value]);

  };
  const selectOptionsP = ["Desktop", "Mobile"];
  const { result: PopUnder, loading: isLoadingPop } = useApiCall<PopResponse>({
    url: process.env.NEXT_PUBLIC_WEB_PERF + Endpoint.POP_UNDER,
    method: "POST",
    params: {
      package_name: selectedPackage,
      start_date: startDate,
      end_date: endDate,
      publishers: query.publishers,
      sub_publisher: query.sub_publishers,
      campaign: query.campaigns,
      channel: query.channels,
      device_type: device_tyeP,
     // event_type: query.event_type,
      export: ExportcsvPU,

    },
    onSuccess: (response) => {
      if(ExportcsvPU && typeof response === 'string'){
        const rows = response.split('\n');
        const datas = rows.slice(1)
          .filter((row: string) => row.trim()) // Remove empty rows
          .map(row => {
            const values = row.split(',');
            return {
              screen_resolution: values[0]?.replace(/\r/g, ''),
              pop_under_percentage: values[1].replace(/\r/g, '').replace(/b'|'|%/g, ''),
            };
          });
        const exportHeaders = ["Screen Resolution", "PopUnder %"];
        const exportRows = datas.map(item => [
          item.screen_resolution,
          `${item.pop_under_percentage}%`
        ]);
        handleExportData(exportHeaders, exportRows, "PopUnderData.csv");
        setExportcsvPU(false);
        return;
      }
      setPopunder([]);
      const { standard, demandgen } = response;


      // Map the data to the desired format
      const chartData: ChartDataItem[] = [];

      // Map standard data
      standard.forEach((standardItem) => {
        const formattedLabel = standardItem.screen_resolution;

        const demandgenItem = demandgen.find(
          (item) => item.screen_resolution === standardItem.screen_resolution
        );

        chartData.push({
          label: formattedLabel,
          standard: standardItem.pop_under_percentage,
          demandgen: demandgenItem
            ? parseFloat(demandgenItem.pop_under_percentage.replace('%', ''))
            : 0,
        });
      });

      // Add any demandgen items that don't have a matching standard item
      demandgen.forEach((demandgenItem) => {
        if (!chartData.some((item) => item.label === demandgenItem.screen_resolution)) {
          chartData.push({
            label: demandgenItem.screen_resolution,
            standard: 0,
            demandgen: parseFloat(demandgenItem.pop_under_percentage.replace('%', '')) || 0,
          });
        }
      });

      setPopunder([...chartData]);

      setPopPercentage(response.pop_under_percentage.pop_under_percentage??"0%");
    },
    onError: (error) => {
      setPopunder([]);
    },
  });

  const selectOptionsI = ["Desktop", "Mobile"];
  const handleDeviceChangeI = (value: string) => {
    const deviceMap: { [key: string]: string } = {
      Desktop: "desktop",
      Mobile: "mobile"
    };
    setImpWindow([]);
    setDevice_tyeI(deviceMap[value]);
  };

  // Imperceptible Window API Call
  const { result: Imperceptiable, loading: isLoadingImp } = useApiCall<WindowResponse>({
    url: process.env.NEXT_PUBLIC_WEB_PERF + Endpoint.IFRAME_SIZE,
    method: "POST",
    params: {
      package_name: selectedPackage,
      start_date: startDate,
      end_date: endDate,
      publishers: query.publishers,
      sub_publisher: query.sub_publishers,
      campaign: query.campaigns,
      channel: query.channels,
      device_type: device_tyeI,
     // event_type: query.event_type,
      export: ExportcsvIW,

    },
    onSuccess: (response) => {
      if(ExportcsvIW && typeof response === 'string'){
        const rows = response.split('\n');
        const datas = rows.slice(1)
          .filter((row: string) => row.trim()) // Remove empty rows
          .map(row => {
            const values = row.split(',');
            console.log(values);
            return {
             hasIframe: values[1]?.replace(/^"|"$/g, ''),       
             count_hasIframe: values[2]?.replace(/^"|"$/g, ''), 
             device_type: values[3]?.replace(/\r/g, '').trim(),
            };
          });
        const exportHeaders = ["Iframe Count", "Iframe", "Device Type"];
        const exportRows = datas.map(item => [
          item.hasIframe,
          item.count_hasIframe,
          item.device_type
        ]);
        handleExportData(exportHeaders, exportRows, "ImpWindowData.csv");
        setExportcsvIW(false);
        return;
      }
     
      const data = response.data;
      setImpWindow([]);
      if (Array.isArray(data)) {
       
        let formattedData: any[] = [];
        const groupedData: any = {};

        // Process the data
        data.forEach((entry: any) => {
          const { device_type, count_hasIframe, hasIframe } = entry;
          // Filter the data based on selected device type
          if (device_type === device_tyeI) {
            if (!groupedData[hasIframe]) {
              groupedData[hasIframe] = {};
            }
            groupedData[hasIframe][device_type] = count_hasIframe;
          }
        });
        for (const [label, deviceData] of Object.entries(groupedData)) {
          formattedData.push({
            label: label,
            ...deviceData,
          });
        }
        setImpWindow([...formattedData]);
      }
      setImpPercentage(response.imperceptible_Window.percentage??"0%");
    },
    onError: (error) => {
      setImpWindow([]);
    },
  });

 // Update the handleFilterChange function
 const handleFilterChange = useCallback(
  async (newState: Record<string, any>) => {
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
          .map((f: any) => f.label),
      event_type: newState['Event Type']?.is_select_all
        ? ['all']
        : newState['Event Type']?.filters
          .filter((f: any) => f.checked)
          .map((f: any) => f.label),
    };

    setQuery(payload);
    const filtersChanged =
      !deepEqual(newState.Publishers?.filters || [], loadedFilter.Publishers?.filters || []) ||
      !deepEqual(newState['Sub Publishers']?.filters || [], loadedFilter['Sub Publishers']?.filters || []) ||
      !deepEqual(newState.Campaigns?.filters || [], loadedFilter.Campaigns?.filters || []) ||
      !deepEqual(newState.Channels?.filters || [], loadedFilter.Channels?.filters || []) ||
      !deepEqual(newState['Event Type']?.filters || [], loadedFilter['Event Type']?.filters || []);

    if (filtersChanged) {
      setLoadedFilter(newState);
    }
  },
  [loadedFilter]
);

  // Add this new function to fetch all APIs
  const fetchSBData = useCallback(() => {
    if ('mutate' in SuspiciousBehaviour) {
      SuspiciousBehaviour.mutate({});
    }
  }, [SuspiciousBehaviour]);
  const fetchRIData = useCallback(() => {
    if ('mutate' in RepeatIP) {
      RepeatIP.mutate({});
    }
  }, [RepeatIP]);
  const fetchVPNData = useCallback(() => {
    if ('mutate' in VPNProxy) {
      VPNProxy.mutate({});
    }
  }, [VPNProxy]);
  const fetchAIGData = useCallback(() => {
    if ('mutate' in InvalidGeo) {
      InvalidGeo.mutate({});
    }
  }, [InvalidGeo]);
  const fetchPopUnder = useCallback(() => {
    if ('mutate' in PopUnder) {
      PopUnder.mutate({});
    }
  }, [PopUnder]);
  const fetchRepeatUser = useCallback(() => {
    if ('mutate' in RepeatedUser) {
      RepeatedUser.mutate({});
    }
  }, [RepeatedUser]);

  // 2. Properly memoize the debounced version
  const debouncedFetchRepeatUser = useMemo(() => debounce(fetchRepeatUser, 200), [fetchRepeatUser]);

  const fetchImperceptiable = useCallback(() => {
    if ('mutate' in Imperceptiable) {
      Imperceptiable.mutate({});
    }
  }, [Imperceptiable]);

  const fetchServerFarm = useCallback(() => {
    if ('mutate' in ServerFarm) {
      ServerFarm.mutate({});
    }
  }, [ServerFarm, setFilteredData])

  //filter
  const fetchPublisher = useCallback(() => { if (publishersFilterApi.type === "mutation") { publishersFilterApi.result.mutate({}) } }, [publishersFilterApi]);
  const fetchSubPublisher = useCallback(() => { if (subPublishersFilterApi.type === "mutation") { subPublishersFilterApi.result.mutate({}) } }, [subPublishersFilterApi]);
  const fetchCampaign = useCallback(() => { if (campaignsFilterApi.type === "mutation") { campaignsFilterApi.result.mutate({}) } }, [campaignsFilterApi]);
  const fetchChannel = useCallback(() => { if (channelsFilterApi.type === "mutation") { channelsFilterApi.result.mutate({}) } }, [channelsFilterApi]);
  const fetchEventType = useCallback(() => { if (eventTypeFilterApi.type === "mutation") { eventTypeFilterApi.result.mutate({}) } }, [eventTypeFilterApi]);

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((term: string) => {
      setCurrentPagep(1); // Reset to first page on search
      setSearchTermRU(term);
    }, 1000), // 500ms delay
    []
  );


  // Effect for pagination and search in Repeat User table
  useEffect(() => {
    if (limitps || searchTermRU || currentPagep) {
      debouncedFetchRepeatUser(); // ✅ Flag Repeat User Table for update
    }
  }, [limitps, searchTermRU, currentPagep]);


  // Effect for device type change for Pop Under
  useEffect(() => {
    if (device_tyeP) {
      setExportcsvIW(false);
      fetchPopUnder();
    }
  }, [device_tyeP]);

  // Effect for device type change for Imperceptible Window
  useEffect(() => {
    if (device_tyeI) {
      setExportcsvIW(false);
      fetchImperceptiable();
    }
  }, [device_tyeI]);

  // Separate effect for handling exports
  useEffect(() => {
    if (ExportcsvSB) {
      fetchSBData();
    }},[ExportcsvSB]);
    useEffect(() => {
     if (ExportcsvIPRepeat) {
      fetchRIData();
    }},[ExportcsvIPRepeat]);
    useEffect(() => {
     if (ExportcsvIW) {
      fetchImperceptiable();
    }},[ExportcsvIW]);
    useEffect(() => {
     if (ExportcsvPU) {
      fetchPopUnder();
    }},[ExportcsvPU]);
    useEffect(() => {
     if (ExportcsvVPN) {
      fetchVPNData();
    }},[ExportcsvVPN]);
    useEffect(() => {
     if (ExportcsvIG) {
      fetchAIGData();
    }},[ExportcsvIG]);
    useEffect(() => {
     if (ExportcsvRU) {
      fetchRepeatUser();
    }},[ExportcsvRU]);
    useEffect(() => {
     if (ExportcsvSF) {
      fetchServerFarm();
    }},[ExportcsvSF]);
    
  // Define fetchAllData function
  const fetchAllData = useCallback(() => {
    fetchPublisher();
    fetchSubPublisher();
    fetchCampaign();
    fetchChannel();
   // fetchEventType();
    fetchSBData();
    fetchRIData();
    fetchVPNData();
    fetchAIGData();
    fetchRepeatUser();
    fetchPopUnder();
    fetchImperceptiable();
    fetchServerFarm();
  }, []);

  useEffect(() => {
    if (selectedPackage && startDate && endDate) {
      fetchAllData();
      isInitialLoad.current = false;
    }
  }, [selectedPackage, startDate, endDate]);

  // Effect for filter changes - matches overall-summary page
  useEffect(() => {
    if (selectedPackage && loadedFilter && Object.keys(loadedFilter).length > 0) {
      fetchAllData();
    }
  }, [loadedFilter, selectedPackage]);


  return (
    <div className='grid gap-2 w-full'>
      <div className="sticky top-0 z-[50] sm:z-[40] w-full flex flex-cols-4 flex-wrap items-center justify-start gap-4 rounded-md bg-background px-5 py-2">
        <Filter filter={filter} onChange={handleFilterChange} />
      </div>
      <div className="gap-1 w-full">
        <div className='w-full bg-gray-200 text-sub-header font-semibold grid justify-items-center sm:text-body p-2'>Invalid Traffic(SIVT)</div>
        <div className=" grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2  sm:grid-cols-1 w-full gap-2 min-h-[140px] ">
          <Card ref={(el) => (cardRefs.current["Repeat_User"] = el!)} className='p-2 lg:h-[375px] md:h-[420px] sm:h-[480px] xs:h-[500px]'>
            <HeaderRow
              title={`Repeated User: ${Repeatp}`}
              onExport={() => onExport("png", "Repeated User", "Repeat_User")}
              onExpand={() => handleExpand("Repeat_User")}
              isRadioButton={false}
              isSelect={false}
              handleExport={() => {
                setExportcsvRU(true);
              }}
            />
            <ResizableTable
              isPaginated={true}
              columns={RepeatUser}
              data={ repeatUser}
              isLoading={isLoadingRU}
              headerColor="#DCDCDC"
              height={210}
              isEdit={false}
              isSearchable={true}
              SearchTerm={searchTermRU}
              setSearchTerm={(term: string) => {
                debouncedSearch(term);
              }}
              onLimitChange={(newLimit: number) => {
                setLimitp(newLimit);
                setCurrentPagep(1);
              }}
              onPageChangeP={(newPage: number) => {
                setCurrentPagep(newPage);
              }}
              pageNo={currentPagep}
              totalPages={TotalRecordRU}
            />
          </Card>
          <Card ref={(el) => (cardRefs.current["Suspicious_Behaviour"] = el!)} className='p-2  lg:h-[375px] md:h-[420px] sm:h-[480px] xs:h-[500px] md:overflow-x-auto  scrollbar '>
            {/* <PieCharts
              chartData={Botusers}
              chartConfig={chartConfigPiechart}
              title={`Suspicious Behaviour: ${Suspiciousp}`}
              onExport={() => onExport("png", "Suspicious Behaviour %", 1)}
              onExpand={() => handleExpand(1)}
              isSelect={false}
              piechartitle="Bot Behaviour %"
              isLoading={isLoading}
              InformCard={InformSuspicous}
              isLoading={isLoading}
              datavalue="percentage"
            /> */}

            <HorizontalVerticalBarChart
              chartData={Botusers}
              chartConfig={chartConfigPiechart}
              title={`Suspicious Behaviour: ${Suspiciousp}`}
              onExport={() => onExport("png", "Suspicious Behaviour", "Suspicious_Behaviour")}
              onExpand={() => handleExpand("Suspicious_Behaviour")}
              handleExport={() => {
                setExportcsvSB(true);
              }}
              isSelect={false}
              BarchartTitle="Bot Behaviour %"
              isHorizontal={false}
              isLoading={isLoadingSuspiciousBehaviour}
              InformCard={InformSuspicous}
              formatterType="percentage"
              isRadioButton={false}
              dataKey="percentage"
              namekeys='label'
              position='top'
              barsize={35}
              setheight="300px"
              isPercentage={true}

            />

          </Card>
          <Card ref={(el) => (cardRefs.current["Ip_Repeat"] = el!)}>
            <CardContent className='overflow-x-auto scrollbar'>
              <DynamicBarChart
                data={IPrepeat}
                config={chartConfigIpReport}
                title={`IP Repeat: ${IPPercentage}`}
                isSelect={false}
                handleExport={() => {
                  setExportcsvIPRepeat(true);
                }}
                isLoading={isLoadingRepeatIP}
                isRadioButton={false}
                onExport={() => onExport("png", "IP Repeat", "Ip_Repeat")}
                onExpand={() => handleExpand("Ip_Repeat")}
                isHorizontal={true}
                dynamicTitle="Repeat IPs"
                formatterType="number"
                isPercentage={false}

              />
            </CardContent>
          </Card>
          <Card ref={(el) => (cardRefs.current["Server_Fram"] = el!)}>
            <CardContent className='overflow-x-auto scrollbar'>
              <DynamicBarChart
                data={filteredData}
                config={chartConfigServerFarm}
                title={`Server Farm: ${ServerPercentage}`}
                isLoading={isLoadingServerFarm}
                handleExport={() => {
                  setExportcsvSF(true);
                }}
                isRadioButton={false}
                onExport={() => onExport("png", " Server Farm", "Server_Fram")}
                onExpand={() => handleExpand("Server_Fram")}
                isHorizontal={true}
                dynamicTitle="Hardware Concurrency %"
                formatterType="number"
                AxisLabel="Number"
                isSelect={true}
                selectoptions={selectedOptionSF}
                placeholder={label_value ?? undefined}
                handleFrequencyChange={handleLabelChangeSF}
                selectedFrequency={label_value ?? undefined}
                width="220px"
                isPercentage={false}
              />
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="gap-1 w-full">
        <div className='w-full bg-gray-200 text-sub-header font-semibold grid justify-items-center sm:text-body p-2'>Compliance Issues</div>
        <div className=" grid grid-cols-1 lg:grid-cols-3 md:grid-cols-3  sm:grid-cols-1 w-full gap-2 min-h-[140px]">
          <Card ref={(el) => (cardRefs.current["VPN_Proxy"] = el!)} className='p-2 w-full h-[320px] overflow-hidden '>
            <DonutChart
              chartData={VPNP}
              chartConfig={chartConfigVPN}
              onExport={() => onExport("png", " VPN Proxy", "VPN_Proxy")}
              onExpand={() => handleExpand("VPN_Proxy")}
              title={`VPN Proxy (DCH): ${VPNPercentage}`}
              isLoading={isLoadingVPNProxy}
              DonutTitle="VPN Proxies %"
              handleExport={() => {
                setExportcsvVPN(true);
              }}
              dataKey="visit"
              nameKey="label"
              isView={false}
              isPercentageValue={false}
              isLabelist={false}
              marginTop='mt-0'
              position='items-center'
              isPercentage={true}
              istotalvistors={false}
            />
          </Card>
          <Card ref={(el) => (cardRefs.current["Invalid_geo"] = el!)} className='p-2 w-full  col-span-2 h-[320px] overflow-hidden' >
            <HorizontalVerticalBarChart
              chartData={Invalidgeo}
              chartConfig={configInvalidGeo}
              title={`Invalid Geo: ${GeoPercentage}`}
              onExport={() => onExport("png", " Invalid Geo", "Invalid_geo")}
              onExpand={() => handleExpand("Invalid_geo")}
              BarchartTitle="Invalid Geo %"
              handleExport={() => {
                setExportcsvIG(true);
              }}
              isHorizontal={true}
              isLoading={isLoadingInvalidGeo}
              formatterType="percentage"
              position='right'
              isRadioButton={false}
              isSelect={false}
              dataKey="Fraud %"
              barsize={10}
              setheight="250px"
              isPercentage={true}

            />
          </Card>
        </div>
      </div>
      <div className="gap-1 w-full">
        <div className='w-full bg-gray-200 text-sub-header font-semibold grid justify-items-center sm:text-body p-2'>Low Intent User</div>
        <div className=" grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2  sm:grid-cols-1 w-full gap-2 min-h-[140px]">
          <Card ref={(el) => (cardRefs.current["POP_UNDER"] = el!)} className='p-2 w-full overflow-y-auto scrollbar '>
            <DoubleLineChart
              chartData={Popunder}
              chartConfig={chartConfigPopUnder}
              handleExport={() => {
                exportCsvRef.current = true;
                setExportcsvPU(true);
              }}
              title={`Pop Under: ${PopPercentage}`}
              onExport={() => onExport("png", " Pop Under", "POP_UNDER")}
              onExpand={() => handleExpand("POP_UNDER")}
              // LinechartTitle="Device Type:Moblie"
              isRadioButton={false}
              isLoading={isLoadingPop}
              isSelect={true}
              AxisLabel="Percentage"
              InformCard={InformPopUnder}
              selectoptions={selectOptionsP}
              handleFrequencyChange={handleDeviceChangeP}
              selectedFrequency={device_tyeP}
              isInformCard={true}
              placeholder="Desktop"
              isPercentage={true}

            />
          </Card>
          <Card ref={(el) => (cardRefs.current["Imp_window"] = el!)} className='p-2 overflow-y-auto scrollbar '>
            <StackedBarChart
              chartData={ImpWindow}
              chartConfig={chartConfigWindow}
              selectoptions={selectOptionsI}
              handleExport={() => {
                exportCsvRef.current = true;
                setExportcsvIW(true);
              }}
              title={`Imperceptiable Window: ${ImpPercentage}`}
              onExport={() => onExport("png", "Imperceptiable Window", "Imp_window")}
              onExpand={() => handleExpand("Imp_window")}
              isRadioButton={false}
              isSelect={true}
              isLoading={isLoadingImp}
              handleFrequencyChange={handleDeviceChangeI}
              selectedFrequency={device_tyeI}
              AxisLabel="Percentage"
              InformCard={InformWindow}
              isInformCard={true}
              yAxis={yAxisConfig}
              layoutDirection="flex-col"
              isLegend={true}
              ischangeLegend={false}
              placeholder="Desktop"
              isCartesian={false}
              xAxis={xAxisConfigstack}

            />
          </Card>
        </div>
      </div>
    </div>
  );
}
export default Analysis_insights;