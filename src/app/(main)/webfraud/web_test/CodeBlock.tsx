import { useState } from "react";
import { Copy } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface CodeBlockProps {
  code: string;
}

const CodeBlock = ({ code }: CodeBlockProps) => {
  const { toast } = useToast();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    const toastObj = toast({
      description: "Tracker code copied to clipboard!",
      className: "bg-green-500 text-white"
    });

    setTimeout(() => {
      toastObj.dismiss();
    }, 1000);
  };

  return (
    <Card className="relative w-full max-w-3xl bg-[#1e1e1e] text-white border border-[#3c3c3c] rounded-lg">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-md text-gray-400 capitalize">js</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={copyToClipboard}>
                  <Copy className="w-4 h-4 text-gray-400 hover:text-white" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{"Copy"}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <pre className="overflow-auto rounded-md p-3 bg-[#1e1e1e] text-sm font-mono leading-relaxed text-gray-300">
          {code}
        </pre>
      </CardContent>
    </Card>
  );
};

export default CodeBlock;
