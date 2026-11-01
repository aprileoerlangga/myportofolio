// src/components/Projects.jsx
// Perfected 3D HeroParallax — Menggabungkan estetika Zulfian dengan viewport centering tanpa blank void

import React, { useState, useEffect, useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
} from 'framer-motion';
import {
  FiGithub,
  FiExternalLink,
  FiMaximize2,
  FiX,
  FiFolder,
  FiArrowUpRight,
} from 'react-icons/fi';

// Gambar proyek orisinal milik Aprileo
import iotImage from '../assets/IoT.png';
import rosaStoreImage from '../assets/RosaStore.png';
import fishAiImage from '../assets/FishAI.png';
import iwakmartImage from '../assets/Iwakmart Mobile.jpg';
import portokuImage from '../assets/Web Portoku.jpeg';

// Baris 1: 3 Proyek
const row1Projects = [
  {
    id: 1,
    title: 'Aplikasi Mobile Fish AI',
    subtitle: 'AI Diagnostic Mobile App',
    category: 'Mobile & AI',
    description:
      'Aplikasi diagnosis cerdas penyakit ikan & udang berbasis Computer Vision & AI. Menghadirkan deteksi gejala instan dengan rekomendasi penanganan akurat untuk peternak.',
    link: 'https://github.com/aprileoerlangga/FishAI.git',
    thumbnail: fishAiImage,
    isMobile: true,
    tags: ['Flutter', 'TensorFlow', 'FastAPI'],
    accentColor: '#14b8a6',
  },
  {
    id: 2,
    title: 'Web E-commerce Handphone',
    subtitle: 'Rosa Store Online Marketplace',
    category: 'Fullstack Web',
    description:
      'Platform e-commerce modern dengan katalog produk handphone, manajemen keranjang belanja, checkout instan, serta sistem autentikasi aman.',
    link: 'https://github.com/aprileoerlangga/ecommerce-handphone.git',
    thumbnail: rosaStoreImage,
    isMobile: false,
    tags: ['React', 'Node.js', 'Tailwind CSS'],
    accentColor: '#38bdf8',
  },
  {
    id: 3,
    title: 'Iwakmart Mobile App',
    subtitle: 'Fishery Marketplace Ecosystem',
    category: 'Mobile Application',
    description:
      'Aplikasi marketplace perikanan digital untuk menghubungkan peternak ikan langsung dengan konsumen dengan pelacakan harga dan pemesanan segar.',
    link: 'https://github.com/aprileoerlangga',
    thumbnail: iwakmartImage,
    isMobile: false,
    tags: ['Flutter', 'Firebase', 'State Mgmt'],
    accentColor: '#3b82f6',
  },
];

// Baris 2: 3 Proyek
const row2Projects = [
  {
    id: 4,
    title: 'IoT GPS Tracker Bagpack',
    subtitle: 'Real-Time Location Tracking',
    category: 'IoT & Hardware',
    description:
      'Sistem pelacakan tas ransel pintar terintegrasi mikrokontroler GPS, GSM module, dan dashboard pemantauan lokasi real-time interaktif berbasis web.',
    link: 'https://github.com/aprileoerlangga/GPSTrackerBag.git',
    thumbnail: iotImage,
    isMobile: false,
    tags: ['C++', 'IoT Sensor', 'Google Maps API'],
    accentColor: '#06b6d4',
  },
  {
    id: 5,
    title: 'Personal Web Portfolio',
    subtitle: 'Interactive 3D Experience',
    category: 'Frontend Engineering',
    description:
      'Website portofolio kreatif dengan integrasi karakter 3D Lego interaktif, animasi transisi halus, audio-visual responsif, dan styling modern.',
    link: 'https://github.com/aprileoerlangga/my-portofolio.git',
    thumbnail: portokuImage,
    isMobile: false,
    tags: ['React 19', 'Three.js', 'Framer Motion'],
    accentColor: '#FFD500',
  },
  {
    id: 6,
    title: 'GitHub & Open Source',
    subtitle: 'Explore More Repositories',
    category: 'Open Source',
    description:
      'Kunjungi profil GitHub saya untuk menjelajahi berbagai riset, eksperimen AI, otomasi, dan repositori proyek sumber terbuka lainnya.',
    link: 'https://github.com/aprileoerlangga',
    thumbnail: null,
    isGitHubCard: true,
    tags: ['GitHub', 'Git', 'Open Source'],
    accentColor: '#FFD500',
  },
];

