const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');

async function testCompleteFlow() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9422;
  const userDataDir = path.join(os.tmpdir(), 'chrome_flow_' + Date.now());

  const chrome = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--window-size=1440,900',
    '--disable-gpu',
    '--disable-background-timer-throttling',
    '--disable-backgrounding-occluded-windows',
    '--disable-renderer-backgrounding',
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

  // Get default page target from /json/list
  const targets = await new Promise((res, rej) => {
    http.get(`http://127.0.0.1:${port}/json/list`, r => {
      let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
    }).on('error', rej);
  });
  const pageTarget = targets.find(t => t.type === 'page') || targets[0];
  console.log('Attaching to page target:', pageTarget.id);

  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
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

  await send('Runtime.enable');
  await send('Page.enable');
  await send('Page.navigate', { url: 'http://localhost:5174/' });
  
  // Wait for loader curtain to finish and walk-in to settle (~9s)
  console.log('Waiting for curtain loader and walk-in sequence...');
  for (let i = 0; i < 40; i++) {
    await new Promise(r => setTimeout(r, 500));
    const res = await send('Runtime.evaluate', {
      expression: `Boolean(document.querySelector('button') && document.querySelector('button').textContent.includes('Discover More'))`
    });
    if (res.result && res.result.value) {
      console.log(`Discover More button appeared at ${(i * 0.5).toFixed(1)}s!`);
      break;
    }
  }

  // Allow extra 5.5s for minifigure to step up, wave, and settle into idle
  console.log('Waiting for minifigure to reach baseplate and settle into idle...');
  await new Promise(r => setTimeout(r, 5500));

  // 1. Drag sideways to test rotation & verify idle interactivity
  console.log('1. Dragging minifigure sideways...');
  await send('Runtime.evaluate', {
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
  await new Promise(r => setTimeout(r, 400));
  let snap = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(__dirname, 'flow_1_rotated_sideways.png'), Buffer.from(snap.result.data, 'base64'));
  console.log('Saved flow_1_rotated_sideways.png');

  // 2. Click Discover More
  console.log('2. Clicking Discover More button...');
  await send('Runtime.evaluate', {
    expression: `
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Discover More'));
      if (btn) btn.click();
    `
  });

  // Snatch Phase: ~250ms (auto-resets front, reaches up & grabs orbiting red brick)
  await new Promise(r => setTimeout(r, 220));
  snap = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(__dirname, 'flow_2_snatch_front.png'), Buffer.from(snap.result.data, 'base64'));
  console.log('Saved flow_2_snatch_front.png');

  // Overhead Wind-up Phase: ~350ms (right arm cocks high overhead, right leg lifts back)
  await new Promise(r => setTimeout(r, 340));
  snap = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(__dirname, 'flow_3_overhead_windup.png'), Buffer.from(snap.result.data, 'base64'));
  console.log('Saved flow_3_overhead_windup.png');

  // Overhead Power Pitch & Leg Stride: ~260ms (right leg swings forward into stride, arm whips forward overhead)
  await new Promise(r => setTimeout(r, 260));
  snap = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(__dirname, 'flow_4_stride_pitch.png'), Buffer.from(snap.result.data, 'base64'));
  console.log('Saved flow_4_stride_pitch.png');

  // Shatter Impact / Explosion Overlay: ~450ms (brick crashes into camera screen, radial shatter crack & flying studs)
  await new Promise(r => setTimeout(r, 450));
  snap = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(__dirname, 'flow_5_shatter_impact.png'), Buffer.from(snap.result.data, 'base64'));
  console.log('Saved flow_5_shatter_impact.png');

  // Landed on About page with floating shattered background pieces: ~700ms later
  await new Promise(r => setTimeout(r, 700));
  snap = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(__dirname, 'flow_6_about_background.png'), Buffer.from(snap.result.data, 'base64'));
  console.log('Saved flow_6_about_background.png');

  const loc = await send('Runtime.evaluate', { expression: 'window.location.pathname' });
  console.log('CURRENT URL:', loc.result.value);

  chrome.kill();
  process.exit(0);
}

testCompleteFlow().catch(e => {
  console.error('Test error:', e);
  process.exit(1);
});

