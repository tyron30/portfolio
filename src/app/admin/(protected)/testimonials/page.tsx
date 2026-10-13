"use client";

import { CrudModule } from "@/components/shared/crud-module";
import { testimonialSchema, type Testimonial } from "@/lib/validations/extra";
import type { CrudField } from "@/features/shared/crud-field";

const fields: CrudField[] = [
  { name: "name", label: "Name", type: "text", required: true },
  { name: "role", label: "Role", type: "text" },
  { name: "company", label: "Company / Office", type: "text" },
  { name: "quote", label: "Quote", type: "textarea", required: true, showInTable: false },
  { name: "photo_url", label: "Photo (optional)", type: "image", bucket: "profile", showInTable: false },
  { name: "sort_order", label: "Sort Order", type: "number", showInTable: false },
];

export default function Page() {
  return (
    <CrudModule<Testimonial>
      title="References"
      description="Short recommendations from supervisors or colleagues. Only add a quote with that person's permission."
      table="testimonials"
      queryKey="testimonials"
      label="Reference"
      fields={fields}
      schema={testimonialSchema}
      softDelete={false}
    />
  );
}
