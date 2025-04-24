import { Card, CardContent } from "@/components/ui/card";
import { ClipboardCheck, Copy, Loader2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const dummyCode = `<script>
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

interface CodeBlockProps {
  code?: string;
  language?: string;
  isloading?: boolean;
}
const CodeBlock = ({
  code,
  language = "javascript",
  isloading = false,
}: CodeBlockProps) => {
  const { toast } = useToast();
  const [copy, setcopy] = useState(false);
  const copyToClipboard = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setcopy(true);
    const toastObj = toast({
      description: "Tracker code copied to clipboard!",
      className: "bg-green-500 text-white",
    });
    setTimeout(() => {
      setcopy(false);
      toastObj.dismiss();
    }, 1000);
  };

  return (
    <>
      <Card
        className={`relative w-full max-w-3xl bg-[#1e1e1e] text-white border border-[#3c3c3c] rounded-lg overflow-auto ${!code && "overflow-hidden"} no- scrollbar`}
      >
        <CardContent className="relative p-4">
          <div className=" sticky top-0 bg-[#1e1e1e] border-b-2 border-gray-700 flex justify-between items-center mb-2">
            <span className="text-md text-gray-400 capitalize">{language}</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={copyToClipboard}>
                    {!copy ? (
                      <Copy className="w-4 h-4 text-gray-400 hover:text-white" />
                    ) : (
                      <ClipboardCheck className="w-4 h-4 text-gray-400 hover:text-white" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{"Copy"}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          {language === "url" ? (
            <p>{code}</p>
          ) : (
            <pre className="overflow-auto rounded-md p-3 bg-[#1e1e1e] text-sm font-mono leading-relaxed text-gray-300">
              {formatCode(code ? code : dummyCode)}
            </pre>
          )}
        </CardContent>
      </Card>
      {!code && (
        <div className="absolute capitalize rounded-lg top-0 h-full w-full flex justify-center items-center bg-white/10 backdrop-blur-[2px] text-white">
          {isloading ? (
            <span>
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </span>
          ) : (
            "Create Tracker to get preview"
          )}
        </div>
      )}
    </>
  );
};

export default CodeBlock;

const formatCode = (unstructuredCode:string) => {
  return unstructuredCode
    .replace(/(\{|\})/g, "\n$1\n") // Add new lines around braces
    .replace(/;/g, ";\n") // New line after semicolons
    .replace(/\n\s*\n/g, "\n") // Remove extra blank lines
    .replace(/\t/g, "  "); // Convert tabs to spaces
};
