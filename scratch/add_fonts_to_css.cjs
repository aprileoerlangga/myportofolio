const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '..', 'src', 'index.css');
const content = fs.readFileSync(cssPath, 'utf8');

const fontFaceDefs = `@font-face {
  font-family: 'Soledago';
  src: url('/fonts/Soledago.woff2') format('woff2');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Bounded';
  src: url('/fonts/Bounded-Medium.woff2') format('woff2');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

`;

if (!content.includes("'Soledago'")) {
  fs.writeFileSync(cssPath, fontFaceDefs + content, 'utf8');
  console.log('Added Soledago and Bounded to index.css!');
} else {
  console.log('Already exists in index.css.');
}

