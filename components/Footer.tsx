import Image from "next/image";
import Link from "next/link";
import footerBg from "@/public/media/footer-bg.png";
import navLogo from "@/public/media/pixelup-logo.svg";
import unionMark from "@/public/media/Vector.svg";

const caseStudies = [
  { name: "Greptile", slug: "greptile" },
  { name: "Sainapse", slug: "sainapse" },
  { name: "Sully", slug: "sully" },
] as const;

// Outer <footer> has no padding of its own, ever — it always fills exactly
// whatever container it's placed in, the same way every other section
// (BlogList, AuditForm, CaseSection, ...) does. The inner div below is what
// insets the bordered/partitioned card from those outer edges.
export function Footer() {
  return (
    <footer className="relative w-full desk:h-140">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 select-none">
        <Image src={footerBg} alt="" fill className="object-cover" />
      </div>
      {/* Inner div: spacing from the outer footer on every side except the
          top (flush there). Everything else (top/bottom split, top row's
          3 divisions) is partitioned inside this. */}
      <div className="relative px-5 pb-5 desk:h-full">
        <div className="flex h-full flex-col border-[0.5px] border-hairline desk:grid desk:grid-rows-[3fr_1fr]">
          <div className="grid grid-cols-1 divide-y divide-hairline desk:grid-cols-3 desk:divide-x desk:divide-y-0">
            <div className="flex flex-col gap-6 p-6 desk:h-full desk:justify-between">
              <div className="flex flex-col gap-6">
                <Image src={navLogo} alt="PIXELUP LABS" className="h-8 w-8" />
                <p className="font-normal text-white">
                  We position your brand to <br /> match your ambition
                </p>
              </div>
              <p className="text-[14px] font-normal text-white">©2026 PIXELUP LABS</p>
            </div>
            <div className="flex flex-col gap-8 p-6 desk:h-full">
              <p className="text-[12px] font-medium uppercase tracking-[0.04em] text-label-grey">
                Case Studies
              </p>
              <div className="flex flex-col gap-2">
                {caseStudies.map((study) => (
                  <Link
                    key={study.name}
                    href={`/case-studies/${study.slug}`}
                    className="text-[14px] font-normal text-white hover:opacity-70"
                  >
                    {study.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-8 p-6 desk:h-full">
              <p className="text-[12px] font-medium uppercase tracking-[0.04em] text-label-grey">
                Subscribe to our newsletter
              </p>
              <div className="flex w-full items-center justify-between border-b-[0.5px] border-hairline pb-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-transparent text-[14px] font-normal text-white placeholder:text-white/40 focus:outline-none"
                />
                <Image src="/media/Container.svg" alt="" width={14} height={14} aria-hidden="true" className="cursor-pointer" />
              </div>
            </div>
          </div>
          <div className="flex w-full items-center border-t-[0.5px] border-hairline p-6">
            <Image src={unionMark} alt="" className="h-auto w-full" />
          </div>
        </div>
      </div>
    </footer>
  );
}
