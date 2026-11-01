const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function main() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9284;
  const userDataDir = 'C:\\Users\\APRILEOERLANGGA\\my-portofolio\\scratch\\chrome_user_data_zulfian';
  const chrome = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--window-size=1440,900',
    '--disable-gpu',
    `--user-data-dir=${userDataDir}`
  ]);

  await new Promise(r => setTimeout(r, 2000));

  function getVersion() {
    return new Promise((resolve, reject) => {
      http.get(`http://127.0.0.1:${port}/json/version`, res => {
        let d = '';
        res.on('data', c => d += c);
        res.on('end', () => resolve(JSON.parse(d)));
      }).on('error', reject);
    });
  }

  const ver = await getVersion();
  const ws = new WebSocket(ver.webSocketDebuggerUrl);

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
    return new Promise((resolve) => {
      const msgId = id++;
      pending.set(msgId, resolve);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  await new Promise(r => ws.onopen = r);

  const newTarget = await send('Target.createTarget', { url: 'about:blank' });
  const targetId = newTarget.result.targetId;
  const attach = await send('Target.attachToTarget', { targetId, flatten: true });
  const sessionId = attach.result.sessionId;

  function sendSession(method, params = {}) {
    return new Promise(resolve => {
      const msgId = id++;
      pending.set(msgId, resolve);
      ws.send(JSON.stringify({ id: msgId, sessionId, method, params }));
    });
  }

  await sendSession('Page.enable');
  await sendSession('Page.navigate', { url: 'http://localhost:5173/projects' });
  // wait for intro curtain loader
  await new Promise(r => setTimeout(r, 6500));

  // Snap 1: Initial state at scroll = 0 (tilted sideways, semi-transparent)
  let snap = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/zulfian_start_tilted.png', Buffer.from(snap.result.data, 'base64'));
  console.log('Captured zulfian_start_tilted.png');

  // Snap 2: Transitioning at scroll = 350 (straightening out & becoming opaque)
  await sendSession('Runtime.evaluate', {
    expression: `window.scrollTo({ top: 350, behavior: 'instant' })`
  });
  await new Promise(r => setTimeout(r, 800));
  snap = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/zulfian_mid_straightening.png', Buffer.from(snap.result.data, 'base64'));
  console.log('Captured zulfian_mid_straightening.png');

  // Snap 3: Fully flat at scroll = 700 (straight, fully opaque, sliding)
  await sendSession('Runtime.evaluate', {
    expression: `window.scrollTo({ top: 750, behavior: 'instant' })`
  });
  await new Promise(r => setTimeout(r, 800));
  snap = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/zulfian_flat_sliding.png', Buffer.from(snap.result.data, 'base64'));
  console.log('Captured zulfian_flat_sliding.png');

  chrome.kill();
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
