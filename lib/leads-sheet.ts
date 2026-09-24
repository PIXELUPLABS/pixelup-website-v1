// The "Website Leads" Google Sheet, one tab per form. Rows are written by an
// Apps Script web app rather than the Sheets API directly — the pixelup Cloud
// org enforces iam.disableServiceAccountKeyCreation, so a service account JSON
// key can't be issued. The script lives in scripts/apps-script/WebsiteLeads.gs;
// setup notes are at the top of that file. Server-only: reads the secret from env.

/** Must match the keys of FORMS in scripts/apps-script/WebsiteLeads.gs. */
export type LeadsSheetForm = "bookCall" | "newsletter";

export type SaveResult = "saved" | "not-configured" | "failed";

/** Appends one row to the form's tab. Logs failures rather than throwing. */
export async function appendToLeadsSheet(
  form: LeadsSheetForm,
  fields: Record<string, string>,
): Promise<SaveResult> {
  const webhookUrl = process.env.LEADS_SHEET_WEBHOOK_URL;
  const webhookSecret = process.env.LEADS_SHEET_WEBHOOK_SECRET;

  if (!webhookUrl || !webhookSecret) {
    console.error(
      "Missing LEADS_SHEET_WEBHOOK_URL / LEADS_SHEET_WEBHOOK_SECRET — see scripts/apps-script/WebsiteLeads.gs."
    );
    return "not-configured";
  }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...fields, form, secret: webhookSecret }),
      // Apps Script /exec URLs 302 to script.googleusercontent.com; fetch
      // follows that by default. Don't set redirect: "manual" here.
      signal: AbortSignal.timeout(15_000),
    });

    // Apps Script can't set status codes — it always answers 200 and reports
    // success in the body. Checking res.ok alone would swallow real failures.
    const result = await res.json().catch(() => null);
    if (!res.ok || !result?.ok) {
      console.error(`Leads sheet rejected the ${form} row:`, res.status, result);
      return "failed";
    }
    return "saved";
  } catch (err) {
    console.error(`Leads sheet unreachable for the ${form} row:`, err);
    return "failed";
  }
}
