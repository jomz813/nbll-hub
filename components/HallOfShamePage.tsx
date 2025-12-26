
import React from 'react';

interface ShameItem {
  id: number;
  title: string;
  description: string;
  image: string | null;
}

// Generate 15 placeholder items
const shameItems: ShameItem[] = Array.from({ length: 15 }).map((_, i) => ({
  id: i + 1,
  title: 'TBD',
  description: 'Details regarding this entry are pending.',
  image: null
}));

const HallOfShamePage: React.FC = () => {
  return (
    <div className="animate-page-enter pt-4">
      {/* Grid: 1 col mobile, 2 cols tablet, 3 cols desktop. Left-aligned by default logic. */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
        {shameItems.map((item) => (
          <div key={item.id} className="group flex flex-col gap-4">
             {/* Photo container */}
             <div className="w-full aspect-[4/3] bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[1.5rem] overflow-hidden relative flex items-center justify-center shadow-sm transition-all duration-500 hover:shadow-md hover:-translate-y-1 hover:border-[#D60A07]/20">
                {/* Placeholder Icon */}
                <div className="flex flex-col items-center gap-2 opacity-30 group-hover:opacity-50 transition-opacity">
                   <svg className="w-8 h-8 text-zinc-400 dark:text-zinc-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21 15 16 10 5 21"/>
                   </svg>
                   <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-600">
                     Photo
                   </span>
                </div>
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
             </div>

             {/* Description Slot */}
             <div className="space-y-1.5 px-1">
                <div className="flex items-center gap-2.5">
                   <div className="w-1 h-1 rounded-full bg-[#D60A07] shrink-0" />
                   <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide truncate">
                     {item.title}
                   </h4>
                </div>
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-500 pl-3.5 leading-relaxed">
                  {item.description}
                </p>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HallOfShamePage;
