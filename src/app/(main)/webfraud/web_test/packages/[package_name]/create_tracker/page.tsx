"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "next/navigation";
import React from "react";
import CodeBlock from "../../../CodeBlock";

export default function CreateTracker() {
  const [copied, setCopied] = React.useState(false);
  const packageName = useParams().package_name;
  const { toast } = useToast();

 
  // Dummy code to display on the right side
  const dummyCode = `const tracker = { name: "${packageName}", type: "Impression" };`;
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

  // const handleCopy = () => {

  //   const textArea = document.createElement('textarea');
  //   textArea.value = dummyCode;
  //   document.body.appendChild(textArea);
  //   textArea.select();
  //   document.execCommand('copy');
  //   document.body.removeChild(textArea);
  //   const toastObj = toast({
  //     description: "Tracker code copied to clipboard!",
  //     className: "bg-green-500 text-white"
  //   });

  //   setTimeout(() => {
  //     toastObj.dismiss();
  //   }, 1000);
  //   //alert('Tracker code copied to clipboard!');
  // };

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippet).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1000); 
    });
  };


  return (
    <div className="py-2 px-8">
      <div className="px-8 py-5 bg-white rounded-xl flex items-center justify-between">
        <h2 className="text-xl font-medium text-gray-900 capitalize">
          create Trackers
        </h2>
      </div>
      <div className="flex flex-col gap-2 lg:flex-row px-3 py-2 gap-x-4  rounded-xl mt-5">
        <div className="w-full bg-white rounded-lg p-5">
          <div>
            <div><Label className="ml-2">Package Name </Label></div>
            <div><Input className="ml-1 mt-2 w-[200px]" placeholder="Enter tracker name" value={packageName} disabled /></div>
          </div>
          <div className="mt-3">
            <div><Label className="ml-2">Tracker Type </Label></div>
            <div> <select className="ml-1 mt-2 p-2 text-sm border rounded-md w-[200px]">
              <option value="Impression">Impression</option>
              <option value="Visit">Visit</option>
              <option value="Click">Click</option>
              <option value="Event">Event</option>
              <option value="S2s">S2s</option>
            </select></div>
          </div>
          <div className="mt-3">
            <div><Label className="ml-2">Setting 1 : </Label></div>
            <div><Input className="ml-1  w-[200px]" placeholder="Setting 1" /></div>
          </div>
          <div className="mt-3">
            <div><Label className="ml-2">Setting 2 : </Label></div>
            <div><Input className="ml-1 w-[200px]" placeholder="Setting 2" /></div>
          </div>

          <div className="flex justify-end">
            <Button className="capitalize mt-2 mb-5">Generate Tracker</Button>
          </div>
        </div>
        <div className=" flex flex-col w-full bg-white rounded-lg p-3">
          <div className="">
          <pre className="text-sm">
            <CodeBlock code={codeSnippet}/>
          </pre>
          </div>
          <div className="flex flex-end">
            
          </div>

        </div>
      </div>
    </div>
  );
}
