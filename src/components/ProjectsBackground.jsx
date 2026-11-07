import React, { useMemo, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { LegoBrick3D, createLegoMaterial } from './Lego3DComponents';

/**
 * OrbitalShipyard3DScene
 * Concept: "Orbital Spacecraft Assembly Dock & Telemetry Relay"
 * 
 * - Harmonized with About's True 3D WebGL LEGO universe.
 * - Distinct Concept: While About is "Planetary Impact & Battlement Towers",
 *   Projects is "Orbital Shipyard / Space Station Assembly Dock" (where Master Builder sets are engineered).
 * - Symmetrical orbital construction pylons & satellite beacons placed in deep 3D space (z < -3).
 * - Leaves the foreground 100% open and unobstructed for the parallax project cards.
 * - High-efficiency single-loop kinematics with frame-rate independent dampening for 120 FPS.
 */
function OrbitalShipyard3DScene({ scrollProgressRef, mats }) {
  const { viewport } = useThree();
  const meshRefs = useRef([]);
  const satelliteRef = useRef();
  const smoothProgress = useRef(0);

  const isMobile = viewport.width < 9.5;
  const colScale = isMobile ? 0.38 : 0.58;

  // Responsive flank distance to keep center clear for project cards
  const gx = useMemo(() => {
    if (viewport.width < 8.0) {
      return viewport.width * 0.44;
    }
    return Math.max(5.8, Math.min(8.6, viewport.width * 0.40));
  }, [viewport.width]);

  // Exact brick height in world units
  const H = 0.96 * colScale;

  // ══════════════════════════════════════════════════════════════════════════
  // ORBITAL SHIPYARD GEOMETRY (14 Master Builder Modular Pieces)
  // ══════════════════════════════════════════════════════════════════════════
  const shipyardBricks = useMemo(() => {
    const list = [];

    // ── LEFT SHIPYARD GANTRY (6 Pieces) ───────────────────────────────────
    // Pylon Outer
    list.push({
      id: 1, type: '2x4', color: '#0055BF',
      posHero: [-gx - 1.8, 3.2, -4.5], rotHero: [0.15, 0.4, 0.2],
      posMid: [-gx - 1.2, 0.5, -3.5], rotMid: [0.05, 0.2, 0.05],
      posDock: [-gx - 1.0, -2.5, -2.5], rotDock: [0, 0, 0]
    });
    list.push({
      id: 2, type: '2x2', color: '#FFD500',
      posHero: [-gx - 0.8, 2.0, -3.8], rotHero: [-0.2, -0.3, 0.1],
      posMid: [-gx - 0.6, -0.8, -3.0], rotMid: [0, 0, 0],
      posDock: [-gx - 1.0, -2.5 + H, -2.5], rotDock: [0, 0, 0]
    });
    list.push({
      id: 3, type: '1x2', color: '#E3000B',
      posHero: [-gx - 2.2, 0.8, -5.0], rotHero: [0.3, 0.1, -0.2],
      posMid: [-gx - 1.6, -1.8, -4.0], rotMid: [0.1, 0.1, 0],
      posDock: [-gx - 1.0, -2.5 + 2 * H, -2.5], rotDock: [0, 0, 0]
    });
    list.push({
      id: 4, type: 'stud', color: '#FFD500',
      posHero: [-gx - 1.0, 4.2, -4.0], rotHero: [0, 0, 0],
      posMid: [-gx - 0.8, 2.2, -3.2], rotMid: [0, 0, 0],
      posDock: [-gx - 1.0, -2.5 + 2 * H + 0.5 * colScale, -2.5], rotDock: [0, 0, 0]
    });
    // Pylon Inner Strut
    list.push({
      id: 5, type: '2x2', color: '#8A929A',
      posHero: [-gx - 0.2, -1.5, -4.2], rotHero: [0.1, -0.2, 0.15],
      posMid: [-gx + 0.4, -2.8, -3.6], rotMid: [0, 0, 0],
      posDock: [-gx + 0.4, -2.5, -2.5], rotDock: [0, 0, 0]
    });
    list.push({
      id: 6, type: '2x4', color: '#0055BF',
      posHero: [-gx - 1.5, -3.2, -5.5], rotHero: [-0.1, 0.3, -0.1],
      posMid: [-gx - 0.5, -3.8, -4.5], rotMid: [0, 0, 0],
      posDock: [-gx + 0.4, -2.5 + H, -2.5], rotDock: [0, 0, 0]
    });

    // ── RIGHT SHIPYARD GANTRY (6 Pieces - Symmetrical Orbit) ───────────────
    // Pylon Outer
    list.push({
      id: 7, type: '2x4', color: '#0055BF',
      posHero: [gx + 1.8, 3.2, -4.5], rotHero: [0.15, -0.4, -0.2],
      posMid: [gx + 1.2, 0.5, -3.5], rotMid: [0.05, -0.2, -0.05],
      posDock: [gx + 1.0, -2.5, -2.5], rotDock: [0, 0, 0]
    });
    list.push({
      id: 8, type: '2x2', color: '#FFD500',
      posHero: [gx + 0.8, 2.0, -3.8], rotHero: [-0.2, 0.3, -0.1],
      posMid: [gx + 0.6, -0.8, -3.0], rotMid: [0, 0, 0],
      posDock: [gx + 1.0, -2.5 + H, -2.5], rotDock: [0, 0, 0]
    });
    list.push({
      id: 9, type: '1x2', color: '#E3000B',
      posHero: [gx + 2.2, 0.8, -5.0], rotHero: [0.3, -0.1, 0.2],
      posMid: [gx + 1.6, -1.8, -4.0], rotMid: [0.1, -0.1, 0],
      posDock: [gx + 1.0, -2.5 + 2 * H, -2.5], rotDock: [0, 0, 0]
    });
    list.push({
      id: 10, type: 'stud', color: '#FFD500',
      posHero: [gx + 1.0, 4.2, -4.0], rotHero: [0, 0, 0],
      posMid: [gx + 0.8, 2.2, -3.2], rotMid: [0, 0, 0],
      posDock: [gx + 1.0, -2.5 + 2 * H + 0.5 * colScale, -2.5], rotDock: [0, 0, 0]
    });
    // Pylon Inner Strut
    list.push({
      id: 11, type: '2x2', color: '#8A929A',
      posHero: [gx + 0.2, -1.5, -4.2], rotHero: [0.1, 0.2, -0.15],
      posMid: [gx - 0.4, -2.8, -3.6], rotMid: [0, 0, 0],
      posDock: [gx - 0.4, -2.5, -2.5], rotDock: [0, 0, 0]
    });
    list.push({
      id: 12, type: '2x4', color: '#0055BF',
      posHero: [gx + 1.5, -3.2, -5.5], rotHero: [-0.1, -0.3, 0.1],
      posMid: [gx + 0.5, -3.8, -4.5], rotMid: [0, 0, 0],
      posDock: [gx - 0.4, -2.5 + H, -2.5], rotDock: [0, 0, 0]
    });

    // ── DEEP ORBITAL PROBES / RELAY MODULES (2 Pieces) ────────────────────
    list.push({
      id: 13, type: '2x2', color: '#E3000B',
      posHero: [-1.5, 4.8, -8.0], rotHero: [0.4, 0.5, 0.2],
      posMid: [-2.0, 3.5, -7.0], rotMid: [0.2, 0.8, 0.1],
      posDock: [-2.2, 2.8, -6.5], rotDock: [0.1, 1.2, 0]
    });
    list.push({
      id: 14, type: '2x2', color: '#FFD500',
      posHero: [2.0, 4.2, -8.5], rotHero: [-0.3, -0.4, 0.3],
      posMid: [2.5, 3.2, -7.5], rotMid: [-0.1, -0.7, 0.2],
      posDock: [2.4, 2.6, -7.0], rotDock: [0, -1.1, 0.1]
    });

    return list;
  }, [gx, H, colScale]);

  const getMat = (col) => {
    if (col === '#FFD500') return mats.yellow;
    if (col === '#0055BF') return mats.blue;
    if (col === '#8A929A') return mats.grey;
    return mats.red;
  };

  useFrame((state, delta) => {
    const targetScrollP = scrollProgressRef.current || 0;
    smoothProgress.current = THREE.MathUtils.damp(
      smoothProgress.current,
      targetScrollP,
      12,
      Math.min(delta, 0.1)
    );
    const scrollP = smoothProgress.current;
    const time = state.clock.getElapsedTime();

    // 3 Scroll Phases:
    // Phase 1 -> Phase 2 (Mid Parallax): 0.10 to 0.55
    // Phase 2 -> Phase 3 (Docking Gate Assembly): 0.55 to 0.90
    let u1 = THREE.MathUtils.clamp((scrollP - 0.05) / 0.45, 0, 1);
    let u2 = THREE.MathUtils.clamp((scrollP - 0.50) / 0.40, 0, 1);
    const ease1 = u1 * u1 * (3 - 2 * u1);
    const ease2 = u2 * u2 * (3 - 2 * u2);

    // Subtle micro-gravity zero-g float
    for (let i = 0; i < shipyardBricks.length; i++) {
      const mesh = meshRefs.current[i];
      if (!mesh) continue;
      const b = shipyardBricks[i];

      // Blend positions: Hero -> Mid -> Dock
      const x1 = THREE.MathUtils.lerp(b.posHero[0], b.posMid[0], ease1);
      const y1 = THREE.MathUtils.lerp(b.posHero[1], b.posMid[1], ease1);
      const z1 = THREE.MathUtils.lerp(b.posHero[2], b.posMid[2], ease1);

      const targetX = THREE.MathUtils.lerp(x1, b.posDock[0], ease2);
      const targetY = THREE.MathUtils.lerp(y1, b.posDock[1], ease2);
      const targetZ = THREE.MathUtils.lerp(z1, b.posDock[2], ease2);

      // Rotations
      const rx1 = THREE.MathUtils.lerp(b.rotHero[0], b.rotMid[0], ease1);
      const ry1 = THREE.MathUtils.lerp(b.rotHero[1], b.rotMid[1], ease1);
      const rz1 = THREE.MathUtils.lerp(b.rotHero[2], b.rotMid[2], ease1);

      const targetRx = THREE.MathUtils.lerp(rx1, b.rotDock[0], ease2);
      const targetRy = THREE.MathUtils.lerp(ry1, b.rotDock[1], ease2);
      const targetRz = THREE.MathUtils.lerp(rz1, b.rotDock[2], ease2);

      // Micro-gravity floating wave
      const floatY = Math.sin(time * 1.2 + b.id * 0.8) * 0.08 * (1 - ease2 * 0.7);
      const floatRotY = Math.cos(time * 0.8 + b.id * 0.5) * 0.04 * (1 - ease2 * 0.7);

      mesh.position.set(targetX, targetY + floatY, targetZ);
      mesh.rotation.set(targetRx, targetRy + floatRotY, targetRz);
    }

    // Satellite continuous orbital spin in deep space
    if (satelliteRef.current) {
      satelliteRef.current.rotation.y = time * 0.25;
      satelliteRef.current.rotation.x = Math.sin(time * 0.15) * 0.1;
      satelliteRef.current.position.y = 3.6 + Math.sin(time * 0.5) * 0.2 - scrollP * 2.0;
    }
  });

  return (
    <group>
      {/* 14 Modular Shipyard LEGO Bricks */}
      {shipyardBricks.map((b, idx) => (
        <group
          key={b.id}
          ref={(el) => (meshRefs.current[idx] = el)}
          position={b.posHero}
          scale={colScale}
        >
          <LegoBrick3D type={b.type} color={b.color} material={getMat(b.color)} />
        </group>
      ))}

      {/* Deep Space Satellite Array Relay (z = -11) */}
      <group ref={satelliteRef} position={[0, 3.6, -11]} scale={colScale * 1.1}>
        {/* Core Antenna Hub */}
        <LegoBrick3D type="2x2" color="#0055BF" material={mats.blue} />
        <group position={[0, 0.7, 0]}>
          <LegoBrick3D type="stud" color="#FFD500" material={mats.yellow} />
        </group>
        {/* Left Solar Wing */}
        <group position={[-1.8, 0, 0]} rotation={[0, 0, 0.15]}>
          <LegoBrick3D type="1x2" color="#8A929A" material={mats.grey} />
        </group>
        {/* Right Solar Wing */}
        <group position={[1.8, 0, 0]} rotation={[0, 0, -0.15]}>
          <LegoBrick3D type="1x2" color="#8A929A" material={mats.grey} />
        </group>
      </group>
    </group>
  );
}

/**
 * 3D Scene with Space Lighting & Dynamic Reactor Core
 */
function Projects3DScene({ scrollProgressRef }) {
  const mats = useMemo(
    () => ({
      red: createLegoMaterial('#E3000B'),
      yellow: createLegoMaterial('#FFD500'),
      blue: createLegoMaterial('#0055BF'),
      grey: createLegoMaterial('#8A929A'),
    }),
    []
  );

  const cyanLaserRef = useRef();
  const solarAmberRef = useRef();

  useFrame(() => {
    const scrollP = scrollProgressRef.current || 0;
    // Cyan shipyard telemetry light peaks around scroll 0.20 to 0.60
    if (cyanLaserRef.current) {
      const cyanFactor = Math.sin(
        THREE.MathUtils.clamp((scrollP - 0.1) / 0.7, 0, 1) * Math.PI
      );
      cyanLaserRef.current.intensity = 1.0 + cyanFactor * 2.2;
    }
    // Solar amber reactor core light peaks toward footer and bottom
    if (solarAmberRef.current) {
      const amberFactor = THREE.MathUtils.clamp((scrollP - 0.3) / 0.65, 0, 1);
      solarAmberRef.current.intensity = 0.8 + amberFactor * 2.0;
    }
  });

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[10, 16, 8]} intensity={1.8} color="#ffffff" />
      <pointLight
        ref={cyanLaserRef}
        position={[-7, 2, -2]}
        intensity={1.2}
        color="#00F0FF"
        distance={24}
      />
      <pointLight
        ref={solarAmberRef}
        position={[7, -2, -2]}
        intensity={1.0}
        color="#FFD500"
        distance={24}
      />
      <directionalLight position={[0, -8, -4]} intensity={0.5} color="#0055BF" />

      <OrbitalShipyard3DScene
        scrollProgressRef={scrollProgressRef}
        mats={mats}
      />
    </>
  );
}

