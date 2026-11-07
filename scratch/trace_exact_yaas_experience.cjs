const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');

async function traceExact() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9933;
  const userDataDir = path.join(os.tmpdir(), 'chrome_trace_yaas_' + Date.now());

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
        }).on('error', rej);
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
  await send('Page.enable');
  await send('Runtime.enable');

  console.log('Navigating to https://yaas-energy.com/ ...');
  await send('Page.navigate', { url: 'https://yaas-energy.com/' });
  await new Promise(r => setTimeout(r, 6000));

  // Find the position of screen2 / screen2-arc
  const arcPos = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const el = document.querySelector('.screen2') || document.querySelector('.screen2-arc');
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      return {
        top: rect.top + window.scrollY,
        height: el.offsetHeight,
        className: el.className
      };
    })()`
  });

  console.log('Screen2 position:', arcPos.result.value);
  const startTop = arcPos.result.value ? arcPos.result.value.top : 1200;

  // Let's scroll in steps through screen2
  const steps = [0, 400, 800, 1200, 1600, 2000, 2400, 2800, 3200, 3600, 4000];
  for (let i = 0; i < steps.length; i++) {
    const y = startTop + steps[i];
    await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${y})` });
    await new Promise(r => setTimeout(r, 400));

    const state = await send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        const headline = document.querySelector('.screen2-headline');
        const cards = Array.from(document.querySelectorAll('.screen2-arc-card, .scenario-card-iso'));
        return {
          scrollY: window.scrollY,
          headlineOpacity: headline ? window.getComputedStyle(headline).opacity : null,
          cardsCount: cards.length,
          cards: cards.slice(0, 5).map(c => ({
            className: c.className,
            transform: c.style.transform || window.getComputedStyle(c).transform,
            opacity: c.style.opacity || window.getComputedStyle(c).opacity,
            zIndex: c.style.zIndex || window.getComputedStyle(c).zIndex,
            width: c.offsetWidth,
            height: c.offsetHeight
          }))
        };
      })()`
    });

    console.log(`--- Step ${i} (scrollY=${y}) ---`);
    console.log(JSON.stringify(state.result.value, null, 2));

    const snap = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`scratch/yaas_flow_step_${i}.png`, Buffer.from(snap.result.data, 'base64'));
  }

  ws.close();
  chrome.kill();
  console.log('Done tracing!');
}

traceExact().catch(console.error);

