import { NextResponse } from "next/server";
import { partnerTypeOptions, referralVolumeOptions } from "@/lib/referral";

// Partner applications from /referral (components/referral/ReferralForm.tsx)
// are appended to a Google Sheet through a Google Apps Script web app — see
// scripts/google-sheets/referral-apps-script.gs for the script and its setup.
// The secret stays server-side: the browser only ever talks to this route.

const textFields = [
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
] as const;
type TextField = (typeof textFields)[number];

// Same rules as validate() in ReferralForm.tsx.
const requiredFields = new Set<TextField>(["fullName", "email", "country", "partnerType", "network"]);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Generous cap per field, so one request can't stuff the sheet.
const MAX_LENGTH = 5000;

const labelFor = (options: readonly { value: string; label: string }[], value: string) =>
  options.find((option) => option.value === value)?.label;

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const values = {} as Record<TextField, string>;
  for (const field of textFields) {
    const raw = body[field];
    if (raw !== undefined && typeof raw !== "string") {
      return NextResponse.json({ error: `Invalid field: ${field}` }, { status: 400 });
    }
    const value = (raw ?? "").trim();
    if (value.length > MAX_LENGTH) {
      return NextResponse.json({ error: `Field too long: ${field}` }, { status: 400 });
    }
    if (requiredFields.has(field) && !value) {
      return NextResponse.json({ error: `Missing field: ${field}` }, { status: 400 });
    }
    values[field] = value;
  }

  if (!emailPattern.test(values.email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }
  const partnerType = labelFor(partnerTypeOptions, values.partnerType);
  if (!partnerType) {
    return NextResponse.json({ error: "Invalid field: partnerType" }, { status: 400 });
  }
  const referralVolume = values.referralVolume
    ? labelFor(referralVolumeOptions, values.referralVolume)
    : "";
  if (referralVolume === undefined) {
    return NextResponse.json({ error: "Invalid field: referralVolume" }, { status: 400 });
  }
  if (body.eligibility !== true || body.terms !== true) {
    return NextResponse.json({ error: "Confirmations required" }, { status: 400 });
  }

  const webhookUrl = process.env.REFERRAL_SHEET_WEBHOOK_URL;
  const secret = process.env.REFERRAL_SHEET_SECRET;
  if (!webhookUrl || !secret) {
    console.error("Missing REFERRAL_SHEET_WEBHOOK_URL / REFERRAL_SHEET_SECRET env vars.");
    return NextResponse.json({ error: "Server not configured" }, { status: 500 });
  }

  // Keys are the sheet's column headers (the script matches by name).
  const row = {
    "Submitted at": new Date().toISOString(),
    "Full name": values.fullName,
    Email: values.email,
    "Phone or WhatsApp": values.phone,
    Country: values.country,
    "Company or fund": values.company,
    Role: values.role,
    "LinkedIn or website": values.profileUrl,
    "Partner group": partnerType,
    "Referrals expected (12 months)": referralVolume,
    "Who they are close to": values.network,
    "Company in mind": values.leadInMind,
    "Eligibility confirmed": "Yes",
    "Terms accepted": "Yes",
  };

  try {
    // Apps Script answers a POST with a redirect to the script's output;
    // fetch follows it and the final response carries the JSON result.
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, row }),
      redirect: "follow",
      cache: "no-store",
      signal: AbortSignal.timeout(20_000),
    });
    const result = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
    if (!response.ok || !result?.ok) {
      console.error("Google Sheet append failed:", response.status, result?.error);
      return NextResponse.json({ error: "Could not save application" }, { status: 502 });
    }
  } catch (error) {
    console.error("Google Sheet request failed:", error);
    return NextResponse.json({ error: "Could not save application" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
