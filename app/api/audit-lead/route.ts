import { NextResponse } from "next/server";
import { appendToLeadsSheet } from "@/lib/leads-sheet";

// Brand perception audit requests from the blog-post popup (AuditLeadMagnet),
// logged to the "Brand Audit Lead Magnet" tab of the Website Leads Google
// Sheet (see lib/leads-sheet.ts). Field order must match
// FORMS.auditLeadMagnet.fields in scripts/apps-script/WebsiteLeads.gs.

// Deliberately loose, same as the other lead routes — the form's own input
// types already did the real validation; this just keeps obvious junk out.
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** "acme.com" and "https://acme.com/" both come back as "https://acme.com". */
function normalizeWebsite(raw: string): string | null {
  const value = raw.trim();
  if (!value || value.length > 300) return null;
  try {
    const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
    if (!url.hostname.includes(".")) return null;
    return `${url.origin}${url.pathname === "/" ? "" : url.pathname}`;
  } catch {
    return null;
  }
}

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

  const website = normalizeWebsite(typeof body.website === "string" ? body.website : "");
  if (!website) {
    return NextResponse.json({ error: "Invalid website" }, { status: 400 });
  }

  // The article the popup converted on. Anything that isn't a site path is dropped.
  const page =
    typeof body.page === "string" && body.page.startsWith("/")
      ? body.page.slice(0, 200)
      : "";

  const result = await appendToLeadsSheet("auditLeadMagnet", { name, email, website, page });

  if (result === "not-configured") {
    return NextResponse.json({ error: "Server not configured" }, { status: 500 });
  }
  if (result === "failed") {
    return NextResponse.json({ error: "Could not save submission" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
