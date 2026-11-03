const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');

async function snapScrollStages() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9987;
  const userDataDir = path.join(os.tmpdir(), 'chrome_kb_scroll_' + Date.now());

  const chrome = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--window-size=1440,900',
    '--disable-gpu',
    `--user-data-dir=${userDataDir}`
  ]);

  let ver;
  for (let i = 0; i < 30; i++) {
    try {
      ver = await new Promise((res, rej) => {
        const req = http.get(`http://127.0.0.1:${port}/json/version`, r => {
          let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
        });
        req.on('error', rej);
        req.setTimeout(500, () => req.destroy());
      });
      if (ver) break;
    } catch {
      await new Promise(r => setTimeout(r, 200));
    }
  }

  const targets = await new Promise((res, rej) => {
    http.get(`http://127.0.0.1:${port}/json/list`, r => {
      let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
    }).on('error', rej);
  });
  const pageTarget = targets.find(t => t.type === 'page') || targets[0];

  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  let id = 1;
  const pending = new Map();
  ws.onmessage = e => {
    const msg = JSON.parse(e.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
    }
  };
  function send(method, params = {}) {
    return new Promise(res => {
      const msgId = id++;
      pending.set(msgId, res);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  await new Promise(r => ws.onopen = r);
  await send('Page.enable');
  await send('Runtime.enable');

  await send('Page.navigate', { url: 'http://localhost:5174/about' });
  
  // Wait 3.5s for page to load & loader to complete
  console.log('Waiting for curtain loader animation...');
  await new Promise(r => setTimeout(r, 3500));

  for (let i = 0; i < 60; i++) {
    const check = await send('Runtime.evaluate', {
      expression: `(() => !document.querySelector('.z-\\[99999\\]'))()`,
      returnByValue: true
    });
    if (check.result && check.result.value) {
      console.log('Loader confirmed dismissed!');
      break;
    }
    await new Promise(r => setTimeout(r, 250));
  }
  await new Promise(r => setTimeout(r, 1000));

  // Stage 1: Looking at quotes (initial small rotated keyboard emerging below)
  console.log('Scroll to Stage 1 (Quotes top = 550)...');
  await send('Runtime.evaluate', { expression: `window.scrollTo({ top: 550, behavior: 'instant' });` });
  await new Promise(r => setTimeout(r, 1000));
  let res = await send('Page.captureScreenshot', { format: 'png' });
  let buffer = Buffer.from(res.result.data, 'base64');
  fs.writeFileSync(path.join('C:\\Users\\APRILEOERLANGGA\\.gemini\\antigravity\\brain\\b483387a-7d2c-424b-95f6-cfff3297c331', 'kb_stage1_quotes.png'), buffer);

  // Stage 2: Mid-scroll (keyboard spinning and expanding)
  console.log('Scroll to Stage 2 (Mid-scroll = 900)...');
  await send('Runtime.evaluate', { expression: `window.scrollTo({ top: 900, behavior: 'instant' });` });
  await new Promise(r => setTimeout(r, 1000));
  res = await send('Page.captureScreenshot', { format: 'png' });
  buffer = Buffer.from(res.result.data, 'base64');
  fs.writeFileSync(path.join('C:\\Users\\APRILEOERLANGGA\\.gemini\\antigravity\\brain\\b483387a-7d2c-424b-95f6-cfff3297c331', 'kb_stage2_spinning.png'), buffer);

  // Stage 3: Settled in Skills
  console.log('Scroll to Stage 3 (Skills docked = 1350)...');
  await send('Runtime.evaluate', { expression: `window.scrollTo({ top: 1350, behavior: 'instant' });` });
  await new Promise(r => setTimeout(r, 1000));
  res = await send('Page.captureScreenshot', { format: 'png' });
  buffer = Buffer.from(res.result.data, 'base64');
  fs.writeFileSync(path.join('C:\\Users\\APRILEOERLANGGA\\.gemini\\antigravity\\brain\\b483387a-7d2c-424b-95f6-cfff3297c331', 'kb_stage3_docked.png'), buffer);

  console.log('All 3 stages captured successfully!');
  ws.close();
  chrome.kill();
  process.exit(0);
}

snapScrollStages().catch(console.error);
