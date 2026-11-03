"use client";

import Image from "next/image";
import { useState } from "react";
import { ctaButtonBase } from "@/components/CtaButtons";
import { partnerTypeOptions, referralVolumeOptions } from "@/lib/referral";

/**
 * Partner application for /referral. Fields follow the site's existing form
 * treatment (NewsletterForm, the earlier inline AuditForm): transparent
 * fields on a hairline underline that turns accent on focus. Choice groups
 * reuse ArticleFilters' pill styling as real radio inputs.
 *
 * There is no backend yet: `submitPartnerApplication` logs the payload to the
 * console. Swap its body for a fetch to an API route (or a Server Action)
 * when the backend is ready; the rest of the form already handles the
 * submitting / success / error states.
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

async function submitPartnerApplication(application: PartnerApplication) {
  // TODO(backend): replace with a POST to the partner-application endpoint.
  console.log("[referral] Partner application", {
    ...application,
    submittedAt: new Date().toISOString(),
  });
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

const labelClassName =
  "text-[12px] font-medium uppercase tracking-[0.04em] text-label-grey";
const fieldClassName =
  "w-full border-b-[0.5px] bg-transparent pb-2 text-[16px] font-normal text-white placeholder:text-white/40 transition-colors focus:border-accent focus:outline-none disabled:opacity-60";

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
}: {
  name: FieldName;
  label: string;
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
    <div className="flex flex-col gap-3">
      <label htmlFor={id} className={labelClassName}>
        {label}
        {!required && <span className="normal-case tracking-normal text-white/40"> (optional)</span>}
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
        className={`${fieldClassName} ${error ? "border-red-400" : "border-hairline"}`}
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
    <div className="flex flex-col gap-3">
      <label htmlFor={id} className={labelClassName}>
        {label}
        {!required && <span className="normal-case tracking-normal text-white/40"> (optional)</span>}
      </label>
      <textarea
        id={id}
        name={name}
        rows={3}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        aria-required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(e) => onChange(e.target.value)}
        className={`${fieldClassName} min-h-24 resize-none leading-[1.5] ${error ? "border-red-400" : "border-hairline"}`}
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
      className="flex flex-col gap-3"
      aria-invalid={Boolean(error)}
      aria-describedby={error ? `${id}-error` : undefined}
    >
      <legend className={`${labelClassName} mb-3`}>
        {legend}
        {!required && <span className="normal-case tracking-normal text-white/40"> (optional)</span>}
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
            {/* ArticleFilters' pill states: dashed hairline at rest, filled
                button-dark when selected. */}
            <span className="block border border-dashed border-hairline px-3 py-1 font-button text-[12px] font-semibold uppercase tracking-[-0.02em] text-white/40 transition-colors hover:bg-button-dark peer-checked:border-solid peer-checked:border-transparent peer-checked:bg-button-dark peer-checked:text-white peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent">
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
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3">
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
          className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border-[0.5px] transition-colors peer-checked:border-accent peer-checked:bg-accent peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent peer-checked:[&>svg]:opacity-100 ${
            error ? "border-red-400" : "border-white/40"
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
        <span className="text-[14px] leading-[1.4] text-muted-65">{children}</span>
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
        <p className="text-[24px] font-medium leading-tight tracking-display text-white">
          Application received.
        </p>
        <p className="text-[16px] leading-[1.5] text-muted-65">
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
      className="flex flex-col gap-8"
    >
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
        value={values.profileUrl}
        error={errors.profileUrl}
        disabled={disabled}
        onChange={(v) => update("profileUrl", v)}
      />
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

      <div className="flex flex-col gap-4">
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
          className={`${ctaButtonBase} w-full cursor-pointer gap-8 bg-accent text-white hover:brightness-110 disabled:cursor-wait disabled:opacity-60`}
        >
          <span>{disabled ? "SUBMITTING…" : "SUBMIT APPLICATION"}</span>
          <Image src="/media/Container.svg" alt="" width={14} height={14} aria-hidden="true" />
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
