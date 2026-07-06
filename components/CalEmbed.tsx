"use client";

import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

/**
 * Inline Cal.com embed of the discovery-call booking page, themed dark to
 * sit on the site's black background.
 */
export function CalEmbed() {
  useEffect(() => {
    (async () => {
      const cal = await getCalApi({ namespace: "discovery" });
      cal("ui", {
        theme: "dark",
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
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
