// Sends a playbook as a PDF attachment through Resend's REST API (no SDK: one
// POST). Server-only: reads the API key and the PDF's location from env.
//
// The PDF is never committed: this repository is public, so a file in it is a
// file anyone can download, form or no form. It comes from one of two places:
//   - private/playbooks/<file> on disk (git-ignored), for local development;
//   - the URL in the playbook's `urlEnv` variable, for deployments. Point it
//     at a private or unguessable file URL; it is fetched server-side and
//     never sent to the browser.
//
// Env:
//   RESEND_API_KEY        a Resend key with sending access (required)
//   PLAYBOOK_ENTERPRISE_HOMEPAGE_PDF_URL  where the deployed site gets the PDF
//   PLAYBOOK_EMAIL_FROM   optional sender, default below. The domain must be
//                         verified in Resend (pixeluplabs.com is).
//   PLAYBOOK_EMAIL_REPLY_TO  optional reply-to address

import { readFile } from "node:fs/promises";
import path from "node:path";
import { playbooks, type PlaybookId } from "@/lib/playbooks";

const DEFAULT_FROM = "PIXELUP LABS <hello@pixeluplabs.com>";

export type SendResult = "sent" | "not-configured" | "failed";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** The PDF from disk when it's there (local), else from its private URL. */
async function loadPdf(file: string, url: string | undefined): Promise<Buffer | null> {
  try {
    return await readFile(path.join(process.cwd(), "private", "playbooks", file));
  } catch {
    // Not on disk: the deployed case.
  }
  if (!url) return null;
  const res = await fetch(url, { signal: AbortSignal.timeout(20_000) });
  if (!res.ok) throw new Error(`Playbook PDF fetch failed: ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

/** Emails the playbook to one person. Logs failures rather than throwing. */
export async function sendPlaybookEmail({
  id,
  name,
  email,
}: {
  id: PlaybookId;
  name: string;
  email: string;
}): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("Missing RESEND_API_KEY — see lib/playbook-email.ts.");
    return "not-configured";
  }

  const playbook = playbooks[id];
  const firstName = name.trim().split(/\s+/)[0];
  const greeting = firstName ? `Hi ${firstName},` : "Hi,";
  const callUrl = `https://www.pixeluplabs.com/call?utm_source=playbook&utm_medium=email&utm_campaign=${playbook.file.replace(/\.pdf$/, "")}`;

  const lines = [
    greeting,
    `${playbook.title} is attached as a PDF.`,
    `It covers ${playbook.stats.map((stat) => `${stat.value} ${stat.label.toLowerCase()}`).join(", ")}.`,
    "If you'd like a second pair of eyes on your own homepage, book a call and we'll go through it together:",
  ];

  try {
    const pdf = await loadPdf(playbook.file, process.env[playbook.urlEnv]);
    if (!pdf) {
      console.error(`No PDF for ${playbook.file}: add it to private/playbooks/ or set ${playbook.urlEnv}.`);
      return "not-configured";
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.PLAYBOOK_EMAIL_FROM || DEFAULT_FROM,
        to: [email],
        ...(process.env.PLAYBOOK_EMAIL_REPLY_TO
          ? { reply_to: process.env.PLAYBOOK_EMAIL_REPLY_TO }
          : {}),
        subject: `Your copy of ${playbook.title}`,
        text: [...lines, callUrl, "", "PIXELUP LABS"].join("\n\n"),
        html: [
          ...lines.map((line) => `<p>${escapeHtml(line)}</p>`),
          `<p><a href="${callUrl}">Book a call</a></p>`,
          "<p>PIXELUP LABS</p>",
        ].join(""),
        attachments: [{ filename: playbook.file, content: pdf.toString("base64") }],
      }),
      signal: AbortSignal.timeout(30_000),
    });

    if (!res.ok) {
      console.error("Resend rejected the playbook email:", res.status, await res.text());
      return "failed";
    }
    return "sent";
  } catch (err) {
    console.error("Playbook email failed:", err);
    return "failed";
  }
}
