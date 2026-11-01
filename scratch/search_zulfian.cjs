const fs = require('fs');
const readline = require('readline');

async function search() {
  const filePath = 'C:\\Users\\APRILEOERLANGGA\\.gemini\\antigravity-ide\\brain\\0f9289f2-6cbd-4df4-8ffe-ad2c31e83c1e\\.system_generated\\logs\\transcript.jsonl';
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  let found = 0;
  for await (const line of rl) {
    if (line.toLowerCase().includes('zulfian')) {
      const parsed = JSON.parse(line);
      console.log('--- FOUND ---');
      console.log('type:', parsed.type, 'step:', parsed.step_index);
      if (parsed.content) {
        console.log('content snippet:', parsed.content.slice(0, 500));
      }
      found++;
      if (found > 10) break;
    }
  }
}
search();
