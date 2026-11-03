const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'components', 'About.jsx');
let content = fs.readFileSync(filePath, 'utf8');

const isCRLF = content.includes('\r\n');
if (isCRLF) {
  content = content.replace(/\r\n/g, '\n');
}

// 1. Update Header Title to ABOUT APRILEO with Classic Space badge
const oldHeaderRegex = /\{\/\* HEADER: MASTER BUILDER PROFILE[\s\S]*?<\/motion\.div>/;
const newHeader = `{/* HEADER: MASTER BUILDER PROFILE (CLASSIC SPACE RETRO-FUTURE AESTHETIC) */}
        <motion.div 
          initial={{ opacity: 0, y: -28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-center mb-12"
        >
          {/* Header Title */}
          <div className="flex flex-col items-center justify-center group cursor-pointer text-center" title="Aprileo Erlangga // Classic Space">
            <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] sm:text-xs font-pixel tracking-widest text-[#FFD500] uppercase mb-3 select-none backdrop-blur-sm" style={{ fontFamily: "'Arcadepix', monospace" }}>
              <span className="w-2 h-2 rounded-full bg-[#E3000B] animate-pulse" />
              [ 🚀 CLASSIC SPACE // DOSSIER 01 ]
            </div>
            <h2 
              className="font-pixel text-4xl sm:text-5xl md:text-6xl font-normal tracking-wider text-white uppercase select-none"
              style={{ fontFamily: "'Arcadepix', monospace" }}
            >
              ABOUT <span className="text-[#FFD500] drop-shadow-[0_0_25px_rgba(255,213,0,0.5)]">APRILEO</span>
            </h2>
          </div>
        </motion.div>`;

if (!oldHeaderRegex.test(content)) {
  console.error("Could not find oldHeaderRegex!");
  process.exit(1);
}
content = content.replace(oldHeaderRegex, newHeader);
console.log("Updated Header Title.");

// 2. Update Photo Container to Classic Space Explorer Viewport Card
const oldFrameRegex = /\{\/\* SISI KANAN: GAYA 1 - LEGO BRICK FRAME & COLLECTOR UCS PLAQUE \*\/[\s\S]*?<\/motion\.div>\s*<\/motion\.div>\s*<\/div>/;
const newFrame = `{/* SISI KANAN: CLASSIC SPACE EXPLORER VIEWPORT & SHOWCASE CARD */}
          <motion.div 
            className="lg:w-5/12 flex items-center justify-center relative"
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
              className="relative w-full max-w-[340px] sm:max-w-[360px] p-4 sm:p-5 rounded-2xl cursor-pointer group select-none"
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
                background: 'linear-gradient(165deg, rgba(16, 24, 52, 0.85) 0%, rgba(8, 12, 28, 0.92) 100%)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1.5px solid rgba(255, 255, 255, 0.14)',
                boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.85), 0 0 35px rgba(0, 85, 191, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
              }}
              whileHover={{ scale: 1.025 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              {/* ══════════════════════════════════════════════════════════════════ */}
              {/* SIGNATURE CLASSIC SPACE OVERLAPPING YELLOW LEGO PLATE (PINNED)     */}
              {/* ══════════════════════════════════════════════════════════════════ */}
              <div 
                className="absolute -bottom-4 -right-4 z-30 pointer-events-none transform rotate-[-16deg] drop-shadow-[0_12px_24px_rgba(0,0,0,0.7)] group-hover:rotate-[-12deg] transition-transform duration-300"
              >
                <div 
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-[#FFD500] select-none"
                  style={{
                    borderTop: '2px solid rgba(255, 255, 255, 0.7)',
                    borderLeft: '1.5px solid rgba(255, 255, 255, 0.5)',
                    borderRight: '2px solid rgba(0, 0, 0, 0.6)',
                    borderBottom: '4px solid rgba(180, 130, 0, 0.95)',
                  }}
                >
                  {[...Array(4)].map((_, i) => (
                    <div 
                      key={\`yellow-stud-\${i}\`}
                      className="w-3.5 h-3.5 rounded-full flex items-center justify-center relative select-none"
                      style={{
                        background: 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.7) 0%, transparent 60%), #FFD500',
                        borderTop: '1px solid rgba(255, 255, 255, 0.6)',
                        borderBottom: '2px solid rgba(160, 110, 0, 0.8)',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                      }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-black/20 shadow-inner" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Mission Bar: Red Space Badge & Hazard Chevron */}
              <div className="flex items-center justify-between mb-3.5">
                {/* Iconic Classic Space Red Badge (Matching ref_classic_space_3.png) */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#E3000B] text-white text-[11px] font-pixel tracking-wider shadow-md">
                  <span className="text-yellow-300 font-bold">●</span>
                  <span style={{ fontFamily: "'Arcadepix', monospace" }}>SPACE</span>
                </div>

                {/* Classic Space Hazard Stripes */}
                <div className="flex items-center gap-1.5 opacity-85">
                  <span className="text-[10px] font-mono text-cyan-400 font-semibold tracking-wider">LL-928</span>
                  <div className="w-10 h-3 rounded-sm bg-[repeating-linear-gradient(45deg,#FFD500,#FFD500_4px,#111827_4px,#111827_8px)] border border-black/40 shadow-sm" />
                </div>
              </div>

              {/* Photo Display Viewport */}
              <div className="relative w-full h-[300px] sm:h-[320px] rounded-xl overflow-hidden bg-[#070b16] border border-white/10 shadow-[inset_0_2px_12px_rgba(0,0,0,0.85)]">
                <img
                  src={fotoProfil}
                  alt="Aprileo Erlangga - Fullstack Developer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Subtle Cosmic Specular Glare */}
                <div 
                  className="absolute inset-0 pointer-events-none opacity-25 group-hover:opacity-40 transition-opacity duration-300"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 45%, rgba(0,240,255,0.15) 75%, transparent 100%)'
                  }}
                />
                {/* Subtle Bottom Vignette */}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#070b16]/80 to-transparent pointer-events-none" />
              </div>

              {/* Mission Specification Bar (Inspired by ref_scroll_4800.png) */}
              <div className="mt-3.5 px-1 flex flex-col">
                <div className="flex items-center justify-between">
                  <span className="font-pixel text-white text-base sm:text-lg tracking-wider uppercase drop-shadow-[0_2px_8px_rgba(255,255,255,0.2)]" style={{ fontFamily: "'Arcadepix', monospace" }}>
                    «SURFACE EXPLORER» 2026
                  </span>
                </div>

                <div className="flex items-center justify-between mt-1 text-[11px] sm:text-xs">
                  <span className="text-[#FFD500] font-mono font-semibold tracking-wider uppercase">
                    Aprileo Erlangga // Fullstack Dev
                  </span>
                  <span className="text-emerald-400 font-mono text-[10px] flex items-center gap-1 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    ONLINE
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>`;

if (!oldFrameRegex.test(content)) {
  console.error("Could not find oldFrameRegex!");
  process.exit(1);
}
content = content.replace(oldFrameRegex, newFrame);
console.log("Updated Photo Viewport Card.");

// 3. Update Skills Header to BASIC ARSENAL (inspired by BASIC COLORS from ref)
const oldSkillsRegex = /\{\/\* Clean Open Header with gradual slow scroll reveal matching About reference \*\/[\s\S]*?<motion\.p[\s\S]*?<\/motion\.p>\s*<\/div>/;
const newSkills = `{/* Clean Open Header with gradual slow scroll reveal matching About reference */}
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
              BASIC <span className="text-[#FFD500] drop-shadow-[0_0_25px_rgba(255,213,0,0.5)]">ARSENAL</span>
            </motion.h3>
            <motion.p 
              initial={{ opacity: 0, y: 28, filter: 'blur(5px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.95, delay: 0.35, ease: [0.215, 0.61, 0.355, 1] }}
              className="text-slate-300 text-sm sm:text-base font-normal mt-3 max-w-2xl mx-auto leading-relaxed"
            >
              A curated fleet of technologies engineered for scalable digital systems.
            </motion.p>
          </div>`;

if (!oldSkillsRegex.test(content)) {
  console.error("Could not find oldSkillsRegex!");
  process.exit(1);
}
content = content.replace(oldSkillsRegex, newSkills);
console.log("Updated Skills Header.");

if (isCRLF) {
  content = content.replace(/\n/g, '\r\n');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log("About.jsx updated successfully for Classic Space aesthetic!");

