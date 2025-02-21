"use client";

import React, { useState, useCallback } from "react";
import { Filter } from "@/components/mf/Filters";
import ResizableTable, { Column } from "@/components/mf/TableComponent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BulkActionButton,
  BulkActions,
  BudgetChangeType,
} from "../components/BulkActionButton";
import { useAPI } from "@/queries/useAPI";
import Endpoint from "@/common/endpoint";
import { toast } from "@/hooks/use-toast";
import { AxiosRequestConfig } from "axios";
import { useMutation } from "react-query";
import axios from "axios";

interface FilterItem {
  label: string;
  checked: boolean;
}

interface FilterGroup {
  filters: FilterItem[];
  is_select_all: boolean;
  selected_count: number;
}

interface LocalFilterState {
  [key: string]: FilterGroup;
}

interface QueryState {
  platform: string[];
  status: string[];
  keyword: string[];
  match_type: string[];
}

const columns = ({
  handleBudgetSubmit,
}: {
  handleBudgetSubmit: (
    item: Record<string, string | number>,
    v: string,
  ) => void;
}): Column<Record<string, string | number>>[] => [
  { title: "Status", key: "status" },
  { title: "Keyword", key: "keyword" },
  { title: "Platform", key: "platform" },
  { title: "Match Type", key: "campaign_type" },
  { title: "CTR", key: "ctr" },
  { title: "Sales", key: "sales" },
  { title: "Spends", key: "spends" },
  { title: "RoAS", key: "roas" },
  {
    title: "Bid",
    key: "bid",
    render: (data) => (
      <BidInput
        defaultValue={data.bid + ""}
        handleBudgetSubmit={(v) => handleBudgetSubmit(data, v)}
      />
    ),
  },
];

const BidInput: React.FC<{
  defaultValue: string;
  handleBudgetSubmit: (s: string) => void;
}> = ({ defaultValue, handleBudgetSubmit }) => {
  return (
    <form
      className="flex items-center gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        const b = e.currentTarget.budget as HTMLInputElement;
        handleBudgetSubmit(b.value);
      }}
    >
      <Input
        className="h-8 w-20"
        type="number"
        min={0}
        step={0.01}
        name="budget"
        placeholder="Budget"
        defaultValue={defaultValue}
      />
      <Button type="submit" size="sm" className="h-8 rounded-md">
        Save
      </Button>
    </form>
  );
};

