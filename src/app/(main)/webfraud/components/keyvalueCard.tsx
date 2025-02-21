"use client"
import React, { FC } from "react";
import { Loader2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface KeyValueCardProps {
  title?: string;
  leftKey?: string;
  leftValue?: number; 
  percentage?: string;
  colors?: string;
  rightKey?: string;
  rightValue?: number;
  percentage1?: string
  backgroundColor?: string;
  isLoading?: boolean;
  className?: string;
  style?: React.CSSProperties;
  [key: string]: any;
}

const formatNumber = (value: number | string): string => {
  if (typeof value === "number" && value >= 1000) {
    return `${(value / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  }
  return value.toString();
};

const KeyValueCard: FC<KeyValueCardProps> = ({
  title,
  leftKey,
  leftValue,
  percentage,
  leftSide,
  colors,
  rightKey,
  rightValue,
  percentage1,
  isLoading,

}) => {

  return (
    <div className="p-2">
      <div className="flex flex-row w-full pl-1">
        <div className="font-semibold text-sub-header sm:text-body md:text-small-font lg:text-small-font xl:text-body">{title}</div>
      </div>
      <div className="flex flex-wrap w-full pl-3 text-body md:text-small-font lg:text-small-font sm:text-small-font xl:text-body" style={{ color: colors }}>
        {/* Left Column */}
        <div className="sm:basis-1/2 md:basis-1/2 lg:basis-1/2 font-semibold">
          <div className="flex ">
            <div className="">{leftKey}</div>
            <div className="ml-1">{leftSide}</div>
          </div>
        </div>
        <div className="sm:basis-1/2 md:basis-1/2 lg:basis-1/2 font-semibold flex-grow flex items-center justify-start">


          <div className="">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>{formatNumber(leftValue ?? "")}
                  <TooltipContent>{leftValue?.toLocaleString()}</TooltipContent>
                </TooltipTrigger>
              </Tooltip>
            </TooltipProvider>
              <span className="ml-1">{percentage}</span>
          </div>
        </div>
        <div className="sm:basis-1/2 md:basis-1/2 lg:basis-1/2 font-semibold">
          <div className="flex">
            <div className="">{rightKey}</div>
          </div>
        </div>
        <div className="sm:basis-1/2 md:basis-1/2 lg:basis-1/2 font-semibold flex-grow flex items-center justify-start">

          <div className="">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  {formatNumber(rightValue ?? "")}
                  <TooltipContent>{rightValue?.toLocaleString()}</TooltipContent>
                </TooltipTrigger>
              </Tooltip>
            </TooltipProvider>
              <span className="text-10 ml-1">{percentage1 ?? ""}</span>
          </div>
        </div>
      </div>
      {/* Divider */}
      <div className="border-b ml-3 mr-3"></div>
    </div>



  );
};

export default KeyValueCard;
