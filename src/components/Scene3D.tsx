"use client";

import { Canvas } from "@react-three/fiber";
import { Float, OrbitControls, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import { Suspense } from "react";

function Gem() {
  return (
    <Float speed={1.4} rotationIntensity={1.1} floatIntensity={1.6}>
      <mesh castShadow>
        <torusKnotGeometry args={[1, 0.34, 220, 32]} />
        <MeshDistortMaterial
          color="#d4af37"
          metalness={0.9}
          roughness={0.15}
          distort={0.28}
          speed={1.6}
          emissive="#3a2c00"
          emissiveIntensity={0.4}
        />
      </mesh>
    </Float>
  );
}

// Lightweight, self-contained 3D scene (no external HDRI fetch) — a rotating
// distorted gold knot that reads as the brand's "glitched" signature object.
export default function Scene3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true }}
      className="!absolute inset-0"
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={2.2} color="#fff4d6" />
        <pointLight position={[-5, -3, -4]} intensity={1.4} color="#d4af37" />
        <Gem />
        <Sparkles count={60} scale={7} size={2} speed={0.4} color="#e8c766" opacity={0.6} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.8}
          rotateSpeed={0.5}
        />
      </Suspense>
    </Canvas>
  );
}
