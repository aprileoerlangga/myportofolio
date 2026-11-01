const { spawn } = require('child_process');
const http = require('http');

async function main() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9231;
  const userDataDir = 'C:\\Users\\APRILEOERLANGGA\\my-portofolio\\scratch\\chrome_user_data_inspect3';
  const chrome = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--window-size=1440,900',
    '--disable-gpu',
    `--user-data-dir=${userDataDir}`
  ]);

  await new Promise(r => setTimeout(r, 2000));

  function getVersion() {
    return new Promise((resolve, reject) => {
      http.get(`http://127.0.0.1:${port}/json/version`, res => {
        let d = '';
        res.on('data', c => d += c);
        res.on('end', () => resolve(JSON.parse(d)));
      }).on('error', reject);
    });
  }

  const ver = await getVersion();
  const ws = new WebSocket(ver.webSocketDebuggerUrl);

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
    return new Promise((resolve) => {
      const msgId = id++;
      pending.set(msgId, resolve);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  await new Promise(r => ws.onopen = r);

  const newTarget = await send('Target.createTarget', { url: 'about:blank' });
  const targetId = newTarget.result.targetId;
  const attach = await send('Target.attachToTarget', { targetId, flatten: true });
  const sessionId = attach.result.sessionId;

  function sendSession(method, params = {}) {
    return new Promise(resolve => {
      const msgId = id++;
      pending.set(msgId, resolve);
      ws.send(JSON.stringify({ id: msgId, sessionId, method, params }));
    });
  }

  await sendSession('Page.enable');
  await sendSession('Page.navigate', { url: 'http://localhost:5173/projects' });
  await new Promise(r => setTimeout(r, 6000));

  const info = await sendSession('Runtime.evaluate', {
    expression: `
      (() => {
        const proj = document.getElementById('projects');
        const footer = document.querySelector('footer');
        const cards = document.querySelectorAll('[class*="group/product"]');
        return {
          windowHeight: window.innerHeight,
          windowWidth: window.innerWidth,
          scrollHeight: document.documentElement.scrollHeight,
          projectsHeight: proj ? proj.offsetHeight : 0,
          footerTop: footer ? footer.getBoundingClientRect().top : 0,
          cardsCount: cards.length,
          card0: cards[0] ? {
            w: cards[0].offsetWidth,
            h: cards[0].offsetHeight,
            top: cards[0].getBoundingClientRect().top,
            bottom: cards[0].getBoundingClientRect().bottom
          } : null,
          card3: cards[3] ? {
            w: cards[3].offsetWidth,
            h: cards[3].offsetHeight,
            top: cards[3].getBoundingClientRect().top,
            bottom: cards[3].getBoundingClientRect().bottom
          } : null
        };
      })()
    `,
    returnByValue: true
  });

  console.log('DOM metrics at scroll 0:\n', JSON.stringify(info.result.value, null, 2));

  // Now scroll to 400
  await sendSession('Runtime.evaluate', { expression: 'window.scrollTo(0, 400)' });
  await new Promise(r => setTimeout(r, 1000));

  const info400 = await sendSession('Runtime.evaluate', {
    expression: `
      (() => {
        const footer = document.querySelector('footer');
        const cards = document.querySelectorAll('[class*="group/product"]');
        return {
          scrollY: window.scrollY,
          footerTop: footer ? footer.getBoundingClientRect().top : 0,
          card0_top: cards[0] ? cards[0].getBoundingClientRect().top : null,
          card0_bottom: cards[0] ? cards[0].getBoundingClientRect().bottom : null,
          card3_top: cards[3] ? cards[3].getBoundingClientRect().top : null,
          card3_bottom: cards[3] ? cards[3].getBoundingClientRect().bottom : null,
        };
      })()
    `,
    returnByValue: true
  });

  console.log('DOM metrics at scroll 400:\n', JSON.stringify(info400.result.value, null, 2));

  chrome.kill();
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
