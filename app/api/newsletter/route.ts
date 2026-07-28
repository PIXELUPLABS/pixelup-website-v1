import { NextResponse } from "next/server";

// Newsletter signups go to the "Newsletter" tab of the same spreadsheet as the
// audit form, through the same Apps Script webhook. See scripts/apps-script/Code.gs.

// Must stay in sync with FORMS.newsletter.fields in scripts/apps-script/Code.gs
// and initialValues in components/NewsletterForm.tsx.
const fields = ["name", "email"] as const;

// Deliberately loose — just enough to keep obvious junk out of the sheet.
// Real deliverability checking belongs to whatever sends the newsletter.
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  for (const field of fields) {
    const value = body[field];
    if (typeof value !== "string" || value.trim() === "") {
      return NextResponse.json({ error: `Missing field: ${field}` }, { status: 400 });
    }
  }

  const email = (body.email as string).trim();
  if (!emailPattern.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const webhookUrl = process.env.AUDIT_WEBHOOK_URL;
  const webhookSecret = process.env.AUDIT_WEBHOOK_SECRET;

  if (!webhookUrl || !webhookSecret) {
    console.error(
      "Missing AUDIT_WEBHOOK_URL / AUDIT_WEBHOOK_SECRET — see scripts/apps-script/Code.gs."
    );
    return NextResponse.json({ error: "Server not configured" }, { status: 500 });
  }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: webhookSecret,
        // Tells the script which tab to append to.
        form: "newsletter",
        name: (body.name as string).trim(),
        email,
      }),
      signal: AbortSignal.timeout(15_000),
    });

    // Apps Script always answers 200 and reports success in the body.
    const result = await res.json().catch(() => null);

    if (!res.ok || !result?.ok) {
      console.error("Newsletter webhook rejected signup:", res.status, result);
      return NextResponse.json({ error: "Could not save signup" }, { status: 502 });
    }
  } catch (err) {
    console.error("Newsletter webhook unreachable:", err);
    return NextResponse.json({ error: "Could not save signup" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
