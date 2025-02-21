"use client";

import * as React from "react";
import {
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
  subWeeks,
} from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface MFDateRangePickerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  onChange?: (newDateRange: DateRange | undefined) => void;
}

export function MFDateRangePicker({
  className,
  onChange, // Accept onChange as a prop
}: MFDateRangePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });
console.log(date,"date")
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="ghost"
            className={cn(
              "w-fit max-w-60 justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Select
            onValueChange={(value) => {
              let newDateRange: DateRange | undefined;
              switch (value) {
                case "l_month":
                  newDateRange = {
                    from: startOfMonth(subMonths(new Date(), 1)),
                    to: endOfMonth(subMonths(new Date(), 1)),
                  };
                  break;
                case "l_week":
                  newDateRange = {
                    from: startOfWeek(subWeeks(new Date(), 1)),
                    to: endOfWeek(subWeeks(new Date(), 1)),
                  };
                  break;
                default:
                  newDateRange = {
                    from: subDays(new Date(), parseInt(value)),
                    to: new Date(),
                  };
                  break;
              }
              setDate(newDateRange);
              onChange?.(newDateRange); // Trigger onChange when preset is selected
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Preset" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="l_week">Last week</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="l_month">Last month</SelectItem>
              <SelectItem value="90">Last 3 months</SelectItem>
            </SelectContent>
          </Select>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={(newDateRange) => {
              setDate(newDateRange);
              if (newDateRange) {
                onChange?.(newDateRange); // Trigger onChange when calendar date is selected
              }
            }}
            numberOfMonths={2}
            disabled={{ after: new Date() }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
