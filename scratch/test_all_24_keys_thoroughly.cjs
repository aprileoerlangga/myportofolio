const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function main() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = 'C:\\Users\\APRILEOERLANGGA\\.gemini\\antigravity\\brain\\b483387a-7d2c-424b-95f6-cfff3297c331\\scratch\\chrome-user-thorough';
  
  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9228',
    `--user-data-dir=${userDataDir}`,
    '--window-size=1400,1000',
    '--hide-scrollbars',
    '--disable-gpu'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  function getVersion() {
    return new Promise((resolve, reject) => {
      http.get('http://127.0.0.1:9228/json/list', res => {
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

  // Thorough test: Click all 24 buttons across the 4x6 matrix sequentially with rapid 30ms interval
  const result = await send('Runtime.evaluate', {
    awaitPromise: true,
    returnByValue: true,
    expression: `
      (async () => {
        const buttons = Array.from(document.querySelectorAll('#skills-section button'));
        const logs = [];
        
        for (let i = 0; i < buttons.length; i++) {
          const btn = buttons[i];
          const t0 = performance.now();
          
          // Trigger pointerdown (the exact event user clicks with mouse/touch)
          btn.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true, button: 0 }));
          
          const hadPressedClass = btn.classList.contains('is-pressed');
          
          // Small rapid delay: 35ms (extremely fast spamming)
          await new Promise(r => setTimeout(r, 35));
          
          const displayedTitle = document.querySelector('#skills-section h3')?.innerText.trim() || '';
          const t1 = performance.now();
          
          logs.push({
            index: i,
            skillId: btn.getAttribute('data-skill-id'),
            title: btn.getAttribute('title'),
            displayedTitle,
            animatedPress: hadPressedClass,
            timeMs: Math.round(t1 - t0)
          });
        }
        
        return {
          totalCount: buttons.length,
          logs
        };
      })()
    `
  });

  console.log('24 Keys Rapid Test Results:');
  console.log(JSON.stringify(result.result?.value, null, 2));

  // Wait 200ms for animations to complete, then verify no keys are stuck in pressed state
  await new Promise(r => setTimeout(r, 300));
  const stuckCheck = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `
      document.querySelectorAll('#skills-section button.is-pressed').length
    `
  });
  console.log('Stuck buttons after release (should be 0):', stuckCheck.result?.value);

  const screenshot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:\\Users\\APRILEOERLANGGA\\.gemini\\antigravity\\brain\\b483387a-7d2c-424b-95f6-cfff3297c331\\verify_24_keys_all_stable.png', Buffer.from(screenshot.data, 'base64'));
  console.log('Screenshot saved to verify_24_keys_all_stable.png');

  ws.close();
  chromeProc.kill();
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

