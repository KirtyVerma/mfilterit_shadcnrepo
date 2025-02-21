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
import { PlayCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRowDetails, setSelectedRowDetails] = useState<any>(null);

    const handleToggleChange = async (checked: boolean, row: any) => {
        try {
            toast({
                title: "Success",
                description: `Improvisation ${checked ? 'enabled' : 'disabled'} successfully`,
                variant: "default",
            });

            refetchCampaigns();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update improvisation status",
                variant: "destructive",
            });
        }
    };

    const columns: Column<Record<string, string | number>>[] = [
        {
            title: "Campaign Name",
            key: "cname",
        },
        {
            title: "Ad Group Name",
            key: "ad_grp_name",
        },
        {
            title: "Keyword",
            key: "keyword",
        },
        {
            title: "Inserted Date and Time",
            key: "date_time",
        },
        {
            title: "No. of Actions",
            key: "number_action",
        },
        {
            title: "Status",
            key: "status",
        },
        {
            title: "Show Details",
            key: "details",
            render: (row: any) => {
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <PlayCircle className="h-5 w-5 text-blue-500 hover:text-blue-700" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[600px] p-4">
                            <div className="space-y-4">
                                <h3 className="font-semibold text-lg mb-4">Execution Details</h3>
                                <div className="border rounded-lg overflow-hidden">
                                    <div className="grid grid-cols-2 bg-gray-100 border-b">
                                        <div className="p-3 font-semibold text-gray-700 border-r">
                                            Columns
                                        </div>
                                        <div className="p-3 font-semibold text-gray-700">
                                            Value Executed
                                        </div>
                                    </div>
                                    
                                    <div className="divide-y">
                                        {[
                                            { column: "Campaign Name", value: row.cname },
                                            { column: "Ad Group Name", value: row.ad_grp_name },
                                            { column: "Keyword", value: row.keyword },
                                            { column: "Date & Time", value: row.date_time },
                                            { column: "No. of Actions", value: row.number_action },
                                            { column: "Status", value: row.status }
                                        ].map((item, index) => (
                                            <div key={index} className="grid grid-cols-2 hover:bg-gray-50">
                                                <div className="p-3 border-r">{item.column}</div>
                                                <div className="p-3">{item.value}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            }
        }
    ];

    const {
        data: campaignData,
        isLoading: isCampaignLoading,
        refetch: refetchCampaigns,
    } = useAPI<{ data: Record<string, string | number>[], status: string }, { message: string }>({
        tag: "RuleEngineLogs",
        options: {
            url: "YOUR_API_ENDPOINT",
            method: "GET",
            auth: {
                username: username,
                password: password,
            },
        },
    });

    return (
        <div className="container relative bg-card">
            <ResizableTable
                columns={columns}
                data={[
                    {
                        cname: "Agam is a good boy",
                        ad_grp_name: "honesty",
                        keyword: "agam",
                        date_time: "aaj abhi issi waqt",
                        number_action: "999",
                        status: "Cool",
                        details: "Status",
                    }
                ]}
                isLoading={false}
                headerColor="#DCDCDC"
                onRefresh={refetchCampaigns}
                onSelect={setSelected}
                itemCount={setRowCount}
                isSearchable
                isSelectable
            />
        </div>
    );
};

export default CampaignOverviewPage;
