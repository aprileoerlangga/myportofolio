const https = require('https');

https.get('https://yaas-energy.com/assets/index-DSoJKp6B.css', res => {
  let css = '';
  res.on('data', chunk => css += chunk);
  res.on('end', () => {
    // Find all occurrences of flavor or slide
    let idx = 0;
    while ((idx = css.indexOf('flavor-', idx)) !== -1) {
      console.log('FLAVOR MATCH:', css.slice(Math.max(0, idx - 40), Math.min(css.length, idx + 150)));
      idx += 150;
    }

    // Find font-family occurrences
    idx = 0;
    while ((idx = css.indexOf('font-family', idx)) !== -1) {
      console.log('FONT MATCH:', css.slice(idx, Math.min(css.length, idx + 80)));
      idx += 80;
    }
  });
}).on('error', console.error);

