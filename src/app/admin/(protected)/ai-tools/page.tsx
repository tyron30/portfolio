"use client";

import { CrudModule } from "@/components/shared/crud-module";
import { aiToolSchema, type AiTool } from "@/lib/validations/ai-tools";
import type { CrudField } from "@/features/shared/crud-field";

const fields: CrudField[] = [
  { name: "name", label: "Tool name", type: "text", required: true },
  { name: "maker", label: "Made by", type: "text" },
  { name: "use_for", label: "What I use it for", type: "textarea", showInTable: false },
  { name: "url", label: "Website link", type: "text", showInTable: false, hint: "https://..." },
  { name: "logo_url", label: "Logo (optional)", type: "image", bucket: "profile", showInTable: false },
  { name: "sort_order", label: "Sort Order", type: "number", showInTable: false },
];

export default function Page() {
  return (
    <CrudModule<AiTool>
      title="AI Tools"
      description="AI assistants you build with. Shown in the AI Tools section."
      table="ai_tools"
      queryKey="ai_tools"
      label="AI Tool"
      fields={fields}
      schema={aiToolSchema}
      softDelete={false}
    />
  );
}
