const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');

async function snapDepth() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9986;
  const userDataDir = path.join(os.tmpdir(), 'chrome_snap_depth_' + Date.now());

  const chrome = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--window-size=1400,900',
    '--disable-gpu',
    `--user-data-dir=${userDataDir}`
  ]);

  for (let i = 0; i < 30; i++) {
    try {
      const ver = await new Promise((res, rej) => {
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

  const targets = await new Promise(res => {
    http.get(`http://127.0.0.1:${port}/json/list`, r => {
      let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
    });
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

  // File url
  const filePath = path.resolve('scratch/test_hybrid.html');
  const fileUrl = 'file:///' + filePath.replace(/\\/g, '/');
  console.log('Navigating to', fileUrl);
  await send('Page.navigate', { url: fileUrl });
  await new Promise(r => setTimeout(r, 1500));

  const res = await send('Page.captureScreenshot', { format: 'png' });
  const buffer = Buffer.from(res.result.data, 'base64');
  const outPath = path.join('C:\\Users\\APRILEOERLANGGA\\.gemini\\antigravity\\brain\\b483387a-7d2c-424b-95f6-cfff3297c331', 'verify_hybrid.png');
  fs.writeFileSync(outPath, buffer);
  console.log('Saved', outPath);

  ws.close();
  chrome.kill();
  process.exit(0);
}

snapDepth().catch(console.error);
