"use client";

import Image from "next/image";
import { useState } from "react";

// Split out of Footer so the footer itself stays a server component — only this
// input pair needs to ship JS to the browser.

// Same transparent + hairline-underline treatment as AuditForm's fields.
const fieldClassName =
  "w-full bg-transparent text-[14px] font-normal text-white placeholder:text-white/40 focus:outline-none";

const initialValues = { name: "", email: "" };

type FieldName = keyof typeof initialValues;
type Status = "idle" | "submitting" | "success" | "error";

export function NewsletterForm() {
  const [values, setValues] = useState(initialValues);
  const [status, setStatus] = useState<Status>("idle");
  const isComplete = Object.values(values).every((value) => value.trim() !== "");

  const handleChange =
    (field: FieldName) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({ ...prev, [field]: e.target.value }));
      if (status === "error") setStatus("idle");
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isComplete || status === "submitting") return;

    setStatus("submitting");
    try {
      const res = await fetch("/api/newsletter", {
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
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5">
      {/* focus-within, not focus: the hairline lives on this wrapper (the input
          itself is borderless here, unlike AuditForm where the border is on the
          field), so the accent underline has to react to the child's focus. */}
      <div className="w-full border-b-[0.5px] border-hairline pb-2 focus-within:border-accent">
        <input
          type="text"
          placeholder="Your name"
          aria-label="Your name"
          value={values.name}
          onChange={handleChange("name")}
          disabled={status === "submitting"}
          className={fieldClassName}
        />
      </div>
      <div className="flex w-full items-center justify-between border-b-[0.5px] border-hairline pb-2 focus-within:border-accent">
        <input
          type="email"
          placeholder="Enter your email"
          aria-label="Your email"
          value={values.email}
          onChange={handleChange("email")}
          disabled={status === "submitting"}
          className={fieldClassName}
        />
        <button
          type="submit"
          disabled={!isComplete || status === "submitting"}
          aria-label="Subscribe to newsletter"
          className={`shrink-0 transition-opacity ${
            isComplete && status !== "submitting"
              ? "cursor-pointer hover:opacity-70"
              : "cursor-not-allowed opacity-40"
          }`}
        >
          <Image
            src="/media/Container.svg"
            alt=""
            width={14}
            height={14}
            aria-hidden="true"
          />
        </button>
      </div>
      {status === "success" && (
        <p className="text-[14px] font-normal text-white/60">
          Thanks, you&apos;re subscribed.
        </p>
      )}
      {status === "error" && (
        <p className="text-[14px] font-normal text-red-400">
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
}
