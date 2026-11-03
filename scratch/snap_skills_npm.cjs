const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');

async function snapSkillsNpm() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9594;
  const userDataDir = path.join(os.tmpdir(), 'chrome_cdp_skills5_' + Date.now());

  const chrome = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--window-size=1440,1100',
    '--disable-gpu',
    `--user-data-dir=${userDataDir}`
  ]);

  await new Promise(r => setTimeout(r, 1500));

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

  console.log('Navigating to http://localhost:5174/about ...');
  await send('Page.navigate', { url: 'http://localhost:5174/about' });

  console.log('Waiting 5.5s for intro to finish...');
  await new Promise(r => setTimeout(r, 5500));

  await send('Runtime.evaluate', {
    expression: `(() => {
      const el = document.getElementById('skills-section');
      if (el) {
        el.scrollIntoView({ behavior: 'instant', block: 'start' });
        window.scrollBy(0, -50);
      }
    })()`
  });

  await new Promise(r => setTimeout(r, 1000));

  // Press 'p' to activate npm
  console.log('Pressing P key for npm...');
  await send('Runtime.evaluate', {
    expression: `
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'p', bubbles: true }));
    `
  });
  await new Promise(r => setTimeout(r, 600));

  const snap = await send('Page.captureScreenshot', { format: 'png' });
  const out = 'C:\\Users\\APRILEOERLANGGA\\.gemini\\antigravity\\brain\\b483387a-7d2c-424b-95f6-cfff3297c331\\skills_keyboard_npm.png';
  fs.writeFileSync(out, Buffer.from(snap.result.data, 'base64'));
  console.log('Saved:', out);

  ws.close();
  chrome.kill();
  console.log('Done capturing npm screenshot!');
}

snapSkillsNpm().catch(console.error);