export function Projects() {
  const containerRef = useRef(null);
  const [modalImage, setModalImage] = useState(null);

  // Scroll tracking dalam runway yang terukur pas
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Spring physics yang responsif dan mentega persis Aceternity
  const springConfig = { stiffness: 220, damping: 28 };

  // 1. Header Transition: Muncul megah di awal, lalu fade out lembut saat panggung 3D mendatar
  const headerOpacity = useSpring(
    useTransform(scrollYProgress, [0, 0.16], [1, 0]),
    springConfig
  );
  const headerY = useSpring(
    useTransform(scrollYProgress, [0, 0.16], [0, -60]),
    springConfig
  );

  // 2. 3D Perspective Rotation & Scale (Miring diagonal 3D -> Datar sempurna di panggung)
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.20], [16, 0]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.20], [18, 0]),
    springConfig
  );
  const stageOpacity = useSpring(
    useTransform(scrollYProgress, [0, 0.15], [0.35, 1]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.20], [-260, 0]),
    springConfig
  );
  const stageScale = useSpring(
    useTransform(scrollYProgress, [0, 0.20], [0.92, 1]),
    springConfig
  );

  // 3. Horizontal Gliding: Berlawanan arah dengan jarak yang pas
  const translateX = useSpring(
    useTransform(scrollYProgress, [0.15, 0.90], ['6%', '-32%']),
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0.15, 0.90], ['-32%', '6%']),
    springConfig
  );

  // Keyboard shortcut Esc untuk menutup modal gambar
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setModalImage(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div
      ref={containerRef}
      id="projects"
      className="relative w-full h-[280vh] sm:h-[300vh] bg-[#090b12] text-white"
    >
      {/* Viewport Stage Terkunci Pas di Tengah Layar Tanpa Blank Void */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center overflow-hidden select-none z-10 [perspective:1000px] [transform-style:preserve-3d]">
        
        {/* Background Ambient Glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full blur-[140px] pointer-events-none opacity-20 transition-all duration-700"
          style={{ background: '#FFD500' }}
        />

        {/* 1. HERO HEADER (Gaya Zulfian: Megah, Left-Aligned, Bergeser Lembut) */}
        <motion.div
          style={{
            opacity: headerOpacity,
            y: headerY,
          }}
          className="absolute top-16 sm:top-20 left-0 right-0 max-w-7xl mx-auto px-6 lg:px-8 z-30 pointer-events-none"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFD500]/10 border border-[#FFD500]/30 text-xs font-semibold text-[#FFD500] mb-3 shadow-[0_0_20px_rgba(255,213,0,0.15)]">
            <span className="w-2 h-2 rounded-full bg-[#FFD500] animate-pulse" />
            Selected Works & Engineering
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
            My <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FFD500] via-[#FFE566] to-[#FF9E00] drop-shadow-[0_2px_20px_rgba(255,213,0,0.25)]">Projects</span>
          </h1>
          <p className="max-w-xl text-xs sm:text-sm text-neutral-400 mt-2 leading-relaxed">
            Koleksi aplikasi mobile, full-stack web, dan sistem IoT dengan arsitektur modern.
          </p>
        </motion.div>

        {/* 2. PANGGUNG 3D PARALLAX WIDESCREEN (ESTETIK, LAPANG & CRISP) */}
        <motion.div
          style={{
            rotateX,
            rotateZ,
            translateY,
            scale: stageScale,
            opacity: stageOpacity,
          }}
          className="[transform-style:preserve-3d] w-full flex flex-col justify-center gap-4 sm:gap-6 my-auto"
        >
          {/* BARIS 1: REVERSE HORIZONTAL MOTION */}
          <div className="relative w-full overflow-visible">
            <motion.div
              style={{ x: translateX }}
              className="flex items-center gap-5 sm:gap-8 px-6 sm:px-10 flex-nowrap"
            >
              {row1Projects.map((project) => (
                <ProductCard
                  key={project.id}
                  project={project}
                  onOpenModal={setModalImage}
                />
              ))}
            </motion.div>
          </div>

          {/* BARIS 2: FORWARD HORIZONTAL MOTION */}
          <div className="relative w-full overflow-visible">
            <motion.div
              style={{ x: translateXReverse }}
              className="flex items-center gap-5 sm:gap-8 px-6 sm:px-10 flex-nowrap"
            >
              {row2Projects.map((project) => (
                <ProductCard
                  key={project.id}
                  project={project}
                  onOpenModal={setModalImage}
                />
              ))}
            </motion.div>
          </div>
        </motion.div>

      </div>

      {/* 3. FULLSCREEN LIGHTBOX MODAL */}
      <AnimatePresence>
        {modalImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full max-h-[90vh] bg-[#0d121f] rounded-2xl border border-[#FFD500]/30 shadow-[0_25px_70px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col"
            >
              {/* Header Modal */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#070a10]">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#FFD500]">
                    {modalImage.category}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    {modalImage.title}
                  </h3>
                </div>
                <button
                  onClick={() => setModalImage(null)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* Tampilan Gambar Full Resolusi */}
              <div className="relative flex-1 bg-black/50 p-4 sm:p-6 flex items-center justify-center overflow-auto">
                <img
                  src={modalImage.thumbnail}
                  alt={modalImage.title}
                  className="max-w-full max-h-[60vh] object-contain rounded-lg drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
                />
              </div>

              {/* Footer Modal dengan Tombol Akses Repo */}
              <div className="px-6 py-4 border-t border-white/10 bg-[#070a10] flex items-center justify-between gap-4">
                <p className="text-xs text-neutral-400 max-w-xl">
                  {modalImage.description}
                </p>
                <a
                  href={modalImage.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFD500] hover:bg-[#ffe033] text-black text-xs font-bold transition-all shadow-[0_4px_15px_rgba(255,213,0,0.3)] hover:scale-105 active:scale-95 flex-shrink-0"
                >
                  <FiGithub className="w-4 h-4" />
                  <span>Lihat Repository</span>
                  <FiExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Subkomponen ProductCard (Widescreen, Bersih, Estetik, dan Interaktif ala Zulfian)
function ProductCard({ project, onOpenModal }) {
  if (project.isGitHubCard) {
    return (
      <motion.div
        whileHover={{ y: -12, scale: 1.02 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="group relative flex-shrink-0 h-48 sm:h-56 md:h-64 w-[20rem] sm:w-[25rem] md:w-[29rem] rounded-2xl bg-gradient-to-br from-[#121829] to-[#0d121f] border border-[#FFD500]/30 hover:border-[#FFD500] shadow-[0_15px_35px_rgba(0,0,0,0.7)] hover:shadow-[0_25px_50px_rgba(255,213,0,0.2)] p-5 sm:p-6 flex flex-col justify-between transition-all"
      >
        <div className="flex items-start justify-between">
          <div className="w-10 h-10 rounded-xl bg-[#FFD500]/10 border border-[#FFD500]/30 flex items-center justify-center text-[#FFD500] shadow-[0_0_20px_rgba(255,213,0,0.2)]">
            <FiFolder className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider text-[#FFD500] bg-[#FFD500]/10 border border-[#FFD500]/30">
            {project.category}
          </span>
        </div>

        <div>
          <h3 className="text-base sm:text-lg md:text-xl font-extrabold text-white group-hover:text-[#FFD500] transition-colors flex items-center gap-2">
            {project.title}
            <FiArrowUpRight className="w-4 h-4 opacity-70 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </h3>
          <p className="text-[10px] sm:text-xs text-neutral-300 mt-1 line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <div className="flex items-center gap-1.5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-[9px] sm:text-[10px] px-2 py-0.5 rounded-md bg-white/[0.06] border border-white/10 text-neutral-300 font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#FFD500] hover:bg-[#ffe033] text-black text-[11px] font-bold transition-all shadow-[0_2px_10px_rgba(255,213,0,0.3)] hover:scale-105 active:scale-95"
          >
            <FiGithub className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -12, scale: 1.02 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="group relative flex-shrink-0 h-48 sm:h-56 md:h-64 w-[20rem] sm:w-[25rem] md:w-[29rem] rounded-2xl bg-[#0d121f] border border-white/10 hover:border-[#FFD500]/60 shadow-[0_15px_35px_rgba(0,0,0,0.8)] hover:shadow-[0_25px_50px_rgba(255,213,0,0.2)] overflow-hidden transition-all duration-300"
    >
      {/* 1. Gambar Proyek 100% Utuh & Bersih (Tanpa Terpotong) */}
      <div className="relative w-full h-full bg-[#070a10] flex items-center justify-center p-2.5 sm:p-3 overflow-hidden">
        {/* Ambient Glow di belakang gambar */}
        <img
          src={project.thumbnail}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-125 pointer-events-none"
        />

        {project.isMobile ? (
          // Thumbnail HP ramping
          <img
            src={project.thumbnail}
            alt={project.title}
            className="relative z-10 max-h-[94%] w-auto object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.9)]"
          />
        ) : (
          // Landscape Web Screenshot 100% Utuh
          <img
            src={project.thumbnail}
            alt={project.title}
            className="relative z-10 max-w-full max-h-full object-contain rounded-xl drop-shadow-[0_10px_25px_rgba(0,0,0,0.85)]"
          />
        )}

        {/* Tombol Zoom Modal di Pojok Kanan Atas */}
        <button
          onClick={() => onOpenModal(project)}
          aria-label="Lihat gambar penuh"
          title="Lihat Gambar Penuh"
          className="absolute top-2.5 right-2.5 z-30 p-1.5 rounded-xl bg-black/60 hover:bg-black/90 border border-white/10 text-neutral-300 hover:text-white transition-all shadow-md backdrop-blur-md"
        >
          <FiMaximize2 className="w-3.5 h-3.5" />
        </button>

        {/* Strip Judul Minimalis Bawah (Selalu Tampak) */}
        <div className="absolute bottom-0 inset-x-0 p-2.5 sm:p-3 bg-gradient-to-t from-black/95 via-black/60 to-transparent flex items-center justify-between z-20 group-hover:opacity-0 transition-opacity duration-300">
          <div>
            <span className="text-[9px] font-semibold uppercase tracking-wider text-[#FFD500]">
              {project.category}
            </span>
            <h4 className="text-xs sm:text-sm font-bold text-white truncate max-w-[18rem]">
              {project.title}
            </h4>
          </div>
          <span className="text-[10px] text-neutral-400 font-mono">0{project.id}</span>
        </div>
      </div>

      {/* 2. Glass Overlay Interaktif Saat Hover (Menampilkan Detail & Tombol Repo) */}
      <div className="absolute inset-0 bg-[#070a12]/94 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 sm:p-5 flex flex-col justify-between z-20">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider text-[#FFD500] bg-[#FFD500]/10 border border-[#FFD500]/30">
              {project.category}
            </span>
            <span className="text-[10px] text-neutral-400 font-mono">0{project.id} / 06</span>
          </div>

          <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
            {project.title}
          </h3>

          <p className="text-[10px] sm:text-xs text-neutral-300 mt-1.5 line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        </div>

        <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1 max-w-[60%]">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-[8.5px] sm:text-[9px] px-1.5 py-0.5 rounded bg-white/[0.08] border border-white/10 text-neutral-300 font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-[#FFD500] hover:bg-[#ffe033] text-black text-[11px] font-bold transition-all shadow-[0_2px_10px_rgba(255,213,0,0.3)] hover:scale-105 active:scale-95 flex-shrink-0"
          >
            <FiGithub className="w-3 h-3" />
            <span>Repository</span>
            <FiExternalLink className="w-2.5 h-2.5 opacity-70" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export default Projects;