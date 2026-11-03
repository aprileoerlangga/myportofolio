const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');

async function verifyAll() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9400;
  const userDataDir = path.join(os.tmpdir(), 'chrome_v_' + Date.now());

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
      console.log('LOG:', msg.params.args.map(a => JSON.stringify(a.value || a.description)).join(' '));
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

  // Step 1: Drag to rotate sideways to test auto-reset
  console.log('Simulating drag to turn figure sideways...');
  await sendS('Runtime.evaluate', {
    expression: `
      const target = document.querySelector('[title*="Drag to inspect"]');
      if (target) {
        const rect = target.getBoundingClientRect();
        const startX = rect.left + rect.width / 2;
        const startY = rect.top + rect.height / 2;
        target.dispatchEvent(new PointerEvent('pointerdown', { clientX: startX, clientY: startY, bubbles: true }));
        window.dispatchEvent(new PointerEvent('pointermove', { clientX: startX + 160, clientY: startY, bubbles: true }));
        window.dispatchEvent(new PointerEvent('pointerup', { clientX: startX + 160, clientY: startY, bubbles: true }));
      }
    `
  });
  await new Promise(r => setTimeout(r, 600));

  let snap = await sendS('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(__dirname, 'step1_rotated_sideways.png'), Buffer.from(snap.result.data, 'base64'));
  console.log('Saved step1_rotated_sideways.png');

  // Trigger click
  console.log('Triggering Discover More click...');
  await sendS('Runtime.evaluate', {
    expression: `
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Discover More'));
      if (btn) btn.click();
    `
  });

  // Step 2: Auto-reset to front + snatch red brick
  await new Promise(r => setTimeout(r, 220));
  snap = await sendS('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(__dirname, 'step2_reset_front_snatch.png'), Buffer.from(snap.result.data, 'base64'));
  console.log('Saved step2_reset_front_snatch.png');

  // Step 3: Overhead wind-up & leg loading
  await new Promise(r => setTimeout(r, 240));
  snap = await sendS('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(__dirname, 'step3_overhead_windup.png'), Buffer.from(snap.result.data, 'base64'));
  console.log('Saved step3_overhead_windup.png');

  // Step 4: Stride forward + overhead pitch
  await new Promise(r => setTimeout(r, 160));
  snap = await sendS('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(__dirname, 'step4_stride_pitch.png'), Buffer.from(snap.result.data, 'base64'));
  console.log('Saved step4_stride_pitch.png');

  // Step 5: Shatter impact explosion
  await new Promise(r => setTimeout(r, 360));
  snap = await sendS('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(__dirname, 'step5_shatter_impact.png'), Buffer.from(snap.result.data, 'base64'));
  console.log('Saved step5_shatter_impact.png');

  // Step 6: Landed on About with floating shattered pieces
  await new Promise(r => setTimeout(r, 600));
  snap = await sendS('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(__dirname, 'step6_about_shattered_bg.png'), Buffer.from(snap.result.data, 'base64'));
  console.log('Saved step6_about_shattered_bg.png');

  chrome.kill();
  process.exit(0);
}
verifyAll();

