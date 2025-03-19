"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import CodeBlock from "../../CodeBlock";
import DynamicInputForm from "../../DynamicInputForm";
import TEMP from "./temp";
import { Button } from "@/components/ui/button";
import { Toast, useGetTrackerConfig, useUpdateTrackerConfig } from "../../api";
import Loader from "../../Loader";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function TrackerConfig() {
  const trackerId: any = useParams().tracker_id;
  const tracker_name: any = useParams().tracker_name;
  const { data: trackerFields, isLoading } = useGetTrackerConfig(trackerId);
  const {
    mutateAsync,
    data: updateRes,
    isLoading: resLoading,
  } = useUpdateTrackerConfig();
  const formRef: any = useRef();
  // Dummy code to display on the right side
  function handleSubmit() {
    const formData = formRef?.current?.values;
    const payload = { trackerId: trackerId, data: formData };
    const isConfigUnchanged =
      JSON.stringify(formData) === JSON.stringify(trackerFields["config"]);

    if (isConfigUnchanged)
      return Toast.error({ description: "No changes detected" });
    mutateAsync(payload).then(() => resetForm());
  }
  function resetForm() {
    formRef?.current?.reset();
  }

  return (
    <div className="relative h-full py-2 px-8">
      <div className="px-8 py-5 bg-white dark:bg-gray-500 rounded-xl flex items-center justify-between">
        <h2 className="text-xl font-medium text-gray-900 dark:text-white capitalize">
          Trackers Configuration
        </h2>
      </div>
      <div className="flex flex-col lg:flex-row gap-y-4 py-2 lg:gap-x-4  rounded-xl mt-3 w-full">
        <div className="relative bg-white dark:bg-gray-500 rounded-lg p-5 flex flex-col gap-y-4  w-full">
          {trackerFields ? (
            <>
              <div className="flex items-center justify-between gap-x-5">
                <Label className="w-4/6 text-md dark:text-white capitalize">
                  Tracker id :
                </Label>
                <Input
                  className="w-full dark:bg-gray-300 dark:text-white"
                  value={trackerId}
                  disabled
                />
              </div>

              <DynamicInputForm
                schema={trackerFields["schema"]}
                defaultValues={trackerFields["config"]}
                label="config"
                ref={formRef}
              />
              <div className="mt-4 p-3 rounded-xl flex justify-end gap-x-4">
                <Button
                  className="w-1/5"
                  onClick={resetForm}
                  disabled={resLoading}
                >
                  Reset
                </Button>
                <Button
                  className="w-1/5"
                  onClick={handleSubmit}
                  disabled={resLoading}
                >
                  submit
                  {resLoading && <Loader className="!text-white !h-4 !w-4" />}
                </Button>
              </div>
            </>
          ) : (
            <Loader />
          )}
        </div>

        <div className="sticky top-0 flex justify-center border-box bg-white dark:bg-gray-500 rounded-lg p-5 h-[75vh] lg:w-4/5">
          <CodeBlock code="fraud %" />
        </div>
      </div>
    </div>
  );
}
