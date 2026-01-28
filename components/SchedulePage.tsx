
import React, { useState } from 'react';

const SchedulePage: React.FC = () => {
  const [imgSrc, setImgSrc] = useState('/banner.png');
  const [hasError, setHasError] = useState(false);

  const handleImageError = () => {
    if (imgSrc === '/banner.png') {
      setImgSrc('/banner.jpg');
    } else if (imgSrc === '/banner.jpg') {
      setImgSrc('/banner.webp');
    } else {
      setHasError(true);
    }
  };

  const containerClasses = "w-full h-[300px] md:h-[600px] rounded-[2.5rem] bg-zinc-50 dark:bg-zinc-900/50 border-2 border-zinc-100 dark:border-zinc-800 relative overflow-hidden group transition-all duration-500";

  if (hasError) {
    return (
      <div className="pt-4 pb-12 animate-page-enter">
        <div className={`${containerClasses} border-dashed flex items-center justify-center`}>
          {/* Subtle Inner Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
          
          {/* Decorative Grid Pattern */}
          <div 
            className="absolute inset-0 opacity-[0.03] pointer-events-none text-zinc-900 dark:text-zinc-100" 
            style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '32px 32px' }} 
          />

          {/* Placeholder Text */}
          <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.5em] text-zinc-300 dark:text-zinc-600 select-none group-hover:text-zinc-400 dark:group-hover:text-zinc-500 transition-colors duration-500">
            image placeholder
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-4 pb-12 animate-page-enter">
      <div className={containerClasses}>
        <img 
          src={imgSrc} 
          alt="League Banner" 
          onError={handleImageError}
          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
        />
        {/* Subtle overlay to keep it consistent with site aesthetics */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-40" />
      </div>
    </div>
  );
};

export default SchedulePage;
