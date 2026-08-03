/**
 * Shared constants for the perception audit form, hosted on Tally.
 *
 * Two places open the same form — the Navbar CTA and the AuditCta button in
 * the #audit section — both through components/TallyPopupLink.tsx, which owns
 * the popup behavior (including the click-before-embed.js-loads case).
 *
 * The embed script itself is loaded once in components/Navbar.tsx, which the
 * root layout renders on every route.
 */
export const TALLY_FORM_ID = "7ROjKa";

/** The hosted form — TallyPopupLink's href and its no-JS / blocked-script fallback. */
export const tallyFormUrl = `https://tally.so/r/${TALLY_FORM_ID}`;
