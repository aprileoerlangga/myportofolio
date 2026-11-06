const https = require('https');
const fs = require('fs');
const path = require('path');

const fontUrl = 'https://yaas-energy.com/fonts/Soledago.woff2';
const destPath = path.join(__dirname, '..', 'public', 'fonts', 'Soledago.woff2');

fs.mkdirSync(path.dirname(destPath), { recursive: true });

const file = fs.createWriteStream(destPath);
https.get(fontUrl, res => {
  console.log('Status code:', res.statusCode);
  console.log('Headers:', res.headers['content-type'], res.headers['content-length']);
  res.pipe(file);
  file.on('finish', () => {
    file.close();
    console.log('Downloaded Soledago.woff2 successfully! Size:', fs.statSync(destPath).size);
  });
}).on('error', err => {
  console.error('Download error:', err);
});

