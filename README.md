# HYDE — Website

A game-menu-style storefront for HYDE, built with **Next.js 14 (App Router) + TypeScript + Tailwind v4 + Framer Motion + Three.js**, wired for a **headless Shopify** backend.

## What's here

- **`/`** — Full-screen start menu (God of War–style): keyboard-navigable list over a **full-bleed lifestyle photo background** that switches per menu item with a fade-through-black transition (not a plain dissolve — the old image fades to black, swaps, then the new one fades in). All images are preloaded on load, so switching is instant with no network delay. Sound toggle top-right, theme toggle top-left.
- **Light/dark mode** — toggle top-left on every page (persisted, no flash on reload). Dark is the default "safari at night" look; light flips to a warm sand/ivory "day safari" palette using the same brand accent colors.
- **`/products`** — "Character select" product browser with game-stat bars (Capacity, Durability, Stealth, Craft Time, Weight) for the two founders' drop bags.
- **`/preorder`** and **`/preorder/[handle]`** — Pre-order form → Shopify checkout (or a "queued" fallback if Shopify isn't connected yet).
- **`/waitlist`** — Email capture for the next drop.
- **`/api/preorder`**, **`/api/waitlist`** — API routes that log every lead and can forward to a webhook.

All product content (names, prices, stats, descriptions) lives in one file: **`src/lib/products.ts`**. Edit that to change anything about the two bags.

---

## 1. Run it locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`. Everything works out of the box — pre-orders and waitlist signups are logged to the terminal and to `.local-leads/*.jsonl` — **no Shopify account needed yet.**

---

## 2. Set up Shopify (headless)

You said you don't have a Shopify store yet. Here's the shortest path:

1. **Create a store** at [shopify.com](https://www.shopify.com) (start on Basic — you can upgrade later). Nigeria isn't currently supported by native Shopify Payments, so at checkout you'll be prompted to pick a regional payment provider — pick **Paystack** or **Flutterwave** (both integrate with Shopify as apps) so you can actually receive Naira payments.
2. In Shopify admin, go to **Settings → Apps and sales channels → Develop apps** → **Create an app**.
3. Under **Configuration → Storefront API**, enable it and copy the **Storefront API access token** (this is safe to use in a frontend — it's read/cart-only, not an admin key).
4. Add two products in Shopify admin matching the two bags (**Bag 001 — The Prowler Duffel**, **Bag 002 — The Night Stalker Duffel**), price ₦120,000 each, and upload the same photos you gave me.
5. For each product, open the variant, and copy its ID. The easiest way: in the Shopify admin URL when viewing a variant, or via the GraphQL Admin API — the ID you need looks like `gid://shopify/ProductVariant/123456789`.
6. Paste those IDs into `src/lib/products.ts` on the `shopifyVariantId` field for each product.
7. Set environment variables (see below).

Once that's done, hitting **"Pay & Pre-Order"** creates a real Shopify cart and sends the customer to Shopify's own hosted checkout, where they're charged instantly through Paystack/Flutterwave.

### Environment variables

Create a `.env.local` file (never commit this):

```bash
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_TOKEN=replace-me

# Optional but recommended: forwards every waitlist/pre-order submission
# to a Zapier "Catch Hook", Airtable Web API, Klaviyo list, or similar,
# so leads aren't only sitting in Vercel's function logs.
LEADS_WEBHOOK_URL=
```

If `SHOPIFY_STORE_DOMAIN` / `SHOPIFY_STOREFRONT_TOKEN` aren't set (or a product's `shopifyVariantId` is missing), the pre-order form still works — it just shows "Order received, we'll follow up with a payment link" instead of redirecting to checkout. Nothing breaks either way.

---

## 3. Connecting the waitlist and pre-orders to somewhere durable

Vercel's filesystem resets between requests, so **don't rely on the local `.local-leads/` files in production** — they only work when running `npm run dev` on your own machine. For production, set `LEADS_WEBHOOK_URL` to one of:

- A **Zapier** "Catch Hook" trigger → appends a row to Google Sheets (fastest to set up, free tier is fine for a launch).
- An **Airtable** base with the Web API enabled.
- A **Klaviyo** or **Mailchimp** list-subscribe endpoint (best if you want the waitlist to *also* be your email marketing list).
- A small **Supabase** table with a REST insert endpoint, if you want a real database.

Every submission is also printed to the server console either way (`vercel logs will show them), as a backup.

---

## 4. Deploy to Vercel (free)

Vercel's free (Hobby) tier is the natural fit for Next.js and is genuinely free for a project at this stage — no cost until you have real scale.

1. Push this project to a GitHub repo.
2. Go to [vercel.com/new](https://vercel.com/new), import the repo.
3. Add the environment variables from step 2 in the Vercel project settings (**Settings → Environment Variables**).
4. Deploy. Vercel auto-detects Next.js — no config needed.
5. Add your domain under **Settings → Domains** once you've bought one (Namecheap, GoDaddy, or a Nigerian registrar like `whogohost.com` all work — just point the DNS records Vercel gives you).

**Alternative to Vercel:** Netlify and Cloudflare Pages both also have generous free tiers and support Next.js, if you want a second free option to compare.

---

## 5. Fonts

Fonts currently load via a `<link>` tag in `src/app/layout.tsx` (Bebas Neue, Cormorant Garamond, JetBrains Mono from Google Fonts) rather than `next/font/google`, only because this sandbox's build environment couldn't reach `fonts.googleapis.com` to verify it. **On Vercel, switch to `next/font/google`** for better performance (fonts get self-hosted and don't block first paint):

```tsx
import { Bebas_Neue, Cormorant_Garamond, JetBrains_Mono } from "next/font/google";
```

Happy to make this swap for you directly — just ask.

---

## 6. Rotating secrets

`SHOPIFY_STOREFRONT_TOKEN` and `LEADS_WEBHOOK_URL` are sensitive. Anyone with the Storefront token can read your product catalogue and create carts; anyone with the webhook URL can spam it with fake leads. **Treat both as secrets from day one.**

If a secret ever leaks — paste it into a chat, commit it to a public repo, share a screenshot, hand the codebase to someone you don't fully trust — rotate immediately. Do this **before** cleaning up the leak, because the moment a value is in someone else's hands, only the source-side rotation makes it useless again.

### Rotating the Shopify Storefront token

1. **Shopify admin → Settings → Apps and sales channels → Develop apps → your app → API credentials → Storefront API integration → Rotate token.** Shopify shows the new token once; copy it somewhere safe.
2. **Vercel → your project → Settings → Environment Variables → `SHOPIFY_STOREFRONT_TOKEN` → edit** and paste the new value. Redeploy.
3. **Locally:** paste the new value into `.env.local`. Don't keep the old one on disk anywhere.
4. **Verify:** hit `https://your-store.myshopify.com/api/2025-10/graphql.json` with the new token via the [Shopify GraphQL explorer](https://shopify.dev/docs/api/storefront). If a basic query returns data, the rotation worked.

### Rotating `LEADS_WEBHOOK_URL`

1. **In the destination tool** (Make.com, Zapier, Airtable, etc.) **disable the old hook/webhook** so it stops accepting traffic. Make.com: Scenario → toggle off, or recreate the webhook and copy the new URL.
2. **Vercel → your project → Settings → Environment Variables → `LEADS_WEBHOOK_URL` → edit** with the new value. Redeploy.
3. **Locally:** update `.env.local`.
4. **Verify:** submit a test waitlist entry, confirm the new destination received it.

### Verifying no leaked values remain in your working tree

Run this from the project root. It greps the codebase for the leaked token string — substitute the actual leaked value for `PASTE_LEAKED_VALUE_HERE`:

```bash
rg -uu 'PASTE_LEAKED_VALUE_HERE' .
```

If anything matches, remove or scrub it. The same command works for the Make.com webhook URL.

---

## 7. Start-screen hero images

`src/components/StartMenu.tsx` has a `HERO_IMAGES` array mapping one photo to each menu item, in order. **One thing to fix first:** the third campaign photo (both bags together with the cheetah, on the red curtain background) didn't come through as a file when it was sent — the "Enter the Hunt" and "Join the Waitlist" slots are temporarily both pointing at the leopard/stone-bench shot as a placeholder. Re-send that image, drop it in `public/images/`, and update the `src` on `HERO_IMAGES[0]` (there's a `// NOTE:` comment marking exactly where).

To change any hero image: drop the file in `public/images/` and update its `src` in `HERO_IMAGES`. Keep them roughly similar in tone/exposure — the left-side gradient overlay and vignette are tuned for the current three, and a much brighter or busier photo may need the gradient in `StartMenu.tsx` adjusted for text legibility.

There's also an older, fully-built video-panel version of this same concept still in the codebase (`AnimalVideo.tsx` + three tiny placeholder `.mp4`s in `public/videos/`) and a procedural-3D-animal version (`Animal3D.tsx`) — neither is wired up right now, but both work standalone if you ever want to switch approaches again.

## 8. What to send me next

- Real product photography or any 3D-model-ready assets, if you want the character-select viewer to eventually support a rotating 3D bag instead of a static photo.
- Final logo files (vector/SVG if you have them — the current one is a placeholder JPEG).
- Copy/pricing for belts, slippers, and scarves once those are ready to add — the product data structure in `src/lib/products.ts` is built to scale to more items without touching page code.

---

## Project structure

```
src/
  app/
    page.tsx                 — start menu
    products/page.tsx        — character select
    preorder/page.tsx        — pre-order bag picker
    preorder/[handle]/page.tsx
    waitlist/page.tsx
    api/preorder/route.ts
    api/waitlist/route.ts
  components/
    StartMenu.tsx
    CreatureSilhouette.tsx   — animated predator SVGs
    DustField.tsx            — Three.js particle background
    CharacterSelect.tsx
    StatBar.tsx
    PreorderForm.tsx
    WaitlistForm.tsx
  lib/
    products.ts              — single source of truth for bag data
    shopify.ts                — Storefront API client
    leads.ts                  — lead logging/forwarding
    sound-context.tsx
```
