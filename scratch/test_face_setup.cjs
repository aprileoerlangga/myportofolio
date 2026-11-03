const fs = require('fs');
const path = require('path');

// We can create a simple HTML test page that draws the face on a canvas,
// maps it to the Three.js curved CylinderGeometry patch, and captures screenshots
// both from the FRONT and from a 65-DEGREE SIDE VIEW to prove it hugs the surface!
const html = `<!DOCTYPE html>
<html>
<head>
  <style>
    body { margin: 0; background: #0a0d16; overflow: hidden; }
    canvas { width: 100vw; height: 100vh; display: block; }
  </style>
  <script src="https://unpkg.com/three@0.160.0/build/three.min.js"></script>
</head>
<body>
<div id="container"></div>
<script>
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(28, 1440/900, 0.1, 100);
  camera.position.set(0, 0.2, 5.0);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(1440, 900);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  document.getElementById('container').appendChild(renderer.domElement);

  // Studio lights matching the site
  const hemi = new THREE.HemisphereLight('#ffffff', '#181e2e', 0.65);
  scene.add(hemi);
  const dirLight = new THREE.DirectionalLight('#ffffff', 1.55);
  dirLight.position.set(5, 9, 6);
  scene.add(dirLight);
  const fillLight = new THREE.DirectionalLight('#93c5fd', 0.7);
  fillLight.position.set(-5, 4, 3);
  scene.add(fillLight);
  const ambLight = new THREE.AmbientLight('#ffffff', 0.45);
  scene.add(ambLight);

  // Group
  const headGroup = new THREE.Group();
  scene.add(headGroup);

  // Head cylinder
  const headGeom = new THREE.CylinderGeometry(0.62, 0.60, 0.82, 48);
  const headMat = new THREE.MeshPhysicalMaterial({
    color: '#FFD000',
    roughness: 0.22,
    metalness: 0.0,
    clearcoat: 0.65,
    clearcoatRoughness: 0.2,
  });
  const headMesh = new THREE.Mesh(headGeom, headMat);
  headGroup.add(headMesh);

  // Function to create face canvas texture
  function createFaceTexture(blinkScale = 1.0) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // Transparent background
    ctx.clearRect(0, 0, 1024, 1024);

    const eyeY = 450;
    const leftEyeX = 292;
    const rightEyeX = 732;
    const eyeRadiusX = 64;
    const eyeRadiusY = 64 * blinkScale;

    // Eyebrows
    ctx.strokeStyle = '#3a1805';
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';

    // Left eyebrow
    ctx.beginPath();
    ctx.moveTo(235, 325);
    ctx.quadraticCurveTo(292, 305, 345, 332);
    ctx.stroke();

    // Right eyebrow
    ctx.beginPath();
    ctx.moveTo(679, 332);
    ctx.quadraticCurveTo(732, 305, 789, 325);
    ctx.stroke();

    // Eyes
    function drawEye(cx, cy) {
      ctx.fillStyle = '#111111';
      ctx.beginPath();
      ctx.ellipse(cx, cy, eyeRadiusX, eyeRadiusY, 0, 0, Math.PI * 2);
      ctx.fill();

      // Specular white catchlight (only visible if open)
      if (blinkScale > 0.3) {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(cx + 20, cy - 20 * blinkScale, 18 * blinkScale, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    drawEye(leftEyeX, eyeY);
    drawEye(rightEyeX, eyeY);

    // Classic Smile
    ctx.strokeStyle = '#111111';
    ctx.lineWidth = 26;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(335, 670);
    // Smooth U curve
    ctx.bezierCurveTo(400, 755, 624, 755, 689, 670);
    ctx.stroke();

    // Dimple ticks
    ctx.lineWidth = 16;
    ctx.beginPath();
    ctx.moveTo(330, 680);
    ctx.lineTo(345, 655);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(694, 680);
    ctx.lineTo(679, 655);
    ctx.stroke();

    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 8;
    return { tex, canvas, ctx };
  }

  const { tex } = createFaceTexture(1.0);

  // Curved Face Decal Patch
  // radiusTop 0.621, radiusBottom 0.601, height 0.82
  const thetaLength = Math.PI * 0.44;
  const thetaStart = -thetaLength / 2;
  const faceGeom = new THREE.CylinderGeometry(
    0.6208, 0.6008, 0.82, 32, 1, true, thetaStart, thetaLength
  );
  const faceMat = new THREE.MeshBasicMaterial({
    map: tex,
    transparent: true,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -1,
  });
  const faceMesh = new THREE.Mesh(faceGeom, faceMat);
  headGroup.add(faceMesh);

  // Expose function for snapshots
  window.setHeadRotation = function(yRot) {
    headGroup.rotation.y = yRot;
    renderer.render(scene, camera);
  };

  renderer.render(scene, camera);
  window.isReady = true;
</script>
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, 'test_face.html'), html);
console.log('Created test_face.html');

