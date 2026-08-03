"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { zebraTexture, cheetahTexture, crocodileTexture } from "@/lib/animal-textures";

export type AnimalSpecies = "zebra" | "cheetah" | "crocodile";

const LABELS: Record<AnimalSpecies, string> = {
  zebra: "EQUUS QUAGGA",
  cheetah: "ACINONYX JUBATUS",
  crocodile: "CROCODYLUS NILOTICUS",
};

/* ---------- shared leg component ---------- */
function Leg({
  pivot,
  length,
  radius,
  phase,
  speed,
  amplitude,
  color,
}: {
  pivot: [number, number, number];
  length: number;
  radius: number;
  phase: number;
  speed: number;
  amplitude: number;
  color: string;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * speed + phase) * amplitude;
  });
  return (
    <group position={pivot} ref={ref}>
      <mesh position={[0, -length / 2, 0]} castShadow>
        <cylinderGeometry args={[radius, radius * 0.8, length, 8]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
    </group>
  );
}

/* ---------- Zebra ---------- */
function Zebra() {
  const texture = useMemo(() => (typeof document !== "undefined" ? zebraTexture() : null), []);
  const bodyRef = useRef<THREE.Group>(null);
  const tailRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (bodyRef.current) bodyRef.current.position.y = 0.9 + Math.sin(t * 4.5) * 0.03;
    if (tailRef.current) tailRef.current.rotation.z = Math.sin(t * 3) * 0.25;
  });

  if (!texture) return null;

  return (
    <group ref={bodyRef}>
      {/* body */}
      <mesh castShadow>
        <capsuleGeometry args={[0.42, 1.1, 4, 10]} />
        <meshStandardMaterial map={texture} roughness={0.75} />
        <group />
      </mesh>
      {/* neck + head */}
      <group position={[0.75, 0.35, 0]} rotation={[0, 0, -0.5]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.2, 0.55, 4, 8]} />
          <meshStandardMaterial map={texture} roughness={0.75} />
        </mesh>
        <mesh position={[0.35, 0.45, 0]} rotation={[0, 0, -0.3]} castShadow>
          <boxGeometry args={[0.55, 0.28, 0.26]} />
          <meshStandardMaterial map={texture} roughness={0.75} />
        </mesh>
        {/* mane */}
        {[...Array(5)].map((_, i) => (
          <mesh key={i} position={[-0.05 + i * 0.1, 0.28 + i * 0.02, 0]} castShadow>
            <boxGeometry args={[0.06, 0.14, 0.05]} />
            <meshStandardMaterial color="#141410" roughness={0.9} />
          </mesh>
        ))}
      </group>
      {/* tail */}
      <mesh ref={tailRef} position={[-0.75, 0.15, 0]} rotation={[0, 0, 0.4]} castShadow>
        <coneGeometry args={[0.05, 0.55, 6]} />
        <meshStandardMaterial color="#141410" roughness={0.85} />
      </mesh>
      {/* legs */}
      <Leg pivot={[0.45, -0.15, 0.3]} length={0.85} radius={0.09} phase={0} speed={5} amplitude={0.5} color="#ece4d3" />
      <Leg pivot={[0.45, -0.15, -0.3]} length={0.85} radius={0.09} phase={Math.PI} speed={5} amplitude={0.5} color="#ece4d3" />
      <Leg pivot={[-0.45, -0.15, 0.3]} length={0.85} radius={0.09} phase={Math.PI} speed={5} amplitude={0.5} color="#ece4d3" />
      <Leg pivot={[-0.45, -0.15, -0.3]} length={0.85} radius={0.09} phase={0} speed={5} amplitude={0.5} color="#ece4d3" />
    </group>
  );
}

/* ---------- Cheetah ---------- */
function Cheetah() {
  const texture = useMemo(() => (typeof document !== "undefined" ? cheetahTexture() : null), []);
  const bodyRef = useRef<THREE.Group>(null);
  const tailRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (bodyRef.current) {
      bodyRef.current.position.y = 0.62 + Math.abs(Math.sin(t * 9)) * 0.08;
      bodyRef.current.rotation.z = Math.sin(t * 9) * 0.04;
    }
    if (tailRef.current) tailRef.current.rotation.y = Math.sin(t * 6) * 0.35;
  });

  if (!texture) return null;

  return (
    <group ref={bodyRef}>
      <mesh castShadow>
        <capsuleGeometry args={[0.32, 1.05, 4, 10]} />
        <meshStandardMaterial map={texture} roughness={0.7} />
      </mesh>
      <group position={[0.68, 0.28, 0]} rotation={[0, 0, -0.4]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.16, 0.4, 4, 8]} />
          <meshStandardMaterial map={texture} roughness={0.7} />
        </mesh>
        <mesh position={[0.28, 0.32, 0]} castShadow>
          <boxGeometry args={[0.4, 0.22, 0.22]} />
          <meshStandardMaterial map={texture} roughness={0.7} />
        </mesh>
        {/* signature dark tear stripes */}
        <mesh position={[0.42, 0.24, 0.08]} rotation={[0, 0, 0.4]}>
          <boxGeometry args={[0.03, 0.14, 0.02]} />
          <meshStandardMaterial color="#1a140b" />
        </mesh>
        <mesh position={[0.42, 0.24, -0.08]} rotation={[0, 0, 0.4]}>
          <boxGeometry args={[0.03, 0.14, 0.02]} />
          <meshStandardMaterial color="#1a140b" />
        </mesh>
      </group>
      <group ref={tailRef} position={[-0.6, 0.1, 0]}>
        <mesh position={[-0.35, 0, 0]} rotation={[0, 0, Math.PI / 2.4]} castShadow>
          <cylinderGeometry args={[0.03, 0.06, 0.75, 6]} />
          <meshStandardMaterial map={texture} roughness={0.7} />
        </mesh>
      </group>
      <Leg pivot={[0.4, -0.1, 0.22]} length={0.78} radius={0.06} phase={0} speed={9} amplitude={0.75} color="#c9a15a" />
      <Leg pivot={[0.4, -0.1, -0.22]} length={0.78} radius={0.06} phase={Math.PI} speed={9} amplitude={0.75} color="#c9a15a" />
      <Leg pivot={[-0.4, -0.1, 0.22]} length={0.78} radius={0.06} phase={Math.PI} speed={9} amplitude={0.75} color="#c9a15a" />
      <Leg pivot={[-0.4, -0.1, -0.22]} length={0.78} radius={0.06} phase={0} speed={9} amplitude={0.75} color="#c9a15a" />
    </group>
  );
}

