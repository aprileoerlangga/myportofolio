const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');

async function inspectRefStyles() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9472;
  const userDataDir = path.join(os.tmpdir(), 'chrome_ref_styles_' + Date.now());

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
  await send('Page.navigate', { url: 'https://legospace.tilda.ws/classicspace#start' });
  await new Promise(r => setTimeout(r, 4000));

  const result = await send('Runtime.evaluate', {
    expression: `(() => {
      const elements = Array.from(document.querySelectorAll('*'));
      const bgColors = new Set();
      const fonts = new Set();
      const images = Array.from(document.querySelectorAll('img')).map(i => i.src);
      
      elements.forEach(el => {
        const style = window.getComputedStyle(el);
        if (style.backgroundColor && style.backgroundColor !== 'rgba(0, 0, 0, 0)') {
          bgColors.add(style.backgroundColor);
        }
        if (style.fontFamily) {
          fonts.add(style.fontFamily);
        }
      });
      
      return {
        bgColors: Array.from(bgColors).slice(0, 15),
        fonts: Array.from(fonts),
        sampleImages: images.slice(0, 20)
      };
    })()`,
    returnByValue: true
  });

  console.log('Styles Info:', JSON.stringify(result.result.value, null, 2));
  chrome.kill();
  process.exit(0);
}

inspectRefStyles().catch(e => {
  console.error(e);
  process.exit(1);
});

