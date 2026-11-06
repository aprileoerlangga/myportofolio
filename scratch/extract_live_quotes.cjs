const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');

async function main() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9956;
  const userDataDir = path.join(os.tmpdir(), 'chrome_live_extract_' + Date.now());

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

  // Wait for loading curtain
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

  // Navigate to About
  await send('Runtime.evaluate', {
    expression: `(() => {
      const links = Array.from(document.querySelectorAll('a, button'));
      const aboutLink = links.find(l => l.innerText && l.innerText.trim().toLowerCase() === 'about');
      if (aboutLink) aboutLink.click();
    })()`
  });
  await new Promise(r => setTimeout(r, 1500));

  // Find the exact outer HTML of the quotes element
  const quotesHTML = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const all = Array.from(document.querySelectorAll('*'));
      const textEl = all.find(el => el.innerText && el.innerText.includes('GREAT DIGITAL') && el.innerText.includes('BRICK BY BRICK'));
      if (!textEl) return 'Not found';

      // find parent section or container
      let cur = textEl;
      let section = null;
      while (cur && cur !== document.body) {
        if (cur.tagName === 'SECTION' || cur.id.includes('quote') || (cur.className && typeof cur.className === 'string' && (cur.className.includes('relative') || cur.className.includes('min-h')))) {
          section = cur;
        }
        cur = cur.parentElement;
      }
      return {
        targetTag: textEl.tagName,
        targetClass: textEl.className,
        parentTag: textEl.parentElement ? textEl.parentElement.tagName : null,
        parentClass: textEl.parentElement ? textEl.parentElement.className : null,
        parentStyle: textEl.parentElement ? textEl.parentElement.getAttribute('style') : null,
        grandParentClass: textEl.parentElement && textEl.parentElement.parentElement ? textEl.parentElement.parentElement.className : null,
        outerHTML: (section || textEl.parentElement || textEl).outerHTML
      };
    })()`
  });

  const res = quotesHTML?.result?.result?.value || quotesHTML?.result?.value;
  console.log('Quotes structure on Live Vercel:', res);
  if (res && res.outerHTML) {
    fs.writeFileSync('scratch/live_vercel_quotes.html', res.outerHTML);
    console.log('Wrote scratch/live_vercel_quotes.html');
  }

  // Also extract the JS bundles to find the original source code!
  const scriptUrls = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `Array.from(document.querySelectorAll('script[src]')).map(s => s.src)`
  });
  console.log('Scripts:', scriptUrls?.result?.result?.value || scriptUrls?.result?.value);

  ws.close();
  chrome.kill();
  process.exit(0);
}

main().catch(console.error);
