import { Canvas, useFrame } from '@react-three/fiber';
import {
  OrbitControls, Float,
  RoundedBox,
} from '@react-three/drei';
import { useRef, useMemo, useState, useEffect, Suspense } from 'react';
import * as THREE from 'three';



/* ═══════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════ */
function damp(current, target, lambda, dt) {
  return THREE.MathUtils.lerp(current, target, 1 - Math.exp(-lambda * dt));
}

// Classic Lego ABS plastic material
const PLASTIC = (color) => ({
  color,
  roughness: 0.22,
  metalness: 0.0,
  clearcoat: 0.65,
  clearcoatRoughness: 0.2,
  envMapIntensity: 0.9,
});

/* ═══════════════════════════════════════════════════════════════
   LEGO STUD — iconic cylindrical bump
   ═══════════════════════════════════════════════════════════════ */
function Stud({ position, color, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <mesh castShadow>
        <cylinderGeometry args={[0.16, 0.16, 0.12, 24]} />
        <meshPhysicalMaterial {...PLASTIC(color)} />
      </mesh>
      {/* Hollow ring on top */}
      <mesh position={[0, 0.061, 0]}>
        <ringGeometry args={[0.08, 0.155, 24]} />
        <meshPhysicalMaterial {...PLASTIC(color)} side={THREE.DoubleSide} roughness={0.3} />
      </mesh>
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════
   LEGO HEAD — accurate classic cylinder
   ═══════════════════════════════════════════════════════════════ */
function LegoHead({ color = '#FFD000' }) {
  const headRef = useRef();
  const leftEyeRef = useRef();
  const rightEyeRef = useRef();
  const smileRef = useRef();
  const blinkState = useRef({ next: 2.5, blinking: false, timer: 0 });

  // Create a U-shaped smile curve (guaranteed correct orientation)
  const smileCurve = useMemo(() => {
    const points = [];
    for (let i = 0; i <= 20; i++) {
      const t = (i / 20) * Math.PI; // 0 to PI
      const x = Math.cos(t) * 0.15;  // width of smile
      const y = -Math.sin(t) * 0.06;  // depth of smile curve (negative = U shape)
      points.push(new THREE.Vector3(x, y, 0));
    }
    return new THREE.CatmullRomCurve3(points);
  }, []);

  useFrame((_, delta) => {
    const t = performance.now() / 1000;

    // Friendly, curious welcoming head acting looking towards visitors
    if (headRef.current) {
      const targetRotZ = 0.04 + Math.sin(t * 1.0) * 0.02;
      const targetRotY = Math.sin(t * 1.2) * 0.05;
      const targetRotX = Math.sin(t * 1.6) * 0.02;

      headRef.current.rotation.x = damp(headRef.current.rotation.x, targetRotX, 3.5, delta);
      headRef.current.rotation.y = damp(headRef.current.rotation.y, targetRotY, 3.5, delta);
      headRef.current.rotation.z = damp(headRef.current.rotation.z, targetRotZ, 3.5, delta);
    }

    // Natural blink
    const bs = blinkState.current;
    bs.timer += delta;
    let blink = 1;
    if (bs.timer > bs.next) {
      const p = bs.timer - bs.next;
      if (p < 0.07) blink = Math.max(0.05, 1 - p / 0.07);
      else if (p < 0.14) blink = Math.min(1, (p - 0.07) / 0.07);
      else { bs.timer = 0; bs.next = 2 + Math.random() * 3; }
    }
    [leftEyeRef, rightEyeRef].forEach(r => {
      if (r.current) r.current.scale.y = damp(r.current.scale.y, blink, 20, delta);
    });

    // Subtle smile animation
    if (smileRef.current) {
      smileRef.current.scale.x = damp(smileRef.current.scale.x, 1 + Math.sin(t * 0.8) * 0.03, 5, delta);
    }
  });

  return (
    <group position={[0, 3.08, 0]} ref={headRef}>
      {/* Head cylinder — classic Lego proportions */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.62, 0.60, 0.82, 32]} />
        <meshPhysicalMaterial {...PLASTIC(color)} />
      </mesh>

      {/* Black under-hair scalp cap covering top head surface so yellow NEVER bleeds through */}
      <mesh position={[0, 0.412, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.625, 32]} />
        <meshBasicMaterial color="#0e0e0e" />
      </mesh>

      {/* Bottom lip ring */}
      <mesh position={[0, -0.41, 0]}>
        <cylinderGeometry args={[0.61, 0.60, 0.02, 32]} />
        <meshPhysicalMaterial {...PLASTIC(color)} />
      </mesh>

      {/* Clean, sleek Yellow Neck Cylinder — perfectly bridging head to torso */}
      <mesh position={[0, -0.48, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.26, 0.26, 0.15, 32]} />
        <meshPhysicalMaterial {...PLASTIC(color)} />
      </mesh>

      {/* Hair attached directly to head — sways and moves with head */}
      <LegoHair color="#0e0e0e" />

      {/* ========= FACE — matching classic minifigure reference ========= */}
      {/* All features at Z=0.63 to sit CLEARLY in front of cylinder surface */}

      {/* Left Eye — black pupil with crisp white highlight dot */}
      <group ref={leftEyeRef} position={[-0.18, 0.05, 0.63]}>
        <mesh>
          <circleGeometry args={[0.052, 24]} />
          <meshBasicMaterial color="#111111" />
        </mesh>
        {/* Specular catchlight matching reference image */}
        <mesh position={[0.016, 0.016, 0.001]}>
          <circleGeometry args={[0.015, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>

      {/* Right Eye — black pupil with crisp white highlight dot */}
      <group ref={rightEyeRef} position={[0.18, 0.05, 0.63]}>
        <mesh>
          <circleGeometry args={[0.052, 24]} />
          <meshBasicMaterial color="#111111" />
        </mesh>
        {/* Specular catchlight matching reference image */}
        <mesh position={[0.016, 0.016, 0.001]}>
          <circleGeometry args={[0.015, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>

      {/* Left Eyebrow — subtle arched line */}
      <mesh position={[-0.18, 0.155, 0.631]} rotation={[0, 0, 0.08]}>
        <planeGeometry args={[0.085, 0.014]} />
        <meshBasicMaterial color="#4a2010" />
      </mesh>

      {/* Right Eyebrow — subtle arched line */}
      <mesh position={[0.18, 0.155, 0.631]} rotation={[0, 0, -0.08]}>
        <planeGeometry args={[0.085, 0.014]} />
        <meshBasicMaterial color="#4a2010" />
      </mesh>

      {/* Classic Smile — U-shape using TubeGeometry following a CatmullRom curve */}
      <group ref={smileRef} position={[0, -0.13, 0.63]}>
        <mesh>
          <tubeGeometry args={[smileCurve, 20, 0.013, 8, false]} />
          <meshBasicMaterial color="#111111" />
        </mesh>
        {/* Smile corner dimple ticks */}
        <mesh position={[-0.15, 0.005, 0]} rotation={[0, 0, 0.5]}>
          <planeGeometry args={[0.012, 0.032]} />
          <meshBasicMaterial color="#111111" />
        </mesh>
        <mesh position={[0.15, 0.005, 0]} rotation={[0, 0, -0.5]}>
          <planeGeometry args={[0.012, 0.032]} />
          <meshBasicMaterial color="#111111" />
        </mesh>
      </group>
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PROCEDURAL LEGO HAIR (Part 3901 — Classic Swept Side-Part Hair)
   Seamless, molded plastic geometry matching the exact reference:
   - Part on the viewer's right (above right eye)
   - Iconic swooping bangs across forehead from right to left
   - Smooth continuous dome with realistic specular highlights
   - Sideburns and full nape coverage
   ═══════════════════════════════════════════════════════════════ */
function createLegoHairGeometry() {
  const geom = new THREE.BufferGeometry();
  const segmentsU = 64; // around circumference
  const segmentsV = 20; // crown to rim

  // 1. Hairline function around circumference (theta)
  function getHairlineY(theta) {
    let t = theta;
    while (t > Math.PI) t -= Math.PI * 2;
    while (t < -Math.PI) t += Math.PI * 2;

    // Back & nape covers down to y = -0.10 (fully covers back of head)
    let yBack = -0.10;

    // Sideburns at t = +1.38 (right) and t = -1.38 (left)
    const rightSideburn = Math.exp(-Math.pow((t - 1.38) / 0.28, 2));
    const leftSideburn = Math.exp(-Math.pow((t + 1.38) / 0.28, 2));

    // Front bangs & part:
    let yFront = 0.23;
    if (Math.abs(t) < 1.15) {
      const partPeak = 0.065 * Math.exp(-Math.pow((t - 0.32) / 0.16, 2));
      const rightDip = -0.035 * Math.exp(-Math.pow((t - 0.65) / 0.22, 2));
      const sweepDip = -0.085 * Math.exp(-Math.pow((t + 0.26) / 0.46, 2));
      yFront = 0.23 + partPeak + rightDip + sweepDip;
    }

    const frontWeight = Math.exp(-Math.pow(t / 1.15, 4));
    let y = (1 - frontWeight) * yBack + frontWeight * yFront;

    // Sideburns drop down to y ~ -0.15
    y -= 0.10 * rightSideburn;
    y -= 0.10 * leftSideburn;

    return y;
  }

  // 2. Outer radius calculation:
  // Must be >= 0.70 for all y <= 0.44 (head cylinder is r = 0.62)
  function getOuterRadius(theta, y, yCrown, yHairline) {
    let t = theta;
    while (t > Math.PI) t -= Math.PI * 2;
    while (t < -Math.PI) t += Math.PI * 2;

    const yShoulder = 0.45; // Well above head cylinder (y = 0.41)
    let rBase;

    if (y >= yShoulder) {
      // Rounded dome above head cylinder: smooth quarter ellipse
      const f = Math.max(0, Math.min(1, (yCrown - y) / (yCrown - yShoulder)));
      rBase = 0.705 * Math.pow(1 - Math.pow(1 - f, 2.0), 0.5);
    } else {
      // Cylindrical section over head: safely outside head (r=0.62) with generous volume
      const f = Math.max(0, Math.min(1, (yShoulder - y) / (yShoulder - yHairline)));
      rBase = 0.705 + 0.025 * f; // Expands from 0.705 to 0.730 near rim
    }

    // Front bangs 3D sculpt bulge (+Z)
    if (Math.abs(t) < 1.25) {
      const v = Math.max(0, Math.min(1, (yCrown - y) / (yCrown - yHairline)));
      const sweepBulge = 0.09 * Math.exp(-Math.pow((t + 0.18) / 0.48, 2));
      const rightBulge = 0.05 * Math.exp(-Math.pow((t - 0.66) / 0.25, 2));
      // Refined part groove without cutting into the skull
      const partGroove = -0.015 * Math.exp(-Math.pow((t - 0.32) / 0.14, 2));
      rBase += (sweepBulge + rightBulge + partGroove) * Math.sin(v * Math.PI * 0.85);
    }

    // Sideburns thickness
    const sb = Math.exp(-Math.pow((Math.abs(t) - 1.38) / 0.30, 2));
    rBase += 0.03 * sb;

    // Back thickness
    const back = Math.exp(-Math.pow((Math.abs(t) - Math.PI) / 0.9, 2));
    rBase += 0.03 * back;

    return rBase;
  }

  const positions = [];
  const indices = [];

  const yCrown = 0.74; // Taller, authentic classic LEGO hair dome
  // Outer Apex (index 0) — centered directly on head axis
  positions.push(0, yCrown, 0);

  // Outer shell rings (j = 1 to segmentsV)
  for (let j = 1; j <= segmentsV; j++) {
    const v = j / segmentsV;
    for (let i = 0; i < segmentsU; i++) {
      const u = i / segmentsU;
      const theta = u * Math.PI * 2;
      let t = theta;
      while (t > Math.PI) t -= Math.PI * 2;
      while (t < -Math.PI) t += Math.PI * 2;

      const yHairline = getHairlineY(theta);
      let yC = yCrown;
      // Fuller volume on left crown
      if (t < 0.25 && t > -2.2) {
        yC += 0.025 * Math.sin((t + 2.2) / 2.45 * Math.PI);
      }
      yC -= 0.012 * Math.exp(-Math.pow((t - 0.32) / 0.20, 2));

      // Y position interpolates from yC down to yHairline
      const y = yC * (1 - v) + yHairline * v;
      const r = getOuterRadius(theta, y, yC, yHairline);

      positions.push(
        r * Math.sin(theta),
        y,
        r * Math.cos(theta)
      );
    }
  }

  // Outer top fan
  for (let i = 0; i < segmentsU; i++) {
    const nextI = (i + 1) % segmentsU;
    indices.push(0, 1 + i, 1 + nextI);
  }

  // Outer shell quads
  for (let j = 1; j < segmentsV; j++) {
    const rowA = 1 + (j - 1) * segmentsU;
    const rowB = 1 + j * segmentsU;
    for (let i = 0; i < segmentsU; i++) {
      const nextI = (i + 1) % segmentsU;
      const a = rowA + i;
      const b = rowB + i;
      const c = rowB + nextI;
      const d = rowA + nextI;
      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  // Inner Shell: fits over head cylinder (r = 0.625)
  const innerApex = positions.length / 3;
  positions.push(0, 0.58, 0); // Inner apex

  for (let j = 1; j <= segmentsV; j++) {
    const v = j / segmentsV;
    for (let i = 0; i < segmentsU; i++) {
      const u = i / segmentsU;
      const theta = u * Math.PI * 2;
      const yHairline = getHairlineY(theta);
      const y = 0.58 * (1 - v) + (yHairline + 0.015) * v;

      // Inner radius: expands to 0.635 at head cylinder
      const r = 0.635 * Math.min(1, v * 1.8);

      positions.push(
        r * Math.sin(theta),
        y,
        r * Math.cos(theta)
      );
    }
  }

  // Inner top fan (reversed winding)
  for (let i = 0; i < segmentsU; i++) {
    const nextI = (i + 1) % segmentsU;
    indices.push(innerApex, innerApex + 1 + nextI, innerApex + 1 + i);
  }

  // Inner shell quads (reversed winding)
  for (let j = 1; j < segmentsV; j++) {
    const rowA = innerApex + 1 + (j - 1) * segmentsU;
    const rowB = innerApex + 1 + j * segmentsU;
    for (let i = 0; i < segmentsU; i++) {
      const nextI = (i + 1) % segmentsU;
      const a = rowA + i;
      const b = rowB + i;
      const c = rowB + nextI;
      const d = rowA + nextI;
      indices.push(a, d, b);
      indices.push(b, d, c);
    }
  }

  // Bottom Rim connecting outer rim to inner rim
  const outerRim = 1 + (segmentsV - 1) * segmentsU;
  const innerRim = innerApex + 1 + (segmentsV - 1) * segmentsU;
  for (let i = 0; i < segmentsU; i++) {
    const nextI = (i + 1) % segmentsU;
    const o1 = outerRim + i;
    const o2 = outerRim + nextI;
    const i1 = innerRim + i;
    const i2 = innerRim + nextI;
    indices.push(o1, i1, o2);
    indices.push(i1, i2, o2);
  }

  geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geom.setIndex(indices);
  geom.computeVertexNormals();

  return geom;
}

let cachedHairGeom = null;
function getLegoHairGeometry() {
  if (!cachedHairGeom) {
    cachedHairGeom = createLegoHairGeometry();
  }
  return cachedHairGeom;
}

function LegoHair({ color = '#0f0f0f' }) {
  const geom = useMemo(() => getLegoHairGeometry(), []);

  return (
    <mesh geometry={geom} castShadow receiveShadow>
      <meshPhysicalMaterial
        color={color}
        roughness={0.16}
        metalness={0.02}
        clearcoat={0.96}
        clearcoatRoughness={0.08}
        envMapIntensity={1.2}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/* ═══════════════════════════════════════════════════════════════
   LEGO TORSO — authentic trapezoid shape matching reference image
   ═══════════════════════════════════════════════════════════════ */
function createTorsoGeometry() {
  const shape = new THREE.Shape();
  const topW = 0.44; // top shoulders width = 0.88
  const botW = 0.63; // bottom waist width = 1.26 (flush with hips & legs!)
  const h = 1.06;    // authentic torso height
  const r = 0.08;    // smooth shoulder corner rounding

  // Draw continuous uninterrupted perimeter from bottom-left corner
  shape.moveTo(-botW, -h / 2);
  shape.lineTo(botW, -h / 2);
  shape.lineTo(topW, h / 2 - r);
  shape.quadraticCurveTo(topW, h / 2, topW - r, h / 2);
  shape.lineTo(-topW + r, h / 2);
  shape.quadraticCurveTo(-topW, h / 2, -topW, h / 2 - r);
  shape.lineTo(-botW, -h / 2);

  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: 0.48,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 1,
    bevelSize: 0.024,
    bevelThickness: 0.024,
  });
  geom.center();
  geom.computeVertexNormals();
  return geom;
}

let cachedTorsoGeom = null;
function getTorsoGeometry() {
  if (!cachedTorsoGeom) {
    cachedTorsoGeom = createTorsoGeometry();
  }
  return cachedTorsoGeom;
}

function LegoTorso({ bodyColor = '#ffffff' }) {
  const ref = useRef();
  const torsoGeom = useMemo(() => getTorsoGeometry(), []);

  // Subtle breathing animation
  useFrame((_, delta) => {
    if (ref.current) {
      const t = performance.now() / 1000;
      const b = Math.sin(t * 1.5) * 0.004 + 1;
      ref.current.scale.x = damp(ref.current.scale.x, b, 5, delta);
      ref.current.scale.z = damp(ref.current.scale.z, b, 5, delta);
    }
  });

  return (
    <group position={[0, 2.05, 0]} ref={ref}>
      {/* Authentic trapezoidal torso body — pristine flat top & smooth beveled edges */}
      <mesh geometry={torsoGeom} castShadow receiveShadow>
        <meshPhysicalMaterial
          color={bodyColor}
          roughness={0.16}
          metalness={0.0}
          clearcoat={0.95}
          clearcoatRoughness={0.08}
          envMapIntensity={1.1}
        />
      </mesh>
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════
   LEGO ARM — curved organic shape matching reference image
   ═══════════════════════════════════════════════════════════════ */
function createArmGeometry(side) {
  // Minifigure faces +Z (towards viewer).
  // 'right' is minifigure's right arm (viewer's left, x = -0.48): curve flaring moves outward (sign = -1).
  // 'left' is minifigure's left arm (viewer's right, x = 0.48): curve flaring moves outward (sign = 1).
  const sign = side === 'right' ? -1 : 1;
  // Spline points modeled with guaranteed body clearance along torso and hips
  const points = [
    new THREE.Vector3(0, 0, 0),                           // Shoulder pivot [±0.48, 2.31, 0]
    new THREE.Vector3(sign * 0.18, -0.22, 0.03),          // Slopes down alongside torso bevel
    new THREE.Vector3(sign * 0.28, -0.44, 0.08),          // Elbow curves outward with clean air gap past torso bottom
    new THREE.Vector3(sign * 0.28, -0.62, 0.14),          // Forearm maintains solid air gap from hips
    new THREE.Vector3(sign * 0.27, -0.74, 0.18),          // Wrist terminates cleanly in front/beside thigh
  ];
  const curve = new THREE.CatmullRomCurve3(points);
  const geom = new THREE.TubeGeometry(curve, 24, 0.112, 18, false);
  const wristPos = points[4].clone();
  const wristTangent = curve.getTangentAt(1.0).normalize();
  
  // Calculate orientation quaternion to align wrist along curve tangent
  const wristQuat = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, -1, 0),
    wristTangent
  );

  return { geom, wristPos, wristTangent, wristQuat };
}

const cachedArmGeom = {};
function getArmGeometry(side) {
  if (!cachedArmGeom[side]) {
    cachedArmGeom[side] = createArmGeometry(side);
  }
  return cachedArmGeom[side];
}

function LegoArm({ side = 'right', armColor = '#0040B8', handColor = '#FFD000' }) {
  // Minifigure faces +Z (towards camera).
  // Minifigure's RIGHT arm: located at x = -0.48 (viewer's left).
  // Minifigure's LEFT arm: located at x = 0.48 (viewer's right).
  const x = side === 'right' ? -0.48 : 0.48;
  const sign = side === 'right' ? -1 : 1;
  const armRef = useRef();
  const handRef = useRef();
  const sv = useRef({ ax: 0, az: 0, ay: 0, hx: 0, hy: 0, hz: 0 });

  const { geom: armGeom, wristPos, wristQuat } = useMemo(() => getArmGeometry(side), [side]);

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05); // Clamped timestep
    const t = performance.now() / 1000;
    const s = sv.current;

    let targetX = 0;
    let targetZ = 0;
    let targetY = 0;
    let targetHx = 0;
    let targetHy = 0;
    let targetHz = 0;

    if (side === 'right') {
      // TANGAN KANAN: Mengangkat ke atas-depan, melambai ramah, lalu turun kembali secara berkala (hidup & tidak kaku)
      const cycleDuration = 5.5; // Total siklus animasi dalam detik
      const cycle = t % cycleDuration;

      let lift = 0;
      if (cycle < 0.9) {
        // Fase 1: Mengangkat tangan ke depan & ke atas (0.0s - 0.9s)
        const p = cycle / 0.9;
        lift = (1 - Math.cos(p * Math.PI)) / 2;
      } else if (cycle < 3.6) {
        // Fase 2: Melambai aktif di atas ke arah depan menyapa pengunjung (0.9s - 3.6s)
        lift = 1.0;
      } else if (cycle < 4.4) {
        // Fase 3: Menurunkan tangan kembali ke samping badan (3.6s - 4.4s)
        const p = (cycle - 3.6) / 0.8;
        lift = (1 + Math.cos(p * Math.PI)) / 2;
      } else {
        // Fase 4: Istirahat santai di samping badan dengan micro-breathing (4.4s - 5.5s)
        lift = 0.0;
      }

      // Posisi santai di samping badan (bebas benturan dari torso)
      const restX = 0.04 + Math.sin(t * 1.5) * 0.02;
      const restZ = -0.04;
      const restY = 0;

      // Posisi melambai ke depan-atas (terangkat tinggi sejajar kepala/mata & ke depan)
      const waveT = cycle - 0.9;
      const waveMotion = Math.sin(waveT * 6.2); // Melambai bolak-balik ceria
      const waveX = -2.40 + Math.sin(waveT * 3.0) * 0.04; // Terangkat tinggi sejajar kepala & ke depan
      const waveZ = -0.42 - waveMotion * 0.18; // Ayunan melambai ke kiri-kanan (jelas di samping kepala)
      const waveY = -0.22 - waveMotion * 0.08;

      targetX = THREE.MathUtils.lerp(restX, waveX, lift);
      targetZ = THREE.MathUtils.lerp(restZ, waveZ, lift);
      targetY = THREE.MathUtils.lerp(restY, waveY, lift);

      // Artikulasi pergelangan/tangan melambai aktif di atas
      targetHx = THREE.MathUtils.lerp(0, 0.25 + Math.sin(waveT * 6.2) * 0.14, lift);
      targetHy = THREE.MathUtils.lerp(0, Math.cos(waveT * 6.2) * 0.40, lift);
      targetHz = THREE.MathUtils.lerp(0, Math.sin(waveT * 6.2) * 0.14, lift);
    } else {
      // TANGAN KIRI: Menggantung alami di samping badan dengan micro-breathing (bebas benturan)
      targetX = 0.04 + Math.sin(t * 1.5 + Math.PI) * 0.02;
      targetZ = 0.04 + Math.cos(t * 1.2) * 0.01;
      targetY = 0;
      targetHx = 0;
      targetHy = 0;
      targetHz = 0;
    }

    // Smooth physics damping
    s.ax = damp(s.ax, targetX, 5.0, delta);
    s.az = damp(s.az, targetZ, 5.0, delta);
    s.ay = damp(s.ay, targetY, 5.0, delta);
    s.hx = damp(s.hx, targetHx, 5.5, delta);
    s.hy = damp(s.hy, targetHy, 5.5, delta);
    s.hz = damp(s.hz, targetHz, 5.5, delta);

    if (armRef.current) {
      armRef.current.rotation.x = s.ax;
      armRef.current.rotation.z = s.az;
      armRef.current.rotation.y = s.ay;
    }
    if (handRef.current) {
      handRef.current.rotation.x = s.hx;
      handRef.current.rotation.y = s.hy;
      handRef.current.rotation.z = s.hz;
    }
  });

  return (
    <group position={[x, 2.31, 0]}>
      <group ref={armRef}>
        {/* Shoulder spherical cap — snug against torso socket */}
        <mesh position={[0, 0, 0]} castShadow>
          <sphereGeometry args={[0.16, 24, 20]} />
          <meshPhysicalMaterial
            color={armColor}
            roughness={0.16}
            clearcoat={0.95}
            clearcoatRoughness={0.08}
            envMapIntensity={1.1}
          />
        </mesh>

        {/* Continuous organic curved arm tube */}
        <mesh geometry={armGeom} castShadow receiveShadow>
          <meshPhysicalMaterial
            color={armColor}
            roughness={0.16}
            clearcoat={0.95}
            clearcoatRoughness={0.08}
            envMapIntensity={1.1}
          />
        </mesh>

        {/* Wrist Socket Assembly — perfectly aligned with curve endpoint & tangent */}
        <group position={[wristPos.x, wristPos.y, wristPos.z]} quaternion={wristQuat}>
          {/* Blue plastic wrist cuff rim */}
          <mesh castShadow>
            <cylinderGeometry args={[0.134, 0.130, 0.05, 22]} />
            <meshPhysicalMaterial
              color={armColor}
              roughness={0.16}
              clearcoat={0.95}
              clearcoatRoughness={0.08}
            />
          </mesh>

          {/* Hand Articulation Group (rotates inside wrist socket) */}
          <group ref={handRef} position={[0, -0.04, 0]}>
            {/* Yellow wrist peg inserted into arm socket */}
            <mesh position={[0, 0.02, 0]} castShadow>
              <cylinderGeometry args={[0.055, 0.055, 0.07, 16]} />
              <meshPhysicalMaterial {...PLASTIC(handColor)} />
            </mesh>

            {/* Hand collar transition */}
            <mesh position={[0, -0.02, 0]} castShadow>
              <cylinderGeometry args={[0.078, 0.078, 0.035, 18]} />
              <meshPhysicalMaterial {...PLASTIC(handColor)} />
            </mesh>

            {/* Iconic Yellow C-Claw — opening oriented inward toward hips/thighs like reference image */}
            <mesh
              position={[0, -0.08, 0.02]}
              rotation={[0.20, sign === 1 ? -Math.PI / 2 + 0.35 : Math.PI / 2 - 0.35, 0]}
              castShadow
            >
              <torusGeometry args={[0.086, 0.036, 16, 28, Math.PI * 1.44]} />
              <meshPhysicalMaterial
                color={handColor}
                roughness={0.18}
                clearcoat={0.92}
                clearcoatRoughness={0.10}
                envMapIntensity={1.0}
              />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HIP CONNECTOR — authentic LEGO pelvis piece (width 1.26 flush with torso)
   ═══════════════════════════════════════════════════════════════ */
function HipPiece({ color = '#0040B8' }) {
  return (
    <group position={[0, 1.44, 0]}>
      {/* Upper waist band — width 1.26 sits EXACTLY flush with bottom of torso */}
      <mesh castShadow receiveShadow>
        <RoundedBox args={[1.26, 0.18, 0.50]} radius={0.02} smoothness={2}>
          <meshPhysicalMaterial
            color={color}
            roughness={0.16}
            clearcoat={0.95}
            clearcoatRoughness={0.08}
            envMapIntensity={1.1}
          />
        </RoundedBox>
      </mesh>

      {/* Center vertical crotch post between legs */}
      <mesh position={[0, -0.16, 0]} castShadow>
        <RoundedBox args={[0.10, 0.38, 0.46]} radius={0.02} smoothness={2}>
          <meshPhysicalMaterial
            color={color}
            roughness={0.16}
            clearcoat={0.95}
          />
        </RoundedBox>
      </mesh>

      {/* Horizontal pivot hinge cylinders */}
      <mesh position={[0, -0.06, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.175, 0.175, 1.22, 24]} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.16}
          clearcoat={0.95}
        />
      </mesh>
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════
   LEGO LEG — authentic legs matching reference image (width 0.58 each, outer width 1.26 flush)
   ═══════════════════════════════════════════════════════════════ */
function LegoLeg({ side = 'left', color = '#0040B8' }) {
  const x = side === 'left' ? -0.34 : 0.34;
  const phase = side === 'left' ? Math.PI : 0;
  const ref = useRef();
  const sx = useRef(0);

  useFrame((_, delta) => {
    const t = performance.now() / 1000;
    // Gentle natural idle sway matching the waving character's stance
    const target = Math.sin(t * 0.8 + phase) * 0.03;
    sx.current = damp(sx.current, target, 4, delta);
    if (ref.current) ref.current.rotation.x = sx.current;
  });

  return (
    <group ref={ref} position={[x, 1.01, 0]}>
      {/* Top rounded hip joint cylinder — prominent glossy horizontal highlight matching reference */}
      <mesh position={[0, 0.37, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.18, 0.18, 0.56, 24]} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.16}
          clearcoat={0.95}
          clearcoatRoughness={0.08}
          envMapIntensity={1.1}
        />
      </mesh>

      {/* Main shin column — width 0.56 */}
      <mesh position={[0, -0.06, 0]} castShadow receiveShadow>
        <RoundedBox args={[0.56, 0.84, 0.48]} radius={0.025} smoothness={3}>
          <meshPhysicalMaterial
            color={color}
            roughness={0.16}
            clearcoat={0.95}
            clearcoatRoughness={0.08}
            envMapIntensity={1.1}
          />
        </RoundedBox>
      </mesh>

      {/* Foot toe step extension */}
      <mesh position={[0, -0.38, 0.08]} castShadow>
        <RoundedBox args={[0.56, 0.14, 0.64]} radius={0.02} smoothness={2}>
          <meshPhysicalMaterial
            color={color}
            roughness={0.16}
            clearcoat={0.95}
            clearcoatRoughness={0.08}
            envMapIntensity={1.1}
          />
        </RoundedBox>
      </mesh>
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════
   LEGO BASEPLATE — collector display stand with authentic studs
   ═══════════════════════════════════════════════════════════════ */
function LegoBaseplate() {
  const width = 3.2;
  const depth = 2.0;
  const height = 0.12;
  const topY = 0.53; // Exactly flush with minifigure soles

  // Studs placed around the perimeter of the stand
  const studs = useMemo(() => {
    const list = [];
    const xs = [-1.3, -0.85, -0.4, 0.1, 0.6];
    const zs = [-0.7, 0, 0.7];
    for (const x of xs) {
      for (const z of zs) {
        // Leave room where feet stand and keep right desk area smooth tile
        const underFeet = Math.abs(z) < 0.35 && (Math.abs(x + 0.34) < 0.25 || Math.abs(x - 0.34) < 0.25);
        const underDesk = x > 0.6;
        if (!underFeet && !underDesk) {
          list.push([x, z]);
        }
      }
    }
    return list;
  }, []);

  return (
    <group position={[0, topY - height / 2, 0.05]}>
      {/* Sleek dark charcoal collector stand */}
      <mesh castShadow receiveShadow>
        <RoundedBox args={[width, height, depth]} radius={0.03} smoothness={3}>
          <meshPhysicalMaterial
            color="#14161d"
            roughness={0.25}
            clearcoat={0.9}
            clearcoatRoughness={0.1}
            envMapIntensity={0.8}
          />
        </RoundedBox>
      </mesh>

      {/* Decorative colored accent strip on front edge */}
      <mesh position={[0, 0, depth / 2 + 0.005]} castShadow>
        <planeGeometry args={[width * 0.85, 0.035]} />
        <meshBasicMaterial color="#ffd500" />
      </mesh>

      {/* Authentic LEGO studs on stand */}
      {studs.map(([sx, sz], i) => (
        <mesh key={i} position={[sx, height / 2 + 0.045, sz]} castShadow>
          <cylinderGeometry args={[0.13, 0.13, 0.09, 16]} />
          <meshPhysicalMaterial
            color="#14161d"
            roughness={0.25}
            clearcoat={0.9}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════
   LEGO LAPTOP — developer workstation item with glowing terminal screen
   ═══════════════════════════════════════════════════════════════ */
function LegoLaptop({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Lower keyboard chassis */}
      <mesh position={[0, 0.02, 0]} castShadow receiveShadow>
        <RoundedBox args={[0.48, 0.032, 0.34]} radius={0.015} smoothness={2}>
          <meshPhysicalMaterial
            color="#2a2d34"
            roughness={0.25}
            metalness={0.3}
            clearcoat={0.8}
            clearcoatRoughness={0.15}
          />
        </RoundedBox>
      </mesh>

      {/* Keyboard recessed chiclet keys pad */}
      <mesh position={[0, 0.037, -0.04]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.40, 0.18]} />
        <meshBasicMaterial color="#14161a" />
      </mesh>

      {/* Keyboard trackpad */}
      <mesh position={[0, 0.037, 0.10]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.15, 0.08]} />
        <meshBasicMaterial color="#20232a" />
      </mesh>

      {/* Hinge bar */}
      <mesh position={[0, 0.033, -0.17]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.016, 0.016, 0.44, 12]} />
        <meshPhysicalMaterial color="#1a1c22" roughness={0.3} />
      </mesh>

      {/* Open Screen Lid (tilted back at ~110 degrees) */}
      <group position={[0, 0.033, -0.17]} rotation={[0.42, 0, 0]}>
        {/* Screen back bezel */}
        <mesh position={[0, 0.17, 0]} castShadow>
          <RoundedBox args={[0.48, 0.34, 0.022]} radius={0.015} smoothness={2}>
            <meshPhysicalMaterial
              color="#2a2d34"
              roughness={0.25}
              metalness={0.3}
              clearcoat={0.8}
            />
          </RoundedBox>
        </mesh>

        {/* Outer lid Apple/LEGO circular stud logo on back */}
        <mesh position={[0, 0.17, -0.015]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 0.01, 16]} />
          <meshPhysicalMaterial color="#ffd500" roughness={0.2} />
        </mesh>

        {/* Glowing Code Screen Display */}
        <mesh position={[0, 0.17, 0.012]}>
          <planeGeometry args={[0.42, 0.28]} />
          <meshBasicMaterial color="#08101a" />
        </mesh>

        {/* Code Lines on Screen (glowing cyan, yellow, emerald syntax) */}
        <group position={[-0.17, 0.27, 0.014]}>
          {/* Header prompt tag */}
          <mesh position={[0.05, 0, 0]}>
            <planeGeometry args={[0.08, 0.015]} />
            <meshBasicMaterial color="#00e5ff" />
          </mesh>
          {/* Code line 1 */}
          <mesh position={[0.15, -0.035, 0]}>
            <planeGeometry args={[0.22, 0.012]} />
            <meshBasicMaterial color="#34d399" />
          </mesh>
          {/* Code line 2 (indented) */}
          <mesh position={[0.18, -0.07, 0]}>
            <planeGeometry args={[0.18, 0.012]} />
            <meshBasicMaterial color="#ffd500" />
          </mesh>
          {/* Code line 3 */}
          <mesh position={[0.13, -0.105, 0]}>
            <planeGeometry args={[0.20, 0.012]} />
            <meshBasicMaterial color="#60a5fa" />
          </mesh>
          {/* Code line 4 (return tag) */}
          <mesh position={[0.10, -0.14, 0]}>
            <planeGeometry args={[0.12, 0.012]} />
            <meshBasicMaterial color="#f472b6" />
          </mesh>
        </group>
      </group>
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════
   LEGO COFFEE MUG — iconic developer fuel prop
   ═══════════════════════════════════════════════════════════════ */
function LegoCoffeeMug({ position = [0, 0, 0], color = '#E3000B' }) {
  return (
    <group position={position}>
      {/* Mug cylindrical body */}
      <mesh position={[0, 0.10, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.075, 0.20, 20]} />
        <meshPhysicalMaterial {...PLASTIC(color)} />
      </mesh>

      {/* Mug rim lip */}
      <mesh position={[0, 0.20, 0]} castShadow>
        <cylinderGeometry args={[0.092, 0.09, 0.02, 20]} />
        <meshPhysicalMaterial {...PLASTIC(color)} />
      </mesh>

      {/* Coffee liquid surface inside mug */}
      <mesh position={[0, 0.18, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.075, 18]} />
        <meshPhysicalMaterial
          color="#1e1008"
          roughness={0.1}
          clearcoat={1.0}
        />
      </mesh>

      {/* Classic C-shaped Mug Handle */}
      <mesh position={[-0.10, 0.10, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <torusGeometry args={[0.055, 0.022, 12, 18, Math.PI * 1.3]} />
        <meshPhysicalMaterial {...PLASTIC(color)} />
      </mesh>
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FULL MINIFIGURE & WORKSTATION — assembled with developer props
   ═══════════════════════════════════════════════════════════════ */
function Minifigure() {
  return (
    <group>
      {/* Minifigure character */}
      <LegoHead color="#FFD000" />
      <LegoTorso bodyColor="#ffffff" />
      <LegoArm side="left" armColor="#0040B8" handColor="#FFD000" />
      <LegoArm side="right" armColor="#0040B8" handColor="#FFD000" />
      <HipPiece color="#0040B8" />
      <LegoLeg side="left" color="#0040B8" />
      <LegoLeg side="right" color="#0040B8" />

      {/* Developer Workstation Elements */}
      <LegoBaseplate />
      <LegoLaptop position={[1.15, 0.53, 0.22]} rotation={[0, -0.32, 0]} />
      <LegoCoffeeMug position={[1.10, 0.53, -0.42]} color="#E3000B" />
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FLOATING LEGO BRICKS — authentic colorful floating blocks
   ═══════════════════════════════════════════════════════════════ */
function LegoBrick({ type = '2x2', color = '#E3000B' }) {
  // Real LEGO brick proportions: 2x2 is width 1.6, height 0.96, depth 1.6
  // 2x4 is width 3.2, height 0.96, depth 1.6
  const is2x4 = type === '2x4';
  const width = is2x4 ? 3.2 : 1.6;
  const height = 0.96;
  const depth = 1.6;

  // Stud positions (standard spacing 0.8 units)
  const studs = useMemo(() => {
    const list = [];
    const xPositions = is2x4 ? [-1.2, -0.4, 0.4, 1.2] : [-0.4, 0.4];
    const zPositions = [-0.4, 0.4];
    for (const x of xPositions) {
      for (const z of zPositions) {
        list.push([x, height / 2 + 0.10, z]);
      }
    }
    return list;
  }, [is2x4]);

  return (
    <group>
      {/* Brick body */}
      <mesh castShadow receiveShadow>
        <RoundedBox args={[width, height, depth]} radius={0.06} smoothness={3}>
          <meshPhysicalMaterial {...PLASTIC(color)} />
        </RoundedBox>
      </mesh>

      {/* Brick Studs */}
      {studs.map((pos, idx) => (
        <mesh key={idx} position={pos} castShadow>
          <cylinderGeometry args={[0.24, 0.24, 0.20, 18]} />
          <meshPhysicalMaterial {...PLASTIC(color)} />
        </mesh>
      ))}
    </group>
  );
}

function FloatingBricks() {
  const orbitRef = useRef();

  // Aktif memutar orbit balok-balok LEGO mengelilingi karakter (360 derajat)
  useFrame((_, delta) => {
    if (orbitRef.current) {
      orbitRef.current.rotation.y += delta * 0.42;
    }
  });

  const bricks = useMemo(() => {
    // 5 balok LEGO warna-warni yang mengitari karakter di berbagai ketinggian dan sudut
    const count = 5;
    const items = [
      { color: '#E3000B', type: '2x2', y: 1.1, r: 2.15, scale: 0.28, speed: 1.4 },
      { color: '#FFD500', type: '2x4', y: 0.3, r: 2.30, scale: 0.26, speed: 1.2 },
      { color: '#0055BF', type: '2x2', y: -0.5, r: 2.10, scale: 0.28, speed: 1.5 },
      { color: '#00852B', type: '2x4', y: 0.7, r: 2.25, scale: 0.25, speed: 1.1 },
      { color: '#FE8A18', type: '2x2', y: -0.2, r: 2.05, scale: 0.27, speed: 1.3 },
    ];

    return items.map((item, i) => {
      const angle = (i / count) * Math.PI * 2;
      return {
        ...item,
        pos: [Math.cos(angle) * item.r, item.y, Math.sin(angle) * item.r],
        rot: [0.3 + (i * 0.4), 0.5 + (i * 0.6), -0.2 + (i * 0.3)],
      };
    });
  }, []);

  return (
    <group ref={orbitRef}>
      {bricks.map((b, i) => (
        <Float
          key={i}
          speed={b.speed}
          floatIntensity={0.6}
          rotationIntensity={0.8}
        >
          <group position={b.pos} rotation={b.rot} scale={b.scale}>
            <LegoBrick type={b.type} color={b.color} />
          </group>
        </Float>
      ))}
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PARTICLES — subtle ambient dust motes
   ═══════════════════════════════════════════════════════════════ */
function Particles() {
  const ref = useRef();
  const positions = useMemo(() => {
    const p = new Float32Array(50 * 3);
    for (let i = 0; i < 50; i++) {
      p[i * 3] = (Math.random() - 0.5) * 10;
      p[i * 3 + 1] = (Math.random() - 0.5) * 8;
      p[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return p;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.008;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={50} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.025} color="#ffd500" transparent opacity={0.22} sizeAttenuation />
    </points>
  );
}

/* ═══════════════════════════════════════════════════════════════
   GROUND SHADOW — Instant, zero-overhead procedural contact shadow
   Eliminates Drei ContactShadows depthMaterial white-flash glitch completely
   ═══════════════════════════════════════════════════════════════ */
let cachedGroundShadowTexture = null;
function getGroundShadowTexture() {
  if (!cachedGroundShadowTexture) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    
    // Smooth dual-layer ambient occlusion ground shadow
    const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 120);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
    grad.addColorStop(0.3, 'rgba(0, 0, 0, 0.45)');
    grad.addColorStop(0.65, 'rgba(0, 0, 0, 0.15)');
    grad.addColorStop(0.9, 'rgba(0, 0, 0, 0.02)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
    
    cachedGroundShadowTexture = new THREE.CanvasTexture(canvas);
    cachedGroundShadowTexture.generateMipmaps = true;
  }
  return cachedGroundShadowTexture;
}

function GroundShadow({ position = [0, -2.14, 0] }) {
  const texture = useMemo(() => getGroundShadowTexture(), []);

  return (
    <group position={position}>
      {/* Primary body contact shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[2.6, 1.5]} />
        <meshBasicMaterial map={texture} transparent opacity={0.68} depthWrite={false} />
      </mesh>
      {/* Broad soft ground ambient drop shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[4.2, 2.5]} />
        <meshBasicMaterial map={texture} transparent opacity={0.28} depthWrite={false} />
      </mesh>
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SCENE
   ═══════════════════════════════════════════════════════════════ */
function RenderNotifier({ onRendered }) {
  const rendered = useRef(false);
  useFrame(() => {
    if (!rendered.current) {
      rendered.current = true;
      if (onRendered) onRendered();
    }
  });
  return null;
}

function Scene({ onRendered }) {
  return (
    <>
      <RenderNotifier onRendered={onRendered} />
      {/* High-Performance Instant Studio Lighting — Zero Network Latency */}
      <hemisphereLight args={['#ffffff', '#181e2e', 0.65]} />
      <directionalLight
        position={[4, 7, 5]}
        intensity={1.45}
        castShadow
        shadow-mapSize={[512, 512]}
        shadow-bias={-0.0008}
        color="#ffffff"
      />
      <directionalLight position={[-4, 3, 2]} intensity={0.65} color="#93c5fd" />
      <directionalLight position={[0, 5, -5]} intensity={0.9} color="#ffffff" />
      <pointLight position={[0, -0.5, 2.5]} intensity={0.4} color="#ffd500" />
      <ambientLight intensity={0.45} color="#ffffff" />

      {/* Character — stable on ground, only rotates when dragged by user */}
      <group position={[0, -1.8, 0]}>
        <Minifigure />
      </group>

      {/* Decor — only the bricks float and tumble */}
      <FloatingBricks />
      <Particles />

      {/* Soft Procedural Ground Contact Shadow (100% stable, zero white-flash glitch) */}
      <GroundShadow position={[0, -2.14, 0]} />

      {/* Controls — No auto-rotation, only rotates on manual drag */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={false}
        target={[0, 0.3, 0]}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.8}
        enableDamping
        dampingFactor={0.05}
      />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   EXPORT — Robust WebGL with Auto-Recovery & Interactive Poses
   ═══════════════════════════════════════════════════════════════ */
export default function LegoMinifigure() {
  const glRef = useRef(null);
  const [contextLost, setContextLost] = useState(false);
  const [canvasKey, setCanvasKey] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Cleanly handle browser tab close without destroying active context during client-side route navigation
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (glRef.current) {
        try {
          glRef.current.dispose();
        } catch {
          // ignore
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center bg-transparent">
      <div 
        className="w-full h-full relative bg-transparent transition-opacity duration-500 ease-out"
        style={{ opacity: isLoaded ? 1 : 0 }}
      >
        {contextLost && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#0B0C10]/60 backdrop-blur-xs">
            <div className="w-8 h-8 border-2 border-[#FFD500]/20 border-t-[#FFD500] rounded-full animate-spin" />
          </div>
        )}
        <Canvas
          key={canvasKey}
          shadows
          camera={{ position: [0, 1.2, 6], fov: 36 }}
          dpr={[1, 1.5]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
            stencil: false,
            depth: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.0,
          }}
          onCreated={({ gl, scene, camera }) => {
            glRef.current = gl;
            gl.setClearColor(0x000000, 0);
            gl.clear();
            gl.domElement.style.backgroundColor = 'transparent';
            try {
              gl.compile(scene, camera);
            } catch {
              // ignore
            }
            requestAnimationFrame(() => {
              setIsLoaded(true);
            });

            const canvasEl = gl.domElement;
            const handleContextLost = (event) => {
              event.preventDefault();
              setContextLost(true);
              console.warn('WebGL context lost. Restoring cleanly...');
              setTimeout(() => {
                setCanvasKey(prev => prev + 1);
                setContextLost(false);
              }, 100);
            };

            const handleContextRestored = () => {
              setContextLost(false);
            };

            canvasEl.addEventListener('webglcontextlost', handleContextLost, false);
            canvasEl.addEventListener('webglcontextrestored', handleContextRestored, false);
          }}
          style={{ background: 'transparent' }}
        >
          <Suspense fallback={null}>
            <Scene onRendered={() => setIsLoaded(true)} />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}

