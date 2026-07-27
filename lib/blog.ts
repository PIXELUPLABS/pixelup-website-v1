export interface BlogPost {
  slug: string;
  title: string;
  category: string;
  image: string;
  date: string;
}

// Placeholder posts — replace with real content once the blog data model
// lands. The /blog page renders one row per entry, so its count tracks this
// array's length automatically.
export const blogPosts: BlogPost[] = [
  {
    slug: "post-1",
    title: "What makes a website project run smoothly",
    category: "Design",
    image: "/media/Link.png",
    date: "2026-07-07",
  },
  {
    slug: "post-2",
    title: "What makes a website project run smoothly",
    category: "Design",
    image: "/media/Link.png",
    date: "2026-06-21",
  },
  {
    slug: "post-3",
    title: "What makes a website project run smoothly",
    category: "Design",
    image: "/media/Link.png",
    date: "2026-05-30",
  },
];

/** "2026-07-07" -> "JUL 7, 2026" */
export function formatBlogDate(date: string): string {
  return new Date(`${date}T00:00:00`)
    .toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    .toUpperCase();
}
