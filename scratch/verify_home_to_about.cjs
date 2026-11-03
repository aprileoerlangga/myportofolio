const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');

async function testFullJourney() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9997;
  const userDataDir = path.join(os.tmpdir(), 'chrome_journey_' + Date.now());

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
    console.log('Saved screenshot:', name);
  }

  // 1. Load Home
  console.log('Navigating to http://localhost:5174/ ...');
  await send('Page.navigate', { url: 'http://localhost:5174/' });
  console.log('Waiting 5.5s for initial curtain loader to clear...');
  await new Promise(r => setTimeout(r, 5500));

  await screenshot('journey_1_home_ready.png');

  // 2. Click "Discover More" to throw brick
  console.log('Clicking Discover More to initiate throw & shatter...');
  await send('Runtime.evaluate', {
    expression: `(() => {
      const btn = document.querySelector('button[title*="Discover"]');
      if (btn) btn.click();
    })()`
  });

  // Wait 1.8s for throw, shatter impact, and page navigation into /about
  console.log('Waiting for throw animation and shatter impact transition into /about...');
  await new Promise(r => setTimeout(r, 2200));

  // 3. Top of About
  console.log('Capturing Top of About (landing from shatter)...');
  await send('Runtime.evaluate', { expression: 'window.scrollTo({ top: 0, behavior: "instant" });' });
  await new Promise(r => setTimeout(r, 800));
  await screenshot('journey_2_about_top_settled.png');

  // 4. Mid Scroll to Quotes (Quote 1)
  console.log('Scrolling to Quotes section...');
  await send('Runtime.evaluate', { expression: 'window.scrollTo({ top: 520, behavior: "instant" });' });
  await new Promise(r => setTimeout(r, 800));
  await screenshot('journey_3_quotes_quote1.png');

  // 5. Select Quote 3 ("Blank Baseplate" - Creed 03)
  console.log('Switching to Quote 3 (Blank Baseplate)...');
  await send('Runtime.evaluate', {
    expression: `(() => {
      const dots = Array.from(document.querySelectorAll('button[title*="Transmission"]'));
      if (dots.length >= 3) dots[2].click();
    })()`
  });
  await new Promise(r => setTimeout(r, 800));
  await screenshot('journey_4_quotes_blank_baseplate.png');

  // 6. Scroll to bottom Skills section
  console.log('Scrolling to bottom Skills section...');
  await send('Runtime.evaluate', { expression: 'window.scrollTo({ top: 1100, behavior: "instant" });' });
  await new Promise(r => setTimeout(r, 800));
  await screenshot('journey_5_skills_assembled.png');

  ws.close();
  chrome.kill();
  console.log('Journey test completed successfully!');
}

testFullJourney().catch(console.error);

