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
<<<<<<< HEAD
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
=======

  const onSuccess = () => {
    // Clear all session storage items
    sessionStorage.clear();
    
    // Or clear specific items if you prefer
    // sessionStorage.removeItem("AccessToken");
    // sessionStorage.removeItem("IdToken");
    // sessionStorage.removeItem("IDToken");
    
    // Redirect to login page
    router.replace("/");
    router.refresh(); // Force a refresh to clear any cached data
  };

  const SignOut = useSignOut(onError, onSuccess);
  
  const onClick = () => {
    const accessToken = sessionStorage.getItem("AccessToken");
    if (!accessToken) {
      onSuccess(); // If no token, just clear and redirect
      return;
    }

    const body: SignOutBodyType = {
      access_token: accessToken
    };
    
    SignOut.mutate({ body });
  };

>>>>>>> d1452b7 (Initial commit)
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
