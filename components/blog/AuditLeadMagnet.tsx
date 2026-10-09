"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowIcon } from "@/components/ArrowIcon";
import { ctaButtonBase, ctaButtonPadding } from "@/components/cta-button-styles";
import { trackDatafastGoal } from "@/lib/datafast-client";
import auditFormBg from "@/public/media/audit-form-bg.png";
import auditFormPattern from "@/public/media/audit-form-pattern.svg";
import dakshImg from "@/public/media/daksh-avatar.jpg";

// Brand perception audit popup, mounted on /blog/[slug] only — that's where
// most of the traffic lands. Requests go to app/api/audit-lead, which logs them
// to the "Brand Audit Lead Magnet" tab of the Website Leads sheet.
//
// Visually it's the AuditForm section folded into a dialog: the same gradient +
// pattern panel and Daksh byline, the same two-tone headline, and the white
// audit colorway on the button (accent stays with Book a call).

const STORAGE_KEY = "pixelup:audit-popup";
/** A dismissal keeps it away this long; a submission keeps it away for good. */
const DISMISS_DAYS = 7;
/** Scroll-depth trigger: past this share of the article, after MIN_DWELL_MS. */
const SCROLL_DEPTH = 0.25;
const MIN_DWELL_MS = 6_000;
/** Desktop exit intent only arms after this long, so a bounce doesn't trip it. */
const EXIT_INTENT_DELAY_MS = 5_000;
/** `?audit-popup=1` opens it straight away for review: storage is ignored and
    nothing is tracked or stored, though a submit still reaches the sheet. */
const FORCE_PARAM = "audit-popup";

const fieldWrapClassName =
  "w-full border-b-[0.5px] border-hairline pb-2 focus-within:border-accent";
// 16px on mobile so iOS Safari doesn't zoom the page on focus.
const fieldClassName =
  "w-full bg-transparent text-[16px] font-normal text-white placeholder:text-white/40 focus:outline-none desk:text-[14px]";

const initialValues = { name: "", email: "", website: "" };

type FieldName = keyof typeof initialValues;
type Status = "idle" | "submitting" | "success" | "error";

type Stored = { submitted: true } | { dismissedAt: number };

function readStored(): Stored | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Stored) : null;
  } catch {
    return null;
  }
}

function writeStored(value: Stored) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // Private mode or blocked storage: it'll just be eligible again next visit.
  }
}

function isSuppressed() {
  const stored = readStored();
  if (!stored) return false;
  if ("submitted" in stored) return true;
  return Date.now() - stored.dismissedAt < DISMISS_DAYS * 24 * 60 * 60 * 1000;
}

