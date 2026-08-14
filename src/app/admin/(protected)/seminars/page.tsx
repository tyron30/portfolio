"use client";

import { CrudModule } from "@/components/shared/crud-module";
import { seminarSchema, type Seminar } from "@/lib/validations/cms";
import type { CrudField } from "@/features/shared/crud-field";

const fields: CrudField[] = [
  { name: "title", label: "Title", type: "text", required: true },
  { name: "organizer", label: "Organizer", type: "text", required: true },
  { name: "seminar_date", label: "Date", type: "date" },
  { name: "certificate_url", label: "Certificate", type: "file", bucket: "seminars", showInTable: false },
  { name: "description", label: "Description", type: "textarea", showInTable: false },
  { name: "sort_order", label: "Sort Order", type: "number", showInTable: false },
];

export default function SeminarsPage() {
  return (
    <CrudModule<Seminar>
      title="Seminars"
      description="Manage seminars and workshops attended."
      table="seminars"
      queryKey="seminars"
      label="Seminar"
      fields={fields}
      schema={seminarSchema}
      orderBy="seminar_date"
    />
  );
}
