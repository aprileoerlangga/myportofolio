const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');

async function capture() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9365;
  const userDataDir = path.join(os.tmpdir(), 'chrome_cap_' + Date.now());

  const chrome = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--window-size=1440,900',
    '--disable-gpu',
    `--user-data-dir=${userDataDir}`
  ]);

  let ver;
  for (let i = 0; i < 30; i++) {
    try {
      ver = await new Promise((res, rej) => {
        const req = http.get(`http://127.0.0.1:${port}/json/version`, r => {
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
    return new Promise(res => {
      const msgId = id++;
      pending.set(msgId, res);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }
  await new Promise(r => ws.onopen = r);
  const newTarget = await send('Target.createTarget', { url: 'about:blank' });
  const attach = await send('Target.attachToTarget', { targetId: newTarget.result.targetId, flatten: true });
  const sessionId = attach.result.sessionId;
  function sendS(method, params = {}) {
    return new Promise(res => {
      const msgId = id++;
      pending.set(msgId, res);
      ws.send(JSON.stringify({ id: msgId, sessionId, method, params }));
    });
  }
  await sendS('Runtime.enable');
  await sendS('Page.enable');
  await sendS('Page.navigate', { url: 'http://localhost:5173/' });
  
  // Wait for intro and walk in to settle
  await new Promise(r => setTimeout(r, 8000));

  // Trigger click
  console.log('Triggering Discover More click...');
  const t0 = Date.now();
  await sendS('Runtime.evaluate', {
    expression: `
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Discover More'));
      if (btn) btn.click();
    `
  });

  // Shot 1: Windup at ~150ms
  await new Promise(r => setTimeout(r, 140));
  console.log(`Taking shot 1 at +${Date.now() - t0}ms`);
  let snap = await sendS('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(__dirname, 'shot1_windup.png'), Buffer.from(snap.result.data, 'base64'));

  // Shot 2: Mid-air flight at ~420ms
  const elapsedBeforeShot2 = Date.now() - t0;
  if (elapsedBeforeShot2 < 420) {
    await new Promise(r => setTimeout(r, 420 - elapsedBeforeShot2));
  }
  console.log(`Taking shot 2 at +${Date.now() - t0}ms`);
  snap = await sendS('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(__dirname, 'shot2_midflight.png'), Buffer.from(snap.result.data, 'base64'));

  // Shot 3: Impact wipe at ~680ms
  const elapsedBeforeShot3 = Date.now() - t0;
  if (elapsedBeforeShot3 < 680) {
    await new Promise(r => setTimeout(r, 680 - elapsedBeforeShot3));
  }
  console.log(`Taking shot 3 at +${Date.now() - t0}ms`);
  snap = await sendS('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(__dirname, 'shot3_impact.png'), Buffer.from(snap.result.data, 'base64'));

  // Shot 4: About page settled at ~1200ms
  const elapsedBeforeShot4 = Date.now() - t0;
  if (elapsedBeforeShot4 < 1200) {
    await new Promise(r => setTimeout(r, 1200 - elapsedBeforeShot4));
  }
  console.log(`Taking shot 4 at +${Date.now() - t0}ms`);
  snap = await sendS('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(__dirname, 'shot4_about.png'), Buffer.from(snap.result.data, 'base64'));

  chrome.kill();
  process.exit(0);
}
capture();
