"use client";
import React from "react";
import ResizableTable from "@/components/mf/TableComponent";

export default function Table() {
  const columns = [
    { title: "Date", key: "date" },
    { title: "Total Install", key: "totalInstall" },
    { title: "Clean Install", key: "cleanInstall" },
    { title: "Fraud Install", key: "fraudInstall" },
    { title: "Fraud Percentage", key: "fraudPercentage" },
    { title: "Platforms", key: "platforms" },
  ];

  const data = [
    { date: "220923", totalInstall: 1000, cleanInstall: 850, fraudInstall: 150, fraudPercentage: 15.00, platforms: "Platform D" },
    { date: "210923", totalInstall: 900, cleanInstall: 750, fraudInstall: 150, fraudPercentage: 16.67, platforms: "Platform A" },
    { date: "160923", totalInstall: 1400, cleanInstall: 1300, fraudInstall: 100, fraudPercentage: 7.14, platforms: "Platform B" },
    { date: "190923", totalInstall: 950, cleanInstall: 800, fraudInstall: 150, fraudPercentage: 15.79, platforms: "Platform C" },
    { date: "180923", totalInstall: 1600, cleanInstall: 1400, fraudInstall: 200, fraudPercentage: 12.50, platforms: "Platform D" },
    { date: "170923", totalInstall: 1100, cleanInstall: 900, fraudInstall: 200, fraudPercentage: 18.18, platforms: "Platform A" },
    { date: "160923", totalInstall: 1400, cleanInstall: 1300, fraudInstall: 100, fraudPercentage: 7.14, platforms: "Platform B" },

  ];

  const handleEdit = (item: any) => {
    console.log("Edit:", item);
  };

  const handleDelete = (item: any) => {
    console.log("Delete:", item);
  };

  const handleView = (item: any) => {
    console.log("View:", item);
  };

  const handleDownload = (item: any) => {
    console.log("Download:", item);
  };

  const handleSelect = (selectedItems: any[]) => {
    console.log("Selected items:", selectedItems);
  };

  return (
      <ResizableTable
        columns={columns}
        data={data}
        headerColor="#DCDCDC"
        isEdit={true}
        isDelete={true}
        isView={true}
        isDownload={true}
        isSearchable={true}
        isSelectable={true}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        onDownload={handleDownload}
        onSelect={handleSelect}
      />
  );
}
