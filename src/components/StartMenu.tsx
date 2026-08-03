"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { HeroBackground, HeroImage } from "./HeroBackground";
import { DustField } from "./DustField";
import { useSound } from "@/lib/sound-context";

type MenuItem = {
  label: string;
  href: string;
  hint: string;
};

const ITEMS: MenuItem[] = [
  {
    label: "Enter the Hunt",
    href: "/products",
    hint: "Browse the collection",
  },
  {
    label: "Pre-Order",
    href: "/preorder",
    hint: "Claim your founders' bag",
  },
  {
    label: "Join the Waitlist",
    href: "/waitlist",
    hint: "First word on the next drop",
  },
];

// One background image per menu item, in the same order as ITEMS.
// NOTE: the "Enter the Hunt" and "Join the Waitlist" slots are temporarily
// sharing the leopard/stone-bench shot — the third campaign photo (both
// bags + cheetah on the red curtain) didn't make it through as a file.
// Swap HERO_IMAGES[0].src to the real image once it's re-sent.
const HERO_IMAGES: HeroImage[] = [
  { src: "/images/hero-leopard-stone.jpg", alt: "Leopard beside the Prowler duffel" },
  { src: "/images/hero-founders-forest.jpg", alt: "Cheetah beside the Night Stalker duffel" },
  { src: "/images/hero-founder-duo.jpeg", alt: "Leopard beside the Prowler duffel" },
];

export function StartMenu() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [booted, setBooted] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  // Ref (not state) so flipping it doesn't re-run the auto-advance effect —
  // we just want to stop the loop, not retrigger it.
  const userTappedRef = useRef(false);
  const { muted, toggleMuted, play } = useSound();

  useEffect(() => {
    const t = setTimeout(() => setBooted(true), 200);
    return () => clearTimeout(t);
  }, []);

  // Touch detection has to happen after mount so SSR + first client paint
  // match. The worst case is one frame of "no auto-advance" before the effect
  // runs, which is invisible.
  //
  // We use `(hover: none) and (pointer: coarse)` rather than `ontouchstart`
  // / `maxTouchPoints`. Touch-capable laptops (Surface, Yoga, etc.) expose
  // touch APIs but the mouse is still the primary input — those devices
  // should keep hover behavior. This query only matches when there's *no*
  // fine pointer and *no* hover capability, i.e. true touch-primary devices
  // (phones, tablets).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(hover: none) and (pointer: coarse)");
    setIsTouch(mq.matches);
  }, []);

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        setActiveIndex((i) => {
          const next = (i + 1) % ITEMS.length;
          play("hover");
          return next;
        });
      } else if (e.key === "ArrowUp") {
        setActiveIndex((i) => {
          const next = (i - 1 + ITEMS.length) % ITEMS.length;
          play("hover");
          return next;
        });
      }
    },
    [play]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  // Auto-advance the hero photos on touch devices only. Desktop users drive
  // photo selection via hover/arrow keys. Once the user taps a menu item we
  // stop the loop — they're navigating away, and we don't want the photo to
  // change under their finger. On a Surface or other touch-capable laptop
  // this means hover won't change the photo, but arrow keys still will.
  useEffect(() => {
    if (!isTouch || userTappedRef.current) return;
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % ITEMS.length);
    }, 7500);
    return () => clearInterval(id);
  }, [isTouch]);

  return (
    <main className="relative min-h-screen w-full overflow-hidden flex items-center">
      <HeroBackground images={HERO_IMAGES} activeIndex={activeIndex} />
      <DustField />

      {/* Left-weighted scrim so menu text stays legible over any photo */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, var(--hyde-black) 0%, color-mix(in srgb, var(--hyde-black) 78%, transparent) 32%, transparent 62%), linear-gradient(0deg, var(--hyde-black) 0%, transparent 30%, transparent 78%, color-mix(in srgb, var(--hyde-black) 55%, transparent) 100%)",
        }}
      />
      <div className="hyde-vignette" />
      <div className="hyde-grain" />

      {/* Sound toggle — sits to the LEFT of the theme toggle (which is at
          right-6 in the layout) so the two controls read as a paired row. */}
      <button
        onClick={toggleMuted}
        className="absolute top-6 right-32 z-50 flex items-center gap-2 text-hyde-bone-dim hover:text-hyde-gold transition-colors text-hud text-xs uppercase cursor-pointer"
        aria-label={muted ? "Unmute sound" : "Mute sound"}
      >
        {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        <span className="hidden sm:inline">{muted ? "Sound Off" : "Sound On"}</span>
      </button>

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 sm:px-12 xl:px-20">
        <div className="max-w-xl">
          <AnimatePresence>
            {booted && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="mb-10 flex items-center gap-4"
              >
                <Image
                  src="/images/logo.png"
                  alt="Hyde"
                  width={56}
                  height={56}
                  className="rounded-full opacity-90"
                />
                <div>
                  <h1 className="text-display text-5xl sm:text-6xl xl:text-7xl text-hyde-bone leading-none">
                    HYDE
                  </h1>
                  <p className="text-hud text-[10px] text-hyde-gold uppercase tracking-[0.3em] mt-1">
                    Wear the wild
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <nav aria-label="Main menu">
            <ul className="space-y-1">
              {ITEMS.map((item, i) => {
                const isActive = i === activeIndex;
                return (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, x: -24 }}
                    animate={booted ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      onMouseEnter={() => {
                        setActiveIndex(i);
                        play("hover");
                      }}
                      onFocus={() => setActiveIndex(i)}
                      onClick={() => {
                        // Mark the menu as chosen so the auto-advance loop
                        // stops immediately, even before the interval ticks
                        // again. Ref (not state) so we don't retrigger the
                        // interval effect.
                        userTappedRef.current = true;
                        play("select");
                      }}
                      className="group flex items-center gap-4 py-2.5"
                    >
                      <span
                        aria-hidden
                        className={`text-base leading-none transition-colors text-hyde-blood ${
                          isActive ? "hyde-arrow-bounce" : "opacity-0"
                        }`}
                      >
                        ▸
                      </span>
                      <span
                        className={`text-display text-3xl sm:text-4xl xl:text-5xl transition-all duration-400 ${
                          isActive
                            ? "text-hyde-bone tracking-wide"
                            : "text-hyde-bone-dim/50"
                        }`}
                      >
                        {item.label}
                      </span>
                    </Link>
                    {isActive && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-hud text-[10px] text-hyde-gold uppercase pl-8 tracking-widest"
                      >
                        {item.hint}
                      </motion.p>
                    )}
                  </motion.li>
                );
              })}
            </ul>
          </nav>

          <motion.p
            initial={{ opacity: 0 }}
            animate={booted ? { opacity: 1 } : {}}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-14 text-hyde-bone-dim/60 text-hud text-[10px] uppercase tracking-widest"
          >
            ↑↓ to select · enter to confirm
          </motion.p>
        </div>
      </div>

      <div className="absolute bottom-4 left-0 right-0 text-center z-10">
        <p className="text-hud text-[9px] text-hyde-bone-dim/40 uppercase tracking-widest">
          Handmade in Lagos · Founders&apos; Drop
        </p>
      </div>
    </main>
  );
}
