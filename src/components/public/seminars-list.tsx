import { Presentation, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Reveal } from "@/components/motion/reveal";
import { StaggerContainer, StaggerItem } from "@/components/motion/stagger";

interface Seminar {
  id: string;
  title: string;
  organizer: string;
  seminar_date?: string | null;
  certificate_url?: string | null;
}

export function SeminarsList({ seminars }: { seminars: Seminar[] }) {
  if (seminars.length === 0) return null;

  return (
    <section id="seminars" className="container py-24">
      <Reveal>
        <h2 className="text-center text-3xl font-bold sm:text-4xl">
          Seminars <span className="text-gradient">& Workshops</span>
        </h2>
      </Reveal>

      <StaggerContainer className="mx-auto mt-16 max-w-2xl space-y-3">
        {seminars.map((seminar) => (
          <StaggerItem key={seminar.id}>
            <Card>
              <CardContent className="flex items-center justify-between gap-4 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Presentation className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">{seminar.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {seminar.organizer}
                      {seminar.seminar_date &&
                        ` · ${new Date(seminar.seminar_date).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                        })}`}
                    </p>
                  </div>
                </div>
                {seminar.certificate_url && (
                  <a
                    href={seminar.certificate_url}
                    download
                    className="text-muted-foreground hover:text-primary"
                    aria-label="Download certificate"
                  >
                    <Download className="h-4 w-4" />
                  </a>
                )}
              </CardContent>
            </Card>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
}
