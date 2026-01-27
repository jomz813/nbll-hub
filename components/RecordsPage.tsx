import React, { useRef } from 'react';
import { recordsData } from '../data/records';
import { useSettings } from '../context/SettingsContext';

const RecordsPage: React.FC = () => {
  const { settings, getThemeColors } = useSettings();
  const colors = getThemeColors();
  
  const accentText = colors.text;
  const accentBgSoft = colors.bgSoft;
  const valueColorClass = colors.text;

  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const scrollToSection = (id: string) => {
    const el = sectionRefs.current[id];
    if (el) {
      const yOffset = -140; // Adjust for fixed navbar + chips
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

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
            className="space-y-6 md:space-y-8 scroll-mt-40"
          >
            {/* Section Header */}
            <div className="flex items-center gap-4">
               <div className={`p-2 rounded-xl ${accentBgSoft} ${accentText}`}>
                 {section.icon}
               </div>
               <h3 className="text-xl md:text-2xl font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tight">
                 {section.title}
               </h3>
               <div className="h-px bg-zinc-100 dark:bg-zinc-800 flex-1" />
            </div>

            {/* Records Grid */}
            <div className="grid grid-cols-1 gap-3 md:gap-4">
              {section.items.map((record) => {
                return (
                  <React.Fragment key={record.id}>
                    {/* MOBILE CARD (Compact) */}
                    <div className="flex md:hidden flex-col bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-5 gap-4 active:scale-[0.98] transition-transform">
                      {/* Top: Icon + Title */}
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700/50 flex items-center justify-center shrink-0">
                            <div className={`w-1 h-1 rounded-full ${settings.rahBizzyTheme ? 'bg-[#3B82F6]' : 'bg-[#D60A07]'}`} />
                        </div>
                        <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 leading-snug">
                          {record.title}
                        </span>
                      </div>

                      {/* Bottom: Value + Holder */}
                      <div className="flex items-end justify-between pl-11">
                        {/* Value */}
                        <div className="flex flex-col">
                           <span className={`text-3xl font-black ${valueColorClass} tabular-nums tracking-tighter leading-none`}>
                             {record.value}
                           </span>
                           <span className="text-[9px] font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mt-1">
                             {record.valueLabel}
                           </span>
                        </div>

                        {/* Holder */}
                        <div className="flex flex-col items-end text-right">
                           <span className="text-[8px] font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-0.5">Holder</span>
                           <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                             {record.holder}
                           </span>
                           {record.context && record.context !== '—' && (
                             <span className={`text-[9px] font-bold ${accentText} mt-0.5 lowercase tracking-wide`}>
                               {record.context}
                             </span>
                           )}
                        </div>
                      </div>
                    </div>

                    {/* DESKTOP CARD (Original) */}
                    <div 
                      className="hidden md:flex group relative flex-col md:flex-row items-stretch md:items-center bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2rem] p-6 gap-6 md:gap-10 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-current/20"
                      style={{ '--tw-border-opacity': '0.2' } as React.CSSProperties}
                    >
                      {/* Left: Title */}
                      <div className="flex items-center gap-4 md:w-1/3">
                        <div className="w-10 h-10 rounded-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700/50 flex items-center justify-center shrink-0">
                           <div className={`w-1.5 h-1.5 rounded-full ${settings.rahBizzyTheme ? 'bg-[#3B82F6]' : 'bg-[#D60A07]'} group-hover:scale-125 transition-transform`} />
                        </div>
                        <span className="text-sm md:text-base font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                          {record.title}
                        </span>
                      </div>

                      {/* Middle: Value Placeholder */}
                      <div className="flex-1 flex flex-col md:items-center justify-center border-l-2 md:border-l border-zinc-50 dark:border-zinc-800 pl-6 md:pl-0 md:border-x">
                        <span className={`text-4xl md:text-5xl font-black ${valueColorClass} tabular-nums tracking-tighter`}>
                          {record.value}
                        </span>
                        <span className="text-[9px] font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-[0.2em] mt-1">
                          {record.valueLabel}
                        </span>
                      </div>

                      {/* Right: Leader Placeholder */}
                      <div className="flex flex-col gap-2 md:w-1/4 text-right md:text-right">
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-1">Holder</span>
                          <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                            {record.holder}
                          </span>
                        </div>
                        {(record.context || record.team) && (
                          <div className="flex items-center justify-end gap-3 text-xs font-medium text-zinc-500 dark:text-zinc-500">
                             {record.team && <span>{record.team}</span>}
                             {record.team && record.context && <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />}
                             {record.context && (
                               <span className={record.context.includes('2x') ? `${accentText} font-bold lowercase` : ''}>
                                 {record.context}
                               </span>
                             )}
                          </div>
                        )}
                      </div>
                      
                      {/* Hover effect gradient */}
                      <div 
                        className="absolute inset-0 rounded-[2rem] bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-[0.02] pointer-events-none transition-opacity"
                        style={{ color: settings.rahBizzyTheme ? '#3B82F6' : '#D60A07' } as React.CSSProperties}
                      />
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      {/* Footer hint */}
      <div className="flex flex-col items-center justify-center gap-3 pb-12">
        <div className="flex items-center gap-2 opacity-50">
          <span className={`w-1.5 h-1.5 rounded-full ${settings.rahBizzyTheme ? 'bg-[#3B82F6]' : 'bg-[#D60A07]'} animate-pulse`} />
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            Records update periodically
          </span>
        </div>
        <div className={`px-4 py-1.5 rounded-full ${accentBgSoft} border ${settings.rahBizzyTheme ? 'border-[#3B82F6]/20' : 'border-[#D60A07]/10'} animate-page-enter`}>
          <span className={`text-[9px] font-black uppercase tracking-widest ${accentText}`}>
            as of season 12
          </span>
        </div>
      </div>
    </div>
  );
};

export default RecordsPage;