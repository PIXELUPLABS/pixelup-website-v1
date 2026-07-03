import type { Metadata } from "next";
import { CaseStudyPage } from "@/components/case-study/CaseStudyPage";
import { caseStudies } from "@/lib/case-studies";

const study = caseStudies.sainapse;

export const metadata: Metadata = {
  title: study.metaTitle,
  description: study.metaDescription,
};

export default function SainapseCaseStudy() {
  return <CaseStudyPage study={study} />;
}
