
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';
import AllTimeStatsTable from './AllTimeStatsTable';
import S11StatsTable from './S11StatsTable';
import S10StatsTable from './S10StatsTable';
import S12StatsTable from './S12StatsTable';

const SEASONS = ['s10', 's11', 's12', 'all-time'] as const;
type Season = typeof SEASONS[number];

const StatsPage: React.FC = () => {
  const { settings, getThemeColors } = useSettings();
  const colors = getThemeColors();
  const accentBg = colors.bg;
  const accentText = colors.text;

  const [season, setSeason] = useState<Season>('s12');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Load selection from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const s = params.get('season') as Season;
    if (SEASONS.includes(s)) {
      setSeason(s);
    }
  }, []);

  const handleSeasonChange = (s: Season) => {
    setSeason(s);
    const url = new URL(window.location.href);
    url.searchParams.set('season', s);
    window.history.replaceState({}, '', url);
  };

  const toggleSearch = () => {
    if (isSearchOpen) {
      setSearchQuery('');
      setIsSearchOpen(false);
    } else {
      setIsSearchOpen(true);
      // Keyboard focus happens via effect
    }
  };

  const handleClearSearch = () => {
    if (searchQuery.length > 0) {
      setSearchQuery('');
      searchInputRef.current?.focus();
    } else {
      setIsSearchOpen(false);
    }
  };

  useEffect(() => {
    if (isSearchOpen) {
      searchInputRef.current?.focus();
    }
  }, [isSearchOpen]);

  const renderView = () => {
    const commonProps = { 
      season, 
      onSeasonChange: handleSeasonChange,
      searchQuery 
    };

    switch (season) {
      case 's10': return <S10StatsTable isEmbedded={true} {...commonProps} />;
      case 's11': return <S11StatsTable isEmbedded={true} {...commonProps} />;
      case 's12': return <S12StatsTable isEmbedded={true} {...commonProps} />;
      case 'all-time': return <AllTimeStatsTable {...commonProps} />;
      default: return <S12StatsTable isEmbedded={true} {...commonProps} />;
    }
  };

  return (
    <div className="relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 items-start">
        <div className="flex items-center justify-between w-full md:w-auto relative min-h-[4rem]">
          {/* Header Title - Fades out on mobile search */}
          <motion.h2 
            initial={false}
            animate={{ 
              opacity: isSearchOpen && window.innerWidth <= 768 ? 0 : 1,
              x: isSearchOpen && window.innerWidth <= 768 ? -20 : 0
            }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={`text-4xl md:text-6xl font-black tracking-tighter shrink-0 select-none pointer-events-none md:pointer-events-auto ${settings.rahBizzyTheme ? 'text-[#3B82F6]' : 'text-zinc-900 dark:text-white'}`}
          >
            player statistics
          </motion.h2>
          
          {/* Mobile Inline Search Bar / Button */}
          <div className="md:hidden absolute right-0 flex items-center justify-end">
            <motion.div 
              initial={false}
              animate={{ 
                width: isSearchOpen ? 'calc(100vw - 32px)' : '3rem',
              }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className={`flex items-center bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-full h-12 overflow-hidden shadow-sm`}
            >
              <button 
                onClick={() => !isSearchOpen && toggleSearch()}
                className={`flex-none w-12 h-12 flex items-center justify-center ${accentText}`}
                aria-label="Search players"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </button>

              <AnimatePresence>
                {isSearchOpen && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 flex items-center pr-2"
                  >
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onBlur={() => !searchQuery && setIsSearchOpen(false)}
                      placeholder="Search player..."
                      className="flex-1 bg-transparent border-none outline-none text-sm font-bold text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
                    />
                    <button 
                      onClick={handleClearSearch}
                      className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-zinc-600 active:scale-90 transition-all"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>

        {/* Season Selector - Hidden on mobile, visible on desktop */}
        <div 
          ref={containerRef}
          role="tablist"
          aria-label="Select season"
          className="
            hidden md:inline-flex items-center bg-zinc-100 dark:bg-zinc-900 rounded-full p-1 shadow-inner border border-zinc-200/50 dark:border-zinc-800/50 overflow-hidden relative 
            h-auto p-1.5 -translate-y-1
          "
        >
          <div className="flex gap-1 h-full items-center no-scrollbar overflow-x-auto px-0.5">
            {SEASONS.map((s) => {
              const isActive = season === s;
              return (
                <button
                  key={s}
                  role="tab"
                  aria-selected={isActive}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => handleSeasonChange(s)}
                  className={`
                    relative flex-none rounded-full font-black uppercase tracking-widest transition-colors duration-300 whitespace-nowrap z-10
                    px-4 py-2 text-[10px]
                    ${isActive 
                      ? 'text-white' 
                      : 'text-zinc-400 dark:text-zinc-600 hover:text-zinc-900 dark:hover:text-zinc-300'
                    }
                  `}
                >
                  <span className="relative z-20">{s}</span>
                  {isActive && (
                    <motion.div
                      layoutId="active-pill"
                      className={`absolute inset-0 ${accentBg} rounded-full shadow-md z-10`}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 35,
                        mass: 0.6
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="animate-page-enter">
        <AnimatePresence mode="wait">
          <motion.div
            key={season}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default StatsPage;
