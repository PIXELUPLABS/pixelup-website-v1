"use client";

import Image from "next/image";
import Link from "next/link";
import { blogPosts, formatBlogDate } from "@/lib/blog";
import { useBlogFilter } from "./BlogFilterContext";

/** Full-width blog container. Each blog row is itself full width, split 45%
    media / 55% info (no gap between them — the percentages already sum to
    100, see AGENTS.md's gap+width trap), rows separated by a hairline
    divider with padding on both sides of the rule. */
export function BlogList() {
  const { category } = useBlogFilter();
  const posts = [...blogPosts]
    .sort(
      (a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime(),
    )
    .filter((post) => category === "All" || post.categories.includes(category));

  return (
    <section className="w-full">
      <div className="flex w-full flex-col divide-y divide-hairline">
        {posts.map((post, index) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group fade-up flex w-full flex-col py-4 desk:flex-row"
            style={{ animationDelay: `${Math.min(200 + index * 120, 800)}ms` }}
          >
            {/* Every blog image shares the same 2084x960 aspect ratio (see
                BlogPostPage). Sizing the desktop column from that ratio
                instead of a fixed row height keeps the whole image visible
                — a fixed h-65 box was cropping it on wide viewports, where
                the row grows wider without growing taller. */}
            <div className="relative h-65 w-full desk:aspect-2084/960 desk:h-auto desk:w-[45%]">
              <Image
                src={post.image}
                alt=""
                fill
                sizes="(min-width: 1200px) 45vw, 100vw"
                className="object-cover object-left"
              />
            </div>
            <div className="flex w-full flex-col justify-between gap-4 pt-4 desk:w-[55%] desk:gap-0 desk:pt-0 desk:pl-5">
              <div className="flex flex-col gap-1">
                <div className="flex h-8.75 flex-wrap items-end gap-2">
                  {post.categories.map((item) => (
                    <div key={item} className="flex items-end">
                      <span className="h-1 w-1.5 shrink-0 bg-[#0658FC]" />
                      <span className="bg-label-grey/20 px-1 py-px text-[12px] font-medium uppercase text-white">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-[24px] font-medium leading-tight text-white/80 capitalize transition-opacity duration-200 group-hover:opacity-60 desk:text-[28px]">
                  {post.title}
                </p>
              </div>
              <p className="text-[12px] font-medium uppercase text-label-grey pb-1">
                {formatBlogDate(post.publishedDate)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
