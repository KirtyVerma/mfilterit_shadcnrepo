"use client";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ResizableTable from "@/components/mf/TableComponent";
import { Filter } from "@/components/mf/Filters";
import { CiCirclePlus, CiCircleMinus } from "react-icons/ci";

export default function Table() {
  const [fields, setFields] = useState<any[]>([]);
  const columns = [
    { title: "Date", key: "date" },
    { title: "Total Install", key: "totalInstall" },
    { title: "Clean Install", key: "cleanInstall" },
    { title: "Fraud Install", key: "fraudInstall" },
    { title: "Fraud Percentage", key: "fraudPercentage" },
    { title: "Platforms", key: "platforms" },
  ];

  const data = [
    {
      date: "250923",
      totalInstall: 1200,
      cleanInstall: 1000,
      fraudInstall: 200,
      fraudPercentage: 16.67,
      platforms: "Platform A",
    },
    {
      date: "250923",
      totalInstall: 1200,
      cleanInstall: 1000,
      fraudInstall: 200,
      fraudPercentage: 16.67,
      platforms: "Platform A",
    },
    {
      date: "250923",
      totalInstall: 1200,
      cleanInstall: 1000,
      fraudInstall: 200,
      fraudPercentage: 16.67,
      platforms: "Platform A",
    },
    {
      date: "250923",
      totalInstall: 1200,
      cleanInstall: 1000,
      fraudInstall: 200,
      fraudPercentage: 16.67,
      platforms: "Platform A",
    },
    {
      date: "240923",
      totalInstall: 800,
      cleanInstall: 700,
      fraudInstall: 100,
      fraudPercentage: 12.5,
      platforms: "Platform B",
    },
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

  const handleDropdownChange = (value: string) => {
    console.log("Dropdown value:", value);
  };

  const options = [
    { value: "publisher_id", label: "publisher_id" },
    { value: "publisher_name", label: "publisher_name" },
    { value: "campaign_id", label: "campaign_id" },
  ];

  const [selectedOption, setSelectedOption] = useState("");

  const addField = () => {
    if (selectedOption) {
      setFields([...fields, { key: selectedOption, value: "" }]);
      setSelectedOption("");
    }
  };

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const handleValueChange = (index: number, newValue: string) => {
    const updatedFields = [...fields];
    updatedFields[index].value = newValue;
    setFields(updatedFields);
  };

  const handleOptionSelect = (value: string) => {
    setSelectedOption(value);
  };

  return (
    <>
      <div className="container flex items-center justify-start gap-2 rounded-md bg-white px-2 py-1">
        <Filter
          report={true}
          component={
            <div className="space-y-4 p-4">
              <div className="flex items-center space-x-2">
                <Select onValueChange={handleOptionSelect}>
                  <SelectTrigger className="w-64 rounded-md border border-gray-300 bg-white">
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    {options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <button
                  onClick={addField}
                  className="p-1 text-gray-600 hover:text-black"
                >
                  <CiCirclePlus className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-2">
                {fields.map((field, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={field.key}
                      readOnly
                      className="w-64 rounded-md border border-gray-300 bg-gray-100 p-2"
                    />
                    <input
                      type="text"
                      value={field.value}
                      onChange={(e) => handleValueChange(index, e.target.value)}
                      placeholder="Enter value"
                      className="w-64 rounded-md border border-gray-300 p-2"
                    />
                    <button
                      onClick={() => removeField(index)}
                      className="p-1 text-gray-600 hover:text-black"
                    >
                      <CiCircleMinus className="h-6 w-6" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          }
        />
      </div>

      <div className="space-y-4">
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
      </div>
    </>
  );
}
