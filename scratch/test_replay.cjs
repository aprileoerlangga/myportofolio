const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

async function testReplay(url, outputPath) {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9334;
  const userDataDir = path.join(__dirname, 'chrome_user_data_replay');

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

  // Wait for curtain to finish and home page to load
  await new Promise(r => setTimeout(r, 6500));

  // Trigger walk replay
  await sendSession('Runtime.evaluate', {
    expression: "window.dispatchEvent(new CustomEvent('replay-lego-walk'));"
  });

  // Wait 1.3 seconds so he is stepping directly across the text
  await new Promise(r => setTimeout(r, 1300));

  const screenshot = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(outputPath, Buffer.from(screenshot.result.data, 'base64'));
  console.log('Saved replay walk snapshot to:', outputPath);

  chrome.kill();
  process.exit(0);
}

testReplay('http://localhost:5173/', path.join(__dirname, 'test_big_midwalk.png'));

