"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

// Persistent top-left home affordance. Suppressed on the start menu (which
// has its own wordmark in the content area) and on every other route renders
// a small circular logo that returns to /. Mirrors the sound toggle at
// top-right, so the two visual elements anchor the page.
export function SiteHeader() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  return (
    // Mobile: in document flow at the top of the page so it scrolls away with
    // the content. Desktop (`md:`): fixed at top-left, always visible.
    <header className="relative self-start ml-6 mt-6 z-0 md:fixed md:top-6 md:left-6 md:z-50 md:mt-0 md:ml-0">
      <Link
        href="/"
        aria-label="Back to home"
        className="block rounded-full focus-visible:outline-2 focus-visible:outline-offset-2"
        style={{ outlineColor: "var(--hyde-gold)" }}
      >
        <Image
          src="/images/logo.png"
          alt="Hyde"
          width={40}
          height={40}
          className="rounded-full opacity-90 hover:opacity-100 transition-opacity"
        />
      </Link>
    </header>
  );
}