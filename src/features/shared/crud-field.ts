export type FieldType = "text" | "textarea" | "number" | "date" | "boolean" | "image" | "file" | "tags" | "select";

export interface CrudField {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  hint?: string;
  /** Storage bucket — required when type is "image" or "file" */
  bucket?: "profile" | "gallery" | "projects" | "certificates" | "seminars" | "resume" | "logos" | "misc";
  /** Options — required when type is "select" */
  options?: { label: string; value: string }[];
  /** Show this field as a column in the list table (default: true for text/date/boolean) */
  showInTable?: boolean;
}
