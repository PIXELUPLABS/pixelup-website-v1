"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { ArrowIcon } from "@/components/ArrowIcon";
import { ctaButtonBase, ctaButtonPadding } from "@/components/cta-button-styles";
import { Dialog } from "@/components/Dialog";
import { trackDatafastGoal } from "@/lib/datafast-client";
import { playbooks, type PlaybookId } from "@/lib/playbooks";
import { checkWorkEmailInput } from "@/lib/work-email";
import panelBg from "@/public/media/audit-form-bg.png";
import panelPattern from "@/public/media/audit-form-pattern.svg";
import coverImg from "@/public/media/playbook/enterprise-homepage-cover-01.jpg";
import mosaicImg from "@/public/media/playbook/enterprise-homepage-mosaic-01.jpg";

// Inline lead-magnet CTA for blog posts: a banner between two sections of the
// article that opens a full-page request dialog (name + work email). Requests
// go to app/api/playbook-lead, which emails the PDF and logs the request to
// the "Playbook Requests" tab of the Website Leads sheet.
//
// The banner follows the playbook's own cover (title left, the cover's wall
// of homepages right) on AuditForm's gradient + 10% pattern panel, the same
// panel the request dialog puts behind the cover. Its button takes AuditCta's
// white colorway: accent stays with Book a call, the page's one primary action.

const fieldWrapClassName =
  "w-full border-b-[0.5px] border-hairline pb-3 focus-within:border-white";
// 16px so iOS Safari doesn't zoom the page on focus.
const fieldClassName =
  "w-full bg-transparent text-[16px] font-normal text-white placeholder:text-white/40 focus:outline-none";

const initialValues = { name: "", email: "" };

type FieldName = keyof typeof initialValues;
type Status = "idle" | "submitting" | "success" | "error";

