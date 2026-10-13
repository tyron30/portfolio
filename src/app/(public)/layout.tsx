import { CommandPalette } from "@/components/motion/command-palette";
import { HeadingFX } from "@/components/motion/heading-fx";
import { SkillsMarquee } from "@/components/public/skills-marquee";
import { NowCard } from "@/components/public/now-card";
import { SiteEnhancements } from "@/components/motion/site-enhancements";
import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";
import { ScrollProgress } from "@/components/public/scroll-progress";
import { LoadingScreen } from "@/components/public/loading-screen";
import { ChatbotLoader } from "@/components/public/chatbot-loader";
import { LiveRefresh } from "@/components/public/live-refresh";
import { getAbout, getSocialLinks, getActiveResume } from "@/lib/supabase/public-queries";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [about, socialLinks, resume] = await Promise.all([
    getAbout(),
    getSocialLinks(),
    getActiveResume(),
  ]);

  const fullName = about?.full_name ?? "Portfolio";

  return (
    <>
      <LiveRefresh />
      <LoadingScreen />
      <ScrollProgress />
      <SiteEnhancements name={fullName} />
      <CommandPalette />
      <HeadingFX />
      <Navbar fullName={fullName} resumeUrl={resume?.file_url} />
      <main>{children}</main>
      <SkillsMarquee />
      <NowCard />
      <Footer fullName={fullName} socialLinks={socialLinks} />
      <ChatbotLoader />
    </>
  );
}


