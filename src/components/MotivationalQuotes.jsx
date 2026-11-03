import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

export const MOTIVATIONAL_QUOTES = [
  {
    id: 1,
    tag: "ARCHITECTURE",
    lead: "THE MASTER BUILDER CREED",
    line1: "GREAT DIGITAL SYSTEMS",
    line2: "ARE CONSTRUCTED",
    highlight: "BRICK BY BRICK.",
    body: "Relentless craft, curiosity, and patience — every complex digital reality begins with foundational blocks placed with intentional purpose.",
    author: "APRILEO // CREED 01",
  },
  {
    id: 2,
    tag: "CRAFTSMANSHIP",
    lead: "FULLSTACK PHILOSOPHY",
    line1: "SIMPLICITY IS PREREQUISITE",
    line2: "FOR LONG-TERM",
    highlight: "REAL RELIABILITY.",
    body: "Design cleanly, build boldly, and refactor with care. True elegance in code isn't when there is nothing left to add, but when nothing left can be removed.",
    author: "APRILEO // CREED 02",
  },
  {
    id: 3,
    tag: "INITIATION",
    lead: "DEVELOPER JOURNEY",
    line1: "EVERY MASTER BUILDER",
    line2: "BEGAN ON A",
    highlight: "BLANK BASEPLATE.",
    body: "Never fear the first line of code or the vast unknown ahead. Massive digital architectures are just thousands of simple, solid steps compounded.",
    author: "APRILEO // CREED 03",
  },
  {
    id: 4,
    tag: "MODULARITY",
    lead: "SYSTEMS THINKING",
    line1: "CODE IS LIKE LEGO:",
    line2: "INFINITE WORLDS FROM",
    highlight: "FOUNDATIONAL LOGIC.",
    body: "When modular primitives are engineered with clarity and discipline, they snap together seamlessly to power delightful, enduring human experiences.",
    author: "APRILEO // CREED 04",
  },
  {
    id: 5,
    tag: "MOMENTUM",
    lead: "GROWTH MINDSET",
    line1: "MOMENTUM IS PLACING",
    line2: "ONE SOLID BRICK",
    highlight: "EVERY SINGLE DAY.",
    body: "Consistency beats frantic intensity. Lasting software isn't built in a single overnight rush; it is forged through intentional daily craftsmanship.",
    author: "APRILEO // CREED 05",
  },
];

