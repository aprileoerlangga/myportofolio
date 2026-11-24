// src/components/Footer.jsx

import { SiGithub } from 'react-icons/si';

function Footer() {
  return (
    <footer className="relative bg-transparent border-t border-white/[0.06] overflow-hidden z-20 font-space">
      {/* Aksen Horizon Emas Lembut Menyelaraskan dengan Top Navbar */}
      <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-[#FFD500]/30 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-col sm:flex-row justify-between items-center gap-3 relative z-20">
        <p className="text-xs sm:text-sm text-slate-400 font-medium tracking-wide text-center sm:text-left">
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
            see recent updates on GitHub
          </span>
        </a>
      </div>
    </footer>
  );
}

export default Footer;
