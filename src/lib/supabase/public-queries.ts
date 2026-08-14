import { createPublicClient } from "@/lib/supabase/public-client";

/**
 * Central data-access layer for the public site. Every section (Hero,
 * About, Projects, etc.) fetches through here so the query shape lives in
 * one place. All reads rely on the public RLS policies from the schema
 * (non-deleted rows only), so no service-role key is needed here.
 */

export async function getAbout() {
  const supabase = createPublicClient();
  const { data } = await supabase.from("about").select("*").maybeSingle();
  return data;
}

export async function getEducation() {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("education")
    .select("*")
    .is("deleted_at", null)
    .order("sort_order");
  return data ?? [];
}

export async function getExperience() {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("experience")
    .select("*")
    .is("deleted_at", null)
    .order("sort_order");
  return data ?? [];
}

export async function getProjects() {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("projects")
    .select("*")
    .is("deleted_at", null)
    .order("sort_order");
  return data ?? [];
}

export async function getCertificates() {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("certificates")
    .select("*")
    .is("deleted_at", null)
    .order("issue_date", { ascending: false });
  return data ?? [];
}

export async function getSeminars() {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("seminars")
    .select("*")
    .is("deleted_at", null)
    .order("seminar_date", { ascending: false });
  return data ?? [];
}

export async function getGallery() {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("gallery")
    .select("*")
    .is("deleted_at", null)
    .order("sort_order");
  return data ?? [];
}

export async function getTechStack() {
  const supabase = createPublicClient();
  const { data } = await supabase.from("tech_stack").select("*").order("sort_order");
  return data ?? [];
}

export async function getSocialLinks() {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("social_links")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");
  return data ?? [];
}

export async function getActiveResume() {
  const supabase = createPublicClient();
  const { data } = await supabase.from("resume").select("*").eq("is_active", true).maybeSingle();
  return data;
}

export async function getContactInfo() {
  const supabase = createPublicClient();
  const { data } = await supabase.from("contact_info").select("*").maybeSingle();
  return data;
}
