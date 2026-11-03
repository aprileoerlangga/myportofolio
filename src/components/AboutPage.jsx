import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Navbar from './Navbar';
import About from './About';
import Footer from './Footer';
import AboutShatteredBackground from './AboutShatteredBackground';

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

  // Zone 1: Active at top, smoothly dissolves as user scrolls into mid
  const bgZone1Opacity = useTransform(scrollYProgress, [0.08, 0.32], [1, 0]);

  // Zone 2: Highly visible Cosmic Dawn & Solar Amber Horizon - peaks around 0.32 to 0.64
  const bgZone2Opacity = useTransform(scrollYProgress, [0.15, 0.32, 0.62, 0.78], [0, 1, 1, 0]);

  // Zone 3: High-contrast Lunar Command Deck & Cyber Grid - takes over from 0.64 to 1.0
  const bgZone3Opacity = useTransform(scrollYProgress, [0.64, 0.82], [0, 1]);

  // Planet Parallax: Smoothly recedes and dims into the distance as user scrolls down
  const planetY = useTransform(scrollYProgress, [0, 1], [0, 260]);
  const planetScale = useTransform(scrollYProgress, [0, 1], [1, 0.70]);
  const planetOpacity = useTransform(scrollYProgress, [0, 0.45, 0.85], [0.90, 0.40, 0.05]);

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
      </motion.div>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ZONE 2: BOLD COSMIC DAWN / SOLAR AMBER HORIZON (Middle Transition)    */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <motion.div 
        className="fixed inset-0 z-0 pointer-events-none"
        style={{ opacity: bgZone2Opacity, willChange: 'opacity' }}
      >
        {/* Rich Cosmic Violet-Indigo Deep Sky with Native Soft Amber Horizon (Zero CSS filters!) */}
        <div 
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 1100px 500px at 50% 50%, rgba(255, 213, 0, 0.25) 0%, rgba(227, 0, 11, 0.14) 40%, transparent 72%),
              radial-gradient(circle 950px at 15% 65%, rgba(121, 40, 202, 0.28) 0%, transparent 65%),
              radial-gradient(circle 850px at 85% 35%, rgba(0, 85, 191, 0.24) 0%, transparent 65%),
              linear-gradient(180deg, #0e0720 0%, #1e1038 45%, #18092e 100%)
            `
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
              radial-gradient(circle 1000px at 50% 95%, rgba(0, 240, 255, 0.20) 0%, rgba(0, 85, 191, 0.20) 50%, transparent 75%),
              radial-gradient(circle 700px at 85% 90%, rgba(255, 213, 0, 0.16) 0%, transparent 60%),
              radial-gradient(circle 700px at 15% 90%, rgba(227, 0, 11, 0.12) 0%, transparent 60%),
              linear-gradient(180deg, #050814 0%, #02040a 100%)
            `
          }}
        />
        {/* Classic Space Glowing Perspective Cyber Launchpad Grid */}
        <div 
          className="absolute inset-x-0 bottom-0 h-[460px] pointer-events-none opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(0, 240, 255, 0.40) 1.5px, transparent 1.5px),
              linear-gradient(to bottom, rgba(255, 213, 0, 0.30) 1.5px, transparent 1.5px)
            `,
            backgroundSize: '54px 54px',
            maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.65) 45%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.65) 45%, transparent 100%)',
            transform: 'perspective(550px) rotateX(50deg)',
            transformOrigin: 'bottom center'
          }}
        />
      </motion.div>

      {/* Universal Twinkling Space Stars Field across all zones */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none opacity-65"
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

      {/* Stylized Classic Space Celestial Planet with Parallax Descent */}
      <motion.div 
        className="fixed top-8 -right-20 md:right-4 w-72 h-72 md:w-96 md:h-96 rounded-full pointer-events-none z-0"
        style={{
          y: planetY,
          scale: planetScale,
          opacity: planetOpacity,
          background: 'radial-gradient(circle at 35% 35%, rgba(0, 240, 255, 0.85) 0%, rgba(0, 85, 191, 0.8) 45%, rgba(121, 40, 202, 0.85) 75%, rgba(255, 0, 128, 0.7) 100%)',
          boxShadow: '0 0 90px rgba(0, 240, 255, 0.35), inset -20px -20px 50px rgba(0, 0, 0, 0.85), inset 15px 15px 40px rgba(255, 255, 255, 0.35)'
        }}
      >
        <div 
          className="absolute inset-0 rounded-full opacity-40 mix-blend-overlay"
          style={{
            background: 'radial-gradient(ellipse at 70% 30%, rgba(255, 255, 255, 0.8) 0%, transparent 60%)'
          }}
        />
      </motion.div>

      {/* Morphing Classic Space Lego 3D Scene */}
      <AboutShatteredBackground />

      <div className="relative z-10">
        <Navbar />
        <main>
          <About />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default AboutPage;
