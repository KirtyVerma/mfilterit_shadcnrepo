import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { useAPI } from "@/queries/useAPI";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ChevronDown, CircleMinus, CirclePlus } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import axios, { AxiosRequestConfig } from "axios";
import Endpoint from "@/common/endpoint";
import { toast } from "@/hooks/use-toast";
import { useMutation } from "react-query";

export type BulkActions = "Active" | "Inactive" | "ARCHIVED" | "BUDGET_CHANGE";

export type BudgetChangeType = {
  operation: "increase" | "decrease";
  type: "percentage" | "value";
  amount: string;
};

interface QueryState {
  platform: string[];
  status: string[];
  keyword: string[];
  match_type: string[];
}
export type ProductOverviewChangeType = {
  platform: string; // Dropdown 1
  campaignName: string; // Dropdown 2
  adGroup: string; // Text Field 1
  productCode: string; // Text Field 2
};

export type KeywordOverviewChangeType = {
  platform: string; // Dropdown 1
  campaign_name: string; // Dropdown 2
  ad_group_name: string; // Text Field 1
  keyword: string; // Text Field 2
  bid: string;
  match_type: string;
};

interface BulkActionButtonProps {
  count: number;
  onChange: (action: BulkActions, budgetChange?: BudgetChangeType) => void;
  disabled?: boolean;
}

// Add type for the error object
type APIError = {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
};

