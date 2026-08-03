"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export type HeroImage = { src: string; alt: string };

// 900ms gives the eye time to read the new photo. Faster than this feels
// jarring when the auto-advance timer fires every 7.5s; slower and the user
// sees the black scrim linger.
const FADE_MS = 900;

/**
 * All images are mounted once (so there's zero network delay on switch) and
 * cross-visibility is a pure opacity toggle. The "dark fade" is implemented
 * as an actual fade-through-black rather than a simple dissolve: a black
 * scrim fades in over the outgoing image, the image swaps while fully
 * hidden behind it, then the scrim fades back out over the new image. This
 * is cheap (two staggered CSS opacity transitions, no per-frame JS) and
 * reads as a deliberate cinematic cut rather than a cross-dissolve.
 */
export function HeroBackground({
  images,
  activeIndex,
}: {
  images: HeroImage[];
  activeIndex: number;
}) {
  const [displayedIndex, setDisplayedIndex] = useState(activeIndex);
  const [scrimOpacity, setScrimOpacity] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (activeIndex === displayedIndex) return;

    timers.current.forEach(clearTimeout);
    timers.current = [];

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setScrimOpacity(1); // fade current image to black
    const t1 = setTimeout(() => {
      setDisplayedIndex(activeIndex); // swap while fully hidden
      const t2 = setTimeout(() => setScrimOpacity(0), 20); // reveal new image
      timers.current.push(t2);
    }, FADE_MS);
    timers.current.push(t1);

    return () => {
      timers.current.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  return (
    <div className="absolute inset-0 -z-20 overflow-hidden bg-hyde-black">
      {images.map((img, i) => (
        <Image
          key={img.src}
          src={img.src}
          alt={img.alt}
          fill
          priority={i === 0}
          loading={i === 0 ? undefined : "eager"}
          sizes="100vw"
          quality={78}
          className="object-cover"
          style={{ opacity: i === displayedIndex ? 1 : 0 }}
        />
      ))}
      <div
        aria-hidden
        className="absolute inset-0 bg-hyde-black pointer-events-none"
        style={{ opacity: scrimOpacity, transition: `opacity ${FADE_MS}ms ease` }}
      />
    </div>
  );
}
