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

  const [season, setSeason] = useState<Season>('s12');
  const containerRef = useRef<HTMLDivElement>(null);

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

  // Keyboard Navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const currentIndex = SEASONS.indexOf(season);
    if (e.key === 'ArrowRight') {
      const nextIndex = (currentIndex + 1) % SEASONS.length;
      handleSeasonChange(SEASONS[nextIndex]);
    } else if (e.key === 'ArrowLeft') {
      const prevIndex = (currentIndex - 1 + SEASONS.length) % SEASONS.length;
      handleSeasonChange(SEASONS[prevIndex]);
    }
  };

  const renderView = () => {
    switch (season) {
      case 's10': return <S10StatsTable isEmbedded={true} />;
      case 's11': return <S11StatsTable isEmbedded={true} />;
      case 's12': return <S12StatsTable isEmbedded={true} />;
      case 'all-time': return <AllTimeStatsTable />;
      default: return <S12StatsTable isEmbedded={true} />;
    }
  };

  return (
    <div className="relative">
      {/* StatsHeaderRow - Flex container for Title + Selector alignment */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 items-start">
        <h2 className={`text-4xl md:text-6xl font-black tracking-tighter ${settings.rahBizzyTheme ? 'text-[#3B82F6]' : 'text-zinc-900 dark:text-white'}`}>
          player statistics
        </h2>

        {/* Season Selector - Shrink-to-fit mobile styling */}
        <div 
          ref={containerRef}
          role="tablist"
          aria-label="Select season"
          onKeyDown={handleKeyDown}
          className="
            inline-flex items-center bg-zinc-100 dark:bg-zinc-900 rounded-full p-1 shadow-inner border border-zinc-200/50 dark:border-zinc-800/50 overflow-hidden relative 
            w-auto max-w-[92vw] h-[42px] 
            md:h-auto md:p-1.5 md:-translate-y-1
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
                    px-4 py-2 text-[11px]
                    md:px-4 md:py-2 md:text-[10px]
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