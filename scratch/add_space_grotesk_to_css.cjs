const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '..', 'src', 'index.css');
let css = fs.readFileSync(cssPath, 'utf8');

const spaceGroteskRule = `@font-face {
  font-family: 'Space Grotesk';
  src: url('/fonts/SpaceGrotesk.woff2') format('woff2');
  font-weight: 700 800;
  font-style: normal;
  font-display: swap;
}

`;

if (!css.includes("font-family: 'Space Grotesk'")) {
  css = spaceGroteskRule + css;
  fs.writeFileSync(cssPath, css, 'utf8');
  console.log('Added Space Grotesk font-face to index.css!');
} else {
  console.log('Space Grotesk already in index.css');
}

