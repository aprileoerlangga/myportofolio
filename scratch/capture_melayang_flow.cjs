const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');

async function main() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9934;
  const userDataDir = path.join(os.tmpdir(), 'chrome_mela_' + Date.now());

  const chrome = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--window-size=1440,950',
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

  // Wait for loading screen curtain to dismiss completely
  for (let i = 0; i < 40; i++) {
    const check = await send('Runtime.evaluate', {
      expression: `(() => !document.querySelector('.z-\\[99999\\]'))()`,
      returnByValue: true
    });
    if (check?.result?.value) {
      break;
    }
    await new Promise(r => setTimeout(r, 400));
  }
  await new Promise(r => setTimeout(r, 1200));

  const artifactDir = 'C:\\Users\\APRILEOERLANGGA\\.gemini\\antigravity\\brain\\b483387a-7d2c-424b-95f6-cfff3297c331';

  // Test 1: Just arriving at quotes section (scroll 730px - sticky locked, scrollYProgress = 0.00)
  await send('Runtime.evaluate', { expression: `window.scrollTo({ top: 730, behavior: 'instant' });` });
  await new Promise(r => setTimeout(r, 600));
  let snap = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${artifactDir}\\melayang_1_at_730px.png`, Buffer.from(snap.data || snap.result.data, 'base64'));
  console.log('Saved melayang_1_at_730px.png');

  // Test 2: Gentle scroll into section (scroll 810px, ~30px into sticky track) - words floating up softly
  await send('Runtime.evaluate', { expression: `window.scrollTo({ top: 810, behavior: 'instant' });` });
  await new Promise(r => setTimeout(r, 600));
  snap = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${artifactDir}\\melayang_2_at_810px.png`, Buffer.from(snap.data || snap.result.data, 'base64'));
  console.log('Saved melayang_2_at_810px.png');

  // Test 2b: Mid-float emergence (scroll 860px)
  await send('Runtime.evaluate', { expression: `window.scrollTo({ top: 860, behavior: 'instant' });` });
  await new Promise(r => setTimeout(r, 600));
  snap = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${artifactDir}\\melayang_2b_at_860px.png`, Buffer.from(snap.data || snap.result.data, 'base64'));
  console.log('Saved melayang_2b_at_860px.png');
  await send('Runtime.evaluate', { expression: `window.scrollTo({ top: 930, behavior: 'instant' });` });
  await new Promise(r => setTimeout(r, 600));
  snap = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${artifactDir}\\melayang_3_at_930px.png`, Buffer.from(snap.data || snap.result.data, 'base64'));
  console.log('Saved melayang_3_at_930px.png');

  // Test 4: Scrolling to Quote 2 (scroll 1500px, Simplicity floating)
  await send('Runtime.evaluate', { expression: `window.scrollTo({ top: 1500, behavior: 'instant' });` });
  await new Promise(r => setTimeout(r, 600));
  snap = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${artifactDir}\\melayang_4_at_1500px.png`, Buffer.from(snap.data || snap.result.data, 'base64'));
  console.log('Saved melayang_4_at_1500px.png');

  // Test 5: Scrolling to Quote 3 (scroll 2200px, Master Builder floating)
  await send('Runtime.evaluate', { expression: `window.scrollTo({ top: 2200, behavior: 'instant' });` });
  await new Promise(r => setTimeout(r, 600));
  snap = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${artifactDir}\\melayang_5_at_2200px.png`, Buffer.from(snap.data || snap.result.data, 'base64'));
  console.log('Saved melayang_5_at_2200px.png');

  ws.close();
  chrome.kill();
  process.exit(0);
}

main().catch(console.error);
