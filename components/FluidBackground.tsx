
import React from 'react';

const FluidBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 bg-black overflow-hidden pointer-events-none">
      {/* Primary Fluid Layer */}
      <div className="absolute inset-0 opacity-[var(--fluid-opacity)]">
        {/* Large drifting primary blob - Site Accent */}
        <div 
          className="absolute top-[-20%] left-[-10%] w-[120%] h-[120%] rounded-full filter blur-[120px] animate-fluid-slow opacity-60"
          style={{ 
            mixBlendMode: 'screen',
            background: 'linear-gradient(to bottom right, var(--accent), color-mix(in srgb, var(--accent) 50%, black), transparent)'
          }}
        />
        
        {/* Deep dark accent variant - Contrast */}
        <div 
          className="absolute bottom-[-30%] right-[-20%] w-[100%] h-[100%] rounded-full filter blur-[140px] animate-fluid-reverse opacity-70"
          style={{ 
            mixBlendMode: 'screen',
            background: 'linear-gradient(to top left, color-mix(in srgb, var(--accent) 30%, black), var(--accent), transparent)'
          }}
        />

        {/* High-intensity highlight - Vivid version */}
        <div 
          className="absolute top-[20%] right-[-15%] w-[60%] h-[80%] rounded-full filter blur-[160px] opacity-15 animate-fluid-fast"
          style={{ 
            mixBlendMode: 'soft-light',
            backgroundColor: 'var(--accent)'
          }}
        />
        
        {/* Deep shadow fluid - Black drift for depth */}
        <div 
          className="absolute top-[40%] left-[30%] w-[50%] h-[50%] bg-black rounded-full filter blur-[100px] opacity-90 animate-fluid-slow"
        />

        {/* Secondary drift blob - Deep variant */}
        <div 
          className="absolute bottom-[10%] left-[-10%] w-[70%] h-[70%] rounded-full filter blur-[130px] opacity-40 animate-fluid-fast"
          style={{ 
            mixBlendMode: 'plus-lighter',
            backgroundColor: 'color-mix(in srgb, var(--accent) 40%, black)'
          }}
        />
      </div>

      {/* Subtle Dot Grid Pattern */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        <svg 
          className="w-full h-full opacity-[0.08] animate-grid-fade" 
          width="100%" 
          height="100%" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="dot-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="white" fillOpacity="0.4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dot-grid)" />
        </svg>
      </div>

      {/* Noise Texture Overlay for film grain feel */}
      <div 
        className="absolute inset-0 pointer-events-none z-[2]"
        style={{
          opacity: 0.05,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />
      
      {/* Cinematic Vignette */}
      <div className="absolute inset-0 z-[3] bg-[radial-gradient(circle_at_center,transparent_0%,black_90%)] opacity-85" />
      <div className="absolute inset-0 z-[3] bg-gradient-to-b from-black via-transparent to-black opacity-70" />

      <style>{`
        @keyframes fluid-slow {
          0% { transform: translate(0, 0) scale(1) rotate(0deg); }
          33% { transform: translate(4%, 8%) scale(1.1) rotate(4deg); }
          66% { transform: translate(-4%, 4%) scale(0.9) rotate(-4deg); }
          100% { transform: translate(0, 0) scale(1) rotate(0deg); }
        }
        @keyframes fluid-reverse {
          0% { transform: translate(0, 0) scale(1) rotate(0deg); }
          50% { transform: translate(-8%, -12%) scale(1.2) rotate(-8deg); }
          100% { transform: translate(0, 0) scale(1) rotate(0deg); }
        }
        @keyframes fluid-fast {
          0% { transform: translate(0, 0) scale(1); opacity: 0.15; }
          50% { transform: translate(12%, -8%) scale(1.4); opacity: 0.35; }
          100% { transform: translate(0, 0) scale(1); opacity: 0.15; }
        }
        @keyframes grid-fade {
          0%, 100% { opacity: 0.04; }
          50% { opacity: 0.1; }
        }
        .animate-fluid-slow {
          animation: fluid-slow 25s ease-in-out infinite;
        }
        .animate-fluid-reverse {
          animation: fluid-reverse 30s ease-in-out infinite;
        }
        .animate-fluid-fast {
          animation: fluid-fast 18s ease-in-out infinite;
        }
        .animate-grid-fade {
          animation: grid-fade 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default FluidBackground;
