import React, { useEffect, useState, useMemo, useRef } from 'react';
import FluidBackground from './FluidBackground';
import { TabID } from '../App';
import { useSettings } from '../context/SettingsContext';

interface LandingPageProps {
  onSearchTrigger: () => void;
  onTabChange: (tabId: TabID) => void;
}

const HERO_TITLES = [
  "nah drexel is so strong and veiny rn",
  "pansho is lowkey moving different today",
  "$5 to sleep on call with punkmonk monday - friday",
  "rahbizzy is the greatest jumpstealer of all time",
  "qotd: who has the most aura? answer: blixer",
  "dm cola for sinful freaky pics and vids",
  "i think it's safe to say we all have a crush on coves",
  "why is polar the main character of basketball legends",
];

const RahBizzyCoins: React.FC<{ reducedMotion: boolean }> = ({ reducedMotion }) => {
  const coins = useMemo(() => {
    const count = reducedMotion ? 3 : 18;
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 90 + 5}%`, // 5% to 95%
      size: `${Math.random() * 20 + 12}px`, // 12px to 32px
      duration: `${Math.random() * 15 + 10}s`, // 10s to 25s
      delay: `-${Math.random() * 25}s`, // Negative delay to start mid-animation
      sway: `${Math.random() * 100 - 50}px`, // -50px to 50px sway
      topStatic: `${Math.random() * 60 + 20}%` // For reduced motion
    }));
  }, [reducedMotion]);

  return (
    <div className="absolute inset-0 pointer-events-none z-[5] overflow-hidden">
      {coins.map((coin) => (
        <div
          key={coin.id}
          className={`
            absolute rounded-full bg-gradient-to-br from-[#FFD700] to-[#B8860B] 
            shadow-[0_0_15px_rgba(255,215,0,0.4)] border border-[#FFD700]/30
            ${reducedMotion ? 'opacity-20' : 'animate-coin-float opacity-0'}
          `}
          style={{
            left: coin.left,
            width: coin.size,
            height: coin.size,
            // If reduced motion, use static top/bottom. If animation, bottom starts at -10%
            top: reducedMotion ? coin.topStatic : undefined,
            bottom: reducedMotion ? undefined : '-10%',
            animationDuration: coin.duration,
            animationDelay: coin.delay,
            '--sway': coin.sway
          } as React.CSSProperties}
        />
      ))}
      <style>{`
        @keyframes coin-float {
          0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.25; }
          90% { opacity: 0.25; }
          100% { transform: translateY(-120vh) translateX(var(--sway)) rotate(360deg); opacity: 0; }
        }
        .animate-coin-float {
          animation: coin-float linear infinite;
        }
      `}</style>
    </div>
  );
};

const FakeCheckoutOverlay: React.FC<{ 
  onClose: () => void; 
  colors: any; 
  reducedMotion: boolean; 
}> = ({ onClose, colors, reducedMotion }) => {
  const [qty, setQty] = useState(1);
  const [showJoke, setShowJoke] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Only focus if not mobile to prevent keyboard pop-up on hidden input
    if (nameInputRef.current && window.innerWidth >= 640) {
      nameInputRef.current.focus();
    }
  }, []);

  const total = (qty * 5).toFixed(2);
  const accentBg = colors.bg; 

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setShowJoke(true);
  };

  return (
    <div 
      className="fixed inset-0 z-[90] flex items-center justify-center p-4"
      onClick={(e) => { e.stopPropagation(); onClose(); }}
      role="dialog"
      aria-label="Mock Checkout"
    >
      <div 
        className={`
          relative 
          w-full max-w-[min(1100px,calc(100vw-64px))]
          bg-white dark:bg-zinc-950 
          border border-zinc-200 dark:border-zinc-800 
          rounded-2xl shadow-2xl 
          flex flex-col text-left
          overflow-hidden
          ${reducedMotion ? 'animate-fade-in-fast' : 'animate-scale-up-center'}
        `}
        style={{ maxHeight: 'calc(100vh - 160px)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="shrink-0 px-5 py-3 md:px-6 md:py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50 backdrop-blur-sm">
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">Checkout</h3>
            <p className="text-[10px] font-medium text-zinc-500">Secure Payment • PunkMonk Services</p>
          </div>
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClose(); }}
            className="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Content Body - No Scrollbars, Compact Layout */}
        <form onSubmit={handlePay} className="p-5 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            
            {/* LEFT COLUMN */}
            <div className="flex flex-col gap-5 md:gap-6 justify-center">
                {/* Product */}
                <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-xl p-4 border border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="w-full text-left">
                            <h4 className="text-sm md:text-base font-bold text-zinc-900 dark:text-zinc-100 leading-tight">Sleep on call with punkmonk</h4>
                            <p className="text-[10px] md:text-xs text-zinc-500 mt-1">Schedule: Monday – Friday</p>
                        </div>
                        <div className="text-right shrink-0">
                            <span className="text-sm md:text-base font-bold text-zinc-900 dark:text-zinc-100">$5.00</span>
                        </div>
                    </div>
                    <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Quantity</label>
                        <div className="flex items-center gap-2">
                            <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} className="w-6 h-6 flex items-center justify-center rounded bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm hover:scale-105 active:scale-95 transition-transform text-zinc-700 dark:text-zinc-200 font-bold text-xs">-</button>
                            <span className="w-6 text-center font-bold text-sm text-zinc-900 dark:text-zinc-100 tabular-nums">{qty}</span>
                            <button type="button" onClick={() => setQty(qty + 1)} className="w-6 h-6 flex items-center justify-center rounded bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm hover:scale-105 active:scale-95 transition-transform text-zinc-700 dark:text-zinc-200 font-bold text-xs">+</button>
                        </div>
                    </div>
                </div>

                {/* Customer Fields - Hidden on mobile */}
                <div className="space-y-3 hidden sm:block">
                    <div className="space-y-1 w-full text-left">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider ml-1">Customer Info</label>
                        <input 
                            ref={nameInputRef}
                            type="text" 
                            placeholder="eg. Rah Bizzy" 
                            className="w-full px-3 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-200 dark:focus:ring-zinc-700 transition-all placeholder:text-zinc-400"
                        />
                    </div>
                    <input 
                        type="email" 
                        placeholder="pansho@freakyballs.com" 
                        className="w-full px-3 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-200 dark:focus:ring-zinc-700 transition-all placeholder:text-zinc-400"
                    />
                </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="flex flex-col gap-5 md:gap-6 justify-center border-t md:border-t-0 md:border-l border-zinc-100 dark:border-zinc-800 pt-5 md:pt-0 md:pl-10">
                {/* Payment */}
                <div className="space-y-3 w-full text-left">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider ml-1">Payment Method</label>
                    <div className="relative">
                        <input 
                            type="text" 
                            value="6767 6767 6767 6767" 
                            disabled 
                            className="w-full px-3 py-2.5 pl-10 bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-500 font-mono cursor-not-allowed select-none"
                        />
                        <svg className="absolute left-3 top-3 w-4 h-4 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <input type="text" placeholder="MM / YY" disabled className="w-full px-3 py-2.5 bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-400 font-mono cursor-not-allowed text-center" />
                        <input type="text" placeholder="CVC" disabled className="w-full px-3 py-2.5 bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-400 font-mono cursor-not-allowed text-center" />
                    </div>
                </div>

                {/* Summary */}
                <div className="space-y-2 pt-2 border-t border-dashed border-zinc-200 dark:border-zinc-800">
                    <div className="flex justify-between text-xs font-medium text-zinc-500">
                        <span>Subtotal</span>
                        <span>${total}</span>
                    </div>
                    <div className="flex justify-between text-xs font-medium text-zinc-500">
                        <span>Processing</span>
                        <span className="line-through opacity-50">$0.00</span>
                    </div>
                    <div className="flex justify-between text-base font-black text-zinc-900 dark:text-zinc-100 pt-1">
                        <span>Total</span>
                        <span>${total}</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="pt-2">
                    {showJoke ? (
                        <div className="w-full py-3 text-center bg-zinc-100 dark:bg-zinc-800 rounded-xl text-xs font-bold text-zinc-500 animate-pulse border border-zinc-200 dark:border-zinc-700">
                            completed! share this screen in punkmonk's dms to redeem!
                        </div>
                    ) : (
                        <button 
                            onClick={handlePay}
                            className={`w-full py-3 rounded-xl font-bold text-white shadow-lg shadow-black/5 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${accentBg}`}
                        >
                            <span>Pay ${total}</span>
                        </button>
                    )}
                    <button 
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClose(); }}
                        className="w-full py-2 mt-2 text-[10px] md:text-xs font-bold text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors uppercase tracking-widest"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </form>
      </div>
    </div>
  );
};

const LandingPage: React.FC<LandingPageProps> = ({ onSearchTrigger, onTabChange }) => {
  const { settings, getThemeColors } = useSettings();
  const themeColors = getThemeColors();
  
  // Randomly select title on initial render
  const [heroTitle] = useState(() => {
    const randomIndex = Math.floor(Math.random() * HERO_TITLES.length);
    return HERO_TITLES[randomIndex];
  });

  // PunkMonk Easter Egg Logic
  const TARGET_TITLE = "$5 to sleep on call with punkmonk monday - friday";
  const isPunkMonkTarget = heroTitle === TARGET_TITLE;
  const [isPunkMonkActive, setIsPunkMonkActive] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!isPunkMonkActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsPunkMonkActive(false);
        // Restore focus to title on escape
        requestAnimationFrame(() => titleRef.current?.focus());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPunkMonkActive]);

  // Lock scroll on Home page
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="relative h-screen bg-black selection:bg-[#D60A07] selection:text-white overflow-hidden">
      <FluidBackground />
      
      {/* RahBizzy Special Theme Decor */}
      {settings.rahBizzyTheme && <RahBizzyCoins reducedMotion={settings.reducedMotion} />}

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
        <div className="max-w-5xl space-y-10 animate-fade-in-up">
          {/* Main Headline Group */}
          <div className="space-y-3 relative group">
            
            {/* Easter Egg Overlay Panel */}
            {isPunkMonkActive && (
               <FakeCheckoutOverlay 
                 onClose={() => setIsPunkMonkActive(false)}
                 colors={themeColors}
                 reducedMotion={settings.reducedMotion}
               />
            )}

            <h1 
              ref={titleRef}
              onClick={isPunkMonkTarget ? (e) => { e.stopPropagation(); setIsPunkMonkActive(true); } : undefined}
              onKeyDown={isPunkMonkTarget ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsPunkMonkActive(true); } } : undefined}
              role={isPunkMonkTarget ? "button" : undefined}
              tabIndex={isPunkMonkTarget ? 0 : undefined}
              className={`
                text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight leading-[1.05] text-white 
                transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]
                ${isPunkMonkTarget 
                  ? 'cursor-pointer hover:scale-[1.01] hover:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-700/50 rounded-xl' 
                  : 'hover:scale-[1.01] hover:text-zinc-300 cursor-default select-none'
                }
                ${isPunkMonkActive ? 'opacity-0 pointer-events-none' : 'opacity-100'}
              `}
              aria-hidden={isPunkMonkActive}
            >
              {heroTitle}
            </h1>
          </div>

          {/* CTA Buttons Stack */}
          <div className="flex flex-col items-center gap-4 pt-6">
            {/* Join Discord Button */}
            <a
              href="https://discord.gg/nbll"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center justify-center gap-2.5 px-6 py-2.5 bg-white text-[#5865F2] border border-[#5865F2]/30 rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105 hover:border-[#5865F2] hover:shadow-[0_0_20px_rgba(88,101,242,0.2)] active:scale-95 no-underline overflow-hidden"
            >
              <div className="absolute inset-0 w-full h-full bg-[#5865F2]/0 group-hover:bg-[#5865F2]/5 transition-colors duration-500" />
              <svg className="w-5 h-5 fill-[#5865F2] relative z-10 transition-transform group-hover:rotate-6" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037 19.736 19.736 0 0 0-4.885 1.515.069.069 0 0 0-.032.027C.533 9.048-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.052-.102.001-.226-.112-.269a13.05 13.05 0 0 1-1.872-.894.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.29a.074.074 0 0 1 .077-.01c3.927 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .077.01c.12.098.246.196.373.29a.077.077 0 0 1-.007.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.11.27c.357.698.769 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.419 0 1.334-.956 2.419-2.157 2.419zm7.974 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.419 0 1.334-.946 2.419-2.157 2.419z"/>
              </svg>
              <span className="font-bold text-sm tracking-tight relative z-10 select-none">get started</span>
            </a>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        /* Easter Egg Animations */
        @keyframes scale-up-center {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-scale-up-center {
          animation: scale-up-center 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fade-in-fast {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in-fast {
          animation: fade-in-fast 0.2s ease-out forwards;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(161, 161, 170, 0.3);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
