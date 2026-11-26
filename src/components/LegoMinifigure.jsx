import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  OrbitControls, Float,
  RoundedBox,
} from '@react-three/drei';
import { useRef, useMemo, useState, useEffect, Suspense, Component } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { RoundedBoxGeometry } from 'three-stdlib';

/**
 * Singleton Geometry Pool for Lego Bricks
 * Allocates buffer geometries once at module load to guarantee zero runtime allocation
 */
const LEGO_BRICK_GEOMS = {
  box2x4: new RoundedBoxGeometry(3.2, 0.96, 1.6, 2, 0.06),
  box2x2: new RoundedBoxGeometry(1.6, 0.96, 1.6, 2, 0.06),
  box1x2: new RoundedBoxGeometry(1.6, 0.96, 0.8, 2, 0.06),
  box1x1: new RoundedBoxGeometry(0.8, 0.96, 0.8, 2, 0.06),
  studCylinder: new THREE.CylinderGeometry(0.24, 0.24, 0.20, 16),
  studBoss: new THREE.CylinderGeometry(0.38, 0.38, 0.32, 18),
  studCap: new THREE.CylinderGeometry(0.22, 0.22, 0.14, 16),
};

function createLegoBrickMaterial(color = '#E3000B') {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 0.18,
    metalness: 0.04,
    envMapIntensity: 1.0,
  });
}

const STUD_OFFSETS = {
  '2x4': [
    [-1.2, 0.58, -0.4], [-0.4, 0.58, -0.4], [0.4, 0.58, -0.4], [1.2, 0.58, -0.4],
    [-1.2, 0.58, 0.4], [-0.4, 0.58, 0.4], [0.4, 0.58, 0.4], [1.2, 0.58, 0.4]
  ],
  '2x2': [
    [-0.4, 0.58, -0.4], [0.4, 0.58, -0.4],
    [-0.4, 0.58, 0.4], [0.4, 0.58, 0.4]
  ],
  '1x2': [
    [-0.4, 0.58, 0], [0.4, 0.58, 0]
  ],
  '1x1': [
    [0, 0.58, 0]
  ]
};

export function LegoBrick3D({ type = '2x2', color = '#E3000B', material, castShadow = false, receiveShadow = false }) {
  const localMat = useMemo(() => (!material ? createLegoBrickMaterial(color) : null), [material, color]);
  const mat = material || localMat;

  if (type === 'stud') {
    return (
      <group>
        <mesh 
          geometry={LEGO_BRICK_GEOMS.studBoss} 
          material={mat} 
          castShadow={castShadow} 
          receiveShadow={receiveShadow} 
        />
        <mesh 
          geometry={LEGO_BRICK_GEOMS.studCap} 
          material={mat} 
          position={[0, 0.20, 0]} 
          castShadow={castShadow} 
          receiveShadow={receiveShadow} 
        />
      </group>
    );
  }

  const geom = LEGO_BRICK_GEOMS[`box${type}`] || LEGO_BRICK_GEOMS.box2x2;
  const studs = STUD_OFFSETS[type] || STUD_OFFSETS['2x2'];

  return (
    <group>
      {/* Brick Body */}
      <mesh 
        geometry={geom} 
        material={mat} 
        castShadow={castShadow} 
        receiveShadow={receiveShadow} 
      />

      {/* Brick Studs */}
      {studs.map((pos, idx) => (
        <mesh 
          key={idx} 
          geometry={LEGO_BRICK_GEOMS.studCylinder} 
          material={mat} 
          position={pos} 
          castShadow={castShadow} 
          receiveShadow={receiveShadow} 
        />
      ))}
    </group>
  );
}

export const isMobileDevice = typeof window !== 'undefined' && (
  /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
  (window.innerWidth < 768)
);

export function isWebGLAvailable() {
  if (typeof window === 'undefined') return true;
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    const available = !!(window.WebGLRenderingContext && gl);
    if (gl) {
      try {
        const ext = gl.getExtension('WEBGL_lose_context');
        if (ext) ext.loseContext();
      } catch {
        // ignore
      }
    }
    return available;
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
  componentDidUpdate(prevProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false });
    }
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
        <svg viewBox="0 0 200 240" className="w-44 h-52 sm:w-56 sm:h-64 drop-shadow-[0_16px_32px_rgba(0,0,0,0.85)] overflow-visible">
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

          {/* Torso — clean solid color */}
          <polygon points="76,150 124,150 120,94 80,94" fill="url(#fbTorso)" stroke="#003580" strokeWidth="1.5" />

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
   HELPERS & ULTRA-PERFORMANT MATERIAL FACTORY
   ═══════════════════════════════════════════════════════════════ */
function damp(current, target, lambda, dt) {
  // Clamped dt prevents explosive overshoots on frame drops
  const safeDt = Math.min(dt, 0.033);
  return THREE.MathUtils.lerp(current, target, 1 - Math.exp(-lambda * safeDt));
}

// Global material singleton cache — prevents GPU program thrashing & enables Three.js draw-call batching
const materialCache = new Map();

export function getLegoMaterial(color, isMobile = isMobileDevice, customProps = {}) {
  const roughness = customProps.roughness !== undefined ? customProps.roughness : 0.20;
  const metalness = customProps.metalness !== undefined ? customProps.metalness : 0.0;
  const side = customProps.side || THREE.FrontSide;
  const key = `${color}_${isMobile ? 'm' : 'd'}_${roughness}_${metalness}_${side}`;

  if (!materialCache.has(key)) {
    let mat;
    if (isMobile) {
      // Single-pass standard PBR for mobile: zero clearcoat overhead, locked 60/120 FPS
      mat = new THREE.MeshStandardMaterial({
        color,
        roughness,
        metalness,
        envMapIntensity: 0.5,
        side,
      });
    } else {
      // Full authentic ABS clearcoat for desktop
      mat = new THREE.MeshPhysicalMaterial({
        color,
        roughness,
        metalness,
        clearcoat: 0.90,
        clearcoatRoughness: 0.08,
        envMapIntensity: 1.0,
        side,
      });
    }
    materialCache.set(key, mat);
  }
  return materialCache.get(key);
}

