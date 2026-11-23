import React from 'react';
import { motion } from 'framer-motion';

/**
 * HomeBackground — Authentic Classic Space Deep Orbital Void + Lunar Crater Horizon
 * 
 * Inspired directly by the official retro LEGO Classic Space (1978-1985) packaging 
 * and crater baseplate (Part #3947):
 * - ZERO AI-Slop Blurry Gradients or Synthetic Color Blobs.
 * - Deep, solid midnight obsidian space void (#060814) with pure cosmic clarity.
 * - Multi-depth authentic crisp pinpoint starlight field (white, solar gold, cyan).
 * - Option 2: Crisp vector lunar crater topography anchoring the bottom of the viewport.
 * - 100% clean landscape — zero text clutter, zero artificial glow.
 */
export default function HomeBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none">
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* 1. DEEP RETRO-SPACE OBSIDIAN CANVAS                                    */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          background: 'linear-gradient(180deg, #060814 0%, #070a18 50%, #050711 100%)',
        }}
      />

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* 2. CRISP MULTI-DEPTH STARFIELD (AUTHENTIC CLASSIC SPACE STARDUST)       */}
      {/* Razor-sharp pinpoint stars matching classic 1980s space box artwork    */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* Layer 1: Distant Deep-Space Micro Stars (0.8px - 1px) */}
      <div 
        className="absolute inset-0 z-0 opacity-70"
        style={{
          backgroundImage: `
            radial-gradient(1px 1px at 28px 45px, #ffffff, transparent),
            radial-gradient(1px 1px at 145px 95px, #ffffff, transparent),
            radial-gradient(1px 1px at 280px 210px, #fef08a, transparent),
            radial-gradient(1px 1px at 390px 85px, #ffffff, transparent),
            radial-gradient(1px 1px at 520px 310px, #ffffff, transparent),
            radial-gradient(1px 1px at 660px 170px, #ffffff, transparent),
            radial-gradient(1px 1px at 780px 65px, #fef08a, transparent),
            radial-gradient(1px 1px at 910px 240px, #ffffff, transparent),
            radial-gradient(1px 1px at 1040px 120px, #ffffff, transparent),
            radial-gradient(1px 1px at 1170px 290px, #ffffff, transparent),
            radial-gradient(1px 1px at 1310px 150px, #ffffff, transparent),
            radial-gradient(1px 1px at 1440px 75px, #fef08a, transparent)
          `,
          backgroundSize: '1440px 420px',
        }}
      />

      {/* Layer 2: Mid-Orbit Crisp Stars (1.2px - 1.5px) */}
      <div 
        className="absolute inset-0 z-0 opacity-60"
        style={{
          backgroundImage: `
            radial-gradient(1.5px 1.5px at 90px 180px, #ffffff, transparent),
            radial-gradient(1.5px 1.5px at 230px 340px, #fef08a, transparent),
            radial-gradient(1.2px 1.2px at 470px 140px, #ffffff, transparent),
            radial-gradient(1.5px 1.5px at 610px 260px, #ffffff, transparent),
            radial-gradient(1.2px 1.2px at 830px 190px, #ffffff, transparent),
            radial-gradient(1.5px 1.5px at 990px 330px, #fef08a, transparent),
            radial-gradient(1.2px 1.2px at 1120px 80px, #ffffff, transparent),
            radial-gradient(1.5px 1.5px at 1260px 220px, #ffffff, transparent),
            radial-gradient(1.2px 1.2px at 1390px 370px, #ffffff, transparent)
          `,
          backgroundSize: '1440px 500px',
        }}
      />

      {/* Layer 3: Rare Sparkling Hero Constellation Stars — Crisp, Zero Synthetic Glow */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {[
          { x: '12%', y: '18%', size: 2.0, color: '#fef08a', delay: 0, duration: 4.2 },
          { x: '24%', y: '72%', size: 1.6, color: '#ffffff', delay: 1.5, duration: 5.0 },
          { x: '8%', y: '82%', size: 1.8, color: '#ffffff', delay: 2.8, duration: 4.6 },
          { x: '42%', y: '12%', size: 1.6, color: '#ffffff', delay: 0.8, duration: 5.4 },
          { x: '78%', y: '22%', size: 2.0, color: '#fef08a', delay: 2.1, duration: 4.8 },
          { x: '88%', y: '68%', size: 1.6, color: '#ffffff', delay: 3.2, duration: 5.2 },
          { x: '94%', y: '35%', size: 1.8, color: '#ffffff', delay: 1.2, duration: 4.4 },
          { x: '68%', y: '85%', size: 2.0, color: '#ffffff', delay: 2.5, duration: 4.9 },
        ].map((star, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: star.x,
              top: star.y,
              width: star.size,
              height: star.size,
              backgroundColor: star.color,
            }}
            animate={{
              opacity: [0.35, 0.90, 0.35],
              scale: [0.85, 1.15, 0.85],
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: star.delay,
            }}
          />
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* 3. CLASSIC SPACE LUNAR CRATER HORIZON (OPTION 2 — CLEAN TOPOGRAPHY)     */}
      {/* Crisp vector crater topography inspired by the 1979 LEGO baseplate     */}
      {/* Zero AI-slop blur, zero glowing blobs, zero text clutter              */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <div className="absolute bottom-0 inset-x-0 w-full h-[140px] xs:h-[160px] sm:h-[185px] lg:h-[230px] z-0 pointer-events-none overflow-hidden select-none">
        <svg 
          viewBox="0 0 1440 240" 
          className="w-full h-full object-cover" 
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Distant Lunar Ridge Fill */}
            <linearGradient id="lunar-distant-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0a0f22" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#070a18" stopOpacity="1" />
            </linearGradient>

            {/* Mid-Ground Cratered Surface Fill */}
            <linearGradient id="lunar-mid-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0e152e" stopOpacity="0.98" />
              <stop offset="100%" stopColor="#070b19" stopOpacity="1" />
            </linearGradient>

            {/* Foreground Lunar Bedrock Fill */}
            <linearGradient id="lunar-fore-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#090d1c" stopOpacity="1" />
              <stop offset="100%" stopColor="#050711" stopOpacity="1" />
            </linearGradient>
          </defs>

          {/* ── Layer 1: Distant Low-Angle Lunar Mountain Ridge ──────────────── */}
          <path
            d="M0,125 
               Q140,95 280,115 
               T560,90 
               Q720,65 880,105 
               T1200,80 
               Q1320,70 1440,95 
               L1440,240 L0,240 Z"
            fill="url(#lunar-distant-grad)"
            stroke="rgba(255, 255, 255, 0.10)"
            strokeWidth="1.2"
          />

          {/* ── Layer 2: Mid-Ground Crater Terrain (Classic Space Baseplate 3947) ─ */}
          <path
            d="M0,158 
               Q110,150 180,132 
               C220,122 250,146 300,146 
               C350,146 390,120 460,126 
               Q580,135 680,145 
               C740,150 800,116 880,110 
               C950,105 1000,132 1080,132 
               Q1220,132 1310,118 
               Q1380,108 1440,122 
               L1440,240 L0,240 Z"
            fill="url(#lunar-mid-grad)"
            stroke="rgba(255, 255, 255, 0.14)"
            strokeWidth="1.2"
          />

          {/* Crater Depressions (Distinct Classic Space Circular Rim Details) */}
          {/* Crater 1 (Left Plain) */}
          <ellipse 
            cx="280" 
            cy="172" 
            rx="56" 
            ry="14" 
            fill="#080c1a" 
            stroke="rgba(255, 255, 255, 0.11)" 
            strokeWidth="1" 
          />
          <ellipse 
            cx="283" 
            cy="174" 
            rx="34" 
            ry="8" 
            fill="#050711" 
          />

          {/* Crater 2 (Center-Right under Astronaut Zero-G Floating Zone) */}
          <ellipse 
            cx="1020" 
            cy="154" 
            rx="82" 
            ry="18" 
            fill="#090d1e" 
            stroke="rgba(255, 255, 255, 0.13)" 
            strokeWidth="1.2" 
          />
          <ellipse 
            cx="1024" 
            cy="156" 
            rx="52" 
            ry="11" 
            fill="#050813" 
          />

          {/* Crater 3 (Mid distance micro crater) */}
          <ellipse 
            cx="660" 
            cy="162" 
            rx="32" 
            ry="8" 
            fill="#070a17" 
            stroke="rgba(255, 255, 255, 0.09)" 
            strokeWidth="0.8" 
          />

          {/* ── Layer 3: Foreground Undulating Lunar Bedrock Plain ──────────── */}
          <path
            d="M0,188 
               Q130,178 260,192 
               C360,202 440,172 540,176 
               Q720,186 860,172 
               C960,162 1040,190 1160,185 
               Q1300,180 1440,194 
               L1440,240 L0,240 Z"
            fill="url(#lunar-fore-grad)"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="1"
          />
        </svg>
      </div>
    </div>
  );
}
