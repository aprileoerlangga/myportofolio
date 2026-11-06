const fs = require('fs');

// Check uploaded file path
const uploadedPath = 'C:\\Users\\APRILEOERLANGGA\\.gemini\\antigravity\\brain\\b483387a-7d2c-424b-95f6-cfff3297c331\\.user_uploaded\\media_1793844129357_f576a612.jpg';
console.log('Exists:', fs.existsSync(uploadedPath));
console.log('Size:', fs.statSync(uploadedPath).size);

