"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FileText, CheckCircle2, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { PageHeader } from "@/components/shared/page-header";
import { ImageUploader } from "@/components/shared/image-uploader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";

interface ResumeRow {
  id: string;
  file_url: string;
  file_name: string;
  is_active: boolean;
  uploaded_at: string;
}

export default function ResumePage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["resume"],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("resume")
        .select("*")
        .order("uploaded_at", { ascending: false });
      if (error) throw error;
      return data as ResumeRow[];
    },
  });

  const addResume = useMutation({
    mutationFn: async (url: string) => {
      const supabase = createClient();
      // Deactivate all previous versions, then insert the new one as active.
      await supabase.from("resume").update({ is_active: false }).eq("is_active", true);
      const { error } = await supabase.from("resume").insert({
        file_url: url,
        file_name: url.split("/").pop() ?? "resume.pdf",
        is_active: true,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resume"] });
      toast.success("Resume uploaded and set as active");
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Upload failed"),
  });

  const setActive = useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient();
      await supabase.from("resume").update({ is_active: false }).eq("is_active", true);
      const { error } = await supabase.from("resume").update({ is_active: true }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resume"] });
      toast.success("Active resume updated");
    },
  });

  const removeResume = useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient();
      const { error } = await supabase.from("resume").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resume"] });
      toast.success("Resume removed");
    },
  });

  return (
    <div>
      <PageHeader
        title="Resume"
        description="Upload a new resume to make it the active, downloadable version on the public site."
      />

      <Card className="mb-6">
        <CardContent className="pt-6">
          <p className="mb-3 text-sm font-medium">Upload new version (PDF)</p>
          <ImageUploader
            bucket="resume"
            accept="application/pdf"
            maxSizeMb={10}
            label="Upload resume PDF"
            onChange={(url) => url && addResume.mutate(url)}
          />
        </CardContent>
      </Card>

      {isLoading ? (
        <Skeleton className="h-40 w-full" />
      ) : !data?.length ? (
        <EmptyState title="No resume uploaded yet" description="Upload your first PDF above." />
      ) : (
        <div className="space-y-2">
          {data.map((resume) => (
            <Card key={resume.id}>
              <CardContent className="flex items-center justify-between gap-4 p-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">{resume.file_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(resume.uploaded_at).toLocaleDateString()}
                    </p>
                  </div>
                  {resume.is_active && <Badge variant="success">Active</Badge>}
                </div>
                <div className="flex gap-2">
                  {!resume.is_active && (
                    <Button variant="outline" size="sm" onClick={() => setActive.mutate(resume.id)}>
                      <CheckCircle2 className="h-4 w-4" /> Set Active
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" onClick={() => removeResume.mutate(resume.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
