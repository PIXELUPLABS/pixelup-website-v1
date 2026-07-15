import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { TrustedStrip } from "./TrustedStrip";
import { CtaButtons } from "./CtaButtons";

// Homepage hero copy — pages like /call pass their own.
const defaultHeading =
  "We build brands, websites and products that command enterprise trust";
const defaultSubheading = (
  <>
    We <strong className="font-medium text-white">position your brand</strong>{" "}
    to match your ambition. Enterprise clients see a{" "}
    <strong className="font-medium text-white">market leader, not a risky bet</strong>
  </>
);

export function LeftNav({
  heading = defaultHeading,
  subheading = defaultSubheading,
  balanceHero = false,
  sticky = false,
}: {
  heading?: string;
  subheading?: React.ReactNode;
  /** Balance/prettify hero line wrapping (no widows). Off for the homepage,
      whose H1 breaks were hand-tuned. */
  balanceHero?: boolean;
  /** Pin to the viewport instead of filling a fixed-height row — for pages
      that use native page scroll (e.g. the homepage, so the footer can sit
      below the fold) rather than an internal-scroll shell. */
  sticky?: boolean;
}) {
  return (
    <nav
      className={`flex flex-col gap-8 desk:w-[26%] desk:min-w-[340px] desk:max-w-[460px] desk:gap-0 ${
        sticky
          ? // Stuck offset = Navbar's height (h-16, 4rem) + the page shell's
            // p-5 top inset (1.25rem) = 5.25rem, so the nav sits flush below
            // the navbar instead of sliding under it, and is already at its
            // stuck position on load instead of visibly sliding into place
            // on the first bit of scroll. Height is trimmed by that same
            // offset plus the matching bottom inset (1.25rem) so it still
            // ends flush with the shell's bottom padding.
            "desk:sticky desk:top-21 desk:h-[calc(100vh-6.5rem)] desk:self-start"
          : "desk:h-full"
      }`}
    >
      {/* Header: logo + (mobile-only) hamburger.
          NOTE: this row must NOT be animated/transformed — the mobile menu
          panel inside it is absolutely positioned against the page, and a
          transform here would hijack its containing block. Animate children. */}
      {/* <div className="flex items-center justify-between">
        <div className="fade-up">
          <Logo />
        </div>
        <MobileMenu />
      </div> */}

      {/* Hero */}
      <div className="flex flex-col gap-4 desk:mt-10">
        <h1
          className={`fade-up tracking-display max-w-[22ch] text-[24px] font-medium leading-[1.1] text-white [animation-delay:100ms] desk:text-[30px] ${balanceHero ? "text-balance" : ""}`}
        >
          {heading}
        </h1>
        <p
          className={`fade-up max-w-[40ch] text-[16px] leading-[1.2] tracking-[-0.02em] text-muted-65 [animation-delay:200ms] ${balanceHero ? "text-pretty" : ""}`}
        >
          {subheading}
        </p>
      </div>

      {/* Bottom group: trusted strip + CTAs (pinned to bottom on desktop) */}
      <div className="flex flex-col gap-5 desk:mt-auto">
        <div className="fade-up [animation-delay:300ms]">
          <TrustedStrip />
        </div>
        <div className="fade-up [animation-delay:400ms]">
          <CtaButtons />
        </div>
      </div>
    </nav>
  );
}
