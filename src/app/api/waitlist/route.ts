import { NextRequest, NextResponse } from "next/server";
import { appendLead } from "@/lib/leads";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, name, phone } = body ?? {};

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
  }

  await appendLead("waitlist.jsonl", {
    type: "waitlist",
    email,
    name: name || null,
    phone: phone || null,
    submittedAt: new Date().toISOString(),
  });

  return NextResponse.json({ status: "ok" });
}
