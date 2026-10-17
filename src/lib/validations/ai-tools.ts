import { z } from "zod";

export const aiToolSchema = z.object({
  name: z.string().min(1, "Name is required"),
  maker: z.string().optional(),
  use_for: z.string().optional(),
  url: z.string().url("Must be a full link, e.g. https://...").optional().or(z.literal("")),
  logo_url: z.string().url().nullable().optional(),
  sort_order: z.coerce.number().int().default(0),
});
export type AiTool = z.infer<typeof aiToolSchema> & { id: string };
