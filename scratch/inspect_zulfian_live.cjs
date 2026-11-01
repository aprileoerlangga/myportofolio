const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function main() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9282;
  const userDataDir = 'C:\\Users\\APRILEOERLANGGA\\my-portofolio\\scratch\\chrome_user_data_zlive';
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
  console.log('Navigating to https://www.zulfiannafis.com/projects ...');
  await sendSession('Page.navigate', { url: 'https://www.zulfiannafis.com/projects' });
  await new Promise(r => setTimeout(r, 6000));

  // Snap 1: Start
  let snap = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/zulfian_live_scroll_0.png', Buffer.from(snap.result.data, 'base64'));
  console.log('Captured zulfian_live_scroll_0.png');

  // Extract info from DOM
  const evalInfo = await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const main = document.querySelector('main') || document.body;
      const html = document.documentElement;
      const scrollHeight = html.scrollHeight;
      const innerHeight = window.innerHeight;
      
      // Look for hero parallax elements
      const allDivs = Array.from(document.querySelectorAll('div'));
      const parallaxDiv = allDivs.find(d => {
        const s = window.getComputedStyle(d);
        return s.perspective !== 'none' || s.transformStyle === 'preserve-3d';
      });

      const animatedDivs = Array.from(document.querySelectorAll('[style*="transform"]')).map(el => ({
        tag: el.tagName,
        className: el.className,
        style: el.getAttribute('style')
      }));

      return {
        scrollHeight,
        innerHeight,
        parallaxDiv: parallaxDiv ? {
          className: parallaxDiv.className,
          style: parallaxDiv.getAttribute('style'),
          computedPerspective: window.getComputedStyle(parallaxDiv).perspective,
          computedTransformStyle: window.getComputedStyle(parallaxDiv).transformStyle,
        } : null,
        animatedCount: animatedDivs.length,
        animatedSamples: animatedDivs.slice(0, 5)
      };
    })()`,
    returnByValue: true
  });

  console.log('DOM info from Zulfian:', JSON.stringify(evalInfo.result.value, null, 2));

  // Scroll 400
  await sendSession('Runtime.evaluate', {
    expression: `window.scrollTo({ top: 400, behavior: 'instant' })`
  });
  await new Promise(r => setTimeout(r, 800));
  snap = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/zulfian_live_scroll_400.png', Buffer.from(snap.result.data, 'base64'));
  console.log('Captured zulfian_live_scroll_400.png');

  // Check transform at 400
  const evalAt400 = await sendSession('Runtime.evaluate', {
    expression: `(() => {
      return Array.from(document.querySelectorAll('[style*="transform"]')).map(el => ({
        className: el.className.slice(0, 60),
        style: el.getAttribute('style')
      })).slice(0, 5);
    })()`,
    returnByValue: true
  });
  console.log('Transforms at scroll 400:', JSON.stringify(evalAt400.result.value, null, 2));

  // Scroll 1000
  await sendSession('Runtime.evaluate', {
    expression: `window.scrollTo({ top: 1000, behavior: 'instant' })`
  });
  await new Promise(r => setTimeout(r, 800));
  snap = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/zulfian_live_scroll_1000.png', Buffer.from(snap.result.data, 'base64'));
  console.log('Captured zulfian_live_scroll_1000.png');

  // Check transform at 1000
  const evalAt1000 = await sendSession('Runtime.evaluate', {
    expression: `(() => {
      return Array.from(document.querySelectorAll('[style*="transform"]')).map(el => ({
        className: el.className.slice(0, 60),
        style: el.getAttribute('style')
      })).slice(0, 5);
    })()`,
    returnByValue: true
  });
  console.log('Transforms at scroll 1000:', JSON.stringify(evalAt1000.result.value, null, 2));

  chrome.kill();
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
