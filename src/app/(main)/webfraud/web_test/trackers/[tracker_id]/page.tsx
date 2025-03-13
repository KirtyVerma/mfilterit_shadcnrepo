"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import CodeBlock from "../../CodeBlock";
import InputForm from "../../Form";
import DDF from "./DDF";
import TEMP from "./temp";
import { Button } from "@/components/ui/button";

export default function TrackerConfig() {
  const packageName = useParams().package_name;
  const [state, setstate] = useState<any>();
  const DATA: any = {
    tracker_type: {
      type: "dropdown",
      values: ["exampleValue1", "exampleValue2", "exampleValue3"],
    },
    something_else: {
      type: "input",
    },
    settingThree: {
      type: "switch",
    },
  };

  const formRef: any = useRef();
  // Dummy code to display on the right side
  function handleSubmit() {
    const formData = formRef?.current?.values();
    console.log("===>",formData)
    setstate((prev:any )=> ({ ...prev, formData }));
  }

  useEffect(() => {
    
    console.log(state);

  }, [state]);

  return (
    <div className="relative h-full py-2 px-8">
      <div className="px-8 py-5 bg-white dark:bg-gray-500 rounded-xl flex items-center justify-between">
        <h2 className="text-xl font-medium text-gray-900 dark:text-white capitalize">
          Trackers Configuration
        </h2>
      </div>
      <div className="flex flex-col lg:flex-row py-2 gap-x-4  rounded-xl mt-3 w-full">
        <div className=" bg-white dark:bg-gray-500 rounded-lg p-5 flex flex-col gap-y-4 lg:w-3/5">
          {/* <InputForm data={DATA} /> */}
          <DDF data={TEMP["schema"]} label="config" ref={formRef} flag={true}/>
          <Button onClick={handleSubmit}>submit</Button>
        </div>

        <div className="sticky top-0 flex justify-center border-box w-full bg-white dark:bg-gray-500 rounded-lg p-5 h-[75vh] ">
          <CodeBlock code="fdkjfhdhj" />
        </div>
      </div>
    </div>
  );
}
