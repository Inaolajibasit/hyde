import type { Metadata } from "next";
import "./globals.css";
import { SoundProvider } from "@/lib/sound-context";
import { ThemeProvider } from "@/lib/theme-context";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { absoluteSiteUrl, getSiteOrigin } from "@/lib/seo";

const siteOrigin = getSiteOrigin();
const socialImage = absoluteSiteUrl("/images/hero-founder-duo.jpeg");

export const metadata: Metadata = {
  applicationName: "HYDE",
  title: { default: "HYDE | Bold Bags Made in Lagos", template: "%s | HYDE" },
  description:
    "Discover HYDE, a Lagos fashion accessories brand making bold vegan leather duffel bags. Explore the Zambezi founders' drop and pre-order your bag.",
  metadataBase: siteOrigin ? new URL(siteOrigin) : undefined,
  robots: { index: true, follow: true },
  openGraph: {
    title: "HYDE | Bold Bags Made in Lagos",
    description: "Statement vegan leather duffel bags from Lagos. Explore the HYDE Zambezi founders' drop.",
    siteName: "HYDE",
    type: "website",
    locale: "en_NG",
    ...(siteOrigin ? { url: siteOrigin } : {}),
    ...(socialImage ? { images: [{ url: socialImage, alt: "HYDE founders' drop bags" }] } : {}),
  },
  twitter: {
    card: "summary_large_image",
    title: "HYDE | Bold Bags Made in Lagos",
    description: "Statement vegan leather duffel bags from Lagos.",
    ...(socialImage ? { images: [socialImage] } : {}),
  },
};

// Runs before React hydrates so the correct theme is applied on first
// paint — otherwise the page would flash dark before switching to a saved
// light preference (or vice versa).
const noFlashThemeScript = `
(function() {
  try {
    var stored = localStorage.getItem('hyde-theme');
    var theme = stored === 'light' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      {/*
        NOTE: fonts are loaded via <link> rather than next/font/google here
        so the project builds without live access to fonts.googleapis.com.
        Recommended upgrade once deployed: switch to next/font/google for
        self-hosted, render-blocking-free fonts (see README).
      */}
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Jaro&family=Montserrat:wght@400;500;600;700&family=Jersey+10&display=swap"
        />
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script dangerouslySetInnerHTML={{ __html: noFlashThemeScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-hyde-black text-hyde-bone">
        <ThemeProvider>
          <SoundProvider>
            <ThemeToggle />
            <SiteHeader />
            {children}
            {/* SiteFooter sits AFTER {children} so on mobile (where it's
                relative-positioned) it appears at the bottom of the document
                flow. On desktop it stays fixed regardless of position. */}
            <SiteFooter />
          </SoundProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
