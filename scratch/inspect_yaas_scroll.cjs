const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');

async function inspectYaasScroll() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9991;
  const userDataDir = path.join(os.tmpdir(), 'chrome_cdp_yaas_' + Date.now());

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
  await send('DOM.enable');

  console.log('Navigating to https://yaas-energy.com/ ...');
  await send('Page.navigate', { url: 'https://yaas-energy.com/' });
  await new Promise(r => setTimeout(r, 6000));

  // Extract font definitions, styles, typography
  const details = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const fonts = [];
      for (const sheet of document.styleSheets) {
        try {
          for (const rule of sheet.cssRules) {
            if (rule instanceof CSSFontFaceRule) {
              fonts.push({
                fontFamily: rule.style.fontFamily,
                src: rule.style.src
              });
            }
          }
        } catch(e) {}
      }

      // Check headings and text elements
      const elements = [];
      document.querySelectorAll('h1, h2, h3, [class*="title"], [class*="text"], [class*="heading"]').forEach(el => {
        const text = el.innerText ? el.innerText.trim() : '';
        if (text && text.length > 5 && text.length < 100) {
          const comp = window.getComputedStyle(el);
          elements.push({
            tag: el.tagName,
            text,
            fontFamily: comp.fontFamily,
            fontSize: comp.fontSize,
            fontWeight: comp.fontWeight,
            letterSpacing: comp.letterSpacing,
            textTransform: comp.textTransform,
            lineHeight: comp.lineHeight,
            className: el.className
          });
        }
      });

      // Check scripts for animation libraries (GSAP, Framer, Lenis, Locomotive, etc.)
      const scripts = Array.from(document.querySelectorAll('script')).map(s => s.src).filter(Boolean);

      return { fonts, elements: elements.slice(0, 15), scripts };
    })()`
  });

  console.log('YAAS details:', JSON.stringify(details.result.value, null, 2));

  // Capture step-by-step scroll screenshots around the text transition section
  for (let step = 0; step <= 8; step++) {
    const scrollY = step * 350;
    await send('Runtime.evaluate', { expression: 'window.scrollTo(0, ' + scrollY + ')' });
    await new Promise(r => setTimeout(r, 600));
    const res = await send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(res.result.data, 'base64');
    fs.writeFileSync(path.join('C:\\Users\\APRILEOERLANGGA\\.gemini\\antigravity\\brain\\b483387a-7d2c-424b-95f6-cfff3297c331', 'yaas_step_' + step + '.png'), buffer);
    console.log('Captured step', step, 'at scrollY', scrollY);
  }

  ws.close();
  chrome.kill();
  console.log('Done!');
}

inspectYaasScroll().catch(console.error);

