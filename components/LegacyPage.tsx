import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HallOfFamePage from './HallOfFamePage';
import RecordsPage from './RecordsPage';
import { useSettings } from '../context/SettingsContext';

type Segment = 'hof' | 'records';

interface LegacyPageProps {
  initialSegment?: Segment;
}

const LegacyPage: React.FC<LegacyPageProps> = ({ initialSegment = 'hof' }) => {
  const [activeSegment, setActiveSegment] = useState<Segment>(initialSegment);
  const { settings, getThemeColors } = useSettings();
  const colors = getThemeColors();

  // Sync state if initialSegment changes (e.g. from parent navigation)
  useEffect(() => {
    setActiveSegment(initialSegment);
  }, [initialSegment]);

  const segments: { id: Segment; label: string }[] = [
    { id: 'hof', label: 'HALL OF FAME' },
    { id: 'records', label: 'RECORDS' }
  ];

  const isHOF = activeSegment === 'hof';

  return (
    <div className="space-y-10 animate-page-enter">
      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4 md:mb-12 items-start">
        <div className="flex items-center justify-between w-full md:w-auto relative min-h-[4rem]">
          <h2 
            className={`text-4xl md:text-6xl font-black tracking-tighter shrink-0 select-none ${settings.rahBizzyTheme ? 'text-[#3B82F6]' : 'text-zinc-900 dark:text-white'}`}
          >
            legacy vault
          </h2>
        </div>

        {/* Desktop Segmented Control */}
        <div 
          role="tablist"
          aria-label="Select legacy view"
          className="hidden md:inline-flex items-center bg-zinc-100 dark:bg-zinc-900 rounded-full p-1.5 shadow-inner border border-zinc-200/50 dark:border-zinc-800/50 overflow-hidden relative w-full md:w-auto"
        >
          {segments.map((seg) => {
            const isActive = activeSegment === seg.id;
            return (
              <button
                key={seg.id}
                role="tab"
                aria-selected={isActive}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActiveSegment(seg.id)}
                className={`
                  relative flex-1 md:flex-none px-6 md:px-10 py-2 text-[10px] font-black uppercase tracking-widest transition-colors duration-300 whitespace-nowrap z-10 outline-none rounded-full
                  ${isActive ? 'text-white' : 'text-zinc-400 dark:text-zinc-600 hover:text-zinc-900 dark:hover:text-zinc-300'}
                `}
              >
                <span className="relative z-20">{seg.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="legacy-active-pill"
                    className={`absolute inset-0 ${colors.bg} rounded-full shadow-md z-10`}
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

      {/* Mobile-only Premium Mini-Nav (Non-Sticky) */}
      <div className="md:hidden w-full pb-4">
        <div className="w-full h-11 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl shadow-xl overflow-hidden relative flex items-center">
          {/* Vertical Center Divider */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-5 bg-zinc-200 dark:bg-zinc-800/60 z-10" />
          
          {segments.map((seg) => {
            const isActive = activeSegment === seg.id;
            return (
              <button
                key={seg.id}
                onClick={() => setActiveSegment(seg.id)}
                className={`relative flex-1 h-full text-[10px] font-black uppercase tracking-widest transition-colors duration-300 outline-none ${
                  isActive ? colors.text : 'text-zinc-400 dark:text-zinc-600'
                }`}
              >
                {seg.label}
              </button>
            );
          })}

          {/* Sliding Bottom Indicator */}
          <motion.div
            initial={false}
            animate={{ x: isHOF ? 0 : '100%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
            className="absolute bottom-0 left-0 w-1/2 h-[3px] px-4"
          >
            <div 
              className="w-full h-full rounded-t-full shadow-[0_-2px_10px_rgba(0,0,0,0.1)]" 
              style={{ backgroundColor: 'var(--accent)' }}
            />
          </motion.div>
        </div>
      </div>

      {/* Content Area */}
      <div className="relative min-h-[400px]">
        <AnimatePresence>
          <motion.div
            key={activeSegment}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {activeSegment === 'hof' ? (
              <HallOfFamePage />
            ) : (
              <RecordsPage />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LegacyPage;