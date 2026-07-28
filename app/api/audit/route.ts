import { NextResponse } from "next/server";

// Submissions are written to the Google Sheet by an Apps Script web app rather
// than the Sheets API directly — the pixelup Cloud org enforces
// iam.disableServiceAccountKeyCreation, so a service account JSON key can't be
// issued. The script lives in scripts/apps-script/Code.gs; setup notes are at
// the top of that file.

// The 6 fields AuditForm collects, in the order they land as sheet columns.
// Must stay in sync with FIELDS in scripts/apps-script/Code.gs and
// initialValues in components/AuditForm.tsx.
const fields = [
  "name",
  "email",
  "siteToAudit",
  "linkedin",
  "icp",
  "anythingElse",
] as const;

// "anythingElse" is the only field the form lets you leave blank.
const optionalFields = new Set<(typeof fields)[number]>(["anythingElse"]);

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  for (const field of fields) {
    const value = body[field];
    if (optionalFields.has(field)) {
      // Absent is fine; a non-string is still a malformed request.
      if (value !== undefined && typeof value !== "string") {
        return NextResponse.json({ error: `Invalid field: ${field}` }, { status: 400 });
      }
      continue;
    }
    if (typeof value !== "string" || value.trim() === "") {
      return NextResponse.json({ error: `Missing field: ${field}` }, { status: 400 });
    }
  }

  const webhookUrl = process.env.AUDIT_WEBHOOK_URL;
  const webhookSecret = process.env.AUDIT_WEBHOOK_SECRET;

  if (!webhookUrl || !webhookSecret) {
    console.error(
      "Missing AUDIT_WEBHOOK_URL / AUDIT_WEBHOOK_SECRET — see scripts/apps-script/Code.gs."
    );
    return NextResponse.json({ error: "Server not configured" }, { status: 500 });
  }

  const payload: Record<string, string> = { secret: webhookSecret };
  for (const field of fields) {
    payload[field] = ((body[field] as string | undefined) ?? "").trim();
  }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      // Apps Script /exec URLs 302 to script.googleusercontent.com; fetch
      // follows that by default. Don't set redirect: "manual" here.
      signal: AbortSignal.timeout(15_000),
    });

    // Apps Script can't set status codes — it always answers 200 and reports
    // success in the body. Checking res.ok alone would swallow real failures.
    const result = await res.json().catch(() => null);

    if (!res.ok || !result?.ok) {
      console.error("Audit webhook rejected submission:", res.status, result);
      return NextResponse.json({ error: "Could not save submission" }, { status: 502 });
    }
  } catch (err) {
    console.error("Audit webhook unreachable:", err);
    return NextResponse.json({ error: "Could not save submission" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
