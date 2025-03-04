"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import CodeBlock from "../../../CodeBlock";
import InputForm from "../../../Form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import TRACKER_DATA from "./create_tracker.json";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetPlatforms, useGetPreview } from "../../../api";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Loader from "../../../Loader";

export default function CreateTracker() {
  const packageName = useParams().package_name;
  const { mutate: getPreview, data: preview, isLoading: pl } = useGetPreview();
  const { data: platforms, isLoading } = useGetPlatforms();
  const formRef: any = useRef();
  const [values, setValues] = useState({
    packageName: packageName,
    trackertype: "impression",
    platform: "",
  });
  useEffect(() => {
    platforms && setValues((prev) => ({ ...prev, ["platform"]: platforms[0] }));
  }, [platforms]);
  // Dummy code to display on the right side
  function handleSubmit() {
    const formData = formRef?.current?.values();
    const fields = { ...values, ...formData };
    console.log("create Trackers Form Data:", fields);
  }

  return (
    <div className="relative py-2 px-8">
      <div className="px-8 py-5 bg-white rounded-xl flex items-center justify-between">
        <h2 className="text-xl font-medium text-gray-900 capitalize">
          create Trackers
        </h2>
      </div>
      <div className="flex flex-col lg:flex-row py-2 gap-x-4  rounded-xl mt-3 w-full">
        <div className=" bg-white rounded-lg p-5 flex flex-col gap-y-4 lg:w-3/5">
          <div className="flex items-center justify-between gap-x-5">
            <Label className="w-2/6">package_name :</Label>
            <Input
              className="w-4/6"
              placeholder="Enter value"
              value={values["packageName"] || ""}
              disabled
            />
          </div>
          <div className="flex items-center justify-between gap-x-5">
            <Label className="w-2/6">platforms :</Label>
            {/* {platforms ? ( */}
            <Select
              onValueChange={(val) =>
                setValues((prev) => ({ ...prev, platform: val }))
              }
              disabled={isLoading}
            >
              <SelectTrigger className="w-4/6 capitalize">
                {platforms ? (
                  <SelectValue placeholder={values.platform} />
                ) : (
                  <Loader className="!h-5 !w-5" />
                )}
              </SelectTrigger>
              <SelectContent>
                {platforms?.map((Item: any, i: any) => (
                  <SelectItem value={Item} key={i} className="capitalize">
                    {Item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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
          {(TRACKER_DATA as any)[values.trackertype] && (
            <InputForm
              ref={formRef}
              data={(TRACKER_DATA as any)[values.trackertype]}
            />
          )}
          <div className="flex gap-x-5">
            <Button
              type="submit"
              className="w-full mt-8"
              onClick={() => handleSubmit()}
            >
              create tracker
            </Button>
            <Button
              className="capitalize w-full mt-8"
              onClick={() => getPreview()}
              disabled={pl}
            >
              get Preview
            </Button>
          </div>
        </div>
        <div className="sticky top-0 flex justify-center w-full bg-white rounded-lg p-5 h-[75vh] ">
          {pl ? <CodeBlock code={preview} /> : <CodeBlock isloading={pl} />}
        </div>
      </div>
    </div>
  );
}
