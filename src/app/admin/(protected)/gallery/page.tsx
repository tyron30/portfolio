"use client";

import { CrudModule } from "@/components/shared/crud-module";
import { galleryItemSchema, type GalleryItem } from "@/lib/validations/cms";
import type { CrudField } from "@/features/shared/crud-field";

const fields: CrudField[] = [
  { name: "image_url", label: "Image", type: "image", bucket: "gallery", required: true },
  { name: "category", label: "Category", type: "text", hint: "Used for the public-site filter" },
  { name: "caption", label: "Caption", type: "text" },
  { name: "sort_order", label: "Sort Order", type: "number", showInTable: false },
];

export default function GalleryPage() {
  return (
    <CrudModule<GalleryItem>
      title="Gallery"
      description="Manage photos shown in the public masonry gallery."
      table="gallery"
      queryKey="gallery"
      label="Photo"
      fields={fields}
      schema={galleryItemSchema}
    />
  );
}
