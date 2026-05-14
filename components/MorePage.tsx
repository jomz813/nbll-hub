
import React, { useState } from 'react';
import { TabItem } from '../data/content';

interface MorePageProps {
  items: TabItem[];
  onItemClick: (label: string) => void;
  accentText: string;
  accentBgSoft: string;
  accentShadow: string;
}

const COMING_SOON_LABELS: string[] = [];

const MorePage: React.FC<MorePageProps> = ({ items, onItemClick, accentText, accentBgSoft, accentShadow }) => {
  const [easterEggIndex, setEasterEggIndex] = useState(0);

  const easterEggMessages = [
    "carefully created by jomz",
    "pansho is the goat",
    "1luv has so much aura",
    "drexel is so tuff and veiny",
    "jeffrey epstein is coming for you"
  ];

  const [bannerError, setBannerError] = useState(false);

  const renderCard = (item: TabItem, idx: number) => {
    const isComingSoon = COMING_SOON_LABELS.includes(item.label.toLowerCase());
    
    return (
      <button 
        key={idx}
        onClick={() => !isComingSoon && onItemClick(item.label)}
        disabled={isComingSoon}
        className={`
          group pt-6 pb-6 px-8 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2rem] text-left transition-all duration-500 
          ${isComingSoon 
            ? 'cursor-not-allowed opacity-50' 
            : `hover:shadow-2xl hover:-translate-y-1 ${accentShadow} cursor-pointer`
          } w-full flex flex-col gap-4 h-full min-h-[130px]
        `}
      >
        <div className="space-y-1">
          <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tighter group-hover:translate-x-1 transition-transform">
            {item.label.toLowerCase()}
          </h3>
        </div>
        
        <div className="flex items-center justify-between mt-auto">
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300 dark:text-zinc-600">
            {isComingSoon ? 'coming soon' : 'view section'}
          </span>
          <div className={`w-8 h-8 rounded-full ${isComingSoon ? 'bg-zinc-100 dark:bg-zinc-800' : accentBgSoft} flex items-center justify-center ${!isComingSoon ? 'group-hover:scale-110 transition-transform' : ''}`}>
            <svg className={`w-4 h-4 ${isComingSoon ? 'text-zinc-300 dark:text-zinc-600' : accentText}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {items.map((item, idx) => renderCard(item, idx))}
      </div>

      <div className="mt-8 mb-4 w-full">
        <div className="w-full rounded-2xl md:rounded-[2rem] overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 relative" style={{ aspectRatio: '2844/532' }}>
          {!bannerError ? (
            <img 
              src="/hof/banner.png" 
              alt="More Banner" 
              className="absolute inset-0 w-full h-full object-contain"
              onError={() => setBannerError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
              <span className="text-[10px] md:text-xs font-black text-zinc-500 uppercase tracking-widest">
                Banner
              </span>
            </div>
          )}
        </div>
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
