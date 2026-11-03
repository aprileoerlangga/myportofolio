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

  // Git: Official diamond branching symbol
  git: () => (
    <SiGit className="w-7 h-7 sm:w-8 sm:h-8 text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.85)]" />
  ),

  // GitHub: Official Octocat
  github: () => (
    <SiGithub className="w-7 h-7 sm:w-8 sm:h-8 text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.85)]" />
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
    bg: '#2563EB',
    side: '#1D4ED8',
    sideDark: '#1E3A8A',
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
    bg: '#1E293B',
    side: '#0F172A',
    sideDark: '#020617',
    border: '1px solid rgba(255,255,255,0.1)',
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
  const [pressedId, setPressedId] = useState(null);
  const containerRef = useRef(null);

  // Scroll kinematics matching user reference:
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 96%", "center 52%"]
  });

  // Settled angle matching user reference:
  // rotateX: 46deg, rotateY: -6deg, rotateZ: -36deg
  const scrollRotateX = useTransform(scrollYProgress, [0, 0.45, 1], [70, 56, 46]);
  const scrollRotateY = useTransform(scrollYProgress, [0, 0.45, 1], [-22, -14, -6]);
  const scrollRotateZ = useTransform(scrollYProgress, [0, 0.45, 1], [-65, -48, -36]);
  const scrollScale = useTransform(scrollYProgress, [0, 0.35, 1], [0.46, 0.72, 1]);
  const scrollY = useTransform(scrollYProgress, [0, 1], [-220, 0]);
  const scrollX = useTransform(scrollYProgress, [0, 0.75, 1], [-60, -15, 0]);

  // Mouse parallax motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const chassisRotateX = useTransform([scrollRotateX, mouseY], ([sx, my]) => sx + my * 4);
  const chassisRotateY = useTransform([scrollRotateY, mouseX], ([sy, mx]) => sy + mx * 4);
  const chassisRotateZ = useTransform([scrollRotateZ, mouseX], ([sz, mx]) => sz + mx * 2);

  // Smooth entrance opacity for header and left inspector panel:
  const headerOpacity = useTransform(scrollYProgress, [0.15, 0.6], [0, 1]);
  const headerY = useTransform(scrollYProgress, [0.15, 0.6], [24, 0]);
  const inspectorOpacity = useTransform(scrollYProgress, [0.25, 0.75], [0, 1]);
  const inspectorX = useTransform(scrollYProgress, [0.25, 0.75], [-24, 0]);

  // Guaranteed Trigger Function (Works on mouse click, touch, and physical keyboard)
  // NO AUDIO: Audio completely removed as requested
  const triggerKey = useCallback((skill) => {
    setActiveSkill(skill);
    setPressedId(skill.id);
    setTimeout(() => {
      setPressedId((curr) => (curr === skill.id ? null : curr));
    }, 150);
  }, []);

  // Global physical keyboard listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

      const pressedChar = e.key.toLowerCase();

      let matched = KEYBOARD_SKILLS.find(
        (s) => s.shortcut.toLowerCase() === pressedChar || s.letterKey === pressedChar
      );

      if (!matched) {
        matched = KEYBOARD_SKILLS.find(s => s.name.toLowerCase().startsWith(pressedChar));
      }

      if (matched) {
        triggerKey(matched);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [triggerKey]);

  // GPU mouse parallax tilt
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const ActiveInspectorLogo = INSPECTOR_LOGOS[activeSkill.logoKey];

  return (
    <div 
      id="skills-section"
      className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-20 scroll-mt-28"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* ============================================================ */}
      {/* SECTION TOP HEADER: "SKILLS" + "(hint: press a key)"          */}
      {/* (Clean, no sound button - matching reference image)           */}
      {/* ============================================================ */}
      <motion.div 
        style={{ opacity: headerOpacity, y: headerY }}
        className="flex flex-col items-center text-center mb-10 sm:mb-16 select-none relative z-20"
      >
        <h2 
          className="text-5xl sm:text-6xl md:text-7xl font-black uppercase tracking-widest text-white relative drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]"
          style={{
            fontFamily: "'Space Grotesk', -apple-system, sans-serif",
            letterSpacing: '0.16em',
            textShadow: '0 2px 0 #94a3b8, 0 4px 0 #475569, 0 8px 24px rgba(0,0,0,0.9)'
          }}
        >
          SKILLS
        </h2>

        {/* Hint Caption matching reference */}
        <div className="flex items-center gap-2 mt-2 font-mono text-xs sm:text-sm text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
          <span className="text-slate-300 font-medium">
            (hint: <span className="text-[#FFD500] underline underline-offset-4 font-semibold">press a key</span> on your keyboard or tap below)
          </span>
        </div>
      </motion.div>

      {/* ============================================================ */}
      {/* MAIN TWO-COLUMN STAGE: INSPECTOR PANEL (LEFT) + KEYPAD (RIGHT)*/}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
        
        {/* ------------------------------------------------------------ */}
        {/* LEFT COLUMN: ACTIVE SKILL 3D INSPECTOR (Ref: "ttier" Panel)   */}
        {/* Features large authentic full-color logo, title, and tagline */}
        {/* ------------------------------------------------------------ */}
        <motion.div 
          style={{ opacity: inspectorOpacity, x: inspectorX }}
          className="lg:col-span-5 flex flex-col justify-center min-h-[180px] sm:min-h-[240px] relative z-20"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSkill.id}
              initial={{ opacity: 0, y: 14, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -14, scale: 0.97 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col"
            >
              {/* Top Row: Authentic Full-Color Logo & Category Badge */}
              <div className="flex items-center gap-4 mb-3">
                <div 
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center p-2.5 shadow-2xl relative border border-white/10"
                  style={{
                    background: 'radial-gradient(circle at 35% 30%, #1e293b 0%, #090d16 100%)',
                    boxShadow: `0 8px 24px -4px ${activeSkill.bg}44, inset 0 1px 1px rgba(255,255,255,0.2)`
                  }}
                >
                  {ActiveInspectorLogo && <ActiveInspectorLogo />}
                </div>

                <div className="flex flex-col">
                  <span className="font-mono text-[11px] sm:text-xs uppercase tracking-wider text-[#FFD500] font-semibold">
                    {activeSkill.category}
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">
                    Shortcut Key: <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 text-white font-bold">{activeSkill.shortcut}</kbd>
                  </span>
                </div>
              </div>

              {/* Massive 3D Extruded Title (Matching reference image) */}
              <div className="relative my-0.5 overflow-visible">
                <h3 
                  className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white select-none whitespace-normal leading-tight pb-1"
                  style={{
                    fontFamily: "'Space Grotesk', -apple-system, sans-serif",
                    textShadow: `
                      1px 1px 0 #cbd5e1, 
                      2px 2px 0 #94a3b8, 
                      3px 3px 0 #64748b, 
                      4px 4px 0 #475569, 
                      6px 6px 18px rgba(0,0,0,0.92)
                    `
                  }}
                >
                  {activeSkill.name}
                </h3>
              </div>

              {/* Punchy Tagline */}
              <p className="mt-3 text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-lg">
                &ldquo;{activeSkill.tagline}&rdquo;
              </p>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* ------------------------------------------------------------ */}
        {/* RIGHT COLUMN: 3D ISOMETRIC MECHANICAL KEYPAD MATRIX          */}
        {/* ------------------------------------------------------------ */}
        <div className="lg:col-span-7 flex items-center justify-center relative z-20 py-4 sm:py-6">
          
          {/* Ambient RGB underglow spillage */}
          <div 
            className="absolute inset-0 pointer-events-none rounded-3xl opacity-20 transition-all duration-500"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${activeSkill.bg} 0%, transparent 70%)`
            }}
          />

          {/* Keyboard Chassis Stage with 3D isometric tilt */}
          <div 
            className="relative select-none"
            style={{
              perspective: '1200px',
              perspectiveOrigin: '45% 40%',
            }}
          >
            {/* 
              AUTHENTIC CNC MECHANICAL MACROPAD BODY:
              Tightly wraps the 4x6 grid with minimal bezel.
            */}
            <motion.div 
              className="relative p-2 sm:p-2.5 rounded-[20px] sm:rounded-[24px] border border-white/10"
              style={{
                scale: scrollScale,
                x: scrollX,
                y: scrollY,
                rotateX: chassisRotateX,
                rotateY: chassisRotateY,
                rotateZ: chassisRotateZ,
                transformStyle: 'preserve-3d',
                background: '#05070c',
                boxShadow: `
                  0 1px 0 rgba(255,255,255,0.22) inset,
                  0 -1px 0 rgba(0,0,0,0.95) inset,
                  -1px 2px 0 #05070a,
                  -2px 5px 0 #030407,
                  -4px 9px 0 #020305,
                  -6px 15px 0 #010203,
                  -10px 24px 38px rgba(0,0,0,0.98),
                  -18px 46px 65px rgba(0,0,0,0.95),
                  0 0 50px ${activeSkill.bg}22
                `
              }}
            >
              {/* 
                DEEP SWITCH PLATE FLOOR & TAPERED KEYCAP GRID:
                - Pitch black floor (#000002) creates true infinite abyss in crevices
                - Generous 8px to 10px crevice gap with calibrated z-index stacking
              */}
              <div 
                className="grid grid-cols-6 gap-2 sm:gap-2.5 p-2 rounded-[18px] bg-[#000002]"
                style={{
                  boxShadow: 'inset 0 8px 30px rgba(0, 0, 0, 0.99)',
                  transformStyle: 'preserve-3d'
                }}
              >
                {KEYBOARD_SKILLS.map((skill, index) => {
                  const isSelected = activeSkill.id === skill.id;
                  const isPressed = pressedId === skill.id;

                  return (
                    <KeycapButton
                      key={skill.id}
                      skill={skill}
                      index={index}
                      isSelected={isSelected}
                      isPressed={isPressed}
                      onTrigger={() => triggerKey(skill)}
                    />
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>

      </div>
    </div>
  );
}

// ======================================================================
// 3D MECHANICAL KEYCAP COMPONENT (SA High-Profile Tall Extrusion & 8px Travel)
// Features pixel-accurate symbol on high-contrast, brand-colored keycap body
// ======================================================================
const KeycapButton = React.memo(function KeycapButton({ skill, index, isSelected, isPressed, onTrigger }) {
  const [hovered, setHovered] = useState(false);
  const lastTriggerRef = useRef(0);

  const handleClick = () => {
    const now = Date.now();
    if (now - lastTriggerRef.current < 120) return;
    lastTriggerRef.current = now;
    onTrigger();
  };

  // Precise z-index layering: Rows further in front and columns to the left render on top!
  const baseZIndex = (skill.row * 10) + (6 - skill.col);
  const currentZIndex = isPressed || isSelected ? 120 : hovered ? 100 : baseZIndex;

  const KeycapIcon = KEYCAP_ICONS[skill.logoKey];

  return (
    <button
      type="button"
      onPointerDown={handleClick}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={`${skill.name} (Press '${skill.shortcut}')`}
      className="relative w-12 h-12 sm:w-14 sm:h-14 lg:w-[62px] lg:h-[62px] rounded-[13px] p-1 sm:p-[6px] border-none outline-none cursor-pointer select-none transition-all duration-75 flex items-center justify-center"
      style={{
        zIndex: currentZIndex,
        /* Base Skirt Gradient: creates the sloping pyramid skirt */
        background: `linear-gradient(135deg, ${skill.side} 0%, ${skill.sideDark} 100%)`,
        border: skill.border || 'none',
        
        /* 
          TALL 8PX MECHANICAL TRAVEL ON CLICK / PRESS:
          Visually sinks deep into the plate like a real mechanical switch!
        */
        transform: isPressed 
          ? 'translate(-8px, 8px)' 
          : hovered 
          ? 'translate(-2px, 2px)' 
          : 'translate(0px, 0px)',
        transformStyle: 'preserve-3d',
        
        /* 
          14-Layer Solid 3D Keycap Extruded Sides (-X and +Y):
          - Tall, thick, high-profile physical depth down to plate
          - Creates visible side walls on JS, Next.js, Git, Linux
          - Deepens the crevice between keys dramatically
        */
        boxShadow: isPressed
          ? `
            -1px 1px 0 #020305,
            -2px 2px 4px rgba(0, 0, 0, 0.9),
            inset 0 2px 6px rgba(0, 0, 0, 0.75)
            ${isSelected ? `, 0 0 24px ${skill.bg}ff` : ''}
          `
          : `
            0 1px 1.5px rgba(255, 255, 255, 0.5) inset,
            -1px 1px 0 ${skill.side},
            -2px 2px 0 ${skill.side},
            -3px 3px 0 ${skill.side},
            -4px 4px 0 ${skill.side},
            -5px 5px 0 ${skill.side},
            -6px 6px 0 ${skill.side},
            -7px 7px 0 ${skill.sideDark},
            -8px 8px 0 ${skill.sideDark},
            -9px 9px 0 ${skill.sideDark},
            -10px 10px 0 ${skill.sideDark},
            -11px 11px 0 #080c14,
            -12px 12px 0 #05070c,
            -13px 13px 0 #020306,
            -14px 14px 0 #000002,
            -18px 20px 28px rgba(0, 0, 0, 0.98),
            -8px 10px 14px rgba(0, 0, 0, 0.88)
            ${isSelected ? `, 0 0 24px ${skill.bg}ff` : ''}
          `,
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

        {/* Active Selection Glow Ring */}
        {isSelected && (
          <div 
            className="absolute inset-0 rounded-[8px] pointer-events-none ring-2 ring-white/95 ring-offset-1 ring-offset-black/50"
            style={{
              boxShadow: '0 0 16px rgba(255, 255, 255, 0.6)'
            }}
          />
        )}
      </div>
    </button>
  );
});
