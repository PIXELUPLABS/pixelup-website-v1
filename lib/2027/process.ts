// How we work, served at /process (ported from the 2026 site repo's /how-we-work): a standalone page sent to leads before the discovery call. It answers
// their questions about the process so the call can be about their project. It explains, it doesn't sell:
// no prices, proof or case studies, and no site nav. Built on the proposal components, written for any reader
// (no client dates or timezones). Keep its numbers in step with the proposals and the engagement guidelines;
// a lead who sees two different numbers trusts neither.
//
// House terms, agreed 19 Oct 2026. New proposals and engagement guidelines use these unless a deal says otherwise:
// - Time: Brand Sprint 4 weeks; brand + website about 7 (a homepage plus 4 pages); Website Sprint alone 4;
//   brand and homepage in parallel about 5 for a hard launch date.
// - Client time: one 30-minute call a week plus 15 minutes of Figma comments, plus the brand workshop in week 1.
//   Copy approval in week 4 is async.
// - Onboarding: the onboarding form and brand questionnaire, then one kickoff call for the whole project at least a day
//   later. The brand phase opens with the brand workshop at the end of week 1: 60–90 minutes, run by Daksh, after our
//   first research, with a FigJam board shared beforehand.
// - Copy: who writes the website copy, the client or us, is agreed at kickoff; it is locked before high-fidelity design.
// - Team: Daksh on every call, a project owner, two senior designers (brand, web) and a developer.
// - Cadence: two async updates a week, notes after every call, replies within one business day.
// - Revisions: two rounds per stage (directions, identity, copy, homepage, inner pages, build); one
//   consolidated list, sent within 2 business days, is one round.
// - Care: 15 days of fixes after launch. Ownership of all files and platforms transfers at launch.
// - Payment: contract and a 50% deposit (bank transfer or Contra) reserve the start; 50% at handoff.
//   Brand from $15,000, brand + website from $25,000, Website Sprint priced per proposal, retainer from $6,000 / month.
import type { ProposalContent } from './proposal-types';

