import React, { useEffect, useState} from 'react';
import {
  Card,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Ellipsis, Maximize } from 'lucide-react';
import { RadioButtons } from './RadioButton';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@radix-ui/react-tooltip';

interface HeaderRowProps {
  heading?: string;
  sub_heading?: string;
  handleExport?: () => void;
  onExpand: () => void;
  onExport?: (s: string, title: string, index: number) => void;
  visitEventOptions?: { value: string; label: string }[];
  handleTypeChange?: (value: string) => void;
  selectedType?: string;
  selectoptions?: string[];
  title?: string;
  isSelect?: boolean;
  isRadioButton?: boolean;
  placeholder?: string;
}

const HeaderRow: React.FC<HeaderRowProps> = ({
  handleTypeChange,
  visitEventOptions,
  selectoptions = [],
  selectedType,
  handleExport,
  onExport,
  onExpand,
  title,
  isSelect = false,
  isRadioButton = false,
  placeholder = "",
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpandClick = () => {
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);
    onExpand(); // Notify the parent for expansion change
    console.log(" expand true ");
  };

  return (
    <Card className='border-none w-full'>
      <div className="flex flex-wrap justify-between">

          <>
            {/* Title and expandable menu when collapsed */}
            <CardTitle className="flex justify-center items-center text-sub-header font-semibold sm:text-body p-1">
              {title}
            </CardTitle>
            <CardTitle className="flex flex-wrap space-x-4 sm:space-x-2 justify-between w-full sm:w-auto p-1">
              {isRadioButton && (
                <div className="flex justify-center items-center">
                  <RadioButtons
                    options={visitEventOptions || []}
                    defaultValue={selectedType}
                    onValueChange={handleTypeChange || (() => {})}
                  />
                </div>
              )}

              {isSelect && (
                <div className="flex justify-center items-center">
                  <Select>
                    <SelectTrigger className="w-[120px] h-[30px]">
                      <SelectValue placeholder={placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup className="relative z-100">
                        {selectoptions.map((option, index) => (
                          <SelectItem key={index} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="p-2 flex justify-center items-center">
                <TooltipProvider>
                  <Tooltip>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <TooltipTrigger>
                          <div className="group">
                            <Ellipsis className="group-hover:text-blue-500" />
                          </div>
                        </TooltipTrigger>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="dark:bg-background">
                        <DropdownMenuGroup>
                          <DropdownMenuItem onClick={handleExport}>Export to CSV</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onExport?.("png", title ?? " ", 1)}>
                            Export to PNG
                          </DropdownMenuItem>
                          <DropdownMenuItem>Export to Excel</DropdownMenuItem>
                          <DropdownMenuItem onClick={handleExpandClick}>
                            <span>Expand</span>
                            <Maximize size={20} className="ml-3" />
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <TooltipContent className="text-small-font">Select Options</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardTitle>
          </>
      </div>
    </Card>
  );
};

export default HeaderRow;
