
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { TabID } from '../App';
import { recordsData } from '../data/records';
import { useSettings } from '../context/SettingsContext';

export interface SearchOrigin {
  x: number;
  y: number;
  w: number;
  h: number;
}

// --- SEARCH DATA ---
const PLAYERS = [
  { name: 'Michael Jordan', slug: 'michael-jordan' },
  { name: 'LeBron James', slug: 'lebron-james' },
  { name: 'Kobe Bryant', slug: 'kobe-bryant' },
  { name: 'Stephen Curry', slug: 'stephen-curry' },
];

const PAGES: { name: TabID; label: string; keywords?: string[] }[] = [
  { name: 'home', label: 'home' },
  { name: 'standings', label: 'standings' },
  { name: 'schedule', label: 'schedule' },
  { name: 'stats', label: 'stats' },
  { name: 'legacy', label: 'legacy' },
  { name: 'rules', label: 'rules' },
  { name: 'more', label: 'more' },
  { name: 'hall-of-fame', label: 'hall of fame', keywords: ['hof', 'legends', 'hall'] },
  { name: 'league-history', label: 'history', keywords: ['timeline', 'archives', 'history'] },
  { name: 'records', label: 'records', keywords: ['history', 'stats', 'highs', 'best'] },
  { name: 'credits', label: 'credits', keywords: ['contributors', 'staff', 'creators', 'team', 'devs'] },
];

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tabId: TabID) => void;
  origin: SearchOrigin | null;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose, onSelectTab, origin }) => {
  const { settings, getThemeColors } = useSettings();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  const colors = getThemeColors();
  const accentText = colors.text;
  const accentBg = colors.bg;

  // Search Logic
  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();

    // 1. Pages
    const matchedPages = PAGES.filter(p => 
      p.label.toLowerCase().includes(q) || p.keywords?.some(k => k.toLowerCase().includes(q))
    ).map(p => ({ 
      name: p.label, 
      tabId: p.name, 
      type: 'Page', 
      id: `page-${p.name}`,
      category: (p.name === 'hall-of-fame' || p.name === 'league-history' || p.name === 'records') ? 'Legacy' : 
                (p.name === 'credits') ? 'Team' : 'System'
    }));
    
    // 2. Players
    const matchedPlayers = PLAYERS.filter(p => p.name.toLowerCase().includes(q))
      .map(p => ({ name: p.name, tabId: `player-${p.slug}` as TabID, type: 'Player', id: `player-${p.slug}`, category: 'Legend' }));

    // 3. Records
    const matchedRecords = recordsData.flatMap(section => 
      section.items.filter(item => item.title.toLowerCase().includes(q) || item.valueLabel.toLowerCase().includes(q))
        .map(item => ({
          name: item.title,
          tabId: 'records' as TabID,
          type: 'Record',
          id: `record-${item.id}`,
          category: section.title
        }))
    );

    const combined = [];
    if (matchedPages.length) combined.push({ group: 'Pages', items: matchedPages });
    if (matchedRecords.length) combined.push({ group: 'Records', items: matchedRecords });
    if (matchedPlayers.length) combined.push({ group: 'Players', items: matchedPlayers });
    
    return combined;
  }, [query]);

  const flatResults = useMemo(() => results.flatMap(g => g.items), [results]);

  const handleSelect = (item: any) => {
    onSelectTab(item.tabId);
    onClose();
  };

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      // Optional: Close on resize to prevent alignment issues if origin becomes stale
      if (isOpen && origin) onClose();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen, origin, onClose]);

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      document.body.style.overflow = 'hidden';
      // Focus input
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => {
        document.body.style.overflow = '';
        clearTimeout(timer);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  // Keyboard navigation & Focus Trap
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      // Results Navigation
      if (flatResults.length > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex(prev => (prev + 1) % flatResults.length);
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex(prev => (prev - 1 + flatResults.length) % flatResults.length);
        }
        if (e.key === 'Enter') {
          e.preventDefault();
          if (flatResults[selectedIndex]) handleSelect(flatResults[selectedIndex]);
        }
      }

      // Focus Trap
      if (e.key === 'Tab') {
        const modal = modalRef.current;
        if (modal) {
          const focusables = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (focusables.length > 0) {
            const first = focusables[0] as HTMLElement;
            const last = focusables[focusables.length - 1] as HTMLElement;
            
            if (e.shiftKey) {
              if (document.activeElement === first) {
                e.preventDefault();
                last.focus();
              }
            } else {
              if (document.activeElement === last) {
                e.preventDefault();
                first.focus();
              }
            }
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, flatResults, selectedIndex, onClose]);

  // Animation Config
  const reducedMotion = settings.reducedMotion;

  // Calculate Positioning Style
  const positionStyle: React.CSSProperties = useMemo(() => {
    if (!origin) {
      // Fallback for keyboard open or mobile: standard centered/top-aligned modal width
      return { width: 'min(42rem, calc(100vw - 32px))' }; 
    }

    const right = windowWidth - (origin.x + origin.w);
    const top = origin.y;
    
    // Width logic to ensure it stays on screen (min 16px from left)
    const maxWidth = 672; // max-w-2xl
    // Calculate how much space we have to the left of the button's right edge, minus 16px margin
    const maxAvailableWidth = origin.x + origin.w - 16;
    const width = Math.min(maxWidth, windowWidth - 32, maxAvailableWidth);

    return {
      position: 'absolute',
      top,
      right,
      width,
      transformOrigin: 'top right',
      maxHeight: 'calc(100vh - 32px)',
    };
  }, [origin, windowWidth]);

  const backdropVariants: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const panelVariants: Variants = {
    initial: { 
      opacity: 0, 
      scale: reducedMotion ? 1 : 0.9, 
      y: reducedMotion ? 0 : 6 
    },
    animate: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] }
    },
    exit: { 
      opacity: 0, 
      scale: reducedMotion ? 1 : 0.9, 
      y: reducedMotion ? 0 : 6,
      transition: { duration: 0.15, ease: "easeIn" }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[100] overflow-hidden" 
          role="dialog" 
          aria-modal="true"
        >
          {/* Backdrop */}
          <motion.div 
            variants={backdropVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={`absolute inset-0 bg-black/30 ${reducedMotion ? '' : 'backdrop-blur-sm'}`}
            onClick={onClose}
          />
          
          {/* Panel Wrapper - Handles centering if no origin, otherwise acts as canvas for absolute pos */}
          <div className={`absolute inset-0 pointer-events-none ${!origin ? 'flex items-start justify-center pt-24' : ''}`}>
            <motion.div 
              ref={modalRef}
              variants={panelVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              style={positionStyle}
              className="bg-white dark:bg-zinc-900 rounded-[2rem] shadow-2xl flex flex-col pointer-events-auto overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header / Input */}
              <div className="relative flex items-center px-6 md:px-8 pt-6 md:pt-8 pb-4 shrink-0">
                <svg className={`w-6 h-6 ${accentText} absolute left-8 md:left-10 pointer-events-none`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
                  placeholder="Search legends, records, or pages..."
                  className={`w-full bg-zinc-50 dark:bg-zinc-800 rounded-2xl py-4 pl-14 pr-6 text-zinc-900 dark:text-zinc-100 font-bold text-lg outline-none transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:bg-white dark:focus:bg-zinc-800 border-2 border-transparent focus:border-current ${accentText}`}
                />
              </div>
              
              {/* Results Area */}
              <div className="flex-1 overflow-y-auto px-4 pb-8 no-scrollbar min-h-[300px] max-h-[60vh]">
                {query.trim() === '' ? (
                  <div className="flex flex-col items-center justify-center h-full py-12 text-zinc-400 dark:text-zinc-600">
                    <p className="text-[10px] font-black tracking-[0.3em] uppercase mb-6 opacity-30">Quick Navigation</p>
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center gap-2">
                        <kbd className="px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 rounded-lg text-[10px] font-mono border border-zinc-100 dark:border-zinc-700 text-zinc-300 dark:text-zinc-500">↑↓</kbd>
                        <span className="text-[8px] font-black uppercase tracking-widest text-zinc-300 dark:text-zinc-600">select</span>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <kbd className="px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 rounded-lg text-[10px] font-mono border border-zinc-100 dark:border-zinc-700 text-zinc-300 dark:text-zinc-500">Enter</kbd>
                        <span className="text-[8px] font-black uppercase tracking-widest text-zinc-300 dark:text-zinc-600">go</span>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <kbd className="px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 rounded-lg text-[10px] font-mono border border-zinc-100 dark:border-zinc-700 text-zinc-300 dark:text-zinc-500">Esc</kbd>
                        <span className="text-[8px] font-black uppercase tracking-widest text-zinc-300 dark:text-zinc-600">close</span>
                      </div>
                    </div>
                  </div>
                ) : results.length > 0 ? (
                  <div className="space-y-6 mt-4">
                    {results.map((group) => (
                      <div key={group.group}>
                        <h3 className={`px-4 text-[10px] font-black uppercase tracking-[0.2em] ${accentText} mb-3 opacity-60`}>{group.group}</h3>
                        <div className="space-y-1">
                          {group.items.map((item) => {
                            const itemIndex = flatResults.indexOf(item);
                            const isSelected = itemIndex === selectedIndex;
                            return (
                              <button
                                key={item.id}
                                onClick={() => handleSelect(item)}
                                onMouseEnter={() => setSelectedIndex(itemIndex)}
                                className={`
                                  group w-full text-left px-6 py-4 rounded-2xl transition-all flex items-center justify-between
                                  ${isSelected 
                                    ? `${accentBg} text-white shadow-xl translate-x-1.5` 
                                    : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400'
                                  }
                                `}
                              >
                                <div className="flex flex-col">
                                   <span className={`font-bold transition-transform ${isSelected ? 'scale-105' : 'scale-100'}`}>{item.name}</span>
                                   {isSelected && item.category && (
                                     <span className="text-[8px] font-black uppercase tracking-widest text-white/40">{item.category}</span>
                                   )}
                                </div>
                                <div className={`flex items-center gap-2 transition-all duration-300 ${isSelected ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                                  <span className="text-[9px] font-black uppercase tracking-widest text-white/60">navigate</span>
                                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                                    <polyline points="9 18 15 12 9 6" />
                                  </svg>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full pb-12">
                     <p className="text-zinc-300 dark:text-zinc-600 font-bold tracking-tight text-lg italic">No matches found for "{query}"</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SearchOverlay;
