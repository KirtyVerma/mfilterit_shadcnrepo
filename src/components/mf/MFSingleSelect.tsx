import React from "react";
import {
  Select,
  SelectContent,
<<<<<<< HEAD
  SelectGroup,
=======
>>>>>>> d1452b7 (Initial commit)
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

<<<<<<< HEAD
type MFSingleSelectProps = {
  className?: string;
  title: string;
  placeholder: string;
  items: { title: string; value: string }[];
};

export function MFSingleSelect({
  className,
  items,
  placeholder,
  title,
}: MFSingleSelectProps) {
  return (
    <Select defaultValue={items.at(0)?.value ?? ""}>
      <SelectTrigger
        className={cn(
          "h-10 border border-gray-300 dark:border-gray-700",
          className,
          "bg-white dark:bg-black text-black dark:text-white"
        )}
        title={title}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="max-h-48 bg-white dark:bg-black text-black dark:text-white">
        <SelectGroup>
          {items.map((v, i) => (
            <SelectItem key={i} value={v.value} className="hover:bg-gray-100 dark:hover:bg-gray-800">
              {v.title}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
=======
interface Item {
  title: string;
  value: string;
}

interface MFSingleSelectProps {
  items: Item[];
  placeholder?: string;
  title?: string;
  className?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

export function MFSingleSelect({
  items,
  placeholder,
  title,
  className,
  value,
  onValueChange,
}: MFSingleSelectProps) {
  return (
    <div className="flex flex-col gap-1">
      {/* {title && <p className="text-body">{title}</p>} */}
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className={className}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
>>>>>>> d1452b7 (Initial commit)
  );
}
