"use client";

import { CrudModule } from "@/components/shared/crud-module";
import { serviceSchema, type Service } from "@/lib/validations/extra";
import type { CrudField } from "@/features/shared/crud-field";

const fields: CrudField[] = [
  { name: "title", label: "Title", type: "text", required: true },
  {
    name: "icon", label: "Icon", type: "select", required: true,
    options: [
      { label: "Support (headset)", value: "headphones" }, { label: "Network", value: "network" },
      { label: "CCTV / Camera", value: "camera" }, { label: "Deployment (rocket)", value: "rocket" },
      { label: "Security", value: "shield" }, { label: "Code", value: "code" },
      { label: "Database", value: "database" }, { label: "Cloud", value: "cloud" },
      { label: "Repair (wrench)", value: "wrench" }, { label: "Computer", value: "monitor" },
    ],
  },
  { name: "description", label: "Description", type: "textarea", showInTable: false },
  { name: "tags", label: "Tags", type: "tags", showInTable: false, hint: "Tools or topics, e.g. LAN, TP-Link" },
  { name: "sort_order", label: "Sort Order", type: "number", showInTable: false },
];

export default function Page() {
  return (
    <CrudModule<Service>
      title="Services"
      description="What you offer. Shown as cards in the Services section."
      table="services"
      queryKey="services"
      label="Service"
      fields={fields}
      schema={serviceSchema}
      softDelete={false}
    />
  );
}
