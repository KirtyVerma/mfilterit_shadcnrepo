"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import React, { useEffect, useState } from "react";
import { Copy, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetSoftwareToken } from "@/queries/get-software-token";
import { toast } from "@/hooks/use-toast";
import { useVerifySoftwareToken } from "@/queries/verify-software-token";
import { useSetMFAPreference } from "@/queries";
import { useIsMFA } from "@/queries/is-mfa";

export const MFACard = () => {
  const IsMFA = useIsMFA();
  const [Enable, setEnable] = useState(false);
  const onSetMFAPreferenceError = console.warn;
  const onSetMFAPreferenceSuccess = (d) => {
    console.log(d);
    IsMFA.refetch();
  };
  const SetMFAPreference = useSetMFAPreference(
    onSetMFAPreferenceError,
    onSetMFAPreferenceSuccess,
  );
  const disableMFA = () => {
    const body = {
      access_token:
        typeof window === "object" ? sessionStorage.getItem("AccessToken") : "",
      enable_sms_mfa: false,
      enable_software_token_mfa: false,
      enable_email_mfa: false,
    };
    SetMFAPreference.mutate({ body });
  };
  console.log(IsMFA.data);
  useEffect(() => {
    if (IsMFA.data?.enabled_streams) setEnable(true);
  }, [IsMFA.data]);
  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle>MFA</CardTitle>
        <CardDescription>Enable for extra security</CardDescription>
        <Button
          variant="ghost"
          size="icon"
          title={!Enable ? "Please enable MFA from below" : "Delete MFA"}
          className="absolute right-0 m-4"
          disabled={!Enable}
          onClick={() => {
            if (Enable) disableMFA();
          }}
        >
          <Trash2 />
        </Button>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AuthenticatorAccordion
            isEnabled={IsMFA.data?.enabled_streams?.includes(
              "SOFTWARE_TOKEN_MFA",
            )}
          />
        </Accordion>
      </CardContent>
    </Card>
  );
};

function AuthenticatorAccordion({ isEnabled }: { isEnabled: boolean }) {
  const [OTP, setOTP] = useState("");
  const IsMFA = useIsMFA();
  // generate token on expand
  const token = useGetSoftwareToken(!isEnabled);
  const onVerifySoftwareTokenSuccess = (d: any) =>
    toast({ title: d?.data?.message });
  const onSetMFAPreferenceSuccess = (d: any) => {
    toast({ title: d?.data?.message });
    IsMFA.refetch();
  };
  const SetMFAPreference = useSetMFAPreference(
    console.debug,
    onSetMFAPreferenceSuccess,
  );
  const VerifySoftwareToken = useVerifySoftwareToken(
    onVerifySoftwareTokenSuccess,
  );

  const handleVerifySoftwareToken = () => {
    if (OTP.length < 6) {
      toast({ title: "Enter OTP", variant: "destructive" });
      return;
    }
    const body = {
      access_token:
        typeof window === "object" ? sessionStorage.getItem("AccessToken") : "",
      user_code: OTP,
    };
    VerifySoftwareToken.mutate({ body });
  };

  useEffect(() => {
    // if(!VerifySoftwareToken.)
    if (VerifySoftwareToken.error)
      toast({ title: VerifySoftwareToken.error?.message });
    else if (VerifySoftwareToken.data) {
      // toast({ title: VerifySoftwareToken.data.data.message });
      const body = {
        access_token:
          typeof window === "object"
            ? sessionStorage.getItem("AccessToken")
            : "",
        enable_software_token_mfa: true,
      };
      SetMFAPreference.mutate({ body });
    }
  }, [VerifySoftwareToken.data, VerifySoftwareToken.error]);
  switch (isEnabled) {
    case true:
      return (
        <AccordionItem value="item-1">
          <AccordionTrigger>Authenticator App</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-2">
            <p>Already enabled</p>
          </AccordionContent>
        </AccordionItem>
      );
    case false:
    default:
      return (
        <AccordionItem value="item-1">
          <AccordionTrigger>Authenticator App</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-2">
            <p>1. Enter the below token in the preferred MFA App</p>
            <div className="flex justify-between rounded-md bg-slate-200 p-2 dark:bg-slate-700">
              <span className="overflow-x-auto">
                {token.isLoading ? "Loading..." : token.data?.secret_code}
              </span>
              <Button
                variant="ghost"
                size="icon-xs"
                className="h-fit"
                title="Click to copy"
                onClick={() => {
                  navigator.clipboard.writeText(token.data?.secret_code ?? "");
                  toast({ title: "Copied to clipboard" });
                }}
              >
                <Copy className="text-gray-700 dark:text-gray-300" size={20} />
              </Button>
            </div>
            <p>2. Enter Code from App</p>
            <InputOTP maxLength={6} name="otp" onChange={setOTP}>
              <InputOTPGroup className="ml-auto">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup className="mr-auto">
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <Button
              className="ml-auto mr-1 w-fit rounded-full"
              size="sm"
              onClick={handleVerifySoftwareToken}
            >
              Submit
            </Button>
          </AccordionContent>
        </AccordionItem>
      );
  }
}
