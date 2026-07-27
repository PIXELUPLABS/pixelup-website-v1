import Image from "next/image";
import blogBannerBg from "@/public/media/blog-banner-bg.png";
import { blogPosts, formatBlogDate } from "@/lib/blog";

/** Full-width blog container. Each blog row is itself full width, split 45%
    media / 55% info (no gap between them — the percentages already sum to
    100, see AGENTS.md's gap+width trap), rows separated by a hairline
    divider with padding on both sides of the rule. */
export function BlogList() {
  return (
    <section className="w-full">
      <div className="flex w-full flex-col divide-y divide-hairline">
        {blogPosts.map((post) => (
          <div key={post.slug} className="flex w-full flex-col py-4 desk:h-56.25 desk:flex-row">
            <div className="relative h-56.25 w-full desk:h-full desk:w-[45%]">
              <Image
                src={blogBannerBg}
                alt=""
                fill
                sizes="(min-width: 1200px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="flex w-full flex-col justify-between gap-4 pt-4 desk:h-full desk:w-[55%] desk:gap-0 desk:pt-0 desk:pl-5">
              <div className="flex flex-col gap-1">
                <div className="flex h-8.75 items-end">
                  <span className="h-1 w-1.5 shrink-0 bg-[#0658FC]" />
                  <span className="bg-label-grey/20 px-0.5 py-px text-[12px] font-medium uppercase text-white">
                    {post.category}
                  </span>
                </div>
                <p className="text-[24px] font-medium leading-tight text-white/80 capitalize desk:text-[28px]">
                  {post.title}
                </p>
              </div>
              <p className="text-[12px] font-medium uppercase text-label-grey pb-1">
                {formatBlogDate(post.date)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
