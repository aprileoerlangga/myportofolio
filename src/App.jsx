import { BrowserRouter as Router, useRoutes, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';
import Home from './components/Home';
import AboutPage from './components/AboutPage';
import ProjectsPage from './components/ProjectsPage';
import ContactPage from './components/ContactPage';
import LegoCurtainLoader from './components/LegoCurtainLoader';
import { IntroContext } from './context/IntroContext';

const routeConfig = [
  { path: '/', element: <Home /> },
  { path: '/about', element: <AboutPage /> },
  { path: '/projects', element: <ProjectsPage /> },
  { path: '/contact', element: <ContactPage /> },
];

/**
 * RouteWrapper:
 * Resets scroll position to top instantly when the new page mounts
 * ensuring the user always starts at the top of the new page.
 */
function RouteWrapper({ children }) {
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    });

    if (isHome) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }

    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [isHome]);

  return children;
}

/**
 * Clean, Subtle, & Snappy Page Transition (Vercel / Linear / Apple Grade)
 * - Ultra-fast (~0.22s) silky smooth route change
 * - Old page gently recedes: opacity: 0, y: -4px
 * - New page floats into focus: opacity: 0 -> 1, y: 8px -> 0px
 * - Zero screen-blocking shutter: feels featherlight, instant, and frictionless
 */
function AnimatedRoutes() {
  const location = useLocation();
  const element = useRoutes(routeConfig, location);
  const isHome = location.pathname === '/';

  return (
    <AnimatePresence mode="wait" initial={false}>
      {element && (
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className={`relative w-full ${isHome ? 'h-screen h-[100dvh] overflow-hidden' : 'min-h-screen overflow-x-clip'}`}
        >
          <RouteWrapper>
            {element}
          </RouteWrapper>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function App() {
  // Selalu aktif saat browser direload / dibuka pertama kali di semua halaman
  const [showIntro, setShowIntro] = useState(true);

  // Nonaktifkan scroll restoration otomatis browser agar posisi halaman tidak tertinggal saat reload
  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // Inisialisasi Lenis Smooth Scroll untuk gerakan scroll yang mentega (buttery smooth)
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
    });

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  // Kunci scroll body saat intro aktif agar halaman di belakang tidak bergeser secara tidak sengaja
  useEffect(() => {
    if (showIntro) {
      window.scrollTo(0, 0);
      document.body.style.overflow = 'hidden';
    }
  }, [showIntro]);

  return (
    <IntroContext.Provider value={{ showIntro }}>
      <Router>
        <AnimatePresence mode="wait">
          {showIntro && (
            <LegoCurtainLoader key="lego-curtain-loader" onComplete={() => setShowIntro(false)} />
          )}
        </AnimatePresence>
        {/* Menerapkan font 'Plus Jakarta Sans' sebagai font default aplikasi */}
        <div 
          className="font-sans bg-[#090b12] text-white transition-opacity duration-500 ease-out"
          style={{
            opacity: showIntro ? 0 : 1,
            pointerEvents: showIntro ? 'none' : 'auto',
          }}
        >
          <AnimatedRoutes />
        </div>
      </Router>
    </IntroContext.Provider>
  );
}

export default App;