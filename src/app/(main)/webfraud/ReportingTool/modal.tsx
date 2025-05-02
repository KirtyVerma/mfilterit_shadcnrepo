"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, Settings, X } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ThresholdModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ThresholdModal = ({ isOpen, onClose }: ThresholdModalProps) => {
  const [operator, setOperator] = useState<string>("");
  const [thresholdValue, setThresholdValue] = useState<string>("");

  if (!isOpen) return null;
  
  const handleSave = () => {
    // Here you can handle saving the threshold values
    console.log({ operator, thresholdValue });
    onClose();
  };
  
  return (
    <div 
      className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center"
      onClick={onClose}
    >
      <div 
        className="relative bg-white rounded-lg w-[500px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Add Threshold</h2>
            <X 
              className="w-4 h-4 cursor-pointer hover:text-gray-700" 
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
          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={onClose}
              className="bg-white hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-primary text-white hover:bg-primary/90"
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const GenerateReportModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [storeInCloud, setStoreInCloud] = useState(false);
  const [reportType, setReportType] = useState<string>("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [fileType, setFileType] = useState<string>("");
  const [thresholdModalOpen, setThresholdModalOpen] = useState(false);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose} className="z-50">
        <DialogContent className="max-w-[80vw] w-full p-6 rounded-lg bg-white z-50">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Generate New Report</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-6 gap-4">
              {/* Report Type Checkbox */}
              <div className="space-y-2 col-span-2">
                <Label>Report Category</Label>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <Checkbox id="summary" />
                    <Label htmlFor="summary">Summary Report</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="transactional" />
                    <Label htmlFor="transactional">Transactional Report</Label>
                  </div>
                </div>
              </div>

              {/* Report Name */}
              <div className="space-y-2">
                <Label>Report Name</Label>
                <Input placeholder="Config1" />
              </div>

              {/* Report Type Dropdown */}
              <div className="space-y-2">
                <Label>Report Type</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Report Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="downloadable">Downloadable</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Conditional Rendering based on Report Type */}
              {reportType === "scheduled" ? (
                <>
                  {/* Frequency */}
                  <div className="space-y-2">
                    <Label>Frequency</Label>
                    <Select defaultValue="month">
                      <SelectTrigger>
                        <SelectValue placeholder="Month to Date" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="month">Month to Date</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Time Zone */}
                  <div className="space-y-2">
                    <Label>Time Zone</Label>
                    <Select defaultValue="gmt-11">
                      <SelectTrigger>
                        <SelectValue placeholder="(GMT -11:00) Midway Island, Samoa" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gmt-11">(GMT -11:00) Midway Island, Samoa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              ) : reportType === "downloadable" ? (
                <>
                  {/* Start Date */}
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !startDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={setStartDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* End Date */}
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !endDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </>
              ) : null}
            </div>

            <div className="grid grid-cols-2 gap-8">
              {/* Dimensions Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Dimensions</h3>
                  {/* <Filter className="w-4 h-4 text-gray-500 cursor-pointer" /> */}
                </div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Dimensions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="geo-wise">Geo wise</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="pl-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Checkbox id="country" />
                      <Label htmlFor="country">Country</Label>
                    </div>
                    <Filter className="w-4 h-4 text-primary cursor-pointer" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Checkbox id="state" />
                      <Label htmlFor="state">State</Label>
                    </div>
                    <Filter className="w-4 h-4 text-primary cursor-pointer" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Checkbox id="hour" />
                      <Label htmlFor="hour">Hour</Label>
                    </div>
                    <Filter className="w-4 h-4 text-primary cursor-pointer" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Checkbox id="month" />
                      <Label htmlFor="month">Month</Label>
                    </div>
                    <Filter className="w-4 h-4 text-primary cursor-pointer" />
                  </div>
                </div>
              </div>

              {/* Metrics Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Metrics</h3>
                </div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Metrics" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="geo-wise">Geo wise</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="pl-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Checkbox id="metrics-country" />
                      <Label htmlFor="metrics-country">Country</Label>
                    </div>
                    <Settings 
                      className="w-4 h-4 text-primary cursor-pointer" 
                      onClick={() => setThresholdModalOpen(true)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Checkbox id="metrics-state" />
                      <Label htmlFor="metrics-state">State</Label>
                    </div>
                    <Settings 
                      className="w-4 h-4 text-primary cursor-pointer"
                      onClick={() => setThresholdModalOpen(true)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Checkbox id="metrics-hour" />
                      <Label htmlFor="metrics-hour">Hour</Label>
                    </div>
                    <Settings 
                      className="w-4 h-4 text-primary cursor-pointer"
                      onClick={() => setThresholdModalOpen(true)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Checkbox id="metrics-month" />
                      <Label htmlFor="metrics-month">Month</Label>
                    </div>
                    <Settings 
                      className="w-4 h-4 text-primary cursor-pointer"
                      onClick={() => setThresholdModalOpen(true)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Settings Section */}
            <div className="space-y-4">
              <h3 className="font-semibold">Additional Settings</h3>
              <div className="grid grid-cols-3 gap-8">
                {/* File Formatting */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>File Formatting</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select file formatter" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="excel">Excel</SelectItem>
                        <SelectItem value="pdf">PDF</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>File Type</Label>
                    <Select value={fileType} onValueChange={setFileType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select file type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="excel">EXCEL</SelectItem>
                        <SelectItem value="zip">ZIP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {fileType && (
                    <div className="space-y-2">
                      <Label>Upload {fileType.toUpperCase()} File</Label>
                      <Input 
                        type="file" 
                        accept={
                          fileType === 'csv' 
                            ? '.csv' 
                            : fileType === 'excel' 
                            ? '.xlsx,.xls' 
                            : '.zip'
                        }
                        className="cursor-pointer"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Re-order Columns</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="country">Country</SelectItem>
                        <SelectItem value="state">State</SelectItem>
                        <SelectItem value="hour">Hour</SelectItem>
                        <SelectItem value="month">Month</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Email Settings */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Checkbox id="send-email" />
                    <Label htmlFor="send-email">Send Report Via Mail</Label>
                  </div>
                  <div className="space-y-2">
                    <Label>Email List</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Email List" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="list1">Email List 1</SelectItem>
                        <SelectItem value="list2">Email List 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Cloud Storage */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Checkbox 
                        id="store-cloud" 
                        checked={storeInCloud}
                        onCheckedChange={(checked) => setStoreInCloud(checked as boolean)}
                      />
                      <Label htmlFor="store-cloud">Store Report in Cloud</Label>
                    </div>
                    <div className={`space-y-4 ${!storeInCloud ? 'opacity-50 pointer-events-none' : ''}`}>
                      <div className="flex gap-2">
                        <button className="flex-1 px-4 py-2 bg-white border rounded hover:bg-gray-50">AWS</button>
                        <button className="flex-1 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90">GCP</button>
                        <button className="flex-1 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90">Azure</button>
                      </div>
                      <div className="space-y-2">
                        <Label>Secret Key</Label>
                        <Input placeholder="Enter Secret Key" />
                      </div>
                      <div className="space-y-2">
                        <Label>Access Key</Label>
                        <Input placeholder="Enter Access Key" />
                      </div>
                      <div className="space-y-2">
                        <Label>Bucket Name</Label>
                        <Input placeholder="Enter Bucket Name" />
                      </div>
                      <p className="text-sm text-gray-500">These details will be used to store report in cloud platforms.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ThresholdModal 
        isOpen={thresholdModalOpen} 
        onClose={() => setThresholdModalOpen(false)} 
      />
    </>
  );
};

export default GenerateReportModal;
