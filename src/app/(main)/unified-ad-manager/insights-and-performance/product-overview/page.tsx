"use client";

import { Filter, FilterState } from "@/components/mf/Filters";
import ResizableTable, { Column } from "@/components/mf/TableComponent";
import React, { useState } from "react";
import { BulkActionButton, BulkActions } from "../components/BulkActionButton";
import { useAPI } from "@/queries/useAPI";
import Endpoint from "@/common/endpoint";
import { toast } from "@/hooks/use-toast";
import axios, { AxiosRequestConfig } from "axios";
import { useMutation } from "react-query";

const columns: Column<Record<string, string | number>>[] = [
  { title: "Status", key: "status" },
  { title: "Product Name", key: "product_name" },
  { title: "Product Code", key: "product_code" },
  { title: "Platform", key: "platform" },
  { title: "Type", key: "campaign_type" },
  { title: "Clicks", key: "clicks" },
  { title: "Impressions", key: "impressions" },
  { title: "Sales", key: "sales" },
  { title: "Spends", key: "spends" },
  { title: "RoAS", key: "roas" },
  { title: "ACoS (%)", key: "acos" },
];

interface QueryState {
  platform: string[];
  product_code: string[];
}

const ProductOverviewPage: React.FC = () => {
  const [Query, setQuery] = useState<QueryState>({
    platform: ["all"],
    product_code: ["all"],
  });
  const [Selected, setSelected] = useState<Record<string, string | number>[]>(
    [],
  );
  const [RowCount, setRowCount] = useState(0);

  const PlatformFilterData = useAPI<string[], { message: string }>({
    tag: "PlatformFilter",
    options: {
      url: process.env.NEXT_PUBLIC_UAM_DOMAIN + Endpoint.UAM.PLATFORM_FILTER,
      method: "POST",
      data: Query,
    },
  });

  const ProductCodeFilterData = useAPI<string[], { message: string }>({
    tag: "ProductCodeFilter",
    options: {
      url:
        process.env.NEXT_PUBLIC_UAM_DOMAIN + Endpoint.UAM.PRODUCT_CODE_FILTER,
      method: "POST",
      data: Query,
    },
  });

  const ProductData = useAPI<
    Record<string, string | number>[],
    { message: string }
  >({
    tag: "ProductOverview",
    options: {
      url: process.env.NEXT_PUBLIC_UAM_DOMAIN + Endpoint.UAM.PRODUCT_OVERVIEW,
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
    toast({ title: d.message ?? "Status updated successfully" });
    ProductData.refetch();
  };

  const updateStatusMutation = useMutation<any, any, AxiosRequestConfig>({
    mutationFn: (config) => axios(config),
    onSuccess: onActionSuccess,
    onError: onActionError,
  });

  const handleBulkAction = (key: BulkActions) => {
    const payload = {
      product_list: Selected.map((v) => ({
        product_code: v.product_code,
        platform: v.platform,
        product_name: v.product_name || "",
        status: key,
      })),
    };

    const config: AxiosRequestConfig = {
      url:
        process.env.NEXT_PUBLIC_UAM_DOMAIN +
        Endpoint.UAM.PRODUCT_OVERVIEW_UPDATE,
      method: "POST",
      data: payload,
    };

    updateStatusMutation.mutate(config);
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
      "Product Code": {
        filters:
          ProductCodeFilterData?.data?.map((v) => ({
            label: v,
            checked: true,
          })) ?? [],
        is_select_all: true,
        selected_count: ProductCodeFilterData?.data?.length ?? 0,
        loading: ProductCodeFilterData.isLoading,
      },
    }),
    [
      PlatformFilterData.data,
      PlatformFilterData.isLoading,
      ProductCodeFilterData.data,
      ProductCodeFilterData.isLoading,
    ],
  );

  const handleFilterChange = React.useCallback(
    (filterState: any) => {
      const selectedFilters = {
        platform:
          filterState["Platform"]?.filters.every((f: any) => f.checked) ||
          filterState["Platform"]?.is_select_all
            ? ["all"]
            : filterState["Platform"]?.filters
                .filter((f: any) => f.checked)
                .map((f: any) => f.label.toLowerCase()),
        product_code:
          filterState["Product Code"]?.filters.every((f: any) => f.checked) ||
          filterState["Product Code"]?.is_select_all
            ? ["all"]
            : filterState["Product Code"]?.filters
                .filter((f: any) => f.checked)
                .map((f: any) => f.label),
      };

      if (JSON.stringify(selectedFilters) !== JSON.stringify(Query)) {
        setQuery(selectedFilters);
      }
    },
    [Query],
  );

  React.useEffect(() => {
    ProductData.refetch();
  }, [Query]);

  return (
    <div className="container relative bg-card">
      <div className="container sticky top-0 z-10 flex w-full items-center justify-start gap-2 rounded-md bg-background px-2 py-1">
        {PlatformFilterData?.data &&
        PlatformFilterData.data.length > 0 &&
        ProductCodeFilterData?.data &&
        ProductCodeFilterData.data.length > 0 ? (
          <Filter filter={filter} onChange={handleFilterChange} />
        ) : null}
      </div>
      <ResizableTable
        columns={columns}
        data={ProductData.data ?? []}
        isLoading={ProductData.isLoading}
        headerColor="#DCDCDC"
        onEdit={console.log}
        onDelete={console.log}
        onView={console.log}
        onDownload={console.log}
        onRefresh={() => ProductData.refetch()}
        onSelect={(items) => setSelected(items)}
        itemCount={setRowCount}
        actionButton={
          <BulkActionButton count={RowCount} onChange={handleBulkAction} />
        }
        isSearchable
        isSelectable
      />
    </div>
  );
};

export default ProductOverviewPage;
