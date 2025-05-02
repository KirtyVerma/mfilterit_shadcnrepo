"use client";
import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
import KeyValueCard from "@/components/mf/keyvalueCard";
import ResizableTable from "@/components/mf/TableComponent";
import DonutChart from "@/components/mf/charts/DonutChart";
import StackedBarWithLine from "@/components/mf/charts/StackedBarwithLine";
import domToImage from "dom-to-image";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import HeaderRow from "@/components/mf/HeaderRow";
import ChartBarStacked from "@/components/mf/charts/stackedBarChart";
import { onExpand, downloadURI, debounce, handleExportData } from "@/lib/utils";
import { generateChartConfig, ChartData } from "@/lib/chartutils";
import Endpoint from "../../common/endpoint";
import { Loader2 } from "lucide-react";
import { useApiCall } from "../../queries/api_base";
import { usePackage } from "@/components/mf/PackageContext";
import { useDateRange } from "@/components/mf/DateRangeContext";
import { Filter } from "@/components/mf/Filters";

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

//color
interface ChartConfig {
  [key: string]: { label: string; color: string };
}

interface FraudCategory {
  color: string;
  label: string;
}

interface ColorConfig {
  [key: string]: FraudCategory;
  Invalid: FraudCategory;
  Valid: FraudCategory;
  DeviceRepetition: FraudCategory;
  IPRepeat: FraudCategory;
  ImperceptibleWindow: FraudCategory;
  DeviceSpoofing: FraudCategory;
  DeprecatedOS: FraudCategory;
  BrandBidding: FraudCategory;
  DeprecatedBrowser: FraudCategory;
  IPRepeatHourly: FraudCategory;
  ServerFarm: FraudCategory;
  PopUnder: FraudCategory;
  FakeDevice: FraudCategory;
  VPNProxy: FraudCategory;
  GeoFraud: FraudCategory;
  TimezoneMismatch: FraudCategory;
  DuplicateUser: FraudCategory;
  DistributionFraud: FraudCategory;
  BlacklistedUA: FraudCategory;
  ClickSpamming: FraudCategory;
  MouseClickPattern: FraudCategory;
  MouseMovementPattern: FraudCategory;
  DomainSpoofing: FraudCategory;
  AdStacking: FraudCategory;
  PlacementFraud: FraudCategory;
  SuspiciousDeviceRepetition: FraudCategory;
  SuspiciousBrowser: FraudCategory;
  SuspiciousOS: FraudCategory;
  NotFraud: FraudCategory;
  Cookiestuffing: FraudCategory;
  Clickinjection: FraudCategory;
  StackedClick: FraudCategory;
  PunchLead: FraudCategory;
  FakeEvent: FraudCategory;
  BotEvent: FraudCategory;
  GeoHopFraud: FraudCategory;
  BehaviorFraud: FraudCategory;
}

interface ConfigData {
  _id: string;
  ColorConfig: ColorConfig;
}

//Top 5 Campaign
interface ColumnC {
  title: string;
  key: keyof Datac;
}
interface Datac {
  campaign_id: string;
  total_visits: number;
  visit_invalid_percent: number;
  total_events: number;
  event_invalid_percent: number;
}

interface campaignData {
  data: Datac[];
  total_records: number;
  page_number: number;
  limit: number;
  total_pages: number;
  search_term: string;
  package_name: string;
  publisher: string[];
  sub_publisher: string[];
  campaign: string[];
  channel: string[];
}

const CampaignColumns: ColumnC[] = [
  { title: "Campaign ID", key: "campaign_id" },
  { title: "Total Visits", key: "total_visits" },
  { title: "Invalid Visit %", key: "visit_invalid_percent" },
  { title: "Total Events", key: "total_events" },
  { title: "Invalid Event %", key: "event_invalid_percent" },
];

//Top 5 Sources
interface ColumnS {
  title: string;
  key: keyof DataP;
}
interface DataP {
  publisher_name: string;
  total_visits: number;
  visit_invalid_percent: string;
  total_events: number;
  event_invalid_percent: string;
  valid_conv_rate: string;
  invalid_conv_rate: string;
}

interface PublisherData {
  data: DataP[];
  total_records: number;
  page_number: number;
  limit: number;
  total_pages: number;
  search_term: string;
  package_name: string;
  publisher: string[];
  sub_publisher: string[];
  campaign: string[];
  channel: string[];
}

const PublisherColumns: ColumnS[] = [
  { title: "Source", key: "publisher_name" },
  { title: "Total Visits", key: "total_visits" },
  { title: "Invalid Visit %", key: "visit_invalid_percent" },
  { title: "Total Events", key: "total_events" },
  { title: "Invalid Event %", key: "event_invalid_percent" },
  { title: "Valid Traffic Conv. Rate", key: "valid_conv_rate" },
  { title: "Invalid Traffic Conv. Rate", key: "invalid_conv_rate" },
];
//traffic count
interface TrafficEvents {
  total_traffic: number;
  valid_traffic: number;
  invalid_traffic: number;
  valid_traffic_percent: string;
  invalid_traffic_percent: string;
}

interface TrafficVisits {
  total_traffic: number;
  valid_traffic: number;
  invalid_traffic: number;
  valid_traffic_percent: string;
  invalid_traffic_percent: string;
}

interface TrafficComparison {
  valid_conversion_rate: string;
  invalied_conversion_rate: string;
  conversion_rate: string;
}

interface TrafficData {
  events: TrafficEvents;
  visits: TrafficVisits;
  comparision: TrafficComparison;
}
//traffic trend
interface TrafficTrendResponse {
  data: {
    week: string;
    date: string;
    month: string;
    year: string;
    invalid_count: number;
    valid_count: number;
    invalid_percent: string;
  }[];
}
//visit traffic category
interface FraudDataVisitEvent {
  fraud_sub_category: string;
  total_count: number;
  percentage: string;
  fill:string;
}


interface vPublishers {
  publisher_name: string;
  fraud_sub_category: string;
  fraud_sub_category_count: string;
}

interface ePublishers {
  publisher_name: string;
  fraud_sub_category: string;
  fraud_sub_category_count: string;
}

// Add type for API response
interface FilterApiResponse {
  data: string[];
  isLoading: boolean;
}

