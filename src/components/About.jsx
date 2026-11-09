import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import EditorialParallaxPortrait from './EditorialParallaxPortrait';
import SkillsKeyboard from './SkillsKeyboard';
import MotivationalQuotes from './MotivationalQuotes';
import { FaFilePdf, FaDownload } from 'react-icons/fa';

function About() {
  // Window scroll tracking normalized across all viewports
  const { scrollYProgress } = useScroll();

  // Subtle storytelling typography parallax
  const bioScrollY = useTransform(scrollYProgress, [0, 0.45], [0, -20]);

  return (
    <section id="about" className="bg-transparent text-slate-200 overflow-x-clip relative">

      {/* ============================================================ */}
      {/* ACT 1: MASTER BUILDER PROFILE (Full Initial Viewport Hero)   */}
      {/* ============================================================ */}
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

          {/* SISI KANAN: EDITORIAL PARALLAX PORTRAIT WITH FLOATING 3D LEGO BRICKS */}
          <motion.div 
            className="w-full lg:w-5/12 flex flex-col items-center justify-center relative"
            initial={{ opacity: 0, x: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <EditorialParallaxPortrait scrollYProgress={scrollYProgress} />
          </motion.div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* ACT 2: MOTIVATIONAL QUOTES (SCROLL-DRIVEN EDITORIAL CREED)  */}
      {/* ============================================================ */}
      <div id="quotes-section" className="relative z-20 w-full">
        <MotivationalQuotes />
      </div>

      {/* ============================================================ */}
      {/* ACT 3: SKILLS SECTION: 3D MECHANICAL KEYBOARD MATRIX          */}
      {/* ============================================================ */}
      <div className="relative z-20 pt-12 sm:pt-20 pb-20 sm:pb-28">
        <SkillsKeyboard />
      </div>

    </section>
  );
}

export default About;
