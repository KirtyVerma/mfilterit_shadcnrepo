

"use client";
import ResizableTable from '@/components/mf/TableComponent';
import React from 'react';
import { Switch } from '@/components/ui/switch';


interface ColumnGRD {
    title: any,
    key: keyof userDataRD,
  }
interface userDataRD {
    BlackListing: string;
    Status: string;
    "Date on Enabled": string;
    "Checkbox-data": string;
    Action: string;
  }

  const datainfo =[
    <ul>
      <li>Google</li>
      <li>Meta</li>
      <li>Bing</li>
    </ul>
  ]
const RealTimeData =[
    {
        BlackListing: "IP",
        Status: "Active",
        "Date on Enabled": "2023-09-25",
        "Checkbox-data": datainfo,
        Action: <Switch/>,
    },
    {
        BlackListing: "Placement",
        Status: "InActive",
        "Date on Enabled": "2023-12-25",
        "Checkbox-data": datainfo,
        Action: <Switch/>,
    },
    {
        BlackListing: "Audience Exclusion",
        Status: "Active",
        "Date on Enabled": "2023-08-25",
        "Checkbox-data":datainfo,
        Action: <Switch/>,
    },
    {
        BlackListing: "Real Time Lead Blocking",
        Status: "InActive",
        "Date on Enabled": "2023-11-25",
        "Checkbox-data": datainfo,
        Action: <Switch/>,
    }
]
const RealTimeColumn: ColumnGRD[] = [
    { title: "BlackListing", key: "BlackListing" },
    { title: "Status", key: "Status" },
    { title: "Date on Enabled", key: "Date on Enabled" },
    { title: "", key: "Checkbox-data" },
    { title: "Action", key: "Action" },
  
  ]
function RealTimeProtection() {
  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <ResizableTable
      isPaginated={true}
      data={RealTimeData}
      columns={RealTimeColumn}
      isSearchable={true}
      isSelectable={true}

      />
    </div>
  )
}

export default RealTimeProtection
