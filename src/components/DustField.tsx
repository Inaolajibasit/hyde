"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";

function Motes() {
  const ref = useRef<THREE.Points>(null);
  const count = 300;

  // Generated once on mount (not during render) so Math.random() never runs
  // inside the render body.
  const [positions] = useState<Float32Array>(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 22;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    return arr;
  });

  // Cheap: a single rotation on the whole point cloud, handled by the GPU
  // via the object's matrix. No per-particle CPU loop, no buffer re-upload
  // every frame — that was the old (avoidable) cost here.
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.012;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.03;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        color="#b8912f"
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

export function DustField() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{ alpha: true, antialias: false, powerPreference: "low-power" }}
        dpr={[1, 1.25]}
      >
        <Motes />
      </Canvas>
    </div>
  );
}
