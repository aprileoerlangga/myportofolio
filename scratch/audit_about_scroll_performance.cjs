const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');

async function auditScroll() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9986;
  const userDataDir = path.join(os.tmpdir(), 'chrome_perf_audit_' + Date.now());

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
  await new Promise(r => setTimeout(r, 1000));

  // Setup performance profiler in page
  await send('Runtime.evaluate', {
    expression: `
      window.__scrollPerfData = {
        frameDurations: [],
        longFrames: 0,
        startTime: performance.now(),
        lastTime: performance.now(),
      };
      function trackFrame() {
        const now = performance.now();
        const delta = now - window.__scrollPerfData.lastTime;
        window.__scrollPerfData.lastTime = now;
        window.__scrollPerfData.frameDurations.push(delta);
        if (delta > 33.3) {
          window.__scrollPerfData.longFrames++;
        }
        window.__rafId = requestAnimationFrame(trackFrame);
      }
      window.__rafId = requestAnimationFrame(trackFrame);
    `
  });

  // Get total scroll height
  const pageMetricsRaw = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `
      (() => {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        return {
          maxScroll,
          scrollHeight: document.documentElement.scrollHeight,
          innerHeight: window.innerHeight
        };
      })()
    `
  });
  const pageMetrics = pageMetricsRaw.result?.value || pageMetricsRaw.result?.result?.value;
  console.log('Page Metrics:', pageMetrics);

  const maxScroll = pageMetrics.maxScroll;
  const artifactDir = 'C:\\Users\\APRILEOERLANGGA\\.gemini\\antigravity\\brain\\b483387a-7d2c-424b-95f6-cfff3297c331';

  // Smoothly scroll through 5 key stages and take snapshots
  const stages = [
    { name: 'stage_0_top_hero', progress: 0.0 },
    { name: 'stage_1_bio_lift', progress: 0.25 },
    { name: 'stage_2_quotes_mid', progress: 0.50 },
    { name: 'stage_3_skills_approach', progress: 0.75 },
    { name: 'stage_4_skills_docked', progress: 1.0 },
  ];

  for (const st of stages) {
    const targetY = Math.round(maxScroll * st.progress);
    await send('Runtime.evaluate', {
      expression: `window.scrollTo({ top: ${targetY}, behavior: 'instant' });`
    });
    await new Promise(r => setTimeout(r, 800));

    const snap = await send('Page.captureScreenshot', { format: 'png' });
    const snapData = snap.result?.data || snap.data;
    const snapPath = path.join(artifactDir, `scroll_${st.name}.png`);
    fs.writeFileSync(snapPath, Buffer.from(snapData, 'base64'));
    console.log(`Captured ${st.name} at scrollY=${targetY} (${(st.progress*100).toFixed(0)}%)`);
  }

  // Stop frame tracking and gather statistics
  const perfResultsRaw = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `
      (() => {
        cancelAnimationFrame(window.__rafId);
        const durations = window.__scrollPerfData.frameDurations.slice(5); // skip initial warm-up frames
        if (durations.length === 0) return { error: 'No frames' };
        
        const sum = durations.reduce((a, b) => a + b, 0);
        const avgFrameMs = sum / durations.length;
        const avgFps = 1000 / avgFrameMs;
        const p95 = durations.slice().sort((a,b)=>a-b)[Math.floor(durations.length * 0.95)];
        const max = Math.max(...durations);

        return {
          totalFrames: durations.length,
          avgFps: Math.round(avgFps),
          avgFrameMs: +avgFrameMs.toFixed(2),
          p95FrameMs: +p95.toFixed(2),
          maxFrameMs: +max.toFixed(2),
          longFramesCount: window.__scrollPerfData.longFrames
        };
      })()
    `
  });
  const perfData = perfResultsRaw.result?.value || perfResultsRaw.result?.result?.value;
  console.log('Scroll Performance Statistics:', JSON.stringify(perfData, null, 2));

  ws.close();
  chrome.kill();
  process.exit(0);
}

auditScroll().catch(console.error);
