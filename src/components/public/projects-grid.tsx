"use client";

import { useState } from "react";
import Image from "next/image";
import { Github, ExternalLink, PlayCircle, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
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
  /** Used to look up a logo for each tech tag by name - from the Tech Stack admin module. */
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

function ProjectLinks({ project }: { project: Project }) {
  const cls = "flex items-center gap-1 text-muted-foreground hover:text-primary";
  return (
    <>
      {project.github_url && (
        <a href={project.github_url} target="_blank" rel="noopener noreferrer" className={cls}>
          <Github className="h-4 w-4" /> Code
        </a>
      )}
      {project.live_url && (
        <a href={project.live_url} target="_blank" rel="noopener noreferrer" className={cls}>
          <ExternalLink className="h-4 w-4" /> Live
        </a>
      )}
      {project.video_url && (
        <a href={project.video_url} target="_blank" rel="noopener noreferrer" className={cls}>
          <PlayCircle className="h-4 w-4" /> Demo
        </a>
      )}
    </>
  );
}

export function ProjectsGrid({ projects, techStack = [] }: ProjectsGridProps) {
  const [selected, setSelected] = useState<Project | null>(null);
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
                <Card className="group flex h-full flex-col overflow-hidden transition-shadow hover:shadow-xl">
                  <div
                    className="relative aspect-video cursor-pointer overflow-hidden bg-muted"
                    onClick={() => setSelected(project)}
                  >
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
                    <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center gap-1.5 bg-background/90 px-3 py-2 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                      <span className="h-2 w-2 rounded-full bg-red-400/70" />
                      <span className="h-2 w-2 rounded-full bg-indigo-400/70" />
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
                  <CardContent className="flex flex-1 flex-col p-5">
                    <h3 className="font-semibold">{project.title}</h3>
                    {project.description && (
                      <>
                        <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{project.description}</p>
                        <button
                          type="button"
                          onClick={() => setSelected(project)}
                          className="mt-2 inline-flex w-fit items-center gap-1 text-xs font-semibold text-primary transition-all hover:gap-2"
                        >
                          Read full details <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </>
                    )}

                    {!!project.tech_tags?.length && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {project.tech_tags.slice(0, 5).map((tag) => (
                          <TechBadge key={tag} tag={tag} iconUrl={iconByName.get(tag.trim().toLowerCase())} />
                        ))}
                        {project.tech_tags.length > 5 && (
                          <span className="px-1 text-xs text-muted-foreground">+{project.tech_tags.length - 5}</span>
                        )}
                      </div>
                    )}

                    <div className="mt-auto flex gap-3 pt-4 text-sm">
                      <ProjectLinks project={project} />
                    </div>
                  </CardContent>
                </Card>
              </TiltCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          {selected && (
            <>
              <DialogTitle>{selected.title}</DialogTitle>
              {selected.cover_image_url && (
                <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted">
                  <Image
                    src={selected.cover_image_url}
                    alt={selected.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 672px"
                    className="object-cover"
                  />
                </div>
              )}
              {selected.status && (
                <Badge variant="secondary" className="w-fit capitalize">
                  {selected.status.replace(/_/g, " ")}
                </Badge>
              )}
              {selected.description && (
                <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                  {selected.description}
                </p>
              )}
              {!!selected.tech_tags?.length && (
                <div className="flex flex-wrap gap-1.5">
                  {selected.tech_tags.map((tag) => (
                    <TechBadge key={tag} tag={tag} iconUrl={iconByName.get(tag.trim().toLowerCase())} />
                  ))}
                </div>
              )}
              <div className="flex flex-wrap gap-4 border-t border-border pt-4 text-sm">
                <ProjectLinks project={selected} />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
