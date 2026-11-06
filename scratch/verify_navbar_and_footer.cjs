const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');

async function main() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9815;
  const userDataDir = path.join(os.tmpdir(), 'chrome_verify_nav_' + Date.now());

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
  await new Promise(r => setTimeout(r, 7000));

  // 1. Hero
  await send('Runtime.evaluate', { expression: 'window.scrollTo({ top: 0, behavior: "instant" });' });
  await new Promise(r => setTimeout(r, 600));
  const snap1 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:\\Users\\APRILEOERLANGGA\\.gemini\\antigravity\\brain\\b483387a-7d2c-424b-95f6-cfff3297c331\\verified_hero_zone1.png', Buffer.from(snap1.result.data, 'base64'));

  // 2. Mid Quotes (Quote 2) around scroll = 1750
  await send('Runtime.evaluate', { expression: 'window.scrollTo({ top: 1750, behavior: "instant" });' });
  await new Promise(r => setTimeout(r, 800));
  const snap2 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:\\Users\\APRILEOERLANGGA\\.gemini\\antigravity\\brain\\b483387a-7d2c-424b-95f6-cfff3297c331\\verified_quotes_zone2.png', Buffer.from(snap2.result.data, 'base64'));

  // 3. Tech Stack header around scroll = 2550
  await send('Runtime.evaluate', { expression: 'window.scrollTo({ top: 2550, behavior: "instant" });' });
  await new Promise(r => setTimeout(r, 800));
  const snap3 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:\\Users\\APRILEOERLANGGA\\.gemini\\antigravity\\brain\\b483387a-7d2c-424b-95f6-cfff3297c331\\verified_techstack_zone3.png', Buffer.from(snap3.result.data, 'base64'));

  // 4. Footer at bottom
  await send('Runtime.evaluate', { expression: 'window.scrollTo({ top: 99999, behavior: "instant" });' });
  await new Promise(r => setTimeout(r, 800));
  const snap4 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:\\Users\\APRILEOERLANGGA\\.gemini\\antigravity\\brain\\b483387a-7d2c-424b-95f6-cfff3297c331\\verified_footer_zone3.png', Buffer.from(snap4.result.data, 'base64'));

  console.log('All 4 verified screenshots captured!');
  chrome.kill();
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

