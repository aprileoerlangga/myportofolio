const fs = require('fs');
const readline = require('readline');

async function getStep3181() {
  const filePath = 'C:\\Users\\APRILEOERLANGGA\\.gemini\\antigravity-ide\\brain\\0f9289f2-6cbd-4df4-8ffe-ad2c31e83c1e\\.system_generated\\logs\\transcript.jsonl';
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  for await (const line of rl) {
    const parsed = JSON.parse(line);
    if (parsed.step_index === 3181) {
      console.log('STEP 3181:');
      console.log(parsed.content);
      break;
    }
  }
}
getStep3181();
