"use client";

import Image from "next/image";
import { useState } from "react";
import { partnerTypeOptions, referralVolumeOptions } from "@/lib/referral";

/**
 * Partner application for /referral, styled to the PIXELUP Brand 2026
 * redesign (Figma node 1801:3979): a two-column grid of underlined fields,
 * outlined chips for the choice groups (real radio inputs), and a full-width
 * accent-blue submit button.
 *
 * Submissions POST to app/api/referral, which appends a row to the partner
 * Google Sheet (scripts/google-sheets/referral-apps-script.gs).
 */

export type PartnerApplication = {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  company: string;
  role: string;
  profileUrl: string;
  partnerType: string;
  referralVolume: string;
  network: string;
  leadInMind: string;
  eligibility: boolean;
  terms: boolean;
};

const initialValues: PartnerApplication = {
  fullName: "",
  email: "",
  phone: "",
  country: "",
  company: "",
  role: "",
  profileUrl: "",
  partnerType: "",
  referralVolume: "",
  network: "",
  leadInMind: "",
  eligibility: false,
  terms: false,
};

type FieldName = keyof PartnerApplication;
type Errors = Partial<Record<FieldName, string>>;
type Status = "idle" | "submitting" | "success" | "error";

/** Saves the application to the partner Google Sheet via app/api/referral. */
async function submitPartnerApplication(application: PartnerApplication) {
  const response = await fetch("/api/referral", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(application),
  });
  if (!response.ok) throw new Error(`Partner application failed: ${response.status}`);
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: PartnerApplication): Errors {
  const errors: Errors = {};
  if (!values.fullName.trim()) errors.fullName = "Enter your full name.";
  if (!values.email.trim()) errors.email = "Enter your email.";
  else if (!EMAIL_PATTERN.test(values.email.trim()))
    errors.email = "Enter a valid email, like name@company.com.";
  if (!values.country.trim()) errors.country = "Enter the country you are based in.";
  if (!values.partnerType) errors.partnerType = "Choose the group that fits you best.";
  if (!values.network.trim())
    errors.network = "Tell us briefly about the companies you are close to.";
  if (!values.eligibility) errors.eligibility = "Confirm you meet the eligibility rules.";
  if (!values.terms) errors.terms = "Agree to the program terms to apply.";
  return errors;
}

// Order the errors are checked in, so focus lands on the first one on screen.
const fieldOrder: FieldName[] = [
  "fullName",
  "email",
  "phone",
  "country",
  "company",
  "role",
  "profileUrl",
  "partnerType",
  "referralVolume",
  "network",
  "leadInMind",
  "eligibility",
  "terms",
];

const labelClassName = "text-[12px] uppercase leading-[15px] tracking-[0.08em] text-muted";
const fieldClassName =
  "w-full border-b bg-transparent pt-2 pb-3 text-[17px] leading-[21px] text-fg placeholder:text-placeholder transition-colors focus:border-accent-blue focus:outline-none disabled:opacity-60";

function Optional() {
  return <span className="normal-case tracking-normal text-faint"> (optional)</span>;
}

function ErrorText({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="text-[14px] leading-[1.3] text-red-400">
      {message}
    </p>
  );
}

function TextField({
  name,
  label,
  type = "text",
  required = false,
  autoComplete,
  placeholder,
  value,
  error,
  disabled,
  onChange,
  className = "",
}: {
  name: FieldName;
  label: string;
  className?: string;
  type?: "text" | "email" | "tel" | "url";
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
  value: string;
  error?: string;
  disabled: boolean;
  onChange: (value: string) => void;
}) {
  const id = `referral-${name}`;
  return (
    <div className={`flex flex-col gap-2.5 ${className}`}>
      <label htmlFor={id} className={labelClassName}>
        {label}
        {!required && <Optional />}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        aria-required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(e) => onChange(e.target.value)}
        className={`${fieldClassName} h-[42px] ${error ? "border-red-400" : "border-line-input"}`}
      />
      <ErrorText id={`${id}-error`} message={error} />
    </div>
  );
}

function TextAreaField({
  name,
  label,
  required = false,
  placeholder,
  value,
  error,
  disabled,
  onChange,
}: {
  name: FieldName;
  label: string;
  required?: boolean;
  placeholder?: string;
  value: string;
  error?: string;
  disabled: boolean;
  onChange: (value: string) => void;
}) {
  const id = `referral-${name}`;
  return (
    <div className="flex flex-col gap-2.5">
      <label htmlFor={id} className={labelClassName}>
        {label}
        {!required && <Optional />}
      </label>
      <textarea
        id={id}
        name={name}
        rows={2}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        aria-required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(e) => onChange(e.target.value)}
        className={`${fieldClassName} min-h-[86px] resize-none ${error ? "border-red-400" : "border-line-input"}`}
      />
      <ErrorText id={`${id}-error`} message={error} />
    </div>
  );
}

