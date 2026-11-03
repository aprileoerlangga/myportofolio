const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');

async function inspectSites() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9797;
  const userDataDir = path.join(os.tmpdir(), 'chrome_cdp_inspect_' + Date.now());

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
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  async function screenshot(name) {
    const res = await send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(res.result.data, 'base64');
    const targetPath = path.join('C:\\Users\\APRILEOERLANGGA\\.gemini\\antigravity\\brain\\b483387a-7d2c-424b-95f6-cfff3297c331', name);
    fs.writeFileSync(targetPath, buffer);
    console.log('Saved screenshot:', targetPath);
  }

  // 1. Inspect YAAS Energy
  console.log('Navigating to https://yaas-energy.com/ ...');
  try {
    await send('Page.navigate', { url: 'https://yaas-energy.com/' });
    await new Promise(r => setTimeout(r, 6000));
    await screenshot('yaas_home.png');

    // Scroll YAAS Energy to see text layouts
    await send('Runtime.evaluate', { expression: 'window.scrollBy(0, 800)' });
    await new Promise(r => setTimeout(r, 1500));
    await screenshot('yaas_scroll1.png');

    await send('Runtime.evaluate', { expression: 'window.scrollBy(0, 1000)' });
    await new Promise(r => setTimeout(r, 1500));
    await screenshot('yaas_scroll2.png');

    await send('Runtime.evaluate', { expression: 'window.scrollBy(0, 1200)' });
    await new Promise(r => setTimeout(r, 1500));
    await screenshot('yaas_scroll3.png');
  } catch (e) {
    console.error('Error loading YAAS:', e);
  }

  // 2. Inspect Lego Classic Space
  console.log('Navigating to https://legospace.tilda.ws/classicspace#creator ...');
  try {
    await send('Page.navigate', { url: 'https://legospace.tilda.ws/classicspace#creator' });
    await new Promise(r => setTimeout(r, 5000));
    await screenshot('legospace_creator.png');

    // Scroll around creator
    await send('Runtime.evaluate', { expression: 'window.scrollBy(0, 500)' });
    await new Promise(r => setTimeout(r, 1200));
    await screenshot('legospace_creator_s1.png');

    await send('Runtime.evaluate', { expression: 'window.scrollBy(0, 700)' });
    await new Promise(r => setTimeout(r, 1200));
    await screenshot('legospace_creator_s2.png');
  } catch (e) {
    console.error('Error loading Lego Space:', e);
  }

  ws.close();
  chrome.kill();
  console.log('Done inspecting!');
}

inspectSites().catch(e => {
  console.error(e);
  process.exit(1);
});

