import { google } from "googleapis";
import { NextResponse } from "next/server";

// Same 7 fields AuditForm collects, in the order they should land as columns.
const fields = [
  "firstName",
  "workEmail",
  "siteToAudit",
  "linkedin",
  "buyers",
  "whatIsntWorking",
  "whereYouAreAt",
] as const;

export async function POST(request: Request) {
  const body = await request.json();

  for (const field of fields) {
    if (typeof body[field] !== "string" || body[field].trim() === "") {
      return NextResponse.json({ error: `Missing field: ${field}` }, { status: 400 });
    }
  }

  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

  if (!clientEmail || !privateKey || !spreadsheetId) {
    console.error("Missing GOOGLE_SHEETS_* env vars — see app/api/audit/route.ts setup notes.");
    return NextResponse.json({ error: "Server not configured" }, { status: 500 });
  }

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const sheets = google.sheets({ version: "v4", auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: "Sheet1!A1",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[new Date().toISOString(), ...fields.map((field) => body[field])]],
    },
  });

  return NextResponse.json({ ok: true });
}
