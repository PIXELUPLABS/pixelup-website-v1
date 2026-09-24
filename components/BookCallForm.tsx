"use client";

import { getCalApi } from "@calcom/embed-react";
import Image from "next/image";
import { useState } from "react";
import { links } from "@/lib/projects";
import { ctaButtonBase, ctaButtonPadding } from "./cta-button-styles";

type CalApi = Awaited<ReturnType<typeof getCalApi>>;

// Own namespace so the popup never collides with the inline CalEmbed on /call.
const CAL_NAMESPACE = "discovery-popup";
const calConfig = { layout: "month_view", theme: "dark" } as const;

// getCalApi resolves straight away with a stub that queues commands until
// embed.js arrives, so a blocked script (ad blocker, strict network) would
// swallow the modal silently. Watch the script tag and fall back to the hosted
// booking page when it fails.
let calApi: CalApi | null = null;
let calLoading = false;
let embedFailed = false;

/** Loads the Cal embed on first interaction instead of on every page load. */
function warmCal() {
  if (calLoading) return;
  calLoading = true;
  void getCalApi({ namespace: CAL_NAMESPACE }).then((api) => {
    api("ui", { ...calConfig, hideEventTypeDetails: false });
    document
      .querySelector('script[src*="cal.com/embed/embed.js"]')
      ?.addEventListener("error", () => {
        embedFailed = true;
      });
    calApi = api;
  });
}

/**
 * Email field + "Book a call" submit in one row. Submitting opens the Cal.com
 * booking popup with the email prefilled; an empty field still opens it, and
 * the browser blocks a malformed address via type="email".
 */
export function BookCallForm({
  label = "BOOK A CALL",
  bookingUrl = links.discoveryCall,
}: {
  label?: string;
  /** A cal.com booking URL; its path is the embed's calLink. */
  bookingUrl?: string;
}) {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = email.trim();
    const url = new URL(bookingUrl);

    if (value) {
      // Logged to the Google Sheet (app/api/book-call). Fire-and-forget: the
      // booking popup must never wait on, or fail because of, the sheet.
      void fetch("/api/book-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value, page: window.location.pathname }),
        keepalive: true,
      }).catch(() => {});
    }

    if (calApi && !embedFailed) {
      calApi("modal", {
        calLink: url.pathname.slice(1),
        config: value ? { ...calConfig, email: value } : calConfig,
      });
      return;
    }

    if (value) url.searchParams.set("email", value);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <form
      onSubmit={handleSubmit}
      onFocus={warmCal}
      onPointerEnter={warmCal}
      // Gap rather than a joined field + button: butted together, the two 2px
      // radii notched the seam and the focus border wrapped into the button.
      // 10px matches the gap between the stacked CTAs above.
      className="flex gap-2.5"
    >
      {/* 16px on mobile so iOS Safari doesn't zoom the page on focus. */}
      <input
        type="email"
        name="email"
        autoComplete="email"
        placeholder="Your work email"
        aria-label="Your work email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="min-w-0 flex-1 rounded-[2px] border-[0.5px] border-transparent bg-button-dark px-3 text-[16px] text-white placeholder:text-white/40 focus:border-accent focus:outline-none desk:text-[14px]"
      />
      <button
        type="submit"
        className={`${ctaButtonBase} ${ctaButtonPadding} shrink-0 cursor-pointer gap-3 bg-accent text-white hover:brightness-110`}
      >
        <span>{label}</span>
        <Image
          src="/media/Container.svg"
          alt=""
          width={14}
          height={14}
          aria-hidden="true"
        />
      </button>
    </form>
  );
}
