"use client"
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import React from "react";

export default function TrackerConfig() {
  const packageName = useParams().package_name;
  return (
    <div className="py-2 px-8">
      <div className="px-8 py-5 bg-white rounded-xl flex items-center justify-between">
        <h2 className="text-xl font-medium text-gray-900 capitalize">
          Tracker configuration
        </h2>
      </div>
      <div className="flex flex-col lg:flex-row px-3 py-2 gap-x-4  rounded-xl mt-5">
        <div className="w-full bg-white rounded-lg p-3">
          <div className="h-[200px]">CreateTracker for {packageName}</div>
        </div>
        <div className="w-full bg-white rounded-lg p-3">
          <div className="h-[200px]">right</div>
          <div className="flex justify-end">
          </div>
        </div>
      </div>
    </div>
  );
}