function PillGroup({
  name,
  legend,
  required = false,
  options,
  value,
  error,
  disabled,
  onChange,
}: {
  name: FieldName;
  legend: string;
  required?: boolean;
  options: readonly { value: string; label: string }[];
  value: string;
  error?: string;
  disabled: boolean;
  onChange: (value: string) => void;
}) {
  const id = `referral-${name}`;
  return (
    <fieldset
      className="flex flex-col gap-3.5"
      aria-invalid={Boolean(error)}
      aria-describedby={error ? `${id}-error` : undefined}
    >
      <legend className={`${labelClassName} mb-3.5`}>
        {legend}
        {!required && <Optional />}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option, index) => (
          <label key={option.value} className="relative cursor-pointer">
            <input
              // First radio carries the group's id so a validation error can
              // move focus into the group.
              id={index === 0 ? id : undefined}
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              disabled={disabled}
              onChange={() => onChange(option.value)}
              className="peer sr-only"
            />
            {/* Outlined chip at rest, filled with the text color when selected. */}
            <span className="flex h-11 items-center justify-center rounded-[4px] border border-line-strong px-[17px] text-[13px] uppercase leading-[16px] tracking-[0.04em] text-fg-2 transition-colors hover:border-faint peer-checked:border-fg peer-checked:bg-fg peer-checked:text-ink peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent-blue">
              {option.label}
            </span>
          </label>
        ))}
      </div>
      <ErrorText id={`${id}-error`} message={error} />
    </fieldset>
  );
}

function Checkbox({
  name,
  checked,
  error,
  disabled,
  onChange,
  children,
}: {
  name: FieldName;
  checked: boolean;
  error?: string;
  disabled: boolean;
  onChange: (checked: boolean) => void;
  children: React.ReactNode;
}) {
  const id = `referral-${name}`;
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3.5">
        <input
          id={id}
          name={name}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <span
          aria-hidden="true"
          className={`mt-0.5 flex size-[18px] shrink-0 items-center justify-center rounded-[3px] border transition-colors peer-checked:border-accent-blue peer-checked:bg-accent-blue peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent-blue peer-checked:[&>svg]:opacity-100 ${
            error ? "border-red-400" : "border-faint"
          }`}
        >
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" className="opacity-0">
            <path
              d="M2 6.5 4.75 9 10 3"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            />
          </svg>
        </span>
        <span className="text-[14px] leading-[1.5] text-fg-2">{children}</span>
      </label>
      <ErrorText id={`${id}-error`} message={error} />
    </div>
  );
}

