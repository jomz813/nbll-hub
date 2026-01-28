
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
                  {/* Category tag removed as requested */}
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
    </div>
  );
};

export default LegacyPage;
