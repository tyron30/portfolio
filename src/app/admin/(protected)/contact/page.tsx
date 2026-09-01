"use client";

import { SingletonForm } from "@/components/shared/singleton-form";
import { contactInfoSchema, type ContactInfo } from "@/lib/validations/cms";
import type { CrudField } from "@/features/shared/crud-field";

const fields: CrudField[] = [
  { name: "email", label: "Email", type: "text", required: true },
  { name: "phone", label: "Phone", type: "text" },
  { name: "address", label: "Address", type: "textarea" },
  {
    name: "map_embed_code",
    label: "Google Maps Embed Code",
    type: "textarea",
    hint: "In Google Maps: Share → Embed a map → Copy HTML, then paste the whole <iframe> code here.",
  },
];

export default function ContactInfoPage() {
  return (
    <SingletonForm<ContactInfo>
      title="Contact Information"
      description="Powers the Contact section (email, phone, address, map) on the public site."
      table="contact_info"
      queryKey="contact_info"
      fields={fields}
      schema={contactInfoSchema}
    />
  );
}

