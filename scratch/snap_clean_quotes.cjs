const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');

async function snapQuotes() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9993;
  const userDataDir = path.join(os.tmpdir(), 'chrome_quotes_clean_' + Date.now());

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

  console.log('Navigating to http://localhost:5174/about ...');
  await send('Page.navigate', { url: 'http://localhost:5174/about' });
  
  // Wait until the curtain loader is completely gone from DOM
  console.log('Waiting for curtain loader to exit...');
  for (let i = 0; i < 60; i++) {
    const check = await send('Runtime.evaluate', {
      expression: `(() => {
        const loader = document.querySelector('.z-\\[99999\\]');
        return !loader;
      })()`
    });
    if (check.result.value) {
      console.log('Loader fully dismissed!');
      break;
    }
    await new Promise(r => setTimeout(r, 250));
  }
  await new Promise(r => setTimeout(r, 1200));

  // Scroll to quotes
  console.log('Scrolling to quotes...');
  await send('Runtime.evaluate', { expression: 'window.scrollTo({ top: 580, behavior: "instant" });' });
  await new Promise(r => setTimeout(r, 800));

  console.log('Taking screenshot of clean quotes...');
  const res = await send('Page.captureScreenshot', { format: 'png' });
  const buffer = Buffer.from(res.result.data, 'base64');
  const targetPath = path.join('C:\\Users\\APRILEOERLANGGA\\.gemini\\antigravity\\brain\\b483387a-7d2c-424b-95f6-cfff3297c331', 'clean_quotes_view.png');
  fs.writeFileSync(targetPath, buffer);
  console.log('Saved screenshot:', targetPath);

  ws.close();
  chrome.kill();
}

snapQuotes().catch(console.error);
