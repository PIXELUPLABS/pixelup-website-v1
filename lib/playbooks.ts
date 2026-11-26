// Lead-magnet playbooks offered on the site. Copy for the inline CTA and its
// request dialog (components/blog/PlaybookCta.tsx) lives here, and the id is
// what app/api/playbook-lead accepts. The PDF itself is emailed on request by
// lib/playbook-email.ts.

export const playbooks = {
  "enterprise-homepage": {
    title: "The Website Playbook to Look Enterprise-Ready",
    /** The PDF's name in private/playbooks/ locally. */
    file: "enterprise-homepage-playbook.pdf",
    /** The filename the reader sees on the email attachment. */
    attachmentName: "enterprise-website-playbook.pdf",
    /** Env variable holding the PDF's private URL on deployments. */
    urlEnv: "PLAYBOOK_ENTERPRISE_HOMEPAGE_PDF_URL",
    // The playbook's own cover subheading, word for word, broken where the
    // cover breaks it.
    descriptionLines: [
      "The only playbook you need to look enterprise-ready",
      "and appeal to every persona in your customer journey.",
    ],
    /** The request dialog's heading: a shorter cut of the subheading above. */
    dialogHeading: "The only playbook you need to look enterprise-ready to every buyer persona",
  },
} as const;

export type PlaybookId = keyof typeof playbooks;
