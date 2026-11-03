const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');

async function snapSkillsKeyboard2() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9592;
  const userDataDir = path.join(os.tmpdir(), 'chrome_cdp_skills4_' + Date.now());

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

  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 1100,
    deviceScaleFactor: 1,
    mobile: false
  });

  console.log('Navigating directly to http://localhost:5174/about ...');
  await send('Page.navigate', { url: 'http://localhost:5174/about' });

  // Wait 5.5s for Lego loader to completely complete and page to reveal
  console.log('Waiting 5.5s for intro to finish...');
  await new Promise(r => setTimeout(r, 5500));

  // Find the skills section
  const scrollEval = await send('Runtime.evaluate', {
    expression: `(() => {
      const el = document.getElementById('skills-section') || Array.from(document.querySelectorAll('h2')).find(e => e.textContent.includes('SKILLS'));
      if (el) {
        el.scrollIntoView({ behavior: 'instant', block: 'start' });
        window.scrollBy(0, -50);
        return { success: true, text: el.textContent };
      }
      return { success: false };
    })()`,
    returnByValue: true
  });
  console.log('Scroll evaluation:', scrollEval.result.value);

  await new Promise(r => setTimeout(r, 1200));

  // Snap 1: Desktop Initial (Prettier default)
  const snap1 = await send('Page.captureScreenshot', { format: 'png' });
  const out1 = 'C:\\Users\\APRILEOERLANGGA\\.gemini\\antigravity\\brain\\b483387a-7d2c-424b-95f6-cfff3297c331\\skills_keyboard_desktop.png';
  fs.writeFileSync(out1, Buffer.from(snap1.result.data, 'base64'));
  console.log('Saved:', out1);

  // Press 'r' to switch to React
  console.log('Pressing R key for React...');
  await send('Runtime.evaluate', {
    expression: `
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'r', bubbles: true }));
    `
  });
  await new Promise(r => setTimeout(r, 600));

  // Snap 2: Desktop React View
  const snap2 = await send('Page.captureScreenshot', { format: 'png' });
  const out2 = 'C:\\Users\\APRILEOERLANGGA\\.gemini\\antigravity\\brain\\b483387a-7d2c-424b-95f6-cfff3297c331\\skills_keyboard_react.png';
  fs.writeFileSync(out2, Buffer.from(snap2.result.data, 'base64'));
  console.log('Saved:', out2);

  // 2. Mobile View
  console.log('Switching to mobile viewport...');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 393,
    height: 852,
    deviceScaleFactor: 2,
    mobile: true
  });
  await send('Runtime.evaluate', {
    expression: `(() => {
      const el = document.getElementById('skills-section');
      if (el) {
        el.scrollIntoView({ behavior: 'instant', block: 'start' });
        window.scrollBy(0, -20);
      }
    })()`
  });
  await new Promise(r => setTimeout(r, 1200));

  const snapMobile = await send('Page.captureScreenshot', { format: 'png' });
  const outMobile = 'C:\\Users\\APRILEOERLANGGA\\.gemini\\antigravity\\brain\\b483387a-7d2c-424b-95f6-cfff3297c331\\skills_keyboard_mobile.png';
  fs.writeFileSync(outMobile, Buffer.from(snapMobile.result.data, 'base64'));
  console.log('Saved:', outMobile);

  ws.close();
  chrome.kill();
  console.log('All screenshots captured successfully!');
}

snapSkillsKeyboard2().catch(console.error);
