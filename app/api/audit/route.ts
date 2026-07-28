import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Submissions are inserted straight into a Supabase table from this server
// route, using the service role key (bypasses RLS — safe here since this is
// server-only code, never exposed to the browser). See README notes in this
// conversation / SUPABASE_SETUP.md for how to create the project and table.

// The 6 fields AuditForm collects. Keys here are the request-body field
// names (camelCase); values are the matching Postgres column names
// (snake_case) — keep both in sync with initialValues in
// components/AuditForm.tsx and the table's actual columns.
const fieldToColumn = {
  name: "name",
  email: "email",
  siteToAudit: "site_to_audit",
  linkedin: "linkedin",
  icp: "icp",
  anythingElse: "anything_else",
} as const;

const fields = Object.keys(fieldToColumn) as (keyof typeof fieldToColumn)[];

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

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error("Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY env vars.");
    return NextResponse.json({ error: "Server not configured" }, { status: 500 });
  }

  const row: Record<string, string | null> = {};
  for (const field of fields) {
    const value = ((body[field] as string | undefined) ?? "").trim();
    row[fieldToColumn[field]] = value === "" ? null : value;
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);
  const { error } = await supabase.from("audit_submissions").insert(row);

  if (error) {
    console.error("Supabase insert failed:", error);
    return NextResponse.json({ error: "Could not save submission" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
