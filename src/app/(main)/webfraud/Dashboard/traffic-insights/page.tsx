"use client"
import React, { useMemo } from 'react';
import RadialBar from '@/components/mf/charts/RadialChart';
import StackedBarChart from '@/components/mf/charts/stackedBarChart';
//import { ChartConfig } from '@/components/ui/chart';
import { onExpand, downloadURI, parsePercentage, debounce, handleExportData } from '@/lib/utils';
import { useCallback, useRef, useState, useEffect } from 'react';
import domToImage from "dom-to-image";
import { Card } from '@/components/ui/card';
import DynamicBarChart from '@/components/mf/charts/DynamicBarChart';
import HorizontalVerticalBarChart from '@/components/mf/charts/HorizontalVerticalBarChart';
import { useApiCall } from "../../queries/api_base";
import { usePackage } from "@/components/mf/PackageContext";
import { Filter } from "@/components/mf/Filters";
import { useDateRange } from "@/components/mf/DateRangeContext";
import Endpoint from '../../common/endpoint';
import { useLoading } from '@/components/mf/LoadingContext';

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
//TrafficContributor
interface TrafficContributor {
  data: any;
  label: string;
  "Visit %": number;
  "Conversion %": number;
  Conversion_type: string;

}
//TopContributor
interface TopContributor {
  label: string;
  "Visit %": number;
  "Event %": number;
}
//Visit & eventConcentration
interface VisitEventData {
  label: string;
   total:number;
  percentage: number | string;
  fill: string;
  [key: string]: string | number;
}

interface ChartConfig {
  [key: string]: {
    label: string;
    color: string;
  };
}

// Add type for API response
interface FilterApiResponse {
  data: string[];
  isLoading: boolean;
}

type UserIntentData  = {
  label: string;
  "Visit %": number;
  "Event %": number;
} | null;

const chartConfigR = {
  "Visit %": {
    label: "Visit %",
    color: "#A55B4B",
  },
  "Event %": {
    label: "Event %",
    color: "#27548A",
  },
} satisfies ChartConfig

//Traffic contributor

const chartConfigTC = {
  "Visit %": {
    label: "Visit %",
    color: "#A55B4B",
  },
  "Conversion %": {
    label: "Conversion %",
    color: "#F7374F",
  },
} satisfies ChartConfig

