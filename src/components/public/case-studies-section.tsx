import { getCaseStudies } from "@/lib/supabase/extra-queries";
import { CaseStudiesView } from "@/components/public/case-studies-view";

export async function CaseStudiesSection() {
  const items = await getCaseStudies();
  if (items.length === 0) return null;
  return <CaseStudiesView items={items} />;
}
