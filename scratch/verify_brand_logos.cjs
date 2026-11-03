const http = require('http');
const fs = require('fs');

function getDevServerPort() {
  return new Promise((resolve) => {
    // Check 5173 then 5174
    http.get('http://localhost:5173', () => resolve(5173)).on('error', () => {
      http.get('http://localhost:5174', () => resolve(5174)).on('error', () => resolve(5173));
    });
  });
}

async function run() {
  const port = await getDevServerPort();
  console.log('Dev server found on port:', port);

  // Use CDP with Chrome
  const targets = await new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9222/json', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  }).catch(() => null);

  if (!targets) {
    console.log('No Chrome CDP found on 9222, launching or using existing...');
    // We can run chrome or check
  } else {
    console.log('Found Chrome targets:', targets.length);
  }
}

run();