export default function MotivationalQuotes() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = next, -1 = prev
  const [isPaused, setIsPaused] = useState(false);

  const containerRef = useRef(null);

  // ══════════════════════════════════════════════════════════════════════════
  // YAAS ENERGY SCROLL-DRIVEN KINETIC TEXT TRANSITIONS
  // Words physically glide, converge, and assemble into place as user scrolls!
  // ══════════════════════════════════════════════════════════════════════════
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 85%", "center 50%"]
  });

  // Line 1 drifts in from left with subtle tilt:
  const line1X = useTransform(scrollYProgress, [0, 1], [-48, 0]);
  const line1Rotate = useTransform(scrollYProgress, [0, 1], [-2.5, 0]);

  // Line 2 drifts in from right with contrasting tilt:
  const line2X = useTransform(scrollYProgress, [0, 1], [48, 0]);
  const line2Rotate = useTransform(scrollYProgress, [0, 1], [2.5, 0]);

  // Highlight line scales up with luminous bloom:
  const highlightScale = useTransform(scrollYProgress, [0, 1], [0.88, 1]);
  const highlightY = useTransform(scrollYProgress, [0, 1], [22, 0]);

  // Overall text entry opacity & drift:
  const textOpacity = useTransform(scrollYProgress, [0, 0.35, 1], [0.35, 0.75, 1]);
  const narrativeY = useTransform(scrollYProgress, [0, 1], [18, 0]);

  // Auto-cycle quotes every 7 seconds, pause on hover
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const activeQuote = MOTIVATIONAL_QUOTES[currentIndex];

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + MOTIVATIONAL_QUOTES.length) % MOTIVATIONAL_QUOTES.length);
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full max-w-4xl mx-auto px-4 sm:px-6 my-20 sm:my-32 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 
        AESTHETIC BORDERLESS EDITORIAL PRESENTATION
        (Inspired by YAAS Energy kinetic scroll typography & Lego Classic Space #creator)
      */}
      <div className="relative flex flex-col items-center text-center">
        
        {/* Subtle Ambient Starlight Flare */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[320px] rounded-full pointer-events-none opacity-25"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(255, 213, 0, 0.28) 0%, rgba(121, 40, 202, 0.18) 50%, transparent 72%)'
          }}
        />

        {/* Dynamic Transitioning Text Stage */}
        <motion.div 
          style={{ opacity: textOpacity }}
          className="relative w-full min-h-[220px] sm:min-h-[260px] flex flex-col items-center justify-center"
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={activeQuote.id}
              custom={direction}
              initial={{ 
                opacity: 0, 
                y: direction > 0 ? 18 : -18,
              }}
              animate={{ 
                opacity: 1, 
                y: 0,
              }}
              exit={{ 
                opacity: 0, 
                y: direction > 0 ? -18 : 18,
              }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center text-center w-full"
            >
              {/* 
                YAAS Energy Scroll-Driven Kinetic Assembly Headline
                Line 1, Line 2, and Highlight converge and lock together on scroll!
              */}
              <div 
                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-[2.75rem] uppercase tracking-tight text-white max-w-2xl lg:max-w-3xl leading-[1.14] select-none flex flex-col items-center"
                style={{
                  fontFamily: "'Syne', -apple-system, sans-serif",
                  fontWeight: 900,
                  letterSpacing: '-0.02em',
                }}
              >
                {/* Line 1: Glides from Left on Scroll */}
                <motion.span 
                  style={{ x: line1X, rotate: line1Rotate }} 
                  className="inline-block"
                >
                  {activeQuote.line1}
                </motion.span>

                {/* Line 2: Glides from Right on Scroll */}
                <motion.span 
                  style={{ x: line2X, rotate: line2Rotate }} 
                  className="inline-block"
                >
                  {activeQuote.line2}
                </motion.span>

                {/* Line 3: Luminous Highlight Word (Blooms and scales into place) */}
                <motion.span 
                  style={{ scale: highlightScale, y: highlightY }}
                  className="inline-block text-[#FFD500] drop-shadow-[0_0_32px_rgba(255,213,0,0.55)] mt-1"
                >
                  {activeQuote.highlight}
                </motion.span>
              </div>

              {/* 3. Narrative Sub-copy */}
              <motion.p 
                style={{ y: narrativeY }}
                className="mt-4 sm:mt-5 text-sm sm:text-base text-slate-300/90 font-normal leading-relaxed max-w-xl mx-auto"
              >
                &ldquo;{activeQuote.body}&rdquo;
              </motion.p>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* OPTION A: LEGO STUD CAPSULE DOCK */}
        <div className="mt-8 pt-2 flex items-center justify-center z-20">
          <div className="inline-flex items-center gap-2.5 sm:gap-3 px-3 py-1.5 sm:py-2 rounded-full bg-black/40 border border-white/15 backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
            {/* Prev Button */}
            <button
              onClick={handlePrev}
              className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 active:scale-90 transition-all cursor-pointer select-none"
              title="Previous Quote"
              aria-label="Previous Quote"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* 5 Lego Round Studs */}
            <div className="flex items-center gap-2 sm:gap-2.5 px-1.5">
              {MOTIVATIONAL_QUOTES.map((q, idx) => {
                const isActive = currentIndex === idx;
                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      setDirection(idx > currentIndex ? 1 : -1);
                      setCurrentIndex(idx);
                    }}
                    className={`relative rounded-full cursor-pointer transition-all duration-300 flex items-center justify-center ${
                      isActive 
                        ? 'w-3.5 h-3.5 bg-[#FFD500] shadow-[0_0_12px_rgba(255,213,0,0.9)] scale-110' 
                        : 'w-2.5 h-2.5 bg-white/20 hover:bg-white/40'
                    }`}
                    title={`Quote ${idx + 1}`}
                    aria-label={`Go to quote ${idx + 1}`}
                  >
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full border border-yellow-800/40 pointer-events-none" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 active:scale-90 transition-all cursor-pointer select-none"
              title="Next Quote"
              aria-label="Next Quote"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
