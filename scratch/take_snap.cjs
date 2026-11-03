const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

async function snap(url, outputPath, waitMs = 3000) {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9333;
  const userDataDir = path.join(__dirname, 'chrome_user_data_snap');

  const chrome = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--window-size=1440,900',
    '--disable-gpu',
    `--user-data-dir=${userDataDir}`
  ]);

  await new Promise(r => setTimeout(r, 1500));

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
    if (msg.method === 'Runtime.consoleAPICalled') {
      console.log('BROWSER CONSOLE:', msg.params.args.map(a => JSON.stringify(a.value || a.preview?.properties || a.description)).join(' '));
    }
    if (msg.method === 'Runtime.exceptionThrown') {
      console.error('BROWSER EXCEPTION:', msg.params.exceptionDetails);
    }
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

  await sendSession('Runtime.enable');
  await sendSession('Page.enable');
  await sendSession('Page.navigate', { url });
  await new Promise(r => setTimeout(r, waitMs));

  const screenshot = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(outputPath, Buffer.from(screenshot.result.data, 'base64'));
  console.log('Saved screenshot to:', outputPath);

  chrome.kill();
  process.exit(0);
}

const outPath = process.argv[2] || path.join(__dirname, 'test_snap.png');
const wait = parseInt(process.argv[3] || '3500', 10);
snap('http://localhost:5173/', outPath, wait);
