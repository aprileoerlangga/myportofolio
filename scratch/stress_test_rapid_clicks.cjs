const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function main() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = 'C:\\Users\\APRILEOERLANGGA\\.gemini\\antigravity\\brain\\b483387a-7d2c-424b-95f6-cfff3297c331\\scratch\\chrome-user-data';
  
  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9226',
    `--user-data-dir=${userDataDir}`,
    '--window-size=1400,1000',
    '--hide-scrollbars',
    '--disable-gpu'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  function getVersion() {
    return new Promise((resolve, reject) => {
      http.get('http://127.0.0.1:9226/json/list', res => {
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
  await new Promise(r => setTimeout(r, 800));

  // Thoroughly test ALL 24 keys across the 4x6 grid
  const stressTest = await send('Runtime.evaluate', {
    returnByValue: true,
    awaitPromise: true,
    expression: `
      (async () => {
        const buttons = Array.from(document.querySelectorAll('#skills-section button'));
        const log = [];
        
        for (let idx = 0; idx < buttons.length; idx++) {
          const btn = buttons[idx];
          const t0 = performance.now();
          
          // Trigger pointerdown (0ms instant tap/click)
          btn.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true, button: 0 }));
          
          const wasPressed = btn.classList.contains('is-pressed');
          
          // Fast delay between clicks: 35ms
          await new Promise(r => setTimeout(r, 35));
          
          const h3 = document.querySelector('#skills-section h3')?.innerText.trim() || '';
          const t1 = performance.now();
          
          log.push({
            index: idx,
            target: btn.getAttribute('title'),
            displayed: h3,
            animatedPress: wasPressed,
            timeMs: Math.round(t1 - t0)
          });
        }
        return {
          totalButtons: buttons.length,
          log
        };
      })()
    `
  });

  console.log('All 24 Keys Rapid Test Results:');
  console.log(JSON.stringify(stressTest.result?.value, null, 2));

  // Verify no keys remain stuck after animations complete
  await new Promise(r => setTimeout(r, 300));
  const stuckCheck = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `document.querySelectorAll('#skills-section button.is-pressed').length`
  });
  console.log('Stuck buttons after release (must be 0):', stuckCheck.result?.value);

  // Verify final active key is TypeScript (index 1)
  const finalCheck = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `document.querySelector('#skills-section h3')?.innerText.trim()`
  });
  console.log('Final inspector title:', finalCheck.result?.value);

  const screenshot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:\\Users\\APRILEOERLANGGA\\.gemini\\antigravity\\brain\\b483387a-7d2c-424b-95f6-cfff3297c331\\verify_rapid_clicks_smooth.png', Buffer.from(screenshot.data, 'base64'));
  console.log('Saved screenshot to verify_rapid_clicks_smooth.png');

  ws.close();
  chromeProc.kill();
  process.exit(0);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});

