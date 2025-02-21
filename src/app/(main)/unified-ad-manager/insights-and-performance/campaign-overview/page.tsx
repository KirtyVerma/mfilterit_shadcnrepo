"use client";

import { Filter, FilterState } from "@/components/mf/Filters";
import ResizableTable, { Column } from "@/components/mf/TableComponent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  BulkActionButton,
  BulkActions,
  BudgetChangeType,
} from "../components/BulkActionButton";
import { useAPI } from "@/queries/useAPI";
import Endpoint from "@/common/endpoint";
import axios, { AxiosRequestConfig } from "axios";
import { toast } from "@/hooks/use-toast";
import { useMutation } from "react-query";

const columns = ({
  handleBudgetSubmit,
  isLoading,
}: {
  handleBudgetSubmit: (
    budget: string,
    campaignData: Record<string, string | number>,
  ) => void;
  isLoading: boolean;
}): Column<Record<string, string | number>>[] => [
    { title: "Status", key: "status" },
    { title: "Campaign Name", key: "campaign_name" },
    { title: "Platform", key: "platform" },
    { title: "Type", key: "campaign_type" },
    {
      title: "Budget",
      key: "budget",
      render: (data) => (
        <BudgetInput
          defaultValue={data.budget?.toString() ?? "0"}
          handleBudgetSubmit={handleBudgetSubmit}
          campaignData={data}
          isLoading={isLoading}
        />
      ),
    },
    { title: "Clicks", key: "clicks" },
    { title: "Impressions", key: "impressions" },
    { title: "Sales", key: "sales" },
    { title: "Spends", key: "spends" },
    { title: "RoAS", key: "roas" },
    { title: "ACoS (%)", key: "acos" },
  ];

const BudgetInput: React.FC<{
  defaultValue: string;
  handleBudgetSubmit: (
    budget: string,
    campaignData: Record<string, string | number>,
  ) => void;
  campaignData: Record<string, string | number>;
  isLoading?: boolean;
}> = ({ defaultValue, handleBudgetSubmit, campaignData, isLoading }) => {
  const [value, setValue] = useState(defaultValue);

  return (
    <form
      className="flex items-center gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (!value || Number(value) < 0) return;
        handleBudgetSubmit(value, campaignData);
      }}
    >
      <Input
        className="h-8 w-24"
        type="number"
        min={0}
        name="budget"
        placeholder="Budget"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={isLoading}
      />
      <Button
        type="submit"
        size="sm"
        className="h-8 rounded-md"
        disabled={isLoading || !value || Number(value) < 0}
      >
        {isLoading ? "Saving..." : "Save"}
      </Button>
    </form>
  );
};

