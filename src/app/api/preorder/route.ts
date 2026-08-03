import { NextRequest, NextResponse } from "next/server";
import { createCheckout, isShopifyConfigured } from "@/lib/shopify";
import { getProduct } from "@/lib/products";
import { appendLead } from "@/lib/leads";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { handle, quantity = 1, name, email, phone, address } = body ?? {};

  if (!handle || !name || !email || !phone || !address) {
    return NextResponse.json(
      { error: "Missing required fields." },
      { status: 400 }
    );
  }

  const product = getProduct(handle);
  if (!product) {
    return NextResponse.json({ error: "Unknown product." }, { status: 404 });
  }

  // Always record the lead first — this is the source of truth while the
  // store is being wired up, and a useful audit trail afterward.
  await appendLead("preorders.jsonl", {
    type: "preorder",
    handle,
    productName: product.name,
    quantity,
    name,
    email,
    phone,
    address,
    submittedAt: new Date().toISOString(),
  });

  if (!isShopifyConfigured || !product.shopifyVariantId) {
    // Store not connected yet (or this product's variant ID hasn't been
    // pasted into src/lib/products.ts) — tell the frontend so it can show
    // a "we've got your order, payment link coming by email/WhatsApp" state
    // instead of a broken checkout redirect.
    return NextResponse.json({
      status: "queued",
      message:
        "Order received. Shopify checkout isn't connected yet — we'll follow up by email with a payment link.",
    });
  }

  try {
    const { checkoutUrl } = await createCheckout({
      variantId: product.shopifyVariantId,
      quantity,
      email,
    });
    return NextResponse.json({ status: "checkout", checkoutUrl });
  } catch (err) {
    console.error("Shopify checkout error:", err);
    return NextResponse.json(
      {
        status: "queued",
        message:
          "Order received, but we couldn't reach the checkout automatically. We'll follow up by email with a payment link.",
      },
      { status: 200 }
    );
  }
}
