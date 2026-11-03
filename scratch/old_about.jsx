import React from 'react';
import { motion, useMotionValue, useTransform, useScroll, useSpring } from 'framer-motion';
import fotoProfil from '../assets/fotoku.jpg';
import {
  SiPhp,
  SiDart,
  SiLaravel,
  SiNodedotjs,
  SiMongodb,
  SiOracle,
  SiGithub,
  SiNpm,
  SiPostgresql,
  SiTailwindcss
} from 'react-icons/si';
import { FcLinux } from 'react-icons/fc';
import { FaFilePdf, FaDownload } from 'react-icons/fa';

// Tactical 2x1 Lego Brick Clamp for pinning the photo with spring snap
function LegoClampBrick({ color = "#E3000B", rotate = 0, delay = 0 }) {
  return (
    <motion.div 
      initial={{ scale: 0, opacity: 0, rotate: rotate - 30 }}
      whileInView={{ scale: 1, opacity: 1, rotate: rotate }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ 
        type: 'spring', 
        stiffness: 420, 
        damping: 18, 
        delay: delay 
      }}
      className="relative z-20 flex items-center justify-center gap-1.5 px-2 py-1 rounded-sm shadow-xl select-none"
      style={{
        backgroundColor: color,
        borderTop: '1.5px solid rgba(255, 255, 255, 0.45)',
        borderLeft: '1px solid rgba(255, 255, 255, 0.35)',
        borderRight: '2px solid rgba(0, 0, 0, 0.65)',
        borderBottom: '3px solid rgba(0, 0, 0, 0.85)',
        boxShadow: '0 6px 12px rgba(0,0,0,0.5)'
      }}
    >
      {/* 2 Tactile Studs */}
      <div 
        className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[6px] font-black text-black/40"
        style={{
          backgroundColor: color,
          borderTop: '1.5px solid rgba(255, 255, 255, 0.5)',
          borderBottom: '2px solid rgba(0, 0, 0, 0.6)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.35)'
        }}
      >
        ●
      </div>
      <div 
        className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[6px] font-black text-black/40"
        style={{
          backgroundColor: color,
          borderTop: '1.5px solid rgba(255, 255, 255, 0.5)',
          borderBottom: '2px solid rgba(0, 0, 0, 0.6)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.35)'
        }}
      >
        ●
      </div>
    </motion.div>
  );
}

// Official Brand Logo Vector Components (Pixel-accurate current logos)
function LogoHtml5({ className = "w-8 h-8" }) {
  return (
    <svg viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path fill="#E44D26" d="M19.037 113.876L9.032 1.661h109.936l-10.016 112.198-45.019 12.48z"/>
      <path fill="#F16529" d="M64 116.8l36.378-10.086 8.559-95.878H64z"/>
      <path fill="#EBEBEB" d="M64 52.455H45.788L44.53 38.361H64V24.599H29.489l.33 3.692 3.382 37.927H64zm0 35.743l-.061.017-15.327-4.14-.979-10.975H33.816l1.928 21.609 28.193 7.826.063-.017z"/>
      <path fill="#fff" d="M63.952 52.455v13.763h16.947l-1.597 17.849-15.35 4.143v14.319l28.215-7.82.207-2.325 3.234-36.233.335-3.696h-3.708zm0-27.856v13.762h33.244l.276-3.092.628-6.978.329-3.692z"/>
    </svg>
  );
}

function LogoCss3({ className = "w-8 h-8" }) {
  return (
    <svg viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path fill="#1572B6" d="M18.814 114.123L8.76 1.352h110.48l-10.064 112.754-45.243 12.543-45.119-12.526z"/>
      <path fill="#33A9DC" d="M64.001 117.062l36.559-10.136 8.601-96.354h-45.16v106.49z"/>
      <path fill="#fff" d="M64.001 51.429h18.302l1.264-14.163H64.001V23.435h34.682l-.332 3.711-3.4 38.114h-30.95V51.429z"/>
      <path fill="#EBEBEB" d="M64.083 87.349l-.061.018-15.403-4.159-.985-11.031H33.752l1.937 21.717 28.331 7.863.063-.018v-14.39z"/>
      <path fill="#fff" d="M81.127 64.675l-1.666 18.522-15.426 4.164v14.39l28.354-7.858.208-2.337 2.406-26.881H81.127z"/>
      <path fill="#EBEBEB" d="M64.048 23.435v13.831H30.64l-.277-3.108-.63-7.012-.331-3.711h34.646zm-.047 27.996v13.831H48.792l-.277-3.108-.631-7.012-.33-3.711h16.447z"/>
    </svg>
  );
}

