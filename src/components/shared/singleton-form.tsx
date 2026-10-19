"use client";

import { useEffect, useState } from "react";
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

/** Comma-separated tags input that stores a string[] in the form. */
function TagsInput({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string[] | null | undefined;
  onChange: (tags: string[]) => void;
}) {
  const [text, setText] = useState((value ?? []).join(", "));
  const key = (value ?? []).join("|");

  // When the saved value loads or resets, refresh the text.
  useEffect(() => {
    setText((value ?? []).join(", "));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return (
    <div className="space-y-2">
      <Input
        id={id}
        value={text}
        placeholder="Type skills separated by commas, e.g. Network Administration, Customer Service"
        onChange={(e) => {
          setText(e.target.value);
          onChange(
            e.target.value
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          );
        }}
      />
      {!!value?.length && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((t) => (
            <span key={t} className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
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
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const error = (form.formState.errors as any)[field.name]?.message as string | undefined;
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const value = form.watch(field.name as any);

              return (
                <FormField key={field.name} label={field.label} htmlFor={field.name} error={error} required={field.required} hint={field.hint}>
                  {field.type === "textarea" && (
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    <Textarea id={field.name} rows={5} {...form.register(field.name as any)} error={!!error} />
                  )}
                  {(field.type === "text" || field.type === "date") && (
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    <Input id={field.name} {...form.register(field.name as any)} error={!!error} />
                  )}
                  {field.type === "number" && (
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    <Input id={field.name} type="number" {...form.register(field.name as any, { valueAsNumber: true })} error={!!error} />
                  )}
                  {field.type === "tags" && (
                    <TagsInput
                      id={field.name}
                      value={value as unknown as string[] | null | undefined}
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      onChange={(tags) => form.setValue(field.name as any, tags as never, { shouldDirty: true })}
                    />
                  )}
                  {(field.type === "image" || field.type === "file") && (
                    <ImageUploader
                      bucket={field.bucket ?? "misc"}
                      accept={field.type === "file" ? "application/pdf" : "image/*"}
                      value={value as string | null}
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      onChange={(url) => form.setValue(field.name as any, url as never, { shouldDirty: true })}
                    />
                  )}
                </FormField>
              );
            })}

            <Button type="submit" variant="gradient" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
