const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');

async function main() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9945;
  const userDataDir = path.join(os.tmpdir(), 'chrome_vercel_' + Date.now());

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

  console.log('Navigating to https://aanggaaa.vercel.app/ ...');
  await send('Page.navigate', { url: 'https://aanggaaa.vercel.app/' });

  // Wait for loading screen to finish on root
  for (let i = 0; i < 40; i++) {
    const check = await send('Runtime.evaluate', {
      expression: `(() => !document.querySelector('.z-\\[99999\\]'))()`,
      returnByValue: true
    });
    if (check?.result?.value) {
      break;
    }
    await new Promise(r => setTimeout(r, 400));
  }
  await new Promise(r => setTimeout(r, 1500));

  // Now click on About navigation link
  await send('Runtime.evaluate', {
    expression: `(() => {
      const links = Array.from(document.querySelectorAll('a, button'));
      const aboutLink = links.find(l => l.innerText && l.innerText.trim().toLowerCase() === 'about');
      if (aboutLink) {
        aboutLink.click();
      } else {
        window.history.pushState({}, '', '/about');
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
    })()`
  });
  await new Promise(r => setTimeout(r, 2000));

  const artifactDir = 'C:\\Users\\APRILEOERLANGGA\\.gemini\\antigravity\\brain\\b483387a-7d2c-424b-95f6-cfff3297c331';

  // Find quotes section or quotes element
  const elementsInfo = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const allTextNodes = [];
      document.querySelectorAll('*').forEach(el => {
        if (el.innerText && el.innerText.includes('GREAT DIGITAL SYSTEMS') && el.children.length === 0) {
          allTextNodes.push({
            tag: el.tagName,
            class: el.className,
            text: el.innerText,
            parentClass: el.parentElement ? el.parentElement.className : '',
            grandParentClass: el.parentElement && el.parentElement.parentElement ? el.parentElement.parentElement.className : '',
            style: el.getAttribute('style')
          });
        }
      });
      return {
        allTextNodes,
        sections: Array.from(document.querySelectorAll('section, [id]')).map(s => ({
          id: s.id,
          tag: s.tagName,
          className: s.className,
          top: s.offsetTop,
          height: s.offsetHeight
        }))
      };
    })()`
  });

  console.log('Live Vercel Elements Info:', JSON.stringify(elementsInfo.result.value, null, 2));

  // Let's capture scroll frames of quotes on live vercel
  // Let's scroll down step by step: 0, 400, 700, 900, 1100, 1300, 1500, 1800
  const steps = [0, 500, 700, 850, 1000, 1200, 1500, 1800];
  for (let i = 0; i < steps.length; i++) {
    const s = steps[i];
    await send('Runtime.evaluate', { expression: `window.scrollTo({ top: ${s}, behavior: 'instant' });` });
    await new Promise(r => setTimeout(r, 600));
    const snap = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${artifactDir}\\vercel_live_scroll_${i}_${s}px.png`, Buffer.from(snap.data || snap.result.data, 'base64'));
    console.log(`Saved vercel_live_scroll_${i}_${s}px.png`);
  }

  // Also extract scripts/bundles to find the exact component code
  const scripts = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      return Array.from(document.querySelectorAll('script[src]')).map(s => s.src);
    })()`
  });
  console.log('Live Scripts:', scripts.result.value);

  ws.close();
  chrome.kill();
  process.exit(0);
}

main().catch(console.error);
