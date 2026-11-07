const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');

const ARTIFACT_DIR = 'C:\\Users\\APRILEOERLANGGA\\.gemini\\antigravity\\brain\\b483387a-7d2c-424b-95f6-cfff3297c331';

async function captureViewport(width, height, isMobile = false) {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9880 + Math.floor(Math.random() * 50);
  const userDataDir = path.join(os.tmpdir(), 'chrome_live_sets_' + Date.now() + '_' + Math.random().toString(36).slice(2));

  const chrome = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--window-size=${width},${height}`,
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
      const curId = id++;
      pending.set(curId, res);
      ws.send(JSON.stringify({ id: curId, method, params }));
    });
  }

  await new Promise(r => ws.onopen = r);
  await send('Page.enable');
  await send('Page.navigate', { url: 'http://localhost:5174/projects' });

  // Wait for loader to complete and main content to be visible
  for (let i = 0; i < 40; i++) {
    const res = await send('Runtime.evaluate', {
      expression: '!!document.getElementById("projects") && window.getComputedStyle(document.querySelector("div.font-sans")).opacity === "1"'
    });
    if (res.result && res.result.value) break;
    await new Promise(r => setTimeout(r, 250));
  }
  await new Promise(r => setTimeout(r, 600));

  async function takeSnap(name) {
    const snap = await send('Page.captureScreenshot', { format: 'png' });
    const buf = Buffer.from(snap.result.data, 'base64');
    fs.writeFileSync(path.join(ARTIFACT_DIR, name), buf);
    console.log('Saved', name, 'size:', buf.length);
  }

  const prefix = isMobile ? 'sets_mob_' : 'sets_desk_';

  // 1. Scroll 0% (Hero Entry with first boxes)
  await takeSnap(`${prefix}1_entry.png`);

  // 2. Scroll 25% (First and Second box gliding)
  await send('Runtime.evaluate', { 
    expression: 'window.scrollTo({ top: document.body.scrollHeight * 0.25, behavior: "instant" })' 
  });
  await new Promise(r => setTimeout(r, 900));
  await takeSnap(`${prefix}2_glide_25.png`);

  // 3. Scroll 55% (Middle boxes in full view)
  await send('Runtime.evaluate', { 
    expression: 'window.scrollTo({ top: document.body.scrollHeight * 0.55, behavior: "instant" })' 
  });
  await new Promise(r => setTimeout(r, 900));
  await takeSnap(`${prefix}3_glide_55.png`);

  // 4. Scroll 85% (Final boxes)
  await send('Runtime.evaluate', { 
    expression: 'window.scrollTo({ top: document.body.scrollHeight * 0.85, behavior: "instant" })' 
  });
  await new Promise(r => setTimeout(r, 900));
  await takeSnap(`${prefix}4_glide_85.png`);

  // 5. Scroll 100% (Docked at Footer)
  await send('Runtime.evaluate', { 
    expression: 'window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" })' 
  });
  await new Promise(r => setTimeout(r, 900));
  await takeSnap(`${prefix}5_footer.png`);

  chrome.kill();
}

async function main() {
  console.log('Capturing Desktop 1440x900 sets showcase...');
  await captureViewport(1440, 900, false);
  console.log('Capturing Mobile 390x844 sets showcase...');
  await captureViewport(390, 844, true);
  console.log('All snapshots complete!');
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

