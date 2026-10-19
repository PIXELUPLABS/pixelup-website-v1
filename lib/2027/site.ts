// Copy and data for the /2027 homepage, ported from the 2026 site repo
// (daksh6131/pixelup-labs-website-2026 @ 9ff5dd4, src/content/site.ts) and trimmed to what the homepage renders.
// Every project links to the client's own site: the case studies on this domain are still the old design.

export type Media =
  | { kind: 'image'; src: string; alt: string; position?: string }
  | { kind: 'video'; src: string; alt: string }
  | { kind: 'logo'; src: string; width: number; height: number }
  | { kind: 'field' };

export const site = {
  name: 'PIXELUP',
  legalName: 'PIXELUP LABS',
  tagline: 'A full service design studio.',
  description: 'We build brands, websites and products that command enterprise trust.',
  email: 'hello@pixeluplabs.com',
  status: '2 slots available',
  socials: [
    { label: 'Contra', href: 'https://contra.com/daksh_aswal_dt5tfn27' },
    { label: 'X', href: 'https://x.com/dakshpixelup' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/dakshpixelup/' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Legal', href: '#' },
  ],
};

/* ---------------------------------------------------------------
   Portfolio — from pixeluplabs.com
---------------------------------------------------------------- */

export type Project = {
  client: string;
  summary: string;
  scope: string[];
  /** The client's own website. */
  href: string;
  cover: Media;
};

const img = (name: string, alt: string, position?: string): Media => ({ kind: 'image', src: `/media/2027/projects/${name}.jpg`, alt, position });

export const projects: Project[] = [
  {
    client: 'Greptile',
    summary: 'AI-native dev tool startup, Series A $25M',
    scope: ['Product', 'Brand'],
    href: 'https://greptile.com/',
    cover: img('greptile', 'Greptile mark rendered as a glowing green glass object'),
  },
  {
    client: 'Henry Labs',
    summary: 'Embedded checkout for agentic commerce',
    scope: ['Brand', 'Web', 'Product'],
    href: 'https://www.henrylabs.ai/',
    cover: { kind: 'video', src: '/media/henry-labs.mp4', alt: 'Henry Labs brand film' },
  },
  {
    client: 'Replay',
    summary: 'Data as growth capital',
    scope: ['Brand', 'Web', 'Product', 'Next.js'],
    href: 'https://www.replay.ai/',
    cover: img('replay', 'Replay wordmark on a deep blue textured field'),
  },
  {
    client: 'CTGT',
    summary: 'Applied interpretability lab for regulated industries',
    scope: ['Brand', 'Web'],
    href: 'https://www.ctgt.ai/',
    cover: img('ctgt', 'CTGT website hero over a misty mountain range', '35% 50%'),
  },
  {
    client: 'Streamline',
    summary: 'AI intake and workflow automation for in-house legal',
    scope: ['Brand', 'Web'],
    href: 'https://www.streamline.ai/',
    cover: img('streamline', 'Streamline wordmark with brand imagery and product screens'),
  },
  {
    client: 'Sainapse',
    summary: 'AI customer intelligence for enterprise support teams',
    scope: ['Brand', 'Web'],
    href: 'https://sainapse-staging.webflow.io/',
    cover: { kind: 'video', src: '/media/sainapse.mp4', alt: 'Sainapse brand film' },
  },
  {
    client: 'Reducto',
    summary: 'Agentic document platform for enterprise AI teams',
    scope: ['Product', 'Web'],
    href: 'https://reducto.ai/',
    cover: img('reducto', 'Reducto logo on a pixel grid'),
  },
  {
    client: 'Valley',
    summary: 'AI outbound sales platform for B2B revenue teams',
    scope: ['Brand', 'Web'],
    href: 'https://www.joinvalley.co/',
    cover: img('valley', 'Valley mark on a soft teal and peach field'),
  },
  {
    client: 'Sully.ai',
    summary: 'AI clinical agents for hospitals and health systems',
    scope: ['Brand', 'Web'],
    href: 'https://sully.ai/',
    cover: img('sully', 'Sully website on a laptop'),
  },
  {
    client: 'Zenact',
    summary: 'AI agents that test apps like real users',
    scope: ['Brand', 'Web', 'Webflow'],
    href: 'https://zenact.ai/',
    cover: img('zenact', 'Zenact website on a monitor against an orange gradient'),
  },
  {
    client: 'Autumn',
    summary: 'The drop-in billing layer for AI startups',
    scope: ['Brand', 'Web', 'Next.js'],
    href: 'https://useautumn.com/',
    cover: img('autumn', 'Autumn wordmark over a portrait lit in violet'),
  },
  {
    client: 'Pogo',
    summary: 'AI interviews with purchase-verified audiences',
    scope: ['Brand', 'Web', 'Webflow'],
    href: 'https://www.joinpogo.com/',
    cover: img('pogo', 'Pogo app on a phone held against a lilac backdrop'),
  },
  {
    client: 'Monumint',
    summary: 'Conversational AI for finance institutions',
    scope: ['Brand', 'Web', 'Framer'],
    href: 'https://monumint.ai/',
    cover: img('monumint', 'Monumint website on a laptop'),
  },
];

