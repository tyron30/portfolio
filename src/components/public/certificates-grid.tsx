"use client";

import { useState } from "react";
import Image from "next/image";
import { Award, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Reveal } from "@/components/motion/reveal";
import { StaggerContainer, StaggerItem } from "@/components/motion/stagger";
import { TiltCard } from "@/components/motion/tilt-card";

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  image_url?: string | null;
  pdf_url?: string | null;
  issue_date?: string | null;
}

export function CertificatesGrid({ certificates }: { certificates: Certificate[] }) {
  const [selected, setSelected] = useState<Certificate | null>(null);

  return (
    <section id="certificates" className="container py-24">
      <Reveal>
        <h2 className="text-center text-3xl font-bold sm:text-4xl">
          Certificates <span className="text-gradient">& Credentials</span>
        </h2>
      </Reveal>

      {certificates.length === 0 ? (
        <p className="mt-8 text-center text-muted-foreground">No certificates added yet.</p>
      ) : (
        <StaggerContainer className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((cert) => (
            <StaggerItem key={cert.id}>
              <TiltCard>
                <Card
                  className="group cursor-pointer overflow-hidden transition-shadow hover:shadow-xl"
                  onClick={() => setSelected(cert)}
                >
                  <div className="relative aspect-[4/3] bg-muted">
                    {cert.image_url ? (
                      <Image
                        src={cert.image_url}
                        alt={cert.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Award className="h-10 w-10 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="line-clamp-1 font-semibold">{cert.title}</h3>
                    <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                    {cert.issue_date && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {new Date(cert.issue_date).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                        })}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TiltCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-2xl">
          <DialogTitle>{selected?.title}</DialogTitle>
          {selected?.image_url && (
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
              <Image
                src={selected.image_url}
                alt={selected.title}
                fill
                sizes="(max-width: 768px) 90vw, 640px"
                className="object-contain"
              />
            </div>
          )}
          <p className="text-sm text-muted-foreground">{selected?.issuer}</p>
          {selected?.pdf_url && (
            <a
              href={selected.pdf_url}
              download
              className="inline-flex w-fit items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              <Download className="h-4 w-4" /> Download PDF
            </a>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
