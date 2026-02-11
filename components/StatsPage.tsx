import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';
import AllTimeStatsTable from './AllTimeStatsTable';
import S11StatsTable from './S11StatsTable';
import S10StatsTable from './S10StatsTable';
import S12StatsTable from './S12StatsTable';

const SEASONS = ['s10', 's11', 's12', 'all-time'] as const;
type Season = typeof SEASONS[number];

const SORT_OPTIONS: Record<Season, { key: string; label: string }[]> = {
  's12': [
    { key: 'pts', label: 'PTS' }, { key: 'ast', label: 'AST' }, { key: 'reb', label: 'REB' }, { key: 'stl', label: 'STL' },
    { key: 'gp', label: 'GP' }, { key: 'ppg', label: 'PPG' }, { key: 'apg', label: 'APG' }, { key: 'rpg', label: 'RPG' },
    { key: 'spg', label: 'SPG' }, { key: 'eff', label: 'EFF' }
  ],
  's11': [
    { key: 'pts', label: 'PTS' }, { key: 'ast', label: 'AST' }, { key: 'reb', label: 'REB' }, { key: 'stl', label: 'STL' },
    { key: 'gp', label: 'GP' }, { key: 'ppg', label: 'PPG' }, { key: 'apg', label: 'APG' }, { key: 'rpg', label: 'RPG' },
    { key: 'spg', label: 'SPG' }, { key: 'eff', label: 'EFF' }
  ],
  's10': [
    { key: 'pts', label: 'PTS' }, { key: 'ast', label: 'AST' }, { key: 'reb', label: 'REB' }, { key: 'stl', label: 'STL' },
    { key: 'gp', label: 'GP' }, { key: 'ppg', label: 'PPG' }, { key: 'apg', label: 'APG' }, { key: 'rpg', label: 'RPG' },
    { key: 'spg', label: 'SPG' }, { key: 'eff', label: 'EFF' }
  ],
  'all-time': [
    { key: 'pts', label: 'PTS' }, { key: 'ast', label: 'AST' }, { key: 'reb', label: 'REB' }, { key: 'stl', label: 'STL' },
    { key: 'eff', label: 'EFF' }, { key: 'off', label: 'OFF' }, { key: 'def', label: 'DEF' }
  ]
};

