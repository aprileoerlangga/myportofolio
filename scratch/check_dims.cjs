const fs = require('fs');
const path = require('path');

function getPngDimensions(buf) {
  if (buf.toString('ascii', 12, 16) === 'IHDR') {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }
  return null;
}

function getJpegDimensions(buf) {
  let offset = 2;
  while (offset < buf.length) {
    if (buf[offset] !== 0xFF) break;
    let marker = buf[offset + 1];
    if (marker === 0xC0 || marker === 0xC2) {
      return { height: buf.readUInt16BE(offset + 5), width: buf.readUInt16BE(offset + 7) };
    }
    let len = buf.readUInt16BE(offset + 2);
    offset += 2 + len;
  }
  return null;
}

const files = ['IoT.png', 'RosaStore.png', 'FishAI.png', 'Iwakmart Mobile.jpg', 'Web Portoku.jpeg'];
for (const f of files) {
  const p = path.join(__dirname, '..', 'src', 'assets', f);
  const b = fs.readFileSync(p);
  const dims = (f.endsWith('.png') ? getPngDimensions(b) : getJpegDimensions(b)) || { width: 0, height: 0 };
  const ratio = (dims.width / dims.height).toFixed(2);
  console.log(`${f}: ${dims.width}x${dims.height} (ratio: ${ratio}:1)`);
}
