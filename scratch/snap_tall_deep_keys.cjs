const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');

async function snapTallDeep() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9995;
  const userDataDir = path.join(os.tmpdir(), 'chrome_tall_deep_' + Date.now());

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

  const send = (method, params = {}) => new Promise(res => {
    const msgId = id++;
    pending.set(msgId, res);
    ws.send(JSON.stringify({ id: msgId, method, params }));
  });

  await new Promise(r => {
    if (ws.readyState === 1) r();
    else ws.onopen = r;
  });

  await send('Page.enable');
  await send('Runtime.enable');

  const fileUrl = 'file:///' + path.resolve(__dirname, 'test_tall_deep_keys.html').replace(/\\/g, '/');
  await send('Page.navigate', { url: fileUrl });
  await new Promise(r => setTimeout(r, 1200));

  let res = await send('Page.captureScreenshot', { format: 'png' });
  let buffer = Buffer.from(res.result.data, 'base64');
  const artifactDir = 'C:\\Users\\APRILEOERLANGGA\\.gemini\\antigravity\\brain\\b483387a-7d2c-424b-95f6-cfff3297c331';
  fs.writeFileSync(path.join(artifactDir, 'verify_tall_deep_keys.png'), buffer);
  console.log('Saved verify_tall_deep_keys.png');

  // Click Git
  await send('Runtime.evaluate', {
    expression: `(() => {
      const btn = document.querySelector('button[title="Git"]');
      if (btn) btn.click();
    })()`
  });
  await new Promise(r => setTimeout(r, 40));

  res = await send('Page.captureScreenshot', { format: 'png' });
  buffer = Buffer.from(res.result.data, 'base64');
  fs.writeFileSync(path.join(artifactDir, 'verify_tall_deep_clicked_git.png'), buffer);
  console.log('Saved verify_tall_deep_clicked_git.png');

  ws.close();
  chrome.kill();
  process.exit(0);
}

snapTallDeep().catch(console.error);

