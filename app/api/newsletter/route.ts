import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Newsletter signups go to their own Supabase table, separate from
// audit_submissions — see app/api/audit/route.ts for the sibling form.

// Must stay in sync with initialValues in components/NewsletterForm.tsx and
// the newsletter_subscribers table's actual columns.
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

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error("Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY env vars.");
    return NextResponse.json({ error: "Server not configured" }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);
  const { error } = await supabase.from("newsletter_subscribers").insert({
    name: (body.name as string).trim(),
    email,
  });

  if (error) {
    // Duplicate email (unique constraint) — treat as a friendly success
    // rather than an error, since the person is already subscribed.
    if (error.code === "23505") {
      return NextResponse.json({ ok: true });
    }
    console.error("Supabase insert failed:", error);
    return NextResponse.json({ error: "Could not save signup" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
