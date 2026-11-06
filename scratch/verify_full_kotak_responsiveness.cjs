const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function main() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = 'C:\\Users\\APRILEOERLANGGA\\.gemini\\antigravity\\brain\\b483387a-7d2c-424b-95f6-cfff3297c331\\scratch\\chrome-user-fullbox';
  
  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9232',
    `--user-data-dir=${userDataDir}`,
    '--window-size=1400,1000',
    '--hide-scrollbars',
    '--disable-gpu'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  function getTargets() {
    return new Promise((resolve, reject) => {
      http.get('http://127.0.0.1:9232/json/list', res => {
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
  await send('Page.navigate', { url: 'http://localhost:5174/about' });
  
  // Wait for loader to finish and page to mount
  console.log('Waiting for loader to finish...');
  for (let i = 0; i < 15; i++) {
    await new Promise(r => setTimeout(r, 1000));
    const chk = await send('Runtime.evaluate', {
      returnByValue: true,
      expression: `document.querySelectorAll('.keycap-btn').length`
    });
    if (chk.result.value > 0) {
      console.log(`Found ${chk.result.value} keycaps after ${i + 1}s!`);
      break;
    }
  }

  // Scroll to skills section
  await send('Runtime.evaluate', {
    expression: `
      const el = document.getElementById('skills-section');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
    `
  });
  await new Promise(r => setTimeout(r, 1500));

  // 1. Test clicking all 24 keys across 5 points of the full kotak
  const testResults = await send('Runtime.evaluate', {
    returnByValue: true,
    awaitPromise: true,
    expression: `
      (async () => {
        const buttons = Array.from(document.querySelectorAll('.keycap-btn'));
        const results = [];

        for (const btn of buttons) {
          const id = btn.getAttribute('data-skill-id');
          const rect = btn.getBoundingClientRect();

          // 5 positions on full kotak: center, top, bottom, left, right
          const points = [
            { pos: 'center', x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 },
            { pos: 'top',    x: rect.left + rect.width / 2, y: rect.top + 6 },
            { pos: 'bottom', x: rect.left + rect.width / 2, y: rect.bottom - 6 },
            { pos: 'left',   x: rect.left + 6, y: rect.top + rect.height / 2 },
            { pos: 'right',  x: rect.right - 6, y: rect.top + rect.height / 2 }
          ];

          for (const pt of points) {
            const hitEl = document.elementFromPoint(pt.x, pt.y);
            const hitBtn = hitEl?.closest('.keycap-btn');
            const hitId = hitBtn?.getAttribute('data-skill-id');
            if (hitId !== id) {
              results.push({ id, pos: pt.pos, expected: id, actual: hitId });
            }
          }
        }

        return {
          totalButtons: buttons.length,
          hitboxMismatches: results
        };
      })()
    `
  });

  console.log('Hitbox Accuracy Across Full Kotak (5 points per key):', JSON.stringify(testResults.result.value, null, 2));

  // 2. Test rapid clicking across 12 keys in quick succession (60ms intervals)
  const rapidClickResults = await send('Runtime.evaluate', {
    returnByValue: true,
    awaitPromise: true,
    expression: `
      (async () => {
        const sequence = ['react', 'nextjs', 'python', 'docker', 'figma', 'git', 'laravel', 'postgres', 'tailwind', 'flutter', 'dart', 'javascript'];
        const logs = [];

        for (const skillId of sequence) {
          const btn = document.querySelector(\`[data-skill-id="\${skillId}"]\`);
          if (!btn) {
            logs.push({ skillId, error: 'Button not found' });
            continue;
          }

          // Trigger pointerdown + click
          btn.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true, button: 0 }));
          btn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 }));

          // Read active title in inspector
          const inspectorTitle = document.querySelector('#skills-section h3')?.textContent?.trim();
          logs.push({
            clicked: skillId,
            inspectorActive: inspectorTitle,
            hasPressedClass: btn.classList.contains('is-pressed')
          });

          await new Promise(r => setTimeout(r, 60));
        }

        return logs;
      })()
    `
  });

  console.log('Rapid Click Sequence Verification (12 keys):', JSON.stringify(rapidClickResults.result.value, null, 2));

  // Screenshot
  await new Promise(r => setTimeout(r, 500));
  const snap = await send('Page.captureScreenshot', { format: 'png' });
  const outPath = 'C:\\Users\\APRILEOERLANGGA\\.gemini\\antigravity\\brain\\b483387a-7d2c-424b-95f6-cfff3297c331\\verify_full_kotak_responsive.png';
  fs.writeFileSync(outPath, Buffer.from(snap.data, 'base64'));
  console.log('Saved screenshot to:', outPath);

  ws.close();
  chromeProc.kill();
}

main().catch(console.error);
