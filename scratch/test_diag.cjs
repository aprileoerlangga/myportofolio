const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');

async function test() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9350;
  const userDataDir = path.join(os.tmpdir(), 'chrome_diag_' + Date.now());

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

  if (!ver) {
    console.error('Could not connect to Chrome');
    chrome.kill();
    return;
  }

  const ws = new WebSocket(ver.webSocketDebuggerUrl);
  let id = 1;
  const pending = new Map();
  ws.onmessage = e => {
    const msg = JSON.parse(e.data);
    if (msg.method === 'Runtime.consoleAPICalled') {
      console.log('CONSOLE:', msg.params.args.map(a => JSON.stringify(a.value || a.description)).join(' '));
    }
    if (msg.method === 'Runtime.exceptionThrown') {
      console.error('EXCEPTION:', JSON.stringify(msg.params.exceptionDetails));
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
  const newTarget = await send('Target.createTarget', { url: 'about:blank' });
  const attach = await send('Target.attachToTarget', { targetId: newTarget.result.targetId, flatten: true });
  const sessionId = attach.result.sessionId;
  function sendS(method, params = {}) {
    return new Promise(res => {
      const msgId = id++;
      pending.set(msgId, res);
      ws.send(JSON.stringify({ id: msgId, sessionId, method, params }));
    });
  }
  await sendS('Runtime.enable');
  await sendS('Page.enable');
  await sendS('Page.navigate', { url: 'http://localhost:5173/' });
  
  // Wait for intro to finish (4s)
  await new Promise(r => setTimeout(r, 4500));

  const initialUrl = await sendS('Runtime.evaluate', { expression: 'window.location.href' });
  console.log('Initial URL:', initialUrl.result.result.value);

  const btnCheck = await sendS('Runtime.evaluate', {
    expression: 'Array.from(document.querySelectorAll("button")).map(b => b.textContent)'
  });
  console.log('Buttons found:', btnCheck.result.result.value);

  // Click Discover More button
  console.log('Triggering click...');
  await sendS('Runtime.evaluate', {
    expression: `
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Discover More'));
      if (btn) btn.click();
    `
  });

  // Track over 1.5s
  for (let i = 0; i < 8; i++) {
    await new Promise(r => setTimeout(r, 200));
    const url = await sendS('Runtime.evaluate', { expression: 'window.location.pathname' });
    const btnState = await sendS('Runtime.evaluate', { expression: 'document.querySelector("button")?.textContent' });
    console.log(`t = ${(i+1)*200}ms | path: ${url.result.result.value} | btn: ${btnState.result.result.value}`);
  }

  chrome.kill();
  process.exit(0);
}
test();
