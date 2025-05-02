"use client";
import React from "react";
import CardwithSwitch from "@/components/mf/CardwithSwitch";


const  subTitle =["High","Medium","Low"];
const  subTitle1 =["Green","Yellow","Red"];

const high =["Not Fraud","Click Injection","Punched Lead"];
const medium=["Ip Repeat","VPN Proxy"];
const low = ["Behaviour Fraud","Pop Under","Server Farm","Imperceptible Window","Device Repetition","Geo Fraud","Timezone Fraud","Device Spoofing","VPN Proxy","Deprecated OS","Distribution Fraud","Deprecated Browser","Blacklisted UA","Click Spamming","Mouse Click Pattern"];

// Map values based on subtitle
const getFraudCategories = (subtitle: string) => {
  switch (subtitle) {
    case "High":
      return {
        title: subtitle,
        options: ["Not Fraud", "Click Injection", "Punched Lead"]
      };
    case "Medium":
      return {
        title: subtitle,
        options: medium
      };
    case "Low":
      return {
        title: subtitle,
        options: low
      };
      case "Green":
      return {
        title: subtitle,
        options: ["Not Fraud", "Click Injection", "Punched Lead"]
      };
    case "Yellow":
      return {
        title: subtitle,
        options: medium
      };
    case "Red":
      return {
        title: subtitle,
        options: low
      };
    default:
      return {
        title: subtitle,
        options: []
      };
  }
};

function CallRecommendation() {
  return (
    <div className=" grid grid-cols-2 gap-4 justify-center items-center w-full max-w-4xl mx-auto px-4 py-14 mt-9 p-2">
      <div className="p-2" >
        <CardwithSwitch
          Title="Call Recommendation"
          Sub_title={subTitle}
          Placeholder="Select Fraud Sub Category"
          value={subTitle.map(title => ({
            title: title,
            options: getFraudCategories(title).options
          }))}
          isSelect={true}
          direction="rows"
        />
        </div>

        <div className="p-2">
        <CardwithSwitch
          Title="Media Risk Score"
          Sub_title={subTitle1}
          Placeholder="Select Fraud Sub Category"
          value={subTitle1.map(title => ({
            title: title,
            options: getFraudCategories(title).options
          }))}
          isSelect={true}
          direction="rows"
        />
      </div>
    </div>
  );
}

export default CallRecommendation;
