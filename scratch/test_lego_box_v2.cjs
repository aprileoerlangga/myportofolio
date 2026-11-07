const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');

const ARTIFACT_DIR = 'C:\\Users\\APRILEOERLANGGA\\.gemini\\antigravity\\brain\\b483387a-7d2c-424b-95f6-cfff3297c331';

const testHtml = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @font-face {
    font-family: 'Arcadepix';
    src: url('file:///C:/Users/APRILEOERLANGGA/my-portofolio/public/fonts/arcadepix.ttf') format('truetype');
  }
  body {
    background: #060a17;
    color: white;
    font-family: sans-serif;
    margin: 0;
    padding: 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
  }
  .title {
    font-family: 'Arcadepix', monospace;
    font-size: 32px;
    letter-spacing: 2px;
    text-align: center;
    margin-bottom: 50px;
    text-transform: uppercase;
  }
  .yellow { color: #FFD500; text-shadow: 0 0 20px rgba(255,213,0,0.5); }
  
  .runway {
    display: flex;
    gap: 80px;
    padding: 40px;
  }

  .box-wrap {
    display: flex;
    flex-direction: column;
    width: 380px;
  }

  .box-container {
    position: relative;
    width: 380px;
    height: 250px;
    margin-left: 28px;
    margin-top: 28px;
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), filter 0.3s ease;
    cursor: pointer;
  }
  .box-container:hover {
    transform: translateY(-8px) scale(1.02);
  }

  /* TOP FACE (Seamless isometric parallelogram) */
  .box-top {
    position: absolute;
    top: -28px;
    left: -14px;
    width: 100%;
    height: 28px;
    background: linear-gradient(90deg, #b8860b 0%, #ffd500 50%, #e6ac00 100%);
    transform: skewX(-45deg);
    border-top: 1px solid rgba(255,255,255,0.6);
    border-right: 1px solid rgba(0,0,0,0.4);
    display: flex;
    align-items: center;
    padding-left: 25px;
    box-sizing: border-box;
    font-family: monospace;
    font-size: 10px;
    color: #0055bf;
    font-weight: 900;
    letter-spacing: 2px;
    z-index: 1;
  }

  /* LEFT SPINE (Seamless isometric parallelogram) */
  .box-left {
    position: absolute;
    top: -14px;
    left: -28px;
    width: 28px;
    height: 100%;
    background: linear-gradient(180deg, #c49000 0%, #a17000 50%, #6b4a00 100%);
    transform: skewY(-45deg);
    border-left: 1px solid rgba(255,255,255,0.4);
    border-bottom: 1px solid rgba(0,0,0,0.6);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 15px 0;
    box-sizing: border-box;
    z-index: 1;
  }

  /* FRONT FACE */
  .box-front {
    position: relative;
    width: 100%;
    height: 100%;
    background: #090e1c;
    border: 2px solid rgba(255,255,255,0.18);
    border-radius: 2px;
    overflow: hidden;
    box-shadow: -15px 25px 35px rgba(0,0,0,0.85), -5px 10px 15px rgba(0,0,0,0.5);
    display: flex;
    flex-direction: column;
    z-index: 2;
  }

  /* DIAGONAL LEGOLAND BANNER */
  .ribbon-wrap {
    position: absolute;
    top: 0;
    left: 0;
    width: 110px;
    height: 110px;
    overflow: hidden;
    z-index: 15;
    pointer-events: none;
  }
  .ribbon {
    position: absolute;
    top: 16px;
    left: -32px;
    width: 140px;
    background: #ffd500;
    color: #0055bf;
    font-size: 11px;
    font-weight: 900;
    text-align: center;
    letter-spacing: 1.5px;
    padding: 3.5px 0;
    transform: rotate(-45deg);
    box-shadow: 0 2px 8px rgba(0,0,0,0.6);
    border-top: 1.5px solid #fff;
    border-bottom: 1.5px solid #b8860b;
  }

  /* RED LEGO LOGO */
  .lego-badge {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 38px;
    height: 38px;
    background: #e3000b;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1.5px solid rgba(255,255,255,0.4);
    box-shadow: 0 3px 8px rgba(0,0,0,0.7);
    z-index: 15;
  }
  .lego-text {
    font-family: Impact, sans-serif;
    font-weight: 900;
    font-size: 16px;
    color: #ffd500;
    letter-spacing: -0.5px;
    text-shadow: 1px 1px 0px #000, -1px -1px 0px #fff;
    transform: skewX(-8deg);
  }

  .box-art {
    flex: 1;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background: radial-gradient(circle at center, #131c30 0%, #060a14 100%);
    padding: 10px;
  }
  .box-art img {
    max-width: 92%;
    max-height: 92%;
    object-contain: contain;
    border-radius: 6px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.85);
  }

  .box-meta {
    padding: 7px 12px;
    background: #060912;
    border-top: 1px solid rgba(255,255,255,0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 10px;
    color: #8899aa;
    font-family: monospace;
  }
  .set-num {
    color: #ffd500;
    font-weight: bold;
    font-size: 11px;
  }

  /* BELOW BOX INFO (Direct Tilda Reference styling) */
  .info-bar {
    margin-top: 24px;
    margin-left: 28px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .info-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }
  .info-title {
    font-family: 'Arcadepix', monospace;
    font-size: 19px;
    color: white;
    letter-spacing: 1px;
  }
  .info-year {
    font-family: 'Arcadepix', monospace;
    font-size: 19px;
    color: #ffd500;
  }
  .info-desc {
    font-size: 13px;
    color: #94a3b8;
    line-height: 1.5;
    margin: 0;
  }
  .info-tags {
    display: flex;
    gap: 6px;
    margin-top: 6px;
  }
  .tag {
    font-size: 10px;
    font-family: monospace;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.12);
    color: #cbd5e1;
    padding: 2px 7px;
    border-radius: 4px;
  }
</style>
</head>
<body>

  <div class="title">
    HOW "CLASSIC SPACE"<br>
    ENGINEERING BUILDS <span class="yellow">WERE CRAFTED</span>
  </div>

  <div class="runway">
    <!-- SET 1 -->
    <div class="box-wrap">
      <div class="box-container">
        <div class="box-top">MASTER BUILDER // SET 6924</div>
        <div class="box-left">
          <div style="font-family: monospace; font-size: 9px; font-weight: bold; color: #fff; transform: rotate(90deg); margin-top: 22px;">6924</div>
          <div style="width: 14px; height: 14px; background: #e3000b; border-radius: 2px;"></div>
        </div>
        <div class="box-front">
          <div class="ribbon-wrap"><div class="ribbon">LEGOLAND</div></div>
          <div class="lego-badge"><span class="lego-text">LEGO</span></div>
          <div class="box-art">
            <img src="file:///C:/Users/APRILEOERLANGGA/my-portofolio/src/assets/FishAI.png" alt="Fish AI">
          </div>
          <div class="box-meta">
            <span class="set-num">SET #6924</span>
            <span>MOBILE & AI • AGES 18+</span>
          </div>
        </div>
      </div>
      <div class="info-bar">
        <div class="info-header">
          <span class="info-title">«FISH AI DIAGNOSTICS»</span>
          <span class="info-year">2024</span>
        </div>
        <p class="info-desc">Aplikasi diagnosis cerdas penyakit ikan berbasis Computer Vision & AI dengan rekomendasi penanganan akurat.</p>
        <div class="info-tags">
          <span class="tag">Flutter</span>
          <span class="tag">TensorFlow</span>
          <span class="tag">FastAPI</span>
        </div>
      </div>
    </div>

    <!-- SET 2 -->
    <div class="box-wrap">
      <div class="box-container">
        <div class="box-top" style="background: linear-gradient(90deg, #003380 0%, #0055bf 50%, #0044a0 100%); color: #ffd500;">
          MASTER BUILDER // SET 6882
        </div>
        <div class="box-left" style="background: linear-gradient(180deg, #0044a0 0%, #003380 50%, #001f4d 100%);">
          <div style="font-family: monospace; font-size: 9px; font-weight: bold; color: #fff; transform: rotate(90deg); margin-top: 22px;">6882</div>
          <div style="width: 14px; height: 14px; background: #e3000b; border-radius: 2px;"></div>
        </div>
        <div class="box-front">
          <div class="ribbon-wrap"><div class="ribbon">LEGOLAND</div></div>
          <div class="lego-badge"><span class="lego-text">LEGO</span></div>
          <div class="box-art">
            <img src="file:///C:/Users/APRILEOERLANGGA/my-portofolio/src/assets/RosaStore.png" alt="Rosa Store">
          </div>
          <div class="box-meta">
            <span class="set-num">SET #6882</span>
            <span>FULLSTACK WEB • AGES 18+</span>
          </div>
        </div>
      </div>
      <div class="info-bar">
        <div class="info-header">
          <span class="info-title">«ROSA STORE MARKETPLACE»</span>
          <span class="info-year">2024</span>
        </div>
        <p class="info-desc">Platform e-commerce modern dengan katalog produk handphone, manajemen keranjang, dan sistem checkout instan.</p>
        <div class="info-tags">
          <span class="tag">React</span>
          <span class="tag">Node.js</span>
          <span class="tag">Tailwind</span>
        </div>
      </div>
    </div>
  </div>

</body>
</html>
`;

async function main() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9875;
  const userDataDir = path.join(os.tmpdir(), 'chrome_box_v2_' + Date.now());

  fs.writeFileSync(path.join(__dirname, 'proto_box_v2.html'), testHtml);

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
  const protoPath = path.join(__dirname, 'proto_box_v2.html').replace(/\\/g, '/');
  await send('Page.navigate', { url: `file:///${protoPath}` });
  await new Promise(r => setTimeout(r, 1500));

  const snap = await send('Page.captureScreenshot', { format: 'png' });
  const buf = Buffer.from(snap.result.data, 'base64');
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'prototype_lego_boxes_v2.png'), buf);
  console.log('Saved prototype_lego_boxes_v2.png');

  chrome.kill();
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

