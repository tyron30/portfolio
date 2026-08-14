"use client";

import { CrudModule } from "@/components/shared/crud-module";
import { socialLinkSchema, type SocialLink } from "@/lib/validations/cms";
import type { CrudField } from "@/features/shared/crud-field";

const fields: CrudField[] = [
  {
    name: "platform",
    label: "Platform",
    type: "select",
    required: true,
    options: [
      { label: "GitHub", value: "github" },
      { label: "Facebook", value: "facebook" },
      { label: "LinkedIn", value: "linkedin" },
      { label: "Instagram", value: "instagram" },
      { label: "YouTube", value: "youtube" },
      { label: "TikTok", value: "tiktok" },
      { label: "Discord", value: "discord" },
      { label: "Email", value: "email" },
      { label: "Website", value: "website" },
    ],
  },
  { name: "url", label: "URL", type: "text", required: true, hint: "Full link, e.g. https://github.com/username" },
  { name: "is_active", label: "Show on public site", type: "boolean" },
  { name: "sort_order", label: "Sort Order", type: "number", showInTable: false },
];

export default function SocialLinksPage() {
  return (
    <CrudModule<SocialLink>
      title="Social Links"
      description="Manage the social/contact links shown in the navbar and footer."
      table="social_links"
      queryKey="social_links"
      label="Social Link"
      fields={fields}
      schema={socialLinkSchema}
      softDelete={false}
    />
  );
}
