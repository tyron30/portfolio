import { getAiTools } from "@/lib/supabase/ai-tools-queries";
import { AiToolsView } from "@/components/public/ai-tools-view";

export async function AiToolsSection() {
  const items = await getAiTools();
  if (items.length === 0) return null;
  return <AiToolsView items={items} />;
}
