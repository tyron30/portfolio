import { getServices } from "@/lib/supabase/extra-queries";
import { ServicesView } from "@/components/public/services-view";

export async function ServicesSection() {
  const items = await getServices();
  if (items.length === 0) return null;
  return <ServicesView items={items} />;
}
