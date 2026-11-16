import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyPage } from "@/components/case-study/CaseStudyPage";
import { caseStudies } from "@/lib/case-studies";

const studies = Object.values(caseStudies);

// Only the slugs from lib/case-studies.ts exist; anything else 404s.
export const dynamicParams = false;

export function generateStaticParams() {
  return studies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata(
  {
    params,
  }: {
    params: Promise<{ slug: string }>;
  },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug } = await params;
  const study = studies.find((s) => s.slug === slug);
  if (!study) return {};
  return {
    title: study.metaTitle,
    description: study.metaDescription,
    alternates: { canonical: `/case-studies/${study.slug}` },
    // article to match the Article JSON-LD in CaseStudyPage. Parent images
    // carry the root share image through (see lib/open-graph.ts).
    openGraph: {
      type: "article",
      url: `/case-studies/${study.slug}`,
      images: (await parent).openGraph?.images,
    },
    robots:
      study.publication.status === "published"
        ? undefined
        : { index: false, follow: false },
  };
}

export default async function CaseStudyRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = studies.find((s) => s.slug === slug);
  if (!study) notFound();
  return <CaseStudyPage study={study} />;
}
