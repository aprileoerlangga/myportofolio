const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function main() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = 'C:\\Users\\APRILEOERLANGGA\\.gemini\\antigravity\\brain\\b483387a-7d2c-424b-95f6-cfff3297c331\\scratch\\chrome-user-snap-v2';
  
  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9262',
    `--user-data-dir=${userDataDir}`,
    '--window-size=1440,900',
    '--hide-scrollbars',
    '--disable-gpu'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  function getTargets() {
    return new Promise((resolve, reject) => {
      http.get('http://127.0.0.1:9262/json/list', res => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(JSON.parse(data)));
      }).on('error', reject);
    });
  }

  let targets = await getTargets();
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
  await send('Page.navigate', { url: 'http://localhost:5175/about' });
  
  console.log('Waiting for curtain to dismiss...');
  for (let i = 0; i < 40; i++) {
    const check = await send('Runtime.evaluate', {
      expression: `(() => document.querySelectorAll('.keycap-btn').length > 0 && !document.querySelector('.z-\\[99999\\]'))()`,
      returnByValue: true
    });
    const val = check?.result?.value ?? check?.result?.result?.value;
    if (val) {
      console.log(`Ready at iteration ${i + 1}!`);
      break;
    }
    await new Promise(r => setTimeout(r, 400));
  }
  await new Promise(r => setTimeout(r, 1000));

  const artifactDir = 'C:\\Users\\APRILEOERLANGGA\\.gemini\\antigravity\\brain\\b483387a-7d2c-424b-95f6-cfff3297c331';

  // Scroll to skills-section
  await send('Runtime.evaluate', {
    expression: `
      const sec = document.getElementById('skills-section');
      if (sec) sec.scrollIntoView({ behavior: 'instant', block: 'center' });
      else window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' });
    `
  });
  await new Promise(r => setTimeout(r, 1200));

  let snap = await send('Page.captureScreenshot', { format: 'png' });
  let b64 = snap.data || snap.result?.data;
  fs.writeFileSync(`${artifactDir}\\skills_shifted_right_react.png`, Buffer.from(b64, 'base64'));
  console.log('Saved skills_shifted_right_react.png');

  // Click Docker key
  await send('Runtime.evaluate', {
    expression: `
      const btn = document.querySelector('[data-skill-id="docker"]');
      if (btn) btn.click();
    `
  });
  await new Promise(r => setTimeout(r, 500));

  snap = await send('Page.captureScreenshot', { format: 'png' });
  b64 = snap.data || snap.result?.data;
  fs.writeFileSync(`${artifactDir}\\skills_shifted_right_docker.png`, Buffer.from(b64, 'base64'));
  console.log('Saved skills_shifted_right_docker.png');

  chromeProc.kill();
  process.exit(0);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
