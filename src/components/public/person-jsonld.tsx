import { getAbout, getEducation, getSocialLinks, getTechStack } from "@/lib/supabase/public-queries";
import { createPublicClient } from "@/lib/supabase/public-client";

/* eslint-disable @typescript-eslint/no-explicit-any */
/** Rows from a CMS table (not deleted, in display order). Returns [] on any problem so the page never breaks. */
async function rows(table: string): Promise<any[]> {
  try {
    const { data, error } = await createPublicClient()
      .from(table)
      .select("*")
      .is("deleted_at", null)
      .order("sort_order");
    return error ? [] : (data ?? []);
  } catch {
    return [];
  }
}

const clean = (o: Record<string, unknown>) =>
  Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined && v !== null && v !== ""));

/** Structured "Person" data so Google can understand who this site is about. Built from the CMS, nothing hardcoded. */
export async function PersonJsonLd() {
  const [about, social, education, tech, experience, certificates] = await Promise.all([
    getAbout(),
    getSocialLinks(),
    getEducation(),
    getTechStack(),
    rows("experience"),
    rows("certificates"),
  ]);
  if (!about) return null;

  const site = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "");
  const a = about as any;
  const sameAs = ((social as any[]) ?? [])
    .map((s) => s.url as string)
    .filter((u) => /^https?:\/\//i.test(u));

  const skills = [
    ...((a.key_skills as string[] | null) ?? []),
    ...((tech as any[]) ?? []).map((t) => t.name as string),
    ...experience.flatMap((e) => (e.skills as string[] | null) ?? []),
  ].filter(Boolean);

  const current = experience.find((e) => e.is_current) ?? experience[0];

  const data: Record<string, unknown> = clean({
    "@context": "https://schema.org",
    "@type": "Person",
    name: a.full_name,
    jobTitle: a.role_tag || a.headline || undefined,
    description: a.bio || undefined,
    url: site || undefined,
    image: a.profile_image_url || undefined,
    email: a.email ? `mailto:${a.email}` : undefined,
    address: a.location ? { "@type": "PostalAddress", addressLocality: a.location, addressCountry: "PH" } : undefined,
    sameAs: sameAs.length ? sameAs : undefined,
    knowsAbout: skills.length ? Array.from(new Set(skills)).slice(0, 40) : undefined,
    worksFor: current?.company_name
      ? { "@type": "Organization", name: current.company_name }
      : undefined,
    alumniOf: ((education as any[]) ?? [])
      .filter((e) => e.school_name)
      .map((e) =>
        clean({
          "@type": "EducationalOrganization",
          name: e.school_name,
          description: [e.degree, e.course].filter(Boolean).join(" in ") || undefined,
        })
      ),
    hasOccupation: experience.slice(0, 6).map((e) =>
      clean({
        "@type": "Occupation",
        name: e.position,
        description: typeof e.responsibilities === "string" ? e.responsibilities.slice(0, 300) : undefined,
        occupationLocation: undefined,
      })
    ),
    hasCredential: certificates.slice(0, 30).map((c) =>
      clean({
        "@type": "EducationalOccupationalCredential",
        name: c.title,
        description: c.description || undefined,
        dateCreated: c.issue_date || undefined,
        recognizedBy: c.issuer ? { "@type": "Organization", name: c.issuer } : undefined,
      })
    ),
  });

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
