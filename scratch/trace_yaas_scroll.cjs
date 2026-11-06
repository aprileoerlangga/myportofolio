const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');

async function traceYaasScroll() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9955;
  const userDataDir = path.join(os.tmpdir(), 'chrome_trace_' + Date.now());

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

  await send('Page.navigate', { url: 'https://yaas-energy.com/' });
  await new Promise(r => setTimeout(r, 5000));

  // Find all text elements with their scroll behavior
  const textInfo = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const results = [];
      document.querySelectorAll('h1, h2, h3, [class*="heading"], [class*="title"], [class*="kicker"]').forEach(el => {
        const rect = el.getBoundingClientRect();
        const cs = window.getComputedStyle(el);
        if (el.innerText && el.innerText.trim().length > 3) {
          results.push({
            text: el.innerText.trim().replace(/\\s+/g, ' '),
            tag: el.tagName,
            fontFamily: cs.fontFamily,
            fontSize: cs.fontSize,
            lineHeight: cs.lineHeight,
            textTransform: cs.textTransform,
            letterSpacing: cs.letterSpacing,
            color: cs.color,
            position: cs.position,
            transform: cs.transform,
            top: rect.top,
            parentClass: el.parentElement ? el.parentElement.className : ''
          });
        }
      });
      return results;
    })()`
  });

  console.log('Headings and typography:\n', JSON.stringify(textInfo.result.value, null, 2));

  ws.close();
  chrome.kill();
  process.exit(0);
}

traceYaasScroll().catch(console.error);

