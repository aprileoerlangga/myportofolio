const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');

async function inspectFullRef() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9471;
  const userDataDir = path.join(os.tmpdir(), 'chrome_ref_full_' + Date.now());

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

  await send('Runtime.enable');
  await send('Page.enable');
  console.log('Navigating to reference site...');
  await send('Page.navigate', { url: 'https://legospace.tilda.ws/classicspace#start' });
  await new Promise(r => setTimeout(r, 5000));

  const pageInfo = await send('Runtime.evaluate', {
    expression: `(() => {
      return {
        title: document.title,
        height: document.body.scrollHeight,
        sections: Array.from(document.querySelectorAll('div[id^="rec"], section, .r')).map(s => ({
          id: s.id,
          text: s.innerText?.slice(0, 100),
          className: s.className
        }))
      };
    })()`,
    returnByValue: true
  });
  console.log('Page info:', JSON.stringify(pageInfo.result.value, null, 2));

  // Capture at several heights: 0, 1500, 3000, 4500, 6000
  for (let scrollY of [0, 1200, 2400, 3600, 4800, 6000]) {
    await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${scrollY})` });
    await new Promise(r => setTimeout(r, 1200));
    const snap = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(__dirname, `ref_scroll_${scrollY}.png`), Buffer.from(snap.result.data, 'base64'));
    console.log(`Saved ref_scroll_${scrollY}.png`);
  }

  chrome.kill();
  process.exit(0);
}

inspectFullRef().catch(e => {
  console.error(e);
  process.exit(1);
});

