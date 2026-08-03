"use client";

import { useEffect, useRef } from "react";

export type ClipSpecies = "zebra" | "cheetah" | "crocodile";

const LABELS: Record<ClipSpecies, string> = {
  zebra: "EQUUS QUAGGA",
  cheetah: "ACINONYX JUBATUS",
  crocodile: "CROCODYLUS NILOTICUS",
};

const ACCENTS: Record<ClipSpecies, string> = {
  zebra: "var(--hyde-chrome)",
  cheetah: "var(--hyde-gold)",
  crocodile: "var(--hyde-blood)",
};

const SOURCES: Record<ClipSpecies, string> = {
  zebra: "/videos/zebra.mp4",
  cheetah: "/videos/cheetah.mp4",
  crocodile: "/videos/crocodile.mp4",
};

const SPECIES_LIST: ClipSpecies[] = ["zebra", "cheetah", "crocodile"];

/**
 * All three clips are mounted once and preloaded up front. Switching the
 * active species is a pure CSS opacity crossfade — nothing unmounts, so
 * there's no re-fetch/re-decode on every hover. This is the fix for the
 * "slow" video switching: the old version keyed a single <video> by
 * species, which forced React (and the browser) to throw away and reload
 * the element on every hover.
 */
export function AnimalVideo({ species }: { species: ClipSpecies }) {
  const refs = useRef<Partial<Record<ClipSpecies, HTMLVideoElement | null>>>({});

  useEffect(() => {
    for (const s of SPECIES_LIST) {
      const el = refs.current[s];
      if (!el) continue;
      if (s === species) {
        // Play from wherever it already is — keeps clips feeling "alive"
        // in the background rather than restarting from frame 0 each time.
        el.play().catch(() => {
          // Autoplay can be blocked before any user interaction — harmless.
        });
      } else {
        el.pause();
      }
    }
  }, [species]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      {/* Soft ambient glow behind the frame, tinted to the active species */}
      <div
        aria-hidden
        className="absolute inset-0 blur-3xl opacity-30 transition-colors duration-500 -z-10"
        style={{ background: ACCENTS[species] }}
      />

      <div className="relative w-full max-w-xl aspect-square overflow-hidden">
        {SPECIES_LIST.map((s) => (
          <video
            key={s}
            ref={(el) => {
              refs.current[s] = el;
            }}
            src={SOURCES[s]}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
            style={{ opacity: s === species ? 1 : 0, zIndex: s === species ? 1 : 0 }}
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden={s !== species}
          />
        ))}

        {/* HUD corner brackets */}
        {["top-2 left-2 border-t border-l", "top-2 right-2 border-t border-r", "bottom-2 left-2 border-b border-l", "bottom-2 right-2 border-b border-r"].map(
          (pos) => (
            <div
              key={pos}
              className={`absolute w-5 h-5 ${pos} pointer-events-none transition-colors duration-500`}
              style={{ borderColor: ACCENTS[species] }}
            />
          )
        )}

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(180deg, transparent 55%, var(--hyde-black) 130%)",
          }}
        />
        <span className="absolute top-3.5 right-3.5 text-hud text-[9px] text-hyde-bone-dim/70 uppercase tracking-widest bg-hyde-black/60 px-1.5 py-0.5">
          Placeholder Footage
        </span>
      </div>
      <p className="text-hud text-[10px] text-hyde-bone-dim/60 mt-3 uppercase tracking-widest">
        {LABELS[species]}
      </p>
    </div>
  );
}

/** Preload hints for the browser — call once near the top of the page. */
export function VideoPreloadLinks() {
  return (
    <>
      {SPECIES_LIST.map((s) => (
        <link key={s} rel="preload" as="video" href={SOURCES[s]} type="video/mp4" />
      ))}
    </>
  );
}
