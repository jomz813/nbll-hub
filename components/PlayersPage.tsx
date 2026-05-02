
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchSeasonStats, PlayerStats } from '../data/statsFetcher';
import { fetchAwards, AwardsData } from '../data/awards';
import { recordsData } from '../data/records';
import { generateAllTimeBadges, getHighestBadgesByCategory } from '../data/achievementsEngine';
import { useSettings } from '../context/SettingsContext';
import { toPng } from 'html-to-image';

// Standardization helper for robust matching
const normalizeName = (name: string): string => {
  return String(name || '').trim().toLowerCase().replace(/\s+/g, '');
};

const ProfileSkeleton: React.FC = () => (
  <div className="space-y-10 animate-pulse">
    <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-xl">
      <div className="p-8 md:p-12 bg-zinc-50/50 dark:bg-zinc-900/10 border-b border-zinc-100 dark:border-zinc-900 flex flex-col md:flex-row md:items-center gap-8 md:gap-12">
        <div className="w-28 h-28 md:w-40 md:h-40 bg-zinc-200 dark:bg-zinc-800 rounded-3xl md:rounded-[2.5rem]" />
        <div className="space-y-4 flex-1">
          <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded-full w-24" />
          <div className="h-12 bg-zinc-200 dark:bg-zinc-800 rounded-full w-3/4" />
        </div>
      </div>
      <div className="p-8 md:p-12 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="h-2 bg-zinc-100 dark:bg-zinc-900 rounded-full w-32" />
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-16 bg-zinc-50 dark:bg-zinc-900/30 rounded-xl" />
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="h-2 bg-zinc-100 dark:bg-zinc-900 rounded-full w-32" />
            <div className="grid grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-16 bg-zinc-50 dark:bg-zinc-900/30 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const RobloxAvatarImg: React.FC<{ username: string | null, size?: 'sm' | 'md' | 'lg' | 'xl', className?: string }> = ({ username, size = 'md', className = '' }) => {
  const [error, setError] = useState(false);
  const normalized = username?.trim();

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16 md:w-24 md:h-24',
    lg: 'w-28 h-28 md:w-40 md:h-40',
    xl: 'w-32 h-32 md:w-48 md:h-48',
  };

  const placeholder = (
    <div className={`bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center rounded-2xl ${sizeClasses[size]} ${className}`}>
      <svg className="w-1/2 h-1/2 text-zinc-300 dark:text-zinc-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    </div>
  );

  if (!normalized || error) return placeholder;

  return (
    <img
      src={`/.netlify/functions/robloxAvatar?username=${encodeURIComponent(normalized)}&format=image`}
      alt={normalized}
      className={`object-contain rounded-2xl ${sizeClasses[size]} ${className}`}
      crossOrigin="anonymous"
      loading="lazy"
      decoding="async"
      onError={() => setError(true)}
    />
  );
};

