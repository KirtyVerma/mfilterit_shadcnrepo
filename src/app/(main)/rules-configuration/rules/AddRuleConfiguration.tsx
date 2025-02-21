import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog";
import './style.css';
import CreateScheduleForm from "../component/create-schedule";
import ResultForm from "../component/result-form";
import AddAction from '../component/add-actionform';
import { Button } from "@/components/ui/button";

const ConditionGroup = ({ data, updateData, path, ruleType }) => {
    const [attributesList, setAttributesList] = useState({});
    const [operatorsListById, setOperatorsListById] = useState({})
    const [showAddInputAttributeModal, setShowAddInputAttributeModal] = useState(false);

    const addCondition = () => {
        const newCondition = { id: Date.now(), type: "condition", property: "", operator: "", value: "", outsideOperator: "AND", source_type: "" };
        updateData([...data, newCondition], path);
    };

    const addGroup = () => {
        const newGroup = { id: Date.now(), type: "group", rules: [] };
        updateData([...data, newGroup], path);
    };

    const updateItem = (index, updatedItem, type, value) => {

        if (type === "property") {
            getOperatorsList(index, value)
        }

        const updatedData = [...data];

        updatedData[index] = updatedItem;

        updateData(updatedData, path);
    };

    const removeItem = (index) => {
        const updatedData = data.filter((_, i) => i !== index);
        updateData(updatedData, path);
    };

    useEffect(() => {
        const payload = JSON.stringify({
            user: "akash",
            workspace: "ID Scan",
            rule_id: "CXSYSSVVSYTSJS",
            rule_type: ruleType
        });
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/getAttribute`, {
            method: "POST",
            body: payload,
        })
            .then((response) => {
                return response.json();
            })
            .then((response) => {

                const transformedResponse = {
                    global_attributes: response?.global_attributes?.map((attr) => ({
                        value: attr.attribute,
                        label: attr.attribute,
                    })),
                    input_attributes: response?.input_attributes,
                    db_attributes: response?.db_attributes,
                };

                setAttributesList(transformedResponse);
            })
            .catch((error) => {
                const attributes = [
                    {
                        label: "Region",
                        value: "region",
                    },
                    {
                        label: "Budget",
                        value: "budget",
                    },
                    {
                        label: "Ad Group Name",
                        value: "ad_group_name",
                    },
                    {
                        label: "Campaign Name",
                        value: "campaign_name",
                    },
                    {
                        label: "ROAS",
                        value: "roas",
                    },
                    {
                        label: "Impression",
                        value: "impression",
                    },
                ];

                setAttributesList(attributes);
            });
    }, []);


    const getOperatorsList = (id, value) => {
        let payload = JSON.stringify({
            attribute: value,
        });

        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/getOperator`, {
            method: "POST",
            body: payload,
        })
            .then((response) => response.json())
            .then((response) => {
                const operators = response?.map((item) => ({
                    label: item,
                    value: item,
                }));

                setOperatorsListById((prev) => ({
                    ...prev,
                    [id]: operators,
                }));
            })
            .catch((error) => {
                const defaultOperators = [
                    { label: "AND", value: "and" },
                    { label: "OR", value: "or" },
                ];

                setOperatorsListById((prev) => ({
                    ...prev,
                    [id]: defaultOperators,
                }));
            });
    };

    const handleShowAddInputAttribute = () => {
        setShowAddInputAttributeModal(true);
    };

    const toggleOperator = (newOperator, item) => {
        const index = data.findIndex((existingItem) => existingItem.id === item?.id);

        if (index !== -1) {
            const updatedItem = { ...item, outsideOperator: newOperator, source_type: "" };
            updateItem(index, updatedItem, "operator", newOperator);
        }
    };

    return (
        <div style={{ borderLeft: "1px solid #ccc", paddingLeft: "10px" }}
        >
            {/* <button
            onClick={handleShowAddInputAttribute}
            className="bg-blue-500 text-white p-2 rounded mb-4"
            style={{ width: "20%" }}
          >
            Add Input Attributes
          </button> */}
            <div style={{ display: "flex" }} className="mb-3 bt-1">
                <p
                    onClick={addCondition}
                    className="flex cursor-pointer items-center space-x-2 mr-5"
                    style={{ display: "inline-block" }}
                >
                    <div style={{ display: "flex" }}>
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-lg text-white mr-1">
                            +
                        </span>
                        <span className="font-medium text-blue-500">
                            Add Condition
                        </span>
                    </div>
                </p>

                <p
                    onClick={addGroup}
                    style={{ display: "inline-block" }}
                    className="flex cursor-pointer items-center space-x-2"
                >
                    <div style={{ display: "flex" }}>
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-lg text-white mr-1">
                            +
                        </span>
                        <span className="font-medium text-blue-500">
                            Add Group
                        </span>
                    </div>
                </p>

            </div>
            <div
                className="relative inline-flex flex-col space-y-4 p-4 border border-gray-300 rounded-lg"
                style={{ width: 'fit-content', overflowX: 'auto', minWidth: '100%' }}
            >
                {data?.map((item, index) => {
                    const groupLevel = path.length;
                    const indentationStyle = { paddingLeft: `${groupLevel * 20}px` };

                    if (item.type === "condition") {
                        return (
                            <div
                                key={item.id}
                                className="flex flex-col items-center space-y-4 p-4 border border-gray-300 rounded-lg"
                                style={indentationStyle}
                            >
                                <div className="flex w-full space-x-4">
                                    <div className="text-left font-bold text-orange-500">
                                        {item?.outsideOperator}
                                    </div>

                                    <select
                                        value={item.property}
                                        onChange={(e) => {
                                            const selectedOption = e.target.options[e.target.selectedIndex];
                                            const selectedOptgroup = selectedOption.closest("optgroup").label;
                                            updateItem(index, { ...item, property: e.target.value, source_type: selectedOptgroup }, "property", e.target.value);
                                        }}
                                        className="flex-1 min-w-[150px] rounded-lg border border-gray-300 bg-white p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <optgroup label="Global Attributes">
                                            {attributesList?.global_attributes?.map((attr) => (
                                                <option key={attr.value} value={attr.value}>
                                                    {attr.label}
                                                </option>
                                            ))}
                                        </optgroup>
                                        {attributesList?.input_attributes?.length > 0 && (
                                            <optgroup label="Input Attributes">
                                                {attributesList?.input_attributes?.map((attr) => (
                                                    <option key={attr.value} value={attr.value}>
                                                        {attr.label}
                                                    </option>
                                                ))}
                                            </optgroup>
                                        )}
                                        {attributesList?.db_attributes?.length > 0 && (
                                            <optgroup label="DB Attributes">
                                                {attributesList?.db_attributes?.map((attr) => (
                                                    <option key={attr.value} value={attr.value}>
                                                        {attr.label}
                                                    </option>
                                                ))}
                                            </optgroup>
                                        )}
                                    </select>

                                    <select
                                        value={item.operator}
                                        onChange={(e) =>
                                            updateItem(index, { ...item, operator: e.target.value }, "operator", e.target.value)
                                        }
                                        className="flex-1 min-w-[150px] rounded-lg border border-gray-300 bg-white p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {operatorsListById[index]?.map((operator) => (
                                            <option key={operator.value} value={operator.value}>
                                                {operator.label}
                                            </option>
                                        ))}
                                    </select>

                                    <input
                                        type="text"
                                        value={item.value}
                                        onChange={(e) =>
                                            updateItem(index, { ...item, value: e.target.value }, "value", e.target.value)
                                        }
                                        className="flex-1 min-w-[200px] rounded-lg border border-gray-300 bg-white p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize overflow-hidden"
                                        placeholder="Enter value"
                                    />

                                    <p
                                        onClick={() => removeItem(index)}
                                        className="flex cursor-pointer items-center space-x-2 ml-3"
                                    >
                                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-lg text-white">
                                            -
                                        </span>
                                        <span className="font-medium text-blue-500">Remove</span>
                                    </p>
                                </div>

                                <div className="ml-3 inline-flex items-center gap-4 mt-3">
                                    <label className="text-gray-600">Set Operator:</label>
                                    <label className="inline-flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name={`operator-${item?.id}`}
                                            value="AND"
                                            checked={item?.outsideOperator === "AND"}
                                            onChange={() => toggleOperator("AND", item)}
                                            className="form-radio h-4 w-4 text-green-500"
                                        />
                                        <span>AND</span>
                                    </label>
                                    <label className="inline-flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name={`operator-${item?.id}`}
                                            value="OR"
                                            checked={item?.outsideOperator === "OR"}
                                            onChange={() => toggleOperator("OR", item)}
                                            className="form-radio h-4 w-4 text-green-500"
                                        />
                                        <span>OR</span>
                                    </label>
                                </div>
                            </div>
                        );
                    }

                    if (item.type === "group") {
                        return (
                            <div
                                key={item.id}
                                className="mb-3 border-2 border-gray-300 p-4 rounded-lg space-y-4"
                                style={indentationStyle}
                            >
                                <ConditionGroup
                                    data={item?.rules}
                                    updateData={updateData}
                                    path={[...path, index, "rules"]}
                                    ruleType={ruleType}
                                />
                                <p
                                    onClick={() => removeItem(index)}
                                    className="flex cursor-pointer items-center space-x-2"
                                >
                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-lg text-white">
                                        -
                                    </span>
                                    <span className="font-medium text-red-500">
                                        Remove Group
                                    </span>
                                </p>
                            </div>
                        );
                    }
                    return null;
                })}
            </div>

        </div>
    );
};

