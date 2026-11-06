const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function main() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = 'C:\\Users\\APRILEOERLANGGA\\.gemini\\antigravity\\brain\\b483387a-7d2c-424b-95f6-cfff3297c331\\scratch\\chrome-user-quotes';
  
  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9268',
    `--user-data-dir=${userDataDir}`,
    '--window-size=1400,900',
    '--hide-scrollbars',
    '--disable-gpu'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  function getTargets() {
    return new Promise((resolve, reject) => {
      http.get('http://127.0.0.1:9268/json/list', res => {
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
  
  console.log('Waiting for curtain loader to dismiss...');
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 600));
    const check = await send('Runtime.evaluate', {
      expression: `(() => {
        const curtain = Array.from(document.querySelectorAll('div')).find(d => d.className && typeof d.className === 'string' && d.className.includes('99999'));
        return !curtain && document.querySelectorAll('.keycap-btn').length > 0;
      })()`,
      returnByValue: true
    });
    const val = check?.result?.value ?? check?.result?.result?.value;
    console.log(`Poll ${i + 1}: ready = ${val}`);
    if (val === true) break;
  }
  await new Promise(r => setTimeout(r, 1200));

  const artifactDir = 'C:\\Users\\APRILEOERLANGGA\\.gemini\\antigravity\\brain\\b483387a-7d2c-424b-95f6-cfff3297c331';

  // Scroll to quotes section
  await send('Runtime.evaluate', {
    expression: `
      const el = document.getElementById('quotes-section');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
    `
  });
  await new Promise(r => setTimeout(r, 1200));

  // 1. Capture Quote 1
  let snap = await send('Page.captureScreenshot', { format: 'png' });
  let b64 = snap.data || snap.result?.data;
  fs.writeFileSync(`${artifactDir}\\quotes_v2_quote1.png`, Buffer.from(b64, 'base64'));
  console.log('Saved quotes_v2_quote1.png');

  // 2. Click Next Button
  await send('Runtime.evaluate', {
    expression: `
      const nextBtn = document.querySelector('button[aria-label="Next Quote"]');
      if (nextBtn) nextBtn.click();
    `
  });
  await new Promise(r => setTimeout(r, 1000));

  snap = await send('Page.captureScreenshot', { format: 'png' });
  b64 = snap.data || snap.result?.data;
  fs.writeFileSync(`${artifactDir}\\quotes_v2_quote2.png`, Buffer.from(b64, 'base64'));
  console.log('Saved quotes_v2_quote2.png');

  chromeProc.kill();
  console.log('Quotes verification complete!');
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