const CampaignOverviewPage: React.FC = () => {
  const [query, setQuery] = useState({
    platform: ["all"],
    campaign_type: ["all"],
    campaign_name: ["all"],
    status: ["all"],
  });

  console.log(query , "asdasdasdad");
  
  const [selected, setSelected] = useState<Record<string, string | number>[]>(
    [],
  );
  // const [filterState, setFilterState] = useState({}); // Holds the filter state
  const [rowCount, setRowCount] = useState(0);

  const {
    data: campaignData,
    isLoading: isCampaignLoading,
    refetch: refetchCampaigns,
  } = useAPI<Record<string, string | number>[], { message: string }>({
    tag: "CampaignOverview",
    options: {
      url: process.env.NEXT_PUBLIC_UAM_DOMAIN + Endpoint.UAM.CAMPAIGN_OVERVIEW,
      method: "POST",
      data: {
        platform: query.platform ?? ["all"],
        campaign_type: query.campaign_type ?? ["all"],
        campaign_name: query.campaign_name ?? ["all"],
        status: query.status ?? ["all"],
      },
    },
  });

  const PlatformFilterData = useAPI<string[], { message: string }>({
    tag: "PlatformFilter",
    options: {
      url: process.env.NEXT_PUBLIC_UAM_DOMAIN + Endpoint.UAM.PLATFORM_FILTER,
      method: "POST",
    },
  });

  const StatusFilterData = useAPI<string[], { message: string }>({
    tag: "StatusFilter",
    options: {
      url: process.env.NEXT_PUBLIC_UAM_DOMAIN + Endpoint.UAM.STATUS_FILTER,
      method: "POST",
    },
  });

  const CampaignTypeFilterData = useAPI<string[], { message: string }>({
    tag: "CampaignTypeFilter",
    options: {
      url:
        process.env.NEXT_PUBLIC_UAM_DOMAIN + Endpoint.UAM.CAMPAIGN_TYPE_FILTER,
      method: "POST",
      data: {
        platform: query.platform ?? ["all"],
      },
    },
  });

  const CampaignNameFilterData = useAPI<string[], { message: string }>({
    tag: "CampaignNameFilter",
    options: {
      url:
        process.env.NEXT_PUBLIC_UAM_DOMAIN + Endpoint.UAM.CAMPAIGN_NAME_FILTER,
      method: "POST",
      data: {
        platform: query.platform ?? ["all"],
      },
    },
  });

  const handleFilterChange = useCallback(
    async (newState: Record<string, any>) => {
      const payload = {
        platform: newState.Platform?.is_select_all
          ? ["all"]
          : newState.Platform?.filters
              .filter((f: any) => f.checked)
              .map((f: any) => f.label),
        campaign_type: newState["Campaign Type"]?.is_select_all
          ? ["all"]
          : newState["Campaign Type"]?.filters
              .filter((f: any) => f.checked)
              .map((f: any) => f.label),
        campaign_name: newState["Campaign Name"]?.is_select_all
          ? ["all"]
          : newState["Campaign Name"]?.filters
              .filter((f: any) => f.checked)
              .map((f: any) => f.label),
        status: newState.Status?.is_select_all
          ? ["all"]
          : newState.Status?.filters
              .filter((f: any) => f.checked)
              .map((f: any) => f.label),
      };

      setQuery(payload);
    },
    [], // Empty dependency array since we don't use any external values
  );

 // Use a separate effect for campaign data
  useEffect(() => {
      refetchCampaigns();  // Only refetch if campaign_name exists
  
  }, [query.campaign_name]);
  
  useEffect(() => {
    const loadFilters = async () => {
      if (query.platform.length && !PlatformFilterData.isFetching && !StatusFilterData.isFetching) {
        await Promise.all([
          PlatformFilterData.refetch(),
          StatusFilterData.refetch(),
          CampaignTypeFilterData.refetch(),
          CampaignNameFilterData.refetch(),
        ]);
      }
    };
    loadFilters();
  }, [query.platform,query.campaign_type, query.campaign_name, query.status]);
  
  
  const filter = useMemo(
    () => ({
      Platform: {
        filters:
          PlatformFilterData.data?.map((platform) => ({
            label: platform,
            checked: true,
          })) ?? [],
        is_select_all: true,
        selected_count: PlatformFilterData.data?.length ?? 0,
        loading: PlatformFilterData.isLoading,
      },
      Type: {
        filters:
          CampaignTypeFilterData.data?.map((type) => ({
            label: type,
            checked: true,
          })) ?? [],
        is_select_all: true,
        selected_count: CampaignTypeFilterData.data?.length ?? 0,
        loading: CampaignTypeFilterData.isLoading,
      },
      Status: {
        filters:
          StatusFilterData.data?.map((v) => ({
            label: v,
            checked: true,
          })) ?? [],
        is_select_all: true,
        selected_count: StatusFilterData.data?.length ?? 0,
        loading: StatusFilterData.isLoading,
      },
      "Campaign Name": {
        filters:
          CampaignNameFilterData?.data?.map((name) => ({
            label: name,
            checked: true,
          })) ?? [],
        is_select_all: true,
        selected_count: CampaignNameFilterData.data?.length ?? 0,
        loading: CampaignNameFilterData.isLoading,
      },
    }),
    [
      PlatformFilterData.data,
      PlatformFilterData.isLoading,
      CampaignTypeFilterData.data,
      CampaignTypeFilterData.isLoading,
      StatusFilterData.data,
      StatusFilterData.isLoading,
      CampaignNameFilterData.data,
      CampaignNameFilterData.isLoading,
    ],
  );

  console.log(CampaignNameFilterData?.data , "filter----------------------");
  
  const updateBudgetMutation = useMutation<any, any, AxiosRequestConfig>({
    mutationFn: (config) => axios(config),
    onSuccess: (data) => {
      toast({ title: data.message ?? "Updated successfully" });
      refetchCampaigns();
    },
    onError: (error: any) => {
      toast({
        title: error.message ?? "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const handleBudgetSubmit = useCallback(
    (newBudget: string, campaignData: Record<string, string | number>) => {
      const payload = {
        campaign_list: [
          {
            campaign_name: campaignData.campaign_name,
            platform: campaignData.platform,
            campaign_type: campaignData.campaign_type,
            budget: newBudget,
            status: campaignData.status,
            change_type: "increase",
            value_type: "absolute",
          },
        ],
      };

      updateBudgetMutation.mutate({
        url:
          process.env.NEXT_PUBLIC_UAM_DOMAIN +
          Endpoint.UAM.CAMPAIGN_OVERVIEW_POST,
        method: "POST",
        data: payload,
      });
    },
    [updateBudgetMutation],
  );

  const handleBulkAction = useCallback(
    (key: BulkActions, budgetChange?: BudgetChangeType) => {
      if (!selected.length) {
        toast({
          title: "Please select campaigns first",
          variant: "destructive",
        });
        return;
      }

      if (key === "BUDGET_CHANGE" && budgetChange) {
        const payload = {
          campaign_list: selected.map((v) => ({
            campaign_name: v.campaign_name,
            platform: v.platform,
            campaign_type: v.campaign_type,
            budget: budgetChange.amount?.toString(),
            status: v.status,
            change_type: budgetChange.operation,
            value_type: budgetChange.type,
          })),
        };

        updateBudgetMutation.mutate({
          url:
            process.env.NEXT_PUBLIC_UAM_DOMAIN +
            Endpoint.UAM.CAMPAIGN_OVERVIEW_POST,
          method: "POST",
          data: payload,
        });
        return;
      }

      const payload = {
        campaign_list: selected.map((v) => ({
          campaign_name: v.campaign_name,
          platform: v.platform,
          campaign_type: v.campaign_type,
          budget: v.budget ?? "0",
          status: key,
          change_type: "increase",
          value_type: "absolute",
        })),
      };

      updateBudgetMutation.mutate({
        url:
          process.env.NEXT_PUBLIC_UAM_DOMAIN +
          Endpoint.UAM.CAMPAIGN_OVERVIEW_POST,
        method: "POST",
        data: payload,
      });
    },
    [selected, updateBudgetMutation],
  );

  // console.log("agam---------------------------", filterState);

  return (
    <div className="container relative bg-card">
      <div className="container sticky top-0 z-10 flex w-full items-center justify-start gap-2 rounded-md bg-background px-2 py-1">
        {PlatformFilterData?.data &&
          PlatformFilterData.data.length > 0 &&
          StatusFilterData?.data &&
          StatusFilterData.data.length > 0 &&
          CampaignNameFilterData?.data &&
          CampaignNameFilterData.data.length > 0 ? (
          <Filter filter={filter} onChange={handleFilterChange} />
        ) : null}
      </div>
      <ResizableTable
        columns={columns({
          handleBudgetSubmit,
          isLoading: updateBudgetMutation.isLoading,
        })}
        data={campaignData ?? []}
        isLoading={isCampaignLoading}
        headerColor="#DCDCDC"
        onRefresh={refetchCampaigns}
        onSelect={setSelected}
        itemCount={setRowCount}
        actionButton={
          <BulkActionButton
            count={rowCount}
            onChange={handleBulkAction}
            disabled={updateBudgetMutation.isLoading}
          />
        }
        isSearchable
        isSelectable
      />
    </div>
  );
};

export default CampaignOverviewPage;
