/**
 * IMPORTANT: Vercel's filesystem is read-only/ephemeral in production — writes
 * here will work when you run `npm run dev` locally, but will NOT persist
 * once deployed. For production, set LEADS_WEBHOOK_URL to an endpoint that
 * stores the data somewhere durable. Good free/cheap options:
 *   - A Zapier "Catch Hook" that appends a row to Google Sheets
 *   - An Airtable "Web API" endpoint
 *   - A Klaviyo/Mailchimp list-subscribe endpoint (for waitlist specifically)
 *   - A Supabase/Postgres table via a small insert API
 * See README.md → "Connecting the waitlist and pre-orders" for step-by-step setup.
 */

import { promises as fs } from "fs";
import path from "path";

type LeadRecord = Record<string, unknown>;

export async function appendLead(filename: string, record: LeadRecord) {
  // Always log — this shows up in `vercel logs` even without a webhook set.
  console.log(`[hyde:lead:${filename}]`, JSON.stringify(record));

  // Optional durable forwarding.
  const webhook = process.env.LEADS_WEBHOOK_URL;
  if (webhook) {
    try {
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
      });
    } catch (err) {
      console.error("Failed to forward lead to LEADS_WEBHOOK_URL:", err);
    }
  }

  // Local-dev-only convenience log file.
  if (process.env.NODE_ENV !== "production") {
    try {
      const dir = path.join(process.cwd(), ".local-leads");
      await fs.mkdir(dir, { recursive: true });
      await fs.appendFile(
        path.join(dir, filename),
        JSON.stringify(record) + "\n",
        "utf8"
      );
    } catch {
      // non-fatal in dev
    }
  }
}