export function PlaybookCta({ id = "enterprise-homepage" }: { id?: PlaybookId }) {
  const playbook = playbooks[id];
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [status, setStatus] = useState<Status>("idle");
  const titleId = useId();
  const nameRef = useRef<HTMLInputElement>(null);

  // showModal() puts focus on the first focusable element, the close button.
  // This runs after Dialog's own effect (child effects first), so the name
  // field takes it instead.
  useEffect(() => {
    if (open) nameRef.current?.focus({ preventScroll: true });
  }, [open]);

  const show = () => {
    setOpen(true);
    trackDatafastGoal("playbook_cta_clicked", {
      page: window.location.pathname,
      playbook: id,
    });
  };

  // The native <dialog> hands focus back to the button that opened it.
  const close = () => setOpen(false);

  const handleChange = (field: FieldName) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }));
    if (field === "email") checkWorkEmailInput(e.target);
    if (status === "error") setStatus("idle");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "submitting") return;

    setStatus("submitting");
    try {
      const res = await fetch("/api/playbook-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, playbook: id, page: window.location.pathname }),
      });
      if (!res.ok) throw new Error("Submit failed");
      setStatus("success");
      trackDatafastGoal("playbook_requested", {
        page: window.location.pathname,
        playbook: id,
      });
    } catch {
      setStatus("error");
    }
  };

  const firstName = values.name.trim().split(/\s+/)[0];

  return (
    <>
      {/* The playbook's cover layout on the site's blue: the title on the
          left, the cover's wall of homepages on the right, running edge to
          edge and off the top and bottom. Below 700px the wall becomes a
          band above the copy. */}
      <aside
        aria-label={playbook.title}
        className="relative grid w-full overflow-hidden border-[0.5px] border-hairline bg-base min-[700px]:grid-cols-[minmax(0,1fr)_44%]"
      >
        {/* AuditForm's blue gradient + 10% pattern across the whole card, so
            it stands apart from the black article around it. */}
        <Image src={panelBg} alt="" fill sizes="(min-width: 1200px) 75vw, 100vw" className="object-cover" />
        <Image src={panelPattern} alt="" fill className="object-cover opacity-10" />
        <div className="relative flex flex-col items-start justify-between gap-10 p-6 desk:p-8">
          <div className="flex flex-col gap-3">
            <p className="tracking-display text-balance text-[24px] font-medium leading-[1.15] text-white desk:text-[32px]">
              {playbook.title}
            </p>
            {/* Two lines from desk, broken where the cover breaks it; below
                that the copy wraps on its own. */}
            <p className="text-[16px] leading-[1.5] text-white/80">
              {playbook.descriptionLines[0]}{" "}
              <br className="hidden desk:block" />
              {playbook.descriptionLines[1]}
            </p>
          </div>
          <div className="flex w-full flex-col gap-5">
            <button
              type="button"
              onClick={show}
              aria-haspopup="dialog"
              className={`group ${ctaButtonBase} ${ctaButtonPadding} w-full cursor-pointer gap-8 bg-white text-black hover:bg-white/90 min-[700px]:w-fit`}
            >
              <span>GET THE PLAYBOOK</span>
              <span className="transition-transform duration-300 ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:translate-x-[3px] group-focus-visible:translate-x-[3px] motion-reduce:transition-none">
                <ArrowIcon />
              </span>
            </button>
          </div>
        </div>
        {/* Masked rather than overlaid: the wall, black gaps included, fades
            out toward the copy (toward the bottom below 700px), so it melts
            into the blue with no seam. */}
        <div
          aria-hidden="true"
          className="relative order-first h-44 [mask-image:linear-gradient(to_bottom,black_70%,transparent)] min-[700px]:order-none min-[700px]:h-auto min-[700px]:min-h-[300px] min-[700px]:[mask-image:linear-gradient(to_right,transparent,black_38%)]"
        >
          <Image
            src={mosaicImg}
            alt=""
            fill
            sizes="(min-width: 1200px) 35vw, (min-width: 700px) 44vw, 100vw"
            className="object-cover object-[center_28%]"
          />
        </div>
      </aside>

      {/* Full page from desk: the viewport less the page shell's 20px inset. */}
      <Dialog
        open={open}
        onClose={close}
        labelledBy={titleId}
        className="desk:h-[calc(100dvh-40px)] desk:w-[calc(100vw-40px)]"
      >
        <div className="relative flex min-h-0 flex-1 flex-col overflow-y-auto desk:flex-row desk:overflow-hidden">
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute top-3 right-3 z-10 flex h-9 w-9 cursor-pointer items-center justify-center text-white/60 transition-colors hover:text-white desk:top-5 desk:right-5"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>

          {/* The playbook itself: its cover on the gradient panel, with what's
              inside underneath. A short band on top below desk. */}
          <div className="relative shrink-0 bg-base desk:flex desk:min-h-0 desk:flex-1 desk:flex-col desk:justify-center">
            <Image src={panelBg} alt="" fill sizes="(min-width: 1200px) 60vw, 100vw" className="object-cover" />
            <Image src={panelPattern} alt="" fill className="object-cover opacity-10" />
            <div className="relative flex flex-col gap-6 p-6 pr-14 desk:gap-10 desk:p-12">
              <Image
                src={coverImg}
                alt={`Cover of ${playbook.title}`}
                sizes="(min-width: 1200px) 880px, 100vw"
                className="h-auto w-full border-[0.5px] border-hairline desk:mx-auto desk:max-w-[880px]"
              />
              <dl className="hidden w-full grid-cols-3 border-[0.5px] border-hairline bg-base/40 desk:mx-auto desk:grid desk:max-w-[880px] desk:divide-x-[0.5px] desk:divide-hairline">
                {playbook.stats.map((stat) => (
                  <div key={stat.label} className="flex flex-col-reverse gap-2 p-5">
                    <dt className="text-[12px] font-medium uppercase tracking-[0.04em] text-white/80">
                      {stat.label}
                    </dt>
                    <dd className="tracking-display text-[32px] font-medium leading-none text-white">
                      {stat.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-10 p-6 desk:w-[460px] desk:shrink-0 desk:border-l-[0.5px] desk:border-hairline desk:p-12">
            {status === "success" ? (
              <>
                <div className="flex flex-col gap-3">
                  <p className="text-[12px] font-medium uppercase tracking-[0.04em] text-label-grey">
                    Request received
                  </p>
                  <h2
                    id={titleId}
                    className="tracking-display text-[24px] font-medium leading-[1.15] text-white desk:text-[32px]"
                  >
                    Thanks{firstName ? `, ${firstName}` : ""}. It&apos;s on its way.
                  </h2>
                  <p className="text-[16px] leading-[1.5] text-body-grey">
                    We&apos;ve emailed the playbook to {values.email.trim()}. If it isn&apos;t there in a few minutes, check spam.
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
              </>
            ) : (
              <>
                <div className="flex flex-col gap-3 pr-8 desk:pr-0">
                  <p className="text-[12px] font-medium uppercase tracking-[0.04em] text-label-grey">
                    Free playbook
                  </p>
                  <h2
                    id={titleId}
                    className="tracking-display text-balance text-[24px] font-medium leading-[1.15] text-white desk:text-[32px]"
                  >
                    {playbook.title}
                  </h2>
                  <p className="text-balance text-[16px] leading-[1.5] text-body-grey">
                    {playbook.descriptionLines.join(" ")}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  <div className={fieldWrapClassName}>
                    <input
                      type="text"
                      name="name"
                      ref={nameRef}
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

                  <div className="mt-2 flex flex-col gap-3">
                    <button
                      type="submit"
                      disabled={status === "submitting"}
                      className={`${ctaButtonBase} ${ctaButtonPadding} w-full cursor-pointer gap-8 bg-white text-black hover:bg-white/90 disabled:cursor-wait disabled:opacity-60`}
                    >
                      <span>{status === "submitting" ? "SENDING…" : "SEND ME THE PLAYBOOK"}</span>
                      <ArrowIcon />
                    </button>
                    {status === "error" ? (
                      <p role="alert" className="text-[12px] text-white">
                        Something went wrong. Please try again.
                      </p>
                    ) : (
                      <p className="text-[12px] text-label-grey">Work emails only.</p>
                    )}
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </Dialog>
    </>
  );
}
