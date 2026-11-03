const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');

async function dumpLegospace() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9898;
  const userDataDir = path.join(os.tmpdir(), 'chrome_cdp_dump_' + Date.now());

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

  await send('Page.navigate', { url: 'https://legospace.tilda.ws/classicspace' });
  await new Promise(r => setTimeout(r, 6000));

  const textBlocks = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const texts = [];
      document.querySelectorAll('h1, h2, h3, p, div[class*="text"], div[class*="title"], div[class*="subtitle"]').forEach(el => {
        const t = el.innerText ? el.innerText.trim() : '';
        if (t && t.length > 5 && !texts.includes(t)) {
          texts.push({ tag: el.tagName, text: t.slice(0, 150), className: el.className });
        }
      });
      return texts;
    })()`
  });

  console.log('Found text blocks in legospace:', JSON.stringify(textBlocks.result.value, null, 2));

  // Let's capture full page screenshots in chunks to see all text sections
  for (let s = 0; s < 8; s++) {
    await send('Runtime.evaluate', { expression: 'window.scrollTo(0, ' + (s * 800) + ')' });
    await new Promise(r => setTimeout(r, 1000));
    const res = await send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(res.result.data, 'base64');
    fs.writeFileSync(path.join('C:\\Users\\APRILEOERLANGGA\\.gemini\\antigravity\\brain\\b483387a-7d2c-424b-95f6-cfff3297c331', 'legospace_page_' + s + '.png'), buffer);
  }

  ws.close();
  chrome.kill();
  console.log('All legospace screenshots captured!');
}

dumpLegospace().catch(console.error);
