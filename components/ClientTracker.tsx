"use client";
import { useEffect } from "react";
import { captureAttribution, track } from "@/lib/track";

export function ClientTracker() {
  useEffect(() => {
    captureAttribution();
    track("page_view");
  }, []);
  return null;
}
