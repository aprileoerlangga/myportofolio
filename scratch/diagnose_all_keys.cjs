const { spawn } = require('child_process');
const http = require('http');

async function main() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = 'C:\\Users\\APRILEOERLANGGA\\.gemini\\antigravity\\brain\\b483387a-7d2c-424b-95f6-cfff3297c331\\scratch\\chrome-user-diag';
  
  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9227',
    `--user-data-dir=${userDataDir}`,
    '--window-size=1400,1000',
    '--hide-scrollbars',
    '--disable-gpu'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  function getVersion() {
    return new Promise((resolve, reject) => {
      http.get('http://127.0.0.1:9227/json/list', res => {
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
  await send('Log.enable');
  await send('Runtime.enable');

  ws.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);
    if (data.method === 'Log.entryAdded') {
      console.log('[BROWSER LOG]', data.params.entry);
    }
    if (data.method === 'Runtime.consoleAPICalled') {
      console.log('[CONSOLE]', data.params.type, data.params.args.map(a => a.value));
    }
    if (data.method === 'Runtime.exceptionThrown') {
      console.log('[EXCEPTION]', data.params.exceptionDetails);
    }
  });

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

  // Now let's test clicking ALL 24 keys in fast succession
  const testResult = await send('Runtime.evaluate', {
    awaitPromise: true,
    returnByValue: true,
    expression: `
      (async () => {
        const buttons = Array.from(document.querySelectorAll('.keycap-btn'));
        const logs = [];
        
        // Measure performance during rapid clicking
        const startTime = performance.now();
        
        for (let i = 0; i < buttons.length; i++) {
          const btn = buttons[i];
          const t0 = performance.now();
          
          // Dispatch pointerdown, mousedown, mouseup, click
          btn.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true, button: 0 }));
          btn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, button: 0 }));
          btn.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, button: 0 }));
          btn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 }));
          
          const t1 = performance.now();
          const activeTitle = document.querySelector('h3')?.textContent;
          logs.push({
            btnIndex: i,
            title: btn.getAttribute('title'),
            displayedTitle: activeTitle,
            evalTimeMs: (t1 - t0).toFixed(2)
          });
          
          // Fast delay of 25ms between clicks
          await new Promise(r => setTimeout(r, 25));
        }
        
        const totalTime = performance.now() - startTime;
        return { totalButtons: buttons.length, logs, totalTimeMs: totalTime.toFixed(2) };
      })()
    `
  });

  console.log('Diagnosis Result:', JSON.stringify(testResult.result.value, null, 2));

  // Take screenshot
  const ss = await send('Page.captureScreenshot', { format: 'png' });
  require('fs').writeFileSync('C:\\Users\\APRILEOERLANGGA\\.gemini\\antigravity\\brain\\b483387a-7d2c-424b-95f6-cfff3297c331\\verify_all_24_keys_clicked.png', Buffer.from(ss.data, 'base64'));

  chromeProc.kill();
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

