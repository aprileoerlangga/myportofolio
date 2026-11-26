import { useNavigate } from 'react-router-dom';
import { Suspense, useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import LegoMinifigure from './LegoMinifigure';
import SpaceBackground from './SpaceBackground';
import { useIntro } from '../context/IntroContext';

const FIRST_NAME_LETTERS = "Aprileo".split("");
const LAST_NAME_LETTERS = "Erlangga".split("");

/**
 * LegoWaveWord:
 * - Cascade stagger wave upon entering Home
 * - Magnetic Cursor Ripple: Smooth gravitational curvature across neighboring letters on hover
 */
function LegoWaveWord({ letters, triggerKey, delayOffset = 0, textColorClass = "text-white", shadowClass = "drop-shadow-[0_4px_24px_rgba(255,255,255,0.20)]" }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <span 
      className={`block ${textColorClass} ${shadowClass}`}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      {letters.map((char, index) => {
        let hoverY = 0;
        let hoverScale = 1;
        let isGolden = false;

        if (hoveredIndex !== null) {
          const dist = Math.abs(index - hoveredIndex);
          if (dist === 0) {
            hoverY = -9;
            hoverScale = 1.16;
            isGolden = true;
          } else if (dist === 1) {
            hoverY = -4.5;
            hoverScale = 1.08;
            isGolden = true;
          } else if (dist === 2) {
            hoverY = -1.5;
            hoverScale = 1.03;
          }
        }

        return (
          <motion.span
            key={`${triggerKey}-${index}`}
            onMouseEnter={() => setHoveredIndex(index)}
            initial={{ y: 0, rotate: 0 }}
            animate={
              hoveredIndex !== null
                ? {
                    y: hoverY,
                    scale: hoverScale,
                    rotate: hoveredIndex === index ? (index % 2 === 0 ? -3 : 3) : 0,
                  }
                : {
                    y: [-7, 1.5, 0],
                    rotate: [index % 2 === 0 ? -2.5 : 2.5, 0],
                    scale: 1,
                  }
            }
            transition={
              hoveredIndex !== null
                ? {
                    type: "spring",
                    stiffness: 450,
                    damping: 24,
                    mass: 0.6,
                  }
                : {
                    duration: 0.38,
                    delay: delayOffset + index * 0.028,
                    ease: [0.16, 1, 0.3, 1],
                  }
            }
            whileTap={{ scale: 0.88, y: 2 }}
            className={`inline-block cursor-pointer select-none origin-bottom will-change-transform transition-colors duration-150 ${
              isGolden 
                ? 'text-[#FFD500] drop-shadow-[0_0_16px_rgba(255,213,0,0.65)]' 
                : ''
            }`}
            title={`Letter ${char.toUpperCase()}`}
          >
            {char}
          </motion.span>
        );
      })}
    </span>
  );
}

