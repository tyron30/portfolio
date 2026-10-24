"use client";

import { useState } from "react";
import { Award, ExternalLink } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

/** "See Completion Certificate" button that opens the certificate in a popup viewer. */
export function CertificateButton({ url, label = "See Completion Certificate" }: { url: string; label?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 ring-1 ring-white/20 transition hover:-translate-y-0.5 hover:brightness-110 hover:shadow-blue-500/50 active:translate-y-0"
      >
        <Award className="h-4 w-4" />
        {label}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[92vh] max-w-4xl overflow-y-auto">
          <DialogTitle>Certificate of Completion</DialogTitle>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt="Certificate of Completion" className="mt-2 max-h-[75vh] w-full rounded-lg object-contain" />
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            <ExternalLink className="h-4 w-4" /> Open full size
          </a>
        </DialogContent>
      </Dialog>
    </>
  );
}
