"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import SignUpForm from "@/components/mf/forms/sign-up";
import { HomeBackground } from "@/components/mf/login/home";
import { Button } from "@/components/ui/button";
import {
  ResendOTPBodyType,
  ResendOTPError,
  SignUpBodyType,
  useResendOTP,
  useSignUp,
} from "@/queries";
import { OTPForm } from "@/components/mf/forms/OTP";
import { useVerifyOTP } from "@/queries/verify-otp";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { MFDivider } from "@/components/mf";
import { SocialLogin } from "@/components/mf/SocialLogin";

const SignUpPage = () => {
  return (
    <HomeBackground logo>
      <div className="flex flex-col items-center justify-center p-8 px-0 py-0">
        <div className="z-10 w-full rounded-lg bg-white p-8 shadow-lg">
          <SignUpFormCard />
        </div>
      </div>
    </HomeBackground>
  );
};

export default SignUpPage;

const SignUpFormCard: React.FC = () => {
  const router = useRouter();
  const [Form, setForm] = useState<"sign-up" | "otp">("sign-up");

  const onSignUpSuccess = useCallback((response: any) => {
    // verify OTP after sign up
    if (response.data?.user?.CodeDeliveryDetails?.DeliveryMedium === "EMAIL") {
      console.info("OTP Delivered to EMAIL");
      // Show OTP Form
      setForm("otp");
    }
  }, []);

  const signUpFn = useSignUp(console.debug, onSignUpSuccess);
  const otpFn = useVerifyOTP(console.log);

  const handleSignUpSubmit = useCallback((body: SignUpBodyType) => {
    // Trigger sign up API
    signUpFn.mutate({ body });
    sessionStorage.setItem("username", body.name);
  }, []);

  const handleVerifyOTP = (otp_code: string) => {
    const body = {
      username: sessionStorage.getItem("username") ?? "",
      otp_code,
    };
    console.log(body);
    otpFn.mutate({ body });
  };

  useEffect(() => {
    // Execute only if sign-up and otp is success
    if (!signUpFn.isSuccess || !otpFn.isSuccess) return;
    // on OTP verification success
    if (!otpFn.data?.data?.message) {
      toast({ title: "OTP Verification failed", variant: "destructive" });
    } else {
      toast({
        title: "OTP Verified successfully",
        description: "Redirecting to login page...",
      });
      setTimeout(() => {
        router.replace("/");
      }, 5000);
    }
  }, [otpFn.data]);

  const onResendOTPError = (e: ResendOTPError) =>
    toast({ title: e.message, variant: "destructive" });
  const onResendOTPSuccess = (d: any) => {
    toast({ title: d?.data?.message });
  };
  const ResendOTP = useResendOTP(onResendOTPError, onResendOTPSuccess);
  const handleResendOTP = () => {
    const body: ResendOTPBodyType = {
      username: sessionStorage.getItem("username") ?? "",
    };
    ResendOTP.mutate({ body });
  };

  if (Form === "otp")
    return (
      <OTPForm
        title="Verify E-mail"
        description="Please enter OTP shared in email"
        buttonText="Verify OTP"
        errorText={otpFn.error?.message}
        onSubmit={handleVerifyOTP}
        onResend={handleResendOTP}
      />
    );

  return (
    <>
      <div className="flex justify-between gap-2">
        <SocialLogin />
        <MFDivider direction="vertical" />
        <div>
          <SignUpForm
            // beforeForm={<h2 className="text-center text-header">Sign Up</h2>}
            buttonText={signUpFn.isLoading ? "Loading..." : "Sign Up"}
            onSubmit={handleSignUpSubmit}
            errorMessage={signUpFn.error?.message}
            afterForm={
              <div className="mt-4 flex flex-col items-center text-sm">
                <div className="flex items-center">
                  <span>Already have an account?</span>
                  <Link href="/" replace>
                    <Button variant="link" size="sm" className="m-0 h-fit p-0">
                      Log in
                    </Button>
                  </Link>
                </div>
              </div>
            }
          />
        </div>
      </div>
    </>
  );
};
