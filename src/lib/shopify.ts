import { createStorefrontApiClient } from "@shopify/storefront-api-client";

// Trim accidental "https://" and trailing slashes — a common copy-paste
// mistake, since the code below adds the protocol itself.
const rawDomain = process.env.SHOPIFY_STORE_DOMAIN;
const domain = rawDomain?.replace(/^https?:\/\//, "").replace(/\/$/, "");
const token = process.env.SHOPIFY_STOREFRONT_TOKEN; // Storefront API PUBLIC access token

export const isShopifyConfigured = Boolean(domain && token);

function getClient() {
  if (!domain || !token) {
    throw new Error(
      "Shopify is not configured. Set SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_TOKEN in your environment."
    );
  }
  return createStorefrontApiClient({
    storeDomain: `https://${domain}`,
    // Keep this current — Shopify retires old API versions on a rolling
    // basis (roughly quarterly) and the client library will warn/fail on
    // an unsupported one. As of writing, 2025-10 is a stable, supported
    // release; check https://shopify.dev/docs/api/usage/versioning if this
    // starts warning again in the future.
    apiVersion: "2025-10",
    publicAccessToken: token,
  });
}

const CART_CREATE = `#graphql
  mutation CartCreate($lines: [CartLineInput!]!, $buyerIdentity: CartBuyerIdentityInput) {
    cartCreate(input: { lines: $lines, buyerIdentity: $buyerIdentity }) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

type CartCreateResponse = {
  cartCreate: {
    cart: { id: string; checkoutUrl: string } | null;
    userErrors: { field: string[]; message: string }[];
  };
};

/**
 * Creates a Shopify cart for a single line item and returns the hosted
 * checkout URL. Redirecting the customer there charges them immediately
 * through whatever payment provider is enabled on the store (in Nigeria,
 * that's typically Paystack or Flutterwave via a Shopify payments app,
 * since native Shopify Payments isn't available there yet).
 */
export async function createCheckout(params: {
  variantId: string; // Shopify gid://shopify/ProductVariant/xxxx
  quantity: number;
  email?: string;
}): Promise<{ checkoutUrl: string }> {
  const client = getClient();

  const result = await client.request<CartCreateResponse>(CART_CREATE, {
    variables: {
      lines: [{ merchandiseId: params.variantId, quantity: params.quantity }],
      buyerIdentity: params.email ? { email: params.email } : undefined,
    },
  });

  // Surface the raw response on failure — "cart is null" can mean several
  // different things (bad token, bad domain, bad variant ID, GraphQL-level
  // error before userErrors even runs), and printing the whole result is
  // far more useful for debugging than a single generic message.
  if (result.errors) {
    console.error("Shopify GraphQL error:", JSON.stringify(result.errors, null, 2));
    throw new Error(
      typeof result.errors === "object" && "message" in result.errors
        ? String((result.errors as { message: string }).message)
        : "Shopify rejected the request. Check SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_TOKEN."
    );
  }

  const userErrors = result.data?.cartCreate.userErrors;
  if (userErrors && userErrors.length > 0) {
    console.error("Shopify cart userErrors:", JSON.stringify(userErrors, null, 2));
    throw new Error(userErrors.map((e) => e.message).join("; "));
  }

  const cart = result.data?.cartCreate.cart;
  if (!cart) {
    console.error("Shopify returned no cart. Full response:", JSON.stringify(result, null, 2));
    throw new Error(
      "Shopify did not return a cart. Check that shopifyVariantId in products.ts is a full " +
        "gid://shopify/ProductVariant/... string, and that the token is the PUBLIC Storefront " +
        "token from the Headless channel (not an Admin API token)."
    );
  }

  return { checkoutUrl: cart.checkoutUrl };
}