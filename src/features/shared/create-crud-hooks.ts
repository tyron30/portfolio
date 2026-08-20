"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

interface CrudOptions {
  /** Supabase table name */
  table: string;
  /** TanStack Query cache key (and toast label) */
  queryKey: string;
  /** Human label used in toasts, e.g. "Project" */
  label: string;
  /** If true, filters out soft-deleted rows and deletes set deleted_at instead of removing the row */
  softDelete?: boolean;
  /** Column to order the list by (default: sort_order) */
  orderBy?: string;
  ascending?: boolean;
}

/**
 * Generates the standard set of list/create/update/delete hooks for a table.
 * Used by every CRUD module (Education, Experience, Projects, Certificates,
 * Seminars, Gallery, Tech Stack, Social Links) so each module only needs to
 * describe its shape, not re-implement fetching/mutating/caching.
 */
export function createCrudHooks<T extends { id: string }>({
  table,
  queryKey,
  label,
  softDelete = true,
  orderBy = "sort_order",
  ascending = true,
}: CrudOptions) {
  function useList() {
    return useQuery({
      queryKey: [queryKey],
      queryFn: async () => {
        const supabase = createClient();
        let query = supabase.from(table).select("*");
        if (softDelete) query = query.is("deleted_at", null);
        const { data, error } = await query.order(orderBy, { ascending });
        if (error) throw error;
        return data as T[];
      },
    });
  }

  function useCreate() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (values: Partial<T>) => {
        const supabase = createClient();
        const { data, error } = await supabase.from(table).insert(values as any).select().single();
        if (error) throw error;
        return data as T;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
        toast.success(`${label} created`);
      },
      onError: (err) => toast.error(err instanceof Error ? err.message : `Failed to create ${label}`),
    });
  }

  function useUpdate() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async ({ id, values }: { id: string; values: Partial<T> }) => {
        const supabase = createClient();
        const { data, error } = await supabase.from(table).update(values as any).eq("id", id).select().single();
        if (error) throw error;
        return data as T;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
        toast.success(`${label} updated`);
      },
      onError: (err) => toast.error(err instanceof Error ? err.message : `Failed to update ${label}`),
    });
  }

  function useDelete() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (id: string) => {
        const supabase = createClient();
        const { error } = softDelete
          ? await supabase.from(table).update({ deleted_at: new Date().toISOString() }).eq("id", id)
          : await supabase.from(table).delete().eq("id", id);
        if (error) throw error;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
        toast.success(`${label} deleted`);
      },
      onError: (err) => toast.error(err instanceof Error ? err.message : `Failed to delete ${label}`),
    });
  }

  return { useList, useCreate, useUpdate, useDelete };
}
