// src/components/Projects.jsx
// Complete 1:1 Implementation of YAAS Energy (yaas-energy.com) Scroll Experience
// Part 1: 3D Cylindrical Arc Carousel (Spin & Zoom)
// Part 2: Isometric Stacking Cards (Scroll down -> cards fly up one by one revealing next project)

import React, { useState, useEffect, useRef } from 'react';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValueEvent,
} from 'framer-motion';

// Project Screenshots
import iotImage from '../assets/IoT.png';
import rosaStoreImage from '../assets/RosaStore.png';
import fishAiImage from '../assets/FishAI.png';
import iwakmartImage from '../assets/Iwakmart Mobile.jpg';
import portokuImage from '../assets/Web Portoku.jpeg';

// The 5 Authentic Collector Projects
const projectSets = [
  {
    id: 1,
    setNo: '6924',
    title: 'Fish AI Diagnostics',
    rawTitle: 'Aplikasi Mobile Fish AI',
    year: '2024',
    category: 'MOBILE & COMPUTER VISION',
    description:
      'Aplikasi diagnosis cerdas penyakit ikan & udang berbasis Computer Vision & AI. Menghadirkan deteksi gejala instan dengan rekomendasi penanganan akurat untuk peternak.',
    link: 'https://github.com/aprileoerlangga/FishAI.git',
    thumbnail: fishAiImage,
    isMobile: true,
    tags: ['Flutter', 'TensorFlow', 'FastAPI'],
    accentColor: '#14b8a6',
  },
  {
    id: 2,
    setNo: '6882',
    title: 'Rosa Store Marketplace',
    rawTitle: 'Web E-commerce Handphone',
    year: '2024',
    category: 'FULLSTACK WEB ARCHITECTURE',
    description:
      'Platform e-commerce modern dengan katalog produk handphone, manajemen keranjang belanja, checkout instan, serta sistem autentikasi aman.',
    link: 'https://github.com/aprileoerlangga/ecommerce-handphone.git',
    thumbnail: rosaStoreImage,
    isMobile: false,
    tags: ['React', 'Node.js', 'Tailwind CSS'],
    accentColor: '#38bdf8',
  },
  {
    id: 3,
    setNo: '6984',
    title: 'Iwakmart Mobile App',
    rawTitle: 'Iwakmart Fishery App',
    year: '2025',
    category: 'FISHERY MARKETPLACE ECOSYSTEM',
    description:
      'Aplikasi marketplace perikanan digital untuk menghubungkan peternak ikan langsung dengan konsumen dengan pelacakan harga dan pemesanan segar.',
    link: 'https://github.com/aprileoerlangga',
    thumbnail: iwakmartImage,
    isMobile: false,
    tags: ['Flutter', 'Firebase', 'State Mgmt'],
    accentColor: '#3b82f6',
  },
  {
    id: 4,
    setNo: '6950',
    title: 'IoT GPS Tracker System',
    rawTitle: 'IoT GPS Tracker Bagpack',
    year: '2025',
    category: 'HARDWARE & TELEMETRY DASHBOARD',
    description:
      'Sistem pelacakan tas ransel pintar terintegrasi mikrokontroler GPS, GSM module, dan dashboard pemantauan lokasi real-time interaktif berbasis web.',
    link: 'https://github.com/aprileoerlangga/GPSTrackerBag.git',
    thumbnail: iotImage,
    isMobile: false,
    tags: ['C++', 'IoT Sensor', 'Google Maps API'],
    accentColor: '#06b6d4',
  },
  {
    id: 5,
    setNo: '6928',
    title: 'Personal 3D Portfolio',
    rawTitle: 'Interactive 3D Experience',
    year: '2026',
    category: 'CREATIVE FRONTEND & THREE.JS',
    description:
      'Website portofolio kreatif dengan integrasi karakter 3D Lego interaktif, audio-visual responsif, dan styling Classic Space retro-modern.',
    link: 'https://github.com/aprileoerlangga/my-portofolio.git',
    thumbnail: portokuImage,
    isMobile: false,
    tags: ['React 19', 'Three.js', 'Framer Motion'],
    accentColor: '#FFD500',
  },
];

