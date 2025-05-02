"use client";
import ResizableTable from '@/components/mf/TableComponent';
import React from 'react';
import { Link } from 'lucide-react';

interface ColumnGLP {
    title: any,
    key: keyof userDataLP,
}
interface userDataLP {
    "Inserted Date": string;
    "Landing Page": string | JSX.Element;
    "Publisher": string;
    "Sub-Publisher": string;
    "Campaign": string;
    "Page Id": string;
    IP: string;
    "User Agent": string;
    Placement: string;
    "IVT Category": string;
    "IVT Sub Category": string;
  }
const LinkWithIcon = (url: string) => {
    return (
        <a 
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            title={url}
            className="text-blue-500 hover:text-blue-700 cursor-pointer flex items-center justify-center"
        >
            <Link className="flex h-4 w-4 " />
        </a>
    );
};

const LandingReportData: userDataLP[] = [
    {
        "Inserted Date": "2023-01-15",
        "Landing Page": LinkWithIcon("https://promo.unlimited-streaming-uae.com/varA-lp_gold"),
        "Publisher": "Publisher1",
        "Sub-Publisher": "Sub-Publisher1",
        "Campaign": "Campaign1",
        "Page Id": "123456789",
        "IP": "123.123.123.123",
        "User Agent": "Chrome",
        "Placement": "Placement1",
        "IVT Category": "IVT Category1",
        "IVT Sub Category": "Sub Category1"
    },
    {
        "Inserted Date": "2023-11-25",
        "Landing Page": LinkWithIcon("https://promo.unlimited-streaming-uae.com/varA-lp_gold"),
        "Publisher": "Publisher2",
        "Sub-Publisher": "Sub-Publisher2",
        "Campaign": "Campaign1",
        "Page Id": "123456789",
        "IP": "123.123.123.123",
        "User Agent": "Chrome",
        "Placement": "Placement1",
        "IVT Category": "IVT Category1",
        "IVT Sub Category": "Sub Category1"
    },
    {
      "Inserted Date": "2023-01-26",
      "Landing Page": LinkWithIcon("https://promo.unlimited-streaming-uae.com/varA-lp_gold"),
      "Publisher": "Publisher3",
      "Sub-Publisher": "Sub-Publisher3",
      "Campaign": "Campaign1",
      "Page Id": "123456789",
      "IP": "123.123.123.123",
      "User Agent": "Chrome",
      "Placement": "Placement1",
      "IVT Category": "IVT Category1",
      "IVT Sub Category": "Sub Category1"
  },
  {
      "Inserted Date": "2023-11-20",
      "Landing Page": LinkWithIcon("https://promo.unlimited-streaming-uae.com/varA-lp_gold"),
      "Publisher": "Publisher4",
      "Sub-Publisher": "Sub-Publisher1",
      "Campaign": "Campaign4",
      "Page Id": "123456789",
      "IP": "123.123.123.123",
      "User Agent": "Chrome",
      "Placement": "Placement1",
      "IVT Category": "IVT Category1",
      "IVT Sub Category": "Sub Category1"
  },
    // Add more entries with the same pattern
];
const RealTimeColumn: ColumnGLP[] = [
    { title: "Inserted Date", key: "Inserted Date" },
    { title: "Landing Page", key: "Landing Page" },
    { title: "Publisher", key: "Publisher" },
    { title: "Sub-Publisher", key: "Sub-Publisher" },
    { title: "Campaign", key: "Campaign" },
    { title: "Page Id", key: "Page Id" },
    { title: "IP", key: "IP" },
    { title: "User Agent", key: "User Agent" },
    { title: "Placement", key: "Placement" },
    { title: "IVT Category", key: "IVT Category" },
    { title: "IVT Sub Category", key: "IVT Sub Category" },
  ]
function LandingReport() {
  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <ResizableTable
      isPaginated={true}
      data={LandingReportData}
      columns={RealTimeColumn}
      isSearchable={true}
      isSelectable={true}
     // isDownload={true}

      />
    </div>
  )
}

export default LandingReport
