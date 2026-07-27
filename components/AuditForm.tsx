"use client";

import { Geist } from "next/font/google";
import Image from "next/image";
import { useState } from "react";
import auditFormBg from "@/public/media/audit-form-bg.png";
import dakshImg from "@/public/media/daksh-img.svg";

// Scoped to the closing line below — the rest of the site keeps font-display.
const geist = Geist({ subsets: ["latin"], weight: ["500"] });

// Same transparent + hairline-underline treatment as the Footer's newsletter input.
const fieldClassName =
  "w-full border-b-[0.5px] border-hairline bg-transparent pb-2 text-[14px] font-normal text-white placeholder:text-white/40 focus:outline-none";

const initialValues = {
  firstName: "",
  workEmail: "",
  siteToAudit: "",
  linkedin: "",
  buyers: "",
  whatIsntWorking: "",
  whereYouAreAt: "",
};

type FieldName = keyof typeof initialValues;
type Status = "idle" | "submitting" | "success" | "error";

export function AuditForm() {
  const [values, setValues] = useState(initialValues);
  const [status, setStatus] = useState<Status>("idle");
  const isComplete = Object.values(values).every((value) => value.trim() !== "");

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
      className="flex w-full flex-col border-t-[0.5px] border-hairline py-7 desk:h-[calc(90vh-4rem)] desk:flex-row"
    >
      <div className="relative h-90 w-full desk:h-full desk:w-3/5">
        <Image src={auditFormBg} alt="" fill className="object-cover" />
        <div className="relative flex h-full flex-col justify-between p-6">
          <div className="flex flex-col gap-2">
            <div className="relative h-12 w-12 overflow-hidden rounded-full bg-white">
              <Image src={dakshImg} alt="Daksh Aswal" fill className="object-cover" />
            </div>
            <div className="flex flex-col gap-1.5">
              <p className="font-normal text-white">Daksh Aswal</p>
              <p className="font-normal text-white/60">Creative Director</p>
            </div>
          </div>
          <p className={`${geist.className} text-[28px] font-medium leading-[120%] text-white desk:text-[40px]`}>
            See your site <span className="text-white/60">the way</span>
            <br />
            <span className="text-white/60">your buyer does.</span>
          </p>
        </div>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col gap-5 bg-[#0A0A0A] px-5 py-6 desk:h-full desk:w-2/5 desk:gap-9"
      >
        <div className="flex flex-col gap-5 desk:flex-row">
          <input
            type="text"
            placeholder="First Name"
            value={values.firstName}
            onChange={handleChange("firstName")}
            className={fieldClassName}
          />
          <input
            type="email"
            placeholder="Work Email"
            value={values.workEmail}
            onChange={handleChange("workEmail")}
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
          placeholder="Your Buyers"
          value={values.buyers}
          onChange={handleChange("buyers")}
          className={fieldClassName}
        />
        <textarea
          placeholder="What isn't working?"
          value={values.whatIsntWorking}
          onChange={handleChange("whatIsntWorking")}
          className={`${fieldClassName} min-h-25 flex-1 resize-none`}
        />
        <input
          type="text"
          placeholder="Where you are at?"
          value={values.whereYouAreAt}
          onChange={handleChange("whereYouAreAt")}
          className={fieldClassName}
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
          <p className="text-[14px] text-white/60">Thanks — we&apos;ll be in touch.</p>
        )}
        {status === "error" && (
          <p className="text-[14px] text-red-400">Something went wrong. Please try again.</p>
        )}
      </form>
    </section>
  );
}
