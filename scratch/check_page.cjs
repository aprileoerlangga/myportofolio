const http = require('http');

async function checkPage() {
  const port = 9599; // check running targets or run one
  const targets = await new Promise((res, rej) => {
    http.get('http://127.0.0.1:9599/json/list', r => {
      let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
    }).on('error', rej);
  });
  console.log('targets:', targets);
}
checkPage().catch(console.error);

