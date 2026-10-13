"use client";

import { CrudModule } from "@/components/shared/crud-module";
import { caseStudySchema, type CaseStudy } from "@/lib/validations/extra";
import type { CrudField } from "@/features/shared/crud-field";

const fields: CrudField[] = [
  { name: "title", label: "Title", type: "text", required: true },
  { name: "summary", label: "One-line summary", type: "text", showInTable: false },
  { name: "problem", label: "The problem", type: "textarea", required: true, showInTable: false },
  { name: "solution", label: "What I did", type: "textarea", required: true, showInTable: false },
  { name: "result", label: "The result", type: "textarea", required: true, showInTable: false },
  { name: "tools", label: "Tools used", type: "tags", showInTable: false },
  { name: "image_url", label: "Photo (optional)", type: "image", bucket: "projects", showInTable: false },
  { name: "sort_order", label: "Sort Order", type: "number", showInTable: false },
];

export default function Page() {
  return (
    <CrudModule<CaseStudy>
      title="Case Studies"
      description="The problem, what you did, and the result. Be specific and honest."
      table="case_studies"
      queryKey="case_studies"
      label="Case Study"
      fields={fields}
      schema={caseStudySchema}
      softDelete={false}
    />
  );
}
