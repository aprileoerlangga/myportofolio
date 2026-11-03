const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');

async function captureFullFlow() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9996;
  const userDataDir = path.join(os.tmpdir(), 'chrome_cdp_flow_' + Date.now());

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
  
  // Wait 4.5 seconds for loader curtain to fully exit
  console.log('Waiting for curtain loader to dismiss...');
  await new Promise(r => setTimeout(r, 4500));

  async function screenshot(name) {
    const res = await send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(res.result.data, 'base64');
    const targetPath = path.join('C:\\Users\\APRILEOERLANGGA\\.gemini\\antigravity\\brain\\b483387a-7d2c-424b-95f6-cfff3297c331', name);
    fs.writeFileSync(targetPath, buffer);
    console.log('Saved screenshot:', name);
  }

  // Measure page heights
  const layoutInfo = await send('Runtime.evaluate', {
    expression: `(() => {
      return {
        scrollHeight: document.documentElement.scrollHeight,
        innerHeight: window.innerHeight,
        quotesTop: document.querySelector('.max-w-4xl')?.offsetTop || 0,
        skillsTop: document.querySelector('.mt-16.sm\\:mt-24')?.offsetTop || 0
      };
    })()`,
    returnByValue: true
  });
  console.log('Layout info:', layoutInfo.result.value);

  // 1. TOP OF ABOUT (scrollY = 0)
  console.log('1. Capturing Top Hero (Scroll 0)...');
  await send('Runtime.evaluate', { expression: 'window.scrollTo({ top: 0, behavior: "instant" });' });
  await new Promise(r => setTimeout(r, 600));
  await screenshot('flow_1_top_bio.png');

  // 2. MID SCROLL: QUOTES SECTION CENTERED
  console.log('2. Capturing Quotes Section (Scroll 450)...');
  await send('Runtime.evaluate', { expression: 'window.scrollTo({ top: 450, behavior: "instant" });' });
  await new Promise(r => setTimeout(r, 600));
  await screenshot('flow_2_quotes_quote1.png');

  // Switch to Quote 3 (Blank Baseplate) to match user's image
  console.log('Switching to Quote 3 (Blank Baseplate)...');
  await send('Runtime.evaluate', {
    expression: `(() => {
      const dots = Array.from(document.querySelectorAll('button[title*="Transmission"]'));
      if (dots.length >= 3) dots[2].click();
    })()`
  });
  await new Promise(r => setTimeout(r, 600));
  await screenshot('flow_3_quotes_blank_baseplate.png');

  // 3. BOTTOM SCROLL: SKILLS SECTION
  console.log('3. Capturing Skills Section (Scroll 1000)...');
  await send('Runtime.evaluate', { expression: 'window.scrollTo({ top: 1000, behavior: "instant" });' });
  await new Promise(r => setTimeout(r, 600));
  await screenshot('flow_4_skills_assembled.png');

  ws.close();
  chrome.kill();
  console.log('Full flow capture complete!');
}

captureFullFlow().catch(console.error);

