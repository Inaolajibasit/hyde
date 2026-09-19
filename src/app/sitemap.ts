import type { MetadataRoute } from "next";
import { products } from "@/lib/products";
import { absoluteSiteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", "/about", "/products", "/preorder", "/waitlist", ...products.map((product) => `/preorder/${product.handle}`)];
  return paths.flatMap((path) => {
    const url = absoluteSiteUrl(path);
    return url ? [{ url, changeFrequency: "monthly" as const, priority: path === "/" ? 1 : 0.7 }] : [];
  });
}
