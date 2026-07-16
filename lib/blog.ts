export interface BlogPost {
  slug: string;
}

// Placeholder posts — replace with real content once the blog data model
// lands. The /blog page renders one box per entry, so its count tracks this
// array's length automatically.
export const blogPosts: BlogPost[] = [
  { slug: "post-1" },
  { slug: "post-2" },
  { slug: "post-3" },
];
