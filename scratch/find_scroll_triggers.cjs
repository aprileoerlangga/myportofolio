const https = require('https');

https.get('https://yaas-energy.com/assets/index-BRGP4ayl.js', res => {
  let js = '';
  res.on('data', chunk => js += chunk);
  res.on('end', () => {
    // Search for ScrollTrigger.create or gsap.to
    let pos = 0;
    let count = 0;
    while ((pos = js.indexOf('ScrollTrigger', pos)) !== -1 && count < 6) {
      console.log('--- SCROLLTRIGGER MATCH ---');
      console.log(js.slice(Math.max(0, pos - 80), Math.min(js.length, pos + 250)));
      pos += 250;
      count++;
    }
  });
});

