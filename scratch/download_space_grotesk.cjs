const https = require('https');
const fs = require('fs');
const path = require('path');

const cssUrl = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700;800&display=swap';

https.get(cssUrl, {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  }
}, res => {
  let css = '';
  res.on('data', chunk => css += chunk);
  res.on('end', () => {
    console.log('Fetched Google Font CSS for Space Grotesk!');
    const match = css.match(/src:\s*url\((https:\/\/[^)]+\.woff2)\)/);
    if (match && match[1]) {
      const fontUrl = match[1];
      console.log('Downloading WOFF2 from:', fontUrl);
      const destPath = path.join(__dirname, '..', 'public', 'fonts', 'SpaceGrotesk.woff2');
      const file = fs.createWriteStream(destPath);
      https.get(fontUrl, fRes => {
        fRes.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log('Saved SpaceGrotesk.woff2! Size:', fs.statSync(destPath).size);
        });
      });
    }
  });
}).on('error', console.error);

