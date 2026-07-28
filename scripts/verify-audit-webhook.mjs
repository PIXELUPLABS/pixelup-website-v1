// Verifies the Apps Script webhook in .env.local is reachable and writing rows.
// Run: node scripts/verify-audit-webhook.mjs
//
// Does a read-only health check first, then appends one clearly-labelled test
// row so you can confirm it lands in the sheet.
import nextEnv from "@next/env";

nextEnv.loadEnvConfig(process.cwd());

const url = process.env.AUDIT_WEBHOOK_URL;
const secret = process.env.AUDIT_WEBHOOK_SECRET;

const missing = [
  ["AUDIT_WEBHOOK_URL", url],
  ["AUDIT_WEBHOOK_SECRET", secret],
]
  .filter(([, value]) => !value)
  .map(([name]) => name);

if (missing.length) {
  console.error(`✗ Not set in .env.local: ${missing.join(", ")}`);
  process.exit(1);
}

if (!url.endsWith("/exec")) {
  console.error(`✗ AUDIT_WEBHOOK_URL should end in /exec — got: ${url}`);
  if (url.endsWith("/dev")) {
    console.error(`  The /dev URL requires a Google login. Use the /exec URL from`);
    console.error(`  Deploy → Manage deployments.`);
  }
  process.exit(1);
}

const fail = (message, ...hints) => {
  console.error(`\n✗ ${message}`);
  hints.forEach((hint) => console.error(`  ${hint}`));
  process.exit(1);
};

// ---- 1. Health check (doGet) ----
let health;
try {
  const res = await fetch(`${url}?secret=${encodeURIComponent(secret)}`, {
    signal: AbortSignal.timeout(20_000),
  });
  const text = await res.text();

  try {
    health = JSON.parse(text);
  } catch {
    // A login page instead of JSON is the classic misconfigured-access symptom.
    if (/<html/i.test(text)) {
      fail(
        "Got an HTML page instead of JSON — the deployment isn't publicly reachable.",
        'In Deploy → Manage deployments, set "Who has access" to Anyone,',
        'and "Execute as" to Me, then redeploy as a New version.'
      );
    }
    fail(`Unexpected response: ${text.slice(0, 200)}`);
  }
} catch (err) {
  fail(`Could not reach the webhook: ${err.message}`);
}

if (!health.ok) {
  if (health.error === "Unauthorized") {
    fail(
      "The script rejected the secret.",
      "SHARED_SECRET in the Apps Script editor must exactly match",
      "AUDIT_WEBHOOK_SECRET in .env.local — then redeploy as a New version",
      "(saving the script alone does not update the live deployment)."
    );
  }
  fail(`Health check failed: ${health.error ?? JSON.stringify(health)}`);
}

console.log(`✓ Reached spreadsheet: "${health.spreadsheet}"`);
for (const [form, info] of Object.entries(health.tabs ?? {})) {
  console.log(`  ${form} → tab "${info.tab}" (${info.rows} existing rows)`);
}

// ---- 2. Write a test row to each form's tab (doPost) ----
const testRows = [
  {
    form: "audit",
    payload: {
      form: "audit",
      name: "TEST ROW",
      email: "delete-me@example.com",
      siteToAudit: "verify-audit-webhook.mjs",
      linkedin: "-",
      icp: "-",
      anythingElse: "This row was written by the setup verification script.",
    },
  },
  {
    form: "newsletter",
    payload: { form: "newsletter", name: "TEST ROW", email: "delete-me@example.com" },
  },
];

for (const { form, payload } of testRows) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret, ...payload }),
    signal: AbortSignal.timeout(20_000),
  });

  const result = await res.json().catch(() => null);

  if (!result?.ok) {
    fail(`Write to ${form} failed: ${result?.error ?? `HTTP ${res.status}`}`);
  }

  console.log(`✓ Wrote a test row to the ${form} tab`);
}

console.log("\nAll good — both forms will now write to this sheet.");
console.log("Delete the TEST ROWs from both tabs before you go live.");
