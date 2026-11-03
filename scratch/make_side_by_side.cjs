const fs = require('fs');
const path = require('path');

// Generate an HTML comparison page and snap it
const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Side by Side Comparison</title>
  <style>
    body {
      margin: 0;
      padding: 24px;
      background: #030408;
      color: #fff;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    .header {
      text-align: center;
      margin-bottom: 24px;
    }
    .header h1 {
      margin: 0 0 6px 0;
      font-size: 24px;
      color: #FFD500;
    }
    .header p {
      margin: 0;
      color: #94a3b8;
      font-size: 14px;
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      max-width: 1360px;
      margin: 0 auto;
    }
    .card {
      background: #0b0f19;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .card-title {
      padding: 12px 18px;
      font-weight: 700;
      font-size: 14px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .card-body {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #000;
      min-height: 480px;
    }
    .card-body img {
      max-width: 100%;
      max-height: 480px;
      object-fit: contain;
    }
    .badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-family: monospace;
    }
    .badge-target { background: #38BDF8; color: #000; }
    .badge-live { background: #10B981; color: #000; }
  </style>
</head>
<body>
  <div class="header">
    <h1>PERBANDINGAN KEYBOARD 3D DENGAN REFERENSI TIKTOK</h1>
    <p>Posisi sudut miring, tanpa meja / frame hitam tebal, dan mempertahankan 24 skills tools portfolio</p>
  </div>
  <div class="grid">
    <div class="card">
      <div class="card-title">
        <span>REFERENSI TARGET (Gambar dari Video TikTok)</span>
        <span class="badge badge-target">TARGET ASLI</span>
      </div>
      <div class="card-body">
        <img src="file:///C:/Users/APRILEOERLANGGA/.gemini/antigravity/brain/b483387a-7d2c-424b-95f6-cfff3297c331/.user_uploaded/media_1793671138579_86a952e5.jpg" />
      </div>
    </div>
    <div class="card">
      <div class="card-title">
        <span>HASIL IMPLEMENTASI LIVE PORTFOLIO KITA</span>
        <span class="badge badge-live">LIVE TERPASANG</span>
      </div>
      <div class="card-body">
        <img src="file:///C:/Users/APRILEOERLANGGA/.gemini/antigravity/brain/b483387a-7d2c-424b-95f6-cfff3297c331/kb_stage3_docked.png" />
      </div>
    </div>
  </div>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'compare_ref_docked.html'), htmlContent);
console.log('Written compare_ref_docked.html');

