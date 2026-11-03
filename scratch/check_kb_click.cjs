const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');

async function checkConsole() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9989;
  const userDataDir = path.join(os.tmpdir(), 'chrome_check_console_' + Date.now());

  const chrome = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--window-size=1200,800',
    '--disable-gpu',
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

  const targets = await new Promise(res => {
    http.get(`http://127.0.0.1:${port}/json/list`, r => {
      let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
    });
  });
  const pageTarget = targets.find(t => t.type === 'page') || targets[0];

  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  let id = 1;
  const pending = new Map();
  ws.onmessage = e => {
    const msg = JSON.parse(e.data);
    if (msg.method === 'Runtime.consoleAPICalled') {
      console.log('CONSOLE:', msg.params.type, msg.params.args.map(a => a.value || a.description));
    }
    if (msg.method === 'Runtime.exceptionThrown') {
      console.error('EXCEPTION:', msg.params.exceptionDetails.text, msg.params.exceptionDetails.exception?.description);
    }
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
  await new Promise(r => setTimeout(r, 3500));

  // Scroll to skills section
  await send('Runtime.evaluate', { expression: `window.scrollTo({ top: 1350, behavior: 'instant' });` });
  await new Promise(r => setTimeout(r, 1000));

  // Try to find keycaps and click one
  const clickTest = await send('Runtime.evaluate', {
    expression: `(() => {
      const keycaps = document.querySelectorAll('#skills-section .group');
      if (!keycaps.length) return { error: 'No keycaps found!' };
      const first = keycaps[0];
      const rect = first.getBoundingClientRect();
      first.click();
      return {
        keycapCount: keycaps.length,
        firstRect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
        activeTitle: document.querySelector('#skills-section h3')?.innerText
      };
    })()`,
    returnByValue: true
  });

  console.log('CLICK TEST RESULT:', JSON.stringify(clickTest.result.value, null, 2));

  // Now simulate click by coordinates using Input.dispatchMouseEvent
  const rect = clickTest.result.value.firstRect;
  console.log('Dispatching real mouse click at:', rect.left + rect.width / 2, rect.top + rect.height / 2);
  await send('Input.dispatchMouseEvent', {
    type: 'mousePressed',
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
    button: 'left',
    clickCount: 1
  });
  await send('Input.dispatchMouseEvent', {
    type: 'mouseReleased',
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
    button: 'left',
    clickCount: 1
  });
  await new Promise(r => setTimeout(r, 500));

  const afterClick = await send('Runtime.evaluate', {
    expression: `document.querySelector('#skills-section h3')?.innerText`,
    returnByValue: true
  });
  console.log('Active title after physical click:', afterClick.result.value);

  ws.close();
  chrome.kill();
  process.exit(0);
}

checkConsole().catch(console.error);

