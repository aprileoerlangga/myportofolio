const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');

async function captureVideoFrames() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9996;
  const userDataDir = path.join(os.tmpdir(), 'chrome_tiktok_frames_' + Date.now());

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

  const tiktokUrl = 'https://www.tiktok.com/@rafaela_dev/video/7511754347441573126';
  await send('Page.navigate', { url: tiktokUrl });
  await new Promise(r => setTimeout(r, 4000));

  // Dismiss modal: click the "Got it" button or remove modal overlay
  await send('Runtime.evaluate', {
    expression: `(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const gotIt = btns.find(b => b.innerText.includes('Got it') || b.innerText.includes('got it'));
      if (gotIt) gotIt.click();

      // unmute and play video
      const v = document.querySelector('video');
      if (v) {
        v.muted = true;
        v.play();
        return { hasVideo: true, duration: v.duration, src: v.src };
      }
      return { hasVideo: false };
    })()`
  });

  await new Promise(r => setTimeout(r, 1000));

  // Capture 6 frames across 5 seconds of video
  for (let f = 1; f <= 6; f++) {
    await send('Runtime.evaluate', {
      expression: `(() => {
        const v = document.querySelector('video');
        if (v) {
          v.currentTime = ${f * 1.2};
          v.pause();
        }
      })()`
    });
    await new Promise(r => setTimeout(r, 600));

    const res = await send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(res.result.data, 'base64');
    const targetPath = path.join('C:\\Users\\APRILEOERLANGGA\\.gemini\\antigravity\\brain\\b483387a-7d2c-424b-95f6-cfff3297c331', `tiktok_frame_${f}.png`);
    fs.writeFileSync(targetPath, buffer);
    console.log(`Saved frame ${f}`);
  }

  ws.close();
  chrome.kill();
  process.exit(0);
}

captureVideoFrames().catch(e => {
  console.error(e);
  process.exit(1);
});

