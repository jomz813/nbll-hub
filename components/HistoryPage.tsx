import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';

type HistoryFilter = 'All' | 'Teams' | 'MVPs' | 'Rosters';

const uflHistory = [
  {
    season: 1,
    champion: "Pittsburg Steelers",
    runnerUp: "New England Patriots",
    sbMvp: "Wx",
    championRoster: [
      { position: "QB", player: "Rizzv2" },
      { position: "TE/DE", player: "Power" },
      { position: "WR", player: "Elite" },
      { position: "WR", player: "Wx", mvp: true },
      { position: "WR", player: "BaconBaller" },
      { position: "WR", player: "Twizzy" }
    ],
    runnerUpRoster: [
      { position: "QB", player: "Zipperable" },
      { position: "WR", player: "Trip" },
      { position: "WR", player: "Scottie" }
    ]
  },
  {
    season: 2,
    champion: "Philadelphia Eagles",
    runnerUp: "Arizona Cardinals",
    sbMvp: "WX",
    championRoster: [
      { position: "QB", player: "Epicly" },
      { position: "TE", player: "Jaybird" },
      { position: "WR", player: "WX", mvp: true },
      { position: "WR", player: "Good" },
      { position: "WR", player: "BigBolto" },
      { position: "WR", player: "Ghost" },
      { position: "WR", player: "Straps" }
    ],
    runnerUpRoster: [
      { position: "QB", player: "Slime" },
      { position: "TE/WR", player: "Oko" },
      { position: "WR", player: "Goku" },
      { position: "WR", player: "Plum" },
      { position: "WR", player: "Tutu" },
      { position: "WR", player: "Pickles" },
      { position: "WR", player: "Cookie" }
    ]
  },
  {
    season: 3,
    champion: "New Orleans Saints",
    runnerUp: "Los Angeles Chargers",
    sbMvp: "Jalen",
    championRoster: [
      { position: "QB", player: "Jalen", mvp: true },
      { position: "TE/DE", player: "Ktg" },
      { position: "WR", player: "Steve" },
      { position: "WR", player: "Symetrici" },
      { position: "WR", player: "Froze" },
      { position: "WR", player: "Dav" }
    ],
    championBench: ["Cruise", "Twizzy"],
    runnerUpRoster: [
      { position: "QB", player: "Slime" },
      { position: "TE/DE", player: "Oko" },
      { position: "WR", player: "Asenath" },
      { position: "WR", player: "Tutu" },
      { position: "WR", player: "Plum" },
      { position: "WR", player: "Chibi" }
    ]
  },
  {
    season: 4,
    champion: "Miami Dolphins",
    runnerUp: "Los Angeles Rams",
    sbMvp: "Marsh",
    championRoster: [
      { position: "QB", player: "Jalen" },
      { position: "TE", player: "KTG" },
      { position: "WR", player: "Steve" },
      { position: "WR", player: "Marsh", mvp: true },
      { position: "WR", player: "Dork" },
      { position: "WR", player: "Viper" }
    ],
    runnerUpRoster: [
      { position: "QB", player: "Scalp" },
      { position: "OL", player: "Illusional" },
      { position: "TE", player: "Kaara" },
      { position: "WR", player: "Six" },
      { position: "WR", player: "Fbislife" },
      { position: "WR", player: "Neon" },
      { position: "WR", player: "St. Breezy" }
    ]
  },
  {
    season: 5,
    champion: "Tennessee Titans",
    runnerUp: "Arizona Cardinals",
    sbMvp: "Facts",
    championRoster: [
      { position: "QB", player: "Swag" },
      { position: "OL/DE", player: "Rohun" },
      { position: "WR", player: "Wary" },
      { position: "WR", player: "Facts", mvp: true },
      { position: "WR", player: "Jaden" },
      { position: "WR", player: "Breezy" }
    ],
    runnerUpRoster: [
      { position: "QB", player: "Benmosetablet" },
      { position: "OL/DE", player: "Ryan" },
      { position: "WR", player: "Kaylee" },
      { position: "WR", player: "Steve" },
      { position: "WR", player: "Static" },
      { position: "WR", player: "Gerald" }
    ],
    runnerUpBench: ["Naugy"]
  },
  {
    season: 6,
    champion: "New Orlean Saints",
    runnerUp: "Houston Texans",
    sbMvp: "Kaara",
    championRoster: [
      { position: "QB", player: "Scalp" },
      { position: "OL/DE", player: "Kaara", mvp: true },
      { position: "WR", player: "Beast" },
      { position: "WR", player: "Breezy" },
      { position: "WR", player: "Spray" },
      { position: "WR", player: "Suc" },
      { position: "WR", player: "Rana" }
    ],
    runnerUpRoster: [
      { position: "QB", player: "Ben" },
      { position: "OL/DE", player: "Rider" },
      { position: "WR", player: "Silver" },
      { position: "WR", player: "Facts" },
      { position: "WR", player: "Jeaty" },
      { position: "WR", player: "Poser" },
      { position: "WR", player: "Elon" }
    ]
  },
  {
    season: 7,
    champion: "New Orleans Saints",
    runnerUp: "Cincinnati Bengals",
    sbMvp: "St. Breezy",
    championRoster: [
      { position: "QB", player: "Scalp" },
      { position: "OL/DE", player: "Woke" },
      { position: "TE", player: "Mirmir" },
      { position: "WR", player: "Beast" },
      { position: "WR", player: "St. Breezy", mvp: true },
      { position: "WR", player: "Spray" },
      { position: "WR", player: "Rana" }
    ],
    runnerUpRoster: [
      { position: "QB", player: "Jalen" },
      { position: "OL/DE", player: "Rohun" },
      { position: "TE", player: "Desty" },
      { position: "WR", player: "Lockdown" },
      { position: "WR", player: "Truzz" },
      { position: "WR", player: "Marsh" },
      { position: "WR", player: "Jaden" }
    ]
  },
  {
    season: 8,
    champion: "San Francisco 49ers",
    runnerUp: "Detroit Lions",
    sbMvp: "Truzz",
    championRoster: [
      { position: "QB", player: "Fashion" },
      { position: "OL/DE", player: "Shazam" },
      { position: "TE", player: "Good" },
      { position: "WR", player: "Truzz", mvp: true },
      { position: "WR", player: "Nova" },
      { position: "WR", player: "Glo DK" },
      { position: "WR", player: "Wary" }
    ],
    runnerUpRoster: [
      { position: "QB", player: "Jalen" },
      { position: "OL/DE", player: "Rohun" },
      { position: "TE", player: "Sylvia" },
      { position: "WR", player: "Swag" },
      { position: "WR", player: "Tae" },
      { position: "WR", player: "Facts" },
      { position: "WR", player: "Lux" }
    ]
  },
  {
    season: 9,
    champion: "San Francisco 49ers",
    runnerUp: "Minnesota Vikings",
    sbMvp: "Fashion",
    championRoster: [
      { position: "QB", player: "Fashion", mvp: true },
      { position: "OL/DE", player: "Mir" },
      { position: "TE/DE", player: "Silver" },
      { position: "WR", player: "Twizzy" },
      { position: "WR", player: "DK" },
      { position: "WR", player: "Jeaty" },
      { position: "WR", player: "Nova" }
    ],
    championBench: ["Wary"],
    runnerUpRoster: [
      { position: "QB", player: "Slime" },
      { position: "OL/DE", player: "Epicly" },
      { position: "TE/DE", player: "Oko" },
      { position: "WR", player: "Driss" },
      { position: "WR", player: "Xv" },
      { position: "WR", player: "Static" },
      { position: "WR", player: "Kame" }
    ]
  },
  {
    season: 10,
    champion: "Las Vegas Raiders",
    runnerUp: "Philadelphia Eagles",
    sbMvp: "Zach",
    championRoster: [
      { position: "QB", player: "Vajy" },
      { position: "OL/DE", player: "Ruby" },
      { position: "TE/DE", player: "Zach", mvp: true },
      { position: "WR", player: "Oxy" },
      { position: "WR", player: "Qin" },
      { position: "WR", player: "Sealio" },
      { position: "WR", player: "Naugy" }
    ],
    runnerUpRoster: [
      { position: "QB/DE", player: "Savior" },
      { position: "OL/DE", player: "Static" },
      { position: "TE", player: "Jeaty" },
      { position: "WR", player: "Nova" },
      { position: "WR", player: "Wary" },
      { position: "WR", player: "DK" },
      { position: "WR", player: "Truzz" }
    ]
  },
  {
    season: 11,
    champion: "Las Vegas Raiders",
    runnerUp: "Baltimore Ravens",
    sbMvp: "Tcay",
    championRoster: [
      { position: "QB/DE", player: "Konjure" },
      { position: "OL/DE", player: "Koda" },
      { position: "TE", player: "Vajy" },
      { position: "WR", player: "Ryan" },
      { position: "WR", player: "Tcay", mvp: true },
      { position: "WR", player: "Sealio" },
      { position: "WR", player: "RahBizzy" },
      { position: "WR", player: "Jeaty" }
    ],
    runnerUpRoster: [
      { position: "QB", player: "Ben" },
      { position: "OL/DE", player: "Epicly" },
      { position: "TE/DE", player: "Jaybird" },
      { position: "WR", player: "Mek" },
      { position: "WR", player: "Marsh" },
      { position: "WR", player: "Red" },
      { position: "WR", player: "DK" },
      { position: "WR", player: "Static" }
    ],
    runnerUpBench: ["Silver", "Alam", "crally"]
  },
  {
    season: 12,
    champion: "Washington Commanders",
    runnerUp: "Dallas Cowboys",
    sbMvp: "Static",
    championRoster: [
      { position: "QB", player: "Konjure" },
      { position: "OL/DE", player: "Koda" },
      { position: "TE/DE", player: "Mirmir" },
      { position: "WR", player: "RahBizzy" },
      { position: "WR", player: "Goodutify" },
      { position: "WR", player: "Wary" },
      { position: "WR", player: "Viper" },
      { position: "WR", player: "Static", mvp: true }
    ],
    runnerUpRoster: [
      { position: "QB", player: "Ben" },
      { position: "OL/DE", player: "Crally" },
      { position: "LOS/DE", player: "Desty" },
      { position: "WR", player: "Kromers" },
      { position: "WR", player: "Naugy" },
      { position: "WR", player: "Jaymerle" },
      { position: "WR", player: "Lord" },
      { position: "WR", player: "Roy" }
    ]
  },
  {
    season: 13,
    champion: "Atlanta Falcons",
    runnerUp: null,
    sbMvp: null,
    note: "FFW championship",
    championRoster: [
      { position: "QB/DE", player: "Konjure" },
      { position: "OL/DE", player: "Koda" },
      { position: "TE/SHORT", player: "Viper" },
      { position: "WR/SHORT", player: "Rahbizzy" },
      { position: "WR/DEEP", player: "Quinn" },
      { position: "WR/MLB", player: "Mao" },
      { position: "WR/DEEP", player: "Ryan" },
      { position: "WR/FS", player: "Jaymerle" }
    ],
    championBench: ["Medtronical"]
  },
  {
    season: 14,
    status: "NO DATA FOUND"
  },
  {
    season: 15,
    champion: "New Orleans Saints",
    runnerUp: "Jacksonville Jaguars",
    sbMvp: "Rahbizzy",
    championRoster: [
      { position: "QB/DE", player: "Konjure" },
      { position: "OL/DE", player: "Mirmir" },
      { position: "TE", player: "Power" },
      { position: "WR", player: "Ryan" },
      { position: "WR", player: "Quinn" },
      { position: "WR", player: "Rahbizzy", mvp: true },
      { position: "WR", player: "Jeaty" },
      { position: "WR", player: "Zxch" }
    ],
    runnerUpRoster: [
      { position: "QB/FS", player: "Noka" },
      { position: "OL/DE", player: "Will" },
      { position: "TE/DE", player: "Alam" },
      { position: "WR", player: "Sealio" },
      { position: "WR", player: "Red" },
      { position: "WR", player: "Woa" },
      { position: "WR", player: "Chucky" },
      { position: "WR", player: "Oxy" }
    ],
    runnerUpBench: ["A2ways"]
  },
  {
    season: 16,
    status: "PENDING"
  }
];

