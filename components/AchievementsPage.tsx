import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchSeasonStats, PlayerStats, SeasonID } from '../data/statsFetcher';
import { fetchAwards, AwardsData } from '../data/awards';
import { generateAllTimeBadges, getTopBadgeEarners } from '../data/achievementsEngine';
import { useSettings } from '../context/SettingsContext';
import { Achievement, AchievementCategory } from '../data/achievements';

const DropdownIcon = () => (
  <svg className="w-3 h-3 text-zinc-400 dark:text-zinc-500 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const AchievementsPage: React.FC = () => {
  const { settings, getThemeColors } = useSettings();
  const colors = getThemeColors();
  const accentBg = colors.bg;
  const accentText = colors.text;

  const [loading, setLoading] = useState(false);
  const [players, setPlayers] = useState<PlayerStats[]>([]);
  const [awardsData, setAwardsData] = useState<AwardsData | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerStats | null>(null);

  // Refs for UI interactions
  const pillAreaRef = useRef<HTMLDivElement>(null);
  const desktopSearchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [stats, awards] = await Promise.all([
          fetchSeasonStats('all-time'),
          fetchAwards()
        ]);
        setPlayers(stats);
        setAwardsData(awards);
        
        // Update selected player data if they exist in the dataset
        if (selectedPlayer) {
          const match = stats.find(p => p.player.toLowerCase() === selectedPlayer.player.toLowerCase());
          setSelectedPlayer(match || null);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Dynamically generate the badge set (All-Time Only)
  const currentBadges = useMemo(() => {
    if (players.length === 0) return [];
    return generateAllTimeBadges(players);
  }, [players]);

  const filteredPlayers = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return players.filter(p => p.player.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 8);
  }, [searchQuery, players]);

  const playerAchievements = useMemo(() => {
    if (!selectedPlayer) return [];
    const awards = awardsData?.byPlayer[selectedPlayer.player.toLowerCase()];
    return currentBadges.map(ach => ({
      achievement: ach,
      isEarned: ach.check(selectedPlayer, awards)
    }));
  }, [selectedPlayer, awardsData, currentBadges]);

  const topEarners = useMemo(() => {
    if (loading || players.length === 0 || currentBadges.length === 0) return [];
    return getTopBadgeEarners(players, currentBadges, awardsData?.byPlayer);
  }, [players, awardsData, loading, currentBadges]);

  const handleSelectPlayer = (p: PlayerStats) => {
    setSelectedPlayer(p);
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  const handleRandomPlayer = () => {
    if (players.length === 0) return;
    const randomIdx = Math.floor(Math.random() * players.length);
    handleSelectPlayer(players[randomIdx]);
  };

  const handleClearPlayer = () => {
    setSelectedPlayer(null);
    setSearchQuery('');
    if (isSearchOpen) setIsSearchOpen(false);
  };

  // Keyboard and outside click handling for search
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (pillAreaRef.current && !pillAreaRef.current.contains(target) && 
          mobileSearchContainerRef.current && !mobileSearchContainerRef.current.contains(target)) {
        if (isSearchOpen) setIsSearchOpen(false);
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

  const categories = useMemo(() => {
    const cats = new Set<AchievementCategory>();
    currentBadges.forEach(b => cats.add(b.category));
    const sorted = Array.from(cats);
    const legacyIdx = sorted.indexOf('Legacy');
    if (legacyIdx > -1) {
      sorted.splice(legacyIdx, 1);
      sorted.push('Legacy');
    }
    return sorted;
  }, [currentBadges]);

  return (
    <div className="space-y-6 md:space-y-10 pb-20 animate-page-enter">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4 md:mb-12 items-start relative z-[60]">
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
            achievements
          </motion.h2>

          <div className="md:hidden absolute right-0 flex items-center justify-end">
            <div className="relative" ref={mobileSearchContainerRef}>
              <motion.div 
                initial={false}
                animate={{ width: isSearchOpen ? 'calc(100vw - 32px)' : '3rem' }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className={`flex items-center bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-full h-12 shadow-sm relative z-20 overflow-hidden`}
              >
                <button 
                  onClick={() => !isSearchOpen && setIsSearchOpen(true)} 
                  className={`flex-none w-12 h-12 flex items-center justify-center ${accentText}`}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                </button>
                <AnimatePresence>
                  {isSearchOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex items-center pr-2">
                      <input 
                        ref={mobileSearchInputRef}
                        type="text" 
                        value={searchQuery} 
                        onChange={(e) => setSearchQuery(e.target.value)} 
                        placeholder="Search player..." 
                        className="flex-1 bg-transparent border-none outline-none text-sm font-bold text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400" 
                      />
                      <button onClick={() => setIsSearchOpen(false)} className="w-8 h-8 flex items-center justify-center text-zinc-400">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              <AnimatePresence>
                {isSearchOpen && searchQuery.trim() && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full right-0 mt-3 w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl z-50 overflow-hidden"
                  >
                    <div className="max-h-[320px] overflow-y-auto no-scrollbar py-2">
                      {filteredPlayers.length > 0 ? filteredPlayers.map(p => (
                        <button key={p.player} onClick={() => handleSelectPlayer(p)} className="w-full px-4 py-3 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800 text-sm font-bold border-b border-zinc-100 dark:border-zinc-800 last:border-0 transition-colors text-zinc-900 dark:text-zinc-100 flex items-center justify-between">
                          <span>{p.player}</span>
                          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest opacity-50">all-time</span>
                        </button>
                      )) : <div className="px-4 py-8 text-center text-[10px] text-zinc-400 font-black uppercase tracking-widest">No matches</div>}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="md:hidden w-full">
          <div className="w-full h-11 bg-zinc-100/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 rounded-full flex items-center overflow-hidden px-1 shadow-sm">
            <div className="relative flex-1 h-full flex items-center justify-center px-3">
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-widest">ALL-TIME</span>
            </div>
            <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800 shrink-0" />
            <button 
              onClick={handleClearPlayer}
              disabled={!selectedPlayer}
              className={`flex-1 h-full flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-zinc-900 dark:text-zinc-100 active:scale-95 transition-all whitespace-nowrap px-2 ${!selectedPlayer ? 'opacity-30 cursor-not-allowed' : ''}`}
            >
              clear player
            </button>
            <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800 shrink-0" />
            <button 
              onClick={handleRandomPlayer}
              className="w-10 h-10 flex items-center justify-center text-zinc-900 dark:text-zinc-100 active:scale-90 transition-all shrink-0"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><path d="M12 12h.01"/><path d="M8 8h.01"/><path d="M16 8h.01"/><path d="M8 16h.01"/><path d="M16 16h.01"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="hidden md:flex items-center justify-end h-11 relative shrink-0 -translate-y-1 gap-2.5 z-50">
          <div className="flex items-center bg-zinc-100/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 rounded-full h-full overflow-hidden shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300">
            <button 
              onClick={handleRandomPlayer}
              className={`w-10 h-full flex items-center justify-center ${accentText} hover:bg-zinc-200 dark:hover:bg-zinc-800 active:scale-95 transition-all shrink-0 group/btn`}
              title="random"
            >
              <svg className="w-4 h-4 transition-all duration-300 group-hover/btn:drop-shadow-[0_0_8px_rgba(214,10,7,0.4)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><path d="M12 12h.01"/><path d="M8 8h.01"/><path d="M16 8h.01"/><path d="M8 16h.01"/><path d="M16 16h.01"/>
              </svg>
            </button>
            <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800 shrink-0 opacity-50" />
            <button 
              onClick={handleClearPlayer}
              disabled={!selectedPlayer}
              className={`w-10 h-full flex items-center justify-center transition-all shrink-0 group/btn ${selectedPlayer ? `${accentText} hover:bg-zinc-200 dark:hover:bg-zinc-800 active:scale-95 cursor-pointer` : 'text-zinc-300 dark:text-zinc-600 opacity-50 cursor-not-allowed'}`}
              title="clear player"
            >
              <svg className={`w-4 h-4 transition-all duration-300 ${selectedPlayer ? 'group-hover/btn:drop-shadow-[0_0_8px_rgba(214,10,7,0.4)]' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div className="relative flex items-center gap-2.5 h-full" ref={pillAreaRef}>
            <div className={`flex items-center gap-2.5 h-full transition-opacity duration-300 ${isSearchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
              <div role="tablist" className="inline-flex items-center bg-zinc-100 dark:bg-zinc-900 rounded-full p-1.5 shadow-inner border border-zinc-200/50 dark:border-zinc-800/50 h-full shrink-0 w-[280px] justify-center">
                <div className="relative flex w-full h-full items-center justify-center">
                  <button
                    className="relative w-full rounded-full font-black uppercase tracking-widest text-[10px] text-zinc-400 dark:text-zinc-500 z-10 px-6 py-2 transition-all flex items-center justify-center cursor-default pointer-events-none"
                  >
                    <span className="relative z-20">all-time</span>
                  </button>
                </div>
              </div>

              <button
                onClick={() => setIsSearchOpen(true)}
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
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search players..."
                      className="flex-1 bg-transparent border-none outline-none text-xs font-bold text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
                    />
                    <button onClick={() => setIsSearchOpen(false)} className="w-7 h-7 flex items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-600 active:scale-90 transition-all">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <AnimatePresence>
              {isSearchOpen && searchQuery.trim() && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} 
                  className="absolute top-full right-0 mt-2 w-[22rem] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl z-[1000] overflow-hidden"
                >
                  <div className="max-h-[320px] overflow-y-auto no-scrollbar py-2">
                    {filteredPlayers.length > 0 ? filteredPlayers.map(p => (
                      <button key={p.player} onClick={() => handleSelectPlayer(p)} className="w-full px-4 py-3 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800 text-sm font-bold border-b border-zinc-100 dark:border-zinc-800 last:border-0 transition-colors text-zinc-900 dark:text-zinc-100 flex items-center justify-between">
                        <span>{p.player}</span>
                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest opacity-50">all-time</span>
                      </button>
                    )) : <div className="px-4 py-8 text-center text-[10px] text-zinc-400 font-black uppercase tracking-widest">No matches</div>}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-32">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 dark:text-zinc-600 animate-pulse">loading dataset...</span>
        </div>
      ) : (
        <div className="space-y-16 animate-page-enter">
          <div className="relative">
            {selectedPlayer ? (
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-zinc-50/50 dark:bg-zinc-900/20 py-6 px-8 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 transition-colors min-h-[110px]">
                <div className="space-y-1 min-w-0">
                  <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${accentText} opacity-60`}>Selected Player</span>
                  <h3 
                    className="text-xl md:text-5xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase whitespace-nowrap overflow-hidden md:overflow-visible"
                    style={{ textOverflow: window.innerWidth <= 768 ? 'clip' : undefined }}
                  >
                    {selectedPlayer.player}
                  </h3>
                </div>
                <div className="flex gap-4">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Badges Earned</span>
                    <span className={`text-2xl font-black ${accentText}`}>{playerAchievements.filter(a => a.isEarned).length} / {playerAchievements.length}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-[2rem] py-6 px-8 min-h-[110px]">
                <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">ready to index</h3>
                <p className="text-xs font-bold text-zinc-400 dark:text-zinc-600 tracking-widest mt-1">search player usernames or click top earners below</p>
              </div>
            )}
          </div>

          {selectedPlayer ? (
            <div className="space-y-16">
              {categories.map(cat => {
                const catBadges = playerAchievements.filter(pa => pa.achievement.category === cat);
                if (catBadges.length === 0) return null;

                return (
                  <div key={cat} className="space-y-6">
                    <div className="flex items-center gap-4">
                      <h4 className="text-xl font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tighter">{cat}</h4>
                      <div className="h-px bg-zinc-100 dark:bg-zinc-800 flex-1" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {catBadges.map(pa => (
                        <div 
                          key={pa.achievement.id}
                          className={`
                            relative p-6 rounded-[2rem] border transition-all duration-500 flex flex-col justify-between h-full gap-4
                            ${pa.isEarned 
                              ? `bg-white dark:bg-zinc-950 border-current ${accentText} shadow-lg shadow-current/5` 
                              : 'bg-zinc-50/50 dark:bg-zinc-900/30 border-zinc-100 dark:border-zinc-800/50 grayscale opacity-[0.65]'
                            }
                          `}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <h5 className={`text-lg font-black tracking-tight ${pa.isEarned ? '' : 'text-zinc-900 dark:text-zinc-100'}`}>
                                {pa.achievement.name}
                              </h5>
                              {pa.isEarned && (
                                <div className={`w-2 h-2 rounded-full ${accentBg} animate-pulse`} />
                              )}
                            </div>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">{pa.achievement.description}</p>
                          </div>
                          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/50 flex items-center justify-between">
                            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">{pa.achievement.requirementText}</span>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${pa.isEarned ? accentText : 'text-zinc-300 dark:text-zinc-600'}`}>
                              {pa.isEarned ? 'Earned' : 'Locked'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tighter">Top Badge Earners (All-Time)</h3>
                <div className="h-px bg-zinc-100 dark:bg-zinc-800 flex-1" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {topEarners.map((te, idx) => (
                  <button 
                    key={te.player} 
                    onClick={() => {
                      const match = players.find(p => p.player === te.player);
                      if (match) handleSelectPlayer(match);
                    }}
                    className="p-5 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/50 hover:bg-white dark:hover:bg-zinc-900 hover:border-zinc-200 dark:hover:border-zinc-700 transition-all text-left group"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">#{idx + 1}</span>
                      <span className="text-sm font-black text-zinc-900 dark:text-white truncate">{te.player}</span>
                      <span className={`text-[10px] font-bold ${accentText}`}>{te.earnedCount} Badges</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AchievementsPage;