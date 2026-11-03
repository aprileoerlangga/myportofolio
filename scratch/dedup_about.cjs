const fs = require('fs');
const path = 'c:/Users/APRILEOERLANGGA/my-portofolio/src/components/About.jsx';
let content = fs.readFileSync(path, 'utf8');

// Find the first "function About() {" and the second "function About() {"
const firstIdx = content.indexOf("function About() {");
const secondIdx = content.indexOf("function About() {", firstIdx + 1);

console.log('firstIdx:', firstIdx, 'secondIdx:', secondIdx);

if (firstIdx !== -1 && secondIdx !== -1) {
  content = content.substring(0, firstIdx) + content.substring(secondIdx);
  fs.writeFileSync(path, content, 'utf8');
  console.log('Removed duplicate code before About() successfully!');
}

