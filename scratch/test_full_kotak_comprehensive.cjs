const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');

async function testFullKotak() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9987;
  const userDataDir = path.join(os.tmpdir(), 'chrome_full_kotak_' + Date.now());

  const chrome = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--window-size=1440,900',
    '--disable-gpu',
    `--user-data-dir=${userDataDir}`
  ]);

  let ver;
  for (let i = 0; i < 30; i++) {
    try {
      ver = await new Promise((res, rej) => {
        const req = http.get(`http://127.0.0.1:${port}/json/version`, r => {
          let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
        });
        req.on('error', rej);
        req.setTimeout(500, () => req.destroy());
      });
      if (ver) break;
    } catch {
      await new Promise(r => setTimeout(r, 200));
    }
  }

  const targets = await new Promise(res => {
    http.get(`http://127.0.0.1:${port}/json/list`, r => {
      let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
    });
  });
  const pageTarget = targets.find(t => t.type === 'page') || targets[0];

  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  let id = 1;
  const pending = new Map();
  ws.onmessage = e => {
    const msg = JSON.parse(e.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
    }
  };
  function send(method, params = {}) {
    return new Promise(res => {
      const msgId = id++;
      pending.set(msgId, res);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  await new Promise(r => ws.onopen = r);
  await send('Page.enable');
  await send('Runtime.enable');

  await send('Page.navigate', { url: 'http://localhost:5174/about' });
  await new Promise(r => setTimeout(r, 4500));

  // Dismiss loader if any
  for (let i = 0; i < 30; i++) {
    const check = await send('Runtime.evaluate', {
      expression: `(() => !document.querySelector('.z-\\[99999\\]'))()`,
      returnByValue: true
    });
    if (check.result && check.result.value) break;
    await new Promise(r => setTimeout(r, 300));
  }
  await new Promise(r => setTimeout(r, 1200));

  // Scroll to skills section
  const skillsInfo = await send('Runtime.evaluate', {
    expression: `(() => {
      const section = document.getElementById('skills-section');
      if (!section) return null;
      const rect = section.getBoundingClientRect();
      const absTop = window.scrollY + rect.top;
      return { absTop, rectTop: rect.top, height: rect.height };
    })()`,
    returnByValue: true
  });
  console.log('Skills section info:', skillsInfo.result.value);

  const targetScroll = Math.max(0, (skillsInfo.result.value?.absTop || 1200) - 80);
  console.log('Scrolling to:', targetScroll);
  await send('Runtime.evaluate', { expression: `window.scrollTo({ top: ${targetScroll}, behavior: 'instant' });` });
  await new Promise(r => setTimeout(r, 1200));

  // 1. Verify Full Kotak Boundary Hit Testing for all 24 buttons
  const hitboxEval = await send('Runtime.evaluate', {
    returnByValue: true,
    awaitPromise: true,
    expression: `
      (() => {
        const buttons = Array.from(document.querySelectorAll('#skills-section .keycap-btn'));
        const mismatches = [];

        buttons.forEach(btn => {
          const id = btn.getAttribute('data-skill-id');
          const rect = btn.getBoundingClientRect();

          // 5 sample points across the full box
          const testPoints = [
            { name: 'center', x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 },
            { name: 'top',    x: rect.left + rect.width / 2, y: rect.top + 5 },
            { name: 'bottom', x: rect.left + rect.width / 2, y: rect.bottom - 5 },
            { name: 'left',   x: rect.left + 5, y: rect.top + rect.height / 2 },
            { name: 'right',  x: rect.right - 5, y: rect.top + rect.height / 2 }
          ];

          testPoints.forEach(pt => {
            const hit = document.elementFromPoint(pt.x, pt.y);
            const hitBtn = hit?.closest('.keycap-btn');
            const hitId = hitBtn?.getAttribute('data-skill-id');
            if (hitId !== id) {
              mismatches.push({ targetId: id, point: pt.name, hitId: hitId || 'none' });
            }
          });
        });

        return {
          totalButtons: buttons.length,
          mismatchesCount: mismatches.length,
          mismatches: mismatches
        };
      })()
    `
  });
  console.log('Full Kotak Hitbox Test (120 points across 24 keys):', JSON.stringify(hitboxEval.result?.value || hitboxEval.result, null, 2));

  // 2. Perform Rapid Clicks Across Disparate Keys
  const rapidClickEval = await send('Runtime.evaluate', {
    returnByValue: true,
    awaitPromise: true,
    expression: `
      (async () => {
        const keysToTest = [
          'react', 'python', 'docker', 'figma', 'git',
          'nextjs', 'laravel', 'postgres', 'tailwind', 'linux'
        ];
        const log = [];

        for (const key of keysToTest) {
          const btn = document.querySelector(\`#skills-section .keycap-btn[data-skill-id="\${key}"]\`);
          if (!btn) {
            log.push({ key, error: 'Not found' });
            continue;
          }

          const t0 = performance.now();
          // Dispatch pointerdown
          btn.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true, button: 0 }));
          // Dispatch click
          btn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 }));
          const t1 = performance.now();

          const activeTitle = document.querySelector('#skills-section h3')?.textContent?.trim();
          log.push({
            key,
            activeTitle,
            dispatchMs: +(t1 - t0).toFixed(2),
            isPressed: btn.classList.contains('is-pressed')
          });

          await new Promise(r => setTimeout(r, 80));
        }

        return log;
      })()
    `
  });
  console.log('Rapid Click Test (10 keys in 800ms):', JSON.stringify(rapidClickEval.result?.value || rapidClickEval.result, null, 2));

  // 3. Click Git to verify final visual state and take artifact screenshot
  await send('Runtime.evaluate', {
    expression: `
      const gitBtn = document.querySelector('#skills-section .keycap-btn[data-skill-id="git"]');
      if (gitBtn) {
        gitBtn.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true, button: 0 }));
        gitBtn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 }));
      }
    `
  });
  await new Promise(r => setTimeout(r, 300));

  let res = await send('Page.captureScreenshot', { format: 'png' });
  let buffer = Buffer.from(res.result.data, 'base64');
  const artifactDir = 'C:\\Users\\APRILEOERLANGGA\\.gemini\\antigravity\\brain\\b483387a-7d2c-424b-95f6-cfff3297c331';
  fs.writeFileSync(path.join(artifactDir, 'verify_full_kotak_final.png'), buffer);
  console.log('Saved verify_full_kotak_final.png');

  ws.close();
  chrome.kill();
  process.exit(0);
}

testFullKotak().catch(console.error);
