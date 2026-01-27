
import React, { useEffect, useMemo, useState } from 'react';

interface VeinsMilkEasterEggProps {
  onComplete: () => void;
  reducedMotion: boolean;
}

interface VeinSegment {
  d: string;
  stroke: string;
  strokeWidth: number;
  key: string;
}

const VeinsMilkEasterEgg: React.FC<VeinsMilkEasterEggProps> = ({ onComplete, reducedMotion }) => {
  const [isFadingOut, setIsFadingOut] = useState(false);

  // Configuration for the effect lifecycle
  // 1. Grow/Draw (250ms) -> 2. Hold (~900ms) -> 3. Fade Out (350ms)
  useEffect(() => {
    // Start fade out sequence
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 1150);

    // Unmount/Complete
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 1500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  // Procedurally generate the vein network only once
  const veinPaths = useMemo(() => {
    const paths: VeinSegment[] = [];
    const width = 1000; // Logical SVG width
    const height = 1000; // Logical SVG height
    const centerX = width / 2;
    const centerY = height / 2;

    // Helper: Random range
    const random = (min: number, max: number) => Math.random() * (max - min) + min;

    // Recursive function to generate branches
    const growBranch = (
      x: number, 
      y: number, 
      angle: number, 
      depth: number, 
      maxDepth: number,
      thickness: number
    ) => {
      if (depth === 0) return;

      // Length shrinks as we go deeper
      const length = random(60, 120) * (depth / maxDepth);
      
      // Calculate end point
      const endX = x + Math.cos(angle) * length;
      const endY = y + Math.sin(angle) * length;

      // Control point for quadratic bezier (adds the organic wiggle)
      // We offset the midpoint by a random perpendicular amount
      const midX = (x + endX) / 2;
      const midY = (y + endY) / 2;
      const wiggleAmt = random(-30, 30);
      const cpX = midX + Math.cos(angle + Math.PI / 2) * wiggleAmt;
      const cpY = midY + Math.sin(angle + Math.PI / 2) * wiggleAmt;

      // Color selection: Deep Red or Deep Blue with slight variation
      // Trunk (high depth) is darker, tips are slightly lighter
      const isRed = Math.random() > 0.45; // Mix of both
      const colorBase = isRed 
        ? `rgba(${Math.floor(random(100, 180))}, 0, 0, ${random(0.7, 0.9)})` // Deep Red
        : `rgba(0, 0, ${Math.floor(random(100, 180))}, ${random(0.7, 0.9)})`; // Deep Blue

      paths.push({
        d: `M ${x.toFixed(1)} ${y.toFixed(1)} Q ${cpX.toFixed(1)} ${cpY.toFixed(1)} ${endX.toFixed(1)} ${endY.toFixed(1)}`,
        stroke: colorBase,
        strokeWidth: thickness,
        key: `${depth}-${x}-${y}-${Math.random()}`
      });

      // Branch out
      // 1 to 3 sub-branches
      const branchCount = Math.floor(random(1, 3.5)); 
      
      for (let i = 0; i < branchCount; i++) {
        // Diverge angle slightly
        const newAngle = angle + random(-0.5, 0.5);
        // Taper thickness
        const newThickness = Math.max(0.5, thickness * 0.7);
        
        growBranch(endX, endY, newAngle, depth - 1, maxDepth, newThickness);
      }
    };

    // Spawning Trunks from edges
    const trunkCount = 12;
    for (let i = 0; i < trunkCount; i++) {
      // Pick a random edge point
      let startX, startY;
      const edge = Math.floor(Math.random() * 4); // 0:top, 1:right, 2:bottom, 3:left
      
      if (edge === 0) { startX = random(0, width); startY = -50; }
      else if (edge === 1) { startX = width + 50; startY = random(0, height); }
      else if (edge === 2) { startX = random(0, width); startY = height + 50; }
      else { startX = -50; startY = random(0, height); }

      // Calculate angle towards center (with some noise)
      const angleToCenter = Math.atan2(centerY - startY, centerX - startX);
      const angle = angleToCenter + random(-0.3, 0.3);

      growBranch(startX, startY, angle, 5, 5, random(3, 6)); // Max depth 5, start thickness 3-6
    }

    return paths;
  }, []);

  return (
    <div className={`fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center overflow-hidden font-sans transition-opacity duration-300 ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}>
      
      {/* 1. VEINS OVERLAY */}
      <div className="absolute inset-0 w-full h-full mix-blend-multiply dark:mix-blend-normal">
        <svg 
          className="w-full h-full" 
          viewBox="0 0 1000 1000" 
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* Organic Glow/Blur Filter for veins */}
            <filter id="vein-blur" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
              <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
              <feBlend in="SourceGraphic" in2="goo" />
            </filter>
          </defs>

          <g filter="url(#vein-blur)">
            {veinPaths.map((vein) => (
              <path
                key={vein.key}
                d={vein.d}
                fill="none"
                stroke={vein.stroke}
                strokeWidth={vein.strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                className={reducedMotion ? '' : 'animate-vein-grow'}
                pathLength={1} // Allows using 0-1 for dashoffset regardless of length
              />
            ))}
          </g>
        </svg>
      </div>

      {/* 2. MILK SPLASH - Centered, independent layer */}
      <div className={`relative z-10 ${reducedMotion ? 'animate-fade-in' : 'animate-milk-burst'}`}>
         <svg width="min(90vw, 600px)" height="min(90vw, 600px)" viewBox="0 0 200 200" className="drop-shadow-2xl opacity-95">
             <defs>
               <radialGradient id="milk-grad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                 <stop offset="0%" stopColor="#FFFFFF" />
                 <stop offset="90%" stopColor="#F0F0F0" />
                 <stop offset="100%" stopColor="#E0E0E0" />
               </radialGradient>
               <filter id="milk-goo">
                 <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
                 <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
                 <feComposite in="SourceGraphic" in2="goo" operator="atop"/>
               </filter>
             </defs>
             
             <g filter="url(#milk-goo)">
               {/* Core Splat */}
               <path d="M100 60 C 70 60, 50 90, 60 110 C 70 130, 40 140, 80 150 C 110 160, 150 140, 140 110 C 130 80, 140 60, 100 60 Z" fill="url(#milk-grad)" />
               
               {/* Radiating Splashes */}
               <path d="M100 60 Q 90 30 80 45" stroke="white" strokeWidth="6" strokeLinecap="round" fill="none" />
               <path d="M110 65 Q 130 30 140 50" stroke="white" strokeWidth="5" strokeLinecap="round" fill="none" />
               <path d="M70 110 Q 30 100 40 80" stroke="white" strokeWidth="5" strokeLinecap="round" fill="none" />
               <path d="M130 120 Q 170 130 160 100" stroke="white" strokeWidth="4" strokeLinecap="round" fill="none" />
               
               {/* Droplets */}
               <circle cx="90" cy="30" r="4" fill="white" />
               <circle cx="150" cy="60" r="3" fill="white" />
               <circle cx="40" cy="90" r="5" fill="white" />
               <circle cx="160" cy="110" r="4" fill="white" />
             </g>
         </svg>
      </div>

      <style>{`
         /* Vein Growth Animation */
         .animate-vein-grow {
            stroke-dasharray: 1;
            stroke-dashoffset: 1;
            animation: grow 250ms cubic-bezier(0.25, 1, 0.5, 1) forwards;
         }
         
         @keyframes grow {
            to { stroke-dashoffset: 0; }
         }

         /* Milk Splash Animation */
         .animate-milk-burst {
            animation: milk-burst 1.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
            transform-origin: center;
         }

         @keyframes milk-burst {
            0% { opacity: 0; transform: scale(0.4) rotate(-10deg); }
            15% { opacity: 1; transform: scale(1.1) rotate(5deg); }
            30% { transform: scale(0.95) rotate(0deg); }
            80% { opacity: 1; transform: scale(1.0); }
            100% { opacity: 0; transform: scale(1.05); }
         }
         
         .animate-fade-in {
            animation: fade-in 1.4s ease-out forwards;
         }
         
         @keyframes fade-in {
            0% { opacity: 0; }
            20% { opacity: 1; }
            80% { opacity: 1; }
            100% { opacity: 0; }
         }
      `}</style>
    </div>
  );
};

export default VeinsMilkEasterEgg;
