import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  OrbitControls, Float,
  RoundedBox,
} from '@react-three/drei';
import { useRef, useMemo, useState, useEffect, Suspense, Component } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { LegoBrick3D } from './Lego3DComponents';

export const isMobileDevice = typeof window !== 'undefined' && (
  /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
  (window.innerWidth < 768)
);

export function isWebGLAvailable() {
  if (typeof window === 'undefined') return true;
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

class CanvasErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.warn('Canvas Error Boundary caught an issue:', error, errorInfo);
    if (this.props.onError) this.props.onError();
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback || null;
    }
    return this.props.children;
  }
}

/* ═══════════════════════════════════════════════════════════════
   LIGHTWEIGHT FALLBACK LEGO AVATAR (For devices with WebGL disabled/crashing)
   ═══════════════════════════════════════════════════════════════ */
function LegoFallbackAvatar({ isThrowing, onThrowComplete, onInteractionReady }) {
  useEffect(() => {
    if (onInteractionReady) onInteractionReady(true);
  }, [onInteractionReady]);

  useEffect(() => {
    if (isThrowing) {
      const timer = setTimeout(() => {
        if (onThrowComplete) onThrowComplete();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isThrowing, onThrowComplete]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative select-none pointer-events-auto">
      <motion.div 
        className="relative flex flex-col items-center justify-center"
        animate={{ y: [-5, 5, -5], rotate: [-0.6, 0.6, -0.6] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Soft Ambient Halo */}
        <div className="absolute w-52 h-52 rounded-full bg-[#0055BF]/25 blur-3xl pointer-events-none" />
        <div className="absolute w-36 h-36 rounded-full bg-[#FFD500]/15 blur-2xl pointer-events-none" />

        {/* Vector Classic Space Lego Minifigure */}
        <svg viewBox="0 0 200 240" className="w-48 h-56 sm:w-56 sm:h-64 drop-shadow-[0_16px_32px_rgba(0,0,0,0.85)] overflow-visible">
          <defs>
            <linearGradient id="fbHead" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF275" />
              <stop offset="60%" stopColor="#FFD500" />
              <stop offset="100%" stopColor="#D49B00" />
            </linearGradient>
            <linearGradient id="fbBlue" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E75E8" />
              <stop offset="60%" stopColor="#0055BF" />
              <stop offset="100%" stopColor="#003580" />
            </linearGradient>
            <linearGradient id="fbTorso" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="70%" stopColor="#F1F5F9" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </linearGradient>
          </defs>

          {/* Baseplate Pedestal */}
          <ellipse cx="100" cy="226" rx="72" ry="12" fill="#003380" />
          <ellipse cx="100" cy="223" rx="68" ry="10" fill="url(#fbBlue)" />
          {/* Baseplate Studs */}
          <ellipse cx="80" cy="221" rx="8" ry="3.5" fill="#1E75E8" />
          <ellipse cx="100" cy="221" rx="8" ry="3.5" fill="#1E75E8" />
          <ellipse cx="120" cy="221" rx="8" ry="3.5" fill="#1E75E8" />

          {/* Legs & Boots */}
          <rect x="73" y="160" width="23" height="52" rx="4" fill="url(#fbBlue)" />
          <rect x="104" y="160" width="23" height="52" rx="4" fill="url(#fbBlue)" />
          {/* Feet */}
          <rect x="68" y="202" width="28" height="12" rx="3" fill="#003380" />
          <rect x="104" y="202" width="28" height="12" rx="3" fill="#003380" />
          
          {/* Hip Piece */}
          <rect x="71" y="148" width="58" height="16" rx="3" fill="#0040A8" />

          {/* Torso */}
          <polygon points="76,150 124,150 120,94 80,94" fill="url(#fbTorso)" stroke="#003580" strokeWidth="1.5" />
          {/* Classic Space Emblem */}
          <circle cx="100" cy="120" rx="9" ry="9" fill="#FFD500" />
          <path d="M 88 128 Q 100 110 112 116" stroke="#E3000B" strokeWidth="2.5" fill="none" strokeLinecap="round" />

          {/* Left Arm (Relaxed) */}
          <path d="M 78 96 L 63 132 L 71 140" stroke="url(#fbBlue)" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <circle cx="71" cy="142" r="7" fill="url(#fbHead)" />

          {/* Right Arm (Waving friendly greeting) */}
          <path d="M 122 96 L 140 116 L 146 102" stroke="url(#fbBlue)" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <circle cx="147" cy="98" r="7" fill="url(#fbHead)" />

          {/* Neck */}
          <rect x="94" y="85" width="12" height="10" rx="2" fill="url(#fbHead)" />

          {/* Head */}
          <rect x="83" y="50" width="34" height="38" rx="8" fill="url(#fbHead)" />
          {/* Eyes & Catchlights */}
          <circle cx="92" cy="67" r="3" fill="#111111" />
          <circle cx="93" cy="66" r="1" fill="#FFFFFF" />
          <circle cx="108" cy="67" r="3" fill="#111111" />
          <circle cx="109" cy="66" r="1" fill="#FFFFFF" />
          {/* Eyebrows */}
          <path d="M 88 61 Q 92 59 96 62" stroke="#3A1805" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <path d="M 104 62 Q 108 59 112 61" stroke="#3A1805" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          {/* Smile */}
          <path d="M 92 76 Q 100 83 108 76" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" fill="none" />

          {/* Classic LEGO Hair */}
          <path d="M 79 60 C 78 38 122 38 121 60 C 117 52 107 48 100 48 C 91 48 83 52 79 60 Z" fill="#0F172A" />
        </svg>

        {/* Orbiting Satellite Floating Bricks */}
        <motion.div 
          className="absolute -top-1 -right-2 w-7 h-5 bg-[#E3000B] rounded-[2px] shadow-lg border-t border-white/40"
          animate={{ y: [-4, 4, -4], rotate: [0, 12, 0] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-16 -left-3 w-6 h-6 bg-[#FFD500] rounded-[2px] shadow-lg border-t border-white/40"
          animate={{ y: [4, -4, 4], rotate: [0, -12, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════ */
function damp(current, target, lambda, dt) {
  return THREE.MathUtils.lerp(current, target, 1 - Math.exp(-lambda * dt));
}

// Classic Lego ABS plastic material — optimized for mobile GPU without heavy clearcoat overhead
const PLASTIC = (color) => ({
  color,
  roughness: 0.22,
  metalness: 0.0,
  clearcoat: isMobileDevice ? 0.0 : 0.65,
  clearcoatRoughness: isMobileDevice ? 0.0 : 0.2,
  envMapIntensity: isMobileDevice ? 0.45 : 0.9,
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
function LegoHead({ color = '#FFD000', animRef }) {
  const headRef = useRef();
  const blinkState = useRef({ next: 2.5, blinking: false, timer: 0, lastScale: 1.0 });

  // 1. Dynamic Face Canvas Texture — pad-printed directly onto the curved cylinder surface
  const faceTextureInfo = useMemo(() => {
    const canvas = document.createElement('canvas');
    const size = isMobileDevice ? 512 : 1024;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const s = size / 1024;

    const drawFace = (blinkScale = 1.0) => {
      ctx.clearRect(0, 0, size, size);

      const eyeY = 450 * s;
      const leftEyeX = 292 * s;
      const rightEyeX = 732 * s;
      const eyeRadiusX = 64 * s;
      const eyeRadiusY = Math.max(2, 64 * blinkScale * s);

      // Eyebrows — classic Lego arched brows
      ctx.strokeStyle = '#3a1805';
      ctx.lineWidth = 14 * s;
      ctx.lineCap = 'round';

      // Left eyebrow
      ctx.beginPath();
      ctx.moveTo(235 * s, 325 * s);
      ctx.quadraticCurveTo(292 * s, 305 * s, 345 * s, 332 * s);
      ctx.stroke();

      // Right eyebrow
      ctx.beginPath();
      ctx.moveTo(679 * s, 332 * s);
      ctx.quadraticCurveTo(732 * s, 305 * s, 789 * s, 325 * s);
      ctx.stroke();

      // Eyes with crisp specular catchlight
      const drawEye = (cx, cy) => {
        ctx.fillStyle = '#111111';
        ctx.beginPath();
        ctx.ellipse(cx, cy, eyeRadiusX, eyeRadiusY, 0, 0, Math.PI * 2);
        ctx.fill();

        // White specular catchlight dot
        if (blinkScale > 0.35) {
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(cx + 20 * s, cy - 20 * blinkScale * s, 18 * blinkScale * s, 0, Math.PI * 2);
          ctx.fill();
        }
      };
      drawEye(leftEyeX, eyeY);
      drawEye(rightEyeX, eyeY);

      // Classic Lego Smile — warm, friendly U-curve
      ctx.strokeStyle = '#111111';
      ctx.lineWidth = 26 * s;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      ctx.moveTo(335 * s, 670 * s);
      ctx.bezierCurveTo(400 * s, 755 * s, 624 * s, 755 * s, 689 * s, 670 * s);
      ctx.stroke();

      // Smile corner dimples
      ctx.lineWidth = 16 * s;
      ctx.beginPath();
      ctx.moveTo(330 * s, 680 * s);
      ctx.lineTo(345 * s, 655 * s);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(694 * s, 680 * s);
      ctx.lineTo(679 * s, 655 * s);
      ctx.stroke();
    };

    drawFace(1.0);
    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = isMobileDevice ? 2 : 8;
    return { texture, drawFace };
  }, []);

  // 2. Curved Decal Geometry matching exact cylinder taper and contour
  const faceDecalGeometry = useMemo(() => {
    const thetaLength = Math.PI * 0.44;
    const thetaStart = -thetaLength / 2;
    return new THREE.CylinderGeometry(0.6208, 0.6008, 0.82, 32, 1, true, thetaStart, thetaLength);
  }, []);

  useFrame((_, delta) => {
    const t = performance.now() / 1000;

    // Friendly, curious welcoming head acting looking towards visitors
    if (headRef.current) {
      let targetRotZ = 0.04 + Math.sin(t * 1.0) * 0.02;
      let targetRotY = Math.sin(t * 1.2) * 0.05;
      let targetRotX = Math.sin(t * 1.6) * 0.02;

      const a = animRef?.current;
      if (a && a.isThrowing && a.throwStartTime) {
        targetRotX = -0.06;
        targetRotY = 0.08;
        targetRotZ = -0.04;
      } else if (a && a.isWalking) {
        // Looking ahead in direction of walk with slight confident head tilt
        targetRotY = 0.12;
        targetRotX = 0.05;
        targetRotZ = -0.02;
      } else if (a && a.isIntroWave) {
        // Friendly greeting tilt while waving
        targetRotZ = 0.06 + Math.sin(t * 3.0) * 0.02;
        targetRotY = -0.05;
        targetRotX = -0.04;
      }

      headRef.current.rotation.x = damp(headRef.current.rotation.x, targetRotX, 4.0, delta);
      headRef.current.rotation.y = damp(headRef.current.rotation.y, targetRotY, 4.0, delta);
      headRef.current.rotation.z = damp(headRef.current.rotation.z, targetRotZ, 4.0, delta);
    }

    // Natural blink animation
    const bs = blinkState.current;
    bs.timer += delta;
    let blink = 1;
    if (bs.timer > bs.next) {
      const p = bs.timer - bs.next;
      if (p < 0.07) blink = Math.max(0.05, 1 - p / 0.07);
      else if (p < 0.14) blink = Math.min(1, (p - 0.07) / 0.07);
      else { bs.timer = 0; bs.next = 2 + Math.random() * 3; }
    }
    if (Math.abs(bs.lastScale - blink) > 0.02) {
      bs.lastScale = blink;
      faceTextureInfo.drawFace(blink);
      faceTextureInfo.texture.needsUpdate = true;
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

      {/* Curved Face Decal — 100% conforms to cylinder surface with ZERO air gap or floating */}
      <mesh geometry={faceDecalGeometry}>
        <meshBasicMaterial
          map={faceTextureInfo.texture}
          transparent
          depthWrite={false}
          polygonOffset
          polygonOffsetFactor={-1}
        />
      </mesh>
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
    <mesh geometry={geom} castShadow={!isMobileDevice} receiveShadow={!isMobileDevice}>
      <meshPhysicalMaterial
        color={color}
        roughness={0.16}
        metalness={0.02}
        clearcoat={isMobileDevice ? 0.0 : 0.96}
        clearcoatRoughness={isMobileDevice ? 0.0 : 0.08}
        envMapIntensity={isMobileDevice ? 0.5 : 1.2}
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
  const topW = 0.46; // top shoulders width = 0.92
  const botW = 0.63; // bottom waist width = 1.26 (flush with hips & legs!)
  const h = 1.10;    // authentic torso height
  const r = 0.09;    // smooth shoulder corner rounding

  // Draw continuous perimeter from bottom-left corner
  shape.moveTo(-botW, -h / 2);
  shape.lineTo(botW, -h / 2);
  shape.lineTo(topW, h / 2 - r);
  shape.quadraticCurveTo(topW, h / 2, topW - r, h / 2);
  shape.lineTo(-topW + r, h / 2);
  shape.quadraticCurveTo(-topW, h / 2, -topW, h / 2 - r);
  shape.lineTo(-botW, -h / 2);

  // Chunky, deep 3D torso matching authentic The Lego Movie minifigures
  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: 0.72, // Substantial 3D depth (was 0.48, eliminates the flat/gepeng look completely!)
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 1,
    bevelSize: 0.035,
    bevelThickness: 0.035,
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
    new THREE.Vector3(0, 0, 0),                           // Shoulder pivot
    new THREE.Vector3(sign * 0.18, -0.22, 0.04),          // Slopes down alongside torso bevel
    new THREE.Vector3(sign * 0.29, -0.44, 0.10),          // Elbow curves outward with clean air gap past torso bottom
    new THREE.Vector3(sign * 0.29, -0.62, 0.18),          // Forearm maintains solid air gap from hips
    new THREE.Vector3(sign * 0.28, -0.74, 0.24),          // Wrist terminates cleanly in front/beside thigh
  ];
  const curve = new THREE.CatmullRomCurve3(points);
  const geom = new THREE.TubeGeometry(curve, 24, 0.134, 18, false);
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

function LegoArm({ side = 'right', armColor = '#0040B8', handColor = '#FFD000', animRef }) {
  // Minifigure faces +Z (towards camera).
  // Minifigure's RIGHT arm: located at x = -0.50 (viewer's left).
  // Minifigure's LEFT arm: located at x = 0.50 (viewer's right).
  const x = side === 'right' ? -0.50 : 0.50;
  const sign = side === 'right' ? -1 : 1;
  const armRef = useRef();
  const handRef = useRef();
  const heldBrickRef = useRef();
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

    const a = animRef?.current;

    // Toggle held brick inside right C-claw: visible strictly from snatch completion (0.34s) to release (0.88s)
    if (heldBrickRef.current) {
      if (a && a.isThrowing && side === 'right' && a.throwStartTime) {
        const elapsed = (performance.now() / 1000) - a.throwStartTime;
        heldBrickRef.current.visible = (elapsed >= 0.34 && elapsed < 0.88);
      } else {
        heldBrickRef.current.visible = false;
      }
    }

    if (a && a.isThrowing && side === 'right' && a.throwStartTime) {
      // DYNAMIC OVERHEAD THROW ANIMATION — SNATCHES RED BRICK & PITCHES OVERHEAD
      const elapsed = (performance.now() / 1000) - a.throwStartTime;
      if (elapsed < 0.34) {
        // Phase 1: Reaches high up forward to snatch floating red Lego brick
        const p = elapsed / 0.34;
        const ease = Math.sin((p * Math.PI) / 2);
        targetX = THREE.MathUtils.lerp(0.04, -1.95, ease); // reaches high up forward
        targetZ = THREE.MathUtils.lerp(-0.04, -0.26, ease);
        targetY = THREE.MathUtils.lerp(0, 0.18, ease);
        targetHx = THREE.MathUtils.lerp(0, 0.45, ease); // open C-hand grasping
      } else if (elapsed < 0.70) {
        // Phase 2: High overhead wind-up! Arm cocks back above head
        const p = (elapsed - 0.34) / 0.36;
        const ease = Math.sin((p * Math.PI) / 2);
        targetX = THREE.MathUtils.lerp(-1.95, -2.70, ease); // cocks high overhead and back!
        targetZ = THREE.MathUtils.lerp(-0.26, -0.34, ease); // clear head with solid clearance
        targetY = THREE.MathUtils.lerp(0.18, 0.24, ease);
        targetHx = THREE.MathUtils.lerp(0.45, 0.30, ease); // secure clamp
      } else if (elapsed < 0.88) {
        // Phase 3: High overhead power pitch forward whip & release!
        const p = (elapsed - 0.70) / 0.18;
        const ease = Math.sin((p * Math.PI) / 2);
        targetX = THREE.MathUtils.lerp(-2.70, -1.25, ease); // overhead whip forward & release!
        targetZ = THREE.MathUtils.lerp(-0.34, -0.12, ease);
        targetY = THREE.MathUtils.lerp(0.24, -0.16, ease);
        targetHx = THREE.MathUtils.lerp(0.30, -0.55, ease); // forward wrist snap!
      } else {
        // Phase 4: Follow-through pointing towards screen
        targetX = -1.15;
        targetZ = -0.10;
        targetY = -0.15;
        targetHx = -0.55;
      }
    } else if (a && a.isThrowing && side === 'left' && a.throwStartTime) {
      // Left arm balances athletically during pitch
      const elapsed = (performance.now() / 1000) - a.throwStartTime;
      if (elapsed < 0.70) {
        // Balances up and forward during windup
        const p = Math.min(1.0, elapsed / 0.70);
        const ease = Math.sin((p * Math.PI) / 2);
        targetX = THREE.MathUtils.lerp(0, -0.80, ease);
        targetZ = THREE.MathUtils.lerp(0, 0.28, ease);
        targetY = THREE.MathUtils.lerp(0, -0.12, ease);
      } else {
        // Pulls back as right arm pitches forward
        const p = Math.min(1.0, (elapsed - 0.70) / 0.18);
        const ease = Math.sin((p * Math.PI) / 2);
        targetX = THREE.MathUtils.lerp(-0.80, 0.45, ease);
        targetZ = THREE.MathUtils.lerp(0.28, 0.10, ease);
        targetY = THREE.MathUtils.lerp(-0.12, 0, ease);
      }
    } else if (a && a.isWalking) {
      // WALK CYCLE ARM SWINGS (opposite of leg swings)
      if (side === 'left') {
        targetX = a.leftArmAngle;
        targetZ = 0.04;
        targetY = 0;
      } else {
        targetX = a.rightArmAngle;
        targetZ = -0.04;
        targetY = 0;
      }
    } else if (a && a.isIntroWave && side === 'right') {
      // IMMEDIATE GREETING WAVE WHEN ARRIVING AT BASEPLATE
      const lift = a.introWaveLift;
      const waveT = a.introWaveProgress;
      const waveMotion = Math.sin(waveT * 6.5);

      const restX = 0.04;
      const restZ = -0.04;
      const restY = 0;

      const waveX = -2.40 + Math.sin(waveT * 3.0) * 0.04;
      const waveZ = -0.42 - waveMotion * 0.18;
      const waveY = -0.22 - waveMotion * 0.08;

      targetX = THREE.MathUtils.lerp(restX, waveX, lift);
      targetZ = THREE.MathUtils.lerp(restZ, waveZ, lift);
      targetY = THREE.MathUtils.lerp(restY, waveY, lift);

      targetHx = THREE.MathUtils.lerp(0, 0.25 + Math.sin(waveT * 6.5) * 0.14, lift);
      targetHy = THREE.MathUtils.lerp(0, Math.cos(waveT * 6.5) * 0.40, lift);
      targetHz = THREE.MathUtils.lerp(0, Math.sin(waveT * 6.5) * 0.14, lift);
    } else if (side === 'right') {
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

    // Smooth physics damping (fast responsiveness during athletic throw)
    const armDamp = (a && a.isThrowing) ? 26.0 : 5.0;
    const handDamp = (a && a.isThrowing) ? 26.0 : 5.5;
    s.ax = damp(s.ax, targetX, armDamp, delta);
    s.az = damp(s.az, targetZ, armDamp, delta);
    s.ay = damp(s.ay, targetY, armDamp, delta);
    s.hx = damp(s.hx, targetHx, handDamp, delta);
    s.hy = damp(s.hy, targetHy, handDamp, delta);
    s.hz = damp(s.hz, targetHz, handDamp, delta);

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
          <sphereGeometry args={[0.19, 24, 20]} />
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

            {/* Held 2x2 Lego Brick firmly gripped inside right C-claw */}
            {side === 'right' && (
              <group 
                ref={heldBrickRef} 
                visible={false} 
                position={[0, -0.135, 0.028]} 
                rotation={[0.15, -Math.PI / 2 + 0.35, 0]} 
                scale={0.20}
              >
                <LegoBrick3D type="2x2" color="#E3000B" />
              </group>
            )}
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
      {/* Upper waist band — width 1.26, depth 0.78 flush with authentic chunky torso */}
      <mesh castShadow receiveShadow>
        <RoundedBox args={[1.26, 0.18, 0.78]} radius={0.03} smoothness={3}>
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
        <RoundedBox args={[0.12, 0.38, 0.74]} radius={0.03} smoothness={3}>
          <meshPhysicalMaterial
            color={color}
            roughness={0.16}
            clearcoat={0.95}
          />
        </RoundedBox>
      </mesh>

      {/* Horizontal pivot hinge cylinders */}
      <mesh position={[0, -0.06, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.22, 0.22, 1.22, 24]} />
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
function LegoLeg({ side = 'right', color = '#0040B8', animRef }) {
  const x = side === 'right' ? -0.34 : 0.34;
  const phase = side === 'right' ? 0 : Math.PI;
  const ref = useRef();
  const sx = useRef(0);

  useFrame((_, delta) => {
    const t = performance.now() / 1000;
    const a = animRef?.current;
    let target = 0;
    if (a && a.isThrowing && a.throwStartTime) {
      // DYNAMIC LEG STRIDE: Right leg swings boldly forward while throwing!
      const elapsed = (performance.now() / 1000) - a.throwStartTime;
      if (elapsed < 0.34) {
        // Phase 1: Standing steady to snatch red brick
        target = 0;
      } else if (elapsed < 0.70) {
        // Phase 2: Wind-up: right leg lifts back loading weight
        target = side === 'right' ? 0.32 : -0.05;
      } else {
        // Phase 3 & 4: Pitch & Stride: right leg swings dynamically FORWARD!
        target = side === 'right' ? -0.88 : 0.45;
      }
      sx.current = damp(sx.current, target, 16, delta);
    } else if (a && a.isWalking) {
      target = side === 'right' ? a.rightLegAngle : a.leftLegAngle;
      sx.current = damp(sx.current, target, 14, delta);
    } else {
      // Gentle natural idle sway matching the waving character's stance
      target = Math.sin(t * 0.8 + phase) * 0.03;
      sx.current = damp(sx.current, target, 4, delta);
    }
    if (ref.current) ref.current.rotation.x = sx.current;
  });

  return (
    <group ref={ref} position={[x, 1.01, 0]}>
      {/* Top rounded hip joint cylinder */}
      <mesh position={[0, 0.37, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.22, 0.22, 0.56, 24]} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.16}
          clearcoat={0.95}
          clearcoatRoughness={0.08}
          envMapIntensity={1.1}
        />
      </mesh>

      {/* Main shin column — depth 0.76 for solid authentic Lego proportions */}
      <mesh position={[0, -0.06, 0]} castShadow receiveShadow>
        <RoundedBox args={[0.56, 0.84, 0.76]} radius={0.03} smoothness={3}>
          <meshPhysicalMaterial
            color={color}
            roughness={0.16}
            clearcoat={0.95}
            clearcoatRoughness={0.08}
            envMapIntensity={1.1}
          />
        </RoundedBox>
      </mesh>

      {/* Foot toe step extension — iconic Lego foot projecting forward */}
      <mesh position={[0, -0.38, 0.10]} castShadow>
        <RoundedBox args={[0.56, 0.14, 0.96]} radius={0.025} smoothness={3}>
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
function Minifigure({ animRef, isIntroActive = false }) {
  const characterRef = useRef();

  useFrame((_, delta) => {
    const a = animRef?.current;
    if (!a) return;

    if (isIntroActive) {
      a.startTime = null;
      a.isWalking = true;
      a.isIntroWave = false;
      a.isIdle = false;
      a.x = a.startLocalX || -9.5;
      a.y = -0.14;
      a.rotY = Math.PI * 0.32;
      a.rotZ = 0;
      a.leftLegAngle = 0;
      a.rightLegAngle = 0;
      a.leftArmAngle = 0;
      a.rightArmAngle = 0;
      if (characterRef.current) {
        characterRef.current.position.x = a.x;
        characterRef.current.position.y = a.y;
        characterRef.current.rotation.y = a.rotY;
        characterRef.current.rotation.z = a.rotZ;
      }
      return;
    }

    const now = performance.now() / 1000;
    if (a.startTime === null) {
      a.startTime = now;
    }

    const elapsed = now - a.startTime;
    const START_X = a.startLocalX || -6.5;
    const WALK_DURATION = 3.4;
    const WAVE_START = 3.4;
    const WAVE_END = 6.0;

    if (a.isThrowing && a.throwStartTime) {
      a.isWalking = false;
      a.isIntroWave = false;
      a.isIdle = false;
      a.x = 0;
      a.y = 0;
      const tThrow = now - a.throwStartTime;
      const BASE_LEFT_ROT = -0.46; // Tetap konsisten menghadap rada ke kiri (~-26.4 deg) sama seperti idle
      if (tThrow < 0.34) {
        // Phase 1: Torso tetap menghadap rada ke kiri saat menyambar balok merah
        a.rotY = damp(a.rotY, BASE_LEFT_ROT, 18, delta);
        a.rotZ = damp(a.rotZ, 0, 18, delta);
      } else if (tThrow < 0.70) {
        // Phase 2: Overhead wind-up di atas kepala dengan badan tetap konsisten menghadap ke kiri
        const p = (tThrow - 0.34) / 0.36;
        const ease = Math.sin((p * Math.PI) / 2);
        a.rotY = THREE.MathUtils.lerp(BASE_LEFT_ROT, -0.38, ease); // sedikit coiling tapi tetap tegas menghadap kiri
        a.rotZ = THREE.MathUtils.lerp(0, 0.04, ease);
      } else if (tThrow < 0.88) {
        // Phase 3: Badan mendorong maju ke depan-kiri saat mencambuk lemparan overhead & melangkah
        const p = (tThrow - 0.70) / 0.18;
        const ease = Math.sin((p * Math.PI) / 2);
        a.rotY = THREE.MathUtils.lerp(-0.38, -0.56, ease); // dorongan mantap menghadap kiri
        a.rotZ = THREE.MathUtils.lerp(0.04, -0.06, ease);
      } else {
        // Phase 4: Follow-through tetap menghadap kiri
        a.rotY = -0.56;
        a.rotZ = -0.06;
      }
    } else if (elapsed < WALK_DURATION) {
      a.isWalking = true;
      a.isIntroWave = false;
      a.isIdle = false;

      const p = Math.min(elapsed / WALK_DURATION, 1.0);

      // Smooth custom ease-out: brisk stride, gentle deceleration onto stand
      const ease = 1 - Math.pow(1 - p, 1.75);
      a.x = START_X * (1 - ease);

      // Angled at ~32 degrees towards camera: showcases the full 3D volume, thick torso, and solid limbs
      const turnStart = 0.76;
      const IDLE_ROT_Y = -0.46; // Menghadap rada ke kiri (~-26.4 deg) agar terlihat dinamis 3D menghadap headline
      if (p < turnStart) {
        a.rotY = Math.PI * 0.32;
      } else {
        const turnP = (p - turnStart) / (1 - turnStart);
        const turnEase = (1 - Math.cos(turnP * Math.PI)) / 2;
        a.rotY = THREE.MathUtils.lerp(Math.PI * 0.32, IDLE_ROT_Y, turnEase);
      }

      // Walk swing amplitude reduces smoothly as he arrives
      a.walkWeight = p < 0.84 ? 1.0 : (1.0 - (p - 0.84) / 0.16);

      // Walk frequency: 11.2 rad/s (~1.78 steps/second)
      a.walkPhase = elapsed * 11.2;

      // Authentic Lego Minifigure Walk Cycle:
      a.leftLegAngle = Math.sin(a.walkPhase) * 0.58 * a.walkWeight;
      a.rightLegAngle = -Math.sin(a.walkPhase) * 0.58 * a.walkWeight;

      // Opposite arm swings
      a.leftArmAngle = -Math.sin(a.walkPhase) * 0.44 * a.walkWeight;
      a.rightArmAngle = Math.sin(a.walkPhase) * 0.44 * a.walkWeight;

      // Step up onto the baseplate (baseplate edge is around x = -1.70)
      let stepUp = 0;
      if (a.x < -1.75) {
        stepUp = -0.14; // on studio floor before baseplate
      } else if (a.x < -1.40) {
        const stepP = (a.x - (-1.75)) / 0.35;
        stepUp = THREE.MathUtils.lerp(-0.14, 0, (1 - Math.cos(stepP * Math.PI)) / 2);
      } else {
        stepUp = 0; // on top of baseplate
      }

      // Minifigure body bobbing (bounces slightly with each footstep)
      a.y = stepUp + Math.abs(Math.sin(a.walkPhase)) * 0.065 * a.walkWeight;

      // Subtle side-to-side waddle as weight shifts between legs
      a.rotZ = Math.sin(a.walkPhase) * 0.03 * a.walkWeight;

      a.introWaveLift = 0;
    } else if (elapsed < WAVE_END) {
      // Arrival & Greeting Wave Phase
      const IDLE_ROT_Y = -0.46;
      a.isWalking = false;
      a.isIntroWave = true;
      a.isIdle = false;

      a.x = 0;
      a.y = 0;
      a.rotY = IDLE_ROT_Y;
      a.rotZ = 0;
      a.leftLegAngle = 0;
      a.rightLegAngle = 0;
      a.leftArmAngle = 0;

      const waveElapsed = elapsed - WAVE_START;

      // Arm wave envelope: raise in 0.5s, wave for 1.7s, lower in 0.6s
      if (waveElapsed < 0.5) {
        a.introWaveLift = (1 - Math.cos((waveElapsed / 0.5) * Math.PI)) / 2;
      } else if (waveElapsed < 2.2) {
        a.introWaveLift = 1.0;
      } else {
        const downP = (waveElapsed - 2.2) / 0.6;
        a.introWaveLift = (1 + Math.cos(downP * Math.PI)) / 2;
      }

      a.introWaveProgress = waveElapsed;
    } else {
      // Idle Phase
      const IDLE_ROT_Y = -0.46;
      a.isWalking = false;
      a.isIntroWave = false;
      a.isIdle = true;

      a.x = 0;
      a.y = 0;
      a.rotY = IDLE_ROT_Y;
      a.rotZ = 0;
      a.leftLegAngle = 0;
      a.rightLegAngle = 0;
      a.leftArmAngle = 0;
      a.introWaveLift = 0;
    }

    if (characterRef.current) {
      characterRef.current.position.x = a.x;
      characterRef.current.position.y = a.y;
      characterRef.current.rotation.y = a.rotY;
      characterRef.current.rotation.z = a.rotZ;
    }
  });

  return (
    <group>
      {/* 1. Stationary Workstation: Baseplate Pedestal, Laptop, Coffee Mug */}
      <LegoBaseplate />
      <LegoLaptop position={[1.15, 0.53, 0.22]} rotation={[0, -0.32, 0]} />
      <LegoCoffeeMug position={[1.10, 0.53, -0.42]} color="#E3000B" />

      {/* 2. Animated Character Minifigure: walks in from left across screen onto baseplate */}
      <group ref={characterRef}>
        <LegoHead color="#FFD000" animRef={animRef} />
        <LegoTorso bodyColor="#ffffff" />
        <LegoArm side="left" armColor="#0040B8" handColor="#FFD000" animRef={animRef} />
        <LegoArm side="right" armColor="#0040B8" handColor="#FFD000" animRef={animRef} />
        <HipPiece color="#0040B8" />
        <LegoLeg side="left" color="#0040B8" animRef={animRef} />
        <LegoLeg side="right" color="#0040B8" animRef={animRef} />
      </group>
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

/* ═══════════════════════════════════════════════════════════════
   THROWN LEGO BRICK — Cinematic 3D Brick Throw Transition into /about
   ═══════════════════════════════════════════════════════════════ */
function ThrownLegoBrick({ animRef, onComplete, stationPosRef }) {
  const brickRef = useRef();

  useFrame(() => {
    if (!animRef?.current) return;
    const a = animRef.current;
    if (!a.isThrowing || !a.throwStartTime) {
      if (brickRef.current) brickRef.current.visible = false;
      return;
    }

    const now = performance.now() / 1000;
    const elapsed = now - a.throwStartTime;
    const RELEASE_TIME = 0.88;
    const IMPACT_TIME = 1.28;
    const FLIGHT_DURATION = IMPACT_TIME - RELEASE_TIME;

    const stX = stationPosRef.current ? stationPosRef.current.x : 0;
    const stY = stationPosRef.current ? stationPosRef.current.y : -2.02;

    if (elapsed < RELEASE_TIME) {
      // Balok masih digenggam kuat di tangan kanan (LegoArm heldBrickRef)
      if (brickRef.current) brickRef.current.visible = false;
    } else if (elapsed <= IMPACT_TIME + 0.04) {
      // Balok dilepas dari tangan dan melesat ke arah layar kamera!
      if (brickRef.current) {
        brickRef.current.visible = true;
        const flightT = Math.min(1.0, (elapsed - RELEASE_TIME) / FLIGHT_DURATION);
        const ease = Math.pow(flightT, 1.35);

        // Posisi rilis persis dari tangan kanan yang mencambuk ke depan
        const startX = stX - 0.72;
        const startY = stY + 2.45;
        const startZ = 1.15;

        // Target kamera di tengah layar pada z = 10.15 (menutup pandangan lensa kamera tepat sebelum pecah)
        const currX = THREE.MathUtils.lerp(startX, 0, ease);
        const currY = THREE.MathUtils.lerp(startY, 0.15, ease) + Math.sin(flightT * Math.PI) * 0.20;
        const currZ = THREE.MathUtils.lerp(startZ, 10.15, ease);

        brickRef.current.position.set(currX, currY, currZ);

        // Dynamic 3D tumble & spin
        brickRef.current.rotation.x = flightT * Math.PI * 4.2;
        brickRef.current.rotation.y = -0.36 + flightT * Math.PI * 4.8;
        brickRef.current.rotation.z = flightT * Math.PI * 3.2;

        // Skala membesar saat mendekati kamera hingga menutup layar tepat sebelum meledak pecah menjadi balok-balok kecil 3D
        const scale = THREE.MathUtils.lerp(0.20, 2.2, Math.pow(flightT, 1.6));
        brickRef.current.scale.set(scale, scale, scale);

        // Pecah saat menghantam layar kamera: pemicu transisi ledakan balok 3D
        if (flightT >= 0.97 && !a.hasCompletedThrow) {
          a.hasCompletedThrow = true;
          if (onComplete) onComplete();
        }
      }
    } else {
      // Failsafe guarantee
      if (!a.hasCompletedThrow) {
        a.hasCompletedThrow = true;
        if (onComplete) onComplete();
      }
      if (brickRef.current) brickRef.current.visible = false;
    }
  });

  return (
    <group ref={brickRef} visible={false}>
      <LegoBrick3D type="2x2" color="#E3000B" />
    </group>
  );
}

function FloatingBricks({ animRef }) {
  const orbitRef = useRef();
  const redBrickRef = useRef();

  // Aktif memutar orbit balok-balok LEGO mengelilingi karakter (360 derajat)
  useFrame((_, delta) => {
    if (orbitRef.current) {
      orbitRef.current.rotation.y += delta * 0.42;
    }

    if (redBrickRef.current) {
      const a = animRef?.current;
      if (a && a.isThrowing && a.throwStartTime) {
        const elapsed = (performance.now() / 1000) - a.throwStartTime;
        if (elapsed < 0.34) {
          // Balok merah meluncur mulus dari orbit ke tangan kanan yang meraihnya
          redBrickRef.current.visible = true;
          const p = elapsed / 0.34;
          const ease = p * p * (3 - 2 * p); // smoothstep curve
          const startX = isMobileDevice ? -0.85 : -1.65;
          const startY = isMobileDevice ? 1.85 : 2.85;
          const startZ = isMobileDevice ? 0.90 : 1.35;
          const handX = -0.72;
          const handY = 2.52;
          const handZ = 0.82;
          redBrickRef.current.position.set(
            THREE.MathUtils.lerp(startX, handX, ease),
            THREE.MathUtils.lerp(startY, handY, ease),
            THREE.MathUtils.lerp(startZ, handZ, ease)
          );
          redBrickRef.current.scale.setScalar(THREE.MathUtils.lerp(0.28, 0.20, ease));
        } else {
          // Setelah t >= 0.34s, balok sudah berada di tangan kanan (heldBrickRef)
          redBrickRef.current.visible = false;
        }
      } else {
        redBrickRef.current.visible = true;
      }
    }
  });

  const bricks = useMemo(() => {
    // On mobile devices, use 3 primary Classic Space bricks with a tighter orbit radius (1.35) so they never touch text or screen boundaries
    if (isMobileDevice) {
      const items = [
        { id: 'red', color: '#E3000B', type: '2x2', y: 1.8, r: 1.35, scale: 0.18, speed: 1.4 },
        { id: 'yellow', color: '#FFD500', type: '2x4', y: 1.3, r: 1.45, scale: 0.18, speed: 1.2 },
        { id: 'blue', color: '#0055BF', type: '2x2', y: 2.1, r: 1.40, scale: 0.18, speed: 1.5 },
      ];
      return items.map((item, i) => {
        const angle = (i / 3) * Math.PI * 2;
        return {
          ...item,
          pos: [Math.cos(angle) * item.r, item.y, Math.sin(angle) * item.r],
          rot: [0.3 + (i * 0.4), 0.5 + (i * 0.6), -0.2 + (i * 0.3)],
        };
      });
    }

    // 5 balok LEGO warna-warni yang mengitari karakter setinggi torso, bahu, dan kepala on desktop
    const count = 5;
    const items = [
      { id: 'red', color: '#E3000B', type: '2x4', y: 2.7, r: 2.50, scale: 0.28, speed: 1.4 },
      { id: 'yellow', color: '#FFD500', type: '2x4', y: 1.9, r: 2.65, scale: 0.26, speed: 1.2 },
      { id: 'blue', color: '#0055BF', type: '2x2', y: 1.2, r: 2.45, scale: 0.28, speed: 1.5 },
      { id: 'green', color: '#00852B', type: '2x4', y: 3.1, r: 2.60, scale: 0.25, speed: 1.1 },
      { id: 'orange', color: '#FE8A18', type: '2x2', y: 2.2, r: 2.50, scale: 0.27, speed: 1.3 },
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
          <group 
            ref={b.id === 'red' ? redBrickRef : undefined}
            position={b.pos} 
            rotation={b.rot} 
            scale={b.scale}
          >
            <LegoBrick3D type={b.type} color={b.color} />
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

function WalkingContactShadow({ animRef }) {
  const shadowRef = useRef();
  const texture = useMemo(() => getGroundShadowTexture(), []);

  useFrame(() => {
    if (shadowRef.current && animRef?.current) {
      const a = animRef.current;
      shadowRef.current.position.x = a.x;
      if (a.isWalking && a.x < -1.5) {
        shadowRef.current.visible = true;
        const scale = Math.max(0.6, 1.0 - (a.y + 0.14) * 1.5);
        shadowRef.current.scale.set(scale, scale, scale);
      } else {
        shadowRef.current.visible = false;
      }
    }
  });

  return (
    <group ref={shadowRef} position={[-6.5, -0.14, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.5, 1.0]} />
        <meshBasicMaterial map={texture} transparent opacity={0.55} depthWrite={false} />
      </mesh>
    </group>
  );
}

function GroundShadow({ position = [0, -0.34, 0] }) {
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

function Scene({ onRendered, animRef, domElement, isIntroActive, onThrowComplete, onInteractionReady }) {
  const stationGroupRef = useRef();
  const { viewport, size } = useThree();

  const isDesktop = size.width >= 1024;
  const isMobile = size.width < 768;
  const initialScale = isDesktop ? 1.0 : (isMobile ? 0.76 : 0.86);

  const initialX = isDesktop ? Math.min(3.2, Math.max(1.8, viewport.width * 0.26)) : 0;
  const initialY = isDesktop ? -2.02 : -viewport.height * 0.26;
  const stationPosRef = useRef({ x: initialX, y: initialY });

  // Smooth rotation interaction
  const rotTarget = useRef({ x: 0, y: 0 });
  const rotCurrent = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const prevPointer = useRef({ x: 0, y: 0 });
  const reportedReady = useRef(false);

  useEffect(() => {
    if (!domElement) return;

    const onDown = (e) => {
      // ONLY allow dragging if minifigure has completed walk-in and is settled into idle, and not throwing!
      if (!animRef?.current || !animRef.current.isIdle || animRef.current.isThrowing) return;
      isDragging.current = true;
      prevPointer.current = { x: e.clientX, y: e.clientY };
    };

    const onMove = (e) => {
      if (!isDragging.current) return;
      if (!animRef?.current || !animRef.current.isIdle || animRef.current.isThrowing) {
        isDragging.current = false;
        return;
      }
      const dx = e.clientX - prevPointer.current.x;
      const dy = e.clientY - prevPointer.current.y;
      prevPointer.current = { x: e.clientX, y: e.clientY };

      rotTarget.current.y += dx * 0.008;
      rotTarget.current.x = Math.max(-0.25, Math.min(0.35, rotTarget.current.x + dy * 0.006));
    };

    const onUp = () => {
      isDragging.current = false;
    };

    domElement.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);

    return () => {
      domElement.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [domElement]);

  useFrame((_, delta) => {
    const isDesktop = size.width >= 1024;
    const isMobile = size.width < 768;
    const currentScale = isDesktop ? 1.0 : (isMobile ? 0.76 : 0.86);

    let targetX = isDesktop ? Math.min(3.2, Math.max(1.8, viewport.width * 0.26)) : 0;
    const centerOffset = 1.7 * currentScale;
    let targetY = isDesktop ? -2.02 : (-viewport.height * 0.26 - centerOffset * 0.35);

    if (domElement) {
      const rect = domElement.getBoundingClientRect();
      const px = rect.left + rect.width / 2;
      const py = rect.top + rect.height / 2;
      const ndcX = (px / size.width) * 2 - 1;
      const ndcY = -(py / size.height) * 2 + 1;
      
      const worldX = (ndcX * viewport.width) / 2;
      const worldY = (ndcY * viewport.height) / 2;

      targetX = worldX;
      targetY = isDesktop ? (worldY - 2.02) : (worldY - centerOffset);
    }

    stationPosRef.current = { x: targetX, y: targetY };

    // Automatically snap back to facing front when throwing, otherwise smoothly track drag rotation
    if (animRef?.current?.isThrowing) {
      rotTarget.current.x = 0;
      rotTarget.current.y = 0;
      isDragging.current = false;
      rotCurrent.current.x = damp(rotCurrent.current.x, 0, 18, delta);
      rotCurrent.current.y = damp(rotCurrent.current.y, 0, 18, delta);
    } else {
      rotCurrent.current.x = damp(rotCurrent.current.x, rotTarget.current.x, 8, delta);
      rotCurrent.current.y = damp(rotCurrent.current.y, rotTarget.current.y, 8, delta);
    }

    // Notify parent when minifigure is in idle and ready for interaction
    if (animRef?.current?.isIdle && !reportedReady.current) {
      reportedReady.current = true;
      if (onInteractionReady) onInteractionReady(true);
    }

    if (stationGroupRef.current) {
      stationGroupRef.current.position.x = targetX;
      stationGroupRef.current.position.y = targetY;
      stationGroupRef.current.scale.setScalar(currentScale);
      stationGroupRef.current.rotation.x = rotCurrent.current.x;
      stationGroupRef.current.rotation.y = rotCurrent.current.y;
    }

    // Dynamic start position starting off the far left edge of the screen
    if (animRef?.current) {
      const worldLeftEdge = -viewport.width / 2 - 1.5;
      animRef.current.startLocalX = (worldLeftEdge - targetX) / currentScale;
      if (animRef.current.startTime === null) {
        animRef.current.x = animRef.current.startLocalX;
      }
    }
  });

  return (
    <>
      <RenderNotifier onRendered={onRendered} />
      {/* High-Performance Instant Studio Lighting — Zero Network Latency */}
      <hemisphereLight args={['#ffffff', '#181e2e', isMobileDevice ? 0.8 : 0.65]} />
      <directionalLight
        position={[5, 9, 6]}
        intensity={isMobileDevice ? 1.6 : 1.55}
        castShadow={!isMobileDevice}
        shadow-mapSize={isMobileDevice ? [256, 256] : [512, 512]}
        shadow-bias={-0.0008}
        color="#ffffff"
      />
      <directionalLight position={[-5, 4, 3]} intensity={0.7} color="#93c5fd" />
      <directionalLight position={[0, 6, -6]} intensity={0.8} color="#ffffff" />
      <pointLight position={[0, -0.5, 3.0]} intensity={0.4} color="#ffd500" />
      <ambientLight intensity={isMobileDevice ? 0.55 : 0.45} color="#ffffff" />

      {/* Unified 3D Workstation & Character Group */}
      <group ref={stationGroupRef} position={[initialX, initialY, 0]} scale={initialScale}>
        <Minifigure animRef={animRef} isIntroActive={isIntroActive} />
        {/* Decor — only the bricks float and tumble */}
        <FloatingBricks animRef={animRef} />
        {/* Walking contact shadow follows character as he walks across floor */}
        <WalkingContactShadow animRef={animRef} />
        {/* Soft Procedural Ground Contact Shadow under workstation stand */}
        <GroundShadow position={[0, -0.34, 0]} />
      </group>

      {/* 3D Thrown Lego Brick hurtling straight into camera lens on Discover More click */}
      <ThrownLegoBrick animRef={animRef} onComplete={onThrowComplete} stationPosRef={stationPosRef} />

      {/* Ambient background particles */}
      <Particles />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   EXPORT — Robust WebGL with Auto-Recovery & Interactive Poses
   ═══════════════════════════════════════════════════════════════ */
export default function LegoMinifigure({ domTarget, isIntroActive = false, isThrowing = false, onThrowComplete, onInteractionReady }) {
  const glRef = useRef(null);
  const [contextLost, setContextLost] = useState(false);
  const [webGLError, setWebGLError] = useState(!isWebGLAvailable());
  const [canvasKey, setCanvasKey] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const lostCountRef = useRef(0);

  // Central animation state coordinator for walk-in sequence & brick throw
  const animRef = useRef({
    startTime: null,
    isWalking: true,
    isIntroWave: false,
    isIdle: false,
    isThrowing: false,
    throwStartTime: null,
    hasCompletedThrow: false,
    startLocalX: -6.5,
    x: -6.5,
    y: 0,
    rotY: Math.PI * 0.32,
    rotZ: 0,
    walkPhase: 0,
    walkWeight: 1,
    leftLegAngle: 0,
    rightLegAngle: 0,
    leftArmAngle: 0,
    rightArmAngle: 0,
    introWaveLift: 0,
    introWaveProgress: 0,
  });

  // Trigger throw sequence when isThrowing becomes true
  useEffect(() => {
    if (isThrowing && animRef.current && !animRef.current.isThrowing) {
      animRef.current.isThrowing = true;
      animRef.current.throwStartTime = performance.now() / 1000;
      animRef.current.hasCompletedThrow = false;
    }
  }, [isThrowing]);

  // Automatically start walk-in sequence as soon as airplane intro curtain reveals the screen
  useEffect(() => {
    if (!isIntroActive && animRef.current) {
      const t = setTimeout(() => {
        if (animRef.current) {
          animRef.current.startTime = performance.now() / 1000;
          animRef.current.isWalking = true;
          animRef.current.isIntroWave = false;
          animRef.current.isIdle = false;
          animRef.current.x = animRef.current.startLocalX || -9.5;
        }
      }, 100);
      return () => clearTimeout(t);
    }
  }, [isIntroActive]);

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

  if (webGLError) {
    return (
      <div className="w-full h-full relative bg-transparent flex items-center justify-center pointer-events-auto">
        <LegoFallbackAvatar 
          isThrowing={isThrowing} 
          onThrowComplete={onThrowComplete} 
          onInteractionReady={onInteractionReady} 
        />
      </div>
    );
  }

  return (
    <div className="w-full h-full relative bg-transparent transition-opacity duration-500 ease-out" style={{ opacity: isLoaded ? 1 : 0 }}>
      {contextLost && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#0B0C10]/60 backdrop-blur-xs">
          <div className="w-8 h-8 border-2 border-[#FFD500]/20 border-t-[#FFD500] rounded-full animate-spin" />
        </div>
      )}
      <CanvasErrorBoundary 
        fallback={
          <LegoFallbackAvatar 
            isThrowing={isThrowing} 
            onThrowComplete={onThrowComplete} 
            onInteractionReady={onInteractionReady} 
          />
        }
        onError={() => setWebGLError(true)}
      >
        <Canvas
          key={canvasKey}
          shadows={!isMobileDevice}
          camera={{ position: [0, 0.2, 10.8], fov: 28 }}
          dpr={isMobileDevice ? 1 : [1, 1.5]}
          gl={{
            antialias: !isMobileDevice,
            alpha: true,
            powerPreference: isMobileDevice ? 'default' : 'high-performance',
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
              lostCountRef.current += 1;
              console.warn(`WebGL context lost (count: ${lostCountRef.current}).`);
              if (lostCountRef.current > 2) {
                console.warn('WebGL context lost repeatedly. Falling back to lightweight SVG avatar.');
                setWebGLError(true);
                return;
              }
              setContextLost(true);
              setTimeout(() => {
                setCanvasKey(prev => prev + 1);
                setContextLost(false);
              }, 200);
            };

            const handleContextRestored = () => {
              setContextLost(false);
            };

            canvasEl.addEventListener('webglcontextlost', handleContextLost, false);
            canvasEl.addEventListener('webglcontextrestored', handleContextRestored, false);
          }}
          style={{ width: '100%', height: '100%', background: 'transparent', pointerEvents: 'none' }}
        >
          <Suspense fallback={null}>
            <Scene 
              onRendered={() => setIsLoaded(true)} 
              animRef={animRef} 
              domElement={domTarget} 
              isIntroActive={isIntroActive} 
              onThrowComplete={onThrowComplete}
              onInteractionReady={onInteractionReady}
            />
          </Suspense>
        </Canvas>
      </CanvasErrorBoundary>
    </div>
  );
}

