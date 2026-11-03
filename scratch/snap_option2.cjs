const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');

async function snapOption2() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9599;
  const userDataDir = path.join(os.tmpdir(), 'chrome_cdp_opt2_' + Date.now());

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

  await screenshot('option2_about_top.png');

  // Scroll down 400px
  console.log('Scrolling down 400px...');
  await send('Runtime.evaluate', {
    expression: `window.scrollBy({ top: 400, behavior: 'instant' });`
  });
  await new Promise(r => setTimeout(r, 600));
  await screenshot('option2_about_mid.png');

  // Scroll down 300px more to bottom
  console.log('Scrolling down to bottom...');
  await send('Runtime.evaluate', {
    expression: `window.scrollBy({ top: 300, behavior: 'instant' });`
  });
  await new Promise(r => setTimeout(r, 600));
  await screenshot('option2_about_bottom.png');

  chrome.kill();
  console.log('Option 2 captures finished successfully!');
}

snapOption2().catch(console.error);

