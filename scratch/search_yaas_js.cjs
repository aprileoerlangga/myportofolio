const https = require('https');

https.get('https://yaas-energy.com/assets/index-BRGP4ayl.js', res => {
  let js = '';
  res.on('data', chunk => js += chunk);
  res.on('end', () => {
    console.log('JS length:', js.length);
    // Search for keywords like "scroll", "ScrollTrigger", "gsap", "IntersectionObserver", "lenis"
    const lenis = js.includes('lenis');
    const gsap = js.includes('gsap') || js.includes('ScrollTrigger');
    console.log('Has Lenis:', lenis, 'Has GSAP:', gsap);

    // Find occurrences of "LOCKED IN" or "HYPING" or "FLAVORS"
    let idx = js.indexOf('HYPING');
    if (idx !== -1) {
      console.log('Snippet around HYPING:\n', js.slice(Math.max(0, idx - 150), Math.min(js.length, idx + 300)));
    }
    
    // Find occurrences of flavor rotation or scroll rotation
    idx = js.indexOf('flavor-story');
    if (idx !== -1) {
      console.log('Snippet around flavor-story:\n', js.slice(Math.max(0, idx - 100), Math.min(js.length, idx + 400)));
    }
  });
}).on('error', console.error);

