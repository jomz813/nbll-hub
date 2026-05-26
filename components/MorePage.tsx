
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
    "with help from luminescent360",
    "and contributions from trinnysfriend",
    "special thanks to the founders -",
    "wary, alam, mir",
    "site sourced on github",
    "site hosted by netlify",
    "thank you!"

  ];

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

      <div className="flex justify-center pt-10 pb-1">
        <a 
          href="https://tally.so/r/A74X7y"
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2 rounded-full text-[11px] font-bold tracking-wide border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 w-auto inline-flex items-center justify-center"
        >
          <span>send a message to jomz</span>
        </a>
      </div>

      <div className="pt-3 pb-8 text-center">
        <button 
          onClick={() => setEasterEggIndex(prev => (prev + 1) % easterEggMessages.length)}
          className="text-[11px] text-zinc-400 dark:text-zinc-600 font-medium lowercase tracking-wide select-none outline-none transition-colors hover:text-zinc-500 dark:hover:text-zinc-500 cursor-pointer active:scale-95 duration-200 block mx-auto"
        >
          <span key={easterEggIndex} className="inline-block animate-easter-egg">
            {easterEggMessages[easterEggIndex]}
          </span>
        </button>
      </div>

      {/* Mobile-Only Scrolling Logos */}
      <div className="md:hidden w-full overflow-hidden bg-zinc-100/50 dark:bg-zinc-900/50 border-y border-zinc-200/50 dark:border-zinc-800/50 py-3 mb-8">
        <div className="flex w-[200%] animate-logo-marquee items-center justify-around text-zinc-400 dark:text-zinc-600 grayscale">
          {/* Group 1 */}
          <div className="flex w-1/2 justify-around items-center opacity-70">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><title>Discord</title><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/></svg>
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><title>GitHub</title><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><title>Adobe</title><path d="M15.1 2H24v20L15.1 2zM8.9 2H0v20L8.9 2zM12 9.4L17.6 22h-3.8l-1.6-4H8.1L12 9.4z"/></svg>
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><title>Replit</title><path d="M2.5 1.5A1.5 1.5 0 0 1 4 0h7.5a1.5 1.5 0 0 1 1.5 1.5V8H4A1.5 1.5 0 0 1 2.5 6.5v-5zM13 8h7.5A1.5 1.5 0 0 1 22 9.5v5a1.5 1.5 0 0 1-1.5 1.5H13V8zM2.5 17.5A1.5 1.5 0 0 1 4 16h9v6.5a1.5 1.5 0 0 1-1.5 1.5H4a1.5 1.5 0 0 1-1.5-1.5v-5z"/></svg>
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><title>YouTube</title><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><title>Google</title><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/></svg>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><title>Code</title><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
          </div>
          {/* Group 2 (Duplicate for infinite looping) */}
          <div className="flex w-1/2 justify-around items-center opacity-70">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><title>Discord</title><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/></svg>
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><title>GitHub</title><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><title>Adobe</title><path d="M15.1 2H24v20L15.1 2zM8.9 2H0v20L8.9 2zM12 9.4L17.6 22h-3.8l-1.6-4H8.1L12 9.4z"/></svg>
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><title>Replit</title><path d="M2.5 1.5A1.5 1.5 0 0 1 4 0h7.5a1.5 1.5 0 0 1 1.5 1.5V8H4A1.5 1.5 0 0 1 2.5 6.5v-5zM13 8h7.5A1.5 1.5 0 0 1 22 9.5v5a1.5 1.5 0 0 1-1.5 1.5H13V8zM2.5 17.5A1.5 1.5 0 0 1 4 16h9v6.5a1.5 1.5 0 0 1-1.5 1.5H4a1.5 1.5 0 0 1-1.5-1.5v-5z"/></svg>
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><title>YouTube</title><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><title>Google</title><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/></svg>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><title>Code</title><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes logo-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: no-preference) {
          .animate-logo-marquee {
            animation: logo-marquee 15s linear infinite;
          }
        }
      `}</style>
    </div>
  );
};

export default MorePage;
