"use client";

import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";
import { trackCalBookingGoals } from "@/lib/cal-booking-goals";

/**
 * Inline Cal.com embed of the discovery-call booking page, themed dark to
 * sit on the site's black background.
 */
export function CalEmbed() {
  useEffect(() => {
    let cancelled = false;
    let stopTracking: (() => void) | undefined;

    (async () => {
      const cal = await getCalApi({ namespace: "discovery" });
      cal("ui", {
        theme: "dark",
        hideEventTypeDetails: false,
        layout: "month_view",
      });
      if (!cancelled) stopTracking = trackCalBookingGoals(cal, "call_page");
    })();

    return () => {
      cancelled = true;
      stopTracking?.();
    };
  }, []);

  return (
    <Cal
      namespace="discovery"
      calLink="pixelup/discovery"
      style={{ width: "100%", height: "100%" }}
      config={{ layout: "month_view", theme: "dark" }}
    />
  );
}
