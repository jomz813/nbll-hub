import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TabID } from '../App';
import { useSettings } from '../context/SettingsContext';
import { recordsData } from '../data/records';

// --- SEARCH DATA CONSTANTS ---
const PAGES: { name: TabID; label: string; keywords?: string[] }[] = [
  { name: 'home', label: 'home' },
  { name: 'stats', label: 'stats', keywords: ['s10', 's11', 's12', 'stats', 'statistics', 'current', 'all-time'] },
  { name: 'compare', label: 'compare', keywords: ['comparison', 'matchup', 'vs'] },
  { name: 'achievements', label: 'achievements', keywords: ['badges', 'trophies', 'earned', 'index'] },
  { name: 'legacy', label: 'legacy' },
  { name: 'rules', label: 'rules' },
  { name: 'more', label: 'more' },
  { name: 'hall-of-fame', label: 'hall of fame', keywords: ['hof', 'legends', 'hall'] },
  { name: 'league-history', label: 'history', keywords: ['timeline', 'archives', 'history'] },
  { name: 'records', label: 'records', keywords: ['history', 'stats', 'highs', 'best'] },
  { name: 'credits', label: 'credits', keywords: ['contributors', 'staff', 'creators', 'team', 'devs'] },
];

interface NavbarProps {
  activeTab: TabID;
  onTabChange: (tabId: TabID) => void;
  onOpenSettings: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

interface Particle {
  id: number;
  tx: number;
  ty: number;
  size: number;
  color: string;
  duration: number;
}

interface SearchResultItem {
  id: string;
  name: string;
  tabId: TabID;
  type: string;
  tag: string;
  category?: string;
}

interface SearchResultGroup {
  group: string;
  items: SearchResultItem[];
}

/**
 * Helper component to highlight matching search text
 */
const HighlightMatch: React.FC<{ text: string; query: string; accentText: string }> = ({ text, query, accentText }) => {
  if (!query.trim()) return <span>{text}</span>;
  
  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return (
    <span>
      {parts.map((part, i) => 
        part.toLowerCase() === query.toLowerCase() ? (
          <span key={i} className={`text-zinc-900 dark:text-white font-black relative inline-block`}>
            {part}
            <span 
              className="absolute left-0 right-0 -bottom-[1px] h-[2px] rounded-full" 
              style={{ backgroundColor: 'var(--accent)', opacity: 0.6 }}
            />
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
};

const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange, onOpenSettings, theme, onToggleTheme }) => {
  const { settings, getThemeColors } = useSettings();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPopping, setIsPopping] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);

  // Search State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); 
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHOF = activeTab === 'hall-of-fame';
  const isHome = activeTab === 'home';
  const colors = getThemeColors(isHOF);

  const accentBg = colors.bg;
  const accentText = colors.text;
  const accentBorder = colors.border;
  const accentShadow = colors.shadow;

  const tabs: { name: TabID; label: string }[] = [
    { name: 'home', label: 'home' },
    { name: 'stats', label: 'stats' },
    { name: 'compare', label: 'compare' },
    { name: 'legacy', label: 'legacy' },
    { name: 'more', label: 'more' }
  ];

  const getParentTab = (tabId: TabID): TabID => {
    const parentMap: Partial<Record<TabID, TabID>> = {
      'partner-hub': 'more',
      'rules': 'more',
      'hall-of-fame': 'legacy',
      'league-history': 'more',
      'records': 'legacy',
      'credits': 'more',
      'achievements': 'more',
      'players': 'more',
      'unknown': 'more'
    };
    return parentMap[tabId] || tabId;
  };

  const handleTabClick = (tabId: TabID) => {
    onTabChange(tabId);
    setIsMenuOpen(false);
  };

  const triggerBurst = () => {
    setIsPopping(true);
    setTimeout(() => setIsPopping(false), 150);

    const count = 20 + Math.floor(Math.random() * 11);
    const newParticles: Particle[] = Array.from({ length: count }).map((_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const velocity = 80 + Math.random() * 120;
      return {
        id: Date.now() + i,
        tx: Math.cos(angle) * velocity,
        ty: Math.sin(angle) * velocity,
        size: 6 + Math.random() * 5,
        color: isHOF ? '#D4AF37' : (settings.rahBizzyTheme ? '#3B82F6' : (Math.random() > 0.3 ? '#D60A07' : (Math.random() > 0.5 ? '#E4E4E7' : '#FFFFFF'))),
        duration: 800 + Math.random() * 400
      };
    });

    setParticles(prev => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.includes(p)));
    }, 1250);
  };

  const handleLogoClick = () => {
    if (isHome) {
      triggerBurst();
    } else {
      handleTabClick('home');
    }
  };

  const isTabActive = (tabName: TabID) => {
    return getParentTab(activeTab) === tabName;
  };

  // --- SEARCH LOGIC ---
  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();

    // 1. Pages
    const matchedPages: SearchResultItem[] = PAGES.filter(p => 
      p.label.toLowerCase().includes(q) || p.keywords?.some(k => k.toLowerCase().includes(q))
    ).map(p => ({ 
      name: p.label, 
      tabId: p.name, 
      type: 'Page', 
      id: `page-${p.name}`,
      tag: (p.name === 'hall-of-fame' || p.name === 'league-history' || p.name === 'records') ? 'LEGACY' : 
           (p.name === 'credits') ? 'TEAM' : (p.name === 'stats' || p.name === 'compare' || p.name === 'achievements') ? 'STATS' : 'HUB'
    }));
    
    // 2. Records
    const matchedRecords: SearchResultItem[] = recordsData.flatMap(section => 
      section.items.filter(item => item.title.toLowerCase().includes(q) || item.valueLabel.toLowerCase().includes(q))
        .map(item => ({
          name: item.title,
          tabId: 'records' as TabID,
          type: 'Record',
          id: `record-${item.id}`,
          tag: 'RECORD',
          category: section.title
        }))
    );

    const combined: SearchResultGroup[] = [];
    if (matchedPages.length) combined.push({ group: 'PAGES', items: matchedPages });
    if (matchedRecords.length) combined.push({ group: 'RECORDS', items: matchedRecords });
    
    return combined;
  }, [query]);

  const flatResults = useMemo(() => searchResults.flatMap(g => g.items), [searchResults]);

  const handleSelectResult = (item: SearchResultItem) => {
    onTabChange(item.tabId);
    closeSearch();
  };

  const openSearch = () => {
    if (window.innerWidth < 768) return;
    setIsSearchOpen(true);
    requestAnimationFrame(() => {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    });
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setQuery('');
    setSelectedIndex(0);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && isSearchOpen) {
        closeSearch();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSearchOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (window.innerWidth < 768) return;

      if (e.key === '/' && settings.searchSlashOpens && !isSearchOpen) {
        const target = e.target as HTMLElement;
        if (!target.isContentEditable && target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          openSearch();
        }
        return;
      }

      if (isSearchOpen) {
        if (e.key === 'Escape') {
          e.preventDefault();
          closeSearch();
          return;
        }

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
            if (flatResults[selectedIndex]) handleSelectResult(flatResults[selectedIndex]);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, flatResults, selectedIndex, settings.searchSlashOpens]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        if (isSearchOpen) closeSearch();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSearchOpen]);

  const stickyClass = settings.stickyHeader ? 'fixed top-8' : 'absolute top-8';
  
  // Adjusted background logic: tailwind classes prefixed with md: to allow inline style glass on mobile
  const backgroundClasses = isScrolled && settings.stickyHeader
    ? 'md:bg-white/90 dark:md:bg-zinc-950/85 md:backdrop-blur-md'
    : 'md:bg-white/95 dark:md:bg-zinc-950/90 md:backdrop-blur-2xl';

  const reducedMotion = settings.reducedMotion;

  const renderSearch = () => {
    const getSearchStateStyles = () => {
      if (isSearchOpen) {
        return {
          bg: theme === 'dark' ? '#18181b' : '#f4f4f5',
          icon: 'text-zinc-400',
        };
      }
      
      const isLightAccent = settings.siteThemeAccent === 'citrine' || settings.siteThemeAccent === 'aquamarine' || isHOF;
      return { 
        bg: colors.hex, 
        icon: isLightAccent ? 'text-zinc-950' : 'text-white' 
      };
    };
    
    const searchStyles = getSearchStateStyles();

    return (
      <motion.div
        ref={searchContainerRef}
        layout={!reducedMotion}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={`relative flex items-center justify-end ${isSearchOpen ? 'flex-none' : ''}`}
      >
        <motion.div
          layout={!reducedMotion}
          onClick={() => !isSearchOpen && openSearch()}
          animate={{ 
            width: isSearchOpen ? 300 : 40,
            backgroundColor: searchStyles.bg
          }}
          whileHover={{ 
            backgroundColor: isSearchOpen 
              ? searchStyles.bg 
              : `color-mix(in srgb, ${searchStyles.bg} 85%, ${theme === 'dark' ? 'white' : 'black'})` 
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={`
            relative flex items-center rounded-full h-9 md:h-9 overflow-hidden
            ${isSearchOpen ? 'shadow-inner cursor-text' : `cursor-pointer shadow-md hover:scale-105 active:scale-95 ${accentShadow} justify-center`}
            ${isHOF && !isSearchOpen ? 'ring-1 ring-[#D4AF37]/50' : ''}
          `}
        >
          <div className={`absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center pointer-events-none z-10 ${searchStyles.icon}`}>
             <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>

          <AnimatePresence>
            {isSearchOpen && (
              <motion.input
                ref={inputRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                type="text"
                value={query}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setQuery(e.target.value); setSelectedIndex(0); }}
                placeholder="Quick search..."
                className="w-full h-full bg-transparent border-none outline-none pl-10 pr-4 text-sm font-bold text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 z-20 relative"
                onClick={(e: React.MouseEvent<HTMLInputElement>) => e.stopPropagation()}
                autoCapitalize="off"
                autoComplete="off" 
                autoCorrect="off"
              />
            )}
          </AnimatePresence>
        </motion.div>

        {/* --- PREMIUM DESKTOP SEARCH DROPDOWN --- */}
        <AnimatePresence>
          {isSearchOpen && query.trim() && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.15, ease: [0.2, 0.9, 0.2, 1] }}
              className="absolute top-full right-0 mt-3 w-[24rem] bg-white/90 dark:bg-zinc-900/95 backdrop-blur-2xl border border-zinc-200/50 dark:border-zinc-800/80 rounded-2xl shadow-[0_30px_60px_-12px_rgba(0,0,0,0.3),0_18px_36px_-18px_rgba(0,0,0,0.3)] overflow-hidden z-[2000]"
            >
               <div className="max-h-[400px] overflow-y-auto custom-search-scrollbar py-3 px-2">
                  {searchResults.length > 0 ? (
                    <div className="space-y-4">
                       {searchResults.map(group => (
                         <div key={group.group} className="space-y-1">
                            <div className="px-3 pb-1 flex items-center justify-between">
                              <h4 className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 tracking-[0.2em] uppercase">{group.group}</h4>
                              <div className="h-px bg-zinc-100 dark:bg-zinc-800/60 flex-1 ml-3" />
                            </div>
                            {group.items.map(item => {
                              const isSelected = flatResults.indexOf(item) === selectedIndex;
                              return (
                                <button
                                  key={item.id}
                                  onMouseDown={() => handleSelectResult(item)}
                                  onMouseEnter={() => setSelectedIndex(flatResults.indexOf(item))}
                                  className={`
                                    w-full px-3 py-2.5 flex items-center justify-between text-left rounded-xl transition-all duration-200 group
                                    ${isSelected ? 'bg-zinc-100/80 dark:bg-zinc-800/80 shadow-sm' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/40'}
                                  `}
                                >
                                  <div className="flex flex-col min-w-0 pr-4">
                                    <div className={`text-sm font-bold truncate transition-colors ${isSelected ? 'text-zinc-900 dark:text-white' : 'text-zinc-600 dark:text-zinc-300'}`}>
                                      <HighlightMatch text={item.name} query={query} accentText={accentText} />
                                    </div>
                                    {item.category && (
                                      <span className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500 tracking-tight truncate mt-0.5 opacity-80">
                                        {item.category}
                                      </span>
                                    )}
                                  </div>
                                  
                                  <div 
                                    className={`shrink-0 px-2 py-0.5 rounded-full border text-[9px] font-black tracking-widest transition-all duration-300`}
                                    style={isSelected ? {
                                      backgroundColor: 'color-mix(in srgb, var(--accent) 10%, transparent)',
                                      borderColor: 'color-mix(in srgb, var(--accent) 30%, transparent)',
                                      color: 'var(--accent)',
                                      transform: 'scale(1.05)'
                                    } : {
                                      backgroundColor: theme === 'dark' ? 'rgba(39, 39, 42, 1)' : 'rgba(244, 244, 245, 1)',
                                      borderColor: 'transparent',
                                      color: theme === 'dark' ? 'rgba(113, 113, 122, 1)' : 'rgba(161, 161, 170, 1)'
                                    }}
                                  >
                                    {item.tag}
                                  </div>
                                </button>
                              );
                            })}
                         </div>
                       ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center px-6">
                       <div className="w-10 h-10 rounded-full bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-center mb-3">
                         <svg className="w-5 h-5 text-zinc-300 dark:text-zinc-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                       </div>
                       <p className="text-sm font-bold text-zinc-400 dark:text-zinc-600">No results for <span className="text-zinc-600 dark:text-zinc-400">"{query}"</span></p>
                       <p className="text-[10px] font-bold text-zinc-300 dark:text-zinc-700 uppercase tracking-widest mt-1">Try another search term</p>
                    </div>
                  )}
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  const isHomeLightMobile = isHome && theme === 'light' && window.innerWidth < 768;

  return (
    <nav className={`${stickyClass} inset-x-0 mx-auto z-[80] w-full px-4 md:px-6 transition-all duration-300`}>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/10 dark:bg-black/20 z-[-1] md:hidden"
            onClick={(e: React.MouseEvent<HTMLDivElement>) => setIsMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      <div className="relative flex items-center justify-center w-full">
        {/* Main Navbar Pill Container - Exactly matches site content width */}
        <div className="w-full max-w-6xl relative">
          <motion.div 
            layout
            animate={{ 
              height: isMenuOpen ? 'auto' : '4rem',
              borderRadius: isMenuOpen ? '2.5rem' : '2rem'
            }}
            transition={{ type: "spring", stiffness: 350, damping: 35, mass: 1 }}
            className={`
              relative ${backgroundClasses} border ${accentBorder}
              shadow-xl md:shadow-[0_45px_100px_-15px_rgba(0,0,0,0.65)]
              overflow-hidden md:overflow-visible flex flex-col
              ${isMenuOpen ? 'md:bg-white/100 dark:md:bg-zinc-950/100' : ''}
              /* Liquid Glass Effect Styles */
              ring-white/10 dark:ring-white/5
            `}
            style={window.innerWidth < 768 ? {
              backgroundColor: isHomeLightMobile ? 'rgba(255, 255, 255, 0.75)' : (theme === 'dark' ? 'rgba(9, 9, 11, 0.45)' : 'rgba(255, 255, 255, 0.4)'),
              backdropFilter: isHomeLightMobile ? 'blur(8px) saturate(190%) contrast(105%)' : 'blur(10px) saturate(190%) contrast(105%)',
              WebkitBackdropFilter: isHomeLightMobile ? 'blur(8px) saturate(190%) contrast(105%)' : 'blur(10px) saturate(190%) contrast(105%)',
              border: isHomeLightMobile 
                  ? '1px solid rgba(0, 0, 0, 0.15)' 
                  : `1px solid color-mix(in srgb, var(--accent) 20%, transparent)`,
              ...(isMenuOpen ? {
                  boxShadow: isHomeLightMobile ? '0 15px 40px -10px rgba(0, 0, 0, 0.3)' : 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                  border: isHomeLightMobile ? '1px solid rgba(0, 0, 0, 0.2)' : `1px solid color-mix(in srgb, var(--accent) 30%, transparent)`
              } : {})
            } : {}}
          >
            {/* Noise Texture Overlay for liquid glass effect (Visible on mobile both states) */}
            <div 
              className="md:hidden absolute inset-0 z-0 pointer-events-none opacity-[0.02] select-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
              }}
            />

            {/* Top Edge Specular Highlight (Liquid Glass) */}
            <div className={`md:hidden absolute top-0 left-1/2 -translate-x-1/2 w-[85%] h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent z-20 pointer-events-none transition-opacity duration-500 ${isMenuOpen ? 'opacity-100' : 'opacity-20'}`} />
            
            <div className="h-16 shrink-0 flex md:grid md:grid-cols-[1fr_auto_1fr] items-center justify-between md:justify-items-stretch px-8 w-full relative z-30">
              
              <div className="relative flex items-center justify-center md:justify-self-start">
                <button 
                  onClick={handleLogoClick}
                  className={`${isHomeLightMobile ? 'text-zinc-950' : accentText} text-2xl font-black tracking-tighter transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-110 active:scale-95 shrink-0 relative z-10 ${isPopping ? 'scale-105' : ''}`}
                >
                  nbll
                </button>
                
                <div className="absolute inset-0 pointer-events-none overflow-visible flex items-center justify-center">
                  {particles.map(p => (
                    <div 
                      key={p.id}
                      className="absolute rounded-full"
                      style={{
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        backgroundColor: p.color,
                        '--tx': `${p.tx}px`,
                        '--ty': `${p.ty}px`,
                        animation: `particle-burst ${p.duration}ms cubic-bezier(0.16, 1, 0.3, 1) forwards`
                      } as React.CSSProperties}
                    />
                  ))}
                </div>
              </div>

              <div className={`hidden md:flex items-center gap-4 lg:gap-8 justify-self-center px-4 ${isSearchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'} transition-opacity duration-200`}>
                {tabs.map((tab) => {
                  const active = isTabActive(tab.name);
                  return (
                    <button
                      key={tab.name}
                      onClick={() => handleTabClick(tab.name)}
                      className={`
                        text-sm font-bold transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105 active:scale-95 tracking-wide whitespace-nowrap relative py-1
                        ${active ? accentText : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'}
                      `}
                    >
                      {tab.label}
                      {active && (
                        <motion.div 
                          layoutId="nav-underline"
                          className={`absolute left-0 right-0 -bottom-1 h-0.5 ${accentBg} rounded-full`}
                          transition={
                            settings.reducedMotion 
                              ? { duration: 0 } 
                              : { type: "spring", stiffness: 500, damping: 35, mass: 0.6 }
                          }
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="hidden md:flex items-center shrink-0 gap-3 justify-self-end">
                <motion.button
                  layout={!reducedMotion}
                  onClick={onToggleTheme}
                  className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                  aria-label="Toggle dark mode"
                >
                  {theme === 'dark' ? (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="5" />
                      <line x1="12" y1="1" x2="12" y2="3" />
                      <line x1="12" y1="21" x2="12" y2="23" />
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                      <line x1="1" y1="12" x2="3" y2="12" />
                      <line x1="21" y1="12" x2="23" y2="12" />
                      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    </svg>
                  )}
                </motion.button>

                {renderSearch()}
              </div>

              <div className="flex md:hidden flex-1 justify-end items-center gap-4">
                <div className="relative w-10 h-10">
                  <AnimatePresence mode="wait" initial={false}>
                    {!isMenuOpen ? (
                      <motion.button 
                        key="theme-toggle"
                        initial={{ opacity: 0, scale: 0.7, rotate: -45 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.7, rotate: 45 }}
                        transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                        onClick={onToggleTheme}
                        className={`absolute inset-0 flex items-center justify-center rounded-full transition-colors ${isHomeLightMobile ? 'text-zinc-800' : 'text-zinc-500 dark:text-zinc-400'} hover:bg-zinc-100 dark:hover:bg-zinc-800`}
                        aria-label="Toggle dark mode"
                      >
                        {theme === 'dark' ? (
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="5" />
                            <line x1="12" y1="1" x2="12" y2="3" />
                            <line x1="12" y1="21" x2="12" y2="23" />
                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                            <line x1="1" y1="12" x2="3" y2="12" />
                            <line x1="21" y1="12" x2="23" y2="12" />
                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                          </svg>
                        )}
                      </motion.button>
                    ) : (
                      <motion.button 
                        key="settings-toggle"
                        initial={{ opacity: 0, scale: 0.7, rotate: 45 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.7, rotate: -45 }}
                        transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                        onClick={onOpenSettings}
                        className={`absolute inset-0 flex items-center justify-center rounded-full transition-colors ${isHomeLightMobile ? 'text-zinc-800' : 'text-zinc-500 dark:text-zinc-400'} hover:bg-zinc-100 dark:hover:bg-zinc-800`}
                        aria-label="Open settings"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" /><line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" /><line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" /><line x1="2" y1="14" x2="6" y2="14" /><line x1="10" y1="8" x2="14" y2="8" /><line x1="18" y1="16" x2="22" y2="16" />
                        </svg>
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
                
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className={`w-10 h-10 flex items-center justify-center rounded-full ${isHomeLightMobile ? 'text-zinc-950' : accentText} hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all active:scale-90`}
                  aria-label="Toggle menu"
                >
                  {isMenuOpen ? (
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="4" y1="8" x2="20" y2="8"></line>
                      <line x1="4" y1="16" x2="20" y2="16"></line>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {isMenuOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: [0.2, 0.9, 0.2, 1] }}
                  className="w-full flex flex-col md:hidden pb-4 relative z-30"
                >
                  <div className={`w-full border-t mb-2 ${isHomeLightMobile ? 'border-zinc-200' : 'border-zinc-100/50 dark:border-zinc-800/30'}`} />
                  <nav className="flex flex-col relative">
                    {tabs.map((tab, idx) => {
                      const active = isTabActive(tab.name);
                      return (
                        <button
                          key={tab.name}
                          onClick={() => handleTabClick(tab.name)}
                          className={`
                            relative w-full h-[60px] flex items-center justify-between px-8 text-left transition-all duration-300 outline-none active:bg-zinc-100/40 dark:active:bg-zinc-900/40 group
                            ${active ? 'bg-zinc-500/5 dark:bg-zinc-400/5' : ''}
                            ${idx !== tabs.length - 1 ? (isHomeLightMobile ? 'border-b border-zinc-200' : 'border-b border-zinc-100/30 dark:border-zinc-800/20') : ''}
                          `}
                        >
                          {active && (
                            <motion.div
                              layoutId="mobile-active-indicator"
                              className={`absolute left-0 w-[5px] h-[32px] ${accentBg} rounded-r-full z-20`}
                              style={{ boxShadow: `0 0 12px color-mix(in srgb, var(--accent) 30%, transparent)` }}
                              initial={{ opacity: 0, scaleY: 0.5 }}
                              animate={{ opacity: 1, scaleY: 1 }}
                              exit={{ opacity: 0, scaleY: 0.5 }}
                              transition={{ type: "spring", stiffness: 400, damping: 35 }}
                            />
                          )}

                          <span className={`
                            text-base font-black tracking-tight transition-colors duration-300
                            ${active 
                               ? (settings.rahBizzyTheme ? 'text-[#3B82F6]' : (isHomeLightMobile ? 'text-zinc-950' : 'text-zinc-900 dark:text-white')) 
                               : (isHomeLightMobile ? 'text-zinc-800' : 'text-zinc-400 dark:text-zinc-500')}
                          `}>
                            {tab.label}
                          </span>

                          <svg 
                            className={`w-4 h-4 transition-all duration-300 ${active ? (isHomeLightMobile ? 'text-zinc-950' : accentText) : (isHomeLightMobile ? 'text-zinc-800' : 'text-zinc-200 dark:text-zinc-800 group-hover:text-zinc-400')}`} 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="3.5" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                          >
                            <polyline points="9 18 15 12 9 6"></polyline>
                          </svg>
                        </button>
                      );
                    })}
                  </nav>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Mobile Sheen Element (Liquid Glass Specular) - Persistent but faint on mobile */}
            <div className={`md:hidden absolute inset-0 z-10 pointer-events-none transition-opacity duration-700 ${isMenuOpen ? 'opacity-100' : 'opacity-40'}`}
                 style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 25%, transparent 75%, rgba(255,255,255,0.05) 100%)' }} />
          </motion.div>

          {/* Desktop Settings Button - Positioned absolute in the right gutter */}
          <div className="hidden lg:flex absolute left-full ml-4 md:ml-6 top-1/2 -translate-y-1/2 items-center justify-center">
            <button 
              onClick={onOpenSettings}
              className="flex items-center justify-center w-[44px] h-[44px] rounded-full shadow-sm border transition-all duration-300 active:scale-95 overflow-visible shrink-0
                bg-white dark:bg-zinc-950 
                text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 
                hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100"
              aria-label="Settings"
            >
              <svg 
                width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="overflow-visible"
              >
                 <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" /><line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" /><line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" /><line x1="2" y1="14" x2="6" y2="14" /><line x1="10" y1="8" x2="14" y2="8" /><line x1="18" y1="16" x2="22" y2="16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes particle-burst {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) scale(0.2); opacity: 0; }
        }
        
        /* Premium search scrollbar */
        .custom-search-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-search-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-search-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(120, 120, 120, 0.2);
          border-radius: 10px;
        }
        .custom-search-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(120, 120, 120, 0.4);
        }
      `}</style>
    </nav>
  );
};

export default Navbar;