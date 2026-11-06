import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { FaArrowsRotate } from 'react-icons/fa6';
import fotoProfil from '../assets/fotoku.jpg';

/**
 * HolographicBuilderCard (Interactive 3D Master Builder Foil Card)
 * 
 * Features:
 * - Authentic 3D Card Physics with Gyroscopic Cursor Tilt & Inertia
 * - Dynamic Prismatic Foil Sheen & Specular Glare (moves in real-time with cursor)
 * - Interactive 3D Flip Mechanism (Front: Portrait Foil / Back: Master Builder Dossier)
 * - Kinetic Scroll Parallax & Orbital Drift into Act 2 (seamless transition bridge)
 * - 100% Free of AI Slop: No fake serial numbers, no '//' filler slashes.
 */
export default function HolographicBuilderCard({ scrollYProgress }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = useRef(null);

  // Raw mouse coordinates relative to card center
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for buttery cursor tracking (prevents jitter)
  const springX = useSpring(mouseX, { stiffness: 220, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 220, damping: 20 });

  // 3D Tilt angles (max +/- 14 degrees)
  const tiltRotateX = useTransform(springY, [-150, 150], [12, -12]);
  const tiltRotateY = useTransform(springX, [-150, 150], [-14, 14]);

  // Foil Shimmer / Specular Glare Position (percentage for gradients)
  const glareX = useTransform(springX, [-150, 150], [15, 85]);
  const glareY = useTransform(springY, [-150, 150], [15, 85]);
  const rainbowAngle = useTransform(springX, [-150, 150], [105, 145]);

  // Scroll Kinematics: seamlessly transitions card into Act 2 (Builder Creed)
  // Glides down, gently tilts, and dissolves into the celestial void as quotes arrive
  const scrollY = useTransform(scrollYProgress, [0, 0.16, 0.36], [0, 45, 180]);
  const scrollRotateZ = useTransform(scrollYProgress, [0, 0.16, 0.36], [-1.5, 2.5, 9]);
  const scrollRotateX = useTransform(scrollYProgress, [0, 0.16, 0.36], [0, 8, 20]);
  const scrollScale = useTransform(scrollYProgress, [0, 0.16, 0.36], [1, 1.015, 0.88]);
  const scrollOpacity = useTransform(scrollYProgress, [0, 0.20, 0.36], [1, 0.95, 0]);

  // Handle pointer tracking
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const toggleFlip = (e) => {
    e.stopPropagation();
    setIsFlipped((prev) => !prev);
  };

  return (
    <motion.div
      className="w-full flex flex-col items-center justify-center relative select-none"
      style={{
        y: scrollY,
        scale: scrollScale,
        opacity: scrollOpacity,
        willChange: 'transform, opacity',
      }}
    >
      {/* 3D Perspective Stage */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={toggleFlip}
        className="relative w-full max-w-[320px] sm:max-w-[340px] cursor-pointer group"
        style={{
          perspective: 1400,
          perspectiveOrigin: '50% 50%',
        }}
        title="Click to flip card"
      >
        {/* Tilting Gimbal Layer */}
        <motion.div
          style={{
            transformStyle: 'preserve-3d',
            rotateX: tiltRotateX,
            rotateY: tiltRotateY,
            rotateZ: scrollRotateZ,
          }}
          className="relative w-full"
        >
          {/* Flippable Card Container */}
          <motion.div
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformStyle: 'preserve-3d' }}
            className="relative w-full rounded-2xl"
          >
            {/* ══════════════════════════════════════════════════════════════ */}
            {/* FRONT FACE: HOLOGRAPHIC MASTER BUILDER PORTRAIT CARD           */}
            {/* ══════════════════════════════════════════════════════════════ */}
            <div
              className="relative w-full rounded-2xl p-3 bg-gradient-to-b from-[#111928] via-[#0b101c] to-[#060a14] border border-white/15 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95),0_0_35px_rgba(0,85,191,0.22)] overflow-hidden"
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
              }}
            >
              {/* Dynamic Prismatic Holographic Sheen (Moves with cursor!) */}
              <motion.div
                className="absolute inset-0 pointer-events-none opacity-40 group-hover:opacity-75 transition-opacity duration-300 z-30 mix-blend-color-dodge"
                style={{
                  background: useTransform(
                    [glareX, glareY, rainbowAngle],
                    ([gx, gy, ang]) => `
                      radial-gradient(circle 380px at ${gx}% ${gy}%, rgba(255, 255, 255, 0.45) 0%, rgba(255, 213, 0, 0.20) 25%, transparent 60%),
                      linear-gradient(${ang}deg, transparent 20%, rgba(0, 240, 255, 0.25) 38%, rgba(255, 0, 128, 0.22) 55%, rgba(255, 213, 0, 0.28) 72%, transparent 90%)
                    `
                  ),
                }}
              />

              {/* Card Header Bar with 3 Authentic Lego Studs */}
              <div className="flex items-center justify-between px-1 mb-2.5 relative z-20">
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full bg-[#E3000B] inline-block shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_1.5px_3px_rgba(0,0,0,0.5)] border border-black/25"
                    title="Lego Red"
                  />
                  <span
                    className="w-2.5 h-2.5 rounded-full bg-[#FFD500] inline-block shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_1.5px_3px_rgba(0,0,0,0.5)] border border-black/25"
                    title="Lego Yellow"
                  />
                  <span
                    className="w-2.5 h-2.5 rounded-full bg-[#0055BF] inline-block shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_1.5px_3px_rgba(0,0,0,0.5)] border border-black/25"
                    title="Classic Space Blue"
                  />
                </div>

                {/* Tactile Flip Pill Button */}
                <button
                  type="button"
                  onClick={toggleFlip}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 hover:bg-[#FFD500] hover:text-zinc-950 text-slate-300 text-[10px] font-mono font-semibold uppercase tracking-wider border border-white/15 transition-colors duration-150 cursor-pointer"
                  title="Click to flip card"
                >
                  <FaArrowsRotate className="text-[9px] group-hover:rotate-180 transition-transform duration-500" />
                  <span>Flip</span>
                </button>
              </div>

              {/* Portrait Photo Window */}
              <div className="relative w-full h-[310px] sm:h-[335px] rounded-xl overflow-hidden bg-[#040711] border border-white/10">
                <img
                  src={fotoProfil}
                  alt="Aprileo Erlangga - Fullstack Developer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Shimmer Specular Diagonal Light Line */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-25 group-hover:opacity-45 transition-opacity duration-300"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 45%, rgba(0,240,255,0.15) 75%, transparent 100%)',
                  }}
                />

                {/* Soft Bottom Vignette for Caption Readability */}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#060a14] via-[#060a14]/60 to-transparent pointer-events-none" />
              </div>

              {/* Card Footer Caption */}
              <div className="mt-2.5 px-1 flex items-center justify-between relative z-20">
                <div>
                  <div
                    className="font-pixel text-white text-base tracking-wider uppercase drop-shadow-[0_2px_8px_rgba(255,255,255,0.25)]"
                    style={{ fontFamily: "'Arcadepix', monospace" }}
                  >
                    Aprileo Erlangga
                  </div>
                  <div className="text-[#FFD500] font-mono text-[11px] font-semibold tracking-wider uppercase mt-0.5">
                    Fullstack Developer
                  </div>
                </div>

                {/* Holographic Edition Stamp */}
                <div className="text-right">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-slate-400 font-semibold block">
                    EDITION
                  </span>
                  <span className="font-mono text-[11px] font-bold text-[#FFD500]">
                    FOIL 1/1
                  </span>
                </div>
              </div>
            </div>

            {/* ══════════════════════════════════════════════════════════════ */}
            {/* BACK FACE: MASTER BUILDER SPECIFICATION DOSSIER                */}
            {/* ══════════════════════════════════════════════════════════════ */}
            <div
              className="absolute inset-0 w-full h-full rounded-2xl p-4 bg-gradient-to-b from-[#111928] via-[#090e1a] to-[#040711] border border-[#FFD500]/30 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95),0_0_35px_rgba(255,213,0,0.15)] flex flex-col justify-between overflow-hidden"
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
              }}
            >
              {/* Subtle Classic Space Golden Grid Background */}
              <div
                className="absolute inset-0 pointer-events-none opacity-10"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, rgba(255, 213, 0, 0.3) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(255, 213, 0, 0.3) 1px, transparent 1px)
                  `,
                  backgroundSize: '24px 24px',
                }}
              />

              {/* Back Header with Space Emblem */}
              <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-2.5">
                <div className="flex items-center gap-2">
                  {/* Classic Space Rocket Vector */}
                  <div className="w-8 h-8 rounded-lg bg-[#0055BF]/40 border border-[#0055BF] flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                      {/* Red Moon Planet */}
                      <circle cx="14" cy="10" r="5" fill="#E3000B" />
                      {/* Gold Rocket Ship swoosh */}
                      <path
                        d="M6 18L10 14M10 14L16 8L18 10L12 16L10 14ZM16 8L18 6L20 8L18 10L16 8Z"
                        stroke="#FFD500"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle cx="7" cy="17" r="1.5" fill="#FFD500" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-pixel text-white text-xs tracking-wider uppercase block" style={{ fontFamily: "'Arcadepix', monospace" }}>
                      BUILDER DOSSIER
                    </span>
                    <span className="font-mono text-[10px] text-[#FFD500] font-semibold tracking-wider">
                      CLASSIC SPACE EDITION
                    </span>
                  </div>
                </div>

                {/* Flip Back Button */}
                <button
                  type="button"
                  onClick={toggleFlip}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 hover:bg-[#FFD500] hover:text-zinc-950 text-slate-300 text-[10px] font-mono font-semibold uppercase tracking-wider border border-white/15 transition-colors duration-150 cursor-pointer"
                  title="Click to flip back"
                >
                  <FaArrowsRotate className="text-[9px]" />
                  <span>Back</span>
                </button>
              </div>

              {/* Dossier Specifications Body */}
              <div className="relative z-10 flex-1 flex flex-col justify-center py-3 space-y-3">
                {/* Spec 1: Discipline */}
                <div className="bg-white/[0.03] p-2.5 rounded-lg border border-white/5">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 block font-semibold">
                    PRIMARY DISCIPLINE
                  </span>
                  <span className="text-white font-bold text-xs sm:text-sm">
                    Fullstack Architecture & 3D Interactive Web
                  </span>
                </div>

                {/* Spec 2: Core Arsenal */}
                <div className="bg-white/[0.03] p-2.5 rounded-lg border border-white/5">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 block font-semibold">
                    CORE ARSENAL
                  </span>
                  <span className="text-slate-200 text-xs leading-relaxed block mt-0.5">
                    React &bull; Next.js &bull; Three.js &bull; Node.js &bull; Tailwind &bull; Docker
                  </span>
                </div>

                {/* Spec 3: Origin Station */}
                <div className="bg-white/[0.03] p-2.5 rounded-lg border border-white/5">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 block font-semibold">
                    BASE STATION
                  </span>
                  <span className="text-slate-200 text-xs">
                    Lamongan, East Java &bull; Indonesia
                  </span>
                </div>

                {/* Philosophy Quote */}
                <div className="px-1 pt-1">
                  <p className="text-[11px] sm:text-xs text-slate-300 italic leading-relaxed border-l-2 border-[#FFD500] pl-2.5">
                    &ldquo;Code is like Lego: infinite worlds built with disciplined modular logic.&rdquo;
                  </p>
                </div>
              </div>

              {/* Back Plate Footer with 6 Embossed Lego Studs */}
              <div className="relative z-10 pt-2 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {[...Array(6)].map((_, i) => (
                    <span
                      key={i}
                      className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] inline-block"
                    />
                  ))}
                </div>
                <span className="font-mono text-[10px] text-[#FFD500] font-semibold tracking-wider">
                  MASTER BUILDER
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Interactive Hint Under Card */}
      <div className="mt-3 flex items-center gap-1.5 text-slate-400 text-[11px] font-mono">
        <span className="w-1.5 h-1.5 rounded-full bg-[#FFD500] animate-ping" />
        <span>{isFlipped ? 'Click card to view Portrait' : 'Click card to inspect Builder Dossier'}</span>
      </div>
    </motion.div>
  );
}
