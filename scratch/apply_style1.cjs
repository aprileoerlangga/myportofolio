const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'components', 'About.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Normalize CRLF to LF for reliable string replacement, then convert back
const isCRLF = content.includes('\r\n');
if (isCRLF) {
  content = content.replace(/\r\n/g, '\n');
}

// 1. Replace LegoClampBrick with LegoStud & LegoAccentBrick
const oldClampRegex = /\/\/ Tactical 2x1 Lego Brick Clamp for pinning the photo with spring snap[\s\S]*?function LegoClampBrick[\s\S]*?^}/m;
const newStuds = `// Tactile Lego Stud Component with 3D highlight and drop-shadow
function LegoStud({ className = "w-3.5 h-3.5", color = "#252b3d" }) {
  return (
    <div 
      className={\`\${className} rounded-full flex items-center justify-center relative flex-shrink-0 select-none\`}
      style={{
        background: \`radial-gradient(circle at 35% 35%, rgba(255,255,255,0.45) 0%, transparent 60%), \${color}\`,
        borderTop: '1px solid rgba(255, 255, 255, 0.45)',
        borderLeft: '0.5px solid rgba(255, 255, 255, 0.3)',
        borderRight: '1px solid rgba(0, 0, 0, 0.6)',
        borderBottom: '2px solid rgba(0, 0, 0, 0.85)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.5)'
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-black/30 shadow-inner" />
    </div>
  );
}

// 2x1 Lego Brick Accent with authentic 3D plastic bevel and 2 tactile studs
function LegoAccentBrick({ color = "#E3000B", rotate = 0, delay = 0.2 }) {
  return (
    <motion.div 
      initial={{ scale: 0, opacity: 0, rotate: rotate - 25 }}
      whileInView={{ scale: 1, opacity: 1, rotate }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ 
        type: 'spring', 
        stiffness: 380, 
        damping: 18, 
        delay 
      }}
      className="relative z-30 flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded shadow-2xl select-none"
      style={{
        backgroundColor: color,
        borderTop: '2px solid rgba(255, 255, 255, 0.55)',
        borderLeft: '1.5px solid rgba(255, 255, 255, 0.4)',
        borderRight: '2.5px solid rgba(0, 0, 0, 0.7)',
        borderBottom: '4px solid rgba(0, 0, 0, 0.85)',
        boxShadow: '0 8px 18px rgba(0,0,0,0.6)'
      }}
    >
      <LegoStud className="w-3.5 h-3.5" color={color} />
      <LegoStud className="w-3.5 h-3.5" color={color} />
    </motion.div>
  );
}`;

if (!oldClampRegex.test(content)) {
  console.error("Could not find oldClampRegex!");
  process.exit(1);
}
content = content.replace(oldClampRegex, newStuds);
console.log("Replaced LegoClampBrick successfully.");

