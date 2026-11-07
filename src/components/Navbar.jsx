// Navbar.jsx - Concept 3: The LEGO Movie Builder HUD
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useState, useEffect } from 'react';


// Iconic Classic LEGO Minifigure Head Vector Icon with interactive "melet" (tongue-out) on hover
function LegoMinifigIcon() {
  return (
    <div className="relative w-7 h-7 flex-shrink-0 flex items-center justify-center group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300 select-none cursor-pointer">
      <svg 
        viewBox="0 0 32 36" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        className="w-full h-full drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]"
      >
        {/* Top Stud */}
        <rect x="11" y="1.5" width="10" height="4" rx="1.5" fill="#FFD500" stroke="#B8860B" strokeWidth="1.2" />
        <ellipse cx="16" cy="2.5" rx="3.5" ry="1" fill="#FFF275" />

        {/* Head Main Cylinder */}
        <rect x="4.5" y="5" width="23" height="25" rx="6.5" fill="#FFD500" stroke="#B8860B" strokeWidth="1.2" />
        
        {/* Forehead Specular Highlight */}
        <path d="M8 8.5 Q16 7 24 8.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />

        {/* Left Eye (Always Open & Happy) */}
        <circle cx="11.5" cy="15.5" r="1.8" fill="#18181B" />
        <circle cx="12.1" cy="14.9" r="0.6" fill="white" />

        {/* Right Eye - Default State (Open Circle Eye) */}
        <g className="transition-opacity duration-150 group-hover:opacity-0">
          <circle cx="20.5" cy="15.5" r="1.8" fill="#18181B" />
          <circle cx="21.1" cy="14.9" r="0.6" fill="white" />
        </g>

        {/* Right Eye - Hover State (Playful Wink 😉) */}
        <g className="transition-opacity duration-150 opacity-0 group-hover:opacity-100">
          <path 
            d="M18.8 16.2 Q20.5 13.8 22.2 16.2" 
            stroke="#18181B" 
            strokeWidth="1.6" 
            strokeLinecap="round" 
            fill="none" 
          />
        </g>

        {/* Eyebrows */}
        <path d="M10 12.5 Q11.5 11.5 13 12.5" stroke="#8B4513" strokeWidth="0.9" strokeLinecap="round" fill="none" />
        <path d="M19 12.5 Q20.5 11.5 22 12.5" stroke="#8B4513" strokeWidth="0.9" strokeLinecap="round" fill="none" />

        {/* Mouth - Default State (Classic Lego Smile) */}
        <g className="transition-opacity duration-150 group-hover:opacity-0">
          <path 
            d="M11 20.5 Q16 25 21 20.5" 
            stroke="#18181B" 
            strokeWidth="1.6" 
            strokeLinecap="round" 
            fill="none" 
          />
          {/* Smile dimple corner ticks */}
          <path d="M10.8 19.8 L11.2 21.2" stroke="#18181B" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M21.2 19.8 L20.8 21.2" stroke="#18181B" strokeWidth="1.2" strokeLinecap="round" />
        </g>

        {/* Mouth - Hover State: Melet / Sticking Tongue Out (😛) */}
        <g className="transition-all duration-200 opacity-0 group-hover:opacity-100">
          {/* Open Smile Cavity */}
          <path 
            d="M11 20.5 Q16 25.5 21 20.5 Q16 21 11 20.5 Z" 
            fill="#2B090E" 
            stroke="#18181B" 
            strokeWidth="1.3" 
            strokeLinejoin="round" 
          />
          {/* Smile Dimples */}
          <path d="M10.6 19.8 L11.2 21.2" stroke="#18181B" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M21.4 19.8 L20.8 21.2" stroke="#18181B" strokeWidth="1.2" strokeLinecap="round" />

          {/* Sticking Tongue (Lidah Melet Keluar) */}
          <g className="transform origin-[16px_21px] transition-transform duration-200 ease-out scale-y-75 group-hover:scale-y-100">
            {/* Tongue body */}
            <path 
              d="M13.2 21.2 C13.2 24.5 14 26.8 16 26.8 C18 26.8 18.8 24.5 18.8 21.2 Z" 
              fill="#FF4B72" 
              stroke="#18181B" 
              strokeWidth="1" 
            />
            {/* Center tongue groove line */}
            <path 
              d="M16 21.8 L16 25.2" 
              stroke="#C9184A" 
              strokeWidth="0.8" 
              strokeLinecap="round" 
            />
            {/* Soft highlight */}
            <ellipse cx="14.8" cy="23.2" rx="0.6" ry="1" fill="#FF8FA3" opacity="0.8" />
          </g>
        </g>

        {/* Neck */}
        <rect x="10.5" y="29.5" width="11" height="3" rx="1.2" fill="#E6AC00" stroke="#B8860B" strokeWidth="1.2" />
      </svg>
    </div>
  );
}

