import Image from "next/image";
import Link from "next/link";
import unionMark from "@/public/media/Union.png";
import { links, projects } from "@/lib/projects";
import { CtaButtons } from "./CtaButtons";

// TODO: real social URLs — only Telegram is known today.
const socials = [
  { label: "X(Twitter)", href: null },
  { label: "Instagram", href: null },
  { label: "LinkedIn", href: null },
  { label: "Telegram", href: links.telegram },
] as const;

const navItems = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/", count: projects.length },
  // About / Blog pages don't exist yet — rendered inert until they do.
  { label: "About", href: null },
  { label: "Blog", href: null },
] as const;

/**
 * Site footer from the case study Figma template, shared with the homepage.
 * The giant wordmark is the Union brand mark, sized with container-query
 * units so it also fits inside the homepage's scrolling column.
 */
export function Footer() {
  return (
    <footer className="border-t-[0.5px] border-hairline [container-type:inline-size]">
      <div aria-hidden="true" className="px-[2.5cqw] pt-[3cqw]">
        <Image src={unionMark} alt="" className="h-auto w-full" />
      </div>

      <div className="mt-[3cqw] grid border-t-[0.5px] border-hairline desk:h-100 desk:grid-cols-2">
        <div className="flex flex-col p-8 desk:border-r-[0.5px] desk:border-hairline desk:px-10 desk:pt-10">
          <div className="desk:min-w-[340px] desk:max-w-[400px]">
            <CtaButtons />
          </div>
        </div>
        <nav
          aria-label="Footer"
          className="flex flex-col items-start gap-3 border-t-[0.5px] border-hairline p-8 font-button text-[24px] font-semibold uppercase leading-[1.3] tracking-[-0.02em] text-white desk:border-t-0 desk:px-6 desk:pt-10 desk:text-[28px]"
        >
          {navItems.map((item) =>
            item.href ? (
              <Link key={item.label} href={item.href} className="hover:opacity-70">
                {item.label}
                {"count" in item && (
                  <sup className="text-[0.55em] tracking-normal">({item.count})</sup>
                )}
              </Link>
            ) : (
              <span key={item.label} className="cursor-default">
                {item.label}
              </span>
            )
          )}
        </nav>
      </div>

      <div className="flex flex-col gap-2 border-t-[0.5px] border-hairline px-5 py-4 font-button text-[12px] font-semibold uppercase tracking-[0.04em] text-white desk:flex-row desk:items-center desk:justify-between desk:px-10">
        <p>©2025. pixeluplabs all rights reserved</p>
        <div className="flex flex-wrap items-center gap-3">
          {socials.map((social, index) => (
            <span key={social.label} className="flex items-center gap-3">
              {social.href ? (
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-70"
                >
                  {social.label}
                </a>
              ) : (
                <span className="cursor-default">{social.label}</span>
              )}
              {index < socials.length - 1 && (
                <span aria-hidden="true" className="size-1 rounded-full bg-white" />
              )}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
