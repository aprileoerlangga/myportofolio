const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

async function testWalk() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9335;
  const userDataDir = path.join(__dirname, 'chrome_walk_test');

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
  await sendSession('Page.navigate', { url: 'http://localhost:5173/' });

  const timestamps = [3800, 4400, 5000, 5600, 6400, 7500];
  let lastTime = 0;
  for (const t of timestamps) {
    await new Promise(r => setTimeout(r, t - lastTime));
    lastTime = t;
    const snap = await sendSession('Page.captureScreenshot', { format: 'png' });
    const out = path.join(__dirname, `walk_${t}.png`);
    fs.writeFileSync(out, Buffer.from(snap.result.data, 'base64'));
    console.log(`Captured walk_${t}.png`);
  }

  chrome.kill();
  process.exit(0);
}
testWalk();

