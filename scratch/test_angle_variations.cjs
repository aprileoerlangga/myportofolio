const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');

async function testAngles() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9450;
  const userDataDir = path.join(os.tmpdir(), 'chrome_ang_var_' + Date.now());

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

  const targets = await new Promise((res, rej) => {
    http.get(`http://127.0.0.1:${port}/json/list`, r => {
      let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
    }).on('error', rej);
  });
  const pageTarget = targets.find(t => t.type === 'page') || targets[0];

  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
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
  
  // Wait for curtain to clear and minifigure to arrive
  for (let i = 0; i < 40; i++) {
    await new Promise(r => setTimeout(r, 500));
    const res = await send('Runtime.evaluate', {
      expression: `Boolean(document.querySelector('button') && document.querySelector('button').textContent.includes('Discover More'))`
    });
    if (res.result && res.result.value) break;
  }
  await new Promise(r => setTimeout(r, 5500));

  // Current setting in LegoMinifigure.jsx is -0.36 (already applied)
  let snap = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(__dirname, 'var_current_minus036.png'), Buffer.from(snap.result.data, 'base64'));
  console.log('Saved var_current_minus036.png');

  // Let's drag slightly left via pointer event on target to simulate station rotation
  // Dragging left (negative dx) rotates station towards left
  await send('Runtime.evaluate', {
    expression: `
      const target = document.querySelector('[title*="Drag to inspect"]');
      if (target) {
        const rect = target.getBoundingClientRect();
        const startX = rect.left + rect.width / 2;
        const startY = rect.top + rect.height / 2;
        target.dispatchEvent(new PointerEvent('pointerdown', { clientX: startX, clientY: startY, bubbles: true }));
        window.dispatchEvent(new PointerEvent('pointermove', { clientX: startX - 35, clientY: startY, bubbles: true }));
        window.dispatchEvent(new PointerEvent('pointerup', { clientX: startX - 35, clientY: startY, bubbles: true }));
      }
    `
  });
  await new Promise(r => setTimeout(r, 600));
  snap = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(__dirname, 'var_station_angled_subtle.png'), Buffer.from(snap.result.data, 'base64'));
  console.log('Saved var_station_angled_subtle.png');

  // Drag more to the left
  await send('Runtime.evaluate', {
    expression: `
      const target = document.querySelector('[title*="Drag to inspect"]');
      if (target) {
        const rect = target.getBoundingClientRect();
        const startX = rect.left + rect.width / 2;
        const startY = rect.top + rect.height / 2;
        target.dispatchEvent(new PointerEvent('pointerdown', { clientX: startX, clientY: startY, bubbles: true }));
        window.dispatchEvent(new PointerEvent('pointermove', { clientX: startX - 50, clientY: startY, bubbles: true }));
        window.dispatchEvent(new PointerEvent('pointerup', { clientX: startX - 50, clientY: startY, bubbles: true }));
      }
    `
  });
  await new Promise(r => setTimeout(r, 600));
  snap = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(__dirname, 'var_station_angled_more.png'), Buffer.from(snap.result.data, 'base64'));
  console.log('Saved var_station_angled_more.png');

  chrome.kill();
  process.exit(0);
}

testAngles().catch(e => {
  console.error(e);
  process.exit(1);
});

