const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');

async function measure() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9999;
  const userDataDir = path.join(os.tmpdir(), 'chrome_measure_' + Date.now());

  const chrome = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--window-size=1440,1050',
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
  
  for (let i = 0; i < 60; i++) {
    const check = await send('Runtime.evaluate', {
      expression: `(() => !document.querySelector('.z-\\[99999\\]'))()`
    });
    if (check.result.value) break;
    await new Promise(r => setTimeout(r, 250));
  }
  await new Promise(r => setTimeout(r, 1000));

  const dims = await send('Runtime.evaluate', {
    expression: `(() => {
      const quotes = document.querySelector('div[class*="select-none"][class*="max-w-4xl"]');
      const skills = document.getElementById('skills-section');
      return {
        quotesTop: quotes ? quotes.getBoundingClientRect().top + window.scrollY : null,
        quotesHeight: quotes ? quotes.offsetHeight : null,
        skillsTop: skills ? skills.getBoundingClientRect().top + window.scrollY : null,
        skillsHeight: skills ? skills.offsetHeight : null,
      };
    })()`,
    returnByValue: true
  });
  console.log('Dimensions:', JSON.stringify(dims.result.value, null, 2));

  ws.close();
  chrome.kill();
  process.exit(0);
}

measure().catch(console.error);

