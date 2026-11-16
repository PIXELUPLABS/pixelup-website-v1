import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { appendToLeadsSheet, type SaveResult } from "@/lib/leads-sheet";

// Newsletter signups go to two places: their own Supabase table (separate from
// audit_submissions — see app/api/audit/route.ts for the sibling form) and the
// "Newsletter" tab of the Website Leads Google Sheet (lib/leads-sheet.ts). A
// signup counts as saved if either store took it.

// Must stay in sync with initialValues in components/NewsletterForm.tsx, the
// newsletter_subscribers table's actual columns, and FORMS.newsletter.fields in
// scripts/apps-script/WebsiteLeads.gs.
const fields = ["name", "email"] as const;

// Deliberately loose — just enough to keep obvious junk out of the table.
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

  const name = (body.name as string).trim();
  const [supabase, sheet] = await Promise.all([
    saveToSupabase(name, email),
    appendToLeadsSheet("newsletter", { name, email }),
  ]);

  if (supabase === "saved" || sheet === "saved") {
    return NextResponse.json({ ok: true });
  }
  if (supabase === "not-configured" && sheet === "not-configured") {
    return NextResponse.json({ error: "Server not configured" }, { status: 500 });
  }
  return NextResponse.json({ error: "Could not save signup" }, { status: 502 });
}

async function saveToSupabase(name: string, email: string): Promise<SaveResult> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error("Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY env vars.");
    return "not-configured";
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);
  const { error } = await supabase
    .from("newsletter_subscribers")
    .insert({ name, email });

  if (error) {
    // Duplicate email (unique constraint) — treat as a friendly success
    // rather than an error, since the person is already subscribed.
    if (error.code === "23505") return "saved";
    console.error("Supabase insert failed:", error);
    return "failed";
  }
  return "saved";
}
