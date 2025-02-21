import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const CreateScheduleForm = ({
  placeholder,
  buttonText,
  onClick,
  onDateChange,
  handleDayChangeOption,
}) => {
  const [startDate, setStartDate] = useState(undefined);
  const [endDate, setEndDate] = useState(undefined);
  const [selectedDay, setSelectedDay] = useState("");

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);
    onDateChange(newStartDate, endDate);
  };

  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    setEndDate(newEndDate);
    onDateChange(startDate, newEndDate);
  };

  const handleDayChange = (event) => {
    // console.log(event.target.value);

    setSelectedDay(event.target.value);
    handleDayChangeOption(event.target.value);
  };

  return (
    <div className="space-y-4 border-8 p-4">
      <p className="font-bold">Trigger</p>
      <div>
        <input
          type="text"
          placeholder={placeholder || "API"}
          disabled
          value="https://mfilterit-azetn.nected.io/nected/rule/a3b258f2-fb59-4d18-8d02-9676b6e1acaa"
          name="api"
          className="w-full rounded-md border p-2"
        />
      </div>
      <Card className="p-4">
        <div className="space-y-4">
          <div>
            <Label className="mb-2 block text-sm font-medium">Start Date</Label>
            <Input
              type="date"
              value={startDate || ""}
              onChange={handleStartDateChange}
              className="w-full"
            />
          </div>
          <div>
            <Label className="mb-2 block text-sm font-medium">End Date</Label>
            <Input
              type="date"
              value={endDate || ""}
              onChange={handleEndDateChange}
              className="w-full"
            />
          </div>
          <div className="">
            <label
              htmlFor="days"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Select a Day
            </label>
            <select
              id="days"
              value={selectedDay}
              onChange={handleDayChange}
              className="block w-full rounded-md border px-3 py-2 text-gray-700 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="" disabled>
                -- Select a Day --
              </option>
              {daysOfWeek.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>
      <div>
        <Button
          onClick={onClick}
          className="w-full rounded-md bg-blue-500 p-2 text-white"
        >
          {buttonText || "Create Schedule"}
        </Button>
      </div>
    </div>
  );
};

export default CreateScheduleForm;
