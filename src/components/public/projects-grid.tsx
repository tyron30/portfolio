import Image from "next/image";
import { Github, ExternalLink, PlayCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Reveal } from "@/components/motion/reveal";
import { StaggerContainer, StaggerItem } from "@/components/motion/stagger";
import { TiltCard } from "@/components/motion/tilt-card";

interface Project {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  cover_image_url?: string | null;
  github_url?: string | null;
  live_url?: string | null;
  video_url?: string | null;
  tech_tags?: string[] | null;
  is_featured?: boolean | null;
  status?: string | null;
}

interface TechStackEntry {
  name: string;
  icon_url?: string | null;
}

interface ProjectsGridProps {
  projects: Project[];
  /** Used to look up a logo for each tech tag by name — from the Tech Stack admin module. */
  techStack?: TechStackEntry[];
}

/** Renders a project's tech tag as its logo (matched by name from Tech Stack) + label, or plain text if no match exists. */
function TechBadge({ tag, iconUrl }: { tag: string; iconUrl?: string | null }) {
  if (iconUrl) {
    return (
      <span className="flex items-center gap-1.5 rounded-full border border-border bg-muted/60 px-2.5 py-1 text-xs font-medium">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={iconUrl} alt="" className="h-3.5 w-3.5 object-contain" />
        {tag}
      </span>
    );
  }
  return (
    <Badge variant="secondary" className="text-xs">
      {tag}
    </Badge>
  );
}

export function ProjectsGrid({ projects, techStack = [] }: ProjectsGridProps) {
  const iconByName = new Map(
    techStack.filter((t) => t.icon_url).map((t) => [t.name.trim().toLowerCase(), t.icon_url])
  );

  return (
    <section id="projects" className="container py-24">
      <Reveal>
        <h2 className="text-center text-3xl font-bold sm:text-4xl">
          Featured <span className="text-gradient">Projects</span>
        </h2>
      </Reveal>

      {projects.length === 0 ? (
        <p className="mt-8 text-center text-muted-foreground">Projects coming soon.</p>
      ) : (
        <StaggerContainer className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <StaggerItem key={project.id}>
              <TiltCard>
                <Card className="group overflow-hidden transition-shadow hover:shadow-xl">
                  <div className="relative aspect-video overflow-hidden bg-muted">
                    {project.cover_image_url ? (
                      <Image
                        src={project.cover_image_url}
                        alt={project.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                        No preview
                      </div>
                    )}
                    {/* Browser-chrome mockup — fades in on hover to frame the screenshot like a live window */}
                    <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center gap-1.5 bg-background/90 px-3 py-2 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                      <span className="h-2 w-2 rounded-full bg-red-400/70" />
                      <span className="h-2 w-2 rounded-full bg-amber-400/70" />
                      <span className="h-2 w-2 rounded-full bg-emerald-400/70" />
                      <span className="ml-2 truncate rounded bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                        {project.slug}.dev
                      </span>
                    </div>
                    {project.is_featured && (
                      <Badge variant="default" className="absolute left-3 top-3">
                        Featured
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-semibold">{project.title}</h3>
                    {project.description && (
                      <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{project.description}</p>
                    )}

                    {!!project.tech_tags?.length && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {project.tech_tags.slice(0, 5).map((tag) => (
                          <TechBadge key={tag} tag={tag} iconUrl={iconByName.get(tag.trim().toLowerCase())} />
                        ))}
                      </div>
                    )}

                    <div className="mt-4 flex gap-3 text-sm">
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-muted-foreground hover:text-primary"
                        >
                          <Github className="h-4 w-4" /> Code
                        </a>
                      )}
                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-muted-foreground hover:text-primary"
                        >
                          <ExternalLink className="h-4 w-4" /> Live
                        </a>
                      )}
                      {project.video_url && (
                        <a
                          href={project.video_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-muted-foreground hover:text-primary"
                        >
                          <PlayCircle className="h-4 w-4" /> Demo
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TiltCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}
    </section>
  );
}
