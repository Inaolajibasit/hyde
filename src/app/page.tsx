import { StartMenu } from "@/components/StartMenu";
import type { Metadata } from "next";
import { absoluteSiteUrl, getSiteOrigin, jsonLd } from "@/lib/seo";

const homeUrl = absoluteSiteUrl("/");

export const metadata: Metadata = {
  ...(homeUrl ? { alternates: { canonical: homeUrl } } : {}),
};

export default function Home() {
  const origin = getSiteOrigin();
  const structuredData = origin
    ? {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebSite",
            "@id": `${origin}/#website`,
            name: "HYDE",
            url: origin,
            description: "HYDE is a Lagos fashion accessories brand making bold vegan leather duffel bags.",
          },
          {
            "@type": "Organization",
            "@id": `${origin}/#organization`,
            name: "HYDE",
            url: origin,
            logo: absoluteSiteUrl("/images/logo.png"),
            description: "Lagos fashion accessories brand creating statement vegan leather bags.",
            areaServed: { "@type": "Country", name: "Nigeria" },
          },
        ],
      }
    : null;

  return (
    <>
      {structuredData && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }} />
      )}
      <StartMenu />
    </>
  );
}
