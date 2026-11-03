const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

async function snapFace() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9336;
  const userDataDir = path.join(__dirname, 'chrome_face_test');

  const chrome = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--window-size=1440,900',
    '--disable-gpu',
    `--user-data-dir=${userDataDir}`
  ]);

  await new Promise(r => setTimeout(r, 1500));

  const ver = await new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:${port}/json/version`, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(JSON.parse(d)));
    }).on('error', reject);
  });

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
    return new Promise(resolve => {
      const msgId = id++;
      pending.set(msgId, resolve);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  await new Promise(r => ws.onopen = r);
  const newTarget = await send('Target.createTarget', { url: 'about:blank' });
  const attach = await send('Target.attachToTarget', { targetId: newTarget.result.targetId, flatten: true });
  const sessionId = attach.result.sessionId;

  function sendSession(method, params = {}) {
    return new Promise(resolve => {
      const msgId = id++;
      pending.set(msgId, resolve);
      ws.send(JSON.stringify({ id: msgId, sessionId, method, params }));
    });
  }

  await sendSession('Runtime.enable');
  await sendSession('Page.enable');
  const filePath = 'file:///' + path.join(__dirname, 'test_face.html').replace(/\\/g, '/');
  await sendSession('Page.navigate', { url: filePath });
  await new Promise(r => setTimeout(r, 2000));

  // 1. Front view
  let snap = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(__dirname, 'face_front.png'), Buffer.from(snap.result.data, 'base64'));
  console.log('Saved face_front.png');

  // 2. 45-degree angle
  await sendSession('Runtime.evaluate', { expression: 'window.setHeadRotation(0.78);' });
  snap = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(__dirname, 'face_45deg.png'), Buffer.from(snap.result.data, 'base64'));
  console.log('Saved face_45deg.png');

  // 3. 75-degree angle (almost side view)
  await sendSession('Runtime.evaluate', { expression: 'window.setHeadRotation(1.30);' });
  snap = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(__dirname, 'face_side.png'), Buffer.from(snap.result.data, 'base64'));
  console.log('Saved face_side.png');

  chrome.kill();
  process.exit(0);
}
snapFace();

