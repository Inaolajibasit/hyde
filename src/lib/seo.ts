import type { Metadata } from "next";

/** The public, canonical origin. The apex domain redirects to www. */
export function getSiteOrigin(): string | null {
  const configured = process.env.SITE_URL?.trim();
  const candidate = configured || "https://www.hydelabs.site";

  try {
    const url = new URL(candidate);
    if (!['http:', 'https:'].includes(url.protocol)) return null;
    if (url.hostname === 'localhost' || url.hostname.endsWith('.example.com')) return null;
    return url.origin;
  } catch {
    return null;
  }
}

export function absoluteSiteUrl(path: string): string | null {
  const origin = getSiteOrigin();
  return origin ? new URL(path, origin).toString() : null;
}

export function jsonLd(data: Record<string, unknown>): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export function pageMetadata({
  title,
  description,
  path,
  image,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  const url = absoluteSiteUrl(path);
  const imageUrl = image ? absoluteSiteUrl(image) : null;
  return {
    title,
    description,
    ...(url ? { alternates: { canonical: url } } : {}),
    openGraph: {
      title: `${title} | HYDE`,
      description,
      siteName: "HYDE",
      type: "website",
      locale: "en_NG",
      ...(url ? { url } : {}),
      ...(imageUrl ? { images: [{ url: imageUrl }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | HYDE`,
      description,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
  };
}