export function ReferralForm() {
  const [values, setValues] = useState<PartnerApplication>(initialValues);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const disabled = status === "submitting";

  function update<K extends FieldName>(field: K, value: PartnerApplication[K]) {
    setValues((prev) => ({ ...prev, [field]: value }));
    // Clear a field's error as soon as it is edited, not on the next submit.
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    if (status === "error") setStatus("idle");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (disabled) return;

    const nextErrors = validate(values);
    setErrors(nextErrors);
    const firstInvalid = fieldOrder.find((field) => nextErrors[field]);
    if (firstInvalid) {
      document.getElementById(`referral-${firstInvalid}`)?.focus();
      return;
    }

    setStatus("submitting");
    try {
      const trimmed = Object.fromEntries(
        Object.entries(values).map(([key, value]) => [
          key,
          typeof value === "string" ? value.trim() : value,
        ]),
      ) as PartnerApplication;
      await submitPartnerApplication(trimmed);
      setSubmittedEmail(trimmed.email);
      setValues(initialValues);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="flex flex-col gap-4">
        <p className="text-[28px] leading-[34px] tracking-[-0.04em] text-fg">
          Application received.
        </p>
        <p className="text-[16px] leading-[1.55] text-muted">
          We will review it and send the partner agreement to{" "}
          <span className="text-white">{submittedEmail}</span>. Once it is signed, you get
          your partner kit and can register your first lead.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="w-fit cursor-pointer text-[14px] text-white underline decoration-white/40 underline-offset-4 transition-colors hover:decoration-white"
        >
          Submit another application
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label="Partner application"
      className="flex flex-col gap-10"
    >
      <div className="grid gap-8 desk:grid-cols-2">
      <TextField
        name="fullName"
        label="Full name"
        required
        autoComplete="name"
        value={values.fullName}
        error={errors.fullName}
        disabled={disabled}
        onChange={(v) => update("fullName", v)}
      />
      <TextField
        name="email"
        label="Email"
        type="email"
        required
        autoComplete="email"
        placeholder="name@company.com"
        value={values.email}
        error={errors.email}
        disabled={disabled}
        onChange={(v) => update("email", v)}
      />
      <TextField
        name="phone"
        label="Phone or WhatsApp"
        type="tel"
        autoComplete="tel"
        value={values.phone}
        error={errors.phone}
        disabled={disabled}
        onChange={(v) => update("phone", v)}
      />
      <TextField
        name="country"
        label="Country"
        required
        autoComplete="country-name"
        value={values.country}
        error={errors.country}
        disabled={disabled}
        onChange={(v) => update("country", v)}
      />
      <TextField
        name="company"
        label="Company or fund"
        autoComplete="organization"
        value={values.company}
        error={errors.company}
        disabled={disabled}
        onChange={(v) => update("company", v)}
      />
      <TextField
        name="role"
        label="Role"
        autoComplete="organization-title"
        placeholder="Head of Growth, Partner, Independent designer"
        value={values.role}
        error={errors.role}
        disabled={disabled}
        onChange={(v) => update("role", v)}
      />
      <TextField
        name="profileUrl"
        label="LinkedIn or website"
        type="url"
        autoComplete="url"
        placeholder="linkedin.com/in/you"
        className="desk:col-span-2"
        value={values.profileUrl}
        error={errors.profileUrl}
        disabled={disabled}
        onChange={(v) => update("profileUrl", v)}
      />
      </div>
      <PillGroup
        name="partnerType"
        legend="Which group fits you best?"
        required
        options={partnerTypeOptions}
        value={values.partnerType}
        error={errors.partnerType}
        disabled={disabled}
        onChange={(v) => update("partnerType", v)}
      />
      <PillGroup
        name="referralVolume"
        legend="Referrals you expect in the next 12 months"
        options={referralVolumeOptions}
        value={values.referralVolume}
        error={errors.referralVolume}
        disabled={disabled}
        onChange={(v) => update("referralVolume", v)}
      />
      <TextAreaField
        name="network"
        label="Who are you close to?"
        required
        placeholder="The founders, teams or portfolio companies you could introduce us to"
        value={values.network}
        error={errors.network}
        disabled={disabled}
        onChange={(v) => update("network", v)}
      />
      <TextAreaField
        name="leadInMind"
        label="A company you have in mind already"
        placeholder="Company name and what they need. We will treat it as your first registration."
        value={values.leadInMind}
        error={errors.leadInMind}
        disabled={disabled}
        onChange={(v) => update("leadInMind", v)}
      />

      <div className="flex flex-col gap-4 border-t border-dashed border-line-input pt-6">
        <Checkbox
          name="eligibility"
          checked={values.eligibility}
          error={errors.eligibility}
          disabled={disabled}
          onChange={(v) => update("eligibility", v)}
        >
          I am at least 18, can issue an invoice or receive payment legally, and I am not a
          current employee of PIXELUP LABS.
        </Checkbox>
        <Checkbox
          name="terms"
          checked={values.terms}
          error={errors.terms}
          disabled={disabled}
          onChange={(v) => update("terms", v)}
        >
          I have read the program terms on this page, including the conduct rules, and will
          disclose the referral arrangement to every company I introduce.
        </Checkbox>
      </div>

      <div className="flex flex-col gap-3">
        <button
          type="submit"
          disabled={disabled}
          className="flex h-[60px] w-full cursor-pointer items-center justify-between gap-8 rounded-[4px] bg-accent-blue px-5 text-[15px] font-medium leading-[18px] text-fg transition-[filter] hover:brightness-110 disabled:cursor-wait disabled:opacity-60"
        >
          <span>{disabled ? "SUBMITTING…" : "SUBMIT APPLICATION"}</span>
          <Image src="/media/referral/arrow-right.svg" alt="" width={16} height={16} aria-hidden="true" />
        </button>
        {status === "error" && (
          <p role="alert" className="text-[14px] leading-[1.3] text-red-400">
            Something went wrong. Please try again.
          </p>
        )}
      </div>
    </form>
  );
}
