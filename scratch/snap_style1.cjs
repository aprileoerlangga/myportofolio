const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');

async function snapStyle1() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9595;
  const userDataDir = path.join(os.tmpdir(), 'chrome_cdp_style1_' + Date.now());

  const chrome = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--window-size=1440,900',
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
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  console.log('Navigating to http://localhost:5174/ ...');
  await send('Page.navigate', { url: 'http://localhost:5174/' });

  console.log('Waiting for idle (8.5s)...');
  await new Promise(r => setTimeout(r, 8500));

  // Click Discover More
  console.log('Clicking Discover More button...');
  await send('Runtime.evaluate', {
    expression: `(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Discover More'));
      if (btn) btn.click();
    })()`
  });

  // Wait 2500ms for full settle
  console.log('Waiting 2500ms for full settle on /about ...');
  await new Promise(r => setTimeout(r, 2500));

  async function screenshot(name) {
    const res = await send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(res.result.data, 'base64');
    const targetPath = path.join('C:\\Users\\APRILEOERLANGGA\\.gemini\\antigravity\\brain\\b483387a-7d2c-424b-95f6-cfff3297c331', name);
    fs.writeFileSync(targetPath, buffer);
    console.log('Saved screenshot:', targetPath);
  }

  // 1. Top Hero: New Lego Brick Frame, UCS Plaque, Pixel Title, Builder Dossier, tactile Resume button
  await screenshot('style1_about_top.png');

  // 2. Scroll to Skills & Technologies
  console.log('Scrolling down to Skills & Technologies (500px)...');
  await send('Runtime.evaluate', {
    expression: `window.scrollBy({ top: 500, behavior: 'instant' });`
  });
  await new Promise(r => setTimeout(r, 800));
  await screenshot('style1_about_skills.png');

  chrome.kill();
  console.log('Style 1 captures completed successfully!');
}

snapStyle1().catch(console.error);

