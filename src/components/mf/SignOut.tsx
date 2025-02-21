"use client";
import React from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { SignOutBodyType, SignOutError, useSignOut } from "@/queries";
import { toast } from "@/hooks/use-toast";
import { Power } from "lucide-react";

const SignOutButton = () => {
  const router = useRouter();

  const onError = (e: SignOutError) => {
    toast({ title: e.message, variant: "destructive" });
  };
  const onSuccess = () => {
    router.replace("/");
  };

  const SignOut = useSignOut(onError, onSuccess);
  const onClick = () => {
    const body: SignOutBodyType = {
      access_token: sessionStorage.getItem("AccessToken") ?? "",
    };
    SignOut.mutate({ body });
  };
  return (
    <Button
      title="Log out"
      variant="ghost"
      size="icon"
      onClick={onClick}
      className="hover:bg-destructive hover:text-destructive-foreground"
    >
      <Power />
    </Button>
  );
};

export default SignOutButton;
