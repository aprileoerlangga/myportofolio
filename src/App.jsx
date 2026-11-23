import { BrowserRouter as Router, useRoutes, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';
import HomePage from './components/HomePage';
import AboutPage from './components/AboutPage';
import ProjectsPage from './components/ProjectsPage';
import ContactPage from './components/ContactPage';
import LegoLoader from './components/LegoLoader';
import LegoTransition from './components/LegoTransition';
import { IntroContext } from './context/IntroContext';

const otherRouteConfig = [
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

    if (window.__lenis) {
      window.__lenis.scrollTo(0, { immediate: true });
    }

    const isDesktop = window.innerWidth >= 1024;
    if (isHome && isDesktop) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      if (window.__lenis) window.__lenis.stop();
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      if (window.__lenis) {
        if (isHome) window.__lenis.stop();
        else window.__lenis.start();
      }
    }

    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [location.pathname, isHome]);

  return children;
}

/**
 * MainNavigationRoutes:
 * - Persistent Zero-Jank Home Page: Remains warm in memory across route changes.
 *   Three.js WebGL context, compiled shaders, and text NEVER re-mount from scratch.
 * - Instantly live & realtime on return (0ms delay, 0ms freeze).
 * - Smooth cross-fade transitions for /about, /projects, and /contact.
 */
function MainNavigationRoutes() {
  const location = useLocation();
  const otherRoutesElement = useRoutes(otherRouteConfig, location);
  const isHome = location.pathname === '/';

  return (
    <div className="relative w-full min-h-screen">
      {/* Persistent Zero-Jank Home Page with Featherlight Micro-Glide */}
      <motion.div 
        initial={false}
        animate={isHome ? {
          opacity: 1,
          y: 0,
          scale: 1,
          pointerEvents: 'auto',
          visibility: 'visible',
          transition: { duration: 0.20, ease: [0.16, 1, 0.3, 1] }
        } : {
          opacity: 0,
          y: -6,
          scale: 0.995,
          pointerEvents: 'none',
          transitionEnd: { visibility: 'hidden' },
          transition: { duration: 0.16, ease: [0.16, 1, 0.3, 1] }
        }}
        className="fixed inset-0 w-full h-full z-10 will-change-transform"
        aria-hidden={!isHome}
      >
        <RouteWrapper>
          <HomePage isHome={isHome} />
        </RouteWrapper>
      </motion.div>

      {/* Cross-Page Transitions for /about, /projects, /contact with Featherlight Micro-Glide */}
      <AnimatePresence mode="wait" initial={false}>
        {!isHome && otherRoutesElement && (
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full min-h-screen overflow-x-clip z-20 will-change-transform"
          >
            <RouteWrapper>
              {otherRoutesElement}
            </RouteWrapper>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function App() {
  // Selalu aktif saat browser direload / dibuka pertama kali di semua halaman
  const [showIntro, setShowIntro] = useState(true);
  const [brickWipeActive, setBrickWipeActive] = useState(false);

  const startBrickWipe = (onMidpoint) => {
    setBrickWipeActive(true);
    // Give the shatter burst 80ms to reach full visual velocity before swapping routes
    setTimeout(() => {
      if (onMidpoint) onMidpoint();
    }, 80);
    setTimeout(() => {
      setBrickWipeActive(false);
    }, 550);
  };

  // Nonaktifkan scroll restoration otomatis browser agar posisi halaman tidak tertinggal saat reload
  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // Inisialisasi Lenis Smooth Scroll untuk gerakan scroll yang mentega (buttery smooth)
    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
    });
    window.__lenis = lenis;

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      delete window.__lenis;
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
    <IntroContext.Provider value={{ showIntro, startBrickWipe }}>
      <Router>
        <AnimatePresence mode="wait">
          {showIntro && (
            <LegoLoader key="lego-loader" onComplete={() => setShowIntro(false)} />
          )}
        </AnimatePresence>

        {/* Global Lego Red Brick Impact & Shatter Explosion Overlay */}
        <AnimatePresence>
          {brickWipeActive && <LegoTransition />}
        </AnimatePresence>

        {/* Menerapkan font 'Plus Jakarta Sans' sebagai font default aplikasi */}
        <div 
          className="font-sans bg-[#060a17] text-white transition-opacity duration-500 ease-out"
          style={{
            opacity: showIntro ? 0 : 1,
            pointerEvents: showIntro ? 'none' : 'auto',
          }}
        >
          <MainNavigationRoutes />
        </div>
      </Router>
    </IntroContext.Provider>
  );
}

export default App;
