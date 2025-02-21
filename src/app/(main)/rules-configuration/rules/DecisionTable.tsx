import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ConditionBuilder = ({ open, setT, ruleType }) => {

  // const [columns, setColumns] = useState<ColumnData[]>([
  //   {
  //     id: 1,
  //     type: "Condition",
  //     rows: [{ id: 1, conditionField: "", operator: "Contains", value: "" }],
  //   },
  // ]);

  // // Add new column
  // const addColumn = (type: "Condition" | "Group" | "Result") => {
  //   setColumns((prev) => [
  //     ...prev,
  //     {
  //       id: prev.length + 1,
  //       type,
  //       rows: [{ id: 1, conditionField: "", operator: "Contains", value: "" }],
  //     },
  //   ]);
  // };

  // // Add row to a column
  // const addRow = (columnId: number) => {
  //   setColumns((prev) =>
  //     prev.map((col) =>
  //       col.id === columnId
  //         ? {
  //             ...col,
  //             rows: [
  //               ...col.rows,
  //               {
  //                 id: col.rows.length + 1,
  //                 conditionField: "",
  //                 operator: "Contains",
  //                 value: "",
  //               },
  //             ],
  //           }
  //         : col
  //     )
  //   );
  // };

  // // Handle row value change
  // const handleRowChange = (
  //   columnId: number,
  //   rowId: number,
  //   field: keyof RowData,
  //   value: string
  // ) => {
  //   setColumns((prev) =>
  //     prev.map((col) =>
  //       col.id === columnId
  //         ? {
  //             ...col,
  //             rows: col.rows.map((row) =>
  //               row.id === rowId ? { ...row, [field]: value } : row
  //             ),
  //           }
  //         : col
  //     )
  //   );
  // };


  //   const [table, setTable] = useState({
  //   groups: [], // Each group has headers
  //   rows: [],   // Rows containing values for all headers
  // });

  // // Add a new group header
  // const addGroup = () => {
  //   const newGroup = { id: Date.now(), name: `Group ${table.groups.length + 1}`, headers: [] };
  //   setTable((prev) => ({ ...prev, groups: [...prev.groups, newGroup] }));
  // };

  // // Add condition (header) under a specific group
  // const addCondition = (groupId) => {
  //   setTable((prev) => {
  //     const updatedGroups = prev.groups.map((group) =>
  //       group.id === groupId
  //         ? {
  //             ...group,
  //             headers: [
  //               ...group.headers,
  //               { id: Date.now(), name: `Condition ${group.headers.length + 1}` },
  //             ],
  //           }
  //         : group
  //     );
  //     return { ...prev, groups: updatedGroups };
  //   });
  // };

  // // Add a new row with empty values for all current headers
  // const addRow = () => {
  //   const newRow = {
  //     id: Date.now(),
  //     values: table.groups.flatMap((group) => group.headers.map(() => "")),
  //   };
  //   setTable((prev) => ({ ...prev, rows: [...prev.rows, newRow] }));
  // };

  // // Update row values
  // const updateRowValue = (rowId, index, value) => {
  //   setTable((prev) => {
  //     const updatedRows = prev.rows.map((row) =>
  //       row.id === rowId
  //         ? { ...row, values: row.values.map((v, i) => (i === index ? value : v)) }
  //         : row
  //     );
  //     return { ...prev, rows: updatedRows };
  //   });
  // };



    // const [groups, setGroups] = useState([
    //   {
    //     id: 1,
    //     conditions: [{ id: 1, property: "", operator: "", value: "" }],
    //   },
    // ]);
  
    // // Add a new group
    // const addGroup = () => {
    //   setGroups([
    //     ...groups,
    //     {
    //       id: groups.length + 1,
    //       conditions: [{ id: 1, property: "", operator: "", value: "" }],
    //     },
    //   ]);
    // };
  
    // // Add a condition to a group
    // const addCondition = (groupId) => {
    //   setGroups(
    //     groups.map((group) =>
    //       group.id === groupId
    //         ? {
    //             ...group,
    //             conditions: [
    //               ...group.conditions,
    //               { id: group.conditions.length + 1, property: "", operator: "", value: "" },
    //             ],
    //           }
    //         : group
    //     )
    //   );
    // };
  
    // // Remove a condition from a group
    // const removeCondition = (groupId, conditionId) => {
    //   setGroups(
    //     groups.map((group) =>
    //       group.id === groupId
    //         ? {
    //             ...group,
    //             conditions: group.conditions.filter(
    //               (condition) => condition.id !== conditionId
    //             ),
    //           }
    //         : group
    //     )
    //   );
    // };
  
    // // Update a condition
    // const updateCondition = (groupId, conditionId, field, value) => {
    //   setGroups(
    //     groups.map((group) =>
    //       group.id === groupId
    //         ? {
    //             ...group,
    //             conditions: group.conditions.map((condition) =>
    //               condition.id === conditionId
    //                 ? { ...condition, [field]: value }
    //                 : condition
    //             ),
    //           }
    //         : group
    //     )
    //   );
    // };



    const [groups, setGroups] = useState<Group[]>([
        {
          id: 1,
          conditions: [{ id: 1, property: "", operator: "", value: "" }],
          nestedGroups: [],
        },
      ]);
    
      // Add a new group
      const addGroup = (parentGroupId?: number) => {
        if (parentGroupId) {
          // Add a nested group inside a parent group
          setGroups(
            groups.map((group) =>
              group.id === parentGroupId
                ? {
                    ...group,
                    nestedGroups: [
                      ...group.nestedGroups,
                      { id: Date.now(), conditions: [], nestedGroups: [] },
                    ],
                  }
                : group
            )
          );
        } else {
          // Add a root-level group
          setGroups([
            ...groups,
            { id: Date.now(), conditions: [], nestedGroups: [] },
          ]);
        }
      };
    
      // Add a condition to a group
      const addCondition = (groupId: number) => {
        const addConditionRecursively = (groupList: Group[]): Group[] => {
          return groupList.map((group) =>
            group.id === groupId
              ? {
                  ...group,
                  conditions: [
                    ...group.conditions,
                    { id: Date.now(), property: "", operator: "", value: "" },
                  ],
                }
              : { ...group, nestedGroups: addConditionRecursively(group.nestedGroups) }
          );
        };
    
        setGroups(addConditionRecursively(groups));
      };
    
      // Update a condition
      const updateCondition = (
        groupId: number,
        conditionId: number,
        field: keyof Condition,
        value: string
      ) => {
        const updateConditionRecursively = (groupList: Group[]): Group[] => {
          return groupList.map((group) =>
            group.id === groupId
              ? {
                  ...group,
                  conditions: group.conditions.map((condition) =>
                    condition.id === conditionId
                      ? { ...condition, [field]: value }
                      : condition
                  ),
                }
              : { ...group, nestedGroups: updateConditionRecursively(group.nestedGroups) }
          );
        };
    
        setGroups(updateConditionRecursively(groups));
      };


      console.log(groups,"----hello groups is needed");
      
    
      // Render groups and conditions
      const renderGroups = (groupList: Group[]) => {
        return (
          <div className="flex gap-4"> {/* Ensures horizontal alignment */}
            {groupList.map((group) => (
              <div
                key={group.id}
                className="border border-gray-300 rounded-lg p-2 min-w-[400px] flex gap-4"
              >
                <div className="font-semibold">Group {group.id}</div>
      
                {/* Render conditions */}
                <div className="flex flex-col gap-2">
                  {group.conditions.map((condition) => (
                    <div key={condition.id} className="flex items-center gap-4">
                      <Select
                        onValueChange={(value) =>
                          updateCondition(group.id, condition.id, "property", value)
                        }
                      >
                        <SelectTrigger className="w-36">
                          <SelectValue placeholder="Property" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Property1">Property1</SelectItem>
                          <SelectItem value="Property2">Property2</SelectItem>
                        </SelectContent>
                      </Select>
      
                      <Select
                        onValueChange={(value) =>
                          updateCondition(group.id, condition.id, "operator", value)
                        }
                      >
                        <SelectTrigger className="w-28">
                          <SelectValue placeholder="Operator" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Equals">Equals</SelectItem>
                          <SelectItem value="NotEquals">Not Equals</SelectItem>
                        </SelectContent>
                      </Select>
      
                      <Input
                        placeholder="Value"
                        className="w-40"
                        onChange={(e) =>
                          updateCondition(group.id, condition.id, "value", e.target.value)
                        }
                      />
                    </div>
                  ))}
                </div>
      
                {/* Render nested groups */}
                {group.nestedGroups.length > 0 && (
                  <div className="flex gap-4"> {/* Flex for horizontal layout */}
                    {renderGroups(group.nestedGroups)}
                  </div>
                )}
      
                {/* Add condition and nested group buttons */}
                <div className="flex gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addCondition(group.id)}
                  >
                    Add Condition
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => addGroup(group.id)}
                  >
                    Add Nested Group
                  </Button>
                </div>
              </div>
            ))}
          </div>
        );
      };
      
    





  return (
    <div>
      <Dialog open={open} onOpenChange={(t) => setT(t)}>
       
        <DialogContent className="custom-dialog-content">
        <DialogHeader>
          <DialogTitle>Create Decision Table</DialogTitle>
        </DialogHeader>
        {/* <div className="overflow-x-auto">
      <div className="flex items-start gap-4">
        {groups.map((group) => (
          <div
            key={group.id}
            className="border border-gray-300 rounded-lg p-2 min-w-[400px] flex flex-col gap-2"
          >
            <div className="font-semibold">Group {group.id}</div>
            <div className="flex flex-col gap-2">
              {group.conditions.map((condition) => (
                <div key={condition.id} className="flex items-center gap-4">
                  <Select
                    onValueChange={(value) =>
                      updateCondition(group.id, condition.id, "property", value)
                    }
                  >
                    <SelectTrigger className="w-36">
                      <SelectValue placeholder="Property" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Property1">Property1</SelectItem>
                      <SelectItem value="Property2">Property2</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    onValueChange={(value) =>
                      updateCondition(group.id, condition.id, "operator", value)
                    }
                  >
                    <SelectTrigger className="w-28">
                      <SelectValue placeholder="Operator" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Equals">Equals</SelectItem>
                      <SelectItem value="NotEquals">Not Equals</SelectItem>
                    </SelectContent>
                  </Select>

                  <Input
                    placeholder="Value"
                    className="w-40"
                    onChange={(e) =>
                      updateCondition(group.id, condition.id, "value", e.target.value)
                    }
                  />
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => addCondition(group.id)}
            >
              Add Condition
            </Button>
          </div>
        ))}
        <Button
          variant="primary"
          size="sm"
          className="h-fit"
          onClick={addGroup}
        >
          Add Group
        </Button>
      </div>
    </div> */}

     <div className="overflow-x-auto">
          <div className="flex items-start gap-4">
            {renderGroups(groups)}
            <Button
              variant="primary"
              size="sm"
              className="h-fit"
              onClick={() => addGroup()}
            >
              Add Group
            </Button>
          </div>
        </div>

        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ConditionBuilder;