function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();

  // Dynamic theme-adaptive border underglow matching active zone
  // Zone 1 (Hero): Cosmic Blue/Indigo (#0055BF)
  // Zone 2 (Quotes): Solar Amber/Gold Warmth (#FFD500)
  // Zone 3 (Tech Stack & Footer): Cyber Cyan Neon (#00F0FF)
  const borderGlowColor = useTransform(
    scrollYProgress,
    [0, 0.18, 0.30, 0.72, 0.84, 1],
    [
      'rgba(0, 85, 191, 0.40)',
      'rgba(0, 85, 191, 0.45)',
      'rgba(255, 213, 0, 0.55)',
      'rgba(255, 213, 0, 0.55)',
      'rgba(0, 240, 255, 0.50)',
      'rgba(0, 240, 255, 0.50)'
    ]
  );

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Projects", path: "/projects" },
    { name: "Contact", path: "/contact" },
  ];

  // Efek untuk mendeteksi scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Efek untuk menutup menu saat navigasi dan scroll offset
  useEffect(() => {
    setIsOpen(false);
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        const yOffset = -80; 
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({top: y, behavior: 'smooth'});
      }
    }
  }, [location]);
  
  // Handle klik link: hanya smooth scroll ke atas jika sudah berada di halaman yang sama
  const handleLinkClick = (targetPath) => {
    if (location.pathname === targetPath) {
      if (window.__lenis) {
        window.__lenis.scrollTo(0, { duration: 1.0 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
    setIsOpen(false);
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled || isOpen 
          ? 'bg-[#090b12]/92 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.6)]' 
          : 'bg-[#090b12]/75 backdrop-blur-md'
      }`}
    >
      {/* Dynamic Theme Border Seam (Halus & Responsif terhadap Tema Halaman) */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-[1px] pointer-events-none"
        style={{ backgroundColor: borderGlowColor }}
      />

      {/* Ambient Glow Flare di Bawah Navbar */}
      <motion.div 
        className="absolute -bottom-2 left-1/4 right-1/4 h-3 pointer-events-none opacity-30 blur-sm"
        style={{ backgroundColor: borderGlowColor }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo Brand with LEGO Minifigure Head */}
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center"
          >
            <Link 
              to="/" 
              onClick={() => handleLinkClick('/')}
              className="flex items-center gap-2.5 sm:gap-3 group select-none py-1"
            >
              <LegoMinifigIcon />
              <span className="font-bold text-base sm:text-lg text-white tracking-tight group-hover:text-[#FFD500] transition-colors duration-200">
                Aprileo Erlangga
              </span>
            </Link>
          </motion.div>
          
          {/* Desktop Navigation - Clean, Minimalist & Free of AI-slop pill widgets */}
          <div className="hidden md:flex items-center gap-7 lg:gap-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link 
                  key={link.path}
                  to={link.path}
                  onClick={() => handleLinkClick(link.path)}
                  className={`relative py-1 text-sm font-medium transition-colors duration-200 ${
                    isActive 
                      ? 'text-white font-semibold' 
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <span>{link.name}</span>

                  {/* Clean, subtle golden indicator underline */}
                  {isActive && (
                    <motion.div 
                      layoutId="navbar-active-line"
                      className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#FFD500] rounded-full shadow-[0_0_8px_rgba(255,213,0,0.4)]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
          
          {/* Mobile menu button */}
          <motion.button 
            className="md:hidden text-slate-300 hover:text-white z-50 p-2 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-[#FFD500]/40 transition-colors"
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={isOpen ? "close" : "open"}
                initial={{ rotate: isOpen ? -90 : 0, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: isOpen ? 0 : -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {isOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                  </svg>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden overflow-hidden bg-[#090b12]/95 backdrop-blur-xl shadow-2xl"
          >
            <div className="flex flex-col py-3 px-4 space-y-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link 
                    key={link.path}
                    to={link.path}
                    onClick={() => handleLinkClick(link.path)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive 
                        ? 'text-[#FFD500] font-semibold bg-white/[0.04]' 
                        : 'text-zinc-400 hover:text-white hover:bg-white/[0.02]'
                    }`}
                  >
                    <span>{link.name}</span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FFD500]" />
                    )}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Batas / Border Divider Garis Halus di Bawah Navbar */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.12] to-transparent pointer-events-none" />
      {/* Aksen Laser Emas LEGO di Bagian Tengah Batas */}
      <div className="absolute bottom-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-[#FFD500]/50 to-transparent shadow-[0_0_10px_rgba(255,213,0,0.35)] pointer-events-none" />
      {/* Ambient Glow Halus di Batas Bawah Navbar */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 max-w-2xl h-10 pointer-events-none opacity-25"
        style={{
          background: 'radial-gradient(ellipse 60% 100% at 50% 100%, rgba(255, 213, 0, 0.4), transparent 75%)'
        }}
      />
    </nav>
  );
}

export default Navbar;