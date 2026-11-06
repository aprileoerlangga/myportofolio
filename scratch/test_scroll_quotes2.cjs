const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');

async function main() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9913;
  const userDataDir = path.join(os.tmpdir(), 'chrome_view2_' + Date.now());

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

  await send('Page.navigate', { url: 'http://localhost:5174/about' });

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
  await new Promise(r => setTimeout(r, 1200));

  const artifactDir = 'C:\\Users\\APRILEOERLANGGA\\.gemini\\antigravity\\brain\\b483387a-7d2c-424b-95f6-cfff3297c331';

  // Scroll to quotes section
  await send('Runtime.evaluate', {
    expression: `document.getElementById('quotes-section').scrollIntoView({ behavior: 'instant', block: 'start' });`
  });
  await new Promise(r => setTimeout(r, 1200));

  // Scroll 1150px inside quotes section (Quote 2 steady state)
  await send('Runtime.evaluate', { expression: `window.scrollBy(0, 1150);` });
  await new Promise(r => setTimeout(r, 1200));

  let snap = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${artifactDir}\\verified_pure_editorial_quote2_steady.png`, Buffer.from(snap.data || snap.result.data, 'base64'));
  console.log('Saved verified_pure_editorial_quote2_steady.png');

  // Scroll another 900px (Quote 3 steady state)
  await send('Runtime.evaluate', { expression: `window.scrollBy(0, 900);` });
  await new Promise(r => setTimeout(r, 1200));

  snap = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${artifactDir}\\verified_pure_editorial_quote3_steady.png`, Buffer.from(snap.data || snap.result.data, 'base64'));
  console.log('Saved verified_pure_editorial_quote3_steady.png');

  ws.close();
  chrome.kill();
  process.exit(0);
}

main().catch(console.error);

