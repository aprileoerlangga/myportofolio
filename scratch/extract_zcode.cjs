const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function main() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9281;
  const userDataDir = 'C:\\Users\\APRILEOERLANGGA\\my-portofolio\\scratch\\chrome_user_data_zcode';
  const chrome = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--window-size=1440,900',
    '--disable-gpu',
    `--user-data-dir=${userDataDir}`
  ]);

  await new Promise(r => setTimeout(r, 2000));

  function getVersion() {
    return new Promise((resolve, reject) => {
      http.get(`http://127.0.0.1:${port}/json/version`, res => {
        let d = '';
        res.on('data', c => d += c);
        res.on('end', () => resolve(JSON.parse(d)));
      }).on('error', reject);
    });
  }

  const ver = await getVersion();
  const ws = new WebSocket(ver.webSocketDebuggerUrl);

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
    return new Promise((resolve) => {
      const msgId = id++;
      pending.set(msgId, resolve);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  await new Promise(r => ws.onopen = r);

  const newTarget = await send('Target.createTarget', { url: 'about:blank' });
  const targetId = newTarget.result.targetId;
  const attach = await send('Target.attachToTarget', { targetId, flatten: true });
  const sessionId = attach.result.sessionId;

  function sendSession(method, params = {}) {
    return new Promise(resolve => {
      const msgId = id++;
      pending.set(msgId, resolve);
      ws.send(JSON.stringify({ id: msgId, sessionId, method, params }));
    });
  }

  await sendSession('Page.enable');
  await sendSession('Page.navigate', { url: 'https://www.zulfiannafis.com/projects' });
  await new Promise(r => setTimeout(r, 5000));

  // Get outerHTML of the hero section
  const res = await sendSession('Runtime.evaluate', {
    expression: `(() => {
      // Find element with preserve-3d
      const el = document.querySelector('[style*="rotateX"]') || document.querySelector('[style*="perspective"]') || document.querySelector('section');
      return {
        sectionClass: el ? el.className : 'not found',
        sectionStyle: el ? el.getAttribute('style') : 'not found',
        sectionParentClass: el && el.parentElement ? el.parentElement.className : 'not found',
        sectionParentStyle: el && el.parentElement ? el.parentElement.getAttribute('style') : 'not found',
        outerHTMLSnippet: el ? el.outerHTML.slice(0, 1500) : 'none'
      };
    })()`,
    returnByValue: true
  });

  console.log('Hero section info:', JSON.stringify(res.result.value, null, 2));

  // Also check if Lenis is present on window
  const checkLenis = await sendSession('Runtime.evaluate', {
    expression: `(() => {
      return {
        hasLenis: !!window.lenis || !!document.querySelector('.lenis'),
        htmlClass: document.documentElement.className,
        bodyClass: document.body.className
      };
    })()`,
    returnByValue: true
  });
  console.log('Lenis info:', JSON.stringify(checkLenis.result.value, null, 2));

  chrome.kill();
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
