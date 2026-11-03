const https = require('https');

https.get('https://legospace.tilda.ws/classicspace', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    // Find all t-rec blocks (Tilda records)
    const recRegex = /id="rec(\d+)"[^>]*class="([^"]*)"[^>]*data-record-type="([^"]*)"/g;
    let match;
    const blocks = [];
    while ((match = recRegex.exec(data)) !== null) {
      const recId = match[1];
      const startIdx = match.index;
      const snippet = data.substring(startIdx, startIdx + 800);
      const bgMatch = snippet.match(/data-bg-color="([^"]*)"/) || snippet.match(/background-color:\s*([^;"]+)/);
      const textSnippet = snippet.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 100);
      blocks.push({ id: recId, bg: bgMatch ? bgMatch[1] : null, text: textSnippet });
    }
    console.log('BLOCKS COUNT:', blocks.length);
    blocks.forEach((b, i) => console.log(`Block ${i} [${b.id}]: bg=${b.bg} | text=${b.text}`));
  });
});

