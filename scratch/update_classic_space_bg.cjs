const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'components', 'AboutShatteredBackground.jsx');
let content = fs.readFileSync(filePath, 'utf8');

const isCRLF = content.includes('\r\n');
if (isCRLF) {
  content = content.replace(/\r\n/g, '\n');
}

// 1. Update mats in About3DScene
const oldMats = `  const mats = useMemo(() => ({\n    red: createLegoMaterial('#E3000B'),\n    yellow: createLegoMaterial('#FFD500'),\n  }), []);`;
const newMats = `  const mats = useMemo(() => ({\n    red: createLegoMaterial('#E3000B'),\n    yellow: createLegoMaterial('#FFD500'),\n    blue: createLegoMaterial('#0055BF'),\n    grey: createLegoMaterial('#8A929A'),\n  }), []);`;

if (content.includes(oldMats)) {
  content = content.replace(oldMats, newMats);
  console.log("Updated mats.");
} else {
  console.log("Old mats not found directly, replacing regex...");
  content = content.replace(/const mats = useMemo\(\(\) => \(\{[\s\S]*?\}\), \[\]\);/, `const mats = useMemo(() => ({\n    red: createLegoMaterial('#E3000B'),\n    yellow: createLegoMaterial('#FFD500'),\n    blue: createLegoMaterial('#0055BF'),\n    grey: createLegoMaterial('#8A929A'),\n  }), []);`);
}

// 2. Update gutterPieces
const oldGutterRegex = /const gutterPieces = useMemo\(\(\) => \[[\s\S]*?\], \[\]\);/;
const newGutterPieces = `const gutterPieces = useMemo(() => [
    // LEFT GUTTER: Classic Space Palette (Yellow, Blue, Grey, Red)
    { id: 1, type: '2x2', color: '#FFD500', position: [-7.2, 3.8, -0.6], rotation: [0.3, 0.5, -0.2], scale: 0.65, floatSpeed: 1.3, scrollFactor: -1.6 },
    { id: 2, type: '1x2', color: '#0055BF', position: [-6.8, 2.0, -0.4], rotation: [0.6, -0.3, 0.4], scale: 0.70, floatSpeed: 1.1, scrollFactor: -1.4 },
    { id: 3, type: 'stud', color: '#FFD500', position: [-7.4, 0.2, -0.5], rotation: [0.2, 0.8, -0.3], scale: 0.75, floatSpeed: 1.5, scrollFactor: -1.8 },
    { id: 4, type: '1x1', color: '#8A929A', position: [-6.9, -1.6, -0.8], rotation: [-0.4, 0.6, 0.2], scale: 0.72, floatSpeed: 1.2, scrollFactor: -1.5 },
    { id: 5, type: '2x2', color: '#E3000B', position: [-7.3, -3.2, -0.5], rotation: [0.5, -0.4, 0.6], scale: 0.65, floatSpeed: 1.4, scrollFactor: -1.3 },

    // RIGHT GUTTER: Classic Space Palette (Yellow, Blue, Grey, Red)
    { id: 6, type: '1x2', color: '#FFD500', position: [7.1, 3.6, -0.5], rotation: [-0.3, -0.6, 0.3], scale: 0.70, floatSpeed: 1.2, scrollFactor: -1.5 },
    { id: 7, type: 'stud', color: '#0055BF', position: [7.5, 1.8, -0.8], rotation: [0.4, 0.4, -0.2], scale: 0.75, floatSpeed: 1.6, scrollFactor: -1.9 },
    { id: 8, type: '2x2', color: '#8A929A', position: [6.8, 0.0, -0.4], rotation: [0.2, -0.7, 0.4], scale: 0.65, floatSpeed: 1.3, scrollFactor: -1.4 },
    { id: 9, type: '1x1', color: '#FFD500', position: [7.4, -1.8, -0.7], rotation: [-0.5, 0.3, -0.4], scale: 0.72, floatSpeed: 1.1, scrollFactor: -1.6 },
    { id: 10, type: '2x2', color: '#0055BF', position: [7.0, -3.3, -0.5], rotation: [0.3, 0.6, -0.5], scale: 0.65, floatSpeed: 1.4, scrollFactor: -1.3 },
  ], []);`;

content = content.replace(oldGutterRegex, newGutterPieces);
console.log("Updated gutterPieces.");

// 3. Update material getter in FloatingGutterBrick call
content = content.replace(
  /material=\{piece\.color === '#FFD500' \? mats\.yellow : mats\.red\}/g,
  "material={piece.color === '#FFD500' ? mats.yellow : piece.color === '#0055BF' ? mats.blue : piece.color === '#8A929A' ? mats.grey : mats.red}"
);

// 4. Update material getter in MorphingBrick call
content = content.replace(
  /material=\{b\.color === '#FFD500' \? mats\.yellow : mats\.red\}/g,
  "material={b.color === '#FFD500' ? mats.yellow : b.color === '#0055BF' ? mats.blue : b.color === '#8A929A' ? mats.grey : mats.red}"
);

// 5. Make the bottom battlement towers vibrant Yellow #FFD500 (Classic Space style!)
// Replace the red bricks in morphingBricks with yellow and classic blue
content = content.replace(
  /color: '#E3000B'/g,
  "color: '#FFD500'"
);
// Make top accents blue or red for Classic Space flavor
content = content.replace(/id: 'l4-4', type: '2x2', color: '#FFD500'/g, "id: 'l4-4', type: '2x2', color: '#0055BF'");
content = content.replace(/id: 'r4-4', type: '2x2', color: '#FFD500'/g, "id: 'r4-4', type: '2x2', color: '#0055BF'");
content = content.replace(/id: 'l2-2', type: '2x2', color: '#FFD500'/g, "id: 'l2-2', type: '2x2', color: '#E3000B'");
content = content.replace(/id: 'r2-2', type: '2x2', color: '#FFD500'/g, "id: 'r2-2', type: '2x2', color: '#E3000B'");

if (isCRLF) {
  content = content.replace(/\n/g, '\r\n');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log("AboutShatteredBackground.jsx updated successfully!");

