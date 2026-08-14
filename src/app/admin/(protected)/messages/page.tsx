"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { Mail, MailOpen, Archive, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface MessageRow {
  id: string;
  sender_name: string;
  sender_email: string;
  subject: string | null;
  body: string;
  status: "unread" | "read" | "archived";
  created_at: string;
}

const statusVariant = {
  unread: "default",
  read: "secondary",
  archived: "outline",
} as const;

export default function MessagesPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["messages"],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as MessageRow[];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: MessageRow["status"] }) => {
      const supabase = createClient();
      const { error } = await supabase.from("messages").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["messages"] }),
  });

  const deleteMessage = useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient();
      const { error } = await supabase.from("messages").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      toast.success("Message deleted");
    },
  });

  const columns: ColumnDef<MessageRow>[] = [
    {
      accessorKey: "sender_name",
      header: "From",
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.sender_name}</p>
          <p className="text-xs text-muted-foreground">{row.original.sender_email}</p>
        </div>
      ),
    },
    {
      accessorKey: "subject",
      header: "Subject",
      cell: ({ row }) => (
        <div className="max-w-xs">
          <p className="line-clamp-1 text-sm">{row.original.subject || "(no subject)"}</p>
          <p className="line-clamp-1 text-xs text-muted-foreground">{row.original.body}</p>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <Badge variant={statusVariant[row.original.status]}>{row.original.status}</Badge>,
    },
    {
      accessorKey: "created_at",
      header: "Received",
      cell: ({ row }) => new Date(row.original.created_at).toLocaleString(),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const msg = row.original;
        return (
          <div className="flex justify-end gap-1">
            {msg.status !== "read" && (
              <Button
                variant="ghost"
                size="icon"
                aria-label="Mark as read"
                onClick={() => updateStatus.mutate({ id: msg.id, status: "read" })}
              >
                <MailOpen className="h-4 w-4" />
              </Button>
            )}
            {msg.status !== "archived" && (
              <Button
                variant="ghost"
                size="icon"
                aria-label="Archive"
                onClick={() => updateStatus.mutate({ id: msg.id, status: "archived" })}
              >
                <Archive className="h-4 w-4" />
              </Button>
            )}
            <Button variant="ghost" size="icon" aria-label="Delete" onClick={() => deleteMessage.mutate(msg.id)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <PageHeader
        title="Messages"
        description="Submissions from the public contact form."
        action={
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Mail className="h-4 w-4" />
            {data?.filter((m) => m.status === "unread").length ?? 0} unread
          </div>
        }
      />
      <DataTable
        columns={columns}
        data={data ?? []}
        isLoading={isLoading}
        searchPlaceholder="Search messages…"
        emptyTitle="No messages yet"
        emptyDescription="Submissions from the public contact form will show up here."
      />
    </div>
  );
}
