const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');

async function snapBrandLogos() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9991;
  const userDataDir = path.join(os.tmpdir(), 'chrome_brand_perfect_' + Date.now());

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

  const targets = await new Promise(res => {
    http.get(`http://127.0.0.1:${port}/json/list`, r => {
      let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
    });
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

  const send = (method, params = {}) => new Promise(res => {
    const msgId = id++;
    pending.set(msgId, res);
    ws.send(JSON.stringify({ id: msgId, method, params }));
  });

  await new Promise(r => {
    if (ws.readyState === 1) r();
    else ws.onopen = r;
  });

  await send('Page.enable');
  await send('Runtime.enable');

  await send('Page.navigate', { url: 'http://localhost:5174/about' });
  // Wait 6 seconds for airplane animation to complete
  await new Promise(r => setTimeout(r, 6500));

  // Find exact position of skills section and scroll to center it
  await send('Runtime.evaluate', {
    expression: `(() => {
      const el = document.getElementById('skills-section');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
    })()`
  });

  await new Promise(r => setTimeout(r, 1200));

  const artifactDir = 'C:\\Users\\APRILEOERLANGGA\\.gemini\\antigravity\\brain\\b483387a-7d2c-424b-95f6-cfff3297c331';

  // 1. Live Docked (React active by default)
  let res = await send('Page.captureScreenshot', { format: 'png' });
  let buffer = Buffer.from(res.result.data, 'base64');
  fs.writeFileSync(path.join(artifactDir, 'verify_perfect_logos_docked.png'), buffer);
  console.log('Saved verify_perfect_logos_docked.png');

  // 2. Click CSS3 to verify BLUE keycap
  await send('Runtime.evaluate', {
    expression: `(() => {
      const btn = document.querySelector('button[title*="CSS3"]');
      if (btn) btn.click();
    })()`
  });
  await new Promise(r => setTimeout(r, 600));

  res = await send('Page.captureScreenshot', { format: 'png' });
  buffer = Buffer.from(res.result.data, 'base64');
  fs.writeFileSync(path.join(artifactDir, 'verify_css3_blue.png'), buffer);
  console.log('Saved verify_css3_blue.png');

  // 3. Click Java to verify BLACK keycap
  await send('Runtime.evaluate', {
    expression: `(() => {
      const btn = document.querySelector('button[title*="Java"]');
      if (btn) btn.click();
    })()`
  });
  await new Promise(r => setTimeout(r, 600));

  res = await send('Page.captureScreenshot', { format: 'png' });
  buffer = Buffer.from(res.result.data, 'base64');
  fs.writeFileSync(path.join(artifactDir, 'verify_java_black.png'), buffer);
  console.log('Saved verify_java_black.png');

  ws.close();
  chrome.kill();
  process.exit(0);
}

snapBrandLogos().catch(err => {
  console.error(err);
  process.exit(1);
});
