"use client";

import { motion } from "framer-motion";
import { Stat } from "@/lib/products";

export function StatBar({ stat, index, accent }: { stat: Stat; index: number; accent: "blood" | "gold" }) {
  const accentColor = accent === "blood" ? "var(--hyde-blood)" : "var(--hyde-gold)";
  const filled = stat.value;
  const total = 5;

  return (
    <div className="mb-3">
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-hud text-[11px] uppercase tracking-widest text-hyde-bone-dim">
          {stat.label}
        </span>
        {stat.rawValue && (
          <span className="text-hud text-[10px] text-hyde-bone-dim/60">{stat.rawValue}</span>
        )}
      </div>
      <div className="flex gap-1">
        {Array.from({ length: total }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.4, delay: index * 0.08 + i * 0.04 }}
            style={{
              transformOrigin: "left",
              background: i < filled ? accentColor : "var(--hyde-khaki-dim)",
            }}
            className="h-2 flex-1 rounded-sm"
          />
        ))}
      </div>
    </div>
  );
}
