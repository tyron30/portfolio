import { AiToolsSection } from "@/components/public/ai-tools-section";
import { TerminalIntro } from "@/components/public/terminal-intro";
import { ServicesSection } from "@/components/public/services-section";
import { NetworkDiagram } from "@/components/public/network-diagram";
import { CaseStudiesSection } from "@/components/public/case-studies-section";
import { TestimonialsSection } from "@/components/public/testimonials-section";
import { StackStrip } from "@/components/public/stack-strip";
import type { Metadata } from "next";
import { GraduationCap, Briefcase } from "lucide-react";
import { Hero } from "@/components/public/hero";
import { AboutSection } from "@/components/public/about-section";
import { Timeline } from "@/components/public/timeline";
import { ProjectsGrid } from "@/components/public/projects-grid";
import { CertificatesGrid } from "@/components/public/certificates-grid";
import { TechStackGrid } from "@/components/public/tech-stack-grid";
import { GalleryMasonry } from "@/components/public/gallery-masonry";
import { ResumeSection } from "@/components/public/resume-section";
import { ContactSection } from "@/components/public/contact-section";
import {
  getAbout,
  getEducation,
  getExperience,
  getProjects,
  getCertificates,
  getSeminars,
  getGallery,
  getTechStack,
  getSocialLinks,
  getActiveResume,
  getContactInfo,
} from "@/lib/supabase/public-queries";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const about = await getAbout();
  const title = about?.full_name ? `${about.full_name} - ${about.headline ?? "Portfolio"}` : "Portfolio";
  const description = about?.bio?.slice(0, 160) ?? "Professional portfolio and CMS-driven personal site.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: about?.profile_image_url ? [about.profile_image_url] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: { canonical: "/" },
  };
}

export default async function HomePage() {
  const [
    about,
    education,
    experience,
    projects,
    certificates,
    seminars,
    gallery,
    techStack,
    socialLinks,
    resume,
    contactInfo,
  ] = await Promise.all([
    getAbout(),
    getEducation(),
    getExperience(),
    getProjects(),
    getCertificates(),
    getSeminars(),
    getGallery(),
    getTechStack(),
    getSocialLinks(),
    getActiveResume(),
    getContactInfo(),
  ]);

  return (
    <>
      <Hero about={about} resumeUrl={resume?.file_url} socialLinks={socialLinks} />
      <TerminalIntro about={about} />
      <AboutSection about={about} certificatesCount={certificates.length} />
      <ServicesSection />

      <Timeline
        id="education"
        title="Education"
        emptyLabel="Education history coming soon."
        icon={GraduationCap}
        items={education.map((e) => ({
          id: e.id,
          title: e.degree,
          subtitle: e.course ? `${e.course} · ${e.school_name}` : e.school_name,
          period: e.end_year ? `${e.start_year} - ${e.end_year}` : `${e.start_year} - Present`,
          description: e.description,
          logoUrl: e.school_logo_url,
        }))}
      />

      <Timeline
        id="experience"
        title="Work Experience"
        emptyLabel="Experience history coming soon."
        icon={Briefcase}
        items={experience.map((e) => ({
          id: e.id,
          title: e.position,
          subtitle: e.company_name,
          period: `${new Date(e.start_date).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
          })} - ${e.is_current ? "Present" : e.end_date ? new Date(e.end_date).toLocaleDateString(undefined, { year: "numeric", month: "short" }) : ""}`,
          description: e.responsibilities,
          logoUrl: e.company_logo_url,
          tags: e.skills,
          isCurrent: e.is_current,
        }))}
      />

      <NetworkDiagram />
      <ProjectsGrid projects={projects} techStack={techStack} />
      <CaseStudiesSection />
      <CertificatesGrid certificates={certificates} />
      <TechStackGrid items={techStack} />
      <AiToolsSection />
      <GalleryMasonry items={gallery} />
      <ResumeSection resume={resume} />
      <TestimonialsSection />
      <StackStrip />
      <ContactSection contactInfo={contactInfo} />
    </>
  );
}

