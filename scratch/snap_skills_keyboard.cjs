const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');

async function snapSkillsKeyboard() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9599;
  const userDataDir = path.join(os.tmpdir(), 'chrome_cdp_skills2_' + Date.now());

  const chrome = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--window-size=1440,1100',
    '--disable-gpu',
    '--disable-background-timer-throttling',
    '--disable-backgrounding-occluded-windows',
    '--disable-renderer-backgrounding',
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

  const activePort = 5174;
  console.log('Using active Vite port:', activePort);

  // 1. DESKTOP VIEWPORT
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 1100,
    deviceScaleFactor: 1,
    mobile: false
  });

  await send('Page.navigate', { url: `http://localhost:${activePort}/about` });

  // Wait for loader to fully finish (~4.2s)
  console.log('Waiting for loader to finish...');
  await new Promise(r => setTimeout(r, 4800));

  // Find the skills keyboard element and scroll it into view
  const scrollResult = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const h2 = Array.from(document.querySelectorAll('h2')).find(el => el.textContent.includes('SKILLS'));
        if (h2) {
          h2.scrollIntoView({ behavior: 'instant', block: 'start' });
          window.scrollBy(0, -60);
          return { found: true, top: h2.getBoundingClientRect().top };
        }
        window.scrollTo({ top: 1100, behavior: 'instant' });
        return { found: false };
      })()
    `,
    returnByValue: true
  });
  console.log('Scroll result:', scrollResult.result.value);

  await new Promise(r => setTimeout(r, 1200));

  // Snap 1: Desktop Skills Keyboard Initial (Default React or TS selected)
  const snap1 = await send('Page.captureScreenshot', { format: 'png' });
  const out1 = 'C:\\Users\\APRILEOERLANGGA\\.gemini\\antigravity\\brain\\b483387a-7d2c-424b-95f6-cfff3297c331\\skills_keyboard_desktop.png';
  fs.writeFileSync(out1, Buffer.from(snap1.result.data, 'base64'));
  console.log('Saved:', out1);

  // Trigger Prettier key by dispatching keydown event on window ('p')
  await send('Runtime.evaluate', {
    expression: `
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'p', bubbles: true }));
    `
  });
  await new Promise(r => setTimeout(r, 500));

  // Snap 2: Desktop with Prettier selected (Matching reference photo "ttier" / "making your code not a whole mess")
  const snap2 = await send('Page.captureScreenshot', { format: 'png' });
  const out2 = 'C:\\Users\\APRILEOERLANGGA\\.gemini\\antigravity\\brain\\b483387a-7d2c-424b-95f6-cfff3297c331\\skills_keyboard_prettier.png';
  fs.writeFileSync(out2, Buffer.from(snap2.result.data, 'base64'));
  console.log('Saved:', out2);

  // 2. MOBILE VIEWPORT (iPhone 14 Pro: 393 x 852)
  await send('Emulation.setDeviceMetricsOverride', {
    width: 393,
    height: 852,
    deviceScaleFactor: 2,
    mobile: true
  });
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const h2 = Array.from(document.querySelectorAll('h2')).find(el => el.textContent.includes('SKILLS'));
        if (h2) {
          h2.scrollIntoView({ behavior: 'instant', block: 'start' });
          window.scrollBy(0, -30);
        }
      })()
    `
  });
  await new Promise(r => setTimeout(r, 1200));

  const snapMobile = await send('Page.captureScreenshot', { format: 'png' });
  const outMobile = 'C:\\Users\\APRILEOERLANGGA\\.gemini\\antigravity\\brain\\b483387a-7d2c-424b-95f6-cfff3297c331\\skills_keyboard_mobile.png';
  fs.writeFileSync(outMobile, Buffer.from(snapMobile.result.data, 'base64'));
  console.log('Saved:', outMobile);

  ws.close();
  chrome.kill();
  console.log('Done capturing screenshots!');
}

snapSkillsKeyboard().catch(console.error);
