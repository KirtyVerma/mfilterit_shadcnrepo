"use client";

import ResizableTable, { Column } from "@/components/mf/ReportingToolTable";
import React, { useState } from "react";
import { useAPI } from "@/queries/useAPI";
import Endpoint from "@/common/endpoint";
import { PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { MFDateRangePicker } from "@/components/mf";
import {
  useQuery,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import GenerateReportModal from "../modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import JSZip from 'jszip';
import { format, subDays } from 'date-fns';
import { DateRange } from "react-day-picker";

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
  id: number;
  Report_Name: string;
  Report_Type: string;
  Created_By: string;
  Created_Date: string;
  From_Date: string;
  To_Date: string;
  Report_Status: string;
  Email_Status: string;
  Frequency?: string;
  Last_Run?: string;
  Next_Run?: string;
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

const CampaignOverviewPage: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("Campaign Overview Logs");
  const [RowCount, setRowCount] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<number | null>(null);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailTo, setEmailTo] = useState("");
  const [selectedReport, setSelectedReport] = useState<Record<string, string | number> | null>(null);
  const [customDateRange, setCustomDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });
  const [tableData, setTableData] = useState([
    {
      id: 1,
      Report_Name: "Invalid Traffic",
      Report_Type: "Event",
      Created_By: "agam.srivastava@mfilterit.com",
      Created_Date: "2025-02-15T03:22:12",
      From_Date: "2025-02-01",
      To_Date: "2025-02-15",
      Report_Status: "Download",
      Email_Status: "False",
      Frequency: "One Time",
      Last_Run: "2025-02-01",
      Next_Run: ""
    },
    {
      id: 2,
      Report_Name: "Bot Traffic",
      Report_Type: "Visit",
      Created_By: "chethan.hanu@mfilterit.com",
      Created_Date: "2025-02-15T03:22:12",
      From_Date: "2025-02-01",
      To_Date: "2025-02-15",
      Report_Status: "Scheduled",
      Email_Status: "True",
      Frequency: "Daily",
      Last_Run: "2025-02-15 ",
      Next_Run: "2025-02-16 "
    },
    {
      id: 3,
      Report_Name: "SIVT Incidents",
      Report_Type: "Impression",
      Created_By: "dhiraj.gupta@mfilterit.com",
      Created_Date: "2025-02-15T03:22:12",
      From_Date: "2025-02-01",
      To_Date: "2025-02-15",
      Report_Status: "Download",
      Email_Status: "False",
      Frequency: "One Time",
      Last_Run: "2025-02-01",
      Next_Run: ""
    },
  ]);

  const handleStatusChange = (
    id: number,
    field: "Report_Status" | "Email_Status",
    checked: boolean,
  ) => {
    setTableData((prevData) =>
      prevData.map((item) =>
        item.id === id
          ? { ...item, [field]: checked ? "True" : "False" }
          : item,
      ),
    );
  };

  const handleDelete = (item: Record<string, string | number>) => {
    setRowToDelete(item.id as number);
    setDeleteDialogOpen(true);
  };

  const handleClone = (item: Record<string, string | number>) => {
    const newId = Math.max(...tableData.map(item => item.id)) + 1;
    const clonedItem = {
      ...tableData.find(row => row.id === item.id as number)!,
      id: newId,
      Report_Name: `${item.Report_Name}_copy`
    };
    setTableData(prevData => [clonedItem, ...prevData]);
    handleEdit(clonedItem);
  };

  const handleEdit = (item: Record<string, string | number>) => {
    const defaultTemplateId = "default-template-id"; // Replace with your actual default template ID
    router.push(`/webfraud/ReportingTool/generate?id=${item.id}&templateId=${defaultTemplateId}`);
  };

  const confirmDelete = () => {
    if (rowToDelete) {
      setTableData((prevData) => prevData.filter((item) => item.id !== rowToDelete));
      setDeleteDialogOpen(false);
      setRowToDelete(null);
    }
  };

  const handleSend = (item: Record<string, string | number>) => {
    setSelectedReport(item);
    setEmailModalOpen(true);
  };

  const handleSendEmail = () => {
    // Here you would implement the actual email sending logic
    console.log('Sending email to:', emailTo, 'for report:', selectedReport);
    // Reset the form
    setEmailTo("");
    setSelectedReport(null);
    setEmailModalOpen(false);
  };

  const handleDownload = async (items: Record<string, string | number>[]) => {
    try {
      // Create a new instance of JSZip
      const zip = new JSZip();
      
      // Fetch the dummy.csv file
      const response = await fetch('/dummy.csv');
      const csvData = await response.blob();
      
      // Add the CSV to the zip file
      zip.file('dummy.csv', csvData);
      
      // Generate the zip file
      const zipContent = await zip.generateAsync({ type: 'blob' });
      
      // Create a download link
      const link = document.createElement('a');
      const currentDate = format(new Date(), 'yyyyMMdd');
      const fileName = `web.mfilterit.cpv_${currentDate}.zip`;
      
      link.href = URL.createObjectURL(zipContent);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const adgrpcolumns: Column<AdGrpRowData>[] = [
    {
      title: "Report Name",
      key: "Report_Name",
      render: (data: AdGrpRowData) => (
        <div className="flex flex-col">
          <span>{data.Report_Name}</span>
          <span className="text-xs text-muted-foreground">
            Last Quarter : {format(new Date(data.From_Date), 'dd MMM')} - {format(new Date(data.To_Date), 'dd MMM')}
          </span>
        </div>
      ),
    },
    { title: "Report Type", key: "Report_Type" },
    { title: "Created By", key: "Created_By" },
    {
      title: "Created Date",
      key: "Created_Date",
      render: (data: AdGrpRowData) => (
        <div className="text-center">
          {format(new Date(data.Created_Date), 'yyyy-MM-dd HH:mm:ss')}
        </div>
      ),
    },
    {
      title: "Frequency",
      key: "Frequency",
      render: (data: AdGrpRowData) => (
        <div className="text-center">
          {data.Report_Status === "Scheduled" ? (
            data.Frequency === "Custom Range" ? (
              <div className="flex items-center justify-center">
                <MFDateRangePicker 
                  className="w-[300px]"
                  onDateChange={(range) => {
                    setCustomDateRange(range);
                    // Update the From_Date and To_Date in the table data
                    if (range?.from && range?.to) {
                      const fromDate = range.from;
                      const toDate = range.to;
                      setTableData(prevData =>
                        prevData.map(item =>
                          item.id === data.id
                            ? {
                                ...item,
                                From_Date: format(fromDate, 'yyyy-MM-dd'),
                                To_Date: format(toDate, 'yyyy-MM-dd'),
                              }
                            : item
                        )
                      );
                    }
                  }}
                />
              </div>
            ) : (
              data.Frequency
            )
          ) : (
            "One Time"
          )}
        </div>
      ),
    },
    {
      title: "Last Run",
      key: "Last_Run",
      render: (data: AdGrpRowData) => (
        <div className="text-center">
          {data.Last_Run || "-"}
        </div>
      ),
    },
    {
      title: "Next Run",
      key: "Next_Run",
      render: (data: AdGrpRowData) => (
        <div className="text-center">
          {data.Report_Status === "Scheduled" ? data.Next_Run : "-"}
        </div>
      ),
    },
    {
      title: "Status",
      key: "Email_Status",
      render: (data: AdGrpRowData) => (
        <>
          {data.Report_Status === "Download" ? (
            "NA"
          ) : (
            <div className="flex justify-center">
              <Switch
                className="h-4 w-8 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input"
                checked={data.Email_Status === "True"}
                onCheckedChange={(checked) =>
                  handleStatusChange(data.id, "Email_Status", checked)
                }
              />
            </div>
          )}
        </>
      ),
    },
  ];

  const campaignQuery = {
    platform: ["all"],
    campaign_type: ["all"],
    campaign_name: ["all"],
    status: ["all"],
  };

  const campaignOverviewLogs = useAPI<any[], { message: string }>({
    tag: "campaignOverviewLogs",
    options: {
      url: process.env.NEXT_PUBLIC_UAM_DOMAIN + Endpoint.UAM.CAMPAIGN_LOGS,
      method: "POST",
      data: campaignQuery,
    },
  });

  const handleRefetch = (params?: { startDate?: Date; endDate?: Date }) => {
    if (params?.startDate && params?.endDate) {
      console.log('Refetching data for range:', params.startDate, params.endDate);
      // Here you can add your API call or data fetching logic
      // Example:
      // const formattedStartDate = params.startDate.toISOString();
      // const formattedEndDate = params.endDate.toISOString();
      // fetchData({ startDate: formattedStartDate, endDate: formattedEndDate });
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="relative bg-card">
        <div className="p-4 [&_td]:text-[14px] [&_th]:text-[14px]">
          <ResizableTable
            columns={adgrpcolumns ?? []}
            data={tableData}
            isLoading={false}
            isDownload={false}
            headerColor="#DCDCDC"
            itemCount={setRowCount}
            isSearchable
            SearchTerm=""
            setSearchTerm={() => {}}
            isRefetch={false}
            onRefetch={handleRefetch}
            isEdit={true}
            onEdit={handleEdit}
            isSend={false}
            isView={true}
            onView={handleEdit}
            onSend={handleSend}
            isClone={true}
            onClone={handleClone}
            isSelectable={true}
            isDelete={true}
            onDelete={handleDelete}
            onDownloadAll={handleDownload}
            onGenerateReport={() =>
              router.push("/webfraud/ReportingTool/generate")
            }
          />
        </div>

        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              Are you sure you want to delete this report?
            </div>
            <DialogFooter>
              <Button 
                variant="secondary" 
                onClick={() => setDeleteDialogOpen(false)}
                className="text-white bg-primary hover:bg-primary/90"
              >
                Cancel
              </Button>
              <Button 
                variant="secondary" 
                onClick={confirmDelete}
                className="text-white bg-primary hover:bg-primary/90"
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={emailModalOpen} onOpenChange={setEmailModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Share Report via Email</DialogTitle>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter recipient's email"
                  value={emailTo}
                  onChange={(e) => setEmailTo(e.target.value)}
                />
              </div>
              {selectedReport && (
                <div className="text-sm text-muted-foreground">
                  Sharing report: {selectedReport.Report_Name}
                </div>
              )}
            </div>
            <DialogFooter>
              <Button 
                variant="secondary" 
                onClick={() => setEmailModalOpen(false)}
                className="text-white bg-primary hover:bg-primary/90"
              >
                Cancel
              </Button>
              <Button 
                variant="secondary"
                onClick={handleSendEmail}
                disabled={!emailTo || !selectedReport}
                className="text-white bg-primary hover:bg-primary/90 disabled:bg-primary/50"
              >
                Send
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </QueryClientProvider>
  );
};

export default CampaignOverviewPage;