function LogoJavaScript({ className = "w-8 h-8" }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="32" height="32" rx="4" fill="#F7DF1E"/>
      <path d="M18.8 22.5c.6 1 1.4 1.7 2.7 1.7 1.2 0 1.9-.6 1.9-1.4 0-1-.8-1.3-2.1-1.9l-.7-.3c-2.1-.9-3.5-2-3.5-4.4 0-2.2 1.7-3.9 4.3-3.9 1.9 0 3.2.7 4.1 2.3l-2.1 1.4c-.5-.8-1-1.2-2-1.2-.9 0-1.5.6-1.5 1.3 0 .9.6 1.3 1.8 1.8l.7.3c2.4 1 3.9 2.1 3.9 4.6 0 2.6-2 4.1-4.8 4.1-2.7 0-4.4-1.3-5.2-2.9l2.5-1.5zm-9.3.2c.4.8.8 1.5 1.7 1.5.8 0 1.4-.3 1.4-1.6V12.5h2.8v10c0 2.9-1.7 4.2-4.1 4.2-2.3 0-3.6-1.2-4.3-2.6l2.5-1.4z" fill="#000000"/>
    </svg>
  );
}

function LogoReact({ className = "w-8 h-8" }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <ellipse cx="16" cy="16" rx="3.2" ry="3.2" fill="#61DAFB"/>
      <ellipse cx="16" cy="16" rx="14" ry="5.5" stroke="#61DAFB" strokeWidth="1.8" fill="none"/>
      <ellipse cx="16" cy="16" rx="14" ry="5.5" stroke="#61DAFB" strokeWidth="1.8" fill="none" transform="rotate(60 16 16)"/>
      <ellipse cx="16" cy="16" rx="14" ry="5.5" stroke="#61DAFB" strokeWidth="1.8" fill="none" transform="rotate(120 16 16)"/>
    </svg>
  );
}

function LogoPython({ className = "w-8 h-8" }) {
  return (
    <svg viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M54.5 3C27.5 3 29 14.8 29 14.8L29.1 27.2H55.4V30.9H18.5C18.5 30.9 3 29.1 3 56.4C3 83.7 16.5 82.5 16.5 82.5H24.5V71C24.5 71 24 57.2 38.3 57.2H64.6C64.6 57.2 76.5 57.6 76.5 45.4V14.8C76.5 14.8 79 3 54.5 3ZM40.9 11.8C43.8 11.8 46.1 14.1 46.1 17C46.1 19.9 43.8 22.2 40.9 22.2C38 22.2 35.7 19.9 35.7 17C35.7 14.1 38 11.8 40.9 11.8Z" fill="#3776AB"/>
      <path d="M55.5 107C82.5 107 81 95.2 81 95.2L80.9 82.8H54.6V79.1H91.5C91.5 79.1 107 80.9 107 53.6C107 26.3 93.5 27.5 93.5 27.5H85.5V39C85.5 39 86 52.8 71.7 52.8H45.4C45.4 52.8 33.5 52.4 33.5 64.6V95.2C33.5 95.2 31 107 55.5 107ZM69.1 98.2C66.2 98.2 63.9 95.9 63.9 93C63.9 90.1 66.2 87.8 69.1 87.8C72 87.8 74.3 90.1 74.3 93C74.3 95.9 72 98.2 69.1 98.2Z" fill="#FFD43B"/>
    </svg>
  );
}

function LogoJava({ className = "w-8 h-8" }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M12.2 5.5c-1.5 2.2-.4 3.7 1.2 4.9 1.8 1.4 2.4 2.6 1.1 4.5-.4.5-.3.8.2.8.9 0 2.2-1.3 2.2-2.9 0-2.3-1.8-3.4-3.3-4.5-1.1-.8-1.7-1.7-1.4-2.8z" fill="#E76F00"/>
      <path d="M16.8 2c-1.6 2.3-.3 4.1 1.4 5.4 1.7 1.3 2.1 2.6.9 4.4-.3.4-.2.8.2.8.9 0 2.3-1.4 2.3-3.1 0-2.3-1.9-3.5-3.4-4.6-1.1-.8-1.7-1.7-1.4-2.9z" fill="#EA2D2E"/>
      <path d="M8.5 9.8c-1.2 1.8-.3 3.1 1 4.1 1.5 1.1 1.9 2.2.9 3.7-.3.4-.2.7.2.7.7 0 1.8-1.1 1.8-2.4 0-1.9-1.5-2.8-2.7-3.7-.9-.7-1.4-1.4-1.2-2.4z" fill="#E76F00"/>
      <path d="M6 19.5c0 3.2 4.5 4.8 10 4.8s10-1.6 10-4.8H6z" fill="#5382A1"/>
      <path d="M22.5 18.5c1.8.3 3.5.9 3.5 2 0 1.2-2.1 2-4.5 2.2.4.5.6 1 .7 1.5 3.5-.3 6.3-1.7 6.3-3.7 0-1.8-2.2-3.1-5-3.5-.3.5-.6 1-1 1.5z" fill="#5382A1"/>
      <path d="M8 25.5c2.3.8 5 1.2 8 1.2s5.7-.4 8-1.2c1.2-.4.8-.8-.4-.7-4.8.4-10.4.4-15.2 0-1.2-.1-1.6.3-.4.7z" fill="#5382A1"/>
      <path d="M10 27.5c2 .5 4 .8 6 .8s4-.3 6-.8c1.5-.4 1-.7-.2-.6-3.8.3-7.8.3-11.6 0-1.2-.1-1.7.2-.2.6z" fill="#5382A1"/>
    </svg>
  );
}

