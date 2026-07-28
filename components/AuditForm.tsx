"use client";

import Image from "next/image";
import { useState } from "react";
import auditFormBg from "@/public/media/audit-form-bg.png";
import auditFormPattern from "@/public/media/audit-form-pattern.svg";
import dakshImg from "@/public/media/daksh-img.svg";

// Same transparent + hairline-underline treatment as the Footer's newsletter input.
const fieldClassName =
  "w-full border-b-[0.5px] border-hairline bg-transparent pb-2 text-[14px] font-normal text-white placeholder:text-white/40 focus:outline-none focus:border-accent";

// Column order matches the submissions sheet — keep in sync with `fields` in
// app/api/audit/route.ts and FIELDS in scripts/apps-script/Code.gs.
const initialValues = {
  name: "",
  email: "",
  siteToAudit: "",
  linkedin: "",
  icp: "",
  anythingElse: "",
};

// Everything except the free-text "Anything Else" box has to be filled in.
const requiredFields = ["name", "email", "siteToAudit", "linkedin", "icp"] as const;

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

type FieldName = keyof typeof initialValues;
type Status = "idle" | "submitting" | "success" | "error";

export function AuditForm() {
  const [values, setValues] = useState(initialValues);
  const [status, setStatus] = useState<Status>("idle");
  const isComplete =
    requiredFields.every((field) => values[field].trim() !== "") && isValidEmail(values.email);

  const handleChange =
    (field: FieldName) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isComplete || status === "submitting") return;

    setStatus("submitting");
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Submit failed");
      setStatus("success");
      setValues(initialValues);
    } catch {
      setStatus("error");
    }
  };

  return (
    <section
      id="audit"
      className="flex w-full flex-col border-t-[0.5px] border-hairline py-7 desk:h-114 desk:flex-row"
    >
      <div className="relative h-90 w-full desk:h-full desk:w-3/5">
        <Image src={auditFormBg} alt="" fill className="object-cover" />
        <Image src={auditFormPattern} alt="" fill className="object-cover opacity-10" />
        <div className="relative flex h-full flex-col justify-between p-6">
          <div className="flex flex-col">
            <div className="relative h-12 w-12 overflow-hidden rounded-full bg-white">
              <Image src={dakshImg} alt="Daksh Aswal" fill className="object-cover" />
            </div>
            <div className="flex flex-col pt-2">
              <p className="font-normal text-white">Daksh Aswal</p>
              <p className="font-normal text-white/60">Founder at PIXELUP LABS</p>
            </div>
          </div>
          {/* Setup line steps back to white/60, the punch line holds full white
              — the same opacity hierarchy used for headings site-wide. */}
          <div className="flex flex-col gap-3">
            <p className="font-display text-[28px] font-medium leading-[120%] text-white desk:text-[32px]">
              <span className="text-white/60">Your product is enterprise-ready.</span>
              <br />
              Does your site say so?
            </p>
            {/* max-w in ch + text-balance so the two lines carry roughly the
                same number of words, same as the hero and case-study headings. */}
            <p className="max-w-[68ch] text-balance text-[14px] font-normal leading-[150%] text-white/60">
              Not ready for a call? Get a perception audit instead. We&apos;ll tell you
              honestly what an enterprise buyer sees, and what we&apos;d change.
            </p>
          </div>
        </div>
      </div>
      <form
        onSubmit={handleSubmit}
        className="no-scrollbar flex w-full flex-col gap-5 bg-[#0A0A0A] px-5 py-6 desk:h-full desk:min-h-0 desk:w-2/5 desk:gap-5 desk:overflow-y-auto"
      >
        <div className="flex flex-col gap-5 desk:flex-row">
          <input
            type="text"
            placeholder="Name"
            value={values.name}
            onChange={handleChange("name")}
            className={fieldClassName}
          />
          <input
            type="email"
            placeholder="Email"
            value={values.email}
            onChange={handleChange("email")}
            className={fieldClassName}
          />
        </div>
        <div className="flex flex-col gap-5 desk:flex-row">
          <input
            type="text"
            placeholder="Site to audit"
            value={values.siteToAudit}
            onChange={handleChange("siteToAudit")}
            className={fieldClassName}
          />
          <input
            type="text"
            placeholder="Your LinkedIn"
            value={values.linkedin}
            onChange={handleChange("linkedin")}
            className={fieldClassName}
          />
        </div>
        <input
          type="text"
          placeholder="Your ICP"
          value={values.icp}
          onChange={handleChange("icp")}
          className={fieldClassName}
        />
        <textarea
          placeholder="Anything else?"
          value={values.anythingElse}
          onChange={handleChange("anythingElse")}
          className={`${fieldClassName} min-h-20 flex-1 resize-none`}
        />
        <button
          type="submit"
          disabled={!isComplete || status === "submitting"}
          className={`w-full shrink-0 rounded-none py-2.5 text-[14px] font-medium transition-colors ${
            isComplete && status !== "submitting"
              ? "cursor-pointer bg-white text-black"
              : "cursor-not-allowed bg-white/20 text-white/40"
          }`}
        >
          {status === "submitting" ? "Submitting..." : "Submit"}
        </button>
        {status === "success" && (
          <p className="text-[14px] text-white/60">Thanks, we&apos;ll be in touch.</p>
        )}
        {status === "error" && (
          <p className="text-[14px] text-red-400">Something went wrong. Please try again.</p>
        )}
      </form>
    </section>
  );
}
