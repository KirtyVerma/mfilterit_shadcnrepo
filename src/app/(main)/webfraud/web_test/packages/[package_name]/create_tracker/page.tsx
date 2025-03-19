"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import CodeBlock from "../../../CodeBlock";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import TRACKER_DATA from "./create_tracker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateTracker, useGetPlatforms } from "../../../api";
import { Button } from "@/components/ui/button";
import Loader from "../../../Loader";
import DynamicInputForm from "../../../DynamicInputForm";

export default function CreateTracker() {
  const packageName = useParams().package_name;
  const {
    mutate: createTracker,
    data: newTracker,
    isLoading: ctl,
  } = useCreateTracker();
  const { data: platforms, isLoading } = useGetPlatforms();
  const formRef: any = useRef();
  const [values, setValues] = useState({
    package_name: packageName,
    tracker_name: "",
    tracker_type: "impression",
    platform: "",
    pixel_level: "basic",
  });
  useEffect(() => {
    platforms && setValues((prev) => ({ ...prev, ["platform"]: platforms[0] }));
  }, [platforms]);

  function handleSubmit(event: any) {
    event.preventDefault();
    const formData = formRef?.current?.values();
    const fields = { ...values, ...formData };
    createTracker(fields);
  }

  return (
    <div className="relative py-2 px-8">
      <div className="px-8 py-5 bg-white dark:bg-gray-500 rounded-xl flex items-center justify-between">
        <h2 className="text-xl font-medium text-gray-900 dark:text-white capitalize">
          create Trackers
        </h2>
      </div>
      <div className="flex flex-col lg:flex-row py-2 gap-x-4  rounded-xl mt-3 w-full">
        <form
          onSubmit={handleSubmit}
          className=" bg-white dark:bg-gray-500 dark:text-white rounded-lg p-5 flex flex-col gap-y-4 lg:w-3/5"
        >
          <div className="flex items-center justify-between gap-x-5">
            <Label className="w-2/6 capitalize text-md">package_name :</Label>
            <Input
              className="w-4/6 dark:bg-gray-300 outline-none dark:border-white"
              placeholder="Enter value"
              value={values["package_name"]}
              disabled
            />
          </div>
          <div className="flex items-center justify-between gap-x-5">
            <Label className="w-2/6 capitalize text-md">tracker_name :</Label>
            <Input
              className="w-4/6 dark:bg-gray-300 outline-none dark:border-white"
              placeholder="Enter value"
              value={values["tracker_name"]}
              required
              onChange={(e) =>
                setValues((prev) => ({ ...prev, tracker_name: e.target.value }))
              }
            />
          </div>
          <div className="flex items-center justify-between gap-x-5">
            <Label className="w-2/6 capitalize text-md">platforms :</Label>
            <Select
              onValueChange={(val) =>
                setValues((prev) => ({ ...prev, platform: val }))
              }
              disabled={isLoading}
            >
              <SelectTrigger className="w-4/6 dark:bg-gray-300 outline-none dark:border-white capitalize">
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
            <Label className="w-2/6 capitalize text-md">pixel level :</Label>
            <Select
              onValueChange={(val) =>
                setValues((prev) => ({ ...prev, pixel_level: val }))
              }
            >
              <SelectTrigger className="w-4/6 dark:bg-gray-300 outline-none dark:border-white capitalize">
                <SelectValue placeholder={values.pixel_level} />
              </SelectTrigger>
              <SelectContent>
                {["basic", "intermediate", "advance"].map((Item, i) => (
                  <SelectItem value={Item} key={i} className="capitalize">
                    {Item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between gap-x-5">
            <Label className="w-2/6 capitalize text-md">Tracker Type :</Label>
            <Select
              onValueChange={(val) =>
                setValues((prev) => ({ ...prev, tracker_type: val }))
              }
            >
              <SelectTrigger className="w-4/6 dark:bg-gray-300 outline-none dark:border-white capitalize">
                <SelectValue placeholder={values.tracker_type} />
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
            {/* <DDF schema={TRACKER_DATA} label="ff"/> */}
          </div>
          <div className="flex gap-x-5">
            <Button
              type="submit"
              className="w-full mt-8 dark:bg-gray-400 dark:text-white"
            >
              create tracker
            </Button>
          </div>
        </form>
        <div className="sticky top-0 flex justify-center w-full bg-white dark:bg-gray-500 rounded-lg p-5 h-[75vh] ">
          {newTracker ? (
            <CodeBlock code={newTracker.data} language={newTracker.language} />
          ) : (
            <CodeBlock isloading={ctl} />
          )}
        </div>
      </div>
    </div>
  );
}
