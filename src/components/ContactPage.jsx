import React from 'react';
import { motion } from 'framer-motion';
import {
  SiGithub,
  SiLinkedin,
  SiInstagram,
  SiWhatsapp,
  SiGmail,
} from 'react-icons/si';
import Footer from './Footer';
import SpaceBackground, { ClassicSpaceHoloInsignia } from './SpaceBackground';
import { IsoLegoBrick } from './LegoLoader';

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
  return (
    <div className="text-white min-h-screen relative bg-[#060814] selection:bg-[#FFD500]/20 selection:text-[#FFD500] overflow-x-clip flex flex-col justify-between">
      {/* Unified Classic Space Cosmic Background (Obsidian Void, Starfield & Lunar Horizon) */}
      <SpaceBackground showCraters={true} />

      <div className="relative z-10 flex flex-col min-h-screen justify-between">
        <main className="flex-1 flex flex-col justify-center pt-24 sm:pt-28 lg:pt-32 pb-16 sm:pb-20 px-6 sm:px-10 lg:px-12 relative">
          {/* Subtle Tablet Corner Bricks */}
          <div className="hidden sm:block lg:hidden pointer-events-none">
            <div className="absolute top-28 left-6 w-12 h-10 opacity-55 pointer-events-auto">
              <IsoLegoBrick shape="1x2" color="blue" floatY={5} floatDuration={6.4} initialRotate={-14} />
            </div>
            <div className="absolute bottom-24 right-8 w-14 h-11 opacity-55 pointer-events-auto">
              <IsoLegoBrick shape="2x2" color="yellow" floatY={6} floatDuration={7.2} floatDelay={0.6} initialRotate={12} />
            </div>
          </div>

          <section
            id="contact"
            className="w-full max-w-4xl mx-auto relative text-slate-200"
          >
            {/* Header Title (Harmonized with About Me, Tech Stack & My Projects) */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center text-center mb-12 sm:mb-14 select-none relative z-10"
            >
              <h1 className="font-pixel font-bold text-3xl sm:text-4xl md:text-5xl tracking-wide text-white uppercase select-none">
                GET IN <span className="text-[#FFD500] drop-shadow-[0_0_25px_rgba(255,213,0,0.5)]">TOUCH</span>
              </h1>

              <p className="text-slate-300 font-sans text-xs sm:text-sm md:text-base font-normal mt-2.5 sm:mt-3 max-w-xl mx-auto leading-relaxed">
                Have a project in mind, a collaboration inquiry, or simply want to connect? Reach out directly through any platform below.
              </p>
            </motion.div>

            {/* Minimalist Editorial 2-Column Links Framed with Classic Space Objects */}
            <div className="relative max-w-3xl mx-auto w-full z-10">
              {/* Left Desktop Flank: 1979 Classic Space Emblem + Floating Blue Brick */}
              <div className="hidden lg:flex flex-col items-center gap-12 absolute right-full mr-8 xl:mr-14 top-1/2 -translate-y-1/2 pointer-events-none">
                <motion.div
                  initial={{ opacity: 0, x: -20, scale: 0.92 }}
                  animate={{ opacity: 0.8, x: 0, scale: 1 }}
                  transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                >
                  <ClassicSpaceHoloInsignia className="w-20 xl:w-28 h-20 xl:h-28" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 0.85, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="w-16 xl:w-20 h-14 xl:h-16 pointer-events-auto"
                >
                  <IsoLegoBrick shape="1x2" color="blue" floatY={7} floatDuration={6.2} floatDelay={0.5} initialRotate={-12} />
                </motion.div>
              </div>

              {/* Right Desktop Flank: Interactive Zero-G Isometric LEGO Bricks */}
              <div className="hidden lg:flex flex-col items-center gap-16 absolute left-full ml-8 xl:ml-14 top-1/2 -translate-y-1/2 pointer-events-none">
                <motion.div
                  initial={{ opacity: 0, x: 20, scale: 0.92 }}
                  animate={{ opacity: 0.88, x: 0, scale: 1 }}
                  transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="w-20 xl:w-24 h-16 xl:h-20 pointer-events-auto"
                >
                  <IsoLegoBrick shape="2x2" color="yellow" floatY={8} floatDuration={5.6} initialRotate={10} />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 0.82, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.34, ease: [0.16, 1, 0.3, 1] }}
                  className="w-14 xl:w-16 h-12 xl:h-14 -ml-4 pointer-events-auto"
                >
                  <IsoLegoBrick shape="1x2" color="red" floatY={6} floatDuration={6.8} floatDelay={1.1} initialRotate={-16} />
                </motion.div>
              </div>

              {/* Subtle Architectural Corner Accents */}
              <span className="absolute -top-4 -left-4 text-zinc-600 font-mono text-xs select-none pointer-events-none opacity-40 hidden sm:block">+</span>
              <span className="absolute -top-4 -right-4 text-zinc-600 font-mono text-xs select-none pointer-events-none opacity-40 hidden sm:block">+</span>
              <span className="absolute -bottom-4 -left-4 text-zinc-600 font-mono text-xs select-none pointer-events-none opacity-40 hidden sm:block">+</span>
              <span className="absolute -bottom-4 -right-4 text-zinc-600 font-mono text-xs select-none pointer-events-none opacity-40 hidden sm:block">+</span>

              <div className="flex flex-col divide-y divide-white/[0.06]">
                {contactLinks.map((item, idx) => {
                  const Icon = item.icon;
                  const isExternal = item.href.startsWith('http');

                  return (
                    <motion.a
                      key={item.name}
                      href={item.href}
                      target={isExternal ? '_blank' : undefined}
                      rel={isExternal ? 'noopener noreferrer' : undefined}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.45,
                        delay: 0.12 + idx * 0.05,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      whileTap={{ scale: 0.99 }}
                      className="group flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-6 py-3.5 sm:py-4 px-3 -mx-3 rounded-xl hover:bg-white/[0.03] active:bg-white/[0.05] cursor-pointer select-none transition-colors duration-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-white/30"
                    >
                      {/* Platform Icon Tile + Title */}
                      <div className="flex items-center gap-3.5 sm:gap-4 transition-transform duration-200 ease-out group-hover:translate-x-1.5">
                        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/[0.04] border border-white/[0.08] border-b-2 border-b-black/70 flex items-center justify-center text-zinc-300 group-hover:text-white group-hover:border-white/25 group-hover:bg-white/[0.07] transition-all duration-200 flex-shrink-0">
                          <Icon className="w-[18px] h-[18px] sm:w-5 sm:h-5 transition-transform duration-200 group-hover:scale-105" />
                        </div>
                        <span className="text-lg sm:text-xl font-bold tracking-tight text-white">
                          {item.name}
                        </span>
                      </div>

                      {/* Full URL */}
                      <span className="text-zinc-400 group-hover:text-zinc-200 transition-colors duration-200 font-mono text-xs sm:text-sm truncate pl-[54px] sm:pl-0">
                        {item.url}
                      </span>
                    </motion.a>
                  );
                })}
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default ContactPage;
