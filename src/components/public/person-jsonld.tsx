import { getAbout, getEducation, getSocialLinks, getTechStack } from "@/lib/supabase/public-queries";

/* eslint-disable @typescript-eslint/no-explicit-any */
/** Structured "Person" data so Google can understand who this site is about. Built from the CMS, nothing hardcoded. */
export async function PersonJsonLd() {
  const [about, social, education, tech] = await Promise.all([
    getAbout(),
    getSocialLinks(),
    getEducation(),
    getTechStack(),
  ]);
  if (!about) return null;

  const site = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "");
  const a = about as any;
  const sameAs = ((social as any[]) ?? [])
    .map((s) => s.url as string)
    .filter((u) => /^https?:\/\//i.test(u));
  const knows = [
    ...((a.key_skills as string[] | null) ?? []),
    ...((tech as any[]) ?? []).map((t) => t.name as string),
  ].filter(Boolean);

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: a.full_name,
    jobTitle: a.role_tag || a.headline || undefined,
    description: a.bio || undefined,
    url: site || undefined,
    image: a.profile_image_url || undefined,
    address: a.location ? { "@type": "PostalAddress", addressLocality: a.location, addressCountry: "PH" } : undefined,
    sameAs: sameAs.length ? sameAs : undefined,
    knowsAbout: knows.length ? Array.from(new Set(knows)).slice(0, 20) : undefined,
    alumniOf: ((education as any[]) ?? [])
      .map((e) => e.school_name as string)
      .filter(Boolean)
      .map((n) => ({ "@type": "EducationalOrganization", name: n })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
