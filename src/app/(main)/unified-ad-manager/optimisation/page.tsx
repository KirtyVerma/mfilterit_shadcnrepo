"use client";

import ResizableTable, { Column } from "@/components/mf/TableComponent";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useState } from "react";

const campaignColumns: Column<Record<string, string | number>>[] = [
  { title: "Campaign", key: "campaign" },
  { title: "Budget", key: "budget" },
  { title: "Ad Group", key: "ad_group" },
  { title: "Keywords", key: "keywords" },
  { title: "Products", key: "products" },
];

const existingColumns: Column<Record<string, string | number>>[] = [
  { title: "Campaign", key: "campaign" },
  { title: "Start Date", key: "startDate" },
  { title: "End Date", key: "endate" },
  { title: "Budget", key: "budget" },
  { title: "Metric", key: "metric" },
  { title: "Impressions", key: "impressions" },
  { title: "Clicks", key: "clicks" },
  { title: "Spends", key: "spends" },
  { title: "Sales", key: "sales" },
  { title: "Pre Automation RoAS", key: "pre_roas" },
  { title: "Post Automation RoAS", key: "post_roas" },
];

const campaignData = [
  {
    campaign: "SP | Reed Diffuser | Generic Keywords",
    budget: 1000,
    ad_group: "Ad Group 1",
    keywords: "Reed",
    products: "B0918519KF",
  },
  {
    campaign: "SP | Aroma Oil | Generic Keywords",
    budget: 1500,
    ad_group: "Ad Group 2",
    keywords: "Aroma Oil",
    products: "B09184F77F",
  },
];

const existingData = [
  {
    campaign: "SP | Reed Diffuser | Generic Keywords",
    startDate: "2024-03-15",
    endate: "2024-03-22",
    budget: 1000,
    metric: "RoAS",
    impressions: 5000,
    sales: 23800,
    clicks: 200,
    spends: 6800,
    pre_roas: 2.5,
    post_roas: 3.5,
  },
  {
    campaign: "SP | Aroma Oil | Generic Keywords",
    startDate: "2024-03-14",
    endate: "2024-03-21",
    budget: 1500,
    metric: "RoAS",
    impressions: 8000,
    sales: 18900,
    clicks: 300,
    spends: 9000,
    pre_roas: 1.8,
    post_roas: 2.1,
  },
];

const CampaignOverviewPage: React.FC = () => {
  // Dropdown filter states
  const [selectedPlatform, setSelectedPlatform] = useState<
    string | undefined
  >();
  const [selectedCampaign, setSelectedCampaign] = useState<
    string | undefined
  >();
  const [selectedStrategy, setSelectedStrategy] = useState<
    string | undefined
  >();
  const [selectedMetric, setSelectedMetric] = useState<string | undefined>();

  // Filtered data based on dropdown selection
  const filteredCampaignData = campaignData.filter((row) => {
    return (
      (!selectedPlatform || row.campaign.includes(selectedPlatform)) &&
      (!selectedCampaign || row.campaign === selectedCampaign) &&
      (!selectedStrategy || row.keywords === selectedStrategy)
    );
  });

  const filteredExistingData = existingData.filter((row) => {
    return (
      (!selectedPlatform || row.campaign.includes(selectedPlatform)) &&
      (!selectedMetric || row.metric === selectedMetric)
    );
  });

  return (
    <div className="container relative bg-card p-4">
      {/* Campaign Optimisation */}
      <h2 className="mb-4 text-lg font-bold dark:text-white">Campaign Optimisation</h2>
      <div className="mb-3 flex items-center justify-between">
        {/* Platform Dropdown */}
        <div className="w-[300px]">
          <Select
            onValueChange={setSelectedPlatform}
            defaultValue={selectedPlatform}
          >
            <SelectTrigger className="w-full dark:text-white">
              <SelectValue placeholder="Select Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Amazon">Amazon</SelectItem>
              <SelectItem value="Flipkart">Flipkart</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* Campaign Dropdown */}
        <div className="w-[300px]">
          <Select
            onValueChange={setSelectedCampaign}
            defaultValue={selectedCampaign}
          >
            <SelectTrigger className="w-full dark:text-white">
              <SelectValue placeholder="Select Metric" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CTR">CTR</SelectItem>
              <SelectItem value="Clicks">Clicks</SelectItem>
              <SelectItem value="Impressions">Impressions</SelectItem>
              <SelectItem value="Sales">Sales</SelectItem>
              <SelectItem value="RoAS">RoAS</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* Campaign Strategy Dropdown */}
        <div className="w-[300px]">
          <Select
            onValueChange={setSelectedStrategy}
            defaultValue={selectedStrategy}
          >
            <SelectTrigger className="w-full dark:text-white">
              <SelectValue placeholder="Select Strategy" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Conversion">Conversion</SelectItem>
              <SelectItem value="Visibility">Visibility</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="h-[300px]">
        <ResizableTable
          isPaginated={false}
          isPause={false}
          isPlay={false}
          columns={campaignColumns}
          data={filteredCampaignData}
          isLoading={false}
          headerColor="#DCDCDC"
          isSearchable
          isSelectable={true}
          isEdit={false}
        />
      </div>

      <div className="mt-2 flex justify-center">
        <Button variant="default" className="bg-yellow-500 text-black">
          Automate
        </Button>
      </div>

      {/* Existing Optimisation */}
      <h2 className="mb-2 mt-4 text-lg font-bold dark:text-white">Existing Optimisations</h2>
      <div>
        <ResizableTable
          isPaginated={false}
          isSelectable={true}
          columns={existingColumns}
          data={filteredExistingData}
          isLoading={false}
          headerColor="#DCDCDC"
          isSearchable
          isPause={true}
          isPlay={true}
          isEdit={true}
        />
      </div>
    </div>
  );
};

export default CampaignOverviewPage;
