import type { Metadata } from "next";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Blog - PIXELUP LABS",
  description:
    "Insights on brand, product and website design from the PixelUp Labs team.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  return (
    <>
      <main />
      <Footer />
    </>
  );
}
