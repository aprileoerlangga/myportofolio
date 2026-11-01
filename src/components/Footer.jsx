// src/components/Footer.jsx

import { motion } from 'framer-motion';
import { SiGithub } from 'react-icons/si';

function Footer() {
  return (
    <footer className="relative py-8 bg-transparent overflow-hidden">
      {/* Batas / Border Divider Garis Halus */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />
      {/* Aksen Laser Emas LEGO di Bagian Tengah Batas */}
      <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-[#FFD500]/50 to-transparent shadow-[0_0_10px_rgba(255,213,0,0.35)]" />
      {/* Ambient Glow Halus di Batas Atas Footer */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-2xl h-10 pointer-events-none opacity-25"
        style={{
          background: 'radial-gradient(ellipse 60% 100% at 50% 0%, rgba(255, 213, 0, 0.4), transparent 75%)'
        }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-left"
      >
        <p className="text-xs sm:text-sm text-slate-400 hover:text-[#FFD500] transition-colors duration-200 font-medium tracking-wide">
          © 2026 Aprileo Erlangga
        </p>

        <a
          href="https://github.com/aprileoerlangga"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs sm:text-sm text-slate-400 hover:text-[#FFD500] transition-colors duration-200 group"
          title="Visit Aprileo Erlangga on GitHub"
        >
          <SiGithub className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors flex-shrink-0" />
          <span className="font-medium tracking-wide group-hover:underline underline-offset-4 decoration-[#FFD500]/60">
            see the recent update on my Github
          </span>
        </a>
      </motion.div>
    </footer>
  );
}

export default Footer;