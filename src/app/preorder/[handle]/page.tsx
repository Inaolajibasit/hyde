import { notFound } from "next/navigation";
import { getProduct, products } from "@/lib/products";
import { PreorderForm } from "@/components/PreorderForm";
import { absoluteSiteUrl, jsonLd, pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return products.map((p) => ({ handle: p.handle }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = getProduct(handle);
  if (!product) return { title: "Product Not Found" };
  return pageMetadata({
    title: `${product.name} Duffel Bag`,
    description: `Pre-order the ${product.name} by HYDE, a Lagos-designed vegan leather duffel bag. ${product.tagline}`,
    path: `/preorder/${product.handle}`,
    image: product.image[0],
  });
}

export default async function PreorderHandlePage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = getProduct(handle);
  if (!product) notFound();
  const productUrl = absoluteSiteUrl(`/preorder/${product.handle}`);
  const structuredData = productUrl
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: product.description,
        sku: product.code,
        category: "Duffel bag",
        material: product.materials,
        image: product.image.flatMap((image) => {
          const url = absoluteSiteUrl(image);
          return url ? [url] : [];
        }),
        brand: { "@type": "Brand", name: "HYDE" },
        offers: {
          "@type": "Offer",
          url: productUrl,
          price: product.price,
          priceCurrency: product.currency,
          availability: "https://schema.org/PreOrder",
          itemCondition: "https://schema.org/NewCondition",
        },
      }
    : null;
  return (
    <>
      {structuredData && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }} />
      )}
      <PreorderForm product={product} />
    </>
  );
}
