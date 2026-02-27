'use client';

import { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';

function StableBackground() {
  return (
    <Stars
      radius={50}
      depth={50}
      count={3000}
      factor={3}
      saturation={0}
      fade
      speed={0.3}
    />
  );
}

export default function ParticleBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (typeof window === 'undefined' || !mounted) {
    return null;
  }

  return (
    <div className="absolute inset-0 -z-10">
      <Suspense fallback={null}>
        <Canvas camera={{ position: [0, 0, 1.5], fov: 75 }}>
          <StableBackground />
        </Canvas>
      </Suspense>
    </div>
  );
}
