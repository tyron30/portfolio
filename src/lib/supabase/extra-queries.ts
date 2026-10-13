import { createPublicClient } from "@/lib/supabase/public-client";

/** Public reads for the upgrade sections. Missing tables just return [] so the site never crashes. */
async function list<T>(table: string): Promise<T[]> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase.from(table).select("*").order("sort_order");
    if (error) return [];
    return (data ?? []) as T[];
  } catch {
    return [];
  }
}

export interface ServiceRow { id: string; title: string; description?: string | null; icon?: string | null; tags?: string[] | null }
export interface TestimonialRow { id: string; name: string; role?: string | null; company?: string | null; quote: string; photo_url?: string | null }
export interface CaseStudyRow { id: string; title: string; summary?: string | null; problem: string; solution: string; result: string; tools?: string[] | null; image_url?: string | null }

export const getServices = () => list<ServiceRow>("services");
export const getTestimonials = () => list<TestimonialRow>("testimonials");
export const getCaseStudies = () => list<CaseStudyRow>("case_studies");
