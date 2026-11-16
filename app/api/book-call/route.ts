import { NextResponse } from "next/server";
import { appendToLeadsSheet } from "@/lib/leads-sheet";

// "Book a call" emails from BookCallForm, logged to the "Book a call" tab of
// the Website Leads Google Sheet (see lib/leads-sheet.ts).

// Deliberately loose, same as the newsletter route — the form's type="email"
// already did the real validation; this just keeps obvious junk out.
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (email.length > 254 || !emailPattern.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  // The path the form was submitted from, so the sheet shows which page
  // converted. Anything that isn't a site path is dropped.
  const page =
    typeof body.page === "string" && body.page.startsWith("/")
      ? body.page.slice(0, 200)
      : "";

  const result = await appendToLeadsSheet("bookCall", { email, page });

  if (result === "not-configured") {
    return NextResponse.json({ error: "Server not configured" }, { status: 500 });
  }
  if (result === "failed") {
    return NextResponse.json({ error: "Could not save submission" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
