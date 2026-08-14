"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ZodType } from "zod";
import type { ColumnDef } from "@tanstack/react-table";
import { Plus, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { FormField } from "@/components/shared/form-field";
import { ImageUploader } from "@/components/shared/image-uploader";
import { ConfirmDialog, useConfirmDialog } from "@/components/shared/confirm-dialog";
import type { CrudField } from "@/features/shared/crud-field";
import { createCrudHooks } from "@/features/shared/create-crud-hooks";

interface BaseRow {
  id: string;
  [key: string]: unknown;
}

interface CrudModuleProps<T extends BaseRow> {
  title: string;
  description: string;
  table: string;
  queryKey: string;
  label: string;
  fields: CrudField[];
  schema: ZodType<Partial<T>>;
  softDelete?: boolean;
  orderBy?: string;
  searchColumn?: string;
  emptyDescription?: string;
}

/**
 * Renders a full CRUD screen (search + sortable table + add/edit dialog +
 * delete confirmation) purely from a field config, backed by Supabase via
 * createCrudHooks. Used for Education, Experience, Certificates, Seminars,
 * Gallery, Tech Stack, and Social Links. Projects uses a custom page because
 * it also manages a related project_images table.
 */
export function CrudModule<T extends BaseRow>({
  title,
  description,
  table,
  queryKey,
  label,
  fields,
  schema,
  softDelete = true,
  orderBy = "sort_order",
  searchColumn,
  emptyDescription,
}: CrudModuleProps<T>) {
  const { useList, useCreate, useUpdate, useDelete } = createCrudHooks<T>({
    table,
    queryKey,
    label,
    softDelete,
    orderBy,
  });

  const { data, isLoading } = useList();
  const createMutation = useCreate();
  const updateMutation = useUpdate();
  const deleteMutation = useDelete();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<T | null>(null);
  const confirmDelete = useConfirmDialog<T>();

  const form = useForm<Partial<T>>({
    resolver: zodResolver(schema),
  });

  const openCreate = () => {
    setEditingRow(null);
    form.reset({});
    setDialogOpen(true);
  };

  const openEdit = (row: T) => {
    setEditingRow(row);
    form.reset(row as Partial<T>);
    setDialogOpen(true);
  };

  const onSubmit = form.handleSubmit(async (values) => {
    if (editingRow) {
      await updateMutation.mutateAsync({ id: editingRow.id, values });
    } else {
      await createMutation.mutateAsync(values);
    }
    setDialogOpen(false);
  });

  const tableFields = fields.filter((f) => f.showInTable !== false && f.type !== "textarea");

  const columns: ColumnDef<T>[] = [
    ...tableFields.slice(0, 3).map(
      (field): ColumnDef<T> => ({
        accessorKey: field.name,
        header: field.label,
        cell: ({ getValue }) => {
          const value = getValue();
          if (field.type === "boolean") {
            return value ? <Badge variant="success">Yes</Badge> : <Badge variant="outline">No</Badge>;
          }
          if (field.type === "image" && typeof value === "string" && value) {
            // eslint-disable-next-line @next/next/no-img-element
            return <img src={value} alt="" className="h-10 w-10 rounded-lg object-cover" />;
          }
          if (field.type === "tags" && Array.isArray(value)) {
            return (
              <div className="flex flex-wrap gap-1">
                {value.map((tag) => (
                  <Badge key={String(tag)} variant="secondary">
                    {String(tag)}
                  </Badge>
                ))}
              </div>
            );
          }
          return <span className="line-clamp-1">{String(value ?? "—")}</span>;
        },
      })
    ),
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon" onClick={() => openEdit(row.original)} aria-label={`Edit ${label}`}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => confirmDelete.request(row.original)}
            aria-label={`Delete ${label}`}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title={title}
        description={description}
        action={
          <Button variant="gradient" onClick={openCreate}>
            <Plus className="h-4 w-4" /> Add {label}
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={data ?? []}
        isLoading={isLoading}
        searchPlaceholder={`Search ${title.toLowerCase()}…`}
        searchColumn={searchColumn}
        emptyTitle={`No ${title.toLowerCase()} yet`}
        emptyDescription={emptyDescription ?? `Click "Add ${label}" to create the first one.`}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingRow ? `Edit ${label}` : `Add ${label}`}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={onSubmit} className="space-y-4">
            {fields.map((field) => {
              const error = form.formState.errors[field.name as keyof T]?.message as string | undefined;
              const value = form.watch(field.name as keyof T);

              return (
                <FormField key={field.name} label={field.label} htmlFor={field.name} error={error} required={field.required} hint={field.hint}>
                  {field.type === "textarea" && (
                    <Textarea id={field.name} {...form.register(field.name as keyof T)} error={!!error} />
                  )}
                  {field.type === "text" && (
                    <Input id={field.name} {...form.register(field.name as keyof T)} error={!!error} />
                  )}
                  {field.type === "number" && (
                    <Input
                      id={field.name}
                      type="number"
                      {...form.register(field.name as keyof T, { valueAsNumber: true })}
                      error={!!error}
                    />
                  )}
                  {field.type === "date" && (
                    <Input id={field.name} type="date" {...form.register(field.name as keyof T)} error={!!error} />
                  )}
                  {field.type === "boolean" && (
                    <input
                      id={field.name}
                      type="checkbox"
                      className="h-5 w-5 rounded border-input"
                      checked={!!value}
                      onChange={(e) => form.setValue(field.name as keyof T, e.target.checked as never, { shouldDirty: true })}
                    />
                  )}
                  {field.type === "select" && (
                    <select
                      id={field.name}
                      className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      {...form.register(field.name as keyof T)}
                    >
                      {field.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  )}
                  {field.type === "tags" && (
                    <Input
                      id={field.name}
                      placeholder="Comma-separated, e.g. React, Node.js, PostgreSQL"
                      defaultValue={Array.isArray(value) ? value.join(", ") : ""}
                      onBlur={(e) =>
                        form.setValue(
                          field.name as keyof T,
                          e.target.value.split(",").map((s) => s.trim()).filter(Boolean) as never,
                          { shouldDirty: true }
                        )
                      }
                    />
                  )}
                  {(field.type === "image" || field.type === "file") && (
                    <ImageUploader
                      bucket={field.bucket ?? "misc"}
                      accept={field.type === "file" ? "application/pdf" : "image/*"}
                      value={value as string | null}
                      onChange={(url) => form.setValue(field.name as keyof T, url as never, { shouldDirty: true })}
                    />
                  )}
                </FormField>
              );
            })}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="gradient" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving…" : editingRow ? "Save changes" : `Add ${label}`}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={confirmDelete.open}
        onOpenChange={confirmDelete.onOpenChange}
        title={`Delete this ${label.toLowerCase()}?`}
        description="This action cannot be undone."
        onConfirm={async () => {
          if (confirmDelete.target) await deleteMutation.mutateAsync(confirmDelete.target.id);
        }}
      />
    </div>
  );
}
