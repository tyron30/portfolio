import { CinematicBackground } from "@/components/public/cinematic-background";

/** One fixed cinematic backdrop behind the whole public site, so every section shares the hero's look. */
export function SiteBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <CinematicBackground />
    </div>
  );
}
