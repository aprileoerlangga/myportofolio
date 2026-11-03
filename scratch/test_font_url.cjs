const https = require('https');

const url = 'https://fonts.googleapis.com/css2?family=Righteous&family=Syne:wght@700;800;900&display=swap';

https.get(url, res => {
  let css = '';
  res.on('data', c => css += c);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('CSS preview:', css.slice(0, 300));
  });
}).on('error', console.error);

