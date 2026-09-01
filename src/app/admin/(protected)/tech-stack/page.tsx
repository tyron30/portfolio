"use client";

import { CrudModule } from "@/components/shared/crud-module";
import { techStackSchema, type TechStackItem } from "@/lib/validations/cms";
import type { CrudField } from "@/features/shared/crud-field";

const fields: CrudField[] = [
  { name: "name", label: "Name", type: "text", required: true },
  {
    name: "category",
    label: "Category",
    type: "select",
    required: true,
    options: [
      { label: "Frontend", value: "frontend" },
      { label: "Backend", value: "backend" },
      { label: "Database", value: "database" },
      { label: "Tools", value: "tools" },
      { label: "Languages", value: "languages" },
      { label: "Frameworks", value: "frameworks" },
      { label: "Library", value: "library" },
    ],
  },
  { name: "icon_url", label: "Icon", type: "image", bucket: "misc" },
  { name: "proficiency", label: "Proficiency (1-100)", type: "number", required: true },
  { name: "sort_order", label: "Sort Order", type: "number", showInTable: false },
];

export default function TechStackPage() {
  return (
    <CrudModule<TechStackItem>
      title="Tech Stack"
      description="Manage the technologies displayed on the public site, grouped by category."
      table="tech_stack"
      queryKey="tech_stack"
      label="Technology"
      fields={fields}
      schema={techStackSchema}
      softDelete={false}
    />
  );
}
