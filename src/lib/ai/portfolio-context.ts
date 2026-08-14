import {
  getAbout,
  getEducation,
  getExperience,
  getProjects,
  getCertificates,
  getSeminars,
  getTechStack,
  getSocialLinks,
  getActiveResume,
  getContactInfo,
} from "@/lib/supabase/public-queries";

/**
 * Assembles a compact, up-to-date text summary of the whole portfolio
 * straight from Supabase. This is the "retrieval" step of the RAG chatbot —
 * since a personal portfolio's dataset is small (a few dozen rows across
 * all tables), fetching everything fresh on each request and handing it to
 * the model as context is simpler and just as effective as a vector store,
 * while guaranteeing the bot never answers from stale/cached data.
 */
export async function buildPortfolioContext(): Promise<string> {
  const [about, education, experience, projects, certificates, seminars, techStack, socialLinks, resume, contact] =
    await Promise.all([
      getAbout(),
      getEducation(),
      getExperience(),
      getProjects(),
      getCertificates(),
      getSeminars(),
      getTechStack(),
      getSocialLinks(),
      getActiveResume(),
      getContactInfo(),
    ]);

  const sections: string[] = [];

  if (about) {
    sections.push(
      `ABOUT:\nName: ${about.full_name}\nHeadline: ${about.headline ?? "—"}\nLocation: ${about.location ?? "—"}\nBio: ${about.bio ?? "—"}\nYears of experience: ${about.years_experience ?? 0}\nProjects completed: ${about.projects_completed ?? 0}`
    );
  }

  if (education.length) {
    sections.push(
      "EDUCATION:\n" +
        education
          .map((e) => `- ${e.degree}${e.course ? ` (${e.course})` : ""} at ${e.school_name}, ${e.start_year}–${e.end_year ?? "present"}`)
          .join("\n")
    );
  }

  if (experience.length) {
    sections.push(
      "WORK EXPERIENCE:\n" +
        experience
          .map(
            (e) =>
              `- ${e.position} at ${e.company_name} (${e.start_date} – ${e.is_current ? "present" : e.end_date ?? "?"})${e.responsibilities ? `: ${e.responsibilities}` : ""}`
          )
          .join("\n")
    );
  }

  if (projects.length) {
    sections.push(
      "PROJECTS:\n" +
        projects
          .map(
            (p) =>
              `- "${p.title}"${p.is_featured ? " (featured)" : ""} — ${p.description ?? "no description"} | Tech: ${(p.tech_tags ?? []).join(", ") || "n/a"} | Status: ${p.status}${p.github_url ? ` | GitHub: ${p.github_url}` : ""}${p.live_url ? ` | Live: ${p.live_url}` : ""}`
          )
          .join("\n")
    );
  }

  if (certificates.length) {
    sections.push(
      "CERTIFICATIONS:\n" +
        certificates.map((c) => `- ${c.title} (${c.issuer}${c.issue_date ? `, ${c.issue_date}` : ""})`).join("\n")
    );
  }

  if (seminars.length) {
    sections.push("SEMINARS:\n" + seminars.map((s) => `- ${s.title} by ${s.organizer}`).join("\n"));
  }

  if (techStack.length) {
    sections.push("TECH STACK:\n" + techStack.map((t) => `${t.name} (${t.category})`).join(", "));
  }

  if (contact) {
    sections.push(
      `CONTACT:\nEmail: ${contact.email ?? "—"}\nPhone: ${contact.phone ?? "—"}\nAddress: ${contact.address ?? "—"}`
    );
  }

  if (socialLinks.length) {
    sections.push("SOCIAL LINKS:\n" + socialLinks.map((s) => `${s.platform}: ${s.url}`).join("\n"));
  }

  if (resume) {
    sections.push(`RESUME: Available for download at ${resume.file_url}`);
  }

  return sections.join("\n\n");
}
