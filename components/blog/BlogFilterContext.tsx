"use client";

import { createContext, useContext, useState } from "react";

const BlogFilterContext = createContext<{
  category: string;
  setCategory: (category: string) => void;
} | null>(null);

export function BlogFilterProvider({ children }: { children: React.ReactNode }) {
  const [category, setCategory] = useState("All");
  return (
    <BlogFilterContext.Provider value={{ category, setCategory }}>
      {children}
    </BlogFilterContext.Provider>
  );
}

export function useBlogFilter() {
  const context = useContext(BlogFilterContext);
  if (!context) throw new Error("useBlogFilter must be used inside BlogFilterProvider");
  return context;
}
