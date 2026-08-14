"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { PageHeader } from "@/components/shared/page-header";
import { FormField } from "@/components/shared/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface SettingsForm {
  site_title: string;
  site_description: string;
  og_image_url: string;
  maintenance_mode: boolean;
}

const DEFAULTS: SettingsForm = {
  site_title: "",
  site_description: "",
  og_image_url: "",
  maintenance_mode: false,
};

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const form = useForm<SettingsForm>({ defaultValues: DEFAULTS });

  const { data, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase.from("settings").select("*");
      if (error) throw error;
      const map: Record<string, unknown> = {};
      data?.forEach((row) => (map[row.key] = row.value));
      return map as Partial<SettingsForm>;
    },
  });

  useEffect(() => {
    if (data) form.reset({ ...DEFAULTS, ...data });
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  const save = useMutation({
    mutationFn: async (values: SettingsForm) => {
      const supabase = createClient();
      const rows = Object.entries(values).map(([key, value]) => ({ key, value }));
      const { error } = await supabase.from("settings").upsert(rows, { onConflict: "key" });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast.success("Settings saved");
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Failed to save settings"),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Website Settings" description="Global SEO defaults and site behavior." />
      <Card>
        <CardContent className="space-y-4 pt-6">
          <form onSubmit={form.handleSubmit((v) => save.mutate(v))} className="space-y-4">
            <FormField label="Site Title" htmlFor="site_title">
              <Input id="site_title" {...form.register("site_title")} />
            </FormField>
            <FormField label="Site Description" htmlFor="site_description" hint="Used as the default meta description">
              <Textarea id="site_description" {...form.register("site_description")} />
            </FormField>
            <FormField label="Default OG Image URL" htmlFor="og_image_url" hint="Shown when the site is shared on social media">
              <Input id="og_image_url" {...form.register("og_image_url")} />
            </FormField>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="h-5 w-5 rounded border-input" {...form.register("maintenance_mode")} />
              Maintenance mode (shows a "coming soon" page to visitors)
            </label>

            <Button type="submit" variant="gradient" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Saving…" : "Save Settings"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
