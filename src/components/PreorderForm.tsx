"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Product, formatNaira } from "@/lib/products";
import { useSound } from "@/lib/sound-context";

export function PreorderForm({ product }: { product: Product }) {
  const router = useRouter();
  const { play } = useSound();
  const [quantity, setQuantity] = useState(1);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "queued" | "error">("idle");
  const [message, setMessage] = useState("");

  const accentColor = product.accent === "blood" ? "var(--hyde-blood)" : "var(--hyde-gold)";
  const total = product.price * quantity;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/preorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handle: product.handle, quantity, ...form }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
        return;
      }
      play("select");
      if (data.status === "checkout" && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }
      setStatus("queued");
      setMessage(data.message || "Order received.");
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  if (status === "queued") {
    return (
      <main className="min-h-screen bg-hyde-black flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <CheckCircle2 className="mx-auto mb-4" style={{ color: accentColor }} size={40} />
          <h1 className="text-display text-3xl text-hyde-bone mb-3">Order Received</h1>
          <p className="text-hyde-bone-dim/80 mb-6">{message}</p>
          <Link
            href="/"
            className="text-hud text-xs uppercase tracking-widest px-6 py-3 inline-block"
            style={{ background: accentColor, color: "var(--hyde-ink)" }}
          >
            Back to Menu
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-hyde-black">
      <div className="hyde-grain" />
      <div className="max-w-5xl mx-auto px-6 sm:px-10 pt-20 pb-8">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-hyde-bone-dim hover:text-hyde-gold transition-colors text-hud text-xs uppercase tracking-widest mb-8 cursor-pointer"
        >
          <ArrowLeft size={14} /> Back
        </button>

        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <div className="relative aspect-square border border-hyde-khaki-dim mb-4">
              <Image src={product.image[0]} alt={product.name} fill className="object-cover" />
            </div>
            <p
              className="text-hud text-[11px] uppercase tracking-[0.25em] mb-1"
              style={{ color: accentColor }}
            >
              {product.animalClass}
            </p>
            <h1 className="text-display text-3xl text-hyde-bone mb-1">{product.name}</h1>
            <p className="text-hyde-bone-dim/70 text-sm">{product.edition}</p>
          </div>

          <div>
            <h2 className="text-hud text-xs uppercase tracking-widest text-hyde-bone-dim mb-5">
              Pre-Order Details
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Field label="Full name" required>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="hyde-input"
                  placeholder="Ada Obi"
                />
              </Field>
              <Field label="Email" required>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="hyde-input"
                  placeholder="you@email.com"
                />
              </Field>
              <Field label="Phone (WhatsApp preferred)" required>
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="hyde-input"
                  placeholder="080..."
                />
              </Field>
              <Field label="Delivery address" required>
                <textarea
                  required
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="hyde-input min-h-[80px]"
                  placeholder="Street, area, city, state"
                />
              </Field>

              <Field label="Quantity">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-9 h-9 border border-hyde-khaki-dim text-hyde-bone hover:border-hyde-gold transition-colors cursor-pointer"
                  >
                    −
                  </button>
                  <span className="text-hyde-bone w-6 text-center">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(5, q + 1))}
                    className="w-9 h-9 border border-hyde-khaki-dim text-hyde-bone hover:border-hyde-gold transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </Field>

              <div className="flex items-center justify-between border-t border-hyde-khaki-dim pt-4 mt-6">
                <div>
                  <p className="text-hud text-[10px] text-hyde-bone-dim/60 uppercase">Total</p>
                  <p className="text-display text-2xl text-hyde-bone">{formatNaira(total)}</p>
                </div>
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="text-hud text-sm uppercase tracking-widest px-8 py-3.5 transition-transform hover:scale-[1.03] disabled:opacity-60 cursor-pointer"
                  style={{ background: accentColor, color: "var(--hyde-ink)" }}
                >
                  {status === "submitting" ? "Processing…" : "Pay & Pre-Order"}
                </button>
              </div>
              {status === "error" && (
                <p className="text-hyde-blood-bright text-sm pt-2">{message}</p>
              )}
              <p className="text-hyde-bone-dim/50 text-xs pt-2">
                You&apos;ll be charged in full at checkout. Founders&apos; drop bags are made to
                order — allow 2–3 weeks for delivery.
              </p>
            </form>
          </div>
        </div>
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

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-hud text-[10px] uppercase tracking-widest text-hyde-bone-dim/70 mb-1.5 block">
        {label} {required && <span className="text-hyde-blood">*</span>}
      </span>
      {children}
    </label>
  );
}
