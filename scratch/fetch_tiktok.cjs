const https = require('https');
const http = require('http');

function getUrl(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    }, res => {
      console.log('Status:', res.statusCode);
      console.log('Location:', res.headers.location);
      if (res.headers.location) {
        resolve(res.headers.location);
      } else {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(data));
      }
    });
    req.on('error', reject);
  });
}

async function run() {
  let curr = 'https://vt.tiktok.com/ZSp1hC9LC/';
  for (let i = 0; i < 5; i++) {
    console.log('Checking:', curr);
    const next = await getUrl(curr);
    if (typeof next === 'string' && next.startsWith('http')) {
      curr = next;
    } else {
      console.log('Final page received, length:', typeof next === 'string' ? next.length : 0);
      if (typeof next === 'string') {
        // extract title, description, or video url
        const titleMatch = next.match(/<title>([^<]+)<\/title>/);
        console.log('Title:', titleMatch ? titleMatch[1] : 'None');
        const descMatch = next.match(/<meta\s+name="description"\s+content="([^"]+)"/i) || next.match(/<meta\s+property="og:description"\s+content="([^"]+)"/i);
        console.log('Desc:', descMatch ? descMatch[1] : 'None');
        const videoMatch = next.match(/<meta\s+property="og:video"\s+content="([^"]+)"/i) || next.match(/"playAddr":"([^"]+)"/);
        console.log('Video:', videoMatch ? videoMatch[1] : 'None');
      }
      break;
    }
  }
}

run().catch(console.error);

