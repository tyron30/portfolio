import { z } from "zod";

export const serviceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  icon: z.string().default("wrench"),
  tags: z.array(z.string()).default([]),
  sort_order: z.coerce.number().int().default(0),
});
export type Service = z.infer<typeof serviceSchema> & { id: string };

export const testimonialSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().optional(),
  company: z.string().optional(),
  quote: z.string().min(10, "Quote is required"),
  photo_url: z.string().url().nullable().optional(),
  sort_order: z.coerce.number().int().default(0),
});
export type Testimonial = z.infer<typeof testimonialSchema> & { id: string };

export const caseStudySchema = z.object({
  title: z.string().min(1, "Title is required"),
  summary: z.string().optional(),
  problem: z.string().min(1, "Describe the problem"),
  solution: z.string().min(1, "Describe what you did"),
  result: z.string().min(1, "Describe the result"),
  tools: z.array(z.string()).default([]),
  image_url: z.string().url().nullable().optional(),
  sort_order: z.coerce.number().int().default(0),
});
export type CaseStudy = z.infer<typeof caseStudySchema> & { id: string };
