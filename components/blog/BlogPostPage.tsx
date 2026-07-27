import { Geist } from "next/font/google";
import Image from "next/image";
import blogBannerBg from "@/public/media/blog-banner-bg.png";
import { Footer } from "@/components/Footer";
import type { BlogPost } from "@/lib/blog";
import { BlogPostSidebar } from "./BlogPostSidebar";

// Scoped to the "Related Articles" heading only — the rest of the site keeps font-display.
const geist = Geist({ subsets: ["latin"], weight: ["500"] });

/** One "Related Articles" card — date, image, category tag, heading,
    subheading, "Read Article". Same content on both sides for now. */
function RelatedArticleCard() {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-3">
      <p className="text-[12px] font-medium uppercase text-label-grey">JUN 24, 2026</p>
      <div className="relative h-80 w-full">
        <Image
          src="/media/Link.png"
          alt=""
          fill
          sizes="(min-width: 1200px) 25vw, 100vw"
          className="object-cover"
        />
      </div>
      {/* Extra mt-2 on top of the card's gap-3 rhythm for the spacing
          called out between the image and the tag. */}
      <div className="mt-2 flex items-center">
        <span className="h-1 w-1.5 shrink-0 bg-[#0658FC]" />
        <span className="bg-label-grey/20 px-0.5 py-px text-[12px] font-medium uppercase text-white">
          Design
        </span>
      </div>
      <p className="text-[24px] font-medium leading-tight text-white">
        What makes a website project run smoothly
      </p>
      <p className="text-[14px] leading-[1.5] text-body-grey">
        A short, practical look at the handful of decisions that keep a website
        build on schedule instead of drifting past its deadline.
      </p>
      {/* Extra mt-2 for the spacing called out before "Read Article". */}
      <p className="mt-2 text-[12px] font-medium uppercase text-white">Read Article</p>
    </div>
  );
}

/** Blog post detail shell — aside + divider + right-section layout, same
    treatment as /blog. Right-section content beyond the hero banner is a
    placeholder for now; the real article layout lands later. */
export function BlogPostPage({ post }: { post: BlogPost }) {
  return (
    <div className="relative flex flex-col gap-8 p-5 desk:flex-row desk:items-start desk:gap-0">
      <BlogPostSidebar post={post} />
      {/* Divider between the aside and content columns, same treatment as /blog. */}
      <div
        aria-hidden="true"
        className="hidden desk:mx-4 desk:-my-5 desk:block desk:self-stretch desk:border-l-[0.5px] desk:border-hairline"
      />
      <main className="flex min-w-0 flex-1 flex-col gap-8">
        <div className="relative h-120 w-full">
          <Image src={blogBannerBg} alt="" fill priority sizes="100vw" className="object-cover" />
        </div>
        {/* gap-8 on `main` (32px) gives the spacing above this heading. */}
        <h2 className="tracking-display text-[35px] font-medium leading-tight text-white capitalize">
          The Decisions that shaped the product
        </h2>
        <p className="text-[14px] leading-[1.6] text-body-grey">
          A few choices stand out as deliberate departures from category norms:
        </p>
        <p className="text-[14px] leading-[1.6] text-body-grey">
          Keyboard-first, not mouse-first. Nearly every action in Linear has a keyboard shortcut, and the command palette (Cmd+K) became the primary way to navigate the app. This wasn't a power-user add-on bolted on later  it was a foundational constraint from day one, which meant the entire interface had to be designed around speed of input rather than visual density.
        </p>
        <p className="text-[14px] leading-[1.6] text-body-grey">
          Opinionated workflows over infinite customization. Where Jira lets teams configure nearly anything, Linear shipped with a smaller, more rigid set of workflow states and conventions. Teams couldn't endlessly reconfigure the tool to match old habits. This was a genuine risk  some teams churned because Linear didn't bend to their existing process. But it kept the product coherent and let the team ship fast without maintaining a combinatorial explosion of configuration options. Performance as a design principle, not an engineering afterthought. Linear built its own sync engine so the app would feel instantaneous, even offline. Speed wasn't a metric they optimized after launch  it was treated as core to the experience, on the same level as visual design.
        </p>
        <p className="text-[14px] leading-[1.6] text-body-grey">
          Saying no to integrations, early. Rather than building shallow integrations with dozens of tools to check boxes on a comparison chart, Linear focused deeply on a smaller set of high-value connections (GitHub, Slack, Figma) and let breadth come later, once the core product was solid.
        </p>
        <h2 className="tracking-display text-[35px] font-medium leading-tight text-white capitalize">
          The Problem with "Just Add It"
        </h2>
        <p className="text-[14px] leading-[1.6] text-body-grey">
          A few choices stand out as deliberate departures from category norms:
        </p>
        <p className="text-[14px] leading-[1.6] text-body-grey">
          Keyboard-first, not mouse-first. Nearly every action in Linear has a keyboard shortcut, and the command palette (Cmd+K) became the primary way to navigate the app. This wasn't a power-user add-on bolted on later  it was a foundational constraint from day one, which meant the entire interface had to be designed around speed of input rather than visual density.
        </p>
        <p className="text-[14px] leading-[1.6] text-body-grey">
          Opinionated workflows over infinite customization. Where Jira lets teams configure nearly anything, Linear shipped with a smaller, more rigid set of workflow states and conventions. Teams couldn't endlessly reconfigure the tool to match old habits. This was a genuine risk  some teams churned because Linear didn't bend to their existing process. But it kept the product coherent and let the team ship fast without maintaining a combinatorial explosion of configuration options. Performance as a design principle, not an engineering afterthought. Linear built its own sync engine so the app would feel instantaneous, even offline. Speed wasn't a metric they optimized after launch  it was treated as core to the experience, on the same level as visual design.
        </p>
        <p className="text-[14px] leading-[1.6] text-body-grey">
          Saying no to integrations, early. Rather than building shallow integrations with dozens of tools to check boxes on a comparison chart, Linear focused deeply on a smaller set of high-value connections (GitHub, Slack, Figma) and let breadth come later, once the core product was solid.
        </p>
        {/* gap-8 on `main` (32px) gives the spacing above this rule too. */}
        <div aria-hidden="true" className="w-full border-t-[0.5px] border-hairline" />
        <h2 className={`${geist.className} text-[40px] font-medium leading-tight text-white`}>
          Related Articles
        </h2>
        <div className="flex w-full flex-col gap-8 desk:flex-row desk:gap-6">
          <RelatedArticleCard />
          <RelatedArticleCard />
        </div>
        <Footer inset={false} />
      </main>
    </div>
  );
}