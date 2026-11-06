// src/components/Footer.jsx

import { motion } from 'framer-motion';
import { SiGithub } from 'react-icons/si';

function Footer() {
  return (
    <footer className="relative bg-[#090b12]/92 backdrop-blur-xl border-t border-cyan-400/30 overflow-hidden shadow-[0_-10px_35px_rgba(0,0,0,0.8)] z-20">
      {/* Aksen Laser Emas LEGO di Bagian Tengah Batas */}
      <div className="absolute top-0 left-1/4 right-1/4 h-[1.5px] bg-gradient-to-r from-transparent via-[#FFD500] to-transparent shadow-[0_0_12px_rgba(255,213,0,0.7)]" />
      {/* Ambient Glow Halus di Batas Atas Footer */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-xl h-10 pointer-events-none opacity-30"
        style={{
          background: 'radial-gradient(ellipse 60% 100% at 50% 0%, rgba(0, 240, 255, 0.45) 0%, rgba(255, 213, 0, 0.25) 50%, transparent 75%)'
        }}
      />

      <div className="max-w-3xl mx-auto px-6 py-4 sm:py-5 flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-6 text-center relative z-20">
        <p className="text-xs sm:text-sm text-slate-400 font-medium tracking-wide">
          © 2026 Aprileo Erlangga
        </p>

        <span className="hidden sm:inline-block text-slate-600 select-none">•</span>

        <a
          href="https://github.com/aprileoerlangga"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs sm:text-sm text-slate-400 hover:text-[#FFD500] transition-colors duration-200 group"
          title="Visit Aprileo Erlangga on GitHub"
        >
          <SiGithub className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors flex-shrink-0" />
          <span className="font-medium tracking-wide group-hover:underline underline-offset-4 decoration-[#FFD500]/60">
            see recent updates on GitHub
          </span>
        </a>
      </div>
    </footer>
  );
}

export default Footer;