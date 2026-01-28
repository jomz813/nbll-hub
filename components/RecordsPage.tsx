
import React, { useRef } from 'react';
import { recordsData } from '../data/records';
import { useSettings } from '../context/SettingsContext';

const RecordsPage: React.FC = () => {
  const { settings } = useSettings();
  
  // Custom scroll target refs
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const scrollToSection = (id: string) => {
    const el = sectionRefs.current[id];
    if (el) {
      const yOffset = -140; // Adjust for fixed navbar + chips
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const accentRed = '#D60A07';

  return (
    <div className="animate-page-enter pt-4 space-y-12">
      {/* Top Segmented Navigation (Sticky) - DESKTOP ONLY */}
      <div className="hidden md:block sticky top-28 z-40 -mx-4 md:mx-0 overflow-x-auto no-scrollbar py-2 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
        <div className="flex items-center gap-2 px-4 md:px-0 min-w-max">
          {recordsData.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`
                px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest border transition-all duration-300
                border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-600
                focus:outline-none focus:ring-2 focus:ring-current/20 active:scale-95
              `}
              style={{ '--tw-ring-color': settings.rahBizzyTheme ? '#3B82F6' : '#D60A07' } as React.CSSProperties}
            >
              {section.id === 'career-adv' 
                ? 'CAREER+' 
                : section.id === 'season-avgs' 
                  ? 'SEASON+' 
                  : section.id.split('-')[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-16 pb-12">
        {recordsData.map((section) => (
          <div 
            key={section.id} 
            ref={(el) => { sectionRefs.current[section.id] = el; }}
            className="space-y-4 md:space-y-6 scroll-mt-40"
          >
            {/* Section Header - Kept As-Is Per Instructions */}
            <div className="flex items-center gap-4">
               <h3 className="text-xl md:text-2xl font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tight">
                 {section.title}
               </h3>
               <div className="h-px bg-zinc-100 dark:bg-zinc-800 flex-1" />
            </div>

            {/* Records List (No Cards) */}
            <div className="flex flex-col">
              {section.items.map((record) => {
                return (
                  <div 
                    key={record.id}
                    className="group py-5 md:py-6 border-b border-zinc-100 dark:border-zinc-800/60 last:border-0"
                  >
                    {/* Grid Layout: Name | Value | Holder */}
                    <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1.2fr] items-center gap-2 md:gap-8">
                      
                      {/* Left: Record Title (Mobile Line 1 Left) */}
                      <div className="flex items-center justify-between md:block">
                        <span className="text-base font-medium text-zinc-900 dark:text-zinc-100 leading-tight">
                          {record.title}
                        </span>
                        
                        {/* Mobile: Value displayed on right of Line 1 */}
                        <div className="flex md:hidden items-baseline gap-1.5 text-right">
                          <span className="text-xl font-black text-[#D60A07] tabular-nums">
                            {record.value}
                          </span>
                          <span className="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                            {record.valueLabel}
                          </span>
                        </div>
                      </div>

                      {/* Center: Value Block (Desktop Only) */}
                      <div className="hidden md:flex flex-col items-center justify-center">
                        <span className="text-4xl font-black text-[#D60A07] tabular-nums tracking-tighter leading-none">
                          {record.value}
                        </span>
                        <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-[0.2em] mt-1.5">
                          {record.valueLabel}
                        </span>
                      </div>

                      {/* Right: Holder Block (Mobile Line 2) */}
                      <div className="flex items-center md:items-end md:flex-col gap-2 md:gap-0 mt-1 md:mt-0">
                        {/* Label */}
                        <span className="text-[9px] font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-widest leading-none">
                          Holder
                        </span>
                        
                        {/* Holder Name + Context */}
                        <div className="flex items-center md:items-end flex-wrap gap-x-2">
                          <span className="text-sm md:text-base font-medium text-zinc-800 dark:text-zinc-200 leading-none">
                            {record.holder}
                          </span>
                          
                          {/* Minimal Context Label */}
                          {(record.context && record.context !== '—') && (
                            <span className="text-[10px] font-bold text-[#D60A07] lowercase opacity-80 md:mt-1">
                              • {record.context}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecordsPage;
