const https = require('https');

https.get('https://yaas-energy.com/', res => {
  let html = '';
  res.on('data', c => html += c);
  res.on('end', () => {
    const jsMatch = html.match(/src="(\/assets\/index-[^"]+\.js)"/);
    if (!jsMatch) {
      console.log('No JS bundle found');
      return;
    }
    const jsUrl = 'https://yaas-energy.com' + jsMatch[1];
    console.log('Fetching JS bundle:', jsUrl);
    https.get(jsUrl, jsRes => {
      let js = '';
      jsRes.on('data', c => js += c);
      jsRes.on('end', () => {
        console.log('JS length:', js.length);
        // Find mention of "THIS ISN'T" or "LOCKED IN"
        const idx = js.indexOf("THIS ISN'T");
        if (idx !== -1) {
          console.log('Snippet around quote:', js.slice(Math.max(0, idx - 400), idx + 600));
        } else {
          console.log('Could not find exact text, searching for "locked in"...');
          const idx2 = js.toLowerCase().indexOf("locked in");
          if (idx2 !== -1) {
            console.log('Snippet around locked in:', js.slice(Math.max(0, idx2 - 400), idx2 + 600));
          }
        }
      });
    });
  });
});

