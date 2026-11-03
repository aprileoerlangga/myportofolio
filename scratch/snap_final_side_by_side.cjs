const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');

async function snap() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9993;
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--window-size=1400,750',
    '--disable-gpu',
    '--user-data-dir=' + path.join(os.tmpdir(), 'c_' + Date.now())
  ]);

  for (let i = 0; i < 30; i++) {
    try {
      const ver = await new Promise((res, rej) => {
        const req = http.get('http://127.0.0.1:' + port + '/json/version', r => {
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
    http.get('http://127.0.0.1:' + port + '/json/list', r => {
      let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
    });
  });

  const ws = new WebSocket(targets[0].webSocketDebuggerUrl);
  let id = 1;
  const pending = new Map();
  ws.onmessage = e => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) {
      pending.get(m.id)(m);
      pending.delete(m.id);
    }
  };
  const send = (method, params = {}) => new Promise(res => {
    const msgId = id++;
    pending.set(msgId, res);
    ws.send(JSON.stringify({ id: msgId, method, params }));
  });

  await new Promise(r => ws.onopen = r);
  await send('Page.enable');
  await send('Page.navigate', { url: 'file:///' + path.resolve('scratch', 'compare_ref_docked.html').replace(/\\/g, '/') });
  await new Promise(r => setTimeout(r, 1500));

  const res = await send('Page.captureScreenshot', { format: 'png' });
  const outPath = 'C:\\Users\\APRILEOERLANGGA\\.gemini\\antigravity\\brain\\b483387a-7d2c-424b-95f6-cfff3297c331\\final_side_by_side_comparison.png';
  fs.writeFileSync(outPath, Buffer.from(res.result.data, 'base64'));
  console.log('Saved comparison screenshot to:', outPath);

  ws.close();
  chrome.kill();
  process.exit(0);
}

snap().catch(console.error);

