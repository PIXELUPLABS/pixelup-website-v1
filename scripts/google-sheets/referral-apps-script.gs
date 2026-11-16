/**
 * PIXELUP LABS partner applications → Google Sheet.
 *
 * Paste this into the sheet's Apps Script editor (Extensions → Apps Script)
 * and deploy it as a web app. The website's /api/referral route POSTs each
 * application here as JSON; this script appends one row per application.
 *
 * Setup (one time):
 *   1. Project Settings → Script properties → add SHARED_SECRET with a long
 *      random value. Put the same value in the site's REFERRAL_SHEET_SECRET.
 *   2. Deploy → New deployment → type "Web app":
 *        Execute as: Me
 *        Who has access: Anyone
 *      Copy the web app URL into the site's REFERRAL_SHEET_WEBHOOK_URL.
 *   3. After editing this script, Deploy → Manage deployments → edit the
 *      existing deployment → Version: "New version". The URL stays the same.
 *
 * Columns are matched by header name, so the tab's columns can be reordered
 * freely. Any field without a matching header gets a new column at the end,
 * and an empty tab gets the full header row on the first submission.
 */

// The tab to write to. Created on the first submission if it doesn't exist,
// so the script works in any spreadsheet it is attached to.
var SHEET_NAME = "Applications";

function doPost(e) {
  try {
    var body = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    var secret = PropertiesService.getScriptProperties().getProperty("SHARED_SECRET");
    if (!secret || body.secret !== secret) {
      return json({ ok: false, error: "Unauthorized" });
    }
    var row = body.row;
    if (!row || typeof row !== "object") {
      return json({ ok: false, error: "Missing row" });
    }

    // One writer at a time, so two submissions can't race on header changes
    // or land on the same row.
    var lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try {
      appendRow(getSheet(), row);
    } finally {
      lock.releaseLock();
    }
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function getSheet() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  return spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
}

function appendRow(sheet, row) {
  var keys = Object.keys(row);
  var lastColumn = sheet.getLastColumn();
  var headers =
    lastColumn > 0 ? sheet.getRange(1, 1, 1, lastColumn).getValues()[0].map(String) : [];

  // Add a header for every field the tab doesn't have yet.
  var missing = keys.filter(function (key) {
    return headers.indexOf(key) === -1;
  });
  if (missing.length) {
    sheet.getRange(1, headers.length + 1, 1, missing.length).setValues([missing]);
    headers = headers.concat(missing);
    sheet.setFrozenRows(1);
  }

  var values = headers.map(function (header) {
    return Object.prototype.hasOwnProperty.call(row, header) ? clean(row[header]) : "";
  });
  sheet.appendRow(values);
}

// Text starting with = + - @ would run as a formula in Sheets: store it as
// plain text instead.
function clean(value) {
  if (typeof value !== "string") return value;
  return /^[=+\-@]/.test(value) ? "'" + value : value;
}

function json(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  );
}
