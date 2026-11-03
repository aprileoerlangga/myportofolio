const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  console.log('Launching browser to test full throw sequence & stepped Lego About page...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Load Home page
  console.log('Navigating to http://localhost:5174/ ...');
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle2' });

  // Wait for intro loader to complete (3.8s) and minifigure to arrive on baseplate (3.5s)
  console.log('Waiting for character to arrive and settle into idle...');
  await new Promise(r => setTimeout(r, 6800));

  // Capture settled idle pose (facing rada ke kiri)
  await page.screenshot({ path: path.join(__dirname, 'v2_1_idle_settled.png') });
  console.log('Captured v2_1_idle_settled.png');

  // Find and click the Discover More button
  const button = await page.waitForSelector('button', { visible: true });
  console.log('Clicking Discover More button...');
  await button.click();

  // Capture snatching & overhead windup with clamped brick inside C-hand
  await new Promise(r => setTimeout(r, 450));
  await page.screenshot({ path: path.join(__dirname, 'v2_2_overhead_windup.png') });
  console.log('Captured v2_2_overhead_windup.png');

  // Capture forward stride & release
  await new Promise(r => setTimeout(r, 380));
  await page.screenshot({ path: path.join(__dirname, 'v2_3_forward_pitch.png') });
  console.log('Captured v2_3_forward_pitch.png');

  // Capture mid-flight & shatter impact (verifying NO full-screen red wall)
  await new Promise(r => setTimeout(r, 320));
  await page.screenshot({ path: path.join(__dirname, 'v2_4_shatter_impact.png') });
  console.log('Captured v2_4_shatter_impact.png');

  // Wait for transition to /about and capture stepped Lego landscape
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(__dirname, 'v2_5_about_landed.png') });
  console.log('Captured v2_5_about_landed.png');

  // Scroll down slightly to test scroll parallax & stepped terrain stability
  await page.evaluate(() => window.scrollBy(0, 450));
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(__dirname, 'v2_6_about_scrolled.png') });
  console.log('Captured v2_6_about_scrolled.png');

  await browser.close();
  console.log('Verification complete!');
})();

