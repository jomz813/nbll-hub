import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TabID } from '../App';
import { useSettings } from '../context/SettingsContext';
import { recordsData } from '../data/records';

// --- SEARCH DATA CONSTANTS ---
const PLAYERS = [
  { name: 'Michael Jordan', slug: 'michael-jordan' },
  { name: 'LeBron James', slug: 'lebron-james' },
  { name: 'Kobe Bryant', slug: 'kobe-bryant' },
  { name: 'Stephen Curry', slug: 'stephen-curry' },
];

const PAGES: { name: TabID; label: string; keywords?: string[] }[] = [
  { name: 'home', label: 'home' },
  { name: 'schedule', label: 'schedule' },
  { name: 'stats', label: 'stats', keywords: ['s10', 's11', 's12', 'stats', 'statistics', 'current', 'all-time'] },
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
  
  // Single ref for the search input (Desktop only now)
  const inputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial state
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const isHOF = activeTab === 'hall-of-fame';
  const isHome = activeTab === 'home';
  const colors = getThemeColors(isHOF);

  // Theme-aware colors
  const accentBg = colors.bg;
  const accentText = colors.text;
  const accentBorder = colors.border;
  const accentShadow = colors.shadow;

  const tabs: { name: TabID; label: string }[] = [
    { name: 'home', label: 'home' },
    { name: 'schedule', label: 'schedule' },
    { name: 'stats', label: 'stats' },
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

  const flatResults = useMemo(() => searchResults.flatMap(g => g.items), [searchResults]);

  const handleSelectResult = (item: any) => {
    onTabChange(item.tabId);
    closeSearch();
  };

  const openSearch = () => {
    // Guard: Do not allow search to open on mobile
    if (window.innerWidth < 768) return;

    setIsSearchOpen(true);
    // Use requestAnimationFrame to ensure the DOM has updated and the input is rendered
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

  // Close search if resized to mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && isSearchOpen) {
        closeSearch();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSearchOpen]);

  // Keyboard Handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Guard: Do not process shortcuts on mobile
      if (window.innerWidth < 768) return;

      // Global Open
      if (e.key === '/' && settings.searchSlashOpens && !isSearchOpen) {
        // Prevent typing '/' if focused on body
        const target = e.target as HTMLElement;
        const tagName = target.tagName;
        if (!target.isContentEditable && tagName !== 'INPUT' && tagName !== 'TEXTAREA' && tagName !== 'SELECT') {
          e.preventDefault();
          openSearch();
        }
        return;
      }

      // Contextual Navigation
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

  // Click Outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        if (isSearchOpen) closeSearch();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSearchOpen]);


  // Sticky Logic
  const stickyClass = settings.stickyHeader ? 'fixed top-8' : 'absolute top-8';
  const backgroundClasses = isScrolled && settings.stickyHeader
    ? 'bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md'
    : 'bg-gradient-to-b from-white via-white/98 to-zinc-100/95 dark:from-zinc-950 dark:via-zinc-950/98 dark:to-zinc-900/95 backdrop-blur-2xl';

  const reducedMotion = settings.reducedMotion;

  // Render Logic for Search Bar (Desktop Only)
  const renderSearch = () => {
    // Determine dynamic colors for Search Pill
    const getSearchStateStyles = () => {
      if (isSearchOpen) {
        return {
          bg: theme === 'dark' ? '#18181b' : '#f4f4f5',
          icon: 'text-zinc-400',
          hoverBg: theme === 'dark' ? '#18181b' : '#f4f4f5'
        };
      }
      if (isHOF) {
        return {
          bg: '#D4AF37',
          icon: 'text-zinc-900', // Dark contrast for gold background
          hoverBg: '#B59020' // Darker gold
        };
      }
      if (settings.rahBizzyTheme) {
        return {
          bg: '#3B82F6',
          icon: 'text-white',
          hoverBg: '#2563EB'
        };
      }
      // Default
      return {
        bg: '#D60A07',
        icon: 'text-white',
        hoverBg: '#B91C1C'
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
            backgroundColor: searchStyles.hoverBg
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={`
            relative flex items-center rounded-full h-9 md:h-9 overflow-hidden
            ${isSearchOpen ? 'shadow-inner cursor-text' : `cursor-pointer shadow-md hover:scale-105 active:scale-95 ${accentShadow} justify-center`}
            ${isHOF && !isSearchOpen ? 'ring-1 ring-[#D4AF37]/50' : ''}
          `}
        >
          {/* Icon */}
          <div className={`absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center pointer-events-none z-10 ${searchStyles.icon}`}>
             <svg 
              className="w-4 h-4" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="3" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>

          {/* Input */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.input
                ref={inputRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
                placeholder="Search..."
                className="w-full h-full bg-transparent border-none outline-none pl-10 pr-4 text-sm font-bold text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 z-20 relative"
                onClick={(e) => e.stopPropagation()}
                autoCapitalize="off"
                autoComplete="off" 
                autoCorrect="off"
              />
            )}
          </AnimatePresence>

          {/* Closed State Text (hidden when open) */}
          {!isSearchOpen && (
             <motion.span 
               initial={{ opacity: 0 }}
               animate={{ opacity: 0 }}
               className="hidden" 
             />
          )}
        </motion.div>

        {/* Results Dropdown */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full right-0 mt-3 w-[22rem] bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-[100]"
            >
               <div className="max-h-[320px] overflow-y-auto no-scrollbar py-2">
                  {query.trim() === '' ? (
                    <div className="px-4 py-8 text-center text-zinc-400 dark:text-zinc-600">
                      <p className="text-[10px] font-black uppercase tracking-widest">Type to search</p>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="space-y-4">
                       {searchResults.map(group => (
                         <div key={group.group}>
                            <h4 className="px-4 py-1 text-[9px] font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-widest bg-zinc-50/50 dark:bg-zinc-800/50 mx-2 rounded-lg mb-1">{group.group}</h4>
                            {group.items.map(item => {
                              const isSelectedIndex = flatResults.indexOf(item) === selectedIndex;
                              return (
                                <button
                                  key={item.id}
                                  onClick={() => handleSelectResult(item)}
                                  onMouseEnter={() => setSelectedIndex(flatResults.indexOf(item))}
                                  className={`w-full px-4 py-2.5 flex items-center justify-between text-left transition-colors ${isSelectedIndex ? 'bg-zinc-100 dark:bg-zinc-800' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50'}`}
                                >
                                  <span className={`text-sm font-bold ${isSelectedIndex ? accentText : 'text-zinc-700 dark:text-zinc-300'}`}>
                                    {item.name}
                                  </span>
                                  {item.category && (
                                    <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wide opacity-70">
                                      {item.category}
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                         </div>
                       ))}
                    </div>
                  ) : (
                    <div className="px-4 py-8 text-center text-zinc-400 dark:text-zinc-600">
                       <p className="text-[10px] font-bold">No results found.</p>
                    </div>
                  )}
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <nav className={`${stickyClass} left-1/2 -translate-x-1/2 z-[80] w-full max-w-[1200px] px-6 transition-all duration-300`}>
      <div className="flex items-center gap-4 w-full">
        {/* Main Navbar Pill */}
        <div className={`
          flex-1 relative ${backgroundClasses} border ${accentBorder}
          rounded-full h-16 flex items-center justify-between px-8 shadow-[0_45px_100px_-15px_rgba(0,0,0,0.65)]
          transition-all duration-500
        `}>
          <div className="relative flex items-center justify-center">
            <button 
              onClick={handleLogoClick}
              className={`${accentText} text-2xl font-black tracking-tighter transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-110 active:scale-95 shrink-0 relative z-10 ${isPopping ? 'scale-105' : ''}`}
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

          {/* Desktop Tabs */}
          <div className={`hidden md:flex items-center gap-4 lg:gap-8 flex-1 justify-center px-4 ${isSearchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'} transition-opacity duration-200`}>
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

          {/* Desktop Controls */}
          <div className="hidden md:flex items-center shrink-0 gap-3 justify-end">
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

          {/* Mobile Buttons Container */}
          <div className="flex md:hidden flex-1 justify-end items-center gap-4">
            
            {/* Theme Toggle (Always visible on mobile now) */}
            <button 
              onClick={onToggleTheme}
              className="w-10 h-10 flex items-center justify-center rounded-full text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
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
            </button>
            
            {/* Search Removed from Mobile */}

            {/* Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`w-10 h-10 flex items-center justify-center rounded-full ${accentText} hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all active:scale-90`}
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

          <div className={`
            absolute top-20 left-0 right-0 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-3xl border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-6 shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden
            ${isMenuOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-16 scale-[0.9] pointer-events-none'}
          `}>
            <div className="flex flex-col gap-2">
              {tabs.map((tab) => {
                const active = isTabActive(tab.name);
                return (
                  <button
                    key={tab.name}
                    onClick={() => handleTabClick(tab.name)}
                    className={`
                      text-lg font-bold transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] tracking-wide py-4 px-8 rounded-2xl flex items-center justify-between
                      ${active 
                        ? `text-white ${accentBg} shadow-xl scale-[1.03]` 
                        : `${accentText} hover:bg-zinc-50 dark:hover:bg-zinc-900`
                      }
                    `}
                  >
                    {tab.label}
                    {active && (
                      <svg className="w-6 h-6 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Settings Button - Desktop Only (Outside Pill, Inside Nav Container) */}
        <button 
          onClick={onOpenSettings}
          className="hidden lg:flex items-center justify-center w-[44px] h-[44px] rounded-full shadow-sm border transition-all duration-300 active:scale-95 overflow-visible
            bg-white dark:bg-zinc-950 
            text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 
            hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100"
          aria-label="Settings"
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="overflow-visible"
          >
             <line x1="4" y1="21" x2="4" y2="14" />
             <line x1="4" y1="10" x2="4" y2="3" />
             <line x1="12" y1="21" x2="12" y2="12" />
             <line x1="12" y1="8" x2="12" y2="3" />
             <line x1="20" y1="21" x2="20" y2="16" />
             <line x1="20" y1="12" x2="20" y2="3" />
             <line x1="2" y1="14" x2="6" y2="14" />
             <line x1="10" y1="8" x2="14" y2="8" />
             <line x1="18" y1="16" x2="22" y2="16" />
          </svg>
        </button>
      </div>
      
      <style>{`
        @keyframes particle-burst {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(var(--tx), var(--ty)) scale(0.2);
            opacity: 0;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;