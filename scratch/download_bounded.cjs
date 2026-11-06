const https = require('https');
const fs = require('fs');
const path = require('path');

const fontUrl = 'https://yaas-energy.com/fonts/Bounded-Medium.woff2';
const destPath = path.join(__dirname, '..', 'public', 'fonts', 'Bounded-Medium.woff2');

const file = fs.createWriteStream(destPath);
https.get(fontUrl, res => {
  console.log('Status code:', res.statusCode);
  res.pipe(file);
  file.on('finish', () => {
    file.close();
    console.log('Downloaded Bounded-Medium.woff2 successfully! Size:', fs.statSync(destPath).size);
  });
}).on('error', err => {
  console.error('Download error:', err);
});

