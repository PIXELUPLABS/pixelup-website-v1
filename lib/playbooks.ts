// Lead-magnet playbooks offered on the site. Copy for the inline CTA and its
// request dialog (components/blog/PlaybookCta.tsx) lives here, and the id is
// what app/api/playbook-lead accepts. The PDF itself is emailed on request by
// lib/playbook-email.ts.

export const playbooks = {
  "enterprise-homepage": {
    title: "The Homepage Playbook to Look Enterprise-Ready",
    /** The attachment's filename, and its name in private/playbooks/ locally. */
    file: "enterprise-homepage-playbook.pdf",
    /** Env variable holding the PDF's private URL on deployments. */
    urlEnv: "PLAYBOOK_ENTERPRISE_HOMEPAGE_PDF_URL",
    // The playbook's own cover subheading, word for word, broken where the
    // cover breaks it.
    descriptionLines: [
      "The only playbook you need to look enterprise-ready",
      "and appeal to every persona in your customer journey.",
    ],
    stats: [
      { value: "13", label: "Homepages" },
      { value: "37", label: "Examples" },
      { value: "7", label: "Trust signals" },
    ],
  },
} as const;

export type PlaybookId = keyof typeof playbooks;
