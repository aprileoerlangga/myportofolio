const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function main() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9283;
  const userDataDir = 'C:\\Users\\APRILEOERLANGGA\\my-portofolio\\scratch\\chrome_user_data_smooth';
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
  await new Promise(r => setTimeout(r, 6500));

  // 1. Initial 3D tilt
  let snap = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/smooth_step1_unfold.png', Buffer.from(snap.result.data, 'base64'));
  console.log('1. Captured smooth_step1_unfold.png');

  // 2. Straightened flat
  await sendSession('Runtime.evaluate', {
    expression: `window.scrollTo({ top: 850, behavior: 'instant' })`
  });
  await new Promise(r => setTimeout(r, 900));
  snap = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/smooth_step2_flat.png', Buffer.from(snap.result.data, 'base64'));
  console.log('2. Captured smooth_step2_flat.png');

  // 3. Gliding horizontally
  await sendSession('Runtime.evaluate', {
    expression: `window.scrollTo({ top: 1800, behavior: 'instant' })`
  });
  await new Promise(r => setTimeout(r, 900));
  snap = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/smooth_step3_glide.png', Buffer.from(snap.result.data, 'base64'));
  console.log('3. Captured smooth_step3_glide.png');

  // 4. Resting buffer zone before footer
  await sendSession('Runtime.evaluate', {
    expression: `window.scrollTo({ top: 2900, behavior: 'instant' })`
  });
  await new Promise(r => setTimeout(r, 900));
  snap = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/smooth_step4_buffer.png', Buffer.from(snap.result.data, 'base64'));
  console.log('4. Captured smooth_step4_buffer.png');

  chrome.kill();
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
