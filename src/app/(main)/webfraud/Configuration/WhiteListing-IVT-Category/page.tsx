"use client";
import React, { useEffect, useState } from "react";
import CardwithSwitch from "@/components/mf/CardwithSwitch";
import { usePackage } from "@/components/mf/PackageContext";
import { useApiCall } from "../../queries/api_base";
import Endpoint from "../../common/endpoint";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { MFTopBar } from "@/components/mf/MFTopBar";


interface WhiteListRule {
  rule_name: string;
  enabled: boolean;
}

interface WhiteListData {
  status: string;
  rules: WhiteListRule[];
}
interface WhiteListApiUpdate {
  status:string;
  message:string;
}

function WhiteListingIVTCategory() {
    const { selectedPackage } = usePackage();
    const [whiteListData, setWhiteListData] = useState<WhiteListData | null>(null);
    const [currentRuleName, setCurrentRuleName] = useState("");
    const [loadingIndex, setLoadingIndex] = useState<number | null>(null);

    const { toast } = useToast();


    // Redis Update API for switch changes
    const { result: redisUpdateApi } = useApiCall<WhiteListApiUpdate>({
        url: process.env.NEXT_PUBLIC_WEB_PERF + Endpoint.REDIS_API,
        method: "POST",
        params: {
            package_name: selectedPackage,
            rule_name: currentRuleName, // Now uses the currentRuleName state
        },  
        onSuccess: (response) => {
          toast({
            title: response.status,
            description: response.message,
            variant: "default", // or "destructive" based on response
            duration: 5000,
          });       
         },
        onError: (error) => {
            fetchWhiteList();
        },
    });

    const handleSwitchChange = async (index: number, checked: boolean) => {
      if (whiteListData && whiteListData.rules[index]) {
        const updatedRules = [...whiteListData.rules];
        const currentRule = updatedRules[index];
        setCurrentRuleName(currentRule.rule_name); // Add this line to update currentRuleName
    
        // Optimistically update UI
        updatedRules[index].enabled = checked;
        setWhiteListData({ ...whiteListData, rules: updatedRules });
    
        // Set which switch is loading
        setLoadingIndex(index);
    
        // Call API
        if ('mutate' in redisUpdateApi) {
          await redisUpdateApi.mutate(
            {
              package_name: selectedPackage,
              rule_name: currentRule.rule_name,
              enabled: checked,
            },
            {
              onSettled: () => {
                setLoadingIndex(null); // Reset after API completes
              },
            }
          );
        }
      }
    };
    

    const{result:WhiteList,loading:whiteListLoading} = useApiCall<WhiteListData>({
        url: process.env.NEXT_PUBLIC_WEB_PERF + Endpoint.REDIS_GET_API,
        method: "POST",
        params: {
            package_name: selectedPackage,
        },
        onSuccess: (response) => {
          setWhiteListData([]);
            if (response?.rules && Array.isArray(response.rules)) {
                const updatedTop = response.rules.map((topItem: any) => ({
                    rule_name: topItem.rule_name,
                    enabled: topItem.enabled,
                }));
                setWhiteListData({ status: response.status, rules: updatedTop });
            }
        },
        onError: (error) => {
        },
    });

    const fetchWhiteList = () => {
        if ('mutate' in WhiteList) {
            WhiteList.mutate({});
        }
    };

    useEffect(() => {
        if(selectedPackage)
        fetchWhiteList();
    }, [selectedPackage]);

    return (
    
        <div className=" grid grid-cols-1 gap-2 justify-center items-center w-full max-w-2xl mx-auto  py-10">
            <Card className="shadow-md rounded-lg overflow-y-auto scrollbar">
              <CardContent className="min-h-[500px]">
                <CardwithSwitch
                    Title="Fraud Category"
                    Sub_title={whiteListData?.rules?.map(rule => rule.rule_name)}
                    enabledStates={whiteListData?.rules?.map(rule => rule.enabled)}
                    onSwitchChange={handleSwitchChange}
                    loadingIndex={loadingIndex as number | undefined}
                    isSelect={false}
                    isLoading={whiteListLoading}
                />
                </CardContent>
            </Card>
        </div>
    );
}

export default WhiteListingIVTCategory;