function LogoFlutter({ className = "w-8 h-8" }) {
  return (
    <svg viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <g fill="#3FB6D3">
        <path d="M12.3 64.2L76.3 0h39.4L32.1 83.6zM76.3 128h39.4L81.6 93.9l34.1-34.8H76.3L42.2 93.5z"/>
      </g>
      <path fill="#27AACD" d="M81.6 93.9l-20-20-19.4 19.6 19.4 19.6z"/>
      <path fill="#19599A" d="M115.7 128L81.6 93.9l-20 19.2L76.3 128z"/>
      <linearGradient id="flutter-grad" gradientUnits="userSpaceOnUse" x1="59.365" y1="116.36" x2="86.825" y2="99.399">
        <stop offset="0" stopColor="#1b4e94"/>
        <stop offset="0.63" stopColor="#1a5497"/>
        <stop offset="1" stopColor="#195a9b"/>
      </linearGradient>
      <path fill="url(#flutter-grad)" d="M61.6 113.1l30.8-8.4-10.8-10.8z"/>
    </svg>
  );
}

function LogoMysql({ className = "w-8 h-8" }) {
  return (
    <svg viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path fill="#00758F" d="M117.688 98.242c-6.973-.191-12.297.461-16.852 2.379-1.293.547-3.355.559-3.566 2.18.711.746.82 1.859 1.387 2.777 1.086 1.754 2.922 4.113 4.559 5.352 1.789 1.348 3.633 2.793 5.551 3.961 3.414 2.082 7.223 3.27 10.504 5.352 1.938 1.23 3.859 2.777 5.75 4.164.934.684 1.563 1.75 2.773 2.18v-.195c-.637-.812-.801-1.93-1.387-2.777l-2.578-2.578c-2.52-3.344-5.719-6.281-9.117-8.719-2.711-1.949-8.781-4.578-9.91-7.73l-.199-.199c1.922-.219 4.172-.914 5.949-1.391 2.98-.797 5.645-.59 8.719-1.387l4.164-1.187v-.793c-1.555-1.594-2.664-3.707-4.359-5.152-4.441-3.781-9.285-7.555-14.273-10.703-2.766-1.746-6.184-2.883-9.117-4.363-.988-.496-2.719-.758-3.371-1.586-1.539-1.961-2.379-4.449-3.566-6.738-2.488-4.793-4.93-10.023-7.137-15.066-1.504-3.437-2.484-6.828-4.359-9.91-9-14.797-18.687-23.73-33.695-32.508-3.195-1.867-7.039-2.605-11.102-3.57l-6.543-.395c-1.332-.555-2.715-2.184-3.965-2.977C16.977 3.52 4.223-3.312.539 5.672-1.785 11.34 4.016 16.871 6.09 19.746c1.457 2.012 3.32 4.273 4.359 6.539.688 1.492.805 2.984 1.391 4.559 1.438 3.883 2.695 8.109 4.559 11.695.941 1.816 1.98 3.727 3.172 5.352.727.996 1.98 1.438 2.18 2.973-1.227 1.715-1.297 4.375-1.984 6.543-3.098 9.77-1.926 21.91 2.578 29.137 1.383 2.223 4.641 6.98 9.117 5.156 3.918-1.598 3.043-6.539 4.164-10.902.254-.988.098-1.715.594-2.379v.199l3.57 7.133c2.641 4.254 7.324 8.699 11.297 11.699 2.059 1.555 3.68 4.242 6.344 5.152v-.199h-.199c-.516-.805-1.324-1.137-1.98-1.781-1.551-1.523-3.277-3.414-4.559-5.156-3.613-4.902-6.805-10.27-9.711-15.855-1.391-2.668-2.598-5.609-3.77-8.324-.453-1.047-.445-2.633-1.387-3.172-1.281 1.988-3.172 3.598-4.164 5.945-1.582 3.754-1.789 8.336-2.375 13.082-.348.125-.195.039-.398.199-2.762-.668-3.73-3.508-4.758-5.949-2.594-6.164-3.078-16.09-.793-23.191.59-1.836 3.262-7.617 2.18-9.316-.516-1.691-2.219-2.672-3.172-3.965-1.18-1.598-2.355-3.703-3.172-5.551-2.125-4.805-3.113-10.203-5.352-15.062-1.07-2.324-2.875-4.676-4.359-6.738-1.645-2.289-3.484-3.977-4.758-6.742-.453-.984-1.066-2.559-.398-3.566.215-.684.516-.969 1.191-1.191 1.148-.887 4.352.297 5.547.793 3.18 1.32 5.832 2.578 8.527 4.363 1.289.855 2.598 2.512 4.16 2.973h1.785c2.789.641 5.914.195 8.523.988 4.609 1.402 8.738 3.582 12.488 5.949 11.422 7.215 20.766 17.48 27.156 29.734 1.027 1.973 1.473 3.852 2.379 5.945 1.824 4.219 4.125 8.559 5.941 12.688 1.816 4.113 3.582 8.27 6.148 11.695 1.348 1.801 6.551 2.766 8.918 3.766 1.66.699 4.379 1.43 5.949 2.379 3 1.809 5.906 3.965 8.723 5.945 1.402.992 5.73 3.168 5.945 4.957zm-88.605-75.52c-1.453-.027-2.48.156-3.566.395v.199h.195c.695 1.422 1.918 2.34 2.777 3.566l1.98 4.164.199-.195c1.227-.867 1.789-2.25 1.781-4.363-.492-.52-.562-1.164-.992-1.785-.562-.824-1.66-1.289-2.375-1.98zm0 0"/>
      <circle cx="8" cy="18" r="2.2" fill="#F29111"/>
    </svg>
  );
}