export const howWeWork: ProposalContent = {
  kicker: 'How we work · Brand + website',
  title: 'Brand and website in about seven weeks. Here’s how it runs.',
  lede: 'Read this before our call. It covers how long the project takes, how much of your time it needs, who does the work, how feedback works and what you get at the end.',
  meta: [
    { label: 'Timeline', value: 'About 7 weeks', note: 'Kickoff to launch', icon: 'layers' },
    { label: 'Your time', value: '45 min / week', note: 'Plus a 60–90 min brand workshop', icon: 'clock' },
    { label: 'Revisions', value: '2 rounds', note: 'At every stage', icon: 'frame' },
    { label: 'Your contact', value: 'Daksh', note: 'Founder & Creative Director', icon: 'contact' },
  ],
  order: ['schedule', 'week', 'split', 'rules', 'run', 'deliverables', 'next'],
  labels: {
    schedule: 'How long does it take?',
    week: 'How much of my time?',
    split: 'Who does the work?',
    rules: 'How do I know where things stand?',
    run: 'What if we want changes?',
    deliverables: 'What do I walk away with?',
    next: 'What happens next?',
  },
  schedule: {
    heading: 'About seven weeks, kickoff to launch.',
    body: 'One kickoff call starts the whole project. The brand comes first, in weeks 1 to 4, opening with the brand workshop. The website starts in week 4 with the site structure and copy, and is planned to launch in week 7. Each week is planned around one decision from you.',
    sprints: [
      {
        name: 'Kickoff',
        note: 'Week 1',
        sum: '1 call',
        bar: 'Call',
        from: 1,
        to: 1,
        weeks: [
          {
            week: 1,
            bring: 'One kickoff call for the whole project: the team, the plan, your launch date, who writes the copy and your weekly slot',
            decide: 'Agree the plan',
          },
        ],
      },
      {
        name: 'Brand',
        note: 'Weeks 1–4',
        sum: 'Workshop + 3 calls',
        from: 1,
        to: 4,
        weeks: [
          {
            week: 1,
            bring: 'Our first research into your category and competitors, then the brand workshop: 60–90 minutes with Daksh on your market, your customers and where the brand should go',
            decide: 'Lock the angle',
            flag: 'Prepare for the workshop: we share the FigJam board a few days before',
          },
          { week: 2, bring: '2–3 directions, each shown in use, with a Loom or notes on the thinking behind it', decide: 'Pick a direction' },
          { week: 3, bring: 'Logo explorations: a wide first round of rough options, then a shortlist refined with type and colour', decide: 'Pick the logo' },
          { week: 4, bring: 'The identity system and guidelines: logo, type, colour, illustration style, templates and brand.md', decide: 'Sign off the brand' },
        ],
      },
      {
        name: 'Website',
        note: 'Weeks 4–7',
        sum: '3 more calls',
        from: 4,
        to: 7,
        weeks: [
          { week: 4, bring: 'Site structure and homepage copy. Who writes the copy, you or us, is agreed at kickoff.', decide: 'Approve the structure and copy async' },
          { week: 5, bring: 'Wireframes, then the high-fidelity homepage on desktop and mobile', decide: 'Approve the homepage. Lock the inner-page copy.' },
          { week: 6, bring: 'Inner pages, while the build starts from the approved homepage', decide: 'Approve the inner pages' },
          { week: 7, bring: 'The build on a staging link, QA against the designs on desktop and mobile, a Loom walkthrough for you, then handover and launch', decide: 'Go live' },
        ],
      },
    ],
  },
  week: {
    heading: '45 minutes a week, plus the workshop.',
    body: 'A 30-minute call in the same slot every week, picked at kickoff. Then about 15 minutes leaving comments in Figma, whenever suits you. Week 1 asks for more: the kickoff call and the brand workshop, 60–90 minutes plus some prep on the board we share. So does the website copy. If you’re writing it, start at kickoff so the homepage copy is ready by week 4. If we’re writing it, set aside time in week 4 to check it. Miss a call and we take your feedback async and keep going.',
  },
  split: {
    heading: 'Daksh leads every call.',
    items: [
      { label: 'Founder & Creative Director Daksh', text: 'Runs the brand workshop, leads every call and reviews all work before it reaches you.' },
      { label: 'Project owner', text: 'Owns your timeline from kickoff to handover.' },
      { label: 'Two senior designers', text: 'One on brand, one on web. The same people from start to finish.' },
      { label: 'Developer', text: 'Builds the site in Webflow, Framer or Next.js.' },
      { label: 'You', text: 'One person who makes the final calls and sends your team’s feedback as one list.' },
    ],
  },
  rules: {
    heading: 'Everything happens in one shared Slack channel.',
    intro: 'It opens the day you sign. Add anyone on your team who should see the work.',
    items: [
      { icon: 'message', label: 'Async updates', text: 'Two a week: what moved, what’s next and what we need from you.' },
      { icon: 'calendar', label: 'Call notes', text: 'Posted the same day: decisions, next steps on each side, dates.' },
      { icon: 'frame', label: 'Reviews', text: 'A Figma link and a note on what changed and what to look at, usually with a short Loom.' },
      { icon: 'layers', label: 'Project plan', text: 'Every milestone, shared at kickoff and kept up to date.' },
      { icon: 'clock', label: 'Questions', text: 'Ask anything in the channel, any time. We reply within one business day.' },
    ],
  },
  run: {
    heading: 'Two rounds of revisions at every stage.',
    items: [
      { icon: 'contact', label: 'One round', text: 'Your feedback as one list, within 2 business days: design notes as Figma comments, copy edits in the shared doc.' },
      { icon: 'layers', label: 'Stages', text: 'Directions, identity, copy, homepage, inner pages and build.' },
      { icon: 'message', label: 'Copy first', text: 'Copy is written before the wireframes and locked before high-fidelity design, so pages aren’t redesigned around new words.' },
      { icon: 'flag', label: 'Out of scope', text: 'If you ask for something outside the agreed scope, we quote it before starting. You decide.' },
    ],
  },
  deliverables: {
    heading: 'A brand, a live website and the source files.',
    groups: [
      {
        name: 'Brand',
        note: 'Weeks 1–4',
        items: [
          'The brand workshop board and our research into your competitors and category',
          'Positioning and messaging',
          'A logo and identity system: type, colour, illustration style and motion principles',
          'Brand guidelines',
          'Templates for decks, social banners, OG images and email signatures',
          'A brand.md your engineers and AI tools can build from',
        ],
      },
      {
        name: 'Website',
        note: 'Weeks 4–7',
        items: [
          'Site structure, plus the copy if we’re writing it',
          'A homepage plus 4 pages, designed for desktop and mobile',
          'Built in Webflow, Framer or Next.js, with a CMS where you need one',
          'A component library and .md docs, so your team can extend the site',
          'CMS walkthrough videos and a handoff call with your developer',
        ],
      },
      {
        name: 'Handover',
        note: 'At launch',
        items: [
          'All source files, brand assets and platform accounts move to you',
          'The site in your Webflow or Framer workspace, or the code in your GitHub for your team to merge and deploy',
          'One handoff folder: Figma, guidelines, assets and screen recordings',
        ],
      },
      {
        name: 'After launch',
        note: '15 days',
        items: ['Fixes for bugs, browser and device issues, broken links or forms', 'Small copy changes you send us'],
      },
    ],
  },
  next: {
    heading: 'From our call to week 1.',
    items: [
      { icon: 'users', label: 'Step 1: The call', text: '45 minutes with Daksh on what you’re building and when it needs to launch.' },
      { icon: 'message', label: 'Step 2: Proposal', text: 'Your scope, weeks and team, written for your project.' },
      { icon: 'tag', label: 'Step 3: Contract and deposit', text: 'Signing the contract and paying the deposit reserves your start date.' },
      { icon: 'download', label: 'Step 4: Onboarding forms', text: 'Brand files, any copy or sales material you have, editor access to Figma and to Webflow, Framer or your GitHub repo, and a short brand questionnaire. The Slack channel opens the same day.' },
      { icon: 'calendar', label: 'Step 5: Week 1', text: 'One kickoff call for the whole project, at least a day after the forms so we’ve read them. The brand workshop opens the brand phase at the end of the week, once we’ve done our first research. Both are recorded, with notes in Slack the same day.' },
    ],
  },
};
