import React from 'react';
import { motion, useMotionValue, useTransform, useScroll } from 'framer-motion';
import fotoProfil from '../assets/fotoku.jpg';
import SkillsKeyboard from './SkillsKeyboard';
import MotivationalQuotes from './MotivationalQuotes';
import { FaFilePdf, FaDownload } from 'react-icons/fa';

function About() {
  // Window scroll tracking normalized across all viewports
  const { scrollYProgress } = useScroll();

  // Hardware-accelerated direct physical parallax transforms on scroll (120 FPS, zero spring-drag)
  const polaroidScrollY = useTransform(scrollYProgress, [0, 0.6], [0, 75]);
  const polaroidScrollRotate = useTransform(scrollYProgress, [0, 0.6], [-2, 4]);
  const bioScrollY = useTransform(scrollYProgress, [0, 0.6], [0, -25]);

  // Interactive mouse tilt for Polaroid Photo
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const polaroidRotateX = useTransform(mouseY, [-100, 100], [8, -8]);
  const polaroidRotateY = useTransform(mouseX, [-100, 100], [-8, 8]);

  return (
    <section id="about" className="min-h-screen pt-16 sm:pt-20 pb-24 bg-transparent text-slate-200 overflow-x-clip relative">

      <div className="max-w-5xl mx-auto px-6 sm:px-10 lg:px-12 w-full">
        
        {/* ============================================================ */}
        {/* HEADER: MASTER BUILDER PROFILE (CLASSIC SPACE RETRO-FUTURE AESTHETIC) */}
        <motion.div 
          initial={{ opacity: 0, y: -28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-center mb-7"
        >
          {/* Header Title */}
          <div className="flex flex-col items-center justify-center group cursor-pointer text-center" title="Aprileo Erlangga // Classic Space">
            <h2 
              className="font-pixel text-4xl sm:text-5xl md:text-6xl font-normal tracking-wider text-white uppercase select-none"
              style={{ fontFamily: "'Arcadepix', monospace" }}
            >
              ABOUT <span className="text-[#FFD500] drop-shadow-[0_0_25px_rgba(255,213,0,0.5)]">ME</span>
            </h2>
          </div>
        </motion.div>

        {/* ============================================================ */}
        {/* BORDERLESS EDITORIAL BIO (YAAS ENERGY x LEGO CLASSIC SPACE)  */}
        {/* ============================================================ */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14 mb-32 lg:mb-44 relative z-20">
          
          {/* SISI KIRI: BORDERLESS STORYTELLING TYPOGRAPHY */}
          <motion.div 
            className="w-full lg:w-7/12 flex flex-col justify-center relative"
            style={{ y: bioScrollY }}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >

            {/* Clean Flowing Paragraphs */}
            <div className="space-y-3.5 text-slate-300 leading-relaxed text-sm sm:text-base font-normal">
              <p className="text-base sm:text-[17px] text-white font-normal leading-relaxed">
                Hi, I'm <strong className="text-white font-semibold">Aprileo Muhammad David Erlangga</strong>! I grew up in Lamongan, a small city full of inspiration and natural beauty that sparked my lifelong curiosity about technology and digital craftsmanship.
              </p>
              <p>
                Through self-driven exploration, I discovered a strong passion for software architecture. Today, as a <span className="text-white font-semibold">Fullstack Developer</span>, I build <strong className="text-white font-semibold">scalable web applications</strong> with high performance and polished, tactile user experiences.
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

          {/* SISI KANAN: BORDERLESS ORGANIC FLOATING PHOTO WITH LEGO ACCENTS */}
          <motion.div 
            className="w-full lg:w-5/12 flex flex-col items-center justify-center relative"
            style={{ y: polaroidScrollY }}
            initial={{ opacity: 0, x: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* The Photo Container (Clean rounded organic silhouette, zero heavy dark boxes) */}
            <motion.div
              className="relative w-full max-w-[320px] sm:max-w-[340px] cursor-pointer group select-none"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                mouseX.set(e.clientX - rect.left - rect.width / 2);
                mouseY.set(e.clientY - rect.top - rect.height / 2);
              }}
              onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }}
              style={{
                transformStyle: "preserve-3d",
                rotateX: polaroidRotateX,
                rotateY: polaroidRotateY,
                rotateZ: polaroidScrollRotate,
              }}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              {/* Floating Top-Left Classic Space Red Badge (Elongated) */}
              <div className="absolute -top-3 -left-3 z-30 pointer-events-none drop-shadow-[0_8px_16px_rgba(0,0,0,0.7)] transform -rotate-3 group-hover:rotate-0 transition-transform duration-300">
                <div className="inline-flex items-center justify-center gap-2.5 w-14 sm:w-16 h-5 sm:h-6 rounded bg-[#E3000B] shadow-md border-t border-white/40">
                  <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#FFD500] shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),0_1px_2px_rgba(0,0,0,0.3)]" />
                  <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#FFD500] shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),0_1px_2px_rgba(0,0,0,0.3)]" />
                </div>
              </div>

              {/* Clean Photo Silhouette (Border-Free, Soft Deep Shadow) */}
              <div className="relative w-full h-[320px] sm:h-[350px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(0,85,191,0.25)] bg-[#090d1a]">
                <img
                  src={fotoProfil}
                  alt="Aprileo Erlangga - Fullstack Developer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Subtle Starlight Specular Glare */}
                <div 
                  className="absolute inset-0 pointer-events-none opacity-20 group-hover:opacity-35 transition-opacity duration-300"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 45%, rgba(0,240,255,0.15) 75%, transparent 100%)'
                  }}
                />
                {/* Subtle Bottom Vignette */}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#090d1a]/85 to-transparent pointer-events-none" />
              </div>

              {/* Minimalist Borderless Caption under Photo */}
              <div className="mt-3.5 px-1 flex items-center justify-between">
                <div>
                  <div className="font-pixel text-white text-base tracking-wider uppercase drop-shadow-[0_2px_8px_rgba(255,255,255,0.2)]" style={{ fontFamily: "'Arcadepix', monospace" }}>
                    Aprileo Erlangga
                  </div>
                  <div className="text-[#FFD500] font-mono text-[11px] font-semibold tracking-wider uppercase mt-0.5">
                    Fullstack Developer // 2026
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* ============================================================ */}
        {/* MOTIVATIONAL QUOTES (BUILDER CREED TRANSITIONING)            */}
        {/* ============================================================ */}
        <div className="relative z-20 my-16 sm:my-20">
          <MotivationalQuotes />
        </div>

        {/* ============================================================ */}
        {/* SKILLS SECTION: 3D MECHANICAL KEYBOARD MATRIX                */}
        {/* ============================================================ */}
        <div className="mt-16 sm:mt-24 relative z-20">
          <SkillsKeyboard />
        </div>
      </div>
      </section>
  );
}

export default About;
