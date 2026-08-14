"use client";

import { CrudModule } from "@/components/shared/crud-module";
import { certificateSchema, type Certificate } from "@/lib/validations/cms";
import type { CrudField } from "@/features/shared/crud-field";

const fields: CrudField[] = [
  { name: "title", label: "Title", type: "text", required: true },
  { name: "issuer", label: "Issuer", type: "text", required: true },
  { name: "issue_date", label: "Issue Date", type: "date" },
  { name: "image_url", label: "Certificate Image", type: "image", bucket: "certificates", showInTable: false },
  { name: "pdf_url", label: "Certificate PDF", type: "file", bucket: "certificates", showInTable: false },
  { name: "description", label: "Description", type: "textarea", showInTable: false },
  { name: "sort_order", label: "Sort Order", type: "number", showInTable: false },
];

export default function CertificatesPage() {
  return (
    <CrudModule<Certificate>
      title="Certificates"
      description="Manage certifications displayed on the public site."
      table="certificates"
      queryKey="certificates"
      label="Certificate"
      fields={fields}
      schema={certificateSchema}
      orderBy="issue_date"
    />
  );
}