// ══════════════════════════════════════════════════════════════════════════════
// EXACT PRODUCTION MATHEMATICS EXTRACTED DIRECTLY FROM YAAS-ENERGY.COM
// ══════════════════════════════════════════════════════════════════════════════
const Vt = 0.7;
const dollar_e = 0.35;
const Kt = 24;
const sr = 2.62;
const or_val = 0.06;
const mt = 3.2;
const Xe = 2.2;
const wt = 3.1;
const Ye = 0.62;
const ir = 1.25;
const cr = 18;

// Virtual reel of 25 cards (5 repetitions) exactly as in YAAS Energy
const REPEAT_COUNT = 5;
const virtualCards = Array.from(
  { length: projectSets.length * REPEAT_COUNT },
  (_, i) => ({
    ...projectSets[i % projectSets.length],
    virtualIndex: i,
  })
);

// Target center card index = 10 (projectSets[0] - Fish AI)
const TARGET_CENTER_INDEX = 10;
const SPIN_CARDS_COUNT = 7;

function Te(n) {
  return n < 0 ? 0 : n > 1 ? 1 : n;
}

function yt(n, e, t) {
  return n + (e - n) * t;
}

function vt(n) {
  return n < 0.5 ? 2 * n * n : 1 - Math.pow(-2 * n + 2, 2) / 2;
}

function Zt(n) {
  return Math.sqrt(n * n + dollar_e * dollar_e) - dollar_e;
}

function lr(n, e, t) {
  const i = Math.max(-mt, Math.min(mt, n));
  const s = (-i * Kt * Math.PI) / 180;
  const c = Vt * e * Zt(i);
  const o = e / 2;
  const u = Math.cos(s);
  const d = Math.sin(s);
  const g = t * 0.15;
  const f = (o * u * t) / Math.max(t - c - o * d, g);
  const l = (o * u * t) / Math.max(t - c + o * d, g);
  return { left: f, right: l };
}

function dr(n, e, t) {
  const i = n.map((f) => lr(f, e, t));
  const s = or_val * e;
  const c = [0];
  for (let f = 1; f < n.length; f += 1) {
    c[f] = c[f - 1] + i[f - 1].right + s + i[f].left;
  }
  let o = 0;
  while (o < n.length - 2 && n[o + 1] < 0) o += 1;
  const u = n[o + 1] - n[o];
  const d = u === 0 ? 0 : (0 - n[o]) / u;
  const g = c[o] + (c[o + 1] - c[o]) * d;
  return c.map((f) => f - g);
}

