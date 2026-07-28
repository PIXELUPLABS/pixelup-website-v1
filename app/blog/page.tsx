import type { Metadata } from "next";
import { BlogFaq } from "@/components/blog/BlogFaq";
import { BlogFilterProvider } from "@/components/blog/BlogFilterContext";
import { BlogList } from "@/components/blog/BlogList";
import { BlogSidebar } from "@/components/blog/BlogSidebar";
import { Footer } from "@/components/Footer";
import { pixelupFaqSchema } from "@/lib/case-studies";

export const metadata: Metadata = {
  title: "Blog - PIXELUP LABS",
  description:
    "Insights on brand, product and website design from the PixelUp Labs team.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  return (
    <BlogFilterProvider>
      <div className="relative flex flex-col gap-8 p-5 desk:flex-row desk:items-start desk:gap-0">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(pixelupFaqSchema) }}
        />
        <BlogSidebar />
        {/* Divider between the aside and content columns, same treatment as the homepage. */}
        <div
          aria-hidden="true"
          className="hidden desk:mx-4 desk:-my-5 desk:block desk:self-stretch desk:border-l-[0.5px] desk:border-hairline"
        />
        <main className="flex min-w-0 flex-1 flex-col gap-8">
          <BlogList />
          <BlogFaq />
          {/* This row's own p-5 insets main's right edge from the true
              viewport edge — BlogList/BlogFaq are fine keeping that inset,
              but Footer shouldn't have it. desk:-mr-5 (the row's p-5)
              cancels just that, on this wrapper only, so Footer fills it via
              its own w-full — no change needed to Footer itself. */}
          <div className="desk:-mr-5 -ml-4 -mb-5">
            <Footer />
          </div>
        </main>
      </div>
    </BlogFilterProvider>
  );
}
