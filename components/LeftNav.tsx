import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { TrustedStrip } from "./TrustedStrip";
import { CtaButtons } from "./CtaButtons";

export function LeftNav() {
  return (
    <nav className="flex flex-col gap-8 desk:h-full desk:w-[26%] desk:min-w-[340px] desk:max-w-[460px] desk:gap-0">
      {/* Header: logo + (mobile-only) hamburger */}
      <div className="flex items-center justify-between">
        <Logo />
        <MobileMenu />
      </div>

      {/* Hero */}
      <div className="flex flex-col gap-4 desk:mt-14">
        <h1 className="tracking-display max-w-[22ch] text-[24px] font-medium leading-[1.1] text-white desk:text-[30px]">
          We build brands, websites and products that command enterprise trust
        </h1>
        <p className="max-w-[40ch] text-[16px] leading-[1.2] tracking-[-0.02em] text-muted-65">
          We <strong className="font-medium text-white">position your brand</strong>{" "}
          to match your ambition. Enterprise clients see a{" "}
          <strong className="font-medium text-white">market leader, not a risky bet</strong>
        </p>
      </div>

      {/* Bottom group: trusted strip + CTAs (pinned to bottom on desktop) */}
      <div className="flex flex-col gap-5 desk:mt-auto">
        <TrustedStrip />
        <CtaButtons />
      </div>
    </nav>
  );
}
