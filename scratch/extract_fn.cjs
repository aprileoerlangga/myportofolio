const fs = require('fs');

const bundle = fs.readFileSync('scratch/vercel_bundle.js', 'utf8');
const startIdx = bundle.indexOf('function Nj()');
const endIdx = bundle.indexOf('function', startIdx + 20);

const fnCode = bundle.slice(startIdx, endIdx);
fs.writeFileSync('scratch/original_quotes_component.js', fnCode);
console.log('Saved scratch/original_quotes_component.js, length:', fnCode.length);

