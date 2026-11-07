const fs = require('fs');

const path = 'C:/Users/APRILEOERLANGGA/.gemini/antigravity/brain/b483387a-7d2c-424b-95f6-cfff3297c331/.system_generated/steps/9427/output.txt';
if (fs.existsSync(path)) {
  const content = fs.readFileSync(path, 'utf8');
  const hrefs = [...content.matchAll(/href="([^"]+)"/g)].map(m => m[1]);
  console.log('Unique hrefs:', [...new Set(hrefs)]);
  const titles = [...content.matchAll(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi)].map(m => m[1]);
  console.log('Headings:', titles);
}

