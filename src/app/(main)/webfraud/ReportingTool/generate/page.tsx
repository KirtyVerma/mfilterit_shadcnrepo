"use client";

import React, { useState, useEffect } from "react";
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
import { Filter, Settings, X, Plus, Minus } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { MFDateRangePicker } from "@/components/mf";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ThresholdModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedItem: { id: string; label: string } | null;
}

const ThresholdModal = ({
  isOpen,
  onClose,
  selectedItem,
}: ThresholdModalProps) => {
  const [operator, setOperator] = useState<string>("");
  const [thresholdValue, setThresholdValue] = useState<string>("");

  if (!isOpen) return null;

  const handleSave = () => {
    console.log({
      item: selectedItem,
      operator,
      thresholdValue,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="w-[500px] rounded-lg bg-white shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              Add Threshold for {selectedItem?.label}
            </h2>
            <X
              className="h-4 w-4 cursor-pointer hover:text-gray-700"
              onClick={onClose}
            />
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Operator</Label>
              <Select value={operator} onValueChange={setOperator}>
                <SelectTrigger>
                  <SelectValue placeholder="Select operator" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="equals">=</SelectItem>
                  <SelectItem value="greater">&gt;</SelectItem>
                  <SelectItem value="less">&lt;</SelectItem>
                  <SelectItem value="greaterEqual">&gt;=</SelectItem>
                  <SelectItem value="lessEqual">&lt;=</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Threshold Value</Label>
              <Input
                placeholder="Enter Threshold Value"
                value={thresholdValue}
                onChange={(e) => setThresholdValue(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <Button
              // variant="outline"
              onClick={onClose}
              className="text-white bg-primary hover:bg-primary"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="text-white bg-primary hover:bg-primary"
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedItem: { id: string; label: string } | null;
}

const FilterModal = ({ isOpen, onClose, selectedItem }: FilterModalProps) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSelected, setShowSelected] = useState(false);
  const [selectAll, setSelectAll] = useState(false);

  const items = Array.from({ length: 50 }, (_, i) => ({
    id: `${i + 1}`,
    name: `${selectedItem?.label || 'Item'} ${i + 1}`,
    selected: false,
  }));

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    if (showSelected) {
      return matchesSearch && selectedItems.includes(item.id);
    }
    return matchesSearch;
  });

  const handleSelectAllToggle = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedItems(items.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const toggleItem = (id: string) => {
    setSelectedItems(prev => {
      if (prev.includes(id)) {
        return prev.filter(itemId => itemId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="flex max-h-[80vh] w-[1000px] flex-col rounded-lg bg-white shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              Filter {selectedItem?.label}
            </h2>
            <X
              className="h-4 w-4 cursor-pointer hover:text-gray-700"
              onClick={onClose}
            />
          </div>
          <Input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-2"
          />
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="select-all" className="text-sm">
                Select All
              </Label>
              <Switch
                id="select-all"
                checked={selectAll}
                onCheckedChange={handleSelectAllToggle}
              />
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="show-selected" className="text-sm">
                Show Selected
              </Label>
              <Switch
                id="show-selected"
                checked={showSelected}
                onCheckedChange={setShowSelected}
              />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-3 gap-4">
            {filteredItems.reduce((acc: JSX.Element[][], item, index) => {
              const columnIndex = Math.floor(index / 10);
              if (!acc[columnIndex]) {
                acc[columnIndex] = [];
              }
              acc[columnIndex].push(
                <div
                  key={item.id}
                  className="flex items-center space-x-2 rounded p-2 hover:bg-gray-50"
                >
                  <Checkbox
                    id={`item-${item.id}`}
                    checked={selectedItems.includes(item.id)}
                    onCheckedChange={() => toggleItem(item.id)}
                  />
                  <Label
                    htmlFor={`item-${item.id}`}
                    className="flex-1 cursor-pointer"
                  >
                    {item.name}
                  </Label>
                </div>
              );
              return acc;
            }, []).map((column, index) => (
              <div key={index} className="space-y-2">
                {column}
              </div>
            ))}
          </div>
        </div>

        <div className="border-t p-4">
          <div className="flex justify-end gap-3">
            <Button
              onClick={onClose}
              className="text-white bg-primary hover:bg-primary"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                // Handle save logic here
                onClose();
              }}
              className="text-white bg-primary hover:bg-primary"
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface EmailListModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EmailListModal = ({ isOpen, onClose }: EmailListModalProps) => {
  const [mailingListName, setMailingListName] = useState("");
  const [emails, setEmails] = useState<string[]>([""]); // Initialize with one empty input

  const handleAddEmailInput = () => {
    setEmails([...emails, ""]);
  };

  const handleEmailChange = (index: number, value: string) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const handleRemoveEmail = (index: number) => {
    if (emails.length > 1) {
      const newEmails = emails.filter((_, i) => i !== index);
      setEmails(newEmails);
    }
  };

  const handleSave = () => {
    // Handle save logic here
    const validEmails = emails.filter((email) => email.trim() !== "");
    console.log({ mailingListName, emails: validEmails });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="w-[600px] rounded-lg bg-white shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Mailing List</h2>
            <X
              className="h-5 w-5 cursor-pointer hover:text-gray-700"
              onClick={onClose}
            />
          </div>

          <div className="space-y-6">
            {/* Mailing List Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-2 block">Mailing List Name</Label>
                <Input
                  value={mailingListName}
                  onChange={(e) => setMailingListName(e.target.value)}
                  placeholder="Mailing1"
                />
              </div>
              <div>
                <Label className="mb-2 block">Bulk upload</Label>
                <div className="rounded-md border border-dashed border-gray-300 p-2">
                  <Button variant="outline" className="w-full text-white bg-primary hover:bg-primary/90">
                    Choose File
                    <span className="ml-2 text-xs">No file chosen</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Email Inputs */}
            <div className="space-y-2">
              {emails.map((email, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) => handleEmailChange(index, e.target.value)}
                    className="flex-1"
                  />
                  {index === emails.length - 1 ? (
                    <Plus
                      onClick={handleAddEmailInput}
                      className="mt-2 h-4 w-4 cursor-pointer text-primary"
                    />
                  ) : (
                    <Minus
                      onClick={() => handleRemoveEmail(index)}
                      className="mt-2 h-4 w-4 cursor-pointer text-primary"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="text-white bg-primary hover:bg-primary/90 rounded-full px-8"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="text-white bg-primary hover:bg-primary/90 rounded-full px-8"
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface GroupedOption {
  label: string;
  items: { id: string; label: string }[];
}

const dimensionGroups: GroupedOption[] =
  [
    {
      label: "Ad Group",
      items: [
        { id: "Render Status", label: "Render Status" },
        { id: "Server Campaign Code", label: "Server Campaign Code" },
        { id: "Server Placement Code", label: "Server Placement Code" },
        { id: "Server Site Code", label: "Server Site Code" },
        { id: "Size", label: "Size" }
      ]
    },
    {
      label: "Advertiser Group",
      items: [
        { id: "Name", label: "Name" }
      ]
    },
    {
      label: "App Group",
      items: [
        { id: "Age Rating", label: "Age Rating" },
        { id: "Bundle", label: "Bundle" },
        { id: "Developer", label: "Developer" },
        { id: "ID", label: "ID" },
        { id: "Name", label: "Name" },
        { id: "Store", label: "Store" },
        { id: "Store Category", label: "Store Category" }
      ]
    },
    {
      label: "Brand Group",
      items: [
        { id: "Market", label: "Market" },
        { id: "Name", label: "Name" },
        { id: "Region", label: "Region" }
      ]
    },
    {
      label: "Campaign Group",
      items: [
        { id: "Name", label: "Name" }
      ]
    },
    {
      label: "Category",
      items: [
        { id: "Name", label: "Name" },
        { id: "Type", label: "Type" }
      ]
    },
    {
      label: "Creative Group",
      items: [
        { id: "Code", label: "Code" }
      ]
    },
    {
      label: "CTV Group",
      items: [
        { id: "Device Name", label: "Device Name" }
      ]
    },
    {
      label: "Date Group",
      items: [
        { id: "Day", label: "Day" },
        { id: "Month", label: "Month" },
        { id: "Year", label: "Year" }
      ]
    },
    {
      label: "Delivery Group",
      items: [
        { id: "Country", label: "Country" },
        { id: "Country Code", label: "Country Code" },
        { id: "Site", label: "Site" }
      ]
    },
    {
      label: "Device Group",
      items: [
        { id: "Delivery Type", label: "Delivery Type" },
        { id: "DMA/MMA", label: "DMA/MMA" }
      ]
    },
    {
      label: "Dynamic Suitability GRoup",
      items: [
        { id: "Category Name", label: "Category Name" },
        { id: "Risk Tier", label: "Risk Tier" }
      ]
    },
    {
      label: "Extracted Group",
      items: [
        { id: "Bundle ID", label: "Bundle ID" }
      ]
    },
    {
      label: "FOS Group",
      items: [
        { id: "Certification Status", label: "Certification Status" }
      ]
    },
    {
      label: "Hour Group",
      items: [
        { id: "", label: "" }
      ]
    },
    {
      label: "Keyword Group",
      items: [
        { id: "String", label: "String" }
      ]
    },
    {
      label: "Language Group",
      items: [
        { id: "ISO Code", label: "ISO Code" },
        { id: "Name", label: "Name" }
      ]
    },
    {
      label: "Measurement Group",
      items: [
        { id: "Certification Status", label: "Certification Status" }
      ]
    },
    {
      label: "Media Group",
      items: [
        { id: "Property", label: "Property" },
        { id: "Type", label: "Type" }
      ]
    },
    {
      label: "Mobile Group",
      items: [
        { id: "OS", label: "OS" }
      ]
    },
    {
      label: "Month Group",
      items: [
        { id: "Month", label: "Month" }
      ]
    },
    {
      label: "Placement Group",
      items: [
        { id: "Name", label: "Name" },
        { id: "Size", label: "Size" }
      ]
    },
    {
      label: "Risk Group",
      items: [
        { id: "Tier", label: "Tier" }
      ]
    },
    {
      label: "Smart Sentiment",
      items: [
        { id: "Category Name", label: "Category Name" },
        { id: "Category Risk Tier", label: "Category Risk Tier" }
      ]
    },
    {
      label: "State/Region Group",
      items: [
        { id: "State", label: "State" },
        { id: "Region", label: "Region" }
      ]
    },
    {
      label: "Tracker Group",
      items: [
        { id: "Initiation Indicator", label: "Initiation Indicator" }
      ]
    },
    {
      label: "Traffic Group",
      items: [
        { id: "Validity", label: "Validity" }
      ]
    },
    {
      label: "UC Group",
      items: [
        { id: "Category Name", label: "Category Name" },
        { id: "Category Setting", label: "Category Setting" },
        { id: "Dynamic Suitability Category Name", label: "Dynamic Suitability Category Name" },
        { id: "Dynamic Suitability Risk Tier", label: "Dynamic Suitability Risk Tier" },
        { id: "Smart Sentiment Category Name", label: "Smart Sentiment Category Name" },
        { id: "Smart Sentiment Category Risk", label: "Smart Sentiment Category Risk" },
      ]
    },
    {
      label: "Universal Group",
      items: [
        { id: "App Name", label: "App Name" }
      ]
    },
    {
      label: "Week Group",
      items: [
        { id: "Week", label: "Week" },

      ]
    },
    {
      label: "Year Group",
      items: [
        { id: "Year", label: "Year" },

      ]
    },

    {
      label: "Zip",
      items: [
        { id: "Code", label: "Code" }
      ]
    }
  ]

const metricGroups: GroupedOption[] = [
  {
    label: "Allowed",
    items: [
      { id: "Allowed Ad Rate", label: "Allowed Ad Rate" },
      { id: "Allowed Ads", label: "Allowed Ads" },
      { id: "Allowed Evaluation Rate", label: "Allowed Evaluation Rate" },
      { id: "Allowed Evaluations", label: "Allowed Evaluations" },
      { id: "Share of Allowed Ads", label: "Share of Allowed Ads" },
      { id: "Share of Allowed Evaluations", label: "Share of Allowed Evaluations" },
    ],
  },
  {
    label: "Authentic",
    items: [
      { id: "Authentic Ads", label: "Authentic Ads" },
      { id: "Authentic Custom Viewable Impressions", label: "Authentic Custom Viewable Impressions" },
      { id: "Authentic Custom Viewable Rate", label: "Authentic Custom Viewable Rate" },
      { id: "Authentic Rate", label: "Authentic Rate" },
      { id: "Authentic Viewable Impressions", label: "Authentic Viewable Impressions" },
      { id: "Authentic Viewable Rate", label: "Authentic Viewable Rate" },
      { id: "Share of Authentic Ads", label: "Share of Authentic Ads" },
    ],
  },
  {
    label: "Blocks",
    items: [
      { id: "Block Rate", label: "Block Rate" },
      { id: "Blocks", label: "Blocks" },
      { id: "Share of Blocks", label: "Share of Blocks" },
    ],
  },
  {
    label: "Evaluations",
    items: [
      { id: "Evaluations", label: "Evaluations" },
      { id: "Share of Evaluations", label: "Share of Evaluations" },
    ],
  },
  {
    label: "Filters",
    items: [
      { id: "Filter Rate", label: "Filter Rate" },
      { id: "Filters", label: "Filters" },
    ],
  },
  {
    label: "Impressions",
    items: [
      { id: "Eligible Impressions", label: "Eligible Impressions" },
      { id: "Measured Impressions", label: "Measured Impressions" },
      { id: "Measurement Rate", label: "Measurement Rate" },
      { id: "Viewable Impressions", label: "Viewable Impressions" },
      { id: "Viewable Rate", label: "Viewable Rate" },
    ],
  },
  {
    label: "Monitoring",
    items: [
      { id: "Monitored Ads", label: "Monitored Ads" },
      { id: "Share of Monitored Ads", label: "Share of Monitored Ads" },
    ],
  },
  {
    label: "Requests",
    items: [
      { id: "Requests", label: "Requests" },
      { id: "Share of Requests", label: "Share of Requests" },
    ],
  },
  {
    label: "Server Initiated",
    items: [
      { id: "Server Initiated Ads", label: "Server Initiated Ads" },
    ],
  },
  {
    label: "Unique Incidents",
    items: [
      { id: "Unique Incident Rate", label: "Unique Incident Rate" },
      { id: "Unique Incidents", label: "Unique Incidents" },
    ],
  },
  {
    label: "App Store Category",
    items: [
      { id: "App Store Category Block Rate", label: "App Store Category Block Rate" },
      { id: "App Store Category Blocks", label: "App Store Category Blocks" },
      { id: "App Store Category Filter Rate", label: "App Store Category Filter Rate" },
      { id: "App Store Category Filters", label: "App Store Category Filters" },
      { id: "App Store Category Incident Rate", label: "App Store Category Incident Rate" },
      { id: "App Store Category Incidents", label: "App Store Category Incidents" }
    ]
  },
  {
    label: "Brand Safety",
    items: [
      { id: "Brand Safe Ads", label: "Brand Safe Ads" },
      { id: "Brand Safe Rate", label: "Brand Safe Rate" },
      { id: "Brand Safety Floor Block Rate", label: "Brand Safety Floor Block Rate" },
      { id: "Brand Safety Floor Blocks", label: "Brand Safety Floor Blocks" },
      { id: "Brand Safety Floor Filter Rate", label: "Brand Safety Floor Filter Rate" },
      { id: "Brand Safety Floor Filters", label: "Brand Safety Floor Filters" },
      { id: "Brand Safety Floor Incident Rate", label: "Brand Safety Floor Incident Rate" },
      { id: "Brand Safety Floor Incidents", label: "Brand Safety Floor Incidents" },
      { id: "Brand Suitability Block Rate", label: "Brand Suitability Block Rate" },
      { id: "Brand Suitability Blocks", label: "Brand Suitability Blocks" },
      { id: "Brand Suitability Filter Rate", label: "Brand Suitability Filter Rate" },
      { id: "Brand Suitability Filters", label: "Brand Suitability Filters" },
      { id: "Brand Suitability Incident Rate", label: "Brand Suitability Incident Rate" },
      { id: "Brand Suitability Incidents", label: "Brand Suitability Incidents" },
      { id: "Brand Suitable Ads", label: "Brand Suitable Ads" },
      { id: "Brand Suitable Rate", label: "Brand Suitable Rate" }
    ]
  },
  {
    label: "Custom",
    items: [
      { id: "Custom Block Rate", label: "Custom Block Rate" },
      { id: "Custom Blocks", label: "Custom Blocks" },
      { id: "Custom Category Page Block Rate", label: "Custom Category Page Block Rate" },
      { id: "Custom Category Page Blocks", label: "Custom Category Page Blocks" },
      { id: "Custom Category Page Filter Rate", label: "Custom Category Page Filter Rate" },
      { id: "Custom Category Page Filters", label: "Custom Category Page Filters" },
      { id: "Custom Category Page Incident Rate", label: "Custom Category Page Incident Rate" },
      { id: "Custom Category Page Incidents", label: "Custom Category Page Incidents" },
      { id: "Custom Filter Rate", label: "Custom Filter Rate" },
      { id: "Custom Filters", label: "Custom Filters" },
      { id: "Custom Incident Rate", label: "Custom Incident Rate" },
      { id: "Custom Incidents", label: "Custom Incidents" }
    ]
  },
  {
    label: "Keyword",
    items: [
      { id: "Keyword Block Rate", label: "Keyword Block Rate" },
      { id: "Keyword Blocks", label: "Keyword Blocks" },
      { id: "Keyword Filter Rate", label: "Keyword Filter Rate" },
      { id: "Keyword Filters", label: "Keyword Filters" },
      { id: "Keyword Incident Rate", label: "Keyword Incident Rate" },
      { id: "Keyword Incidents", label: "Keyword Incidents" }
    ]
  },
  {
    label: "Middleware",
    items: [
      { id: "Middleware Block Rate", label: "Middleware Block Rate" },
      { id: "Middleware Blocks", label: "Middleware Blocks" },
      { id: "Middleware Filter Rate", label: "Middleware Filter Rate" },
      { id: "Middleware Filters", label: "Middleware Filters" }
    ]
  },
  {
    label: "Miscellaneous",
    items: [
      { id: "Miscellaneous Block Rate", label: "Miscellaneous Block Rate" },
      { id: "Miscellaneous Blocks", label: "Miscellaneous Blocks" },
      { id: "Miscellaneous Filter Rate", label: "Miscellaneous Filter Rate" },
      { id: "Miscellaneous Filters", label: "Miscellaneous Filters" }
    ]
  },
  {
    label: "New App",
    items: [
      { id: "New App Block Rate", label: "New App Block Rate" },
      { id: "New App Blocks", label: "New App Blocks" },
      { id: "New App Filter Rate", label: "New App Filter Rate" },
      { id: "New App Filters", label: "New App Filters" }
    ]
  },
  {
    label: "New Site",
    items: [
      { id: "New Site Block Rate", label: "New Site Block Rate" },
      { id: "New Site Blocks", label: "New Site Blocks" },
      { id: "New Site Filter Rate", label: "New Site Filter Rate" },
      { id: "New Site Filters", label: "New Site Filters" }
    ]
  },
  {
    label: "No Domain",
    items: [
      { id: "No Domain Block Rate", label: "No Domain Block Rate" },
      { id: "No Domain Blocks", label: "No Domain Blocks" },
      { id: "No Domain Filter Rate", label: "No Domain Filter Rate" },
      { id: "No Domain Filters", label: "No Domain Filters" }
    ]
  },
  {
    label: "Off App IL",
    items: [
      { id: "Off App IL Block Rate", label: "Off App IL Block Rate" },
      { id: "Off App IL Blocks", label: "Off App IL Blocks" },
      { id: "Off App IL Filter Rate", label: "Off App IL Filter Rate" },
      { id: "Off App IL Filters", label: "Off App IL Filters" },
      { id: "Off App IL Incident Rate", label: "Off App IL Incident Rate" },
      { id: "Off App IL Incidents", label: "Off App IL Incidents" }
    ]
  },
  {
    label: "Off Language IL",
    items: [
      { id: "Off Language IL Block Rate", label: "Off Language IL Block Rate" },
      { id: "Off Language IL Blocks", label: "Off Language IL Blocks" },
      { id: "Off Language IL Filter Rate", label: "Off Language IL Filter Rate" },
      { id: "Off Language IL Filters", label: "Off Language IL Filters" },
      { id: "Off Language IL Incident Rate", label: "Off Language IL Incident Rate" },
      { id: "Off Language IL Incidents", label: "Off Language IL Incidents" }
    ]
  },
  {
    label: "Off Site IL",
    items: [
      { id: "Off Site IL Block Rate", label: "Off Site IL Block Rate" },
      { id: "Off Site IL Blocks", label: "Off Site IL Blocks" },
      { id: "Off Site IL Filter Rate", label: "Off Site IL Filter Rate" },
      { id: "Off Site IL Filters", label: "Off Site IL Filters" },
      { id: "Off Site IL Incident Rate", label: "Off Site IL Incident Rate" },
      { id: "Off Site IL Incidents", label: "Off Site IL Incidents" }
    ]
  },
  {
    label: "On App EL",
    items: [
      { id: "On App EL Block Rate", label: "On App EL Block Rate" },
      { id: "On App EL Blocks", label: "On App EL Blocks" },
      { id: "On App EL Filter Rate", label: "On App EL Filter Rate" },
      { id: "On App EL Filters", label: "On App EL Filters" },
      { id: "On App EL Incident Rate", label: "On App EL Incident Rate" },
      { id: "On App EL Incidents", label: "On App EL Incidents" }
    ]
  },
  {
    label: "On Language EL",
    items: [
      { id: "On Language EL Block Rate", label: "On Language EL Block Rate" },
      { id: "On Language EL Blocks", label: "On Language EL Blocks" },
      { id: "On Language EL Filter Rate", label: "On Language EL Filter Rate" },
      { id: "On Language EL Filters", label: "On Language EL Filters" },
      { id: "On Language EL Incident Rate", label: "On Language EL Incident Rate" },
      { id: "On Language EL Incidents", label: "On Language EL Incidents" }
    ]
  },
  {
    label: "On Site EL",
    items: [
      { id: "On Site EL Block Rate", label: "On Site EL Block Rate" },
      { id: "On Site EL Blocks", label: "On Site EL Blocks" },
      { id: "On Site EL Filter Rate", label: "On Site EL Filter Rate" },
      { id: "On Site EL Filters", label: "On Site EL Filters" },
      { id: "On Site EL Incident Rate", label: "On Site EL Incident Rate" },
      { id: "On Site EL Incidents", label: "On Site EL Incidents" }
    ]
  },
  {
    label: "Out of Age",
    items: [
      { id: "Out of Age Block Rate", label: "Out of Age Block Rate" },
      { id: "Out of Age Blocks", label: "Out of Age Blocks" },
      { id: "Out of Age Filter Rate", label: "Out of Age Filter Rate" },
      { id: "Out of Age Filters", label: "Out of Age Filters" },
      { id: "Out of Age Incident Rate", label: "Out of Age Incident Rate" },
      { id: "Out of Age Incidents", label: "Out of Age Incidents" }
    ]
  },
  {
    label: "Out of Star",
    items: [
      { id: "Out of Star Block Rate", label: "Out of Star Block Rate" },
      { id: "Out of Star Blocks", label: "Out of Star Blocks" },
      { id: "Out of Star Filter Rate", label: "Out of Star Filter Rate" },
      { id: "Out of Star Filters", label: "Out of Star Filters" },
      { id: "Out of Star Incident Rate", label: "Out of Star Incident Rate" },
      { id: "Out of Star Incidents", label: "Out of Star Incidents" }
    ]
  },
  {
    label: "Keywords",
    items: [
      { id: "Overall Keywords Filters", label: "Overall Keywords Filters" },
      { id: "Share of Keyword Blocks", label: "Share of Keyword Blocks" },
      { id: "Share of Keyword Filters", label: "Share of Keyword Filters" },
      { id: "Share of Keyword Incidents", label: "Share of Keyword Incidents" }
    ]
  },
  {
    label: "UC",
    items: [
      { id: "Share of UC Blocks", label: "Share of UC Blocks" },
      { id: "Share of UC Filters", label: "Share of UC Filters" },
      { id: "Share of UC Incidents", label: "Share of UC Incidents" },
      { id: "UC App Block Rate", label: "UC App Block Rate" },
      { id: "UC App Blocks", label: "UC App Blocks" },
      { id: "UC App Filter Rate", label: "UC App Filter Rate" },
      { id: "UC App Filters", label: "UC App Filters" },
      { id: "UC App Incident Rate", label: "UC App Incident Rate" },
      { id: "UC App Incidents", label: "UC App Incidents" },
      { id: "UC Block Rate", label: "UC Block Rate" },
      { id: "UC Blocks", label: "UC Blocks" },
      { id: "UC Filter Rate", label: "UC Filter Rate" },
      { id: "UC Filters", label: "UC Filters" },
      { id: "UC Incident Rate", label: "UC Incident Rate" },
      { id: "UC Incidents", label: "UC Incidents" },
      { id: "UC Incremental Blocks", label: "UC Incremental Blocks" },
      { id: "UC Incremental Filters", label: "UC Incremental Filters" },
      { id: "UC Incremental Incidents", label: "UC Incremental Incidents" },
      { id: "UC Page Block Rate", label: "UC Page Block Rate" },
      { id: "UC Page Blocks", label: "UC Page Blocks" },
      { id: "UC Page Filter Rate", label: "UC Page Filter Rate" },
      { id: "UC Page Filters", label: "UC Page Filters" },
      { id: "UC Page Incident Rate", label: "UC Page Incident Rate" },
      { id: "UC Page Incidents", label: "UC Page Incidents" },
      { id: "UC Site Block Rate", label: "UC Site Block Rate" },
      { id: "UC Site Blocks", label: "UC Site Blocks" },
      { id: "UC Site Filter Rate", label: "UC Site Filter Rate" },
      { id: "UC Site Filters", label: "UC Site Filters" },
      { id: "UC Site Incident Rate", label: "UC Site Incident Rate" },
      { id: "UC Site Incidents", label: "UC Site Incidents" }
    ]
  },
  {
    label: "Site & App List",
    items: [
      { id: "Site & App List Block Rate", label: "Site & App List Block Rate" },
      { id: "Site & App List Blocks", label: "Site & App List Blocks" },
      { id: "Site & App List Filter Rate", label: "Site & App List Filter Rate" },
      { id: "Site & App List Filters", label: "Site & App List Filters" },
      { id: "Site & App List Incident Rate", label: "Site & App List Incident Rate" },
      { id: "Site & App List Incidents", label: "Site & App List Incidents" }
    ]
  },
  {
    label: "Adware/Malware",
    items: [
      { id: "Adware/Malware Block Rate", label: "Adware/Malware Block Rate" },
      { id: "Adware/Malware Blocks", label: "Adware/Malware Blocks" },
      { id: "Adware/Malware Filter Rate", label: "Adware/Malware Filter Rate" },
      { id: "Adware/Malware Filters", label: "Adware/Malware Filters" },
      { id: "Adware/Malware Incident Rate", label: "Adware/Malware Incident Rate" },
      { id: "Adware/Malware Incidents", label: "Adware/Malware Incidents" }
    ]
  },
  {
    label: "App Fraud/IVT",
    items: [
      { id: "App Fraud/IVT Block Rate", label: "App Fraud/IVT Block Rate" },
      { id: "App Fraud/IVT Blocks", label: "App Fraud/IVT Blocks" },
      { id: "App Fraud/IVT Filter Rate", label: "App Fraud/IVT Filter Rate" },
      { id: "App Fraud/IVT Filters", label: "App Fraud/IVT Filters" },
      { id: "App Fraud/IVT Incident Rate", label: "App Fraud/IVT Incident Rate" },
      { id: "App Fraud/IVT Incidents", label: "App Fraud/IVT Incidents" }
    ]
  },
  {
    label: "Bot Fraud",
    items: [
      { id: "Bot Fraud Block Rate", label: "Bot Fraud Block Rate" },
      { id: "Bot Fraud Blocks", label: "Bot Fraud Blocks" },
      { id: "Bot Fraud Filter Rate", label: "Bot Fraud Filter Rate" },
      { id: "Bot Fraud Filters", label: "Bot Fraud Filters" },
      { id: "Bot Fraud Incident Rate", label: "Bot Fraud Incident Rate" },
      { id: "Bot Fraud Incidents", label: "Bot Fraud Incidents" }
    ]
  },
  {
    label: "Data Center Traffic",
    items: [
      { id: "Data Center Traffic Block Rate", label: "Data Center Traffic Block Rate" },
      { id: "Data Center Traffic Blocks", label: "Data Center Traffic Blocks" },
      { id: "Data Center Traffic Filter Rate", label: "Data Center Traffic Filter Rate" },
      { id: "Data Center Traffic Filters", label: "Data Center Traffic Filters" },
      { id: "Data Center Traffic Incident Rate", label: "Data Center Traffic Incident Rate" },
      { id: "Data Center Traffic Incidents", label: "Data Center Traffic Incidents" }
    ]
  },
  {
    label: "Emulator",
    items: [
      { id: "Emulator Block Rate", label: "Emulator Block Rate" },
      { id: "Emulator Blocks", label: "Emulator Blocks" },
      { id: "Emulator Filter Rate", label: "Emulator Filter Rate" },
      { id: "Emulator Filters", label: "Emulator Filters" },
      { id: "Emulator Incident Rate", label: "Emulator Incident Rate" },
      { id: "Emulator Incidents", label: "Emulator Incidents" }
    ]
  },
  {
    label: "Fraud",
    items: [
      { id: "Fraud Block Rate", label: "Fraud Block Rate" },
      { id: "Fraud Blocks", label: "Fraud Blocks" },
      { id: "Fraud Filter Rate", label: "Fraud Filter Rate" },
      { id: "Fraud Filters", label: "Fraud Filters" },
      { id: "Fraud Incident Rate", label: "Fraud Incident Rate" },
      { id: "Fraud Incidents", label: "Fraud Incidents" }
    ]
  },
  {
    label: "Fraud/SIVT",
    items: [
      { id: "Fraud/SIVT Block Rate", label: "Fraud/SIVT Block Rate" },
      { id: "Fraud/SIVT Blocks", label: "Fraud/SIVT Blocks" },
      { id: "Fraud/SIVT Filter Rate", label: "Fraud/SIVT Filter Rate" },
      { id: "Fraud/SIVT Filters", label: "Fraud/SIVT Filters" },
      { id: "Fraud/SIVT Free Ads", label: "Fraud/SIVT Free Ads" },
      { id: "Fraud/SIVT Free Rate", label: "Fraud/SIVT Free Rate" },
      { id: "Fraud/SIVT Incident Rate", label: "Fraud/SIVT Incident Rate" },
      { id: "Fraud/SIVT Incidents", label: "Fraud/SIVT Incidents" }
    ]
  },
  {
    label: "Hijacked Devices",
    items: [
      { id: "Hijacked Devices Block Rate", label: "Hijacked Devices Block Rate" },
      { id: "Hijacked Devices Blocks", label: "Hijacked Devices Blocks" },
      { id: "Hijacked Devices Filter Rate", label: "Hijacked Devices Filter Rate" },
      { id: "Hijacked Devices Filters", label: "Hijacked Devices Filters" },
      { id: "Hijacked Devices Incident Rate", label: "Hijacked Devices Incident Rate" },
      { id: "Hijacked Devices Incidents", label: "Hijacked Devices Incidents" }
    ]
  },
  {
    label: "Injected Ads",
    items: [
      { id: "Injected Ads Block Rate", label: "Injected Ads Block Rate" },
      { id: "Injected Ads Blocks", label: "Injected Ads Blocks" },
      { id: "Injected Ads Filter Rate", label: "Injected Ads Filter Rate" },
      { id: "Injected Ads Filters", label: "Injected Ads Filters" },
      { id: "Injected Ads Incident Rate", label: "Injected Ads Incident Rate" },
      { id: "Injected Ads Incidents", label: "Injected Ads Incidents" }
    ]
  },
  {
    label: "Site Fraud/IVT",
    items: [
      { id: "Site Fraud/IVT Block Rate", label: "Site Fraud/IVT Block Rate" },
      { id: "Site Fraud/IVT Blocks", label: "Site Fraud/IVT Blocks" },
      { id: "Site Fraud/IVT Filter Rate", label: "Site Fraud/IVT Filter Rate" },
      { id: "Site Fraud/IVT Filters", label: "Site Fraud/IVT Filters" },
      { id: "Site Fraud/IVT Incident Rate", label: "Site Fraud/IVT Incident Rate" },
      { id: "Site Fraud/IVT Incidents", label: "Site Fraud/IVT Incidents" }
    ]
  },
  {
    label: "Geo Metrics",
    items: [
      { id: "In Geo Ads", label: "In Geo Ads" },
      { id: "In Geo Rate", label: "In Geo Rate" },
      { id: "Out of Geo Blocks", label: "Out of Geo Blocks" },
      { id: "Out of Geo Block Rate", label: "Out of Geo Block Rate" },
      { id: "Out of Geo Filter Rate", label: "Out of Geo Filter Rate" },
      { id: "Out of Geo Filters", label: "Out of Geo Filters" },
      { id: "Out of Geo Incident Rate", label: "Out of Geo Incident Rate" },
      { id: "Out of Geo Incidents", label: "Out of Geo Incidents" }
    ]
  },
  {
    label: "Viewability Metrics",
    items: [
      { id: "100% Display Viewable Impressions", label: "100% Display Viewable Impressions" },
      { id: "100% Display Viewable Rate", label: "100% Display Viewable Rate" },
      { id: "100% Viewable Through Q1 Impressions", label: "100% Viewable Through Q1 Impressions" },
      { id: "100% Viewable Through Q1 Rate", label: "100% Viewable Through Q1 Rate" },
      { id: "100% Viewable Through Q2 Impressions", label: "100% Viewable Through Q2 Impressions" },
      { id: "100% Viewable Through Q2 Rate", label: "100% Viewable Through Q2 Rate" },
      { id: "100% Viewable Through Q3 Impressions", label: "100% Viewable Through Q3 Impressions" },
      { id: "100% Viewable Through Q3 Rate", label: "100% Viewable Through Q3 Rate" },
      { id: "100% Viewable Through Q4 Impressions", label: "100% Viewable Through Q4 Impressions" },
      { id: "100% Viewable Through Q4 Rate", label: "100% Viewable Through Q4 Rate" },
      { id: "50% Display Viewable 1-5 Secs Impressions", label: "50% Display Viewable 1-5 Secs Impressions" },
      { id: "50% Display Viewable 1-5 Secs Rate", label: "50% Display Viewable 1-5 Secs Rate" },
      { id: "50% Display Viewable 5-15 Secs Impressions", label: "50% Display Viewable 5-15 Secs Impressions" },
      { id: "50% Display Viewable 5-15 Secs Rate", label: "50% Display Viewable 5-15 Secs Rate" },
      { id: "50% Display Viewable >15 Secs Impressions", label: "50% Display Viewable >15 Secs Impressions" },
      { id: "50% Display Viewable >15 Secs Rate", label: "50% Display Viewable >15 Secs Rate" },
      { id: "Audible Impressions", label: "Audible Impressions" },
      { id: "Audible Measured Impressions", label: "Audible Measured Impressions" },
      { id: "Audible Rate", label: "Audible Rate" },
      { id: "Audible Viewable Impressions", label: "Audible Viewable Impressions" },
      { id: "Audible Viewable Measured Impressions", label: "Audible Viewable Measured Impressions" },
      { id: "Audible Viewable Rate", label: "Audible Viewable Rate" },
      { id: "Audible and In-View on Completion Impressions", label: "Audible and In-View on Completion Impressions" },
      { id: "Audible and In-View on Completion Rate", label: "Audible and In-View on Completion Rate" },
      { id: "Authentic Average Quartiles Progressed %", label: "Authentic Average Quartiles Progressed %" },
      { id: "Authentic Completed Fully On-Screen Impressions", label: "Authentic Completed Fully On-Screen Impressions" },
      { id: "Authentic Completed Fully On-Screen Rate", label: "Authentic Completed Fully On-Screen Rate" },
      { id: "Authentic Completed Impressions", label: "Authentic Completed Impressions" },
      { id: "Authentic Completed Rate", label: "Authentic Completed Rate" },
      { id: "Authentic Q1 Completed Impressions", label: "Authentic Q1 Completed Impressions" },
      { id: "Authentic Q1 Completed Rate", label: "Authentic Q1 Completed Rate" },
      { id: "Authentic Q1 Fully On-Screen Impressions", label: "Authentic Q1 Fully On-Screen Impressions" },
      { id: "Authentic Q1 Fully On-Screen Rate", label: "Authentic Q1 Fully On-Screen Rate" },
      { id: "Authentic Q2 Completed Impressions", label: "Authentic Q2 Completed Impressions" },
      { id: "Authentic Q2 Completed Rate", label: "Authentic Q2 Completed Rate" },
      { id: "Authentic Q2 Fully On-Screen Impressions", label: "Authentic Q2 Fully On-Screen Impressions" },
      { id: "Authentic Q2 Fully On-Screen Rate", label: "Authentic Q2 Fully On-Screen Rate" },
      { id: "Authentic Q3 Completed Impressions", label: "Authentic Q3 Completed Impressions" },
      { id: "Authentic Q3 Completed Rate", label: "Authentic Q3 Completed Rate" },
      { id: "Authentic Q3 Fully On-Screen Impressions", label: "Authentic Q3 Fully On-Screen Impressions" },
      { id: "Authentic Q3 Fully On-Screen Rate", label: "Authentic Q3 Fully On-Screen Rate" },
      { id: "Authentic Quartile Completion Measured Impressions", label: "Authentic Quartile Completion Measured Impressions" },
      { id: "Average Quartiles Progressed %", label: "Average Quartiles Progressed %" },
      { id: "Average Time (s) - Authentic Viewable Impressions", label: "Average Time (s) - Authentic Viewable Impressions" },
      { id: "Average Time (s) - IAB Pixel Standard In-View", label: "Average Time (s) - IAB Pixel Standard In-View" },
      { id: "Average Time (s) - Viewable Impressions", label: "Average Time (s) - Viewable Impressions" },
      { id: "Completed Impressions", label: "Completed Impressions" },
      { id: "Completed Rate", label: "Completed Rate" },
      { id: "Custom Measured Impressions", label: "Custom Measured Impressions" },
      { id: "Custom Measurement Rate", label: "Custom Measurement Rate" },
      { id: "Custom Viewability Eligible Impressions", label: "Custom Viewability Eligible Impressions" },
      { id: "Custom Viewable Impressions", label: "Custom Viewable Impressions" },
      { id: "Custom Viewable Rate", label: "Custom Viewable Rate" },
      { id: "Q1 Audible Impressions", label: "Q1 Audible Impressions" },
      { id: "Q1 Audible Rate", label: "Q1 Audible Rate" },
      { id: "Q1 Audible Viewable Impressions", label: "Q1 Audible Viewable Impressions" },
      { id: "Q1 Audible Viewable Rate", label: "Q1 Audible Viewable Rate" },
      { id: "Q1 Completed Impressions", label: "Q1 Completed Impressions" },
      { id: "Q1 Completed Rate", label: "Q1 Completed Rate" },
      { id: "Q1 Viewable Impressions", label: "Q1 Viewable Impressions" },
      { id: "Q1 Viewable Rate", label: "Q1 Viewable Rate" },
      { id: "Q2 Audible Impressions", label: "Q2 Audible Impressions" },
      { id: "Q2 Audible Rate", label: "Q2 Audible Rate" },
      { id: "Q2 Audible Viewable Impressions", label: "Q2 Audible Viewable Impressions" },
      { id: "Q2 Audible Viewable Rate", label: "Q2 Audible Viewable Rate" },
      { id: "Q2 Completed Impressions", label: "Q2 Completed Impressions" },
      { id: "Q2 Completed Rate", label: "Q2 Completed Rate" },
      { id: "Q2 Viewable Impressions", label: "Q2 Viewable Impressions" },
      { id: "Q2 Viewable Rate", label: "Q2 Viewable Rate" },
      { id: "Q3 Audible Impressions", label: "Q3 Audible Impressions" },
      { id: "Q3 Audible Rate", label: "Q3 Audible Rate" },
      { id: "Q3 Audible Viewable Impressions", label: "Q3 Audible Viewable Impressions" },
      { id: "Q3 Audible Viewable Rate", label: "Q3 Audible Viewable Rate" },
      { id: "Q3 Completed Impressions", label: "Q3 Completed Impressions" },
      { id: "Q3 Completed Rate", label: "Q3 Completed Rate" },
      { id: "Q3 Viewable Impressions", label: "Q3 Viewable Impressions" },
      { id: "Q3 Viewable Rate", label: "Q3 Viewable Rate" },
      { id: "Q4 Audible Impressions", label: "Q4 Audible Impressions" },
      { id: "Q4 Audible Rate", label: "Q4 Audible Rate" },
      { id: "Q4 Audible Viewable Impressions", label: "Q4 Audible Viewable Impressions" },
      { id: "Q4 Audible Viewable Rate", label: "Q4 Audible Viewable Rate" },
      { id: "Q4 Viewable Impressions", label: "Q4 Viewable Impressions" },
      { id: "Q4 Viewable Rate", label: "Q4 Viewable Rate" },
      { id: "Quartile Completion Measured Impressions", label: "Quartile Completion Measured Impressions" },
      { id: "Quartile Completion Measurement Rate", label: "Quartile Completion Measurement Rate" },
      { id: "Total Time (hr) - Authentic Viewable Impressions", label: "Total Time (hr) - Authentic Viewable Impressions" },
      { id: "Total Time (hr) - Viewable Impressions", label: "Total Time (hr) - Viewable Impressions" },
      { id: "Total Viewable Time (s)", label: "Total Viewable Time (s)" }
    ]
  },
  {
    label: "Fully On-Screen Metrics",
    items: [
      { id: "Authentic Fully On-Screen Average Quartiles Progressed", label: "Authentic Fully On-Screen Average Quartiles Progressed" },
      { id: "Authentic Fully On-Screen Measured Impressions", label: "Authentic Fully On-Screen Measured Impressions" },
      { id: "Completed Fully On-Screen Impressions", label: "Completed Fully On-Screen Impressions" },
      { id: "Completed Fully On-Screen Rate", label: "Completed Fully On-Screen Rate" },
      { id: "Fully On-Screen Average Quartiles Progressed %", label: "Fully On-Screen Average Quartiles Progressed %" },
      { id: "Fully On-Screen Measured Impressions", label: "Fully On-Screen Measured Impressions" },
      { id: "Fully On-Screen Measurement Rate", label: "Fully On-Screen Measurement Rate" },
      { id: "Q1 Fully On-Screen Impressions", label: "Q1 Fully On-Screen Impressions" },
      { id: "Q1 Fully On-Screen Rate", label: "Q1 Fully On-Screen Rate" },
      { id: "Q2 Fully On-Screen Impressions", label: "Q2 Fully On-Screen Impressions" },
      { id: "Q2 Fully On-Screen Rate", label: "Q2 Fully On-Screen Rate" },
      { id: "Q3 Fully On-Screen Impressions", label: "Q3 Fully On-Screen Impressions" },
      { id: "Q3 Fully On-Screen Rate", label: "Q3 Fully On-Screen Rate" }
    ]
  }
];

interface DeliveryOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'schedule' | 'download';
}

const DeliveryOptionsModal = ({ isOpen, onClose, type }: DeliveryOptionsModalProps) => {
  const [sendViaEmail, setSendViaEmail] = useState(false);
  const [saveToCloud, setSaveToCloud] = useState(false);
  const [selectedCloudProvider, setSelectedCloudProvider] = useState<"AWS" | "GCP" | "Azure">("AWS");
  const [emails, setEmails] = useState<string[]>([""]);
  const [selectedMailingList, setSelectedMailingList] = useState<string>("");

  const handleAddEmailInput = () => {
    setEmails([...emails, ""]);
  };

  const handleEmailChange = (index: number, value: string) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const handleRemoveEmail = (index: number) => {
    if (emails.length > 1) {
      const newEmails = emails.filter((_, i) => i !== index);
      setEmails(newEmails);
    }
  };

  const handleConfirm = () => {
    // Handle the confirmation logic here
    console.log({
      type,
      sendViaEmail,
      saveToCloud,
      selectedMailingList, // Include the selected mailing list in the confirmation
      cloudProvider: saveToCloud ? selectedCloudProvider : undefined,
      emailDetails: sendViaEmail ? {
        emails: emails.filter(email => email.trim() !== "")
      } : undefined
    });
    onClose();
  };

  // Sample mailing lists, replace with your actual data source
  const mailingLists = [
    { id: "mailingList1", name: "Mailing List 1" },
    { id: "mailingList2", name: "Mailing List 2" },
    { id: "mailingList3", name: "Mailing List 3" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {type === 'schedule' ? 'Schedule Report' : 'Download Report'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          <div className="border-b">
            <div className="flex">
              <div className="flex items-center gap-2 min-w-[150px] px-4 py-2">
                <Checkbox
                  id="save-cloud"
                  checked={saveToCloud}
                  onCheckedChange={(checked) => {
                    setSaveToCloud(checked as boolean);
                  }}
                />
                <Label
                  htmlFor="save-cloud"
                  className="text-sm font-medium cursor-pointer"
                >
                  Save to Cloud
                </Label>
              </div>
              <div className="flex items-center gap-2 min-w-[150px] px-4 py-2">
                <Checkbox
                  id="send-email"
                  checked={sendViaEmail}
                  onCheckedChange={(checked) => {
                    setSendViaEmail(checked as boolean);
                  }}
                />
                <Label
                  htmlFor="send-email"
                  className="text-sm font-medium cursor-pointer"
                >
                  Send via Email
                </Label>
              </div>
            </div>
          </div>

          {sendViaEmail && (
            <div className="space-y-4 rounded-lg border p-4 mt-4">
              <div className="space-y-2">
                <Label>Select Mailing List</Label>
                <Select value={selectedMailingList} onValueChange={setSelectedMailingList}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose Mailing List" />
                  </SelectTrigger>
                  <SelectContent>
                    {mailingLists.map((list) => (
                      <SelectItem key={list.id} value={list.id}>
                        {list.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                {emails.map((email, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      type="email"
                      placeholder="Enter Email"
                      value={email}
                      onChange={(e) => handleEmailChange(index, e.target.value)}
                      className="flex-1"
                    />
                    {index === emails.length - 1 ? (
                      <Plus
                        onClick={handleAddEmailInput}
                        className="mt-2 h-4 w-4 cursor-pointer text-primary"
                      />
                    ) : (
                      <Minus
                        onClick={() => handleRemoveEmail(index)}
                        className="mt-2 h-4 w-4 cursor-pointer text-primary"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {saveToCloud && (
            <div className="space-y-4 rounded-lg border p-4 mt-4">
              <div className="border-b">
                <div className="flex">
                  {["AWS", "GCP", "Azure"].map((provider) => (
                    <button
                      key={provider}
                      onClick={() => setSelectedCloudProvider(provider as "AWS" | "GCP" | "Azure")}
                      className={`relative min-w-[100px] border-b-2 px-4 py-2 text-sm font-medium transition-colors hover:text-primary ${selectedCloudProvider === provider
                          ? "border-primary text-primary"
                          : "border-transparent text-muted-foreground"
                        }`}
                    >
                      {provider}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Secret Key</Label>
                <Input placeholder={`Enter ${selectedCloudProvider} Secret Key`} />
              </div>
              <div className="space-y-2">
                <Label>Access Key</Label>
                <Input placeholder={`Enter ${selectedCloudProvider} Access Key`} />
              </div>
              <div className="space-y-2">
                <Label>
                  {selectedCloudProvider === "AWS" ? "Bucket Name" :
                    selectedCloudProvider === "GCP" ? "Storage Name" :
                      "Container Name"}
                </Label>
                <Input placeholder={`Enter ${selectedCloudProvider === "AWS" ? "Bucket Name" :
                    selectedCloudProvider === "GCP" ? "Storage Name" :
                      "Container Name"
                  }`} />
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex-shrink-0">
          <Button
            onClick={onClose}
            className="text-white bg-primary hover:bg-primary"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            className="text-white bg-primary hover:bg-primary"
          >
            {type === 'schedule' ? 'Schedule' : 'Download'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (action: 'cloud' | 'email' | 'download') => void;
}

const ConfirmationDialog = ({ isOpen, onClose, onConfirm }: ConfirmationDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Download Report</DialogTitle>
          <DialogDescription>
            Would you like to save the report to cloud or send via email? Or do you wish to continue downloading without exporting the report?
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            {/* <Button
              onClick={() => onConfirm('cloud')}
              className="text-white bg-primary hover:bg-primary"
            >
              Save to Cloud
            </Button> */}
            <Button
              onClick={() => onConfirm('cloud')}
              variant="outline"
              className="text-primary hover:text-primary"
            >
              Send via Email or Save to Cloud
            </Button>
            <Button
              onClick={() => onConfirm('download')}
              variant="outline"
              className="text-primary hover:text-primary"
            >
              Download Without Export
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const GenerateReportPage = () => {
  const [storeInCloud, setStoreInCloud] = useState(false);
  const [selectedCloudProvider, setSelectedCloudProvider] = useState<"AWS" | "GCP" | "Azure">("AWS");
  const [reportType, setReportType] = useState<string>("scheduled");
  const [frequency, setFrequency] = useState<string>("last-day");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [fileType, setFileType] = useState<string>("csv");
  const [thresholdModalOpen, setThresholdModalOpen] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [selectedEmailLists, setSelectedEmailLists] = useState<string[]>([]);
  const [customEmails, setCustomEmails] = useState<string[]>([""]);
  const [isAdditionalSettingsExpanded, setIsAdditionalSettingsExpanded] = useState(false);
  const [sendReportViaEmail, setSendReportViaEmail] = useState(false);
  const [columnOrder, setColumnOrder] = useState<Array<{ id: string, content: string, type: 'dimension' | 'metric' }>>([]);
  const [selectedColumns, setSelectedColumns] = useState<typeof columnOrder>([]);
  const [selectedDimensions, setSelectedDimensions] = useState<string[]>([]);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [selectedItemForThreshold, setSelectedItemForThreshold] = useState<{
    id: string;
    label: string;
  } | null>(null);
  const [selectedItemForFilter, setSelectedItemForFilter] = useState<{
    id: string;
    label: string;
  } | null>(null);
  const [dimensionSearch, setDimensionSearch] = useState("");
  const [metricSearch, setMetricSearch] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("none");
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const [reportName, setReportName] = useState("");
  const [reportCategory, setReportCategory] = useState<{ summary: boolean, transactional: boolean }>({
    summary: false,
    transactional: false
  });
  const [deliveryModalOpen, setDeliveryModalOpen] = useState(false);
  const [deliveryModalType, setDeliveryModalType] = useState<'schedule' | 'download'>('schedule');
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);

  const getFormattedFileName = () => {
    const today = new Date();
    const date = today.toISOString().split('T')[0].replace(/-/g, ''); // Format: YYYYMMDD
    return `web.publicis.cpv_${date}`;
  };

  // Update columnOrder when dimensions or metrics change
  useEffect(() => {
    const dimensionColumns = selectedDimensions.map(dim => ({
      id: `dim-${dim}`,
      content: dim,
      type: 'dimension' as const
    }));

    const metricColumns = selectedMetrics.map(metric => ({
      id: `metric-${metric}`,
      content: metric,
      type: 'metric' as const
    }));

    setColumnOrder([...dimensionColumns, ...metricColumns]);
  }, [selectedDimensions, selectedMetrics]);

  useEffect(() => {
    if (editId) {
      // Basic report settings
      setReportName("Monthly Traffic Analysis Report");
      setReportCategory({
        summary: true,
        transactional: false
      });
      setReportType("scheduled");
      setFrequency("last-month");

      // Dimensions and Metrics
      setSelectedDimensions([
        "Render Status",
        "Server Campaign",
        "App Bundle ID",
        "App Name",
        "Creative Code"
      ]);

      setSelectedMetrics([
        "Blocks",
        "Block Rate",
        "Share of Blocks",
        "Filters",
        "Filter Rate",
        "Fraud/SIVT Blocks",
        "Fraud/SIVT Block Rate",
        "Bot Fraud Blocks",
        "Bot Fraud Block Rate",
        "Fraud Blocks",
        "Fraud Block Rate"
      ]);

      // File formatting settings
      setFileType("xlsx");
      setSelectedColumns([
        { id: "publisher1", content: "Publisher 1", type: 'dimension' },
        { id: "publisher2", content: "Publisher 2", type: 'dimension' },
        { id: "publisher3", content: "Publisher 3", type: 'dimension' }
      ]);

      // Email settings
      setSelectedEmailLists(["Mail_list_1", "Mail_list_2", "custom"]);
      setCustomEmails([
        "agam.srivastava@mfilterit.com",
        "chethan.hanu@mfilterit.com",
        "dhiraj.gupta@mfilterit.com"
      ]);
      setSendReportViaEmail(true);

      // Cloud storage settings
      setStoreInCloud(true);
      setSelectedCloudProvider("AWS");
      setIsAdditionalSettingsExpanded(true);

      // AWS credentials and settings
      const cloudStorageData = {
        secretKey: "AKIAxxxxxxxxxxxxxxxx",
        accessKey: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
        bucketName: "analytics-reports-bucket-2024"
      };

      // Set dates for scheduled report
      const today = new Date();
      const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
      setStartDate(lastMonth);
      setEndDate(lastMonthEnd);

      // Update AWS input fields
      setTimeout(() => {
        const inputs = document.querySelectorAll('input[placeholder*="Key"], input[placeholder*="Bucket"], input[placeholder*="Name"]');
        inputs.forEach(input => {
          const placeholder = (input as HTMLInputElement).placeholder;
          if (placeholder?.includes('Secret')) {
            (input as HTMLInputElement).value = cloudStorageData.secretKey;
          } else if (placeholder?.includes('Access')) {
            (input as HTMLInputElement).value = cloudStorageData.accessKey;
          } else if (placeholder?.includes('Bucket')) {
            (input as HTMLInputElement).value = cloudStorageData.bucketName;
          }
        });
      }, 100);
    }
  }, [editId]);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(columnOrder || []);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setColumnOrder(items);
  };

  const handleColumnSelect = (value: string) => {
    const selectedColumn = columnOrder?.find((col) => col.id === value);
    if (selectedColumn && !selectedColumns?.find((col) => col.id === value)) {
      setSelectedColumns([...selectedColumns, selectedColumn]);
    }
  };

  const handleRemoveColumn = (id: string) => {
    setSelectedColumns(selectedColumns?.filter((col) => col.id !== id) || []);
  };

  const handleDimensionSelect = (value: string) => {
    setSelectedDimensions((prev) => {
      const currentSelected = prev || [];
      if (currentSelected.includes(value)) {
        return currentSelected.filter(dim => dim !== value);
      }
      return [...currentSelected, value];
    });
  };

  const handleMetricSelect = (value: string) => {
    setSelectedMetrics((prev) => {
      const currentSelected = prev || [];
      if (currentSelected.includes(value)) {
        return currentSelected.filter(metric => metric !== value);
      }
      return [...currentSelected, value];
    });
  };

  const handleFilterClick = (item: { id: string; label: string }) => {
    setSelectedItemForFilter(item);
    setFilterModalOpen(true);
  };

  const handleSettingsClick = (item: { id: string; label: string }) => {
    setSelectedItemForThreshold(item);
    setThresholdModalOpen(true);
  };

  const handleCustomEmailChange = (index: number, value: string) => {
    const newEmails = [...(customEmails || [""])];
    newEmails[index] = value;
    setCustomEmails(newEmails);
  };

  const handleAddCustomEmail = () => {
    setCustomEmails([...(customEmails || [""]), ""]);
  };

  const handleRemoveCustomEmail = (index: number) => {
    if ((customEmails || []).length > 1) {
      const newEmails = (customEmails || []).filter((_, i) => i !== index);
      setCustomEmails(newEmails);
    }
  };

  // Predefined templates with their metrics and dimensions
  const templates = {
    custom: {
      dimensions: [],
      metrics: []
    },
    template1: {
      dimensions: [
        "Render Status",
        "Server Campaign Code",
        "Server Placement Code",
        "Server Site Code",
        "Size"
      ],
      metrics: [
        "Blocks",
        "Block Rate",
        "Share of Blocks",
        "Filters",
        "Filter Rate",
        "Fraud/SIVT Blocks",
        "Fraud/SIVT Block Rate"
      ]
    },
    template2: {
      dimensions: [
        "Name",
        "Market",
        "Region",
        "Country",
        "Country Code",
        "Site"
      ],
      metrics: [
        "Authentic Ads",
        "Authentic Rate",
        "Authentic Viewable Impressions",
        "Authentic Viewable Rate",
        "Share of Authentic Ads"
      ]
    },
    template3: {
      dimensions: [
        "Bundle",
        "Developer",
        "ID",
        "Name",
        "Store",
        "Store Category"
      ],
      metrics: [
        "Bot Fraud Block Rate",
        "Bot Fraud Blocks",
        "Bot Fraud Filter Rate",
        "Bot Fraud Filters",
        "Bot Fraud Incident Rate",
        "Bot Fraud Incidents"
      ]
    },
    template4: {
      dimensions: [
        "Day",
        "Month",
        "Year",
        "DMA/MMA",
        "Delivery Type"
      ],
      metrics: [
        "Eligible Impressions",
        "Measured Impressions",
        "Measurement Rate",
        "Viewable Impressions",
        "Viewable Rate"
      ]
    }
  };

  // Handle template selection
  const handleTemplateChange = (value: string) => {
    setSelectedTemplate(value);
    if (value && value !== "none") {
      // Set predefined dimensions and metrics based on template
      setSelectedDimensions(templates[value as keyof typeof templates].dimensions);
      setSelectedMetrics(templates[value as keyof typeof templates].metrics);
    } else {
      // Clear selections when no template is selected
      setSelectedDimensions([]);
      setSelectedMetrics([]);
    }
  };

  const handleDownloadClick = () => {
    setConfirmationDialogOpen(true);
  };

  const handleConfirmation = (action: 'cloud' | 'email' | 'download') => {
    setConfirmationDialogOpen(false);
    if (action === 'cloud' || action === 'email') {
      setDeliveryModalType('download');
      setDeliveryModalOpen(true);
    } else {
      // Handle direct download without export
      console.log('Downloading without export...');
      // Add your download logic here
    }
  };

  return (
    <div className="bg-white p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold">Generate New Report</h1>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-4 gap-4">
          {/* Report Name */}
          <div className="space-y-2">
            <Label>Report Name</Label>
            <Input
              placeholder="Enter Report Name"
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
            />
          </div>

          {/* Frequency */}
          <div className="space-y-2">
            <Label>Occurrence</Label>
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger>
                <SelectValue placeholder="Select Occurrence" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last-hour">Last Full Available Hours</SelectItem>
                <SelectItem value="last-day">Last Full Available Day</SelectItem>
                <SelectItem value="last-7-days">Last 7 Days</SelectItem>
                <SelectItem value="last-week">Last Week</SelectItem>
                <SelectItem value="last-15-days">Last 15 Days</SelectItem>
                <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                <SelectItem value="month-to-date">Month to Date</SelectItem>
                <SelectItem value="last-month">Last Month</SelectItem>
                <SelectItem value="quarter-to-date">Quarter to Date</SelectItem>
                <SelectItem value="last-quarter">Last Quarter</SelectItem>
                <SelectItem value="custom-range">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          {frequency === "custom-range" ? (
            <div className="space-y-2">
              <Label>Date Range</Label>
              <MFDateRangePicker />
            </div>
          ) : (
            null
            // <div className="h-10 flex items-center justify-center border rounded-md bg-muted">
            //   <span className="text-sm text-muted-foreground">Auto-selected based on frequency</span>
            // </div>
          )}

          {/* Template */}
          <div className="space-y-2">
            <Label>Template</Label>
            <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
              <SelectTrigger>
                <SelectValue placeholder="Choose Template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Choose Template</SelectItem>
                <SelectItem value="custom">Custom Template</SelectItem>
                <SelectItem value="template1">Template 1 - Basic Fraud Metrics</SelectItem>
                <SelectItem value="template2">Template 2 - Authenticity Metrics</SelectItem>
                <SelectItem value="template3">Template 3 - Bot Fraud Metrics</SelectItem>
                <SelectItem value="template4">Template 4 - Viewability Metrics</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {selectedTemplate && selectedTemplate !== "none" && (
          <div className="grid grid-cols-2 gap-8">
            {/* Dimensions Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Dimensions</h3>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                  >
                    Select Dimensions
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="ml-2 h-4 w-4 shrink-0 opacity-50"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <div className="p-2">
                    <Input
                      type="text"
                      placeholder="Search dimensions..."
                      className="mb-2"
                      value={dimensionSearch}
                      onChange={(e) => setDimensionSearch(e.target.value)}
                    />
                    <div className="max-h-[300px] overflow-y-auto">
                      {dimensionGroups
                        .map(group => ({
                          ...group,
                          items: group.items.filter(item =>
                            item.label.toLowerCase().includes(dimensionSearch.toLowerCase())
                          )
                        }))
                        .filter(group => group.items.length > 0)
                        .map((group) => (
                          <div key={group.label} className="mb-4">
                            <div className="mb-2 px-2 text-sm font-medium text-gray-700">
                              {group.label}
                            </div>
                            {group.items.map((item) => (
                              <div
                                key={item.id}
                                className="flex cursor-pointer items-center justify-between rounded-md px-2 py-1.5 hover:bg-gray-100"
                              >
                                <div className="flex items-center gap-2">
                                  {selectedTemplate === "custom" ? (
                                    <>
                                      <Checkbox
                                        id={`dimension-${item.id}`}
                                        checked={(selectedDimensions || []).includes(item.id)}
                                        onCheckedChange={() => handleDimensionSelect(item.id)}
                                      />
                                      <Label
                                        htmlFor={`dimension-${item.id}`}
                                        className="cursor-pointer"
                                        onClick={() => handleDimensionSelect(item.id)}
                                      >
                                        {item.label}
                                      </Label>
                                    </>
                                  ) : (
                                    <Label>{item.label}</Label>
                                  )}
                                </div>
                                {selectedTemplate === "custom" && (
                                  <Filter
                                    className="h-4 w-4 cursor-pointer text-primary"
                                    onClick={() => handleFilterClick(item)}
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                        ))}
                      {dimensionGroups
                        .map(group => ({
                          ...group,
                          items: group.items.filter(item =>
                            item.label.toLowerCase().includes(dimensionSearch.toLowerCase())
                          )
                        }))
                        .filter(group => group.items.length > 0)
                        .length === 0 && (
                          <div className="p-2 text-sm text-gray-500 text-center">
                            No dimensions found
                          </div>
                        )}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Display selected dimensions */}
              {(selectedDimensions || []).length === 0 ? (
                <div className="mt-2 flex h-20 items-center justify-center rounded-md border border-dashed border-gray-300">
                  <p className="text-sm text-gray-500">Select dimensions to view them here</p>
                </div>
              ) : (
                <div className="mt-2 max-h-[200px] overflow-y-auto rounded-md border border-gray-300 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {dimensionGroups.map((group) => {
                    const groupItems = group.items.filter((item) =>
                      (selectedDimensions || []).includes(item.id)
                    );

                    if (groupItems.length === 0) return null;

                    return (
                      <div key={group.label} className="space-y-2 p-2">
                        <div className="sticky top-0 bg-white text-sm font-medium text-gray-700 border-b border-gray-300 pb-1">
                          {group.label}
                        </div>
                        {groupItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2">
                              {selectedTemplate === "custom" ? (
                                <>
                                  <Checkbox
                                    id={item.id}
                                    checked={true}
                                    onClick={() => handleDimensionSelect(item.id)}
                                  />
                                  <Label htmlFor={item.id}>{item.label}</Label>
                                </>
                              ) : (
                                <Label>{item.label}</Label>
                              )}
                            </div>
                            {selectedTemplate === "custom" && (
                              <Filter
                                className="h-4 w-4 cursor-pointer text-primary"
                                onClick={() => handleFilterClick(item)}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Metrics Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Metrics</h3>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                  >
                    Select Metrics
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="ml-2 h-4 w-4 shrink-0 opacity-50"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <div className="p-2">
                    <Input
                      type="text"
                      placeholder="Search metrics..."
                      className="mb-2"
                      value={metricSearch}
                      onChange={(e) => setMetricSearch(e.target.value)}
                    />
                    <div className="max-h-[300px] overflow-y-auto">
                      {metricGroups
                        .map(group => ({
                          ...group,
                          items: group.items.filter(item =>
                            item.label.toLowerCase().includes(metricSearch.toLowerCase())
                          )
                        }))
                        .filter(group => group.items.length > 0)
                        .map((group) => (
                          <div key={group.label} className="mb-4">
                            <div className="mb-2 px-2 text-sm font-medium text-gray-700">
                              {group.label}
                            </div>
                            {group.items.map((item) => (
                              <div
                                key={item.id}
                                className="flex cursor-pointer items-center justify-between rounded-md px-2 py-1.5 hover:bg-gray-100"
                              >
                                <div className="flex items-center gap-2">
                                  {selectedTemplate === "custom" ? (
                                    <>
                                      <Checkbox
                                        id={`metric-${item.id}`}
                                        checked={(selectedMetrics || []).includes(item.id)}
                                        onCheckedChange={() => handleMetricSelect(item.id)}
                                      />
                                      <Label
                                        htmlFor={`metric-${item.id}`}
                                        className="cursor-pointer"
                                        onClick={() => handleMetricSelect(item.id)}
                                      >
                                        {item.label}
                                      </Label>
                                    </>
                                  ) : (
                                    <Label>{item.label}</Label>
                                  )}
                                </div>
                                {selectedTemplate === "custom" && (
                                  <Settings
                                    className="h-4 w-4 cursor-pointer text-primary"
                                    onClick={() => handleSettingsClick(item)}
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                        ))}
                      {metricGroups
                        .map(group => ({
                          ...group,
                          items: group.items.filter(item =>
                            item.label.toLowerCase().includes(metricSearch.toLowerCase())
                          )
                        }))
                        .filter(group => group.items.length > 0)
                        .length === 0 && (
                          <div className="p-2 text-sm text-gray-500 text-center">
                            No metrics found
                          </div>
                        )}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Display selected metrics */}
              {(selectedMetrics || []).length === 0 ? (
                <div className="mt-2 flex h-20 items-center justify-center rounded-md border border-dashed border-gray-300">
                  <p className="text-sm text-gray-500">Select metrics to view them here</p>
                </div>
              ) : (
                <div className="mt-2 max-h-[200px] overflow-y-auto rounded-md border border-gray-300 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {metricGroups.map((group) => {
                    const groupItems = group.items.filter((item) =>
                      (selectedMetrics || []).includes(item.id)
                    );

                    if (groupItems.length === 0) return null;

                    return (
                      <div key={group.label} className="space-y-2 p-2">
                        <div className="sticky top-0 bg-white text-sm font-medium text-gray-700 border-b border-gray-300 pb-1">
                          {group.label}
                        </div>
                        {groupItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2">
                              {selectedTemplate === "custom" ? (
                                <>
                                  <Checkbox
                                    id={item.id}
                                    checked={true}
                                    onClick={() => handleMetricSelect(item.id)}
                                  />
                                  <Label htmlFor={item.id}>{item.label}</Label>
                                </>
                              ) : (
                                <Label>{item.label}</Label>
                              )}
                            </div>
                            {selectedTemplate === "custom" && (
                              <Settings
                                className="h-4 w-4 cursor-pointer text-primary"
                                onClick={() => handleSettingsClick(item)}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* File Type and Report Category */}
        <div className="grid grid-cols-3 gap-4">
          {/* File Type */}
          <div className="space-y-2">
            <Label>File Type</Label>
            <div className="flex gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="csv"
                  name="fileType"
                  value="csv"
                  checked={fileType === "csv"}
                  onChange={(e) => setFileType(e.target.value)}
                  className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="csv">CSV</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="xls"
                  name="fileType"
                  value="xls"
                  checked={fileType === "xls"}
                  onChange={(e) => setFileType(e.target.value)}
                  className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="xls">XLS</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="tsv"
                  name="fileType"
                  value="tsv"
                  checked={fileType === "tsv"}
                  onChange={(e) => setFileType(e.target.value)}
                  className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="tsv">TSV</Label>
              </div>
            </div>
          </div>

          {/* Report Category */}
          <div className="space-y-2">
            <Label>Report Category</Label>
            <div className="flex gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="summary"
                  name="reportCategory"
                  checked={reportCategory.summary}
                  onChange={(e) => setReportCategory(prev => ({ ...prev, summary: e.target.checked, transactional: !e.target.checked }))}
                  className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="summary">Summary</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="transactional"
                  name="reportCategory"
                  checked={reportCategory.transactional}
                  onChange={(e) => setReportCategory(prev => ({ ...prev, transactional: e.target.checked, summary: !e.target.checked }))}
                  className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="transactional">Transactional</Label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Button
          onClick={() => {
            setDeliveryModalType('schedule');
            setDeliveryModalOpen(true);
          }}
          className="text-white bg-primary hover:bg-primary"
        >
          Schedule
        </Button>
        <Button
          onClick={handleDownloadClick}
          className="text-white bg-primary hover:bg-primary"
        >
          Download
        </Button>
      </div>

      <ConfirmationDialog
        isOpen={confirmationDialogOpen}
        onClose={() => setConfirmationDialogOpen(false)}
        onConfirm={handleConfirmation}
      />

      <ThresholdModal
        isOpen={thresholdModalOpen}
        onClose={() => {
          setThresholdModalOpen(false);
          setSelectedItemForThreshold(null);
        }}
        selectedItem={selectedItemForThreshold}
      />

      <FilterModal
        isOpen={filterModalOpen}
        onClose={() => {
          setFilterModalOpen(false);
          setSelectedItemForFilter(null);
        }}
        selectedItem={selectedItemForFilter}
      />

      <DeliveryOptionsModal
        isOpen={deliveryModalOpen}
        onClose={() => setDeliveryModalOpen(false)}
        type={deliveryModalType}
      />
    </div>
  );
};

export default GenerateReportPage;
