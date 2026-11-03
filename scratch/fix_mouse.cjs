const fs = require('fs');
const path = 'c:/Users/APRILEOERLANGGA/my-portofolio/src/components/About.jsx';
let content = fs.readFileSync(path, 'utf8');

const target = "  const glowOpacity = useTransform(scrollYProgress, [0.15, 0.85], [0.12, 0.4]);";
const replacement = `  const glowOpacity = useTransform(scrollYProgress, [0.15, 0.85], [0.12, 0.4]);

  // Interactive mouse tilt for Polaroid Photo
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const polaroidRotateX = useTransform(mouseY, [-100, 100], [8, -8]);
  const polaroidRotateY = useTransform(mouseX, [-100, 100], [-8, 8]);`;

content = content.replace(target, replacement);
fs.writeFileSync(path, content, 'utf8');
console.log('Added mouse tilt variables back successfully!');

