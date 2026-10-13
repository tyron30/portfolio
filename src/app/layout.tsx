import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import { QueryProvider } from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "sonner";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  verification: { google: "UkOPDRTiDTPJZDNYskqQguw_3HupilNQXubN9RkVuKQ" },
  title: {
    default: "Tyron Del Valle â€” IT Specialist",
    template: "%s | Tyron Del Valle",
  },
  description:
    "Portfolio of Tyron Del Valle, IT Specialist â€” projects, certifications, and experience.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  openGraph: {
    type: "website",
    title: "Tyron Del Valle â€” IT Specialist",
    description: "Portfolio of Tyron Del Valle, IT Specialist.",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${inter.variable}`}
    >
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <QueryProvider>
            {children}
            <Toaster richColors position="top-right" />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