const ConditionBuilder = ({ open, setT, ruleType }) => {
    const [data, setData] = useState([]);
    const [resultsThen, setResultsThen] = useState([]);
    const [resultsElse, setResultsElse] = useState([]);
    const [actionsThen, setActionsThen] = useState([]);
    const [actionsElse, setActionsElse] = useState([]);
    const [selectedDay, setSelectedDay] = useState("");
    const [startDate, setStartDate] = useState(undefined);
    const [endDate, setEndDate] = useState(undefined);
    const [rows, setRows] = useState([{ name: "", type: "", value: "" }]);
    const [showAddInputAttributeModal, setShowAddInputAttributeModal] = useState(false);

    const updateData = (updatedValue, path) => {

        if (path.length === 0) {
            setData(updatedValue);
        } else {
            const newData = JSON.parse(JSON.stringify(data));
            let ref = newData;
            for (let i = 0; i < path.length - 1; i++) {
                ref = ref[path[i]];
            }
            ref[path[path.length - 1]] = updatedValue;
            setData(newData);
        }
    };

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

    const handleResultsChangeThen = (updatedResults) => {
        setResultsThen(updatedResults);
    };

    const handleActionsChangeThen = (updatedResults) => {
        setActionsThen(updatedResults);
    };

    const handleResultsChangeElse = (updatedResults) => {
        setResultsElse(updatedResults);
    };

    const handleActionsChangeElse = (updatedResults) => {
        setActionsElse(updatedResults);
    };

    const handleCreateRuleConfiguration = () => {
        
        const transformData = (data: any[], value: boolean) => {
            const result: Record<string, string | boolean> = { value };
            data.forEach((item) => {
                result[item.key] = item.value;
            });
            return result;
        };

        const finalResult = [
            transformData(resultsElse, true),
            transformData(resultsThen, false),
        ];

        const cleanedData = cleanArray(data);

        const payload = {
            "user": "akash",
            "rule_type": ruleType,
            "workspace": "ID Scan",
            "data": {
                "rule_id": "CXSYSSVVSYTSJS",
                "name": localStorage.getItem("ruleName"),
                "description": localStorage.getItem("ruleDescription"),
                "conditions": cleanedData,
                "result": {
                    "details": finalResult
                },
                "actions": [...actionsThen, ...actionsElse]
            }
        }

        console.log(payload, "----payload is coming ah..?");


        callRuleCreationAPI(payload);

    }


    const callRuleCreationAPI = (payload) => {

        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/addRules_RuleSet`, { body: JSON.stringify(payload), method: "POST" }).then((response) => {
            return response.json();
        }).then((response) => {
            console.log(response, "----response");

        }).catch((error) => {
            console.log(error);

        })
    }


    function cleanArray(data) {
        return data.map((item) => {
            const { outsideOperator, id, type, ...rest } = item;

            console.log(item);


            if (item?.rules) {
                rest.rules = cleanArray(item?.rules);
            }

            return rest;
        });
    }


    const handleDateChange = (newStartDate: string | undefined, newEndDate: string | undefined) => {
        setStartDate(newStartDate);
        setEndDate(newEndDate);
    };

    const handleDayChangeOption = (value) => {
        setSelectedDay(value);
    };

    const handleSaveManageAttributes = () => {

        let body = JSON.stringify({
          "attributeName": rows?.at(0)["name"],
          "datatype": rows?.at(0)["type"],
          "operatorsList": [
            rows?.at(0)["value"]
          ]
        })
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/generateAttribute`, { method: "POST", body: body }).then((response) => {
          return response.json();
        }).then((response) => {
    
        }).catch((error) => {
          console.log(error);
    
        })
      }


    return (
        <div>
            <Dialog open={open} onOpenChange={(t) => setT(t)}>

                <DialogContent className="custom-dialog-content">
                    <DialogHeader>
                        <DialogTitle>Create Rule</DialogTitle>
                    </DialogHeader>

                    <div className="flex w-full gap-10 border-4 p-3 h-90 overflow-hidden">
                        <div className="flex-column w-8/12" style={{ overflowX: "auto", overflowY: "auto", maxHeight: "70vh" }}>
                            <ConditionGroup data={data} updateData={updateData} path={[]} ruleType={ruleType} />
                            <ResultForm
                                condition="Then"
                                onResultsChange={handleResultsChangeThen}
                                onActionsChange={handleActionsChangeThen}
                            />
                            <ResultForm
                                condition="Else"
                                onResultsChange={handleResultsChangeElse}
                                onActionsChange={handleActionsChangeElse}
                            />
                        </div>
                        <div className="w-3/12 overflow-y-auto">
                            <CreateScheduleForm
                                placeholder="API"
                                buttonText="Create Schedule"
                                onClick={handleCreateSchedule}
                                onDateChange={handleDateChange}
                                handleDayChangeOption={handleDayChangeOption}
                            />
                        </div>
                    </div>
                    <div className="flex">
                        <Button className="self-end" onClick={handleCreateRuleConfiguration}>Create Rule Configuration</Button>
                    </div>
                    {/* <pre style={{ backgroundColor: "#f8f8f8", padding: "10px", marginTop: "20px" }}>
                            {JSON.stringify(data, null, 2)}
                        </pre> */}

<Dialog open={showAddInputAttributeModal} onOpenChange={setShowAddInputAttributeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Input Attributes</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Type</th>
                  <th className="border p-2">Test Value</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={index} className="bg-white">
                    <td className="border p-2">
                      <input
                        type="text"
                        value={row.name}
                        onChange={(e) => updateRow(index, "name", e.target.value)}
                        className="border rounded p-1 w-full"
                        placeholder="Property Name"
                      />
                    </td>
                    <td className="border p-2">
                      <select
                        value={row.type}
                        onChange={(e) => updateRow(index, "type", e.target.value)}
                        className="border rounded p-1 w-full"
                      >
                        <option value="">Select</option>
                        <option value="Type1">Type1</option>
                        <option value="Type2">Type2</option>
                      </select>
                    </td>
                    <td className="border p-2">
                      <input
                        type="text"
                        value={row.value}
                        onChange={(e) => updateRow(index, "value", e.target.value)}
                        className="border rounded p-1 w-full bg-gray-100"
                      />
                    </td>
                    <td className="border p-2 text-center">
                      <button
                        onClick={() => removeRow(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* <Button onClick={addRow} className="mt-4 bg-blue-500">
              Add Field
            </Button> */}
          </div>
          <DialogFooter>
            <Button className='bg-blue-500' onClick={handleSaveManageAttributes}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ConditionBuilder;