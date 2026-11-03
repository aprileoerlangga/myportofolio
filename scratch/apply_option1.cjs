const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'components', 'About.jsx');
let content = fs.readFileSync(filePath, 'utf8');

const isCRLF = content.includes('\r\n');
if (isCRLF) {
  content = content.replace(/\r\n/g, '\n');
}

const startStr = "{/* ============================================================ */}\n        {/* MAIN DISPLAY: BUILDER LOGBOOK";
const endStr = "{/* ============================================================ */}\n        {/* SKILLS SECTION: HYBRID DYNAMIC STREAM";

const startIdx = content.indexOf(startStr);
const endIdx = content.indexOf(endStr);

if (startIdx === -1 || endIdx === -1) {
  console.error("Indices not found! startIdx:", startIdx, "endIdx:", endIdx);
  process.exit(1);
}

const newOption1Console = `{/* ============================================================ */}
        {/* OPTION 1: CLASSIC SPACE FLIGHT LOG & COMMAND DECK CONSOLE   */}
        {/* ============================================================ */}
        <motion.div 
          initial={{ opacity: 0, y: 35, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-5xl mx-auto rounded-2xl lg:rounded-3xl overflow-hidden p-1 sm:p-1.5 mb-20 shadow-[0_30px_90px_-20px_rgba(0,0,0,0.9),0_0_50px_rgba(0,85,191,0.22)]"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 213, 0, 0.45) 0%, rgba(0, 85, 191, 0.4) 30%, rgba(255, 255, 255, 0.1) 60%, rgba(0, 0, 0, 0.8) 100%)'
          }}
        >
          {/* Inner Console Housing (Deep Space Cockpit Panel) */}
          <div className="relative rounded-[calc(1rem-1px)] lg:rounded-[calc(1.5rem-2px)] bg-[#080d1d]/95 backdrop-blur-2xl border border-white/10 p-4 sm:p-7 overflow-hidden">
            
            {/* Console Top Telemetry Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-white/10 select-none">
              {/* Left: Classic Space Official Badge + Terminal ID */}
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#E3000B] text-white text-xs font-pixel tracking-wider shadow-md">
                  <span className="text-yellow-300 font-bold">●</span>
                  <span style={{ fontFamily: "'Arcadepix', monospace" }}>SPACE</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[11px] sm:text-xs text-slate-300">
                  <span className="text-[#FFD500] font-semibold">CONSOLE // LL-928</span>
                  <span className="text-slate-600">|</span>
                  <span className="text-cyan-400">TERM: ACTIVE</span>
                </div>
              </div>

              {/* Right: Telemetry Status & Hazard Chevron */}
              <div className="flex items-center gap-3">
                {/* 3 Console Indicator Lights */}
                <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded bg-black/40 border border-white/5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#10B981] animate-pulse" title="Telemetry: OK" />
                  <span className="w-2 h-2 rounded-full bg-[#FFD500] shadow-[0_0_6px_#FFD500]" title="Power: Optimal" />
                  <span className="w-2 h-2 rounded-full bg-[#E3000B] opacity-60" title="Shields: Standby" />
                </div>

                {/* Hazard Chevron Strip */}
                <div className="w-16 h-3 rounded-sm bg-[repeating-linear-gradient(45deg,#FFD500,#FFD500_5px,#111827_5px,#111827_10px)] border border-black/50 shadow-inner" />
              </div>
            </div>

            {/* Console Body: 2 Bays (Left Bay: Transmission Logbook | Right Bay: Commander Visual Feed) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
              
              {/* ─────────────────────────────────────────────────────────── */}
              {/* LEFT BAY (Cols 1-7): TRANSMISSION LOGBOOK                   */}
              {/* ─────────────────────────────────────────────────────────── */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                <div>
                  {/* Sub-header with terminal prompt */}
                  <div className="flex items-center gap-2 font-mono text-xs text-[#FFD500] uppercase tracking-wider mb-4 pb-2 border-b border-white/5">
                    <span className="text-cyan-400 font-bold">{'>'}</span>
                    <span>TRANSMISSION_LOG // EXPLORER_DOSSIER</span>
                    <span className="ml-auto text-[10px] text-slate-400">LOC: LAMONGAN {'->'} GLOBAL</span>
                  </div>

                  {/* Staggered Bio Log Entries */}
                  <div className="space-y-3.5 text-slate-300 leading-relaxed text-sm sm:text-[15px] font-normal">
                    {/* Log Entry 01 */}
                    <div className="p-3 sm:p-3.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-[#FFD500]/30 transition-colors">
                      <div className="flex items-center gap-2 text-[11px] font-mono text-[#FFD500] mb-1.5 font-semibold">
                        <span>[01 // ORIGIN]</span>
                        <span className="text-slate-500">|</span>
                        <span className="text-slate-400">FOUNDATION</span>
                      </div>
                      <p>
                        Hi, I'm <strong className="text-white font-semibold">Aprileo Muhammad David Erlangga</strong>! I grew up in Lamongan, a small city full of inspiration and natural beauty. My surroundings sparked a deep curiosity about technology and design.
                      </p>
                    </div>

                    {/* Log Entry 02 */}
                    <div className="p-3 sm:p-3.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-[#FFD500]/30 transition-colors">
                      <div className="flex items-center gap-2 text-[11px] font-mono text-[#FFD500] mb-1.5 font-semibold">
                        <span>[02 // CRAFT]</span>
                        <span className="text-slate-500">|</span>
                        <span className="text-slate-400">FULLSTACK SYSTEMS</span>
                      </div>
                      <p>
                        Through a journey of self-driven learning, I discovered a strong passion for digital development. Today, as a <span className="text-[#FFD500] font-medium">Fullstack Developer</span>, I build <span className="text-white font-medium">scalable web applications</span> with high performance and polished user experiences. I'm passionate about turning complex ideas into intuitive, engaging digital products that are both functional and enjoyable to use.
                      </p>
                    </div>

                    {/* Log Entry 03 */}
                    <div className="p-3 sm:p-3.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-[#FFD500]/30 transition-colors">
                      <div className="flex items-center gap-2 text-[11px] font-mono text-[#FFD500] mb-1.5 font-semibold">
                        <span>[03 // MISSION]</span>
                        <span className="text-slate-500">|</span>
                        <span className="text-slate-400">CONTINUOUS EVOLUTION</span>
                      </div>
                      <p>
                        Join me on my journey as I continue creating impactful and ever-evolving digital solutions.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Button: My Resume (Harmonized 3D Tactile Lego Button) */}
                <div className="pt-2 flex items-center">
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
              </div>

              {/* ─────────────────────────────────────────────────────────── */}
              {/* RIGHT BAY (Cols 8-12): COMMANDER VISUAL FEED                */}
              {/* ─────────────────────────────────────────────────────────── */}
              <div className="lg:col-span-5 flex flex-col justify-center items-center">
                <motion.div 
                  className="relative w-full max-w-[320px] sm:max-w-[340px] p-3 sm:p-3.5 rounded-2xl bg-[#0d1326] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.15)] group cursor-pointer"
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
                  }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  {/* Overlapping Yellow Lego Plate (Classic Space Signature Touch) */}
                  <div 
                    className="absolute -bottom-3.5 -right-3.5 z-30 pointer-events-none transform rotate-[-15deg] drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] group-hover:rotate-[-10deg] transition-transform duration-300"
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

                  {/* Visual Feed Header */}
                  <div className="flex items-center justify-between mb-2.5 px-1 font-mono text-[11px]">
                    <div className="flex items-center gap-1.5 text-cyan-400 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                      <span>OPTICAL_FEED: 01</span>
                    </div>
                    <span className="text-emerald-400 text-[10px] font-bold">1080P // LIVE</span>
                  </div>

                  {/* Cockpit Canopy Photo Viewport */}
                  <div className="relative w-full h-[290px] sm:h-[310px] rounded-xl overflow-hidden bg-[#070b16] border border-white/10 shadow-inner">
                    <img
                      src={fotoProfil}
                      alt="Aprileo Erlangga - Fullstack Developer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Subtle Cockpit Specular Glass Glare */}
                    <div 
                      className="absolute inset-0 pointer-events-none opacity-20 group-hover:opacity-35 transition-opacity duration-300"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.35) 0%, transparent 45%, rgba(0,240,255,0.18) 75%, transparent 100%)'
                      }}
                    />
                    {/* Subtle Bottom Vignette */}
                    <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[#070b16]/85 to-transparent pointer-events-none" />
                  </div>

                  {/* Feed Telemetry Metadata */}
                  <div className="mt-3 px-1 flex flex-col">
                    <div className="font-pixel text-white text-base sm:text-lg tracking-wider uppercase drop-shadow-[0_2px_8px_rgba(255,255,255,0.2)]" style={{ fontFamily: "'Arcadepix', monospace" }}>
                      «COMMANDER» 2026
                    </div>
                    <div className="flex items-center justify-between mt-1 text-[11px]">
                      <span className="text-[#FFD500] font-mono font-semibold tracking-wider uppercase">
                        Aprileo Erlangga // Fullstack
                      </span>
                      <span className="text-slate-400 font-mono text-[10px]">
                        ID: APE-928
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>

            </div>
          </div>
        </motion.div>

        `;

content = content.slice(0, startIdx) + newOption1Console + content.slice(endIdx);

if (isCRLF) {
  content = content.replace(/\n/g, '\r\n');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log("Successfully replaced with Option 1 Flight Log Console in About.jsx!");
