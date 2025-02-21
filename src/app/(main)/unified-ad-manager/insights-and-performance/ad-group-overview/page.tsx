"use client";

import { Filter } from "@/components/mf/Filters";
import ResizableTable, { Column } from "@/components/mf/TableComponent";
import React, { useState, useCallback } from "react";
import { BulkActionButton, BulkActions } from "../components/BulkActionButton";
import Endpoint from "@/common/endpoint";
import { useAPI } from "@/queries/useAPI";
import { useMutation } from "react-query";
import { AxiosRequestConfig } from "axios";
import { toast } from "@/hooks/use-toast";
import axios from "axios";

const columns = ({}: { handleBudgetSubmit: (s: string) => void }): Column[] => [
  { title: "Status", key: "status" },
  { title: "Ad Group Name", key: "ad_group_name" },
  { title: "Platform", key: "platform" },
  { title: "Clicks", key: "clicks" },
  { title: "Impressions", key: "impressions" },
  { title: "Sales", key: "sales" },
  { title: "Spends", key: "spends" },
  { title: "RoAS", key: "roas" },
  { title: "ACoS (%)", key: "acos" },
];

const CampaignOverviewPage: React.FC = () => {
  const [RowCount, setRowCount] = useState(0);
  const [Selected, setSelected] = useState<Record<string, string | number>[]>([]);
  const [Query, setQuery] = useState({
    platform: ["all"],
    ad_group_name: ["all"],
    status: ["all"],
  });

  const PlatformFilterData = useAPI<string[], { message: string }>({
    tag: "PlatformFilter",
    options: {
      url: process.env.NEXT_PUBLIC_UAM_DOMAIN + Endpoint.UAM.PLATFORM_FILTER,
      method: "POST",
      data: { platform: Query.platform },
    },
  });

  const AdgrpFilter = useAPI<string[], { message: string }>({
    tag: "AdGroupNameFilter",
    options: {
      url: process.env.NEXT_PUBLIC_UAM_DOMAIN + Endpoint.UAM.AD_GROUP_NAME_FILTER,
      method: "POST",
      data: { platform: Query.platform },
    },
  });

  const AdGroupData = useAPI<Record<string, string | number>[], { message: string }>({
    tag: "AdGroupOverview",
    options: {
      url: process.env.NEXT_PUBLIC_UAM_DOMAIN + Endpoint.UAM.AD_GROUP_OVERVIEW,
      method: "POST",
      data: Query,
    },
  });

  const onActionError = (e: any) => {
    toast({
      title: e.message ?? "Something went wrong",
      variant: "destructive",
    });
  };

  const onActionSuccess = (d: any) => {
    toast({ title: d.message ?? "Success" });
    AdGroupData.refetch();
  };
  

  const Action = useMutation<any, any, AxiosRequestConfig>({
    mutationFn: (config) => axios(config),
    onSuccess: onActionSuccess,
    onError: onActionError,
  });

  const handleAction = (key: BulkActions) => {
    if (!Selected.length) {
      toast({
        title: "Please select ad groups first",
        variant: "destructive",
      });
      return;
    }

    const payload = {
      ad_group_list: Selected.map((v) => ({
        ad_group: v.ad_group_name,
        platform: v.platform,
        status: key,
      })),
    };

    Action.mutate({
      url: process.env.NEXT_PUBLIC_UAM_DOMAIN + Endpoint.UAM.AD_GROUP_UPDATE,
      method: "POST",
      data: payload,
    });
  };

  const filter = React.useMemo(
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
      "Ad Group Name": {
        filters:
          AdgrpFilter?.data?.map((v) => ({
            label: v,
            checked: true,
          })) ?? [],
        is_select_all: true,
        selected_count: AdgrpFilter?.data?.length ?? 0,
        loading: AdgrpFilter.isLoading,
      },
    }),
    [
      PlatformFilterData.data,
      PlatformFilterData.isLoading,
      AdgrpFilter.data,
      AdgrpFilter.isLoading,
    ],
  );

  const handleFilterChange = useCallback(() => {
    const selectedFilters = {
      platform:
        filter.Platform.filters.every((f) => f.checked) ||
        filter.Platform.is_select_all
          ? ["all"]
          : filter.Platform.filters.filter((f) => f.checked).map((f) => f.label),
      ad_group_name:
        filter["Ad Group Name"].filters.every((f) => f.checked) ||
        filter["Ad Group Name"].is_select_all
          ? ["all"]
          : filter["Ad Group Name"].filters.filter((f) => f.checked).map((f) => f.label),
      status: ["all"], // Assuming status is not filtered here
    };

    setQuery(selectedFilters); // Update the query with the selected filters
    AdGroupData.refetch(); // Refetch the ad groups with the updated query
  }, [filter, AdGroupData.refetch]);

  return (
    <div className="relative bg-card">
      <div className="container sticky top-0 z-10 flex w-full items-center justify-start gap-2 rounded-md bg-background px-2 py-1">
        {PlatformFilterData?.data &&
        PlatformFilterData.data.length > 0 &&
        AdgrpFilter?.data &&
        AdgrpFilter.data.length > 0 ? (
          <Filter filter={filter} onChange={handleFilterChange} />
        ) : null}
      </div>
      <ResizableTable
        columns={columns({ handleBudgetSubmit: () => {} })}
        data={AdGroupData.data ?? []}
        isLoading={AdGroupData.isFetching && AdGroupData.data?.length === 0}
        headerColor="#DCDCDC"
        onSelect={(items) => setSelected(items)}
        itemCount={setRowCount}
        onRefresh={() => AdGroupData.refetch()}
        actionButton={
          <BulkActionButton count={RowCount} onChange={handleAction} />
        }
        isSearchable
        isSelectable
      />
    </div>
  );
};

export default CampaignOverviewPage;
