const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');

async function testFlowToAboutScatter() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9592;
  const userDataDir = path.join(os.tmpdir(), 'chrome_cdp_flw_' + Date.now());

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

  // Wait for throw animation and transition into /about to finish (1.8s)
  console.log('Waiting for throw transition into /about to complete (1.8s)...');
  await new Promise(r => setTimeout(r, 1800));

  await screenshot('scatter_v1_landed.png');

  // Scroll down 300px
  console.log('Scrolling down 300px...');
  await send('Runtime.evaluate', {
    expression: `window.scrollBy({ top: 300, behavior: 'instant' });`
  });
  await new Promise(r => setTimeout(r, 600));
  await screenshot('scatter_v2_mid.png');

  // Scroll down 300px more
  console.log('Scrolling down 300px more...');
  await send('Runtime.evaluate', {
    expression: `window.scrollBy({ top: 300, behavior: 'instant' });`
  });
  await new Promise(r => setTimeout(r, 600));
  await screenshot('scatter_v3_bottom.png');

  chrome.kill();
  console.log('Finished!');
}

testFlowToAboutScatter().catch(console.error);

