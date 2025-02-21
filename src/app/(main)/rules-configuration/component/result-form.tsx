"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CircleMinus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import ActionForm from "./add-actionform";

const inputTypes = {
  Text: { placeholder: "Enter text value", type: "text" },
  Array: { placeholder: "Enter comma-separated values", type: "text" },
  Date: { placeholder: "Select a date", type: "date" },
  Boolean: { options: ["True", "False"], type: "select" }
};

type Result = {
  type: keyof typeof inputTypes;
  value: string;
};

export default function ResultForm({ condition, onResultsChange,onActionsChange }) {
  const [results, setResults] = useState<Result[]>([]);
  const [actions, setActions] = useState([]);

  const handleAddResult = () => {
    const updatedResults = [...results, { type: "Text", key: "", value: "" }];
    setResults(updatedResults);
    onResultsChange(updatedResults); // Pass updated results to parent
  };

  const handleChange = (index: number, field: "type" | "key" | "value", value: string) => {
    const updatedResults = [...results];
    updatedResults[index][field] = value;
    setResults(updatedResults);
    onResultsChange(updatedResults); // Notify parent
  };

  const handleDelete = (index: number) => {
    const updatedResults = results.filter((_, i) => i !== index);
    setResults(updatedResults);
    onResultsChange(updatedResults); // Notify parent
  };


  const handleActionsChange = (updatedActions) => {
    setActions(updatedActions);
    onActionsChange(updatedActions);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto border-2">
      <p className="font-bold mb-2">{condition}</p>
      <Button onClick={handleAddResult} variant="outline" className="mb-4">
        + Add Result
      </Button>

      {results.map((result, index) => (
        <Card key={index} className="p-4 mb-4 flex gap-4 items-center">
          <Select
            value={result.type}
            onValueChange={(value) => handleChange(index, "type", value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(inputTypes).map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="text"
            placeholder="key"
            name="key"
            value={result?.key}
            onChange={(e) => handleChange(index, "key", e.target.value)}
            className="flex-1"
          />

          {inputTypes[result.type].type === "select" ? (
            <Select
              value={result.value}
              onValueChange={(value) => handleChange(index, "value", value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Value" />
              </SelectTrigger>
              <SelectContent>
                {inputTypes[result.type].options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              type={inputTypes[result.type].type}
              placeholder={inputTypes[result.type].placeholder}
              value={result.value}
              onChange={(e) => handleChange(index, "value", e.target.value)}
              className="flex-1"
            />
          )}

          <Button
            size="icon"
            className="rounded-md px-2"
            onClick={() => handleDelete(index)}
          >
            <CircleMinus />
          </Button>
        </Card>
      ))}
      <ActionForm
        condition="Add actions"
        onActionsChange={handleActionsChange}
        type={condition}
      />
    </div>
  );
}
