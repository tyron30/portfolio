import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { Magnetic } from "@/components/motion/magnetic";

interface ResumeSectionProps {
  resume: { file_url: string; file_name: string } | null;
}

export function ResumeSection({ resume }: ResumeSectionProps) {
  if (!resume) return null;

  return (
    <section className="container py-24">
      <Reveal className="glass mx-auto flex max-w-xl flex-col items-center gap-4 rounded-2xl p-10 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <FileText className="h-7 w-7" />
        </div>
        <h2 className="text-2xl font-bold">Download My Resume</h2>
        <p className="text-sm text-muted-foreground">
          Get the full picture of my experience, skills, and background.
        </p>
        <Magnetic>
          <Button asChild variant="gradient" size="lg">
            <a href={resume.file_url} download={resume.file_name}>
              <Download className="h-4 w-4" /> Download PDF
            </a>
          </Button>
        </Magnetic>
      </Reveal>
    </section>
  );
}
