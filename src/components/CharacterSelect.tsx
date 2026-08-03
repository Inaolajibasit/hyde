"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import { products, formatNaira, coverImage } from "@/lib/products";
import { StatBar } from "./StatBar";
import { useSound } from "@/lib/sound-context";

export function CharacterSelect() {
  const [index, setIndex] = useState(0);
  const [photoIndex, setPhotoIndex] = useState(0);
  const product = products[index];
  const { play } = useSound();

  // Reset the gallery selection whenever the bag changes. Without this, switching
  // from bag 1 (image 1 of 2) to bag 2 would land on bag 2's image 1 too, which
  // is rarely what the shopper wants.
  useEffect(() => {
    setPhotoIndex(0);
  }, [index]);

  const go = (dir: 1 | -1) => {
    play("hover");
    setIndex((i) => (i + dir + products.length) % products.length);
  };

  const accentColor = product.accent === "blood" ? "var(--hyde-blood)" : "var(--hyde-gold)";

  return (
    <main className="relative min-h-screen bg-hyde-black overflow-hidden">
      <div className="hyde-grain" />
      <div className="max-w-7xl mx-auto px-6 sm:px-10 pt-20 pb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-hyde-bone-dim hover:text-hyde-gold transition-colors text-hud text-xs uppercase tracking-widest mb-8"
        >
          <ArrowLeft size={14} /> Back to Menu
        </Link>

        <div className="flex items-center justify-between mb-6">
          <p className="text-hud text-xs text-hyde-bone-dim uppercase tracking-[0.3em]">
            Select Your Bag
          </p>
          <p className="text-hud text-xs text-hyde-bone-dim">
            {String(index + 1).padStart(2, "0")} / {String(products.length).padStart(2, "0")}
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-10 items-start">
          {/* Roster rail */}
          <div className="lg:col-span-1 flex lg:flex-col gap-3 order-2 lg:order-1">
            {products.map((p, i) => (
              <button
                key={p.handle}
                onClick={() => {
                  play("hover");
                  setIndex(i);
                }}
                className={`relative flex-1 lg:flex-none aspect-square lg:aspect-[4/3] overflow-hidden border transition-all cursor-pointer ${
                  i === index
                    ? "border-hyde-gold"
                    : "border-hyde-khaki-dim opacity-50 hover:opacity-80"
                }`}
              >
                <Image src={coverImage(p)} alt={p.name} fill className="object-cover" />
                {i === index && (
                  <div className="absolute inset-0 ring-2 ring-hyde-gold ring-inset" />
                )}
              </button>
            ))}
          </div>

          {/* Main viewer */}
          <div className="lg:col-span-2 order-1 lg:order-2 relative">
            <div className="flex items-center justify-between mb-3 lg:hidden">
              <button onClick={() => go(-1)} aria-label="Previous bag" className="text-hyde-bone-dim">
                <ChevronLeft />
              </button>
              <button onClick={() => go(1)} aria-label="Next bag" className="text-hyde-bone-dim">
                <ChevronRight />
              </button>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={`${product.handle}-${photoIndex}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35 }}
                className="relative aspect-square bg-hyde-black-soft border border-hyde-khaki-dim"
              >
                <Image
                  src={product.image[photoIndex]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
                <div
                  className="absolute top-3 left-3 text-hud text-[10px] uppercase px-2 py-1 tracking-widest"
                  style={{ background: accentColor, color: "var(--hyde-ink)" }}
                >
                  {product.code}
                </div>
              </motion.div>
            </AnimatePresence>
            {/* Thumbnail strip — only rendered when the bag has more than one
                photo, so single-image bags look identical to before. */}
            {product.image.length > 1 && (
              <div className="flex gap-2 mt-3" role="tablist" aria-label="Product photos">
                {product.image.map((src, i) => (
                  <button
                    key={src}
                    role="tab"
                    aria-selected={i === photoIndex}
                    aria-label={`Show photo ${i + 1} of ${product.image.length}`}
                    onClick={() => {
                      if (i === photoIndex) return;
                      play("hover");
                      setPhotoIndex(i);
                    }}
                    className={`relative w-16 aspect-square overflow-hidden border transition-all cursor-pointer ${
                      i === photoIndex
                        ? "border-hyde-gold"
                        : "border-hyde-khaki-dim opacity-50 hover:opacity-80"
                    }`}
                  >
                    <Image src={src} alt="" fill className="object-cover" sizes="64px" />
                  </button>
                ))}
              </div>
            )}
            <button
              onClick={() => go(-1)}
              aria-label="Previous bag"
              className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 text-hyde-bone-dim hover:text-hyde-gold transition-colors cursor-pointer"
            >
              <ChevronLeft size={28} />
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Next bag"
              className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 text-hyde-bone-dim hover:text-hyde-gold transition-colors cursor-pointer"
            >
              <ChevronRight size={28} />
            </button>
          </div>

          {/* Stat sheet */}
          <div className="lg:col-span-2 order-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={product.handle}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
              >
                <p
                  className="text-hud text-[11px] uppercase tracking-[0.25em] mb-1"
                  style={{ color: accentColor }}
                >
                  {product.animalClass}
                </p>
                <h1 className="text-display text-4xl sm:text-5xl text-hyde-bone leading-none mb-3">
                  {product.name}
                </h1>
                <p className="text-hyde-bone-dim italic text-lg mb-5">{product.tagline}</p>

                <p className="text-hyde-bone-dim/90 leading-relaxed mb-6">
                  {product.description}
                </p>

                <div className="mb-6">
                  {product.stats.map((stat, i) => (
                    <StatBar key={stat.label} stat={stat} index={i} accent={product.accent} />
                  ))}
                </div>

                <ul className="mb-6 space-y-1.5">
                  {product.perks.map((perk) => (
                    <li
                      key={perk}
                      className="text-hyde-bone-dim/80 text-sm flex items-center gap-2"
                    >
                      <span style={{ color: accentColor }}>◆</span> {perk}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-between border-t border-hyde-khaki-dim pt-5">
                  <div>
                    <p className="text-hud text-[10px] text-hyde-bone-dim/60 uppercase">
                      {product.edition}
                    </p>
                    <p className="text-display text-3xl text-hyde-bone">
                      {formatNaira(product.price)}
                    </p>
                  </div>
                  <Link
                    href={`/preorder/${product.handle}`}
                    onClick={() => play("select")}
                    className="text-hud text-sm uppercase tracking-widest px-8 py-3.5 transition-transform hover:scale-[1.03]"
                    style={{ background: accentColor, color: "var(--hyde-ink)" }}
                  >
                    Select →
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}
