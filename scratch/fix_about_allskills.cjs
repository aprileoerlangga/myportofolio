const fs = require('fs');
const path = 'c:/Users/APRILEOERLANGGA/my-portofolio/src/components/About.jsx';
let content = fs.readFileSync(path, 'utf8');

const startMarker = "  // 3-Row Conveyor interactive scroll shifts";
const endMarker = "  return (";

const sIdx = content.indexOf(startMarker);
const eIdx = content.indexOf(endMarker, sIdx);

console.log('sIdx:', sIdx, 'eIdx:', eIdx);

if (sIdx !== -1 && eIdx !== -1) {
  content = content.substring(0, sIdx) + content.substring(eIdx);
  fs.writeFileSync(path, content, 'utf8');
  console.log('Successfully cleaned allSkills from About.jsx!');
} else {
  console.error('Could not find markers');
}

