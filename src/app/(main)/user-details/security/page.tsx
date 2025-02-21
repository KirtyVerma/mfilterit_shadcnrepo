"use client";
import React from "react";
import { MFACard, ChangePassword } from "./components";

const SecurityPage = () => {
  return (
    <div className="grid gap-2 md:grid-cols-2">
      <MFACard />
      <ChangePassword />
    </div>
  );
};

export default SecurityPage;
