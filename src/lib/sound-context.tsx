"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";

type SoundKind = "hover" | "select" | "back";

type SoundContextValue = {
  muted: boolean;
  toggleMuted: () => void;
  play: (kind: SoundKind) => void;
};

const SoundContext = createContext<SoundContextValue | null>(null);

// Short synthesized tones via WebAudio — no binary asset files required.
// Keeps the repo lightweight; swap for real SFX by editing FREQUENCIES below
// or wiring an <audio> element to /public/sfx/*.mp3.
const FREQUENCIES: Record<SoundKind, number> = {
  hover: 720,
  select: 340,
  back: 220,
};

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [muted, setMuted] = useState(true); // default OFF until user opts in
  const ctxRef = useRef<AudioContext | null>(null);

  // Sync from localStorage after mount. Intentionally a one-time setState
  // inside an effect: this is the standard hydration-safe way to read
  // browser-only storage without mismatching the server-rendered markup.
  useEffect(() => {
    const stored = window.localStorage.getItem("hyde-sound-muted");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored !== null) setMuted(stored === "true");
  }, []);

  const toggleMuted = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      window.localStorage.setItem("hyde-sound-muted", String(next));
      return next;
    });
  }, []);

  const play = useCallback(
    (kind: SoundKind) => {
      if (muted) return;
      try {
        if (!ctxRef.current) {
          const AudioCtx =
            window.AudioContext ||
            (window as unknown as { webkitAudioContext: typeof AudioContext })
              .webkitAudioContext;
          ctxRef.current = new AudioCtx();
        }
        const ctx = ctxRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = kind === "select" ? "triangle" : "sine";
        osc.frequency.value = FREQUENCIES[kind];
        gain.gain.setValueAtTime(0.0001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.06, ctx.currentTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      } catch {
        // audio not available — fail silently, never block interaction
      }
    },
    [muted]
  );

  return (
    <SoundContext.Provider value={{ muted, toggleMuted, play }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error("useSound must be used within SoundProvider");
  return ctx;
}
