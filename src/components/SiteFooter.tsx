import { socials, type SocialIcon } from "@/lib/socials";

// Inline SVGs only — lucide-react 1.25 doesn't ship brand glyphs and
// pulling in a heavier icon set for three marks is overkill. These are
// stroke-only line icons in the same visual weight as the rest of the
// site's lucide icons; swap to colour-filled brand marks by editing this
// file alone.

function InstagramIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Stylised note glyph — recognisable without copying TikTok's mark. */}
      <path d="M9 18V5l9-2v13" />
      <circle cx="7" cy="18" r="2.5" />
      <circle cx="16" cy="16" r="2.5" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12a8.5 8.5 0 0 1-12.7 7.4L3 21l1.6-5.3A8.5 8.5 0 1 1 21 12Z" />
    </svg>
  );
}

const iconFor = (icon: SocialIcon) => {
  switch (icon) {
    case "instagram":
      return <InstagramIcon />;
    case "tiktok":
      return <TikTokIcon />;
    case "whatsapp":
      return <WhatsAppIcon />;
  }
};

export function SiteFooter() {
  return (
    // Mobile: in document flow at the bottom of the page so it scrolls with
    // the content (only visible after the user scrolls down). Desktop
    // (`md:`): fixed at bottom-left, always visible.
    <footer className="relative self-start ml-6 mt-6 z-0 flex items-center gap-3 text-hyde-bone-dim md:fixed md:bottom-6 md:left-6 md:z-40 md:mt-0 md:ml-0">
      {socials.map((s) => (
        <a
          key={s.name}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={s.name}
          className="inline-flex items-center justify-center rounded-full p-1 transition-colors hover:text-hyde-gold focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{ outlineColor: "var(--hyde-gold)" }}
        >
          {iconFor(s.icon)}
        </a>
      ))}
    </footer>
  );
}