const PlayersPage: React.FC = () => {
  const { settings, getThemeColors } = useSettings();
  const colors = getThemeColors();
  const accentText = colors.text;
  const accentBg = colors.bg;
  const accentBorder = colors.border;

  const [loading, setLoading] = useState(true);
  const [players, setPlayers] = useState<PlayerStats[]>([]);
  const [awardsData, setAwardsData] = useState<AwardsData | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerStats | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const pillAreaRef = useRef<HTMLDivElement>(null);
  const desktopSearchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchContainerRef = useRef<HTMLDivElement>(null);
  const resultsDropdownRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      setLoading(true);
      try {
        const [stats, awards] = await Promise.all([
          fetchSeasonStats('all-time', controller.signal),
          fetchAwards(controller.signal)
        ]);
        setPlayers(stats);
        setAwardsData(awards);
      } catch (e: any) {
        if (e.name !== 'AbortError') console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => controller.abort();
  }, []);

  const filteredPlayers = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return players.filter(p => p.player.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 8);
  }, [searchQuery, players]);

  const allTimeBadges = useMemo(() => {
    if (players.length === 0) return [];
    return generateAllTimeBadges(players);
  }, [players]);

  const playerDetails = useMemo(() => {
    if (!selectedPlayer || !awardsData) return null;
    
    const lookupName = normalizeName(selectedPlayer.player);
    const awards = awardsData.byPlayer[lookupName] || {};
    
    const isHOF = String(awards['hof'] ?? awards['HOF'] ?? '').toLowerCase().trim() === 'yes';
    const heldRecords = recordsData.flatMap(section => 
      section.items.filter(item => normalizeName(item.holder) === lookupName)
    );
    const highestBadges = getHighestBadgesByCategory(selectedPlayer, awards, allTimeBadges);

    const accolades: { label: string; count?: string }[] = [];
    const rings = parseFloat(String(awards['rings'] || 0));
    if (!isNaN(rings) && rings > 0) {
      accolades.push({ label: 'RINGS', count: `${rings}X` });
    }
    const roty = String(awards['roty'] ?? awards['ROTY'] ?? '').toLowerCase().trim();
    if (['yes', 'y', 'true', '1'].includes(roty)) {
      accolades.push({ label: 'ROTY' });
    }
    if (isHOF) {
      accolades.push({ label: 'HOF' });
    }
    Object.entries(awards).forEach(([cat, val]) => {
      const normCat = cat.toUpperCase().trim();
      if (['ROTY', 'HOF', 'PLAYER', 'USERNAME', 'RINGS'].includes(normCat)) return;
      const num = parseFloat(String(val));
      if (!isNaN(num) && num > 0) {
        accolades.push({ label: normCat, count: `${num}X` });
      }
    });

    return { awards, isHOF, heldRecords, highestBadges, accolades };
  }, [selectedPlayer, awardsData, allTimeBadges]);

  const handleSelectPlayer = (p: PlayerStats) => {
    setSelectedPlayer(p);
    setSearchQuery('');
    closeSearch();
  };

  const handleRandomPlayer = () => {
    if (players.length === 0) return;
    const randomIdx = Math.floor(Math.random() * players.length);
    handleSelectPlayer(players[randomIdx]);
  };

  const handleClearPlayer = () => {
    setSelectedPlayer(null);
    setSearchQuery('');
    closeSearch();
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
    setShowResults(false);
  };

  const handleExport = async () => {
    const target = profileRef.current;
    if (!target || !selectedPlayer || isExporting) return;
    
    setIsExporting(true);
    closeSearch(); 

    const originalHeight = target.style.height;
    const originalMaxHeight = target.style.maxHeight;
    const originalOverflow = target.style.overflow;
    const originalPaddingBottom = target.style.paddingBottom;

    try {
      target.style.height = 'auto';
      target.style.maxHeight = 'none';
      target.style.overflow = 'visible';
      target.style.paddingBottom = '48px';

      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

      const filename = `nbll-player-${selectedPlayer.player.toLowerCase().replace(/\s+/g, '-')}.png`;

      const isDarkMode = document.documentElement.classList.contains('dark');
      const bgColor = isDarkMode ? '#09090b' : '#ffffff';

      const width = target.scrollWidth;
      const height = target.scrollHeight;

      const dataUrl = await toPng(target, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: bgColor,
        width: width,
        height: height,
        skipFonts: true,
        fontEmbedCSS: "", 
        filter: (node: any) => {
          if (node.tagName === 'LINK' && node.rel === 'stylesheet') {
            const href = node.getAttribute('href') || '';
            if (href.includes('fonts.googleapis') || href.includes('fonts.gstatic')) {
              return false;
            }
          }
          return true;
        },
        style: {
          borderRadius: '0px',
          paddingBottom: '48px',
          height: `${height}px`
        }
      });

      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export image:', err);
    } finally {
      if (target) {
        target.style.height = originalHeight;
        target.style.maxHeight = originalMaxHeight;
        target.style.overflow = originalOverflow;
        target.style.paddingBottom = originalPaddingBottom;
      }
      setIsExporting(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchOpen) closeSearch();
    };
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (pillAreaRef.current && !pillAreaRef.current.contains(target) && 
          mobileSearchContainerRef.current && !mobileSearchContainerRef.current.contains(target) &&
          resultsDropdownRef.current && !resultsDropdownRef.current.contains(target)) {
        if (isSearchOpen) closeSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    if (isSearchOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchOpen]);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => {
        if (window.innerWidth <= 768) mobileSearchInputRef.current?.focus();
        else desktopSearchInputRef.current?.focus();
      }, 50);
    }
  }, [isSearchOpen]);

  const StatBox = ({ label, value }: { label: string, value: any }) => (
    <div className="flex flex-col justify-center px-5 py-4 bg-zinc-50/50 dark:bg-zinc-900/40 rounded-2xl border border-zinc-100 dark:border-zinc-800/60 transition-all hover:shadow-md">
      <span className="text-[10px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.15em] mb-1.5">{label}</span>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl md:text-3xl tabular-nums tracking-tighter text-zinc-900 dark:text-zinc-100 font-black leading-none">
          {value === 0 || value === null || value === '' ? '—' : value}
        </span>
      </div>
    </div>
  );

  const SectionHeading = ({ title }: { title: string }) => (
    <div className="flex items-center gap-4 mb-8 pt-4">
      <h4 className="text-[11px] font-black text-zinc-600 dark:text-zinc-400 uppercase tracking-[0.3em] shrink-0">{title}</h4>
      <div className="h-px bg-zinc-200/60 dark:bg-zinc-800/60 flex-1" />
    </div>
  );

  if (loading) return <ProfileSkeleton />;

  return (
    <div className="space-y-10 pb-20 animate-page-enter">
      {/* Header Row */}
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
            player database
          </motion.h2>

          <div className="md:hidden absolute right-0 flex items-center justify-end">
            <div className="relative" ref={mobileSearchContainerRef}>
              <motion.div 
                initial={false}
                animate={{ width: isSearchOpen ? 'calc(100vw - 32px)' : '3rem' }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className={`flex items-center bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-full h-12 shadow-sm relative z-20 overflow-hidden`}
              >
                <button onClick={() => !isSearchOpen && setIsSearchOpen(true)} className={`flex-none w-12 h-12 flex items-center justify-center ${accentText}`}>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                </button>
                <AnimatePresence>
                  {isSearchOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex items-center pr-2">
                      <input ref={mobileSearchInputRef} type="text" value={searchQuery} onChange={(e) => {setSearchQuery(e.target.value); setShowResults(true);}} placeholder="Search player..." className="flex-1 bg-transparent border-none outline-none text-sm font-bold text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400" />
                      <button onClick={closeSearch} className="w-8 h-8 flex items-center justify-center text-zinc-400"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
              <AnimatePresence>
                {isSearchOpen && searchQuery.trim() && showResults && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full right-0 mt-3 w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl z-[1000] overflow-hidden">
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

        {/* Unified Mobile Controls */}
        <div className="md:hidden w-full">
          <div className="w-full h-11 bg-zinc-100/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 rounded-full flex items-center overflow-hidden px-1 shadow-sm">
            <div className="relative flex-1 h-full flex items-center justify-center px-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-900 dark:text-zinc-100">ALL-TIME</span>
            </div>
            <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800 shrink-0" />
            <button onClick={handleClearPlayer} disabled={!selectedPlayer} className={`flex-1 h-full flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-zinc-900 dark:text-zinc-100 active:scale-95 transition-all whitespace-nowrap px-2 ${!selectedPlayer ? 'opacity-30 cursor-not-allowed' : ''}`}>
              clear player
            </button>
            <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800 shrink-0" />
            <button 
              onClick={handleExport}
              disabled={!selectedPlayer || isExporting}
              className={`w-10 h-10 flex items-center justify-center text-zinc-900 dark:text-zinc-100 active:scale-90 transition-all shrink-0 ${!selectedPlayer || isExporting ? 'opacity-30 cursor-not-allowed' : ''}`}
            >
              {isExporting ? (
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
              )}
            </button>
            <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800 shrink-0" />
            <button onClick={handleRandomPlayer} className="w-10 h-10 flex items-center justify-center text-zinc-900 dark:text-zinc-100 active:scale-90 transition-all shrink-0">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><path d="M12 12h.01"/><path d="M8 8h.01"/><path d="M16 8h.01"/><path d="M8 16h.01"/><path d="M16 16h.01"/></svg>
            </button>
          </div>
        </div>

        {/* Desktop Controls */}
        <div className="hidden md:flex items-center justify-end h-11 relative shrink-0 -translate-y-1 gap-2.5 z-50">
          <div className="flex items-center bg-zinc-100/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 rounded-full h-full overflow-hidden shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300">
            <button onClick={handleRandomPlayer} className={`w-10 h-full flex items-center justify-center ${accentText} hover:bg-zinc-200 dark:hover:bg-zinc-800 active:scale-95 transition-all shrink-0 group/btn`} title="random"><svg className="w-4 h-4 transition-all duration-300 group-hover/btn:drop-shadow-[0_0_8px_rgba(214,10,7,0.4)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><path d="M12 12h.01"/><path d="M8 8h.01"/><path d="M16 8h.01"/><path d="M8 16h.01"/><path d="M16 16h.01"/></svg></button>
            <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800 shrink-0 opacity-50" />
            <button 
              onClick={handleExport}
              disabled={!selectedPlayer || isExporting}
              className={`w-10 h-full flex items-center justify-center ${accentText} hover:bg-zinc-200 dark:hover:bg-zinc-800 active:scale-95 transition-all shrink-0 ${!selectedPlayer || isExporting ? 'opacity-30 cursor-not-allowed' : ''} group/btn`}
              title="export"
            >
              {isExporting ? (
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : (
                <svg className="w-4 h-4 transition-all duration-300 group-hover/btn:drop-shadow-[0_0_8px_rgba(214,10,7,0.4)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
              )}
            </button>
            <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800 shrink-0 opacity-50" />
            <button onClick={handleClearPlayer} disabled={!selectedPlayer} className={`w-10 h-full flex items-center justify-center transition-all shrink-0 group/btn ${selectedPlayer ? `${accentText} hover:bg-zinc-200 dark:hover:bg-zinc-800 active:scale-95 cursor-pointer` : 'text-zinc-300 dark:text-zinc-600 opacity-50 cursor-not-allowed'}`} title="clear"><svg className={`w-4 h-4 transition-all duration-300 ${selectedPlayer ? 'group-hover/btn:drop-shadow-[0_0_8px_rgba(214,10,7,0.4)]' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
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
              <button onClick={() => setIsSearchOpen(true)} className={`w-11 h-11 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-center ${accentText} shadow-sm hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all`}><svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></button>
            </div>
            <AnimatePresence>
              {isSearchOpen && (
                <motion.div initial={{ opacity: 0, scaleX: 0.8 }} animate={{ opacity: 1, scaleX: 1 }} exit={{ opacity: 0, scaleX: 0.8 }} style={{ transformOrigin: 'right center' }} className="absolute inset-0 z-20 h-11 rounded-full border border-zinc-200/50 dark:border-zinc-800/50 flex items-center bg-zinc-100 dark:bg-zinc-900 shadow-inner overflow-hidden">
                  <div className={`flex-none w-11 h-11 flex items-center justify-center ${accentText}`}><svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></div>
                  <div className="flex-1 flex items-center pr-3">
                    <input ref={desktopSearchInputRef} type="text" value={searchQuery} onChange={(e) => {setSearchQuery(e.target.value); setShowResults(true);}} placeholder="Search players..." className="flex-1 bg-transparent border-none outline-none text-xs font-bold text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400" />
                    <button onClick={closeSearch} className="w-7 h-7 flex items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {isSearchOpen && searchQuery.trim() && showResults && (
                <motion.div ref={resultsDropdownRef} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} className="absolute top-full right-0 mt-2 w-[22rem] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl z-[1000] overflow-hidden">
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

      {selectedPlayer && playerDetails ? (
        <motion.div 
          key={selectedPlayer.player}
          initial={settings.reducedMotion ? {} : { opacity: 0, y: 20, filter: 'blur(10px)' }}
          animate={settings.reducedMotion ? {} : { opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          ref={profileRef} 
          className="relative bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-500 flex flex-col"
        >
          
          {/* Identity Header */}
          <div className="relative p-8 md:p-16 bg-zinc-50/50 dark:bg-zinc-900/20 border-b border-zinc-100 dark:border-zinc-900 overflow-hidden min-h-[240px] md:min-h-[260px] flex items-end md:items-center">
             {/* Desktop Decorative Background */}
             <div className="hidden md:block absolute inset-0 opacity-[0.03] pointer-events-none select-none overflow-hidden" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
             
             {/* Mobile-only Background Avatar Cover */}
             <div className="md:hidden absolute inset-0 z-0">
               <RobloxAvatarImg username={selectedPlayer.player} className="w-full h-full object-cover opacity-40 dark:opacity-60" />
               <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 dark:from-black dark:via-black/40 to-transparent" />
             </div>

             <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6 md:gap-16 w-full">
               {/* Profile Avatar (Desktop Only) */}
               <div className="hidden md:block relative shrink-0 w-32 h-32 md:w-48 md:h-48 group">
                 <div className={`absolute inset-0 bg-white dark:bg-zinc-950 border-2 ${accentBorder} rounded-[2.5rem] md:rounded-[3rem] shadow-2xl overflow-hidden z-10`}>
                    <RobloxAvatarImg username={selectedPlayer.player} size="xl" className="w-full h-full transition-transform duration-700 group-hover:scale-110" />
                 </div>
                 <div className="absolute -inset-4 bg-zinc-100 dark:bg-zinc-900 rounded-[3.5rem] blur-2xl opacity-40" />
               </div>

               {/* Name and HOF Info Container */}
               <div className="flex flex-col gap-2 md:gap-6 w-full text-left min-w-0">
                  <div className="flex items-center flex-wrap gap-2 md:gap-4">
                    {playerDetails.isHOF && (
                      <span className={`px-3 py-1 md:px-5 md:py-2 ${accentBg} text-white text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] rounded-full shadow-xl shadow-current/20 border border-white/10`}>HOF</span>
                    )}
                  </div>
                  
                  <div className="relative md:bg-transparent w-full max-w-full overflow-hidden">
                    {/* Subtle localized background gradient for readability on mobile */}
                    <div className="md:hidden absolute -inset-8 bg-gradient-to-r from-white dark:from-black to-transparent blur-3xl -z-10" />
                    
                    <h3 
                      className="text-2xl md:text-[clamp(2.5rem,8vw,5.5rem)] font-black text-zinc-900 dark:text-white tracking-tighter uppercase leading-[1.1] md:leading-[0.85] truncate max-w-full"
                    >
                      {selectedPlayer.player}
                    </h3>
                  </div>
               </div>
             </div>
          </div>

          <div className="p-6 md:p-16 space-y-12 md:space-y-20">
            {/* Unified Stats Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16">
               <section>
                 <SectionHeading title="ALL-TIME TOTALS" />
                 <div className="grid grid-cols-2 gap-4 md:gap-5">
                    <StatBox label="POINTS" value={selectedPlayer.pts.toLocaleString()} />
                    <StatBox label="ASSISTS" value={selectedPlayer.ast.toLocaleString()} />
                    <StatBox label="REBOUNDS" value={selectedPlayer.reb.toLocaleString()} />
                    <StatBox label="STEALS" value={selectedPlayer.stl.toLocaleString()} />
                 </div>
               </section>

               <section>
                 <SectionHeading title="ALL-TIME RATINGS" />
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
                    <StatBox label="EFFICIENCY" value={selectedPlayer.eff} />
                    <StatBox label="OFFENSE" value={selectedPlayer.off} />
                    <StatBox label="DEFENSE" value={selectedPlayer.def} />
                 </div>
               </section>
            </div>

            {/* Badges Section */}
            {playerDetails.highestBadges.length > 0 && (
              <section>
                <SectionHeading title="ACHIEVEMENTS" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {playerDetails.highestBadges.map(ach => (
                    <div key={ach.id} className="relative group p-6 md:p-7 rounded-[2rem] md:rounded-[2.5rem] bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500">
                      <div className="flex items-center justify-between mb-4 md:mb-5">
                        <h5 className={`text-base md:text-lg font-black tracking-tight ${accentText}`}>{ach.name}</h5>
                        <div className={`w-2 h-2 rounded-full ${accentBg} animate-pulse shadow-[0_0_10px_currentColor]`} />
                      </div>
                      <div className="space-y-2">
                        <span className="text-[9px] md:text-[10px] font-black text-zinc-500 dark:text-zinc-500 uppercase tracking-[0.2em] block">{ach.category}</span>
                        <p className="text-[10px] md:text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-widest line-clamp-2 leading-relaxed">{ach.requirementText}</p>
                      </div>
                      <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-zinc-50 dark:from-zinc-900 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-tr-[2rem] md:rounded-tr-[2.5rem] pointer-events-none`} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Verified Awards */}
            {playerDetails.accolades.length > 0 && (
              <section>
                <SectionHeading title="ACCOLADES" />
                <div className="flex flex-wrap gap-2 md:gap-4">
                  {playerDetails.accolades.map((item, i) => (
                    <div 
                      key={i} 
                      className="flex items-center gap-2 md:gap-4 px-3 py-2 md:px-5 md:py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl md:rounded-2xl shadow-md hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 group hover:shadow-lg"
                    >
                      <span className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.15em] md:tracking-[0.2em] text-zinc-800 dark:text-zinc-300 truncate max-w-[100px] md:max-w-none">
                        {item.label}
                      </span>
                      {item.count && (
                        <div className={`px-1.5 py-0.5 md:px-2 md:py-1 rounded-full ${accentBg} text-white text-[8px] md:text-[10px] font-black leading-none shadow-lg group-hover:scale-110 transition-transform`}>
                          {item.count}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Records Section */}
            {playerDetails.heldRecords.length > 0 && (
              <section>
                <SectionHeading title="LEAGUE RECORDS" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {playerDetails.heldRecords.map((rec, i) => (
                    <div key={i} className="flex items-center justify-between p-8 bg-zinc-50/50 dark:bg-zinc-900/20 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 group hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all duration-300 hover:shadow-lg">
                      <div className="flex flex-col gap-2">
                        <span className="text-sm md:text-base font-bold text-zinc-900 dark:text-zinc-100 group-hover:translate-x-1 transition-transform">{rec.title}</span>
                        {rec.context && rec.context !== '—' && (
                          <span className="text-[10px] font-black text-zinc-500 dark:text-zinc-500 uppercase tracking-[0.15em]">{rec.context}</span>
                        )}
                      </div>
                      <div className="flex flex-col items-end">
                        <span className={`text-3xl font-black ${accentText} tabular-nums leading-none tracking-tighter`}>{rec.value}</span>
                        <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mt-2">{rec.valueLabel}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </motion.div>
      ) : (
        <motion.div 
          initial={false}
          animate={{ minHeight: 600 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="flex flex-col items-center pt-20 md:pt-32 text-center border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-[2rem] md:rounded-[3rem] px-6 transition-all duration-300"
        >
          <div className="space-y-1">
            <h3 className="text-lg md:text-xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">ready to search</h3>
            <p className="text-[10px] md:text-xs font-bold text-zinc-400 dark:text-zinc-600 tracking-widest">search player usernames to start</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PlayersPage;
