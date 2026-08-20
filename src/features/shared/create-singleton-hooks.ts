"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

/**
 * For tables that only ever have one row (about, contact_info). Fetches the
 * first row if it exists, and upserts on save — creating the row the first
 * time the admin fills the form in, updating it every time after.
 */
export function createSingletonHooks<T extends { id?: string }>(table: string, queryKey: string) {
  function useSingleton() {
    return useQuery({
      queryKey: [queryKey],
      queryFn: async () => {
        const supabase = createClient();
        const { data, error } = await supabase.from(table).select("*").limit(1).maybeSingle();
        if (error) throw error;
        return data as T | null;
      },
    });
  }

  function useSave() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async ({ id, values }: { id?: string; values: Partial<T> }) => {
        const supabase = createClient();
        if (id) {
          const { data, error } = await supabase.from(table).update(values as any).eq("id", id).select().single();
          if (error) throw error;
          return data as T;
        }
        const { data, error } = await supabase.from(table).insert(values as any).select().single();
        if (error) throw error;
        return data as T;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
        toast.success("Saved");
      },
      onError: (err) => toast.error(err instanceof Error ? err.message : "Failed to save"),
    });
  }

  return { useSingleton, useSave };
}
