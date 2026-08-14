"use client";

import { CrudModule } from "@/components/shared/crud-module";
import { projectSchema, type Project } from "@/lib/validations/cms";
import type { CrudField } from "@/features/shared/crud-field";

const fields: CrudField[] = [
  { name: "title", label: "Title", type: "text", required: true },
  { name: "slug", label: "Slug", type: "text", required: true, hint: "URL-friendly, e.g. portfolio-management-system" },
  {
    name: "status",
    label: "Status",
    type: "select",
    required: true,
    options: [
      { label: "Draft", value: "draft" },
      { label: "In Progress", value: "in_progress" },
      { label: "Completed", value: "completed" },
      { label: "Archived", value: "archived" },
    ],
  },
  { name: "is_featured", label: "Featured", type: "boolean" },
  { name: "cover_image_url", label: "Cover Image", type: "image", bucket: "projects", showInTable: false },
  { name: "tech_tags", label: "Tech Tags", type: "tags", showInTable: false },
  { name: "description", label: "Description", type: "textarea", showInTable: false },
  { name: "github_url", label: "GitHub URL", type: "text", showInTable: false },
  { name: "live_url", label: "Live URL", type: "text", showInTable: false },
  { name: "video_url", label: "Video Demo URL", type: "text", showInTable: false },
  { name: "sort_order", label: "Sort Order", type: "number", showInTable: false },
];

export default function ProjectsPage() {
  return (
    <CrudModule<Project>
      title="Projects"
      description="Manage portfolio projects. Additional screenshots for a project's gallery can be attached from the project's edit view in a future update to project_images."
      table="projects"
      queryKey="projects"
      label="Project"
      fields={fields}
      schema={projectSchema}
    />
  );
}
