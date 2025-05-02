"use client";

import ResizableTable, { Column } from "@/components/mf/ReportingToolTable";
import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

const queryClient = new QueryClient();

interface AdGrpRowData {
  id: number;
  Report_Name: string;
  Report_Type: string;
  Created_By: string;
  Created_Date: string;
  Updated_By: string;
  Updated_Date: string;
  Report_Status: string;
  Email_Status: string;
  ml_name: string;
}

interface EmailListModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: "create" | "view";
  initialData?: {
    id: number;
    ml_name: string;
    emails: string[];
  };
  onSave?: (data: { ml_name: string; emails: string[] }) => void;
}

const EmailListModal = ({
  isOpen,
  onClose,
  mode = "create",
  initialData,
  onSave,
}: EmailListModalProps) => {
  const [mailingListName, setMailingListName] = useState(
    initialData?.ml_name || "",
  );
  const [emails, setEmails] = useState<string[]>(initialData?.emails || [""]);
  const isViewMode = mode === "view";

  React.useEffect(() => {
    if (initialData) {
      setMailingListName(initialData.ml_name);
      setEmails(initialData.emails);
    } else {
      setMailingListName("");
      setEmails([""]);
    }
  }, [initialData]);

  const handleAddEmailInput = () => {
    if (!isViewMode) {
      setEmails([...emails, ""]);
    }
  };

  const handleEmailChange = (index: number, value: string) => {
    if (!isViewMode) {
      const newEmails = [...emails];
      newEmails[index] = value;
      setEmails(newEmails);
    }
  };

  const handleRemoveEmail = (index: number) => {
    if (!isViewMode && emails.length > 1) {
      const newEmails = emails.filter((_, i) => i !== index);
      setEmails(newEmails);
    }
  };

  const handleSave = () => {
    if (isViewMode) {
      onClose();
      return;
    }

    const validEmails = emails.filter((email) => email.trim() !== "");
    if (onSave) {
      onSave({
        ml_name: mailingListName,
        emails: validEmails,
      });
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[600px] rounded-lg bg-white p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {isViewMode ? "View Mailing List" : "Create Mailing List"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Mailing List Name */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="mb-2 block">Mailing List Name</Label>
              <Input
                value={mailingListName}
                onChange={(e) => setMailingListName(e.target.value)}
                placeholder="Enter Mailing List Name"
                disabled={isViewMode}
              />
            </div>
            {!isViewMode && (
              <div>
                <Label className="mb-2 block">Bulk upload</Label>
                <div className="rounded-md border border-dashed border-gray-300 p-2">
                  <Button variant="outline" className="w-full text-gray-500">
                    Choose File
                    <span className="ml-2 text-xs">No file chosen</span>
                  </Button>
                </div>
              </div>
            )}
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
                  disabled={isViewMode}
                />
                {!isViewMode && (
                  <>
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
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="rounded-full bg-white px-8 hover:bg-gray-50"
          >
            {isViewMode ? "Close" : "Cancel"}
          </Button>
          {!isViewMode && (
            <Button
              onClick={handleSave}
              className="rounded-full bg-primary px-8 text-white hover:bg-secondary"
            >
              Save
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const mailingList: React.FC = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [RowCount, setRowCount] = useState(0);
  const [emailListModalOpen, setEmailListModalOpen] = useState(false);
  const [selectedMailingList, setSelectedMailingList] = useState<
    | {
        id: number;
        ml_name: string;
        emails: string[];
      }
    | undefined
  >(undefined);
  const [modalMode, setModalMode] = useState<"create" | "view">("create");
  const [tableData, setTableData] = useState([
    {
      id: 1,
      ml_name: "mailing list 1",
      Report_Type: "Content",
      Created_By: "user1@mfilterit.com",
      Created_Date: "2025-02-15T03:22:12",
      Updated_By: "user1@mfilterit.com",
      Updated_Date: "2025-02-15T03:22:12",
      Report_Status: "True",
      Email_Status: "False",
    },
    {
      id: 2,
      ml_name: "mailing list 2",
      Report_Type: "Analytics",
      Created_By: "user2@mfilterit.com",
      Created_Date: "2025-02-15T03:22:12",
      Updated_By: "user2@mfilterit.com",
      Updated_Date: "2025-02-15T03:22:12",
      Report_Status: "False",
      Email_Status: "True",
    },
    {
      id: 3,
      ml_name: "mailing list 3",
      Report_Type: "Summary",
      Created_By: "user3@mfilterit.com",
      Created_Date: "2025-02-15T03:22:12",
      Updated_By: "user3@mfilterit.com",
      Updated_Date: "2025-02-15T03:22:12",
      Report_Status: "True",
      Email_Status: "False",
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

  const handleView = (data: Record<string, string | number>) => {
    setSelectedMailingList({
      id: Number(data.id),
      ml_name: String(data.ml_name),
      emails: ["user1@example.com", "user2@example.com"], // This would normally come from your backend
    });
    setModalMode("view");
    setEmailListModalOpen(true);
  };

  const handleCreateMailingList = (data: {
    ml_name: string;
    emails: string[];
  }) => {
    const newId = tableData.length + 1;
    const currentDate = new Date().toISOString();
    const newEntry = {
      id: newId,
      ml_name: data.ml_name,
      Report_Type: "Content",
      Created_By: "current.user@mfilterit.com",
      Created_Date: currentDate,
      Updated_By: "current.user@mfilterit.com",
      Updated_Date: currentDate,
      Report_Status: "True",
      Email_Status: "False",
    };

    setTableData((prev) => [...prev, newEntry]);
    toast({
      title: "Success",
      description: "Mailing list created successfully!",
      duration: 3000,
      variant: "constructive",
    });
  };

  const adgrpcolumns: Column<AdGrpRowData>[] = [
    { title: "Mailing List Name", key: "ml_name" },
    { title: "Created By", key: "Created_By" },
    { title: "Created Date", key: "Created_Date" },
    { title: "Updated By", key: "Updated_By" },
    { title: "Updated Date", key: "Updated_Date" },
    {
      title: "Status",
      key: "status",
      render: (data: AdGrpRowData) => (
        <div className="flex justify-center">
          <Switch
            className="h-4 w-8 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input"
            checked={data.Report_Status === "True"}
            onCheckedChange={(checked) =>
              handleStatusChange(data.id, "Report_Status", checked)
            }
          />
        </div>
      ),
    },
  ];

  return (
    <QueryClientProvider client={queryClient}>
      <div className="relative bg-card">
        <div className="p-4">
          <ResizableTable
            columns={adgrpcolumns ?? []}
            data={tableData}
            isLoading={false}
            headerColor="#DCDCDC"
            itemCount={setRowCount}
            isSearchable
            isEdit={true}
            isView={true}
            isClone={true}
            isSelectable={true}
            onGenerateReport={() => {
              setModalMode("create");
              setSelectedMailingList(undefined);
              setEmailListModalOpen(true);
            }}
            buttonTextName="Create Mailing List"
            onView={handleView}
          />
          <EmailListModal
            isOpen={emailListModalOpen}
            onClose={() => setEmailListModalOpen(false)}
            mode={modalMode}
            initialData={selectedMailingList}
            onSave={handleCreateMailingList}
          />
        </div>
      </div>
      <Toaster />
    </QueryClientProvider>
  );
};

export default mailingList;
