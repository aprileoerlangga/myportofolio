const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');

async function main() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9933;
  const userDataDir = path.join(os.tmpdir(), 'chrome_opt1_' + Date.now());

  const chrome = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--window-size=1440,950',
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

  await send('Page.navigate', { url: 'http://localhost:5175/about' });

  // Wait for curtain to dismiss
  for (let i = 0; i < 40; i++) {
    const check = await send('Runtime.evaluate', {
      expression: `(() => !document.querySelector('.z-\\[99999\\]'))()`,
      returnByValue: true
    });
    if (check?.result?.value) {
      break;
    }
    await new Promise(r => setTimeout(r, 400));
  }
  await new Promise(r => setTimeout(r, 1000));

  const artifactDir = 'C:\\Users\\APRILEOERLANGGA\\.gemini\\antigravity\\brain\\b483387a-7d2c-424b-95f6-cfff3297c331';

  // Find quotes section offset
  const metrics = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const el = document.getElementById('quotes-section');
      return {
        offsetTop: el ? el.offsetTop : 800,
        scrollHeight: el ? el.scrollHeight : 2000
      };
    })()`
  });
  const offsetTop = metrics.result.value.offsetTop;
  const height = metrics.result.value.scrollHeight;
  console.log('Quotes metrics:', offsetTop, height);

  // 1. Entrance / Quote 1 arrival
  await send('Runtime.evaluate', { expression: `window.scrollTo({ top: ${offsetTop + 100}, behavior: 'instant' });` });
  await new Promise(r => setTimeout(r, 1000));
  let snap = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${artifactDir}\\option1_quote1_arrival.png`, Buffer.from(snap.data || snap.result.data, 'base64'));
  console.log('Saved option1_quote1_arrival.png');

  // 2. Kinetic shift into Quote 2 (Simplicity)
  await send('Runtime.evaluate', { expression: `window.scrollTo({ top: ${offsetTop + height * 0.45}, behavior: 'instant' });` });
  await new Promise(r => setTimeout(r, 1000));
  snap = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${artifactDir}\\option1_quote2_simplicity.png`, Buffer.from(snap.data || snap.result.data, 'base64'));
  console.log('Saved option1_quote2_simplicity.png');

  // 3. Kinetic shift into Quote 3 (Master Builder)
  await send('Runtime.evaluate', { expression: `window.scrollTo({ top: ${offsetTop + height * 0.78}, behavior: 'instant' });` });
  await new Promise(r => setTimeout(r, 1000));
  snap = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${artifactDir}\\option1_quote3_builder.png`, Buffer.from(snap.data || snap.result.data, 'base64'));
  console.log('Saved option1_quote3_builder.png');

  ws.close();
  chrome.kill();
  process.exit(0);
}

main().catch(console.error);