export const BulkActionButton: React.FC<BulkActionButtonProps> = ({
  count,
  onChange,
  disabled,
}) => {
  const pathname = usePathname();
  const [Query, setQuery] = useState<QueryState>({
    platform: ["all"],
    status: ["all"],
    keyword: ["all"],
    match_type: ["all"],
  });
  const [budgetChange, setBudgetChange] = useState<BudgetChangeType>({
    operation: "increase",
    type: "percentage",
    amount: "",
  });
  const [productOverviewChange, setProductOverviewChange] = useState<
    ProductOverviewChangeType[]
  >([
    {
      platform: "", // Dropdown 1
      campaignName: "", // Dropdown 2
      adGroup: "", // Text Field 1
      productCode: "", // Text Field 2
    },
  ]);

  const [keywordOverviewChange, setKeywordOverviewChange] = useState<
    KeywordOverviewChangeType[]
  >([
    {
      platform: "",
      campaign_name: "",
      ad_group_name: "",
      keyword: "",
      bid: "",
      match_type: "",
    },
  ]);

  const [adGroupOptions, setAdGroupOptions] = useState<string[]>([]); // State to hold ad group options
  const [campaignNameOptions, setCampaignNameOptions] = useState<string[]>([]); // State for campaign names

  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleAddKeywordRow = () => {
    setKeywordOverviewChange((prev) => [
      ...prev,
      {
        platform: "",
        campaign_name: "",
        ad_group_name: "",
        keyword: "",
        bid: "",
        match_type: "",
      },
    ]);
  };

  const handleDeleteKeywordRow = (index: number) => {
    setKeywordOverviewChange((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddRow = () => {
    setProductOverviewChange((prev) => [
      { platform: "", campaignName: "", adGroup: "", productCode: "" },
      ...prev,
    ]);
  };

  // Delete a row by index
  const handleDeleteRow = (index: number) => {
    setProductOverviewChange((prev) => prev.filter((_, i) => i !== index));
  };

  // Update a specific row's data
  const handleUpdateRow = (
    index: number,
    field: keyof ProductOverviewChangeType,
    value: string,
  ) => {
    setProductOverviewChange((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    );

    // Check if campaign name is set before making the API call
    if (field === "campaignName" && value) {
      const selectedPlatform = productOverviewChange[index].platform; // Get the selected platform
      if (selectedPlatform) {
        // Call the API to fetch ad groups
        const adGroupConfig = {
          url:
            process.env.NEXT_PUBLIC_UAM_DOMAIN +
            Endpoint.UAM.AD_GROUP_NAME_FILTER,
          method: "POST",
          data: {
            platform: [selectedPlatform],
            campaign_name: [value],
          },
        };

        // Make the API call to fetch ad groups
        axios(adGroupConfig)
          .then((response) => {
            console.log("Ad Group Data:", response.data);
            setAdGroupOptions(response.data); // Update state with fetched ad groups
          })
          .catch((error) => {
            console.error("Error fetching ad groups:", error);
          });
      }
    }
  };

  const handleUpdateKeywordRow = (
    index: number,
    field: keyof KeywordOverviewChangeType,
    value: string,
  ) => {
    setKeywordOverviewChange((prev) => {
      const updated = prev.map((row, i) =>
        i === index ? { ...row, [field]: value } : row,
      );

      // Check if platform and campaign name are set before making the API call
      if (field === "campaign_name" && value) {
        const selectedPlatform = prev[index].platform; // Get the selected platform
        if (selectedPlatform) {
          // Call the API to fetch ad groups
          const adGroupConfig = {
            url:
              process.env.NEXT_PUBLIC_UAM_DOMAIN +
              Endpoint.UAM.AD_GROUP_NAME_FILTER,
            method: "POST",
            data: {
              platform: [selectedPlatform],
              campaign_name: [value],
            },
          };

          // Make the API call to fetch ad groups
          axios(adGroupConfig)
            .then((response) => {
              console.log("Ad Group Data:", response.data);
              setAdGroupOptions(response.data); // Update state with fetched ad groups
            })
            .catch((error) => {
              console.error("Error fetching ad groups:", error);
            });
        }
      }

      return updated;
    });
  };

  // const AdkeywordUpdate = useAPI<string[], { message: string }>({
  //   tag: "AddkeywordUpdate",
  //   options: {
  //     url: process.env.NEXT_PUBLIC_UAM_DOMAIN + Endpoint.UAM.ADD_KEYWORD,
  //     method: "POST",
  //     data: {
  //       keyword_list: payload.keyword_list,
  //     },
  //   },
  // });

  // Update the handleKeywordSubmit function
  const handleKeywordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios({
        url: process.env.NEXT_PUBLIC_UAM_DOMAIN + Endpoint.UAM.ADD_KEYWORD,
        method: "POST",
        data: {
          keyword_list: keywordOverviewChange
            .map((change) => ({
              keyword: change.keyword,
              platform: change.platform,
              bid: change.bid,
              match_type: change.match_type,
              ad_group_name: change.ad_group_name,
              campaign_name: change.campaign_name,
            }))
            .filter((item) => item.keyword), // Filter out any empty keyword entries
        },
      });

      console.log(response, "----response is coming");

      toast({
        title: "Success",
        description:
          response.data.message || "Keyword overview created successfully",
      });

      // Reset fields after successful submission
      resetKeywordOverviewFields();
      closeModal(); // Close the modal after success
    } catch (error) {
      console.error("API call failed:", error);

      // Type cast error to APIError
      const err = error as APIError;
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to create campaign";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const PlatformFilterData = useAPI<string[], { message: string }>({
    tag: "PlatformFilter",
    options: {
      url: process.env.NEXT_PUBLIC_UAM_DOMAIN + Endpoint.UAM.PLATFORM_FILTER,
      method: "POST",
      data: Query,
    },
  });

  const CampaignNameFilterData = useAPI<string[], { message: string }>({
    tag: "CampaignNameFilter",
    options: {
      url:
        process.env.NEXT_PUBLIC_UAM_DOMAIN + Endpoint.UAM.CAMPAIGN_NAME_FILTER,
      method: "POST",
      data: { platform: Query.platform },
    },
  });

  // Effect to fetch campaign names when platform changes
  useEffect(() => {
    if (Query.platform.length > 0 && Query.platform[0] !== "all") {
      CampaignNameFilterData.refetch(); // Refetch campaign names when platform changes
    }
  }, [Query.platform]);

  const shouldShowBudgetBidChange = () => {
    return (
      pathname ===
      "/unified-ad-manager/insights-and-performance/campaign-overview" ||
      pathname ===
      "/unified-ad-manager/insights-and-performance/keyword-overview"
    );
  };
  const shouldProductOverviewChange = () => {
    return (
      pathname ===
      "/unified-ad-manager/insights-and-performance/product-overview"
    );
  };

  const shouldKeywordOverviewChange = () => {
    return (
      pathname ===
      "/unified-ad-manager/insights-and-performance/keyword-overview"
    );
  };

  const getBudgetBidLabel = () => {
    return pathname ===
      "/unified-ad-manager/insights-and-performance/campaign-overview"
      ? "Budget Change"
      : "Bid Change";
  };

  const getProductOverview = () => {
    return pathname ===
      "/unified-ad-manager/insights-and-performance/product-overview"
      ? "Product Addition"
      : "Product Addition";
  };

  const getKeywordOverview = () => {
    return (
      pathname ===
      "/unified-ad-manager/insights-and-performance/keyword-overview" &&
      "Keyword Overview"
    );
  };

  // Update the platform selection to trigger the API call for campaigns
  const handleUpdateProductPlatform = (index: number, value: string) => {
    handleUpdateRow(index, "platform", value); // Update the platform in the state
    setQuery((prev) => ({ ...prev, platform: [value] })); // Update the Query state with the selected platform

    // New API call for fetching campaign names based on selected platform
    const adGroupConfig = {
      url:
        process.env.NEXT_PUBLIC_UAM_DOMAIN +
        Endpoint.UAM.CAMPAIGN_NAME_FILTER,
      method: "POST",
      data: { platform: [value] },
    };

    // Make the API call to fetch campaign names
    axios(adGroupConfig)
      .then((response) => {
        console.log("Campaign Data:", response.data);
        setCampaignNameOptions(response.data); // Update the state with fetched campaign names
      })
      .catch((error) => {
        console.error("Error fetching campaign names:", error);
      });
  };

  // Update the campaign name selection to trigger the API call for ad groups
  const handleUpdateProductRow = (
    index: number,
    field: keyof ProductOverviewChangeType,
    value: string,
  ) => {
    setProductOverviewChange((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    );

    // Check if campaign name is set before making the API call
    if (field === "campaignName" && value) {
      const selectedPlatform = productOverviewChange[index].platform; // Get the selected platform
      if (selectedPlatform) {
        // Call the API to fetch ad groups
        const adGroupConfig = {
          url:
            process.env.NEXT_PUBLIC_UAM_DOMAIN +
            Endpoint.UAM.AD_GROUP_NAME_FILTER,
          method: "POST",
          data: {
            platform: [selectedPlatform],
            campaign_name: [value],
          },
        };

        // Make the API call to fetch ad groups
        axios(adGroupConfig)
          .then((response) => {
            console.log("Ad Group Data:", response.data);
            setAdGroupOptions(response.data); // Update state with fetched ad groups
          })
          .catch((error) => {
            console.error("Error fetching ad groups:", error);
          });
      }
    }
  };

  // Function to handle the submission of product overview changes
  const handleProductOverviewSubmit = async () => {
    try {
      const response = await axios({
        url: process.env.NEXT_PUBLIC_UAM_DOMAIN + Endpoint.UAM.AD_PRODUCT,
        method: "POST",
        data: {
          product_list: productOverviewChange.map(change => ({
            product_code: change.productCode,
            platform: change.platform,
            ad_group_name: change.adGroup,
            campaign_name: change.campaignName,
          })),
        },
      });

      console.log(response, "----response is coming");

      toast({
        title: "Success",
        description: response.data.message || "Product overview submitted successfully",
      });

      // Reset fields after successful submission
      resetProductOverviewFields();

    } catch (error) {
      console.error("API call failed:", error);

      // Type cast error to APIError
      const err = error as APIError;
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to submit product overview";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  // Add the missing handleUpdatePlatform function
  const handleUpdatePlatform = (index: number, value: string) => {
    handleUpdateKeywordRow(index, "platform", value);
    setQuery((prev) => ({ ...prev, platform: [value] }));

    // Call API to fetch campaign names based on selected platform
    const adGroupConfig = {
      url: process.env.NEXT_PUBLIC_UAM_DOMAIN + Endpoint.UAM.CAMPAIGN_NAME_FILTER,
      method: "POST",
      data: { platform: [value] },
    };

    axios(adGroupConfig)
      .then((response) => {
        console.log("Campaign Data:", response.data);
        setCampaignNameOptions(response.data);
      })
      .catch((error) => {
        console.error("Error fetching campaign names:", error);
      });
  };

  // Add a function to reset product overview fields
  const resetProductOverviewFields = () => {
    setProductOverviewChange([{
      platform: "",
      campaignName: "",
      adGroup: "",
      productCode: "",
    }]);
  };

  // Add a function to reset keyword overview fields
  const resetKeywordOverviewFields = () => {
    setKeywordOverviewChange([{
      platform: "",
      campaign_name: "",
      ad_group_name: "",
      keyword: "",
      bid: "",
      match_type: "",
    }]);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={disabled}>
          Bulk Actions ({count})
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem onClick={() => onChange("Active")}>
          Active
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onChange("Inactive")}>
          Inactive
        </DropdownMenuItem>
        {shouldShowBudgetBidChange() && (
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              {getBudgetBidLabel()}
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="p-2">
              <div className="flex flex-col gap-2">
                <Select
                  value={budgetChange.operation}
                  onValueChange={(value: "increase" | "decrease") =>
                    setBudgetChange((prev) => ({ ...prev, operation: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select operation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="increase">Increase</SelectItem>
                    <SelectItem value="decrease">Decrease</SelectItem>
                  </SelectContent>
                </Select>
                By
                <Select
                  value={budgetChange.type}
                  onValueChange={(value: "percentage" | "value") =>
                    setBudgetChange((prev) => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="value">Value</SelectItem>
                  </SelectContent>
                </Select>
                Of
                <Input
                  type="number"
                  min={0}
                  placeholder="Enter value"
                  value={budgetChange.amount}
                  onChange={(e) =>
                    setBudgetChange((prev) => ({
                      ...prev,
                      amount: e.target.value,
                    }))
                  }
                />
                <Button
                  onClick={() => onChange("BUDGET_CHANGE", budgetChange)}
                  disabled={!budgetChange.amount}
                >
                  Apply
                </Button>
              </div>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        )}
        {shouldKeywordOverviewChange() && (
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              {getKeywordOverview()}
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="p-2">
              <div>
                {keywordOverviewChange.map((change, index) => (
                  <div
                    key={index}
                    className="mb-2 flex flex-col gap-4 rounded-md border p-2"
                  >
                    {/* First Row of Inputs */}
                    <div className="flex gap-4">
                      {/* Platform Dropdown */}
                      <Select
                        value={change.platform}
                        onValueChange={(value) =>
                          handleUpdatePlatform(index, value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Platform" />
                        </SelectTrigger>
                        <SelectContent>
                          {PlatformFilterData.data?.map((platform) => (
                            <SelectItem key={platform} value={platform}>
                              {platform}
                            </SelectItem>
                          )) ?? []}
                        </SelectContent>
                      </Select>

                      {/* Campaign Name Input */}
                      <Select
                        value={change.campaign_name}
                        onValueChange={(value) =>
                          handleUpdateKeywordRow(index, "campaign_name", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Campaign Name" />
                        </SelectTrigger>
                        <SelectContent>
                          {CampaignNameFilterData.data?.map((campaign) => (
                            <SelectItem key={campaign} value={campaign}>
                              {campaign}
                            </SelectItem>
                          )) ?? []}
                        </SelectContent>
                      </Select>

                      {/* Ad Group Input */}
                      <Select
                        value={change.ad_group_name}
                        onValueChange={(value) =>
                          handleUpdateKeywordRow(index, "ad_group_name", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Ad Group" />
                        </SelectTrigger>
                        <SelectContent>
                          {adGroupOptions.map(
                            (
                              adGroup, // Use fetched ad group options
                            ) => (
                              <SelectItem key={adGroup} value={adGroup}>
                                {adGroup}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Second Row of Inputs */}
                    <div className="flex gap-4">
                      {/* Bid Input */}
                      <Input
                        type="text"
                        placeholder="Bid"
                        value={change.bid}
                        onChange={(e) =>
                          handleUpdateKeywordRow(index, "bid", e.target.value)
                        }
                      />

                      {/* Match Type Input */}
                      <Input
                        type="text"
                        placeholder="Match Type"
                        value={change.match_type}
                        onChange={(e) =>
                          handleUpdateKeywordRow(
                            index,
                            "match_type",
                            e.target.value,
                          )
                        }
                      />

                      {/* Keyword Input */}
                      <Input
                        type="text"
                        placeholder="Keyword"
                        value={change.keyword}
                        onChange={(e) =>
                          handleUpdateKeywordRow(
                            index,
                            "keyword",
                            e.target.value,
                          )
                        }
                      />

                      {/* Delete Button */}
                      {index > 0 && (
                        <Button
                          size="icon"
                          className="rounded-md px-2"
                          onClick={() => handleDeleteKeywordRow(index)}
                        >
                          <CircleMinus />
                        </Button>
                      )}

                      {/* Add Button */}
                      <Button
                        size="icon"
                        className="rounded-md px-2"
                        onClick={handleAddKeywordRow}
                        title="Add another row"
                      >
                        <CirclePlus />
                      </Button>
                    </div>
                  </div>
                ))}

                <div className="flex justify-center">
                  <Button className="mt-4" onClick={handleKeywordSubmit}>
                    Submit
                  </Button>
                </div>
              </div>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        )}
        {shouldProductOverviewChange() && (
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              {getProductOverview()}
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="p-2">
              <div>
                {productOverviewChange.map((change, index) => (
                  <div
                    key={index}
                    className="mb-2 flex gap-2 rounded-md border p-2"
                  >
                    {/* Platform Dropdown */}
                    <Select
                      value={change.platform}
                      onValueChange={(value) =>
                        handleUpdateProductPlatform(index, value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Platform" />
                      </SelectTrigger>
                      <SelectContent>
                        {PlatformFilterData.data?.map((platform) => (
                          <SelectItem key={platform} value={platform}>
                            {platform ?? "Select Platform"}
                          </SelectItem>
                        )) ?? []}
                      </SelectContent>
                    </Select>

                    {/* Campaign Name Dropdown */}
                    <Select
                      value={change.campaignName}
                      onValueChange={(value) =>
                        handleUpdateProductRow(index, "campaignName", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Campaign Name" />
                      </SelectTrigger>
                      <SelectContent>
                        {campaignNameOptions.map((campaign) => (
                          <SelectItem key={campaign} value={campaign}>
                            {campaign}
                          </SelectItem>
                        )) ?? []}
                      </SelectContent>
                    </Select>

                    {/* Ad Group Dropdown */}
                    <Select
                      value={change.adGroup}
                      onValueChange={(value) =>
                        handleUpdateRow(index, "adGroup", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Ad Group" />
                      </SelectTrigger>
                      <SelectContent>
                        {adGroupOptions.map((adGroup) => (
                          <SelectItem key={adGroup} value={adGroup}>
                            {adGroup}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* Product Code Input */}
                    <Input
                      type="text"
                      placeholder="Product Code"
                      value={change.productCode}
                      onChange={(e) =>
                        handleUpdateRow(index, "productCode", e.target.value)
                      }
                    />

                    {/* Delete Button */}
                    {index > 0 && (
                    <Button
                      size="icon"
                      className="rounded-md px-2"
                      onClick={() => handleDeleteRow(index)}
                    >
                      <CircleMinus />
                      </Button>
                    )}

                    {/* Add Button */}
                    <Button
                      size="icon"
                      className="rounded-md px-2"
                      onClick={handleAddRow}
                      title="Add another row"
                    >
                      <CirclePlus />
                    </Button>
                  </div>
                ))}

                {/* Submit Button for Product Overview */}
                <div className="flex justify-center mt-4">
                  <Button onClick={handleProductOverviewSubmit}>
                    Submit
                  </Button>
                </div>
              </div>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
