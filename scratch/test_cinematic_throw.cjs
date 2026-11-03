const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');

async function testSequence() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9410;
  const userDataDir = path.join(os.tmpdir(), 'chrome_cine_' + Date.now());

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
      console.log('BROWSER LOG:', msg.params.args.map(a => JSON.stringify(a.value || a.description)).join(' '));
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
  await sendS('Page.navigate', { url: 'http://localhost:5174/' });
  
  // Wait for intro and walk in to settle into idle (~8s)
  console.log('Waiting for walk-in and arrival...');
  await new Promise(r => setTimeout(r, 8000));

  // 1. Drag to rotate sideways to verify drag is enabled ONLY after idle, and to set up auto-reset test
  console.log('Dragging to rotate sideways...');
  await sendS('Runtime.evaluate', {
    expression: `
      const target = document.querySelector('[title*="Drag to inspect"]');
      if (target) {
        const rect = target.getBoundingClientRect();
        const startX = rect.left + rect.width / 2;
        const startY = rect.top + rect.height / 2;
        target.dispatchEvent(new PointerEvent('pointerdown', { clientX: startX, clientY: startY, bubbles: true }));
        window.dispatchEvent(new PointerEvent('pointermove', { clientX: startX + 180, clientY: startY, bubbles: true }));
        window.dispatchEvent(new PointerEvent('pointerup', { clientX: startX + 180, clientY: startY, bubbles: true }));
      }
    `
  });
  await new Promise(r => setTimeout(r, 500));

  let snap = await sendS('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(__dirname, 'cine_1_rotated_sideways.png'), Buffer.from(snap.result.data, 'base64'));
  console.log('Saved cine_1_rotated_sideways.png');

  // 2. Click Discover More!
  console.log('Clicking Discover More button...');
  await sendS('Runtime.evaluate', {
    expression: `
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Discover More'));
      if (btn) btn.click();
    `
  });

  // Snatch phase: ~250ms after click (turns front + grabs red brick)
  await new Promise(r => setTimeout(r, 250));
  snap = await sendS('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(__dirname, 'cine_2_snatch_front.png'), Buffer.from(snap.result.data, 'base64'));
  console.log('Saved cine_2_snatch_front.png');

  // Overhead windup phase: ~350ms later (total ~600ms)
  await new Promise(r => setTimeout(r, 350));
  snap = await sendS('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(__dirname, 'cine_3_overhead_windup.png'), Buffer.from(snap.result.data, 'base64'));
  console.log('Saved cine_3_overhead_windup.png');

  // Forward stride & pitch whip: ~250ms later (total ~850ms)
  await new Promise(r => setTimeout(r, 250));
  snap = await sendS('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(__dirname, 'cine_4_stride_pitch.png'), Buffer.from(snap.result.data, 'base64'));
  console.log('Saved cine_4_stride_pitch.png');

  // Shatter Impact / Explosion: ~400ms later (total ~1250ms)
  await new Promise(r => setTimeout(r, 400));
  snap = await sendS('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(__dirname, 'cine_5_shatter_impact.png'), Buffer.from(snap.result.data, 'base64'));
  console.log('Saved cine_5_shatter_impact.png');

  // Landed on About page with floating shattered background: ~700ms later (total ~1950ms)
  await new Promise(r => setTimeout(r, 700));
  snap = await sendS('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(__dirname, 'cine_6_about_background.png'), Buffer.from(snap.result.data, 'base64'));
  console.log('Saved cine_6_about_background.png');

  // Also check current URL
  const loc = await sendS('Runtime.evaluate', { expression: 'window.location.pathname' });
  console.log('CURRENT URL:', loc.result.value);

  chrome.kill();
  process.exit(0);
}

testSequence().catch(e => {
  console.error('Test error:', e);
  process.exit(1);
});

