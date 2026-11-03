const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');

async function runTest() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9520;
  const userDataDir = path.join(os.tmpdir(), 'chrome_cdp_' + Date.now());

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
  await screenshot('v2_1_idle_settled.png');

  // Click Discover More button
  console.log('Clicking Discover More button...');
  await send('Runtime.evaluate', {
    expression: `(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Discover More'));
      if (btn) btn.click();
    })()`
  });

  // Capture overhead wind-up with brick held inside C-claw
  await new Promise(r => setTimeout(r, 550));
  await screenshot('v2_2_overhead_windup.png');

  // Capture power stride pitch & release
  await new Promise(r => setTimeout(r, 350));
  await screenshot('v2_3_forward_pitch.png');

  // Capture impact (transparent shatter, NO red wall)
  await new Promise(r => setTimeout(r, 380));
  await screenshot('v2_4_shatter_impact.png');

  // Wait for /about landing
  await new Promise(r => setTimeout(r, 650));
  await screenshot('v2_5_about_landed.png');

  // Scroll down to test stepped terrain at bottom
  console.log('Scrolling down on About page...');
  await send('Runtime.evaluate', {
    expression: `window.scrollBy({ top: 500, behavior: 'instant' });`
  });
  await new Promise(r => setTimeout(r, 600));
  await screenshot('v2_6_about_scrolled.png');

  chrome.kill();
  console.log('Test finished successfully!');
}

runTest().catch(console.error);

