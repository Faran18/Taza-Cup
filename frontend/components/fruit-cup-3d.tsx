"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";

function CupImage() {
  const cupRef = useRef<THREE.Mesh>(null);
  const [active, setActive] = useState(false);

  useFrame((_, delta) => {
    if (active && cupRef.current) {
      cupRef.current.rotation.y += delta * 1.5;
    }
  });

  return (
    <mesh
      ref={cupRef}
      onPointerEnter={() => setActive(true)}
      onPointerLeave={() => setActive(false)}
      onPointerDown={() => setActive(true)}
      onPointerUp={() => setActive(false)}
      onPointerCancel={() => setActive(false)}
    >
      <planeGeometry args={[2.4, 3]} />

      <meshBasicMaterial
        map={new THREE.TextureLoader().load("/taza-cup.png")}
        transparent
      />
    </mesh>
  );
}

export default function FruitCup3D() {
  return (
    <div
      style={{
        width: "100%",
        height: "520px",
        touchAction: "none",
      }}
    >
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={1} />

        <CupImage />
      </Canvas>
    </div>
  );
}