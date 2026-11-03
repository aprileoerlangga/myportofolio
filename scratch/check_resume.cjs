const fs = require('fs');
try {
  const buf = fs.readFileSync('public/resume.pdf');
  const str = buf.toString('latin1');
  const keywords = ['html', 'css', 'tailwind', 'javascript', 'typescript', 'react', 'next', 'php', 'laravel', 'flutter', 'dart', 'python', 'java', 'sql', 'mysql', 'postgresql', 'oracle', 'mongodb', 'git', 'github', 'linux', 'docker', 'figma', 'npm', 'node', 'express'];
  const found = keywords.filter(k => new RegExp(k, 'i').test(str));
  console.log('Found in resume.pdf:', found);
} catch (e) {
  console.error(e);
}

