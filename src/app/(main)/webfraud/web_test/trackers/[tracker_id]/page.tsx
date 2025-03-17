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

  const formRef: any = useRef();
  // Dummy code to display on the right side
  function handleSubmit() {
    const formData = formRef?.current?.values;
    console.log("===>", formData);
    setstate((prev: any) => ({ ...prev, formData }));
  }

  const [t, sett] = useState();

  useEffect(() => {
    console.log(t);
  }, [t]);

  return (
    <div className="relative h-full py-2 px-8">
      <div className="px-8 py-5 bg-white dark:bg-gray-500 rounded-xl flex items-center justify-between">
        <h2 className="text-xl font-medium text-gray-900 dark:text-white capitalize">
          Trackers Configuration
        </h2>
      </div>
      <div className="flex flex-col lg:flex-row py-2 gap-x-4  rounded-xl mt-3 w-full">
        <div className="relative bg-white dark:bg-gray-500 rounded-lg p-5 flex flex-col gap-y-8  w-full">
          {/* <InputForm data={DATA} /> */}
          <DDF data={TEMP["schema"]} label="config" ref={formRef} />
          <div className=" p-3 rounded-xl flex justify-end gap-x-4">
            <Button className="w-1/5" onClick={formRef?.current?.reset}>Reset</Button>
            <Button className="w-1/5" onClick={handleSubmit}>submit</Button>
          </div>
        </div>

        <div className="sticky top-0 flex justify-center border-box bg-white dark:bg-gray-500 rounded-lg p-5 h-[75vh] lg:w-4/5">
          <CodeBlock code="fdkjfhdhj" />
        </div>
      </div>
    </div>
  );
}
