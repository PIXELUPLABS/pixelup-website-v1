import type { BlogPost } from "@/lib/blog";
import { BlogPostSidebar } from "./BlogPostSidebar";

/** Blog post detail shell — aside + divider + right-section layout, same
    treatment as /blog. Right-section content is a placeholder for now; the
    real article layout lands later. */
export function BlogPostPage({ post }: { post: BlogPost }) {
  return (
    <div className="relative flex flex-col gap-8 p-5 desk:flex-row desk:items-start desk:gap-0">
      <BlogPostSidebar post={post} />
      {/* Divider between the aside and content columns, same treatment as /blog. */}
      <div
        aria-hidden="true"
        className="hidden desk:mx-4 desk:-my-5 desk:block desk:self-stretch desk:border-l-[0.5px] desk:border-hairline"
      />
      <main className="flex min-w-0 flex-1 flex-col gap-8" />
    </div>
  );
}
