import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import SpaceBackground from './SpaceBackground';

// Authentic Classic Space 1979 palette & shading stops for isometric SVG LEGO bricks
const BRICK_PALETTES = {
  yellow: {
    top: '#FFE44D',
    left: '#FFD500',
    right: '#C99700',
    stroke: '#8C6600',
    rim: '#FFF8B8',
  },
  blue: {
    top: '#3B82F6',
    left: '#0055BF',
    right: '#003B88',
    stroke: '#002252',
    rim: '#93C5FD',
  },
  red: {
    top: '#FF4D58',
    left: '#E3000B',
    right: '#A80008',
    stroke: '#6E0005',
    rim: '#FECACA',
  },
};

const BRICK_SPECS = {
  '2x2': {
    topPoints: '60,12 100,32 60,52 20,32',
    leftPoints: '20,32 60,52 60,74 20,54',
    rightPoints: '60,52 100,32 100,54 60,74',
    rimPath: 'M 21 32 L 60 12.8 L 99 32',
    studs: [
      [60, 22],
      [40, 32],
      [80, 32],
      [60, 42],
    ],
  },
  '1x2': {
    topPoints: '50,18 90,38 70,48 30,28',
    leftPoints: '30,28 70,48 70,70 30,50',
    rightPoints: '70,48 90,38 90,60 70,70',
    rimPath: 'M 31 28 L 50 18.8 L 89 38',
    studs: [
      [50, 28],
      [70, 38],
    ],
  },
};

// Exact 22-unit vertical stud-to-brick lock pitch matching 2x2 geometry
const STACK_BRICKS = [
  { color: 'blue', baseY: 52, dropDelta: -28, delay: 0.06 },
  { color: 'red', baseY: 30, dropDelta: -36, delay: 0.30 },
  { color: 'yellow', baseY: 8, dropDelta: -42, delay: 0.54 },
];

/**
 * Vector SVG <g> layer for a single isometric Classic Space LEGO brick.
 */
function IsoLegoBrickFaces({ shape = '2x2', color = 'yellow' }) {
  const palette = BRICK_PALETTES[color] || BRICK_PALETTES.yellow;
  const spec = BRICK_SPECS[shape] || BRICK_SPECS['2x2'];
  const rx = 7.4;
  const ry = 4.1;
  const studHeight = 5.5;

  return (
    <g>
      <polygon
        points={spec.leftPoints}
        fill={palette.left}
        stroke={palette.stroke}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <polygon
        points={spec.rightPoints}
        fill={palette.right}
        stroke={palette.stroke}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <polygon
        points={spec.topPoints}
        fill={palette.top}
        stroke={palette.stroke}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d={spec.rimPath}
        stroke={palette.rim}
        strokeWidth="1.1"
        strokeLinecap="round"
        opacity="0.7"
      />

      {spec.studs.map(([cx, cy], idx) => (
        <g key={idx}>
          <path
            d={`M ${cx - rx} ${cy - studHeight} L ${cx - rx} ${cy} A ${rx} ${ry} 0 0 0 ${cx + rx} ${cy} L ${cx + rx} ${cy - studHeight} Z`}
            fill={palette.left}
            stroke={palette.stroke}
            strokeWidth="0.9"
            strokeLinejoin="round"
          />
          <ellipse
            cx={cx}
            cy={cy - studHeight}
            rx={rx}
            ry={ry}
            fill={palette.top}
            stroke={palette.stroke}
            strokeWidth="0.9"
          />
          <ellipse
            cx={cx - 1.5}
            cy={cy - studHeight - 0.8}
            rx={rx * 0.45}
            ry={ry * 0.35}
            fill={palette.rim}
            opacity="0.65"
          />
        </g>
      ))}
    </g>
  );
}

/**
 * Interactive floating zero-G isometric Classic Space LEGO brick.
 */
