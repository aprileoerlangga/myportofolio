const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');

async function getMp4Url() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9997;
  const userDataDir = path.join(os.tmpdir(), 'chrome_tiktok_mp4_' + Date.now());

  const chrome = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--window-size=1280,900',
    '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
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

  const targets = await new Promise((res, rej) => {
    http.get(`http://127.0.0.1:${port}/json/list`, r => {
      let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
    }).on('error', rej);
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

  let videoUrl = null;
  await send('Network.enable');

  const tiktokUrl = 'https://www.tiktok.com/@rafaela_dev/video/7511754347441573126';
  await send('Page.navigate', { url: tiktokUrl });
  await new Promise(r => setTimeout(r, 5000));

  const result = await send('Runtime.evaluate', {
    expression: `(() => {
      const v = document.querySelector('video');
      return v ? v.currentSrc || v.src : null;
    })()`
  });

  console.log('Video SRC:', result.result.value);

  // Also remove modal divs permanently from DOM
  await send('Runtime.evaluate', {
    expression: `(() => {
      // remove all dialogs or modal backdrops
      document.querySelectorAll('[role="dialog"], [class*="modal"], [class*="overlay"]').forEach(el => el.remove());
      const v = document.querySelector('video');
      if (v) {
        v.style.position = 'fixed';
        v.style.top = '0';
        v.style.left = '0';
        v.style.width = '100vw';
        v.style.height = '100vh';
        v.style.zIndex = '999999';
        v.style.objectFit = 'contain';
      }
    })()`
  });

  // Capture clean frames at 0s, 1s, 2s, 3s, 4s, 5s
  for (let sec = 0; sec <= 5; sec++) {
    await send('Runtime.evaluate', {
      expression: `(() => {
        const v = document.querySelector('video');
        if (v) {
          v.currentTime = ${sec};
          v.pause();
        }
      })()`
    });
    await new Promise(r => setTimeout(r, 600));

    const res = await send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(res.result.data, 'base64');
    const targetPath = path.join('C:\\Users\\APRILEOERLANGGA\\.gemini\\antigravity\\brain\\b483387a-7d2c-424b-95f6-cfff3297c331', `clean_tiktok_sec_${sec}.png`);
    fs.writeFileSync(targetPath, buffer);
    console.log(`Saved clean frame sec ${sec}`);
  }

  ws.close();
  chrome.kill();
  process.exit(0);
}

getMp4Url().catch(e => {
  console.error(e);
  process.exit(1);
});

