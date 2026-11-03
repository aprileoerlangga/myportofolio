const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');

async function snapMultipleTilda() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9591;
  const userDataDir = path.join(os.tmpdir(), 'chrome_cdp_tilda_multi_' + Date.now());

  const chrome = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--window-size=1440,1000',
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

  await send('Page.navigate', { url: 'https://legospace.tilda.ws/classicspace' });
  await new Promise(r => setTimeout(r, 4500));

  // Snap 0: Top Start
  const s0 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:\\Users\\APRILEOERLANGGA\\.gemini\\antigravity\\brain\\b483387a-7d2c-424b-95f6-cfff3297c331\\tilda_scroll_0.png', Buffer.from(s0.result.data, 'base64'));

  // Scroll to Creator section
  await send('Runtime.evaluate', {
    expression: `(() => {
      const el = document.getElementById('creator') || Array.from(document.querySelectorAll('*')).find(e => e.textContent.includes('creator'));
      if (el) el.scrollIntoView({ behavior: 'instant' });
      else window.scrollTo(0, 2000);
    })()`
  });
  await new Promise(r => setTimeout(r, 1200));

  const s1 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:\\Users\\APRILEOERLANGGA\\.gemini\\antigravity\\brain\\b483387a-7d2c-424b-95f6-cfff3297c331\\tilda_scroll_1.png', Buffer.from(s1.result.data, 'base64'));

  // Scroll 1500px further down
  await send('Runtime.evaluate', { expression: 'window.scrollBy(0, 1500);' });
  await new Promise(r => setTimeout(r, 1200));

  const s2 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:\\Users\\APRILEOERLANGGA\\.gemini\\antigravity\\brain\\b483387a-7d2c-424b-95f6-cfff3297c331\\tilda_scroll_2.png', Buffer.from(s2.result.data, 'base64'));

  // Scroll another 2000px down
  await send('Runtime.evaluate', { expression: 'window.scrollBy(0, 2000);' });
  await new Promise(r => setTimeout(r, 1200));

  const s3 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:\\Users\\APRILEOERLANGGA\\.gemini\\antigravity\\brain\\b483387a-7d2c-424b-95f6-cfff3297c331\\tilda_scroll_3.png', Buffer.from(s3.result.data, 'base64'));

  console.log('Saved all 4 Tilda scrolls!');
  chrome.kill();
  process.exit(0);
}

snapMultipleTilda().catch(err => {
  console.error(err);
  process.exit(1);
});

