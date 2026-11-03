const fs = require('fs');
const path = 'c:/Users/APRILEOERLANGGA/my-portofolio/src/components/About.jsx';
let content = fs.readFileSync(path, 'utf8');

// Remove from `// Official Brand Logo Vector Components` to before `function About() {`
const startMarker = "// Official Brand Logo Vector Components";
const endMarker = "function About() {";

const sIdx = content.indexOf(startMarker);
const eIdx = content.indexOf(endMarker);

if (sIdx !== -1 && eIdx !== -1) {
  content = content.substring(0, sIdx) + content.substring(eIdx);
}

// Inside About(), remove `row1Scroll, row2Scroll, row3Scroll` and `const allSkills = [` up to `const row3 = ...filter(Boolean);`
const allSkillsStart = "  // Unified Skills & Technologies Data";
const allSkillsEnd = "  return (";

const asIdx = content.indexOf(allSkillsStart);
const aeIdx = content.indexOf(allSkillsEnd);

if (asIdx !== -1 && aeIdx !== -1) {
  content = content.substring(0, asIdx) + content.substring(aeIdx);
}

// Remove unused row1Scroll, row2Scroll, row3Scroll
content = content.replace(/  \/\/ 3-Row Conveyor interactive scroll shifts[\s\S]*?const row3Scroll = useSpring[\s\S]*?\);\n/g, '');

fs.writeFileSync(path, content, 'utf8');
console.log('Cleaned up About.jsx successfully!');

