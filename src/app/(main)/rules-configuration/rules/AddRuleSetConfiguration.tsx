"use client"

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { CircleMinus, CirclePlus } from "lucide-react";
import CreateScheduleForm from "../component/create-schedule";
import { Switch } from "@/components/ui/switch";

const AddRuleSetConfiguration = ({ open, setT, ruleType }) => {

  const [selectedOption, setSelectedOption] = useState("");
  const [rulePolicies, setRulePolicies] = useState([]);
  const [rulePolicy, setRulePolicy] = useState("");
  const [listOfRules, setListOfRules] = useState([]);
  const [selectedDay, setSelectedDay] = useState("");
  const [startDate, setStartDate] = useState(undefined);
  const [endDate, setEndDate] = useState(undefined);

  const getRuleSetPolicies = () => {

    const body = JSON.stringify({
      "doc_id": "rule_policy_list"
    })

    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/getRulesetPolicy`, { method: "POST", body: body }).then((response) => {
      return response.json();
    }).then((response) => {

      const result = Object.entries(response).map(([key, value]) => ({
        label: `${key} ${value}`,
        value: key.toLocaleLowerCase().replace(/\s/g, "_")
      }))

      setRulePolicies(result);
    }).catch((error) => {
      console.log(error);

    })
  }


  useEffect(() => {
    getRuleSetPolicies();
  }, [])

  type KeywordOverviewChangeType = {
    rule: string;
    status: string;
  };

  interface QueryState {
    platform: string[];
    status: string[];
    keyword: string[];
    match_type: string[];
  }


  const [Query, setQuery] = useState<QueryState>({
    platform: ["all"],
    status: ["all"],
    keyword: ["all"],
    match_type: ["all"],
  });

  const [keywordOverviewChange, setKeywordOverviewChange] = useState<
    KeywordOverviewChangeType[]
  >([
    {
      rule: "",
      status: true
    },
  ]);

  const handleDeleteKeywordRow = (index: number) => {
    const updatedKeywords = keywordOverviewChange.filter((_, i) => i !== index);
    setKeywordOverviewChange(updatedKeywords);
  };

  const handleAddKeywordRow = () => {
    const uniqueRule = `Rule${keywordOverviewChange.length + 1}`;
    setKeywordOverviewChange([
      ...keywordOverviewChange,
      {
        rule: uniqueRule,
        status: true,
        platform: "",
      },
    ]);
  };

  const PlatformFilterData =
    [
      "rule_1",
      "rule_2",
      "rule_3",
      "rule_4"
    ]


  useEffect(() => {

    const payload = JSON.stringify({
      "user": "akash",
      "workspace": "ID Scan",
      "rule_type": "Rule Set",
    });

    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/filterRules_RuleSet`, { body: payload, method: "POST" }).then((response) => {
      return response.json();
    }).then((response) => {
      let finalResponse = response.map((item) => item?.name);
      setListOfRules(finalResponse);
    }).catch((error) => {
      console.log(error);
    })
  }, [])

  const handleUpdatePlatform = (index: number, value: string) => {
    const updatedKeywords = [...keywordOverviewChange];
    updatedKeywords[index].platform = value;
    setKeywordOverviewChange(updatedKeywords);
  };


  const handleToggleChange = (index: number, checked: boolean) => {
    const updatedKeywords = [...keywordOverviewChange];
    updatedKeywords[index].status = checked;
    setKeywordOverviewChange(updatedKeywords);
  };

  const handleOptionSelect = (value) => {
    setSelectedOption(value);
  };

  const getPlatformsWithTrueStatus = () => {
    return keywordOverviewChange
      .filter((change) => change.status === true)
      .map((change) => change.platform);
  };


  const handleSubmitAddRuleSet = () => {

    const platforms = getPlatformsWithTrueStatus();

    const payload = {
      "user": "akash",
      "rule_type": "Rule Set",
      "workspace": "ID Scan",
      "data": {
        "ruleset_id": localStorage.getItem('ruleId'),
        "name": localStorage.getItem('ruleName'),
        "workspace": "ID Scan",
        "user": "akash",
        "Rule_Policy": selectedOption,
        "group": "Advanced ID Scan",
        "rules enabled": platforms
      }
    }


    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/addRules_RuleSet`, { method: "POST", body: JSON.stringify(payload) }).then((response) => {
      return response.json();
    }).then((response) => {
      console.log(response, "---hello response");

    }).catch((error) => {
      console.log(error);
    })

  }


  const handleCreateSchedule = () => {

    let payload = JSON.stringify({
      "data": {
        "user": "ajith",
        "workspace": "ID Scan",
        "rule_type": ruleType,
        "rule_id": localStorage.getItem("ruleId"),
        "ruleset_id": localStorage.getItem("ruleId"),
        "decision_id": "",
        "start_date": startDate,
        "end_date": endDate,
        "description": localStorage.getItem("ruleDescription"),
        "data_type": "Weekly",
        "value": selectedDay
      }
    })


    fetch(`${process.env.NEXT_PUBLIC_DATA_SOURCE_URL}/triggerSchedule`, { body: payload, method: "POST" }).then((response) => {
      return response.json();
    }).then((response) => {
      console.log(response, '-----response');
    }).catch((error) => {
      console.log(error);
    })

  }

  const handleDateChange = (newStartDate: string | undefined, newEndDate: string | undefined) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  const handleDayChangeOption = (value) => {
    setSelectedDay(value);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(t) => setT(t)}>
        <DialogContent className="custom-dialog-content">
          <DialogHeader>
            <DialogTitle>Create Rule Set</DialogTitle>
          </DialogHeader>
          <div className="flex w-full gap-10 border-4 p-3 h-90 overflow-hidden">
            <div className="flex-column w-6/12" style={{ overflowX: "auto", overflowY: "auto", maxHeight: "70vh" }}>
              <label htmlFor="rulePoliciesSelect" className="block text-sm font-medium text-gray-700 mb-1" style={{ fontWeight: "bold" }}>
                Rule Policy
              </label>
              <Select onValueChange={handleOptionSelect} value={selectedOption}>
                <SelectTrigger className="w-64 rounded-md border border-gray-300 bg-white mb-5">
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  {rulePolicies.map((option) => (
                    <SelectItem
                      key={option?.value}
                      value={option?.value}
                      className="truncate w-60"
                    >
                      <span className="truncate block w-full">
                        <strong>{option?.label.split(' ')[0]}</strong>
                        {`: ${option?.label.split(' ').slice(1).join(' ')}`}
                      </span>

                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {keywordOverviewChange.map((change, index) => (
                <div
                  key={index}
                  className="mb-2 flex flex-col gap-2 rounded-md border p-2"
                >
                  <div className="flex gap-2">
                    <Select
                      value={change.platform}
                      onValueChange={(value) => handleUpdatePlatform(index, value)}
                      className="w-full"
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Platform" />
                      </SelectTrigger>
                      <SelectContent>
                        {PlatformFilterData.map((platform) => (
                          <SelectItem key={platform} value={platform}>
                            {platform}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <div className="flex gap-2">
                      <Switch
                        checked={change.status}
                        onCheckedChange={(checked) => handleToggleChange(index, checked)}
                        disabled={false}
                        className="data-[state=checked]:bg-green-500 self-center"
                      />
                    </div>

                    <div className="flex justify-between items-center gap-4">
                      {index > 0 && (
                        <Button
                          size="icon"
                          className="rounded-md px-2"
                          onClick={() => handleDeleteKeywordRow(index)}
                        >
                          <CircleMinus />
                        </Button>
                      )}
                      <Button
                        size="icon"
                        className="rounded-md px-2"
                        onClick={handleAddKeywordRow}
                        title="Add another row"
                      >
                        <CirclePlus />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="">
                <Button className="mt-4" onClick={handleSubmitAddRuleSet}>
                  Add Rule Set
                </Button>
              </div>
            </div>
            <div className="w-5/12 overflow-y-auto">
              <CreateScheduleForm
                placeholder={"API"}
                buttonText={"Create Schedule"}
                onClick={handleCreateSchedule}
                onDateChange={handleDateChange}
                handleDayChangeOption={handleDayChangeOption}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddRuleSetConfiguration;
