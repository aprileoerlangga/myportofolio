const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

async function testThrow() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9338;
  const userDataDir = path.join(__dirname, 'chrome_throw_test');

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
    if (msg.method === 'Runtime.consoleAPICalled') {
      console.log('CONSOLE:', msg.params.args.map(a => JSON.stringify(a.value || a.description)).join(' '));
    }
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

  // Wait until minifigure settles into idle (~10s)
  await new Promise(r => setTimeout(r, 10000));

  console.log('Clicking Discover More button...');
  // Click Discover More button via JS evaluation
  await sendSession('Runtime.evaluate', {
    expression: `
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Discover More'));
      if (btn) btn.click();
    `
  });

  // 1. Frame at 200ms: Wind-up & brick launch
  await new Promise(r => setTimeout(r, 200));
  let snap = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(__dirname, 'throw_1_launch.png'), Buffer.from(snap.result.data, 'base64'));
  console.log('Captured throw_1_launch.png');

  // 2. Frame at 350ms total: Brick hurtling into camera
  await new Promise(r => setTimeout(r, 150));
  snap = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(__dirname, 'throw_2_midflight.png'), Buffer.from(snap.result.data, 'base64'));
  console.log('Captured throw_2_midflight.png');

  // 3. Frame at 520ms total: Screen fill / impact
  await new Promise(r => setTimeout(r, 170));
  snap = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(__dirname, 'throw_3_impact.png'), Buffer.from(snap.result.data, 'base64'));
  console.log('Captured throw_3_impact.png');

  // 4. Frame at 1100ms total: Landed on /about page!
  await new Promise(r => setTimeout(r, 600));
  snap = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(__dirname, 'throw_4_about_landed.png'), Buffer.from(snap.result.data, 'base64'));
  console.log('Captured throw_4_about_landed.png');

  chrome.kill();
  process.exit(0);
}
testThrow();