/* ---------- Crocodile ---------- */
function Crocodile() {
  const texture = useMemo(() => (typeof document !== "undefined" ? crocodileTexture() : null), []);
  const bodyRef = useRef<THREE.Group>(null);
  const tailRef = useRef<THREE.Group>(null);
  const jawRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (bodyRef.current) bodyRef.current.position.y = 0.28 + Math.sin(t * 1.6) * 0.015;
    if (tailRef.current) tailRef.current.rotation.y = Math.sin(t * 1.4) * 0.3;
    if (jawRef.current) jawRef.current.rotation.x = (Math.sin(t * 0.6) * 0.5 + 0.5) * 0.18 - 0.02;
  });

  if (!texture) return null;

  return (
    <group ref={bodyRef}>
      <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.32, 1.5, 4, 10]} />
        <meshStandardMaterial map={texture} roughness={0.85} />
      </mesh>
      {/* head + snout */}
      <group position={[1.0, 0.02, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.55, 0.22, 0.34]} />
          <meshStandardMaterial map={texture} roughness={0.85} />
        </mesh>
        <mesh ref={jawRef} position={[0.15, -0.08, 0]}>
          <boxGeometry args={[0.5, 0.06, 0.3]} />
          <meshStandardMaterial map={texture} roughness={0.85} />
        </mesh>
        <mesh position={[0.15, 0.14, -0.1]}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshStandardMaterial color="#d9ab3d" emissive="#b8912f" emissiveIntensity={0.4} />
        </mesh>
        <mesh position={[0.15, 0.14, 0.1]}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshStandardMaterial color="#d9ab3d" emissive="#b8912f" emissiveIntensity={0.4} />
        </mesh>
      </group>
      {/* tail */}
      <group ref={tailRef} position={[-0.95, 0, 0]}>
        <mesh position={[-0.5, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <coneGeometry args={[0.28, 1.15, 8]} />
          <meshStandardMaterial map={texture} roughness={0.85} />
        </mesh>
      </group>
      {/* sprawled short legs */}
      <Leg pivot={[0.45, -0.15, 0.32]} length={0.32} radius={0.07} phase={0} speed={2.2} amplitude={0.3} color="#3c4326" />
      <Leg pivot={[0.45, -0.15, -0.32]} length={0.32} radius={0.07} phase={Math.PI} speed={2.2} amplitude={0.3} color="#3c4326" />
      <Leg pivot={[-0.6, -0.15, 0.32]} length={0.32} radius={0.07} phase={Math.PI} speed={2.2} amplitude={0.3} color="#3c4326" />
      <Leg pivot={[-0.6, -0.15, -0.32]} length={0.32} radius={0.07} phase={0} speed={2.2} amplitude={0.3} color="#3c4326" />
    </group>
  );
}

function Rig({ species }: { species: AnimalSpecies }) {
  return (
    <>
      <ambientLight intensity={0.55} color="#cdd2d6" />
      <directionalLight position={[3, 4, 2]} intensity={1.4} color="#d9ab3d" castShadow />
      <directionalLight position={[-3, 2, -2]} intensity={0.5} color="#8b9096" />
      <group position={[0, -0.5, 0]}>
        {species === "zebra" && <Zebra />}
        {species === "cheetah" && <Cheetah />}
        {species === "crocodile" && <Crocodile />}
      </group>
    </>
  );
}

function useWebGLSupported() {
  const [supported, setSupported] = useState<boolean | null>(null);
  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl2") ||
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSupported(Boolean(gl));
    } catch {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSupported(false);
    }
  }, []);
  return supported;
}

export function AnimalScene({ species }: { species: AnimalSpecies }) {
  const webglOk = useWebGLSupported();

  if (webglOk === false) {
    // Fallback: static label only, no crash on devices without WebGL.
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-hud text-xs text-hyde-bone-dim/60 uppercase">{LABELS[species]}</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      <div className="w-full h-full max-w-md">
        <Canvas
          camera={{ position: [1.8, 1.1, 2.6], fov: 32 }}
          gl={{ alpha: true, antialias: true }}
          dpr={[1, 1.75]}
        >
          <Rig species={species} />
        </Canvas>
      </div>
      <p className="text-hud text-[10px] text-hyde-bone-dim/60 -mt-2 uppercase">
        {LABELS[species]}
      </p>
    </div>
  );
}
