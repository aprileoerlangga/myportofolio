const https = require('https');

https.get('https://yaas-energy.com/', res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    // Find all css links and font references
    const cssMatches = data.match(/href="([^"]+\.css[^"]*)"/g) || [];
    console.log('CSS links:', cssMatches);
    const fontMatches = data.match(/font-family:[^;]+/gi) || [];
    console.log('Inline font families:', fontMatches.slice(0, 10));

    // Also look for Google Fonts or custom font names in html
    const customFonts = data.match(/fonts\.googleapis\.com[^\s"']+/g) || [];
    console.log('Google fonts:', customFonts);

    // Look for font files (.woff2, .woff, .ttf)
    const fontFiles = data.match(/[a-zA-Z0-9_\-\.\/]+\.(woff2|woff|ttf)/gi) || [];
    console.log('Font files:', Array.from(new Set(fontFiles)));
  });
}).on('error', console.error);
