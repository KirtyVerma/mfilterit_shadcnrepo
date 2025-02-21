"use client";

import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { CircleMinus, CirclePlus, Download, Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Endpoint from "@/common/endpoint";
import axios, { AxiosRequestConfig } from "axios";
import { useMutation } from "react-query";
import { toast } from "@/hooks/use-toast";

const PLATFORM_OPTIONS = ["Amazon", "Blinkit", "Flipkart"] as const;

const CAMPAIGN_TYPE_MAP = {
  Amazon: ["Sponsored Product"],
  Flipkart: ["PCA"],
  Blinkit: ["Product Booster Ads"],
} as const;

const MATCH_TYPE_OPTIONS = ["Broad", "Exact", "Phrase"] as const;
const CAMPAIGN_GOAL = ["Visibility", "Reach", "Conversions"] as const;

const downloadCSV = (headers: string[], rows: any[] = [], filename: string) => {
  // Create CSV content
  const csvContent = [
    headers.join(','), // Header row
    ...rows.map(row => 
      headers.map(header => 
        // Wrap values in quotes to handle commas in values
        `"${row[header.toLowerCase().replace(/ /g, '_')] || ''}"`
      ).join(',')
    )
  ].join('\n');

  // Create blob and download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const Campaign = () => {
  const [campaignName, setCampaignName] = useState("");
  const [adGroupName, setAdGroupName] = useState("");
  const [campaignGoal, setCampaignGoal] = useState("");
  const [platformInfo, setPlatformInfo] = useState<
    Array<{
      platform: string;
      budget: string;
      campaign_type: string;
    }>
  >([]);
  const [productInfo, setProductInfo] = useState<
    Array<{
      product_code: string;
      platform: string;
    }>
  >([]);
  const [keywordInfo, setKeywordInfo] = useState<
    Array<{
      keyword: string;
      match_type: string;
      bid: string;
      platform: string;
    }>
  >([]);

  const createCampaignMutation = useMutation<any, any, AxiosRequestConfig>({
    mutationFn: (config) => axios(config),
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: data.message || "Campaign created successfully",
      });
      // Reset form or redirect as needed
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create campaign",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    const payload = {
      campaign_name: campaignName,
      ad_group_name: adGroupName,
      campaign_goal: campaignGoal,
      platform_info: platformInfo.map((info) => ({
        platform: info.platform,
        budget: info.budget,
        campaign_type: info.campaign_type,
      })),
      product_info: productInfo,
      keyword_info: keywordInfo,
    };

    const config: AxiosRequestConfig = {
      url: process.env.NEXT_PUBLIC_UAM_DOMAIN + Endpoint.UAM.CREATE_CAMPAIGN,
      method: "POST",
      data: payload,
    };

    createCampaignMutation.mutate(config);
  };

  return (
    <div className="scrollbar relative flex h-full flex-col gap-2 overflow-y-scroll md:flex-row md:pr-2">
      <div className="flex flex-col gap-2 md:w-2/3">
        <CampaignInfo
          campaignName={campaignName}
          adGroupName={adGroupName}
          campaignGoal={campaignGoal}
          setCampaignName={setCampaignName}
          setAdGroupName={setAdGroupName}
          setCampaignGoal={setCampaignGoal}
        />
        <PlatformInfo data={platformInfo} setData={setPlatformInfo} />
        <ProductInfo data={productInfo} setData={setProductInfo} />
        <KeywordInfo data={keywordInfo} setData={setKeywordInfo} />
        <Button
          className="mx-auto w-fit"
          onClick={handleSave}
          disabled={!campaignName || !adGroupName || platformInfo.length === 0}
        >
          Save
        </Button>
      </div>
      <div className="md:sticky md:top-0 md:w-1/3">
        <SummaryInfo
          platformInfo={platformInfo}
          keywordInfo={keywordInfo}
          productInfo={productInfo}
        />
      </div>
    </div>
  );
};

export default Campaign;

