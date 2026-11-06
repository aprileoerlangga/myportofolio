const https = require('https');
const fs = require('fs');

https.get('https://aanggaaa.vercel.app/assets/index-Bz3JWT3Z.js', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    fs.writeFileSync('scratch/vercel_bundle.js', data);
    console.log('Saved scratch/vercel_bundle.js, size:', data.length);

    // Search for keywords
    const idx = data.indexOf('BRICK BY BRICK');
    if (idx !== -1) {
      console.log('Found BRICK BY BRICK at index:', idx);
      const snippet = data.slice(Math.max(0, idx - 1500), Math.min(data.length, idx + 2500));
      fs.writeFileSync('scratch/quotes_snippet.js', snippet);
      console.log('Saved scratch/quotes_snippet.js');
    } else {
      console.log('BRICK BY BRICK not found in bundle');
    }
  });
}).on('error', console.error);

