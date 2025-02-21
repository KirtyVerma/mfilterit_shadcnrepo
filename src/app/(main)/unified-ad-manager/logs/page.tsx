"use client";

import ResizableTable, { Column } from "@/components/mf/TableComponent";
import React, { useState } from "react";
import { useAPI } from "@/queries/useAPI";
import Endpoint from "@/common/endpoint";
import { PlayCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useQuery, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Create a client
const queryClient = new QueryClient();

interface CampaignRowData {
  platform: any;
  campaign_name: any;
  inserted_datetime: any;
  budget: number;
  update_status: any;
}

interface AdGrpRowData {
  ad_group: any;
  platform: any;
  inserted_datetime: any;
  update_status: any;
}

interface KeywordData {
  keyword: any;
  platform: any;
  bid: any;
  match_type: any;
  ad_group_name: any;
  campaign_name: any;
  inserted_datetime: any;
  update_status: any;
}

interface productData {
  product_code: any;
  platform: any;
  ad_group_name: any;
  campaign_name: any;
  inserted_datetime: any;
  update_status: any;
}

interface RuleEngineData {
  cname: string;
  ad_grp_name: string;
  keyword: string;
  date_time: string;
  number_action: string;
  status: string;
  details: string;
}

interface RuleEngineDetails {
  budget_decrease?: string;
  campaign_status?: boolean;
  defaultOutputData?: boolean;
  rowError?: string | null;
  rowId?: number;
  ruleId?: string;
}

const adgrpcolumns: Column<AdGrpRowData>[] = [
  { title: "Ad Group Name", key: "ad_group" },
  { title: "Platform", key: "platform" },
  { title: "Date Time", key: "inserted_datetime" },
  {
    title: "Status",
    key: "update_status",
    render: (data: AdGrpRowData) => (
      <span
        className={`rounded-md px-4 py-2 text-white ${data.update_status === "done" ? "bg-green-500" : "bg-red-500"
          }`}
      >
        {data.update_status === "done" ? "Completed" : "Pending"}
      </span>
    ),
  },
];

const overviewcolumns: Column<CampaignRowData>[] = [
  { title: "Platform", key: "platform" },
  { title: "Campaign Name", key: "campaign_name" },
  { title: "Date Time", key: "inserted_datetime" },
  { title: "Budget", key: "budget" },
  {
    title: "Status",
    key: "update_status",
    render: (data: CampaignRowData) => (
      <span
        className={`rounded-md px-4 py-2 text-white ${data.update_status === "done" ? "bg-green-500" : "bg-red-500"
          }`}
      >
        {data.update_status === "done" ? "Completed" : "Pending"}
      </span>
    ),
  },
];

const keywordcolumns: Column<KeywordData>[] = [
  { title: "Keyword", key: "keyword" },
  { title: "Platform", key: "platform" },
  { title: "Bid", key: "bid" },
  { title: "Match Type", key: "match_type" },
  { title: "Ad Group_name", key: "ad_group_name" },
  { title: "Campaign Name", key: "campaign_name" },
  { title: "Date Time", key: "inserted_datetime" },
  {
    title: "Status",
    key: "update_status",
    render: (data: KeywordData) => (
      <span
        className={`rounded-md px-4 py-2 text-white ${data.update_status === "done" ? "bg-green-500" : "bg-red-500"
          }`}
      >
        {data.update_status === "done" ? "Completed" : "Pending"}
      </span>
    ),
  },
];

const productcolumns: Column<productData>[] = [
  { title: "Product Code", key: "product_code" },
  { title: "Platform", key: "platform" },
  { title: "Ad Group_name", key: "ad_group_name" },
  { title: "Campaign Name", key: "campaign_name" },
  { title: "Date Time", key: "inserted_datetime" },
  {
    title: "Status",
    key: "update_status",
    render: (data: productData) => (
      <span
        className={`rounded-md px-4 py-2 text-white ${data.update_status === "done" ? "bg-green-500" : "bg-red-500"
          }`}
      >
        {data.update_status === "done" ? "Completed" : "Pending"}
      </span>
    ),
  },
];

// Create a new component for the details button
const DetailsButton: React.FC<{ rowId: string }> = ({ rowId }) => {
  const [isOpen, setIsOpen] = useState(false);

  const { data: details, refetch, isFetching } = useQuery({
    queryKey: ['ruleEngineDetails', rowId],
    queryFn: async () => {
      try {
        const accessToken = sessionStorage.getItem("AccessToken");
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_UAM_DOMAIN}/api/v1/ecom/unified_ad_manager/rule_engine_api_response/get/${rowId}`,
          {
            headers: {
              Authorization: accessToken ? `${accessToken}` : undefined,
            }
          }
        );

        let apiResponse = [];
        if (typeof response.data.api_response === 'string') {
          const cleanedString = response.data.api_response
            .replace(/'/g, '"')
            .replace(/True/g, 'true')
            .replace(/False/g, 'false')
            .replace(/None/g, 'null');

          try {
            apiResponse = JSON.parse(cleanedString);
          } catch (e) {
            console.error('Failed to parse api_response:', e);
            apiResponse = [];
          }
        } else {
          apiResponse = response.data.api_response || [];
        }

        return {
          apiResponse,
          finalResponse: response.data.final_response || []
        };
      } catch (error) {
        console.error('Error fetching details:', error);
        return { apiResponse: [], finalResponse: [] };
      }
    },
    enabled: isOpen,
    staleTime: 300000,
    gcTime: 300000,
    retry: 1,
  });

  const handleButtonClick = () => {
    setIsOpen(true);
    refetch();
  };

  return (
    <>
      <Button variant="ghost" size="icon" onClick={handleButtonClick}>
        <PlayCircle className="h-5 w-5 text-blue-500 hover:text-blue-700" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-[70vw] max-w-[90vw] h-[80vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Execution Details</DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-auto pr-2">
            {isFetching ? (
              <div className="text-center py-4">Loading...</div>
            ) : (
              <div className="flex gap-4 h-full">
                {/* API Response Table */}
                <div className="flex-1 flex flex-col">
                  <h4 className="font-medium mb-2 flex-shrink-0">Actions Based on Rules</h4>
                  <div className="rounded-lg border flex-1 overflow-auto">
                    {Array.isArray(details?.apiResponse) && details.apiResponse.length > 0 ? (
                      <>
                        <div className="grid grid-cols-2 border-b bg-gray-100 sticky top-0 z-10">
                          <div className="border-r p-3 font-semibold text-gray-700">Columns</div>
                          <div className="p-3 font-semibold text-gray-700">Value Executed</div>
                        </div>
                        <div className="divide-y overflow-auto">
                          {details.apiResponse.map((item, index) => (
                            <div key={index} className="space-y-2 p-2 bg-gray-50">
                              {Object.entries(item).map(([key, value]) => (
                                <div key={key} className="grid grid-cols-2">
                                  <div className="border-r p-2">{key}</div>
                                  <div className="p-2">
                                    {typeof value === 'boolean'
                                      ? value.toString()
                                      : value === null
                                        ? 'null'
                                        : String(value)}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">
                       No Actions Executed
                      </div>
                    )}
                  </div>
                </div>


                {/* Final Response Table */}
                <div className="flex-1 flex flex-col">
                  <h4 className="font-medium mb-2 flex-shrink-0">Ad Manager Actions</h4>
                  <div className="rounded-lg border flex-1 overflow-auto">
                    {Array.isArray(details?.finalResponse) && details.finalResponse.length > 0 ? (
                      <>
                        <div className="grid grid-cols-2 border-b bg-gray-100 sticky top-0 z-10">
                          <div className="border-r p-3 font-semibold text-gray-700">Columns</div>
                          <div className="p-3 font-semibold text-gray-700">Value Executed</div>
                        </div>
                        <div className="divide-y overflow-auto">
                          {details.finalResponse.map((item, index) => (
                            <div key={index} className="space-y-2 p-2 bg-gray-50">
                              {Object.entries(item).map(([key, value]) => (
                                <div key={key} className="grid grid-cols-2">
                                  <div className="border-r p-2">{key}</div>
                                  <div className="p-2">
                                    {typeof value === 'boolean'
                                      ? value.toString()
                                      : value === null
                                        ? 'null'
                                        : String(value)}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">
                       No Actions Executed
                      </div>
                    )}
                  </div>
                </div>

              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

// Update the ruleEngineColumns definition
const ruleEngineColumns: Column<RuleEngineData>[] = [
  { title: "Campaign Name", key: "campaign_name" },
  { title: "Ad Group Name", key: "adgroup_name" },
  { title: "Keyword", key: "keyword" },
  { title: "Date Time", key: "inserted_datetime" },
  { title: "No. of Actions", key: "number_action" },
  {
    title: "Status",
    key: "status",
    render: (data: any) => (
      <span
        className={`rounded-md px-4 py-2 text-white ${data.status === "completed" ? "bg-green-500" : "bg-red-500"
          }`}
      >
        {data.status === "completed" ? "Completed" : "Pending"}
      </span>
    ),
  },
  {
    title: "Show Details",
    key: "details",
    render: (row: any) => <DetailsButton rowId={row.id} />,
  },
];

const CampaignOverviewPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("Campaign Overview Logs");
  const [RowCount, setRowCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [Selected, setSelected] = useState<Record<string, string | number>[]>(
    [],
  );

  const campaignQuery = {
    platform: ["all"],
    campaign_type: ["all"],
    campaign_name: ["all"],
    status: ["all"],
  };
  const adGrpnQuery = {
    platform: ["all"],
    ad_group_name: ["all"],
    status: ["all"],
  };
  const keywordQuery = {
    platform: ["all"],
    status: ["all"],
    keyword: ["all"],
    match_type: ["all"],
  };
  const productQuery = {
    platform: ["all"],
    product_code: ["all"],
    status: ["all"],
    product_status: ["all"],
  };

  const handleTabClick = (tab: string) => {
    setIsLoading(true); // Show loader
    setTimeout(() => {
      setActiveTab(tab); // Update active tab
      setIsLoading(false); // Hide loader
    }, 2000); // 2-second delay
  };
  const campaignOverviewLogs = useAPI<any[], { message: string }>({
    tag: "campaignOverviewLogs",
    options: {
      url: process.env.NEXT_PUBLIC_UAM_DOMAIN + Endpoint.UAM.CAMPAIGN_LOGS,
      method: "POST",
      data: campaignQuery,
    },
  });

  const adGrpLogs = useAPI<any[], { message: string }>({
    tag: "adGrpLogs",
    options: {
      url: process.env.NEXT_PUBLIC_UAM_DOMAIN + Endpoint.UAM.AD_GROUP_LOGS,
      method: "POST",
      data: adGrpnQuery,
    },
  });

  const KeywordsLogs = useAPI<any[], { message: string }>({
    tag: "KeywordsLogs",
    options: {
      url: process.env.NEXT_PUBLIC_UAM_DOMAIN + Endpoint.UAM.KEYWORD_LOGS,
      method: "POST",
      data: keywordQuery,
    },
  });

  const productsLogs = useAPI<any[], { message: string }>({
    tag: "productsLogs",
    options: {
      url: process.env.NEXT_PUBLIC_UAM_DOMAIN + Endpoint.UAM.PRODUCT_LOGS,
      method: "POST",
      data: productQuery,
    },
  });

  const ruleEngineLogs = useAPI<any[], { message: string }>({
    tag: "ruleEngineLogs",
    options: {
      url: process.env.NEXT_PUBLIC_UAM_DOMAIN + Endpoint.UAM.RULE_LOGS,
      method: "POST",
      auth: {
        username: "gui",
        password: "gui_secret_password@mfilterit",
      },
    },
  });

  // console.log(ruleEngineLogs.data, "ruleEngineLogs------------------");

  const renderTable = () => {
    if (isLoading) {
      return <div className="py-4 text-center">Loading...</div>;
    }
    switch (activeTab) {
      case "Campaign Overview Logs":
        return (
          <ResizableTable
            columns={overviewcolumns}
            data={campaignOverviewLogs.data || []}
            isLoading={campaignOverviewLogs.isFetching}
            headerColor="#DCDCDC"
            // onSelect={(items) => setSelected(items)}
            itemCount={setRowCount}
            isSearchable
          // isSelectable
          />
        );
      case "Ad Group Overview Logs":
        return (
          <ResizableTable
            columns={adgrpcolumns}
            data={adGrpLogs.data || []}
            isLoading={adGrpLogs.isFetching}
            headerColor="#DCDCDC"
            // onSelect={(items) => setSelected(items)}
            itemCount={setRowCount}
            isSearchable
          // isSelectable
          />
        );
      case "Keyword Overview Logs":
        return (
          <ResizableTable
            columns={keywordcolumns}
            data={KeywordsLogs.data || []}
            isLoading={KeywordsLogs.isFetching}
            headerColor="#DCDCDC"
            // onSelect={(items) => setSelected(items)}
            itemCount={setRowCount}
            isSearchable
          // isSelectable
          />
        );

      case "Product Overview Logs":
        return (
          <ResizableTable
            columns={productcolumns}
            data={productsLogs.data || []}
            isLoading={productsLogs.isFetching}
            headerColor="#DCDCDC"
            itemCount={setRowCount}
            isSearchable
          />
        );

      case "Rule Engine Logs":
        return (
          <ResizableTable
            columns={ruleEngineColumns}
            data={ruleEngineLogs.data ?? []}
            isLoading={false}
            headerColor="#DCDCDC"
            itemCount={setRowCount}
            isSearchable
            isSelectable
          />
        );

      default:
        return null;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="relative bg-card">
        {/* Tab Buttons */}
        <div className="flex gap-4 bg-gray-100 p-4">
          {[
            "Campaign Overview Logs",
            "Ad Group Overview Logs",
            "Keyword Overview Logs",
            "Product Overview Logs",
            "Rule Engine Logs",
          ].map((tab) => (
            <button
              key={tab}
              className={`rounded-md px-4 py-2 transition-colors duration-200 ${activeTab === tab
                ? "bg-secondary text-white"
                : "bg-gray-200 hover:bg-gray-300"
                }`}
              onClick={() => handleTabClick(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Render Table Based on Active Tab */}
        <div className="p-4">{renderTable()}</div>
      </div>
    </QueryClientProvider>
  );
};

export default CampaignOverviewPage;
