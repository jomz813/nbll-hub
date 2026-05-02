
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { fetchSeasonStats, PlayerStats, SeasonID } from '../data/statsFetcher';
import { fetchAwards, AwardsData } from '../data/awards';
import { useSettings } from '../context/SettingsContext';
import { motion, AnimatePresence } from 'framer-motion';
import { toPng } from 'html-to-image';

const SEASONS: SeasonID[] = ['s14', 's13', 's12', 's11', 's10', 'all-time'];

// Standardization helper matching the one in awards.ts for robust lookups
const normalizeName = (name: string | null): string => {
  if (!name) return '';
  return String(name).trim().toLowerCase().replace(/\s+/g, '');
};

const DropdownIcon = () => (
  <svg className="w-3 h-3 text-zinc-400 dark:text-zinc-500 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const RobloxAvatarImg: React.FC<{ username: string | null, size: 'md' | 'xl', className?: string }> = ({ username, size, className = '' }) => {
  const [error, setError] = useState(false);
  const normalized = username?.trim();

  const sizeClasses = {
    md: 'w-16 h-16 md:w-24 md:h-24',
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

const ComparePage: React.FC = () => {
  const { settings, getThemeColors } = useSettings();
  const colors = getThemeColors();
  const accentBg = colors.bg;
  const accentText = colors.text;
  
  const [season, setSeason] = useState<SeasonID>('s14');
  const [loading, setLoading] = useState(false);
  const [players, setPlayers] = useState<PlayerStats[]>([]);
  
  // Load selection from localStorage on mount
  useEffect(() => {
    // Reset season to default on mount per new requirements
    setSeason('s14');
  }, []);

  const handleSeasonChange = (s: SeasonID) => {
    setSeason(s);
    // Removed localStorage.setItem
  };
  
  // Store only names to persist selection across season data swaps
  const [selectedNames, setSelectedNames] = useState<(string | null)[]>([null, null]);
  
  const [awardsData, setAwardsData] = useState<AwardsData | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  
  // Search State
  const [query, setQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Refs for Search and Table
  const desktopSearchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);
  const pillAreaRef = useRef<HTMLDivElement>(null);
  const mobileSearchContainerRef = useRef<HTMLDivElement>(null);
  const resultsDropdownRef = useRef<HTMLDivElement>(null);
  const compareRef = useRef<HTMLDivElement>(null);

  // Determine height of the table for empty state placeholder
  const expectedTableHeight = useMemo(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
    const rowH = isMobile ? 45 : 65;
    const headerH = isMobile ? 240 : 160; 
    const sectionH = isMobile ? 36 : 48;

    let rows = 4;
    let sections = 1;

    if (season === 's10') {
    } else if (season === 'all-time') {
      rows += 3;
      sections += 1;
      if (awardsData) {
        rows += awardsData.categories.length;
        sections += 1;
      } else {
        rows += 6; 
        sections += 1;
      }
    } else {
      rows += 5;
      rows += 3;
      sections += 2;
    }

    return headerH + (rows * rowH) + (sections * sectionH);
  }, [season, awardsData]);

  const selectedStats = useMemo(() => {
    return selectedNames.map(name => {
      if (!name) return null;
      return players.find(p => p.player.toLowerCase() === name.toLowerCase()) || null;
    });
  }, [players, selectedNames]);

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      setLoading(true);
      try {
        const [statsData, fetchedAwards] = await Promise.all([
          fetchSeasonStats(season, controller.signal),
          season === 'all-time' ? fetchAwards(controller.signal) : Promise.resolve(null)
        ]);

        setPlayers(statsData);
        setAwardsData(fetchedAwards);
      } catch (e: any) {
        if (e.name !== 'AbortError') console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => controller.abort();
  }, [season]);

  const filtered = useMemo(() => {
    if (!query.trim()) return [];
    return players
      .filter(p => p.player.toLowerCase().includes(query.toLowerCase()) && !selectedNames.some(s => s?.toLowerCase() === p.player.toLowerCase()))
      .slice(0, 8);
  }, [query, players, selectedNames]);

  const addPlayer = (p: PlayerStats) => {
    const emptyIndex = selectedNames.findIndex(s => s === null);
    if (emptyIndex !== -1) {
      const next = [...selectedNames];
      next[emptyIndex] = p.player;
      setSelectedNames(next);
      setQuery('');
      
      const remainingEmpty = next.some(s => s === null);
      if (remainingEmpty) {
        requestAnimationFrame(() => {
          if (window.innerWidth <= 768) {
            mobileSearchInputRef.current?.focus();
          } else {
            desktopSearchInputRef.current?.focus();
          }
        });
      }
    }
  };

  const removePlayerAt = (index: number) => {
    const next = [...selectedNames];
    next[index] = null;
    setSelectedNames(next);
  };

  const handleNameClick = (index: number) => {
    removePlayerAt(index);
  };

  const handleRandomMatchup = () => {
    if (players.length < 2) return;
    const pool = [...players];
    const idx1 = Math.floor(Math.random() * pool.length);
    const p1 = pool.splice(idx1, 1)[0];
    const idx2 = Math.floor(Math.random() * pool.length);
    const p2 = pool[idx2];
    setSelectedNames([p1.player, p2.player]);
    if (isSearchOpen) closeSearch();
  };

  const handleSwapPlayers = () => {
    setSelectedNames([selectedNames[1], selectedNames[0]]);
  };

  const resetTable = () => {
    setSelectedNames([null, null]);
    setQuery('');
    closeSearch();
  };

  const openSearch = () => {
    setIsSearchOpen(true);
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setQuery('');
    setShowResults(false);
  };

  const handleExport = async () => {
    const target = compareRef.current;
    if (!target || !selectedNames.some(Boolean) || isExporting) return;
    
    setIsExporting(true);
    closeSearch(); 

    // Helper to wait for all images to load or timeout
    const waitForImages = async (container: HTMLElement) => {
      const imgs = Array.from(container.querySelectorAll('img'));
      const promises = imgs.map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(resolve => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      });
      // Timeout after 2.5s
      return Promise.race([
        Promise.all(promises),
        new Promise(resolve => setTimeout(resolve, 2500))
      ]);
    };

    // Mobile-friendly snapshot reliability: 
    // Wait for any <img> within the target to be fully loaded/completed
    await waitForImages(target);

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

      const p1 = selectedNames[0] ? selectedNames[0].toLowerCase().replace(/\s+/g, '-') : 'empty';
      const p2 = selectedNames[1] ? `-vs-${selectedNames[1].toLowerCase().replace(/\s+/g, '-')}` : '';
      const filename = `nbll-compare-${season}-${p1}${p2}.png`;

      const isDarkMode = document.documentElement.classList.contains('dark');
      const bgColor = isDarkMode ? '#09090b' : '#ffffff';

      const width = target.scrollWidth;
      const height = target.scrollHeight;

      const dataUrl = await toPng(target, {
        cacheBust: true, // Key for mobile caching issues
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
    if (isSearchOpen) {
      const timer = setTimeout(() => {
        if (window.innerWidth <= 768) {
          mobileSearchInputRef.current?.focus();
        } else {
          desktopSearchInputRef.current?.focus();
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchOpen) {
        closeSearch();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const isInsideDesktop = pillAreaRef.current?.contains(target);
      const isInsideMobile = mobileSearchContainerRef.current?.contains(target);
      const isInsideDropdown = resultsDropdownRef.current?.contains(target);

      if (!isInsideDesktop && !isInsideMobile && !isInsideDropdown) {
        if (isSearchOpen) {
          closeSearch();
        }
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

  const parseValue = (val: any): number => {
    if (typeof val === 'number') return val;
    if (!val || val === '—' || val === 'N/A') return 0;
    const clean = String(val).replace(/,/g, '').replace(/[^0-9.-]/g, '');
    const num = parseFloat(clean);
    return isNaN(num) ? 0 : num;
  };

  const getHighlightStyle = (left: any, right: any, isLeft: boolean): React.CSSProperties | undefined => {
    const lNum = parseValue(left);
    const rNum = parseValue(right);
    if (lNum === 0 && rNum === 0) return undefined;
    
    const highlightColor = 'color-mix(in srgb, var(--accent) 18%, transparent)';
    const isWinner = isLeft ? (lNum >= rNum) : (rNum >= lNum);
    
    return isWinner ? { backgroundColor: highlightColor } : undefined;
  };

  const categories = {
    ratings: [
      { label: 'EFF', key: 'eff' as keyof PlayerStats },
      { label: 'OFF', key: 'off' as keyof PlayerStats },
      { label: 'DEF', key: 'def' as keyof PlayerStats },
    ],
    stats: [
      { label: 'PTS', key: 'pts' as keyof PlayerStats },
      { label: 'AST', key: 'ast' as keyof PlayerStats },
      { label: 'REB', key: 'reb' as keyof PlayerStats },
      { label: 'STL', key: 'stl' as keyof PlayerStats },
    ],
    averages: [
      { label: 'GP', key: 'gp' as keyof PlayerStats },
      { label: 'PPG', key: 'ppg' as keyof PlayerStats },
      { label: 'APG', key: 'apg' as keyof PlayerStats },
      { label: 'RPG', key: 'rpg' as keyof PlayerStats },
      { label: 'SPG', key: 'spg' as keyof PlayerStats },
    ]
  };

  const showRatings = season !== 's10';
  const showAverages = season !== 'all-time';
  const showAwards = season === 'all-time' && awardsData;

  const isMaxPlayers = selectedNames.every(s => s !== null);
  const hasSelection = selectedNames.some(s => s !== null);

  const seasonLabel = season === 'all-time' ? 'ALL-TIME' : season.toUpperCase();

  const ComparisonRow = ({ label, leftVal, rightVal }: { label: string, leftVal: any, rightVal: any }) => {
    const leftStyle = getHighlightStyle(leftVal, rightVal, true);
    const rightStyle = getHighlightStyle(leftVal, rightVal, false);
    
    const lNum = parseValue(leftVal);
    const rNum = parseValue(rightVal);
    const leftIsWinner = (lNum !== 0 || rNum !== 0) && lNum >= rNum;
    const rightIsWinner = (lNum !== 0 || rNum !== 0) && rNum >= lNum;

    const getValColorClass = (isWinner: boolean) => isWinner ? 'text-zinc-900 dark:text-zinc-100 font-extrabold' : 'text-zinc-900 dark:text-zinc-400 font-semibold';
    
    return (
      <div className="grid grid-cols-[1fr_80px_1fr] md:grid-cols-[1fr_120px_1fr] items-center border-b border-zinc-100 dark:border-zinc-900 last:border-0">
        <div className={`py-3 md:py-5 px-4 text-right transition-colors`} style={leftStyle}>
          <span className={`text-sm md:text-base tabular-nums ${getValColorClass(leftIsWinner)}`}>{leftVal === 0 || leftVal === null || leftVal === undefined || leftVal === '' ? '—' : leftVal}</span>
        </div>
        <div className="py-3 md:py-5 text-center bg-zinc-50/30 dark:bg-zinc-900/10 h-full flex items-center justify-center border-x border-zinc-100 dark:border-zinc-900">
          <span className="text-[8px] md:text-[10px] font-black text-zinc-900 dark:text-zinc-600 uppercase tracking-widest whitespace-nowrap px-1">{label}</span>
        </div>
        <div className={`py-3 md:py-5 px-4 text-left transition-colors`} style={rightStyle}>
          <span className={`text-sm md:text-base tabular-nums ${getValColorClass(rightIsWinner)}`}>{rightVal === 0 || rightVal === null || rightVal === undefined || rightVal === '' ? '—' : rightVal}</span>
        </div>
      </div>
    );
  };

  const isYes = (val: any) => {
    if (val === null || val === undefined) return false;
    const s = String(val).toLowerCase().trim();
    return ['yes', 'y', 'true', '1'].includes(s);
  };

  const BooleanComparisonRow = ({ label, leftRaw, rightRaw }: { label: string, leftRaw: any, rightRaw: any }) => {
    const leftIsYes = isYes(leftRaw);
    const rightIsYes = isYes(rightRaw);
    
    const highlightColor = 'color-mix(in srgb, var(--accent) 18%, transparent)';
    const leftStyle = leftIsYes ? { backgroundColor: highlightColor } : undefined;
    const rightStyle = rightIsYes ? { backgroundColor: highlightColor } : undefined;

    const getValColorClass = (isYesVal: boolean) => {
      if (isYesVal) return 'text-zinc-900 dark:text-zinc-100 font-extrabold';
      return 'text-zinc-900 dark:text-zinc-400 font-semibold';
    };
    
    return (
      <div className="grid grid-cols-[1fr_80px_1fr] md:grid-cols-[1fr_120px_1fr] items-center border-b border-zinc-100 dark:border-zinc-900 last:border-0">
        <div className={`py-3 md:py-5 px-4 text-right transition-colors`} style={leftStyle}>
          <span className={`text-sm md:text-base tabular-nums ${getValColorClass(leftIsYes)}`}>{leftIsYes ? 'yes' : 'no'}</span>
        </div>
        <div className="py-3 md:py-5 text-center bg-zinc-50/30 dark:bg-zinc-900/10 h-full flex items-center justify-center border-x border-zinc-100 dark:border-zinc-900">
          <span className="text-[8px] md:text-[10px] font-black text-zinc-900 dark:text-zinc-600 uppercase tracking-widest whitespace-nowrap px-1">{label}</span>
        </div>
        <div className={`py-3 md:py-5 px-4 text-left transition-colors`} style={rightStyle}>
          <span className={`text-sm md:text-base tabular-nums ${getValColorClass(rightIsYes)}`}>{rightIsYes ? 'yes' : 'no'}</span>
        </div>
      </div>
    );
  };

  const SectionHeader = ({ title }: { title: string }) => (
    <div className="bg-zinc-50 dark:bg-zinc-900/50 border-y border-zinc-100 dark:border-zinc-900 py-2 md:py-3 text-center">
      <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-zinc-900 dark:text-zinc-500">{seasonLabel} {title}</span>
    </div>
  );

  const ResultsList = () => (
    <div className="max-h-[320px] overflow-y-auto no-scrollbar py-2">
      {filtered.length > 0 ? (
        filtered.map(p => (
          <button 
            key={p.player} 
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => { e.stopPropagation(); addPlayer(p); }} 
            className="w-full px-4 py-3 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800 text-sm font-bold border-b border-zinc-100 dark:border-zinc-800 last:border-0 transition-colors text-zinc-900 dark:text-zinc-100 flex items-center justify-between"
          >
            <span>{p.player}</span>
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest opacity-50">{season}</span>
          </button>
        ))
      ) : (
        <div className="px-4 py-8 text-center text-[10px] text-zinc-400 font-black uppercase tracking-widest">
          No matches
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6 md:space-y-10 pb-20 animate-page-enter">
      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4 md:mb-12 items-start relative z-[60]">
        <div className="flex items-center justify-between w-full md:auto relative min-h-[4rem]">
          <motion.h2 
            initial={false}
            animate={{ 
              opacity: isSearchOpen && window.innerWidth <= 768 ? 0 : 1,
              x: isSearchOpen && window.innerWidth <= 768 ? -20 : 0
            }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={`text-4xl md:text-6xl font-black tracking-tighter shrink-0 select-none pointer-events-none md:pointer-events-auto ${settings.rahBizzyTheme ? 'text-[#3B82F6]' : 'text-zinc-900 dark:text-white'}`}
          >
            compare players
          </motion.h2>

          {/* Mobile Search Button Overlay */}
          <div className="md:hidden absolute right-0 flex items-center justify-end">
            <div className="relative" ref={mobileSearchContainerRef}>
              <motion.div 
                initial={false}
                animate={{ width: isSearchOpen ? 'calc(100vw - 32px)' : '3rem' }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className={`flex items-center bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-full h-12 shadow-sm relative z-20 overflow-hidden`}
                onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => isSearchOpen && e.stopPropagation()}
              >
                <button 
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => { 
                    e.stopPropagation(); 
                    if (!isSearchOpen) openSearch(); 
                  }} 
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
                        value={query} 
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setQuery(e.target.value); setShowResults(true); }} 
                        placeholder="Search player..." 
                        className="flex-1 bg-transparent border-none outline-none text-sm font-bold text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400" 
                        onMouseDown={(e: React.MouseEvent<HTMLInputElement>) => e.stopPropagation()}
                      />
                      <button 
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => { 
                          e.stopPropagation(); 
                          closeSearch(); 
                        }} 
                        className="w-8 h-8 flex items-center justify-center text-zinc-400"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              <AnimatePresence>
                {isSearchOpen && query.trim() && showResults && (
                  <motion.div 
                    ref={resultsDropdownRef}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full right-0 mt-3 w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl z-50 overflow-hidden"
                  >
                    <ResultsList />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Unified Mobile Controls Toolbar */}
        <div className="md:hidden w-full">
          <div className="w-full h-11 bg-zinc-100/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 rounded-full flex items-center overflow-hidden px-1">
            <div className="relative flex items-center px-3 h-full group">
              <select 
                value={season} 
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleSeasonChange(e.target.value as SeasonID)} 
                className="bg-transparent border-none text-xs font-bold text-zinc-900 dark:text-zinc-100 outline-none appearance-none pr-4 relative z-10"
              >
                {SEASONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 group-hover:translate-y-[-40%] transition-transform">
                <DropdownIcon />
              </div>
            </div>
            <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800 shrink-0" />
            <button 
              onClick={resetTable}
              disabled={!hasSelection}
              className={`flex-1 h-full flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-zinc-900 dark:text-zinc-100 active:scale-95 transition-all whitespace-nowrap px-2 ${!hasSelection ? 'opacity-30 cursor-not-allowed' : ''}`}
            >
              reset table
            </button>
            <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800 shrink-0" />
            <button 
              onClick={handleSwapPlayers}
              className="w-10 h-10 flex items-center justify-center text-zinc-900 dark:text-zinc-100 active:scale-95 transition-all shrink-0"
            >
               <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="m7 21-4-4 4-4"/><path d="M3 17h18"/><path d="m17 3 4 4-4 4"/><path d="M21 7H3"/>
              </svg>
            </button>
            <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800 shrink-0" />
            <button 
              onClick={handleRandomMatchup}
              disabled={players.length < 2}
              className={`w-10 h-10 flex items-center justify-center text-zinc-900 dark:text-zinc-100 active:scale-90 transition-all shrink-0 ${players.length < 2 ? 'opacity-30 cursor-not-allowed' : ''}`}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><path d="M12 12h.01"/><path d="M8 8h.01"/><path d="M16 8h.01"/><path d="M8 16h.01"/><path d="M16 16h.01"/>
              </svg>
            </button>
            <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800 shrink-0" />
            <button 
              onClick={handleExport}
              disabled={!hasSelection || isExporting}
              className={`w-10 h-10 flex items-center justify-center text-zinc-900 dark:text-zinc-100 active:scale-90 transition-all shrink-0 ${!hasSelection || isExporting ? 'opacity-30 cursor-not-allowed' : ''}`}
            >
              {isExporting ? (
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Desktop Controls Area */}
        <div className="hidden md:flex items-center justify-end h-11 relative shrink-0 -translate-y-1 gap-2.5 z-50">
          <div className="flex items-center bg-zinc-100/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 rounded-full h-full overflow-hidden shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300">
            <button 
              onClick={handleRandomMatchup}
              disabled={players.length < 2}
              className={`w-10 h-full flex items-center justify-center ${accentText} hover:bg-zinc-200 dark:hover:bg-zinc-800 active:scale-95 transition-all shrink-0 ${players.length < 2 ? 'opacity-30 cursor-not-allowed' : ''} group/btn`}
              title="random"
            >
               <svg className="w-4 h-4 transition-all duration-300 group-hover/btn:drop-shadow-[0_0_8px_rgba(214,10,7,0.4)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><path d="M12 12h.01"/><path d="M8 8h.01"/><path d="M16 8h.01"/><path d="M8 16h.01"/><path d="M16 16h.01"/>
              </svg>
            </button>
            <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800 shrink-0 opacity-50" />
            <button 
              onClick={handleSwapPlayers}
              disabled={!hasSelection}
              className={`w-10 h-full flex items-center justify-center transition-all shrink-0 group/btn ${hasSelection ? `${accentText} hover:bg-zinc-200 dark:hover:bg-zinc-800 active:scale-95 cursor-pointer` : 'text-zinc-300 dark:text-zinc-600 opacity-50 cursor-not-allowed'}`}
              title="swap players"
            >
              <svg className={`w-4 h-4 transition-all duration-300 ${hasSelection ? 'group-hover/btn:drop-shadow-[0_0_8px_rgba(214,10,7,0.4)]' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="m7 21-4-4 4-4"/><path d="M3 17h18"/><path d="m17 3 4 4-4 4"/><path d="M21 7H3"/>
              </svg>
            </button>
            <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800 shrink-0 opacity-50" />
            <button 
              onClick={handleExport}
              disabled={!hasSelection || isExporting}
              className={`w-10 h-full flex items-center justify-center ${accentText} hover:bg-zinc-200 dark:hover:bg-zinc-800 active:scale-95 transition-all shrink-0 ${!hasSelection || isExporting ? 'opacity-30 cursor-not-allowed' : ''} group/btn`}
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
            <button 
              onClick={resetTable}
              disabled={!hasSelection}
              className={`w-10 h-full flex items-center justify-center transition-all shrink-0 group/btn ${hasSelection ? `${accentText} hover:bg-zinc-200 dark:hover:bg-zinc-800 active:scale-95 cursor-pointer` : 'text-zinc-300 dark:text-zinc-600 opacity-50 cursor-not-allowed'}`}
              title="reset"
            >
              <svg className={`w-4 h-4 transition-all duration-300 ${hasSelection ? 'group-hover/btn:drop-shadow-[0_0_8px_rgba(214,10,7,0.4)]' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" />
              </svg>
            </button>
          </div>

          <div className="relative flex items-center gap-2.5 h-full" ref={pillAreaRef}>
            <div className={`flex items-center gap-2.5 h-full transition-opacity duration-300 ${isSearchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
              <div role="tablist" className="inline-flex items-center bg-zinc-100 dark:bg-zinc-900 rounded-full p-1.5 shadow-inner border border-zinc-200/50 dark:border-zinc-800/50 h-full shrink-0">
                <div className="flex gap-1 h-full items-center px-0.5">
                  {SEASONS.map((s) => {
                    const isActive = season === s;
                    return (
                      <button
                        key={s}
                        onClick={() => handleSeasonChange(s)}
                        className={`relative flex-none rounded-full font-black uppercase tracking-widest transition-colors duration-300 whitespace-nowrap px-4 py-2 text-[10px] ${isActive ? 'text-white' : 'text-zinc-400 dark:text-zinc-600 hover:text-zinc-900 dark:hover:text-zinc-300'}`}
                      >
                        <span className="relative z-20">{s}</span>
                        {isActive && (
                          <motion.div layoutId="compare-active-pill" className={`absolute inset-0 ${accentBg} rounded-full shadow-md z-10`} transition={{ type: "spring", stiffness: 500, damping: 35, mass: 0.6 }} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
              <button
                onClick={() => !isMaxPlayers && openSearch()}
                disabled={isMaxPlayers}
                className={`w-11 h-11 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-center ${accentText} shadow-sm hover:bg-zinc-200 dark:hover:bg-zinc-800 active:scale-95 transition-all shrink-0 ${isMaxPlayers ? 'opacity-30 cursor-not-allowed' : ''}`}
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
                      value={query}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setQuery(e.target.value); setShowResults(true); }}
                      placeholder={isMaxPlayers ? "Max players" : "Search players..."}
                      className="flex-1 bg-transparent border-none outline-none text-xs font-bold text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
                    />
                    <button onClick={closeSearch} className="w-7 h-7 flex items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-600 active:scale-90 transition-all">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {isSearchOpen && query && showResults && (
                <motion.div 
                  ref={resultsDropdownRef}
                  initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} 
                  className="absolute top-full right-0 mt-2 w-[18rem] md:w-[22rem] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl z-[1000] overflow-hidden"
                >
                  <ResultsList />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {hasSelection ? (
        <div ref={compareRef} className="relative bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-xl z-10">
           <div className="relative grid grid-cols-2 md:grid-cols-[1fr_120px_1fr] items-stretch bg-zinc-50/50 dark:bg-zinc-900/20 border-b border-zinc-100 dark:border-zinc-900">
              
              {/* Central VS Overlay (Mobile Only) */}
              <div className="md:hidden absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-300 dark:text-zinc-700 italic px-2 bg-zinc-50 dark:bg-[#121214] rounded-full">VS</span>
              </div>

              {/* Left Player Area */}
              <div className="px-2 py-6 md:px-8 md:py-4 flex items-center justify-center md:justify-start min-w-0">
                 <button
                   onClick={() => handleNameClick(0)}
                   disabled={!selectedNames[0]}
                   className={`flex flex-col md:flex-row items-center md:items-center gap-2 md:gap-3 focus:outline-none min-w-0 w-full group/name0 ${selectedNames[0] ? 'md:cursor-pointer md:hover:opacity-70 transition-opacity' : 'cursor-default'}`}
                   title={selectedNames[0] ? "Click to remove" : ""}
                 >
                   <RobloxAvatarImg username={selectedNames[0]} size={window.innerWidth <= 768 ? 'xl' : 'md'} />
                   <span className={`text-sm md:text-3xl font-medium md:font-black text-zinc-900 dark:text-zinc-100 uppercase truncate w-full text-left md:text-left ${selectedNames[0] ? 'md:group-hover:underline decoration-current underline-offset-4' : ''}`}>
                     {selectedNames[0] ? selectedNames[0] : '...'}
                   </span>
                 </button>
              </div>

              {/* VS Divider (Desktop Only) */}
              <div className="hidden md:flex px-2 md:px-0 text-center items-center justify-center shrink-0">
                 <span className="text-[11px] font-black uppercase tracking-widest text-zinc-300 dark:text-zinc-700 italic">VS</span>
              </div>

              {/* Right Player Area */}
              <div className="px-2 py-6 md:px-8 md:py-4 flex items-center justify-center md:justify-end min-w-0">
                 <button
                   onClick={() => handleNameClick(1)}
                   disabled={!selectedNames[1]}
                   className={`flex flex-col md:flex-row items-center md:items-center gap-2 md:gap-3 focus:outline-none min-w-0 w-full group/name1 ${selectedNames[1] ? 'md:cursor-pointer md:hover:opacity-70 transition-opacity' : 'cursor-default'}`}
                   title={selectedNames[1] ? "Click to remove" : ""}
                 >
                   <div className="flex flex-col md:hidden items-center gap-2 w-full">
                     <RobloxAvatarImg username={selectedNames[1]} size={window.innerWidth <= 768 ? 'xl' : 'md'} />
                     <span className={`text-sm font-medium text-zinc-900 dark:text-zinc-100 uppercase truncate w-full text-right`}>
                        {selectedNames[1] ? selectedNames[1] : '...'}
                     </span>
                   </div>
                   <div className="hidden md:flex flex-row items-center gap-3 w-full justify-end">
                     <span className={`text-3xl font-black tracking-tighter text-zinc-900 dark:text-zinc-100 truncate uppercase ${selectedNames[1] ? 'group-hover:underline decoration-current underline-offset-4' : ''}`}>
                       {selectedNames[1] ? selectedNames[1] : '...'}
                     </span>
                     <RobloxAvatarImg username={selectedNames[1]} size="md" />
                   </div>
                 </button>
              </div>
           </div>
           <div className="flex flex-col">
              <SectionHeader title="Stats" />
              {categories.stats.map(cat => (
                <ComparisonRow 
                  key={cat.label} 
                  label={cat.label} 
                  leftVal={selectedStats[0] ? selectedStats[0][cat.key as keyof PlayerStats] : null} 
                  rightVal={selectedStats[1] ? selectedStats[1][cat.key as keyof PlayerStats] : null} 
                />
              ))}
              {season === 'all-time' ? (
                <>
                  <SectionHeader title="Ratings" />
                  {categories.ratings.map(cat => (
                    <ComparisonRow 
                      key={cat.label} 
                      label={cat.label} 
                      leftVal={selectedStats[0] ? selectedStats[0][cat.key as keyof PlayerStats] : null} 
                      rightVal={selectedStats[1] ? selectedStats[1][cat.key as keyof PlayerStats] : null} 
                    />
                  ))}
                  {showAwards && awardsData && (
                    <>
                      <SectionHeader title="Awards" />
                      {awardsData.categories.map(cat => {
                        if (!cat) return null;
                        const normCat = String(cat).toLowerCase().trim();
                        const isBool = ['ROTY', 'HOF'].includes(String(cat).toUpperCase());
                        
                        const normPlayer1 = normalizeName(selectedNames[0] || '');
                        const normPlayer2 = normalizeName(selectedNames[1] || '');
                        
                        const leftRaw = normPlayer1 ? awardsData.byPlayer[normPlayer1]?.[normCat] : null;
                        const rightRaw = normPlayer2 ? awardsData.byPlayer[normPlayer2]?.[normCat] : null;

                        // Filter: If both are effectively 0/null/empty, skip the row
                        const leftNum = parseValue(leftRaw);
                        const rightNum = parseValue(rightRaw);
                        if (!isBool && leftNum === 0 && rightNum === 0) return null;
                        if (isBool && !isYes(leftRaw) && !isYes(rightRaw)) return null;

                        if (isBool) return <BooleanComparisonRow key={cat} label={cat} leftRaw={leftRaw} rightRaw={rightRaw} />;
                        
                        const leftVal = normPlayer1 ? (leftRaw || 0) : 0;
                        const rightVal = normPlayer2 ? (rightRaw || 0) : null;
                        return <ComparisonRow key={cat} label={cat} leftVal={leftVal} rightVal={rightVal} />;
                      })}
                    </>
                  )}
                </>
              ) : (
                <>
                  {showAverages && (
                    <>
                      <SectionHeader title="Averages" />
                      {categories.averages.map(cat => (
                        <ComparisonRow 
                          key={cat.label} 
                          label={cat.label} 
                          leftVal={selectedStats[0] ? selectedStats[0][cat.key as keyof PlayerStats] : null} 
                          rightVal={selectedStats[1] ? selectedStats[1][cat.key as keyof PlayerStats] : null} 
                        />
                      ))}
                    </>
                  )}
                  {showRatings && (
                    <>
                      <SectionHeader title="Ratings" />
                      {categories.ratings.map(cat => (
                        <ComparisonRow 
                          key={cat.label} 
                          label={cat.label} 
                          leftVal={selectedStats[0] ? selectedStats[0][cat.key as keyof PlayerStats] : null} 
                          rightVal={selectedStats[1] ? selectedStats[1][cat.key as keyof PlayerStats] : null} 
                        />
                      ))}
                    </>
                  )}
                </>
              )}
           </div>
        </div>
      ) : (
        <motion.div 
          initial={false}
          animate={{ minHeight: expectedTableHeight }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="flex flex-col items-center pt-20 md:pt-32 text-center border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-[2rem] md:rounded-[3rem] px-6 transition-all duration-300"
        >
          <div className="space-y-1">
            <h3 className="text-lg md:text-xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">ready to compare</h3>
            <p className="text-[10px] md:text-xs font-bold text-zinc-400 dark:text-zinc-600 tracking-widest">search player usernames to start</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ComparePage;
