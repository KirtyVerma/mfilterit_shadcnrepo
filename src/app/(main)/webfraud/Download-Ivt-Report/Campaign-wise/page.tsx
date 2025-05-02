"use client";
import ResizableTable from '@/components/mf/TableComponent';
import React from 'react';


interface ColumnGCR {
    title: any,
    key: keyof userDataCR,
  }
interface userDataCR {
    "Inserted Date": string;
    "Campaign Name / ID": string;
    "Publisher": string;
    "Sub-Publisher": string;
    "Page Id": string;
    IP:string;
    "User Agent":string;
    Placement:string;
    "IVT Category":string;
    "IVT Sub Category":string;
  }
const CampaignReportData =[
    {
        "Inserted Date": "2023-09-25",
        "Campaign Name / ID": "123456789",
        "Publisher": "Publisher1",
        "Sub-Publisher": "Sub-Publisher1",
        "Page Id": "123456789",
        IP:"123.123.123.123",
        "User Agent":"Chrome",
        Placement:"Placement1",
        "IVT Category":"IVT Category1",
    },
    {
        "Inserted Date": "2023-09-25",
        "Campaign Name / ID": "123456789",
        "Publisher": "Publisher1",
        "Sub-Publisher": "Sub-Publisher1",
        "Page Id": "123456789",
        IP:"123.123.123.123",
        "User Agent":"Chrome",
        Placement:"Placement1",
    },
    {
        "Inserted Date": "2023-09-25",
        "Campaign Name / ID": "123456789",
        "Publisher": "Publisher1",
        "Sub-Publisher": "Sub-Publisher1",
        "Page Id": "123456789",
        IP:"123.123.123.123",
        "User Agent":"Chrome",
        Placement:"Placement1",
    },
    {
        "Inserted Date": "2023-09-25",
        "Campaign Name / ID": "123456789",
        "Publisher": "Publisher1",
        "Sub-Publisher": "Sub-Publisher1",
        "Page Id": "123456789",
        IP:"123.123.123.123",
        "User Agent":"Chrome",
        Placement:"Placement1",
    }
]
const RealTimeColumn: ColumnGCR[] = [
    { title: "Inserted Date", key: "Inserted Date" },
    { title: "Campaign Name / ID", key: "Campaign Name / ID" },
    { title: "Publisher", key: "Publisher" },
    { title: "Sub-Publisher", key: "Sub-Publisher" },
    { title: "Page Id", key: "Page Id" },
    { title: "IP", key: "IP" },
    { title: "User Agent", key: "User Agent" },
    { title: "Placement", key: "Placement" },
    { title: "IVT Category", key: "IVT Category" },
    { title: "IVT Sub Category", key: "IVT Sub Category" },
  
  ]
function CampaignReport() {
  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <ResizableTable
      isPaginated={true}
      data={CampaignReportData}
      columns={RealTimeColumn}
      isSearchable={true}
      isSelectable={true}
      isDownload={true}

      />
    </div>
  )
}

export default CampaignReport