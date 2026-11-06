const https = require('https');

https.get('https://yaas-energy.com/assets/index-DSoJKp6B.css', res => {
  let css = '';
  res.on('data', chunk => css += chunk);
  res.on('end', () => {
    // Look for :root definitions
    const rootMatches = css.match(/:root\s*\{[^}]+\}/gi) || [];
    console.log('--- ROOT VARS ---');
    rootMatches.forEach(r => {
      const vars = r.split(';').filter(v => v.includes('--font') || v.includes('--ink') || v.includes('radius'));
      console.log(vars.join('\n'));
    });
  });
}).on('error', console.error);

