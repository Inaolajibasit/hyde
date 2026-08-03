"use client";

export type Species = "leopard" | "cheetah" | "crocodile" | "snake";

const LABELS: Record<Species, string> = {
  leopard: "PANTHERA PARDUS",
  cheetah: "ACINONYX JUBATUS",
  crocodile: "CROCODYLUS NILOTICUS",
  snake: "NAJA NIGRICOLLIS",
};

export function CreatureSilhouette({ species }: { species: Species }) {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      <svg
        viewBox="0 0 400 240"
        className="w-full max-w-md"
        style={{ filter: "drop-shadow(0 0 24px rgba(184,145,47,0.15))" }}
      >
        <defs>
          <linearGradient id="chromeStroke" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--hyde-chrome)" />
            <stop offset="55%" stopColor="var(--hyde-bone-dim)" />
            <stop offset="100%" stopColor="var(--hyde-chrome-dim)" />
          </linearGradient>
        </defs>
        {species === "leopard" && <Leopard />}
        {species === "cheetah" && <Cheetah />}
        {species === "crocodile" && <Crocodile />}
        {species === "snake" && <Snake />}
      </svg>
      <p className="text-hud text-[10px] text-hyde-bone-dim/60 mt-2 uppercase">
        {LABELS[species]}
      </p>
      <style jsx global>{`
        @keyframes legSwingA {
          0%, 100% { transform: rotate(-14deg); }
          50% { transform: rotate(14deg); }
        }
        @keyframes legSwingB {
          0%, 100% { transform: rotate(14deg); }
          50% { transform: rotate(-14deg); }
        }
        @keyframes bodyBob {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        @keyframes crawlBob {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(2px) rotate(0.6deg); }
        }
        @keyframes tailSwing {
          0%, 100% { transform: rotate(-6deg); }
          50% { transform: rotate(6deg); }
        }
        @keyframes slither {
          0% { transform: translateX(0) scaleX(1); }
          50% { transform: translateX(3px) scaleX(1.01); }
          100% { transform: translateX(0) scaleX(1); }
        }
        .leg-a { transform-origin: top center; animation: legSwingA 0.55s ease-in-out infinite; }
        .leg-b { transform-origin: top center; animation: legSwingB 0.55s ease-in-out infinite; }
        .body-bob { animation: bodyBob 0.55s ease-in-out infinite; }
        .crawl-leg-a { transform-origin: top center; animation: legSwingA 1.6s ease-in-out infinite; }
        .crawl-leg-b { transform-origin: top center; animation: legSwingB 1.6s ease-in-out infinite; }
        .crawl-body { animation: crawlBob 1.6s ease-in-out infinite; }
        .tail-swing { transform-origin: left center; animation: tailSwing 1.1s ease-in-out infinite; }
        .snake-body { animation: slither 1.4s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

/* Prowling leopard — mid-pace, low amplitude, watchful */
function Leopard() {
  return (
    <g className="body-bob">
      <g className="leg-a">
        <line x1="130" y1="150" x2="120" y2="200" stroke="url(#chromeStroke)" strokeWidth="4" strokeLinecap="round" />
      </g>
      <g className="leg-b">
        <line x1="160" y1="155" x2="170" y2="205" stroke="url(#chromeStroke)" strokeWidth="4" strokeLinecap="round" />
      </g>
      <g className="leg-b">
        <line x1="250" y1="150" x2="245" y2="200" stroke="url(#chromeStroke)" strokeWidth="4" strokeLinecap="round" />
      </g>
      <g className="leg-a">
        <line x1="280" y1="155" x2="292" y2="205" stroke="url(#chromeStroke)" strokeWidth="4" strokeLinecap="round" />
      </g>
      <path
        d="M100,150 C120,110 180,100 220,110 C260,100 300,105 320,130 C330,140 325,150 310,150 L280,148 C250,146 180,146 150,150 Z"
        fill="none"
        stroke="url(#chromeStroke)"
        strokeWidth="3.5"
      />
      <g className="tail-swing">
        <path d="M310,135 C345,120 365,90 355,60" fill="none" stroke="url(#chromeStroke)" strokeWidth="3.5" strokeLinecap="round" />
      </g>
      <path d="M95,148 C85,140 82,120 92,112 C100,106 112,110 112,120" fill="none" stroke="url(#chromeStroke)" strokeWidth="3.5" />
      <circle cx="96" cy="118" r="1.6" fill="var(--hyde-gold)" className="animate-hyde-pulse" />
      <line x1="86" y1="106" x2="80" y2="96" stroke="url(#chromeStroke)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="100" y1="103" x2="102" y2="92" stroke="url(#chromeStroke)" strokeWidth="2.5" strokeLinecap="round" />
      {[...Array(10)].map((_, i) => (
        <circle key={i} cx={140 + i * 17} cy={120 + (i % 3 === 0 ? 6 : i % 2 === 0 ? -3 : 2)} r="2.6" fill="none" stroke="var(--hyde-chrome-dim)" strokeWidth="1.4" opacity="0.8" />
      ))}
    </g>
  );
}

/* Sprinting cheetah — fast, wide-legged, low to the ground */
function Cheetah() {
  return (
    <g>
      <g className="leg-a" style={{ animationDuration: "0.32s" }}>
        <line x1="125" y1="145" x2="105" y2="205" stroke="url(#chromeStroke)" strokeWidth="4" strokeLinecap="round" />
      </g>
      <g className="leg-b" style={{ animationDuration: "0.32s" }}>
        <line x1="155" y1="150" x2="178" y2="208" stroke="url(#chromeStroke)" strokeWidth="4" strokeLinecap="round" />
      </g>
      <g className="leg-b" style={{ animationDuration: "0.32s" }}>
        <line x1="255" y1="145" x2="235" y2="205" stroke="url(#chromeStroke)" strokeWidth="4" strokeLinecap="round" />
      </g>
      <g className="leg-a" style={{ animationDuration: "0.32s" }}>
        <line x1="285" y1="150" x2="305" y2="208" stroke="url(#chromeStroke)" strokeWidth="4" strokeLinecap="round" />
      </g>
      <path
        d="M95,150 C110,100 190,95 225,108 C270,95 305,100 322,125 C332,138 322,148 305,148 C260,142 150,142 120,148 Z"
        fill="none"
        stroke="url(#chromeStroke)"
        strokeWidth="3.5"
        style={{ animation: "bodyBob 0.32s ease-in-out infinite" }}
      />
      <g className="tail-swing" style={{ animationDuration: "0.32s" }}>
        <path d="M305,132 C340,110 358,75 348,45" fill="none" stroke="url(#chromeStroke)" strokeWidth="3.5" strokeLinecap="round" />
      </g>
      <path d="M90,148 C78,138 76,116 88,108 C96,102 108,106 108,118" fill="none" stroke="url(#chromeStroke)" strokeWidth="3.5" />
      <line x1="90" y1="112" x2="70" y2="95" stroke="var(--hyde-blood)" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
      <line x1="90" y1="118" x2="66" y2="112" stroke="var(--hyde-blood)" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
      <circle cx="92" cy="114" r="1.6" fill="var(--hyde-gold)" className="animate-hyde-pulse" />
    </g>
  );
}

/* Crocodile — slow, low, deliberate crawl */
function Crocodile() {
  return (
    <g className="crawl-body">
      <g className="crawl-leg-a">
        <line x1="140" y1="165" x2="128" y2="195" stroke="url(#chromeStroke)" strokeWidth="4" strokeLinecap="round" />
      </g>
      <g className="crawl-leg-b">
        <line x1="270" y1="165" x2="282" y2="195" stroke="url(#chromeStroke)" strokeWidth="4" strokeLinecap="round" />
      </g>
      <path
        d="M60,168 C60,158 75,152 95,152 L120,150 C160,140 260,140 300,150 C320,153 335,158 340,166 L330,172 L318,168 L300,172 L120,172 L95,170 Z"
        fill="none"
        stroke="url(#chromeStroke)"
        strokeWidth="3.5"
      />
      <path d="M300,160 L340,155 L336,166 L305,166" fill="none" stroke="url(#chromeStroke)" strokeWidth="2.5" />
      <line x1="308" y1="158" x2="330" y2="153" stroke="var(--hyde-chrome-dim)" strokeWidth="1.6" />
      <circle cx="315" cy="152" r="1.6" fill="var(--hyde-gold)" className="animate-hyde-pulse" />
      <g className="tail-swing" style={{ animationDuration: "2s", transformOrigin: "60px 165px" }}>
        <path d="M60,165 C30,168 10,178 6,195" fill="none" stroke="url(#chromeStroke)" strokeWidth="3.5" strokeLinecap="round" />
      </g>
      {[...Array(9)].map((_, i) => (
        <path key={i} d={`M${110 + i * 22},142 l6,-10 l6,10`} fill="none" stroke="var(--hyde-chrome-dim)" strokeWidth="1.6" opacity="0.85" />
      ))}
    </g>
  );
}

/* Snake — no legs, pure sinuous motion */
function Snake() {
  return (
    <g className="snake-body">
      <path
        d="M50,150 C90,110 110,190 150,150 C190,110 210,190 250,150 C280,120 300,160 330,140"
        fill="none"
        stroke="url(#chromeStroke)"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M320,133 C332,126 344,128 348,138 C351,146 344,153 335,150 C328,148 326,140 320,133 Z"
        fill="none"
        stroke="url(#chromeStroke)"
        strokeWidth="3.5"
      />
      <circle cx="338" cy="138" r="1.6" fill="var(--hyde-blood)" className="animate-hyde-pulse" />
      <line x1="345" y1="133" x2="356" y2="126" stroke="var(--hyde-blood)" strokeWidth="1.8" strokeLinecap="round" />
      {[...Array(6)].map((_, i) => (
        <ellipse key={i} cx={90 + i * 40} cy={150 - (i % 2 === 0 ? 20 : -20)} rx="8" ry="4" fill="none" stroke="var(--hyde-chrome-dim)" strokeWidth="1.2" opacity="0.7" />
      ))}
    </g>
  );
}
