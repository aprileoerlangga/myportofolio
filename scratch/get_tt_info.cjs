const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');

async function getTiktokDetails() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9997;
  const userDataDir = path.join(os.tmpdir(), 'chrome_tt_details_' + Date.now());

  const chrome = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--window-size=1280,900',
    '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    `--user-data-dir=${userDataDir}`
  ]);

  for (let i = 0; i < 30; i++) {
    try {
      const ver = await new Promise((res, rej) => {
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

  await send('Page.navigate', { url: 'https://www.tiktok.com/@rafaela_dev/video/7511754347441573126' });
  await new Promise(r => setTimeout(r, 4500));

  const info = await send('Runtime.evaluate', {
    expression: `(() => {
      const desc = document.querySelector('[data-e2e="browse-video-desc"]')?.innerText || '';
      const author = document.querySelector('[data-e2e="browse-username"]')?.innerText || '';
      const links = Array.from(document.querySelectorAll('a')).map(a => a.href).filter(h => !h.includes('tiktok.com'));
      return { desc, author, links, text: document.body.innerText.slice(0, 1500) };
    })()`,
    returnByValue: true
  });

  console.log('TIKTOK INFO:', JSON.stringify(info.result.value, null, 2));

  ws.close();
  chrome.kill();
  process.exit(0);
}

getTiktokDetails().catch(console.error);

