"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { toast } from "@/hooks/use-toast";
import Endpoint from '@/common/endpoint';
import axios from 'axios';
import { useMutation } from 'react-query';
import { CircleMinus, CirclePlus } from "lucide-react";
import ResizableTable from '@/components/mf/RulesTableComponent';
import { Filter } from '@/components/mf/Filters';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AddRuleEngineConfiguration from './AddRuleConfiguration';
import EditRuleConfiguration from './EditRuleConfiguration';
import AddRuleSetConfiguration from './AddRuleSetConfiguration';
import DecisionTable from './DecisionTable';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const columns = ()=> [
  { title: "Name", key: "name" },
  { title: "Type", key: "type" },
  { title: "Created By", key: "created_by" },
  { title: "Created At", key: "created_at" },
  { title: "Updated At", key: "updated_at" }
];

const Rules = () => {
  const [RowCount, setRowCount] = useState(0);
  const [openModal, setModalOpen] = useState(false);
  const [Query, setQuery] = useState({
    user: "akash",
    workspace: "Web",
  });

  const [rulesListData,setRulesListData] = useState([]);
  const [isRuleConfigDialogOpen, setIsRuleConfigDialogOpen] = useState(false);
  const [isRuleSetgDialogOpen, setIsRuleSetDialogOpen] = useState(false);
  const [isDecisionTableDialogOpen, setIsDecisionTableDialogOpen] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [Selected, setSelected] = useState([]);

  const onActionSuccess = (d) => {
    toast({ title: d.message ?? "Success" });
  };

  const onActionError = (e) => {
    toast({
      title: e.message ?? "Something went wrong",
      variant: "destructive",
    });
  };

  const Action = useMutation({
    mutationFn: (config) => axios(config),
    onSuccess: onActionSuccess,
    onError: onActionError,
  });

  useEffect(() => {

    const payload = JSON.stringify({
      "user": "akash",
      "workspace": "ID Scan",
      "rule_type": "Simple Rule",
      "name":"Test_data"
      // "page":1,
      // "limit":5
    })

    fetch(`${process.env.NEXT_PUBLIC_BASE_URL + Endpoint.RULES.FILTERS_RULES_RULESET}`,{body:payload,method:"POST"}).then((response) => {
      return response.json();
    }).then((response) => {
      setRulesListData(response)
    }).catch((error) => {
      console.log(error);
    })
  },[])


  const TypeFilterData = {
    data: ['Rule Set', 'Simple Rule', 'Decision Table'],
    isLoading: false
  }

  const statusFilterData = {
    data: ['Has Draft', 'Has Tested', 'Published', 'In Review'],
    isLoading: false
  }

  const filter = React.useMemo(
    () => ({
      "Type": {
        filters:
          TypeFilterData?.data?.map((type) => ({
            label: type,
            checked: true,
          })) ?? [],
        is_select_all: true,
        selected_count: TypeFilterData?.data?.length ?? 0,
        loading: TypeFilterData.isLoading,
      },
      Status: {
        filters:
          statusFilterData?.data?.map((v) => ({
            label: v,
            checked: true,
          })) ?? [],
        is_select_all: true,
        selected_count: statusFilterData.data?.length ?? 0,
        loading: statusFilterData.isLoading,
      },
    }),
    [
    ],
  );


  const handleFilterChange = useCallback(() => {
  }, [
    filter,
  ]);

  const handleModalChange = () => {
    setModalOpen(true);
  }

  const RulesDialog = ({ open, setT }) => {
    const [ruleName, setRuleName] = useState("");
    const [ruleDescription, setRuleDescription] = useState("");
    const [ruleType,setRuleType] = useState("");

    const handleRuleTypeChange = (e) => {
      setRuleType(e);
    }

    const handleNext = () => {
      if (ruleType === "Simple Rule" && ruleName) {
        setIsRuleConfigDialogOpen(true);
      }else if(ruleType === "Rule Set" && ruleName){
        setIsRuleSetDialogOpen(true);
      } else if(ruleType === "Decision Table" && ruleName){
        setIsDecisionTableDialogOpen(true);
      }

      let randomRuleID = generateRandomId();

      localStorage.setItem("ruleName",ruleName);
      localStorage.setItem("ruleDescription",ruleDescription);
      localStorage.setItem("ruleId",randomRuleID);

    }

    function generateRandomId() {
      const timestamp = Date.now();
    
      return `${timestamp}_${ruleName}_${ruleType}`;
    }
  

    return (
      <Dialog open={open} onOpenChange={(t) => setT(t)}>
        <DialogContent className="w-[90vw] max-w-[70vw] p-6">
          <DialogHeader>
            <DialogTitle>Create Rule</DialogTitle>
          </DialogHeader>
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col w-full sm:w-[48%] lg:w-[30%]">
              <label htmlFor="rule-name" className="mb-1 font-medium text-gray-700">
                Rule Name
              </label>
              <Input
                id="rule-name"
                type="text"
                value={ruleName}
                placeholder="Enter name"
                onChange={(e) => setRuleName(e.target.value)}
                className="rounded-md border border-gray-300 bg-gray-100 p-2"
              />
            </div>
            <div className="flex flex-col w-full sm:w-[48%] lg:w-[30%]">
              <label htmlFor="rule-description" className="mb-1 font-medium text-gray-700">
                Rule Description (Optional)
              </label>
              <Input
                id="rule-description"
                type="textarea"
                value={ruleDescription}
                onChange={(e) => setRuleDescription(e.target.value)}
                placeholder="Enter description"
                className="rounded-md border border-gray-300 bg-gray-100 p-2"
              />
            </div>
            <div className="flex flex-col w-full sm:w-[48%] lg:w-[30%]">
              <label htmlFor="rule-type" className="mb-1 font-medium text-gray-700">
                Select Rule Type
              </label>
              <Select onValueChange={handleRuleTypeChange} value={ruleType}>
                <SelectTrigger id="rule-type" className="rounded-md border border-gray-300 bg-gray-100 p-2">
                  <SelectValue placeholder="Rule Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Decision Table">Decision Table</SelectItem>
                  <SelectItem value="Simple Rule">Simple Rule</SelectItem>
                  <SelectItem value="Rule Set">Rule Set</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className='flex flex-row justify-end'>
            <Button className='add-condition-button' onClick={handleNext}>Next</Button>
          </div>
        </DialogContent>
        {/* <DialogFooter>
          <Button
            // onClick={callTestAPI} 
            className="px-4 py-2 bg-blue-500 text-white rounded-md">
            Test Rule
          </Button>
          <Button
            // onClick={handleSubmitRuleConfig}
            className="px-4 py-2 bg-blue-500 text-white rounded-md">
            Save Rule Configuration
          </Button>
        </DialogFooter> */}
      </Dialog>
    );
  };


  const EditDialog = ({ open, setT }) => {
    const [fields, setFields] = useState([
      { username: "", workspaceRole: "", entityRole: "" },
    ]);
    const workSpaceRoles = [
      {
        label: "Owner",
        value: "owner"
      },
      {
        label: "Restricted",
        value: "restricted"
      }
    ]

    const entityRoles = [
      {
        label: "Admin",
        value: "admin"
      },
      {
        label: "Aprover",
        value: "aprover"
      },
      {
        label: "Editor",
        value: "editor"
      }
    ]

    const addField = () => {

      setFields([
        ...fields,
        { username: "", workspaceRole: "", entityRole: "" },
      ]);
    };

    const removeField = (index) => {
      setFields(fields.filter((_, i) => i !== index));
    };

    const handleSave = () => {
      setT(false);
    };

    return (
      <Dialog open={open} onOpenChange={(t) => setT(t)}>
        <DialogContent className="w-[70vw] max-w-[90vw]">
          <DialogHeader>
            <DialogTitle>Edit Access</DialogTitle>
          </DialogHeader>
          <div>
            {fields.map((field, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="Username"
                  value={field.username}
                  onChange={(e) =>
                    setFields(
                      fields.map((f, i) =>
                        i === index ? { ...f, username: e.target.value } : f
                      )
                    )
                  }
                  className='mt-2'
                />
                <select
                  className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm mt-2"
                  value={field.workspaceRole}
                  onChange={(e) =>
                    setFields(
                      fields.map((f, i) =>
                        i === index ? { ...f, workspaceRole: e.target.value } : f
                      )
                    )
                  }
                >
                  <option value="">Select Workspace role</option>
                  {workSpaceRoles.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
                <select
                  className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm mt-2"
                  value={field.entityRole}
                  onChange={(e) =>
                    setFields(
                      fields.map((f, i) =>
                        i === index ? { ...f, entityRole: e.target.value } : f
                      )
                    )
                  }
                >
                  <option value="">Select Entity Role</option>
                  {entityRoles.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
                <Button
                  size="icon"
                  onClick={() => removeField(index)}
                  className="rounded-md px-2 mt-2"
                  title="Remove this row"
                >
                  <CircleMinus />
                </Button>
              </div>
            ))}
            <Button
              size="icon"
              onClick={addField}
              className="rounded-md px-2 mt-4"
              title="Add another row"
            >
              <CirclePlus />
            </Button>
          </div>
          <div className="flex justify-end mt-4 gap-2">
            <Button
              onClick={() => setT(false)}
              className="rounded-md"
              title="Cancel"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="rounded-md"
              title="Save"
            >
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const handleEditAccess = () => {
    setOpenEditModal(true);
  }

  const handleDeleteAction = () => {
    const b = {
      delete: "something"
    }

    const c= {
      url: process.env.NEXT_PUBLIC_UAM_DOMAIN + Endpoint.UAM.KEYWORD_UPDATE,
      method: "POST",
      data: b,
    };

    Action.mutate(c);
  }

  return (
    <div className="relative bg-card rule-engine-font">
      <div className="container sticky top-0 z-10 flex w-full items-center justify-start gap-2 rounded-md bg-background px-2 py-1 flex justify-between">
        <div className='flex justify-between'>
          {
            TypeFilterData?.data &&
              TypeFilterData.data.length > 0 &&
              statusFilterData?.data &&
              statusFilterData?.data?.length > 0
              ? (
                <Filter filter={filter} onChange={handleFilterChange} />
              ) : null}
        </div>
        <Button onClick={handleModalChange}>Create Rule</Button>
      </div>
      <ResizableTable
        columns={columns({ handleRuleSubmit: () => { } })}
        data={rulesListData ?? []}
        // isLoading={rulesListData.isFetching}
        headerColor="#DCDCDC"
        onSelect={(items) => setSelected(items)}
        itemCount={setRowCount}
        // onRefresh={() => RulesListData.refetch()}
        onEdit={handleEditAccess}
        onDelete={handleDeleteAction}
        isEdit={true}
        isDelete={true}
        isDownload={true}
        isPaginated={false}
        isSearchable
        isSelectable
      />

      {/* <EditRuleConfiguration /> */}

      <RulesDialog
        open={openModal}
        setT={setModalOpen}
      />
      <EditDialog
        open={openEditModal}
        setT={setOpenEditModal}
      />
      <AddRuleEngineConfiguration
        open={isRuleConfigDialogOpen}
        setT={setIsRuleConfigDialogOpen}
        ruleType={"Simple Rule"}
      />
      <DecisionTable
        open={isDecisionTableDialogOpen}
        setT={setIsDecisionTableDialogOpen}
        ruleType={"Decision Table"}
        // randomId={randomId}
      />
      <AddRuleSetConfiguration
        open={isRuleSetgDialogOpen}
        setT={setIsRuleSetDialogOpen}
        ruleType={"Rule Set"}
        // randomId={randomId}
      />
    </div>
  )
}

export default Rules;

