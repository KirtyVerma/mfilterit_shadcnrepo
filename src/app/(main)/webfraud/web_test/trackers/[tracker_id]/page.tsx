"use client";

import { useParams } from "next/navigation";
import React from "react";
import CodeBlock from "../../CodeBlock";
import InputForm from "../../Form";

export default function TrackerConfig() {
  const packageName = useParams().package_name;
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

  // Dummy code to display on the right side
  function handleSubmit(values: any) {
    console.log("Trackers Configuration Form Data:", values);
  }


  return (
    <div className="relative h-full py-2 px-8">
      <div className="px-8 py-5 bg-white rounded-xl flex items-center justify-between">
        <h2 className="text-xl font-medium text-gray-900 capitalize">
          Trackers Configuration
        </h2>
      </div>
      <div className="flex flex-col lg:flex-row py-2 gap-x-4  rounded-xl mt-3 w-full">
        <div className=" bg-white rounded-lg p-5 flex flex-col gap-y-4 lg:w-3/5">
          <InputForm data={DATA} cb={handleSubmit} />
        </div>

        <div className="sticky top-0 flex justify-center border-box w-full bg-white rounded-lg p-5 h-[75vh] ">
          <CodeBlock code = "fdkjfhdhj"/>
        </div>
      </div>
    </div>
  );
}
