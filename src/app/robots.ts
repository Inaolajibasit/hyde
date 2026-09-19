import type { MetadataRoute } from "next";
import { absoluteSiteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const sitemap = absoluteSiteUrl("/sitemap.xml");
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    ...(sitemap ? { sitemap } : {}),
  };
}
