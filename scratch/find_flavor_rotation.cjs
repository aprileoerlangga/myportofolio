const https = require('https');

https.get('https://yaas-energy.com/assets/index-BRGP4ayl.js', res => {
  let js = '';
  res.on('data', chunk => js += chunk);
  res.on('end', () => {
    // Find text transitions or rotation
    let pos = js.indexOf('flavor-rotation');
    while (pos !== -1) {
      console.log('--- FLAVOR ROTATION CODE ---');
      console.log(js.slice(Math.max(0, pos - 150), Math.min(js.length, pos + 400)));
      pos = js.indexOf('flavor-rotation', pos + 400);
    }
  });
});

