const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

async function testRotated() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9337;
  const userDataDir = path.join(__dirname, 'chrome_rot_test');

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
  await sendSession('Input.enable');
  await sendSession('Page.navigate', { url: 'http://localhost:5173/' });

  // Wait until minifigure finishes walking, waving, and settles into idle (~11s)
  await new Promise(r => setTimeout(r, 11000));

  // 1. Capture settled front-ish view
  let snap = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(__dirname, 'portfolio_face_settled.png'), Buffer.from(snap.result.data, 'base64'));
  console.log('Saved portfolio_face_settled.png');

  // 2. Perform a drag on the right column orbit zone to rotate the character to a side profile
  // Grab zone is around x=1050, y=550
  await sendSession('Input.dispatchMouseEvent', { type: 'mousePressed', x: 1050, y: 550, button: 'left' });
  // Drag to left by 200px to rotate character ~60 degrees
  for (let step = 0; step < 10; step++) {
    await sendSession('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 1050 - (step * 20), y: 550, button: 'left' });
    await new Promise(r => setTimeout(r, 20));
  }
  await sendSession('Input.dispatchMouseEvent', { type: 'mouseReleased', x: 850, y: 550, button: 'left' });

  // Wait for dampening lerp to settle
  await new Promise(r => setTimeout(r, 800));

  // 3. Capture side angle view
  snap = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(__dirname, 'portfolio_face_side_dragged.png'), Buffer.from(snap.result.data, 'base64'));
  console.log('Saved portfolio_face_side_dragged.png');

  chrome.kill();
  process.exit(0);
}
testRotated();

