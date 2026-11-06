const https = require('https');

https.get('https://yaas-energy.com/assets/index-DSoJKp6B.css', res => {
  let css = '';
  res.on('data', chunk => css += chunk);
  res.on('end', () => {
    // Look for font-face
    const fontFaces = css.match(/@font-face\s*\{[^}]+\}/gi) || [];
    console.log('--- FONT FACES ---');
    fontFaces.forEach(f => console.log(f));

    // Look for slider or transition keyframes
    const keyframes = css.match(/@keyframes\s+[a-zA-Z0-9_\-]+\s*\{[^}]+\}/gi) || [];
    console.log('--- KEYFRAMES ---');
    keyframes.slice(0, 10).forEach(k => console.log(k));

    // Look for transition styles on typography
    const soledagoRules = css.match(/[^{}]*Soledago[^{}]*\{[^}]+\}/gi) || [];
    console.log('--- SOLEDAGO USAGE ---');
    soledagoRules.slice(0, 10).forEach(r => console.log(r));
  });
}).on('error', console.error);

