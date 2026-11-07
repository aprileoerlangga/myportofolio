const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');

async function snap() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9944;
  const userDataDir = path.join(os.tmpdir(), 'chrome_snap_' + Date.now());

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

  await send('Page.navigate', { url: 'http://localhost:5173/projects' });
  await new Promise(r => setTimeout(r, 2500));

  const screenshot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/current_projects_view.png', Buffer.from(screenshot.result.data, 'base64'));
  console.log('Saved scratch/current_projects_view.png');

  // Also scroll down a bit
  await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 800)' });
  await new Promise(r => setTimeout(r, 800));
  const s2 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/current_projects_scroll_800.png', Buffer.from(s2.result.data, 'base64'));
  console.log('Saved scratch/current_projects_scroll_800.png');

  ws.close();
  chrome.kill();
}

snap().catch(console.error);

