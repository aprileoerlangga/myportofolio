// Navbar.jsx - Concept 3: The LEGO Movie Builder HUD
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';


// Iconic Classic LEGO Minifigure Head Vector Icon with interactive playful wink on hover
function LegoMinifigIcon() {
  return (
    <div className="relative w-8 h-9 sm:w-9 sm:h-10 flex-shrink-0 flex items-center justify-center select-none cursor-pointer">
      <svg 
        viewBox="0 0 32 36" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        className="w-full h-full drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)] -rotate-6 group-hover:-rotate-12 group-hover:scale-105 transition-all duration-300"
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
  const navRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

  // Efek untuk menutup menu saat navigasi, sinkronkan backdrop scroll, dan scroll offset
  useEffect(() => {
    setIsOpen(false);
    const rafId = requestAnimationFrame(() => {
      setScrolled(window.scrollY > 15);
    });
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        const yOffset = -80;
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
    return () => cancelAnimationFrame(rafId);
  }, [location]);

  // Tutup menu mobile otomatis saat klik di luar navbar atau menekan Escape
  useEffect(() => {
    if (!isOpen) return;
    const handlePointerDown = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

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
    <motion.nav
      ref={navRef}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled
          ? 'bg-[#060814]/80 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
          : 'bg-transparent'
      }`}
    >
      {/* Clean Single Border with Soft Golden Horizon Accent - Muncul halus saat di-scroll */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-[1px] bg-white/[0.07] pointer-events-none transition-opacity duration-300 ${
          scrolled ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <div
        className={`absolute bottom-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-[#FFD500]/40 to-transparent pointer-events-none transition-opacity duration-300 ${
          scrolled ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo Brand with LEGO Minifigure Head & Red Space Banner Lockup */}
          <div className="flex items-center">
            <Link
              to="/"
              onClick={() => handleLinkClick('/')}
              className="flex items-center group select-none py-1"
            >
              {/* LEGO Minifigure Head Icon */}
              <div className="relative z-10 flex-shrink-0 -mr-2 sm:-mr-2.5">
                <LegoMinifigIcon />
              </div>

              {/* Clean Solid LEGO Red Banner */}
              <div className="h-7 sm:h-[30px] flex items-center pl-3.5 sm:pl-4 pr-3 sm:pr-3.5 rounded-r-md rounded-l-none bg-[#E52521] hover:bg-[#D11013] border-y border-r border-red-400/30 shadow-[0_2px_8px_rgba(229,37,33,0.35)] group-hover:shadow-[0_2px_14px_rgba(229,37,33,0.55)] transition-all duration-200">
                <span className="font-['Space_Grotesk'] font-bold text-xs sm:text-[13px] text-white tracking-normal whitespace-nowrap select-none">
                  aprileoerlangga
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation - Clean, Minimalist & Kinetic Golden Line Indicator */}
          <div className="hidden md:flex items-center gap-7 lg:gap-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => handleLinkClick(link.path)}
                  className={`relative py-1 text-sm font-medium transition-colors duration-200 select-none ${
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
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Mobile 3-Line Hamburger Toggle Button */}
          <motion.button
            type="button"
            whileTap={{ scale: 0.92 }}
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            className="md:hidden relative z-50 w-9 h-9 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-zinc-200 hover:text-white flex items-center justify-center transition-colors"
          >
            <div className="w-[18px] h-4 relative flex flex-col justify-center items-center">
              <motion.span
                animate={isOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -5 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="absolute w-[18px] h-[1.5px] rounded-full bg-current"
              />
              <motion.span
                animate={isOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                className="absolute w-[18px] h-[1.5px] rounded-full bg-current"
              />
              <motion.span
                animate={isOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 5 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="absolute w-[18px] h-[1.5px] rounded-full bg-current"
              />
            </div>
          </motion.button>
        </div>
      </div>

      {/* Editorial Full-Width Mobile Menu Drawer (Clean Obsidian & Hairline Dividers) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden border-t border-b border-white/[0.08] bg-[#060814]/95 backdrop-blur-2xl shadow-[0_24px_48px_rgba(0,0,0,0.8)]"
          >
            <div className="flex flex-col px-6 py-2 divide-y divide-white/[0.06]">
              {navLinks.map((link, idx) => {
                const isActive = location.pathname === link.path;
                return (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.2,
                      delay: idx * 0.035,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => handleLinkClick(link.path)}
                      className={`block py-3.5 px-3 -mx-3 rounded-xl text-[15px] font-sans tracking-wide transition-colors duration-150 ${
                        isActive
                          ? 'bg-white/[0.06] text-white font-semibold'
                          : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.03] font-normal'
                      }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

export default Navbar;