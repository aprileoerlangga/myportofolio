// src/components/ProjectsPage.jsx
// Complete 1:1 Implementation of YAAS Energy (yaas-energy.com) Scroll Experience
// Part 1: 3D Cylindrical Arc Carousel (Spin & Zoom)
// Part 2: Isometric Stacking Cards (Scroll down -> cards fly up one by one revealing next project)

import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import {
  motion,
  useScroll,
  useMotionValueEvent,
} from 'framer-motion';
import Footer from './Footer';
import SpaceBackground from './SpaceBackground';

// Project Screenshots & Enhanced Studio Showcases (Optimized sizes for fast mobile/desktop decode)
import fishAiShowcase from '../assets/fish-ai-showcase-opt.jpg';
import rosaStoreShowcase from '../assets/rosa-store-showcase-opt.jpg';
import iwakmartShowcase from '../assets/iwakmart-showcase-opt.jpg';
import iotImage from '../assets/iot-tracker-opt.jpg';
import portokuImage from '../assets/web-portfolio-opt.jpg';

// The 5 Portfolio Projects
const projectSets = [
  {
    id: 1,
    title: 'Fish AI Diagnosa',
    year: '2024',
    category: 'APLIKASI MOBILE',
    description:
      'Aplikasi mobile untuk mendiagnosis penyakit ikan dan udang berdasarkan gejala yang dipilih beserta saran penanganannya.',
    link: 'https://github.com/aprileoerlangga/FishAI.git',
    thumbnail: fishAiShowcase,
    hasStudioRender: true,
    tags: ['Flutter', 'FastAPI'],
    accentColor: '#14b8a6',
  },
  {
    id: 2,
    title: 'Rosa Store E-Commerce Handphone',
    year: '2024',
    category: 'WEB E-COMMERCE',
    description:
      'Website e-commerce penjualan handphone dengan katalog produk, manajemen keranjang belanja, checkout, dan sistem autentikasi pengguna.',
    link: 'https://github.com/aprileoerlangga/ecommerce-handphone.git',
    thumbnail: rosaStoreShowcase,
    hasStudioRender: true,
    tags: ['React', 'Node.js', 'Tailwind CSS'],
    accentColor: '#38bdf8',
  },
  {
    id: 3,
    title: 'IwakMart Mobile App',
    year: '2025',
    category: 'MOBILE E-COMMERCE',
    description:
      'Aplikasi mobile e-commerce ikan segar yang menghubungkan penjual perikanan langsung dengan pembeli lewat katalog dan pemesanan.',
    link: 'https://github.com/aprileoerlangga',
    thumbnail: iwakmartShowcase,
    hasStudioRender: true,
    tags: ['Flutter', 'Firebase'],
    accentColor: '#3b82f6',
  },
  {
    id: 4,
    title: 'IoT GPS Tracker Tas',
    year: '2025',
    category: 'IOT HARDWARE & WEB TRACKING',
    description:
      'Perangkat IoT tracker tas berbasis GPS yang terintegrasi dengan tampilan web untuk memantau dan mengetahui lokasi tas secara real-time.',
    link: 'https://github.com/aprileoerlangga/GPSTrackerBag.git',
    thumbnail: iotImage,
    hasStudioRender: false,
    tiltDirection: 'left',
    tags: ['C++', 'IoT GPS', 'Google Maps API'],
    accentColor: '#06b6d4',
  },
  {
    id: 5,
    title: 'Portofolio',
    year: '2026',
    category: 'WEB PORTOFOLIO',
    description:
      'Website portofolio pribadi bertema Classic Space dengan integrasi karakter 3D interaktif untuk menampilkan profil, keahlian, dan proyek.',
    link: 'https://github.com/aprileoerlangga/my-portofolio.git',
    thumbnail: portokuImage,
    hasStudioRender: false,
    tiltDirection: 'right',
    tags: ['React', 'Three.js', 'Framer Motion'],
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
const Ye = 0.72;
const ZOOM_START = 0.50;
const ir = 1.2;

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
  const arcCardsContainerRef = useRef(null);
  const cardRefs = useRef([]);
  const centerHoverRef = useRef(null);
  const centerTitleRef = useRef(null);
  const stackedContainerRef = useRef(null);
  const stackedCardRefs = useRef([]);
  const arcActiveRef = useRef(true);
  const mountStackedRef = useRef(false);

  const [mountStacked, setMountStacked] = useState(false);
  const [isMobile, setIsMobile] = useState(
    () => (typeof window !== 'undefined' ? window.innerWidth < 768 : false)
  );
  const [windowDimensions, setWindowDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  });

  // Track window dimensions and resize (ignore minor mobile browser URL-bar height shifts to prevent mid-scroll re-renders)
  useEffect(() => {
    const syncLayout = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setIsMobile(w < 768);
      setWindowDimensions((prev) => {
        if (prev.width === w && Math.abs(prev.height - h) < 120) {
          return prev;
        }
        return { width: w, height: h };
      });
    };
    syncLayout();
    window.addEventListener('resize', syncLayout);
    window.addEventListener('orientationchange', syncLayout);
    return () => {
      window.removeEventListener('resize', syncLayout);
      window.removeEventListener('orientationchange', syncLayout);
    };
  }, []);

  // Scroll tracking driven directly by scrollYProgress (already silky-smoothed by Lenis on wheel
  // and native compositor inertia on trackpad/touch — eliminates double-spring lag)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Dimensions for Arc and Zoom Target - Proportion-locked so center card zooms purely via GPU scale() (zero width/height reflow)
  const targetWidth = isMobile
    ? Math.min(340, windowDimensions.width - 32)
    : Math.min(820, Math.max(600, windowDimensions.width * 0.56));
  const targetHeight = isMobile
    ? Math.min(300, Math.round(targetWidth * 0.82))
    : Math.min(520, Math.max(340, windowDimensions.height * 0.54));
  const cardWidth = isMobile
    ? Math.min(260, windowDimensions.width * 0.68)
    : Math.min(360, Math.max(280, windowDimensions.width * 0.22));
  const cardHeight = (cardWidth * targetHeight) / targetWidth;
  const centerBaseScale = cardWidth / targetWidth;
  const mobileArcCutoff = isMobile ? 2.35 : wt;

  // Initial downward arc offset so cards clear "MY PROJECTS" + subtitle cleanly,
  // smoothly interpolating back to 0px (true dead center) as the card zooms in.
  const arcOffsetY = windowDimensions.width >= 1024 ? 96 : windowDimensions.width >= 640 ? 80 : 52;

  // Pre-calculated initial positions at A = 0 (ue = 3) for instant zero-flicker render
  const initialStyles = React.useMemo(() => {
    const ue0 = TARGET_CENTER_INDEX - SPIN_CARDS_COUNT; // 3
    const te0 = sr * cardWidth;
    const ie0 = virtualCards.map((_, x) => x - ue0);
    const ne0 = dr(ie0, cardWidth, te0);

    return virtualCards.map((_, x) => {
      const h = ie0[x];
      const y = Math.abs(h);
      const scalePrefix = x === TARGET_CENTER_INDEX ? ` scale(${centerBaseScale})` : '';
      if (y > mobileArcCutoff) {
        return { opacity: 0, visibility: 'hidden', zIndex: 0, transform: `translate(-50%, -50%) scale(0)` };
      }
      const L = ne0[x];
      const j = Vt * cardWidth * Zt(h);
      const rotY = -h * Kt;
      const W = y <= Xe ? 1 : 1 - (y - Xe) / (wt - Xe);
      return {
        opacity: W,
        visibility: 'visible',
        zIndex: 10 - Math.min(5, Math.round(y)),
        transform: `translate(-50%, -50%) translate3d(${L}px, ${arcOffsetY}px, 0) perspective(${te0}px) translateZ(${j}px) rotateY(${rotY}deg)${scalePrefix}`,
      };
    });
  }, [cardWidth, arcOffsetY, centerBaseScale, mobileArcCutoff]);

  // ════════════════════════════════════════════════════════════════════════════
  // DIRECT HIGH-PERFORMANCE DOM STYLE UPDATES (Locked 60/120 FPS, No React lag)
  // ════════════════════════════════════════════════════════════════════════════
  const updateVisuals = (scrollP) => {
    // Mount Phase 2 stacked cards slightly before the 0.34 hand-off so initial /projects entry stays lightweight
    if (scrollP >= 0.12 && !mountStackedRef.current) {
      mountStackedRef.current = true;
      setMountStacked(true);
    }

    // ──────────────────────────────────────────────────────────────────────────
    // PHASE 1: ARC STAGE (scrollP from 0.00 to 0.34)
    // Smooth overlapping transition: spin winds down (0..0.72) as zoom starts (0.50..1.0)
    // ──────────────────────────────────────────────────────────────────────────
    const arcPhaseMax = 0.34;
    const arcNormalized = Math.max(0, Math.min(1, scrollP / arcPhaseMax));

    const S = vt(Te(arcNormalized / Ye));
    const Z = Te((arcNormalized - ZOOM_START) / (1 - ZOOM_START));
    const ue = TARGET_CENTER_INDEX - SPIN_CARDS_COUNT * (1 - S);
    const z = Te(Z * ir);
    const se = String(Math.max(0, 1 - z));

    // GPU-only Headline fade & upward glide (zero expensive blur repaints)
    if (headlineRef.current) {
      headlineRef.current.style.opacity = se;
      headlineRef.current.style.transform = `translate3d(0, ${-z * 22}px, 0)`;
    }

    // Update 3D Cylindrical Arc cards ONLY while arc container is visible
    if (scrollP <= 0.39 || arcActiveRef.current) {
      const te = sr * cardWidth;
      const ie = virtualCards.map((_, x) => x - ue);
      const ne = dr(ie, cardWidth, te);

      virtualCards.forEach((_, x) => {
        const cardEl = cardRefs.current[x];
        if (!cardEl) return;

        const h = ie[x];
        const y = Math.abs(h);

        if (y > mobileArcCutoff) {
          if (cardEl.style.visibility !== 'hidden') {
            cardEl.style.opacity = '0';
            cardEl.style.visibility = 'hidden';
          }
          return;
        }

        if (cardEl.style.visibility !== 'visible') {
          cardEl.style.visibility = 'visible';
        }

        const isTargetCenter = x === TARGET_CENTER_INDEX;
        const L = ne[x];
        const j = Vt * cardWidth * Zt(h);
        const rotY = -h * Kt;
        const W = y <= Xe ? 1 : 1 - (y - Xe) / (wt - Xe);

        if (isTargetCenter) {
          const H = vt(Z);
          const currScale = yt(centerBaseScale, 1, H);
          const currY = arcOffsetY * (1 - H);
          cardEl.style.opacity = String(W);
          cardEl.style.zIndex = '30';
          cardEl.style.transform = `translate(-50%, -50%) translate3d(${L * (1 - H)}px, ${currY}px, 0) perspective(${te}px) translateZ(${j * (1 - H)}px) rotateY(${rotY * (1 - H)}deg) scale(${currScale})`;

          if (centerTitleRef.current) {
            centerTitleRef.current.style.opacity = String(H);
          }
          if (centerHoverRef.current) {
            centerHoverRef.current.style.opacity = Z > 0.01 ? String(Math.max(0, 1 - H * 2.5)) : '';
          }
        } else {
          // Pure compositor transforms on side cards (no width/height reflow or blur repaints)
          const sideScale = 1 - z * 0.06;
          cardEl.style.opacity = String(Math.max(0, W * (1 - z)));
          cardEl.style.zIndex = String(10 - Math.min(5, Math.round(y)));
          cardEl.style.transform = `translate(-50%, -50%) translate3d(${L}px, ${arcOffsetY}px, 0) perspective(${te}px) translateZ(${j}px) rotateY(${rotY}deg) scale(${sideScale})`;
        }
      });

      arcActiveRef.current = scrollP <= 0.39;
    }

    // ──────────────────────────────────────────────────────────────────────────
    // PHASE 2: SEAMLESS 1:1 HAND-OFF TO STACKED DECK (0.34 -> 0.94)
    // Directly drives card CSS transforms on GPU without 25 React Motion callbacks
    // ──────────────────────────────────────────────────────────────────────────
    if (arcCardsContainerRef.current) {
      if (scrollP > 0.38) {
        arcCardsContainerRef.current.style.opacity = '0';
        arcCardsContainerRef.current.style.pointerEvents = 'none';
        arcCardsContainerRef.current.style.visibility = 'hidden';
      } else if (scrollP > 0.34) {
        const fadeOut = 1 - (scrollP - 0.34) / 0.035;
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
      if (scrollP < 0.34) {
        stackedContainerRef.current.style.opacity = '0';
        stackedContainerRef.current.style.pointerEvents = 'none';
        stackedContainerRef.current.style.visibility = 'hidden';
      } else if (scrollP < 0.375) {
        const fadeIn = (scrollP - 0.34) / 0.035;
        stackedContainerRef.current.style.opacity = String(Math.min(1, fadeIn));
        stackedContainerRef.current.style.pointerEvents = scrollP >= 0.36 ? 'auto' : 'none';
        stackedContainerRef.current.style.visibility = 'visible';
      } else {
        stackedContainerRef.current.style.opacity = '1';
        stackedContainerRef.current.style.pointerEvents = 'auto';
        stackedContainerRef.current.style.visibility = 'visible';
      }
    }

    // Direct GPU updates for Stacked Cards only when Phase 2 is approaching or active
    if (scrollP >= 0.33) {
      const stackStart = 0.38;
      const stackEnd = 0.94;
      const total = projectSets.length;
      const slotDuration = (stackEnd - stackStart) / (total - 1);

      for (let i = 0; i < total; i++) {
        const el = stackedCardRefs.current[i];
        if (!el) continue;

        const cardStart = stackStart + i * slotDuration;
        const cardEnd = cardStart + slotDuration;
        const prevCardStart = stackStart + (i - 1) * slotDuration;

        let opacity = 1;
        if (i > 0) {
          if (scrollP <= prevCardStart) opacity = 0;
          else if (scrollP < prevCardStart + slotDuration * 0.12) {
            opacity = Te((scrollP - prevCardStart) / (slotDuration * 0.12));
          }
        }
        if (opacity > 0 && i < total - 1 && scrollP > cardStart) {
          if (scrollP >= cardEnd) opacity = 0;
          else {
            const p = (scrollP - cardStart) / slotDuration;
            opacity = 1 - vt(Te((p - 0.12) / 0.88));
          }
        }

        if (opacity <= 0.005) {
          if (el.style.visibility !== 'hidden') {
            el.style.opacity = '0';
            el.style.visibility = 'hidden';
            el.style.pointerEvents = 'none';
          }
          continue;
        }

        if (el.style.visibility !== 'visible') {
          el.style.visibility = 'visible';
        }

        let yPct = 0;
        let rotDeg = 0;
        if (i < total - 1 && scrollP > cardStart) {
          const dir = i % 2 === 0 ? -3.5 : 3.5;
          if (scrollP >= cardEnd) {
            yPct = -115;
            rotDeg = dir;
          } else {
            const eased = vt((scrollP - cardStart) / slotDuration);
            yPct = -eased * 115;
            rotDeg = eased * dir;
          }
        }

        let scale = 1;
        if (i > 0 && scrollP < cardStart) {
          if (scrollP <= prevCardStart) scale = 0.95;
          else scale = 0.95 + vt((scrollP - prevCardStart) / slotDuration) * 0.05;
        }

        el.style.opacity = String(opacity);
        el.style.pointerEvents = (i === total - 1 || scrollP < cardStart + slotDuration * 0.6) ? 'auto' : 'none';
        el.style.transform = `translate3d(0, ${yPct}%, 0) scale(${scale}) rotate(${rotDeg}deg)`;
      }
    }
  };

  // Attach Lenis-synced scroll event directly (zero double-spring lag)
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    updateVisuals(latest);
  });

  // Mount Phase 2 deck quietly after initial entrance settles (450ms) so route entry stays instant
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!mountStackedRef.current) {
        mountStackedRef.current = true;
        setMountStacked(true);
      }
    }, 450);
    return () => clearTimeout(timer);
  }, []);

  // Re-sync scroll transforms synchronously before paint whenever stacked phase mounts or layout changes
  useLayoutEffect(() => {
    arcActiveRef.current = true;
    updateVisuals(scrollYProgress.get());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mountStacked, cardWidth, cardHeight, targetWidth, targetHeight, arcOffsetY]);

  // Keep Lenis scroll bounds synced on viewport dimension changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.__lenis) {
      window.__lenis.resize();
    }
  }, [cardWidth, cardHeight, targetWidth, targetHeight, arcOffsetY]);

  return (
    <div className="text-white min-h-screen min-h-[100dvh] relative bg-[#060814] selection:bg-[#FFD500]/20 selection:text-[#FFD500] overflow-x-clip">
      {/* Unified Classic Space Cosmic Canvas (Opsi 2: Grounded Horizon — Kawah Bulan di Bawah) */}
      <SpaceBackground showCraters={true} />
      
      <div className="relative z-10">
        <main>
          <section id="projects" className="bg-transparent text-white relative">
            {/* ══════════════════════════════════════════════════════════════════════ */}
            {/* STICKY COMPREHENSIVE STAGE (YAAS Arc Spin -> Zoom -> Stacked Fly-Up)  */}
            {/* ══════════════════════════════════════════════════════════════════════ */}
            <div
              ref={containerRef}
              id="projects-stage"
              className="relative w-full h-[380vh] sm:h-[500vh] bg-transparent text-white"
            >
              {/* Sticky Viewport (100vh / 100dvh - Perfectly centered vertically across iOS & Android) */}
              <div className="sticky top-0 h-screen h-[100dvh] w-full flex items-center justify-center overflow-hidden select-none z-10 px-4">
                
                {/* ── TOP SECTION: YAAS Headline (Harmonized with About & Tech Stack) ── */}
                <div
                  ref={headlineRef}
                  className="absolute top-[max(6.5rem,19dvh)] sm:top-24 lg:top-28 inset-x-0 w-full flex flex-col items-center z-20 pointer-events-none text-center px-4 select-none"
                >
                  <motion.div
                    initial={{ opacity: 0, y: -14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-col items-center"
                  >
                    <h2
                      className="font-pixel font-bold text-3xl sm:text-4xl md:text-5xl tracking-wide text-white uppercase select-none"
                    >
                      MY <span className="text-[#FFD500] drop-shadow-[0_0_25px_rgba(255,213,0,0.5)]">PROJECTS</span>
                    </h2>
                    <p className="text-slate-300 font-sans text-xs sm:text-sm md:text-base font-normal mt-2.5 sm:mt-3 max-w-lg mx-auto leading-relaxed px-4">
                      Explore the digital products and experiments I've engineered with passion and precision.
                    </p>
                  </motion.div>
                </div>

                {/* ── MIDDLE SECTION 1: 3D CYLINDRICAL ARC STAGE (Dynamic Y offset -> dead-center zoom) ── */}
                <div
                  ref={arcCardsContainerRef}
                  className="relative flex-1 w-full h-full flex items-center justify-center min-h-0 z-10 pointer-events-auto"
                >
                  {virtualCards.map((project, idx) => {
                    // ue only sweeps [3..10] with cutoff wt=3.1, so indices > 13 are never visible
                    if (idx > 13) return null;

                    const init = initialStyles[idx] || {};
                    const initialCenter = TARGET_CENTER_INDEX - SPIN_CARDS_COUNT;
                    const distFromInitialCenter = Math.abs(idx - initialCenter);
                    const isInitiallyVisible = distFromInitialCenter <= 3;

                    const isTargetCard = idx === TARGET_CENTER_INDEX;

                    return (
                      <div
                        key={`${project.id}-${idx}`}
                        ref={(el) => (cardRefs.current[idx] = el)}
                        style={{
                          width: `${isTargetCard ? targetWidth : cardWidth}px`,
                          height: `${isTargetCard ? targetHeight : cardHeight}px`,
                          opacity: init.opacity ?? 0,
                          visibility: init.visibility ?? 'hidden',
                          zIndex: init.zIndex ?? 1,
                          transform: init.transform ?? 'translate(-50%, -50%)',
                          willChange: isTargetCard || isInitiallyVisible ? 'transform, opacity' : undefined,
                        }}
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-default select-none group"
                      >
                        <motion.div
                          initial={isInitiallyVisible ? { opacity: 0, y: 24, scale: 0.93 } : false}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{
                            duration: 0.58,
                            delay: isInitiallyVisible ? 0.12 + distFromInitialCenter * 0.055 : 0,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          className="relative w-full h-full rounded-[16px] sm:rounded-[22px] overflow-hidden bg-[#070b16] border border-white/20 shadow-[0_8px_20px_rgba(0,0,0,0.75)] sm:shadow-[0_16px_40px_rgba(0,0,0,0.85)]"
                        >
                          <ProjectCardVisual project={project} isMobile={isMobile} />

                          <div
                            ref={idx === TARGET_CENTER_INDEX ? centerHoverRef : undefined}
                            className="hidden sm:flex absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-30 flex-col justify-end p-4 sm:p-5"
                          >
                            <span className="text-[#FFD500] font-mono text-[10px] tracking-wider uppercase font-semibold">
                              {project.category}
                            </span>
                            <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
                              {project.title}
                            </h3>
                          </div>

                          {idx === TARGET_CENTER_INDEX && (
                            <div
                              ref={centerTitleRef}
                              style={{ opacity: 0 }}
                              className="absolute inset-x-0 bottom-0 z-30 pointer-events-none"
                            >
                              <ZoomedTitleOverlay project={project} />
                            </div>
                          )}
                        </motion.div>
                      </div>
                    );
                  })}
                </div>

                {/* ── MIDDLE SECTION 2: STACKED ISO CARD DECK (Dead-center viewport alignment) ── */}
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
                  {mountStacked && (
                    <div className="relative w-full h-full">
                      {projectSets.map((project, index) => (
                        <StackedIsoCard
                          key={project.id}
                          cardRef={(el) => (stackedCardRefs.current[index] = el)}
                          project={project}
                          index={index}
                          total={projectSets.length}
                          isMobile={isMobile}
                        />
                      ))}
                    </div>
                  )}
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
// SHARED PROJECT CARD VISUAL (Unified Dark Studio Showcase Presentation)
// Clean tilted studio framing matching the mobile showcase aesthetic (zero HUD clutter)
// ══════════════════════════════════════════════════════════════════════════════
function ProjectCardVisual({ project, isMobile = false }) {
  const accent = project.accentColor || '#38bdf8';

  if (project.hasStudioRender) {
    return (
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-[#070b16]">
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            background: `radial-gradient(ellipse 80% 70% at 50% 48%, ${accent}33 0%, transparent 72%)`,
          }}
        />
        <img
          src={project.thumbnail}
          alt={project.title}
          decoding="async"
          draggable={false}
          className="relative z-10 w-full h-full object-contain"
          style={isMobile ? undefined : {
            WebkitMaskImage:
              'radial-gradient(ellipse 96% 94% at 50% 50%, black 78%, transparent 100%)',
            maskImage:
              'radial-gradient(ellipse 96% 94% at 50% 50%, black 78%, transparent 100%)',
          }}
        />
        {isMobile && (
          <div
            className="absolute inset-0 pointer-events-none z-20"
            style={{
              background:
                'radial-gradient(ellipse 96% 94% at 50% 50%, transparent 76%, #070b16 100%)',
            }}
          />
        )}
      </div>
    );
  }

  const isLeftTilt = project.tiltDirection === 'left';
  const isTelemetry = project.id === 4;

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-[#070b16]">
      {/* Volumetric Dark Studio Backlight Halo */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 74% 62% at 50% 45%, ${accent}40 0%, rgba(14, 30, 64, 0.16) 46%, transparent 78%)`,
        }}
      />

      {/* Sleek 3D Angled Space-Black Laptop Studio Mockup (flattened transform on mobile to avoid nested preserve-3d lag) */}
      <div
        className="relative z-10 w-[82%] sm:w-auto sm:h-[72%] sm:max-w-[82%] aspect-[16/10] flex flex-col items-center"
        style={isMobile ? {
          transform: `translateY(-4%) rotate(${isLeftTilt ? -1 : 1}deg)`,
        } : {
          transform: `translateY(-6%) perspective(1400px) rotateY(${isLeftTilt ? -10 : 10}deg) rotateX(2.5deg) rotateZ(${isLeftTilt ? -0.5 : 0.5}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Laptop Screen Lid with Dark Titanium Rim */}
        <div
          className="relative w-full flex-1 p-[4px] sm:p-[6px] rounded-t-[10px] sm:rounded-t-[14px] rounded-b-[2px] bg-gradient-to-b from-[#1a2234] via-[#0c111d] to-[#080c16]"
          style={{
            border: `1px solid ${accent}48`,
            borderBottom: 'none',
            boxShadow: isMobile
              ? `0 8px 18px rgba(0, 0, 0, 0.78), inset 0 1px 0 rgba(255, 255, 255, 0.22)`
              : `0 20px 50px rgba(0, 0, 0, 0.92), 0 0 42px ${accent}30, inset 0 1px 0 rgba(255, 255, 255, 0.28)`,
          }}
        >
          {/* Inner Screen Glass */}
          <div className="relative w-full h-full rounded-[6px] sm:rounded-[9px] overflow-hidden bg-[#050811]">
            <img
              src={project.thumbnail}
              alt={project.title}
              decoding="async"
              draggable={false}
              className={`w-full h-full object-cover ${
                isTelemetry
                  ? 'object-top brightness-[1.06] contrast-[1.06] saturate-[1.16]'
                  : 'object-center brightness-[1.08] contrast-[1.05]'
              }`}
            />

            {/* Specular Glass Sheen Across Screen */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(125deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.015) 35%, transparent 62%, rgba(255,255,255,0.03) 100%)',
              }}
            />
          </div>
        </div>

        {/* Sleek Space-Black Aluminum Laptop Base Deck */}
        <div
          className="relative w-[112%] h-[7px] sm:h-[11px] rounded-t-[2px] rounded-b-[6px] sm:rounded-b-[9px] flex items-start justify-center flex-shrink-0"
          style={{
            background: 'linear-gradient(180deg, #64748b 0%, #334155 18%, #161e2e 65%, #080c16 100%)',
            boxShadow: isMobile
              ? '0 6px 14px rgba(0, 0, 0, 0.85)'
              : `0 12px 28px rgba(0, 0, 0, 0.96), 0 2px 18px ${accent}25`,
          }}
        >
          {/* Subtle Center Thumb-Open Notch */}
          <div className="w-[14%] h-[3px] sm:h-[4px] rounded-b-full bg-[#090d16]/85 border-b border-white/10" />
        </div>

        {/* Glossy Dark Studio Floor Reflection (desktop only; saves duplicate img & mask pass on mobile) */}
        {!isMobile && (
          <div
            className="absolute top-[calc(100%+7px)] inset-x-0 h-[28%] rounded-[10px] overflow-hidden opacity-20 pointer-events-none"
            style={{
              transform: 'scaleY(-1)',
              WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 82%)',
              maskImage: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 82%)',
            }}
          >
            <img
              src={project.thumbnail}
              alt=""
              decoding="async"
              draggable={false}
              className={`absolute bottom-0 left-0 w-full h-[357%] object-cover ${
                isTelemetry ? 'object-top' : 'object-center'
              }`}
            />
          </div>
        )}
      </div>

      {/* Smooth Outer Edge Vignette into #070b16 */}
      <div
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          boxShadow: isMobile ? 'inset 0 0 18px 4px #070b16' : 'inset 0 0 38px 10px #070b16',
        }}
      />
    </div>
  );
}

