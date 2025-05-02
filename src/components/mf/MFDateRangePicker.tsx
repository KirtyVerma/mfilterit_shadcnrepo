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
<<<<<<< HEAD
import { Calendar as CalendarIcon } from "lucide-react";
=======
import { Calendar as CalendarIcon, Check } from "lucide-react";
>>>>>>> d1452b7 (Initial commit)
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
<<<<<<< HEAD

interface MFDateRangePickerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  onChange?: (newDateRange: DateRange | undefined) => void;
=======
import { useDateRange } from "./DateRangeContext";

interface MFDateRangePickerProps {
  className?: string;
  onDateChange?: (range: DateRange | undefined) => void;
>>>>>>> d1452b7 (Initial commit)
}

export function MFDateRangePicker({
  className,
<<<<<<< HEAD
  onChange, // Accept onChange as a prop
}: MFDateRangePickerProps) {
=======
  onDateChange,
}: MFDateRangePickerProps) {
  const { setDateRange } = useDateRange();
>>>>>>> d1452b7 (Initial commit)
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });
<<<<<<< HEAD
console.log(date,"date")
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
=======
  const [open, setOpen] = React.useState(false);

  const handleDateSelect = (newDateRange: DateRange | undefined) => {
    setDate(newDateRange);
    
    // If both from and to dates are selected, close the popover and update the context
    if (newDateRange?.from && newDateRange?.to) {
      setOpen(false);
      setDateRange(
        format(newDateRange.from, 'yyyy-MM-dd'),
        format(newDateRange.to, 'yyyy-MM-dd')
      );
    }
  };

  const handlePresetSelect = (value: string) => {
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
    setOpen(false);
    
    if (newDateRange?.from && newDateRange?.to) {
      setDateRange(
        format(newDateRange.from, 'yyyy-MM-dd'),
        format(newDateRange.to, 'yyyy-MM-dd')
      );
      onDateChange?.(newDateRange);
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
>>>>>>> d1452b7 (Initial commit)
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="ghost"
            className={cn(
<<<<<<< HEAD
              "w-fit max-w-60 justify-start text-left font-normal",
=======
              "w-fit max-w-60  text-small-font justify-start text-left font-normal",
>>>>>>> d1452b7 (Initial commit)
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
<<<<<<< HEAD
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
=======
          <Select onValueChange={handlePresetSelect}>
>>>>>>> d1452b7 (Initial commit)
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
<<<<<<< HEAD
            onSelect={(newDateRange) => {
              setDate(newDateRange);
              if (newDateRange) {
                onChange?.(newDateRange); // Trigger onChange when calendar date is selected
              }
            }}
=======
            onSelect={handleDateSelect}
>>>>>>> d1452b7 (Initial commit)
            numberOfMonths={2}
            disabled={{ after: new Date() }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