// 2. Replace Header Section (About Me in pixel font with badge)
const oldHeaderRegex = /\{\/\* HEADER: MASTER BUILDER PROFILE[\s\S]*?<h2[\s\S]*?About[\s\S]*?<\/h2>\s*<\/div>\s*<\/motion\.div>/;
const newHeader = `{/* HEADER: MASTER BUILDER PROFILE (HARMONIZED PIXEL AESTHETIC) */}
        <motion.div 
          initial={{ opacity: 0, y: -28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-center mb-12"
        >
          {/* Header Title */}
          <div className="flex flex-col items-center justify-center group cursor-pointer text-center" title="Aprileo Erlangga // About Me">
            <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] sm:text-xs font-mono tracking-widest text-[#FFD500] uppercase mb-3 select-none backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-[#E3000B] animate-pulse" />
              // BUILDER DOSSIER: 01
            </div>
            <h2 
              className="font-pixel text-4xl sm:text-5xl md:text-6xl font-normal tracking-wider text-white uppercase select-none"
              style={{ fontFamily: "'Arcadepix', monospace" }}
            >
              About <span className="text-[#FFD500] drop-shadow-[0_4px_16px_rgba(255,213,0,0.35)]">Me</span>
            </h2>
          </div>
        </motion.div>`;

if (!oldHeaderRegex.test(content)) {
  console.error("Could not find oldHeaderRegex!");
  process.exit(1);
}
content = content.replace(oldHeaderRegex, newHeader);
console.log("Replaced Header successfully.");

// 3. Replace Resume Button with pixel font matching Home
const oldResumeRegex = /\{\/\* My Resume - Sleek & Tactile 3D LEGO Button[\s\S]*?<a[\s\S]*?href="\/resume\.pdf"[\s\S]*?<\/a>\s*<\/motion\.div>/;
const newResume = `{/* My Resume - Tactile 3D LEGO Button (Harmonized with Home) */}
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
                className="relative inline-flex items-center gap-2.5 px-6 py-2.5 sm:px-7 sm:py-3 bg-[#FFD500] hover:bg-[#FFE033] text-zinc-950 font-pixel font-normal text-sm sm:text-base tracking-wider uppercase rounded-xl border-t border-white/60 shadow-[0_2px_0_0_#C99700,0_8px_20px_rgba(255,213,0,0.25)] hover:shadow-[0_2px_0_0_#C99700,0_12px_26px_rgba(255,213,0,0.35)] active:translate-y-[2px] active:shadow-none transform hover:-translate-y-0.5 transition-all duration-150 group overflow-hidden cursor-pointer select-none"
                style={{ fontFamily: "'Arcadepix', monospace" }}
              >
                <FaFilePdf className="text-base text-zinc-950 group-hover:scale-110 transition-transform duration-200" />
                <span className="relative z-10">My Resume</span>
                <FaDownload className="text-xs text-zinc-900/80 group-hover:translate-y-0.5 transition-transform duration-200" />
              </a>
            </motion.div>`;

if (!oldResumeRegex.test(content)) {
  console.error("Could not find oldResumeRegex!");
  process.exit(1);
}
content = content.replace(oldResumeRegex, newResume);
console.log("Replaced Resume Button successfully.");

// 4. Replace Polaroid with Gaya 1 Lego Brick Frame & UCS Plaque
const oldPolaroidRegex = /\{\/\* SISI KANAN: STUDIO POLAROID SNAPSHOT CLAMPED BY LEGO BRICKS \*\/[\s\S]*?<\/motion\.div>\s*<\/motion\.div>\s*<\/div>/;
const newFrame = `{/* SISI KANAN: GAYA 1 - LEGO BRICK FRAME & COLLECTOR UCS PLAQUE */}
          <motion.div 
            className="lg:w-5/12 flex items-center justify-center"
            initial={{ opacity: 0, y: 40, scale: 0.94 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ type: "spring", stiffness: 150, damping: 18, delay: 0.1 }}
            style={{ 
              perspective: 1200,
              y: polaroidScrollY 
            }}
          >
            <motion.div
              className="relative w-full max-w-[325px] sm:max-w-[345px] p-3 sm:p-3.5 rounded-2xl cursor-pointer group select-none"
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
                background: 'linear-gradient(160deg, #1c2130 0%, #111420 100%)',
                borderTop: '2px solid rgba(255, 255, 255, 0.25)',
                borderLeft: '1.5px solid rgba(255, 255, 255, 0.18)',
                borderRight: '2px solid rgba(0, 0, 0, 0.75)',
                borderBottom: '4px solid rgba(0, 0, 0, 0.92)',
                boxShadow: '0 25px 60px -10px rgba(0, 0, 0, 0.88), 0 0 0 1px rgba(255,255,255,0.06)'
              }}
              whileHover={{ scale: 1.025 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              {/* Corner Accent Bricks */}
              {/* Top-Left Red Lego Brick */}
              <div className="absolute -top-3.5 -left-3.5 pointer-events-none">
                <LegoAccentBrick color="#E3000B" rotate={-10} delay={0.35} />
              </div>

              {/* Top-Right Yellow Lego Brick */}
              <div className="absolute -top-3.5 -right-3.5 pointer-events-none">
                <LegoAccentBrick color="#FFD500" rotate={12} delay={0.42} />
              </div>

              {/* Top Rail: Row of 8 Tactile Lego Studs */}
              <div className="flex justify-between items-center px-3 py-1.5 mb-2.5 rounded-lg bg-[#141824]/90 border border-white/5 shadow-inner">
                {[...Array(8)].map((_, i) => (
                  <LegoStud key={\`top-stud-\${i}\`} className="w-3.5 h-3.5" color="#262d40" />
                ))}
              </div>

              {/* Photo Display Bezel with Studio Sheen */}
              <div className="relative w-full h-[290px] sm:h-[310px] rounded-xl overflow-hidden bg-[#090b11] p-1 border border-white/10 shadow-[inset_0_2px_12px_rgba(0,0,0,0.85)]">
                <div className="relative w-full h-full rounded-lg overflow-hidden">
                  <img
                    src={fotoProfil}
                    alt="Aprileo Erlangga - Fullstack Developer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Subtle Diagonal Studio Sheen */}
                  <div 
                    className="absolute inset-0 pointer-events-none opacity-20 group-hover:opacity-35 transition-opacity duration-300"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 45%, rgba(255,213,0,0.12) 75%, transparent 100%)'
                    }}
                  />
                </div>
              </div>

              {/* Official Lego Collector UCS Display Plaque / Nameplate */}
              <div 
                className="mt-3 p-3 rounded-xl relative overflow-hidden"
                style={{
                  background: 'linear-gradient(180deg, #171b29 0%, #0d101a 100%)',
                  border: '1px solid rgba(255, 213, 0, 0.35)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)'
                }}
              >
                {/* 4 Golden Corner Rivets */}
                <span className="absolute top-1.5 left-1.5 w-1.5 h-1.5 rounded-full bg-[#FFD500]/70 shadow-sm" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#FFD500]/70 shadow-sm" />
                <span className="absolute bottom-1.5 left-1.5 w-1.5 h-1.5 rounded-full bg-[#FFD500]/70 shadow-sm" />
                <span className="absolute bottom-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#FFD500]/70 shadow-sm" />

                <div className="flex flex-col items-center text-center px-1">
                  {/* Name in Pixel Font */}
                  <div 
                    className="font-pixel text-white text-base sm:text-lg tracking-widest uppercase drop-shadow-[0_2px_8px_rgba(255,255,255,0.2)]"
                    style={{ fontFamily: "'Arcadepix', monospace" }}
                  >
                    Aprileo Erlangga
                  </div>
                  {/* Title in Gold Monospace */}
                  <div className="text-[#FFD500] font-mono text-[11px] sm:text-xs font-semibold tracking-widest uppercase mt-0.5">
                    Fullstack Developer
                  </div>
                  {/* Set & Spec line */}
                  <div className="flex items-center gap-2 text-[9px] font-mono text-slate-400 tracking-wider mt-1.5 pt-1.5 border-t border-white/10 w-full justify-center">
                    <span>SET № 2026</span>
                    <span className="text-[#FFD500]">★</span>
                    <span>MASTER BUILDER</span>
                    <span className="text-[#FFD500]">★</span>
                    <span>EDITION 1/1</span>
                  </div>
                </div>
              </div>

              {/* Bottom Rail: Row of 8 Tactile Lego Studs */}
              <div className="flex justify-between items-center px-3 py-1.5 mt-2.5 rounded-lg bg-[#141824]/90 border border-white/5 shadow-inner">
                {[...Array(8)].map((_, i) => (
                  <LegoStud key={\`bottom-stud-\${i}\`} className="w-3.5 h-3.5" color="#262d40" />
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>`;

if (!oldPolaroidRegex.test(content)) {
  console.error("Could not find oldPolaroidRegex!");
  process.exit(1);
}
content = content.replace(oldPolaroidRegex, newFrame);
console.log("Replaced Polaroid with Lego Brick Frame successfully.");

// 5. Replace Skills Header with Pixel Font
const oldSkillsHeaderRegex = /\{\/\* Clean Open Header with gradual slow scroll reveal matching About reference \*\/[\s\S]*?<motion\.p[\s\S]*?<\/motion\.p>\s*<\/div>/;
const newSkillsHeader = `{/* Clean Open Header with gradual slow scroll reveal matching About reference */}
          <div className="flex flex-col items-center text-center pb-4 mb-8 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 24, filter: 'blur(4px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.85, delay: 0.06, ease: [0.215, 0.61, 0.355, 1] }}
              className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] sm:text-xs font-pixel tracking-widest text-[#FFD500] uppercase mb-3 select-none backdrop-blur-sm"
              style={{ fontFamily: "'Arcadepix', monospace" }}
            >
              [ SKILLS & TECHNOLOGIES ]
            </motion.div>
            <motion.h3 
              initial={{ opacity: 0, y: 32, filter: 'blur(6px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.95, delay: 0.20, ease: [0.215, 0.61, 0.355, 1] }}
              className="font-pixel text-3xl sm:text-4xl lg:text-5xl font-normal text-white tracking-wider uppercase select-none"
              style={{ fontFamily: "'Arcadepix', monospace" }}
            >
              What I <span className="text-[#FFD500] drop-shadow-[0_4px_16px_rgba(255,213,0,0.35)]">Build With</span>
            </motion.h3>
            <motion.p 
              initial={{ opacity: 0, y: 28, filter: 'blur(5px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.95, delay: 0.35, ease: [0.215, 0.61, 0.355, 1] }}
              className="text-slate-300 text-sm sm:text-base font-normal mt-3 max-w-2xl mx-auto leading-relaxed"
            >
              A curated stack of tools and frameworks I use to bring ideas to life.
            </motion.p>
          </div>`;

if (!oldSkillsHeaderRegex.test(content)) {
  console.error("Could not find oldSkillsHeaderRegex!");
  process.exit(1);
}
content = content.replace(oldSkillsHeaderRegex, newSkillsHeader);
console.log("Replaced Skills Header successfully.");

// Write back with CRLF if original was CRLF
if (isCRLF) {
  content = content.replace(/\n/g, '\r\n');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log("About.jsx updated successfully!");

