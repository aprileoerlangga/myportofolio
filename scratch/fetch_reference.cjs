const https = require('https');

https.get('https://legospace.tilda.ws/classicspace', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('STATUS:', res.statusCode);
    console.log('LENGTH:', data.length);
    // Find sections or anchors like creator
    const creatorIndex = data.indexOf('creator');
    console.log('Creator index:', creatorIndex);
    if (creatorIndex !== -1) {
      console.log('Snippet around creator:\n', data.substring(creatorIndex - 200, creatorIndex + 500));
    }
    // Find background colors in style or records
    const bgMatches = data.match(/background-color:\s*[^;]+;/gi) || [];
    console.log('BG colors:', Array.from(new Set(bgMatches)).slice(0, 15));
  });
}).on('error', (err) => {
  console.error('Fetch error:', err.message);
});

