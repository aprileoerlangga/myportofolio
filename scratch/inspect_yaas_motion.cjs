const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');

async function main() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9977;
  const userDataDir = path.join(os.tmpdir(), 'chrome_trace_yaas_' + Date.now());

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
      const msgId = id++;
      pending.set(msgId, res);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  await new Promise(r => ws.onopen = r);
  await send('Page.enable');
  await send('Runtime.enable');

  await send('Page.navigate', { url: 'https://yaas-energy.com/' });
  await new Promise(r => setTimeout(r, 5000));

  // Inspect scripts & GSAP / CSS transitions
  const animationDetails = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const details = [];
      // Look at GSAP ScrollTriggers or CSS transitions
      if (window.ScrollTrigger) {
        details.push({
          type: 'ScrollTrigger',
          triggersCount: window.ScrollTrigger.getAll().length
        });
      }
      // Inspect elements that have transform or animation
      const allEls = Array.from(document.querySelectorAll('*'));
      allEls.forEach(el => {
        const cs = window.getComputedStyle(el);
        if (cs.transform && cs.transform !== 'none' && el.innerText && el.innerText.length > 5 && el.innerText.length < 150) {
          details.push({
            tag: el.tagName,
            text: el.innerText.slice(0, 50),
            transform: cs.transform,
            transition: cs.transition,
            willChange: cs.willChange,
            overflow: cs.overflow,
            perspective: cs.perspective
          });
        }
      });
      return details.slice(0, 20);
    })()`
  });

  console.log('YAAS Animation Details:', JSON.stringify(animationDetails.result.value, null, 2));

  // Now trace scroll steps: scroll down 500px, 1000px, 1500px, 2000px, 2500px and inspect headings
  const scrollSteps = [0, 600, 1200, 1800, 2400, 3200];
  const snapshots = [];
  for (const s of scrollSteps) {
    await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${s});` });
    await new Promise(r => setTimeout(r, 800));
    const stepData = await send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        const visibleHeadings = [];
        document.querySelectorAll('h1, h2, h3, p, span, div').forEach(el => {
          const rect = el.getBoundingClientRect();
          if (rect.top >= 0 && rect.bottom <= window.innerHeight && el.innerText && el.innerText.trim().length > 10 && el.childElementCount <= 2) {
            const cs = window.getComputedStyle(el);
            if (cs.opacity !== '0' && cs.display !== 'none' && cs.visibility !== 'hidden') {
              visibleHeadings.push({
                text: el.innerText.trim().slice(0, 40),
                transform: cs.transform,
                opacity: cs.opacity,
                filter: cs.filter,
                top: Math.round(rect.top),
                class: el.className
              });
            }
          }
        });
        return visibleHeadings.slice(0, 5);
      })()`
    });
    snapshots.push({ scroll: s, elements: stepData.result.value });
  }

  console.log('Scroll Snapshots:', JSON.stringify(snapshots, null, 2));

  ws.close();
  chrome.kill();
  process.exit(0);
}

main().catch(console.error);