// Shared bottom title bar displayed automatically in zoom & stacked views
function ZoomedTitleOverlay({ project }) {
  return (
    <div className="inset-x-0 bottom-0 pt-10 pb-4 px-5 sm:pt-14 sm:pb-6 sm:px-7 bg-gradient-to-t from-[#050811]/95 via-[#050811]/70 to-transparent pointer-events-none flex flex-col justify-end">
      <span className="text-[#FFD500] font-mono text-[10px] sm:text-xs tracking-wider uppercase font-semibold mb-1">
        {project.category}
      </span>
      <h3
        className="text-base sm:text-2xl md:text-3xl font-black tracking-tight text-white select-none whitespace-normal leading-[1.15] drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]"
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          letterSpacing: '-0.025em',
        }}
      >
        {project.title}
      </h3>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 2. STACKED ISO CARD COMPONENT (Continuous Stacking Swipe: Scroll 38% to 94%)
// Evenly paced transitions with zero dead-zones and GPU depth emergence
// ══════════════════════════════════════════════════════════════════════════════
function StackedIsoCard({
  cardRef,
  project,
  index,
  total,
  isMobile = false,
}) {
  const zIndexVal = total - index;

  return (
    <article
      ref={cardRef}
      style={{
        zIndex: zIndexVal,
        opacity: index === 0 ? 1 : 0,
        visibility: index === 0 ? 'visible' : 'hidden',
        transform: index === 0 ? 'translate3d(0, 0%, 0) scale(1) rotate(0deg)' : 'translate3d(0, 0%, 0) scale(0.95) rotate(0deg)',
        willChange: 'transform, opacity',
      }}
      className="absolute inset-0 m-auto w-full h-full rounded-[20px] sm:rounded-[28px] overflow-hidden bg-[#070b16] border border-white/20 shadow-[0_12px_28px_rgba(0,0,0,0.75)] sm:shadow-[0_20px_50px_rgba(0,0,0,0.85)] cursor-default select-none group"
    >
      {/* Edge-to-Edge Project Showcase (Shared across Arc & Stacked Deck) */}
      <ProjectCardVisual project={project} isMobile={isMobile} />

      {/* Title overlay: always visible automatically in zoom/stacked position */}
      <div className="absolute inset-x-0 bottom-0 z-30 pointer-events-none">
        <ZoomedTitleOverlay project={project} />
      </div>
    </article>
  );
}

export default ProjectsPage;
