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

  const codeSnippet = `<script>
    (function(m, f, i, l, t, e, r) {
        m[t] = m[t] || function() {
            (m[t].q = m[t].q || []).push(arguments)
        }, m[t].l = 1 * new Date();
        e = f.createElement(l);
        e.async = 1;
        e.id = "mfilterit-visit-tag";
        e.src = i;
        r = f.getElementsByTagName(l)[0];
        r.parentNode.insertBefore(e, r);
    })(window, document, "script_url", "script", "mf");
        mf("mf_package_name", "web.test_package.cpv");
        mf("mf_tracking_type", "pageviews"); 
</script> `;

  return (
    <div className="py-2 px-8">
      <div className="px-8 py-5 bg-white rounded-xl flex items-center justify-between">
        <h2 className="text-xl font-medium text-gray-900 capitalize">
          Trackers Configuration
        </h2>
      </div>
      <div className="flex flex-col lg:flex-row py-2 gap-x-4  rounded-xl mt-3 w-full">
        <div className=" bg-white rounded-lg p-5 flex flex-col gap-y-4 lg:w-3/5">
          <InputForm data={DATA} cb={handleSubmit} />
        </div>

        <div className=" flex  w-full justify-center bg-white rounded-lg py-5">
          <CodeBlock code={codeSnippet} />
        </div>
      </div>
    </div>
  );
}
