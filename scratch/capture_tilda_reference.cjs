const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');

const ARTIFACT_DIR = 'C:\\Users\\APRILEOERLANGGA\\.gemini\\antigravity\\brain\\b483387a-7d2c-424b-95f6-cfff3297c331';

async function main() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9865;
  const userDataDir = path.join(os.tmpdir(), 'chrome_tilda_sets_' + Date.now());

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
      const curId = id++;
      pending.set(curId, res);
      ws.send(JSON.stringify({ id: curId, method, params }));
    });
  }

  await new Promise(r => ws.onopen = r);
  await send('Page.enable');
  await send('Page.navigate', { url: 'https://legospace.tilda.ws/classicspace' });
  await new Promise(r => setTimeout(r, 4000));

  async function takeSnap(name, y) {
    await send('Runtime.evaluate', { expression: `window.scrollTo({ top: ${y}, behavior: "instant" })` });
    await new Promise(r => setTimeout(r, 1200));
    const snap = await send('Page.captureScreenshot', { format: 'png' });
    const buf = Buffer.from(snap.result.data, 'base64');
    fs.writeFileSync(path.join(ARTIFACT_DIR, name), buf);
    console.log('Saved', name, 'at y=' + y);
  }

  // Station 2 & 3: Creator & Sets introduction
  await takeSnap('tilda_ref_2550_creator.png', 2550);
  await takeSnap('tilda_ref_3400_colors.png', 3400);
  await takeSnap('tilda_ref_4200_firstsets.png', 4200);

  // The actual sets showcase (the "Projects" equivalent)
  await takeSnap('tilda_ref_5250_sets_intro.png', 5250);
  await takeSnap('tilda_ref_5950_starfleet.png', 5950);
  await takeSnap('tilda_ref_6600_galaxy_commander.png', 6600);
  await takeSnap('tilda_ref_7300_constructors.png', 7300);

  chrome.kill();
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

