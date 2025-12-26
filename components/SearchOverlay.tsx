
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { TabID } from '../App';
import { recordsData } from '../data/records';
import { useSettings } from '../context/SettingsContext';

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
  { name: 'league-history', label: 'league history', keywords: ['timeline', 'archives', 'history'] },
  { name: 'records', label: 'records', keywords: ['history', 'stats', 'highs', 'best'] },
  { name: 'credits', label: 'credits', keywords: ['contributors', 'staff', 'creators', 'team', 'devs'] },
];

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tabId: TabID) => void;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose, onSelectTab }) => {
  const { getThemeColors } = useSettings();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const colors = getThemeColors();
  const accentText = colors.text;
  const accentBg = colors.bg;

  // Spring animation settings (iOS-like)
  const springEasing = 'cubic-bezier(0.34, 1.56, 0.64, 1)';
  const backdropEasing = 'cubic-bezier(0.16, 1, 0.3, 1)';

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % (flatResults.length || 1));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + (flatResults.length || 1)) % (flatResults.length || 1));
      }
      if (e.key === 'Enter') {
        if (flatResults[selectedIndex]) handleSelect(flatResults[selectedIndex]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setQuery('');
      setSelectedIndex(0);
      document.body.style.overflow = 'hidden';
      
      const timer = setTimeout(() => {
        setIsAnimating(true);
      }, 10);

      const focusTimer = setTimeout(() => {
        inputRef.current?.focus();
      }, 350);

      return () => {
        clearTimeout(timer);
        clearTimeout(focusTimer);
      };
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
        document.body.style.overflow = 'unset';
      }, 250); 
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

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

  if (!shouldRender) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center p-4 md:p-20 overflow-hidden perspective-1000">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/60 backdrop-blur-md transition-all duration-300 motion-reduce:transition-opacity ${isAnimating ? 'opacity-100' : 'opacity-0'}`} 
        style={{ transitionTimingFunction: backdropEasing }}
        onClick={onClose} 
      />
      
      {/* Modal Container */}
      <div 
        className={`
          relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-[2.5rem] overflow-hidden flex flex-col
          transition-all duration-[450ms] motion-reduce:transition-none
          ${isAnimating 
            ? 'opacity-100 translate-y-0 scale-100 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)]' 
            : 'opacity-0 translate-y-12 scale-[0.96] shadow-none'
          }
        `}
        style={{ transitionTimingFunction: isAnimating ? springEasing : 'ease-in' }}
      >
        {/* Layer 1: Search Input */}
        <div 
          className={`relative flex items-center px-8 pt-8 pb-4 transition-all duration-500 delay-[100ms] ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
        >
          <svg className={`w-6 h-6 ${accentText} absolute left-10 pointer-events-none`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
            placeholder="Search legends, records, or pages..."
            className={`w-full bg-zinc-50 dark:bg-zinc-800 rounded-2xl py-4 pl-14 pr-6 text-zinc-900 dark:text-zinc-100 font-bold text-lg outline-none transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:bg-white dark:focus:bg-zinc-800 border-2 border-transparent focus:border-current ${accentText} opacity-100`}
          />
        </div>
        
        {/* Layer 2: Results Area */}
        <div 
          className={`max-h-[60vh] overflow-y-auto px-4 pb-8 no-scrollbar transition-all duration-700 delay-[200ms] ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          {query.trim() === '' ? (
            <div className="flex flex-col items-center justify-center py-12 text-zinc-400 dark:text-zinc-600">
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
            <div className="py-20 text-center animate-pulse">
              <p className="text-zinc-300 dark:text-zinc-600 font-bold tracking-tight text-lg italic">No legends found for "{query}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
