import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

export const MOTIVATIONAL_QUOTES = [
  {
    id: 1,
    tag: "ARCHITECTURE",
    line1: "GREAT DIGITAL SYSTEMS",
    line2: "ARE CONSTRUCTED",
    highlight: "BRICK BY BRICK.",
    body: "Relentless craft, curiosity, and patience — every complex digital reality begins with foundational blocks placed with intentional purpose.",
  },
  {
    id: 2,
    tag: "SIMPLICITY",
    line1: "SIMPLICITY IS PREREQUISITE",
    line2: "FOR LONG-TERM",
    highlight: "REAL RELIABILITY.",
    body: "Design cleanly, build boldly, and refactor with care. True elegance in code isn't when there is nothing left to add, but when nothing left can be removed.",
  },
  {
    id: 3,
    tag: "MASTER BUILDER",
    line1: "EVERY MASTER BUILDER",
    line2: "BEGAN ON A",
    highlight: "BLANK BASEPLATE.",
    body: "Never fear the first line of code or the vast unknown ahead. Massive digital architectures are just thousands of simple, solid steps compounded.",
  },
];

export default function MotivationalQuotes() {
  const containerRef = useRef(null);

  // Track continuous scroll through the 260vh sticky editorial stage
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Physics-smoothed scroll progress for organic liquid inertia
  const smoothProgress = useSpring(scrollYProgress, { 
    stiffness: 90, 
    damping: 22, 
    mass: 0.7,
    restDelta: 0.0001
  });

  // ======================================================================
  // QUOTE 1 (Range: 0.00 -> 0.32)
  // Signature Asymmetrical Converging Entrance:
  // Line 1: from left with -2.5deg tilt | Line 2: from right with +2.5deg tilt
  // Line 3: scale 0.88 -> 1 with golden bloom
  // ======================================================================
  const q1Line1X = useTransform(smoothProgress, [0.00, 0.08, 0.24, 0.32], [-48, 0, 0, 0]);
  const q1Line1Rot = useTransform(smoothProgress, [0.00, 0.08, 0.24, 0.32], [-2.5, 0, 0, 0]);
  const q1Line1Opacity = useTransform(smoothProgress, [0.00, 0.07, 0.24, 0.32], [0, 1, 1, 0]);

  const q1Line2X = useTransform(smoothProgress, [0.00, 0.08, 0.24, 0.32], [48, 0, 0, 0]);
  const q1Line2Rot = useTransform(smoothProgress, [0.00, 0.08, 0.24, 0.32], [2.5, 0, 0, 0]);
  const q1Line2Opacity = useTransform(smoothProgress, [0.00, 0.07, 0.24, 0.32], [0, 1, 1, 0]);

  const q1HighlightScale = useTransform(smoothProgress, [0.00, 0.08, 0.24, 0.32], [0.88, 1, 1, 1.03]);
  const q1HighlightY = useTransform(smoothProgress, [0.00, 0.08, 0.24, 0.32], [24, 0, 0, -45]);
  const q1HighlightOpacity = useTransform(smoothProgress, [0.00, 0.07, 0.24, 0.32], [0, 1, 1, 0]);

  const q1BodyY = useTransform(smoothProgress, [0.01, 0.09, 0.24, 0.32], [20, 0, 0, -35]);
  const q1BodyOpacity = useTransform(smoothProgress, [0.01, 0.08, 0.24, 0.32], [0, 1, 1, 0]);

  const q1ExitY = useTransform(smoothProgress, [0.24, 0.32], [0, -50]);
  const q1ExitBlur = useTransform(smoothProgress, [0.24, 0.32], ['blur(0px)', 'blur(8px)']);

  // ======================================================================
  // QUOTE 2 (Range: 0.28 -> 0.66)
  // ======================================================================
  const q2Line1X = useTransform(smoothProgress, [0.28, 0.36, 0.58, 0.66], [-48, 0, 0, 0]);
  const q2Line1Rot = useTransform(smoothProgress, [0.28, 0.36, 0.58, 0.66], [-2.5, 0, 0, 0]);
  const q2Line1Opacity = useTransform(smoothProgress, [0.28, 0.35, 0.58, 0.66], [0, 1, 1, 0]);

  const q2Line2X = useTransform(smoothProgress, [0.28, 0.36, 0.58, 0.66], [48, 0, 0, 0]);
  const q2Line2Rot = useTransform(smoothProgress, [0.28, 0.36, 0.58, 0.66], [2.5, 0, 0, 0]);
  const q2Line2Opacity = useTransform(smoothProgress, [0.28, 0.35, 0.58, 0.66], [0, 1, 1, 0]);

  const q2HighlightScale = useTransform(smoothProgress, [0.28, 0.36, 0.58, 0.66], [0.88, 1, 1, 1.03]);
  const q2HighlightY = useTransform(smoothProgress, [0.28, 0.36, 0.58, 0.66], [24, 0, 0, -45]);
  const q2HighlightOpacity = useTransform(smoothProgress, [0.28, 0.35, 0.58, 0.66], [0, 1, 1, 0]);

  const q2BodyY = useTransform(smoothProgress, [0.29, 0.37, 0.58, 0.66], [20, 0, 0, -35]);
  const q2BodyOpacity = useTransform(smoothProgress, [0.29, 0.36, 0.58, 0.66], [0, 1, 1, 0]);

  const q2ExitY = useTransform(smoothProgress, [0.58, 0.66], [0, -50]);
  const q2ExitBlur = useTransform(smoothProgress, [0.58, 0.66], ['blur(0px)', 'blur(8px)']);

  // ======================================================================
  // QUOTE 3 (Range: 0.62 -> 1.00)
  // ======================================================================
  const q3Line1X = useTransform(smoothProgress, [0.62, 0.70, 0.90, 1.00], [-48, 0, 0, 0]);
  const q3Line1Rot = useTransform(smoothProgress, [0.62, 0.70, 0.90, 1.00], [-2.5, 0, 0, 0]);
  const q3Line1Opacity = useTransform(smoothProgress, [0.62, 0.69, 0.90, 1.00], [0, 1, 1, 0]);

  const q3Line2X = useTransform(smoothProgress, [0.62, 0.70, 0.90, 1.00], [48, 0, 0, 0]);
  const q3Line2Rot = useTransform(smoothProgress, [0.62, 0.70, 0.90, 1.00], [2.5, 0, 0, 0]);
  const q3Line2Opacity = useTransform(smoothProgress, [0.62, 0.69, 0.90, 1.00], [0, 1, 1, 0]);

  const q3HighlightScale = useTransform(smoothProgress, [0.62, 0.70, 0.90, 1.00], [0.88, 1, 1, 1.03]);
  const q3HighlightY = useTransform(smoothProgress, [0.62, 0.70, 0.90, 1.00], [24, 0, 0, -45]);
  const q3HighlightOpacity = useTransform(smoothProgress, [0.62, 0.69, 0.90, 1.00], [0, 1, 1, 0]);

  const q3BodyY = useTransform(smoothProgress, [0.63, 0.71, 0.90, 1.00], [20, 0, 0, -35]);
  const q3BodyOpacity = useTransform(smoothProgress, [0.63, 0.70, 0.90, 1.00], [0, 1, 1, 0]);

  const q3ExitY = useTransform(smoothProgress, [0.90, 1.00], [0, -50]);
  const q3ExitBlur = useTransform(smoothProgress, [0.90, 1.00], ['blur(0px)', 'blur(8px)']);

  // Dynamic ambient glow
  const glowOpacity = useTransform(smoothProgress, [0, 0.5, 1], [0.18, 0.36, 0.18]);
  const glowScale = useTransform(smoothProgress, [0, 0.5, 1], [0.9, 1.15, 0.9]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[260vh] select-none"
    >
      {/* 
        Sticky Viewport Stage:
        Locks in viewport center, text gracefully transitions on scroll without any button clutter!
      */}
      <div className="sticky top-0 h-screen h-[100dvh] w-full flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 overflow-hidden">
        
        {/* Soft Dynamic Ambient Backlight Glow */}
        <motion.div 
          className="absolute inset-0 pointer-events-none flex items-center justify-center"
          style={{
            opacity: glowOpacity,
            scale: glowScale,
          }}
        >
          <div 
            className="w-[600px] sm:w-[900px] h-[360px] sm:h-[480px] rounded-full blur-[110px]"
            style={{
              background: 'radial-gradient(circle, rgba(255,213,0,0.22) 0%, rgba(6,182,212,0.12) 45%, transparent 75%)',
            }}
          />
        </motion.div>

        {/* Monumental Editorial Stage (Single Optical Center) */}
        <div className="relative w-full max-w-4xl mx-auto flex items-center justify-center min-h-[340px] sm:min-h-[380px]">
          
          {/* ---------------------------------------------------------- */}
          {/* QUOTE 1: ARCHITECTURE                                      */}
          {/* ---------------------------------------------------------- */}
          <motion.div 
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pointer-events-none"
            style={{
              y: q1ExitY,
              filter: q1ExitBlur,
            }}
          >
            <h3 
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-[2.75rem] uppercase tracking-tight text-white max-w-2xl lg:max-w-3xl leading-[1.14] select-none flex flex-col items-center"
              style={{
                fontFamily: "'Syne', -apple-system, sans-serif",
                fontWeight: 900,
                letterSpacing: "-0.02em",
              }}
            >
              {/* Line 1: Melayang masuk dari kiri miring */}
              <motion.span 
                style={{ 
                  x: q1Line1X, 
                  rotate: q1Line1Rot, 
                  opacity: q1Line1Opacity 
                }}
                className="inline-block"
              >
                {MOTIVATIONAL_QUOTES[0].line1}
              </motion.span>

              {/* Line 2: Melayang masuk dari kanan miring */}
              <motion.span 
                style={{ 
                  x: q1Line2X, 
                  rotate: q1Line2Rot, 
                  opacity: q1Line2Opacity 
                }}
                className="inline-block"
              >
                {MOTIVATIONAL_QUOTES[0].line2}
              </motion.span>

              {/* Line 3 (Highlight): Melayang naik membesar dengan glow emas */}
              <motion.span 
                style={{ 
                  scale: q1HighlightScale, 
                  y: q1HighlightY, 
                  opacity: q1HighlightOpacity 
                }}
                className="inline-block text-[#FFD500] drop-shadow-[0_0_32px_rgba(255,213,0,0.55)] mt-1"
              >
                {MOTIVATIONAL_QUOTES[0].highlight}
              </motion.span>
            </h3>

            {/* Subtitle */}
            <motion.p 
              style={{ 
                y: q1BodyY, 
                opacity: q1BodyOpacity,
                fontFamily: "'Plus Jakarta Sans', sans-serif" 
              }}
              className="mt-4 sm:mt-5 text-sm sm:text-base text-slate-300/90 font-normal leading-relaxed max-w-xl mx-auto"
            >
              &ldquo;{MOTIVATIONAL_QUOTES[0].body}&rdquo;
            </motion.p>
          </motion.div>

          {/* ---------------------------------------------------------- */}
          {/* QUOTE 2: SIMPLICITY                                        */}
          {/* ---------------------------------------------------------- */}
          <motion.div 
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pointer-events-none"
            style={{
              y: q2ExitY,
              filter: q2ExitBlur,
            }}
          >
            <h3 
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-[2.75rem] uppercase tracking-tight text-white max-w-2xl lg:max-w-3xl leading-[1.14] select-none flex flex-col items-center"
              style={{
                fontFamily: "'Syne', -apple-system, sans-serif",
                fontWeight: 900,
                letterSpacing: "-0.02em",
              }}
            >
              <motion.span 
                style={{ 
                  x: q2Line1X, 
                  rotate: q2Line1Rot, 
                  opacity: q2Line1Opacity 
                }}
                className="inline-block"
              >
                {MOTIVATIONAL_QUOTES[1].line1}
              </motion.span>

              <motion.span 
                style={{ 
                  x: q2Line2X, 
                  rotate: q2Line2Rot, 
                  opacity: q2Line2Opacity 
                }}
                className="inline-block"
              >
                {MOTIVATIONAL_QUOTES[1].line2}
              </motion.span>

              <motion.span 
                style={{ 
                  scale: q2HighlightScale, 
                  y: q2HighlightY, 
                  opacity: q2HighlightOpacity 
                }}
                className="inline-block text-[#FFD500] drop-shadow-[0_0_32px_rgba(255,213,0,0.55)] mt-1"
              >
                {MOTIVATIONAL_QUOTES[1].highlight}
              </motion.span>
            </h3>

            <motion.p 
              style={{ 
                y: q2BodyY, 
                opacity: q2BodyOpacity,
                fontFamily: "'Plus Jakarta Sans', sans-serif" 
              }}
              className="mt-4 sm:mt-5 text-sm sm:text-base text-slate-300/90 font-normal leading-relaxed max-w-xl mx-auto"
            >
              &ldquo;{MOTIVATIONAL_QUOTES[1].body}&rdquo;
            </motion.p>
          </motion.div>

          {/* ---------------------------------------------------------- */}
          {/* QUOTE 3: MASTER BUILDER                                    */}
          {/* ---------------------------------------------------------- */}
          <motion.div 
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pointer-events-none"
            style={{
              y: q3ExitY,
              filter: q3ExitBlur,
            }}
          >
            <h3 
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-[2.75rem] uppercase tracking-tight text-white max-w-2xl lg:max-w-3xl leading-[1.14] select-none flex flex-col items-center"
              style={{
                fontFamily: "'Syne', -apple-system, sans-serif",
                fontWeight: 900,
                letterSpacing: "-0.02em",
              }}
            >
              <motion.span 
                style={{ 
                  x: q3Line1X, 
                  rotate: q3Line1Rot, 
                  opacity: q3Line1Opacity 
                }}
                className="inline-block"
              >
                {MOTIVATIONAL_QUOTES[2].line1}
              </motion.span>

              <motion.span 
                style={{ 
                  x: q3Line2X, 
                  rotate: q3Line2Rot, 
                  opacity: q3Line2Opacity 
                }}
                className="inline-block"
              >
                {MOTIVATIONAL_QUOTES[2].line2}
              </motion.span>

              <motion.span 
                style={{ 
                  scale: q3HighlightScale, 
                  y: q3HighlightY, 
                  opacity: q3HighlightOpacity 
                }}
                className="inline-block text-[#FFD500] drop-shadow-[0_0_32px_rgba(255,213,0,0.55)] mt-1"
              >
                {MOTIVATIONAL_QUOTES[2].highlight}
              </motion.span>
            </h3>

            <motion.p 
              style={{ 
                y: q3BodyY, 
                opacity: q3BodyOpacity,
                fontFamily: "'Plus Jakarta Sans', sans-serif" 
              }}
              className="mt-4 sm:mt-5 text-sm sm:text-base text-slate-300/90 font-normal leading-relaxed max-w-xl mx-auto"
            >
              &ldquo;{MOTIVATIONAL_QUOTES[2].body}&rdquo;
            </motion.p>
          </motion.div>

        </div>

      </div>
    </div>
  );
}
