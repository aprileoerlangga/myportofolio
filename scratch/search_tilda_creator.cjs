const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');

async function main() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9860;
  const userDataDir = path.join(os.tmpdir(), 'chrome_tilda_search_' + Date.now());

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
      const curId = id++;
      pending.set(curId, res);
      ws.send(JSON.stringify({ id: curId, method, params }));
    });
  }

  await new Promise(r => ws.onopen = r);
  await send('Page.enable');
  await send('Page.navigate', { url: 'https://legospace.tilda.ws/classicspace' });
  await new Promise(r => setTimeout(r, 4500));

  const pageInfo = await send('Runtime.evaluate', {
    expression: `(() => {
      const anchors = Array.from(document.querySelectorAll('[id], a[name], a[href]')).map(el => ({
        id: el.id,
        name: el.getAttribute('name'),
        href: el.getAttribute('href'),
        text: el.innerText ? el.innerText.trim() : '',
        top: Math.round(window.scrollY + el.getBoundingClientRect().top)
      })).filter(x => (x.id && x.id.includes('rec')) || (x.href && x.href.includes('#')) || (x.text && x.text.length < 30 && x.text.length > 2));

      return {
        anchors: anchors.slice(0, 40),
        totalHeight: document.body.scrollHeight,
        title: document.title
      };
    })()`,
    returnByValue: true
  });

  console.log('Result:', JSON.stringify(pageInfo, null, 2));

  chrome.kill();
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
