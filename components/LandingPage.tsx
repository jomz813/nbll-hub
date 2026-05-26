import React, { useEffect, useState, useMemo } from 'react';
import FluidBackground from './FluidBackground';
import { TabID } from '../App';
import { useSettings } from '../context/SettingsContext';

const HERO_TITLES = [
  "use the desktop site for a better experience",
  "we are aware of a mobile navbar bug",
  "use the tab key to cycle through tabs",
  "konjure is the only qb to 4-peat",
  "static played 15 seasons just to not be in the hof",
  "rah is the fastest player to reach the hof",
  "ben is the best qb to not win a ring or reach the hof",
  "breezy has the best sb record at 4-0",
  "mirmir has the most rings with 5",
  "scalphunter has most all-time passing yards and tds",
  "jalen is the only decent qb to come from 7v7",
  "wary has the most all-time tds and rec yards",
  "rino has the most all-time sacks and safeties",
  "silver and alam have the most koty awards with 2 each",
  "twizzy is the best player in ufl that hasn't reached the hof",
  "the saints are the most dominant franchise of all time",
  "the best wr of all time is st breezy",
  "rah is the only wr to 4-peat",
];

const pickRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

const RahBizzyCoins: React.FC<{ reducedMotion: boolean }> = ({ reducedMotion }) => {
  const coins = useMemo(() => {
    const count = reducedMotion ? 3 : 18;
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 90 + 5}%`,
      size: `${Math.random() * 20 + 12}px`,
      duration: `${Math.random() * 15 + 10}s`,
      delay: `-${Math.random() * 25}s`,
      sway: `${Math.random() * 100 - 50}px`,
      topStatic: `${Math.random() * 60 + 20}%`
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

interface LandingPageProps {
  onSearchTrigger: () => void;
  onTabChange: (tabId: TabID) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onSearchTrigger, onTabChange }) => {
  const { settings } = useSettings();
  
  // Mobile detection
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const currentPool = useMemo(() => {
    const mobileOnly = [
      "use the desktop site for a better experience",
      "we are aware of a mobile navbar bug"
    ];
    if (isMobile) {
      return HERO_TITLES;
    } else {
      return HERO_TITLES.filter(title => !mobileOnly.includes(title));
    }
  }, [isMobile]);

  // Use random selection for the initial title, excluding those two on desktop/initial render
  const [heroTitle, setHeroTitle] = useState(() => {
    const mobileOnly = [
      "use the desktop site for a better experience",
      "we are aware of a mobile navbar bug"
    ];
    const initialPool = HERO_TITLES.filter(title => !mobileOnly.includes(title));
    return pickRandom(initialPool);
  });

  // Ensure title is switched if we transition from mobile -> desktop and have a mobile-only title
  useEffect(() => {
    if (!currentPool.includes(heroTitle)) {
      setHeroTitle(pickRandom(currentPool));
    }
  }, [currentPool, heroTitle]);

  // Title rotation interval - ensures the page feels alive
  useEffect(() => {
    const rotationInterval = setInterval(() => {
      const isMobileNow = window.innerWidth < 768;
      const mobileOnly = [
        "use the desktop site for a better experience",
        "we are aware of a mobile navbar bug"
      ];
      const pool = isMobileNow 
        ? HERO_TITLES 
        : HERO_TITLES.filter(title => !mobileOnly.includes(title));

      setHeroTitle((current) => {
        let next = pickRandom(pool);
        // Avoid repeating the same title if possible
        for (let attempt = 0; attempt < 10 && next === current && pool.length > 1; attempt++) {
          next = pickRandom(pool);
        }
        return next;
      });
    }, 10000); 

    return () => clearInterval(rotationInterval);
  }, []);

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
            <h1 
              key={heroTitle}
              className="font-medium tracking-tight text-white transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.01] hover:text-zinc-300 cursor-default select-none animate-title-fade text-5xl md:text-7xl lg:text-8xl leading-[1.05]"
            >
              {heroTitle}
            </h1>
          </div>

          {/* CTA Buttons Stack */}
          <div className="flex flex-col items-center gap-4 pt-6">
            <a
              href="https://discord.gg/ultimatefootball"
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
        @keyframes title-fade {
          from { opacity: 0; filter: blur(10px); }
          to { opacity: 1; filter: blur(0px); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-title-fade {
          animation: title-fade 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;