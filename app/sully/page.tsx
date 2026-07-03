import type { Metadata } from "next";
import { CaseStudyPage } from "@/components/case-study/CaseStudyPage";
import { caseStudies } from "@/lib/case-studies";

const study = caseStudies.sully;

export const metadata: Metadata = {
  title: study.metaTitle,
  description: study.metaDescription,
};

export default function SullyCaseStudy() {
  return <CaseStudyPage study={study} />;
}
