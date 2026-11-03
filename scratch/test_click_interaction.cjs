const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');

async function testClickInteraction() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9989;
  const userDataDir = path.join(os.tmpdir(), 'chrome_test_click_' + Date.now());

  const chrome = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--window-size=1440,900',
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
  await new Promise(r => setTimeout(r, 4000));

  // Dismiss loader if still there
  await send('Runtime.evaluate', {
    expression: `(() => {
      const loader = document.querySelector('.z-\\[99999\\]');
      if (loader) loader.remove();
    })()`
  });

  // Scroll to skills
  await send('Runtime.evaluate', { expression: `window.scrollTo({ top: 1350, behavior: 'instant' });` });
  await new Promise(r => setTimeout(r, 1000));

  // Test 1: Check if keycaps exist
  const probe = await send('Runtime.evaluate', {
    expression: `(() => {
      const keys = Array.from(document.querySelectorAll('#skills-section [title]'));
      return {
        keyCount: keys.length,
        titles: keys.map(k => k.getAttribute('title')),
        activeSkillH3: document.querySelector('#skills-section h3')?.innerText
      };
    })()`,
    returnByValue: true
  });
  console.log('PROBE:', probe.result.value);

  // Test 2: Click on the JS keycap (index 0)
  const clickResult = await send('Runtime.evaluate', {
    expression: `(() => {
      const keys = Array.from(document.querySelectorAll('#skills-section [title]'));
      if (!keys.length) return { error: 'No keys found' };
      keys[0].click();
      return {
        clickedTitle: keys[0].getAttribute('title'),
        newActiveH3: document.querySelector('#skills-section h3')?.innerText
      };
    })()`,
    returnByValue: true
  });
  console.log('CLICK RESULT:', clickResult.result.value);

  // Test 3: Keydown event 't' (TypeScript)
  await send('Runtime.evaluate', {
    expression: `(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 't' }));
    })()`
  });
  await new Promise(r => setTimeout(r, 200));

  const afterKeydown = await send('Runtime.evaluate', {
    expression: `document.querySelector('#skills-section h3')?.innerText`,
    returnByValue: true
  });
  console.log('AFTER KEYDOWN "t":', afterKeydown.result.value);

  ws.close();
  chrome.kill();
  process.exit(0);
}

testClickInteraction().catch(console.error);

