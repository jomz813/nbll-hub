
import React, { useState } from 'react';

const UnknownPage: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div className="animate-page-enter pt-8 md:pt-12 h-[60vh] md:h-[70vh]">
      <div 
        className={`
          w-full h-full rounded-[3rem] border-2 border-dashed transition-all duration-300
          flex flex-col items-center justify-center gap-6 cursor-pointer group relative overflow-hidden
          ${isDragging 
            ? 'border-[#D60A07] bg-[#D60A07]/5 scale-[0.99]' 
            : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 hover:border-zinc-300 dark:hover:border-zinc-700'
          }
        `}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); }}
      >
        <div className={`
          w-24 h-24 rounded-full bg-white dark:bg-zinc-800 shadow-xl flex items-center justify-center 
          text-zinc-300 dark:text-zinc-600 group-hover:scale-110 group-hover:text-[#D60A07] transition-all duration-500
          ${isDragging ? 'scale-110 text-[#D60A07]' : ''}
        `}>
          <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
             <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
             <polyline points="17 8 12 3 7 8" />
             <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>
        
        <div className="space-y-2 text-center relative z-10">
          <p className="text-zinc-900 dark:text-zinc-100 font-black text-xl tracking-tight">Upload Image</p>
          <p className="text-zinc-400 dark:text-zinc-500 text-sm font-bold tracking-wide uppercase">Drag and drop or click to browse</p>
        </div>

        {/* Decorative Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]" 
             style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }} 
        />
      </div>
    </div>
  );
};

export default UnknownPage;
