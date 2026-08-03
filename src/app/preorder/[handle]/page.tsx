import { notFound } from "next/navigation";
import { getProduct, products } from "@/lib/products";
import { PreorderForm } from "@/components/PreorderForm";

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
  return { title: product ? `Pre-Order ${product.name} — HYDE` : "Pre-Order — HYDE" };
}

export default async function PreorderHandlePage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = getProduct(handle);
  if (!product) notFound();
  return <PreorderForm product={product} />;
}
