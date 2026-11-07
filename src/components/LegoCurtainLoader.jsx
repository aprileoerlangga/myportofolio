import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * 3D Isometric LEGO Aerodynamic Sport Plane
 * - True 3/4 volumetric perspective (fuselage depth, top deck with 3D studs, far & near wings).
 * - Geometrically accurate 3D propeller assembly: mounted on the 3D spinner hub and rotating
 *   in true perspective ellipse plane matching the aircraft's heading.
 * - 100% harmonized with portfolio's Lego Yellow (#FFD500), Lego Red (#E3000B), and deep studio dark theme.
 */
function LegoAirplane3D({ isTakeoff = false }) {
  return (
    <div
      className="relative w-80 h-44 sm:w-96 sm:h-52 md:w-[28rem] md:h-60 filter drop-shadow-[0_25px_40px_rgba(0,0,0,0.95)] select-none"
      style={{ perspective: 1000 }}
    >
      <svg
        viewBox="0 0 420 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible"
      >
        <defs>
          {/* 3D ABS Plastic Gradients - Light source from top-left */}
          <linearGradient id="pRedTop" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF4D5A" />
            <stop offset="60%" stopColor="#E3000B" />
            <stop offset="100%" stopColor="#C40008" />
          </linearGradient>

          <linearGradient id="pRedSide" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E3000B" />
            <stop offset="70%" stopColor="#B30008" />
            <stop offset="100%" stopColor="#7A0005" />
          </linearGradient>

          <linearGradient id="pWhiteTop" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="65%" stopColor="#F8FAFC" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>

          <linearGradient id="pWhiteSide" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#94A3B8" />
          </linearGradient>

          {/* Authentic Lego Yellow Stud Gradients */}
          <linearGradient id="pYellowTop" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF785" />
            <stop offset="40%" stopColor="#FFD500" />
            <stop offset="100%" stopColor="#E6B800" />
          </linearGradient>

          <linearGradient id="pYellowSide" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFD500" />
            <stop offset="100%" stopColor="#B38600" />
          </linearGradient>

          {/* 3D Glossy Obsidian Black Aerodynamic Canopy Gradient */}
          <linearGradient id="pCanopyBlack3D" x1="15%" y1="0%" x2="85%" y2="100%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="18%" stopColor="#1E293B" />
            <stop offset="50%" stopColor="#0F172A" />
            <stop offset="85%" stopColor="#0B0F19" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>

          {/* Obsidian Inner Specular Glare Gradient */}
          <linearGradient id="pCanopyGlare" x1="0%" y1="0%" x2="100%" y2="80%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="35%" stopColor="#93C5FD" stopOpacity="0.65" />
            <stop offset="70%" stopColor="#38BDF8" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#0284C7" stopOpacity="0" />
          </linearGradient>

          {/* Engine Propulsion Flame */}
          <linearGradient id="pEngineFlame" x1="100%" y1="50%" x2="0%" y2="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="25%" stopColor="#FFF066" stopOpacity="0.95" />
            <stop offset="60%" stopColor="#FF8A00" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#E3000B" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="pEngineCore" x1="100%" y1="50%" x2="0%" y2="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="40%" stopColor="#FFD500" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#FF5A1F" stopOpacity="0" />
          </linearGradient>

          {/* Silky Translucent Aerodynamic Propeller Blur Gradient */}
          <radialGradient id="pPropDisc" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.22" />
            <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.1" />
            <stop offset="75%" stopColor="#FFFFFF" stopOpacity="0.03" />
            <stop offset="88%" stopColor="#FFD500" stopOpacity="0.18" />
            <stop offset="97%" stopColor="#FFF275" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#FFD500" stopOpacity="0" />
          </radialGradient>

          {/* 3D Spinner Red Body Gradient (Identical to Fuselage Red) */}
          <linearGradient id="pSpinnerRed" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FF4D5A" />
            <stop offset="30%" stopColor="#E3000B" />
            <stop offset="70%" stopColor="#B30008" />
            <stop offset="100%" stopColor="#7A0005" />
          </linearGradient>

          {/* 3D Spinner Alpine White Tip (Matching White Racing Stripe) */}
          <linearGradient id="pSpinnerWhiteTip" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="55%" stopColor="#F8FAFC" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </linearGradient>

          {/* Aerodynamic Propeller Blade Tip Light Sweep */}
          <linearGradient id="pBladeSweep" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
            <stop offset="30%" stopColor="#FFF275" stopOpacity="0.5" />
            <stop offset="70%" stopColor="#FFD500" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#FFD500" stopOpacity="0" />
          </linearGradient>

          {/* Aerodynamic Propeller Blade Body Gradient */}
          <linearGradient id="pBladeBody" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="40%" stopColor="#334155" />
            <stop offset="100%" stopColor="#1E293B" />
          </linearGradient>

          {/* Fuselage Underbelly 3D Curved Shadow Gradient */}
          <linearGradient id="pUnderbelly" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8F0006" />
            <stop offset="40%" stopColor="#6B0005" />
            <stop offset="100%" stopColor="#4A0003" />
          </linearGradient>

          {/* NACA Air Intake Internal Shadow Gradient */}
          <linearGradient id="pNacaIntake" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#18181B" />
            <stop offset="60%" stopColor="#27272A" />
            <stop offset="100%" stopColor="#6B0005" />
          </linearGradient>

          <filter id="pThrustGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Symmetrical 3D Propeller Blade Template (Identical for all blades) */}
          <g id="propBladeDef">
            {/* Aerodynamic Blade Body */}
            <path
              d="M -2.5 -5 
                 C -3.8 -16, -4 -32, -3 -42 
                 Q -2.8 -48, 0 -48 
                 Q 2.8 -48, 3 -42 
                 C 4 -32, 3.8 -16, 2.5 -5 Z"
              fill="url(#pBladeBody)"
              stroke="#1E293B"
              strokeWidth="0.6"
              opacity="0.88"
            />
            {/* High-Visibility Tip Cap (Ujung Baling-Baling) */}
            <path
              d="M -3 -42 
                 C -2.8 -46, -2 -48, 0 -48 
                 C 2 -48, 2.8 -46, 3 -42 
                 Z"
              fill="#FFD500"
              stroke="#C99700"
              strokeWidth="0.5"
            />
            {/* Aerodynamic Tip Vortex Light Sweep */}
            <path
              d="M 0 -48 A 48 48 0 0 1 34 -34"
              fill="none"
              stroke="url(#pBladeSweep)"
              strokeWidth="2.2"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </g>
        </defs>

        {/* ============================================================ */}
        {/* 1. FAR WING (Sayap Atas/Kiri - True 3D Aerodynamic Twin Wing)*/}
        {/* ============================================================ */}
        <g id="far-wing" opacity="0.95">
          {/* Far Wing Leading Edge Thickness Bevel */}
          <path
            d="M 236 72 
               C 198 50, 160 34, 126 30 
               L 118 30 
               Q 106 32, 110 38 
               L 108 36 
               Q 104 30, 116 28 
               L 126 28 
               C 160 32, 198 48, 236 70 Z"
            fill="url(#pWhiteSide)"
            stroke="#94A3B8"
            strokeWidth="0.7"
          />

          {/* Far Wing Main Top Surface (Matching Alpine White Swept Plate) */}
          <path
            d="M 152 86 
               C 138 68, 122 52, 110 38 
               Q 106 32, 118 30 
               L 126 30 
               C 160 34, 198 50, 236 72 
               C 210 78, 180 84, 152 86 
               Z"
            fill="url(#pWhiteTop)"
            stroke="#CBD5E1"
            strokeWidth="1.1"
          />

          {/* Far Wing Aileron Trim Line */}
          <path d="M 120 42 L 175 66" stroke="#94A3B8" strokeWidth="0.7" strokeDasharray="3 1" opacity="0.75" />

          {/* Far Wing Rounded Red Accent Tip (Matching Near Wing Tip) */}
          <path
            d="M 110 38 
               Q 106 32, 118 30 
               L 126 30 
               C 122 34, 118 37, 116 40 
               Z"
            fill="url(#pRedTop)"
            stroke="#B30008"
            strokeWidth="0.8"
          />

          {/* Authentic 3D Lego Studs on Far Wing (Symmetrical Twin Count & Spacing) */}
          {[
            { x: 130, y: 40, rx: 5.0, ry: 2.3, h: 2.8 },
            { x: 152, y: 49, rx: 5.2, ry: 2.4, h: 2.8 },
            { x: 174, y: 58, rx: 5.4, ry: 2.5, h: 3.0 },
            { x: 196, y: 67, rx: 5.5, ry: 2.5, h: 3.0 },
          ].map((st, i) => (
            <g key={i}>
              <path
                d={`M ${st.x - st.rx} ${st.y} 
                    L ${st.x - st.rx} ${st.y - st.h} 
                    A ${st.rx} ${st.ry} 0 0 1 ${st.x + st.rx} ${st.y - st.h} 
                    L ${st.x + st.rx} ${st.y} 
                    A ${st.rx} ${st.ry} 0 0 1 ${st.x - st.rx} ${st.y} Z`}
                fill="url(#pYellowSide)"
                stroke="#B38600"
                strokeWidth="0.5"
              />
              <ellipse
                cx={st.x}
                cy={st.y - st.h}
                rx={st.rx}
                ry={st.ry}
                fill="url(#pYellowTop)"
                stroke="#C99700"
                strokeWidth="0.5"
              />
              <ellipse cx={st.x} cy={st.y - st.h - 0.4} rx={st.rx * 0.7} ry={st.ry * 0.6} fill="#FFF9A6" />
            </g>
          ))}
        </g>

        {/* ============================================================ */}
        {/* FAR HORIZONTAL STABILIZER (Twin Tail Elevator di Seberang)   */}
        {/* ============================================================ */}
        <g id="far-horizontal-stabilizer">
          {/* Far Stabilizer Leading Edge Bevel */}
          <path
            d="M 82 112 
               C 68 104, 52 97, 36 94 
               L 38 96 
               C 54 99, 70 106, 84 114 Z"
            fill="url(#pWhiteSide)"
            stroke="#94A3B8"
            strokeWidth="0.6"
          />
          {/* Far Stabilizer Main Aerodynamic Surface */}
          <path
            d="M 82 112 
               C 68 104, 52 97, 36 94 
               Q 30 92, 34 96 
               L 42 98 
               C 54 104, 68 111, 74 116 Z"
            fill="url(#pWhiteTop)"
            stroke="#CBD5E1"
            strokeWidth="0.8"
          />
          {/* Far Stabilizer Rounded Red Tip Cap */}
          <path
            d="M 36 94 
               Q 30 92, 34 96 
               L 42 98 
               C 40 95, 42 93, 44 92 Z"
            fill="url(#pRedTop)"
            stroke="#B30008"
            strokeWidth="0.6"
          />
          {/* Far Stabilizer Trim Seam */}
          <path d="M 40 96 L 68 108" stroke="#94A3B8" strokeWidth="0.6" strokeDasharray="2 1" opacity="0.75" />
        </g>

        {/* ============================================================ */}
        {/* 2. REAR EXHAUST & ENGINE THRUST JETS                         */}
        {/* ============================================================ */}
        <g transform="translate(34, 116)" className="overflow-visible">
          {/* Outer Propulsion Jet Flame */}
          <motion.ellipse
            cx="6"
            cy="10"
            rx={isTakeoff ? 44 : 22}
            ry={isTakeoff ? 10 : 5.2}
            fill="url(#pEngineFlame)"
            animate={{
              rx: isTakeoff ? [42, 62, 40] : [18, 28, 20],
              opacity: isTakeoff ? [0.95, 1, 0.9] : [0.75, 0.95, 0.75],
            }}
            transition={{ repeat: Infinity, duration: 0.12, ease: 'easeInOut' }}
          />
          {/* Concentrated Hot Core Thrust Flame */}
          <motion.ellipse
            cx="9"
            cy="10"
            rx={isTakeoff ? 22 : 11}
            ry={isTakeoff ? 5.2 : 2.8}
            fill="url(#pEngineCore)"
            animate={{
              rx: isTakeoff ? [20, 32, 19] : [9, 15, 10],
            }}
            transition={{ repeat: Infinity, duration: 0.08, ease: 'easeInOut' }}
          />
          {/* Rear Exhaust Titanium Nozzle Collar */}
          <ellipse cx="14" cy="10" rx="5.5" ry="7.2" fill="#27272A" stroke="#475569" strokeWidth="1.2" />
          {/* Glowing Engine Afterburner Interior Iris */}
          <ellipse cx="13" cy="10" rx="3.5" ry="4.8" fill="#FF8A00" opacity="0.85" />
          <ellipse cx="12.5" cy="10" rx="2" ry="3" fill="#FFF275" opacity="0.95" />
        </g>

        {/* ============================================================ */}
        {/* 3. VERTICAL TAIL FIN (Swept-Back Smooth Aerodynamic Fin)     */}
        {/* ============================================================ */}
        <g id="tail-fin">
          {/* Fin Port-Side 3D Shadow Thickness Bevel */}
          <path
            d="M 52 124 
               C 62 98, 76 66, 86 42 
               Q 89 36, 95 36 
               L 97 40 
               C 85 64, 72 96, 64 126 Z"
            fill="#8F0006"
          />
          {/* Fin Main Body Face with smooth graceful sweep */}
          <path
            d="M 64 126 
               C 72 96, 85 64, 97 40 
               Q 102 36, 110 39 
               L 108 44 
               C 106 72, 105 102, 104 124 Z"
            fill="url(#pRedSide)"
            stroke="#7A0005"
            strokeWidth="1"
          />
          {/* Smooth Rounded Aerodynamic Fin Cap (Matching Red ABS Plastic) */}
          <path
            d="M 86 42 Q 95 35, 102 37 L 110 39 Q 102 44, 97 42 Z"
            fill="url(#pRedTop)"
            stroke="#B30008"
            strokeWidth="0.8"
          />
          {/* Aerodynamic Fin Tip Beacon Light */}
          <circle cx="98" cy="36.5" r="1.5" fill="#FF4D5A" />
          <circle cx="98" cy="36.5" r="0.7" fill="#FFFFFF" />
          {/* Rudder Aerodynamic Hinge Seam Line */}
          <line x1="99" y1="41" x2="103" y2="124" stroke="#7A0005" strokeWidth="0.7" strokeDasharray="4 1.5" opacity="0.75" />
          {/* Swept Dynamic Racing Stripe on Fin */}
          <path
            d="M 74 92 C 84 91, 96 91, 105 92 L 103 97 C 95 97, 84 97, 72 98 Z"
            fill="url(#pWhiteTop)"
            stroke="#CBD5E1"
            strokeWidth="0.5"
          />
          <path
            d="M 75 90 C 85 89, 96 89, 105 90 L 105 91.5 C 96 90.5, 85 90.5, 74 91.5 Z"
            fill="#FFD500"
          />
        </g>

        {/* ============================================================ */}
        {/* 4. MAIN FUSELAGE 3D BODY (Airframe Halus & Mengalir Aerodinamis) */}
        {/* ============================================================ */}
        <g id="fuselage-3d">
          {/* Fuselage Underbelly (Smooth 3D boat-tail curve to nozzle) */}
          <path
            d="M 48 126 
               C 62 133, 85 144, 140 142 
               C 230 136, 310 115, 324 104.5 
               L 314 105 
               C 230 120, 140 135, 66 125 
               C 56 123, 50 124, 48 126 Z"
            fill="url(#pUnderbelly)"
            stroke="#4A0003"
            strokeWidth="0.8"
          />

          {/* Fuselage Near Side Wall (Smooth flowing aerodynamic contour) */}
          <path
            d="M 48 126 
               C 58 119, 88 110, 175 92 
               C 275 82, 298 80, 324 90.5 
               L 324 104.5 
               C 265 113, 165 127, 62 133 
               C 54 131, 49 128, 48 126 Z"
            fill="url(#pRedSide)"
            stroke="#8F0006"
            strokeWidth="1.2"
          />

          {/* Aerodynamic Wing-Body Fillet (Blends wing smoothly into fuselage) */}
          <path
            d="M 148 114 
               C 168 111, 212 105, 246 100 
               C 244 107, 230 118, 205 123 
               C 175 125, 155 120, 148 114 Z"
            fill="url(#pRedSide)"
            stroke="#7A0005"
            strokeWidth="0.8"
            opacity="0.85"
          />

          {/* Dual Racing Speed-Stripe: Gold Pinstripe Accent */}
          <path
            d="M 58 123.5 
               C 110 113, 218 99, 306 91 
               L 324 92.5 
               L 324 93.8 
               L 306 92.2 
               C 218 100.5, 110 114.5, 58 124.8 Z"
            fill="#FFD500"
          />

          {/* Main Alpine White Racing Stripe (Flows smoothly from cowl all the way to boat-tail) */}
          <path
            d="M 58 122 
               C 110 111, 218 97, 306 91 
               L 324 93.8 
               L 324 97.5 
               C 304 96.5, 218 103, 56 126 
               Z"
            fill="url(#pWhiteTop)"
            stroke="#CBD5E1"
            strokeWidth="0.5"
          />

          {/* Subtle Injection-Molded Aero Seams */}
          <path d="M 152 95 L 152 118" stroke="#7A0005" strokeWidth="0.6" strokeDasharray="3 1.5" opacity="0.65" />
          <path d="M 252 78 L 252 102" stroke="#7A0005" strokeWidth="0.6" strokeDasharray="3 1.5" opacity="0.65" />

          {/* Sculpted NACA Engine Cooling Vent (Sleek aerodynamic vent) */}
          <path
            d="M 270 94.5 L 284 93 L 283 96.5 L 269 97.5 Z"
            fill="url(#pNacaIntake)"
            stroke="#7A0005"
            strokeWidth="0.6"
          />
          <line x1="271" y1="95.5" x2="282.5" y2="94" stroke="#CBD5E1" strokeWidth="0.6" strokeLinecap="round" opacity="0.6" />

          {/* Fuselage Top Deck with Organic Curvature to Cowl */}
          <path
            d="M 108 108 
               C 148 95, 210 84, 280 80 
               C 300 78, 314 84, 324 90.5 
               L 320 94 
               C 295 86, 210 92, 108 108 Z"
            fill="url(#pRedTop)"
            stroke="#FF4D5A"
            strokeWidth="0.8"
          />

          {/* Specular Edge Chamfers (Precision highlight on exposed red deck) */}
          {/* Rear Spine Chamfer */}
          <path
            d="M 104 110 C 124 103, 138 98, 148 95"
            stroke="#FFA4AB"
            strokeWidth="1.2"
            strokeLinecap="round"
            fill="none"
          />
          {/* Front Hood Chamfer */}
          <path
            d="M 252 81 C 280 80, 300 78, 314 84 L 324 90.5"
            stroke="#FFA4AB"
            strokeWidth="1.2"
            strokeLinecap="round"
            fill="none"
          />

        </g>

        {/* ============================================================ */}
        {/* 5. PRECISION-FITTED OBSIDIAN TINTED CANOPY (Elegan & Presisi)*/}
        {/* ============================================================ */}
        <g id="cockpit-3d">
          {/* Main 3D Glossy Obsidian Smoked Canopy Dome (Presisi 100% Mengikuti Bodi) */}
          <path
            d="M 148 95 
               C 162 66, 182 50, 206 50 
               C 230 50, 246 63, 252 81 
               C 215 83.5, 178 89, 148 95 Z"
            fill="url(#pCanopyBlack3D)"
            stroke="#334155"
            strokeWidth="1.0"
          />

          {/* Inner Depth Rim Highlight (Volumetrik 3D Lengkung Sempurna) */}
          <path
            d="M 152 93 C 165 68, 184 53, 206 53 C 228 53, 243 65, 249 79"
            fill="none"
            stroke="#64748B"
            strokeWidth="0.8"
            opacity="0.6"
          />

          {/* Primary High-Gloss Curved Specular Glare Arc */}
          <path
            d="M 160 66 Q 198 48, 238 58"
            stroke="url(#pCanopyGlare)"
            strokeWidth="2.8"
            strokeLinecap="round"
          />

          {/* Secondary Subtle Ambient Reflection Glare Arc */}
          <path
            d="M 168 72 Q 204 55, 230 64"
            stroke="#FFFFFF"
            strokeWidth="1.1"
            strokeLinecap="round"
            opacity="0.45"
          />

          {/* Front Nose Bubble Pinpoint Specular Highlight */}
          <circle cx="238" cy="59" r="1.4" fill="#FFFFFF" opacity="0.9" />

          {/* Precision Factory Mounting Coaming Rail (Tertanam Rapi Pada Dek Pesawat) */}
          <path
            d="M 146 96.5 
               C 178 90.5, 215 85, 254 82.5 
               L 252 79.5 
               C 215 82, 178 87.5, 148 93.5 Z"
            fill="#1E293B"
            stroke="#334155"
            strokeWidth="0.6"
          />

          {/* Precision Fasteners / Latches (Rapi & Simetris) */}
          <circle cx="170" cy="90" r="0.75" fill="#94A3B8" />
          <circle cx="200" cy="85.5" r="0.75" fill="#94A3B8" />
          <circle cx="230" cy="81.5" r="0.75" fill="#94A3B8" />
        </g>

        {/* ============================================================ */}
        {/* 6. NEAR WING (Sayap Dekat Melengkung Anggun & Ujung Membulat) */}
        {/* ============================================================ */}
        <g id="near-wing">
          {/* Wing Thickness Leading Edge (Smooth Curved Bevel) */}
          <path
            d="M 150 114 
               C 142 126, 120 152, 102 172 
               Q 96 178, 104 184 
               L 114 182 
               C 126 160, 150 134, 168 124 
               Z"
            fill="url(#pWhiteSide)"
            stroke="#94A3B8"
            strokeWidth="0.8"
          />

          {/* Wing Main Top Surface (Smooth Swept Aerodynamic Plate) */}
          <path
            d="M 150 114 
               C 142 126, 120 152, 102 172 
               Q 96 178, 104 184 
               L 114 182 
               C 145 170, 188 152, 222 144 
               C 238 140, 246 118, 248 100 
               C 248 100, 200 108, 150 114 
               Z"
            fill="url(#pWhiteTop)"
            stroke="#CBD5E1"
            strokeWidth="1.2"
          />

          {/* Aileron Trailing Edge Trim Line */}
          <path d="M 126 168 L 195 146" stroke="#94A3B8" strokeWidth="0.7" strokeDasharray="3 1" opacity="0.75" />

          {/* Wing Red Accent Tip with Smooth Rounded Curve */}
          <path
            d="M 102 172 
               Q 96 178, 104 184 
               L 118 181 
               C 114 174, 124 168, 128 166 
               Z"
            fill="url(#pRedTop)"
            stroke="#B30008"
            strokeWidth="0.8"
          />

          {/* 3D Lego Studs on Near Wing (Symmetrical Twin Count & Spacing) */}
          {[
            { x: 128, y: 164, rx: 6.0, ry: 2.8, h: 3.2 },
            { x: 150, y: 152, rx: 6.2, ry: 2.9, h: 3.4 },
            { x: 172, y: 140, rx: 6.4, ry: 3.0, h: 3.5 },
            { x: 194, y: 128, rx: 6.5, ry: 3.0, h: 3.5 },
          ].map((st, i) => (
            <g key={i}>
              <path
                d={`M ${st.x - st.rx} ${st.y} 
                    L ${st.x - st.rx} ${st.y - st.h} 
                    A ${st.rx} ${st.ry} 0 0 1 ${st.x + st.rx} ${st.y - st.h} 
                    L ${st.x + st.rx} ${st.y} 
                    A ${st.rx} ${st.ry} 0 0 1 ${st.x - st.rx} ${st.y} Z`}
                fill="url(#pYellowSide)"
                stroke="#B38600"
                strokeWidth="0.6"
              />
              <ellipse cx={st.x} cy={st.y - st.h} rx={st.rx} ry={st.ry} fill="url(#pYellowTop)" stroke="#C99700" strokeWidth="0.5" />
              <ellipse cx={st.x} cy={st.y - st.h - 0.4} rx={st.rx * 0.7} ry={st.ry * 0.6} fill="#FFF9A6" />
            </g>
          ))}
        </g>

        {/* ============================================================ */}
        {/* 7. NEAR HORIZONTAL STABILIZER (Twin Tail Elevator di Sisi Dekat) */}
        {/* ============================================================ */}
        <g id="near-horizontal-stabilizer">
          {/* Near Stabilizer Leading Edge Bevel */}
          <path
            d="M 80 128 
               C 64 138, 48 148, 34 154 
               L 36 156 
               C 50 150, 66 140, 82 130 Z"
            fill="url(#pWhiteSide)"
            stroke="#94A3B8"
            strokeWidth="0.6"
          />

          {/* Near Stabilizer Main Aerodynamic Top Surface */}
          <path
            d="M 80 128 
               C 64 138, 48 148, 34 154 
               Q 28 157, 34 160 
               L 44 158 
               C 54 150, 68 142, 74 134 Z"
            fill="url(#pWhiteTop)"
            stroke="#CBD5E1"
            strokeWidth="1.0"
          />

          {/* Near Stabilizer Rounded Lego Red Accent Tip */}
          <path
            d="M 34 154 
               Q 28 157, 34 160 
               L 44 158 
               C 41 154, 43 151, 45 149 Z"
            fill="url(#pRedTop)"
            stroke="#B30008"
            strokeWidth="0.7"
          />

          {/* Elevator Trim Hinge Line */}
          <path d="M 40 155 L 70 139" stroke="#94A3B8" strokeWidth="0.7" strokeDasharray="3 1" opacity="0.75" />
        </g>

        {/* ============================================================ */}
        {/* 8. NOSE CONE & PURE LUMINOUS PROPELLER SYSTEM                */}
        {/* Seamlessly flowing from nose cowl to spinner tip             */}
        {/* ============================================================ */}
        <g id="nose-and-propeller">
          {/* 
            INTEGRATED PROPELLER & SPINNER ASSEMBLY
            Concentric at engine cowl firewall (324, 97.5), natural flight tilt -4deg
          */}
          <g transform="translate(324, 97.5) rotate(-4)">
            {/* Engine Cowl Circular Firewall Opening */}
            <ellipse cx="0" cy="0" rx="1.8" ry="7" fill="#8F0006" stroke="#4A0003" strokeWidth="0.8" />
            <ellipse cx="0.4" cy="0" rx="1.2" ry="6.6" fill="#18181B" />

            {/* Outer Aerodynamic Airflow Wash Disc (Soft Ethereal Shimmer) */}
            <ellipse
              cx="0"
              cy="0"
              rx={isTakeoff ? 8 : 6}
              ry={isTakeoff ? 54 : 46}
              fill="url(#pPropDisc)"
            />

            {/* High-Velocity Core Airflow */}
            <ellipse
              cx="0"
              cy="0"
              rx={isTakeoff ? 4 : 3}
              ry={isTakeoff ? 38 : 32}
              fill="#FFFFFF"
              opacity="0.12"
            />

            {/* Delicate Aerodynamic Golden Tip Rim */}
            <ellipse
              cx="0"
              cy="0"
              rx={isTakeoff ? 8 : 6}
              ry={isTakeoff ? 54 : 46}
              fill="none"
              stroke="#FFD500"
              strokeWidth="1"
              opacity="0.5"
            />
            <ellipse
              cx="0"
              cy="0"
              rx={isTakeoff ? 7.6 : 5.6}
              ry={isTakeoff ? 53 : 45}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="0.6"
              opacity="0.65"
            />

            {/* 
              ROTATING PROPELLER BLADES (100% Symmetrical 180° Rotational Balance)
              Both blades share the exact same template and rotational symmetry
            */}
            <g transform={`scale(${isTakeoff ? 8 / 54 : 6 / 46}, 1)`}>
              <motion.g
                animate={{ rotate: [0, 360] }}
                transition={{
                  repeat: Infinity,
                  duration: isTakeoff ? 0.08 : 0.14,
                  ease: 'linear',
                }}
              >
                {/* Blade 1 */}
                <use href="#propBladeDef" />
                {/* Blade 2 (Exact 180° Rotational Symmetry - Perfectly Identical) */}
                <use href="#propBladeDef" transform="rotate(180)" />
              </motion.g>
            </g>

            {/* 
              3D SPINNER HUB & NOSE TIP
              Direct organic continuation of the red fuselage and white racing stripe
            */}
            <g id="spinner-hub-3d">
              {/* Fine Golden Seam Ring at Cowl-to-Spinner Junction */}
              <ellipse cx="0" cy="0" rx="0.8" ry="6.8" fill="none" stroke="#FFD500" strokeWidth="0.8" opacity="0.85" />

              {/* Main 3D Bullet Spinner Body in Lego Red (Exact continuation of Fuselage) */}
              <path
                d="M 0 -6.5
                   C 8 -6.5, 17 -3, 23 0
                   C 17 3, 8 6.5, 0 6.5
                   C -1 4, -1 -4, 0 -6.5
                   Z"
                fill="url(#pSpinnerRed)"
                stroke="#8F0006"
                strokeWidth="0.8"
              />

              {/* Elegant Alpine White Ceramic Nose Tip Dome (Completes the White Racing Stripe) */}
              <path
                d="M 15 -3.5
                   C 18 -3.1, 21.2 -1.5, 23.2 0
                   C 21.2 1.5, 18 3.1, 15 3.5
                   C 14.1 1.7, 14.1 -1.7, 15 -3.5
                   Z"
                fill="url(#pSpinnerWhiteTip)"
                stroke="#94A3B8"
                strokeWidth="0.6"
              />

              {/* Machined Gold Separation Line between Red Body and White Tip */}
              <ellipse cx="15" cy="0" rx="0.7" ry="3.5" fill="none" stroke="#FFD500" strokeWidth="0.7" opacity="0.9" />

              {/* Specular Edge Highlight (Continuous Sunlight Glint from Cockpit across Tip) */}
              <path
                d="M 1 -4.5 C 8 -4.2, 15.5 -2.4, 22.2 -0.2"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="1"
                strokeLinecap="round"
                opacity="0.85"
              />

              {/* Glossy Reflection Spot on White Nose Tip */}
              <ellipse cx="19" cy="-0.8" rx="1.6" ry="0.7" fill="#FFFFFF" opacity="0.95" />

              {/* Precision Stagnation Point Sparkle right at Apex */}
              <circle cx="22.5" cy="0" r="0.6" fill="#FFFFFF" opacity="0.9" />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}

/**
 * Minimalist Segmented Flight Meter
 * - Focused purely on the percentage readout and the segmented load bar.
 * - All side labels, badges, and peripheral clutter removed.
 */
function LegoProgressBar({ onComplete, startDelay = 350 }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 1800; // ms: organic spool-up feel from 0% to 100%
    let frameId;
    let startTime;

    // Tunggu sejenak agar user melihat angka [0%] saat pesawat mulai mendarat
    const timeoutId = setTimeout(() => {
      startTime = performance.now();

      const updateProgress = (now) => {
        const elapsed = now - startTime;
        const linear = Math.min(1, elapsed / duration);
        // Smooth organic ease-in-out: mulai perlahan dari 0%, stabil di tengah, lalu anggun di 100%
        const eased =
          linear < 0.5
            ? 2 * linear * linear
            : 1 - Math.pow(-2 * linear + 2, 2) / 2;
        const pct = Math.min(100, Math.round(eased * 100));
        setProgress(pct);

        if (linear < 1) {
          frameId = requestAnimationFrame(updateProgress);
        } else {
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 280);
        }
      };

      frameId = requestAnimationFrame(updateProgress);
    }, startDelay);

    return () => {
      clearTimeout(timeoutId);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [onComplete, startDelay]);

  // 18 segmented LED thrust bars
  const totalBars = 18;
  const activeBars = Math.floor((progress / 100) * totalBars);

  return (
    <div className="w-full max-w-[260px] sm:max-w-[290px] flex flex-col items-center select-none font-mono">
      {/* Crisp Monospace Tabular Percentage */}
      <div className="mb-2 text-center">
        <span className="text-sm sm:text-base font-bold tracking-wider text-[#FFD500] tabular-nums drop-shadow-[0_2px_10px_rgba(255,213,0,0.35)]">
          {progress}%
        </span>
      </div>

      {/* 18-Segment LED Array Load Bar */}
      <div className="w-full flex gap-[3px] p-1 bg-[#070a12] rounded-lg border border-[#182032] shadow-[inset_0_2px_4px_rgba(0,0,0,0.85),0_4px_16px_rgba(0,0,0,0.5)]">
        {Array.from({ length: totalBars }).map((_, i) => {
          const isFilled = i < activeBars || (i === 0 && progress > 2);
          return (
            <div
              key={i}
              className={`flex-1 h-3 sm:h-3.5 rounded-[1.5px] transition-all duration-100 ${
                isFilled
                  ? 'bg-gradient-to-t from-[#E6B800] via-[#FFD500] to-[#FFF785] shadow-[0_0_6px_rgba(255,213,0,0.5)]'
                  : 'bg-[#121724]'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}

/**
 * Cinematic Supersonic Takeoff Loader with 3D Lego Airplane
 */
export default function LegoCurtainLoader({ onComplete }) {
  const [isTakeoff, setIsTakeoff] = useState(false);

  const handleTakeoffComplete = () => {
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[99999] overflow-hidden pointer-events-auto select-none bg-[#060a17]"
    >
      {/* 
        ====================================================================
        COSMIC AEROSPACE BACKDROP: HARMONIZED WITH ABOUT & CLASSIC SPACE
        ====================================================================
      */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        {/* 1. Deep Orbital Void & Nebula Lighting (Classic Space Blue, Violet & Amber Horizon) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(circle 950px at 80% 20%, rgba(0, 85, 191, 0.32), transparent 70%),
              radial-gradient(circle 850px at 15% 45%, rgba(121, 40, 202, 0.22), transparent 65%),
              radial-gradient(circle 1000px at 50% 90%, rgba(255, 213, 0, 0.12), transparent 70%),
              linear-gradient(180deg, #060a17 0%, #0a0e20 50%, #050814 100%)
            `,
          }}
        />

        {/* 2. Twinkling Space Stars Field across the Cosmic Sky */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-75"
          style={{
            backgroundImage: `
              radial-gradient(1px 1px at 25px 35px, #ffffff, rgba(0,0,0,0)),
              radial-gradient(1.5px 1.5px at 120px 80px, #ffffff, rgba(0,0,0,0)),
              radial-gradient(1px 1px at 240px 190px, #ffd500, rgba(0,0,0,0)),
              radial-gradient(2px 2px at 380px 120px, #61dafb, rgba(0,0,0,0)),
              radial-gradient(1px 1px at 490px 310px, #ffffff, rgba(0,0,0,0)),
              radial-gradient(1.5px 1.5px at 620px 220px, #ffffff, rgba(0,0,0,0)),
              radial-gradient(1px 1px at 750px 90px, #ffd500, rgba(0,0,0,0)),
              radial-gradient(2px 2px at 890px 270px, #ffffff, rgba(0,0,0,0)),
              radial-gradient(1px 1px at 1020px 150px, #61dafb, rgba(0,0,0,0)),
              radial-gradient(1.5px 1.5px at 1180px 320px, #ffffff, rgba(0,0,0,0)),
              radial-gradient(1px 1px at 1310px 180px, #ffffff, rgba(0,0,0,0)),
              radial-gradient(1.5px 1.5px at 1410px 70px, #ffd500, rgba(0,0,0,0))
            `,
            backgroundSize: '1440px 420px',
          }}
        />

        {/* 3. Stylized Classic Space Celestial Planet (Glowing Orb in Top-Right) */}
        <div 
          className="absolute top-6 -right-14 sm:right-6 md:right-12 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 rounded-full pointer-events-none opacity-85"
          style={{
            background: 'radial-gradient(circle at 35% 35%, rgba(0, 240, 255, 0.85) 0%, rgba(0, 85, 191, 0.8) 45%, rgba(121, 40, 202, 0.85) 75%, rgba(255, 0, 128, 0.7) 100%)',
            boxShadow: '0 0 60px rgba(0, 240, 255, 0.35), inset -18px -18px 36px rgba(0, 0, 0, 0.85), inset 12px 12px 24px rgba(255, 255, 255, 0.35)',
            transform: 'translateZ(0)',
          }}
        >
          <div 
            className="absolute inset-0 rounded-full opacity-35"
            style={{
              background: 'radial-gradient(ellipse at 70% 30%, rgba(255, 255, 255, 0.9) 0%, transparent 60%)',
            }}
          />
        </div>

        {/* 4. Classic Space Perspective Cyber Launchpad Runway Grid on Floor */}
        <div 
          className="absolute inset-x-0 bottom-0 h-[380px] sm:h-[440px] pointer-events-none opacity-35"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(0, 240, 255, 0.35) 1.5px, transparent 1.5px),
              linear-gradient(to bottom, rgba(255, 213, 0, 0.25) 1.5px, transparent 1.5px)
            `,
            backgroundSize: '54px 54px',
            maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 45%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 45%, transparent 100%)',
            transform: 'perspective(550px) rotateX(52deg)',
            transformOrigin: 'bottom center',
          }}
        />

        {/* 5. Center Aerodynamic Ambient Glow Behind Plane */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] sm:w-[750px] h-[340px] rounded-full pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 65% 55% at 50% 50%, rgba(255, 213, 0, 0.14) 0%, rgba(0, 85, 191, 0.10) 45%, transparent 75%)',
          }}
        />
      </div>

      {/* ============================================================ */}
      {/* CENTER STAGE: THE 3D LEGO AIRPLANE ASSEMBLY                  */}
      {/* ============================================================ */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 z-20">

          {/* Aircraft Stage: Swoops in from Left on load, hovers in center, and blasts off to Right on takeoff */}
          <motion.div
            className="relative z-20 flex flex-col items-center"
            initial={{ x: '-90vw', opacity: 0 }}
            animate={
              isTakeoff
                ? {
                    x: ['0vw', '15vw', '140vw'],
                    opacity: 1, // Tetap solid 100%, jangan hilang di tengah jalan!
                  }
                : {
                    x: '0vw',
                    opacity: 1,
                  }
            }
            transition={
              isTakeoff
                ? {
                    duration: 0.85,
                    ease: [0.32, 0, 0.18, 1], // Smooth supersonic climb
                    times: [0, 0.35, 1],
                  }
                : {
                    duration: 0.85,
                    ease: [0.16, 1, 0.3, 1], // Silky aerodynamic arrival glide from left
                  }
            }
            onAnimationComplete={() => {
              if (isTakeoff) {
                handleTakeoffComplete();
              }
            }}
          >
            {/* The 3D Airplane (Aerodynamic Cruising Hover & Banking) */}
            <motion.div
              className="relative z-20"
              animate={
                isTakeoff
                  ? {
                      y: ['0px', '-10px', '-55px'],
                      rotate: [0, -3.5, -8],
                      scale: [1, 1.04, 1.12],
                    }
                  : {
                      y: [-6, 6, -6],
                      rotate: [-1.2, 1.4, -1.2],
                      scale: 1,
                    }
              }
              transition={
                isTakeoff
                  ? {
                      duration: 0.85,
                      ease: [0.32, 0, 0.18, 1],
                      times: [0, 0.35, 1],
                    }
                  : {
                      repeat: Infinity,
                      duration: 3.2,
                      ease: 'easeInOut',
                    }
              }
            >
              <LegoAirplane3D isTakeoff={isTakeoff} />
            </motion.div>

            {/* Realistic 3D Ground / Ambient Shadow */}
            <motion.div
              className="w-56 sm:w-72 md:w-80 h-4 rounded-full bg-black/75 blur-[8px] mt-1 mb-8 pointer-events-none"
              animate={
                isTakeoff
                  ? { scale: [1, 0.4, 0], opacity: [0.6, 0.25, 0] }
                  : { scale: [0.92, 1.05, 0.92], opacity: [0.5, 0.7, 0.5] }
              }
              transition={
                isTakeoff
                  ? { duration: 0.55, ease: 'easeOut' }
                  : { repeat: Infinity, duration: 3.2, ease: 'easeInOut' }
              }
            />
          </motion.div>

          {/* ============================================================ */}
          {/* HARMONIOUS LEGO PROGRESS INDICATOR                           */}
          {/* ============================================================ */}
          <AnimatePresence>
            {!isTakeoff && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8, transition: { duration: 0.25, ease: 'easeOut' } }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="w-full max-w-xs sm:max-w-sm flex flex-col items-center"
              >
                <LegoProgressBar onComplete={() => setIsTakeoff(true)} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
  );
}
