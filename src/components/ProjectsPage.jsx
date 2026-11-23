// src/components/ProjectsPage.jsx
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
import Navbar from './Navbar';
import Footer from './Footer';

// Project Screenshots
import iotImage from '../assets/iot-tracker.png';
import rosaStoreImage from '../assets/rosa-store.png';
import fishAiImage from '../assets/fish-ai.png';
import iwakmartImage from '../assets/iwakmart-mobile.jpg';
import portokuImage from '../assets/web-portfolio.jpeg';

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

function ProjectsPage() {
  const containerRef = useRef(null);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardWidth, cardHeight, targetWidth, targetHeight]);

  return (
    <div className="text-white min-h-screen relative bg-[#060a17] selection:bg-[#FFD500]/20 selection:text-[#FFD500] overflow-x-clip">
      {/* Universal Classic Space Backdrop (Harmonized with Home, About, Contact & Loading) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 90% 65% at 75% 35%, rgba(0, 85, 191, 0.22), transparent 70%),
              radial-gradient(ellipse 70% 55% at 20% 30%, rgba(255, 213, 0, 0.10), transparent 65%),
              radial-gradient(circle 850px at 50% 115%, rgba(14, 165, 233, 0.10), transparent 70%),
              linear-gradient(180deg, #060a17 0%, #0a0e22 55%, #040711 100%)
            `,
          }}
        />

        {/* Universal Twinkling Space Stars Field */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-60"
          style={{
            backgroundImage: `
              radial-gradient(1px 1px at 25px 35px, #ffffff, rgba(0,0,0,0)),
              radial-gradient(1.5px 1.5px at 120px 80px, #ffffff, rgba(0,0,0,0)),
              radial-gradient(1px 1px at 240px 190px, #ffd500, rgba(0,0,0,0)),
              radial-gradient(2px 2px at 380px 120px, #61dafb, rgba(0,0,0,0)),
              radial-gradient(1px 1px at 490px 310px, #ffffff, rgba(0,0,0,0)),
              radial-gradient(1.5px 1.5px at 620px 220px, #ffffff, rgba(0,0,0,0)),
              radial-gradient(1px 1px at 750px 90px, #ffd500, rgba(0,0,0,0)),
              radial-gradient(2px 2px at 890px 270px, #ffffff, rgba(0,0,0,0)),
              radial-gradient(1px 1px at 1020px 150px, #61dafb, rgba(0,0,0,0)),
              radial-gradient(1.5px 1.5px at 1180px 320px, #ffffff, rgba(0,0,0,0)),
              radial-gradient(1px 1px at 1310px 180px, #ffffff, rgba(0,0,0,0)),
              radial-gradient(1.5px 1.5px at 1410px 70px, #ffd500, rgba(0,0,0,0))
            `,
            backgroundSize: '1440px 420px'
          }}
        />

        {/* Stylized Classic Space Celestial Planet (Top-Right) */}
        <div 
          className="absolute top-10 -right-20 md:right-4 w-72 h-72 md:w-96 md:h-96 rounded-full pointer-events-none opacity-50 md:opacity-60"
          style={{
            background: 'radial-gradient(circle at 35% 35%, rgba(0, 240, 255, 0.85) 0%, rgba(0, 85, 191, 0.8) 45%, rgba(121, 40, 202, 0.85) 75%, rgba(255, 0, 128, 0.7) 100%)',
            boxShadow: '0 0 55px rgba(0, 240, 255, 0.28), inset -20px -20px 40px rgba(0, 0, 0, 0.85), inset 15px 15px 30px rgba(255, 255, 255, 0.35)',
            transform: 'translateZ(0)',
          }}
        >
          <div 
            className="absolute inset-0 rounded-full opacity-30"
            style={{
              background: 'radial-gradient(ellipse at 70% 30%, rgba(255, 255, 255, 0.8) 0%, transparent 60%)'
            }}
          />
        </div>
      </div>
      
      <div className="relative z-10">
        <Navbar />
        
        <main>
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
                          willChange: 'transform, opacity',
                        }}
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-default select-none group"
                      >
                        <div className="relative w-full h-full rounded-[16px] sm:rounded-[22px] overflow-hidden bg-[#070b16] border border-white/20 shadow-[0_16px_40px_rgba(0,0,0,0.85)]">
                          {project.isMobile ? (
                            <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#0b1329] to-[#040711]">
                              <div
                                className="absolute inset-0 pointer-events-none opacity-20"
                                style={{
                                  background: `radial-gradient(circle at center, ${project.accentColor || '#14b8a6'} 0%, transparent 70%)`,
                                }}
                              />
                              <img
                                src={project.thumbnail}
                                alt={project.title}
                                className="relative z-10 w-auto h-full max-h-[92%] object-contain py-2 drop-shadow-[0_12px_28px_rgba(0,0,0,0.85)]"
                              />
                            </div>
                          ) : (
                            <img
                              src={project.thumbnail}
                              alt={project.title}
                              className="object-cover object-top absolute h-full w-full inset-0 rounded-[16px] sm:rounded-[22px]"
                            />
                          )}

                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 flex flex-col justify-end p-4 sm:p-5">
                            <span className="text-[#FFD500] font-mono text-[10px] tracking-wider uppercase font-semibold">
                              {project.category}
                            </span>
                            <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
                              {project.title}
                            </h3>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* ── MIDDLE SECTION 2: STACKED ISO CARD DECK (Scroll 36% to 92%) ── */}
                <div
                  ref={stackedContainerRef}
                  className="absolute inset-0 m-auto flex items-center justify-center pointer-events-none select-none z-30"
                  style={{
                    width: `${targetWidth}px`,
                    height: `${targetHeight}px`,
                    opacity: 0,
                    visibility: 'hidden',
                  }}
                >
                  <div className="relative w-full h-full">
                    {projectSets.map((project, index) => (
                      <StackedIsoCard
                        key={project.id}
                        project={project}
                        index={index}
                        total={projectSets.length}
                        smoothScroll={smoothScroll}
                      />
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </section>
        </main>

        <div className="relative z-20">
          <Footer />
        </div>
      </div>
    </div>
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
}) {
  const stackStart = 0.44;
  const stackEnd = 0.88;
  const totalSlots = total - 1;
  const slotDuration = (stackEnd - stackStart) / totalSlots;

  const cardStart = stackStart + index * slotDuration;
  const cardEnd = cardStart + slotDuration;

  const yProgress = useTransform(smoothScroll, (sp) => {
    if (index === total - 1) return 0;
    if (sp < cardStart) return 0;
    if (sp > cardEnd) return -120;
    const progress = (sp - cardStart) / slotDuration;
    const eased = Math.pow(progress, 2.2);
    return -eased * 120;
  });

  const opacityProgress = useTransform(smoothScroll, (sp) => {
    if (index === total - 1) return 1;
    if (sp < cardStart) return 1;
    if (sp > cardEnd) return 0;
    const progress = (sp - cardStart) / slotDuration;
    return 1 - Math.pow(progress, 1.8);
  });

  const rotateProgress = useTransform(smoothScroll, (sp) => {
    if (index === total - 1) return 0;
    if (sp < cardStart) return 0;
    if (sp > cardEnd) return index % 2 === 0 ? -4 : 4;
    const progress = (sp - cardStart) / slotDuration;
    return progress * (index % 2 === 0 ? -4 : 4);
  });

  const zIndexVal = total - index;

  return (
    <motion.article
      style={{
        zIndex: zIndexVal,
        y: yProgress,
        opacity: opacityProgress,
        rotate: rotateProgress,
        willChange: 'transform, opacity',
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

export default ProjectsPage;
