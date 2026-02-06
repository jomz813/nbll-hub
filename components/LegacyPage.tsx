
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

  const DropdownIcon = () => (
    <svg className="w-3 h-3 text-zinc-400 dark:text-zinc-500 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );

  return (
    <div className="space-y-10 animate-page-enter">
      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 items-start">
        <div className="flex items-center justify-between w-full md:w-auto relative min-h-[4rem]">
          <h2 
            className={`text-4xl md:text-6xl font-black tracking-tighter shrink-0 select-none ${settings.rahBizzyTheme ? 'text-[#3B82F6]' : 'text-zinc-900 dark:text-white'}`}
          >
            legacy vault
          </h2>
        </div>

        {/* Mobile Dropdown Selector - Matches Stats page mobile behavior proportions */}
        <div className="md:hidden flex items-center gap-3 w-fit pr-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 shrink-0">Section</span>
          <div className="relative w-32">
            <select 
              value={activeSegment}
              onChange={(e) => setActiveSegment(e.target.value as Segment)}
              className="w-full bg-zinc-100 dark:bg-zinc-800 border-none rounded-lg py-2 pl-3 pr-8 text-xs font-bold text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-zinc-200 dark:focus:ring-zinc-700 outline-none appearance-none"
            >
              {segments.map(seg => (
                <option key={seg.id} value={seg.id}>{seg.label.toLowerCase()}</option>
              ))}
            </select>
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
              <DropdownIcon />
            </div>
          </div>
        </div>

        {/* Desktop Segmented Control - Styled to match Stats page season selector */}
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

      {/* Content Area */}
      <div className="relative min-h-[400px]">
        <AnimatePresence mode="wait">
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
