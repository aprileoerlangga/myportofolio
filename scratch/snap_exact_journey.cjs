const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');

async function testExactJourney() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9998;
  const userDataDir = path.join(os.tmpdir(), 'chrome_exact_' + Date.now());

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
  
  // Wait until the curtain loader is gone:
  console.log('Waiting for curtain loader to clear...');
  for (let i = 0; i < 40; i++) {
    const check = await send('Runtime.evaluate', {
      expression: '!!document.querySelector("button") && Array.from(document.querySelectorAll("button")).some(b => b.textContent.includes("Discover More"))'
    });
    if (check.result.value) {
      console.log('Curtain cleared, Discover More button found!');
      break;
    }
    await new Promise(r => setTimeout(r, 200));
  }
  await new Promise(r => setTimeout(r, 600));

  await screenshot('story_1_home_ready.png');

  // 2. Click "Discover More"
  console.log('Clicking Discover More...');
  await send('Runtime.evaluate', {
    expression: `(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Discover More'));
      if (btn) btn.click();
    })()`
  });

  // Wait 1.1s (during throw flight)
  await new Promise(r => setTimeout(r, 1000));
  await screenshot('story_2_throw_in_flight.png');

  // Wait 0.5s for shatter burst
  await new Promise(r => setTimeout(r, 350));
  await screenshot('story_3_shatter_impact.png');

  // Wait 1.0s to arrive on /about
  console.log('Waiting to arrive on /about...');
  await new Promise(r => setTimeout(r, 1000));
  await screenshot('story_4_about_top_settled.png');

  // 3. Scroll to Quotes
  console.log('Scrolling to Quotes section...');
  await send('Runtime.evaluate', { expression: 'window.scrollTo({ top: 520, behavior: "instant" });' });
  await new Promise(r => setTimeout(r, 700));
  await screenshot('story_5_quotes_section.png');

  // 4. Switch to Quote 3 (Blank Baseplate)
  console.log('Switching to Quote 3 (Blank Baseplate)...');
  await send('Runtime.evaluate', {
    expression: `(() => {
      const dots = Array.from(document.querySelectorAll('button[title*="Transmission"]'));
      if (dots.length >= 3) dots[2].click();
    })()`
  });
  await new Promise(r => setTimeout(r, 600));
  await screenshot('story_6_quotes_blank_baseplate.png');

  // 5. Scroll to Skills
  console.log('Scrolling to Skills matrix...');
  await send('Runtime.evaluate', { expression: 'window.scrollTo({ top: 1150, behavior: "instant" });' });
  await new Promise(r => setTimeout(r, 700));
  await screenshot('story_7_skills_assembled.png');

  ws.close();
  chrome.kill();
  console.log('Exact journey verification complete!');
}

testExactJourney().catch(console.error);

