import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * SpaceBackground — Unified Classic Space Cosmic Canvas for Portfolio
 * 
 * Single source of truth for:
 * 1. Deep Obsidian Void Canvas (#060814)
 * 2. Multi-Depth Authentic Starlight Field (Pinpoint stardust + Twinkling constellations)
 * 3. Classic Space Lunar Crater Horizon (Part #3947 SVG)
 * 4. Conditional Parallax Animations (for About / withParallax):
 *    - Retro Space Celestial Planet (Parallax descent)
 *    - Cosmic Nebula Silhouettes (Multi-depth parallax)
 *    - Soft Cosmic Starlight Auras
 * 5. Named Export: ClassicSpaceHoloInsignia (1979 Emblem next to bio text)
 */

// 1. Authentic Retro Classic Space Celestial Planet (Inspired by legospace.tilda.ws/classicspace #creator)
function RetroSpacePlanet({ className = '' }) {
  return (
    <svg viewBox="0 0 240 240" className={`w-44 sm:w-60 md:w-72 h-44 sm:h-60 md:h-72 ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* Soft Ambient Starlight Atmosphere Glow */}
        <radialGradient id="planet-corona" cx="50%" cy="50%" r="50%">
          <stop offset="60%" stopColor="#38bdf8" stopOpacity="0.4" />
          <stop offset="78%" stopColor="#ffd500" stopOpacity="0.22" />
          <stop offset="92%" stopColor="#0055bf" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#060814" stopOpacity="0" />
        </radialGradient>

        {/* Planet Sphere Clip Path */}
        <clipPath id="planet-sphere-clip">
          <circle cx="120" cy="120" r="85" />
        </clipPath>

        {/* Deep Space Base Ocean */}
        <linearGradient id="planet-base" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0055bf" />
          <stop offset="45%" stopColor="#002b66" />
          <stop offset="80%" stopColor="#001633" />
          <stop offset="100%" stopColor="#060814" />
        </linearGradient>

        {/* Fluid Atmospheric Wave 1: Cyan Starlight Stream */}
        <linearGradient id="wave-cyan" x1="0" y1="0" x2="1" y2="0.6">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#0ea5e9" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#0284c7" stopOpacity="0.6" />
        </linearGradient>

        {/* Fluid Atmospheric Wave 2: Solar Amber Gold (#FFD500 Theme Color) */}
        <linearGradient id="wave-amber" x1="0" y1="0" x2="1" y2="0.5">
          <stop offset="0%" stopColor="#fef08a" stopOpacity="0.95" />
          <stop offset="40%" stopColor="#ffd500" stopOpacity="0.9" />
          <stop offset="85%" stopColor="#d97706" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#b45309" stopOpacity="0.4" />
        </linearGradient>

        {/* Fluid Atmospheric Wave 3: Classic Space Red Auroral Band */}
        <linearGradient id="wave-crimson" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.85" />
          <stop offset="60%" stopColor="#e11d48" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#be123c" stopOpacity="0.4" />
        </linearGradient>

        {/* Fluid Atmospheric Wave 4: Deep Royal Cobalt Swirl */}
        <linearGradient id="wave-cobalt" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#2563eb" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#1e40af" stopOpacity="0.5" />
        </linearGradient>

        {/* Crescent Night Shadow across the right/bottom hemisphere */}
        <linearGradient id="crescent-shadow" x1="0" y1="0" x2="1" y2="0.85">
          <stop offset="0%" stopColor="#060814" stopOpacity="0" />
          <stop offset="42%" stopColor="#060814" stopOpacity="0.5" />
          <stop offset="75%" stopColor="#060814" stopOpacity="0.88" />
          <stop offset="100%" stopColor="#060814" stopOpacity="0.98" />
        </linearGradient>
      </defs>

      {/* Atmospheric Starlight Corona Glow */}
      <circle cx="120" cy="120" r="110" fill="url(#planet-corona)" />

      {/* Clipped Planet Body with Fluid Layered Atmospheric Currents */}
      <g clipPath="url(#planet-sphere-clip)">
        {/* Base Ocean Sphere */}
        <circle cx="120" cy="120" r="85" fill="url(#planet-base)" />

        {/* Swirling Layer 1: Upper Starlight Cobalt Current */}
        <path
          d="M35,65 C65,40 125,75 175,55 C200,45 215,60 210,75 C200,100 145,90 95,110 C60,125 35,95 35,65 Z"
          fill="url(#wave-cobalt)"
        />

        {/* Swirling Layer 2: Hero Cyan Atmospheric River */}
        <path
          d="M32,92 C62,72 112,112 165,88 C195,74 212,96 205,116 C188,144 135,125 85,146 C52,158 28,126 32,92 Z"
          fill="url(#wave-cyan)"
        />

        {/* Swirling Layer 3: Classic Space Solar Amber Gold Stream */}
        <path
          d="M30,128 C60,106 108,148 160,124 C190,110 208,134 198,154 C178,184 126,165 76,186 C46,198 26,162 30,128 Z"
          fill="url(#wave-amber)"
        />

        {/* Swirling Layer 4: Organic Inner Swirl Vortex */}
        <path
          d="M75,102 C95,86 135,92 155,112 C170,128 160,152 140,158 C110,164 90,138 75,128 C65,118 65,110 75,102 Z"
          fill="url(#wave-cyan)"
          opacity="0.8"
        />

        {/* Swirling Layer 5: Classic Space Crimson Accent Whisp */}
        <path
          d="M102,62 C132,56 162,72 176,92 C186,106 172,116 156,106 C136,96 116,82 96,86 C86,88 88,76 102,62 Z"
          fill="url(#wave-crimson)"
        />

        {/* Swirling Layer 6: Lower Gold Jet Whisp */}
        <path
          d="M60,155 C90,140 140,170 170,150 C180,144 190,152 185,162 C170,185 120,182 80,195 C55,202 45,175 60,155 Z"
          fill="url(#wave-amber)"
          opacity="0.85"
        />

        {/* Natural Planetary Crescent Night Shadow */}
        <rect x="35" y="35" width="170" height="170" fill="url(#crescent-shadow)" />
      </g>

      {/* Spherical Silhouette & Soft Natural Starlight Rim Light */}
      <circle cx="120" cy="120" r="85" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="0.8" fill="none" />
      <path
        d="M48,78 A85,85 0 0,1 122,35"
        stroke="rgba(255, 255, 255, 0.6)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

// 2. Stylized Cosmic Nebula Silhouettes
function CosmicNebulaSilhouettes({ scrollYProgress }) {
  // Direct GPU Parallax driven by parent's MotionValue
  const layer1Y = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const layer2Y = useTransform(scrollYProgress, [0, 1], [0, -200]);

  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
      {/* Distant Deep-Space Nebula Cloud (Upper Left / Mid) */}
      <motion.div
        className="absolute top-[8%] -left-[10%] w-[65vw] max-w-[700px] h-[500px] opacity-40 pointer-events-none"
        style={{ y: layer1Y, willChange: 'transform' }}
      >
        <svg viewBox="0 0 700 500" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="sb-nebula-1" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0e1a38" stopOpacity="0.85" />
              <stop offset="70%" stopColor="#080e22" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#060814" stopOpacity="0" />
            </radialGradient>
          </defs>
          <path
            d="M50,220 C140,140 280,160 380,210 C480,260 560,190 640,240 C720,290 680,420 580,460 C480,500 240,480 120,440 C0,400 -40,300 50,220 Z"
            fill="url(#sb-nebula-1)"
          />
        </svg>
      </motion.div>

      {/* Mid-Orbit Cosmic Dust Silhouette (Right Margin) */}
      <motion.div
        className="absolute top-[38%] -right-[8%] w-[55vw] max-w-[600px] h-[450px] opacity-35 pointer-events-none"
        style={{ y: layer2Y, willChange: 'transform' }}
      >
        <svg viewBox="0 0 600 450" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="sb-nebula-2" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#101c3d" stopOpacity="0.8" />
              <stop offset="70%" stopColor="#090f24" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#060814" stopOpacity="0" />
            </radialGradient>
          </defs>
          <path
            d="M120,80 C240,40 380,90 480,140 C580,190 620,320 540,380 C460,440 280,420 180,360 C80,300 0,220 40,140 C80,60 0,120 120,80 Z"
            fill="url(#sb-nebula-2)"
          />
        </svg>
      </motion.div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════
// 3. CLASSIC SPACE HOLOGRAPHIC INSIGNIA (Named Export)
// Iconic 1979 Lego Classic Space Emblem (Clean Vector Planet + Red Rocket)
// ═════════════════════════════════════════════════════════════════════
export function ClassicSpaceHoloInsignia({ className = '', style }) {
  return (
    <motion.div
      style={style}
      className={`inline-flex items-center justify-center select-none pointer-events-none ${className}`}
    >
      <motion.div
        animate={{
          y: [-5, 5, -5],
          rotate: [-2.5, 2.5, -2.5],
        }}
        transition={{
          duration: 5.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative flex items-center justify-center w-full h-full"
      >
        {/* Clean Vector 1979 Classic Space Insignia (Zero dashed HUD rings or heavy blur glow) */}
        <svg 
          viewBox="0 0 160 160" 
          className="w-full h-full filter drop-shadow-[0_10px_18px_rgba(0,0,0,0.85)]" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Golden Yellow Planet Gradient */}
            <radialGradient id="planetGoldInsignia" cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#FFF59D" />
              <stop offset="35%" stopColor="#FFD500" />
              <stop offset="75%" stopColor="#D49B00" />
              <stop offset="100%" stopColor="#9E7400" />
            </radialGradient>

            {/* Red Spaceship Hull Gradient */}
            <linearGradient id="shipRedInsignia" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF4D4D" />
              <stop offset="60%" stopColor="#E3000B" />
              <stop offset="100%" stopColor="#990007" />
            </linearGradient>

            {/* Comet Swoosh Trail Gradient */}
            <linearGradient id="swooshTrailInsignia" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
              <stop offset="30%" stopColor="#38BDF8" stopOpacity="0.4" />
              <stop offset="70%" stopColor="#FFFFFF" stopOpacity="0.82" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.95" />
            </linearGradient>
          </defs>

          {/* 1. The Golden Planet */}
          <circle cx="75" cy="85" r="38" fill="url(#planetGoldInsignia)" />
          {/* Planet Inner Spherical Shadow Crescent */}
          <path
            d="M 75 47 A 38 38 0 0 1 113 85 A 38 38 0 0 1 75 123 C 95 115 105 95 105 85 C 105 75 95 55 75 47 Z"
            fill="#060A17"
            opacity="0.34"
          />

          {/* 2. The Iconic Orbital Swoosh (White Comet Trail) */}
          <path
            d="M 32 108 C 24 94, 30 70, 52 56 C 75 42, 105 45, 126 62 C 138 72, 142 86, 134 96 C 124 108, 96 112, 72 104 C 54 98, 44 88, 48 76 C 52 64, 72 52, 104 42 L 132 30"
            stroke="url(#swooshTrailInsignia)"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          {/* Inner Accent Core Line */}
          <path
            d="M 58 52 C 80 40, 108 44, 124 58 C 134 67, 136 78, 128 86 C 118 96, 94 98, 76 92 C 62 87, 56 79, 62 70 C 70 58, 94 46, 128 32"
            stroke="#FFFFFF"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.88"
          />

          {/* 3. The Classic Red Spaceship in Flight */}
          <g transform="translate(122, 22) rotate(42)">
            {/* Spaceship Main Delta Wings & Fuselage */}
            <polygon points="12,0 24,24 12,20 0,24" fill="url(#shipRedInsignia)" stroke="#7A0005" strokeWidth="0.8" />
            {/* Cockpit Canopy Glint */}
            <ellipse cx="12" cy="11" rx="2.5" ry="5.5" fill="#FFEB3B" opacity="0.9" />
            <ellipse cx="12" cy="10" rx="1.2" ry="3.5" fill="#FFFFFF" opacity="0.8" />
            {/* Thruster Flame Spark */}
            <polygon points="10,21 12,28 14,21" fill="#38BDF8" opacity="0.85" />
          </g>
        </svg>
      </motion.div>
    </motion.div>
  );
}

function CosmicParallaxLayer({ scrollYProgress }) {
  const { scrollYProgress: internalScroll } = useScroll();
  const activeScroll = scrollYProgress || internalScroll;

  const planetY = useTransform(activeScroll, [0, 1], [0, 210]);
  const planetX = useTransform(activeScroll, [0, 1], [0, -28]);
  const planetScale = useTransform(activeScroll, [0, 0.45, 0.8], [1, 0.9, 0.8]);
  // Fade gracefully to 0 before reaching Tech Stack so it never lingers behind keyboard
  const planetOpacity = useTransform(activeScroll, [0, 0.28, 0.56], [0.85, 0.48, 0]);

  const ambientHeroOpacity = useTransform(activeScroll, [0.10, 0.40], [1, 0.2]);
  const ambientSkillsOpacity = useTransform(activeScroll, [0.30, 0.60], [0, 0.8]);

  return (
    <>
      {/* Soft Organic Starlight Aura behind Hero Profile */}
      <motion.div 
        className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          opacity: ambientHeroOpacity,
          background: 'radial-gradient(circle, rgba(0, 85, 191, 0.12) 0%, rgba(255, 213, 0, 0.04) 45%, transparent 70%)',
          transform: 'translateZ(0)',
          willChange: 'opacity',
        }}
      />

      {/* Soft Launchpad Starlight Aura behind Skills Keyboard */}
      <motion.div 
        className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full pointer-events-none"
        style={{
          opacity: ambientSkillsOpacity,
          background: 'radial-gradient(ellipse 100% 60% at 50% 50%, rgba(0, 85, 191, 0.15) 0%, rgba(255, 213, 0, 0.05) 50%, transparent 75%)',
          transform: 'translateZ(0)',
          willChange: 'opacity',
        }}
      />

      {/* Stylized Cosmic Nebula Silhouettes */}
      <CosmicNebulaSilhouettes scrollYProgress={activeScroll} />

      {/* Calm Retro Space Planet (Subtle & translucent on mobile, fades out before Tech Stack) */}
      <motion.div
        className="fixed top-[68px] sm:top-[80px] lg:top-[88px] -right-4 sm:right-[1.5%] lg:right-[2.5%] pointer-events-none z-0"
        style={{
          y: planetY,
          x: planetX,
          scale: planetScale,
          opacity: planetOpacity,
          willChange: 'transform, opacity',
        }}
      >
        <motion.div
          animate={{
            y: [-5, 5, -5],
            rotate: [-1.2, 1.2, -1.2],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="opacity-35 sm:opacity-60 lg:opacity-85 transition-opacity"
        >
          <RetroSpacePlanet className="w-24 h-24 sm:w-36 sm:h-36 md:w-44 md:h-44 lg:w-52 lg:h-52" />
        </motion.div>
      </motion.div>
    </>
  );
}

const CONSTELLATION_STARS = [
  { x: '12%', y: '18%', size: 2.0, color: '#fef08a', delay: '0s', duration: '4.2s' },
  { x: '24%', y: '72%', size: 1.6, color: '#ffffff', delay: '1.5s', duration: '5.0s' },
  { x: '8%', y: '82%', size: 1.8, color: '#ffffff', delay: '2.8s', duration: '4.6s' },
  { x: '42%', y: '12%', size: 1.6, color: '#ffffff', delay: '0.8s', duration: '5.4s' },
  { x: '78%', y: '22%', size: 2.0, color: '#fef08a', delay: '2.1s', duration: '4.8s' },
  { x: '88%', y: '68%', size: 1.6, color: '#ffffff', delay: '3.2s', duration: '5.2s' },
  { x: '94%', y: '35%', size: 1.8, color: '#ffffff', delay: '1.2s', duration: '4.4s' },
  { x: '68%', y: '85%', size: 2.0, color: '#ffffff', delay: '2.5s', duration: '4.9s' },
];

/**
 * ═════════════════════════════════════════════════════════════════════
 * MAIN UNIFIED SPACE BACKGROUND COMPONENT (Default Export)
 * ═════════════════════════════════════════════════════════════════════
 * Props:
 * - variant: "home" | "about" (default: "home")
 * - scrollYProgress: framer-motion scroll progress (used when variant="about")
 * - showCraters: boolean (default: true)
 */
export default function SpaceBackground({ 
  variant = 'home', 
  scrollYProgress, 
  showCraters = true,
  className = '' 
}) {
  const isCosmic = variant === 'about' || variant === 'projects';

  return (
    <div className={`fixed inset-0 z-0 pointer-events-none overflow-hidden select-none ${className}`}>
      
      {/* ── 1. DEEP OBSIDIAN SPACE CANVAS (Identik di Semua Halaman) ──────── */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          background: 'linear-gradient(180deg, #060814 0%, #070a18 50%, #050711 100%)',
        }}
      />

      {/* ── 2. LAYER 1: DISTANT DEEP-SPACE MICRO STARS (0.8px - 1px) ─────── */}
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

      {/* ── 3. LAYER 2: MID-ORBIT CRISP STARS (1.2px - 1.5px) ────────────── */}
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

      {/* ── 4. LAYER 3: SPARKLING CONSTELLATION STARS (GPU CSS Twinkle) ──── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {CONSTELLATION_STARS.map((star, i) => (
          <div
            key={i}
            className="sb-twinkle-star absolute rounded-full"
            style={{
              left: star.x,
              top: star.y,
              width: star.size,
              height: star.size,
              backgroundColor: star.color,
              animationDuration: star.duration,
              animationDelay: star.delay,
            }}
          />
        ))}
      </div>

      {/* ── 5. COSMIC EXPEDITION (Only mounted on About/Cosmic variants) ─── */}
      {isCosmic && <CosmicParallaxLayer scrollYProgress={scrollYProgress} />}

      {/* ── 6. CLASSIC SPACE LUNAR CRATER HORIZON (BASEPLATE PART #3947) ─── */}
      {showCraters && (
        <div className="absolute bottom-0 inset-x-0 w-full h-[140px] xs:h-[160px] sm:h-[185px] lg:h-[230px] z-0 pointer-events-none overflow-hidden select-none opacity-85">
          <svg 
            viewBox="0 0 1440 240" 
            className="w-full h-full object-cover" 
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="sb-lunar-distant" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0a0f22" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#070a18" stopOpacity="1" />
              </linearGradient>
              <linearGradient id="sb-lunar-mid" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0e152e" stopOpacity="0.98" />
                <stop offset="100%" stopColor="#070b19" stopOpacity="1" />
              </linearGradient>
              <linearGradient id="sb-lunar-fore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#090d1c" stopOpacity="1" />
                <stop offset="100%" stopColor="#050711" stopOpacity="1" />
              </linearGradient>
            </defs>

            {/* Distant Low-Angle Lunar Mountain Ridge */}
            <path
              d="M0,125 Q140,95 280,115 T560,90 Q720,65 880,105 T1200,80 Q1320,70 1440,95 L1440,240 L0,240 Z"
              fill="url(#sb-lunar-distant)"
              stroke="rgba(255, 255, 255, 0.10)"
              strokeWidth="1.2"
            />

            {/* Mid-Ground Crater Terrain */}
            <path
              d="M0,158 Q110,150 180,132 C220,122 250,146 300,146 C350,146 390,120 460,126 Q580,135 680,145 C740,150 800,116 880,110 C950,105 1000,132 1080,132 Q1220,132 1310,118 Q1380,108 1440,122 L1440,240 L0,240 Z"
              fill="url(#sb-lunar-mid)"
              stroke="rgba(255, 255, 255, 0.14)"
              strokeWidth="1.2"
            />

            {/* Craters */}
            <ellipse cx="280" cy="172" rx="56" ry="14" fill="#080c1a" stroke="rgba(255, 255, 255, 0.11)" strokeWidth="1" />
            <ellipse cx="283" cy="174" rx="34" ry="8" fill="#050711" />
            <ellipse cx="1020" cy="154" rx="82" ry="18" fill="#090d1e" stroke="rgba(255, 255, 255, 0.13)" strokeWidth="1.2" />
            <ellipse cx="1024" cy="156" rx="52" ry="11" fill="#050813" />
            <ellipse cx="660" cy="162" rx="32" ry="8" fill="#070a17" stroke="rgba(255, 255, 255, 0.09)" strokeWidth="0.8" />

            {/* Foreground Lunar Bedrock */}
            <path
              d="M0,188 Q130,178 260,192 C360,202 440,172 540,176 Q720,186 860,172 C960,162 1040,190 1160,185 Q1300,180 1440,194 L1440,240 L0,240 Z"
              fill="url(#sb-lunar-fore)"
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="1"
            />
          </svg>
        </div>
      )}

    </div>
  );
}
