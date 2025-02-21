import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Condition {
    id: number;
    property: string;
    operator: string;
    value: string;
}

interface Group {
    id: number;
    conditions: Condition[];
    nestedGroups: Group[];
}

const DecisionTableHorizontal: React.FC = () => {
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

    // Render groups and conditions
    const renderGroups = (groupList: Group[]) => {
        return (
            <div className="flex gap-4">
                {groupList.map((group) => (
                    <div
                        key={group.id}
                        className="border border-gray-300 rounded-lg p-2 min-w-[400px] flex flex-col gap-4"
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
                            <div className="flex gap-4 overflow-x-auto mt-2">
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
    );
};

export default DecisionTableHorizontal;
