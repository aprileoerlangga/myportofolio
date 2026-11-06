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

  await send('Runtime.evaluate', {
    expression: `
      const el = document.getElementById('skills-section');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
    `
  });
  await new Promise(r => setTimeout(r, 800));

  // Test 1: Rapid 30ms taps
  // Test 2: Long 250ms deliberate hold clicks
  // Test 3: Hitbox check on all 24 buttons
  const testResults = await send('Runtime.evaluate', {
    awaitPromise: true,
    returnByValue: true,
    expression: `
      (async () => {
        const buttons = Array.from(document.querySelectorAll('#skills-section button'));
        const results = [];
        
        // Test 10 keys: 5 fast taps (20ms hold) + 5 deliberate holds (200ms hold)
        const sequence = [
          { idx: 0, holdMs: 20 },
          { idx: 1, holdMs: 200 },
          { idx: 2, holdMs: 20 },
          { idx: 3, holdMs: 180 },
          { idx: 4, holdMs: 20 },
          { idx: 5, holdMs: 220 },
          { idx: 6, holdMs: 20 },
          { idx: 7, holdMs: 150 },
          { idx: 8, holdMs: 20 },
          { idx: 9, holdMs: 200 },
        ];
        
        for (const item of sequence) {
          const btn = buttons[item.idx];
          const t0 = performance.now();
          
          // Dispatch pointerdown
          btn.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true, button: 0 }));
          const downRegistered = btn.classList.contains('is-pressed');
          
          // Hold duration
          await new Promise(r => setTimeout(r, item.holdMs));
          
          // While holding for long clicks (>100ms), button MUST still be pressed!
          const heldDown = btn.classList.contains('is-pressed');
          
          // Dispatch pointerup
          window.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, cancelable: true, button: 0 }));
          
          // Wait 130ms for bounce completion
          await new Promise(r => setTimeout(r, 130));
          const releasedAfterBounce = !btn.classList.contains('is-pressed');
          
          const title = document.querySelector('#skills-section h3')?.innerText.trim() || '';
          const t1 = performance.now();
          
          results.push({
            btnIndex: item.idx,
            tool: btn.getAttribute('title'),
            displayedTitle: title,
            holdDurationMs: item.holdMs,
            instantDown: downRegistered,
            heldDuringLongPress: heldDown,
            releasedCleanly: releasedAfterBounce,
            totalCycleMs: Math.round(t1 - t0)
          });
        }
        
        return results;
      })()
    `
  });

  console.log('Natural Press & Hold Test Results:');
  console.log(JSON.stringify(testResults.result?.value, null, 2));

  // Check that 0 buttons remain stuck
  const stuckCount = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `document.querySelectorAll('#skills-section button.is-pressed').length`
  });
  console.log('Stuck buttons count (must be 0):', stuckCount.result?.value);

  const screenshot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:\\Users\\APRILEOERLANGGA\\.gemini\\antigravity\\brain\\b483387a-7d2c-424b-95f6-cfff3297c331\\verify_hitbox_natural_press.png', Buffer.from(screenshot.data, 'base64'));
  console.log('Saved screenshot to verify_hitbox_natural_press.png');

  ws.close();
  chromeProc.kill();
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

