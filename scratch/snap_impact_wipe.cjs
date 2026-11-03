const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');

async function run() {
  const port = 9392;
  const userDataDir = path.join(os.tmpdir(), 'chrome_w_' + Date.now());
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new', `--remote-debugging-port=${port}`, '--window-size=1440,900', '--disable-gpu',
    `--user-data-dir=${userDataDir}`
  ]);
  let ver;
  for (let i = 0; i < 30; i++) {
    try {
      ver = await new Promise((res, rej) => {
        const req = http.get(`http://127.0.0.1:${port}/json/version`, r => {
          let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
        });
        req.on('error', rej); req.setTimeout(500, () => req.destroy());
      });
      if (ver) break;
    } catch { await new Promise(r => setTimeout(r, 200)); }
  }
  const ws = new WebSocket(ver.webSocketDebuggerUrl);
  let id = 1; const pending = new Map();
  ws.onmessage = e => {
    const msg = JSON.parse(e.data);
    if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); }
  };
  function send(method, params = {}) {
    return new Promise(res => { const msgId = id++; pending.set(msgId, res); ws.send(JSON.stringify({ id: msgId, method, params })); });
  }
  await new Promise(r => ws.onopen = r);
  const newTarget = await send('Target.createTarget', { url: 'about:blank' });
  const attach = await send('Target.attachToTarget', { targetId: newTarget.result.targetId, flatten: true });
  const sessionId = attach.result.sessionId;
  function sendS(method, params = {}) {
    return new Promise(res => { const msgId = id++; pending.set(msgId, res); ws.send(JSON.stringify({ id: msgId, sessionId, method, params })); });
  }
  await sendS('Runtime.enable'); await sendS('Page.enable');
  await sendS('Page.navigate', { url: 'http://localhost:5173/' });
  await new Promise(r => setTimeout(r, 8000));
  console.log('Triggering Discover More click...');
  await sendS('Runtime.evaluate', {
    expression: `
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Discover More'));
      if (btn) btn.click();
    `
  });
  // Capture at +600ms (impact wipe)
  await new Promise(r => setTimeout(r, 600));
  const snap = await sendS('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(__dirname, 'impact_wipe_real.png'), Buffer.from(snap.result.data, 'base64'));
  console.log('Saved impact_wipe_real.png');

  chrome.kill(); process.exit(0);
}
run();
