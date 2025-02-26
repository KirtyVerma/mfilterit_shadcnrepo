"use client";

import { useParams } from "next/navigation";
import React, { useState } from "react";
import CodeBlock from "../../../CodeBlock";
import InputForm from "../../../Form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import TRACKER_DATA from "../../../create_tracker.json";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CreateTracker() {
  const packageName = useParams().package_name;
  const [values, setValues] = useState({
    packageName: packageName,
    trackertype: "impression",
  });
  // Dummy code to display on the right side
  function handleSubmit(formData: any) {
    const fields = { ...values, ...formData };
    console.log("create Trackers Form Data:", fields);
  }
  const getPreview= () => new Promise((resolve, reject) => {
    setTimeout(() => {  
      resolve("this is preview code")
    },500)
  });

  return (
    <div className="relative py-2 px-8">
      <div className="px-8 py-5 bg-white rounded-xl flex items-center justify-between">
        <h2 className="text-xl font-medium text-gray-900 capitalize">
          create Trackers
        </h2>
      </div>
      <div className="flex flex-col lg:flex-row py-2 gap-x-4  rounded-xl mt-3 w-full">
        <div className=" bg-white rounded-lg p-5 flex flex-col gap-y-4 lg:w-3/5">
          {[...Array(8)].map((x) => ( //just for testing remove afterwards
            <div className="flex items-center justify-between gap-x-5">
              <Label className="w-2/6">package_name :</Label>
              <Input
                className="w-4/6"
                placeholder="Enter value"
                value={values["packageName"] || ""}
                disabled
              />
            </div>
          ))}
          <div className="flex items-center justify-between gap-x-5">
            <Label className="w-2/6">Tracker Type :</Label>
            <Select
              onValueChange={(val) =>
                setValues((prev) => ({ ...prev, trackertype: val }))
              }
            >
              <SelectTrigger className="w-4/6 capitalize">
                <SelectValue placeholder={values.trackertype} />
              </SelectTrigger>
              <SelectContent>
                {["impression", "visit", "click", "event", "s2s"].map(
                  (Item, i) => (
                    <SelectItem value={Item} key={i} className="capitalize">
                      {Item}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>
          {TRACKER_DATA[values.trackertype] && (
            <InputForm
              data={TRACKER_DATA[values.trackertype]}
              cb={handleSubmit}
            />
          )}
        </div>
        <div className="sticky top-0 flex justify-center w-full bg-white rounded-lg py-5 h-[75vh] ">
          <CodeBlock fetchData={getPreview}/>
        </div>
      </div>
    </div>
  );
}