const KeywordOverviewPage: React.FC = () => {
  const [RowCount, setRowCount] = useState(0);
  const [Selected, setSelected] = useState<Record<string, string | number>[]>(
    [],
  );
  const [Query, setQuery] = useState<QueryState>({
    platform: ["all"],
    status: ["all"],
    keyword: ["all"],
    match_type: ["all"],
  });

  const PlatformFilterData = useAPI<string[], { message: string }>({
    tag: "PlatformFilter",
    options: {
      url: process.env.NEXT_PUBLIC_UAM_DOMAIN + Endpoint.UAM.PLATFORM_FILTER,
      method: "POST",
      data: Query,
    },
  });

  const StatusFilterData = useAPI<string[], { message: string }>({
    tag: "StatusFilter",
    options: {
      url: process.env.NEXT_PUBLIC_UAM_DOMAIN + Endpoint.UAM.STATUS_FILTER,
      method: "POST",
      data: Query,
    },
  });

  const KeywordFilterData = useAPI<string[], { message: string }>({
    tag: "KeywordFilter",
    options: {
      url: process.env.NEXT_PUBLIC_UAM_DOMAIN + Endpoint.UAM.KEYWORD_FILTER,
      method: "POST",
      data: Query,
    },
  });

  const MatchTypeFilterData = useAPI<string[], { message: string }>({
    tag: "MatchTypeFilter",
    options: {
      url: process.env.NEXT_PUBLIC_UAM_DOMAIN + Endpoint.UAM.MATCH_TYPE_FILTER,
      method: "POST",
      data: Query,
    },
  });

  const KeywordData = useAPI<
    Record<string, string | number>[],
    { message: string }
  >({
    tag: "KeywordOverview",
    options: {
      url: process.env.NEXT_PUBLIC_UAM_DOMAIN + Endpoint.UAM.KEYWORD_OVERVIEW,
      method: "POST",
      data: Query,
    },
  });

  const onActionError = (e: { message?: string }) => {
    toast({
      title: e.message ?? "Something went wrong",
      variant: "destructive",
    });
  };
  const onActionSuccess = (d: { message?: string }) => {
    toast({ title: d.message ?? "Success" });
    KeywordData.refetch();
  };

  const Action = useMutation<any, any, AxiosRequestConfig>({
    mutationFn: (config) => axios(config),
    onSuccess: onActionSuccess,
    onError: onActionError,
  });

  const handleBudgetSubmit = (
    item: Record<string, string | number>,
    value: string,
  ) => {
    console.log(item, value);
    const b = {
      keyword_list: [
        {
          keyword: item.keyword,
          platform: item.platform,
          status: item.status,
          bid: value,
          change_type: "increase",
          value_type: "absolute",
        },
      ],
    };
    const c: AxiosRequestConfig = {
      url: process.env.NEXT_PUBLIC_UAM_DOMAIN + Endpoint.UAM.KEYWORD_UPDATE,
      method: "POST",
      data: b,
    };
    Action.mutate(c);
  };

  const handleBulkAction = useCallback(
    (key: BulkActions, budgetChange?: BudgetChangeType) => {
      if (!Selected.length) {
        toast({
          title: "Please select keywords first",
          variant: "destructive",
        });
        return;
      }

      if (key === "BUDGET_CHANGE" && budgetChange) {
        const payload = {
          keyword_list: Selected.map((v) => ({
            keyword: v.keyword,
            platform: v.platform,
            status: v.status,
            bid: budgetChange.amount.toString(),
            change_type: budgetChange.operation,
            value_type: budgetChange.type,
          })),
        };

        Action.mutate({
          url: process.env.NEXT_PUBLIC_UAM_DOMAIN + Endpoint.UAM.KEYWORD_UPDATE,
          method: "POST",
          data: payload,
        });
        return;
      }

      const payload = {
        keyword_list: Selected.map((v) => ({
          keyword: v.keyword,
          platform: v.platform,
          status: key,
          bid: v.bid ?? "0",
          change_type: "increase",
          value_type: "absolute",
        })),
      };

      Action.mutate({
        url: process.env.NEXT_PUBLIC_UAM_DOMAIN + Endpoint.UAM.KEYWORD_UPDATE,
        method: "POST",
        data: payload,
      });
    },
    [Selected, Action],
  );

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
      Status: {
        filters:
          StatusFilterData?.data?.map((v) => ({
            label: v,
            checked: true,
          })) ?? [],
        is_select_all: true,
        selected_count: StatusFilterData.data?.length ?? 0,
        loading: StatusFilterData.isLoading,
      },
      Keyword: {
        filters:
          KeywordFilterData?.data?.map((v) => ({
            label: v,
            checked: true,
          })) ?? [],
        is_select_all: true,
        selected_count: KeywordFilterData?.data?.length ?? 0,
        loading: KeywordFilterData.isLoading,
      },
      "Match Type": {
        filters:
          MatchTypeFilterData?.data?.map((v) => ({
            label: v,
            checked: true,
          })) ?? [],
        is_select_all: true,
        selected_count: MatchTypeFilterData?.data?.length ?? 0,
        loading: MatchTypeFilterData.isLoading,
      },
    }),
    [
      PlatformFilterData.data,
      PlatformFilterData.isLoading,
      StatusFilterData.data,
      StatusFilterData.isLoading,
      KeywordFilterData.data,
      KeywordFilterData.isLoading,
      MatchTypeFilterData.data,
      MatchTypeFilterData.isLoading,
    ],
  );

  const handleFilterChange = React.useCallback(
    (filterState: LocalFilterState) => {
      const selectedFilters = {
        platform:
          filterState["Platform"]?.filters.every((f) => f.checked) ||
          filterState["Platform"]?.is_select_all
            ? ["all"]
            : filterState["Platform"]?.filters
                .filter((f) => f.checked)
                .map((f) => f.label.toLowerCase()),
        status:
          filterState["Status"]?.filters.every((f) => f.checked) ||
          filterState["Status"]?.is_select_all
            ? ["all"]
            : filterState["Status"]?.filters
                .filter((f) => f.checked)
                .map((f) => f.label),
        keyword:
          filterState["Keyword"]?.filters.every((f) => f.checked) ||
          filterState["Keyword"]?.is_select_all
            ? ["all"]
            : filterState["Keyword"]?.filters
                .filter((f) => f.checked)
                .map((f) => f.label),
        match_type:
          filterState["Match Type"]?.filters.every((f) => f.checked) ||
          filterState["Match Type"]?.is_select_all
            ? ["all"]
            : filterState["Match Type"]?.filters
                .filter((f) => f.checked)
                .map((f) => f.label),
      };

      // Only update Query state if it has changed
      if (JSON.stringify(selectedFilters) !== JSON.stringify(Query)) {
        setQuery(selectedFilters);
      }
    },
    [Query],
  );

  React.useEffect(() => {
    KeywordData.refetch();
  }, [Query]);

  return (
    <div className="container relative bg-card">
      <div className="container sticky top-0 z-10 flex w-full items-center justify-start gap-2 rounded-md bg-background px-2 py-1">
        {PlatformFilterData?.data &&
        PlatformFilterData.data.length > 0 &&
        StatusFilterData?.data &&
        StatusFilterData.data.length > 0 &&
        KeywordFilterData?.data &&
        KeywordFilterData.data.length > 0 &&
        MatchTypeFilterData?.data &&
        MatchTypeFilterData.data.length > 0 ? (
          <Filter
            filter={filter}
            onChange={(filterState: any) => handleFilterChange(filterState)}
          />
        ) : null}
      </div>
      <ResizableTable
        columns={columns({ handleBudgetSubmit })}
        data={KeywordData.data ?? []}
        isLoading={KeywordData.isFetching}
        headerColor="#DCDCDC"
        onEdit={console.log}
        onDelete={console.log}
        onView={console.log}
        onDownload={console.log}
        onRefresh={() => KeywordData.refetch()}
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

export default KeywordOverviewPage;
