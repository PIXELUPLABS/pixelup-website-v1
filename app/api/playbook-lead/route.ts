import { NextResponse } from "next/server";
import { appendToLeadsSheet } from "@/lib/leads-sheet";
import { sendPlaybookEmail } from "@/lib/playbook-email";
import { playbooks, type PlaybookId } from "@/lib/playbooks";
import { isPersonalEmail, WORK_EMAIL_MESSAGE } from "@/lib/work-email";

// Playbook requests from the inline CTA on blog posts (blog/PlaybookCta). Each
// one is emailed the PDF (lib/playbook-email.ts) and logged to the "Playbook
// Requests" tab of the Website Leads Google Sheet (lib/leads-sheet.ts). Field
// order must match FORMS.playbookLead.fields in scripts/apps-script/WebsiteLeads.gs.
//
// The email is the promise made to the visitor, so it decides the response. A
// sheet failure is logged (appendToLeadsSheet does that) but doesn't fail a
// request whose playbook was sent; Resend's own log still has the recipient.

// Reads the PDF from disk.
export const runtime = "nodejs";

// Deliberately loose, same as the other lead routes — the form's own input
// types already did the real validation; this just keeps obvious junk out.
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim().slice(0, 120) : "";
  if (!name) {
    return NextResponse.json({ error: "Missing field: name" }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (email.length > 254 || !emailPattern.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }
  if (isPersonalEmail(email)) {
    return NextResponse.json({ error: WORK_EMAIL_MESSAGE }, { status: 400 });
  }

  const playbook = typeof body.playbook === "string" ? body.playbook : "";
  if (!Object.hasOwn(playbooks, playbook)) {
    return NextResponse.json({ error: "Unknown playbook" }, { status: 400 });
  }

  // The article the CTA converted on. Anything that isn't a site path is dropped.
  const page =
    typeof body.page === "string" && body.page.startsWith("/")
      ? body.page.slice(0, 200)
      : "";

  const id = playbook as PlaybookId;
  const [sent] = await Promise.all([
    sendPlaybookEmail({ id, name, email }),
    appendToLeadsSheet("playbookLead", { name, email, playbook: playbooks[id].title, page }),
  ]);

  if (sent === "not-configured") {
    return NextResponse.json({ error: "Server not configured" }, { status: 500 });
  }
  if (sent === "failed") {
    return NextResponse.json({ error: "Could not send the playbook" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
