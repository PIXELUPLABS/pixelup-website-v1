"use client";

import { useEffect, useRef } from "react";
import {
  buildDatafastMetadata,
  buildTallyHiddenFields,
  readCurrentAttribution,
  readDatafastVisitorId,
  trackDatafastGoal,
  type TallyHiddenFields,
} from "@/lib/datafast-client";
import { TALLY_FORM_ID, tallyFormUrl } from "@/lib/tally";

interface TallyPopupOptions {
  layout: "modal";
  width: number;
  hiddenFields: TallyHiddenFields;
}

declare global {
  interface Window {
    Tally?: { openPopup: (formId: string, options?: TallyPopupOptions) => void };
  }
}

type TrackedTallyEvent = "Tally.FormLoaded" | "Tally.FormSubmitted";

interface TallyMessage {
  event: TrackedTallyEvent;
  payload: Record<string, unknown>;
}

const TALLY_ORIGIN = "https://tally.so";
const SUBMISSION_STORAGE_PREFIX = "datafast:audit_form_submitted:";
const inMemorySubmissionIds = new Set<string>();

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseTallyMessage(data: unknown): TallyMessage | null {
  let parsedData = data;

  if (typeof data === "string") {
    try {
      parsedData = JSON.parse(data);
    } catch {
      return null;
    }
  }

  if (!isRecord(parsedData) || !isRecord(parsedData.payload)) return null;
  if (
    parsedData.event !== "Tally.FormLoaded" &&
    parsedData.event !== "Tally.FormSubmitted"
  ) {
    return null;
  }

  return {
    event: parsedData.event,
    payload: parsedData.payload,
  };
}

function hasTrackedSubmission(submissionId: string) {
  if (inMemorySubmissionIds.has(submissionId)) return true;

  const storageKey = `${SUBMISSION_STORAGE_PREFIX}${submissionId}`;
  try {
    if (window.sessionStorage.getItem(storageKey)) {
      inMemorySubmissionIds.add(submissionId);
      return true;
    }
    window.sessionStorage.setItem(storageKey, "1");
  } catch {
    // The in-memory fallback still deduplicates while this page is mounted.
  }

  inMemorySubmissionIds.add(submissionId);
  return false;
}

/**
 * A link that opens the perception audit form in Tally's modal popup, on the
 * page you're already on. Used by the #audit section's AuditCta.
 *
 * The click handler opens Tally programmatically so it can pass attribution
 * hidden fields without competing with embed.js's delegated click listener.
 * If embed.js is still loading, the handler waits up to five seconds before
 * falling back to the hosted form in the same tab. With JavaScript disabled,
 * the anchor href remains the no-JS fallback.
 */
export function TallyPopupLink({
  className,
  children,
  onClick,
}: {
  className?: string;
  children: React.ReactNode;
  /** Runs before the popup logic — MobileMenu uses it to close the panel. */
  onClick?: () => void;
}) {
  const pollingInterval = useRef<number | null>(null);

  useEffect(() => {
    const handleTallyMessage = (messageEvent: MessageEvent<unknown>) => {
      if (messageEvent.origin !== TALLY_ORIGIN) return;

      const message = parseTallyMessage(messageEvent.data);
      if (!message || message.payload.formId !== TALLY_FORM_ID) return;

      const metadata = buildDatafastMetadata(readCurrentAttribution(), TALLY_FORM_ID);

      if (message.event === "Tally.FormLoaded") {
        trackDatafastGoal("audit_form_opened", metadata);
        return;
      }

      const submissionId = message.payload.id;
      if (typeof submissionId !== "string" || !submissionId) return;
      if (hasTrackedSubmission(submissionId)) return;

      trackDatafastGoal("audit_form_submitted", metadata);
    };

    window.addEventListener("message", handleTallyMessage);
    return () => {
      window.removeEventListener("message", handleTallyMessage);
      if (pollingInterval.current !== null) {
        window.clearInterval(pollingInterval.current);
      }
    };
  }, []);

  return (
    <a
      href={tallyFormUrl}
      aria-haspopup="dialog"
      className={className}
      onClick={(event) => {
        onClick?.();
        event.preventDefault();
        const attribution = readCurrentAttribution();
        const hiddenFields = buildTallyHiddenFields(
          attribution,
          readDatafastVisitorId()
        );
        const popupOptions: TallyPopupOptions = {
          layout: "modal",
          width: 600,
          hiddenFields,
        };

        trackDatafastGoal(
          "audit_cta_clicked",
          buildDatafastMetadata(attribution, TALLY_FORM_ID)
        );

        if (pollingInterval.current !== null) {
          window.clearInterval(pollingInterval.current);
          pollingInterval.current = null;
        }

        if (window.Tally) {
          window.Tally.openPopup(TALLY_FORM_ID, popupOptions);
          return;
        }

        // next/script in AuditCta has already requested embed.js — poll until
        // it lands, then open with the same configuration and hidden fields.
        const started = Date.now();
        pollingInterval.current = window.setInterval(() => {
          if (window.Tally) {
            window.clearInterval(pollingInterval.current ?? undefined);
            pollingInterval.current = null;
            window.Tally.openPopup(TALLY_FORM_ID, popupOptions);
          } else if (Date.now() - started > 5000) {
            window.clearInterval(pollingInterval.current ?? undefined);
            pollingInterval.current = null;
            window.location.assign(tallyFormUrl);
          }
        }, 100);
      }}
    >
      {children}
    </a>
  );
}
