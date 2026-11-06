import React from 'react';
import { motion, useTransform } from 'framer-motion';

/**
 * ProjectsBackground — Concept: "Orbital Shipyard / Blueprint Telemetry Dock"
 * 
 * - Harmonized with AboutPage's Classic Space universe (shared deep space palette & starfield).
 * - Distinct Concept: While About is "Planetary Exploration & Narrative Journey",
 *   Projects is "Orbital Shipyard & Engineering Blueprint Matrix" (where software architectures are drafted and docked).
 * - High performance: Hardware-accelerated CSS gradients, zero heavy blur filters, buttery 120 FPS.
 * 
 * 3 Scroll Phases:
 *   - Phase 1 (Top Hero): Deep Blueprint Hangar (#060a17 / #081126) with cyber cyan drafting grid & telemetry radar.
 *   - Phase 2 (Mid Parallax Runway): High-Energy Reactor Core (#0a0f26 to #151028) with warm solar amber glow (#FFD500 / #0055BF).
 *   - Phase 3 (Terminal Dock & Footer): Deep Docking Runway (#03050c) with perspective cyber launchpad grid leading flush into Footer.
 */
function ProjectsBackground({ scrollYProgress }) {
  // Phase 1: Active at top hero, dissolves smoothly as cards start gliding
  const phase1Opacity = useTransform(scrollYProgress, [0.12, 0.28], [1, 0]);

  // Phase 2: Active during mid-scroll when 3D cards flatten and glide horizontally
  const phase2Opacity = useTransform(scrollYProgress, [0.16, 0.30, 0.78, 0.90], [0, 1, 1, 0]);

  // Phase 3: Takes over at the bottom as user approaches the archive footer
  const phase3Opacity = useTransform(scrollYProgress, [0.78, 0.90], [0, 1]);

  // Subtle telemetry radar rotation driven by scroll (plus base smooth rotation)
  const radarRotation = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const blueprintParallaxY = useTransform(scrollYProgress, [0, 1], [0, -80]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none">
      
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* UNIVERSAL STARFIELD (Shared with AboutPage for Universe Continuity)    */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <div 
        className="absolute inset-0 opacity-60 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(1px 1px at 25px 35px, #ffffff, rgba(0,0,0,0)),
            radial-gradient(1.5px 1.5px at 120px 80px, #ffffff, rgba(0,0,0,0)),
            radial-gradient(1px 1px at 240px 190px, #ffd500, rgba(0,0,0,0)),
            radial-gradient(2px 2px at 380px 120px, #00f0ff, rgba(0,0,0,0)),
            radial-gradient(1px 1px at 490px 310px, #ffffff, rgba(0,0,0,0)),
            radial-gradient(1.5px 1.5px at 620px 220px, #ffffff, rgba(0,0,0,0)),
            radial-gradient(1px 1px at 750px 90px, #ffd500, rgba(0,0,0,0)),
            radial-gradient(2px 2px at 890px 270px, #ffffff, rgba(0,0,0,0)),
            radial-gradient(1px 1px at 1020px 150px, #00f0ff, rgba(0,0,0,0)),
            radial-gradient(1.5px 1.5px at 1180px 320px, #ffffff, rgba(0,0,0,0)),
            radial-gradient(1px 1px at 1310px 180px, #ffffff, rgba(0,0,0,0)),
            radial-gradient(1.5px 1.5px at 1410px 70px, #ffd500, rgba(0,0,0,0))
          `,
          backgroundSize: '1440px 420px'
        }}
      />

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* PHASE 1: DEEP BLUEPRINT HANGAR (Top Hero / Initial Perspective Stage)  */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <motion.div 
        className="absolute inset-0"
        style={{ opacity: phase1Opacity, willChange: 'opacity' }}
      >
        <div 
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle 900px at 75% 25%, rgba(0, 85, 191, 0.30), transparent 70%),
              radial-gradient(circle 750px at 20% 35%, rgba(0, 240, 255, 0.12), transparent 65%),
              radial-gradient(circle 950px at 50% 90%, rgba(255, 213, 0, 0.08), transparent 70%),
              #060a17
            `
          }}
        />
      </motion.div>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* PHASE 2: HIGH-ENERGY REACTOR CORE (Mid Runway / Horizontal Gliding)    */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <motion.div 
        className="absolute inset-0"
        style={{ opacity: phase2Opacity, willChange: 'opacity' }}
      >
        <div 
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 1100px 520px at 50% 50%, rgba(255, 213, 0, 0.22) 0%, rgba(0, 85, 191, 0.22) 42%, transparent 72%),
              radial-gradient(circle 850px at 85% 60%, rgba(0, 240, 255, 0.18) 0%, transparent 65%),
              radial-gradient(circle 750px at 15% 45%, rgba(227, 0, 11, 0.10) 0%, transparent 60%),
              linear-gradient(180deg, #070b1a 0%, #110d24 50%, #0a0e20 100%)
            `
          }}
        />
      </motion.div>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* PHASE 3: DEEP DOCKING BAY & RUNWAY SEAM (Bottom / Footer Connection)   */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <motion.div 
        className="absolute inset-0"
        style={{ opacity: phase3Opacity, willChange: 'opacity' }}
      >
        <div 
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle 1000px at 50% 95%, rgba(0, 240, 255, 0.22) 0%, rgba(0, 85, 191, 0.22) 50%, transparent 75%),
              radial-gradient(circle 750px at 85% 85%, rgba(255, 213, 0, 0.14) 0%, transparent 60%),
              radial-gradient(circle 750px at 15% 85%, rgba(227, 0, 11, 0.10) 0%, transparent 60%),
              linear-gradient(180deg, #050814 0%, #02040a 100%)
            `
          }}
        />

        {/* Perspective Cyber Docking Seam leading into Footer */}
        <div 
          className="absolute inset-x-0 bottom-0 h-[380px] pointer-events-none opacity-25"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(0, 240, 255, 0.35) 1.5px, transparent 1.5px),
              linear-gradient(to bottom, rgba(255, 213, 0, 0.25) 1.5px, transparent 1.5px)
            `,
            backgroundSize: '54px 54px',
            maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)',
            transform: 'perspective(550px) rotateX(50deg)',
            transformOrigin: 'bottom center'
          }}
        />
      </motion.div>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* BLUEPRINT DRAFTING MATRIX (Fine Engineering Coordinate Grid)           */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <motion.div 
        className="absolute inset-0 pointer-events-none opacity-45"
        style={{ y: blueprintParallaxY, willChange: 'transform' }}
      >
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(0, 240, 255, 0.04) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0, 240, 255, 0.04) 1px, transparent 1px),
              linear-gradient(to right, rgba(255, 213, 0, 0.02) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 213, 0, 0.02) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px, 40px 40px, 200px 200px, 200px 200px',
            maskImage: 'radial-gradient(ellipse 90% 80% at 50% 50%, rgba(0,0,0,0.9) 30%, transparent 85%)',
            WebkitMaskImage: 'radial-gradient(ellipse 90% 80% at 50% 50%, rgba(0,0,0,0.9) 30%, transparent 85%)',
          }}
        />
      </motion.div>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ROTATING BLUEPRINT RADAR & TELEMETRY RETICLE                          */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] sm:w-[850px] sm:h-[850px] pointer-events-none opacity-20"
        style={{ rotate: radarRotation, willChange: 'transform' }}
      >
        <svg viewBox="0 0 800 800" className="w-full h-full text-cyan-400" fill="none">
          {/* Outer Ring with Coordinate Ticks */}
          <circle cx="400" cy="400" r="380" stroke="currentColor" strokeWidth="1" strokeDasharray="4 8" opacity="0.4" />
          <circle cx="400" cy="400" r="340" stroke="currentColor" strokeWidth="1" opacity="0.25" />
          
          {/* Mid Telemetry Ring */}
          <circle cx="400" cy="400" r="260" stroke="#FFD500" strokeWidth="1" strokeDasharray="8 12" opacity="0.3" />
          <circle cx="400" cy="400" r="180" stroke="currentColor" strokeWidth="1" opacity="0.2" />
          
          {/* Inner Core */}
          <circle cx="400" cy="400" r="90" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 6" opacity="0.35" />
          <circle cx="400" cy="400" r="8" fill="#FFD500" opacity="0.5" />

          {/* Crosshair Axes */}
          <line x1="400" y1="20" x2="400" y2="780" stroke="currentColor" strokeWidth="0.8" strokeDasharray="6 6" opacity="0.25" />
          <line x1="20" y1="400" x2="780" y2="400" stroke="currentColor" strokeWidth="0.8" strokeDasharray="6 6" opacity="0.25" />

          {/* Diagonal Guides */}
          <line x1="130" y1="130" x2="670" y2="670" stroke="currentColor" strokeWidth="0.6" strokeDasharray="4 10" opacity="0.15" />
          <line x1="670" y1="130" x2="130" y2="670" stroke="currentColor" strokeWidth="0.6" strokeDasharray="4 10" opacity="0.15" />

          {/* Azimuth Angle Markings */}
          <text x="408" y="45" fill="currentColor" fontSize="11" fontFamily="monospace" opacity="0.5">000° NORTH</text>
          <text x="710" y="395" fill="currentColor" fontSize="11" fontFamily="monospace" opacity="0.5">090°</text>
          <text x="408" y="770" fill="currentColor" fontSize="11" fontFamily="monospace" opacity="0.5">180° SOUTH</text>
          <text x="35" y="395" fill="currentColor" fontSize="11" fontFamily="monospace" opacity="0.5">270°</text>
        </svg>
      </motion.div>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* TECHNICAL HUD TELEMETRY WATERMARKS (Tactile Classic Space Identity)    */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <div className="absolute top-24 left-6 sm:left-10 text-[10px] sm:text-[11px] font-mono text-cyan-400/25 tracking-widest hidden sm:block">
        <div>SYS.ARCHIVE // LL-928 SHIPYARD DOCK</div>
        <div className="text-[#FFD500]/25">ELEV: +14.2° // AZIMUTH: 284°</div>
      </div>

      <div className="absolute top-24 right-6 sm:right-10 text-[10px] sm:text-[11px] font-mono text-cyan-400/25 tracking-widest text-right hidden sm:block">
        <div>GRID: 48.02.CX // SECTOR 03</div>
        <div className="text-white/20">STATUS: REPOSITORIES ONLINE</div>
      </div>

    </div>
  );
}

export default ProjectsBackground;

