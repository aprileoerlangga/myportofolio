const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function main() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = 'C:\\Users\\APRILEOERLANGGA\\.gemini\\antigravity\\brain\\b483387a-7d2c-424b-95f6-cfff3297c331\\scratch\\chrome-user-sections';
  
  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9240',
    `--user-data-dir=${userDataDir}`,
    '--window-size=1400,900',
    '--hide-scrollbars',
    '--disable-gpu'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  function getTargets() {
    return new Promise((resolve, reject) => {
      http.get('http://127.0.0.1:9240/json/list', res => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(JSON.parse(data)));
      }).on('error', reject);
    });
  }

  let targets = await getTargets();
  let wsUrl = targets[0]?.webSocketDebuggerUrl;
  const ws = new WebSocket(wsUrl);
  let id = 1;
  const pending = new Map();

  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const msgId = id++;
      pending.set(msgId, { resolve, reject });
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  ws.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);
    if (data.id && pending.has(data.id)) {
      const { resolve, reject } = pending.get(data.id);
      pending.delete(data.id);
      if (data.error) reject(data.error);
      else resolve(data.result);
    }
  });

  if (ws.readyState !== 1) {
    await new Promise((resolve) => ws.addEventListener('open', resolve));
  }

  await send('Page.enable');
  await send('Page.navigate', { url: 'http://localhost:5175/about' });
  
  console.log('Waiting for curtain loader to disappear...');
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 600));
    const chk = await send('Runtime.evaluate', {
      returnByValue: true,
      expression: `!document.body.style.overflow && document.querySelectorAll('.keycap-btn').length > 0`
    });
    const val = chk?.result?.value ?? chk?.result?.result?.value ?? chk?.value;
    console.log(`Poll ${i + 1}: ready = ${val}`);
    if (val === true) {
      console.log('Curtain fully opened and page visible!');
      break;
    }
  }
  // Extra pause for entrance fade-in
  await new Promise(r => setTimeout(r, 800));

  const artifactDir = 'C:\\Users\\APRILEOERLANGGA\\.gemini\\antigravity\\brain\\b483387a-7d2c-424b-95f6-cfff3297c331';

  // 1. Hero & Photo Section (Act 1)
  await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 0);' });
  await new Promise(r => setTimeout(r, 1200));
  let snap = await send('Page.captureScreenshot', { format: 'png' });
  let b64 = snap.data || snap.result?.data;
  fs.writeFileSync(`${artifactDir}\\verify_act1_photo_final.png`, Buffer.from(b64, 'base64'));
  console.log('Captured verify_act1_photo_final.png');

  // 2. Quotes Section (Act 2)
  await send('Runtime.evaluate', {
    expression: `
      const el = document.getElementById('quotes-section');
      if (el) {
        el.scrollIntoView({ behavior: 'instant', block: 'center' });
      } else {
        window.scrollTo(0, 850);
      }
    `
  });
  await new Promise(r => setTimeout(r, 1200));
  snap = await send('Page.captureScreenshot', { format: 'png' });
  b64 = snap.data || snap.result?.data;
  fs.writeFileSync(`${artifactDir}\\verify_act2_quotes_final.png`, Buffer.from(b64, 'base64'));
  console.log('Captured verify_act2_quotes_final.png');

  // 3. Skills Section (Act 3 - Default React)
  // Scroll to the 3D grid specifically so both left inspector and keypad are in view
  await send('Runtime.evaluate', {
    expression: `
      const el = document.querySelector('.keycap-btn');
      if (el) {
        el.scrollIntoView({ behavior: 'instant', block: 'center' });
      } else {
        window.scrollTo(0, 1800);
      }
    `
  });
  await new Promise(r => setTimeout(r, 1500));
  snap = await send('Page.captureScreenshot', { format: 'png' });
  b64 = snap.data || snap.result?.data;
  fs.writeFileSync(`${artifactDir}\\verify_act3_skills_react.png`, Buffer.from(b64, 'base64'));
  console.log('Captured verify_act3_skills_react.png');

  // 4. Click Linux key (Z)
  await send('Runtime.evaluate', {
    expression: `
      const linuxBtn = document.querySelector('[data-skill-id="linux"]');
      if (linuxBtn) linuxBtn.click();
    `
  });
  await new Promise(r => setTimeout(r, 1000));
  snap = await send('Page.captureScreenshot', { format: 'png' });
  b64 = snap.data || snap.result?.data;
  fs.writeFileSync(`${artifactDir}\\verify_act3_skills_linux.png`, Buffer.from(b64, 'base64'));
  console.log('Captured verify_act3_skills_linux.png');

  chromeProc.kill();
  console.log('All screenshots completed successfully!');
  process.exit(0);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
