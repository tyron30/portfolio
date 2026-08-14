"use client";

import { CrudModule } from "@/components/shared/crud-module";
import { educationSchema, type Education } from "@/lib/validations/cms";
import type { CrudField } from "@/features/shared/crud-field";

const fields: CrudField[] = [
  { name: "school_name", label: "School Name", type: "text", required: true },
  { name: "degree", label: "Degree", type: "text", required: true },
  { name: "course", label: "Course", type: "text" },
  { name: "start_year", label: "Start Year", type: "number", required: true },
  { name: "end_year", label: "End Year", type: "number" },
  { name: "school_logo_url", label: "School Logo", type: "image", bucket: "logos", showInTable: false },
  { name: "description", label: "Description", type: "textarea", showInTable: false },
  { name: "sort_order", label: "Sort Order", type: "number", hint: "Lower numbers appear first", showInTable: false },
];

export default function EducationPage() {
  return (
    <CrudModule<Education>
      title="Education"
      description="Manage your academic background shown on the public timeline."
      table="education"
      queryKey="education"
      label="Education"
      fields={fields}
      schema={educationSchema}
    />
  );
}
