const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function main() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = 'C:\\Users\\APRILEOERLANGGA\\.gemini\\antigravity\\brain\\b483387a-7d2c-424b-95f6-cfff3297c331\\scratch\\chrome-user-final-snap';
  
  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9246',
    `--user-data-dir=${userDataDir}`,
    '--window-size=1400,900',
    '--hide-scrollbars',
    '--disable-gpu'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  function getTargets() {
    return new Promise((resolve, reject) => {
      http.get('http://127.0.0.1:9246/json/list', res => {
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
  
  console.log('Waiting for loader to dismiss...');
  for (let i = 0; i < 40; i++) {
    const check = await send('Runtime.evaluate', {
      expression: `(() => !document.querySelector('.z-\\[99999\\]'))()`,
      returnByValue: true
    });
    const val = check?.result?.value ?? check?.result?.result?.value;
    if (val) {
      console.log(`Loader dismissed at iteration ${i + 1}!`);
      break;
    }
    await new Promise(r => setTimeout(r, 400));
  }
  await new Promise(r => setTimeout(r, 1200));

  const artifactDir = 'C:\\Users\\APRILEOERLANGGA\\.gemini\\antigravity\\brain\\b483387a-7d2c-424b-95f6-cfff3297c331';

  // Get max scroll and scroll to bottom (skills docked)
  const pageMetricsRaw = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => { return document.documentElement.scrollHeight - window.innerHeight; })()`
  });
  const maxScroll = pageMetricsRaw.result?.value || pageMetricsRaw.result?.result?.value;
  console.log('Max scroll:', maxScroll);

  await send('Runtime.evaluate', {
    expression: `window.scrollTo({ top: ${maxScroll}, behavior: 'instant' });`
  });
  await new Promise(r => setTimeout(r, 1500));

  let snap = await send('Page.captureScreenshot', { format: 'png' });
  let b64 = snap.data || snap.result?.data;
  fs.writeFileSync(`${artifactDir}\\skills_docked_latest_react.png`, Buffer.from(b64, 'base64'));
  console.log('Saved skills_docked_latest_react.png');

  // Click Linux key
  await send('Runtime.evaluate', {
    expression: `
      const linuxBtn = document.querySelector('[data-skill-id="linux"]');
      if (linuxBtn) linuxBtn.click();
    `
  });
  await new Promise(r => setTimeout(r, 800));

  snap = await send('Page.captureScreenshot', { format: 'png' });
  b64 = snap.data || snap.result?.data;
  fs.writeFileSync(`${artifactDir}\\skills_docked_latest_linux.png`, Buffer.from(b64, 'base64'));
  console.log('Saved skills_docked_latest_linux.png');

  chromeProc.kill();
  console.log('Finished!');
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
