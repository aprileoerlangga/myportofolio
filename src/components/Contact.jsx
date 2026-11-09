import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  SiGithub, 
  SiLinkedin, 
  SiInstagram, 
  SiWhatsapp, 
  SiGmail 
} from 'react-icons/si';

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

function Contact() {
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
    <section 
      id="contact" 
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="min-h-screen pt-32 pb-36 bg-transparent text-slate-200 overflow-x-clip relative flex flex-col justify-center"
    >
      {/* 1. Giant Faint Editorial Watermark in Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none -z-20 whitespace-nowrap overflow-hidden">
        <span 
          className="font-pixel text-[13vw] font-normal uppercase tracking-wider text-white/[0.035] leading-none block select-none pointer-events-none"
          style={{ fontFamily: "'Arcadepix', monospace" }}
        >
          CONTACT
        </span>
      </div>

      {/* 2. Atmospheric Ambient Light Mesh */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] max-w-[92vw] h-[480px] bg-gradient-to-tr from-[#FFD500]/[0.12] via-amber-500/[0.06] to-[#0055BF]/[0.08] blur-[130px] pointer-events-none rounded-full -z-10" />

      {/* 3. Subtle Interactive Mouse Spotlight (Direct DOM - 120 FPS zero React re-render) */}
      <div 
        ref={spotlightRef}
        className="absolute inset-0 pointer-events-none -z-10 opacity-0 transition-opacity duration-300"
      />

      <div className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 w-full relative z-10">
        
        {/* Header: Animasi halus sekali saat masuk halaman (bukan scroll) */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center pb-4 mb-16 sm:mb-20 relative z-10"
        >
          <div className="flex items-center justify-center mb-3 group cursor-pointer select-none">
            <h2 
              className="font-pixel text-4xl sm:text-5xl md:text-6xl font-normal tracking-wider text-white uppercase select-none drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)] leading-tight"
              style={{ fontFamily: "'Arcadepix', monospace" }}
            >
              GET IN <span className="text-[#FFD500] drop-shadow-[0_0_35px_rgba(255,213,0,0.65)]">TOUCH</span>
            </h2>
          </div>

          <h3 
            className="text-base sm:text-lg md:text-xl font-bold text-white tracking-tight mt-1 mb-2 max-w-2xl mx-auto"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Let's Build Something Meaningful Together.
          </h3>

          <p 
            className="text-slate-300 text-sm sm:text-base font-normal max-w-2xl mx-auto leading-relaxed"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Have a project in mind, a collaboration inquiry, or simply want to connect? Reach out directly through any platform below.
          </p>
        </motion.div>

        {/* Minimalist 2-Column Links with Subtle Architectural Framing */}
        <div className="relative max-w-3xl mx-auto w-full">
          {/* Subtle Architectural Corner Accents */}
          <span className="absolute -top-4 -left-4 text-zinc-600 font-mono text-xs select-none pointer-events-none opacity-40 hidden sm:block">+</span>
          <span className="absolute -top-4 -right-4 text-zinc-600 font-mono text-xs select-none pointer-events-none opacity-40 hidden sm:block">+</span>
          <span className="absolute -bottom-4 -left-4 text-zinc-600 font-mono text-xs select-none pointer-events-none opacity-40 hidden sm:block">+</span>
          <span className="absolute -bottom-4 -right-4 text-zinc-600 font-mono text-xs select-none pointer-events-none opacity-40 hidden sm:block">+</span>

          <div className="flex flex-col gap-5 sm:gap-6">
            {contactLinks.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.a
                  key={item.name}
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.45, 
                    delay: 0.12 + idx * 0.05, 
                    ease: [0.16, 1, 0.3, 1] 
                  }}
                  whileHover={{ x: 6 }}
                  whileTap={{ scale: 0.98 }}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-6 py-2.5 sm:py-2 px-3 -mx-3 rounded-xl hover:bg-white/[0.02] active:bg-white/[0.04] cursor-pointer select-none transition-all duration-200"
                >
                  {/* Platform Title + Logo Icon */}
                  <div className="flex items-center gap-3 sm:gap-3.5">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-zinc-300 group-hover:text-[#FFD500] group-hover:border-[#FFD500]/40 group-hover:bg-[#FFD500]/10 transition-all duration-200 shadow-sm flex-shrink-0">
                      <Icon className="w-4.5 h-4.5 sm:w-5 sm:h-5 transition-transform duration-200 group-hover:scale-110" />
                    </div>
                    <span 
                      className="text-lg sm:text-xl font-bold tracking-tight text-white group-hover:text-[#FFD500] transition-colors duration-200"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      {item.name}
                    </span>
                  </div>

                  {/* URL */}
                  <span className="text-zinc-400 group-hover:text-zinc-100 transition-colors duration-200 font-mono text-xs sm:text-sm truncate pl-12 sm:pl-0">
                    {item.url}
                  </span>
                </motion.a>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}

export default Contact;
