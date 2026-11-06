const { spawn } = require('child_process');
const http = require('http');

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

  // Trace 10 clicks in different positions across the matrix
  const traceResult = await send('Runtime.evaluate', {
    awaitPromise: true,
    returnByValue: true,
    expression: `
      (async () => {
        const buttons = Array.from(document.querySelectorAll('#skills-section button'));
        // 5 completely different places across the 4x6 grid:
        // Top-left (0), bottom-right (23), center (14), top-right (5), bottom-left (18)
        const sequence = [0, 23, 14, 5, 18, 2, 21, 9, 12, 17];
        const results = [];
        
        for (let i = 0; i < sequence.length; i++) {
          const btn = buttons[sequence[i]];
          const t0 = performance.now();
          
          btn.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true, button: 0 }));
          
          // Measure time for synchronous dispatch
          const tDispatch = performance.now();
          
          // Measure frame time
          await new Promise(r => requestAnimationFrame(r));
          const tRaf = performance.now();
          
          results.push({
            clickNum: i + 1,
            btnIndex: sequence[i],
            name: btn.getAttribute('title'),
            dispatchTimeMs: (tDispatch - t0).toFixed(2),
            rafTimeMs: (tRaf - tDispatch).toFixed(2),
            totalTimeMs: (tRaf - t0).toFixed(2)
          });
          
          // Wait 60ms before next click
          await new Promise(r => setTimeout(r, 60));
        }
        
        return results;
      })()
    `
  });

  console.log('Click Timing Trace:', JSON.stringify(traceResult.result?.value, null, 2));

  ws.close();
  chromeProc.kill();
  process.exit(0);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});

