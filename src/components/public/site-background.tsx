import { CinematicBackground } from "@/components/public/cinematic-background";
import { TechBackdrop } from "@/components/public/tech-backdrop";

/** One fixed backdrop for every section. Light and dark mode share the same design; only the colours change. */
export function SiteBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <CinematicBackground />
      <TechBackdrop />
    </div>
  );
}
