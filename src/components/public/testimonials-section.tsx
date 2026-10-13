import { getTestimonials } from "@/lib/supabase/extra-queries";
import { TestimonialsView } from "@/components/public/testimonials-view";

export async function TestimonialsSection() {
  const items = await getTestimonials();
  if (items.length === 0) return null;
  return <TestimonialsView items={items} />;
}
