import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { FaFilePdf, FaDownload } from 'react-icons/fa';
import Footer from './Footer';
import SpaceBackground, { ClassicSpaceHoloInsignia } from './SpaceBackground';
import fotoProfilCutout from '../assets/fotoku-removebg-preview.png';

const loadSkillsKeyboard = () => import('./SkillsKeyboard');
const SkillsKeyboard = lazy(loadSkillsKeyboard);

/**
 * ProfilePortrait — Pure Zero-G Floating Cutout
 */
function ProfilePortrait({ scrollYProgress, enableTilt = true }) {
  const containerRef = useRef(null);

  // Mouse tilt tracking (desktop only)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Buttery spring dampening
  const springX = useSpring(mouseX, { stiffness: 180, damping: 22 });
  const springY = useSpring(mouseY, { stiffness: 180, damping: 22 });

  // Portrait 3D subtle tilt
  const portraitRotateX = useTransform(springY, [-150, 150], [6, -6]);
  const portraitRotateY = useTransform(springX, [-150, 150], [-7, 7]);

  // Zero-G Astronaut Drift
  const portraitDriftY = useTransform(scrollYProgress, [0, 0.45], [0, -50]);
  const portraitDriftScale = useTransform(scrollYProgress, [0, 0.35], [1, 1.025]);

  const handleMouseMove = (e) => {
    if (!enableTilt || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    if (!enableTilt) return;
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={enableTilt ? handleMouseMove : undefined}
      onMouseLeave={enableTilt ? handleMouseLeave : undefined}
      className="relative w-full max-w-[320px] sm:max-w-[360px] flex flex-col items-center justify-center select-none py-2"
      style={enableTilt ? { perspective: 1200 } : undefined}
    >
      <motion.div
        style={enableTilt ? {
          y: portraitDriftY,
          scale: portraitDriftScale,
          rotateX: portraitRotateX,
          rotateY: portraitRotateY,
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        } : {
          y: portraitDriftY,
          scale: portraitDriftScale,
          willChange: 'transform',
        }}
        className="relative flex items-center justify-center group"
      >
        {/* Soft Ambient Cosmic Backlight Glow (pure multi-stop radial, zero blur-3xl GPU overhead) */}
        <div
          className="absolute -inset-12 rounded-full pointer-events-none opacity-65 group-hover:opacity-90 transition-opacity duration-700"
          style={{
            background: 'radial-gradient(ellipse 65% 60% at 50% 45%, rgba(56,189,248,0.22) 0%, rgba(255,213,0,0.08) 38%, rgba(0,85,191,0.04) 62%, transparent 76%)',
          }}
        />

        {/* Transparent Cutout Container (zero alpha drop-shadow pass on mobile touch screens) */}
        <div
          className="relative w-[235px] sm:w-[265px] lg:w-[285px] pointer-events-auto md:drop-shadow-[0_20px_35px_rgba(0,0,0,0.95)] transition-transform duration-500"
          style={{
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 82%, transparent 100%)',
            maskImage: 'linear-gradient(to bottom, black 0%, black 82%, transparent 100%)',
          }}
        >
          <img
            src={fotoProfilCutout}
            alt="Aprileo Erlangga - Fullstack Developer"
            decoding="async"
            className="w-full h-auto object-contain select-none group-hover:scale-[1.03] transition-transform duration-700 ease-out"
          />
        </div>
      </motion.div>
    </div>
  );
}

/**
 * AboutPage — Cohesive Classic Space Cosmic Background
 * (100% harmonized with Home: Deep Obsidian Void #060814 + Multi-Depth Starlight + Lunar Crater Terrain)
 * 
 * Design Philosophy:
 * - ZERO AI-Slop: Zero rotating radars, zero fake CAD labels, zero distracting flashlights.
 * - 100% Cohesive with Home: Shares the exact palette (#060814), starlight density, and visual DNA.
 * - High Reading Comfort: Deep, serene space void providing effortless contrast for text and photo.
 * - Grounded Lunar Horizon: Anchors the bottom of the page where the Skills Keyboard lives.
 */
