
import React, { useState, useEffect } from 'react';
import { TabID } from '../App';
import { useSettings } from '../context/SettingsContext';

interface NavbarProps {
  activeTab: TabID;
  onTabChange: (tabId: TabID) => void;
  onSearchTrigger: () => void;
  onOpenSettings: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

interface Particle {
  id: number;
  tx: number;
  ty: number;
  size: number;
  color: string;
  duration: number;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange, onSearchTrigger, onOpenSettings, theme, onToggleTheme }) => {
  const { settings, getThemeColors } = useSettings();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPopping, setIsPopping] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const isHOF = activeTab === 'hall-of-fame';
  const isHome = activeTab === 'home';
  const colors = getThemeColors(isHOF);

  // Theme-aware colors derived from context
  const accentBg = colors.bg;
  const accentText = colors.text;
  const accentBorder = colors.border;
  const accentShadow = colors.shadow;

  const tabs: { name: TabID; label: string }[] = [
    { name: 'home', label: 'home' },
    { name: 'standings', label: 'standings' },
    { name: 'schedule', label: 'schedule' },
    { name: 'stats', label: 'stats' },
    { name: 'legacy', label: 'legacy' },
    { name: 'more', label: 'more' }
  ];

  const getParentTab = (tabId: TabID): TabID => {
    const parentMap: Partial<Record<TabID, TabID>> = {
      'partner-hub': 'more',
      'rules': 'more',
      'hall-of-fame': 'legacy',
      'league-history': 'legacy',
      'records': 'more',
      'credits': 'more',
      'unknown': 'more'
    };
    return parentMap[tabId] || tabId;
  };

  const handleTabClick = (tabId: TabID) => {
    onTabChange(tabId);
    setIsMenuOpen(false);
  };

  const triggerBurst = () => {
    setIsPopping(true);
    setTimeout(() => setIsPopping(false), 150);

    const count = 20 + Math.floor(Math.random() * 11); // 20-30 particles
    const newParticles: Particle[] = Array.from({ length: count }).map((_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const velocity = 80 + Math.random() * 120;
      return {
        id: Date.now() + i,
        tx: Math.cos(angle) * velocity,
        ty: Math.sin(angle) * velocity,
        size: 6 + Math.random() * 5, // 6-10px
        color: isHOF ? '#D4AF37' : (settings.rahBizzyTheme ? '#3B82F6' : (Math.random() > 0.3 ? '#D60A07' : (Math.random() > 0.5 ? '#E4E4E7' : '#FFFFFF'))),
        duration: 800 + Math.random() * 400 // 800-1200ms
      };
    });

    setParticles(prev => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.includes(p)));
    }, 1250);
  };

  const handleLogoClick = () => {
    if (isHome) {
      triggerBurst();
    } else {
      handleTabClick('home');
    }
  };

  const isTabActive = (tabName: TabID) => {
    return getParentTab(activeTab) === tabName;
  };

  // Sticky Logic
  const stickyClass = settings.stickyHeader ? 'fixed top-8' : 'absolute top-8';

  const backgroundClasses = isScrolled && settings.stickyHeader
    ? 'bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md'
    : 'bg-gradient-to-b from-white via-white/98 to-zinc-100/95 dark:from-zinc-950 dark:via-zinc-950/98 dark:to-zinc-900/95 backdrop-blur-2xl';

  return (
    <nav className={`${stickyClass} left-1/2 -translate-x-1/2 z-[80] w-full max-w-[1200px] px-6 transition-all duration-300`}>
      <div className="flex items-center gap-4 w-full">
        {/* Main Navbar Pill */}
        <div className={`
          flex-1 relative ${backgroundClasses} border ${accentBorder}
          rounded-full h-16 flex items-center justify-between px-8 shadow-[0_45px_100px_-15px_rgba(0,0,0,0.65)]
          transition-all duration-500
        `}>
          <div className="relative flex items-center justify-center">
            <button 
              onClick={handleLogoClick}
              className={`${accentText} text-2xl font-black tracking-tighter transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-110 active:scale-95 shrink-0 relative z-10 ${isPopping ? 'scale-105' : ''}`}
            >
              nbll
            </button>
            
            <div className="absolute inset-0 pointer-events-none overflow-visible flex items-center justify-center">
              {particles.map(p => (
                <div 
                  key={p.id}
                  className="absolute rounded-full"
                  style={{
                    width: `${p.size}px`,
                    height: `${p.size}px`,
                    backgroundColor: p.color,
                    '--tx': `${p.tx}px`,
                    '--ty': `${p.ty}px`,
                    animation: `particle-burst ${p.duration}ms cubic-bezier(0.16, 1, 0.3, 1) forwards`
                  } as React.CSSProperties}
                />
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4 lg:gap-8 flex-1 justify-center px-4">
            {tabs.map((tab) => {
              const active = isTabActive(tab.name);
              return (
                <button
                  key={tab.name}
                  onClick={() => handleTabClick(tab.name)}
                  className={`
                    text-sm font-bold transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105 active:scale-95 tracking-wide whitespace-nowrap relative py-1
                    ${active ? accentText : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'}
                  `}
                >
                  {tab.label}
                  {active && (
                    <span className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 ${accentBg} rounded-full animate-pulse`} />
                  )}
                </button>
              );
            })}
          </div>

          <div className="hidden md:flex items-center shrink-0 gap-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>

            {/* Search Button */}
            <div 
              onClick={onSearchTrigger}
              className={`group relative ${accentBg} rounded-full flex items-center gap-2 px-3 py-1.5 cursor-pointer transition-all duration-500 hover:scale-105 active:scale-95 ${accentShadow}`}
            >
              <svg 
                className="w-3.5 h-3.5 text-white" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="3.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input 
                type="text" 
                readOnly 
                placeholder="search" 
                className="bg-transparent border-none outline-none text-white text-[11px] font-black placeholder-white/90 w-12 cursor-pointer"
              />
            </div>
          </div>

          {/* Mobile Buttons Container */}
          <div className="flex md:hidden flex-1 justify-end items-center gap-3">
            {/* Theme Toggle */}
            <button 
              onClick={onToggleTheme}
              className="w-10 h-10 flex items-center justify-center rounded-full text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
            
            {/* Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`w-10 h-10 flex items-center justify-center rounded-full ${accentText} hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all active:scale-90`}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              ) : (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" y1="8" x2="20" y2="8"></line>
                  <line x1="4" y1="16" x2="20" y2="16"></line>
                </svg>
              )}
            </button>
          </div>

          <div className={`
            absolute top-20 left-0 right-0 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-3xl border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-6 shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden
            ${isMenuOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-16 scale-[0.9] pointer-events-none'}
          `}>
            <div className="flex flex-col gap-2">
              {tabs.map((tab) => {
                const active = isTabActive(tab.name);
                return (
                  <button
                    key={tab.name}
                    onClick={() => handleTabClick(tab.name)}
                    className={`
                      text-lg font-bold transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] tracking-wide py-4 px-8 rounded-2xl flex items-center justify-between
                      ${active 
                        ? `text-white ${accentBg} shadow-xl scale-[1.03]` 
                        : `${accentText} hover:bg-zinc-50 dark:hover:bg-zinc-900`
                      }
                    `}
                  >
                    {tab.label}
                    {active && (
                      <svg className="w-6 h-6 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Settings Button - Desktop Only (Outside Pill, Inside Nav Container) */}
        <button 
          onClick={onOpenSettings}
          className="hidden lg:flex items-center justify-center w-12 h-12 rounded-full shadow-sm border transition-all duration-300 active:scale-95
            bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md 
            text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 
            hover:bg-white dark:hover:bg-zinc-900 hover:text-zinc-800 dark:hover:text-zinc-200"
          aria-label="Settings"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
             <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
             <circle cx="12" cy="12" r="3"></circle>
          </svg>
        </button>
      </div>
      
      <style>{`
        @keyframes particle-burst {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(var(--tx), var(--ty)) scale(0.2);
            opacity: 0;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