function LogoFigma({ className = "w-8 h-8" }) {
  return (
    <svg viewBox="0 0 38 57" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#1ABCFE"/>
      <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83"/>
      <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262"/>
      <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E"/>
      <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#A259FF"/>
    </svg>
  );
}

function LogoGit({ className = "w-8 h-8" }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M30.4 14.5L17.5 1.6c-.8-.8-2.2-.8-3 0L11.6 4.5l3.8 3.8c.9-.3 1.9-.1 2.6.6.7.7.9 1.7.6 2.6l3.6 3.6c.9-.3 1.9-.1 2.6.6 1 1 1 2.7 0 3.7-1 1-2.7 1-3.7 0-.8-.8-1-2-.5-3l-3.4-3.4v8.8c.3.2.6.4.8.7 1 1 1 2.7 0 3.7-1 1-2.7 1-3.7 0-1-1-1-2.7 0-3.7.3-.3.6-.5.9-.7V9.7c-.3-.2-.6-.4-.9-.7-1-1-1-2.7 0-3.7.8-.8 2-.9 3-.5L10 1.6 1.6 10c-.8.8-.8 2.2 0 3l12.9 12.9c.8.8 2.2.8 3 0l12.9-12.9c.8-.8.8-2.2 0-3z" fill="#F05032"/>
    </svg>
  );
}

function LogoNextjs({ className = "w-8 h-8" }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="16" cy="16" r="14.5" fill="#000000" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2"/>
      <path d="M21.5 24.2l-9.8-12.7v10.9H9.5V9.5h2.8l9.7 12.6V9.5h2.2v14.7h-2.7z" fill="#FFFFFF"/>
    </svg>
  );
}

// Reusable Skill Card - Option 1: Pure Minimalist Studio Capsule (Clean, Balanced & High-End)
function SkillCard({ skill }) {
  return (
    <motion.div
      whileHover={{ 
        y: -3, 
        scale: 1.04,
        boxShadow: `0 12px 26px -4px rgba(0,0,0,0.8), 0 0 0 1px ${skill.color}77, 0 0 18px -2px ${skill.color}33`,
        transition: { type: 'spring', stiffness: 400, damping: 20 }
      }}
      className="relative w-[165px] sm:w-[180px] md:w-[195px] h-[44px] sm:h-[48px] flex-shrink-0 rounded-full flex items-center justify-center cursor-pointer group transition-all duration-300 select-none whitespace-nowrap overflow-hidden px-4"
      style={{
        background: 'linear-gradient(180deg, rgba(19, 24, 38, 0.9) 0%, rgba(12, 15, 24, 0.95) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 4px 14px -2px rgba(0, 0, 0, 0.55), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)'
      }}
      title={skill.name}
    >
      {/* Symmetrical Balanced Brand Icon & Tech Name */}
      <div className="flex items-center justify-center gap-2.5 sm:gap-3">
        {/* Brand Icon with subtle ambient back-glow */}
        <div className="relative flex-shrink-0 flex items-center justify-center">
          <div 
            className="absolute inset-0 rounded-full blur-sm opacity-25 group-hover:opacity-60 transition-opacity"
            style={{ backgroundColor: skill.color }}
          />
          <div className="relative z-10 transition-transform duration-300 group-hover:scale-110 flex items-center justify-center [&>svg]:w-5 [&>svg]:h-5 sm:[&>svg]:w-[22px] sm:[&>svg]:h-[22px]">
            {skill.icon}
          </div>
        </div>

        {/* Tech Name */}
        <span className="text-xs sm:text-[13.5px] font-semibold text-slate-200 tracking-tight whitespace-nowrap group-hover:text-white transition-colors">
          {skill.name}
        </span>
      </div>
    </motion.div>
  );
}

