const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'components', 'About.jsx');
let content = fs.readFileSync(filePath, 'utf8');

const isCRLF = content.includes('\r\n');
if (isCRLF) {
  content = content.replace(/\r\n/g, '\n');
}

// 1. Reduce top padding of section
content = content.replace(
  '<section id="about" className="min-h-screen py-24 bg-transparent text-slate-200 overflow-x-clip relative">',
  '<section id="about" className="min-h-screen pt-16 sm:pt-20 pb-24 bg-transparent text-slate-200 overflow-x-clip relative">'
);

// 2. Reduce header margin
content = content.replace(
  'className="flex items-center justify-center mb-12"',
  'className="flex items-center justify-center mb-7"'
);

// 3. Compact card padding and spacing
content = content.replace(
  'className="space-y-3.5 text-slate-300 leading-relaxed text-sm sm:text-[15px] font-normal"',
  'className="space-y-2.5 text-slate-300 leading-relaxed text-xs sm:text-[14px] font-normal"'
);

content = content.replace(
  /className="p-3 sm:p-3\.5 rounded-xl bg-white\/\[0\.03\] border border-white\/5 hover:border-\[#FFD500\]\/30 transition-colors"/g,
  'className="p-2.5 sm:p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-[#FFD500]/30 transition-colors"'
);

// 4. Compact photo viewport height slightly to match left logbook
content = content.replace(
  'className="relative w-full h-[290px] sm:h-[310px] rounded-xl overflow-hidden bg-[#070b16] border border-white/10 shadow-inner"',
  'className="relative w-full h-[260px] sm:h-[280px] rounded-xl overflow-hidden bg-[#070b16] border border-white/10 shadow-inner"'
);

if (isCRLF) {
  content = content.replace(/\n/g, '\r\n');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log("Console rhythm tuned successfully!");

