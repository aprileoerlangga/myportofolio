import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  SiGithub, 
  SiLinkedin, 
  SiInstagram, 
  SiWhatsapp, 
  SiGmail 
} from 'react-icons/si';
import Navbar from './Navbar';
import Footer from './Footer';

const contactLinks = [
  {
    name: 'Github',
    url: 'https://github.com/aprileoerlangga',
    href: 'https://github.com/aprileoerlangga',
    icon: SiGithub,
  },
  {
    name: 'Linkedin',
    url: 'https://www.linkedin.com/in/aprileoerlangga/',
    href: 'https://www.linkedin.com/in/aprileoerlangga/',
    icon: SiLinkedin,
  },
  {
    name: 'Instagram',
    url: 'https://instagram.com/aprileoerlangga_',
    href: 'https://instagram.com/aprileoerlangga_',
    icon: SiInstagram,
  },
  {
    name: 'WhatsApp',
    url: 'https://wa.me/6281615252042',
    href: 'https://wa.me/6281615252042',
    icon: SiWhatsapp,
  },
  {
    name: 'Email',
    url: 'aprileoerlangga57@gmail.com',
    href: 'mailto:aprileoerlangga57@gmail.com',
    icon: SiGmail,
  },
];

function ContactPage() {
  const spotlightRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!spotlightRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    spotlightRef.current.style.background = `radial-gradient(550px circle at ${x}px ${y}px, rgba(255, 213, 0, 0.045), transparent 60%)`;
  };

  const handleMouseEnter = () => {
    if (spotlightRef.current) spotlightRef.current.style.opacity = '1';
  };

  const handleMouseLeave = () => {
    if (spotlightRef.current) spotlightRef.current.style.opacity = '0';
  };

  return (
    <div className="text-white min-h-screen relative bg-[#060a17] selection:bg-[#FFD500]/20 selection:text-[#FFD500] overflow-x-clip flex flex-col justify-between">
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* CLASSIC SPACE COSMIC BACKDROP (HARMONIZED WITH ABOUT & LOADING)        */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* 1. Deep Orbital Void & Nebula Lighting (Royal Blue, Cosmic Violet & Solar Amber) */}
        <div 
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle 950px at 80% 20%, rgba(0, 85, 191, 0.30), transparent 70%),
              radial-gradient(circle 850px at 15% 45%, rgba(121, 40, 202, 0.22), transparent 65%),
              radial-gradient(circle 1000px at 50% 90%, rgba(255, 213, 0, 0.12), transparent 70%),
              linear-gradient(180deg, #060a17 0%, #0a0e22 55%, #040711 100%)
            `
          }}
        />

        {/* 2. Universal Twinkling Space Stars Field */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-70"
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
            backgroundSize: '1440px 420px'
          }}
        />

        {/* 3. Stylized Classic Space Celestial Planet (Top-Right) */}
        <div 
          className="absolute top-8 -right-20 md:right-4 w-72 h-72 md:w-96 md:h-96 rounded-full pointer-events-none opacity-75"
          style={{
            background: 'radial-gradient(circle at 35% 35%, rgba(0, 240, 255, 0.85) 0%, rgba(0, 85, 191, 0.8) 45%, rgba(121, 40, 202, 0.85) 75%, rgba(255, 0, 128, 0.7) 100%)',
            boxShadow: '0 0 55px rgba(0, 240, 255, 0.32), inset -20px -20px 40px rgba(0, 0, 0, 0.85), inset 15px 15px 30px rgba(255, 255, 255, 0.35)',
            transform: 'translateZ(0)',
          }}
        >
          <div 
            className="absolute inset-0 rounded-full opacity-30"
            style={{
              background: 'radial-gradient(ellipse at 70% 30%, rgba(255, 255, 255, 0.8) 0%, transparent 60%)'
            }}
          />
        </div>

        {/* 4. Classic Space Perspective Cyber Launchpad Grid on Floor */}
        <div 
          className="absolute inset-x-0 bottom-0 h-[420px] pointer-events-none opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(0, 240, 255, 0.35) 1.5px, transparent 1.5px),
              linear-gradient(to bottom, rgba(255, 213, 0, 0.25) 1.5px, transparent 1.5px)
            `,
            backgroundSize: '54px 54px',
            maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.45) 45%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.45) 45%, transparent 100%)',
            transform: 'perspective(550px) rotateX(52deg)',
            transformOrigin: 'bottom center'
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen justify-between">
        <Navbar />
        
        <main className="flex-1 flex items-center justify-center py-16 sm:py-20 px-6 sm:px-10 lg:px-12">
          <section id="contact" className="w-full max-w-4xl mx-auto">
            
            {/* Header Title */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-10 sm:mb-12"
            >
              <h1 
                className="font-pixel text-4xl sm:text-5xl md:text-6xl font-normal tracking-wider text-white uppercase select-none mb-3"
                style={{ fontFamily: "'Arcadepix', monospace" }}
              >
                CONNECT <span className="text-[#FFD500] drop-shadow-[0_0_25px_rgba(255,213,0,0.5)]">WITH ME</span>
              </h1>
              <p className="text-slate-400 text-sm sm:text-base max-w-md mx-auto">
                Tertarik berkolaborasi atau sekadar berdiskusi tentang arsitektur kode? Hubungi saya melalui tautan di bawah.
              </p>
            </motion.div>

            {/* Interactive Tactile Contact Grid Card */}
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.65, delay: 0.1 }}
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="relative rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden"
            >
              {/* Dynamic Spotlight Effect Following Cursor */}
              <div 
                ref={spotlightRef}
                className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-0"
                style={{
                  background: 'radial-gradient(550px circle at 0px 0px, rgba(255, 213, 0, 0.045), transparent 60%)',
                }}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 relative z-10">
                {contactLinks.map((item, idx) => {
                  const Icon = item.icon;
                  const isEmail = item.name === 'Email';
                  
                  return (
                    <motion.a
                      key={item.name}
                      href={item.href}
                      target={isEmail ? '_self' : '_blank'}
                      rel={isEmail ? '' : 'noopener noreferrer'}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, delay: 0.15 + idx * 0.06 }}
                      whileHover={{ y: -3, scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      className={`group relative flex items-center gap-4 p-4 sm:p-5 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] hover:border-[#FFD500]/40 transition-all duration-200 select-none ${
                        isEmail ? 'sm:col-span-2' : ''
                      }`}
                    >
                      {/* Left Icon with subtle glow */}
                      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-slate-800/80 border border-white/10 flex items-center justify-center text-[#FFD500] group-hover:scale-110 group-hover:bg-[#FFD500] group-hover:text-zinc-950 transition-all duration-200 shadow-md">
                        <Icon className="text-xl sm:text-2xl" />
                      </div>

                      {/* Text Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm sm:text-base text-white group-hover:text-[#FFD500] transition-colors duration-150">
                            {item.name}
                          </span>
                          <span className="text-xs text-slate-500 group-hover:text-slate-300 transition-colors duration-150">
                            &rarr;
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-400 truncate mt-0.5 font-mono">
                          {item.url.replace('https://', '')}
                        </p>
                      </div>
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>

          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default ContactPage;