// Fallback PLASTIC for backward compatibility
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
  const studMat = useMemo(() => getLegoMaterial(color), [color]);
  const ringMat = useMemo(() => getLegoMaterial(color, isMobileDevice, { roughness: 0.3, side: THREE.DoubleSide }), [color]);

  return (
    <group position={position} scale={scale}>
      <mesh castShadow={!isMobileDevice} material={studMat}>
        <cylinderGeometry args={[0.16, 0.16, 0.12, 18]} />
      </mesh>
      {/* Hollow ring on top */}
      <mesh position={[0, 0.061, 0]} material={ringMat}>
        <ringGeometry args={[0.08, 0.155, 18]} />
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
    const dt = Math.min(delta, 0.033);
    const t = performance.now() / 1000;

    // Friendly, curious welcoming head acting looking towards visitors
    if (headRef.current) {
      let targetRotZ = 0.04 + Math.sin(t * 1.0) * 0.02;
      let targetRotY = Math.sin(t * 1.2) * 0.05;
      let targetRotX = Math.sin(t * 1.6) * 0.02;

      const a = animRef?.current;
      if (a && a.isThrowing && a.throwStartTime) {
        const elapsed = (performance.now() / 1000) - a.throwStartTime;
        if (elapsed < 0.40) {
          // Looks up and forward tracking incoming red brick
          targetRotX = -0.08;
          targetRotY = 0.14;
          targetRotZ = -0.04;
        } else if (elapsed < 0.80) {
          // Locks onto camera lens during high overhead wind-up
          targetRotX = -0.04;
          targetRotY = 0.05;
          targetRotZ = -0.02;
        } else {
          // Nods dynamically into the pitch and follow-through
          targetRotX = 0.08;
          targetRotY = -0.02;
          targetRotZ = 0.02;
        }
      } else {
        // Zero-G Curious Astronaut Head Motion — menatap ramah dengan tilt alami gravitasi nol
        targetRotX = -0.02 + Math.sin(t * 1.3) * 0.03;
        targetRotY = Math.sin(t * 1.1) * 0.07;
        targetRotZ = 0.035 + Math.sin(t * 0.9) * 0.03;
      }

      headRef.current.rotation.x = damp(headRef.current.rotation.x, targetRotX, 4.0, dt);
      headRef.current.rotation.y = damp(headRef.current.rotation.y, targetRotY, 4.0, dt);
      headRef.current.rotation.z = damp(headRef.current.rotation.z, targetRotZ, 4.0, dt);
    }

    // Natural keyframed blink animation — avoids GPU texImage2D upload pipeline stalls
    const bs = blinkState.current;
    bs.timer += dt;
    let targetBlink = 1.0;
    if (bs.timer > bs.next) {
      const p = bs.timer - bs.next;
      if (p < 0.06) targetBlink = 0.35;
      else if (p < 0.12) targetBlink = 0.05;
      else if (p < 0.18) targetBlink = 0.35;
      else { 
        bs.timer = 0; 
        bs.next = 2.5 + Math.random() * 3.5; 
        targetBlink = 1.0; 
      }
    }
    if (Math.abs(bs.lastScale - targetBlink) > 0.08) {
      bs.lastScale = targetBlink;
      faceTextureInfo.drawFace(targetBlink);
      faceTextureInfo.texture.needsUpdate = true;
    }
  });

  const headMat = useMemo(() => getLegoMaterial(color, isMobileDevice), [color]);

  return (
    <group position={[0, 3.08, 0]} ref={headRef}>
      {/* Head cylinder — classic Lego proportions */}
      <mesh castShadow={!isMobileDevice} receiveShadow={!isMobileDevice} material={headMat}>
        <cylinderGeometry args={[0.62, 0.60, 0.82, 24]} />
      </mesh>

      {/* Black under-hair scalp cap covering top head surface so yellow NEVER bleeds through */}
      <mesh position={[0, 0.412, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.625, 24]} />
        <meshBasicMaterial color="#0e0e0e" />
      </mesh>

      {/* Bottom lip ring */}
      <mesh position={[0, -0.41, 0]} material={headMat}>
        <cylinderGeometry args={[0.61, 0.60, 0.02, 24]} />
      </mesh>

      {/* Clean, sleek Yellow Neck Cylinder — perfectly bridging head to torso */}
      <mesh position={[0, -0.48, 0]} castShadow={!isMobileDevice} receiveShadow={!isMobileDevice} material={headMat}>
        <cylinderGeometry args={[0.26, 0.26, 0.15, 24]} />
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

function LegoTorso({ bodyColor = '#F8FAFC' }) {
  const ref = useRef();
  const torsoGeom = useMemo(() => getTorsoGeometry(), []);
  const torsoMat = useMemo(() => getLegoMaterial(bodyColor, isMobileDevice, { roughness: 0.16 }), [bodyColor]);

  // Subtle breathing animation
  useFrame((_, delta) => {
    if (ref.current) {
      const dt = Math.min(delta, 0.033);
      const t = performance.now() / 1000;
      const b = Math.sin(t * 1.5) * 0.004 + 1;
      ref.current.scale.x = damp(ref.current.scale.x, b, 5, dt);
      ref.current.scale.z = damp(ref.current.scale.z, b, 5, dt);
    }
  });

  return (
    <group position={[0, 2.05, 0]} ref={ref}>
      {/* Authentic trapezoidal torso body — pristine clean solid color finish with zero logo */}
      <mesh geometry={torsoGeom} castShadow={!isMobileDevice} receiveShadow={!isMobileDevice} material={torsoMat} />
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
    const t = performance.now() / 1000;
    const s = sv.current;

    let targetX = 0;
    let targetZ = 0;
    let targetY = 0;
    let targetHx = 0;
    let targetHy = 0;
    let targetHz = 0;

    const a = animRef?.current;

    // Toggle held brick inside right C-claw: visible strictly from grab (0.40s) to release (0.98s)
    if (heldBrickRef.current) {
      if (a && a.isThrowing && side === 'right' && a.throwStartTime) {
        const elapsed = (performance.now() / 1000) - a.throwStartTime;
        const isHeld = (elapsed >= 0.40 && elapsed < 0.98);
        heldBrickRef.current.visible = isHeld;
        if (elapsed >= 0.96 && elapsed <= 1.02 && !a.releaseWorldPos) {
          const wp = new THREE.Vector3();
          heldBrickRef.current.getWorldPosition(wp);
          a.releaseWorldPos = { x: wp.x, y: wp.y, z: wp.z };
        }
      } else {
        heldBrickRef.current.visible = false;
      }
    }

    if (a && a.isThrowing && side === 'right' && a.throwStartTime) {
      const elapsed = (performance.now() / 1000) - a.throwStartTime;
      if (elapsed < 0.40) {
        // Phase 1: Reaches smoothly forward-up to meet and snatch red brick
        const p = elapsed / 0.40;
        const ease = (1 - Math.cos(p * Math.PI)) / 2;
        targetX = THREE.MathUtils.lerp(0.04, -1.82, ease);
        targetZ = THREE.MathUtils.lerp(-0.04, -0.24, ease);
        targetY = THREE.MathUtils.lerp(0, 0.16, ease);
        targetHx = THREE.MathUtils.lerp(0, 0.42, ease); // opens C-claw to receive brick
      } else if (elapsed < 0.80) {
        // Phase 2: High overhead athletic wind-up! Arm cocks back above head
        const p = (elapsed - 0.40) / 0.40;
        const ease = (1 - Math.cos(p * Math.PI)) / 2;
        targetX = THREE.MathUtils.lerp(-1.82, -2.82, ease);
        targetZ = THREE.MathUtils.lerp(-0.24, -0.34, ease);
        targetY = THREE.MathUtils.lerp(0.16, 0.24, ease);
        targetHx = THREE.MathUtils.lerp(0.42, 0.22, ease); // firm clamp around brick
      } else if (elapsed < 0.98) {
        // Phase 3: Explosive power whip forward & release!
        const p = (elapsed - 0.80) / 0.18;
        const ease = Math.sin((p * Math.PI) / 2);
        targetX = THREE.MathUtils.lerp(-2.82, -1.18, ease);
        targetZ = THREE.MathUtils.lerp(-0.34, -0.10, ease);
        targetY = THREE.MathUtils.lerp(0.24, -0.15, ease);
        targetHx = THREE.MathUtils.lerp(0.22, -0.60, ease); // crisp wrist whip release
      } else {
        // Phase 4: Follow-through and natural settle
        const p = Math.min(1.0, (elapsed - 0.98) / 0.30);
        const ease = 1 - Math.pow(1 - p, 3);
        targetX = THREE.MathUtils.lerp(-1.18, -1.05, ease);
        targetZ = THREE.MathUtils.lerp(-0.10, -0.06, ease);
        targetY = THREE.MathUtils.lerp(-0.15, -0.10, ease);
        targetHx = THREE.MathUtils.lerp(-0.60, -0.40, ease);
      }
    } else if (a && a.isThrowing && side === 'left' && a.throwStartTime) {
      // Left arm balances athletically during pitch
      const elapsed = (performance.now() / 1000) - a.throwStartTime;
      if (elapsed < 0.80) {
        const p = Math.min(1.0, elapsed / 0.80);
        const ease = (1 - Math.cos(p * Math.PI)) / 2;
        targetX = THREE.MathUtils.lerp(0, -0.85, ease);
        targetZ = THREE.MathUtils.lerp(0, 0.30, ease);
        targetY = THREE.MathUtils.lerp(0, -0.14, ease);
      } else {
        const p = Math.min(1.0, (elapsed - 0.80) / 0.18);
        const ease = Math.sin((p * Math.PI) / 2);
        targetX = THREE.MathUtils.lerp(-0.85, 0.48, ease);
        targetZ = THREE.MathUtils.lerp(0.30, 0.10, ease);
        targetY = THREE.MathUtils.lerp(-0.14, 0, ease);
      }
    } else if (side === 'right') {
      // TANGAN KANAN: Mengambang Anggun di Gravitasi Nol — Melambai Ramah & Mengarahkan Balok
      const cycleDuration = 6.8;
      const cycle = t % cycleDuration;

      let waveLift = 0;
      if (cycle < 0.7) {
        // Angkat tangan ke atas menyapa
        const p = cycle / 0.7;
        waveLift = (1 - Math.cos(p * Math.PI)) / 2;
      } else if (cycle < 2.8) {
        // Melambai ramah di atas menyapa pengunjung
        waveLift = 1.0;
      } else if (cycle < 3.5) {
        // Menurunkan tangan ke posisi konduktor
        const p = (cycle - 2.8) / 0.7;
        waveLift = (1 + Math.cos(p * Math.PI)) / 2;
      } else {
        // Fase Menggerakkan Balok Melayang
        waveLift = 0.0;
      }

      // 1. Pose Melambai Ramah di Atas
      const waveT = cycle - 0.7;
      const waveMotion = Math.sin(waveT * 6.2);
      const waveX = -2.40 + Math.sin(waveT * 3.0) * 0.04;
      const waveZ = -0.42 - waveMotion * 0.18;
      const waveY = -0.22 - waveMotion * 0.08;

      // 2. Pose Mengarahkan Balok Melayang di Luar Angkasa
      const condX = -0.68 + Math.sin(t * 1.8) * 0.14;
      const condZ = -0.20 + Math.cos(t * 1.4) * 0.08;
      const condY = -0.08 + Math.sin(t * 2.0) * 0.05;

      targetX = THREE.MathUtils.lerp(condX, waveX, waveLift);
      targetZ = THREE.MathUtils.lerp(condZ, waveZ, waveLift);
      targetY = THREE.MathUtils.lerp(condY, waveY, waveLift);

      const waveHx = 0.25 + Math.sin(waveT * 6.2) * 0.14;
      const waveHy = Math.cos(waveT * 6.2) * 0.40;
      const waveHz = Math.sin(waveT * 6.2) * 0.14;

      const condHx = 0.15 + Math.sin(t * 2.4) * 0.18;
      const condHy = 0.25 + Math.cos(t * 1.8) * 0.20;
      const condHz = Math.sin(t * 2.0) * 0.10;

      targetHx = THREE.MathUtils.lerp(condHx, waveHx, waveLift);
      targetHy = THREE.MathUtils.lerp(condHy, waveHy, waveLift);
      targetHz = THREE.MathUtils.lerp(condHz, waveHz, waveLift);
    } else {
      // TANGAN KIRI: Mengambang Rileks di Gravitasi Nol (Zero-G Spacewalk)
      targetX = -0.52 + Math.sin(t * 1.4) * 0.12;
      targetZ = 0.22 + Math.cos(t * 1.1) * 0.08;
      targetY = -0.08 + Math.sin(t * 1.6) * 0.05;

      targetHx = 0.10 + Math.sin(t * 1.8) * 0.15;
      targetHy = -0.18 + Math.cos(t * 1.4) * 0.18;
      targetHz = -Math.sin(t * 1.6) * 0.08;
    }

    // Smooth physics damping (fast responsiveness during athletic throw)
    const dt = Math.min(rawDelta, 0.033);
    const armDamp = (a && a.isThrowing) ? 26.0 : 5.0;
    const handDamp = (a && a.isThrowing) ? 26.0 : 5.5;
    s.ax = damp(s.ax, targetX, armDamp, dt);
    s.az = damp(s.az, targetZ, armDamp, dt);
    s.ay = damp(s.ay, targetY, armDamp, dt);
    s.hx = damp(s.hx, targetHx, handDamp, dt);
    s.hy = damp(s.hy, targetHy, handDamp, dt);
    s.hz = damp(s.hz, targetHz, handDamp, dt);

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

  const armMat = useMemo(() => getLegoMaterial(armColor, isMobileDevice, { roughness: 0.16 }), [armColor]);
  const handMat = useMemo(() => getLegoMaterial(handColor, isMobileDevice, { roughness: 0.16 }), [handColor]);

  return (
    <group position={[x, 2.31, 0]}>
      <group ref={armRef}>
        {/* Shoulder spherical cap — snug against torso socket */}
        <mesh position={[0, 0, 0]} castShadow={!isMobileDevice} material={armMat}>
          <sphereGeometry args={[0.19, 18, 16]} />
        </mesh>

        {/* Continuous organic curved arm tube */}
        <mesh geometry={armGeom} castShadow={!isMobileDevice} receiveShadow={!isMobileDevice} material={armMat} />

        {/* Wrist Socket Assembly — perfectly aligned with curve endpoint & tangent */}
        <group position={[wristPos.x, wristPos.y, wristPos.z]} quaternion={wristQuat}>
          {/* Blue plastic wrist cuff rim */}
          <mesh castShadow={!isMobileDevice} material={armMat}>
            <cylinderGeometry args={[0.134, 0.130, 0.05, 18]} />
          </mesh>

          {/* Hand Articulation Group (rotates inside wrist socket) */}
          <group ref={handRef} position={[0, -0.04, 0]}>
            {/* Yellow wrist peg inserted into arm socket */}
            <mesh position={[0, 0.02, 0]} castShadow={!isMobileDevice} material={handMat}>
              <cylinderGeometry args={[0.055, 0.055, 0.07, 14]} />
            </mesh>

            {/* Hand collar transition */}
            <mesh position={[0, -0.02, 0]} castShadow={!isMobileDevice} material={handMat}>
              <cylinderGeometry args={[0.078, 0.078, 0.035, 16]} />
            </mesh>

            {/* Iconic Yellow C-Claw — opening oriented inward toward hips/thighs like reference image */}
            <mesh
              position={[0, -0.08, 0.02]}
              rotation={[0.20, sign === 1 ? -Math.PI / 2 + 0.35 : Math.PI / 2 - 0.35, 0]}
              castShadow={!isMobileDevice}
              material={handMat}
            >
              <torusGeometry args={[0.086, 0.036, 14, 22, Math.PI * 1.44]} />
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
                <LegoBrick3D type="2x2" color="#E3000B" material={getLegoMaterial('#E3000B')} />
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
  const hipMat = useMemo(() => getLegoMaterial(color, isMobileDevice, { roughness: 0.16 }), [color]);

  return (
    <group position={[0, 1.44, 0]}>
      {/* Upper waist band — width 1.26, depth 0.78 flush with authentic chunky torso */}
      <RoundedBox 
        args={[1.26, 0.18, 0.78]} 
        radius={0.03} 
        smoothness={isMobileDevice ? 2 : 3} 
        material={hipMat}
        castShadow={!isMobileDevice} 
        receiveShadow={!isMobileDevice} 
      />

      {/* Center vertical crotch post between legs */}
      <RoundedBox 
        position={[0, -0.16, 0]} 
        args={[0.12, 0.38, 0.74]} 
        radius={0.03} 
        smoothness={isMobileDevice ? 2 : 3} 
        material={hipMat}
        castShadow={!isMobileDevice} 
      />

      {/* Horizontal pivot hinge cylinders */}
      <mesh position={[0, -0.06, 0]} rotation={[0, 0, Math.PI / 2]} castShadow={!isMobileDevice} material={hipMat}>
        <cylinderGeometry args={[0.22, 0.22, 1.22, 18]} />
      </mesh>
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════
   LEGO LEG — authentic legs matching reference image (width 0.58 each, outer width 1.26 flush)
   ═══════════════════════════════════════════════════════════════ */
function LegoLeg({ side = 'right', color = '#0040B8', animRef }) {
  const x = side === 'right' ? -0.34 : 0.34;
  const ref = useRef();
  const sx = useRef(0);
  const legMat = useMemo(() => getLegoMaterial(color, isMobileDevice, { roughness: 0.16 }), [color]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.033);
    const t = performance.now() / 1000;
    const a = animRef?.current;
    let target = 0;
    if (a && a.isThrowing && a.throwStartTime) {
      // DYNAMIC LEG STRIDE: Right leg swings boldly forward while throwing!
      const elapsed = (performance.now() / 1000) - a.throwStartTime;
      if (elapsed < 0.40) {
        // Phase 1: Standing steady to reach for red brick
        target = 0;
      } else if (elapsed < 0.80) {
        // Phase 2: Wind-up: right leg draws back loading body weight
        const p = (elapsed - 0.40) / 0.40;
        const ease = (1 - Math.cos(p * Math.PI)) / 2;
        target = side === 'right' ? THREE.MathUtils.lerp(0, 0.36, ease) : THREE.MathUtils.lerp(0, -0.12, ease);
      } else if (elapsed < 1.05) {
        // Phase 3: Pitch & Stride: right leg swings dynamically FORWARD!
        const p = Math.min(1.0, (elapsed - 0.80) / 0.25);
        const ease = Math.sin((p * Math.PI) / 2);
        target = side === 'right' ? THREE.MathUtils.lerp(0.36, -0.92, ease) : THREE.MathUtils.lerp(-0.12, 0.48, ease);
      } else {
        // Phase 4: Follow-through stance
        target = side === 'right' ? -0.88 : 0.44;
      }
      sx.current = damp(sx.current, target, 16, dt);
    } else {
      // Zero-Gravity Astronaut Spacewalk Posture (Trik 1):
      // Kaki melayang rileks di ruang hampa udara; satu kaki melayang santai ke depan, satu kaki rileks ke belakang
      const legDrift = Math.sin(t * 1.1) * 0.045;
      if (side === 'right') {
        // Kaki kanan melayang santai agak ke depan (-0.16 rad)
        target = -0.16 + legDrift;
      } else {
        // Kaki kiri rileks mengambang sedikit ke belakang (+0.10 rad)
        target = 0.10 - legDrift * 0.8;
      }
      sx.current = damp(sx.current, target, 6, dt);
    }
    if (ref.current) ref.current.rotation.x = sx.current;
  });

  return (
    <group ref={ref} position={[x, 1.01, 0]}>
      {/* Top rounded hip joint cylinder */}
      <mesh position={[0, 0.37, 0]} rotation={[0, 0, Math.PI / 2]} castShadow={!isMobileDevice} material={legMat}>
        <cylinderGeometry args={[0.22, 0.22, 0.56, 18]} />
      </mesh>

      {/* Main shin column — depth 0.76 for solid authentic Lego proportions */}
      <RoundedBox 
        position={[0, -0.06, 0]} 
        args={[0.56, 0.84, 0.76]} 
        radius={0.03} 
        smoothness={isMobileDevice ? 2 : 3} 
        material={legMat}
        castShadow={!isMobileDevice} 
        receiveShadow={!isMobileDevice} 
      />

      {/* Foot toe step extension — iconic Lego foot projecting forward */}
      <RoundedBox 
        position={[0, -0.38, 0.10]} 
        args={[0.56, 0.14, 0.96]} 
        radius={0.025} 
        smoothness={isMobileDevice ? 2 : 3} 
        material={legMat}
        castShadow={!isMobileDevice} 
      />
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FULL MINIFIGURE & WORKSTATION — assembled with developer props
   ═══════════════════════════════════════════════════════════════ */
function Minifigure({ animRef }) {
  const characterRef = useRef();

  useFrame((_, delta) => {
    const a = animRef?.current;
    if (!a) return;
    const dt = Math.min(delta, 0.033);
    const now = performance.now() / 1000;

    if (a.isThrowing && a.throwStartTime) {
      a.isIdle = false;
      a.jumpArc = 0;
      a.hopLegAngle = 0;
      const tThrow = now - a.throwStartTime;

      if (tThrow < 0.40) {
        // Phase 1: Reaches to grab brick, torso turns slightly to meet it
        const p = tThrow / 0.40;
        const ease = (1 - Math.cos(p * Math.PI)) / 2;
        a.rotY = THREE.MathUtils.lerp(a.rotY, -0.38, ease);
        a.rotZ = damp(a.rotZ, 0, 14, dt);
        a.rotX = damp(a.rotX || 0, 0, 14, dt);
        a.x = 0;
        a.y = 0;
      } else if (tThrow < 0.80) {
        // Phase 2: Athletic wind-up! Coils back, leans back, drops center of gravity
        const p = (tThrow - 0.40) / 0.40;
        const ease = (1 - Math.cos(p * Math.PI)) / 2;
        a.rotY = THREE.MathUtils.lerp(-0.38, -0.28, ease); // opens chest
        a.rotZ = THREE.MathUtils.lerp(0, 0.05, ease);
        a.rotX = THREE.MathUtils.lerp(0, -0.07, ease); // leans back athletically!
        a.y = THREE.MathUtils.lerp(0, -0.05, ease); // drops into rear leg
      } else if (tThrow < 0.98) {
        // Phase 3: Explosive forward pitch! Drives chest forward and down into throw
        const p = (tThrow - 0.80) / 0.18;
        const ease = Math.sin((p * Math.PI) / 2);
        a.rotY = THREE.MathUtils.lerp(-0.28, -0.58, ease); // drives forward-left
        a.rotZ = THREE.MathUtils.lerp(0.05, -0.06, ease);
        a.rotX = THREE.MathUtils.lerp(-0.07, 0.12, ease); // pitches chest forward!
        a.y = THREE.MathUtils.lerp(-0.05, 0.02, ease);
      } else {
        // Phase 4: Elastic follow-through & settle
        a.rotY = damp(a.rotY, -0.54, 8, dt);
        a.rotZ = damp(a.rotZ, -0.03, 8, dt);
        a.rotX = damp(a.rotX || 0, 0.02, 8, dt);
        a.y = damp(a.y, 0, 8, dt);
      }
    } else {
      // TRIK 1: ZERO-GRAVITY ASTRONAUT SPACEWALK FLOAT:
      // Mengambang bebas di gravitasi nol tanpa papan/hoverpad — 100% bersih & estetik Classic Space
      a.isIdle = true;
      const t = now;

      // 1. Torso Friendly Swivel & Micro-Roll in Zero-G
      const swivelY = -0.46 + Math.sin(t * 1.1) * 0.11 + Math.cos(t * 0.55) * 0.04;
      const rollZ = Math.sin(t * 0.85) * 0.038;
      const pitchX = Math.cos(t * 1.15) * 0.032;

      // 2. Continuous Buoyant Space Hover (Murni melayang di ruang hampa)
      const floatY = Math.sin(t * 1.1) * 0.14 + Math.sin(t * 0.55) * 0.04;
      const floatX = Math.cos(t * 0.7) * 0.03;

      a.x = damp(a.x || 0, floatX, 6, dt);
      a.y = damp(a.y || 0, floatY, 6, dt);
      a.rotX = damp(a.rotX || 0, pitchX, 6, dt);
      a.rotY = damp(a.rotY, swivelY, 8, dt);
      a.rotZ = damp(a.rotZ, rollZ, 6, dt);
      a.hopLegAngle = 0;
      a.jumpArc = 0;
    }

    if (characterRef.current) {
      characterRef.current.position.x = a.x;
      characterRef.current.position.y = a.y;
      characterRef.current.rotation.x = a.rotX || 0;
      characterRef.current.rotation.y = a.rotY;
      characterRef.current.rotation.z = a.rotZ;
    }
  });

  return (
    <group>
      {/* Animated Character Minifigure */}
      <group ref={characterRef}>
        <LegoHead color="#FFD000" animRef={animRef} />
        <LegoTorso bodyColor="#F8FAFC" />
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
    const RELEASE_TIME = 0.98;
    const IMPACT_TIME = 1.38;
    const FLIGHT_DURATION = IMPACT_TIME - RELEASE_TIME;

    const stX = stationPosRef.current ? stationPosRef.current.x : 0;
    const stY = stationPosRef.current ? stationPosRef.current.y : -2.02;

    if (elapsed < RELEASE_TIME) {
      // Balok masih digenggam kuat di tangan kanan (LegoArm heldBrickRef)
      if (brickRef.current) brickRef.current.visible = false;
    } else if (elapsed <= IMPACT_TIME + 0.04) {
      // Balok dilepas dari tangan dan melesat mulus ke arah layar kamera!
      if (brickRef.current && !a.hasCompletedThrow) {
        brickRef.current.visible = true;
        const flightT = Math.min(1.0, (elapsed - RELEASE_TIME) / FLIGHT_DURATION);
        const ease = Math.pow(flightT, 1.45);

        // Posisi rilis persis dari tangan kanan yang mencambuk ke depan (menggunakan world position asli hand jika ada)
        const startX = a.releaseWorldPos ? a.releaseWorldPos.x : (stX - 0.72);
        const startY = a.releaseWorldPos ? a.releaseWorldPos.y : (stY + 2.45);
        const startZ = a.releaseWorldPos ? a.releaseWorldPos.z : 1.15;

        // Target kamera di tengah layar pada z = 10.20 (menutup pandangan lensa kamera tepat sebelum pecah)
        const currX = THREE.MathUtils.lerp(startX, 0, ease);
        const currY = THREE.MathUtils.lerp(startY, 0.15, ease) + Math.sin(flightT * Math.PI) * 0.26;
        const currZ = THREE.MathUtils.lerp(startZ, 10.20, ease);

        brickRef.current.position.set(currX, currY, currZ);

        // Dynamic 3D tumble & spin
        brickRef.current.rotation.x = flightT * Math.PI * 4.2;
        brickRef.current.rotation.y = -0.36 + flightT * Math.PI * 4.8;
        brickRef.current.rotation.z = flightT * Math.PI * 3.2;

        // Skala membesar saat mendekati kamera hingga menutup layar tepat sebelum meledak pecah
        // Di mobile batasi skala maksimum agar fragment shader WebGL tidak membebani GPU saat pecah
        const targetMaxScale = typeof window !== 'undefined' && window.innerWidth < 768 ? 1.55 : 2.3;
        const scale = THREE.MathUtils.lerp(0.20, targetMaxScale, Math.pow(flightT, 1.6));
        brickRef.current.scale.set(scale, scale, scale);

        // Pecah saat menghantam layar kamera: pemicu transisi ledakan balok 3D & langsung sembunyikan mesh
        if (flightT >= 0.97 && !a.hasCompletedThrow) {
          a.hasCompletedThrow = true;
          brickRef.current.visible = false;
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
      <LegoBrick3D type="2x2" color="#E3000B" material={getLegoMaterial('#E3000B')} />
    </group>
  );
}

function FloatingBricks({ animRef }) {
  const orbitRef = useRef();
  const redBrickRef = useRef();
  const { size } = useThree();
  const isMobile = size.width < 1024;

  // Memutar orbit balok-balok LEGO melayang secara halus & mandiri (tidak terpengaruh oleh lompatan)
  useFrame((_, delta) => {
    const a = animRef?.current;
    if (orbitRef.current && (!a || !a.isThrowing)) {
      orbitRef.current.rotation.y += delta * 0.38;
    }

    if (redBrickRef.current) {
      if (a && a.isThrowing && a.throwStartTime) {
        const elapsed = (performance.now() / 1000) - a.throwStartTime;
        if (!a.redBrickGrabStart) {
          a.redBrickGrabStart = {
            x: redBrickRef.current.position.x,
            y: redBrickRef.current.position.y,
            z: redBrickRef.current.position.z,
            scale: redBrickRef.current.scale.x || (isMobileDevice ? 0.18 : 0.28),
            rotX: redBrickRef.current.rotation.x,
            rotY: redBrickRef.current.rotation.y,
            rotZ: redBrickRef.current.rotation.z,
          };
        }

        if (elapsed < 0.40) {
          // Balok merah meluncur mulus dari posisi aslinya saat ini ke tangan kanan
          redBrickRef.current.visible = true;
          const p = elapsed / 0.40;
          const ease = p * p * (3 - 2 * p); // smoothstep curve
          const handX = isMobileDevice ? -0.52 : -0.62;
          const handY = isMobileDevice ? 2.15 : 2.24;
          const handZ = 0.58;
          redBrickRef.current.position.set(
            THREE.MathUtils.lerp(a.redBrickGrabStart.x, handX, ease),
            THREE.MathUtils.lerp(a.redBrickGrabStart.y, handY, ease),
            THREE.MathUtils.lerp(a.redBrickGrabStart.z, handZ, ease)
          );
          redBrickRef.current.scale.setScalar(THREE.MathUtils.lerp(a.redBrickGrabStart.scale, 0.20, ease));
          redBrickRef.current.rotation.x = THREE.MathUtils.lerp(a.redBrickGrabStart.rotX, 0.15, ease);
          redBrickRef.current.rotation.y = THREE.MathUtils.lerp(a.redBrickGrabStart.rotY, -Math.PI / 2 + 0.35, ease);
        } else {
          // Setelah t >= 0.40s, balok sudah berada di genggaman tangan kanan (heldBrickRef)
          redBrickRef.current.visible = false;
        }
      } else {
        redBrickRef.current.visible = true;
      }
    }
  });

  const bricks = useMemo(() => {
    const count = 5;
    // On mobile (<1024px), keep all 5 authentic bricks but calibrate orbit radius (1.30-1.40)
    // and height (0.7-1.7) so they comfortably orbit around the torso/shoulders
    // without ever swinging upwards into the button or flying off mobile screen edges.
    const items = isMobile
      ? [
          { id: 'red', color: '#E3000B', type: '2x4', y: 1.5, r: 1.35, scale: 0.22, speed: 1.4 },
          { id: 'yellow', color: '#FFD500', type: '2x4', y: 1.1, r: 1.40, scale: 0.22, speed: 1.2 },
          { id: 'blue', color: '#0055BF', type: '2x2', y: 0.7, r: 1.30, scale: 0.22, speed: 1.5 },
          { id: 'green', color: '#00852B', type: '2x4', y: 1.7, r: 1.35, scale: 0.20, speed: 1.1 },
          { id: 'orange', color: '#FE8A18', type: '2x2', y: 1.3, r: 1.30, scale: 0.22, speed: 1.3 },
        ]
      : [
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
  }, [isMobile]);

  return (
    <group ref={orbitRef}>
      {bricks.map((b) => {
        const brickContent = (
          <group 
            key={b.id}
            ref={b.id === 'red' ? redBrickRef : undefined}
            position={b.pos} 
            rotation={b.rot} 
            scale={b.scale}
          >
            <LegoBrick3D type={b.type} color={b.color} material={getLegoMaterial(b.color)} />
          </group>
        );

        if (isMobileDevice) {
          return <group key={b.id}>{brickContent}</group>;
        }

        return (
          <Float
            key={b.id}
            speed={b.speed}
            floatIntensity={0.6}
            rotationIntensity={0.8}
          >
            {brickContent}
          </Float>
        );
      })}
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

function GroundShadow({ animRef, position = [0, -0.30, 0] }) {
  const texture = useMemo(() => getGroundShadowTexture(), []);
  const groupRef = useRef();

  useFrame(() => {
    if (groupRef.current) {
      const floatY = animRef?.current?.y || 0;
      // Saat astronot melayang lebih tinggi, bayangan membesar & lebih halus; saat turun sedikit mengencang
      const s = THREE.MathUtils.clamp(1.0 + floatY * 0.55, 0.75, 1.35);
      groupRef.current.scale.set(s, 1, s);
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Soft floating cosmic ambient drop shadow — terletak jauh di bawah kaki untuk menegaskan efek melayang di angkasa */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[1.8, 1.3]} />
        <meshBasicMaterial map={texture} transparent opacity={0.32} depthWrite={false} />
      </mesh>
      {/* Broad deep ambient glow/diffusion */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[3.0, 2.2]} />
        <meshBasicMaterial map={texture} transparent opacity={0.14} depthWrite={false} />
      </mesh>
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SCENE — Realtime Instant Rendering without Delay
   ═══════════════════════════════════════════════════════════════ */
function Scene({ animRef, domElement, onThrowComplete, onInteractionReady }) {
  const stationGroupRef = useRef();
  const { viewport, size } = useThree();

  const isDesktop = size.width >= 1024;
  const isMobile = size.width < 768;
  const currentScale = isDesktop ? 1.0 : (isMobile ? 0.70 : 0.82);
  // Subtle downward bias provides clean clearance from the CTA button on mobile
  const centerOffset = isDesktop ? 2.02 : (2.24 * currentScale);

  // Compute instantaneous target position directly on frame 0 to eliminate initial positioning jump
  const targetNode = domElement && domElement.current !== undefined ? domElement.current : domElement;
  let initialX = isDesktop ? Math.min(3.2, Math.max(1.8, viewport.width * 0.26)) : 0;
  let initialY = isDesktop ? -2.02 : (-viewport.height * 0.26 - centerOffset * 0.35);

  if (targetNode && typeof window !== 'undefined') {
    const rect = targetNode.getBoundingClientRect();
    const px = rect.left + rect.width / 2;
    const py = rect.top + rect.height / 2;
    const ndcX = (px / size.width) * 2 - 1;
    const ndcY = -(py / size.height) * 2 + 1;
    initialX = (ndcX * viewport.width) / 2;
    initialY = isDesktop ? (((ndcY * viewport.height) / 2) - 2.02) : (((ndcY * viewport.height) / 2) - centerOffset);
  }

  const stationPosRef = useRef({ x: initialX, y: initialY });

  // Smooth rotation interaction
  const rotTarget = useRef({ x: 0, y: 0 });
  const rotCurrent = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const prevPointer = useRef({ x: 0, y: 0 });
  const reportedReady = useRef(false);

  // Cache DOM target world coordinates on mount/resize/ResizeObserver
  // so useFrame performs zero per-frame getBoundingClientRect() layout reads.
  useEffect(() => {
    const el = domElement && domElement.current !== undefined ? domElement.current : domElement;

    const updateTargetPos = () => {
      if (!el || !size.width || !size.height) {
        stationPosRef.current = { x: initialX, y: initialY };
        return;
      }
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) return;
      const px = rect.left + rect.width / 2;
      const py = rect.top + rect.height / 2;
      const ndcX = (px / size.width) * 2 - 1;
      const ndcY = -(py / size.height) * 2 + 1;
      stationPosRef.current = {
        x: (ndcX * viewport.width) / 2,
        y: isDesktop ? ((ndcY * viewport.height) / 2) - 2.02 : ((ndcY * viewport.height) / 2) - centerOffset,
      };
    };

    updateTargetPos();
    window.addEventListener('resize', updateTargetPos);

    let observer;
    if (el && typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(updateTargetPos);
      observer.observe(el);
    }

    return () => {
      window.removeEventListener('resize', updateTargetPos);
      if (observer) observer.disconnect();
    };
  }, [domElement, size.width, size.height, viewport.width, viewport.height, isDesktop, centerOffset, initialX, initialY]);

  useEffect(() => {
    const el = domElement && domElement.current !== undefined ? domElement.current : domElement;
    if (!el) return;

    const onDown = (e) => {
      // Allow dragging when minifigure is ready and not throwing
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

    el.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);

    return () => {
      el.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [domElement, animRef]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.033);
    const { x: targetX, y: targetY } = stationPosRef.current;

    // Automatically snap back to facing front when throwing, otherwise smoothly track drag rotation
    if (animRef?.current?.isThrowing) {
      rotTarget.current.x = 0;
      rotTarget.current.y = 0;
      isDragging.current = false;
      rotCurrent.current.x = damp(rotCurrent.current.x, 0, 18, dt);
      rotCurrent.current.y = damp(rotCurrent.current.y, 0, 18, dt);
    } else {
      rotCurrent.current.x = damp(rotCurrent.current.x, rotTarget.current.x, 8, dt);
      rotCurrent.current.y = damp(rotCurrent.current.y, rotTarget.current.y, 8, dt);
    }

    // Notify parent immediately when minifigure is ready for interaction
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
  });

  return (
    <>
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
      <directionalLight position={[-5, 4, 3]} intensity={0.65} color="#ffffff" />
      <directionalLight position={[0, 6, -6]} intensity={0.8} color="#ffffff" />
      <ambientLight intensity={isMobileDevice ? 0.60 : 0.52} color="#ffffff" />

      {/* Unified 3D Character Group */}
      <group ref={stationGroupRef} position={[initialX, initialY, 0]} scale={currentScale}>
        <Minifigure animRef={animRef} />
        {/* Decor — only the authentic colorful bricks float and tumble */}
        <FloatingBricks animRef={animRef} />
        {/* Soft Procedural Ground Contact Shadow under Minifigure feet */}
        <GroundShadow animRef={animRef} position={[0, -0.30, 0]} />
      </group>

      {/* 3D Thrown Lego Brick hurtling straight into camera lens on Discover More click */}
      <ThrownLegoBrick animRef={animRef} onComplete={onThrowComplete} stationPosRef={stationPosRef} />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   EXPORT — Robust WebGL with Auto-Recovery & Interactive Poses
   ═══════════════════════════════════════════════════════════════ */
export default function LegoMinifigure({ domTarget, isThrowing = false, onThrowComplete, onInteractionReady, isHome = true }) {
  const glRef = useRef(null);
  const [webGLError, setWebGLError] = useState(!isWebGLAvailable());
  const [canvasKey, setCanvasKey] = useState(0);
  const lostCountRef = useRef(0);

  // Central animation state coordinator for in-place acting & brick throw
  const animRef = useRef({
    isIdle: true,
    isThrowing: false,
    throwStartTime: null,
    hasCompletedThrow: false,
    x: 0,
    y: 0,
    rotX: 0,
    rotY: -0.46,
    rotZ: 0,
    hopLegAngle: 0,
    jumpArc: 0,
    redBrickGrabStart: null,
    releaseWorldPos: null,
  });

  const handleCanvasError = () => {
    if (lostCountRef.current < 2) {
      lostCountRef.current += 1;
      setCanvasKey(prev => prev + 1);
    } else {
      setWebGLError(true);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      lostCountRef.current = 0;
    }, 4000);
    return () => clearTimeout(timer);
  }, [canvasKey]);

  // Graceful frameloop control: tidur instan di mobile saat meninggalkan Home agar transisi bebas lag
  const [shouldRender, setShouldRender] = useState(isHome);
  useEffect(() => {
    if (isHome) {
      setShouldRender(true);
    } else {
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
      if (isMobile) {
        setShouldRender(false);
        return;
      }
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isHome]);

  // Automatically reset throw state when returning to Home
  useEffect(() => {
    if (isHome && animRef.current) {
      animRef.current.isThrowing = false;
      animRef.current.isIdle = true;
      animRef.current.throwStartTime = null;
      animRef.current.hasCompletedThrow = false;
      animRef.current.x = 0;
      animRef.current.y = 0;
    }
  }, [isHome]);

  // Trigger throw sequence when isThrowing becomes true
  useEffect(() => {
    if (isThrowing && animRef.current && !animRef.current.isThrowing) {
      animRef.current.isThrowing = true;
      animRef.current.throwStartTime = performance.now() / 1000;
      animRef.current.hasCompletedThrow = false;
      animRef.current.redBrickGrabStart = null;
      animRef.current.releaseWorldPos = null;
    }
  }, [isThrowing]);

  useEffect(() => {
    if (animRef.current) {
      animRef.current.isIdle = true;
      animRef.current.x = 0;
      animRef.current.y = 0;
    }
  }, []);

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
    <div className="w-full h-full relative bg-transparent pointer-events-auto">
      <CanvasErrorBoundary 
        resetKey={canvasKey}
        fallback={
          <LegoFallbackAvatar 
            isThrowing={isThrowing} 
            onThrowComplete={onThrowComplete} 
            onInteractionReady={onInteractionReady} 
          />
        }
        onError={handleCanvasError}
      >
        <Canvas
          key={canvasKey}
          frameloop={shouldRender ? 'always' : 'never'}
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

            const canvasEl = gl.domElement;
            const handleContextLost = (event) => {
              event.preventDefault();
              console.warn('WebGL context temporarily lost. Safely remounting canvas...');
              setTimeout(() => {
                setCanvasKey(prev => prev + 1);
              }, 400);
            };

            const handleContextRestored = () => {
              console.info('WebGL context successfully restored.');
              try {
                gl.compile(scene, camera);
              } catch {
                // ignore
              }
            };

            canvasEl.addEventListener('webglcontextlost', handleContextLost, { once: true });
            canvasEl.addEventListener('webglcontextrestored', handleContextRestored, { once: true });
          }}
          style={{ width: '100%', height: '100%', background: 'transparent', pointerEvents: 'none' }}
        >
          <Suspense fallback={null}>
            <Scene 
              animRef={animRef} 
              domElement={domTarget} 
              onThrowComplete={onThrowComplete}
              onInteractionReady={onInteractionReady}
            />
          </Suspense>
        </Canvas>
      </CanvasErrorBoundary>
    </div>
  );
}