/* ---------------------------------------------------------------
   Home work grid — the Figma's scattered layout, filled from the portfolio
---------------------------------------------------------------- */

export type Work = {
  client: string;
  summary: string;
  scope: string[];
  media: Media;
  href?: string;
  /** Desktop geometry from the Figma frame: [x, y, width, mediaHeight] on the 1440 canvas, y from the top of the grid. */
  frame: [number, number, number, number];
};

const frames: Record<string, Work['frame']> = {
  Greptile: [357, 121, 441, 388],
  Replay: [810, 40, 321, 343],
  CTGT: [1143, 80, 273, 343],
  Streamline: [634, 594, 496, 343],
  'Henry Labs': [24, 0, 321, 275],
  Sainapse: [24, 391, 321, 275],
  'Sully.ai': [1142, 517, 273, 228],
  Reducto: [24, 782, 598, 275],
  Zenact: [1143, 823, 273, 343],
  Monumint: [810, 1015, 321, 343],
  Pogo: [357, 1096, 441, 388],
  Autumn: [24, 1132, 321, 275],
  Valley: [634, 1518, 496, 343],
};

export const work: Work[] = projects
  .filter((p) => frames[p.client])
  .map((p) => ({ client: p.client, summary: p.summary, scope: p.scope, media: p.cover, href: p.href, frame: frames[p.client] }));

/** Height of the desktop work canvas in design px (bottom of the lowest card plus its caption). */
export const workCanvasHeight = 1915;

/** Logos from pixeluplabs.com/clients. `w`/`h` are the artwork's viewBox; `ink` is the [top, bottom] fraction
    of that height the visible mark occupies, where it isn't the full box (measured from the rendered file). */
export const clients: { name: string; src: string; w: number; h: number; ink?: [number, number] }[] = [
  { name: 'Greptile', src: '/media/logos/clients/greptile.svg', w: 256, h: 62 },
  { name: 'Razorpay', src: '/media/2027/clients/razorpay.png', w: 106, h: 32, ink: [0.063, 0.789] },
  { name: 'Bland.ai', src: '/media/logos/bland.svg', w: 76, h: 22 },
  { name: 'Reducto', src: '/media/logos/clients/reducto.svg', w: 103, h: 18 },
  { name: 'Streamline.ai', src: '/media/logos/streamline.svg', w: 151, h: 31, ink: [0, 0.742] },
  { name: 'Sully.ai', src: '/media/logos/clients/sully.svg', w: 475, h: 98 },
  { name: 'Pogo', src: '/media/logos/pogo.svg', w: 60, h: 29 },
  { name: 'Valley', src: '/media/logos/clients/valley.svg', w: 215, h: 51 },
  { name: 'CTGT', src: '/media/logos/clients/ctgt.svg', w: 348, h: 95 },
  { name: 'Autumn', src: '/media/logos/clients/autumn-pricing.svg', w: 894, h: 220 },
  { name: 'Monumint', src: '/media/logos/clients/monumint.svg', w: 817, h: 109 },
  { name: 'Sainapse', src: '/media/logos/sainapse.svg', w: 155, h: 28 },
  { name: 'Limelight', src: '/media/logos/clients/limelight.svg', w: 600, h: 107 },
  { name: 'Revyl', src: '/media/logos/clients/revyl.svg', w: 1100, h: 300 },
  { name: 'Zenact', src: '/media/logos/clients/zenact.svg', w: 1347, h: 188 },
  { name: 'Henry Labs', src: '/media/logos/clients/henrylabs.svg', w: 1453, h: 208 },
  { name: 'Jumbo', src: '/media/logos/clients/jumbo.svg', w: 870, h: 180 },
  { name: 'DayFlow', src: '/media/logos/clients/dayflow.svg', w: 1195, h: 339 },
  { name: 'Synthio Labs', src: '/media/logos/clients/synthio-labs.svg', w: 1217, h: 212 },
  { name: 'Workers.io', src: '/media/logos/clients/workers-io.svg', w: 797, h: 125 },
  { name: "Audrion's", src: '/media/logos/clients/audrion.svg', w: 284, h: 32 },
];

export const about = {
  statement: 'Your product is enterprise-grade. Your brand still looks like a prototype.',
  body: 'AI products now ship faster than the brands around them. Buyers and investors judge you on your site and deck before they ever try the product. PIXELUP LABS designs the brands, websites and launches that make hard-to-explain AI products trusted on first sight.',
};

export const services = [
  {
    title: 'Brand Sprint',
    summary: 'Positioning, identity system, typography and motion principles. Everything a launch needs to look inevitable.',
    tags: ['Strategy', 'Identity', 'Type', 'Motion'],
  },
  {
    title: 'Website Sprint',
    summary: 'Narrative, design and build of a fast marketing site your team can run on its own after launch.',
    tags: ['Narrative', 'Design', 'Build', 'CMS'],
  },
  {
    title: 'Design Retainer',
    summary: 'A senior design team on call for launches, decks, product marketing and everything after.',
    tags: ['Launches', 'Decks', 'Product', 'Campaigns'],
  },
];
