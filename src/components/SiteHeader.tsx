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
    <header className="fixed top-6 left-6 z-50">
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