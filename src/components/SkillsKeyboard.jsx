import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useScroll } from 'framer-motion';

// Official, world-standard high-contrast vector icons from Simple Icons & FontAwesome
import {
  SiHtml5,
  SiCss3,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiNodedotjs,
  SiExpress,
  SiPython,
  SiMongodb,
  SiGit,
  SiGithub,
  SiPostgresql,
  SiNpm,
  SiMysql,
  SiPhp,
  SiLinux,
  SiDocker,
  SiFlutter,
  SiDart,
  SiLaravel,
  SiFigma,
} from 'react-icons/si';
import { FaJava } from 'react-icons/fa6';

// ======================================================================
// 1. KEYCAP LOGO COMPONENTS (Ultra-Crisp, Bold, High-Contrast White Symbols)
// Sized generously (w-7 h-7 sm:w-8 sm:h-8) so every tool is 100% distinct,
// instantly recognizable, and perfectly matching the user's reference photo!
// ======================================================================
export const KEYCAP_ICONS = {
  // JavaScript: Bold white typography 'JS'
  javascript: () => (
    <span className="font-black text-2xl sm:text-[26px] text-white tracking-tight leading-none select-none drop-shadow-[0_2px_3px_rgba(0,0,0,0.85)]">
      JS
    </span>
  ),

  // TypeScript: Bold white typography 'TS'
  typescript: () => (
    <span className="font-black text-2xl sm:text-[26px] text-white tracking-tight leading-none select-none drop-shadow-[0_2px_3px_rgba(0,0,0,0.85)]">
      TS
    </span>
  ),

  // HTML5: Official shield with '5'
  html5: () => (
    <SiHtml5 className="w-7 h-7 sm:w-8 sm:h-8 text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.85)]" />
  ),

  // CSS3: Official shield with '3' (Now on BLUE keycap as requested!)
  css3: () => (
    <SiCss3 className="w-7 h-7 sm:w-8 sm:h-8 text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.85)]" />
  ),

  // React: Iconic atom
  react: () => (
    <SiReact className="w-7 h-7 sm:w-8 sm:h-8 text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.85)]" />
  ),

  // Java: Steaming coffee cup (Now on BLACK keycap as requested!)
  java: () => (
    <FaJava className="w-7 h-7 sm:w-8 sm:h-8 text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.85)]" />
  ),

  // Next.js: Official white circular badge with bold black 'N' (Exact match to reference photo!)
  nextjs: () => (
    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white flex items-center justify-center shadow-md">
      <SiNextdotjs className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-black" />
    </div>
  ),

  // Tailwind CSS: Twin waves
  tailwind: () => (
    <SiTailwindcss className="w-7 h-7 sm:w-8 sm:h-8 text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.85)]" />
  ),

  // Node.js: Stylized hexagon
  nodejs: () => (
    <SiNodedotjs className="w-7 h-7 sm:w-8 sm:h-8 text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.85)]" />
  ),

  // Express.js: Italic 'ex'
  express: () => (
    <span className="font-black text-2xl sm:text-[26px] text-white tracking-tighter italic leading-none select-none drop-shadow-[0_2px_3px_rgba(0,0,0,0.85)]">
      ex
    </span>
  ),

  // Python: Official dual serpents
  python: () => (
    <SiPython className="w-7 h-7 sm:w-8 sm:h-8 text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.85)]" />
  ),

  // MongoDB: Official leaf
  mongodb: () => (
    <SiMongodb className="w-7 h-7 sm:w-8 sm:h-8 text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.85)]" />
  ),

  // Git: Official red branch inside white diamond badge (Exact match to reference photo!)
  git: () => (
    <div className="w-6 h-6 sm:w-6.5 sm:h-6.5 rounded-[4px] bg-white flex items-center justify-center rotate-45 shadow-sm">
      <SiGit className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#EF4444] -rotate-45" />
    </div>
  ),

  // GitHub: Official black Octocat inside white circle badge (Exact match to reference photo!)
  github: () => (
    <div className="w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full bg-white flex items-center justify-center shadow-sm">
      <SiGithub className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-black" />
    </div>
  ),

  // PostgreSQL: Official Slonik elephant head
  postgres: () => (
    <SiPostgresql className="w-7 h-7 sm:w-8 sm:h-8 text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.85)]" />
  ),

  // npm: Official package block with cutouts
  npm: () => (
    <SiNpm className="w-8 h-8 sm:w-9 sm:h-9 text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.85)]" />
  ),

  // MySQL: Official dolphin
  mysql: () => (
    <SiMysql className="w-8 h-8 sm:w-9 sm:h-9 text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.85)]" />
  ),

  // PHP: Official oval emblem with PHP
  php: () => (
    <SiPhp className="w-8 h-8 sm:w-9 sm:h-9 text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.85)]" />
  ),

  // Linux: Official Tux the penguin
  linux: () => (
    <SiLinux className="w-7 h-7 sm:w-8 sm:h-8 text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.85)]" />
  ),

  // Docker: Official whale carrying containers
  docker: () => (
    <SiDocker className="w-8 h-8 sm:w-8.5 sm:h-8.5 text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.85)]" />
  ),

  // Flutter: Official flutter wing
  flutter: () => (
    <SiFlutter className="w-7 h-7 sm:w-8 sm:h-8 text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.85)]" />
  ),

  // Dart: Official geometric dart
  dart: () => (
    <SiDart className="w-7 h-7 sm:w-8 sm:h-8 text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.85)]" />
  ),

  // Laravel: Official 3D geometric origami
  laravel: () => (
    <SiLaravel className="w-7 h-7 sm:w-8 sm:h-8 text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.85)]" />
  ),

  // Figma: Official emblem
  figma: () => (
    <SiFigma className="w-6 h-6 sm:w-7 sm:h-7 text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.85)]" />
  ),
};

