const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');

async function runPreciseTest() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9570;
  const userDataDir = path.join(os.tmpdir(), 'chrome_cdp_p_' + Date.now());

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

  console.log('Waiting for intro loader and Discover More button...');
  for (let i = 0; i < 40; i++) {
    const res = await send('Runtime.evaluate', {
      expression: `(() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Discover More'));
        return !!btn && btn.offsetParent !== null;
      })()`,
      returnByValue: true
    });
    if (res.result.value) {
      console.log('Button found on screen at i =', i);
      break;
    }
    await new Promise(r => setTimeout(r, 400));
  }

  // Wait for character to settle into idle on stand
  await new Promise(r => setTimeout(r, 3500));
  await screenshot('flow_1_idle.png');

  // Click Discover More
  console.log('Clicking Discover More button...');
  await send('Runtime.evaluate', {
    expression: `(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Discover More'));
      if (btn) btn.click();
    })()`
  });

  // 1. Capture overhead windup
  await new Promise(r => setTimeout(r, 600));
  await screenshot('flow_2_windup.png');

  // 2. Capture brick closing in on camera
  await new Promise(r => setTimeout(r, 550));
  await screenshot('flow_3_brick_covering.png');

  // 3. Capture 3D shatter explosion of smaller Lego bricks
  await new Promise(r => setTimeout(r, 200));
  await screenshot('flow_4_3d_shatter.png');

  // 4. Capture smooth landing on About page with 3D stepped terrain
  await new Promise(r => setTimeout(r, 1000));
  await screenshot('flow_5_about_settled.png');

  // 5. Scroll down to test 3D parallax
  console.log('Scrolling down on About page...');
  await send('Runtime.evaluate', {
    expression: `window.scrollBy({ top: 550, behavior: 'instant' });`
  });
  await new Promise(r => setTimeout(r, 600));
  await screenshot('flow_6_about_scrolled.png');

  chrome.kill();
  console.log('Precise flow test finished successfully!');
}

runPreciseTest().catch(console.error);