const SummaryInfo: React.FC<{
  platformInfo: Array<{
    platform: string;
    budget: string;
    campaign_type: string;
  }>;
  keywordInfo: Array<{
    keyword: string;
    match_type: string;
    bid: string;
    platform: string;
  }>;
  productInfo: Array<{
    product_code: string;
    platform: string;
  }>;
}> = ({ platformInfo, keywordInfo, productInfo }) => {
  // Get distinct count of platforms
  const distinctPlatforms = new Set(platformInfo.map((p) => p.platform)).size;

  // Get distinct count of keywords
  const distinctKeywords = new Set(keywordInfo.map((k) => k.keyword)).size;

  // Get distinct count of product codes
  const distinctProductCodes = new Set(productInfo.map((p) => p.product_code))
    .size;

  // Get product codes count by platform
  const productCodesByPlatform = productInfo.reduce(
    (acc, curr) => {
      acc[curr.platform] = (acc[curr.platform] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  // Get budgets by platform
  const budgetsByPlatform = platformInfo.reduce(
    (acc, curr) => {
      acc[curr.platform] = curr.budget;
      return acc;
    },
    {} as Record<string, string>,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div>Platforms: {distinctPlatforms}</div>
        <div>Keywords: {distinctKeywords}</div>
        <div>Product Codes: {distinctProductCodes}</div>

        {/* Product codes by platform */}
        <div className="space-y-1">
          <div className="font-medium">Product Codes by Platform:</div>
          {Object.entries(productCodesByPlatform).map(([platform, count]) => (
            <div key={platform}>
              {platform}: {count}
            </div>
          ))}
        </div>

        {/* Budgets by platform */}
        <div className="space-y-1">
          <div className="font-medium">Budget:</div>
          {Object.entries(budgetsByPlatform).map(([platform, budget]) => (
            <div key={platform}>
              {platform}: {budget}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const CampaignInfo: React.FC<{
  campaignName: string;
  adGroupName: string;
  campaignGoal: string;
  setCampaignName: (name: string) => void;
  setAdGroupName: (name: string) => void;
  setCampaignGoal: (goal: string) => void;
}> = ({
  campaignName,
  adGroupName,
  campaignGoal,
  setCampaignName,
  setAdGroupName,
  setCampaignGoal,
}) => {
  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>Campaign Info</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            placeholder="Campaign Name"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
          />
          <Input
            placeholder="Ad Group Name"
            value={adGroupName}
            onChange={(e) => setAdGroupName(e.target.value)}
          />
          <select
            value={campaignGoal}
            onChange={(e) => setCampaignGoal(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Select Campaign Goal</option>
            {CAMPAIGN_GOAL.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </CardContent>
    </Card>
  );
};

const PlatformInfo: React.FC<{
  data: Array<{
    platform: string;
    budget: string;
    campaign_type: string;
  }>;
  setData: React.Dispatch<
    React.SetStateAction<
      Array<{
        platform: string;
        budget: string;
        campaign_type: string;
      }>
    >
  >;
}> = ({ data, setData }) => {
  const [T, setT] = useState(false);

  const handleDownloadSample = () => {
    const headers = ['Budget', 'Platform', 'Campaign Type'];
    downloadCSV(headers, data, 'platform_info_sample');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>Platform Info</span>{" "}
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon" title="Download sample CSV" onClick={handleDownloadSample}>
              <Download />
            </Button>
            <Button variant="ghost" size="icon" title="Upload CSV">
              <Upload />
            </Button>
          </div>
          <Button variant="outline" onClick={() => setT(!T)}>
            Add Platform Level
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="px-6 py-3">Budget</th>
                <th className="px-6 py-3">Platform</th>
                <th className="px-6 py-3">Campaign Type</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="px-6 py-4">{item.budget}</td>
                  <td className="px-6 py-4">{item.platform}</td>
                  <td className="px-6 py-4">{item.campaign_type}</td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-4 text-center text-muted-foreground"
                  >
                    No platform data added yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
      <ProductDialog
        open={T}
        setT={setT}
        onSave={(newData) => {
          setData(
            newData.map((item) => ({
              platform: item.platform,
              budget: item.budget,
              campaign_type: item.campaignType,
            })),
          );
          setT(false);
        }}
      />
    </Card>
  );
};

const ProductDialog: React.FC<{
  open: boolean;
  setT: React.Dispatch<React.SetStateAction<boolean>>;
  onSave: (d: Record<string, string>[]) => void;
}> = ({ open, setT, onSave }) => {
  const [Data, setData] = useState<
    Array<{
      budget: string;
      platform: string;
      campaignType: string;
    }>
  >([]);
  const budgetRef = useRef<HTMLInputElement>(null);
  const platformRef = useRef<HTMLSelectElement>(null);
  const campaignTypeRef = useRef<HTMLSelectElement>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<
    keyof typeof CAMPAIGN_TYPE_MAP | ""
  >("");

  const handleAdd = () => {
    if (!budgetRef.current || !platformRef.current || !campaignTypeRef.current)
      return;

    const budget = budgetRef.current.value;
    const platform = platformRef.current.value;
    const campaignType = campaignTypeRef.current.value;

    // Validate that fields are not empty
    if (!budget || !platform || !campaignType) {
      return;
    }

    setData([...Data, { budget, platform, campaignType }]);

    // Clear input fields after adding
    budgetRef.current.value = "";
    platformRef.current.value = "";
    campaignTypeRef.current.value = "";
  };

  const handleRemove = (index: number) => {
    setData(Data.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    // Get current input values
    const budget = budgetRef.current?.value;
    const platform = platformRef.current?.value;
    const campaignType = campaignTypeRef.current?.value;

    let dataToSave = [...Data];

    // If current input fields are filled, add them to the data
    if (budget && platform && campaignType) {
      dataToSave = [...dataToSave, { budget, platform, campaignType }];
    }

    // Save all data (including both stored rows and current input if filled)
    onSave(dataToSave);
    setT(false);
  };

  // Reset data when modal is closed
  React.useEffect(() => {
    if (!open) {
      setData([]);
      if (budgetRef.current) budgetRef.current.value = "";
      if (platformRef.current) platformRef.current.value = "";
      if (campaignTypeRef.current) campaignTypeRef.current.value = "";
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={(t) => setT(t)}>
      <DialogContent className="w-[70vw] max-w-[90vw]">
        <DialogHeader>
          <DialogTitle>Add Platform Level Data</DialogTitle>
        </DialogHeader>
        <div className="m-2 flex flex-col gap-2">
          <div className="flex gap-2">
            <Input placeholder="Budget" ref={budgetRef} />
            <select
              ref={platformRef}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              onChange={(e) =>
                setSelectedPlatform(
                  e.target.value as keyof typeof CAMPAIGN_TYPE_MAP,
                )
              }
            >
              <option value="">Select Platform</option>
              {PLATFORM_OPTIONS.map((platform) => (
                <option key={platform} value={platform}>
                  {platform}
                </option>
              ))}
            </select>
            <select
              ref={campaignTypeRef}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!selectedPlatform}
            >
              <option value="">Select Campaign Type</option>
              {selectedPlatform &&
                CAMPAIGN_TYPE_MAP[selectedPlatform].map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
            </select>
            <Button
              size="icon"
              className="rounded-md px-2"
              onClick={handleAdd}
              title="Add another row"
            >
              <CirclePlus />
            </Button>
          </div>
          {Data.map((v, i) => (
            <div key={i} className="flex gap-2">
              <Input value={v.budget} placeholder="Budget" disabled />
              <Input value={v.platform} placeholder="Platform" disabled />
              <Input
                value={v.campaignType}
                placeholder="Campaign Type"
                disabled
              />
              <Button
                size="icon"
                className="rounded-md px-2"
                onClick={() => handleRemove(i)}
              >
                <CircleMinus />
              </Button>
            </div>
          ))}
          <Button
            className="ml-auto w-fit"
            onClick={handleSave}
            // disabled={
            //   (!budgetRef.current?.value ||
            //     !platformRef.current?.value ||
            //     !campaignTypeRef.current?.value) &&
            //   Data.length === 0
            // }
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ProductInfo: React.FC<{
  data: Array<{
    product_code: string;
    platform: string;
  }>;
  setData: React.Dispatch<
    React.SetStateAction<
      Array<{
        product_code: string;
        platform: string;
      }>
    >
  >;
}> = ({ data, setData }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDownloadSample = () => {
    const headers = ['Product Code', 'Platform'];
    downloadCSV(headers, data, 'product_info_sample');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>Product Info</span>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon" title="Download sample CSV" onClick={handleDownloadSample}>
              <Download />
            </Button>
            <Button variant="ghost" size="icon" title="Upload CSV">
              <Upload />
            </Button>
            <Button variant="outline" onClick={() => setIsOpen(true)}>
              Add Product Info
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="px-6 py-3">Product Code</th>
                <th className="px-6 py-3">Platform</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="px-6 py-4">{item.product_code}</td>
                  <td className="px-6 py-4">{item.platform}</td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td
                    colSpan={2}
                    className="px-6 py-4 text-center text-muted-foreground"
                  >
                    No product data added yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
      <ProductInfoDialog open={isOpen} setOpen={setIsOpen} onSave={setData} />
    </Card>
  );
};

const ProductInfoDialog: React.FC<{
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSave: (d: Array<{ product_code: string; platform: string }>) => void;
}> = ({ open, setOpen, onSave }) => {
  const [Data, setData] = useState<
    Array<{ product_code: string; platform: string }>
  >([]);
  const productCodeRef = useRef<HTMLInputElement>(null);
  const platformRef = useRef<HTMLSelectElement>(null);

  const handleAdd = () => {
    if (!productCodeRef.current || !platformRef.current) return;

    const product_code = productCodeRef.current.value;
    const platform = platformRef.current.value;

    if (!product_code || !platform) return;

    setData([...Data, { product_code, platform }]);

    productCodeRef.current.value = "";
    platformRef.current.value = "";
  };

  const handleRemove = (index: number) => {
    setData(Data.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const product_code = productCodeRef.current?.value;
    const platform = platformRef.current?.value;

    let dataToSave = [...Data];

    // If there's data in the input fields, add it to dataToSave
    if (product_code && platform) {
      dataToSave.push({ product_code, platform });
    }

    // Save if we have data either in the list or in input fields
    if (dataToSave.length > 0) {
      onSave(dataToSave);
      setOpen(false);
    }
  };

  React.useEffect(() => {
    if (!open) {
      setData([]);
      if (productCodeRef.current) productCodeRef.current.value = "";
      if (platformRef.current) platformRef.current.value = "";
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[70vw] max-w-[90vw]">
        <DialogHeader>
          <DialogTitle>Add Product Info</DialogTitle>
        </DialogHeader>
        <div className="m-2 flex flex-col gap-2">
          <div className="flex gap-2">
            <Input placeholder="Product Code" ref={productCodeRef} />
            <select
              ref={platformRef}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select Platform</option>
              {PLATFORM_OPTIONS.map((platform) => (
                <option key={platform} value={platform}>
                  {platform}
                </option>
              ))}
            </select>
            <Button
              size="icon"
              className="rounded-md px-2"
              onClick={handleAdd}
              title="Add another row"
            >
              <CirclePlus />
            </Button>
          </div>
          {Data.map((v, i) => (
            <div key={i} className="flex gap-2">
              <Input
                value={v.product_code}
                placeholder="Product Code"
                disabled
              />
              <Input value={v.platform} placeholder="Platform" disabled />
              <Button
                size="icon"
                className="rounded-md px-2"
                onClick={() => handleRemove(i)}
              >
                <CircleMinus />
              </Button>
            </div>
          ))}
          <Button className="ml-auto w-fit" onClick={handleSave}>
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const KeywordInfo: React.FC<{
  data: Array<{
    keyword: string;
    match_type: string;
    bid: string;
    platform: string;
  }>;
  setData: React.Dispatch<
    React.SetStateAction<
      Array<{
        keyword: string;
        match_type: string;
        bid: string;
        platform: string;
      }>
    >
  >;
}> = ({ data, setData }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDownloadSample = () => {
    const headers = ['Keyword', 'Match Type', 'Bid', 'Platform'];
    downloadCSV(headers, data, 'keyword_info_sample');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>Keyword Info</span>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon" title="Download sample CSV" onClick={handleDownloadSample}>
              <Download />
            </Button>
            <Button variant="ghost" size="icon" title="Upload CSV">
              <Upload />
            </Button>
            <Button variant="outline" onClick={() => setIsOpen(true)}>
              Add Keyword Info
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="px-6 py-3">Keyword</th>
                <th className="px-6 py-3">Match Type</th>
                <th className="px-6 py-3">Bid</th>
                <th className="px-6 py-3">Platform</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="px-6 py-4">{item.keyword}</td>
                  <td className="px-6 py-4">{item.match_type}</td>
                  <td className="px-6 py-4">{item.bid}</td>
                  <td className="px-6 py-4">{item.platform}</td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-4 text-center text-muted-foreground"
                  >
                    No keyword data added yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
      <KeywordInfoDialog open={isOpen} setOpen={setIsOpen} onSave={setData} />
    </Card>
  );
};

const KeywordInfoDialog: React.FC<{
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSave: (
    d: Array<{
      keyword: string;
      match_type: string;
      bid: string;
      platform: string;
    }>,
  ) => void;
}> = ({ open, setOpen, onSave }) => {
  const [Data, setData] = useState<
    Array<{
      keyword: string;
      match_type: string;
      bid: string;
      platform: string;
    }>
  >([]);
  const keywordRef = useRef<HTMLInputElement>(null);
  const matchTypeRef = useRef<HTMLSelectElement>(null);
  const bidRef = useRef<HTMLInputElement>(null);
  const platformRef = useRef<HTMLSelectElement>(null);

  const handleAdd = () => {
    if (
      !keywordRef.current ||
      !matchTypeRef.current ||
      !bidRef.current ||
      !platformRef.current
    )
      return;

    const keyword = keywordRef.current.value;
    const match_type = matchTypeRef.current.value;
    const bid = bidRef.current.value;
    const platform = platformRef.current.value;

    if (!keyword || !bid || !platform) return;

    setData([...Data, { keyword, match_type, bid, platform }]);

    keywordRef.current.value = "";
    matchTypeRef.current.value = "";
    bidRef.current.value = "";
    platformRef.current.value = "";
  };

  const handleRemove = (index: number) => {
    setData(Data.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const keyword = keywordRef.current?.value;
    const match_type = matchTypeRef.current?.value || "";
    const bid = bidRef.current?.value;
    const platform = platformRef.current?.value;

    let dataToSave = [...Data];

    // If there's data in the input fields, add it to dataToSave
    if (keyword && bid && platform) {
      dataToSave.push({ keyword, match_type, bid, platform });
    }

    // Save if we have data either in the list or in input fields
    if (dataToSave.length > 0) {
      onSave(dataToSave);
      setOpen(false);
    }
  };

  React.useEffect(() => {
    if (!open) {
      setData([]);
      if (keywordRef.current) keywordRef.current.value = "";
      if (matchTypeRef.current) matchTypeRef.current.value = "";
      if (bidRef.current) bidRef.current.value = "";
      if (platformRef.current) platformRef.current.value = "";
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[70vw] max-w-[90vw]">
        <DialogHeader>
          <DialogTitle>Add Keyword Info</DialogTitle>
        </DialogHeader>
        <div className="m-2 flex flex-col gap-2">
          <div className="flex gap-2">
            <Input placeholder="Keyword" ref={keywordRef} />
            <select
              ref={matchTypeRef}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select Match Type</option>
              {MATCH_TYPE_OPTIONS.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <Input placeholder="Bid" ref={bidRef} />
            <select
              ref={platformRef}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select Platform</option>
              {PLATFORM_OPTIONS.map((platform) => (
                <option key={platform} value={platform}>
                  {platform}
                </option>
              ))}
            </select>
            <Button
              size="icon"
              className="rounded-md px-2"
              onClick={handleAdd}
              title="Add another row"
            >
              <CirclePlus />
            </Button>
          </div>
          {Data.map((v, i) => (
            <div key={i} className="flex gap-2">
              <Input value={v.keyword} placeholder="Keyword" disabled />
              <Input value={v.match_type} placeholder="Match Type" disabled />
              <Input value={v.bid} placeholder="Bid" disabled />
              <Input value={v.platform} placeholder="Platform" disabled />
              <Button
                size="icon"
                className="rounded-md px-2"
                onClick={() => handleRemove(i)}
              >
                <CircleMinus />
              </Button>
            </div>
          ))}
          <Button className="ml-auto w-fit" onClick={handleSave}>
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
