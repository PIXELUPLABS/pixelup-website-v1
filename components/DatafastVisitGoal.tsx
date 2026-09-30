"use client";

import { useEffect } from "react";
import {
  buildDatafastMetadata,
  readCurrentAttribution,
  trackDatafastGoal,
} from "@/lib/datafast-client";

const SENT_STORAGE_KEY = "datafast:site_visited";

/** Sends a site_visited goal once per browsing session, from whichever page
    the visitor lands on. DataFast funnel pageview steps only match one exact
    URL, so this goal is the "visited any page" step of the booking funnel,
    and the funnel's referrer filter then splits it by source. */
export function DatafastVisitGoal() {
  useEffect(() => {
    try {
      if (sessionStorage.getItem(SENT_STORAGE_KEY)) return;
      sessionStorage.setItem(SENT_STORAGE_KEY, "1");
    } catch {
      // Storage blocked: send anyway. A repeat costs one event, and the
      // funnel counts unique visitors, so it can't inflate the numbers.
    }
    trackDatafastGoal(
      "site_visited",
      buildDatafastMetadata(readCurrentAttribution())
    );
  }, []);

  return null;
}
