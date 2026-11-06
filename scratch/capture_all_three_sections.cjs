const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function checkPort(port) {
  return new Promise((resolve) => {
    const req = http.get({
      hostname: 'localhost',
      port: port,
      path: '/about',
      timeout: 2000
    }, (res) => {
      resolve(res.statusCode === 200);
    });
    req.on('error', () => resolve(false));
    req.on('timeout', () => { req.destroy(); resolve(false); });
  });
}

async function main() {
  let activePort = null;
  for (const p of [5173, 5174, 5175]) {
    if (await checkPort(p)) {
      activePort = p;
      break;
    }
  }
  console.log('Active Vite port:', activePort);
  if (!activePort) {
    console.error('No Vite dev server found responding on 5173, 5174, or 5175');
    process.exit(1);
  }

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = 'C:\\Users\\APRILEOERLANGGA\\.gemini\\antigravity\\brain\\b483387a-7d2c-424b-95f6-cfff3297c331\\scratch\\chrome-user-data-verify';
  
  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9225',
    `--user-data-dir=${userDataDir}`,
    '--window-size=1440,960',
    '--hide-scrollbars',
    '--disable-gpu'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  function getVersion() {
    return new Promise((resolve, reject) => {
      http.get('http://127.0.0.1:9225/json/list', res => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(JSON.parse(data)));
      }).on('error', reject);
    });
  }

  let targets = await getVersion();
  let wsUrl = targets[0]?.webSocketDebuggerUrl;

  const ws = new WebSocket(wsUrl);
  let id = 1;
  const pending = new Map();

  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const msgId = id++;
      pending.set(msgId, { resolve, reject });
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  ws.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);
    if (data.id && pending.has(data.id)) {
      const { resolve, reject } = pending.get(data.id);
      pending.delete(data.id);
      if (data.error) reject(data.error);
      else resolve(data.result);
    }
  });

  if (ws.readyState !== 1) {
    await new Promise((resolve) => ws.addEventListener('open', resolve));
  }

  await send('Page.enable');
  await send('Page.navigate', { url: `http://localhost:${activePort}/about` });
  await new Promise(r => setTimeout(r, 2500));

  const artifactDir = 'C:\\Users\\APRILEOERLANGGA\\.gemini\\antigravity\\brain\\b483387a-7d2c-424b-95f6-cfff3297c331';

  // 1. Top Section (Photo & Bio)
  await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 0);' });
  await new Promise(r => setTimeout(r, 800));
  let snap = await send('Page.captureScreenshot', { format: 'png' });
  let b64 = snap.data || snap.result?.data;
  fs.writeFileSync(`${artifactDir}\\verify_top_photo.png`, Buffer.from(b64, 'base64'));
  console.log('Saved verify_top_photo.png');

  // 2. Middle Section (Motivational Quotes)
  await send('Runtime.evaluate', {
    expression: `
      const el = document.getElementById('quotes-section') || document.querySelector('section:nth-of-type(2)');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
      else window.scrollTo(0, 1100);
    `
  });
  await new Promise(r => setTimeout(r, 800));
  snap = await send('Page.captureScreenshot', { format: 'png' });
  b64 = snap.data || snap.result?.data;
  fs.writeFileSync(`${artifactDir}\\verify_quotes_section.png`, Buffer.from(b64, 'base64'));
  console.log('Saved verify_quotes_section.png');

  // 3. Skills Section (Default React)
  await send('Runtime.evaluate', {
    expression: `
      const el = document.getElementById('skills-section');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
      else window.scrollTo(0, 2200);
    `
  });
  await new Promise(r => setTimeout(r, 1000));
  snap = await send('Page.captureScreenshot', { format: 'png' });
  b64 = snap.data || snap.result?.data;
  fs.writeFileSync(`${artifactDir}\\verify_skills_section_react.png`, Buffer.from(b64, 'base64'));
  console.log('Saved verify_skills_section_react.png');

  // 4. Click Linux ('Z' key) to see OS & Environment
  await send('Runtime.evaluate', {
    expression: `
      const linuxBtn = document.querySelector('[data-skill-id="linux"]');
      if (linuxBtn) linuxBtn.click();
    `
  });
  await new Promise(r => setTimeout(r, 800));
  snap = await send('Page.captureScreenshot', { format: 'png' });
  b64 = snap.data || snap.result?.data;
  fs.writeFileSync(`${artifactDir}\\verify_skills_section_linux.png`, Buffer.from(b64, 'base64'));
  console.log('Saved verify_skills_section_linux.png');

  chromeProc.kill();
  console.log('Done!');
  process.exit(0);
}

main().catch(err => {
  console.error('Error in test:', err);
  process.exit(1);
});