function AboutPage() {
  const { scrollYProgress } = useScroll();
  const [shouldMountSkills, setShouldMountSkills] = useState(false);
  const [isDesktop, setIsDesktop] = useState(
    () => (typeof window !== 'undefined' ? window.innerWidth >= 768 : true)
  );

  // Track viewport breakpoint & defer Act 2 (24 shadowed keycaps + SVGs) until after shatter transition
  useEffect(() => {
    const syncDesktop = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', syncDesktop);

    const delay = window.innerWidth < 768 ? 460 : 200;
    const timer = setTimeout(() => {
      loadSkillsKeyboard();
      setShouldMountSkills(true);
    }, delay);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', syncDesktop);
    };
  }, []);

  return (
    <div className="text-white min-h-screen min-h-[100dvh] relative bg-[#060814] selection:bg-[#FFD500]/20 selection:text-[#FFD500] overflow-x-clip">

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* UNIFIED CLASSIC SPACE COSMIC BACKGROUND & PARALLAX EXPEDITION         */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <SpaceBackground variant="about" scrollYProgress={scrollYProgress} />

      {/* Foreground Content */}
      <div className="relative z-10">
        <main>
          {/* ============================================================ */}
          {/* ACT 1: MASTER BUILDER PROFILE (Full Initial Viewport Hero)   */}
          {/* ============================================================ */}
          <section id="about" className="bg-transparent text-slate-200 overflow-x-clip relative">
            <div className="min-h-[calc(100vh-4.5rem)] min-h-[calc(100dvh-4.5rem)] flex flex-col justify-center max-w-5xl mx-auto px-6 sm:px-10 lg:px-12 w-full pt-24 sm:pt-28 lg:pt-32 pb-16 sm:pb-20 relative z-20">

              {/* Header Title */}
              <motion.div
                initial={{ opacity: 0, y: -14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center justify-center mb-10 sm:mb-12 lg:mb-14 text-center select-none"
              >
                <h2
                  className="font-pixel font-bold text-3xl sm:text-4xl md:text-5xl tracking-wide text-white uppercase select-none"
                >
                  ABOUT <span className="text-[#FFD500] drop-shadow-[0_0_25px_rgba(255,213,0,0.5)]">ME</span>
                </h2>
              </motion.div>

              {/* Bio & Profile Photo Grid — Natural Scroll Flow (Mobile: Foto di atas teks, Desktop: Teks di kiri, Foto di kanan) */}
              <div
                className="flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-10 lg:gap-14 relative z-20"
              >

                {/* SISI KIRI (Desktop) / BAWAH FOTO (Mobile): CLEAN STORYTELLING TYPOGRAPHY */}
                <div className="w-full lg:w-7/12 flex flex-col justify-center relative order-2 lg:order-1">
                  {/* ══════════════════════════════════════════════════════════════════════════ */}
                  {/* ANIMASI BACKGROUND KIRI: DILUAR TEKS & PERSIS DI TENGAH TINGGI TEKS       */}
                  {/* - `right-full`: Seluruh elemen berada 100% di luar batas kiri teks        */}
                  {/* - `mr-6 sm:mr-8 lg:mr-12 xl:mr-16`: Jarak bebas agar membaca nyaman      */}
                  {/* - `top-1/2 -translate-y-1/2`: Terkunci persis di tengah tinggi bio       */}
                  {/* ══════════════════════════════════════════════════════════════════════════ */}
                  <motion.div
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 0.72, x: 0 }}
                    transition={{ duration: 0.45, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute top-1/2 -translate-y-1/2 right-full mr-5 xl:mr-14 pointer-events-none z-0 select-none hidden lg:block"
                    aria-hidden="true"
                  >
                    <ClassicSpaceHoloInsignia className="w-20 xl:w-28 h-20 xl:h-28 opacity-80" />
                  </motion.div>

                  {/* Clean Flowing Paragraphs — Editorial Line-Height & Letter-Spacing */}
                  <div className="space-y-5 text-slate-200 leading-[1.8] sm:leading-[1.85] tracking-[0.015em] font-sans text-base sm:text-[16.5px] relative z-10">
                    <motion.p
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.04, ease: [0.22, 1, 0.36, 1] }}
                    >
                      Hi, I'm Aprileo Muhammad David Erlangga! I grew up in Lamongan, a small city full of inspiration and natural beauty that sparked my lifelong curiosity about technology and digital craftsmanship.
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                    >
                      Through continuous learning and hands-on experience, I developed a passion for software development and building digital solutions. Today, as a Fullstack Developer, I focus on creating scalable web applications with efficient functionality and thoughtful user experiences.
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
                    >
                      I'm passionate about transforming ideas into meaningful digital products — one brick of code at a time.
                    </motion.p>
                  </div>

                  {/* Actions Row */}
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.38,
                      delay: 0.22,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="pt-5 sm:pt-6 flex flex-wrap items-center gap-4 relative z-10"
                  >
                    <a 
                      href="/resume.pdf?v=20261128" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group relative inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-[#FFD500] hover:bg-[#FFE033] text-zinc-950 font-sans font-semibold text-xs sm:text-sm tracking-wide border-t border-white/60 shadow-[0_2px_0_0_#C99700,0_4px_14px_rgba(255,213,0,0.2)] hover:shadow-[0_2px_0_0_#C99700,0_8px_20px_rgba(255,213,0,0.3)] active:translate-y-[2px] active:shadow-none transform hover:-translate-y-0.5 transition-all duration-150 overflow-hidden whitespace-nowrap"
                    >
                      <FaFilePdf className="text-red-700 text-sm flex-shrink-0" />
                      <span className="leading-none">My Resume</span>
                      <FaDownload className="text-[11px] text-zinc-800 opacity-70 group-hover:opacity-100 group-hover:translate-y-0.5 transition-all duration-150 flex-shrink-0" />
                    </a>
                  </motion.div>
                </div>

                {/* SISI KANAN (Desktop) / ATAS TEKS (Mobile): PROFILE PORTRAIT */}
                <motion.div
                  className="w-full lg:w-5/12 flex justify-center lg:justify-start items-center relative lg:-ml-8 xl:-ml-14 order-1 lg:order-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.44, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
                >
                  <ProfilePortrait scrollYProgress={scrollYProgress} enableTilt={isDesktop} />
                </motion.div>
              </div>
            </div>

            {/* ============================================================ */}
            {/* ACT 2: SKILLS SECTION: 3D MECHANICAL KEYBOARD MATRIX          */}
            {/* ============================================================ */}
            <div className="relative z-20 pt-10 sm:pt-20 lg:pt-24 pb-20 sm:pb-28 min-h-[520px] sm:min-h-[580px]">
              {shouldMountSkills ? (
                <Suspense fallback={<div className="min-h-[420px]" aria-hidden="true" />}>
                  <SkillsKeyboard />
                </Suspense>
              ) : (
                <div className="min-h-[420px]" aria-hidden="true" />
              )}
            </div>

          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default AboutPage;
