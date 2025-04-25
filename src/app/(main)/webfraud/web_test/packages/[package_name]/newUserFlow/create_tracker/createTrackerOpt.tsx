"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import CodeBlock from "../../../../components/CodeBlock";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateTracker, useGetNewTrackerSchema } from "../../../../api";
import { Button } from "@/components/ui/button";
import Loader from "../../../../components/Loader";
import DynamicInputForm from "../../../../components/DynamicInputForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function CreateTracker({ tracker_type }) {
  const packageName = useParams().package_name;
  const {
    mutate: createTracker,
    data: newTracker,
    isLoading: ctl,
  } = useCreateTracker();
  const { data: trackerSchema, isLoading } =
    useGetNewTrackerSchema(tracker_type);
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState({
    package_name: packageName,
    tracker_type: tracker_type,
    tracker_name: "",
  });
  const [showCodeDialog, setShowCodeDialog] = useState(false);

  useEffect(() => {
    if (newTracker) {
      setShowCodeDialog(true);
    }
  }, [newTracker]);

  function handleSubmit(event: any) {
    event.preventDefault();
    const formData = formRef?.current?.values;
    const fields = { ...values, ...formData };
    createTracker(fields);
  }

  return (
    <div className="relative px-8">
      <h2 className="p-1 pb-5 capitalize text-2xl text-gray-700 font-medium text-center mb-8 border-b border-gray-200 ">
        create new <span className="text-primary">{tracker_type}</span> tracker
      </h2>
      <div className="flex flex-col rounded-xl mt-3 w-full">
        {trackerSchema ? (
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-gray-500 dark:text-white rounded-lg flex flex-col gap-y-4 w-full"
          >
            <div className="flex items-center justify-between gap-x-5">
              <Label className="w-4/6 capitalize text-md">package_name :</Label>
              <Input
                className="w-full dark:bg-gray-300 outline-none dark:border-white"
                placeholder="Enter value"
                value={values["package_name"]}
                disabled
              />
            </div>
            <div className="flex items-center justify-between gap-x-5">
              <Label className="w-4/6 capitalize text-md">type_name :</Label>
              <Input
                className="w-full dark:bg-gray-300 outline-none dark:border-white"
                placeholder="Enter value"
                value={tracker_type}
                disabled
              />
            </div>

            <DynamicInputForm
              schema={trackerSchema}
              ref={formRef}
              label="config"
            />

            <div className="flex justify-start">
              <Button
                type="submit"
                className="mt-8 dark:bg-gray-400 dark:text-white"
                disabled={ctl}
              >
                create tracker
                {ctl && <Loader className="!text-white !w-4 !h-4 ml-2" />}
              </Button>
            </div>
          </form>
        ) : (
          <Loader />
        )}
      </div>

      <Dialog open={showCodeDialog} onOpenChange={setShowCodeDialog} >
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Generated Tracker Code</DialogTitle>
          </DialogHeader> 
          {newTracker ? (
            <CodeBlock code={newTracker.data} language={newTracker.language} />
          ) : (
            <CodeBlock isloading={ctl} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
