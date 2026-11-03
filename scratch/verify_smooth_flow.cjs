const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');

async function testSmoothFlow() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9560;
  const userDataDir = path.join(os.tmpdir(), 'chrome_cdp_smooth_' + Date.now());

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

  // 1. Capture overhead windup
  await new Promise(r => setTimeout(r, 550));
  await screenshot('smooth_1_windup.png');

  // 2. Capture brick zooming to camera and covering view
  await new Promise(r => setTimeout(r, 550));
  await screenshot('smooth_2_brick_covering.png');

  // 3. Capture 3D shatter explosion of smaller Lego bricks
  await new Promise(r => setTimeout(r, 200));
  await screenshot('smooth_3_3d_shatter.png');

  // 4. Capture About page settled with 3D stepped terrain and side floating bricks
  await new Promise(r => setTimeout(r, 900));
  await screenshot('smooth_4_about_settled.png');

  // 5. Scroll down to test 3D parallax
  console.log('Scrolling down on About page...');
  await send('Runtime.evaluate', {
    expression: `window.scrollBy({ top: 550, behavior: 'instant' });`
  });
  await new Promise(r => setTimeout(r, 500));
  await screenshot('smooth_5_about_scrolled.png');

  chrome.kill();
  console.log('All smoothness tests finished successfully!');
}

testSmoothFlow().catch(console.error);

