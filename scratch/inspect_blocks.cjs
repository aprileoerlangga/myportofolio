const https = require('https');

https.get('https://legospace.tilda.ws/classicspace', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    ['682265369', '682265373', '682265376', '682265378', '682265385'].forEach(id => {
      const idx = data.indexOf(id);
      if (idx !== -1) {
        const snippet = data.substring(idx, idx + 1200).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
        console.log(`=== REC ${id} ===\n`, snippet.substring(0, 300));
      }
    });
  });
});

