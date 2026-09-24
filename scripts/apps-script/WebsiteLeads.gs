/**
 * PIXELUP LABS — the "Website Leads" spreadsheet's form intake.
 *
 * Each site form writes to its own tab, which this script creates on first use:
 *   - "Book a call": emails from the Book a call form
 *     (components/BookCallForm.tsx → app/api/book-call/route.ts). Written on
 *     submit, before the visitor picks a slot in the Cal.com popup, so it also
 *     catches people who leave without booking.
 *   - "Newsletter": the footer signup (components/NewsletterForm.tsx →
 *     app/api/newsletter/route.ts). An email that is already listed is skipped.
 *
 * This is NOT part of the Next.js build. It runs on Google's servers, attached
 * to the spreadsheet. Paste it into the Apps Script editor bound to that sheet
 * (Extensions → Apps Script) and deploy it as a Web App.
 *
 * Setup, in order:
 *   1. Replace SHARED_SECRET below with the same value as
 *      LEADS_SHEET_WEBHOOK_SECRET in .env.local.
 *   2. Deploy → New deployment → type "Web app".
 *        Execute as:      Me
 *        Who has access:  Anyone
 *      ("Anyone" is required — our server calls this without a Google login.
 *       SHARED_SECRET is what actually guards it.)
 *   3. Copy the /exec URL it gives you into LEADS_SHEET_WEBHOOK_URL in
 *      .env.local (and in Vercel's environment variables for production).
 *
 * Editing this file afterwards does nothing until you redeploy:
 * Deploy → Manage deployments → edit the existing one → Version: New version.
 * Creating a *new* deployment instead gives you a different URL.
 */

// Must match LEADS_SHEET_WEBHOOK_SECRET in .env.local exactly.
const SHARED_SECRET = 'PASTE_THE_SAME_VALUE_AS_LEADS_SHEET_WEBHOOK_SECRET';

/**
 * The forms that write here, each to its own tab. Keys must match
 * LeadsSheetForm in lib/leads-sheet.ts.
 *
 * `fields` is the column order after "Submitted at" — keep in sync with what
 * each API route sends. `headers` is only written if the tab is empty; an
 * existing header row is left untouched. `unique` names a field whose value
 * may appear only once in the tab.
 */
const FORMS = {
  bookCall: {
    sheet: 'Book a call',
    fields: ['email', 'page'],
    headers: ['Submitted at', 'Email', 'Page'],
  },
  newsletter: {
    sheet: 'Newsletter',
    fields: ['name', 'email'],
    headers: ['Submitted at', 'Name', 'Email'],
    unique: 'email',
  },
};

// Requests without a `form` key came from the first, Book-a-call-only version.
const DEFAULT_FORM = 'bookCall';

/**
 * Receives a submission from lib/leads-sheet.ts.
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

    const row = [new Date()];
    for (const field of form.fields) {
      row.push(asText(body[field]));
    }

    // Two submissions landing at once could otherwise write to the same row
    // (or both pass the duplicate check).
    const lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try {
      const sheet = getSheet(form);
      if (form.unique && isListed(sheet, form, row)) {
        return json({ ok: true, duplicate: true });
      }
      sheet.appendRow(row);
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
 * Call: <exec-url>?secret=<LEADS_SHEET_WEBHOOK_SECRET>
 */
function doGet(e) {
  const secret = e && e.parameter ? e.parameter.secret : null;
  if (secret !== SHARED_SECRET) {
    return json({ ok: false, error: 'Unauthorized' });
  }

  // Reports every tab, so setup for all forms can be checked in one call.
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

/** Returns a form's tab, creating it (with headers) if needed. */
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

/** Whether the row's `unique` value is already in its column (case-insensitive). */
function isListed(sheet, form, row) {
  const dataRows = sheet.getLastRow() - 1;
  if (dataRows < 1) return false;

  const index = form.fields.indexOf(form.unique) + 1; // +1 for "Submitted at"
  return Boolean(
    sheet
      .getRange(2, index + 1, dataRows, 1)
      .createTextFinder(row[index])
      .matchEntireCell(true)
      .matchCase(false)
      .findNext()
  );
}

/**
 * Sheets evaluates a cell starting with = + - or @ as a formula, and these
 * values come from site visitors — a leading apostrophe keeps them plain text.
 */
function asText(value) {
  const text = value == null ? '' : String(value).trim();
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function json(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  );
}
