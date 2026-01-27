
import React, { useState } from 'react';
import { TabItem } from '../data/content';

interface MorePageProps {
  items: TabItem[];
  onItemClick: (label: string) => void;
  accentText: string;
  accentBgSoft: string;
  accentShadow: string;
}

const MorePage: React.FC<MorePageProps> = ({ items, onItemClick, accentText, accentBgSoft, accentShadow }) => {
  const [easterEggIndex, setEasterEggIndex] = useState(0);

  const easterEggMessages = [
    "carefully created by jomz",
    "pansho is the goat",
    "1luv has so much aura",
    "drexel is so tuff and veiny",
    "jeffrey epstein is coming for you"
  ];

  const renderCard = (item: TabItem, idx: number) => {
    const isPlaceholder = item.label === 'n/a';
    
    return (
      <button 
        key={idx}
        onClick={() => !isPlaceholder && onItemClick(item.label)}
        disabled={isPlaceholder}
        className={`
          group p-8 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2rem] text-left transition-all duration-500 
          ${isPlaceholder 
            ? 'cursor-default opacity-50' 
            : `hover:shadow-2xl hover:-translate-y-1 ${accentShadow} cursor-pointer`
          } w-full flex flex-col justify-between gap-8 h-full min-h-[220px]
        `}
      >
        <div className="space-y-2">
          {item.category && (
            <span className={`text-[10px] font-black uppercase tracking-widest ${accentText} opacity-60`}>
              {item.category}
            </span>
          )}
          <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tighter group-hover:translate-x-1 transition-transform">
            {item.label.toLowerCase()}
          </h3>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300 dark:text-zinc-600">
            {isPlaceholder ? '—' : 'view section'}
          </span>
          <div className={`w-8 h-8 rounded-full ${isPlaceholder ? 'bg-zinc-100 dark:bg-zinc-800' : accentBgSoft} flex items-center justify-center ${!isPlaceholder ? 'group-hover:scale-110 transition-transform' : ''}`}>
            <svg className={`w-4 h-4 ${isPlaceholder ? 'text-zinc-300 dark:text-zinc-600' : accentText}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className="animate-page-enter">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {items.map((item, idx) => renderCard(item, idx))}
      </div>

      <div className="pt-20 pb-8 text-center">
        <button 
          onClick={() => setEasterEggIndex(prev => (prev + 1) % easterEggMessages.length)}
          className="text-[11px] text-zinc-400 dark:text-zinc-600 font-medium lowercase tracking-wide select-none outline-none transition-colors hover:text-zinc-500 dark:hover:text-zinc-500 cursor-pointer active:scale-95 duration-200 block mx-auto"
        >
          <span key={easterEggIndex} className="inline-block animate-easter-egg">
            {easterEggMessages[easterEggIndex]}
          </span>
        </button>
      </div>
    </div>
  );
};

export default MorePage;
