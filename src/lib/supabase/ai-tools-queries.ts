import { createPublicClient } from "@/lib/supabase/public-client";

export interface AiToolRow {
  id: string;
  name: string;
  maker?: string | null;
  use_for?: string | null;
  url?: string | null;
  logo_url?: string | null;
}

export async function getAiTools(): Promise<AiToolRow[]> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase.from("ai_tools").select("*").order("sort_order");
    if (error) return [];
    return (data ?? []) as AiToolRow[];
  } catch {
    return [];
  }
}
