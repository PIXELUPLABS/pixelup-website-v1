/**
 * PIXELUP LABS — form intake for the audit form and the footer newsletter.
 *
 * Audit submissions land in "Sheet1"; newsletter signups land in "Newsletter",
 * which this script creates on first use.
 *
 * This is NOT part of the Next.js build. It runs on Google's servers, attached
 * to the submissions spreadsheet. Paste it into the Apps Script editor bound to
 * that sheet (Extensions → Apps Script) and deploy it as a Web App.
 *
 * Setup, in order:
 *   1. Replace SHARED_SECRET below with the same value as AUDIT_WEBHOOK_SECRET
 *      in .env.local.
 *   2. Deploy → New deployment → type "Web app".
 *        Execute as:      Me
 *        Who has access:  Anyone
 *      ("Anyone" is required — our server calls this without a Google login.
 *       SHARED_SECRET is what actually guards it.)
 *   3. Copy the /exec URL it gives you into AUDIT_WEBHOOK_URL in .env.local.
 *
 * Editing this file afterwards does nothing until you redeploy:
 * Deploy → Manage deployments → edit the existing one → Version: New version.
 * Creating a *new* deployment instead gives you a different URL.
 */

// Must match AUDIT_WEBHOOK_SECRET in .env.local exactly.
const SHARED_SECRET = 'PASTE_THE_SAME_VALUE_AS_AUDIT_WEBHOOK_SECRET';

/**
 * The two forms that write here, each to its own tab.
 *
 * `fields` is the column order — keep in sync with `fields` in
 * app/api/audit/route.ts and app/api/newsletter/route.ts.
 *
 * `headers` is only written if the tab is empty; an existing header row is
 * left untouched. The audit headers match the live sheet's wording exactly.
 */
const FORMS = {
  audit: {
    sheet: 'Sheet1',
    fields: ['name', 'email', 'siteToAudit', 'linkedin', 'icp', 'anythingElse'],
    headers: ['Name', 'Email', 'Site to audit', 'LinkedIn', 'ICP', 'Anything Else'],
  },
  newsletter: {
    sheet: 'Newsletter',
    fields: ['name', 'email'],
    headers: ['Name', 'Email'],
  },
};

// Requests without a `form` key are audit submissions.
const DEFAULT_FORM = 'audit';

/**
 * Receives a submission from app/api/audit/route.ts.
 *
 * Apps Script web apps always respond 200 — ContentService can't set a status
 * code. So success/failure is signalled in the JSON body, and the Next route
 * checks `ok` rather than the HTTP status.
 */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return json({ ok: false, error: 'Empty request body' });
    }

    const body = JSON.parse(e.postData.contents);

    if (body.secret !== SHARED_SECRET) {
      return json({ ok: false, error: 'Unauthorized' });
    }

    const formName = body.form || DEFAULT_FORM;
    const form = FORMS[formName];
    if (!form) {
      return json({ ok: false, error: 'Unknown form: ' + formName });
    }

    // No timestamp column — each tab's columns are exactly form.fields.
    const row = [];
    for (const field of form.fields) {
      row.push(body[field] == null ? '' : String(body[field]));
    }

    // Two submissions landing at once could otherwise write to the same row.
    const lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try {
      getSheet(form).appendRow(row);
    } finally {
      lock.releaseLock();
    }

    return json({ ok: true });
  } catch (err) {
    // Surfaces in Apps Script → Executions if something goes wrong in production.
    console.error(err);
    return json({ ok: false, error: String(err && err.message ? err.message : err) });
  }
}

/**
 * Health check, so setup can be verified without writing a row.
 * Call: <exec-url>?secret=<AUDIT_WEBHOOK_SECRET>
 */
function doGet(e) {
  const secret = e && e.parameter ? e.parameter.secret : null;
  if (secret !== SHARED_SECRET) {
    return json({ ok: false, error: 'Unauthorized' });
  }

  // Reports every tab, so setup for both forms can be checked in one call.
  const tabs = {};
  let spreadsheet = null;
  for (const formName of Object.keys(FORMS)) {
    const sheet = getSheet(FORMS[formName]);
    if (!spreadsheet) spreadsheet = sheet.getParent().getName();
    tabs[formName] = {
      tab: sheet.getName(),
      rows: Math.max(0, sheet.getLastRow() - 1), // minus the header row
    };
  }

  return json({ ok: true, spreadsheet: spreadsheet, tabs: tabs });
}

/** Returns a form's target tab, creating it (with headers) if needed. */
function getSheet(form) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(form.sheet);

  if (!sheet) {
    sheet = ss.insertSheet(form.sheet);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(form.headers);
    sheet.getRange(1, 1, 1, form.headers.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function json(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  );
}
