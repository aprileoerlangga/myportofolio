const fs = require('fs');
const path = require('path');

const aboutPath = path.resolve(__dirname, '../src/components/About.jsx');
let content = fs.readFileSync(aboutPath, 'utf8');

// 1. Add MotivationalQuotes import if not present
if (!content.includes('import MotivationalQuotes')) {
  content = content.replace(
    "import SkillsKeyboard from './SkillsKeyboard';",
    "import SkillsKeyboard from './SkillsKeyboard';\r\nimport MotivationalQuotes from './MotivationalQuotes';"
  );
  if (!content.includes('import MotivationalQuotes')) {
    content = content.replace(
      "import SkillsKeyboard from './SkillsKeyboard';",
      "import SkillsKeyboard from './SkillsKeyboard';\nimport MotivationalQuotes from './MotivationalQuotes';"
    );
  }
}

// 2. Remove [ 🚀 CLASSIC SPACE // DOSSIER 01 ] badge
// Target:
//             <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] sm:text-xs font-pixel tracking-widest text-[#FFD500] uppercase mb-3 select-none backdrop-blur-sm" style={{ fontFamily: "'Arcadepix', monospace" }}>
//               <span className="w-2 h-2 rounded-full bg-[#E3000B] animate-pulse" />
//               [ 🚀 CLASSIC SPACE // DOSSIER 01 ]
//             </div>
content = content.replace(
  /\s*<div className="flex items-center gap-2 px-3\.5 py-1 rounded-full bg-white\/5 border border-white\/10 text-\[11px\] sm:text-xs font-pixel tracking-widest text-\[#FFD500\] uppercase mb-3 select-none backdrop-blur-sm" style=\{\{ fontFamily: "'Arcadepix', monospace" \}\}>\s*<span className="w-2 h-2 rounded-full bg-\[#E3000B\] animate-pulse" \/>\s*\[ 🚀 CLASSIC SPACE \/\/ DOSSIER 01 \]\s*<\/div>/,
  ""
);

// 3. Change ABOUT APRILEO to ABOUT ME
content = content.replace(
  'ABOUT <span className="text-[#FFD500] drop-shadow-[0_0_25px_rgba(255,213,0,0.5)]">APRILEO</span>',
  'ABOUT <span className="text-[#FFD500] drop-shadow-[0_0_25px_rgba(255,213,0,0.5)]">ME</span>'
);

// 4. Remove The Builder Dossier Badge and Editorial Statement Heading
// Target:
//             {/* The Builder Dossier Badge */}
//             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] sm:text-xs font-mono tracking-widest text-[#FFD500] uppercase mb-4 w-fit select-none backdrop-blur-sm">
//               <span className="w-2 h-2 rounded-full bg-[#E3000B] animate-pulse" />
//               // THE BUILDER STORY
//             </div>
//
//             {/* Editorial Statement Heading (Inspired by YAAS Energy bold statements) */}
//             <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-snug mb-5 select-none">
//               Turning complex ideas into <span className="text-[#FFD500] drop-shadow-[0_0_20px_rgba(255,213,0,0.45)]">digital reality</span>, one brick at a time.
//             </h3>
content = content.replace(
  /\s*\{\/\* The Builder Dossier Badge \*\/\}\s*<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white\/5 border border-white\/10 text-\[11px\] sm:text-xs font-mono tracking-widest text-\[#FFD500\] uppercase mb-4 w-fit select-none backdrop-blur-sm">\s*<span className="w-2 h-2 rounded-full bg-\[#E3000B\] animate-pulse" \/>\s*\/\/ THE BUILDER STORY\s*<\/div>\s*\{\/\* Editorial Statement Heading \(Inspired by YAAS Energy bold statements\) \*\/\}\s*<h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-snug mb-5 select-none">\s*Turning complex ideas into <span className="text-\[#FFD500\] drop-shadow-\[0_0_20px_rgba\(255,213,0,0\.45\)\]">digital reality<\/span>, one brick at a time\.\s*<\/h3>/,
  ""
);

// 5. Remove ONLINE indicator
// Target:
//                 <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[10px] font-semibold">
//                   <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
//                   <span>ONLINE</span>
//                 </div>
content = content.replace(
  /\s*<div className="flex items-center gap-1\.5 text-emerald-400 font-mono text-\[10px\] font-semibold">\s*<span className="w-1\.5 h-1\.5 rounded-full bg-emerald-400 animate-pulse" \/>\s*<span>ONLINE<\/span>\s*<\/div>/,
  ""
);

// 6. Insert <MotivationalQuotes /> above <SkillsKeyboard />
if (!content.includes('<MotivationalQuotes />')) {
  content = content.replace(
    '        {/* ============================================================ */}\r\n        {/* SKILLS SECTION: 3D MECHANICAL KEYBOARD MATRIX                */}\r\n        {/* ============================================================ */}\r\n        <div className="mt-32 sm:mt-44 relative">\r\n          <SkillsKeyboard />\r\n        </div>',
    '        {/* ============================================================ */}\r\n        {/* MOTIVATIONAL QUOTES (BUILDER CREED TRANSITIONING)            */}\r\n        {/* ============================================================ */}\r\n        <div className="relative z-20 my-16 sm:my-20">\r\n          <MotivationalQuotes />\r\n        </div>\r\n\r\n        {/* ============================================================ */}\r\n        {/* SKILLS SECTION: 3D MECHANICAL KEYBOARD MATRIX                */}\r\n        {/* ============================================================ */}\r\n        <div className="mt-16 sm:mt-24 relative">\r\n          <SkillsKeyboard />\r\n        </div>'
  );
  if (!content.includes('<MotivationalQuotes />')) {
    content = content.replace(
      '        {/* ============================================================ */}\n        {/* SKILLS SECTION: 3D MECHANICAL KEYBOARD MATRIX                */}\n        {/* ============================================================ */}\n        <div className="mt-32 sm:mt-44 relative">\n          <SkillsKeyboard />\n        </div>',
      '        {/* ============================================================ */}\n        {/* MOTIVATIONAL QUOTES (BUILDER CREED TRANSITIONING)            */}\n        {/* ============================================================ */}\n        <div className="relative z-20 my-16 sm:my-20">\n          <MotivationalQuotes />\n        </div>\n\n        {/* ============================================================ */}\n        {/* SKILLS SECTION: 3D MECHANICAL KEYBOARD MATRIX                */}\n        {/* ============================================================ */}\n        <div className="mt-16 sm:mt-24 relative">\n          <SkillsKeyboard />\n        </div>'
    );
  }
}

fs.writeFileSync(aboutPath, content, 'utf8');
console.log('Successfully updated About.jsx!');
