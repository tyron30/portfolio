"use client";

import { SingletonForm } from "@/components/shared/singleton-form";
import { contactInfoSchema, type ContactInfo } from "@/lib/validations/cms";
import type { CrudField } from "@/features/shared/crud-field";

const fields: CrudField[] = [
  { name: "email", label: "Email", type: "text", required: true },
  { name: "phone", label: "Phone", type: "text" },
  { name: "address", label: "Address", type: "textarea" },
  { name: "map_lat", label: "Map Latitude", type: "number", hint: "For the embedded Google Map" },
  { name: "map_lng", label: "Map Longitude", type: "number" },
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
