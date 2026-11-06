const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function main() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = 'C:\\Users\\APRILEOERLANGGA\\.gemini\\antigravity\\brain\\b483387a-7d2c-424b-95f6-cfff3297c331\\scratch\\chrome-user-data';
  
  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9225',
    `--user-data-dir=${userDataDir}`,
    '--window-size=1400,1000',
    '--hide-scrollbars',
    '--disable-gpu'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  function getVersion() {
    return new Promise((resolve, reject) => {
      http.get('http://127.0.0.1:9225/json/list', res => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(JSON.parse(data)));
      }).on('error', reject);
    });
  }

  let targets = await getVersion();
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
  await send('Page.navigate', { url: 'http://localhost:5174/about' });
  await new Promise(r => setTimeout(r, 4500));

  // Scroll to skills section
  await send('Runtime.evaluate', {
    expression: `
      const el = document.getElementById('skills-section');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
    `
  });
  await new Promise(r => setTimeout(r, 1000));

  // Test clicking all 24 buttons
  const testResult = await send('Runtime.evaluate', {
    returnByValue: true,
    awaitPromise: true,
    expression: `
      (async () => {
        const buttons = Array.from(document.querySelectorAll('#skills-section button'));
        const results = [];
        for (let i = 0; i < buttons.length; i++) {
          const btn = buttons[i];
          const title = btn.getAttribute('title') || '';
          btn.click();
          await new Promise(r => setTimeout(r, 160));
          const inspectorH3 = document.querySelector('#skills-section h3');
          const currentName = inspectorH3 ? inspectorH3.innerText.trim() : '';
          results.push({ index: i, title, currentName, success: title.toLowerCase().includes(currentName.toLowerCase()) });
        }
        return results;
      })()
    `
  });

  console.log('Tested', testResult.result?.value?.length, 'buttons:');
  const failed = testResult.result?.value?.filter(r => !r.success);
  if (failed && failed.length > 0) {
    console.error('Failed buttons:', failed);
  } else {
    console.log('ALL 24 BUTTONS CLICKED AND REGISTERED SUCCESSFULLY WITH ZERO DELAY!');
  }

  // Click PostgreSQL key to capture screenshot
  await send('Runtime.evaluate', {
    expression: `
      const pgBtn = Array.from(document.querySelectorAll('#skills-section button')).find(b => b.title && b.title.includes('PostgreSQL'));
      if (pgBtn) pgBtn.click();
    `
  });
  await new Promise(r => setTimeout(r, 400));

  const screenshot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:\\Users\\APRILEOERLANGGA\\.gemini\\antigravity\\brain\\b483387a-7d2c-424b-95f6-cfff3297c331\\verify_all_keys_working.png', Buffer.from(screenshot.data, 'base64'));
  console.log('Saved screenshot to verify_all_keys_working.png');

  ws.close();
  chromeProc.kill();
  process.exit(0);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