const Dashboard = () => {
  const { selectedPackage } = usePackage();
  const { startDate, endDate } = useDateRange();
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedFrequencyV, setSelectedFrequencyV] = useState("date");
  const [selectedFrequencyE, setSelectedFrequencyE] = useState("date");
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const cardRefs = useRef<Record<string, HTMLElement | null>>({});
  const [cards, setCards] = useState<any>(null);
  const [existingvisit, setExistingvisit] = useState<any>([]);
  const [Existingevent, setExistingevent] = useState<any>([]);
  const [existingCampaign, setExistingCampaign] = useState<any>([]);
  const [existingPublisher, setExistingPublisher] = useState<any>([]);
  const [ExistingVpublisher, setExistingvPublisher] = useState<any>([]);
  const [ExistingEpublisher, setExistingEPublisher] = useState<any>([]);
  const [existingVtrend, setExistingVtrend] = useState<any>([]);
  const [existingEtrend, setExistingEtrend] = useState<any>([]);
  const [currentPagep, setCurrentPagep] = useState(1);
  const [currentPagec, setCurrentPagec] = useState(1);
  const [limitps, setLimitp] = useState(10);
  const [limitpc, setLimitc] = useState(10);
  const [colorConfig, setColorConfig] = useState<ChartConfig>({});
  const [chartConfigs, setChartConfig] = useState<ChartConfig>({});
  const [chartConfigvp, setChartConfigvp] = useState<any>({});
  const [chartConfigep, setChartConfigep] = useState<any>({});
  const [chartConfigVisit, setChartConfigVisit] = useState({});
  const [chartConfigEvent, setChartConfigEvent] = useState({});
  const [chartDatav, setChartDatav] = useState<ChartData[]>([]);
  const [chartDataE, setChartDataE] = useState<ChartData[]>([]);
  const [searchTermP, setSearchTermP] = useState("");
  const [searchTermC, setSearchTermC] = useState("");
  const [totalRecordTP, setTotalRecordTP] = useState<number>(0);
  const [TotalRecordTC, setTotalRecordTC] = useState<number>(0);
  const [existingPublisherdata, setExistingPublisherdata] = useState<string[]>(
    []
  );
  const [existingSubPublisherdata, setExistingSubPublisherdata] = useState<
    string[]
  >([]);
  const [ExistingEventTypedata, setExistingEventTypedata] = useState<
    string[]
  >([]);
  const [existingCampaigndata, setExistingCampaigndata] = useState<string[]>(
    []
  );
  const [existingChanneldata, setExistingChanneldata] = useState<string[]>([]);
  const [ExportcsvVTTrend, setExportcsvVTTrend] = useState(false);
  const [ExportcsvETTrend, setExportcsvETTrend] = useState(false);
  const [ExportcsvVT, setExportcsvVT] = useState(false);
  const [ExportcsvET, setExportcsvET] = useState(false);
  const [ExportcsvTP, setExportcsvTP] = useState(false);
  const [ExportcsvTC, setExportcsvTC] = useState(false);
  const [ExportcsvVP, setExportcsvVP] = useState(false);
  const [ExportcsvEP, setExportcsvEP] = useState(false);
  const exportCsvRef = useRef(false);
  const [loadedFilter, setLoadedFilter] = useState<any>({});
  const [query, setQuery] = useState({
    publishers: ["all"],
    sub_publishers: ["all"],
    campaigns: ["all"],
    channels: ["all"],
    event_type: ["all"],
  });


  //  const isInitialLoad = useRef(true); // Track initial load

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
        // stopLoading();
      }
    },
    onError: (error) => {
      // console.error("Publishers Filter Error:", error);
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
      // console.log("sucess sub publisher",data);
      setExistingSubPublisherdata(data);
      if (data.length > 0) {
        //  stopLoading();
      }
    },
    onError: (error) => {
      // console.error("Sub Publishers Filter Error:", error);
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
        //  stopLoading();
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
        //  stopLoading();
      }
    },
    onError: (error) => {
      // console.error("Channels Filter Error:", error);
    },
  });
  // evenyt type Filter API
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
        //  stopLoading();
      }
    },
    onError: (error) => {
      // console.error("Channels Filter Error:", error);
    },
  });
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

 // const isInitialLoad = useRef(true);
