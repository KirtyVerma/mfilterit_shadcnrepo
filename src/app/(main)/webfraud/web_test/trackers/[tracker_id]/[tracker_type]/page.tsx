"use client";
import React from "react";
import EditVideoTracker from "./video_display/editVideoTracker";
import EditOtherTracker from "./others/editOtherTracker";
import { useParams } from "next/navigation";
import EditDisplayTracker from "./video_display/editDisplayTracker";
export default function Tracker() {
  const tracker_type = useParams().tracker_type;
  if (tracker_type === "vast") {
    return <EditVideoTracker />;
  } else if (tracker_type === "display") {
    return <EditDisplayTracker />;
  } else {
    return <EditOtherTracker />;
  }
}
