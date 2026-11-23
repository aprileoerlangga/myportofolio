import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaFilePdf, FaDownload } from 'react-icons/fa';
import Navbar from './Navbar';
import Footer from './Footer';
import AboutBackground from './AboutBackground';
import ProfilePortrait from './ProfilePortrait';
import QuotesSection from './QuotesSection';
import SkillsKeyboard from './SkillsKeyboard';

/**
 * AboutPage with High-Performance Scroll-Driven Background Transitions
 * (Hardware-accelerated, zero blur-filters, 120 FPS buttery smooth)
 * 
 * - Section 1 (Top Hero): Classic Space Deep Orbital Void (#060a17) with glowing planet & twinkling stars.
 * - Section 2 (Middle / Motivation): BOLD transition into Cosmic Dawn & Solar Amber Horizon (#1b0e36 to #251246).
 * - Section 3 (Bottom / Skills): High-contrast Lunar Command Deck (#02040a) with perspective cyber launchpad grid.
 */
function AboutPage() {
  const { scrollYProgress } = useScroll();

  // Zone 1: Active at top hero, smoothly dissolves as user scrolls into mid
  const bgZone1Opacity = useTransform(scrollYProgress, [0.12, 0.25], [1, 0]);

  // Zone 2: Cosmic Dawn & Solar Amber Horizon - peaks around Act 2 (Builder Creed Quotes 1, 2 & 3)
  const bgZone2Opacity = useTransform(scrollYProgress, [0.16, 0.26, 0.76, 0.86], [0, 1, 1, 0]);

  // Zone 3: Lunar Command Deck & Cyber Grid - takes over seamlessly at Act 3 (Tech Stack) through to Footer
  const bgZone3Opacity = useTransform(scrollYProgress, [0.76, 0.88], [0, 1]);

  // Planet Parallax: Smoothly recedes and dims into the distance as user leaves Hero into Creed
  const planetY = useTransform(scrollYProgress, [0, 0.6], [0, 220]);
  const planetScale = useTransform(scrollYProgress, [0, 0.6], [1, 0.75]);
  const planetOpacity = useTransform(scrollYProgress, [0, 0.22, 0.45], [0.90, 0.25, 0.0]);

  // Subtle storytelling typography parallax for bio
  const bioScrollY = useTransform(scrollYProgress, [0, 0.45], [0, -20]);

  return (
    <div className="text-white min-h-screen relative bg-[#060a17] selection:bg-[#FFD500]/20 selection:text-[#FFD500] overflow-x-clip">
      
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ZONE 1: CLASSIC SPACE DEEP ORBITAL VOID (Top Hero)                    */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <motion.div 
        className="fixed inset-0 z-0 pointer-events-none"
        style={{ opacity: bgZone1Opacity, willChange: 'opacity' }}
      >
        <div 
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle 950px at 80% 20%, rgba(0, 85, 191, 0.28), transparent 70%),
              radial-gradient(circle 850px at 15% 45%, rgba(121, 40, 202, 0.18), transparent 65%),
              radial-gradient(circle 1000px at 50% 90%, rgba(255, 213, 0, 0.10), transparent 70%),
              #060a17
            `
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
      </motion.div>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ZONE 2: COSMIC DAWN & SOLAR AMBER HORIZON (Middle Creed Quotes)       */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <motion.div 
        className="fixed inset-0 z-0 pointer-events-none"
        style={{ opacity: bgZone2Opacity, willChange: 'opacity' }}
      >
        <div 
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle 900px at 50% 35%, rgba(255, 170, 0, 0.24), transparent 70%),
              radial-gradient(circle 1100px at 15% 50%, rgba(227, 0, 11, 0.18), transparent 70%),
              radial-gradient(circle 1000px at 85% 55%, rgba(121, 40, 202, 0.22), transparent 70%),
              linear-gradient(180deg, #0d061a 0%, #1c0e35 40%, #2a1147 65%, #150928 100%)
            `
          }}
        />
        {/* Warm Solar Atmospheric Glow Strip */}
        <div 
          className="absolute inset-x-0 top-1/4 h-[500px] pointer-events-none opacity-30"
          style={{
            background: 'radial-gradient(ellipse 100% 60% at 50% 50%, rgba(255, 213, 0, 0.28) 0%, rgba(255, 107, 0, 0.12) 50%, transparent 80%)',
            transform: 'translateZ(0)'
          }}
        />
      </motion.div>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ZONE 3: LUNAR COMMAND DECK & CYBER LAUNCHPAD GRID (Bottom Skills)     */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <motion.div 
        className="fixed inset-0 z-0 pointer-events-none"
        style={{ opacity: bgZone3Opacity, willChange: 'opacity' }}
      >
        <div 
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle 1000px at 50% 90%, rgba(0, 85, 191, 0.35), transparent 75%),
              radial-gradient(circle 800px at 20% 75%, rgba(0, 240, 255, 0.16), transparent 70%),
              radial-gradient(circle 750px at 80% 80%, rgba(255, 213, 0, 0.12), transparent 70%),
              linear-gradient(180deg, #070311 0%, #030612 35%, #02040a 100%)
            `
          }}
        />

        {/* Perspective Cyber Launchpad Grid (Floor Deck of Skills Keyboard) */}
        <div 
          className="absolute inset-x-0 bottom-0 h-[480px] pointer-events-none opacity-35"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(0, 240, 255, 0.35) 1.5px, transparent 1.5px),
              linear-gradient(to bottom, rgba(255, 213, 0, 0.25) 1.5px, transparent 1.5px)
            `,
            backgroundSize: '54px 54px',
            maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.45) 45%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.45) 45%, transparent 100%)',
            transform: 'perspective(550px) rotateX(52deg)',
            transformOrigin: 'bottom center'
          }}
        />
      </motion.div>

      {/* Stylized Classic Space Celestial Planet (Top-Right Parallax) */}
      <motion.div 
        className="fixed top-8 -right-20 md:right-4 w-72 h-72 md:w-96 md:h-96 rounded-full pointer-events-none z-0"
        style={{
          y: planetY,
          scale: planetScale,
          opacity: planetOpacity,
          background: 'radial-gradient(circle at 35% 35%, rgba(0, 240, 255, 0.85) 0%, rgba(0, 85, 191, 0.8) 45%, rgba(121, 40, 202, 0.85) 75%, rgba(255, 0, 128, 0.7) 100%)',
          boxShadow: '0 0 55px rgba(0, 240, 255, 0.32), inset -20px -20px 40px rgba(0, 0, 0, 0.85), inset 15px 15px 30px rgba(255, 255, 255, 0.35)',
          transform: 'translateZ(0)',
          willChange: 'transform, opacity'
        }}
      >
        <div 
          className="absolute inset-0 rounded-full opacity-30"
          style={{
            background: 'radial-gradient(ellipse at 70% 30%, rgba(255, 255, 255, 0.8) 0%, transparent 60%)'
          }}
        />
      </motion.div>

      {/* Morphing Classic Space Lego 3D Scene (Background WebGL Layer) */}
      <AboutBackground />

      {/* Foreground Content */}
      <div className="relative z-10">
        <Navbar />
        
        <main>
          {/* ============================================================ */}
          {/* ACT 1: MASTER BUILDER PROFILE (Full Initial Viewport Hero)   */}
          {/* ============================================================ */}
          <section id="about" className="bg-transparent text-slate-200 overflow-x-clip relative">
            <div className="min-h-[calc(100vh-4.5rem)] min-h-[calc(100dvh-4.5rem)] flex flex-col justify-center max-w-5xl mx-auto px-6 sm:px-10 lg:px-12 w-full pt-16 sm:pt-20 pb-12 sm:pb-16 relative z-20">
              
              {/* Header Title */}
              <motion.div 
                initial={{ opacity: 0, y: -24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center justify-center mb-8 sm:mb-10 text-center"
              >
                <div className="flex flex-col items-center justify-center group cursor-pointer text-center" title="Aprileo Erlangga // Classic Space">
                  <h2 
                    className="font-pixel text-4xl sm:text-5xl md:text-6xl font-normal tracking-wider text-white uppercase select-none"
                    style={{ fontFamily: "'Arcadepix', monospace" }}
                  >
                    ABOUT <span className="text-[#FFD500] drop-shadow-[0_0_25px_rgba(255,213,0,0.5)]">ME</span>
                  </h2>
                </div>
              </motion.div>

              {/* Bio & Polaroid Photo Grid */}
              <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14 relative z-20">
                
                {/* SISI KIRI: BORDERLESS STORYTELLING TYPOGRAPHY */}
                <motion.div 
                  className="w-full lg:w-7/12 flex flex-col justify-center relative"
                  style={{ y: bioScrollY, willChange: 'transform' }}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* Clean Flowing Paragraphs */}
                  <div className="space-y-3.5 text-slate-300 leading-relaxed text-sm sm:text-base font-normal">
                    <p className="text-base sm:text-[17px] text-white font-normal leading-relaxed">
                      Hi, I'm <strong className="text-white font-semibold">Aprileo Muhammad David Erlangga</strong>! I grew up in Lamongan, a small city full of inspiration and natural beauty that sparked my lifelong curiosity about technology and digital craftsmanship.
                    </p>
                    <p>
                      Through self-driven exploration, I discovered a strong passion for software architecture. Today, as a Fullstack Developer, I build scalable web applications with high performance and polished, tactile user experiences.
                    </p>
                    <p className="text-slate-400 text-sm sm:text-[15px]">
                      I'm passionate about turning complex architectural ideas into intuitive, engaging digital products — one brick of code at a time.
                    </p>
                  </div>

                  {/* Compact, Sleek 3D Tactile Lego Resume Button */}
                  <div className="mt-6 flex items-center">
                    <a
                      href="/resume.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative inline-flex items-center gap-2 px-4.5 py-2 sm:px-5 sm:py-2.5 bg-[#FFD500] hover:bg-[#FFE033] text-zinc-950 font-mono font-semibold text-xs sm:text-[13px] tracking-wider uppercase rounded-lg border-t border-white/70 shadow-[0_2px_0_0_#C99700,0_6px_16px_rgba(255,213,0,0.22)] hover:shadow-[0_2px_0_0_#C99700,0_10px_22px_rgba(255,213,0,0.32)] active:translate-y-[2px] active:shadow-none transform hover:-translate-y-0.5 transition-all duration-150 group overflow-hidden cursor-pointer select-none"
                    >
                      <FaFilePdf className="text-sm text-zinc-950 group-hover:scale-110 transition-transform duration-200" />
                      <span className="relative z-10 font-bold tracking-wider">My Resume</span>
                      <FaDownload className="text-[11px] text-zinc-900/80 group-hover:translate-y-0.5 transition-transform duration-200" />
                    </a>
                  </div>
                </motion.div>

                {/* SISI KANAN: PROFILE PORTRAIT WITH FLOATING 3D LEGO BRICKS */}
                <motion.div 
                  className="w-full lg:w-5/12 flex flex-col items-center justify-center relative"
                  initial={{ opacity: 0, x: 30, scale: 0.95 }}
                  whileInView={{ opacity: 1, x: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                >
                  <ProfilePortrait scrollYProgress={scrollYProgress} />
                </motion.div>
              </div>
            </div>

            {/* ============================================================ */}
            {/* ACT 2: MOTIVATIONAL QUOTES (SCROLL-DRIVEN EDITORIAL CREED)  */}
            {/* ============================================================ */}
            <div id="quotes-section" className="relative z-20 w-full">
              <QuotesSection />
            </div>

            {/* ============================================================ */}
            {/* ACT 3: SKILLS SECTION: 3D MECHANICAL KEYBOARD MATRIX          */}
            {/* ============================================================ */}
            <div className="relative z-20 pt-12 sm:pt-20 pb-20 sm:pb-28">
              <SkillsKeyboard />
            </div>

          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default AboutPage;
