const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');

async function verifyTransition() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9995;
  const userDataDir = path.join(os.tmpdir(), 'chrome_cdp_verify_' + Date.now());

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

  console.log('Navigating to http://localhost:5174/about ...');
  await send('Page.navigate', { url: 'http://localhost:5174/about' });
  await new Promise(r => setTimeout(r, 3500));

  async function screenshot(name) {
    const res = await send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(res.result.data, 'base64');
    const targetPath = path.join('C:\\Users\\APRILEOERLANGGA\\.gemini\\antigravity\\brain\\b483387a-7d2c-424b-95f6-cfff3297c331', name);
    fs.writeFileSync(targetPath, buffer);
    console.log('Saved screenshot:', targetPath);
  }

  // 1. STEP 1: TOP (scrollY = 0) - Scattered floor pieces from Home shatter
  console.log('Capturing Step 1: Top Hero...');
  await send('Runtime.evaluate', { expression: 'window.scrollTo({ top: 0, behavior: "instant" });' });
  await new Promise(r => setTimeout(r, 800));
  await screenshot('verify_1_top_hero.png');

  // 2. STEP 2: LIFT OFF (scrollY = 300) - Pieces lifting off floor
  console.log('Capturing Step 2: Liftoff...');
  await send('Runtime.evaluate', { expression: 'window.scrollTo({ top: 300, behavior: "instant" });' });
  await new Promise(r => setTimeout(r, 800));
  await screenshot('verify_2_liftoff.png');

  // 3. STEP 3: QUOTES FLANK (scrollY = 600) - Quotes section with wings
  console.log('Capturing Step 3: Mid Quotes (Quote 1)...');
  await send('Runtime.evaluate', { expression: 'window.scrollTo({ top: 600, behavior: "instant" });' });
  await new Promise(r => setTimeout(r, 800));
  await screenshot('verify_3_mid_quotes1.png');

  // Switch to Quote 3 (Blank Baseplate) to match user's image exactly
  console.log('Switching to Quote 3 (Blank Baseplate)...');
  await send('Runtime.evaluate', {
    expression: `(() => {
      const dots = Array.from(document.querySelectorAll('button[title*="Transmission"]'));
      if (dots.length >= 3) dots[2].click();
    })()`
  });
  await new Promise(r => setTimeout(r, 800));
  await screenshot('verify_3_mid_quotes3_blank_baseplate.png');

  // 4. STEP 4: APPROACHING ASSEMBLY (scrollY = 900)
  console.log('Capturing Step 4: Approaching Assembly...');
  await send('Runtime.evaluate', { expression: 'window.scrollTo({ top: 900, behavior: "instant" });' });
  await new Promise(r => setTimeout(r, 800));
  await screenshot('verify_4_approaching_assembly.png');

  // 5. STEP 5: FINAL ASSEMBLED BATTLEMENT TOWERS (scrollY = 1250) - Skills section
  console.log('Capturing Step 5: Skills Bottom...');
  await send('Runtime.evaluate', { expression: 'window.scrollTo({ top: 1250, behavior: "instant" });' });
  await new Promise(r => setTimeout(r, 800));
  await screenshot('verify_5_skills_assembled.png');

  ws.close();
  chrome.kill();
  console.log('All verification snapshots completed!');
}

verifyTransition().catch(console.error);

