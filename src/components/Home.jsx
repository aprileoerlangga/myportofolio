import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Suspense, useRef, useState, useEffect } from 'react';
import LegoMinifigure from './LegoMinifigure';
import { useIntro } from '../context/IntroContext';

function Home() {
  const { showIntro, startBrickWipe } = useIntro() || {};
  const navigate = useNavigate();
  const orbitTargetRef = useRef(null);
  const [domTarget, setDomTarget] = useState(null);
  const [isThrowing, setIsThrowing] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);

  useEffect(() => {
    if (orbitTargetRef.current) {
      setDomTarget(orbitTargetRef.current);
    }
  }, []);

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
    <div className="h-screen h-[100dvh] w-full flex items-center justify-center bg-[#060a17] text-white relative overflow-hidden select-none">
      {/* ========================================================================= */}
      {/* CLASSIC SPACE COSMIC BACKDROP (COMPLEMENTARY TO LEGO SPACEMAN)            */}
      {/* ========================================================================= */}

      {/* 1. Deep Orbital Void & Nebula Lighting (Royal Blue, Cosmic Violet & Solar Amber) */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle 950px at 80% 25%, rgba(0, 85, 191, 0.30), transparent 70%),
            radial-gradient(circle 850px at 15% 40%, rgba(121, 40, 202, 0.22), transparent 65%),
            radial-gradient(circle 900px at 50% 95%, rgba(255, 213, 0, 0.13), transparent 70%),
            linear-gradient(160deg, #060a17 0%, #090e22 50%, #050814 100%)
          `
        }}
      />

      {/* 2. Universal Twinkling Cosmic Stars Field */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-70"
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
          backgroundSize: '1440px 420px',
        }}
      />

      {/* 3. Classic Space Perspective Cyber Launchpad Grid on Floor */}
      <div 
        className="absolute inset-x-0 bottom-0 h-[340px] sm:h-[400px] pointer-events-none opacity-30 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 240, 255, 0.35) 1.5px, transparent 1.5px),
            linear-gradient(to bottom, rgba(255, 213, 0, 0.25) 1.5px, transparent 1.5px)
          `,
          backgroundSize: '54px 54px',
          maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.45) 45%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.45) 45%, transparent 100%)',
          transform: 'perspective(550px) rotateX(52deg)',
          transformOrigin: 'bottom center',
        }}
      />

      {/* Subtle architectural studio depth texture */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black 25%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black 25%, transparent 75%)'
        }}
      />

      {/* ========================================================================= */}
      {/* HARMONIOUS AMBIENT CORNER ARCS (BALANCED DIAGONAL FRAMING)                */}
      {/* ========================================================================= */}

      {/* 1. TOP-LEFT: Subtle Warm Gold Arc (Kisses the yellow Lego elements) */}
      <motion.div 
        className="absolute -top-[80px] sm:-top-[130px] lg:-top-[220px] -left-[90px] sm:-left-[140px] lg:-left-[180px] w-[260px] h-[260px] sm:w-[340px] sm:h-[340px] lg:w-[500px] lg:h-[500px] rounded-full bg-gradient-to-r from-amber-500/50 via-[#FFD500]/30 to-transparent to-90% rotate-45 pointer-events-none opacity-30 sm:opacity-35 blur-[30px] lg:blur-[36px]"
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

      {/* 2. BOTTOM-RIGHT: Deep Midnight Sapphire Arc (Harmonizes with blue Lego limbs) */}
      <motion.div 
        className="absolute -bottom-[90px] sm:-bottom-[150px] lg:-bottom-[260px] -right-[90px] sm:-right-[150px] lg:-right-[180px] w-[260px] h-[260px] sm:w-[340px] sm:h-[340px] lg:w-[500px] lg:h-[500px] rounded-full bg-gradient-to-l from-blue-600/50 via-indigo-700/30 to-transparent to-90% rotate-45 pointer-events-none opacity-30 sm:opacity-35 blur-[32px] lg:blur-[38px]"
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

      {/* 3. CENTER STAGE: Studio Halo Spotlight directly behind 3D Minifigure */}
      <motion.div 
        className="absolute top-[62%] lg:top-1/2 left-1/2 lg:left-auto lg:right-[12%] -translate-x-1/2 lg:translate-x-0 -translate-y-1/2 w-[340px] h-[340px] sm:w-[440px] sm:h-[440px] lg:w-[540px] lg:h-[540px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(0, 102, 255, 0.16) 0%, rgba(255, 213, 0, 0.06) 45%, transparent 70%)',
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

      {/* 4. BASE AMBIENT FLOOR: Soft Studio Ground Reflection */}
      <motion.div 
        className="absolute bottom-[-6%] lg:bottom-[-8%] left-1/2 lg:left-[32%] -translate-x-1/2 lg:translate-x-0 w-[90vw] sm:w-[500px] lg:w-[580px] h-[180px] lg:h-[280px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% 100%, rgba(0, 85, 191, 0.08), transparent 70%)',
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
      
      {/* ========================================================================= */}
      {/* 5. FULL-HERO 3D LEGO CANVAS LAYER (Passes IN FRONT OF TEXT at z-20, jumps to z-50 during Brick Throw) */}
      {/* ========================================================================= */}
      <div className={`absolute inset-0 ${isThrowing ? 'z-50' : 'z-20'} pointer-events-none overflow-hidden`}>
        <Suspense fallback={null}>
          <LegoMinifigure 
            domTarget={domTarget} 
            isIntroActive={showIntro} 
            isThrowing={isThrowing}
            onThrowComplete={handleThrowComplete}
            onInteractionReady={setIsInteractive}
          />
        </Suspense>
      </div>

      <div className="container mx-auto px-5 sm:px-8 lg:px-12 relative z-10 w-full pointer-events-none">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-10 lg:gap-16">
          {/* Left: Text content — sits at z-10 so Lego figure at z-20 walks right IN FRONT of it */}
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
            className="w-full lg:w-1/2 text-center lg:text-left flex flex-col items-center lg:items-start relative z-10 pointer-events-auto"
          >
            {/* Retro Pixel "Classic Space" Headline with exact Arcadepix Typography */}
            <motion.h1 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
                },
              }}
              className="font-pixel text-4xl sm:text-6xl lg:text-7xl font-normal mb-3 sm:mb-4 leading-[1.1] tracking-widest uppercase select-none"
              style={{ fontFamily: "'Arcadepix', monospace" }}
            >
              <span className="block pb-0.5 sm:pb-1 text-white drop-shadow-[0_4px_16px_rgba(255,255,255,0.25)]">
                Aprileo
              </span>
              <span className="block text-[#FFD500] drop-shadow-[0_4px_16px_rgba(255,213,0,0.35)]">
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
              className="mb-6 sm:mb-8 flex items-center justify-center lg:justify-start gap-2.5"
            >
              <span 
                className="font-pixel text-sm sm:text-xl font-normal tracking-widest text-slate-300 uppercase drop-shadow-[0_2px_8px_rgba(255,255,255,0.15)]"
                style={{ fontFamily: "'Arcadepix', monospace" }}
              >
                Fullstack Developer
              </span>
              <span className="w-5 sm:w-8 h-[2px] bg-[#FFD500]/60 rounded-full shadow-[0_0_8px_rgba(255,213,0,0.4)]" />
            </motion.div>

            {/* Tactile 3D Button — Triggers Lego Brick Throw Transition */}
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
              className="w-full flex justify-center lg:justify-start relative z-30 pointer-events-auto"
            >
              <button
                type="button"
                onClick={handleDiscoverMore}
                disabled={isThrowing}
                className="relative z-30 inline-flex items-center justify-center gap-2.5 px-6 py-2.5 sm:px-7 sm:py-3 bg-[#FFD500] hover:bg-[#FFE033] text-zinc-950 font-pixel font-normal text-sm sm:text-base tracking-wider uppercase rounded-xl border-t border-white/60 shadow-[0_2px_0_0_#C99700,0_8px_20px_rgba(255,213,0,0.25)] hover:shadow-[0_2px_0_0_#C99700,0_12px_26px_rgba(255,213,0,0.35)] active:translate-y-[2px] active:shadow-none transform hover:-translate-y-0.5 transition-all duration-150 group overflow-hidden cursor-pointer pointer-events-auto select-none disabled:opacity-90 disabled:cursor-wait"
                style={{ fontFamily: "'Arcadepix', monospace" }}
              >
                <span className="relative z-10">{isThrowing ? "Here it comes!" : "Discover More"}</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`relative z-10 h-4 w-4 transition-transform duration-200 ${isThrowing ? 'translate-x-2 animate-pulse' : 'group-hover:translate-x-1'}`} 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
          
          {/* Right: Interactive 3D Workstation Anchor & OrbitControls Grab Zone */}
          <motion.div 
            className="w-full lg:w-1/2 flex justify-center items-center relative z-30 pointer-events-none"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          >
            <div 
              ref={orbitTargetRef}
              className={`relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[28rem] lg:h-[28rem] flex items-center justify-center select-none ${
                isInteractive && !isThrowing ? 'cursor-grab active:cursor-grabbing pointer-events-auto' : 'pointer-events-none cursor-default'
              }`}
              title={isInteractive && !isThrowing ? "Drag to inspect Lego Minifigure in 3D" : ""}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Home;
