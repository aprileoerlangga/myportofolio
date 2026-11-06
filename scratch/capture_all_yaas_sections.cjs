const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');

async function captureAllYaasSections() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9966;
  const userDataDir = path.join(os.tmpdir(), 'chrome_all_yaas_' + Date.now());

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

  // Dismiss cookie
  await send('Runtime.evaluate', {
    expression: `
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText && b.innerText.includes('Cool, got it'));
      if (btn) btn.click();
    `
  });
  await new Promise(r => setTimeout(r, 500));

  const artifactDir = 'C:\\Users\\APRILEOERLANGGA\\.gemini\\antigravity\\brain\\b483387a-7d2c-424b-95f6-cfff3297c331';

  // Let's capture at scroll positions: 0, 700, 1400, 2100, 2800, 3500, 4200
  const scrollPositions = [0, 700, 1300, 1900, 2500, 3200, 4000];
  for (let i = 0; i < scrollPositions.length; i++) {
    const scrollY = scrollPositions[i];
    await send('Runtime.evaluate', { expression: `window.scrollTo({ top: ${scrollY}, behavior: 'instant' });` });
    await new Promise(r => setTimeout(r, 800));
    let snap = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${artifactDir}\\yaas_sec_${i}_${scrollY}.png`, Buffer.from(snap.data || snap.result.data, 'base64'));
    console.log(`Saved yaas_sec_${i}_${scrollY}.png`);
  }

  // Also query all text blocks and layout structures in YAAS
  const layoutStructure = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      return Array.from(document.querySelectorAll('section, main > div, article, header')).map((s, idx) => {
        const cs = window.getComputedStyle(s);
        return {
          idx,
          tag: s.tagName,
          className: s.className,
          id: s.id,
          bg: cs.backgroundColor,
          bgImage: cs.backgroundImage ? cs.backgroundImage.slice(0, 60) : 'none',
          color: cs.color,
          height: s.offsetHeight,
          text: s.innerText?.slice(0, 200).replace(/\\s+/g, ' ')
        };
      });
    })()`
  });

  fs.writeFileSync(`${artifactDir}\\yaas_layout_structure.json`, JSON.stringify(layoutStructure.result.value, null, 2));

  ws.close();
  chrome.kill();
  process.exit(0);
}

captureAllYaasSections().catch(console.error);

