import React, { useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import fotoProfil from '../assets/fotoku.jpg';

/**
 * EditorialParallaxPortrait (Option 2: Cutout / Editorial Arch with Floating 3D Lego Bricks)
 * 
 * Features:
 * - Editorial Cosmic Portal Arch: Portrait nestled inside an organic lunar capsule
 *   with soft cosmic edge feathering, deep space starlight aura, and rim-light.
 * - Multi-Plane Floating 3D Lego Bricks:
 *   - Red 2x4 Brick (Top-Right, foreground parallax)
 *   - Lego Yellow 2x2 Brick (Left shoulder, midground parallax)
 *   - Classic Space Blue 2x2 Brick (Bottom-Right, foreground parallax)
 *   - Lunar Silver/Grey 1x2 Stud Plate (Bottom-Left, deep parallax)
 * - Interactive Gyroscopic Orbit: Bricks and portrait tilt with real-time mouse inertia.
 * - Kinetic Scroll Launch (Bahan Transisi):
 *   - When scrolling into Act 2 (Builder Creed), the bricks scatter and orbit downward
 *     at varying velocities, visually cascading into the Act 2 Lego brick landscape!
 * - 100% Free of AI Slop: Zero fake serial numbers, zero '//' filler symbols.
 */

// Reusable Tactile Isometric 3D Lego Brick Component (Ultra-fast GPU Compositor)
function FloatingBrick({ type = '2x2', color = '#E3000B', style, className = '', depth = 1 }) {
  // Color shades for 3D extrusion sides
  const colors = {
    red: { top: '#E3000B', sideL: '#B30008', sideR: '#8A0005', glow: 'rgba(227,0,11,0.4)' },
    yellow: { top: '#FFD500', sideL: '#C99700', sideR: '#9E7400', glow: 'rgba(255,213,0,0.4)' },
    blue: { top: '#0055BF', sideL: '#003D8A', sideR: '#00295C', glow: 'rgba(0,85,191,0.4)' },
    grey: { top: '#64748B', sideL: '#475569', sideR: '#334155', glow: 'rgba(100,116,139,0.3)' },
  };

  const scheme = colors[color] || colors.red;

  const is2x4 = type === '2x4';
  const widthClass = is2x4 ? 'w-20 sm:w-24 h-10 sm:h-12' : 'w-12 sm:w-14 h-12 sm:h-14';
  const studCount = is2x4 ? 8 : type === '1x2' ? 2 : 4;

  return (
    <motion.div
      style={style}
      className={`absolute pointer-events-none select-none z-30 ${className}`}
    >
      <div 
        className={`relative ${widthClass} rounded-[6px] transform-gpu filter drop-shadow-[0_16px_25px_rgba(0,0,0,0.85)]`}
        style={{
          transformStyle: 'preserve-3d',
          background: scheme.top,
          boxShadow: `
            inset 0 1.5px 2px rgba(255,255,255,0.7),
            -2px 3px 0 ${scheme.sideL},
            -4px 6px 0 ${scheme.sideL},
            -6px 9px 0 ${scheme.sideR},
            -8px 12px 16px rgba(0,0,0,0.85),
            0 0 20px ${scheme.glow}
          `
        }}
      >
        {/* Authentic Raised Circular Studs */}
        <div className={`w-full h-full p-1 sm:p-1.5 grid ${is2x4 ? 'grid-cols-4 grid-rows-2' : type === '1x2' ? 'grid-cols-2' : 'grid-cols-2 grid-rows-2'} gap-1 sm:gap-1.5 place-items-center`}>
          {[...Array(studCount)].map((_, i) => (
            <div
              key={i}
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border border-black/10 relative"
              style={{
                background: `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.65) 0%, ${scheme.top} 60%, ${scheme.sideL} 100%)`,
                boxShadow: `
                  0 1.5px 2px rgba(0,0,0,0.4),
                  inset 0 1px 1px rgba(255,255,255,0.6)
                `
              }}
            >
              {/* Molded Ring Highlight */}
              <div className="absolute inset-0.5 rounded-full border border-white/20" />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function EditorialParallaxPortrait({ scrollYProgress }) {
  const containerRef = useRef(null);

  // Mouse tilt tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Buttery spring dampening
  const springX = useSpring(mouseX, { stiffness: 180, damping: 22 });
  const springY = useSpring(mouseY, { stiffness: 180, damping: 22 });

  // Portrait 3D subtle tilt
  const portraitRotateX = useTransform(springY, [-150, 150], [8, -8]);
  const portraitRotateY = useTransform(springX, [-150, 150], [-10, 10]);

  // Floating Bricks Individual Mouse Parallax (Multi-plane depths)
  const brick1X = useTransform(springX, [-150, 150], [-25, 25]);
  const brick1Y = useTransform(springY, [-150, 150], [-20, 20]);
  const brick1Rot = useTransform(springX, [-150, 150], [18, 30]);

  const brick2X = useTransform(springX, [-150, 150], [30, -30]);
  const brick2Y = useTransform(springY, [-150, 150], [25, -25]);
  const brick2Rot = useTransform(springX, [-150, 150], [-24, -12]);

  const brick3X = useTransform(springX, [-150, 150], [-35, 35]);
  const brick3Y = useTransform(springY, [-150, 150], [20, -20]);
  const brick3Rot = useTransform(springX, [-150, 150], [12, -12]);

  const brick4X = useTransform(springX, [-150, 150], [20, -20]);
  const brick4Y = useTransform(springY, [-150, 150], [-15, 15]);

  // ═════════════════════════════════════════════════════════════════════
  // KINETIC SCROLL TRANSITION (Bahan Transisi ke Act 2 - Motivasi)
  // When scrolling down, the portrait glides up and dissolves,
  // while the bricks break loose and fly downward into the Act 2 Lego void!
  // ═════════════════════════════════════════════════════════════════════
  const portraitScrollY = useTransform(scrollYProgress, [0, 0.16, 0.38], [0, 50, 190]);
  const portraitOpacity = useTransform(scrollYProgress, [0, 0.22, 0.38], [1, 0.95, 0]);
  const portraitScale = useTransform(scrollYProgress, [0, 0.16, 0.38], [1, 1.02, 0.88]);

  // Bricks scatter and tumble into the Act 2 cosmic background!
  const scrollBrick1Y = useTransform(scrollYProgress, [0, 0.36], [0, 320]);
  const scrollBrick1Rotate = useTransform(scrollYProgress, [0, 0.36], [22, 120]);

  const scrollBrick2Y = useTransform(scrollYProgress, [0, 0.36], [0, 260]);
  const scrollBrick2Rotate = useTransform(scrollYProgress, [0, 0.36], [-18, -85]);

  const scrollBrick3Y = useTransform(scrollYProgress, [0, 0.36], [0, 390]);
  const scrollBrick3Rotate = useTransform(scrollYProgress, [0, 0.36], [12, 160]);

  const scrollBrick4Y = useTransform(scrollYProgress, [0, 0.36], [0, 210]);

  // Combined spring mouse + scroll transforms (declared at top level as valid hooks)
  const combinedBrick1Y = useTransform([brick1Y, scrollBrick1Y], ([my, sy]) => my + sy);
  const combinedBrick1Rot = useTransform([brick1Rot, scrollBrick1Rotate], ([mr, sr]) => mr + sr);

  const combinedBrick2Y = useTransform([brick2Y, scrollBrick2Y], ([my, sy]) => my + sy);
  const combinedBrick2Rot = useTransform([brick2Rot, scrollBrick2Rotate], ([mr, sr]) => mr + sr);

  const combinedBrick3Y = useTransform([brick3Y, scrollBrick3Y], ([my, sy]) => my + sy);
  const combinedBrick3Rot = useTransform([brick3Rot, scrollBrick3Rotate], ([mr, sr]) => mr + sr);

  const combinedBrick4Y = useTransform([brick4Y, scrollBrick4Y], ([my, sy]) => my + sy);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-[360px] sm:max-w-[400px] flex flex-col items-center justify-center select-none py-6"
      style={{ perspective: 1200 }}
    >
      {/* ═════════════════════════════════════════════════════════════════ */}
      {/* FLOATING 3D LEGO BRICK 1: RED 2x4 (Top Right Foreground)          */}
      {/* ═════════════════════════════════════════════════════════════════ */}
      <FloatingBrick
        type="2x4"
        color="red"
        className="-top-4 -right-4 sm:-right-8"
        style={{
          x: brick1X,
          y: combinedBrick1Y,
          rotate: combinedBrick1Rot,
          rotateX: 35,
          rotateY: -20,
        }}
      />

      {/* ═════════════════════════════════════════════════════════════════ */}
      {/* FLOATING 3D LEGO BRICK 2: YELLOW 2x2 (Left Shoulder Midground)    */}
      {/* ═════════════════════════════════════════════════════════════════ */}
      <FloatingBrick
        type="2x2"
        color="yellow"
        className="top-24 -left-6 sm:-left-10"
        style={{
          x: brick2X,
          y: combinedBrick2Y,
          rotate: combinedBrick2Rot,
          rotateX: 40,
          rotateY: 25,
        }}
      />

      {/* ═════════════════════════════════════════════════════════════════ */}
      {/* FLOATING 3D LEGO BRICK 3: CLASSIC SPACE BLUE 2x2 (Bottom Right)   */}
      {/* ═════════════════════════════════════════════════════════════════ */}
      <FloatingBrick
        type="2x2"
        color="blue"
        className="-bottom-2 -right-4 sm:-right-6"
        style={{
          x: brick3X,
          y: combinedBrick3Y,
          rotate: combinedBrick3Rot,
          rotateX: 30,
          rotateY: -35,
        }}
      />

      {/* ═════════════════════════════════════════════════════════════════ */}
      {/* FLOATING 3D LEGO BRICK 4: LUNAR GREY 1x2 (Bottom Left Ground)     */}
      {/* ═════════════════════════════════════════════════════════════════ */}
      <FloatingBrick
        type="1x2"
        color="grey"
        className="bottom-16 -left-3"
        style={{
          x: brick4X,
          y: combinedBrick4Y,
          rotate: -12,
          rotateX: 25,
          rotateY: 15,
        }}
      />

      {/* ═════════════════════════════════════════════════════════════════ */}
      {/* EDITORIAL LUNAR ARCH PORTAL (The Cutout Aesthetic)                */}
      {/* ═════════════════════════════════════════════════════════════════ */}
      <motion.div
        style={{
          y: portraitScrollY,
          scale: portraitScale,
          opacity: portraitOpacity,
          rotateX: portraitRotateX,
          rotateY: portraitRotateY,
          transformStyle: 'preserve-3d',
          willChange: 'transform, opacity',
        }}
        className="relative w-[280px] sm:w-[320px] rounded-t-[140px] sm:rounded-t-[160px] rounded-b-3xl overflow-hidden p-2 sm:p-2.5 bg-gradient-to-b from-[#1b253b]/80 via-[#0a0f1d]/90 to-[#04060d] border border-white/20 shadow-[0_30px_70px_-10px_rgba(0,0,0,0.98),0_0_50px_rgba(0,85,191,0.25)] group"
      >
        {/* Glowing Rim-light Aura */}
        <div 
          className="absolute -inset-1 rounded-t-[145px] sm:rounded-t-[165px] rounded-b-3xl pointer-events-none opacity-40 group-hover:opacity-70 transition-opacity duration-500"
          style={{
            background: 'radial-gradient(circle at 50% 15%, rgba(0,240,255,0.4) 0%, rgba(0,85,191,0.2) 40%, transparent 70%)',
          }}
        />

        {/* The Arch Window Container */}
        <div className="relative w-full h-[370px] sm:h-[410px] rounded-t-[130px] sm:rounded-t-[150px] rounded-b-2xl overflow-hidden bg-[#04060c]">
          <img
            src={fotoProfil}
            alt="Aprileo Erlangga - Fullstack Developer"
            className="w-full h-full object-cover object-top filter contrast-[1.05] brightness-95 group-hover:scale-105 transition-transform duration-700 ease-out"
          />

          {/* Deep Starlight Vignette & Bottom Dissolve */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                linear-gradient(to bottom, transparent 0%, transparent 60%, rgba(4,6,12,0.92) 90%, #04060c 100%),
                radial-gradient(circle at 50% 20%, transparent 50%, rgba(4,6,12,0.45) 100%)
              `
            }}
          />

          {/* Authentic Space Starlight Glint */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-20 group-hover:opacity-35 transition-opacity duration-300"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 45%, rgba(255,213,0,0.15) 75%, transparent 100%)'
            }}
          />

          {/* Integrated Editorial Typography Inside the Arch Base */}
          <div className="absolute inset-x-0 bottom-3 px-4 flex flex-col items-center text-center z-20">
            <div 
              className="font-pixel text-white text-base sm:text-lg tracking-wider uppercase drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]"
              style={{ fontFamily: "'Arcadepix', monospace" }}
            >
              Aprileo Erlangga
            </div>
            <div className="text-[#FFD500] font-mono text-[11px] font-semibold tracking-wider uppercase mt-0.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              Fullstack Developer
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
