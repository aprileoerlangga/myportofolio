const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');

async function extractYaasFonts() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9994;
  const userDataDir = path.join(os.tmpdir(), 'chrome_fonts_' + Date.now());

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
  await new Promise(r => setTimeout(r, 6000));

  const fontInfo = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      // Find element with "LOCKED IN" or "HYPING"
      let el = Array.from(document.querySelectorAll('*')).find(e => e.innerText && e.innerText.includes('LOCKED IN') && e.children.length === 0);
      if (!el) {
        el = Array.from(document.querySelectorAll('*')).find(e => e.innerText && e.innerText.includes('5 FLAVORS') && e.children.length === 0);
      }
      
      const cs = el ? window.getComputedStyle(el) : null;
      
      // Get all @font-face rules
      const fontFaces = [];
      for (const sheet of document.styleSheets) {
        try {
          for (const rule of sheet.cssRules) {
            if (rule.type === CSSRule.FONT_FACE_RULE) {
              fontFaces.push({
                fontFamily: rule.style.fontFamily,
                src: rule.style.src,
                fontWeight: rule.style.fontWeight,
                fontStyle: rule.style.fontStyle
              });
            }
          }
        } catch (e) {}
      }

      // Check the slider/carousel behavior
      const arrows = Array.from(document.querySelectorAll('button, svg, [class*="arrow"], [class*="prev"], [class*="next"]')).map(a => ({
        tag: a.tagName,
        className: a.className,
        outerHTML: a.outerHTML.slice(0, 150)
      }));

      return {
        targetText: el?.innerText,
        targetStyles: cs ? {
          fontFamily: cs.fontFamily,
          fontSize: cs.fontSize,
          fontWeight: cs.fontWeight,
          lineHeight: cs.lineHeight,
          letterSpacing: cs.letterSpacing,
          textTransform: cs.textTransform,
          color: cs.color
        } : null,
        fontFaces: fontFaces,
        arrows: arrows.slice(0, 10)
      };
    })()`
  });

  console.log('Font & Interaction Info:\n', JSON.stringify(fontInfo.result.value, null, 2));

  // Let's also check how the slider transitions when clicked or scrolled!
  await send('Runtime.evaluate', {
    expression: `
      // Dismiss cookie if present
      const cookieBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText && b.innerText.includes('Cool, got it'));
      if (cookieBtn) cookieBtn.click();
    `
  });

  ws.close();
  chrome.kill();
  process.exit(0);
}

extractYaasFonts().catch(err => {
  console.error(err);
  process.exit(1);
});