export function Projects() {
  const containerRef = useRef(null);
  const stageRef = useRef(null);
  const headlineRef = useRef(null);
  const sublineRef = useRef(null);
  const arcCardsContainerRef = useRef(null);
  const cardRefs = useRef([]);
  const stackedContainerRef = useRef(null);

  const [isMobile, setIsMobile] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  });

  // Track window dimensions and resize
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setIsMobile(w < 768);
      setWindowDimensions({ width: w, height: h });
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Scroll tracking across the comprehensive stage (Arc + Stacking Swipe)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const smoothScroll = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 26,
    mass: 0.3,
  });

  // Dimensions for Arc and Zoom Target - Aesthetic studio framing (perfect vertical centering, zero cut-off)
  const cardWidth = isMobile
    ? Math.min(260, windowDimensions.width * 0.68)
    : Math.min(360, Math.max(280, windowDimensions.width * 0.22));
  const cardHeight = (cardWidth * 273) / 382;
  const targetWidth = isMobile
    ? Math.min(340, windowDimensions.width - 32)
    : Math.min(920, Math.max(680, windowDimensions.width * 0.60));
  const targetHeight = isMobile
    ? Math.min(420, windowDimensions.height * 0.52)
    : Math.min(460, Math.max(340, windowDimensions.height * 0.48));

  // Pre-calculated initial positions at A = 0 (ue = 3) for instant zero-flicker render
  const initialStyles = React.useMemo(() => {
    const ue0 = TARGET_CENTER_INDEX - SPIN_CARDS_COUNT; // 3
    const te0 = sr * cardWidth;
    const ie0 = virtualCards.map((_, x) => x - ue0);
    const ne0 = dr(ie0, cardWidth, te0);

    return virtualCards.map((_, x) => {
      const h = ie0[x];
      const y = Math.abs(h);
      if (y > wt) {
        return { opacity: 0, visibility: 'hidden', zIndex: 0, transform: 'translate(-50%, -50%) scale(0)' };
      }
      const L = ne0[x];
      const j = Vt * cardWidth * Zt(h);
      const rotY = -h * Kt;
      const W = y <= Xe ? 1 : 1 - (y - Xe) / (wt - Xe);
      return {
        opacity: W,
        visibility: 'visible',
        zIndex: 10 - Math.min(5, Math.round(y)),
        transform: `translate(-50%, -50%) translate3d(${L}px, 0, 0) perspective(${te0}px) translateZ(${j}px) rotateY(${rotY}deg)`,
      };
    });
  }, [cardWidth]);

  // ════════════════════════════════════════════════════════════════════════════
  // DIRECT HIGH-PERFORMANCE DOM STYLE UPDATES (Locked 60/120 FPS, No React lag)
  // ════════════════════════════════════════════════════════════════════════════
  const updateVisuals = (scrollP) => {
    // ──────────────────────────────────────────────────────────────────────────
    // PHASE 1: ARC STAGE (scrollP from 0.00 to 0.35)
    // ──────────────────────────────────────────────────────────────────────────
    const arcPhaseMax = 0.35;
    const arcNormalized = Math.max(0, Math.min(1, scrollP / arcPhaseMax));

    // Mathematical progression for Arc spin and zoom
    const S = vt(Te(arcNormalized / Ye));
    const Z = Te((arcNormalized - Ye) / (1 - Ye));
    const ue = TARGET_CENTER_INDEX - SPIN_CARDS_COUNT * (1 - S);
    const z = Te(Z * ir);
    const se = String(Math.max(0, 1 - z));
    const oe = z === 0 ? 'none' : `blur(${z * cr}px)`;

    // Headline & Subline fading and blurring as center card zooms
    if (headlineRef.current) {
      headlineRef.current.style.opacity = se;
      headlineRef.current.style.filter = oe;
    }
    if (sublineRef.current) {
      sublineRef.current.style.opacity = se;
      sublineRef.current.style.filter = oe;
    }

    // Calculate 3D Arc positions using exact YAAS cylindrical equations
    const te = sr * cardWidth;
    const ie = virtualCards.map((_, x) => x - ue);
    const ne = dr(ie, cardWidth, te);

    virtualCards.forEach((_, x) => {
      const cardEl = cardRefs.current[x];
      if (!cardEl) return;

      const h = ie[x];
      const y = Math.abs(h);

      if (y > wt) {
        cardEl.style.opacity = '0';
        cardEl.style.visibility = 'hidden';
        return;
      }

      cardEl.style.visibility = 'visible';
      const isTargetCenter = x === TARGET_CENTER_INDEX;
      const L = ne[x];
      const j = Vt * cardWidth * Zt(h);
      const rotY = -h * Kt;
      const W = y <= Xe ? 1 : 1 - (y - Xe) / (wt - Xe);

      if (isTargetCenter) {
        const H = vt(Z);
        const currW = yt(cardWidth, targetWidth, H);
        const currH = yt(cardHeight, targetHeight, H);
        cardEl.style.width = `${currW}px`;
        cardEl.style.height = `${currH}px`;
        cardEl.style.opacity = String(W);
        cardEl.style.zIndex = '30';
        cardEl.style.transform = `translate(-50%, -50%) translate3d(${L * (1 - H)}px, 0, 0) perspective(${te}px) translateZ(${j * (1 - H)}px) rotateY(${rotY * (1 - H)}deg)`;
      } else {
        cardEl.style.width = `${cardWidth}px`;
        cardEl.style.height = `${cardHeight}px`;
        cardEl.style.opacity = String(Math.max(0, W * (1 - z)));
        cardEl.style.filter = oe;
        cardEl.style.zIndex = String(10 - Math.min(5, Math.round(y)));
        cardEl.style.transform = `translate(-50%, -50%) translate3d(${L}px, 0, 0) perspective(${te}px) translateZ(${j}px) rotateY(${rotY}deg)`;
      }
    });

    // ──────────────────────────────────────────────────────────────────────────
    // PHASE 2: SEAMLESS 1:1 HAND-OFF TO STACKED DECK
    // Zoom completes fully at scrollP = 0.35 (Z = 1.0, 100% full dimensions)
    // Cross-fade between 0.35 and 0.39 where BOTH cards are 100% identical
    // Resting showcase from 0.39 to 0.44
    // Sequential stack fly-up begins at 0.44
    // ──────────────────────────────────────────────────────────────────────────
    if (arcCardsContainerRef.current) {
      if (scrollP > 0.40) {
        arcCardsContainerRef.current.style.opacity = '0';
        arcCardsContainerRef.current.style.pointerEvents = 'none';
        arcCardsContainerRef.current.style.visibility = 'hidden';
      } else if (scrollP > 0.35) {
        const fadeOut = 1 - (scrollP - 0.35) / 0.04;
        arcCardsContainerRef.current.style.opacity = String(Math.max(0, fadeOut));
        arcCardsContainerRef.current.style.pointerEvents = 'none';
        arcCardsContainerRef.current.style.visibility = 'visible';
      } else {
        arcCardsContainerRef.current.style.opacity = '1';
        arcCardsContainerRef.current.style.pointerEvents = 'auto';
        arcCardsContainerRef.current.style.visibility = 'visible';
      }
    }

    if (stackedContainerRef.current) {
      if (scrollP < 0.35) {
        stackedContainerRef.current.style.opacity = '0';
        stackedContainerRef.current.style.pointerEvents = 'none';
        stackedContainerRef.current.style.visibility = 'hidden';
      } else if (scrollP < 0.39) {
        const fadeIn = (scrollP - 0.35) / 0.04;
        stackedContainerRef.current.style.opacity = String(Math.min(1, fadeIn));
        stackedContainerRef.current.style.pointerEvents = scrollP >= 0.37 ? 'auto' : 'none';
        stackedContainerRef.current.style.visibility = 'visible';
      } else {
        stackedContainerRef.current.style.opacity = '1';
        stackedContainerRef.current.style.pointerEvents = 'auto';
        stackedContainerRef.current.style.visibility = 'visible';
      }
    }
  };

  // Attach smooth scroll event
  useMotionValueEvent(smoothScroll, 'change', (latest) => {
    updateVisuals(latest);
  });

  // Initial setup on mount
  useEffect(() => {
    updateVisuals(0);
  }, [cardWidth, cardHeight, targetWidth, targetHeight]);

  return (
    <section id="projects" className="bg-transparent text-white relative">
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* STICKY COMPREHENSIVE STAGE (YAAS Arc Spin -> Zoom -> Stacked Fly-Up)  */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <div
        ref={containerRef}
        id="projects-stage"
        className="relative w-full h-[550vh] sm:h-[600vh] bg-transparent text-white"
      >
        {/* Sticky Viewport (100vh / 100dvh - Perfectly centered vertically across iOS & Android) */}
        <div className="sticky top-0 h-screen h-[100dvh] w-full flex items-center justify-center overflow-hidden select-none z-10 px-4">
          
          {/* ── TOP SECTION: YAAS Headline (Safely below 64px navbar with ample breathing room) ── */}
          <div
            ref={headlineRef}
            className="absolute top-20 sm:top-24 md:top-24 inset-x-0 w-full flex flex-col items-center z-20 pointer-events-none text-center px-4"
          >
            <h2
              className="font-pixel text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal tracking-wider text-white uppercase select-none drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)] leading-tight"
              style={{ fontFamily: "'Arcadepix', monospace" }}
            >
              MY <span className="text-[#FFD500] drop-shadow-[0_0_35px_rgba(255,213,0,0.65)]">PROJECTS</span>
            </h2>
          </div>

          {/* ── MIDDLE SECTION 1: 3D CYLINDRICAL ARC STAGE (Dead center vertically) ── */}
          <div
            ref={arcCardsContainerRef}
            className="relative flex-1 w-full h-full flex items-center justify-center min-h-0 z-10 pointer-events-auto"
          >
            {virtualCards.map((project, idx) => {
              const init = initialStyles[idx] || {};
              const isCenter = idx === TARGET_CENTER_INDEX;
              return (
                <div
                  key={`${project.id}-${idx}`}
                  ref={(el) => (cardRefs.current[idx] = el)}
                  style={{
                    width: `${cardWidth}px`,
                    height: `${cardHeight}px`,
                    opacity: init.opacity ?? 0,
                    visibility: init.visibility ?? 'hidden',
                    zIndex: init.zIndex ?? 1,
                    transform: init.transform ?? 'translate(-50%, -50%)',
                  }}
                  className="absolute top-1/2 left-1/2 rounded-[20px] sm:rounded-[28px] cursor-default overflow-hidden bg-[#070b16] shadow-[0_20px_50px_rgba(0,0,0,0.85)] group select-none flex-shrink-0 border border-white/20 will-change-transform"
                >
                {/* Edge-to-edge Project Screenshot */}
                {project.isMobile ? (
                  <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#0b1329] to-[#040711]">
                    <div
                      className="absolute inset-0 pointer-events-none opacity-25"
                      style={{
                        background: `radial-gradient(circle at center, ${project.accentColor || '#14b8a6'} 0%, transparent 70%)`,
                      }}
                    />
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="relative z-10 w-auto h-full max-h-[92%] object-contain py-2 drop-shadow-[0_15px_35px_rgba(0,0,0,0.9)]"
                    />
                  </div>
                ) : (
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="object-cover object-top absolute h-full w-full inset-0 rounded-[20px] sm:rounded-[28px]"
                  />
                )}

                {/* Title overlay: mobile-friendly (always visible on mobile, smooth hover on desktop) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 flex flex-col justify-end p-4 sm:p-7">
                  <h3
                    className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-black tracking-tight text-white select-none whitespace-normal leading-[1.15] drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)] truncate"
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      letterSpacing: "-0.025em",
                    }}
                  >
                    {project.title}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>

          {/* ── MIDDLE SECTION 2: STACKED FLY-UP CARDS (Dead center vertically) ──── */}
          <div
            ref={stackedContainerRef}
            style={{
              width: `${targetWidth}px`,
              height: `${targetHeight}px`,
              opacity: 0,
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-20 pointer-events-none"
          >
            {projectSets.map((project, idx) => (
              <StackedIsoCard
                key={project.id}
                project={project}
                index={idx}
                total={projectSets.length}
                smoothScroll={smoothScroll}
                isMobile={isMobile}
              />
            ))}
          </div>

          {/* ── BOTTOM SECTION: Editorial Subline (Tampilan awal di bawah project) ── */}
          <div
            ref={sublineRef}
            className="absolute bottom-8 sm:bottom-12 md:bottom-14 inset-x-0 w-full flex flex-col items-center z-20 pointer-events-none text-center px-6"
          >
            <p
              className="text-slate-300 text-xs sm:text-sm md:text-base font-normal max-w-2xl mx-auto leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              A curated collection of web applications, mobile ecosystems, and interactive digital experiences.
            </p>
          </div>

        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ACT 3: EDITORIAL CONCLUDING SECTION (Gaya Motivational Quotes About)   */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <div className="relative z-20 max-w-4xl mx-auto px-6 sm:px-10 w-full pt-28 sm:pt-36 pb-32 sm:pb-44 select-none">
        
        {/* Soft Dynamic Ambient Backlight Glow (Identik dengan MotivationalQuotes) */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div 
            className="w-[500px] sm:w-[850px] h-[320px] sm:h-[440px] rounded-full blur-[110px] opacity-25"
            style={{
              background: 'radial-gradient(circle, rgba(255,213,0,0.25) 0%, rgba(6,182,212,0.15) 45%, transparent 75%)',
            }}
          />
        </div>

        {/* Monumental Editorial Stage */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 flex flex-col items-center justify-center text-center"
        >
          {/* Monumental Editorial Heading (Font Syne 900 Identik dengan Motivational Quotes) */}
          <h3 
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[3.25rem] uppercase tracking-tight text-white max-w-3xl leading-[1.14] select-none flex flex-col items-center"
            style={{
              fontFamily: "'Syne', -apple-system, sans-serif",
              fontWeight: 900,
              letterSpacing: "-0.02em",
            }}
          >
            <span>LET'S ASSEMBLE THE FUTURE</span>
            <span className="text-[#FFD500] drop-shadow-[0_0_32px_rgba(255,213,0,0.55)] mt-1 sm:mt-1.5">
              ONE BRICK AT A TIME.
            </span>
          </h3>

          {/* Subtitle / Quote (Font Plus Jakarta Sans Identik dengan Motivational Quotes) */}
          <p 
            className="mt-5 sm:mt-6 text-sm sm:text-base md:text-lg text-slate-300/90 font-normal leading-relaxed max-w-2xl mx-auto"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            &ldquo;Every enduring digital system begins like assembling LEGO bricks — founded on precision, structured with clean logic, and engineered to deliver real, lasting human impact.&rdquo;
          </p>
        </motion.div>

      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 2. STACKED ISO CARD COMPONENT (YAAS Stacking Swipe: Scroll 36% to 92%)
// Cards fly upwards one by one revealing the next project card underneath!
// ══════════════════════════════════════════════════════════════════════════════
function StackedIsoCard({
  project,
  index,
  total,
  smoothScroll,
  isMobile,
}) {
  // Stacking timing:
  // Visible resting stack hand-off from 0.36 to 0.44
  // Sequential card fly-up transitions from 0.44 to 0.88
  // Final card rests in spotlight from 0.88 to 0.94
  // Smooth exit to concluding section past 0.94
  const stackStart = 0.44;
  const stackEnd = 0.88;
  const cardDuration = (stackEnd - stackStart) / (total - 1); // ~0.11 per card

  const cStart = stackStart + index * cardDuration;
  const cEnd = cStart + cardDuration;
  const isLastCard = index === total - 1;

  // Stacking z-index: First cards on top, so when they fly up they reveal cards below
  const baseZIndex = total - index + 10;

  // Alternate tilt angle: -7deg or +7deg exactly as in YAAS Energy (xt = 7)
  const flyRotate = index % 2 === 0 ? -7 : 7;

  // Y position: Exact 0% in resting stack (dead center, zero bottom cut-off), then flies up to -125%
  const y = useTransform(smoothScroll, (p) => {
    if (p >= cStart && !isLastCard) {
      const flyP = Math.min(1, Math.max(0, (p - cStart) / cardDuration));
      const eased = flyP < 0.5 ? 2 * flyP * flyP : 1 - Math.pow(-2 * flyP + 2, 2) / 2;
      return `${eased * -125}%`;
    }
    return '0%';
  });

  // Scale: Stack depth scale (1.0 -> 0.965 -> 0.93...) creating an authentic physical deck
  const scale = useTransform(smoothScroll, (p) => {
    if (p >= cStart && !isLastCard) return 1;
    const cardsAheadFlown = p <= stackStart ? 0 : Math.min(index, (p - stackStart) / cardDuration);
    const depth = Math.max(0, index - cardsAheadFlown);
    return Math.max(0.85, 1.0 - depth * 0.035);
  });

  // Rotation: 0 while sitting in the stack, tilts dynamically as it flies upwards
  const rotate = useTransform(smoothScroll, (p) => {
    if (isLastCard) return 0;
    if (p < cStart) return 0;
    if (p > cEnd) return flyRotate;
    const progress = (p - cStart) / cardDuration;
    return progress * flyRotate;
  });

  // Opacity: Full in stack, fades out only towards the end of its upward fly
  const opacity = useTransform(smoothScroll, (p) => {
    if (isLastCard) return 1;
    if (p < cStart) {
      const cardsAheadFlown = p <= stackStart ? 0 : Math.min(index, (p - stackStart) / cardDuration);
      const depth = Math.max(0, index - cardsAheadFlown);
      return Math.max(0.5, 1.0 - depth * 0.12);
    }
    if (p > cEnd) return 0;
    const progress = (p - cStart) / cardDuration;
    if (progress < 0.65) return 1;
    return Math.max(0, 1 - (progress - 0.65) / 0.35);
  });

  // Filter: Cards deeper in stack have slight shadow/dim to accentuate the top card
  const filter = useTransform(smoothScroll, (p) => {
    if (isLastCard && p >= stackEnd) return 'brightness(1)';
    const cardsAheadFlown = p <= stackStart ? 0 : Math.min(index, (p - stackStart) / cardDuration);
    const depth = Math.max(0, index - cardsAheadFlown);
    const brightness = Math.max(0.70, 1.0 - depth * 0.07);
    return `brightness(${brightness})`;
  });

  return (
    <motion.article
      style={{
        y,
        scale,
        rotate,
        opacity,
        filter,
        zIndex: baseZIndex,
      }}
      className="absolute inset-0 m-auto w-full h-full rounded-[20px] sm:rounded-[28px] overflow-hidden bg-[#070b16] border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.85)] cursor-default select-none group"
    >
      {/* Edge-to-Edge Project Screenshot (100% Identical to Zoom Card) */}
      {project.isMobile ? (
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#0b1329] to-[#040711]">
          <div
            className="absolute inset-0 pointer-events-none opacity-25"
            style={{
              background: `radial-gradient(circle at center, ${project.accentColor || '#14b8a6'} 0%, transparent 70%)`,
            }}
          />
          <img
            src={project.thumbnail}
            alt={project.title}
            className="relative z-10 w-auto h-full max-h-[92%] object-contain py-2 drop-shadow-[0_15px_35px_rgba(0,0,0,0.9)]"
          />
        </div>
      ) : (
        <img
          src={project.thumbnail}
          alt={project.title}
          className="object-cover object-top absolute h-full w-full inset-0 rounded-[20px] sm:rounded-[28px]"
        />
      )}

      {/* Title overlay: mobile-friendly (always visible on mobile, smooth hover on desktop) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 flex flex-col justify-end p-4 sm:p-7">
        <h3
          className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-black tracking-tight text-white select-none whitespace-normal leading-[1.15] drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)] truncate"
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            letterSpacing: "-0.025em",
          }}
        >
          {project.title}
        </h3>
      </div>
    </motion.article>
  );
}

export default Projects;
