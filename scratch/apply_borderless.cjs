const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'components', 'About.jsx');
let content = fs.readFileSync(filePath, 'utf8');

const isCRLF = content.includes('\r\n');
if (isCRLF) {
  content = content.replace(/\r\n/g, '\n');
}

const startStr = "{/* ============================================================ */}\n        {/* OPTION 1: CLASSIC SPACE FLIGHT LOG";
const endStr = "{/* ============================================================ */}\n        {/* SKILLS SECTION: HYBRID DYNAMIC STREAM";

const startIdx = content.indexOf(startStr);
const endIdx = content.indexOf(endStr);

if (startIdx === -1 || endIdx === -1) {
  console.error("Indices not found! startIdx:", startIdx, "endIdx:", endIdx);
  process.exit(1);
}

const newBorderlessSection = `{/* ============================================================ */}
        {/* BORDERLESS EDITORIAL BIO (YAAS ENERGY x LEGO CLASSIC SPACE)  */}
        {/* ============================================================ */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14 mb-24 relative z-20">
          
          {/* SISI KIRI: BORDERLESS STORYTELLING TYPOGRAPHY */}
          <motion.div 
            className="w-full lg:w-7/12 flex flex-col justify-center relative"
            style={{ y: bioScrollY }}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* The Builder Dossier Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] sm:text-xs font-mono tracking-widest text-[#FFD500] uppercase mb-4 w-fit select-none backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-[#E3000B] animate-pulse" />
              // THE BUILDER STORY
            </div>

            {/* Editorial Statement Heading (Inspired by YAAS Energy bold statements) */}
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-snug mb-5 select-none">
              Turning complex ideas into <span className="text-[#FFD500] drop-shadow-[0_0_20px_rgba(255,213,0,0.45)]">digital reality</span>, one brick at a time.
            </h3>

            {/* Clean Flowing Paragraphs (Zero borders, zero boxed containers) */}
            <div className="space-y-4 text-slate-300 leading-relaxed text-sm sm:text-base font-normal">
              <p>
                Hi, I'm <strong className="text-white font-semibold">Aprileo Muhammad David Erlangga</strong>! I grew up in Lamongan, a small city full of inspiration and natural beauty. My surroundings sparked a deep curiosity about technology and design.
              </p>
              <p>
                Through a journey of self-driven learning, I discovered a strong passion for digital development. Today, as a <span className="text-[#FFD500] font-semibold">Fullstack Developer</span>, I build <strong className="text-white font-semibold">scalable web applications</strong> with high performance and polished user experiences. I'm passionate about turning complex ideas into intuitive, engaging digital products that are both functional and enjoyable to use.
              </p>
              <p>
                Join me on my journey as I continue creating impactful and ever-evolving digital solutions.
              </p>
            </div>

            {/* 3D Tactile Lego Resume Button */}
            <div className="mt-7 flex items-center">
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
            </div>
          </motion.div>

          {/* SISI KANAN: BORDERLESS ORGANIC FLOATING PHOTO WITH LEGO ACCENTS */}
          <motion.div 
            className="w-full lg:w-5/12 flex flex-col items-center justify-center relative"
            style={{ y: polaroidScrollY }}
            initial={{ opacity: 0, x: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* The Photo Container (Clean rounded organic silhouette, zero heavy dark boxes) */}
            <motion.div
              className="relative w-full max-w-[320px] sm:max-w-[340px] cursor-pointer group select-none"
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
              }}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              {/* Overlapping Yellow Lego Plate (Classic Space Signature) */}
              <div 
                className="absolute -bottom-3 -right-3 z-30 pointer-events-none transform rotate-[-14deg] drop-shadow-[0_12px_24px_rgba(0,0,0,0.85)] group-hover:rotate-[-10deg] transition-transform duration-300"
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

              {/* Floating Top-Left Classic Space Red Badge */}
              <div className="absolute -top-3 -left-3 z-30 pointer-events-none drop-shadow-[0_8px_16px_rgba(0,0,0,0.7)] transform -rotate-3 group-hover:rotate-0 transition-transform duration-300">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#E3000B] text-white text-[11px] font-pixel tracking-wider shadow-md border-t border-white/40">
                  <span className="text-yellow-300 font-bold">●</span>
                  <span style={{ fontFamily: "'Arcadepix', monospace" }}>SPACE</span>
                </div>
              </div>

              {/* Clean Photo Silhouette (Border-Free, Soft Deep Shadow) */}
              <div className="relative w-full h-[320px] sm:h-[350px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(0,85,191,0.25)] bg-[#090d1a]">
                <img
                  src={fotoProfil}
                  alt="Aprileo Erlangga - Fullstack Developer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Subtle Starlight Specular Glare */}
                <div 
                  className="absolute inset-0 pointer-events-none opacity-20 group-hover:opacity-35 transition-opacity duration-300"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 45%, rgba(0,240,255,0.15) 75%, transparent 100%)'
                  }}
                />
                {/* Subtle Bottom Vignette */}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#090d1a]/85 to-transparent pointer-events-none" />
              </div>

              {/* Minimalist Borderless Caption under Photo */}
              <div className="mt-3.5 px-1 flex items-center justify-between">
                <div>
                  <div className="font-pixel text-white text-base tracking-wider uppercase drop-shadow-[0_2px_8px_rgba(255,255,255,0.2)]" style={{ fontFamily: "'Arcadepix', monospace" }}>
                    Aprileo Erlangga
                  </div>
                  <div className="text-[#FFD500] font-mono text-[11px] font-semibold tracking-wider uppercase mt-0.5">
                    Fullstack Developer // 2026
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[10px] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>ONLINE</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        `;

content = content.slice(0, startIdx) + newBorderlessSection + content.slice(endIdx);

if (isCRLF) {
  content = content.replace(/\n/g, '\r\n');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log("Successfully replaced with Borderless Editorial layout in About.jsx!");