function About() {
  // Window scroll tracking normalized across all viewports
  const { scrollYProgress } = useScroll();

  // Distinct, spring-damped physical parallax transforms on scroll
  const polaroidScrollY = useSpring(useTransform(scrollYProgress, [0, 0.6], [0, 75]), { stiffness: 90, damping: 22 });
  const polaroidScrollRotate = useSpring(useTransform(scrollYProgress, [0, 0.6], [-2, 4]), { stiffness: 90, damping: 22 });
  const bioScrollY = useSpring(useTransform(scrollYProgress, [0, 0.6], [0, -25]), { stiffness: 90, damping: 22 });
  const glowScale = useTransform(scrollYProgress, [0.15, 0.85], [0.85, 1.25]);
  const glowOpacity = useTransform(scrollYProgress, [0.15, 0.85], [0.12, 0.4]);

  // 3-Row Conveyor interactive scroll shifts (gears responding directly to mouse wheel)
  const row1Scroll = useSpring(useTransform(scrollYProgress, [0.1, 0.95], [60, -180]), { stiffness: 90, damping: 24 });
  const row2Scroll = useSpring(useTransform(scrollYProgress, [0.1, 0.95], [-60, 180]), { stiffness: 90, damping: 24 });
  const row3Scroll = useSpring(useTransform(scrollYProgress, [0.1, 0.95], [60, -180]), { stiffness: 90, damping: 24 });


  // Interactive mouse tilt for Polaroid Photo
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const polaroidRotateX = useTransform(mouseY, [-100, 100], [8, -8]);
  const polaroidRotateY = useTransform(mouseX, [-100, 100], [-8, 8]);

  // Unified Skills & Technologies Data (22 Tools with Authentic Modern Logos & Categorization)
  const allSkills = [
    { name: 'HTML5', color: '#E44D26', category: 'Structure', tag: 'Markup', icon: <LogoHtml5 className="w-8.5 h-8.5 sm:w-9 sm:h-9 flex-shrink-0" /> },
    { name: 'CSS3', color: '#1572B6', category: 'Styling', tag: 'Styles', icon: <LogoCss3 className="w-8.5 h-8.5 sm:w-9 sm:h-9 flex-shrink-0" /> },
    { name: 'Tailwind CSS', color: '#38BDF8', category: 'CSS Framework', tag: 'Frontend', icon: <SiTailwindcss className="w-8.5 h-8.5 sm:w-9 sm:h-9 text-[#38BDF8] flex-shrink-0" /> },
    { name: 'JavaScript', color: '#F7DF1E', category: 'Scripting', tag: 'Language', icon: <LogoJavaScript className="w-8.5 h-8.5 sm:w-9 sm:h-9 flex-shrink-0" /> },
    { name: 'PHP', color: '#777BB4', category: 'Server Scripting', tag: 'Backend', icon: <SiPhp className="w-8.5 h-8.5 sm:w-9 sm:h-9 text-[#777BB4] flex-shrink-0" /> },
    { name: 'Java', color: '#E76F00', category: 'OOP & Systems', tag: 'Language', icon: <LogoJava className="w-8.5 h-8.5 sm:w-9 sm:h-9 flex-shrink-0" /> },
    { name: 'Python', color: '#3776AB', category: 'General Purpose', tag: 'Language', icon: <LogoPython className="w-8.5 h-8.5 sm:w-9 sm:h-9 flex-shrink-0" /> },
    { name: 'Dart', color: '#0175C2', category: 'Client Optimized', tag: 'Language', icon: <SiDart className="w-8.5 h-8.5 sm:w-9 sm:h-9 text-[#0175C2] flex-shrink-0" /> },
    { name: 'React', color: '#61DAFB', category: 'UI Components', tag: 'Frontend', icon: <LogoReact className="w-8.5 h-8.5 sm:w-9 sm:h-9 flex-shrink-0" /> },
    { name: 'Next.js', color: '#FFFFFF', category: 'React Framework', tag: 'Fullstack', icon: <LogoNextjs className="w-8.5 h-8.5 sm:w-9 sm:h-9 flex-shrink-0" /> },
    { name: 'Laravel', color: '#FF2D20', category: 'PHP Framework', tag: 'Backend', icon: <SiLaravel className="w-8.5 h-8.5 sm:w-9 sm:h-9 text-[#FF2D20] flex-shrink-0" /> },
    { name: 'Flutter', color: '#02569B', category: 'Cross-Platform', tag: 'Mobile', icon: <LogoFlutter className="w-8.5 h-8.5 sm:w-9 sm:h-9 flex-shrink-0" /> },
    { name: 'Node.js', color: '#5FA04E', category: 'JS Runtime', tag: 'Backend', icon: <SiNodedotjs className="w-8.5 h-8.5 sm:w-9 sm:h-9 text-[#5FA04E] flex-shrink-0" /> },
    { name: 'PostgreSQL', color: '#4169E1', category: 'Relational DB', tag: 'Database', icon: <SiPostgresql className="w-8.5 h-8.5 sm:w-9 sm:h-9 text-[#4169E1] flex-shrink-0" /> },
    { name: 'MySQL', color: '#00758F', category: 'Relational DB', tag: 'Database', icon: <LogoMysql className="w-8.5 h-8.5 sm:w-9 sm:h-9 flex-shrink-0" /> },
    { name: 'MongoDB', color: '#47A248', category: 'NoSQL Document', tag: 'Database', icon: <SiMongodb className="w-8.5 h-8.5 sm:w-9 sm:h-9 text-[#47A248] flex-shrink-0" /> },
    { name: 'Oracle', color: '#F80000', category: 'Enterprise DB', tag: 'Database', icon: <SiOracle className="w-8.5 h-8.5 sm:w-9 sm:h-9 text-[#F80000] flex-shrink-0" /> },
    { name: 'Git', color: '#F05032', category: 'Version Control', tag: 'VCS', icon: <LogoGit className="w-8.5 h-8.5 sm:w-9 sm:h-9 flex-shrink-0" /> },
    { name: 'GitHub', color: '#FFFFFF', category: 'Code Hosting', tag: 'DevOps', icon: <SiGithub className="w-8.5 h-8.5 sm:w-9 sm:h-9 text-white flex-shrink-0" /> },
    { name: 'Linux', color: '#FCC624', category: 'Environment', tag: 'OS / CLI', icon: <FcLinux className="w-8.5 h-8.5 sm:w-9 sm:h-9 flex-shrink-0" /> },
    { name: 'npm', color: '#CB3837', category: 'Package Registry', tag: 'Tooling', icon: <SiNpm className="w-8.5 h-8.5 sm:w-9 sm:h-9 text-[#CB3837] flex-shrink-0" /> },
    { name: 'Figma', color: '#F24E1E', category: 'Interface Design', tag: 'UI/UX', icon: <LogoFigma className="w-8.5 h-8.5 sm:w-9 sm:h-9 flex-shrink-0" /> },
  ];

  // Categorized into 3 distinct stream rows for optimal rhythm (Total: 22 skills)
  const row1 = [
    allSkills.find(s => s.name === 'HTML5'),
    allSkills.find(s => s.name === 'CSS3'),
    allSkills.find(s => s.name === 'Tailwind CSS'),
    allSkills.find(s => s.name === 'JavaScript'),
    allSkills.find(s => s.name === 'React'),
    allSkills.find(s => s.name === 'Next.js'),
    allSkills.find(s => s.name === 'Figma'),
  ].filter(Boolean);

  const row2 = [
    allSkills.find(s => s.name === 'PHP'),
    allSkills.find(s => s.name === 'Laravel'),
    allSkills.find(s => s.name === 'Node.js'),
    allSkills.find(s => s.name === 'Python'),
    allSkills.find(s => s.name === 'Java'),
    allSkills.find(s => s.name === 'Dart'),
    allSkills.find(s => s.name === 'Flutter'),
    allSkills.find(s => s.name === 'Linux'),
  ].filter(Boolean);

  const row3 = [
    allSkills.find(s => s.name === 'PostgreSQL'),
    allSkills.find(s => s.name === 'MySQL'),
    allSkills.find(s => s.name === 'MongoDB'),
    allSkills.find(s => s.name === 'Oracle'),
    allSkills.find(s => s.name === 'Git'),
    allSkills.find(s => s.name === 'GitHub'),
    allSkills.find(s => s.name === 'npm'),
  ].filter(Boolean);

  return (
    <section id="about" className="min-h-screen py-24 bg-transparent text-slate-200 overflow-x-clip relative">

      <div className="max-w-5xl mx-auto px-6 sm:px-10 lg:px-12 w-full">
        
        {/* ============================================================ */}
        {/* HEADER: MASTER BUILDER PROFILE                               */}
        {/* ============================================================ */}
        <motion.div 
          initial={{ opacity: 0, y: -28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-center mb-12"
        >
          {/* Header Title */}
          <div className="flex items-center justify-center group cursor-pointer" title="Aprileo Erlangga // About Me">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
              About <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FFD500] via-[#FFE566] to-[#FF9E00] drop-shadow-[0_2px_15px_rgba(255,213,0,0.2)]">Me</span>
            </h2>
          </div>
        </motion.div>

        {/* ============================================================ */}
        {/* MAIN DISPLAY: BUILDER LOGBOOK (LEFT) + POLAROID CLAMP (RIGHT)*/}
        {/* ============================================================ */}
        <div className="flex flex-col lg:flex-row items-stretch justify-center gap-8 lg:gap-10 mb-20">
          
          {/* SISI KIRI: CLEAN BIOGRAPHY & PROFILE */}
          <motion.div 
            className="lg:w-7/12 flex flex-col justify-center py-2 relative"
            style={{ y: bioScrollY }}
          >
            {/* Staggered Paragraph Reveal */}
            <div className="space-y-4 text-slate-300 leading-relaxed text-sm sm:text-base font-normal">
              <motion.p
                initial={{ opacity: 0, y: 32, filter: 'blur(4px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.65, delay: 0.05, ease: [0.215, 0.61, 0.355, 1] }}
              >
                Hi, I'm Aprileo Muhammad David Erlangga! I grew up in Lamongan, a small city full of inspiration and natural beauty. My surroundings sparked a deep curiosity about technology and design.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 32, filter: 'blur(4px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.65, delay: 0.15, ease: [0.215, 0.61, 0.355, 1] }}
              >
                Through a journey of self-driven learning, I discovered a strong passion for digital development. Today, as a Fullstack Developer, I build scalable web applications with strong performance and polished user experiences. I'm passionate about turning complex ideas into intuitive, engaging digital products that are both functional and enjoyable to use.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 32, filter: 'blur(4px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.65, delay: 0.25, ease: [0.215, 0.61, 0.355, 1] }}
              >
                Join me on my journey as I continue creating impactful and ever-evolving digital solutions.
              </motion.p>
            </div>

            {/* My Resume - Sleek & Tactile 3D LEGO Button (Harmonized with Home Button) */}
            <motion.div 
              className="mt-8 flex items-center"
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.28 }}
            >
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="relative inline-flex items-center gap-2.5 px-6 py-2.5 sm:px-7 sm:py-3 bg-[#FFD500] hover:bg-[#FFE033] text-zinc-950 font-semibold text-sm tracking-wide rounded-xl border-t border-white/35 shadow-[0_2px_0_0_#C99700,0_8px_20px_rgba(255,213,0,0.22)] hover:shadow-[0_2px_0_0_#C99700,0_12px_26px_rgba(255,213,0,0.32)] active:translate-y-[2px] active:shadow-none transform hover:-translate-y-0.5 transition-all duration-150 group overflow-hidden"
              >
                <FaFilePdf className="text-base text-zinc-950 group-hover:scale-110 transition-transform duration-200" />
                <span className="relative z-10">My Resume</span>
                <FaDownload className="text-xs text-zinc-900/80 group-hover:translate-y-0.5 transition-transform duration-200" />
              </a>
            </motion.div>
          </motion.div>

          {/* SISI KANAN: STUDIO POLAROID SNAPSHOT CLAMPED BY LEGO BRICKS */}
          <motion.div 
            className="lg:w-5/12 flex items-center justify-center"
            initial={{ opacity: 0, y: 40, scale: 0.94, rotate: -4 }}
            whileInView={{ opacity: 1, y: 0, scale: 1, rotate: -2 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ type: "spring", stiffness: 150, damping: 18, delay: 0.1 }}
            style={{ 
              perspective: 1000,
              y: polaroidScrollY 
            }}
          >
            <motion.div
              className="relative w-full max-w-[320px] sm:max-w-[340px] bg-[#f8f8f6] p-4 pb-5 rounded-lg shadow-2xl cursor-pointer group select-none"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                mouseX.set(e.clientX - rect.left - rect.width / 2);
                mouseY.set(e.clientY - rect.top - rect.height / 2);
              }}
              onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }}
              style={{
                transformStyle: "preserve-3d",
                rotateX: polaroidRotateX,
                rotateY: polaroidRotateY,
                rotateZ: polaroidScrollRotate,
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(0,0,0,0.1)'
              }}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              {/* Top-Left Red Lego Brick Clamp with snap-in delay */}
              <div className="absolute -top-3 -left-3 pointer-events-none">
                <LegoClampBrick color="#E3000B" rotate={-12} delay={0.38} />
              </div>

              {/* Top-Right Yellow Lego Brick Clamp with snap-in delay */}
              <div className="absolute -top-3 -right-3 pointer-events-none">
                <LegoClampBrick color="#FFD500" rotate={14} delay={0.46} />
              </div>

              {/* Photo Area with clean natural tone (no harsh scroll glare) */}
              <div className="relative w-full h-[300px] sm:h-[320px] rounded overflow-hidden bg-neutral-900 shadow-inner">
                <img
                  src={fotoProfil}
                  alt="Aprileo Erlangga - Fullstack Developer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Polaroid Caption Area (Harmonized Font Family & Styling) */}
              <div className="mt-3.5 px-1 flex flex-col items-center text-center">
                <div className="font-sans font-normal text-neutral-800 text-sm tracking-tight">
                  Aprileo Erlangga
                </div>
                <div className="font-sans text-neutral-600 font-normal text-xs tracking-wide uppercase mt-0.5">
                  Fullstack Developer
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* ============================================================ */}
        {/* SKILLS SECTION: HYBRID DYNAMIC STREAM                        */}
        {/* ============================================================ */}
        <div className="mt-24 pt-6 relative">
          {/* Subtle Ambient Studio Glow with Scroll Scaling */}
          <motion.div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] max-w-full h-[260px] rounded-full pointer-events-none blur-[100px]"
            style={{
              background: 'radial-gradient(circle, rgba(255, 213, 0, 0.08) 0%, rgba(227, 0, 11, 0.04) 50%, transparent 75%)',
              scale: glowScale,
              opacity: glowOpacity
            }}
          />

          {/* Clean Open Header with gradual slow scroll reveal matching About reference */}
          <div className="flex flex-col items-center text-center pb-4 mb-8 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 24, filter: 'blur(4px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.85, delay: 0.06, ease: [0.215, 0.61, 0.355, 1] }}
              className="text-xs sm:text-sm font-mono font-bold text-[#FFD500] uppercase tracking-widest mb-3 flex items-center justify-center gap-2 select-none"
            >
              WHAT I WORK WITH
            </motion.div>
            <motion.h3 
              initial={{ opacity: 0, y: 32, filter: 'blur(6px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.95, delay: 0.20, ease: [0.215, 0.61, 0.355, 1] }}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight select-none"
            >
              Skills & <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FFD500] via-[#FFE566] to-[#FF9E00] drop-shadow-[0_2px_15px_rgba(255,213,0,0.2)]">Technologies</span>
            </motion.h3>
            <motion.p 
              initial={{ opacity: 0, y: 28, filter: 'blur(5px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.95, delay: 0.35, ease: [0.215, 0.61, 0.355, 1] }}
              className="text-slate-300 text-sm sm:text-base font-normal mt-3 max-w-2xl mx-auto leading-relaxed"
            >
              A collection of technologies I use to turn ideas into digital experiences.
            </motion.p>
          </div>
        </div>

      </div>

      {/* FULL WIDTH MOTION STREAM: 3 Alternating Conveyor Tracks with Gradual Scroll Entrance */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.215, 0.61, 0.355, 1] }}
        viewport={{ once: false, amount: 0.1 }}
        className="w-full relative z-10 overflow-hidden space-y-2.5 sm:space-y-3"
      >
        <div 
          className="relative overflow-hidden marquee-container py-2 select-none"
          style={{
            maskImage: 'linear-gradient(to right, transparent 0%, black 2.5%, black 97.5%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 2.5%, black 97.5%, transparent 100%)'
          }}
        >
          {/* Track 1: Gliding Left (Frontend & UI) with gradual slow scroll reveal */}
          <motion.div 
            initial={{ opacity: 0, y: 36, filter: 'blur(4px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: false, amount: 0.1 }}
            transition={{ duration: 1.0, delay: 0.48, ease: [0.215, 0.61, 0.355, 1] }}
            className="overflow-visible py-1.5"
          >
            <motion.div style={{ x: row1Scroll }} className="w-full">
              <div className="animate-marquee-left flex gap-3.5 sm:gap-4">
                {[...row1, ...row1].map((skill, idx) => (
                  <SkillCard key={`track1-${skill.name}-${idx}`} skill={skill} index={idx} />
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Track 2: Gliding Right (Backend, Languages & Mobile) with gradual slow scroll reveal */}
          <motion.div 
            initial={{ opacity: 0, y: 40, filter: 'blur(4px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: false, amount: 0.1 }}
            transition={{ duration: 1.0, delay: 0.62, ease: [0.215, 0.61, 0.355, 1] }}
            className="overflow-visible py-1.5 mt-1.5 sm:mt-2"
          >
            <motion.div style={{ x: row2Scroll }} className="w-full">
              <div className="animate-marquee-right flex gap-3.5 sm:gap-4">
                {[...row2, ...row2].map((skill, idx) => (
                  <SkillCard key={`track2-${skill.name}-${idx}`} skill={skill} index={idx} />
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Track 3: Gliding Left (Databases, Tools & DevOps) with gradual slow scroll reveal */}
          <motion.div 
            initial={{ opacity: 0, y: 44, filter: 'blur(4px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: false, amount: 0.1 }}
            transition={{ duration: 1.0, delay: 0.76, ease: [0.215, 0.61, 0.355, 1] }}
            className="overflow-visible py-1.5 mt-1.5 sm:mt-2"
          >
            <motion.div style={{ x: row3Scroll }} className="w-full">
              <div className="animate-marquee-left flex gap-3.5 sm:gap-4">
                {[...row3, ...row3].map((skill, idx) => (
                  <SkillCard key={`track3-${skill.name}-${idx}`} skill={skill} index={idx} />
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

export default About;

