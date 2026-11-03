import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { LegoBrick3D, createLegoMaterial } from './Lego3DComponents';

/**
 * Single Flying 3D Lego Fragment
 */
function FlyingLegoShard({ initialData, triggerTime, material }) {
  const meshRef = useRef();

  useFrame(() => {
    if (!meshRef.current) return;
    const now = performance.now() / 1000;
    const elapsed = now - triggerTime;
    if (elapsed < 0) {
      meshRef.current.visible = false;
      return;
    }
    meshRef.current.visible = true;

    // Explosive physics with natural deceleration
    const t = Math.min(0.75, elapsed);
    const easeOut = 1 - Math.pow(1 - Math.min(1.0, t / 0.60), 2.2);

    const x = initialData.startX + initialData.vx * easeOut * 9.8;
    const y = initialData.startY + initialData.vy * easeOut * 9.8 - (elapsed * elapsed * 1.6);
    const z = initialData.startZ + initialData.vz * easeOut * 4.2;

    const rx = initialData.rotX + initialData.vRotX * elapsed;
    const ry = initialData.rotY + initialData.vRotY * elapsed;
    const rz = initialData.rotZ + initialData.vRotZ * elapsed;

    meshRef.current.position.set(x, y, z);
    meshRef.current.rotation.set(rx, ry, rz);

    // Smooth fade/shrink as they disperse to bottom and side borders
    const fade = elapsed > 0.36 ? Math.max(0, 1 - (elapsed - 0.36) / 0.24) : 1;
    meshRef.current.scale.setScalar(initialData.scale * fade);
  });

  return (
    <group ref={meshRef} position={[initialData.startX, initialData.startY, initialData.startZ]}>
      <LegoBrick3D type={initialData.type} color={initialData.color} material={material} />
    </group>
  );
}

/**
 * 3D Lego Shatter Scene
 */
function Shatter3DScene({ triggerTime }) {
  // Pre-instantiate materials once for this canvas
  const mats = useMemo(() => ({
    '#E3000B': createLegoMaterial('#E3000B'),
    '#FF3B47': createLegoMaterial('#FF3B47'),
    '#C40008': createLegoMaterial('#C40008'),
    '#FFD500': createLegoMaterial('#FFD500'),
  }), []);

  const shards = useMemo(() => {
    const list = [];
    const count = 28;
    const types = ['2x2', '1x2', '1x1', 'stud', '1x2', '1x1', 'stud'];
    const colors = ['#E3000B', '#E3000B', '#FF3B47', '#C40008', '#E3000B', '#FFD500'];

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (Math.sin(i * 3.7) * 0.22);
      const speed = 0.90 + (i % 6) * 0.18;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed * 0.75;
      const vz = (Math.sin(i * 2.1) * 0.35);

      const type = types[i % types.length];
      const color = colors[i % colors.length];
      const scale = type === '2x2' ? 0.32 : (type === '1x2' ? 0.38 : (type === '1x1' ? 0.42 : 0.46));

      list.push({
        id: i,
        type,
        color,
        scale,
        startX: (Math.sin(i * 5.2) * 0.15),
        startY: (Math.cos(i * 4.1) * 0.15),
        startZ: 0,
        vx,
        vy,
        vz,
        rotX: Math.random() * Math.PI * 2,
        rotY: Math.random() * Math.PI * 2,
        rotZ: Math.random() * Math.PI * 2,
        vRotX: (Math.random() - 0.5) * 14,
        vRotY: (Math.random() - 0.5) * 16,
        vRotZ: (Math.random() - 0.5) * 12,
      });
    }
    return list;
  }, []);

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 8, 6]} intensity={1.6} color="#ffffff" />
      <directionalLight position={[-6, 4, 3]} intensity={0.9} color="#ffd500" />
      <pointLight position={[0, 0, 4]} intensity={2.0} color="#ffffff" distance={12} />

      {shards.map(shard => (
        <FlyingLegoShard 
          key={shard.id} 
          initialData={shard} 
          triggerTime={triggerTime} 
          material={mats[shard.color] || mats['#E3000B']} 
        />
      ))}
    </>
  );
}

/**
 * LegoShatterImpact
 * Zero-jank, instant 60fps 3D Lego shatter transition:
 * - Instantaneous 100% opacity start (no sluggish fade-in)
 * - Zero glass cracks: authentic bursting 3D Lego pieces (2x2, 1x2, 1x1, studs)
 * - Disperses cleanly into borders & corners
 * - Transparent background
 */
export default function LegoShatterImpact() {
  const triggerTimeRef = useRef(performance.now() / 1000);

  return (
    <motion.div
      key="global-lego-impact-wipe"
      id="global-lego-impact-wipe"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className="fixed inset-0 z-[99999] pointer-events-none overflow-hidden select-none"
      style={{ background: 'transparent' }}
    >
      {/* Subtle Central Energetic Flash */}
      <motion.div 
        initial={{ scale: 0.4, opacity: 0.9 }}
        animate={{ scale: 3.2, opacity: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-red-500/30 blur-3xl pointer-events-none"
      />

      {/* 3D Bursting Lego Bricks */}
      <div className="absolute inset-0 pointer-events-none">
        <Canvas
          camera={{ position: [0, 0, 7.5], fov: 45 }}
          gl={{
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance'
          }}
          className="w-full h-full pointer-events-none"
        >
          <Shatter3DScene triggerTime={triggerTimeRef.current} />
        </Canvas>
      </div>
    </motion.div>
  );
}
