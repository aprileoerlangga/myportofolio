import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Suspense } from 'react';
import LegoMinifigure from './LegoMinifigure';

function Home() {
  return (
    <div className="h-screen h-[100dvh] w-full flex items-center justify-center bg-[#090b12] text-white relative overflow-hidden select-none">
      {/* ========================================================================= */}
      {/* PURE LUXURY CINEMATIC LIVING STUDIO BACKDROP (CLEAN & MINIMALIST)          */}
      {/* ========================================================================= */}

      {/* Deep Obsidian Atmospheric Studio Lighting Base */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 90% 60% at 75% 40%, rgba(255, 213, 0, 0.08), transparent 70%),
            radial-gradient(ellipse 70% 50% at 25% 30%, rgba(0, 85, 191, 0.07), transparent 65%),
            radial-gradient(circle 800px at 50% 110%, rgba(227, 0, 11, 0.04), transparent 70%),
            #090b12
          `
        }}
      />

      {/* ========================================================================= */}
      {/* HARMONIOUS AMBIENT CORNER ARCS (BALANCED DIAGONAL FRAMING)                */}
      {/* ========================================================================= */}

      {/* 1. TOP-LEFT: Warm Lego Gold/Amber Corner Arc (Softened Ambient Studio Blend) */}
      <motion.div 
        className="absolute -top-[80px] sm:-top-[130px] lg:-top-[220px] -left-[90px] sm:-left-[140px] lg:-left-[180px] w-[260px] h-[260px] sm:w-[340px] sm:h-[340px] lg:w-[500px] lg:h-[500px] rounded-full bg-gradient-to-r from-amber-500/70 via-[#FFD500]/50 to-transparent to-90% rotate-45 pointer-events-none opacity-35 sm:opacity-40 blur-[28px] lg:blur-[32px]"
        animate={{ 
          scale: [1, 1.06, 1],
          rotate: [45, 50, 45]
        }}
        transition={{ 
          duration: 12, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      />

      {/* 2. BOTTOM-RIGHT: Cool Lego Blue/Cyan Corner Arc (Softened Ambient Studio Blend) */}
      <motion.div 
        className="absolute -bottom-[90px] sm:-bottom-[150px] lg:-bottom-[260px] -right-[90px] sm:-right-[150px] lg:-right-[180px] w-[260px] h-[260px] sm:w-[340px] sm:h-[340px] lg:w-[500px] lg:h-[500px] rounded-full bg-gradient-to-l from-cyan-500/70 via-blue-600/40 to-transparent to-90% rotate-45 pointer-events-none opacity-30 sm:opacity-35 blur-[30px] lg:blur-[36px]"
        animate={{ 
          scale: [0.96, 1.04, 0.96],
          rotate: [45, 40, 45]
        }}
        transition={{ 
          duration: 13, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 1
        }}
      />

      {/* 3. CENTER STAGE: Golden Key Spotlight behind 3D Minifigure (Responsive Position) */}
      <motion.div 
        className="absolute top-[62%] lg:top-1/2 left-1/2 lg:left-auto lg:right-[12%] -translate-x-1/2 lg:translate-x-0 -translate-y-1/2 w-[340px] h-[340px] sm:w-[440px] sm:h-[440px] lg:w-[540px] lg:h-[540px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255, 213, 0, 0.13) 0%, rgba(254, 138, 24, 0.05) 45%, transparent 70%)',
          filter: 'blur(75px)'
        }}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ 
          opacity: [0.75, 1, 0.8, 0.95, 0.75],
          scale: [0.95, 1.05, 0.98, 1.03, 0.95],
          x: [0, 10, -6, 4, 0],
          y: [0, -8, 6, -3, 0]
        }}
        transition={{ 
          duration: 11, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      />

      {/* 4. BASE AMBIENT FLOOR: Deep Lego Red Ambient Floor Glow */}
      <motion.div 
        className="absolute bottom-[-6%] lg:bottom-[-8%] left-1/2 lg:left-[32%] -translate-x-1/2 lg:translate-x-0 w-[90vw] sm:w-[500px] lg:w-[580px] h-[180px] lg:h-[280px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% 100%, rgba(227, 0, 11, 0.05), transparent 70%)',
          filter: 'blur(75px)'
        }}
        animate={{ 
          opacity: [0.35, 0.65, 0.35] 
        }}
        transition={{ 
          duration: 9.5, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      />
      
      <div className="container mx-auto px-5 sm:px-8 lg:px-12 relative z-10 w-full">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-10 lg:gap-16">
          {/* Left: Text content with immediate, fluid upward flow */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.07,
                  delayChildren: 0,
                },
              },
            }}
            className="w-full lg:w-1/2 text-center lg:text-left flex flex-col items-center lg:items-start"
          >
            {/* Stable, High-Clarity Headline */}
            <motion.h1 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
                },
              }}
              className="text-4xl sm:text-6xl lg:text-7xl font-extrabold mb-2.5 sm:mb-3 leading-[1.12] tracking-tight select-none [text-rendering:optimizeLegibility]"
            >
              <span className="block pb-0.5 sm:pb-1 bg-clip-text text-transparent bg-gradient-to-r from-[#FFD500] via-[#FFE566] to-[#FFA000] drop-shadow-[0_2px_14px_rgba(255,213,0,0.22)]">
                Aprileo
              </span>
              <span className="block text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                Erlangga
              </span>
            </motion.h1>

            {/* Role Title: Fullstack Developer */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                },
              }}
              className="mb-6 sm:mb-8 flex items-center justify-center lg:justify-start gap-2 sm:gap-2.5"
            >
              <span className="text-lg sm:text-2xl font-bold tracking-tight text-[#FFD500] drop-shadow-[0_2px_10px_rgba(255,213,0,0.25)]">
                Fullstack Developer
              </span>
              <span className="w-5 sm:w-8 h-[2px] bg-[#FFD500]/40 rounded-full" />
            </motion.div>

            {/* Tactile, Sleek & Elegant 3D Lego Button */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 16, scale: 0.95 },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                },
              }}
              className="w-full flex justify-center lg:justify-start"
            >
              <Link
                to="/about"
                className="relative inline-flex items-center justify-center gap-2.5 px-6 py-2.5 sm:px-7 sm:py-3 bg-[#FFD500] hover:bg-[#FFE033] text-zinc-950 font-semibold text-sm tracking-wide rounded-xl border-t border-white/35 shadow-[0_2px_0_0_#C99700,0_8px_20px_rgba(255,213,0,0.22)] hover:shadow-[0_2px_0_0_#C99700,0_12px_26px_rgba(255,213,0,0.32)] active:translate-y-[2px] active:shadow-none transform hover:-translate-y-0.5 transition-all duration-150 group overflow-hidden"
              >
                <span className="relative z-10">Discover More</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="relative z-10 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </motion.div>
          </motion.div>
          
          {/* Right: 3D Lego Minifigure rising in sync with left content */}
          <motion.div 
            className="w-full lg:w-1/2 flex justify-center items-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[28rem] lg:h-[28rem] flex items-center justify-center">
              <Suspense fallback={null}>
                <LegoMinifigure />
              </Suspense>
            </div>
          </motion.div>
        </div>
      </div>

    </div>
  );
}

export default Home;