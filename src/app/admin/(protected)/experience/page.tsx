"use client";

import { CrudModule } from "@/components/shared/crud-module";
import { experienceSchema, type Experience } from "@/lib/validations/cms";
import type { CrudField } from "@/features/shared/crud-field";

const fields: CrudField[] = [
  { name: "company_name", label: "Company Name", type: "text", required: true },
  { name: "position", label: "Position", type: "text", required: true },
  { name: "start_date", label: "Start Date", type: "date", required: true },
  { name: "end_date", label: "End Date", type: "date", hint: "Leave blank if current" },
  { name: "is_current", label: "Currently Working Here", type: "boolean" },
  { name: "company_logo_url", label: "Company Logo", type: "image", bucket: "logos", showInTable: false },
  {
    name: "certificate_url",
    label: "Certificate of Completion (optional)",
    type: "image",
    bucket: "logos",
    showInTable: false,
    hint: "Shows a 'See Completion Certificate' button on this entry. Leave empty for none.",
  },
  {
    name: "responsibilities",
    label: "Responsibilities",
    type: "textarea",
    showInTable: false,
    hint: "One point per line - each line renders as a bullet on the public site.",
  },
  { name: "achievements", label: "Achievements", type: "textarea", showInTable: false },
  {
    name: "skills",
    label: "Skills / Tags",
    type: "tags",
    showInTable: false,
    hint: "e.g. PC Troubleshooting, User Support, LAN Maintenance - shown as highlighted badges.",
  },
  { name: "sort_order", label: "Sort Order", type: "number", showInTable: false },
];

export default function ExperiencePage() {
  return (
    <CrudModule<Experience>
      title="Work Experience"
      description="Manage your work history shown on the public timeline."
      table="experience"
      queryKey="experience"
      label="Experience"
      fields={fields}
      schema={experienceSchema}
    />
  );
}
