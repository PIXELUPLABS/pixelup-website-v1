// Every email field on the site takes work addresses only: personal webmail
// (gmail, yahoo, outlook…), ISP mailboxes and throwaway inboxes are rejected.
// Shared by the forms (instant feedback through the browser's own validation
// bubble, same as a malformed address) and their API routes (the real gate,
// since the client check can be skipped).
//
// Forms: BookCallForm, NewsletterForm, blog/AuditLeadMagnet, blog/PlaybookCta.
// Routes: app/api/book-call, newsletter, audit-lead, audit, playbook-lead.
//
// Third-party forms (the Cal.com booking form, the Tally audit popup) collect
// their own email fields and aren't covered by this; they need the same rule
// set in those tools.

/** Shown in the browser's validation bubble and returned by the API routes. */
export const WORK_EMAIL_MESSAGE = "Please use your work email.";

/**
 * Providers that own their name across many country domains (yahoo.co.in,
 * hotmail.co.uk, outlook.de, gmx.at…). Matched as `<name>.<tld>` or
 * `<name>.co(m).<cc>` so each country variant doesn't need its own entry.
 */
const FREE_PROVIDER_FAMILIES = new Set([
  "aol",
  "gmail",
  "gmx",
  "googlemail",
  "hotmail",
  "outlook",
  "rocketmail",
  "yahoo",
  "yandex",
  "ymail",
]);

/** Single-domain personal, ISP and disposable mailboxes. */
const FREE_EMAIL_DOMAINS = new Set([
  // Personal webmail
  "126.com",
  "139.com",
  "163.com",
  "aim.com",
  "duck.com",
  "email.com",
  "fastmail.com",
  "fastmail.fm",
  "hey.com",
  "hushmail.com",
  "icloud.com",
  "inbox.com",
  "live.ca",
  "live.co.uk",
  "live.com",
  "live.com.au",
  "live.de",
  "live.fr",
  "live.in",
  "live.it",
  "live.nl",
  "mac.com",
  "mail.com",
  "me.com",
  "msn.com",
  "pm.me",
  "proton.me",
  "protonmail.ch",
  "protonmail.com",
  "qq.com",
  "rediff.com",
  "rediffmail.com",
  "sina.com",
  "sohu.com",
  "tuta.io",
  "tutanota.com",
  "tutanota.de",
  "yeah.net",
  "zoho.com",
  "zohomail.com",
  "zohomail.in",
  // Regional webmail
  "bk.ru",
  "daum.net",
  "freenet.de",
  "hanmail.net",
  "inbox.ru",
  "interia.pl",
  "libero.it",
  "list.ru",
  "mail.ru",
  "naver.com",
  "o2.pl",
  "onet.pl",
  "rambler.ru",
  "seznam.cz",
  "ukr.net",
  "virgilio.it",
  "web.de",
  "wp.pl",
  // ISP mailboxes
  "att.net",
  "bellsouth.net",
  "bigpond.com",
  "btinternet.com",
  "charter.net",
  "comcast.net",
  "cox.net",
  "earthlink.net",
  "free.fr",
  "laposte.net",
  "optonline.net",
  "orange.fr",
  "rogers.com",
  "sbcglobal.net",
  "sfr.fr",
  "shaw.ca",
  "sky.com",
  "t-online.de",
  "talktalk.net",
  "verizon.net",
  "virginmedia.com",
  "wanadoo.fr",
  // Disposable inboxes
  "10minutemail.com",
  "dispostable.com",
  "getnada.com",
  "guerrillamail.com",
  "maildrop.cc",
  "mailinator.com",
  "sharklasers.com",
  "temp-mail.org",
  "tempmail.com",
  "throwawaymail.com",
  "trashmail.com",
  "yopmail.com",
]);

const FAMILY_DOMAIN = /^([a-z0-9-]+)\.(?:[a-z]{2,3}|com?\.[a-z]{2})$/;

function domainOf(email: string): string {
  const at = email.lastIndexOf("@");
  if (at === -1) return "";
  return email
    .slice(at + 1)
    .trim()
    .toLowerCase()
    .replace(/\.$/, "");
}

/** True for an address on a personal, ISP or disposable mail domain. */
export function isPersonalEmail(email: string): boolean {
  const domain = domainOf(email);
  if (!domain) return false;

  const family = FAMILY_DOMAIN.exec(domain)?.[1];
  if (family && FREE_PROVIDER_FAMILIES.has(family)) return true;

  // Also catches subdomains, e.g. "mx.yopmail.com".
  const labels = domain.split(".");
  for (let i = 0; i < labels.length - 1; i++) {
    if (FREE_EMAIL_DOMAINS.has(labels.slice(i).join("."))) return true;
  }
  return false;
}

/**
 * For an email input's onChange: blocks submission with the work-email
 * message while a personal address is typed, through the same native
 * validation bubble the browser already shows for a malformed address.
 */
export function checkWorkEmailInput(input: HTMLInputElement) {
  input.setCustomValidity(isPersonalEmail(input.value) ? WORK_EMAIL_MESSAGE : "");
}
