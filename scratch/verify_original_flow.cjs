const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');

async function main() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9978;
  const userDataDir = path.join(os.tmpdir(), 'chrome_orig_flow_' + Date.now());

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

  // Wait for curtain to dismiss
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

  // Step 1: Top of About (scrollY = 0)
  let snap = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${artifactDir}\\orig_restore_step1_top.png`, Buffer.from(snap.data || snap.result.data, 'base64'));
  console.log('Saved orig_restore_step1_top.png');

  // Step 2: Scrolling down towards quotes (scrollY = 350) - quotes starting to emerge and converge from left/right
  await send('Runtime.evaluate', { expression: `window.scrollTo({ top: 350, behavior: 'instant' });` });
  await new Promise(r => setTimeout(r, 600));
  snap = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${artifactDir}\\orig_restore_step2_350px.png`, Buffer.from(snap.data || snap.result.data, 'base64'));
  console.log('Saved orig_restore_step2_350px.png');

  // Step 3: Quotes in view (scrollY = 600) - quotes converging smoothly
  await send('Runtime.evaluate', { expression: `window.scrollTo({ top: 600, behavior: 'instant' });` });
  await new Promise(r => setTimeout(r, 600));
  snap = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${artifactDir}\\orig_restore_step3_600px.png`, Buffer.from(snap.data || snap.result.data, 'base64'));
  console.log('Saved orig_restore_step3_600px.png');

  // Step 4: Quotes fully centered (scrollY = 750) - fully aligned, illuminated, with interactive carousel pill
  await send('Runtime.evaluate', { expression: `window.scrollTo({ top: 750, behavior: 'instant' });` });
  await new Promise(r => setTimeout(r, 600));
  snap = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${artifactDir}\\orig_restore_step4_750px.png`, Buffer.from(snap.data || snap.result.data, 'base64'));
  console.log('Saved orig_restore_step4_750px.png');

  ws.close();
  chrome.kill();
  process.exit(0);
}

main().catch(console.error);

