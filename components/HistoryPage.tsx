
import React, { useState, useEffect, useRef, useMemo, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';
import { fetchS10Stats } from '../data/s10Stats';
import { fetchS11Stats } from '../data/s11Stats';

interface HistorySeason {
  id: number;
  champion: string;
  mvp: string;
  isPending?: boolean;
}

type HistoryFilter = 'All' | 'Teams' | 'MVPs' | 'Rosters';

const historyData: HistorySeason[] = [
  { id: 11, champion: 'Milwaukee Bucks', mvp: 'Aim' },
  { id: 10, champion: 'Miami Heat', mvp: 'Pansho' },
  { id: 9, champion: 'Cleveland Cavaliers', mvp: 'Packed' },
  { id: 8, champion: 'New York Knicks', mvp: 'Aim' },
  { id: 7, champion: 'Sacramento Kings', mvp: 'Rah' },
  { id: 6, champion: 'Cleveland Cavaliers', mvp: 'Dannygreen' },
  { id: 5, champion: 'OKC Thunder', mvp: 'Pansho' },
  { id: 4, champion: 'Houston Rockets', mvp: 'PunkMonk' },
  { id: 3, champion: 'Golden State Warriors', mvp: 'Marsh' },
  { id: 2, champion: 'Chicago Bulls', mvp: 'Tend' },
  { id: 1, champion: 'Chicago Bulls', mvp: 'Tend' },
];

const rosters: Record<number, string[]> = {
  1: ["2hyped", "Koda", "Mateo", "Pansho", "Tend"],
  2: ["Pansho", "Roro", "Tend", "Verse"],
  3: ["CryptikNebula", "Pansho", "Shray", "Soulz"],
  4: ["Jay", "Pansho", "PunkMonk", "Sinful", "Verse"],
  5: ["Aesir", "Aev", "Nero", "Pansho", "Purple", "Soxxer (FO)", "Wisn"],
  6: ["1luv", "Albrx", "Chxno", "Dannygreen", "Junior", "Packed", "Polar", "Pansho", "Taser"],
  7: ["Bum", "Pansho", "Polar", "Rah", "Silver (FO)", "Taser", "Void"],
  8: ["1luv", "Aim", "Albrx", "Chicken", "Dre", "Pansho", "Polar", "Taser"],
  9: ["Albrx", "Cola", "CompShxrp", "i2qn", "Jamal", "Packed", "Pansho", "Rah", "Soulz"],
  10: ["Albrx", "Anyrode", "Chxno", "Dre", "gmz", "Junior", "Paris", "Pansho", "Polar", "Red", "Taser"],
  11: ["6Flags", "Aim", "Bum", "Doge", "Green", "PraiseCam", "Soulz", "Suki", "Taser", "Virnadol"]
};

const USERNAME_MAPPING: Record<number, Record<string, string>> = {
  10: {
    "Dre": "aDrexelAvenue886",
    "gmz": "heygmz",
    "Junior": "jr49ers12",
    "Pansho": "ff2frs",
    "Polar": "polurhx",
    "Taser": "iTxser"
  },
  11: {
    "Aim": "dndaim",
    "Bum": "Xlerent",
    "Doge": "dogeshadowdragon",
    "Green": "green_138",
    "PraiseCam": "Offprkx_13",
    "Soulz": "qleerinsGoon1",
    "Suki": "666detached",
    "Taser": "iTxser"
  }
};

const AVATAR_CACHE: Record<string, string | null> = {};

const StatPreview: React.FC<{ 
  player: string, 
  username: string,
  stats: any, 
  loadingStats: boolean,
  onClose: () => void, 
  anchorRect?: DOMRect,
  accentText: string,
  accentBg: string,
  reducedMotion: boolean,
  seasonId: number,
  isMobile: boolean,
  filter: HistoryFilter
}> = ({ player, username, stats, loadingStats, onClose, anchorRect, accentText, accentBg, reducedMotion, seasonId, isMobile, filter }) => {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [loadingAvatar, setLoadingAvatar] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const isRostersActive = filter === 'Rosters';

  useEffect(() => {
    if (AVATAR_CACHE[username] !== undefined) {
      setAvatar(AVATAR_CACHE[username]);
      return;
    }
    setLoadingAvatar(true);
    fetch(`/.netlify/functions/robloxAvatar?username=${encodeURIComponent(username)}`)
      .then(res => res.json())
      .then(data => {
        AVATAR_CACHE[username] = data.imageUrl || null;
        setAvatar(data.imageUrl || null);
      })
      .catch(() => {
        AVATAR_CACHE[username] = null;
      })
      .finally(() => setLoadingAvatar(false));
  }, [username]);

  useEffect(() => {
    if (!isMobile) {
      const handleEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
      const handleClickOutside = (e: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) onClose();
      };
      const timer = setTimeout(() => {
        window.addEventListener('keydown', handleEsc);
        window.addEventListener('mousedown', handleClickOutside);
      }, 0);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('keydown', handleEsc);
        window.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [onClose, isMobile]);

  const containerStyle: React.CSSProperties = isMobile ? {
    position: 'absolute',
    left: isRostersActive ? 12 : 0,
    right: isRostersActive ? 12 : 0,
    bottom: isRostersActive ? 12 : 0,
    top: isRostersActive ? 12 : 'auto',
    maxHeight: isRostersActive ? 'calc(100% - 24px)' : 'none',
    zIndex: 100,
    display: 'flex',
    flexDirection: 'column'
  } : {
    position: 'fixed',
    top: Math.max(100, Math.min(window.innerHeight - 340, (anchorRect?.top ?? 0) + 40)),
    left: Math.max(20, Math.min(window.innerWidth - 300, (anchorRect?.left ?? 0))),
    zIndex: 1001
  };

  const variants = isMobile ? {
    hidden: { y: '100%' },
    visible: { y: 0 },
    exit: { y: '100%' }
  } : {
    hidden: { opacity: 0, scale: 0.9, y: 10 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.9, y: 10 }
  };

  return (
    <motion.div
      ref={modalRef}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants}
      transition={{ duration: reducedMotion ? 0.05 : 0.28, ease: [0.16, 1, 0.3, 1] }}
      style={containerStyle}
      className={`
        bg-white/95 dark:bg-zinc-900/95 backdrop-blur-2xl border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden
        ${isMobile ? (isRostersActive ? 'rounded-[2rem] border' : 'rounded-t-[2rem] border-t') : 'w-[280px] rounded-[2.5rem] p-6 md:border'}
      `}
    >
      <div className={`flex-1 overflow-y-auto no-scrollbar ${isMobile ? "p-8" : ""}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`px-2.5 py-1 rounded-full border-2 ${accentText} border-current bg-transparent shrink-0`}>
              <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">S{seasonId} STATS</span>
            </div>
            <div className="h-px w-8 bg-zinc-100 dark:bg-zinc-800" />
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); onClose(); }} 
            className={`${isMobile ? 'absolute top-6 right-6' : ''} p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 active:scale-90 z-20`}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>
        <div className="flex items-center gap-5 mb-8">
          <div className="relative shrink-0">
             <div className="w-16 h-16 rounded-[1.5rem] bg-zinc-50 dark:bg-zinc-800 overflow-hidden border border-zinc-100 dark:border-zinc-800 flex items-center justify-center">
                {loadingAvatar ? (
                  <div className="w-full h-full animate-pulse bg-zinc-100 dark:bg-zinc-700" />
                ) : avatar ? (
                  <img src={avatar} className="w-full h-full object-cover" alt="" />
                ) : (
                  <svg className="w-8 h-8 text-zinc-300 dark:text-zinc-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                )}
             </div>
             <div className={`absolute -bottom-1 -right-1 w-5 h-5 ${accentBg} rounded-full border-2 border-white dark:border-zinc-900 flex items-center justify-center`}>
                <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="20 6 9 17 4 12"/></svg>
             </div>
          </div>
          <div className="min-w-0">
            <h4 className="text-lg font-black text-zinc-900 dark:text-white truncate uppercase tracking-tighter leading-none mb-1">{username}</h4>
            <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] block">{player}</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'PTS', val: stats?.pts ?? 0, highlight: true },
            { label: 'AST', val: stats?.ast ?? 0 },
            { label: 'REB', val: stats?.reb ?? 0 },
            { label: 'STL', val: stats?.stl ?? 0 },
            { label: 'GP', val: stats?.gp ?? 0 },
            { label: 'EFF', val: stats?.eff ?? 0, bold: true },
          ].map((st, i) => (
            <div key={i} className={`flex flex-col items-center justify-center py-3.5 px-2 rounded-2xl border transition-colors ${st.highlight ? 'bg-zinc-50 dark:bg-zinc-800/50 border-zinc-100 dark:border-zinc-800/50' : 'border-transparent'}`}>
              <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">{st.label}</span>
              <span className={`text-base tabular-nums tracking-tight leading-none ${st.highlight ? accentText : 'text-zinc-900 dark:text-zinc-100'} ${st.bold || st.highlight ? 'font-black' : 'font-bold'}`}>
                {st.val}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const HistoryPage: React.FC = () => {
  const { settings, getThemeColors } = useSettings();
  const colors = getThemeColors();
  const accentBg = colors.bg;
  const accentText = colors.text;

  const [filter, setFilter] = useState<HistoryFilter>('All');
  const [openSeasonId, setOpenSeasonId] = useState<number | null>(null);
  const [s10Stats, setS10Stats] = useState<any[]>([]);
  const [s11Stats, setS11Stats] = useState<any[]>([]);
  const [loadingGlobalStats, setLoadingGlobalStats] = useState(true);
  const [activePreview, setActivePreview] = useState<{ 
    player: string, 
    username: string,
    seasonId: number, 
    rect?: DOMRect
  } | null>(null);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [timelineHeight, setTimelineHeight] = useState<number>(0);
  const seasonsListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    const load = async () => {
      try {
        const [s10, s11] = await Promise.all([fetchS10Stats(), fetchS11Stats()]);
        setS10Stats(s10);
        setS11Stats(s11);
      } catch (e) {
        console.error("Failed to prefetch history stats", e);
      } finally {
        setLoadingGlobalStats(false);
      }
    };
    load();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update timeline height based on seasons list bounds
  useLayoutEffect(() => {
    if (!seasonsListRef.current) return;
    const update = () => {
      if (seasonsListRef.current) {
        setTimelineHeight(seasonsListRef.current.offsetHeight);
      }
    };
    const observer = new ResizeObserver(update);
    observer.observe(seasonsListRef.current);
    update();
    return () => observer.disconnect();
  }, [filter, openSeasonId]);

  const toggleRoster = (id: number) => {
    setOpenSeasonId(openSeasonId === id ? null : id);
  };

  const handleRosterNameClick = (e: React.MouseEvent, name: string, seasonId: number, mappedUsername: string) => {
    e.stopPropagation();
    if (activePreview?.username === mappedUsername && activePreview?.seasonId === seasonId) {
      setActivePreview(null);
      return;
    }
    setActivePreview({
      player: name,
      username: mappedUsername,
      seasonId,
      rect: e.currentTarget.getBoundingClientRect()
    });
  };

  const renderRosterChip = (name: string, seasonId: number) => {
    const isFO = name.includes('(FO)');
    const displayName = name.replace('(FO)', '').trim();
    const mappedUsername = USERNAME_MAPPING[seasonId]?.[displayName];
    const isInteractive = !!mappedUsername && (seasonId === 10 || seasonId === 11);

    return (
      <motion.div
        key={name}
        variants={{
          hidden: { opacity: 0, y: 5 },
          show: { opacity: 1, y: 0 }
        }}
        onClick={(e) => isInteractive && handleRosterNameClick(e, displayName, seasonId, mappedUsername)}
        className={`
          flex items-center gap-1.5 px-3.5 py-2 rounded-full transition-all duration-300
          ${isInteractive 
            ? `cursor-pointer bg-white dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 hover:border-current hover:shadow-md active:scale-95 group ${accentText}` 
            : 'cursor-default bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800/60'}
        `}
      >
        <span className={`text-[11px] md:text-xs font-bold transition-colors ${isInteractive ? 'text-zinc-900 dark:text-zinc-100 group-hover:text-current' : 'text-zinc-950 dark:text-zinc-200'}`}>
          {displayName}
        </span>
        {isFO && (
          <span className="text-[8px] font-black uppercase tracking-tighter px-1.5 py-0.5 bg-zinc-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400 rounded-md">
            FO
          </span>
        )}
      </motion.div>
    );
  };

  const previewStats = useMemo(() => {
    if (!activePreview) return null;
    const statsSource = activePreview.seasonId === 10 ? s10Stats : s11Stats;
    return statsSource.find(p => p.player.toLowerCase() === activePreview.username.toLowerCase());
  }, [activePreview, s10Stats, s11Stats]);

  const filterOptions: HistoryFilter[] = ['All', 'Teams', 'MVPs', 'Rosters'];

  const DropdownIcon = () => (
    <svg className="w-3 h-3 text-zinc-400 dark:text-zinc-500 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );

  return (
    <div className="pb-20 animate-page-enter">
      {/* Header + Filter Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 items-start">
        <h2 className={`text-4xl md:text-6xl font-black tracking-tighter ${settings.rahBizzyTheme ? 'text-[#3B82F6]' : 'text-zinc-900 dark:text-white'}`}>
          league history
        </h2>
        
        {/* Desktop Filter - Aligned right of header */}
        <div className="hidden md:flex items-center h-11 shrink-0">
          <div role="tablist" className="inline-flex items-center bg-zinc-100 dark:bg-zinc-900 rounded-full p-1.5 shadow-inner border border-zinc-200/50 dark:border-zinc-800/50 h-full shrink-0 overflow-hidden">
            <div className="flex gap-1 h-full items-center px-0.5">
              {filterOptions.map((opt) => {
                const isActive = filter === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => setFilter(opt)}
                    className={`relative flex-none rounded-full font-black uppercase tracking-widest transition-colors duration-300 px-6 py-2 text-[10px] z-10 ${isActive ? 'text-white' : 'text-zinc-400 dark:text-zinc-600 hover:text-zinc-900 dark:hover:text-zinc-300'}`}
                  >
                    <span className="relative z-20">{opt}</span>
                    {isActive && (
                      <motion.div 
                        layoutId="history-filter-pill" 
                        className={`absolute inset-0 ${accentBg} rounded-full shadow-md z-10`} 
                        transition={{ type: "spring", stiffness: 500, damping: 35, mass: 0.6 }} 
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Style Filter */}
        <div className="md:hidden w-full">
          <div className="w-full h-11 bg-zinc-100/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 rounded-full flex items-center overflow-hidden px-1 shadow-sm">
            <div className="relative flex-1 flex items-center px-4 h-full group justify-between">
              <span className="text-[8px] font-black uppercase tracking-[0.15em] text-zinc-400 shrink-0">FILTER</span>
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value as HistoryFilter)} 
                className="absolute inset-0 w-full h-full bg-transparent border-none text-[10px] font-black text-zinc-900 dark:text-zinc-100 outline-none appearance-none pr-10 text-right uppercase tracking-widest z-10"
              >
                {filterOptions.map(opt => <option key={opt} value={opt} className="dark:bg-zinc-900">{opt}</option>)}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 group-hover:translate-y-[-40%] transition-transform">
                <DropdownIcon />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        {/* Vertical Timeline Line - Fixed height logic based on list container */}
        <div 
          className="absolute left-2 md:left-2 w-px bg-zinc-200 dark:bg-zinc-800 z-0" 
          style={{ 
            top: isMobile ? '124px' : '0px', 
            height: isMobile ? 'calc(100% - 124px)' : `${timelineHeight}px` 
          }} 
        />

        <div ref={seasonsListRef} className="space-y-8 md:space-y-12">
          {historyData.map((season) => {
            const isRosterOpen = openSeasonId === season.id;
            const seasonRoster = rosters[season.id] || [];
            const isLocalPreviewActive = activePreview?.seasonId === season.id;

            const showChampion = filter === 'All' || filter === 'Teams';
            const showMVP = filter === 'All' || filter === 'MVPs';
            const showRosterUI = filter === 'All' || filter === 'Rosters';

            return (
              <motion.div 
                layout
                key={season.id} 
                className="relative flex flex-col md:flex-row items-start md:items-center"
              >
                {/* Dot Marker */}
                <div className={`absolute left-2 md:left-2 w-4 h-4 rounded-full border-4 border-white dark:border-zinc-950 ${accentBg} shadow-sm z-10 -translate-x-1/2 mt-8 md:mt-0`} />

                <div className="ml-10 md:ml-16 w-[calc(100%-2.5rem)] md:w-auto md:flex-1">
                  <div 
                    className={`bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] p-6 shadow-sm hover:shadow-md transition-all duration-300 group relative ${isLocalPreviewActive && isMobile && filter === 'Rosters' ? 'overflow-visible' : 'overflow-hidden'} ${isRosterOpen && showRosterUI ? 'ring-1 ring-current' : ''}`} 
                    style={{ borderColor: isRosterOpen && showRosterUI ? 'var(--accent)' : undefined }}
                  >
                    <AnimatePresence>
                      {isLocalPreviewActive && isMobile && (
                        <motion.div 
                          initial={{ opacity: 0 }} 
                          animate={{ opacity: 1 }} 
                          exit={{ opacity: 0 }} 
                          onClick={() => setActivePreview(null)}
                          className="absolute inset-0 bg-white/20 dark:bg-black/40 backdrop-blur-md z-[90] rounded-[2.5rem]"
                        />
                      )}
                    </AnimatePresence>

                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tighter">S{season.id}</h3>
                      <div className="flex items-center gap-3">
                        {showRosterUI && (
                          <button 
                            onClick={() => toggleRoster(season.id)}
                            aria-expanded={isRosterOpen}
                            className={`flex items-center gap-2 px-4 py-1.5 rounded-full border transition-all duration-300 active:scale-95 group/btn ${isRosterOpen ? `${accentBg} border-transparent text-white shadow-lg` : `bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:border-current ${accentText}`}`}
                          >
                             <svg className={`w-3.5 h-3.5 transition-transform duration-300 ${isRosterOpen ? 'rotate-180' : 'group-hover/btn:translate-y-0.5'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                            <span className="text-[10px] font-black uppercase tracking-widest">Roster</span>
                          </button>
                        )}
                        <div className={`hidden md:block px-3 py-1.5 rounded-full ${colors.bgSoft}`}>
                          <span className={`text-[10px] font-black uppercase tracking-widest ${colors.text}`}>Season {season.id}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <AnimatePresence mode="popLayout">
                        {showChampion && (
                          <motion.div 
                            key="champ-row"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800/50 group-hover:border-zinc-200 dark:group-hover:border-zinc-700 transition-colors overflow-hidden"
                          >
                            <div className="flex flex-col">
                              <span className="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-0.5">Champion</span>
                              <span className={`text-sm font-bold ${season.isPending ? 'text-zinc-400 dark:text-zinc-600 italic' : 'text-zinc-900 dark:text-zinc-100'}`}>{season.champion}</span>
                            </div>
                            <svg className={`w-5 h-5 ${season.isPending ? 'text-zinc-200 dark:text-zinc-700' : 'text-zinc-300 dark:text-zinc-600'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
                          </motion.div>
                        )}
                        {showMVP && (
                          <motion.div 
                            key="mvp-row"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800/50 group-hover:border-zinc-200 dark:group-hover:border-zinc-700 transition-colors overflow-hidden"
                          >
                            <div className="flex flex-col">
                              <span className="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-0.5">Finals MVP</span>
                              <span className={`text-sm font-bold ${season.isPending ? 'text-zinc-400 dark:text-zinc-600 italic' : 'text-zinc-900 dark:text-zinc-100'}`}>{season.mvp}</span>
                            </div>
                            <svg className={`w-5 h-5 ${season.isPending ? 'text-zinc-200 dark:text-zinc-700' : 'text-zinc-300 dark:text-zinc-600'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {showRosterUI && (
                      <AnimatePresence>
                        {isRosterOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0, marginTop: 0 }}
                            animate={{ height: 'auto', opacity: 1, marginTop: 24 }}
                            exit={{ height: 0, opacity: 0, marginTop: 0 }}
                            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800/50">
                              <SectionHeader title="Team Roster" />
                              <motion.div 
                                variants={{
                                  hidden: { opacity: 0 },
                                  show: { opacity: 1, transition: { staggerChildren: settings.reducedMotion ? 0 : 0.05 } }
                                }}
                                initial="hidden"
                                animate="show"
                                className="flex flex-wrap gap-2 mt-4"
                              >
                                {seasonRoster.map((name) => renderRosterChip(name, season.id))}
                              </motion.div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}

                    <AnimatePresence>
                      {isLocalPreviewActive && isMobile && (
                        <StatPreview 
                          player={activePreview.player}
                          username={activePreview.username}
                          stats={previewStats}
                          loadingStats={loadingGlobalStats}
                          onClose={() => setActivePreview(null)}
                          accentText={accentText}
                          accentBg={accentBg}
                          reducedMotion={settings.reducedMotion}
                          seasonId={season.id}
                          isMobile={true}
                          filter={filter}
                        />
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        <div className="absolute left-2 md:left-2 bottom-10 w-3 h-3 -translate-x-1/2 rounded-full bg-zinc-200 dark:bg-zinc-800" />
      </div>

      {!isMobile && createPortal(
        <AnimatePresence>
          {activePreview && (
            <StatPreview 
              player={activePreview.player}
              username={activePreview.username}
              stats={previewStats}
              loadingStats={loadingGlobalStats}
              onClose={() => setActivePreview(null)}
              anchorRect={activePreview.rect}
              accentText={accentText}
              accentBg={accentBg}
              reducedMotion={settings.reducedMotion}
              seasonId={activePreview.seasonId}
              isMobile={false}
              filter={filter}
            />
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <div className="flex items-center gap-3">
    <h4 className="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.25em] shrink-0">{title}</h4>
    <div className="h-px bg-zinc-100 dark:bg-zinc-800/50 flex-1" />
  </div>
);

export default HistoryPage;
