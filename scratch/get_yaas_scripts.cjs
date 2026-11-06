const https = require('https');

https.get('https://yaas-energy.com/', res => {
  let html = '';
  res.on('data', chunk => html += chunk);
  res.on('end', () => {
    // Find all script tags
    const scriptMatches = html.match(/src="([^"]+\.js[^"]*)"/g) || [];
    console.log('JS files:', scriptMatches);
  });
});

