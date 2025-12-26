import React from 'react';

const FluidBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 bg-black overflow-hidden">
      {/* Animated Blobs - Intensified Reds */}
      <div 
        className="absolute top-[-15%] left-[-15%] w-[80%] h-[80%] bg-[#D60A07] rounded-full mix-blend-screen filter blur-[120px] animate-pulse opacity-30"
        style={{ animationDuration: '10s' }}
      />
      <div 
        className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-[#FF0000] rounded-full mix-blend-screen filter blur-[150px] animate-bounce opacity-25"
        style={{ animationDuration: '15s' }}
      />
      <div 
        className="absolute top-[10%] right-[-5%] w-[60%] h-[60%] bg-[#8B0000] rounded-full mix-blend-screen filter blur-[180px] opacity-40 animate-pulse"
        style={{ animationDuration: '12s' }}
      />
      <div 
        className="absolute bottom-[10%] left-[5%] w-[50%] h-[50%] bg-[#D60A07] rounded-full mix-blend-screen filter blur-[140px] opacity-20 animate-bounce"
        style={{ animationDuration: '20s' }}
      />
      
      {/* Central focus mask to keep text legible */}
      <div className="absolute top-[40%] left-[20%] w-[40%] h-[40%] bg-[#000] rounded-full filter blur-[120px] opacity-90" />
      
      {/* Subtle Dot Grid Pattern */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        <svg 
          className="w-full h-full opacity-[0.15] animate-grid-fade" 
          width="100%" 
          height="100%" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="dot-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1.5" fill="white" fillOpacity="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dot-grid)" />
        </svg>
      </div>

      {/* Noise Texture Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          opacity: 0.05,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />
      
      {/* Dark Vignette Overlay */}
      <div className="absolute inset-0 z-[2] bg-gradient-to-t from-black via-transparent to-black opacity-90" />
      <div className="absolute inset-0 z-[2] bg-gradient-to-r from-black via-transparent to-black opacity-70" />

      <style>{`
        @keyframes grid-fade {
          0%, 100% { opacity: 0.08; }
          50% { opacity: 0.15; }
        }
        .animate-grid-fade {
          animation: grid-fade 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default FluidBackground;