/**
 * ProjectsBackground
 * True 3D WebGL Background for Projects:
 * - Matching the quality and universe of AboutShatteredBackground.
 * - Distinct Concept: "Orbital Shipyard & Deep Space Assembly Matrix".
 * - Authentic 3D LEGO geometry floating in zero-g microgravity behind the parallax cards.
 * - Zero collision with project cards (placed deep in Z-axis and on flanks).
 */
export default function ProjectsBackground() {
  const scrollProgressRef = useRef(0);

  useEffect(() => {
    let ticking = false;

    const updateScroll = () => {
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      scrollProgressRef.current = Math.min(
        1.0,
        Math.max(0.0, window.scrollY / maxScroll)
      );
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    window.addEventListener('resize', handleScroll, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    updateScroll();

    return () => {
      window.removeEventListener('resize', handleScroll);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none">
      
      {/* Deep Space Background Gradients (Same Universe as About) */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle 900px at 80% 20%, rgba(0, 85, 191, 0.28) 0%, transparent 70%),
            radial-gradient(circle 800px at 15% 40%, rgba(0, 240, 255, 0.15) 0%, transparent 65%),
            radial-gradient(ellipse 1100px 600px at 50% 85%, rgba(255, 213, 0, 0.16) 0%, rgba(0, 85, 191, 0.20) 40%, transparent 75%),
            #060a17
          `
        }}
      />

      {/* Shared Classic Space Starfield */}
      <div 
        className="absolute inset-0 opacity-55 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(1px 1px at 30px 45px, #ffffff, rgba(0,0,0,0)),
            radial-gradient(1.5px 1.5px at 140px 95px, #ffffff, rgba(0,0,0,0)),
            radial-gradient(1px 1px at 260px 210px, #ffd500, rgba(0,0,0,0)),
            radial-gradient(2px 2px at 420px 140px, #00f0ff, rgba(0,0,0,0)),
            radial-gradient(1px 1px at 530px 340px, #ffffff, rgba(0,0,0,0)),
            radial-gradient(1.5px 1.5px at 670px 240px, #ffffff, rgba(0,0,0,0)),
            radial-gradient(1px 1px at 810px 110px, #ffd500, rgba(0,0,0,0)),
            radial-gradient(2px 2px at 940px 290px, #ffffff, rgba(0,0,0,0)),
            radial-gradient(1px 1px at 1080px 170px, #00f0ff, rgba(0,0,0,0)),
            radial-gradient(1.5px 1.5px at 1220px 350px, #ffffff, rgba(0,0,0,0)),
            radial-gradient(1.5px 1.5px at 1380px 85px, #ffd500, rgba(0,0,0,0))
          `,
          backgroundSize: '1440px 450px'
        }}
      />

      {/* Cyber Launchpad Blueprint Perspective Floor Grid */}
      <div 
        className="absolute inset-x-0 bottom-0 h-[440px] pointer-events-none opacity-25 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 240, 255, 0.4) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 213, 0, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
          maskImage: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
          transform: 'perspective(600px) rotateX(60deg)',
          transformOrigin: 'bottom center',
        }}
      />

      {/* Corner Atmospheric Glow Layers (Same as About) */}
      <div 
        className="absolute top-0 right-0 w-[500px] h-[400px] rounded-full pointer-events-none opacity-20"
        style={{ 
          background: 'radial-gradient(circle, #0055BF 0%, transparent 70%)',
          transform: 'translateZ(0)',
        }}
      />
      <div 
        className="absolute bottom-0 left-0 w-[460px] h-[380px] rounded-full pointer-events-none opacity-20"
        style={{ 
          background: 'radial-gradient(circle, #FFD500 0%, transparent 70%)',
          transform: 'translateZ(0)',
        }}
      />

      {/* True 3D WebGL Canvas for Orbital Shipyard */}
      <Canvas
        camera={{ position: [0, 0, 11.8], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
        }}
        className="w-full h-full pointer-events-none"
      >
        <Projects3DScene scrollProgressRef={scrollProgressRef} />
      </Canvas>
    </div>
  );
}
