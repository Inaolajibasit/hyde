import Link from "next/link";
import Image from "next/image";
import { products, coverImage, formatNaira } from "@/lib/products";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About the Brand",
  description: "Learn about HYDE, a Lagos fashion accessories brand making bold vegan leather duffel bags. Meet the Zambezi founders' drop and its two editions.",
  path: "/about",
  image: "/images/hero-founder-duo.jpeg",
});

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-hyde-black px-6 pb-20 pt-24 text-hyde-bone sm:px-10">
      <div className="mx-auto max-w-5xl">
        <p className="text-hud text-xs uppercase text-hyde-gold">The brand</p>
        <h1 className="text-display mt-3 text-5xl leading-none sm:text-7xl">About HYDE</h1>
        <p className="mt-7 max-w-3xl text-xl leading-relaxed text-hyde-bone-dim">
          HYDE is a fashion accessories brand based in Lagos, Nigeria. We make statement bags for people who want to stand out. Our first collection, the Zambezi founders&apos; drop, features vegan leather duffel bags in leopard and dark editions.
        </p>
        <p className="mt-5 max-w-3xl text-base leading-relaxed text-hyde-bone-dim">
          Each Zambezi bag is designed for travel and everyday movement, with a 42L capacity and distinct animal-inspired details. Explore the editions below, then choose your bag to pre-order.
        </p>

        <h2 className="text-display mt-14 text-3xl sm:text-4xl">The founders&apos; drop</h2>
        <div className="mt-5 grid gap-6 sm:grid-cols-2">
          {products.map((product) => (
            <article key={product.handle} className="border border-hyde-khaki-dim bg-hyde-black-soft">
              <div className="relative aspect-[4/3]">
                <Image src={coverImage(product)} alt={`${product.name} HYDE duffel bag`} fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover" />
              </div>
              <div className="p-5">
                <p className="text-hud text-xs uppercase text-hyde-gold">{product.code}</p>
                <h3 className="text-display mt-1 text-3xl">{product.name}</h3>
                <p className="text-product-description mt-3 text-sm leading-relaxed text-hyde-bone-dim">{product.tagline} {product.materials}.</p>
                <div className="mt-5 flex items-center justify-between gap-4">
                  <span className="text-display text-2xl">{formatNaira(product.price)}</span>
                  <Link href={`/preorder/${product.handle}`} className="inline-flex min-h-11 items-center bg-hyde-gold px-5 text-hud text-sm text-hyde-ink">View bag →</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