const HistoryPage: React.FC = () => {
  const { settings, getThemeColors } = useSettings();
  const colors = getThemeColors();
  const accentBg = colors.bg;
  const accentText = colors.text;

  const [filter, setFilter] = useState<HistoryFilter>('All');
  const [openSeasonIds, setOpenSeasonIds] = useState<number[]>([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [timelineHeight, setTimelineHeight] = useState<number>(0);
  const seasonsListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
  }, [filter, openSeasonIds]);

  useEffect(() => {
    if (filter === 'Rosters' && !isMobile) {
      setOpenSeasonIds(uflHistory.map(s => s.season));
    }
  }, [filter, isMobile]);

  const toggleRoster = (id: number) => {
    setOpenSeasonIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const renderRosterChip = (entry: any) => {
    const isObject = typeof entry !== 'string';
    const player = isObject ? entry.player : entry;
    const position = isObject ? entry.position : null;
    const mvp = isObject ? entry.mvp : false;
    
    return (
      <div
        key={player}
        className={`
          flex items-center gap-0.5 md:gap-1.5 px-0 py-0.5 md:px-3.5 md:py-2 md:rounded-full transition-all duration-300 relative
          md:bg-zinc-50 md:dark:bg-zinc-800/40 md:border md:border-zinc-100 md:dark:border-zinc-800/60
        `}
      >
        <span className={`text-[12px] md:text-xs font-semibold md:font-bold transition-colors text-zinc-700 dark:text-zinc-300 md:text-zinc-950 md:dark:text-zinc-200 tracking-tight`}>
          {player}
        </span>
        {position && (
          <span className="hidden md:inline-flex text-[8px] font-black uppercase tracking-tighter px-1.5 py-0.5 bg-zinc-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400 rounded-md">
            {position}
          </span>
        )}
        {mvp && (
          <span className={`static md:absolute ml-0.5 md:ml-0 md:-top-1.5 md:-right-1.5 w-2.5 h-2.5 md:w-4 md:h-4 ${accentBg} rounded-full flex md:border md:border-white md:dark:border-zinc-900 items-center justify-center shrink-0`}>
            <svg className="w-1.5 h-1.5 md:w-2.5 md:h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
          </span>
        )}
      </div>
    );
  };

  const reversedHistory = [...uflHistory].reverse();

  return (
    <div className="pb-20 animate-page-enter">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 items-start">
        <h2 className={`text-4xl md:text-6xl font-black tracking-tighter ${settings.rahBizzyTheme ? 'text-[#3B82F6]' : 'text-zinc-900 dark:text-white'}`}>
          league history
        </h2>
      </div>

      <div className="relative">
        <div 
          className="absolute left-2 md:left-2 w-px bg-zinc-200 dark:bg-zinc-800 z-0" 
          style={{ 
            top: '0px', 
            height: `${timelineHeight}px` 
          }} 
        />

        <div ref={seasonsListRef} className="space-y-8 md:space-y-12">
          {reversedHistory.map((seasonData) => {
            const isRosterOpen = openSeasonIds.includes(seasonData.season);
            const isPending = seasonData.status === "PENDING";
            const noData = seasonData.status === "NO DATA FOUND";
            const isAbnormal = isPending || noData;

            const showChampion = filter === 'All' || filter === 'Teams';
            const showMVP = filter === 'All' || filter === 'MVPs';
            const showRosterUI = filter === 'All' || filter === 'Rosters';

            return (
              <motion.div 
                layout
                key={seasonData.season} 
                className="relative flex flex-col md:flex-row items-start md:items-center"
              >
                <div className={`absolute left-2 md:left-2 w-4 h-4 rounded-full border-4 border-white dark:border-zinc-950 ${accentBg} shadow-sm z-10 -translate-x-1/2 mt-8 md:mt-0`} />

                <div className="ml-10 md:ml-16 w-[calc(100%-2.5rem)] md:w-auto md:flex-1">
                  <div 
                    className={`bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] p-6 shadow-sm transition-all duration-300 relative overflow-hidden ${isRosterOpen && showRosterUI && !isAbnormal ? 'ring-1 ring-current' : ''}`} 
                    style={{ borderColor: isRosterOpen && showRosterUI && !isAbnormal ? 'var(--accent)' : undefined }}
                  >

                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                         <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tighter">S{seasonData.season}</h3>
                         {seasonData.note && (
                           <span className="hidden md:inline-block text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md">
                             * {seasonData.note}
                           </span>
                         )}
                      </div>
                      <div className="flex items-center gap-3">
                        {showRosterUI && !isAbnormal && (
                          <button 
                            onClick={() => toggleRoster(seasonData.season)}
                            aria-expanded={isRosterOpen}
                            className={`flex items-center gap-2 px-4 py-1.5 rounded-full border transition-all duration-300 active:scale-95 group/btn ${isRosterOpen ? `${accentBg} border-transparent text-white shadow-lg` : `bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:border-current ${accentText}`}`}
                          >
                             <svg className={`w-3.5 h-3.5 transition-transform duration-300 ${isRosterOpen ? 'rotate-180' : 'group-hover/btn:translate-y-0.5'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                            <span className="text-[10px] font-black uppercase tracking-widest">Finalists</span>
                          </button>
                        )}
                        <div className={`hidden md:block px-3 py-1.5 rounded-full ${colors.bgSoft}`}>
                          <span className={`text-[10px] font-black uppercase tracking-widest ${colors.text}`}>Season {seasonData.season}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <AnimatePresence mode="popLayout">
                        {isAbnormal && (
                          <motion.div 
                            key="abnormal-row"
                            className="flex items-center justify-center p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800/50 overflow-hidden"
                          >
                            <span className="text-[11px] font-black uppercase tracking-[0.25em] text-zinc-400 dark:text-zinc-500">
                              {seasonData.status}
                            </span>
                          </motion.div>
                        )}

                        {!isAbnormal && showChampion && seasonData.champion && (
                          <motion.div 
                            key="champ-row"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800/50 overflow-hidden"
                          >
                            <div className="flex flex-col">
                              <span className="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-0.5">Champion</span>
                              <span className={`text-sm font-bold text-zinc-900 dark:text-zinc-100`}>{seasonData.champion}</span>
                            </div>
                            <svg className={`w-5 h-5 text-zinc-300 dark:text-zinc-600`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
                          </motion.div>
                        )}
                        {!isAbnormal && showMVP && seasonData.sbMvp && (
                          <motion.div 
                            key="mvp-row"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800/50 overflow-hidden"
                          >
                            <div className="flex flex-col">
                              <span className="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-0.5">Super Bowl MVP</span>
                              <span className={`text-sm font-bold text-zinc-900 dark:text-zinc-100`}>{seasonData.sbMvp}</span>
                            </div>
                            <svg className={`w-5 h-5 text-zinc-300 dark:text-zinc-600`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {!isAbnormal && showRosterUI && (
                      <AnimatePresence>
                        {isRosterOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0, marginTop: 0 }}
                            animate={{ height: 'auto', opacity: 1, marginTop: 24 }}
                            exit={{ height: 0, opacity: 0, marginTop: 0 }}
                            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800/50 space-y-8 relative">
                              {seasonData.championRoster && (
                                <div className="space-y-3 md:space-y-4">
                                  <SectionHeader title="Champions" rightValue={seasonData.champion} />
                                  <div className="px-1 relative">
                                    <div className="flex flex-wrap gap-x-3 gap-y-1 md:gap-2 items-center">
                                      {seasonData.championRoster.map((entry) => renderRosterChip(entry))}
                                    </div>
                                  </div>
                                  {seasonData.championBench && seasonData.championBench.length > 0 && (
                                     <div className="px-1 mt-1.5 md:mt-2">
                                       <span className="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1 md:mb-2 block">Bench</span>
                                       <div className="flex flex-wrap gap-x-3 gap-y-1 md:gap-2 items-center">
                                         {seasonData.championBench.map(entry => renderRosterChip(entry))}
                                       </div>
                                     </div>
                                  )}
                                </div>
                              )}

                              {seasonData.runnerUpRoster && (
                                <div className="space-y-3 md:space-y-4">
                                  <SectionHeader title="Runner Ups" rightValue={seasonData.runnerUp} />
                                  <div className="px-1 relative">
                                    <div className="flex flex-wrap gap-x-3 gap-y-1 md:gap-2 items-center">
                                      {seasonData.runnerUpRoster.map((entry) => renderRosterChip(entry))}
                                    </div>
                                  </div>
                                  {seasonData.runnerUpBench && seasonData.runnerUpBench.length > 0 && (
                                     <div className="px-1 mt-1.5 md:mt-2">
                                       <span className="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1 md:mb-2 block">Bench</span>
                                       <div className="flex flex-wrap gap-x-3 gap-y-1 md:gap-2 items-center">
                                         {seasonData.runnerUpBench.map(entry => renderRosterChip(entry))}
                                       </div>
                                     </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        <div className="absolute left-2 md:left-2 bottom-10 w-3 h-3 -translate-x-1/2 rounded-full bg-zinc-200 dark:bg-zinc-800" />
      </div>
    </div>
  );
};

const SectionHeader: React.FC<{ title: string, rightValue?: string | null }> = ({ title, rightValue }) => (
  <div className="flex items-center gap-3 w-full">
    <h4 className="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.25em] shrink-0">{title}</h4>
    <div className="h-px bg-zinc-100 dark:bg-zinc-800/50 flex-1" />
    {rightValue && (
      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-900 dark:text-zinc-100 shrink-0">
        {rightValue}
      </span>
    )}
  </div>
);

export default HistoryPage;
