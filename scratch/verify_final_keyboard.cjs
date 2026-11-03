const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');

async function verifyFinal() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9988;
  const userDataDir = path.join(os.tmpdir(), 'chrome_final_kb_' + Date.now());

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
  await new Promise(r => setTimeout(r, 4000));

  // Dismiss loader if any
  for (let i = 0; i < 20; i++) {
    const check = await send('Runtime.evaluate', {
      expression: `(() => !document.querySelector('.z-\\[99999\\]'))()`,
      returnByValue: true
    });
    if (check.result && check.result.value) break;
    await new Promise(r => setTimeout(r, 200));
  }
  await new Promise(r => setTimeout(r, 1000));

  // 1. Scroll to view the Skills section centered
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
  await new Promise(r => setTimeout(r, 1000));

  // Capture Docked Screenshot
  let res = await send('Page.captureScreenshot', { format: 'png' });
  let buffer = Buffer.from(res.result.data, 'base64');
  const artifactDir = 'C:\\Users\\APRILEOERLANGGA\\.gemini\\antigravity\\brain\\b483387a-7d2c-424b-95f6-cfff3297c331';
  fs.writeFileSync(path.join(artifactDir, 'final_skills_docked.png'), buffer);
  console.log('Saved final_skills_docked.png');

  // Test Clicking several keycaps:
  // Let's click keycap 0 (JS), keycap 6 (Python), keycap 12 (Git), keycap 18 (Linux)
  const clickTest = await send('Runtime.evaluate', {
    expression: `(() => {
      const buttons = Array.from(document.querySelectorAll('#skills-section button[title]'));
      const initialTitle = document.querySelector('#skills-section h3')?.innerText;
      
      // Click Python (should be index 6)
      const pythonBtn = buttons.find(b => b.title.toLowerCase().includes('python'));
      if (pythonBtn) pythonBtn.click();
      
      const afterPython = document.querySelector('#skills-section h3')?.innerText;

      // Click Git
      const gitBtn = buttons.find(b => b.title.toLowerCase().includes('git '));
      if (gitBtn) gitBtn.click();
      const afterGit = document.querySelector('#skills-section h3')?.innerText;

      return {
        totalButtons: buttons.length,
        titlesFound: buttons.map(b => b.title),
        initialTitle,
        afterPython,
        afterGit
      };
    })()`,
    returnByValue: true
  });

  console.log('Click test results:', JSON.stringify(clickTest.result.value, null, 2));

  // Save screenshot with Git active
  res = await send('Page.captureScreenshot', { format: 'png' });
  buffer = Buffer.from(res.result.data, 'base64');
  fs.writeFileSync(path.join(artifactDir, 'final_skills_clicked_git.png'), buffer);
  console.log('Saved final_skills_clicked_git.png');

  ws.close();
  chrome.kill();
  process.exit(0);
}

verifyFinal().catch(console.error);