//  const isFetched = useRef(false); // Prevent multiple fetch calls
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
  //color Api
  const {result:colorApi} = useApiCall<ConfigData>({
    url: process.env.NEXT_PUBLIC_WEB_PERF + Endpoint.COLOR_API,
    method: "GET",
    params: {},
    onSuccess: (data) => {
      setColorConfig(data.ColorConfig);
    },
    onError: (error) => {
      console.error("Colors Error:", error);
    },
  });

  useEffect(() => {
    if (colorApi.data?.ColorConfig) {
      const updatedColorConfig = {
        ...colorApi.data.ColorConfig,
        BehaviorFraud: {
          label: "Behavior Fraud",
          color: "#604652"
        }
      };
      setColorConfig(updatedColorConfig);
    }
  }, [colorApi.data]);

  const chartConfig = useMemo(() => {
    if (!colorConfig) return {};

    // Map colorConfig to chartConfig format
    const config: ChartConfig = {};
    for (const key in colorConfig) {
      if (colorConfig.hasOwnProperty(key)) {
        config[key] = {
          label: colorConfig[key].label,
          color: colorConfig[key].color,
        };
      }
    }
    return config;
  }, [colorConfig]);

  // Trigger API call for card values

  const { result: trafficountApi, loading: trafficountApiLoading } = useApiCall<TrafficData>({
    url: process.env.NEXT_PUBLIC_WEB_PERF + Endpoint.TRAFFIC_COUNT,
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
    onSuccess: (data) => {
      // console.log("Traffic Cards Success:", data);
      setCards(data);
    },
    onError: (error) => {
      setCards([]);
      // console.error("Traffic Cards Error:", error);
    },
  });

  useEffect(() => {
    if ( trafficountApi.data) {
      const { events, visits, comparision } = trafficountApi.data;
      const updatedData = {
        events: {
          total_traffic: events.total_traffic,
          valid_traffic: events.valid_traffic,
          invalid_traffic: events.invalid_traffic,
          valid_traffic_percent: events.valid_traffic_percent,
          invalid_traffic_percent: events.invalid_traffic_percent,
        },
        visits: {
          total_traffic: visits.total_traffic,
          valid_traffic: visits.valid_traffic,
          invalid_traffic: visits.invalid_traffic,
          valid_traffic_percent: visits.valid_traffic_percent,
          invalid_traffic_percent: visits.invalid_traffic_percent,
        },
        comparision: {
          valid_conversion_rate: comparision.valid_conversion_rate,
          invalied_conversion_rate: comparision.invalied_conversion_rate,
          conversion_rate: comparision.conversion_rate,
        },
      };
      if (JSON.stringify(updatedData) !== JSON.stringify(cards)) {
        setCards(updatedData);
      }
    }
  }, [trafficountApi]);

  const stats = [
    {
      title: "Total Traffic",
      leftKey: "Visit :",
      leftValue: cards?.visits?.total_traffic ?? 0,
      colors: "#490080",
      rightKey: "Event :",
      rightValue: cards?.events?.total_traffic ?? 0,
      backgroundColor: "dark:bg-card",
    },
    {
      title: "Valid Traffic",
      leftKey: "Visit :",
      leftValue: cards?.visits?.valid_traffic ?? 0,
      leftpercentage: cards?.visits?.valid_traffic_percent ?? "0%",
      percentage: `(${cards?.visits?.valid_traffic_percent ?? "0%"})`,
      colors: "#00A86B",
      rightKey: "Event :",
      rightValue: cards?.events?.valid_traffic ?? 0,
      percentage1: `(${cards?.events?.valid_traffic_percent ?? "0%"})`,
      backgroundColor: "dark:bg-card",
    },
    {
      title: "Invalid Traffic",
      leftKey: "Visit :",
      leftValue: cards?.visits?.invalid_traffic ?? 0,
      percentage: `(${cards?.visits?.invalid_traffic_percent ?? "0%"})`,
      colors: "#FF0000",
      rightKey: "Event :",
      rightValue: cards?.events?.invalid_traffic ?? 0,
      percentage1: `(${cards?.events?.invalid_traffic_percent ?? "0%"})`,
      backgroundColor: "dark:bg-card",
    },
    {
      title: "Conversion Rate",
      leftKey: "Valid Traffic :",
      percentage: cards?.comparision?.valid_conversion_rate ?? "0%",
      colors: "#490080",
      rightKey: "Invalid Traffic :",
      percentage1: cards?.comparision?.invalied_conversion_rate ?? "0%",
      backgroundColor: "dark:bg-card",
    },
    {
      title: "Conv. Rate (Valid to Invalid Delta)",
      leftSide: cards?.comparision?.conversion_rate ?? 0,
      colors: "#00A86B",
      backgroundColor: "dark:bg-card",
    },
  ];
  const visitEventOptions = [
    { value: "visit", label: "Visit" },
    { value: "event", label: "Event" },
  ];

  const handleTypeChange = useCallback((value: string) => {
    setSelectedType(value);
  }, []);

  const selectOptionsV = ["Daily", "Weekly", "Monthly", "Yearly"];

  const handleFrequencyChangeV = (value: string) => {
    // Convert frequency to the appropriate format
    const frequencyMap: { [key: string]: string } = {
      Daily: "date",
      Weekly: "week",
      Monthly: "month",
      Yearly: "year",
    };
    setSelectedFrequencyV(frequencyMap[value]);
  };
  const selectOptionsE = ["Daily", "Weekly", "Monthly", "Yearly"];

  const handleFrequencyChangeE = (value: string) => {
    // Convert frequency to the appropriate format
    const frequencyMap: { [key: string]: string } = {
      Daily: "date",
      Weekly: "week",
      Monthly: "month",
      Yearly: "year",
    };
    setSelectedFrequencyE(frequencyMap[value]);
  };

  //traffic  visit trend api
  const { result: trafficTrendVisitApi, loading: trafficTrendVisitApiLoading } = useApiCall<TrafficTrendResponse>({
    url: process.env.NEXT_PUBLIC_WEB_PERF + Endpoint.TRAFFIC_TRENDS,
    method: "POST",
    params: {
      package_name: selectedPackage,
      start_date: startDate,
      end_date: endDate,
      summary_type: "visit",
      frequency: selectedFrequencyV,
      publishers: query.publishers,
      sub_publisher: query.sub_publishers,
      campaign: query.campaigns,
      channel: query.channels,
      //event_type: query.event_type,
      export: ExportcsvVTTrend,

    },
    onSuccess: (data) => {
      if(ExportcsvVTTrend && typeof data === 'string'){
        const rows = data.split('\n');
        const datas = rows.slice(1)
          .filter((row: string) => row.trim()) // Remove empty rows
          .map(row => {
            const values = row.split(',');
            return {
              month: values[0],
              invalid_count: values[1],
              valid_count: values[2],
              invalid_percent: values[3].replace(/b'|'|/g, ''),
            };
          });
          const exportheaders = ["Date/Month/Week","Valid", "Invalid",  "Invalid %"];
          const exportrows = datas.map(item => [
            item.month,
            item.invalid_count,
            item.valid_count,
            `${item.invalid_percent}%`
          ]);
          handleExportData(exportheaders, exportrows, "VisitTrafficTrendData.csv");
          setExportcsvVTTrend(false);
          return;
        }
      if (
        Array.isArray(data)
      ) {
        setExistingVtrend([]);
        const updatedTrend = data.map((trendItem) => {
          let timePeriod = "";
          if (selectedFrequencyV === "month") {
            timePeriod = trendItem.month || "";
          } else if (selectedFrequencyV === "week") {
            timePeriod = trendItem.week || "";
          } else if (selectedFrequencyV === "date") {
            timePeriod = trendItem.date || "";
          } else if (selectedFrequencyV === "year") {
            timePeriod = trendItem.year || "";
          }

          return {
            month: timePeriod, // Dynamically set timePeriod based on frequency
            Invalid: trendItem.invalid_count,
            Valid: trendItem.valid_count,
            "Invalid %": parseFloat(trendItem.invalid_percent.replace("%", "")),
          }
        });
      
        setExistingVtrend([...updatedTrend]);

          // Define required keys and their fallback colors
          const requiredKeys = [
            { key: "Invalid", fallbackColor: "#FF0000" },
            { key: "Valid", fallbackColor: "#00A86B" },
            { key: "Invalid %", fallbackColor: "#b91c1c" }, // Use Invalid's color
          ];

          // Create chartConfig dynamically
          const chartConfig: ChartConfig = requiredKeys.reduce(
            (acc, { key, fallbackColor }) => {
              acc[key] = {
                label: key,
                color: fallbackColor,
                // colorConfig[key === "Invalid %" ? "Invalid" : key]?.fallbackColor, ||""

              };
              return acc;
            },
            {} as ChartConfig
          );
          setChartConfig(chartConfig);
        //}
      }
    },
    onError: (error) => {
      setExistingVtrend([]);
      // console.error("Traffic Trend Error:", error);
    },
  });

  //traffic  event trend api
  const { result: trafficTrendEventApi, loading: trafficTrendEventApiLoading } = useApiCall<TrafficTrendResponse>({
    url: process.env.NEXT_PUBLIC_WEB_PERF + Endpoint.TRAFFIC_TRENDS,
    method: "POST",
    params: {
      package_name: selectedPackage,
      start_date: startDate,
      end_date: endDate,
      summary_type: "event",
      frequency: selectedFrequencyE,
      publishers: query.publishers,
      sub_publisher: query.sub_publishers,
      campaign: query.campaigns,
      channel: query.channels,
      event_type: query.event_type,
      export: ExportcsvETTrend,

    },
    onSuccess: (data) => {
        if(ExportcsvETTrend && typeof data === 'string'){     
          
          const rows = data.split('\n');
          const datas = rows.slice(1)
            .filter((row: string) => row.trim()) // Remove empty rows
            .map(row => {
              const values = row.split(',');
              return {
                month: values[0],
                invalid_count: values[1],
                valid_count: values[2],
                invalid_percent: values[3].replace(/b'|'|%/g, ''),
              };
            });
            const exportheaders = ["Date/Month/Week", "Valid","Invalid",  "Invalid %"];
          const exportrows = datas.map(item => [
            item.month,
            item.invalid_count,
            item.valid_count,
            `${item.invalid_percent}%`
          ]);
          handleExportData(exportheaders, exportrows, "EventTrafficTrendData.csv");
          setExportcsvETTrend(false);
          return;
        }
      if (
        Array.isArray(data)
      ) {
        setExistingEtrend([]);
        const updatedTrend =data.map((trendItem) => {
          let timePeriod = "";
          if (selectedFrequencyE === "month") {
            timePeriod = trendItem.month || "";
          } else if (selectedFrequencyE === "week") {
            timePeriod = trendItem.week || "";
          } else if (selectedFrequencyE === "date") {
            timePeriod = trendItem.date || "";
          } else if (selectedFrequencyE === "year") {
            timePeriod = trendItem.year || "";
          }

          return {
            month: timePeriod, // Dynamically set timePeriod based on frequency
            Invalid: trendItem.invalid_count,
            Valid: trendItem.valid_count,
            "Invalid %": parseFloat(trendItem.invalid_percent.replace("%", "")),
          }
        });
        
        setExistingEtrend([...updatedTrend]);

          // Define required keys and their fallback colors
          const requiredKeys = [
            { key: "Invalid", fallbackColor: "#FF0000" },
            { key: "Valid", fallbackColor: "#00A86B" },
            { key: "Invalid %", fallbackColor: "#b91c1c" }, // Use Invalid's color
          ];

          // Create chartConfig dynamically
          const chartConfig: ChartConfig = requiredKeys.reduce(
            (acc, { key, fallbackColor }) => {
              acc[key] = {
                label: key,
                color: fallbackColor,
                // colorConfig[key === "Invalid %" ? "Invalid" : key]?.fallbackColor, ||""

              };
              return acc;
            },
            {} as ChartConfig
          );
          setChartConfig(chartConfig);
        }
      },
    onError: (error) => {
      setExistingEtrend([]);
      // console.error("Traffic Trend Error:", error);
    },
  });


  //trigger api for visit Traffic

  const { result: visitTrafficApi, loading: visitTrafficApiLoading } = useApiCall<FraudDataVisitEvent>({
    url: process.env.NEXT_PUBLIC_WEB_PERF + Endpoint.VISIT_TRAFFIC,
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
      export: ExportcsvVT,

    },
    onSuccess: (data) => {
      if(ExportcsvVT && typeof data === 'string'){     
      
      const rows = data.split('\n');
      const datas = rows.slice(1)
        .filter((row: string) => row.trim()) // Remove empty rows
        .map(row => {
          const values = row.split(',');
          return {
            fraud_sub_category: values[0],
            total_count: values[1],
            percentage: values[2].replace(/b'|'|%/g, ''),
          };
        });
        const exportheaders = ["Fraud Sub Category", "Total Count", "Percentage"];
      const exportrows = datas.map(item => [
        item.fraud_sub_category,
        item.total_count,
        `${item.percentage}%`
      ]);
      handleExportData(exportheaders, exportrows, "VisitTrafficData.csv");
      setExportcsvVT(false);
      return;
    }
     
      if(Array.isArray(data) && data.length > 0 && colorConfig) {
        setExistingvisit([]);
        const updatedTop = data.map((item) => {
          const categoryKey = item.fraud_sub_category;
          const normalizedKey = categoryKey.replace(/\s+/g, '');
          
          // Case-insensitive matching
          const matchingKey = Object.keys(colorConfig).find(
            key => key.toLowerCase() === normalizedKey.toLowerCase()
          );

          const color = matchingKey ? colorConfig[matchingKey].color : "#000000";

          return {
            label: item.fraud_sub_category,
            visit: item.total_count,
            percentage: item.percentage,
            fill: color,
          };
        });
     
        setExistingvisit([...updatedTop]);
        setChartConfigVisit(chartConfig);
      }
    },
    onError: (error) => {
      setExistingvisit([]);
      // console.error("Visit Traffic Error:", error);
    },
  });

  

  //trigger api for event Traffic
  const { result: eventTrafficApi, loading: eventTrafficApiLoading } = useApiCall<FraudDataVisitEvent>({
    url: process.env.NEXT_PUBLIC_WEB_PERF + Endpoint.EVENT_TRAFFIC,
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
      export: ExportcsvET,
    },
    onSuccess: (data) => {
      console.log("Event Traffic Data:", data);
      console.log("Current Color Config:", colorConfig);
      
      setExistingevent([]);
      if(Array.isArray(data) && data.length > 0 && colorConfig){
        const updatedTop = data.map((item) => {
          const categoryKey = item.fraud_sub_category;
          // Update normalization to be case-insensitive
          const normalizedKey = categoryKey.replace(/\s+/g, '');
          
          // Find the matching key in colorConfig ignoring case
          const matchingKey = Object.keys(colorConfig).find(
            key => key.toLowerCase() === normalizedKey.toLowerCase()
          );

          const color = matchingKey ? colorConfig[matchingKey].color : "#000000";
          
          console.log("Color matching:", {
            original: categoryKey,
            normalized: normalizedKey,
            matchingKey,
            foundColor: color
          });

          return {
            label: item.fraud_sub_category,
            visit: item.total_count,
            percentage: item.percentage,
            fill: color,
          };
        });
       
        setExistingevent([...updatedTop]);
        setChartConfigEvent(chartConfig);
      }
    },
    onError: (error) => {
      setExistingevent([]);
    },
  });

 

  //top 5 publisher

  const { result: topPublisherApi, loading: topPublisherApiLoading } = useApiCall<PublisherData>({
    url: process.env.NEXT_PUBLIC_WEB_PERF + Endpoint.TOP_PUBLISHERS,
    method: "POST",
    params: {
      package_name: selectedPackage,
      start_date: startDate,
      end_date: endDate,
      page: currentPagep,
      limit: limitps,
      search_term: searchTermP,
      publishers: query.publishers,
      sub_publisher: query.sub_publishers,
      campaign: query.campaigns,
      channel: query.channels,
      event_type: query.event_type,
      export:ExportcsvTP,

    },
    onSuccess: (data) => {
      if(ExportcsvTP && typeof data === 'string'){     
        const rows = data.split('\n');
        const datas = rows.slice(1)
          .filter((row: string) => row.trim()) // Remove empty rows
          .map(row => {
            const values = row.split(',');
            return {
              publisher_name: values[0],
              total_visits: values[1],
              visit_invalid_percent: values[2].replace(/b'|'|%/g, ''),
              total_events: values[3],
              event_invalid_percent: values[4].replace(/b'|'|%/g, ''),
              valid_conv_rate: values[5].replace(/b'|'|%/g, ''),
              invalid_conv_rate: values[6].replace(/b'|'|%/g, ''),
            };
          });
        const exportheaders = ["Publisher Name", "Total Visit", "Visit Invalid %", "Total Event", "Event Invalid %", "Valid Conv Rate", "Invalid Conv Rate"];
      const exportrows = datas.map(item => [
        item.publisher_name,
        item.total_visits,
        `${item.visit_invalid_percent}%`,
        item.total_events,
        `${item.event_invalid_percent}%`,
        `${item.valid_conv_rate}%`,
        `${item.invalid_conv_rate}%`
      ]);
      handleExportData(exportheaders, exportrows, "TopPublisherData.csv");
      setExportcsvTP(false);
      return;
    }
      const response = data?.data;
    if (
      response &&
      Array.isArray(response)
    ) {
      setExistingPublisher([])
      const updatedtop = response.map((topItem: any) => ({
        publisher_name: topItem.publisher_name || "Uncategorized",
        total_visits: topItem.total_visits, // Keep as number
        visit_invalid_percent: topItem.visit_invalid_percent,
        total_events: topItem.total_events, // Keep as number
        event_invalid_percent: topItem.event_invalid_percent,
        valid_conv_rate: topItem.valid_conv_rate,
        invalid_conv_rate: topItem.invalid_conv_rate,
      }));
          
      setExistingPublisher([...updatedtop]);

    }
      setTotalRecordTP(data.total_pages);
    },
    onError: (error) => {
      setExistingPublisher([]);
    },
  });

  //top 5 campaign

  const { result: topCampaignApi, loading: topCampaignApiLoading } = useApiCall<campaignData>({
    url: process.env.NEXT_PUBLIC_WEB_PERF + Endpoint.TOP_CAMPAIGNS,
    method: "POST",
    params: {
      package_name: selectedPackage,
      start_date: startDate,
      end_date: endDate,
      page: currentPagec,
      limit: limitpc,
      search_term: searchTermC,
      publishers: query.publishers,
      sub_publisher: query.sub_publishers,
      campaign: query.campaigns,
      channel: query.channels,
      event_type: query.event_type,
      export: ExportcsvTC,

    },
    onSuccess: (data) => {
      if(ExportcsvTC && typeof data === 'string'){     
        const rows = data.split('\n');
        const datas = rows.slice(1)
          .filter((row: string) => row.trim()) // Remove empty rows
          .map(row => {
            const values = row.split(',');
            return {
              campaign_id: values[0],
              total_visits: values[1],
              visit_invalid_percent: values[2].replace(/b'|'|%/g, ''),
              total_events: values[3],
              event_invalid_percent: values[4].replace(/b'|'|%/g, ''),
            };
          });
        const exportheaders = ["Campaign ID", "Total Visit", "Visit Invalid %", "Total Event", "Event Invalid %"];
      const exportrows = datas.map(item => [
        item.campaign_id,
        item.total_visits,
        `${item.visit_invalid_percent}%`,
        item.total_events,
        `${item.event_invalid_percent}%`
      ]);
      handleExportData(exportheaders, exportrows, "TopCampaignData.csv");
      setExportcsvTC(false);
      return;
    }
      const response = data?.data;
      if (
        response &&
        Array.isArray(response)
      ) {
        setExistingCampaign([]);

        const updatedtop = response.map((topItem: any) => ({
          campaign_id: topItem.campaign_id,
          total_visits: topItem.total_visits,
          visit_invalid_percent: topItem.visit_invalid_percent,
          total_events: topItem.total_events,
          event_invalid_percent: topItem.event_invalid_percent,
        }));
       
        setExistingCampaign([...updatedtop]);
      }
      setTotalRecordTC(data.total_pages);
    },
    onError: (error) => {
      setExistingCampaign([]);
      // console.error("Top Campaigns Error:", error);
    },
  });

  //visit Publisher
  const { result: vPublisherApi, loading: vPublisherApiLoading } = useApiCall<vPublishers>({
    url: process.env.NEXT_PUBLIC_WEB_PERF + Endpoint.VISIT_TRAFFIC_PUBLISHER,
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
      export: ExportcsvVP,
    },
    onSuccess: (data) => {
      if(ExportcsvVP && typeof data === 'string'){     
        const rows = data.split('\n');
        const datas = rows.slice(1)
          .filter((row: string) => row.trim()) // Remove empty rows
          .map(row => {
            const values = row.split(',');
            return {
              publisher_name: values[0],
              fraud_sub_category: values[1],
              fraud_sub_category_count: values[2],
            };
          });
          const exportheaders = ["Publisher Name", "Fraud Sub Category", "Fraud sub category count"];
          const exportrows = datas.map(item => [
            item.publisher_name,
            item.fraud_sub_category,
            item.fraud_sub_category_count
          ]);
          handleExportData(exportheaders, exportrows, "VisitPublisherData.csv");
          setExportcsvVP(false);
          return;
        }

      const response = data;
      if (response && Array.isArray(response) && colorConfig) {
        setExistingvPublisher([]);
        
        // Group by publisher
        const groupedByPublisher = response.reduce((acc, item) => {
          const { publisher_name, fraud_sub_category, fraud_sub_category_count } = item;
          if (!acc[publisher_name]) {
            acc[publisher_name] = {
              label: publisher_name,
              fraud_sub_categories: {},
            };
          }
          acc[publisher_name].fraud_sub_categories[fraud_sub_category] = fraud_sub_category_count;
          return acc;
        }, {});

        // Map data into chart format with case-insensitive matching
        const chartData = Object.values(groupedByPublisher).map((publisher) => {
          const dataEntry = { label: publisher.label };
          Object.entries(publisher.fraud_sub_categories).forEach(([category, count]) => {
            // Normalize the category name
            const normalizedCategory = category.replace(/\s+/g, '');
            
            // Find matching key in colorConfig using case-insensitive comparison
            const matchingKey = Object.keys(colorConfig).find(
              key => key.toLowerCase() === normalizedCategory.toLowerCase()
            );

            const numericCount = parseFloat(count?.replace("%", "").trim());
            dataEntry[normalizedCategory] = numericCount;
          });
          return dataEntry;
        });

        setExistingvPublisher([...chartData]);

        // Update chart configuration with case-insensitive matching
        const updatedChartConfig = {};
        Object.entries(groupedByPublisher).forEach(([publisherName, publisher]) => {
          const { fraud_sub_categories } = publisher;
          Object.entries(fraud_sub_categories).forEach(([category, count]) => {
            const normalizedCategory = category.replace(/\s+/g, "");
            
            // Find matching key in colorConfig using case-insensitive comparison
            const matchingKey = Object.keys(colorConfig).find(
              key => key.toLowerCase() === normalizedCategory.toLowerCase()
            );

            const color = matchingKey ? colorConfig[matchingKey].color : "#000000";

            updatedChartConfig[normalizedCategory] = {
              label: category,
              color: color,
            };
          });
        });

        if (JSON.stringify(updatedChartConfig) !== JSON.stringify(chartConfigvp)) {
          setChartConfigvp(updatedChartConfig);
        }
      }
    },
    onError: (error) => {
      setExistingvPublisher([]);
      // console.error("Visit Publisher Error:", error);
    },
  });


  // EVENT Publisher
  const { result: ePublisherApi, loading: ePublisherApiLoading } = useApiCall<ePublishers>({
    url: process.env.NEXT_PUBLIC_WEB_PERF + Endpoint.EVENT_TRAFFIC_PUBLISHER,
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
      export: ExportcsvEP,
    },
    onSuccess: (data) => {
      if(ExportcsvEP && typeof data === 'string'){     
        const rows = data.split('\n');
        const datas = rows.slice(1)
          .filter((row: string) => row.trim()) // Remove empty rows
          .map(row => {
            const values = row.split(',');
            return {
              publisher_name: values[0],
              fraud_sub_category: values[1],
              fraud_sub_category_count: values[2],
            };
          });
          const exportheaders = ["Publisher Name", "Fraud Sub Category", "Fraud sub category count"];
          const exportrows = datas.map(item => [
            item.publisher_name,
            item.fraud_sub_category,
            item.fraud_sub_category_count
          ]);
          handleExportData(exportheaders, exportrows, "EventPublisherData.csv");
          setExportcsvEP(false);
          return;
        }

      const response = data;
      if (response && Array.isArray(response) && colorConfig) {
        setExistingEPublisher([]);
        
        // Group by publisher
        const groupedByPublisher = response.reduce((acc, item) => {
          const { publisher_name, fraud_sub_category, fraud_sub_category_count } = item;
          if (!acc[publisher_name]) {
            acc[publisher_name] = {
              label: publisher_name,
              fraud_sub_categories: {},
            };
          }
          acc[publisher_name].fraud_sub_categories[fraud_sub_category] = fraud_sub_category_count;
          return acc;
        }, {});

        // Map data into chart format with case-insensitive matching
        const chartData = Object.values(groupedByPublisher).map((publisher) => {
          const dataEntry = { label: publisher.label };
          Object.entries(publisher.fraud_sub_categories).forEach(([category, count]) => {
            // Normalize the category name
            const normalizedCategory = category.replace(/\s+/g, '');
            
            // Find matching key in colorConfig using case-insensitive comparison
            const matchingKey = Object.keys(colorConfig).find(
              key => key.toLowerCase() === normalizedCategory.toLowerCase()
            );

            const numericCount = parseFloat(count?.replace("%", "").trim());
            dataEntry[normalizedCategory] = numericCount;
          });
          return dataEntry;
        });

        setExistingEPublisher([...chartData]);

        // Update chart configuration with case-insensitive matching
        const updatedChartConfig = {};
        Object.entries(groupedByPublisher).forEach(([publisherName, publisher]) => {
          const { fraud_sub_categories } = publisher;
          Object.entries(fraud_sub_categories).forEach(([category, count]) => {
            const normalizedCategory = category.replace(/\s+/g, "");
            
            // Find matching key in colorConfig using case-insensitive comparison
            const matchingKey = Object.keys(colorConfig).find(
              key => key.toLowerCase() === normalizedCategory.toLowerCase()
            );

            const color = matchingKey ? colorConfig[matchingKey].color : "#000000";

            updatedChartConfig[normalizedCategory] = {
              label: category,
              color: color,
            };
          });
        });

        if (JSON.stringify(updatedChartConfig) !== JSON.stringify(chartConfigep)) {
          setChartConfigep(updatedChartConfig);
        }
      }
    },
    onError: (error) => {
      setExistingEPublisher([]);
    },
  });



  //fetch traffic trend api
  const fetchtrafficVisitTrend = useCallback(() => {
    if ('mutate' in trafficTrendVisitApi) {
      trafficTrendVisitApi.mutate({});
    }
  }, [trafficTrendVisitApi])

  //fetch traffic  event trend api
  const fetchtrafficEventTrend = useCallback(() => {
    if ('mutate' in trafficTrendEventApi) {
      trafficTrendEventApi.mutate({});
    }
  }, [trafficTrendEventApi])
  //fetch top publisher api
  const fetchTopPublisher = useCallback(() => {
    if ('mutate' in topPublisherApi) {
      ; topPublisherApi.mutate({});
    }
  }, [topPublisherApi])
  const debouncedFetchTopPublisher = useCallback(debounce(fetchTopPublisher, 500), []);

  //fetch top campaign api
  const fetchTopCampaign = useCallback(() => {
    if ('mutate' in topCampaignApi) {
      topCampaignApi.mutate({});
    }
  }, [topCampaignApi])
  const debouncedFetchTopCampaign = useCallback(debounce(fetchTopCampaign, 500), []);

  //  fetch traffic count API
  const fetchTCData = useCallback(() => {
    if ('mutate' in trafficountApi) {
      trafficountApi.mutate({})
    }
  }, [trafficountApi]);

  //fetch visit traffic API
  const fetchVTData = useCallback(() => {
    if ('mutate' in visitTrafficApi) {
      visitTrafficApi.mutate({})
    }
  }, [visitTrafficApi]);
  //fetch event traffic API
  const fetchETData = useCallback(() => {
    if ('mutate' in eventTrafficApi) {
      eventTrafficApi.mutate({})
    }
  }, [eventTrafficApi]);
  //fetch visit publisher API
  const fetchVPData = useCallback(() => {
    if ('mutate' in vPublisherApi) {
      vPublisherApi.mutate({})
    }
  }, [vPublisherApi]);

  //fetch event publisher API
  const fetchEPData = useCallback(() => {
    if ('mutate' in ePublisherApi) {
      ePublisherApi.mutate({})
    }
  }, [ePublisherApi]);
  const fetchCData = useCallback(() => { if (colorApi.type === "query") { colorApi.result.refetch() } }, [colorApi]);

  //Filters
  const fetchPublisher = useCallback(() => { if (publishersFilterApi.type === "mutation") { publishersFilterApi.result.mutate({}) } }, [publishersFilterApi]);
  const fetchSubPublisher = useCallback(() => { if (subPublishersFilterApi.type === "mutation") { subPublishersFilterApi.result.mutate({}) } }, [subPublishersFilterApi]);
  const fetchCampaign = useCallback(() => { if (campaignsFilterApi.type === "mutation") { campaignsFilterApi.result.mutate({}) } }, [campaignsFilterApi]);
  const fetchChannel = useCallback(() => { if (channelsFilterApi.type === "mutation") { channelsFilterApi.result.mutate({}) } }, [channelsFilterApi]);
  const fetchEventType = useCallback(() => { if (eventTypeFilterApi.type === "mutation") { eventTypeFilterApi.result.mutate({}) } }, [eventTypeFilterApi]);
  const yAxisConfigE = {
    dataKey: "label",
    title: "Event Publisher Name",
  };
  const yAxisConfigV = {
    dataKey: "label",
    title: "Visit Publisher Name",
  };

  const xAxisConfigstack = {
    dataKey: "value",
    title: "Fraud Category",
    isPercentage: true,
    tickFormatter: (value: number | string) => `${value}%`,
  };

  const deepEqual = (arr1: any[], arr2: any[]) => {
    if (!Array.isArray(arr1) || !Array.isArray(arr2)) return false;
    if (arr1.length !== arr2.length) return false;
    return arr1.every((item, index) => item.checked === arr2[index].checked && item.label === arr2[index].label);
  };
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

  const fetchAllData = useCallback(() => {
    fetchPublisher();
    fetchSubPublisher();
    fetchCampaign();
    fetchChannel();
    fetchEventType();
    fetchtrafficVisitTrend();
    fetchtrafficEventTrend();
    fetchTopPublisher();
    fetchTopCampaign();
    fetchTCData();
    fetchCData();
    fetchEPData();
    fetchVPData();
    fetchETData();
    fetchVTData();
  }, []);

  // Separate effect for handling exports
  useEffect(() => {
    if (ExportcsvVTTrend) {
      fetchtrafficVisitTrend();
    }},[ExportcsvVTTrend]);
    useEffect(() => {
     if (ExportcsvETTrend) {
      fetchtrafficEventTrend();
    }},[ExportcsvETTrend]);
    useEffect(() => {
     if (ExportcsvVT) {
      fetchVTData();
    }},[ExportcsvVT]);
    useEffect(() => {
     if (ExportcsvET) {
      fetchETData();
    }},[ExportcsvET]);
    useEffect(() => {
     if (ExportcsvTP) {
      fetchTopPublisher();
    }},[ExportcsvTP]);
    useEffect(() => {
     if (ExportcsvTC) {
      fetchTopCampaign();
    }},[ExportcsvTC]);
    useEffect(() => {
     if (ExportcsvVP) {
      fetchVPData();
    }},[ExportcsvVP]);
    useEffect(() => {
     if (ExportcsvEP) {
      fetchEPData();
    }},[ExportcsvEP]);

 
  useEffect(() => {
    if (selectedPackage) {
      fetchAllData(); // Call non-debounced APIs once on initial load
    }
  }, [loadedFilter]);

  useEffect(() => {
    if (selectedPackage && startDate && endDate) {
      fetchAllData();
    }
  },[selectedPackage, startDate, endDate]);

  useEffect(()=>{
    if (searchTermC || limitpc || currentPagec) {
      exportCsvRef.current = false;
      setExportcsvTC(false);
      debouncedFetchTopCampaign();
    }
  },[searchTermC, limitpc, currentPagec]) 
  useEffect(()=>{
    if (searchTermP || limitps || currentPagep) {
      exportCsvRef.current = false;
      setExportcsvTP(false);
      debouncedFetchTopPublisher();
    }
  },[searchTermP, limitps, currentPagep]) 

  useEffect(()=>{
    if (selectedFrequencyE) {
      exportCsvRef.current = false;
      setExportcsvETTrend(false);
      fetchtrafficEventTrend();
    }
  },[selectedFrequencyE])
  useEffect(()=>{
    if (selectedFrequencyV) {
      exportCsvRef.current = false;
      setExportcsvVTTrend(false);
      fetchtrafficVisitTrend();
    }
  }, [selectedFrequencyV]);
 

  return (
    <div className="grid gap-2 w-full">
      <div className=" sticky top-0 z-50 sm:w-full flex flex-cols-3 w-full flex-wrap items-center justify-start gap-4 rounded-md bg-background px-5 py-2">
        <Filter filter={filter} onChange={handleFilterChange} />
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-5 w-full gap-2  min-h-[340px] md:min-h-[300px]">
        <Card className="w-full sm:col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-1 shadow-md rounded-lg bg-white dark:bg-card p-2 h-[300px] overflow-y-auto scrollbar">          {trafficountApiLoading ? (
          <div className="flex items-center justify-center min-h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          stats?.map((card, index) => (
            <div key={index} className="overflow-x-auto scrollbar">
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
              //  isLoading={trafficountApiLoading}
              />
            </div>
          ))
        )}
        </Card>

        {/* Chart Section */}
        <Card
          ref={(el) => (cardRefs.current["visit_traffic_trend"] = el!)}
          className="w-full sm:col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-2 shadow-md rounded-lg bg-white dark:bg-card  h-[300px] overflow-hidden"
        >
          <CardTitle className="p-2 ">
            <HeaderRow
              selectoptions={selectOptionsV}
              handleFrequencyChange={handleFrequencyChangeV}
              selectedFrequency={selectedFrequencyV}
              handleExport={() => {
                setExportcsvVTTrend(true);
              }}
              title="Visit Traffic Trend"
              onExport={() => onExport("png", "Visit Traffic Trend", "visit_traffic_trend")}
              onExpand={() => handleExpand("visit_traffic_trend")}
              isRadioButton={false}
              isSelect={true}
              placeholder="Daily"
            />
          </CardTitle>
          <CardContent className=" w-full  h-full overflow-y-auto scrollbar ">
            <div className="min-w-[900px] overflow-x-auto scrollbar  h-full">
              <StackedBarWithLine
                // visitEventOptions={visitEventOptions}
                // handleTypeChange={handleTypeChange}
                // selectedType="visit"
                chartData={existingVtrend}
                chartConfig={chartConfigs}
                isHorizontal={false}

                isLoading={trafficTrendVisitApiLoading}
                xAxisConfig={{
                  dataKey: "month",
                  tickLine: false,
                  tickMargin: 10,
                  axisLine: false,
                  tickFormatter: (value: string) => value,
                  textAnchor: "middle",
                  dy: 10,
                }}
                YAxis1={{
                  yAxisId: "left",
                  orientation: "left",
                  stroke: "hsl(var(--chart-1))",
                }}
                YAxis2={{
                  yAxisId: "right",
                  orientation: "right",
                  stroke: "hsl(var(--chart-3))",
                }} onExpand={function (): void {
                  throw new Error("Function not implemented.");
                }}
              />
            </div>
          </CardContent>
        </Card>
        {/* Chart Section */}
        <Card
          ref={(el) => (cardRefs.current["event_traffic_trend"] = el!)}
          className="w-full sm:col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-2 shadow-md rounded-lg bg-white dark:bg-card overflow-hidden h-[300px]"
        >
          <CardTitle className="p-2 ">
            <HeaderRow
              selectoptions={selectOptionsE}
              handleFrequencyChange={handleFrequencyChangeE}
              handleExport={() => {
                setExportcsvETTrend(true);
              }}
              selectedFrequency={selectedFrequencyE}
              title="Event Traffic Trend"
              onExport={() => onExport("png", "Eventt Traffic Trend", "event_traffic_trend")}
              onExpand={() => handleExpand("event_traffic_trend")}
              isRadioButton={false}
              isSelect={true}
              placeholder="Daily"
            />
          </CardTitle>
          <CardContent className=" w-full  h-full overflow-y-auto scrollbar ">
            <div className="min-w-[900px] overflow-x-auto scrollbar  h-full">
              <StackedBarWithLine
                // visitEventOptions={visitEventOptions}
                // handleTypeChange={handleTypeChange}
                //  selectedType="event"
                chartData={existingEtrend}
                chartConfig={chartConfigs}
                isHorizontal={false}
                placeholder="Daily"
                isLoading={trafficTrendEventApiLoading}
                xAxisConfig={{
                  dataKey: "month",
                  tickLine: false,
                  tickMargin: 10,
                  axisLine: false,
                  tickFormatter: (value: string) => value,
                  textAnchor: "middle",
                  dy: 10,
                }}
                YAxis1={{
                  yAxisId: "left",
                  orientation: "left",
                  stroke: "hsl(var(--chart-1))",
                }}
                YAxis2={{
                  yAxisId: "right",
                  orientation: "right",
                  stroke: "hsl(var(--chart-3))",
                }} onExpand={function (): void {
                  throw new Error("Function not implemented.");
                }} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 2  */}
      <div className="gap-1 w-full">
        <div className="w-full bg-gray-200 text-sub-header font-semibold grid justify-items-center sm:text-body p-2">
          Distribution By Category
        </div>
        <div className=" grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2  sm:grid-cols-1  w-full gap-2 h-[300px] overflow-hidden">
          <Card
            ref={(el) => (cardRefs.current["visit_traffic"] = el!)}
            className=" w-full shadow-md rounded-none bg-white gap-2  dark:bg-card dark:text-white text-header"
          >
            <CardContent className=" w-full min-h-[300px]">
              <DonutChart
                chartData={existingvisit}
                handleExport={() => {
                  setExportcsvVT(true);
                }}
                chartConfig={chartConfigVisit}
                title="Visit Traffic"
                onExport={() => onExport("png", "Visit Traffic", "visit_traffic")}
                onExpand={() => handleExpand("visit_traffic")}
                // isSelect={true}
                //selectoptions={selectOptions}
                dataKey="visit"
                nameKey="label"
                // placeholder="Weekly"
                isView={true}
                isLoading={visitTrafficApiLoading}
                isPercentageValue={true}
                direction="flex-col"
                isdonut={false}
                marginTop="mt-0"
                position="items-start"
                isPercentage={false}
              />
            </CardContent>
          </Card>

          <Card
            ref={(el) => (cardRefs.current["event_traffic"] = el!)}
            className="w-full shadow-md rounded-none bg-white gap-2 dark:bg-card dark:text-white text-header h-full "
          >
            <CardContent className=" w-full  min-h-[300px]">
              <DonutChart
                chartData={Existingevent}
                handleExport={() => {
                  setExportcsvET(true);
                }}
                chartConfig={chartConfigEvent}
                title="Event Traffic"
                onExport={() => onExport("png", "Event Traffic", "event_traffic")}
                onExpand={() => handleExpand("event_traffic")}
                // isSelect={true}
                // selectoptions={selectOptions}
                dataKey="visit"
                nameKey="label"
                // placeholder="Weekly"
                isLoading={eventTrafficApiLoading}
                isView={true}
                direction="flex-col"
                isdonut={false}
                marginTop="mt-0"
                position="items-start"
                isPercentage={false}
                isPercentageValue={true}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className=" grid grid-cols-1 lg:grid-cols-2 md:grid-cols-1 w-full gap-2 min-h-[200px]">
        <Card
          ref={(el) => (cardRefs.current["top_publisher"] = el!)}
          className="shadow-md rounded-none bg-white gap-2 dark:bg-card dark:text-white p-2 text-header lg:h-[380px] xl:h-[380px] md:h-[380px]  sm:h-[380px] xs:h-[450px]"
        >
          <HeaderRow
            title="Top Sources / Publishers"
            onExport={() => onExport("png", "Top Sources / Publishers", "top_publisher")}
            onExpand={() => handleExpand("top_publisher")}
            //  visitEventOptions={visitEventOptions}
            handleExport={() => {
              setExportcsvTP(true);
            }}
          // handleTypeChange={handleTypeChange}
          // selectedType={selectedType}
          // isRadioButton={false}
          />
          <ResizableTable
            isPaginated={true}
            isPause={false}
            isPlay={false}
            columns={PublisherColumns}
            data={existingPublisher}
            isLoading={topPublisherApiLoading}
            setSearchTerm={setSearchTermP}
            SearchTerm={searchTermP}
            headerColor="#DCDCDC"
            height={210}
            isEdit={false}
            isSearchable={true}
            isDownload={false}
            // onLimitChange={handleLimitChange}
            // onPageChangeP={handlePageChange}
            // data={isLoading ? [] : existingPublisher}
            onLimitChange={(newLimit: number) => {
              setLimitp(newLimit);
              setCurrentPagep(1);
            }}
            onPageChangeP={(newPage: number) => {
              setCurrentPagep(newPage);
            }}
            pageNo={currentPagep}
            totalPages={totalRecordTP}
          />
        </Card>
        <Card
          ref={(el) => (cardRefs.current["top_campaign"] = el!)}
          className="shadow-md rounded-none bg-white gap-4 dark:bg-card dark:text-white p-2 text-header lg:h-[380px] xl:h-[380px] md:h-[380px] sm:h-[410px] xs:h-[450px]"
        >
          <HeaderRow
            title="Top Campaigns"
            onExport={() => onExport("png", "Top Campaigns", "top_campaign")}
            onExpand={() => handleExpand("top_campaign")}
            visitEventOptions={visitEventOptions}
            handleExport={() => {
              setExportcsvTC(true);
            }}
            handleTypeChange={handleTypeChange}
            selectedType={selectedType}
            isRadioButton={false}
          />
          <ResizableTable
            isPaginated={true}
            isPause={false}
            isPlay={false}
            columns={CampaignColumns}
            data={existingCampaign}
            isLoading={topCampaignApiLoading}
            headerColor="#DCDCDC"
            height={210}
            isEdit={false}
            isSearchable={true}
            setSearchTerm={setSearchTermC}
            SearchTerm={searchTermC}
            onLimitChange={(newLimit: number) => {
              setLimitc(newLimit);
              setCurrentPagec(1);
            }}
            onPageChangeP={(newPage: number) => {
              setCurrentPagec(newPage);
            }}
            pageNo={currentPagec}
            totalPages={TotalRecordTC}
          />
        </Card>
      </div>

      <div className="gap-1 w-full h-[400px]">
        <div className="w-full bg-gray-200 text-sub-header font-semibold grid justify-items-center sm:text-body p-2">
          Distribution By Publishber
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-1  lg:grid-cols-2 gap-2">
          <div>
            <Card
              ref={(el) => (cardRefs.current["visit_publisher"] = el!)}
              className=" shadow-md  rounded-none bg-white gap-2 dark:bg-card dark:text-white p-2 w-full h-[400px] "
            >
              <ChartBarStacked
                chartData={ExistingVpublisher}
                chartConfig={chartConfigvp}
                xAxis={xAxisConfigstack}
                isHorizontal={false}
                handleExport={() => {
                  setExportcsvVP(true);
                }}
                title="Visit Traffic"
                onExport={() => onExport("png", "Visit Traffic", "visit_publisher")}
                onExpand={() => handleExpand("visit_publisher")}
                visitEventOptions={visitEventOptions}
                handleTypeChange={handleTypeChange}
                selectedType={selectedType}
                isRadioButton={false}
                layoutDirection="flex-col"
                isLegend={false}
                yAxis={yAxisConfigV}
                ischangeLegend={true}
                isLoading={vPublisherApiLoading}
                isCartesian={true}
                isPercentage={true}
              />
            </Card>
          </div>
          <div>
            <Card
              ref={(el) => (cardRefs.current["event_publisher"] = el!)}
              className=" shadow-md  rounded-none bg-white gap-2 dark:bg-card dark:text-white p-2  w-full h-[400px]"
            >
              <ChartBarStacked
                chartData={ExistingEpublisher}
                chartConfig={chartConfigep}
                xAxis={xAxisConfigstack}
                yAxis={yAxisConfigE}
                isHorizontal={false}
                handleExport={() => {
                  setExportcsvEP(true);
                }}
                title="Event Traffic"
                onExport={() => onExport("png", "Event Traffic", "event_publisher")}
                onExpand={() => handleExpand("event_publisher")}
                visitEventOptions={visitEventOptions}
                handleTypeChange={handleTypeChange}
                selectedType={selectedType}
                isRadioButton={false}
                AxisLabel="Value"
                layoutDirection="flex-col"
                isLegend={false}
                ischangeLegend={true}
                isLoading={ePublisherApiLoading}
                isCartesian={true}

              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;