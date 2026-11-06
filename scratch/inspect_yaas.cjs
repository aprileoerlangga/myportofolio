const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');

async function inspectYaas() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9993;
  const userDataDir = path.join(os.tmpdir(), 'chrome_yaas_' + Date.now());

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

  console.log('Navigating to yaas-energy.com...');
  await send('Page.navigate', { url: 'https://yaas-energy.com/' });
  await new Promise(r => setTimeout(r, 6000));

  // Inspect typography and text sections
  const siteAnalysis = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, p, span, div')).filter(el => {
        const text = el.innerText?.trim();
        return text && text.length > 5 && text.length < 120 && el.children.length === 0;
      });

      const fontDetails = headings.slice(0, 15).map(el => {
        const cs = window.getComputedStyle(el);
        return {
          text: el.innerText.trim().slice(0, 50),
          tag: el.tagName,
          fontFamily: cs.fontFamily,
          fontSize: cs.fontSize,
          fontWeight: cs.fontWeight,
          letterSpacing: cs.letterSpacing,
          lineHeight: cs.lineHeight,
          textTransform: cs.textTransform,
          color: cs.color
        };
      });

      // Find key marquee or sliding headline sections
      const sections = Array.from(document.querySelectorAll('section, [class*="marquee"], [class*="ticker"], [class*="slider"], [class*="hero"], [class*="quote"]')).map(s => {
        return {
          tagName: s.tagName,
          className: s.className,
          id: s.id,
          text: s.innerText?.slice(0, 120).replace(/\\s+/g, ' ')
        };
      });

      return {
        title: document.title,
        fontDetails: fontDetails,
        sections: sections.slice(0, 12)
      };
    })()`
  });

  console.log('Site analysis:', JSON.stringify(siteAnalysis.result.value, null, 2));

  // Take full page or hero screenshots
  const artifactDir = 'C:\\Users\\APRILEOERLANGGA\\.gemini\\antigravity\\brain\\b483387a-7d2c-424b-95f6-cfff3297c331';
  let snap = await send('Page.captureScreenshot', { format: 'png' });
  let b64 = snap.data || snap.result?.data;
  fs.writeFileSync(`${artifactDir}\\yaas_hero.png`, Buffer.from(b64, 'base64'));
  console.log('Saved yaas_hero.png');

  // Scroll down a bit to see the next section
  await send('Runtime.evaluate', { expression: `window.scrollBy(0, 800);` });
  await new Promise(r => setTimeout(r, 1500));
  snap = await send('Page.captureScreenshot', { format: 'png' });
  b64 = snap.data || snap.result?.data;
  fs.writeFileSync(`${artifactDir}\\yaas_scroll_800.png`, Buffer.from(b64, 'base64'));
  console.log('Saved yaas_scroll_800.png');

  // Scroll down more
  await send('Runtime.evaluate', { expression: `window.scrollBy(0, 1200);` });
  await new Promise(r => setTimeout(r, 1500));
  snap = await send('Page.captureScreenshot', { format: 'png' });
  b64 = snap.data || snap.result?.data;
  fs.writeFileSync(`${artifactDir}\\yaas_scroll_2000.png`, Buffer.from(b64, 'base64'));
  console.log('Saved yaas_scroll_2000.png');

  ws.close();
  chrome.kill();
  process.exit(0);
}

inspectYaas().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
