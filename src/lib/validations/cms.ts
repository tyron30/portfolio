import { z } from "zod";

// ---- Education ----
export const educationSchema = z.object({
  school_name: z.string().min(1, "School name is required"),
  school_logo_url: z.string().url().nullable().optional(),
  degree: z.string().min(1, "Degree is required"),
  course: z.string().optional(),
  start_year: z.coerce.number().int().min(1950).max(2100),
  end_year: z.coerce.number().int().min(1950).max(2100).nullable().optional(),
  description: z.string().optional(),
  sort_order: z.coerce.number().int().default(0),
});
export type Education = z.infer<typeof educationSchema> & { id: string };

// ---- Experience ----
export const experienceSchema = z.object({
  company_name: z.string().min(1, "Company name is required"),
  company_logo_url: z.string().url().nullable().optional(),
  position: z.string().min(1, "Position is required"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().nullable().optional(),
  is_current: z.boolean().default(false),
  responsibilities: z.string().optional(),
  achievements: z.string().optional(),
  skills: z.array(z.string()).default([]),
  sort_order: z.coerce.number().int().default(0),
});
export type Experience = z.infer<typeof experienceSchema> & { id: string };

// ---- Projects ----
export const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, and hyphens only"),
  description: z.string().optional(),
  cover_image_url: z.string().url().nullable().optional(),
  github_url: z.string().url().nullable().optional().or(z.literal("")),
  live_url: z.string().url().nullable().optional().or(z.literal("")),
  video_url: z.string().url().nullable().optional().or(z.literal("")),
  tech_tags: z.array(z.string()).default([]),
  is_featured: z.boolean().default(false),
  status: z.enum(["draft", "in_progress", "completed", "archived"]).default("completed"),
  sort_order: z.coerce.number().int().default(0),
});
export type Project = z.infer<typeof projectSchema> & { id: string };

// ---- Certificates ----
export const certificateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  issuer: z.string().min(1, "Issuer is required"),
  description: z.string().optional(),
  image_url: z.string().url().nullable().optional(),
  pdf_url: z.string().url().nullable().optional(),
  issue_date: z.string().nullable().optional(),
  sort_order: z.coerce.number().int().default(0),
});
export type Certificate = z.infer<typeof certificateSchema> & { id: string };

// ---- Seminars ----
export const seminarSchema = z.object({
  title: z.string().min(1, "Title is required"),
  organizer: z.string().min(1, "Organizer is required"),
  description: z.string().optional(),
  seminar_date: z.string().nullable().optional(),
  certificate_url: z.string().url().nullable().optional(),
  sort_order: z.coerce.number().int().default(0),
});
export type Seminar = z.infer<typeof seminarSchema> & { id: string };

// ---- Gallery ----
export const galleryItemSchema = z.object({
  image_url: z.string().url("Image is required"),
  caption: z.string().optional(),
  category: z.string().optional(),
  sort_order: z.coerce.number().int().default(0),
});
export type GalleryItem = z.infer<typeof galleryItemSchema> & { id: string };

// ---- Tech Stack ----
export const techStackSchema = z.object({
  name: z.string().min(1, "Name is required"),
  icon_url: z.string().url().nullable().optional(),
  category: z.enum(["frontend", "backend", "database", "tools", "languages", "frameworks", "library"]),
  proficiency: z.coerce.number().int().min(1).max(100).default(80),
  sort_order: z.coerce.number().int().default(0),
});
export type TechStackItem = z.infer<typeof techStackSchema> & { id: string };

// ---- Social Links ----
export const socialLinkSchema = z.object({
  platform: z.string().min(1, "Platform is required"),
  url: z.string().url("Must be a valid URL"),
  icon_name: z.string().optional(),
  is_active: z.boolean().default(true),
  sort_order: z.coerce.number().int().default(0),
});
export type SocialLink = z.infer<typeof socialLinkSchema> & { id: string };

// ---- About (singleton) ----
export const aboutSchema = z.object({
  key_skills: z.array(z.string()).default([]),
  full_name: z.string().min(1, "Full name is required"),
  role_tag: z.string().max(40, "Keep it short — this renders huge on the Hero").optional(),
  headline: z.string().optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  profile_image_url: z.string().url().nullable().optional(),
  about_image_url: z.string().url().nullable().optional(),
  years_experience: z.coerce.number().int().min(0).default(0),
  projects_completed: z.coerce.number().int().min(0).default(0),
});
export type About = z.infer<typeof aboutSchema> & { id: string };

// ---- Contact Info (singleton) ----
export const contactInfoSchema = z.object({
  map_embed_code: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  map_lat: z.coerce.number().nullable().optional(),
  map_lng: z.coerce.number().nullable().optional(),
});
export type ContactInfo = z.infer<typeof contactInfoSchema> & { id: string };

// ---- Contact form (public-facing submission) ----
export const contactMessageSchema = z.object({
  sender_name: z.string().min(1, "Name is required"),
  sender_email: z.string().email("Enter a valid email"),
  subject: z.string().optional(),
  body: z.string().min(10, "Message must be at least 10 characters"),
});
export type ContactMessageInput = z.infer<typeof contactMessageSchema>;
