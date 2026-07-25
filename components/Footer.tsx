import Image from "next/image";
import Link from "next/link";
import footerBg from "@/public/media/footer-bg.png";
import navLogo from "@/public/media/pixelup-logo.svg";
import unionMark from "@/public/media/Union.png";

// Only the studies with a real page get a link — the rest are inert until they exist.
const caseStudies = [
  { name: "Greptile", slug: "greptile" },
  { name: "Sainapse", slug: "sainapse" },
  { name: "Sully", slug: "sully" },
  { name: "Streamline", slug: null },
  { name: "CTGT", slug: null },
  { name: "HenryLabs", slug: null },
] as const;

export function Footer() {
  return (
    <footer className="relative h-[calc(100vh-4rem)] px-5 py-5 border-t-[0.5px] border-hairline">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 select-none">
        <Image src={footerBg} alt="" fill className="object-cover" />
      </div>
      <div className="relative grid h-full grid-rows-[3fr_1fr] border-[0.5px] border-hairline">
        <div className="grid grid-cols-3 divide-x divide-hairline">
          <div className="flex h-full flex-col justify-between p-6">
            <div className="flex flex-col gap-6">
              <Image src={navLogo} alt="PIXELUP LABS" className="h-8 w-8" />
              <p className="font-normal text-white">
                We position your brand to <br /> match your ambition
              </p>
            </div>
            <p className="text-[14px] font-normal text-white">©2026 PIXELUP LABS</p>
          </div>
          <div className="flex h-full flex-col gap-8 p-6">
            <p className="text-[12px] font-medium uppercase tracking-[0.04em] text-label-grey">
              Case Studies
            </p>
            <div className="flex flex-col gap-2">
              {caseStudies.map((study) =>
                study.slug ? (
                  <Link
                    key={study.name}
                    href={`/case-studies/${study.slug}`}
                    className="text-[14px] font-normal text-white hover:opacity-70"
                  >
                    {study.name}
                  </Link>
                ) : (
                  <p key={study.name} className="text-[14px] font-normal text-white">
                    {study.name}
                  </p>
                )
              )}
            </div>
          </div>
          <div className="flex h-full flex-col gap-8 p-6">
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
    </footer>
  );
}
