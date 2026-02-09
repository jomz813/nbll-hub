
import React, { useState, useEffect, useMemo, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchSeasonStats, PlayerStats } from '../data/statsFetcher';
import { fetchAwards, AwardsData } from '../data/awards';
import { recordsData } from '../data/records';
import { generateAllTimeBadges, getHighestBadgesByCategory } from '../data/achievementsEngine';
import { useSettings } from '../context/SettingsContext';
import { toPng } from 'html-to-image';

// In-memory cache for avatar URLs
const AVATAR_CACHE: Record<string, string | null> = {};

// Standardization helper for robust matching
const normalizeName = (name: string): string => {
  return String(name || '').trim().toLowerCase().replace(/\s+/g, '');
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

  // Avatar state
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarLoading, setAvatarLoading] = useState(false);

  // Dynamic Font Size for mobile usernames
  const [mobileFontSize, setMobileFontSize] = useState(48);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const nameContainerRef = useRef<HTMLDivElement>(null);

  // Refs for search interaction and profile capture
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

  useEffect(() => {
    if (!selectedPlayer) {
      setAvatarUrl(null);
      return;
    }

    const username = selectedPlayer.player;
    if (AVATAR_CACHE[username] !== undefined) {
      setAvatarUrl(AVATAR_CACHE[username]);
      return;
    }

    setAvatarLoading(true);
    fetch(`/.netlify/functions/robloxAvatar?username=${encodeURIComponent(username)}`)
      .then(res => res.json())
      .then(data => {
        const url = data.imageUrl || null;
        AVATAR_CACHE[username] = url;
        setAvatarUrl(url);
      })
      .catch(() => {
        AVATAR_CACHE[username] = null;
        setAvatarUrl(null);
      })
      .finally(() => {
        setAvatarLoading(false);
      });
  }, [selectedPlayer?.player]);

  // Fit text logic for mobile
  useLayoutEffect(() => {
    if (window.innerWidth > 768 || !selectedPlayer || !nameRef.current || !nameContainerRef.current) return;

    const fitText = () => {
      let size = 48; // Max size
      const minSize = 24; // Min size
      const containerWidth = nameContainerRef.current!.offsetWidth;
      
      nameRef.current!.style.fontSize = `${size}px`;
      
      // Binary search or loop to find the best fit
      while (nameRef.current!.scrollWidth > containerWidth && size > minSize) {
        size -= 1;
        nameRef.current!.style.fontSize = `${size}px`;
      }
      setMobileFontSize(size);
    };

    fitText();
    window.addEventListener('resize', fitText);
    return () => window.removeEventListener('resize', fitText);
  }, [selectedPlayer?.player]);

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
      accolades.push({ label: 'HALL OF FAME' });
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
    <div className="flex flex-col px-4 py-3 bg-zinc-50/50 dark:bg-zinc-900/30 rounded-xl border border-zinc-100 dark:border-zinc-800/40">
      <span className="text-[8px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-0.5">{label}</span>
      <span className={`text-base md:text-xl tabular-nums tracking-tight text-zinc-900 dark:text-zinc-100 font-black`}>
        {value === 0 || value === null || value === '' ? '—' : value}
      </span>
    </div>
  );

  const SectionHeading = ({ title }: { title: string }) => (
    <div className="flex items-center gap-4 mb-6 pt-2">
      <h4 className="text-[10px] font-black text-zinc-900 dark:text-zinc-300 uppercase tracking-[0.4em] shrink-0">{title}</h4>
      <div className="h-[1px] bg-zinc-100 dark:bg-zinc-900 flex-1" />
    </div>
  );

  if (loading) return (
    <div className="flex items-center justify-center py-32">
      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 dark:text-zinc-600 animate-pulse">accessing registry...</span>
    </div>
  );

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
        <div ref={profileRef} className="relative bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-500 flex flex-col">
          
          {/* Identity Header */}
          <div className="relative p-8 md:p-12 bg-zinc-50/50 dark:bg-zinc-900/10 border-b border-zinc-100 dark:border-zinc-900 overflow-hidden min-h-[220px] flex items-end md:items-center">
             {/* Desktop Decorative Background */}
             <div className="hidden md:block absolute inset-0 opacity-[0.02] pointer-events-none select-none overflow-hidden" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
             
             {/* Mobile-only Background Avatar Cover (Adjusted to contain) */}
             <div className="md:hidden absolute inset-0 z-0">
               {avatarLoading ? (
                 <div className="absolute inset-0 flex items-center justify-center bg-zinc-50 dark:bg-zinc-900/50">
                    <div className={`w-8 h-8 border-2 border-zinc-100 dark:border-zinc-800 border-t-zinc-400 dark:border-t-zinc-500 animate-spin rounded-full`} />
                 </div>
               ) : avatarUrl ? (
                 <>
                   <img src={avatarUrl} alt="" className="w-full h-full object-contain" />
                   <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent dark:from-black/80 dark:via-black/40 to-black/20 md:from-transparent md:to-transparent" />
                 </>
               ) : (
                 <div className="w-full h-full bg-zinc-50 dark:bg-zinc-900/50" />
               )}
             </div>

             <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8 md:gap-12 w-full">
               {/* Profile Avatar (Desktop Only) */}
               <div className="hidden md:block relative shrink-0 w-28 h-28 md:w-40 md:h-40 group">
                 <div className={`absolute inset-0 bg-white dark:bg-zinc-950 border-2 ${accentBorder} rounded-3xl md:rounded-[2.5rem] shadow-xl overflow-hidden z-10`}>
                    {avatarLoading ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className={`w-8 h-8 border-2 border-zinc-100 dark:border-zinc-800 border-t-zinc-400 dark:border-t-zinc-500 animate-spin rounded-full`} />
                      </div>
                    ) : avatarUrl ? (
                      <img src={avatarUrl} alt={selectedPlayer.player} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center">
                        <svg className="w-12 h-12 text-zinc-200 dark:text-zinc-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                      </div>
                    )}
                 </div>
                 <div className="absolute -inset-2 bg-zinc-100 dark:bg-zinc-900 rounded-[2.8rem] blur-xl opacity-50" />
               </div>

               {/* Name and HOF Info Container */}
               <div className="flex flex-col gap-3 md:gap-4 w-full text-left min-w-0">
                  <div className="flex items-center flex-wrap gap-2 md:gap-3">
                    {playerDetails.isHOF && (
                      <span className={`px-4 py-1.5 ${accentBg} text-white text-[10px] font-black uppercase tracking-[0.25em] rounded-full shadow-lg shadow-current/10 border border-white/10`}>Hall of Fame</span>
                    )}
                  </div>
                  
                  {/* Readability wrapper on mobile anchored bottom-left */}
                  <div ref={nameContainerRef} className="relative md:bg-transparent w-full max-w-full">
                    {/* Subtle localized background gradient for readability on mobile */}
                    <div className="md:hidden absolute -inset-6 bg-gradient-to-r from-white/90 dark:from-black/80 to-transparent blur-2xl -z-10" />
                    
                    <h3 
                      ref={nameRef}
                      className="text-4xl md:text-7xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase leading-[1.1] md:leading-[0.9] whitespace-nowrap overflow-hidden transition-[font-size] duration-75"
                      style={{ fontSize: window.innerWidth <= 768 ? `${mobileFontSize}px` : undefined }}
                    >
                      {selectedPlayer.player}
                    </h3>
                  </div>
               </div>
             </div>
          </div>

          <div className="p-8 md:p-12 space-y-16">
            {/* Unified Stats Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
               <section>
                 <SectionHeading title="ALL-TIME STATS" />
                 <div className="grid grid-cols-2 gap-4">
                    <StatBox label="PTS" value={selectedPlayer.pts.toLocaleString()} />
                    <StatBox label="AST" value={selectedPlayer.ast.toLocaleString()} />
                    <StatBox label="REB" value={selectedPlayer.reb.toLocaleString()} />
                    <StatBox label="STL" value={selectedPlayer.stl.toLocaleString()} />
                 </div>
               </section>

               <section>
                 <SectionHeading title="RATINGS" />
                 <div className="grid grid-cols-3 gap-4">
                    <StatBox label="EFF" value={selectedPlayer.eff} />
                    <StatBox label="OFF" value={selectedPlayer.off} />
                    <StatBox label="DEF" value={selectedPlayer.def} />
                 </div>
               </section>
            </div>

            {/* Badges Section */}
            {playerDetails.highestBadges.length > 0 && (
              <section>
                <SectionHeading title="MILESTONES" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {playerDetails.highestBadges.map(ach => (
                    <div key={ach.id} className="relative group p-6 rounded-[2rem] bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <h5 className={`text-base font-black tracking-tight ${accentText}`}>{ach.name}</h5>
                        <div className={`w-1.5 h-1.5 rounded-full ${accentBg} animate-pulse`} />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[8px] font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-widest block">{ach.category}</span>
                        <p className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest line-clamp-1">{ach.requirementText}</p>
                      </div>
                      <div className={`absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-zinc-50 dark:from-zinc-900 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-tr-[2rem] pointer-events-none`} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Verified Awards */}
            {playerDetails.accolades.length > 0 && (
              <section>
                <SectionHeading title="ACCOLADES" />
                <div className="flex flex-wrap gap-3">
                  {playerDetails.accolades.map((item, i) => (
                    <div 
                      key={i} 
                      className="flex items-center gap-3 px-4 py-2.5 bg-zinc-900 dark:bg-zinc-900 border border-zinc-800 rounded-xl shadow-lg hover:border-zinc-700 transition-all duration-300 group"
                    >
                      <span className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-300">
                        {item.label}
                      </span>
                      {item.count && (
                        <div className={`px-1.5 py-0.5 rounded-full ${accentBg} text-white text-[9px] font-black leading-none shadow-sm group-hover:scale-110 transition-transform`}>
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
                <SectionHeading title="RECORDS" />
                <div className="space-y-4">
                  {playerDetails.heldRecords.map((rec, i) => (
                    <div key={i} className="flex items-center justify-between p-6 bg-zinc-50/50 dark:bg-zinc-900/20 rounded-3xl border border-zinc-100 dark:border-zinc-800 group hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs md:text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:translate-x-1 transition-transform">{rec.title}</span>
                        {rec.context && rec.context !== '—' && (
                          <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">{rec.context}</span>
                        )}
                      </div>
                      <div className="flex flex-col items-end">
                        <span className={`text-2xl font-black ${accentText} tabular-nums leading-none`}>{rec.value}</span>
                        <span className="text-[9px] font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mt-1">{rec.valueLabel}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
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
