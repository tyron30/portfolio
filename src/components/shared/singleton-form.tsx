"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ZodType } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { FormField } from "@/components/shared/form-field";
import { ImageUploader } from "@/components/shared/image-uploader";
import { Skeleton } from "@/components/ui/skeleton";
import type { CrudField } from "@/features/shared/crud-field";
import { createSingletonHooks } from "@/features/shared/create-singleton-hooks";

interface SingletonFormProps<T extends { id?: string }> {
  title: string;
  description: string;
  table: string;
  queryKey: string;
  fields: CrudField[];
  schema: ZodType<Partial<T>>;
}

export function SingletonForm<T extends { id?: string }>({
  title,
  description,
  table,
  queryKey,
  fields,
  schema,
}: SingletonFormProps<T>) {
  const { useSingleton, useSave } = createSingletonHooks<T>(table, queryKey);
  const { data, isLoading } = useSingleton();
  const saveMutation = useSave();

  const form = useForm<Partial<T>>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (data) form.reset(data);
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = form.handleSubmit(async (values) => {
    await saveMutation.mutateAsync({ id: data?.id, values });
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
      <PageHeader title={title} description={description} />
      <Card>
        <CardContent className="space-y-4 pt-6">
          <form onSubmit={onSubmit} className="space-y-4">
            {fields.map((field) => {
              const error = (form.formState.errors as any)[field.name]?.message as string | undefined;
              const value = form.watch(field.name as any);

              return (
                <FormField key={field.name} label={field.label} htmlFor={field.name} error={error} required={field.required} hint={field.hint}>
                  {field.type === "textarea" && (
                    <Textarea id={field.name} rows={5} {...form.register(field.name as any)} error={!!error} />
                  )}
                  {field.type === "text" && (
                    <Input id={field.name} {...form.register(field.name as any)} error={!!error} />
                  )}
                  {field.type === "number" && (
                    <Input id={field.name} type="number" {...form.register(field.name as any, { valueAsNumber: true })} error={!!error} />
                  )}
                  {(field.type === "image" || field.type === "file") && (
                    <ImageUploader
                      bucket={field.bucket ?? "misc"}
                      accept={field.type === "file" ? "application/pdf" : "image/*"}
                      value={value as string | null}
                      onChange={(url) => form.setValue(field.name as any, url as never, { shouldDirty: true })}
                    />
                  )}
                </FormField>
              );
            })}

            <Button type="submit" variant="gradient" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Saving…" : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
