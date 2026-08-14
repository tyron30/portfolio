"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { UploadCloud, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  bucket: "profile" | "gallery" | "projects" | "certificates" | "seminars" | "resume" | "logos" | "misc";
  value?: string | null;
  onChange: (url: string | null) => void;
  accept?: string;
  maxSizeMb?: number;
  label?: string;
}

/**
 * Uploads a file to the given Supabase Storage bucket and returns its public
 * URL via onChange. Used by every admin form with an image/PDF field
 * (Projects cover image, Certificate image+PDF, Gallery items, Resume, etc).
 */
export function ImageUploader({
  bucket,
  value,
  onChange,
  accept = "image/*",
  maxSizeMb = 5,
  label = "Upload image",
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFile = async (file: File) => {
    if (file.size > maxSizeMb * 1024 * 1024) {
      toast.error(`File must be under ${maxSizeMb}MB`);
      return;
    }

    setIsUploading(true);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop();
      const path = `${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });
      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(path);

      onChange(publicUrl);
      toast.success("Uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />

      {value ? (
        <div className="relative h-32 w-32 overflow-hidden rounded-xl border border-border">
          {accept.startsWith("image") ? (
            <Image src={value} alt="Uploaded preview" fill className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center bg-muted p-2 text-center text-xs">
              File uploaded
            </div>
          )}
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
            aria-label="Remove file"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className={cn(
            "flex h-32 w-32 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-border text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary",
            isUploading && "pointer-events-none opacity-60"
          )}
        >
          {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <UploadCloud className="h-5 w-5" />}
          {isUploading ? "Uploading…" : label}
        </button>
      )}
    </div>
  );
}