//Top Contributor
const chartConfigTopC = {
  "Visit %": {
    label: "Visits %",
    color: "#A55B4B",
  },
  "Event %": {
    label: "Events %",
    color: "#27548A",
  },
} satisfies ChartConfig
const Traffic_insights = () => {
  const cardRefs = useRef<Record<string, HTMLElement | null>>({});
  const { startDate, endDate } = useDateRange();
  const [existingPublisherdata, setExistingPublisherdata] = useState<string[]>([]);
  const [existingSubPublisherdata, setExistingSubPublisherdata] = useState<string[]>([]);
  const [existingCampaigndata, setExistingCampaigndata] = useState<string[]>([]);
  const [existingChanneldata, setExistingChanneldata] = useState<string[]>([]);
  const [ExistingEventTypedata, setExistingEventTypedata] = useState<string[]>([]);
  const [TrafficContribution, setTrafficContribution] = useState<string[]>([]);
  const [TopContribution, setTopContribution] = useState<string[]>([]);
  const [highIntent, setHighIntent] = useState<UserIntentData | null>(null);
  const [mediumIntent, setMediumIntent] = useState<UserIntentData | null>(null);
  const [lowIntent, setLowIntent] = useState<UserIntentData | null>(null);
  const [highDevice, setHighDevice] = useState<UserIntentData | null>(null);
  const [mediumDevice, setMediumDevice] = useState<UserIntentData | null>(null);
  const [lowDevice, setLowDevice] = useState<UserIntentData | null>(null);
  const [VisitC, setVisitC] = useState<string[]>([]);
  const [EventC, setEventC] = useState<string[]>([]);
  const [loadedFilter, setLoadedFilter] = useState<any>({});
  const [ExportcsvEC, setExportcsvEC] = useState(false);
  const [ExportcsvTC, setExportcsvTC] = useState(false);
  const [ExportcsvOSVersion, setExportcsvOSVersion] = useState(false);
  const [ExportcsvVC, setExportcsvVC] = useState(false);
  const { selectedPackage } = usePackage();
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [ConfigVistC,setConfigVistC] = useState<ChartConfig>({});
  const[ConfigEventC,setConfigEventC] = useState<ChartConfig>({});

  const [query, setQuery] = useState({
    publishers: ["all"],
    sub_publishers: ["all"],
    campaigns: ["all"],
    channels: ["all"],
    event_type: ["all"],
  });
  const isInitialMount = useRef(true);

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

  //user intent
  const { result: UserIntentApi, loading: isLoadingUserIntent } = useApiCall<UserIntentData>({
    url: process.env.NEXT_PUBLIC_WEB_PERF + Endpoint.USER_INTENT,
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
    },
    onSuccess: (response) => {
      setLowIntent(null);
      setHighIntent(null);
      setMediumIntent(null);
      if (Array.isArray(response)) {
        const highIntentData = response.find((item: any) => item.intent_status === "High_Intent");
        const mediumIntentData = response.find((item: any) => item.intent_status === "Medium_Intent");
        const lowIntentData = response.find((item: any) => item.intent_status === "Low_Intent");
        
        // Prepare data for High Intent
        const highIntentDetails = highIntentData ? {
          label: highIntentData.intent_status,
          "Visit %": parsePercentage(highIntentData.visit_percentage),
          "Event %": parsePercentage(highIntentData.event_percentage),
        } : null;
        setHighIntent(highIntentDetails);

        // Prepare data for Medium Intent
        const mediumIntentDetails = mediumIntentData ? {
          label: mediumIntentData.intent_status,
          "Visit %": parsePercentage(mediumIntentData.visit_percentage),
          "Event %": parsePercentage(mediumIntentData.event_percentage),
        } : null;
        setMediumIntent(mediumIntentDetails);

        // Prepare data for Low Intent
        const lowIntentDetails = lowIntentData ? {
          label: lowIntentData.intent_status,
          "Visit %": parsePercentage(lowIntentData.visit_percentage),
          "Event %": parsePercentage(lowIntentData.event_percentage),
        } : null;
        setLowIntent(lowIntentDetails);
      }

     
    },
    onError: (error) => {
      setLowIntent(null);
      setHighIntent(null);
      setMediumIntent(null);
    },
  })

  //Traffic Contributor
  const { result: TrafficCApi, loading: isLoadingTrafficC } = useApiCall<TrafficContributor>({
    url: process.env.NEXT_PUBLIC_WEB_PERF + Endpoint.TRAFFIC_CONTRIBUTION,
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
      export: ExportcsvTC,
    },
    onSuccess: (response) => {
      
      // Handle CSV response when export is true
      if (ExportcsvTC && typeof response === 'string') {
        // Parse CSV string into array
        const rows = response.split('\n');
        const data = rows.slice(1)
          .filter((row: string) => row.trim()) // Remove empty rows
          .map(row => {
            const values = row.split(',');
            return {
              device_type: values[0],
              visit_percentage: values[1].replace(/b'|'|%/g, ''),
              conversion_percentage: values[2].replace(/b'|'|%/g, ''),
              conversion_type: values[3]?.trim()
            };
          });

        // Create export format
        const exportHeaders = ["Device Type", "Visit %", "Conversion %", "Conversion Type"];
        const exportRows = data.map(item => [
          item.device_type,
          `${item.visit_percentage}%`,
          `${item.conversion_percentage}%`,
          item.conversion_type
        ]);

        handleExportData(exportHeaders, exportRows, "TrafficContributor.csv");
        setExportcsvTC(false);
        return;
      }

      // Handle normal JSON response
      if (Array.isArray(response)) {
        setTrafficContribution([]);

        const updatedtop = response.map((items: any) => ({
          label: items.device_type,
          "Visit %": parsePercentage(items.visit_percentage),
          "Conversion %": parsePercentage(items.conversion_percentage),
          Conversion_type: items.conversion_type,
        }));
        
        setTrafficContribution([...updatedtop]);
      }
    },
    onError: (error) => {
      console.error("API Error:", error);
      setTrafficContribution([]);

    },
  })
  //Top contributing os version
  const { result: TopCApi, loading: isLoadingTopC } = useApiCall<TopContributor>({
    url: process.env.NEXT_PUBLIC_WEB_PERF + Endpoint.TOP_CONTRIBUTING_OS_VERSIONS,
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
      export: ExportcsvOSVersion,
    },
    onSuccess: (response) => {
     
        // Handle CSV response when export is true
        if (ExportcsvOSVersion && typeof response === 'string') {
          // Parse CSV string into array
          const rows = response.split('\n');
          const data = rows.slice(1)
            .filter((row: string) => row.trim()) // Remove empty rows
            .map(row => {
              const values = row.split(',');
              return {
                ua_os: values[0],
                event_percentage: values[1].replace(/b'|'|%/g, ''),
                visit_percentage: values[2].replace(/b'|'|%/g, ''),
              };
            });

          // Create export format
          const exportHeaders = ["OS Version", "Event %","Visit %"];
          const exportRows = data.map(item => [
            item.ua_os,
            `${item.event_percentage}%`,
            `${item.visit_percentage}%`
            
          ]);

          handleExportData(exportHeaders, exportRows, "OSVersionData.csv");
          setExportcsvOSVersion(false);
          return;
        }
        
      if (Array.isArray(response)) {
        setTopContribution([]);
        const updatedtop = response.map((items: any) => {
          return {
            label: items.ua_os,
            "Visit %": parsePercentage(items.visit_percentage),
            "Event %": parsePercentage(items.event_percentage),
          }
        });
        setTopContribution([...updatedtop])
      }
    },
    onError: (error) => {
      setTopContribution([]);
    },
  })

  //Device Concentration Api
  const { result: DeviceConcentrationApi, loading: isLoadingDeviceConcentrationApi } = useApiCall<UserIntentData>({
    url: process.env.NEXT_PUBLIC_WEB_PERF + Endpoint.DEVICE_CONCENTRATION,
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
    },
    onSuccess: (response) => {
      // Reset all states first
      setLowDevice(null);
      setHighDevice(null);
      setMediumDevice(null);

      // Check if response is empty or invalid
      if (!Array.isArray(response) || response.length === 0) {
        return;
      }

      const highData = response.find((item: any) => item.device_status === "High");
      const mediumData = response.find((item: any) => item.device_status === "Medium");
      const lowData = response.find((item: any) => item.device_status === "Low");

      // Set data for each category, using null if not found
      setHighDevice(highData ? {
        label: highData.device_status,
        "Visit %": parsePercentage(highData.visit_percentage),
        "Event %": parsePercentage(highData.event_percentage),
      } : null);

      setMediumDevice(mediumData ? {
        label: mediumData.device_status,
        "Visit %": parsePercentage(mediumData.visit_percentage),
        "Event %": parsePercentage(mediumData.event_percentage),
      } : null);

      setLowDevice(lowData ? {
        label: lowData.device_status,
        "Visit %": parsePercentage(lowData.visit_percentage),
        "Event %": parsePercentage(lowData.event_percentage),
      } : null);
    },
    onError: (error) => {
      // Reset states on error
      setLowDevice(null);
      setHighDevice(null);
      setMediumDevice(null);
    },
  })
  const generateColorV = (index: number) => {
    const hue = (index * 125) % 360;
    return `hsl(${hue}, 40%, 50%)`;
  };
  //Visit Concentration api
  const { result: VisitCAPI, loading: isLoadingVisitC } = useApiCall<VisitEventData>({
    url: process.env.NEXT_PUBLIC_WEB_PERF + Endpoint.STATE_VISIT,
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
      export: ExportcsvVC,
    },
    onSuccess: (response) => {
      
      if(ExportcsvVC && typeof response === 'string'){
        const rows = response.split('\n');
        const data = rows.slice(1)
          .filter((row: string) => row.trim())
          .map(row => {
            const values = row.split(',');
            return {
              state: values[0],
              total_visits: values[1],
              percentage: values[2].replace(/b'|'|%/g, ''),
              
            };
          });
          const exportheaders = ["State",  "Total Visits","Percentage"];
        const exportrows = data.map(item => [
          item.state,
          item.total_visits,
          `${item.percentage}%`
        ]);
        handleExportData(exportheaders, exportrows, "VisitConcentration.csv");
        setExportcsvVC(false);
        return;
      }
      if (Array.isArray(response)) {
        setVisitC([]);
        // Create a new config object with colors first
        const colorConfig = response.reduce((acc, item, index) => {
          const color = generateColorV(index);
          // Use the state value as the key
          acc[item.state] = {
            label: item.state,
            color: color
          };
          return acc;
        }, {} as ChartConfig);

        // Set the config state
        setConfigVistC(colorConfig);

        // Map the data with colors from the config
        const updatedData = response.map((item, index) => {
          const color = generateColorV(index); // Generate color directly
          return {
            label: item.state,
            percentage: parsePercentage(item.percentage),
            total:item.total_visits,
            fill: color,
            color: color
          };
        });
        // Update the state with new data
        setVisitC([...updatedData]);
      }
    },
    onError: (error) => {
      setVisitC([]);
    }
  })

  const generateColorE = (index: number) => {
    const hue = (index * 107) % 360;
    return `hsl(${hue}, 90%, 60%)`;
  };

  //Event Concentration api
  const { result: EventCAPI, loading: isLoadingEventC } = useApiCall<VisitEventData>({
    url: process.env.NEXT_PUBLIC_WEB_PERF + Endpoint.STATE_EVENT,
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
      export: ExportcsvEC,
    },
    onSuccess: (response) => {
      
      if(ExportcsvEC && typeof response === 'string'){
     const rows = response.split('\n');
     const data = rows.slice(1)
        .filter(row => row.trim()) // Remove empty rows
        .map(row => {
          const values = row.split(',');
          return {
            state: values[0],
            total_events: values[1],
            percentage: values[2].replace(/b'|'|%/g, ''),
          };
        });
        const exportheaders = ["State","Total Events" ,"Percentage"];
        const exportrows = data.map(item => [
          item.state,
          item.total_events,
          `${item.percentage}%`
        ]);
        handleExportData(exportheaders, exportrows, "EventConcentration.csv");
        setExportcsvEC(false);

        return;
      }
        if (Array.isArray(response)) {
        setEventC([]);
        // First create the color configuration
        const colorConfig = response.reduce((acc, item, index) => {
          const color = generateColorE(index);
          acc[item.ip_country] = {
            label: item.ip_country,
            color: color
          };
          return acc;
        }, {} as ChartConfig);

        // Set the config state
        setConfigEventC(colorConfig);
        
        // Map the data with colors
        const updatedtop = response.map((topItem: any, index: number) => {
          const state = topItem.ip_country;
          const color = generateColorE(index);
          return {
            label: state,
            percentage: parsePercentage(topItem.percentage),
            total:topItem.total_events,
            fill: color,
            color: color
          };
        });
      
        setEventC([...updatedtop]);
      }
    },
    onError: (error) => {
      setEventC([]);
    }
  })


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
  //filter 
  const fetchPublisher = useCallback(() => { if (publishersFilterApi.type === "mutation") { publishersFilterApi.result.mutate({}) } }, [publishersFilterApi]);
  const fetchSubPublisher = useCallback(() => { if (subPublishersFilterApi.type === "mutation") { subPublishersFilterApi.result.mutate({}) } }, [subPublishersFilterApi]);
  const fetchCampaign = useCallback(() => { if (campaignsFilterApi.type === "mutation") { campaignsFilterApi.result.mutate({}) } }, [campaignsFilterApi]);
  const fetchChannel = useCallback(() => { if (channelsFilterApi.type === "mutation") { channelsFilterApi.result.mutate({}) } }, [channelsFilterApi]);
  const fetchEventType = useCallback(() => { if (eventTypeFilterApi.type === "mutation") { eventTypeFilterApi.result.mutate({}) } }, [eventTypeFilterApi]);
  // Add this new function to fetch all APIs
  const fetchTCData = useCallback(() => { if ('mutate' in TrafficCApi) { TrafficCApi.mutate({}) } }, [TrafficCApi]);
  const fetchTopData = useCallback(() => { if ('mutate' in TopCApi) { TopCApi.mutate({}) } }, [TopCApi]);
  const fetchVData = useCallback(() => { if ('mutate' in VisitCAPI) { VisitCAPI.mutate({}) } }, [VisitCAPI]);
  const fetchECData = useCallback(() => { if ('mutate' in EventCAPI) { EventCAPI.mutate({}) } }, [EventCAPI]);
  const fetchUIData = useCallback(() => { if ('mutate' in UserIntentApi) { UserIntentApi.mutate({}) } }, [UserIntentApi]);
  const fetchDCData = useCallback(() => { if ('mutate' in DeviceConcentrationApi) { DeviceConcentrationApi.mutate({}) } }, [DeviceConcentrationApi]);


  // Simplified triggerAPIs without the skipNextAPICall logic
  const triggerAPIs = useCallback(
    debounce(async () => {
      if (!selectedPackage) return;

      try {
        await Promise.all([
          fetchPublisher(),
          fetchSubPublisher(),
          fetchCampaign(),
          fetchChannel(),
          fetchEventType(),
          fetchUIData(),
          fetchECData(),
          fetchTopData(),
          fetchVData(),
          fetchTCData(),
          fetchDCData(),
        ]);
      } catch (error) {
      }
    }, 300), // Increased debounce time to 300ms
    [
      fetchPublisher,
      fetchSubPublisher,
      fetchCampaign,
      fetchChannel,
      fetchEventType,
      fetchUIData,
      fetchECData,
      fetchTopData,
      fetchVData,
      fetchTCData,
      fetchDCData,
    ]
  );

  const handleFilterChange = useCallback(
    async (newState: Record<string, any>) => {
      console.log("🔄 New State after filter change:", newState);

      const payload = {
        publishers: newState.Publishers?.is_select_all
          ? ["all"]
          : newState.Publishers?.filters
            .filter((f: any) => f.checked)
            .map((f: any) => f.label),
        sub_publishers: newState["Sub Publishers"]?.is_select_all
          ? ["all"]
          : newState["Sub Publishers"]?.filters
            .filter((f: any) => f.checked)
            .map((f: any) => f.label),
        campaigns: newState.Campaigns?.is_select_all
          ? ["all"]
          : newState.Campaigns?.filters
            .filter((f: any) => f.checked)
            .map((f: any) => f.label),
        channels: newState.Channels?.is_select_all
          ? ["all"]
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
        !deepEqual(
          newState.Publishers?.filters || [],
          loadedFilter.Publishers?.filters || []
        ) ||
        !deepEqual(
          newState["Sub Publishers"]?.filters || [],
          loadedFilter["Sub Publishers"]?.filters || []
        ) ||
        !deepEqual(
          newState.Campaigns?.filters || [],
          loadedFilter.Campaigns?.filters || []
        ) ||
        !deepEqual(
          newState.Channels?.filters || [],
          loadedFilter.Channels?.filters || []
        ) ||
        !deepEqual(
          newState['Event Type']?.filters || [],
          loadedFilter['Event Type']?.filters || []
        );

      if (filtersChanged) {
        console.log("✅ Filters changed, triggering API...");
        setLoadedFilter(newState);
        triggerAPIs(); // Trigger API immediately
      } else {
        //console.log("🔕 No change in filters, skipping API.");
      }
    },
    [loadedFilter, triggerAPIs]
  );

  useEffect(() => {
    if (!selectedPackage || !startDate || !endDate) return;

    //if (isInitialMount.current) {
    // isInitialMount.current = false;
    triggerAPIs();
    // }
  }, [selectedPackage, startDate, endDate]);

  // Separate effect for filter changes
  useEffect(() => {
    if (!isInitialMount.current && selectedPackage) {
      triggerAPIs();
    }
  }, [loadedFilter, selectedPackage]);
  
  useEffect(() => {
    if (ExportcsvTC) { 
      fetchTCData();
    }
  }, [ExportcsvTC]);

    useEffect(() => {
    if (ExportcsvEC) {
      fetchECData();
    }},[ExportcsvEC])

    useEffect(() => {
    if (ExportcsvOSVersion) {
      fetchTopData();

    }},[ExportcsvOSVersion])

    useEffect(() => {
    if (ExportcsvVC) {
      fetchVData();
    }
  }, [ ExportcsvVC]);

  const yAxisConfigV = {
    dataKey: "label",
  };

  return (
    <div className='grid gap-2'>
      <div className="container sticky top-0 z-50 flex max-w-full items-center justify-start gap-2 rounded-md bg-background px-5 py-1 sm:flex-col-2 md:flex-col-2">
        <Filter filter={filter} onChange={handleFilterChange} />
      </div>
      <div className="gap-1 w-full">
        <div className='w-full bg-gray-200 text-sub-header font-semibold grid justify-items-center sm:text-body p-2'>User Intent</div>
        <div className='grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 md:grid-cols-2 w-full gap-2 '>
          <Card className='min-h-[200px]'>
            <RadialBar
              chartData={highIntent ? [{ ...highIntent }] : []} // Pass the highIntent object directly
              chartConfig={chartConfigR}
              Device={highIntent?.label || "High Intent User"}
              Vname="Visits"
              Vvalue={highIntent?.["Visit %"] || 0}
              Oname="Events"
              Ovalue={highIntent?.["Event %"] || 0}
              textcolors="#2a9d90"
              value1='Visit %'
              value2='Event %'
              isLoading={isLoadingUserIntent}
              isPercentage={true}

            />
          </Card>
          <Card className='min-h-[200px]'>
            <RadialBar
              chartData={mediumIntent ? [{ ...mediumIntent }] : []} // Pass the mediumIntent object directly
              chartConfig={chartConfigR}
              Device={mediumIntent?.label || "Medium Intent User"}
              Vname="Visits"
              Vvalue={mediumIntent?.["Visit %"] || 0}
              Oname="Events"
              Ovalue={mediumIntent?.["Event %"] || 0}
              textcolors="#e76e50"
              value1='Visit %'
              value2='Event %'
              isLoading={isLoadingUserIntent}
              isPercentage={true}

            />
          </Card>
          <Card className='min-h-[200px]'>
            <RadialBar
              chartData={lowIntent ? [{ ...lowIntent }] : []} // Pass the lowIntent object directly
              chartConfig={chartConfigR}
              Device={lowIntent?.label || "Low Intent User"}
              Vname="Visits"
              Vvalue={lowIntent?.["Visit %"] || 0}
              Oname="Events"
              Ovalue={lowIntent?.["Event %"] || 0}
              textcolors="#ff0000"
              value1='Visit %'
              value2='Event %'
              isLoading={isLoadingUserIntent}
              isPercentage={true}

            />
          </Card>

        </div>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl-grid-cols-2 gap-2' >
        <Card ref={(el) => (cardRefs.current["Traffic_Contribution"] = el!)} className='p-2 min-h-[250px]'>
          <StackedBarChart
            chartData={TrafficContribution}
            chartConfig={chartConfigTC}
            onExport={() => onExport("png", "Traffic Contribution", "Traffic_Contribution")}
            onExpand={() => handleExpand("Traffic_Contribution")}
            title='Traffic Contribution % Basis Device Type'
            yAxis={yAxisConfigV}
            isLoading={isLoadingTrafficC}
            isPercentage={true}
            handleExport={() => {
              console.log("Export handler triggered"); // Debug log
              setExportcsvTC(true);
            }}

          />
        </Card>
        <Card ref={(el) => (cardRefs.current["Top_Contribution"] = el!)} className='p-2 min-h-[250px]'>
          <DynamicBarChart
            data={TopContribution}
            config={chartConfigTopC}
            title="Top Contributing OS Version"
            onExport={() => onExport("png", "Top Contributing OS Version ", "Top_Contribution")}
            onExpand={() => handleExpand("Top_Contribution")}
            isHorizontal={false}
            isRadioButton={false}
            isSelect={false}
            position="top"
            isLoading={isLoadingTopC}
            isPercentage={true}
            handleExport={() => {
              setExportcsvOSVersion(true);
            }}
          />

        </Card>

      </div>
      <div className="gap-1 w-full">
        <div className='w-full bg-gray-200 text-sub-header font-semibold grid justify-items-center sm:text-body p-2'>Device Concentration %</div>
        <div className='grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 md:grid-cols-2 w-full gap-2 '>
          <Card className='min-h-[200px]'>
            <RadialBar
              chartData={highDevice ? [{ ...highDevice }] : []}
              chartConfig={chartConfigR}
              Device={highDevice?.label || "High"}
              Vname="Visits"
              Vvalue={highDevice?.["Visit %"] || 0}
              Oname="Events"
              Ovalue={highDevice?.["Event %"] || 0}
              textcolors="#2a9d90"
              value1='Visit %'
              value2='Event %'
              isLoading={isLoadingDeviceConcentrationApi}
              isPercentage={true}
            />
          </Card>
          <Card className='min-h-[200px]'>
            <RadialBar
              chartData={mediumDevice ? [{ ...mediumDevice }] : []}
              chartConfig={chartConfigR}
              Device={mediumDevice?.label || "Medium"}
              Vname="Visits"
              Vvalue={mediumDevice?.["Visit %"] || 0}
              Oname="Events"
              Ovalue={mediumDevice?.["Event %"] || 0}
              textcolors="#e76e50"
              value1='Visit %'
              value2='Event %'
              isLoading={isLoadingDeviceConcentrationApi}
              isPercentage={true}

            />
          </Card>
          <Card className='min-h-[200px]'>
            <RadialBar
              chartData={lowDevice ? [{ ...lowDevice }] : []}
              chartConfig={chartConfigR}
              Device={lowDevice?.label || "Low"}
              Vname="Visits"
              Vvalue={lowDevice?.["Visit %"] || 0}
              Oname="Events"
              Ovalue={lowDevice?.["Event %"] || 0}
              textcolors='#ff0000'
              value1='Visit %'
              value2='Event %'
              isLoading={isLoadingDeviceConcentrationApi}
              isPercentage={true}

            />
          </Card>

        </div>
      </div>
      <div className="gap-1 w-full">
        <div className='w-full bg-gray-200 text-sub-header font-semibold grid justify-items-center sm:text-body p-2'>Region Wise Concentration %</div>
        <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl-grid-cols-2 gap-2'>
          <Card ref={(el) => (cardRefs.current["visit_concentration"] = el!)} className='h-[350px] p-2'>
            <HorizontalVerticalBarChart
              chartData={VisitC}
              chartConfig={ConfigVistC}
              title="Visit Concentration %"
              onExport={() => onExport("png", "Visit Concentration", "visit_concentration")}
              onExpand={() => handleExpand("visit_concentration")}
              isHorizontal={true}
              formatterType="percentage"
              isRadioButton={false}

              isLoading={isLoadingVisitC}
              isSelect={false}
              dataKey="percentage"
              namekeys="label"
              position='right'
              barsize={10}
              setheight='280px'
              isPercentage={true}
              handleExport={() => {
                setExportcsvVC(true);
              }}

            />

          </Card>
          <Card ref={(el) => (cardRefs.current["event_concentration"] = el!)} className='h-[350px] p-2'>
            <HorizontalVerticalBarChart
              chartData={EventC}
              chartConfig={ConfigEventC}
              title="Event Concentration %"
              onExport={() => onExport("png", "Event Concentration", "event_concentration")}
              onExpand={() => handleExpand("event_concentration")}
              isHorizontal={true}
              handleExport={() => {
                setExportcsvEC(true);
              }}
              formatterType="percentage"
              isRadioButton={false}
              isLoading={isLoadingEventC}
              isSelect={false}
              dataKey="percentage"
              namekeys="label"
              position='right'
              barsize={10}
              setheight='280px'
              isPercentage={true}


            />
          </Card>
        </div>
      </div>
    </div>
  )
}
export default Traffic_insights;
