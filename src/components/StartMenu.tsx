"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { HeroBackground, HeroImage } from "./HeroBackground";
import { DustField } from "./DustField";
import { useSound } from "@/lib/sound-context";
import styles from "./StartMenu.module.css";

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
    <main className={`${styles.page} start-menu-page`}>
      <HeroBackground images={HERO_IMAGES} activeIndex={activeIndex} />
      <DustField />

      {/* Left-weighted scrim so menu text stays legible over any photo */}
      <div
        aria-hidden
        className={styles.scrim}
      />
      <div className={styles.vignette} />
      <div className="hyde-grain" />

      {/* Sound toggle — sits to the LEFT of the theme toggle (which is at
          right-6 in the layout) so the two controls read as a paired row. */}
      <button
        onClick={toggleMuted}
        className={styles.soundButton}
        aria-label={muted ? "Unmute sound" : "Mute sound"}
      >
        {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        <span className="hidden sm:inline">{muted ? "Sound Off" : "Sound On"}</span>
      </button>

      <div className={styles.shell}>
        <div className={styles.panel}>
          <div className={styles.panelRule} aria-hidden="true"><span>HYDE / 001</span><span>START MENU</span></div>
          <AnimatePresence>
            {booted && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className={styles.brand}
              >
                <Image
                  src="/images/logo.png"
                  alt="Hyde"
                  width={56}
                  height={56}
                  className={styles.logo}
                />
                <div>
                  <h1 className={styles.wordmark}>
                    HYDE
                  </h1>
                  <p className={styles.tagline}>
                    Wear the wild
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <nav aria-label="Main menu">
            <ul className={styles.menuList}>
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
                      className={`${styles.menuItem} ${isActive ? styles.menuItemActive : ""}`}
                    >
                      <span
                        aria-hidden
                        className={`${styles.selector} ${
                          isActive ? "hyde-arrow-bounce" : "opacity-0"
                        }`}
                      >
                        ▸
                      </span>
                      <span
                        className={`${styles.menuLabel} ${
                          isActive
                            ? "text-hyde-bone"
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
                        className={styles.menuHint}
                      >
                        {item.hint}
                      </motion.p>
                    )}
                  </motion.li>
                );
              })}
            </ul>
          </nav>

          <p className={styles.brandNote}>
            HYDE makes bold vegan leather duffel bags in Lagos, Nigeria. Explore the Zambezi founders&apos; drop. <Link href="/about" className="text-hyde-gold underline underline-offset-4 hover:text-hyde-bone">About HYDE</Link>
          </p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={booted ? { opacity: 1 } : {}}
            transition={{ delay: 0.6, duration: 0.8 }}
            className={styles.controls}
          >
            ↑↓ to select · enter to confirm
          </motion.p>
        </div>
      </div>

      <div className={styles.sceneMeta}>
        <p>
          Handmade in Lagos · Founders&apos; Drop
        </p>
      </div>
    </main>
  );
}
