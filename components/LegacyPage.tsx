
import React from 'react';
import { TabItem } from '../data/content';

interface LegacyPageProps {
  items: TabItem[];
  onItemClick: (label: string) => void;
}

const LegacyPage: React.FC<LegacyPageProps> = ({ items, onItemClick }) => {
  return (
    <div className="space-y-16 animate-page-enter">
      {/* Section 1: Quick Navigation */}
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item, idx) => (
            <button 
              key={idx} 
              onClick={() => onItemClick(item.label)}
              className={`
                group p-8 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2rem] text-left transition-all duration-500 
                hover:shadow-2xl hover:-translate-y-1 hover:shadow-[0_10px_40px_var(--accent-shadow)] w-full
              `}
            >
              <div className="flex flex-col h-full justify-between gap-8">
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-60 transition-colors" style={{ color: 'var(--accent)' }}>
                    {item.category}
                  </span>
                  <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tighter group-hover:translate-x-1 transition-transform">
                    {item.label.toLowerCase()}
                  </h3>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300 dark:text-zinc-600">view section</span>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform bg-[var(--accent-soft)] dark:bg-[var(--accent-soft-dark)]">
                    <svg className="w-4 h-4" style={{ color: 'var(--accent)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Section 2: Legacy Sheet */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-px bg-zinc-200 dark:bg-zinc-800 flex-1" />
          <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tight text-center">Legacy Sheet</h3>
          <div className="h-px bg-zinc-200 dark:bg-zinc-800 flex-1" />
        </div>
        <div className="w-full rounded-[2.5rem] overflow-hidden border border-zinc-100 dark:border-zinc-800 shadow-xl bg-zinc-50 dark:bg-zinc-900 relative aspect-[4/5] md:aspect-video lg:h-[700px] transition-all duration-500 hover:shadow-2xl">
           <div className="absolute inset-0 flex items-center justify-center flex-col gap-4 text-center p-8">
              <div className="w-16 h-16 bg-zinc-200/50 dark:bg-zinc-800/50 rounded-2xl flex items-center justify-center mb-2">
                 <svg className="w-8 h-8 text-zinc-300 dark:text-zinc-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                 </svg>
              </div>
              <span className="text-lg font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Google Sheets Embed (Coming Soon)</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default LegacyPage;