// ======================================================================
// 2. INSPECTOR LOGO COMPONENTS (Authentic Full Brand Colors for Left Panel)
// Displayed prominently in the active inspector card with official colors
// ======================================================================
export const INSPECTOR_LOGOS = {
  javascript: () => (
    <div className="w-10 h-10 rounded-lg bg-[#F7DF1E] flex items-center justify-center shadow">
      <span className="font-black text-2xl text-black">JS</span>
    </div>
  ),
  typescript: () => (
    <div className="w-10 h-10 rounded-lg bg-[#3178C6] flex items-center justify-center shadow">
      <span className="font-black text-2xl text-white">TS</span>
    </div>
  ),
  html5: () => (
    <SiHtml5 className="w-10 h-10 text-[#E44D26] drop-shadow-md" />
  ),
  css3: () => (
    <SiCss3 className="w-10 h-10 text-[#1572B6] drop-shadow-md" />
  ),
  react: () => (
    <SiReact className="w-10 h-10 text-[#61DAFB] drop-shadow-md" />
  ),
  java: () => (
    <FaJava className="w-10 h-10 text-[#EA2D2E] drop-shadow-md" />
  ),
  nextjs: () => (
    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow">
      <SiNextdotjs className="w-7 h-7 text-black" />
    </div>
  ),
  tailwind: () => (
    <SiTailwindcss className="w-10 h-10 text-[#38BDF8] drop-shadow-md" />
  ),
  nodejs: () => (
    <SiNodedotjs className="w-10 h-10 text-[#5FA04E] drop-shadow-md" />
  ),
  express: () => (
    <span className="font-black text-3xl italic text-white leading-none">ex</span>
  ),
  python: () => (
    <SiPython className="w-10 h-10 text-[#3776AB] drop-shadow-md" />
  ),
  mongodb: () => (
    <SiMongodb className="w-10 h-10 text-[#47A248] drop-shadow-md" />
  ),
  git: () => (
    <div className="w-10 h-10 rounded-lg bg-[#F05032] flex items-center justify-center shadow">
      <SiGit className="w-7 h-7 text-white" />
    </div>
  ),
  github: () => (
    <SiGithub className="w-10 h-10 text-white drop-shadow-md" />
  ),
  postgres: () => (
    <SiPostgresql className="w-10 h-10 text-[#4169E1] drop-shadow-md" />
  ),
  npm: () => (
    <SiNpm className="w-10 h-10 text-[#CB3837] drop-shadow-md" />
  ),
  mysql: () => (
    <SiMysql className="w-10 h-10 text-[#00758F] drop-shadow-md" />
  ),
  php: () => (
    <SiPhp className="w-10 h-10 text-[#777BB4] drop-shadow-md" />
  ),
  linux: () => (
    <SiLinux className="w-10 h-10 text-[#FCC624] drop-shadow-md" />
  ),
  docker: () => (
    <SiDocker className="w-10 h-10 text-[#2496ED] drop-shadow-md" />
  ),
  flutter: () => (
    <SiFlutter className="w-10 h-10 text-[#02569B] drop-shadow-md" />
  ),
  dart: () => (
    <SiDart className="w-10 h-10 text-[#0175C2] drop-shadow-md" />
  ),
  laravel: () => (
    <SiLaravel className="w-10 h-10 text-[#FF2D20] drop-shadow-md" />
  ),
  figma: () => (
    <SiFigma className="w-9 h-9 text-[#F24E1E] drop-shadow-md" />
  ),
};