function HomePage({ isHome = true }) {
  const { startBrickWipe } = useIntro() || {};
  const navigate = useNavigate();
  const orbitTargetRef = useRef(null);
  const [isThrowing, setIsThrowing] = useState(false);
  const [isInteractive, setIsInteractive] = useState(true);
  const [wiggleKey, setWiggleKey] = useState(0);

  // Automatically reset throw animation and trigger letter wiggle when returning to Home
  useEffect(() => {
    if (isHome) {
      setIsThrowing(false);
      setWiggleKey(prev => prev + 1);
    }
  }, [isHome]);

  const handleDiscoverMore = (e) => {
    e.preventDefault();
    if (isThrowing) return;
    setIsThrowing(true);
  };

  const handleThrowComplete = () => {
    if (startBrickWipe) {
      startBrickWipe(() => {
        navigate('/about');
      });
    } else {
      navigate('/about');
    }
  };

  return (
    <div className="min-h-screen min-h-[100dvh] lg:h-screen lg:h-[100dvh] w-full flex flex-col items-center justify-start lg:justify-center bg-[#060a17] text-white relative overflow-x-hidden select-none">
      {/* ========================================================================= */}
      {/* CLASSIC SPACE COSMIC & MISSION COMMAND BACKGROUND                         */}
      {/* ========================================================================= */}
      <SpaceBackground paused={!isHome} />

      {/* ========================================================================= */}
      {/* FULL-HERO 3D LEGO CANVAS LAYER                                            */}
      {/* - Always positioned safely BEHIND text and button (z-10)                  */}
      {/* - Only elevates to z-50 during the cinematic brick throw click            */}
      {/* ========================================================================= */}
      <div className={`fixed inset-0 ${isThrowing ? 'z-50' : 'z-10'} pointer-events-none overflow-hidden`}>
        <Suspense fallback={null}>
          <LegoMinifigure 
            domTarget={orbitTargetRef} 
            isThrowing={isThrowing}
            isHome={isHome}
            onThrowComplete={handleThrowComplete}
            onInteractionReady={setIsInteractive}
          />
        </Suspense>
      </div>

      <div className="container mx-auto px-4 xs:px-6 sm:px-8 lg:px-12 relative z-30 lg:z-10 w-full pointer-events-none min-h-[100dvh] flex flex-col justify-between lg:justify-center pt-[max(4.25rem,calc(env(safe-area-inset-top)+1.75rem))] xs:pt-[max(4.75rem,calc(env(safe-area-inset-top)+2.25rem))] sm:pt-20 lg:pt-0 pb-[max(4rem,calc(env(safe-area-inset-bottom)+3rem))] lg:pb-0">
        <div className="flex-1 w-full flex flex-col lg:flex-row items-center justify-between gap-0 lg:gap-16">
          {/* Left: Text content — Instantaneous Real-Time Rendering */}
          <div className="w-full lg:w-1/2 text-center lg:text-left flex flex-col items-center lg:items-start relative z-30 pointer-events-auto shrink-0">
            {/* Modern Pixel Retro Headline — Pixelify Sans with Lego Wave Ripple */}
            <h1 className="font-['Pixelify_Sans',sans-serif] font-bold text-4xl xs:text-5xl sm:text-6xl lg:text-7xl xl:text-8xl mb-2 sm:mb-4 lg:mb-5 leading-[0.98] sm:leading-[1.0] tracking-wide uppercase select-none">
              <LegoWaveWord 
                letters={FIRST_NAME_LETTERS} 
                triggerKey={wiggleKey} 
                delayOffset={0.04} 
                textColorClass="text-white"
                shadowClass="drop-shadow-[0_4px_24px_rgba(255,255,255,0.20)]"
              />
              <LegoWaveWord 
                letters={LAST_NAME_LETTERS} 
                triggerKey={wiggleKey} 
                delayOffset={0.16} 
                textColorClass="text-[#FFD500]"
                shadowClass="drop-shadow-[0_4px_28px_rgba(255,213,0,0.30)]"
              />
            </h1>

            {/* Role Title: Fullstack Developer — Dual HUD Accent Symmetrical with Cadence Expansion */}
            <div className="mb-3.5 xs:mb-4 sm:mb-6 lg:mb-8 flex items-center justify-center lg:justify-start gap-2 sm:gap-3">
              <motion.span 
                key={`hud-left-${wiggleKey}`}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 0.28, delay: 0.36, ease: [0.16, 1, 0.3, 1] }}
                className="w-3.5 sm:w-6 h-[2px] bg-[#FFD500]/70 rounded-full shadow-[0_0_8px_rgba(255,213,0,0.4)] origin-right will-change-transform" 
              />
              <motion.span 
                key={`hud-text-${wiggleKey}`}
                initial={{ opacity: 0.6, y: 2 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.24, delay: 0.34, ease: "easeOut" }}
                className="font-['JetBrains_Mono',monospace] text-[11px] sm:text-sm font-medium tracking-[0.18em] sm:tracking-[0.22em] text-slate-300 uppercase drop-shadow-[0_2px_8px_rgba(255,255,255,0.15)] select-none whitespace-nowrap"
              >
                Fullstack Developer
              </motion.span>
              <motion.span 
                key={`hud-right-${wiggleKey}`}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 0.28, delay: 0.36, ease: [0.16, 1, 0.3, 1] }}
                className="w-3.5 sm:w-6 h-[2px] bg-[#FFD500]/70 rounded-full shadow-[0_0_8px_rgba(255,213,0,0.4)] origin-left will-change-transform" 
              />
            </div>

            {/* Tactile 3D Button — Triggers Lego Brick Throw Transition with Cadence Entrance */}
            <motion.div 
              key={`hero-btn-${wiggleKey}`}
              initial={{ opacity: 0, y: 12, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 420,
                damping: 22,
                mass: 0.7,
                delay: 0.42,
              }}
              className="w-full flex justify-center lg:justify-start relative z-30 pointer-events-auto mb-3.5 xs:mb-4 lg:mb-0 will-change-transform"
            >
              <button
                type="button"
                onClick={handleDiscoverMore}
                disabled={isThrowing}
                className="group relative z-30 inline-flex items-center justify-center gap-2 sm:gap-2.5 px-4 py-2 sm:px-7 sm:py-3.5 sm:min-h-[48px] rounded-xl bg-[#FFD500] hover:bg-[#FFE033] text-zinc-950 font-sans sm:font-mono font-semibold sm:font-bold text-xs sm:text-sm tracking-wide sm:tracking-wider sm:uppercase border-t border-white/60 shadow-[0_2px_0_0_#C99700,0_4px_14px_rgba(255,213,0,0.2)] sm:shadow-[0_2px_0_0_#C99700,0_8px_20px_rgba(255,213,0,0.25)] hover:shadow-[0_2px_0_0_#C99700,0_8px_20px_rgba(255,213,0,0.3)] sm:hover:shadow-[0_2px_0_0_#C99700,0_12px_26px_rgba(255,213,0,0.35)] active:translate-y-[2px] sm:active:scale-[0.98] active:shadow-none transform hover:-translate-y-0.5 transition-all duration-150 overflow-hidden whitespace-nowrap cursor-pointer pointer-events-auto select-none disabled:opacity-90 disabled:cursor-wait"
              >
                <span className="relative z-10 leading-none sm:leading-normal">{isThrowing ? "Here it comes!" : "Discover More"}</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`relative z-10 h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0 transition-transform duration-150 sm:duration-200 ${isThrowing ? 'translate-x-2 animate-pulse' : 'group-hover:translate-x-1'}`} 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </motion.div>
          </div>
          
          {/* Right / Bottom: Interactive 3D Workstation Anchor & OrbitControls Grab Zone */}
          <div 
            className="w-full lg:w-1/2 flex-1 flex justify-center items-center relative z-20 pointer-events-none my-auto lg:my-0 min-h-[210px]"
          >
            <div 
              ref={orbitTargetRef}
              className={`relative w-60 h-[220px] xs:w-64 xs:h-[245px] sm:w-72 sm:h-[280px] lg:w-[28rem] lg:h-[28rem] flex items-center justify-center select-none touch-none ${
                isInteractive && !isThrowing ? 'cursor-grab active:cursor-grabbing pointer-events-auto' : 'pointer-events-none cursor-default'
              }`}
              title={isInteractive && !isThrowing ? "Drag to inspect Lego Minifigure in 3D" : ""}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
