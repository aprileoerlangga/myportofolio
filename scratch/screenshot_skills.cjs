const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function main() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = 'C:\\Users\\APRILEOERLANGGA\\.gemini\\antigravity\\brain\\b483387a-7d2c-424b-95f6-cfff3297c331\\scratch\\chrome-user-data';
  
  // Kill any hanging chrome on port 9222 first
  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9223',
    `--user-data-dir=${userDataDir}`,
    '--window-size=1400,1000',
    '--hide-scrollbars',
    '--disable-gpu'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  function getVersion() {
    return new Promise((resolve, reject) => {
      http.get('http://127.0.0.1:9223/json/list', res => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(JSON.parse(data)));
      }).on('error', reject);
    });
  }

  let targets = await getVersion();
  let wsUrl = targets[0]?.webSocketDebuggerUrl;
  console.log('WS URL:', wsUrl);

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
    await new Promise((resolve) => {
      ws.addEventListener('open', resolve);
    });
  }
  console.log('WS Connected!');

  await send('Page.enable');
  await send('Page.navigate', { url: 'http://localhost:5174/about' });
  console.log('Navigated to localhost:5174/about');
  await new Promise(r => setTimeout(r, 2500));

  // Scroll to skills section
  await send('Runtime.evaluate', {
    expression: `
      const el = document.getElementById('skills-section');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
    `
  });
  console.log('Scrolled to skills section');

  await new Promise(r => setTimeout(r, 2000));

  // Capture screenshot of Skills section
  const screenshot = await send('Page.captureScreenshot', {
    format: 'png'
  });

  const outPath = 'C:\\Users\\APRILEOERLANGGA\\.gemini\\antigravity\\brain\\b483387a-7d2c-424b-95f6-cfff3297c331\\verify_no_chassis_skills.png';
  fs.writeFileSync(outPath, Buffer.from(screenshot.data, 'base64'));
  console.log('Saved screenshot to:', outPath);

  // Trigger clicking 'git' key
  await send('Runtime.evaluate', {
    expression: `
      const gitKey = Array.from(document.querySelectorAll('button')).find(b => b.title && b.title.includes('Git'));
      if (gitKey) gitKey.click();
    `
  });

  await new Promise(r => setTimeout(r, 800));

  const screenshotGit = await send('Page.captureScreenshot', {
    format: 'png'
  });

  const outPathGit = 'C:\\Users\\APRILEOERLANGGA\\.gemini\\antigravity\\brain\\b483387a-7d2c-424b-95f6-cfff3297c331\\verify_no_chassis_git_clicked.png';
  fs.writeFileSync(outPathGit, Buffer.from(screenshotGit.data, 'base64'));
  console.log('Saved git clicked screenshot to:', outPathGit);

  ws.close();
  chromeProc.kill();
  process.exit(0);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
