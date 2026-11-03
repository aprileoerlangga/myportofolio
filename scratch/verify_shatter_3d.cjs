const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');

async function runTest() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9550;
  const userDataDir = path.join(os.tmpdir(), 'chrome_cdp_v3b_' + Date.now());

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

  async function screenshot(name) {
    const res = await send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(res.result.data, 'base64');
    fs.writeFileSync(path.join(__dirname, name), buffer);
    console.log('Saved screenshot:', name);
  }

  console.log('Navigating to http://localhost:5174/ ...');
  await send('Page.navigate', { url: 'http://localhost:5174/' });

  // Wait for intro loader and walk-in wave to settle into idle
  console.log('Waiting for character to settle into idle (7.5s)...');
  await new Promise(r => setTimeout(r, 7500));

  // Click Discover More button
  console.log('Clicking Discover More button...');
  await send('Runtime.evaluate', {
    expression: `(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Discover More'));
      if (btn) btn.click();
    })()`
  });

  // 1. Capture brick covering screen just before shatter (~1100ms)
  await new Promise(r => setTimeout(r, 1100));
  await screenshot('v3_1_brick_approaching.png');

  // 2. Capture explosive 3D shatter of smaller Lego bricks (~250ms after impact)
  await new Promise(r => setTimeout(r, 250));
  await screenshot('v3_2_3d_shatter_burst.png');

  // 3. Wait for About page to fully mount and render 3D scene (~1200ms)
  console.log('Waiting for About page 3D scene to mount...');
  await new Promise(r => setTimeout(r, 1200));
  await screenshot('v3_3_about_3d_settled.png');

  // 4. Scroll down on About page to verify 3D parallax
  console.log('Scrolling down on About page...');
  await send('Runtime.evaluate', {
    expression: `window.scrollBy({ top: 500, behavior: 'instant' });`
  });
  await new Promise(r => setTimeout(r, 600));
  await screenshot('v3_4_about_3d_scrolled.png');

  chrome.kill();
  console.log('All tests finished successfully!');
}

runTest().catch(console.error);
