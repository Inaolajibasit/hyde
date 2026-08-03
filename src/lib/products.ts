export type Stat = {
  label: string;
  value: number; // 0–5
  suffix?: string;
  rawValue?: string; // human-readable readout, e.g. "38L"
};

export type Product = {
  handle: string;
  code: string; // "BAG 001"
  name: string;
  animalClass: string; // e.g. "PROWLER — LEOPARD"
  accent: "blood" | "gold";
  price: number; // NGN
  currency: "NGN";
  tagline: string;
  description: string;
  materials: string;
  edition: string;
  // All photos for this product, in display order. The first entry is the
  // cover image used by the roster rail and pre-order cards.
  image: string[];
  stats: Stat[];
  perks: string[];
  // Fill this in once the product exists in Shopify (Product variant → "Copy as GID",
  // looks like "gid://shopify/ProductVariant/123456789"). See README.md.
  shopifyVariantId?: string;
};

export const products: Product[] = [
  {
    handle: "bag-001",
    code: "BAG 001",
    name: "Zambezi",
    animalClass: "CLASS: LEOPARD",
    accent: "blood",
    price: 90000,
    currency: "NGN",
    tagline: "Not every bag is meant to blend in.",
    description:
      "The Wild Edition wasn't made for subtle moments. Wrapped in Hyde's signature leopard-inspired pattern and finished with premium black leather details, this piece is unapologetically bold. It doesn't ask for attention. It naturally gets it. Designed for creatives, founders, artists, and anyone who understands that confidence is the best accessory.",
    materials: "Vegan (synthetic) leopard-print leather, genuine-grain vegan leather trim, brushed nickel hardware",
    edition: "Founders' Drop — 001",
    image: ["/images/bag-001-leopard.jpg", "/images/bag-002-leopard.jpeg", "/images/bag-003-leopard.jpeg", "/images/bag-004-leopard.jpeg"],
    stats: [
      { label: "Capacity", value: 5, rawValue: "42L" },
      { label: "Durability", value: 4, rawValue: "Reinforced base" },
      { label: "Stealth", value: 2, rawValue: "Statement piece" },
      { label: "Craft Time", value: 5, rawValue: "9 days, hand-finished" },
      { label: "Weight", value: 4, rawValue: "1.3kg" },
    ],
    perks: [
      "Stay Rare.",
      "Never Blend In",
      "Built for the Spotlight",
    ],
    shopifyVariantId: "gid://shopify/ProductVariant/45505070399597",
  },
  {
    handle: "bag-002",
    code: "BAG 002",
    name: "Zambezi dark",
    animalClass: "CLASS: NIGHT STALKER — BLACK PANTHER",
    accent: "gold",
    price: 90000,
    currency: "NGN",
    tagline: "No introduction needed.",
    description:
      "The Hyde Zambezi is designed for those who understand that style starts long before the destination. Crafted from premium vegan leather and finished with Hyde's signature leopard inspired detailing, it brings together clean design and unapologetic confidence.",
    materials: "Vegan (synthetic) pebbled leather body, vegan leopard-texture calf-hair-effect trim, brushed nickel hardware",
    edition: "Founders' Drop — 002",
    image: ["/images/bag-001-black.jpeg", "/images/bag-002-black.jpg", "/images/bag-003-black.jpeg", "/images/bag-004-black.jpeg"],
    stats: [
      { label: "Capacity", value: 5, rawValue: "42L" },
      { label: "Durability", value: 5, rawValue: "Full-grain structure" },
      { label: "Stealth", value: 5, rawValue: "Boardroom to airport" },
      { label: "Craft Time", value: 3, rawValue: "9 days, hand-finished" },
      { label: "Weight", value: 4, rawValue: "1.4kg" },
    ],
    perks: [
      "Your Next Statement Piece",
      "Designed to Be Remembered",
      "Where Swag Meets Instinct",
    ],
    shopifyVariantId: "gid://shopify/ProductVariant/45505073414253",
  },
];

export function getProduct(handle: string): Product | undefined {
  return products.find((p) => p.handle === handle);
}

// The first image in `Product.image` is the cover, used by tiles and rails
// that only have room for a single shot. Centralising the convention here so
// it doesn't leak into every call site.
export function coverImage(p: Product): string {
  return p.image[0];
}

export function formatNaira(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}
