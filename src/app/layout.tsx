import type { Metadata } from "next";
import "./globals.css";
import { SoundProvider } from "@/lib/sound-context";
import { ThemeProvider } from "@/lib/theme-context";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "HYDE — Wear the Wild",
  description:
    "HYDE is a Lagos-made leather goods brand — duffels, belts, slippers and scarves finished in exotic-print vegan leather. Founders' drop now open for pre-order.",
  metadataBase: new URL("https://hyde.example.com"),
  openGraph: {
    title: "HYDE — Wear the Wild",
    description: "Nigerian-made exotic-print leather goods. Founders' drop now open.",
    type: "website",
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
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap"
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
