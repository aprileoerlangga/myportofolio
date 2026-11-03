const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');

async function snapNewAbout() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9594;
  const userDataDir = path.join(os.tmpdir(), 'chrome_cdp_about2_' + Date.now());

  const chrome = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--window-size=1440,1050',
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
    height: 1050,
    deviceScaleFactor: 1,
    mobile: false
  });

  console.log('Navigating directly to http://localhost:5174/about ...');
  await send('Page.navigate', { url: 'http://localhost:5174/about' });

  // Wait 7.5s for Lego loader curtain to completely clear
  console.log('Waiting 7.5s for loader intro to finish...');
  await new Promise(r => setTimeout(r, 7500));

  // Make sure at top
  await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 0);' });
  await new Promise(r => setTimeout(r, 500));

  // 1. Capture Top View (Scroll = 0)
  console.log('Capturing Top View...');
  const snap1 = await send('Page.captureScreenshot', { format: 'png' });
  const out1 = 'C:\\Users\\APRILEOERLANGGA\\.gemini\\antigravity\\brain\\b483387a-7d2c-424b-95f6-cfff3297c331\\about_top_view.png';
  fs.writeFileSync(out1, Buffer.from(snap1.result.data, 'base64'));
  console.log('Saved:', out1);

  // 2. Scroll slightly (scrollY = 280) to capture bricks falling mid-air!
  console.log('Scrolling down slightly (280px) to capture bricks tumbling/falling...');
  await send('Runtime.evaluate', { expression: 'window.scrollTo({ top: 280, behavior: "instant" });' });
  await new Promise(r => setTimeout(r, 600));

  const snap2 = await send('Page.captureScreenshot', { format: 'png' });
  const out2 = 'C:\\Users\\APRILEOERLANGGA\\.gemini\\antigravity\\brain\\b483387a-7d2c-424b-95f6-cfff3297c331\\about_falling_mid.png';
  fs.writeFileSync(out2, Buffer.from(snap2.result.data, 'base64'));
  console.log('Saved:', out2);

  // 3. Mobile View (390 x 844)
  console.log('Switching to mobile viewport (390 x 844)...');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await send('Runtime.evaluate', { expression: 'window.scrollTo({ top: 400, behavior: "instant" });' });
  await new Promise(r => setTimeout(r, 600));

  const snap3 = await send('Page.captureScreenshot', { format: 'png' });
  const out3 = 'C:\\Users\\APRILEOERLANGGA\\.gemini\\antigravity\\brain\\b483387a-7d2c-424b-95f6-cfff3297c331\\about_mobile_view.png';
  fs.writeFileSync(out3, Buffer.from(snap3.result.data, 'base64'));
  console.log('Saved:', out3);

  console.log('All screenshots captured successfully!');
  chrome.kill();
  process.exit(0);
}

snapNewAbout().catch(err => {
  console.error(err);
  process.exit(1);
});