export function AuditLeadMagnet() {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [status, setStatus] = useState<Status>("idle");
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const shownRef = useRef(false);
  /** Opened via FORCE_PARAM: kept out of DataFast and localStorage. */
  const forcedRef = useRef(false);

  const show = useCallback((trigger: "scroll" | "exit_intent" | "forced") => {
    if (shownRef.current) return;
    shownRef.current = true;
    forcedRef.current = trigger === "forced";
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    setOpen(true);
    if (!forcedRef.current) {
      trackDatafastGoal("audit_popup_shown", {
        page: window.location.pathname,
        trigger,
      });
    }
  }, []);

  // Triggers: scroll depth (after a minimum dwell) on every device, plus exit
  // intent on desktop pointers. Whichever fires first wins; it shows once per
  // page view at most.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).has(FORCE_PARAM)) {
      show("forced");
      return;
    }
    if (isSuppressed()) return;

    const startedAt = Date.now();

    const checkDepth = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      if (scrollable > 0 && window.scrollY / scrollable >= SCROLL_DEPTH) show("scroll");
    };

    const onScroll = () => {
      if (Date.now() - startedAt >= MIN_DWELL_MS) checkDepth();
    };

    // A reader who passed the depth mark early and has stopped scrolling would
    // otherwise wait for their next scroll, so check once when the dwell ends.
    const dwellTimer = window.setTimeout(checkDepth, MIN_DWELL_MS);

    const onMouseOut = (event: MouseEvent) => {
      if (Date.now() - startedAt < EXIT_INTENT_DELAY_MS) return;
      // Leaving through the top edge, toward the tabs or address bar.
      if (!event.relatedTarget && event.clientY <= 0) show("exit_intent");
    };

    const finePointer = window.matchMedia("(pointer: fine)").matches;
    window.addEventListener("scroll", onScroll, { passive: true });
    if (finePointer) document.addEventListener("mouseout", onMouseOut);
    return () => {
      window.clearTimeout(dwellTimer);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseout", onMouseOut);
    };
  }, [show]);

  const close = useCallback(() => {
    setOpen(false);
    // Closing after a successful submit isn't a dismissal — storage already
    // says "submitted", which keeps it away for good.
    if (status !== "success" && !forcedRef.current) {
      writeStored({ dismissedAt: Date.now() });
      trackDatafastGoal("audit_popup_dismissed", { page: window.location.pathname });
    }
    returnFocusRef.current?.focus?.();
  }, [status]);

  // On open only: lock page scroll and put focus in the first field. Kept apart
  // from the key handler below, which re-binds whenever `close` changes — that
  // would otherwise yank focus back to the name field on every status change.
  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    firstFieldRef.current?.focus({ preventScroll: true });
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [open]);

  // While open: Escape closes, and Tab keeps cycling inside the dialog.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), a[href]'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, close]);

  const handleChange = (field: FieldName) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }));
    if (status === "error") setStatus("idle");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "submitting") return;

    setStatus("submitting");
    try {
      const res = await fetch("/api/audit-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, page: window.location.pathname }),
      });
      if (!res.ok) throw new Error("Submit failed");
      setStatus("success");
      if (!forcedRef.current) {
        writeStored({ submitted: true });
        trackDatafastGoal("audit_popup_submitted", { page: window.location.pathname });
      }
    } catch {
      setStatus("error");
    }
  };

  if (!open) return null;

  const firstName = values.name.trim().split(/\s+/)[0];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center desk:items-center desk:p-5">
      {/* MobileMenu's scrim + the explorations lightbox's blur. Clicking it counts as a dismissal. */}
      <button
        type="button"
        aria-label="Close"
        tabIndex={-1}
        onClick={close}
        className="absolute inset-0 cursor-default bg-scrim backdrop-blur-md"
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="audit-popup-title"
        aria-describedby="audit-popup-description"
        className="fade-up relative flex max-h-[calc(100dvh-24px)] w-full flex-col overflow-y-auto border-t-[0.5px] border-hairline bg-base desk:max-h-[calc(100dvh-40px)] desk:w-190 desk:flex-row desk:overflow-hidden desk:border-[0.5px]"
      >
        {/* Left on desktop, a short band on top on mobile: AuditForm's
            gradient + 10% pattern, with the founder byline. */}
        <div className="relative h-28 shrink-0 desk:h-auto desk:w-70">
          <Image src={auditFormBg} alt="" fill sizes="(min-width: 1200px) 280px, 100vw" className="object-cover" />
          <Image src={auditFormPattern} alt="" fill className="object-cover opacity-10" />
          <div className="relative flex h-full items-end gap-3 p-5 desk:flex-col desk:items-start desk:justify-between desk:p-6">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-white desk:h-12 desk:w-12">
              <Image src={dakshImg} alt="Daksh Aswal" fill sizes="48px" className="object-cover" />
            </div>
            <div className="flex flex-col text-[14px] desk:text-[16px]">
              <p className="font-normal text-white">Daksh Aswal</p>
              <p className="font-normal text-white/60">Founder at PIXELUP LABS</p>
            </div>
          </div>
        </div>

        <div className="relative flex min-w-0 flex-1 flex-col gap-8 p-5 desk:p-8">
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute top-3 right-3 flex h-9 w-9 cursor-pointer items-center justify-center text-white/60 transition-colors hover:text-white desk:top-4 desk:right-4"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>

          {status === "success" ? (
            <div className="flex flex-1 flex-col justify-between gap-8 pt-6">
              <div className="flex flex-col gap-3">
                <p className="text-[12px] font-medium uppercase text-label-grey">Request received</p>
                <p
                  id="audit-popup-title"
                  className="tracking-display text-[24px] font-medium leading-[120%] text-white desk:text-[28px]"
                >
                  Thanks{firstName ? `, ${firstName}` : ""}. We&apos;re on it.
                </p>
                <p id="audit-popup-description" className="text-[14px] leading-[150%] text-white/60">
                  We&apos;ll review your site the way an enterprise buyer would and send
                  the audit to {values.email.trim()}.
                </p>
              </div>
              <button
                type="button"
                onClick={close}
                className={`${ctaButtonBase} ${ctaButtonPadding} w-full cursor-pointer gap-8 bg-button-dark text-white hover:bg-white/[0.12]`}
              >
                <span>BACK TO THE ARTICLE</span>
                <ArrowIcon />
              </button>
            </div>
          ) : (
            <>
              {/* pr-8 keeps the copy clear of the close button. */}
              <div className="flex flex-col gap-3 pr-8">
                <p className="text-[12px] font-medium uppercase text-label-grey">
                  Brand perception audit
                </p>
                {/* Same two-tone line as the AuditForm section: setup at
                    white/60, punch line at full white. */}
                <p
                  id="audit-popup-title"
                  className="tracking-display text-[24px] font-medium leading-[120%] text-white desk:text-[28px]"
                >
                  <span className="text-white/60">
                    Your product is <span className="inline-block">enterprise-ready.</span>
                  </span>
                  <br />
                  Does your brand say so?
                </p>
                <p id="audit-popup-description" className="text-balance text-[14px] leading-[150%] text-white/60">
                  Send us your site. We&apos;ll review it the way an enterprise buyer
                  would, and tell you honestly what we&apos;d change.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className={fieldWrapClassName}>
                  <input
                    ref={firstFieldRef}
                    type="text"
                    name="name"
                    autoComplete="name"
                    required
                    placeholder="Your name"
                    aria-label="Your name"
                    value={values.name}
                    onChange={handleChange("name")}
                    disabled={status === "submitting"}
                    className={fieldClassName}
                  />
                </div>
                <div className={fieldWrapClassName}>
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    placeholder="Your work email"
                    aria-label="Your work email"
                    value={values.email}
                    onChange={handleChange("email")}
                    disabled={status === "submitting"}
                    className={fieldClassName}
                  />
                </div>
                <div className={fieldWrapClassName}>
                  {/* type="text", not "url": the browser's url check rejects
                      a bare "acme.com", which is how most people type it. The
                      API route normalizes it. */}
                  <input
                    type="text"
                    name="website"
                    inputMode="url"
                    autoComplete="url"
                    autoCapitalize="none"
                    spellCheck={false}
                    required
                    placeholder="Your website (e.g. acme.com)"
                    aria-label="Your website"
                    value={values.website}
                    onChange={handleChange("website")}
                    disabled={status === "submitting"}
                    className={fieldClassName}
                  />
                </div>

                <div className="mt-3 flex flex-col gap-3">
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className={`${ctaButtonBase} ${ctaButtonPadding} w-full cursor-pointer gap-8 bg-white text-black hover:bg-white/90 disabled:cursor-wait disabled:opacity-60`}
                  >
                    <span>{status === "submitting" ? "SENDING…" : "GET MY AUDIT"}</span>
                    <ArrowIcon />
                  </button>
                  {status === "error" ? (
                    <p role="alert" className="text-[12px] text-red-400">
                      Something went wrong. Please try again.
                    </p>
                  ) : (
                    <p className="text-[12px] text-label-grey">No call needed.</p>
                  )}
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
