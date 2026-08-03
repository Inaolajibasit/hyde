"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useSound } from "@/lib/sound-context";

export function WaitlistForm() {
  const { play } = useSound();
  const [form, setForm] = useState({ email: "", name: "", phone: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        setStatus("error");
        return;
      }
      play("select");
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <main className="min-h-screen bg-hyde-black flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <CheckCircle2 className="mx-auto mb-4 text-hyde-gold" size={40} />
          <h1 className="text-display text-3xl text-hyde-bone mb-3">You&apos;re In</h1>
          <p className="text-hyde-bone-dim/80 mb-6">
            You&apos;ll be first to hear about the next drop, plus early access before it goes
            public.
          </p>
          <Link
            href="/"
            className="text-hud text-xs uppercase tracking-widest px-6 py-3 inline-block bg-hyde-gold text-hyde-ink"
          >
            Back to Menu
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-hyde-black flex items-center justify-center px-6">
      <div className="hyde-grain" />
      <div className="max-w-md w-full">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-hyde-bone-dim hover:text-hyde-gold transition-colors text-hud text-xs uppercase tracking-widest mb-8"
        >
          <ArrowLeft size={14} /> Back to Menu
        </Link>
        <p className="text-hud text-xs text-hyde-gold uppercase tracking-[0.3em] mb-2">
          Next Drop
        </p>
        <h1 className="text-display text-4xl text-hyde-bone mb-3">Join the Waitlist</h1>
        <p className="text-hyde-bone-dim/70 mb-8">
          Founders&apos; drop is limited to 250 units per bag. Get on the list for what comes
          after.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            required
            type="email"
            placeholder="Email *"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="hyde-input"
          />
          <input
            placeholder="Full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="hyde-input"
          />
          <input
            type="tel"
            placeholder="Phone (optional)"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="hyde-input"
          />
          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full text-hud text-sm uppercase tracking-widest px-6 py-3.5 bg-hyde-gold text-hyde-ink transition-transform hover:scale-[1.02] disabled:opacity-60 cursor-pointer"
          >
            {status === "submitting" ? "Joining…" : "Join the Waitlist"}
          </button>
          {status === "error" && (
            <p className="text-hyde-blood-bright text-sm">Something went wrong. Try again.</p>
          )}
        </form>
      </div>
      <style jsx global>{`
        .hyde-input {
          width: 100%;
          background: var(--hyde-black-soft);
          border: 1px solid var(--hyde-khaki-dim);
          color: var(--hyde-bone);
          padding: 0.65rem 0.85rem;
          font-family: var(--font-body);
          font-size: 1.05rem;
        }
        .hyde-input:focus {
          border-color: var(--hyde-gold);
          outline: none;
        }
      `}</style>
    </main>
  );
}