const StatsPage: React.FC = () => {
  const { settings, getThemeColors } = useSettings();
  const colors = getThemeColors();
  const accentBg = colors.bg;
  const accentText = colors.text;

  const [season, setSeason] = useState<Season>('s12');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [sortKey, setSortKey] = useState('pts');
  
  // Refs
  const pillAreaRef = useRef<HTMLDivElement>(null);
  const mobileSearchContainerRef = useRef<HTMLDivElement>(null);
  const desktopSearchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);

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
    // Reset sort key if invalid for the new season
    const validKeys = SORT_OPTIONS[s].map(o => o.key);
    if (!validKeys.includes(sortKey)) {
      setSortKey('pts');
    }
    const url = new URL(window.location.href);
    url.searchParams.set('season', s);
    window.history.replaceState({}, '', url);
  };

  const openSearch = () => {
    setIsSearchOpen(true);
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  const toggleSearch = () => {
    if (isSearchOpen) {
      closeSearch();
    } else {
      openSearch();
    }
  };

  // Focus input when search opens
  useEffect(() => {
    if (isSearchOpen) {
      const timer = setTimeout(() => {
        if (window.innerWidth > 768) {
          desktopSearchInputRef.current?.focus();
        } else {
          mobileSearchInputRef.current?.focus();
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isSearchOpen]);

  // Handle Close conditions (ESC and Outside Click)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchOpen) {
        closeSearch();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const isInsidePillArea = pillAreaRef.current?.contains(target);
      const isInsideMobileSearch = mobileSearchContainerRef.current?.contains(target);

      if (isSearchOpen && !isInsidePillArea && !isInsideMobileSearch) {
        closeSearch();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchOpen]);

  const renderView = () => {
    const commonProps = { 
      season, 
      onSeasonChange: handleSeasonChange,
      searchQuery,
      externalSortKey: sortKey
    };

    switch (season) {
      case 's10': return <S10StatsTable isEmbedded={true} {...commonProps} />;
      case 's11': return <S11StatsTable isEmbedded={true} {...commonProps} />;
      case 's12': return <S12StatsTable isEmbedded={true} {...commonProps} />;
      case 'all-time': return <AllTimeStatsTable {...commonProps} />;
      default: return <S12StatsTable isEmbedded={true} {...commonProps} />;
    }
  };

  const DropdownIcon = () => (
    <svg className="w-3 h-3 text-zinc-400 dark:text-zinc-500 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );

  return (
    <div className="relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 md:mb-12 items-start">
        <div className="flex items-center justify-between w-full md:w-auto relative min-h-[4rem]">
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
          
          <div className="md:hidden absolute right-0 flex items-center justify-end">
            <motion.div 
              ref={mobileSearchContainerRef}
              initial={false}
              animate={{ 
                width: isSearchOpen ? 'calc(100vw - 32px)' : '3rem',
              }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className={`flex items-center bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-full h-12 overflow-hidden shadow-sm`}
              onClick={(e: React.MouseEvent<HTMLDivElement>) => isSearchOpen && e.stopPropagation()}
              onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => isSearchOpen && e.stopPropagation()}
            >
              <button 
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => { e.stopPropagation(); !isSearchOpen && toggleSearch(); }}
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
                      ref={mobileSearchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                      placeholder="Search player..."
                      className="flex-1 bg-transparent border-none outline-none text-sm font-bold text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
                    />
                    <button 
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => { e.stopPropagation(); setSearchQuery(''); setIsSearchOpen(false); }}
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

        {/* Desktop Controls Area */}
        <div className="hidden md:flex items-center justify-end h-11 relative shrink-0 -translate-y-1">
          <div className="relative flex items-center gap-2.5 h-full" ref={pillAreaRef}>
            <div className={`flex items-center gap-2.5 h-full transition-opacity duration-300 ${isSearchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
              <div role="tablist" aria-label="Select season" className="inline-flex items-center bg-zinc-100 dark:bg-zinc-900 rounded-full p-1.5 shadow-inner border border-zinc-200/50 dark:border-zinc-800/50 h-full shrink-0">
                <div className="flex gap-1 h-full items-center px-0.5">
                  {SEASONS.map((s) => {
                    const isActive = season === s;
                    return (
                      <button
                        key={s}
                        onClick={() => handleSeasonChange(s)}
                        className={`relative flex-none rounded-full font-black uppercase tracking-widest transition-colors duration-300 whitespace-nowrap z-10 px-4 py-2 text-[10px] ${isActive ? 'text-white' : 'text-zinc-400 dark:text-zinc-600 hover:text-zinc-900 dark:hover:text-zinc-300'}`}
                      >
                        <span className="relative z-20">{s}</span>
                        {isActive && (
                          <motion.div layoutId="stats-active-pill" className={`absolute inset-0 ${accentBg} rounded-full shadow-md z-10`} transition={{ type: "spring", stiffness: 500, damping: 35, mass: 0.6 }} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={openSearch}
                className={`w-11 h-11 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-center ${accentText} shadow-sm hover:bg-zinc-200 dark:hover:bg-zinc-800 active:scale-95 transition-all shrink-0`}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </button>
            </div>

            <AnimatePresence>
              {isSearchOpen && (
                <motion.div
                  initial={{ opacity: 0, scaleX: 0.8 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  exit={{ opacity: 0, scaleX: 0.8 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  style={{ transformOrigin: 'right center' }}
                  className="absolute inset-0 z-20 h-11 rounded-full border border-zinc-200/50 dark:border-zinc-800/50 flex items-center bg-zinc-100 dark:bg-zinc-900 shadow-inner overflow-hidden"
                >
                  <div className={`flex-none w-11 h-11 flex items-center justify-center ${accentText}`}>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  </div>
                  <div className="flex-1 flex items-center pr-3">
                    <input
                      ref={desktopSearchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                      placeholder="Search players..."
                      className="flex-1 bg-transparent border-none outline-none text-xs font-bold text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
                    />
                    <button onClick={closeSearch} className="w-7 h-7 flex items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-600 active:scale-90 transition-all">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Unified Mobile Controls Toolbar */}
        <div className="md:hidden w-full mb-3">
          <div className="w-full h-11 bg-zinc-100/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 rounded-full flex items-center overflow-hidden px-1 shadow-sm">
            {/* Season Selector */}
            <div className="relative flex-1 flex items-center px-4 h-full group justify-end">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 mr-auto shrink-0">SZN</span>
              <select 
                value={season} 
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleSeasonChange(e.target.value as Season)} 
                className="bg-transparent border-none text-xs font-black text-zinc-900 dark:text-zinc-100 outline-none appearance-none pr-4 relative z-10 text-right uppercase tracking-widest"
              >
                {SEASONS.map(s => <option key={s} value={s} className="dark:bg-zinc-900 dark:text-zinc-100">{s}</option>)}
              </select>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 group-hover:translate-y-[-40%] transition-transform">
                <DropdownIcon />
              </div>
            </div>
            
            <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800 shrink-0" />
            
            {/* Sort Selector */}
            <div className="relative flex-1 flex items-center px-4 h-full group justify-end">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 mr-auto shrink-0">SORT</span>
              <select 
                value={sortKey} 
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortKey(e.target.value)} 
                className="bg-transparent border-none text-xs font-black text-zinc-900 dark:text-zinc-100 outline-none appearance-none pr-4 relative z-10 text-right uppercase tracking-widest"
              >
                {SORT_OPTIONS[season].map(opt => (
                  <option key={opt.key} value={opt.key} className="dark:bg-zinc-900 dark:text-zinc-100">{opt.label}</option>
                ))}
              </select>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 group-hover:translate-y-[-40%] transition-transform">
                <DropdownIcon />
              </div>
            </div>
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