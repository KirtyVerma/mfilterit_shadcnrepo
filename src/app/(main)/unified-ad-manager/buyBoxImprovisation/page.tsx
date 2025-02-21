"use client";

import { Filter, FilterState } from "@/components/mf/Filters";
import ResizableTable, { Column } from "@/components/mf/TableComponent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState, useEffect, useCallback } from "react";
import { useAPI } from "@/queries/useAPI";
import Endpoint from "@/common/endpoint";
import axios, { AxiosRequestConfig } from "axios";
import { toast } from "@/hooks/use-toast";
import { useMutation } from "react-query";
import { Switch } from "@/components/ui/switch";
var username = "gui";
var password = "gui_secret_password@mfilterit";

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
  const [selected, setSelected] = useState<Record<string, string | number>[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [campaignData, setcampaignData] = useState<any>([]);

  useEffect(()=>{
getCampaign()
  },[])
  

  const columns: Column<Record<string, string | number>>[] = [
    { 
      title: "Product", 
      key: "title",
    },
    { 
      title: "Product Code", 
      key: "product_code",
    },
    { 
      title: "Platform", 
      key: "platform",
    },
    {
      title: "Spends",
      key: "spends",
      render: (row: any) => {
        const spends = parseFloat(row.spends).toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        });

        const spendsChange = parseFloat(row.spends_change).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });

        const isPositive = parseFloat(row.spends_change) >= 0;
        const color = isPositive ? "green" : "red";

        return (
          <span>
            {spends} (<span style={{ color }}>{spendsChange}%</span>)
          </span>
        );
      }
    },
    {
      title: "Sales",
      key: "sales",
      render: (row: any) => {
        const sales = parseFloat(row.sales).toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        });

        const salesChange = parseFloat(row.sales_change).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });

        const isPositive = parseFloat(row.sales_change) >= 0;
        const color = isPositive ? "green" : "red";

        return (
          <span>
            {sales} (<span style={{ color }}>{salesChange}%</span>)
          </span>
        );
      }
    },
    {
      title: "Improvisation",
      key: "optimisation_enabled",
      render: (row: any) => {
        const isEnabled = row.optimisation_enabled === "yes" ;
        
        return (
          <Switch
            checked={isEnabled}
            onCheckedChange={(checked) => handleToggleChange(checked, row)}
            disabled={false}
            className="data-[state=checked]:bg-green-500"
          />
        );
      }
    }
  ];

  // const getCampaign=()=>{
  //   axios
  //   .get(
  //     `https://ecomm-ams-api.mfilterit.net/get_buybox_configuration`,
  
  //     {
  //       auth: {
  //         username: username,
  //         password: password,
  //       },
  //     }
  //   )
  //   .then((r) => {
  //     if (r) {
  //       const emptyArr:any = [];
  //       // r.data.data.map((v:any) => {
  //       //   emptyArr.push({ value: v, name: v });
  //       // });
        
  //       setcampaignData(r.data.data);
  // console.log(r,"canpaign")
  //     }
  //   });
  // }
  
  const getCampaign = () => {
    axios
      .get(
        `https://ecomm-ams-api.mfilterit.net/get_buybox_configuration`,
        {
          auth: {
            username: username,
            password: password,
          },
        }
      )
      .then((r) => {
        if (r) {
          const updatedData = r.data.data.map((item: any, index: number) => ({
            ...item,
            id: index, // Add unique id based on index
          }));
  
          setcampaignData(updatedData);
          console.log(updatedData, "campaign");
        }
      })
      .catch((err) => {
        console.error("Error fetching campaign data:", err);
      });
  };
  

  const handleSubmit = () => {
    // const finalData =data?.map(({action_type_values,action_values,comp_sp_brand_share, ...rest
    // })=>rest)

    //  console.log(finalData,"finaldata")
    axios
      .post(
        `https://ecomm-ams-api.mfilterit.net/set_buybox_configuration`,
        {
          data: campaignData,
        },
        {
          auth: {
            username: username,
            password: password,
          },
        }
      )
      .then((respo) => {
        console.log(respo.data, "adgroup");
        if (respo.data.status === "OK") {
          getCampaign()
          // toast.success("Data is submitted successfully");
        } else {
          // toast.error("Update failed");
        }
      });
  };







  // const {
  //   data: campaignData,
  //   isLoading: isCampaignLoading,
  //   refetch: refetchCampaigns,
  // } = useAPI<{ data: Record<string, string | number>[], status: string }, { message: string }>({
  //   tag: "BuyBoxConfiguration",
  //   options: {
  //     url: "https://ecomm-ams-api.mfilterit.net/get_buybox_configuration",
  //     method: "GET",
  //     auth: {
  //       username: username,
  //       password: password,
  //     },
  //   },
  // });
  const handleToggleChange = (checked: boolean, row: any) => {
    setcampaignData((prevCampaignData:any) => {
      const updatedData = prevCampaignData.map((item:any) => {
        if (item.id === row.id) {
          return {
            ...item,
            optimisation_enabled: checked ? "yes" : "no",
          };
        }
        return item;
      });
  
      console.log({ row, updatedData }, "Updated Campaign Data");
      return updatedData;
    });
  };
  
    console.log({campaignData},"row")
  return (
    <div className="container relative bg-card">
      <ResizableTable
        columns={columns}
        data={campaignData ?? []}
        // isLoading={isCampaignLoading}
        headerColor="#DCDCDC"
        // onRefresh={getCampaign}
        onSelect={setSelected}
        itemCount={setRowCount}
        isSearchable
        isSelectable
      />
      <div className="flex justify-center">
      
                    <Button
                      className="mx-auto w-fit"
                      onClick={handleSubmit}
                      // disabled={!campaignName || !adGroupName || platformInfo.length === 0}
                    >
                      Save
                    </Button>
            </div>
    </div>
  );
};

export default CampaignOverviewPage;
