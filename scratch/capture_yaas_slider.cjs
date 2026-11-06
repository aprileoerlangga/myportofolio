const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');

async function captureYaasSlider() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9995;
  const userDataDir = path.join(os.tmpdir(), 'chrome_slider_' + Date.now());

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
  await new Promise(r => setTimeout(r, 5000));

  // Dismiss cookie
  await send('Runtime.evaluate', {
    expression: `
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText && b.innerText.includes('Cool, got it'));
      if (btn) btn.click();
    `
  });

  // Scroll to flavors section
  await send('Runtime.evaluate', {
    expression: `
      const flavorSec = Array.from(document.querySelectorAll('section, div')).find(el => el.innerText && el.innerText.includes('5 FLAVORS'));
      if (flavorSec) flavorSec.scrollIntoView({ behavior: 'instant', block: 'center' });
    `
  });
  await new Promise(r => setTimeout(r, 1500));

  const artifactDir = 'C:\\Users\\APRILEOERLANGGA\\.gemini\\antigravity\\brain\\b483387a-7d2c-424b-95f6-cfff3297c331';

  let snap = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${artifactDir}\\yaas_flavors_state1.png`, Buffer.from(snap.data || snap.result.data, 'base64'));
  console.log('Saved yaas_flavors_state1.png');

  // Click next arrow
  const clickResult = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      // Find the right arrow button
      const allBtns = Array.from(document.querySelectorAll('button, svg, [role="button"]'));
      let nextBtn = allBtns.find(b => b.getAttribute('aria-label')?.toLowerCase().includes('next'));
      if (!nextBtn) {
        // Find arrow by position or text or SVG
        nextBtn = allBtns.find(b => b.innerHTML.includes('polygon') || b.innerHTML.includes('path') || b.innerText === '>' || b.innerHTML.includes('&gt;'));
      }
      if (nextBtn) {
        nextBtn.click();
        return 'Clicked ' + nextBtn.outerHTML.slice(0, 100);
      }
      return 'Next button not found';
    })()`
  });
  console.log('Click result:', clickResult.result?.value);

  await new Promise(r => setTimeout(r, 1200));
  snap = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${artifactDir}\\yaas_flavors_state2.png`, Buffer.from(snap.data || snap.result.data, 'base64'));
  console.log('Saved yaas_flavors_state2.png');

  // Check the quote section "THIS ISN'T ABOUT HYPING YOU UP"
  await send('Runtime.evaluate', {
    expression: `
      const quoteEl = Array.from(document.querySelectorAll('*')).find(el => el.innerText && el.innerText.includes('HYPING YOU UP'));
      if (quoteEl) quoteEl.scrollIntoView({ behavior: 'instant', block: 'center' });
    `
  });
  await new Promise(r => setTimeout(r, 1500));
  snap = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${artifactDir}\\yaas_quote_section.png`, Buffer.from(snap.data || snap.result.data, 'base64'));
  console.log('Saved yaas_quote_section.png');

  ws.close();
  chrome.kill();
  process.exit(0);
}

captureYaasSlider().catch(console.error);

