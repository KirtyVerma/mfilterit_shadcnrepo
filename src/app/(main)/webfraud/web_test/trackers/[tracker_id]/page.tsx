"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "next/navigation";
import React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CodeBlock from "../../CodeBlock";

export default function TrackerConfig() {
  const packageName = useParams().package_name;

  const InputFields = {};
  // Dummy code to display on the right side

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
          create Trackers
        </h2>
      </div>
      <div className="flex flex-col lg:flex-row py-2 gap-x-4  rounded-xl mt-3 w-full">
        <div className=" bg-white rounded-lg p-5 flex flex-col gap-y-4 lg:w-3/5">
          <div className="flex items-center justify-between gap-x-5">
            <Label className="w-2/6">Package Name :</Label>
            <Input
              className=" w-4/6"
              placeholder="Enter tracker name"
              value={packageName}
              disabled
            />
          </div>
          <div className="flex items-center justify-between gap-x-5">
            <Label className="w-2/6">Tracker Type :</Label>
            <Select>
              <SelectTrigger className="w-4/6 capitalize">
                <SelectValue placeholder="impression" />
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
          <div className="flex items-center justify-between gap-x-5">
            <Label className="w-2/6">Setting 1 : </Label>
            <Input className="  w-4/6" placeholder="Setting 1" />
          </div>
          <div className="flex items-center justify-between gap-x-5">
            <Label className="w-2/6">Setting 2 : </Label>
            <Input className=" w-4/6" placeholder="Setting 2" />
          </div>
          <div className="flex justify-end">
            <Button className="capitalize mt-2 mb-5">Generate Tracker</Button>
          </div>
        </div>
        <div className=" flex  w-full justify-center bg-white rounded-lg py-5">
          <CodeBlock code={codeSnippet} />
        </div>
      </div>
    </div>
  );
}
