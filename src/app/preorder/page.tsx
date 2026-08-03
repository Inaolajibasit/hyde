import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { products, formatNaira, coverImage } from "@/lib/products";

export const metadata = { title: "Pre-Order — HYDE" };

export default function PreorderIndexPage() {
  return (
    <main className="min-h-screen bg-hyde-black">
      <div className="hyde-grain" />
      <div className="max-w-5xl mx-auto px-6 sm:px-10 pt-20 pb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-hyde-bone-dim hover:text-hyde-gold transition-colors text-hud text-xs uppercase tracking-widest mb-8"
        >
          <ArrowLeft size={14} /> Back to Menu
        </Link>

        <p className="text-hud text-xs text-hyde-gold uppercase tracking-[0.3em] mb-2">
          Founders&apos; Drop
        </p>
        <h1 className="text-display text-5xl text-hyde-bone mb-8">Pre-Order</h1>

        <div className="grid sm:grid-cols-2 gap-6">
          {products.map((p) => {
            const accentColor = p.accent === "blood" ? "var(--hyde-blood)" : "var(--hyde-gold)";
            return (
              <Link
                key={p.handle}
                href={`/preorder/${p.handle}`}
                className="group border border-hyde-khaki-dim hover:border-hyde-gold transition-colors"
              >
                <div className="relative aspect-square">
                  <Image src={coverImage(p)} alt={p.name} fill className="object-cover" />
                </div>
                <div className="p-4">
                  <p
                    className="text-hud text-[10px] uppercase tracking-widest mb-1"
                    style={{ color: accentColor }}
                  >
                    {p.code}
                  </p>
                  <h2 className="text-display text-2xl text-hyde-bone mb-1">{p.name}</h2>
                  <p className="text-hyde-bone-dim/70 text-sm">{formatNaira(p.price)}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