export function IsoLegoBrick({
  shape = '2x2',
  color = 'yellow',
  className = '',
  floatY = 8,
  floatDuration = 6,
  floatDelay = 0,
  initialRotate = 0,
}) {
  const [spinCount, setSpinCount] = useState(0);

  return (
    <motion.div
      animate={{ y: [-floatY, floatY, -floatY] }}
      transition={{
        duration: floatDuration,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: floatDelay,
      }}
      className={`select-none ${className}`}
    >
      <motion.button
        type="button"
        onClick={() => setSpinCount((prev) => prev + 1)}
        animate={{ rotate: initialRotate + spinCount * 90 }}
        whileHover={{ scale: 1.1, rotate: initialRotate + spinCount * 90 + 8 }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        aria-label={`Interactive ${color} ${shape} LEGO brick`}
        className="w-full h-full block cursor-pointer focus:outline-none filter drop-shadow-[0_14px_24px_rgba(0,0,0,0.75)]"
      >
        <svg viewBox="0 0 120 90" className="w-full h-full overflow-visible" fill="none">
          <IsoLegoBrickFaces shape={shape} color={color} />
        </svg>
      </motion.button>
    </motion.div>
  );
}

/**
 * Minimal Classic Space LEGO Stack Assembly
 * Three isometric 2x2 bricks interlocking one by one on an exact 22-unit SVG grid.
 */
function ClassicSpaceBrickStack() {
  return (
    <div className="relative flex flex-col items-center select-none">
      <motion.div
        animate={{ y: [0, -3, 0] }}
        transition={{
          duration: 3.4,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.9,
        }}
        className="w-28 h-32 sm:w-32 sm:h-36 filter drop-shadow-[0_18px_28px_rgba(0,0,0,0.8)]"
      >
        <svg viewBox="0 0 120 132" className="w-full h-full overflow-visible" fill="none">
          {STACK_BRICKS.map((brick) => (
            <g key={brick.color} transform={`translate(0, ${brick.baseY})`}>
              <motion.g
                initial={{ y: brick.dropDelta, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  y: {
                    type: 'spring',
                    stiffness: 340,
                    damping: 24,
                    mass: 0.8,
                    delay: brick.delay,
                  },
                  opacity: {
                    duration: 0.18,
                    delay: brick.delay,
                    ease: 'easeOut',
                  },
                }}
              >
                <IsoLegoBrickFaces shape="2x2" color={brick.color} />
              </motion.g>
            </g>
          ))}
        </svg>
      </motion.div>

      {/* Soft grounded shadow directly beneath the bottom brick */}
      <motion.div
        initial={{ scale: 0.55, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.6 }}
        transition={{ duration: 0.45, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="w-20 sm:w-24 h-2.5 -mt-1 rounded-full bg-black/80 blur-[6px] pointer-events-none"
      />
    </div>
  );
}

/**
 * Minimal Classic Space Portfolio Loader (Opsi A)
 * Uses the unified #060814 SpaceBackground, clean 3-brick snap choreography,
 * and a smooth 2px progress track.
 */
export default function LegoLoader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const completedRef = useRef(false);

  useEffect(() => {
    const startDelay = 160;
    const duration = 1250;
    let rafId;
    let finishTimerId;

    const startTimerId = setTimeout(() => {
      const startTime = performance.now();

      const step = (now) => {
        const linear = Math.min(1, (now - startTime) / duration);
        const eased =
          linear < 0.5
            ? 2 * linear * linear
            : 1 - Math.pow(-2 * linear + 2, 2) / 2;
        setProgress(Math.min(100, Math.round(eased * 100)));

        if (linear < 1) {
          rafId = requestAnimationFrame(step);
        } else {
          finishTimerId = setTimeout(() => {
            if (!completedRef.current) {
              completedRef.current = true;
              if (onComplete) onComplete();
            }
          }, 180);
        }
      };

      rafId = requestAnimationFrame(step);
    }, startDelay);

    return () => {
      clearTimeout(startTimerId);
      clearTimeout(finishTimerId);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[99999] overflow-hidden pointer-events-auto select-none bg-[#060814]"
    >
      {/* Unified Classic Space Starfield (No synthwave orbs or cyber grid) */}
      <SpaceBackground showCraters={false} />

      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-6">
        <ClassicSpaceBrickStack />

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 flex flex-col items-center gap-2.5 w-full max-w-[160px] sm:max-w-[180px]"
        >
          {/* Clean 2px Hairline Progress Rail */}
          <div className="w-full h-[2px] rounded-full bg-white/[0.10] overflow-hidden">
            <div
              className="h-full w-full bg-[#FFD500] origin-left will-change-transform"
              style={{ transform: `scaleX(${progress / 100})` }}
            />
          </div>

          <span className="font-mono text-[11px] text-zinc-500 tabular-nums tracking-wider">
            {progress}%
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}