// ======================================================================
// 24 CURATED TECHNICAL SKILLS & TOOLS (4 Rows x 6 Columns)
// Exact match to user's uploaded reference:
// - Column 0: [JS] -> [Next.js] -> [Git] -> [Linux]
// - Column 1: [TS] -> [Tailwind] -> [GitHub] -> [Docker]
// - Column 2: [HTML5] -> [Node.js] -> [PostgreSQL] -> [Flutter]
// - Column 3: [CSS3] -> [Express] -> [npm] -> [Dart]
// - Column 4: [React] -> [Python] -> [MySQL] -> [Laravel]
// - Column 5: [Java] -> [MongoDB] -> [PHP] -> [Figma]
// ======================================================================
export const KEYBOARD_SKILLS = [
  // ======================================================================
  // ROW 1: Hotkeys '1', '2', '3', '4', '5', '6'
  // [JS] -> [TS] -> [HTML5] -> [CSS3] -> [React] -> [Java]
  // ======================================================================
  {
    id: 'js',
    name: 'JavaScript',
    row: 0,
    col: 0,
    shortcut: '1',
    letterKey: 'j',
    bg: '#F59E0B',
    side: '#D97706',
    sideDark: '#92400E',
    category: 'Core Language',
    tagline: 'the versatile engine of the modern web — asynchronous, dynamic, and powering everything everywhere.',
    logoKey: 'javascript',
  },
  {
    id: 'ts',
    name: 'TypeScript',
    row: 0,
    col: 1,
    shortcut: '2',
    letterKey: 't',
    bg: '#3178C6',
    side: '#235A97',
    sideDark: '#163A63',
    category: 'Typed Language',
    tagline: 'javascript with superpowers — catching runtime bugs before they ever reach production.',
    logoKey: 'typescript',
  },
  {
    id: 'html5',
    name: 'HTML5',
    row: 0,
    col: 2,
    shortcut: '3',
    letterKey: 'h',
    bg: '#E44D26',
    side: '#DC2626',
    sideDark: '#7F1D1D',
    category: 'Markup Standard',
    tagline: 'the semantic skeleton of the internet, keeping content accessible, search-indexed, and timeless.',
    logoKey: 'html5',
  },
  {
    id: 'css3',
    name: 'CSS3',
    row: 0,
    col: 3,
    shortcut: '4',
    letterKey: 'c',
    /* USER REQUEST: CSS3 MUST BE BLUE! */
    bg: '#1572B6',
    side: '#125A90',
    sideDark: '#0C3C60',
    category: 'Styling & Motion',
    tagline: 'turning raw markup into expressive, modern visual experiences, animations, and responsive layouts.',
    logoKey: 'css3',
  },
  {
    id: 'react',
    name: 'React',
    row: 0,
    col: 4,
    shortcut: '5',
    letterKey: 'r',
    bg: '#06B6D4',
    side: '#0891B2',
    sideDark: '#155E75',
    category: 'UI Library',
    tagline: 'declarative components and hooks that turn complex UI logic into an absolute breeze.',
    logoKey: 'react',
  },
  {
    id: 'java',
    name: 'Java',
    row: 0,
    col: 5,
    shortcut: '6',
    letterKey: 'k',
    /* USER REQUEST: JAVA MUST BE BLACK! */
    bg: '#18181B',
    side: '#09090B',
    sideDark: '#000000',
    border: '1px solid rgba(255,255,255,0.15)',
    category: 'Enterprise Backend',
    tagline: 'industrial-grade object-oriented reliability with battle-tested JVM performance and strict typing.',
    logoKey: 'java',
  },

  // ======================================================================
  // ROW 2: Hotkeys 'Q', 'W', 'E', 'R', 'T', 'Y'
  // [Next.js] -> [Tailwind] -> [Node.js] -> [Express] -> [Python] -> [MongoDB]
  // ======================================================================
  {
    id: 'nextjs',
    name: 'Next.js',
    row: 1,
    col: 0,
    shortcut: 'Q',
    letterKey: 'n',
    bg: '#18181B',
    side: '#09090B',
    sideDark: '#000000',
    border: '1px solid rgba(255,255,255,0.15)',
    category: 'React Framework',
    tagline: 'the react framework for production — server components, route handlers, and lightning edge speed.',
    logoKey: 'nextjs',
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    row: 1,
    col: 1,
    shortcut: 'W',
    letterKey: 'w',
    bg: '#06B6D4',
    side: '#0891B2',
    sideDark: '#0E7490',
    category: 'Utility CSS',
    tagline: 'rapidly build bespoke modern websites without ever leaving your markup or fighting specificity.',
    logoKey: 'tailwind',
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    row: 1,
    col: 2,
    shortcut: 'E',
    letterKey: 'o',
    bg: '#16A34A',
    side: '#15803D',
    sideDark: '#14532D',
    category: 'JavaScript Runtime',
    tagline: 'event-driven asynchronous powerhouse delivering high-concurrency API performance.',
    logoKey: 'nodejs',
  },
  {
    id: 'express',
    name: 'Express.js',
    row: 1,
    col: 3,
    shortcut: 'R',
    letterKey: 'e',
    bg: '#262626',
    side: '#171717',
    sideDark: '#0A0A0A',
    border: '1px solid rgba(255,255,255,0.1)',
    category: 'Micro Framework',
    tagline: 'fast, unopinionated, minimalist web framework for node — crafting rock-solid REST endpoints.',
    logoKey: 'express',
  },
  {
    id: 'python',
    name: 'Python',
    row: 1,
    col: 4,
    shortcut: 'T',
    letterKey: 'y',
    bg: '#18181B',
    side: '#09090B',
    sideDark: '#000000',
    border: '1px solid rgba(255,255,255,0.15)',
    category: 'Data & Scripting',
    tagline: 'clean syntax and immense ecosystem — powering automation, machine intelligence, and backend logic.',
    logoKey: 'python',
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    row: 1,
    col: 5,
    shortcut: 'Y',
    letterKey: 'm',
    bg: '#10B981',
    side: '#059669',
    sideDark: '#064E3B',
    category: 'NoSQL Document DB',
    tagline: 'flexible schema document storage giving agile freedom to evolve application data rapidly.',
    logoKey: 'mongodb',
  },

  // ======================================================================
  // ROW 3: Hotkeys 'A', 'S', 'D', 'F', 'G', 'H'
  // [Git] -> [GitHub] -> [PostgreSQL] -> [npm] -> [MySQL] -> [PHP]
  // ======================================================================
  {
    id: 'git',
    name: 'Git',
    row: 2,
    col: 0,
    shortcut: 'A',
    letterKey: 'g',
    bg: '#EF4444',
    side: '#DC2626',
    sideDark: '#7F1D1D',
    category: 'Version Control',
    tagline: 'the safety net of modern development — fearless branching, distributed time-travel, and history.',
    logoKey: 'git',
  },
  {
    id: 'github',
    name: 'GitHub',
    row: 2,
    col: 1,
    shortcut: 'S',
    letterKey: 'i',
    bg: '#18181B',
    side: '#09090B',
    sideDark: '#000000',
    border: '1px solid rgba(255,255,255,0.15)',
    category: 'Collaboration Platform',
    tagline: 'where world-class engineering happens — pull requests, CI/CD actions, and open source collaboration.',
    logoKey: 'github',
  },
  {
    id: 'postgres',
    name: 'PostgreSQL',
    row: 2,
    col: 2,
    shortcut: 'D',
    letterKey: 'p',
    bg: '#336791',
    side: '#275275',
    sideDark: '#1A3750',
    border: '1px solid rgba(255,255,255,0.15)',
    category: 'Relational Database',
    tagline: 'the worlds most advanced open-source relational database — uncompromising ACID integrity.',
    logoKey: 'postgres',
  },
  {
    id: 'npm',
    name: 'npm',
    row: 2,
    col: 3,
    shortcut: 'F',
    letterKey: 'u',
    bg: '#DC2626',
    side: '#B91C1C',
    sideDark: '#7F1D1D',
    category: 'Package Manager',
    tagline: 'the beating heart of javascript tooling, packages, modules, and world-scale distribution.',
    logoKey: 'npm',
  },
  {
    id: 'mysql',
    name: 'MySQL',
    row: 2,
    col: 4,
    shortcut: 'G',
    letterKey: 'q',
    bg: '#00758F',
    side: '#00586D',
    sideDark: '#003744',
    category: 'Relational Database',
    tagline: 'the trusted workhorse powering production relational datasets across the web for decades.',
    logoKey: 'mysql',
  },
  {
    id: 'php',
    name: 'PHP',
    row: 2,
    col: 5,
    shortcut: 'H',
    letterKey: 'b',
    bg: '#6366F1',
    side: '#4F46E5',
    sideDark: '#312E81',
    category: 'Web Backend',
    tagline: 'the pragmatist engine of the internet — reliable, heavily battle-tested, and powering millions.',
    logoKey: 'php',
  },

  // ======================================================================
  // ROW 4: (Bottom Edge) Hotkeys 'Z', 'X', 'C', 'V', 'B', 'N'
  // [Linux] -> [Docker] -> [Flutter] -> [Dart] -> [Laravel] -> [Figma]
  // ======================================================================
  {
    id: 'linux',
    name: 'Linux',
    row: 3,
    col: 0,
    shortcut: 'Z',
    letterKey: 'l',
    bg: '#18181B',
    side: '#09090B',
    sideDark: '#000000',
    border: '1px solid rgba(255,255,255,0.15)',
    category: 'OS & Environment',
    tagline: 'the foundation of modern servers — high control, terminal efficiency, and production stability.',
    logoKey: 'linux',
  },
  {
    id: 'docker',
    name: 'Docker',
    row: 3,
    col: 1,
    shortcut: 'X',
    letterKey: 'd',
    bg: '#0284C7',
    side: '#0369A1',
    sideDark: '#0C4A6E',
    category: 'Containerization',
    tagline: 'build once, ship anywhere — containerizing environments so it works on my machine is dead history.',
    logoKey: 'docker',
  },
  {
    id: 'flutter',
    name: 'Flutter',
    row: 3,
    col: 2,
    shortcut: 'C',
    letterKey: 'f',
    bg: '#0284C7',
    side: '#0369A1',
    sideDark: '#075985',
    category: 'Cross-Platform Framework',
    tagline: 'natively compiled applications for mobile, web, and desktop from a single, high-speed codebase.',
    logoKey: 'flutter',
  },
  {
    id: 'dart',
    name: 'Dart',
    row: 3,
    col: 3,
    shortcut: 'V',
    letterKey: 'a',
    bg: '#0284C7',
    side: '#0369A1',
    sideDark: '#075985',
    category: 'Client-Optimized Language',
    tagline: 'type-safe language optimized for lightning fast UI rendering and reactive state flow.',
    logoKey: 'dart',
  },
  {
    id: 'laravel',
    name: 'Laravel',
    row: 3,
    col: 4,
    shortcut: 'B',
    letterKey: 'v',
    bg: '#EF4444',
    side: '#DC2626',
    sideDark: '#7F1D1D',
    category: 'PHP Framework',
    tagline: 'the PHP framework for web artisans — expressive syntax, Eloquent ORM, and pure developer joy.',
    logoKey: 'laravel',
  },
  {
    id: 'figma',
    name: 'Figma',
    row: 3,
    col: 5,
    shortcut: 'N',
    letterKey: 'x',
    bg: '#18181B',
    side: '#09090B',
    sideDark: '#000000',
    border: '1px solid rgba(255,255,255,0.15)',
    category: 'Design Systems & UI',
    tagline: 'where interface design meets code — vector design systems, prototypes, and team synergy.',
    logoKey: 'figma',
  },
];

export default function SkillsKeyboard() {
  // Start with React active by default
  const [activeSkill, setActiveSkill] = useState(
    () => KEYBOARD_SKILLS.find(s => s.id === 'react') || KEYBOARD_SKILLS[4]
  );
  const containerRef = useRef(null);

  // Scroll kinematics matching user reference:
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 96%", "center 52%"]
  });

  // Settled angle matching user reference:
  // rotateX: 46deg, rotateY: -6deg, rotateZ: -36deg
  // Rock-steady under the mouse cursor so clicks NEVER miss!
  const scrollRotateX = useTransform(scrollYProgress, [0, 0.45, 1], [70, 56, 46]);
  const scrollRotateY = useTransform(scrollYProgress, [0, 0.45, 1], [-22, -14, -6]);
  const scrollRotateZ = useTransform(scrollYProgress, [0, 0.45, 1], [-65, -48, -36]);
  const scrollScale = useTransform(scrollYProgress, [0, 0.35, 1], [0.46, 0.72, 1]);
  const scrollY = useTransform(scrollYProgress, [0, 1], [-220, 0]);

  // Guaranteed Instant Trigger Function
  // Updates inspector immediately with zero delay and triggers visual tactile bounce
  const triggerKey = useCallback((skill, buttonEl = null) => {
    setActiveSkill((prev) => (prev.id === skill.id ? prev : skill));
    if (buttonEl) {
      buttonEl.classList.add('is-pressed');
      if (buttonEl._pressTimer) clearTimeout(buttonEl._pressTimer);
      buttonEl._pressTimer = setTimeout(() => {
        buttonEl.classList.remove('is-pressed');
        buttonEl._pressTimer = null;
      }, 120);
    }
  }, []);

  // Global physical keyboard listener (Deterministic 1-to-1 match to 4x6 grid)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
      if (e.repeat) return; // Prevent spam lag on held keys

      const pressedChar = e.key.toLowerCase();

      // 1-to-1 direct match with the 4x6 grid keys:
      // Row 0: 1, 2, 3, 4, 5, 6
      // Row 1: q, w, e, r, t, y
      // Row 2: a, s, d, f, g, h
      // Row 3: z, x, c, v, b, n
      const matched = KEYBOARD_SKILLS.find(
        (s) => s.shortcut.toLowerCase() === pressedChar
      );

      if (matched) {
        const btn = containerRef.current?.querySelector(`[data-skill-id="${matched.id}"]`);
        triggerKey(matched, btn);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [triggerKey]);

  const ActiveInspectorLogo = INSPECTOR_LOGOS[activeSkill.logoKey];

  return (
    <div 
      id="skills-section"
      className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 scroll-mt-28"
      ref={containerRef}
    >
      {/* Scoped CSS for Ultra-Snappy Hardware-Accelerated 3D Keycap Physics */}
      <style>{`
        .keycap-btn {
          position: relative;
          transform: translate3d(0, 0, 0);
          /* ONLY transition transform on GPU Compositor! Zero 16-layer box-shadow blur interpolation! */
          transition: transform 0.05s cubic-bezier(0.2, 0.8, 0.2, 1);
          transform-style: preserve-3d;
          box-shadow:
            0 1px 1.5px rgba(255, 255, 255, 0.5) inset,
            -1px 1px 0 var(--key-side),
            -2px 2px 0 var(--key-side),
            -3px 3px 0 var(--key-side),
            -4px 4px 0 var(--key-side),
            -5px 5px 0 var(--key-side),
            -6px 6px 0 var(--key-side),
            -7px 7px 0 var(--key-side-dark),
            -8px 8px 0 var(--key-side-dark),
            -9px 9px 0 var(--key-side-dark),
            -10px 10px 0 var(--key-side-dark),
            -11px 11px 0 #080c14,
            -12px 12px 0 #05070c,
            -13px 13px 0 #020306,
            -14px 14px 0 #000002,
            -18px 20px 28px rgba(0, 0, 0, 0.98),
            -8px 10px 14px rgba(0, 0, 0, 0.88);
          user-select: none;
          -webkit-user-select: none;
          -webkit-user-drag: none;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
        }

        .keycap-btn:hover {
          transform: translate3d(-2px, 2px, 0);
        }

        .keycap-btn:active,
        .keycap-btn.is-pressed {
          transform: translate3d(-8px, 8px, 0) !important;
          box-shadow:
            -1px 1px 0 #020305,
            -2px 2px 4px rgba(0, 0, 0, 0.9),
            inset 0 2px 6px rgba(0, 0, 0, 0.75) !important;
        }
      `}</style>

      {/* ============================================================ */}
      {/* SECTION TOP HEADER: "SKILLS & TECHNOLOGIES"                   */}
      {/* Pixel font matching ABOUT ME header + smooth entrance transitions */}
      {/* ============================================================ */}
      <motion.div 
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center text-center mb-10 sm:mb-16 select-none relative z-20"
      >
        {/* Pixel Headline matching ABOUT ME: "TECH STACK" */}
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-pixel text-4xl sm:text-5xl md:text-6xl font-normal tracking-wider text-white uppercase select-none drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]"
          style={{ fontFamily: "'Arcadepix', monospace" }}
        >
          TECH <span className="text-[#FFD500] drop-shadow-[0_0_25px_rgba(255,213,0,0.5)]">STACK</span>
        </motion.h2>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-slate-300 text-sm sm:text-base font-normal mt-3.5 max-w-2xl mx-auto leading-relaxed"
        >
          A collection of technologies I use to turn ideas into digital experiences.
        </motion.p>
      </motion.div>

      {/* ============================================================ */}
      {/* MAIN TWO-COLUMN STAGE: TEXT (LEFT) + 3D KEYBOARD (RIGHT)     */}
      {/* Centered container so text sits close beside keyboard        */}
      {/* Category badge removed per user request: only name & tagline */}
      {/* ============================================================ */}
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 xl:gap-16">
          
          {/* ------------------------------------------------------------ */}
          {/* LEFT COLUMN: ACTIVE SKILL INSPECTOR (Beside Keyboard)        */}
          {/* Shifted rightward toward center so it's not clinging to edge */}
          {/* ------------------------------------------------------------ */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:w-[380px] xl:w-[420px] flex flex-col justify-center min-h-[160px] sm:min-h-[200px] relative z-20 text-left"
          >
            {/* Active Skill Details styled symmetrically with Motivational Quotes */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSkill.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col text-left"
              >
                {/* Category kicker */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFD500] shadow-[0_0_8px_rgba(255,213,0,0.8)]" />
                  <span className="text-xs font-mono font-bold tracking-widest text-[#FFD500] uppercase">
                    {activeSkill.category}
                  </span>
                </div>

                {/* Monumental Skill Title (Option 1: Plus Jakarta Sans Black 900) */}
                <h3 
                  className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white select-none whitespace-normal leading-[1.1] pb-1 transition-all duration-200 text-left max-w-sm"
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    letterSpacing: "-0.025em",
                    textShadow: `0 4px 24px rgba(0,0,0,0.9), 0 0 35px ${activeSkill.bg}60`
                  }}
                >
                  {activeSkill.name}
                </h3>

                {/* Body Tagline matching Motivational Quotes body typography */}
                <p 
                  className="mt-3 text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-md text-left"
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif"
                  }}
                >
                  &ldquo;{activeSkill.tagline}&rdquo;
                </p>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* ------------------------------------------------------------ */}
          {/* RIGHT COLUMN: 3D ISOMETRIC MECHANICAL KEYPAD MATRIX          */}
          {/* ------------------------------------------------------------ */}
          <div className="flex items-center justify-center relative z-20 py-4 sm:py-6 flex-shrink-0">
            
            {/* Ambient RGB underglow spillage (Isolated GPU Compositor Layer) */}
            <div 
              className="absolute inset-0 pointer-events-none rounded-3xl opacity-20"
              style={{
                background: `radial-gradient(circle at 50% 50%, ${activeSkill.bg} 0%, transparent 70%)`,
                transform: 'translateZ(0)',
                willChange: 'background',
              }}
            />

            {/* Keyboard Stage with 3D isometric tilt */}
            <div 
              className="relative select-none"
              style={{
                perspective: '1200px',
                perspectiveOrigin: '45% 40%',
              }}
            >
              {/* 
                Direct 3D Mechanical Keycaps Grid:
                Floating directly in 3D space with high-profile keycaps and deep travel!
                Uses pure scroll kinematics for rock-solid stability under cursor!
              */}
              <motion.div 
                className="relative"
                style={{
                  scale: scrollScale,
                  y: scrollY,
                  rotateX: scrollRotateX,
                  rotateY: scrollRotateY,
                  rotateZ: scrollRotateZ,
                  transformStyle: 'preserve-3d',
                }}
              >
                <div 
                  className="grid grid-cols-6 gap-2 sm:gap-2.5"
                  style={{
                    transformStyle: 'preserve-3d'
                  }}
                >
                  {KEYBOARD_SKILLS.map((skill) => {
                    const isSelected = activeSkill.id === skill.id;

                    return (
                      <KeycapButton
                        key={skill.id}
                        skill={skill}
                        isSelected={isSelected}
                        onTrigger={triggerKey}
                      />
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ======================================================================
// 3D MECHANICAL KEYCAP COMPONENT (SA High-Profile Tall Extrusion & 8px Travel)
// Features pixel-accurate symbol on high-contrast, brand-colored keycap body
// 100% full-surface click responsiveness (Full Kotak): zero dead zones, zero locks
// ======================================================================
const KeycapButton = React.memo(function KeycapButton({ skill, isSelected, onTrigger }) {
  // Ultra-responsive pointer interactions with instant 0ms trigger
  const handlePointerDown = (e) => {
    // Only react to primary mouse button (left click) or touch
    if (e.button !== undefined && e.button !== 0) return;
    const btn = e.currentTarget;
    btn._lastPointerDown = Date.now();
    onTrigger(skill, btn);
  };

  const handleClick = (e) => {
    const btn = e.currentTarget;
    // Deduplicate if pointerdown already processed this click within 300ms
    if (Date.now() - (btn._lastPointerDown || 0) < 300) return;
    onTrigger(skill, btn);
  };

  // Precise z-index layering: Rows further in front and columns to the left render on top!
  const baseZIndex = (skill.row * 10) + (6 - skill.col);
  const currentZIndex = isSelected ? 120 : baseZIndex;

  const KeycapIcon = KEYCAP_ICONS[skill.logoKey];

  return (
    <button
      type="button"
      data-skill-id={skill.id}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      title={`${skill.name} (Press '${skill.shortcut}')`}
      className="keycap-btn relative w-12 h-12 sm:w-14 sm:h-14 lg:w-[62px] lg:h-[62px] rounded-[13px] p-1 sm:p-[6px] border-none outline-none cursor-pointer flex items-center justify-center"
      style={{
        zIndex: currentZIndex,
        '--key-side': skill.side,
        '--key-side-dark': skill.sideDark,
        /* Base Skirt Gradient: creates the sloping pyramid skirt */
        background: `linear-gradient(135deg, ${skill.side} 0%, ${skill.sideDark} 100%)`,
        border: skill.border || 'none',
      }}
    >
      {/* 
        KEYCAP TOP FACE:
        Smaller inset rounded square with concave dish scoop and crystal-clear symbol!
      */}
      <div 
        className="relative w-full h-full rounded-[8px] flex items-center justify-center pointer-events-none overflow-hidden"
        style={{
          background: skill.bg,
          boxShadow: '0 1.5px 1px rgba(255, 255, 255, 0.65) inset, 0 -1px 2px rgba(0, 0, 0, 0.55) inset, -1px 1.5px 2px rgba(0, 0, 0, 0.4)'
        }}
      >
        {/* Concave Finger Dish Scoop on Top Surface */}
        <div 
          className="absolute inset-[2px] rounded-[6px] pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 45% 30%, rgba(255, 255, 255, 0.38) 0%, rgba(255, 255, 255, 0) 65%)',
            boxShadow: 'inset 0 1.5px 3px rgba(255, 255, 255, 0.45), inset 0 -1.5px 3px rgba(0, 0, 0, 0.55)'
          }}
        />

        {/* Center Symbol: Ultra-sharp, bold vector matching artisan novelty keycaps */}
        <div 
          className="relative z-10 flex items-center justify-center pointer-events-none text-white"
        >
          {KeycapIcon && <KeycapIcon />}
        </div>

        {/* Active Selection Glow Ring with vibrant color spill (zero DOM thrashing) */}
        <div 
          className={`absolute inset-0 rounded-[8px] pointer-events-none ring-2 ring-white/95 ring-offset-1 ring-offset-black/50 transition-opacity duration-100 ${
            isSelected ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            boxShadow: isSelected ? `0 0 16px rgba(255, 255, 255, 0.65), 0 0 24px ${skill.bg}` : 'none'
          }}
        />
      </div>
    </button>
  );
});
