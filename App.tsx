import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import LandingPage from './components/LandingPage';
import TabPage from './components/TabPage';
import Navbar from '././components/Navbar';
import SettingsModal from './components/SettingsModal';
import ThemeOnboardingModal from './components/ThemeOnboardingModal';
import RouteTransition from './components/RouteTransition';
import ScrollToTopButton from './components/ScrollToTopButton';
import ErrorBoundary from './components/ErrorBoundary';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import { clearCache, getCacheInfo } from './data/statsFetcher';

export type TabID = 'home' | 'stats' | 'legacy' | 'rules' | 'more' | 'partner-hub' | 'hall-of-fame' | 'league-history' | 'records' | 'compare' | 'achievements' | string;

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabID>('home');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isDebugOpen, setIsDebugOpen] = useState(false);
  
  // Dev Mode States
  const [isDevMode, setIsDevMode] = useState(false);
  const [terminalHistory, setTerminalHistory] = useState<string[]>(['NBLL OS v1.0.0', 'Type "help" for commands.']);
  const [commandInput, setCommandInput] = useState('');
  const [isInspectMode, setIsInspectMode] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  
  const terminalRef = useRef<HTMLDivElement>(null);
  const fpsRef = useRef(60);

  const { settings, getThemeColors } = useSettings();

  const colors = getThemeColors();

  // Track previous RahBizzy or Accent theme state to trigger transitions
  const prevAccentTheme = useRef(settings.siteThemeAccent);
  const prevRahBizzyTheme = useRef(settings.rahBizzyTheme);

  // Initialize theme and onboarding status from localStorage
  useEffect(() => {
    try {
      // Theme setup
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'light') {
        setTheme('light');
        document.documentElement.classList.remove('dark');
      } else {
        setTheme('dark');
        document.documentElement.classList.add('dark');
        if (!savedTheme) {
          localStorage.setItem('theme', 'dark');
        }
      }

      // Onboarding check
      const onboarded = localStorage.getItem('nbll_theme_onboarded');
      if (!onboarded) {
        // Delay onboarding slightly for visual impact
        const timer = setTimeout(() => setIsOnboardingOpen(true), 1500);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      console.warn('LocalStorage access failed:', e);
    }
  }, []);

  const handleOnboardingComplete = () => {
    setIsOnboardingOpen(false);
    try {
      localStorage.setItem('nbll_theme_onboarded', '1');
    } catch (e) {}
  };

  const triggerThemeTransition = () => {
    if (settings.reducedMotion) return;
    document.documentElement.classList.add('theme-transition');
    const timer = setTimeout(() => {
      document.documentElement.classList.remove('theme-transition');
    }, 250);
    return () => clearTimeout(timer);
  };

  // Sync theme changes
  useEffect(() => {
    try {
      localStorage.setItem('theme', theme);
    } catch (e) {}
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Apply Settings Classes
  useEffect(() => {
    const root = document.documentElement;
    
    if (settings.reducedMotion) root.classList.add('reduced-motion');
    else root.classList.remove('reduced-motion');

    if (settings.highContrast) root.classList.add('high-contrast');
    else root.classList.remove('high-contrast');

    // Check for theme changes to trigger transition
    if (prevRahBizzyTheme.current !== settings.rahBizzyTheme || prevAccentTheme.current !== settings.siteThemeAccent) {
      triggerThemeTransition();
      prevRahBizzyTheme.current = settings.rahBizzyTheme;
      prevAccentTheme.current = settings.siteThemeAccent;
    }

    if (settings.rahBizzyTheme) root.classList.add('rahbizzy-theme');
    else root.classList.remove('rahbizzy-theme');

  }, [settings]);

  useEffect(() => {
    document.body.classList.remove('theme-hof');
    if (activeTab === 'hall-of-fame') {
      document.body.classList.add('theme-hof');
    }
  }, [activeTab]);

  // Dev Mode logic
  useEffect(() => {
    let rAF: number;
    let lastTime = performance.now();
    let frames = 0;
    
    const countFrames = () => {
      frames++;
      const now = performance.now();
      if (now - lastTime >= 1000) {
        fpsRef.current = frames;
        frames = 0;
        lastTime = now;
      }
      rAF = requestAnimationFrame(countFrames);
    };
    rAF = requestAnimationFrame(countFrames);
    return () => cancelAnimationFrame(rAF);
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalHistory]);

  useEffect(() => {
    if (isInspectMode) document.body.classList.add('inspect-mode');
    else document.body.classList.remove('inspect-mode');
  }, [isInspectMode]);

  useEffect(() => {
    if (!isInspectMode) return;
    
    const tooltip = document.createElement('div');
    tooltip.style.position = 'fixed';
    tooltip.style.zIndex = '999999';
    tooltip.style.background = 'rgba(0,0,0,0.85)';
    tooltip.style.color = '#fff';
    tooltip.style.padding = '2px 6px';
    tooltip.style.fontSize = '10px';
    tooltip.style.fontFamily = 'monospace';
    tooltip.style.borderRadius = '4px';
    tooltip.style.pointerEvents = 'none';
    tooltip.style.border = '1px solid currentColor';
    tooltip.style.textShadow = 'none';
    document.body.appendChild(tooltip);

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      
      const tag = target.tagName.toLowerCase();
      let classText = '';
      if (typeof target.className === 'string' && target.className) {
        const parts = target.className.split(' ').filter(c => c && !c.includes('hover') && !c.includes('active')).slice(0, 3);
        if (parts.length > 0) classText = '.' + parts.join('.');
      }
      tooltip.textContent = `${tag}${classText}`;
      tooltip.style.borderColor = document.documentElement.classList.contains('dark') ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)';
    };
    
    const onMouseMove = (e: MouseEvent) => {
      tooltip.style.left = `${e.clientX + 10}px`;
      tooltip.style.top = `${e.clientY + 15}px`;
    };

    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mousemove', onMouseMove);

    return () => {
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mousemove', onMouseMove);
      document.body.removeChild(tooltip);
    };
  }, [isInspectMode]);

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim()) return;
    
    const parts = commandInput.trim().split(' ');
    const cmd = parts[0].toLowerCase();
    const newHistory = [...terminalHistory, `> ${commandInput.trim()}`];
    
    let output = '';
    switch (cmd) {
      case 'help': output = 'Commands: help, clear, route, fps, inspect, version, echo, scan, memory, viewport, reload-data'; break;
      case 'clear': setTerminalHistory(['Console cleared.']); setCommandInput(''); return;
      case 'route': output = `Active Tab: ${activeTab}`; break;
      case 'fps': output = `Estimated FPS: ${fpsRef.current}`; break;
      case 'inspect': 
        setIsInspectMode(prev => !prev);
        output = `Inspect Mode toggled.`;
        break;
      case 'version': output = 'v8.2'; break;
      case 'echo':
        if (parts.length > 1) {
          output = parts.slice(1).join(' ');
        } else {
          output = 'Usage: echo [text]';
        }
        break;
      case 'scan':
        setTerminalHistory([...newHistory, 'Scanning components...']);
        setTimeout(() => {
          setTerminalHistory(prev => [...prev, 'Navbar: OK', 'Routed content: OK', 'Data hooks: OK', 'Debug panel: OK', 'Scan complete.']);
        }, 600);
        setCommandInput('');
        return;
      case 'memory': {
        const cacheInfo = getCacheInfo();
        const totalRows = Object.values(cacheInfo).reduce((a, b) => a + b, 0);
        const hasAllTime = !!cacheInfo['all-time'];
        const hasSeasons = Object.keys(cacheInfo).some(k => k !== 'all-time');
        
        const memLines = [
          `activeTab: ${activeTab}`,
          `current rendered component: TabPage/LandingPage`,
          `developerMode: ${isDevMode ? 'ON' : 'OFF'}`,
          `inspectMode: ${isInspectMode ? 'ON' : 'OFF'}`,
          `total loaded data rows: ${totalRows}`,
          `all-time data loaded: ${hasAllTime ? 'Yes' : 'No'}`,
          `season data loaded: ${hasSeasons ? 'Yes' : 'No'}`
        ];
        
        setTerminalHistory([...newHistory, ...memLines]);
        setCommandInput('');
        return;
      }
      case 'viewport': {
        const lines = [
          `Window: ${window.innerWidth}x${window.innerHeight}`,
          `Device: ${window.innerWidth < 768 ? 'Mobile' : 'Desktop'}`,
          `PixelRatio: ${window.devicePixelRatio || 1}`
        ];
        setTerminalHistory([...newHistory, ...lines]);
        setCommandInput('');
        return;
      }
      case 'reload-data':
        clearCache();
        setTerminalHistory([...newHistory, 'Reloading data...', 'Data reload complete.']);
        setReloadKey(k => k + 1);
        setCommandInput('');
        return;
      default: output = 'Unknown command. Type help for commands.'; break;
    }
    setTerminalHistory([...newHistory, output]);
    setCommandInput('');
  };

  const toggleTheme = () => {
    triggerThemeTransition();
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Helper to convert hex to RGB for CSS variables
  const getRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
  };

  // Determine current accent hex for global injection
  const accentHex = colors.hex;
  const isMonochrome = settings.siteThemeAccent === "monochrome";
  const monochromeHex = theme === 'dark' ? '#ffffff' : '#09090b';
  const effectiveAccent = isMonochrome ? monochromeHex : accentHex;
  const accentRgb = getRgb(effectiveAccent);

  // Intensity capping for bright themes
  const isBright = ['citrine', 'aquamarine'].includes(settings.siteThemeAccent);
  const fluidOpacity = isBright ? '0.35' : '0.8';

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300 flex flex-col">
      <style>{`
        :root {
          --accent: ${effectiveAccent};
          --accent-rgb: ${accentRgb};
          --accent-soft: rgba(${accentRgb}, 0.05);
          --accent-soft-dark: rgba(${accentRgb}, 0.10);
          --accent-shadow: rgba(${accentRgb}, 0.05);
          --fluid-opacity: ${fluidOpacity};
          
          /* Base Contrast Variables */
          --text: ${theme === 'dark' ? '#f4f4f5' : '#18181b'};
          --mutedText: ${theme === 'dark' ? '#a1a1aa' : '#71717a'};
          --border: ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'};
          --panel: ${theme === 'dark' ? '#09090b' : '#ffffff'};
          --chipBg: ${theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'};
          --shadow: 0 4px 12px rgba(0,0,0,0.1);
          --divider: ${theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'};
        }
        
        /* High Contrast Overrides */
        .high-contrast {
          --text: ${theme === 'dark' ? '#ffffff' : '#000000'};
          --mutedText: ${theme === 'dark' ? '#f4f4f5' : '#18181b'};
          --border: ${theme === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)'};
          --panel: ${theme === 'dark' ? '#000000' : '#ffffff'};
          --chipBg: ${theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'};
          --shadow: 0 0 0 2px var(--border);
          --divider: ${theme === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)'};
        }

        .subtle-divider {
          background: var(--divider);
        }

        .header-divider {
          background: linear-gradient(to right, var(--divider), transparent);
        }

        /* Global High Contrast Class Selectors */
        .high-contrast .text-zinc-900, 
        .high-contrast .dark\\:text-zinc-100,
        .high-contrast .text-zinc-800,
        .high-contrast .dark\\:text-zinc-200,
        .high-contrast .text-zinc-950,
        .high-contrast .dark\\:text-white {
          color: var(--text) !important;
        }

        .high-contrast .text-zinc-500,
        .high-contrast .dark\\:text-zinc-400,
        .high-contrast .text-zinc-600,
        .high-contrast .dark\\:text-zinc-300,
        .high-contrast .text-zinc-700 {
          color: var(--mutedText) !important;
        }

        .high-contrast .text-zinc-400,
        .high-contrast .dark\\:text-zinc-500 {
          color: var(--mutedText) !important;
          opacity: 1 !important;
        }

        .high-contrast .border-zinc-100,
        .high-contrast .dark\\:border-zinc-800,
        .high-contrast .border-zinc-200,
        .high-contrast .dark\\:border-zinc-700,
        .high-contrast .border-zinc-50,
        .high-contrast .dark\\:border-zinc-900,
        .high-contrast .border-white\\/10,
        .high-contrast .dark\\:border-white\\/5,
        .high-contrast .border-white\\/20,
        .high-contrast .dark\\:border-zinc-800\\/50,
        .high-contrast .border-zinc-200\\/50 {
          border-color: var(--border) !important;
          border-width: 1.5px !important;
        }

        .high-contrast .bg-zinc-50,
        .high-contrast .dark\\:bg-zinc-900,
        .high-contrast .bg-zinc-100,
        .high-contrast .dark\\:bg-zinc-800,
        .high-contrast .bg-zinc-50\\/50,
        .high-contrast .dark\\:bg-zinc-900\\/50 {
          background-color: var(--panel) !important;
        }

        .high-contrast .bg-\\[var\\(--accent\\)\\]\\/10,
        .high-contrast .bg-\\[var\\(--accent\\)\\]\\/5 {
          background-color: rgba(var(--accent-rgb), 0.3) !important;
        }

        .high-contrast .shadow-sm,
        .high-contrast .shadow-md,
        .high-contrast .shadow-lg,
        .high-contrast .shadow-xl,
        .high-contrast .shadow-2xl {
          box-shadow: var(--shadow) !important;
        }

        .high-contrast .opacity-40,
        .high-contrast .opacity-50,
        .high-contrast .opacity-60,
        .high-contrast .opacity-70,
        .high-contrast .opacity-80 {
          opacity: 1 !important;
        }

        /* Apply dynamic accent to all elements using the variable */
        .rahbizzy-theme {
          --accent: #3B82F6 !important;
          --accent-rgb: 59, 130, 246 !important;
        }
        
        /* Overrides for dynamic themes if using monochrome */
        ${isMonochrome ? `
          ::selection {
            background: ${monochromeHex} !important;
            color: ${theme === 'dark' ? '#000' : '#fff'} !important;
          }
        ` : `
          ::selection {
            background: ${effectiveAccent} !important;
            color: white !important;
          }
        `}

        .theme-transition,
        .theme-transition *,
        .theme-transition ::before,
        .theme-transition ::after {
          transition: background-color 0.2s ease-out,
                      border-color 0.2s ease-out,
                      color 0.2s ease-out,
                      fill 0.2s ease-out,
                      stroke 0.2s ease-out,
                      box-shadow 0.2s ease-out !important;
          transition-delay: 0s !important;
        }

        /* Developer Mode Classes */
        body.inspect-mode *:not(body):not(html):hover {
          outline: 1px dashed var(--accent) !important;
          outline-offset: -1px;
          cursor: crosshair !important;
        }
      `}</style>

      {settings.reducedMotion && (
        <style>{`
          *, ::before, ::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        `}</style>
      )}

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <ThemeOnboardingModal 
        isOpen={isOnboardingOpen} 
        onComplete={handleOnboardingComplete} 
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <Navbar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onOpenSettings={() => setIsSettingsOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <div className="relative flex-1">
        {/* Debug Panel Toggle (Desktop Only) */}
        <div className="hidden md:block fixed top-2 right-2 z-[100000]">
          <button 
            onClick={() => setIsDebugOpen(!isDebugOpen)}
            className={`p-1.5 border shadow-sm flex items-center justify-center ${
              isDebugOpen 
                ? 'bg-zinc-800 border-zinc-600 text-zinc-300' 
                : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 border-dashed'
            }`}
            title="Debug"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="4 17 10 11 4 5" />
              <line x1="12" y1="19" x2="20" y2="19" />
            </svg>
          </button>
          
          {isDebugOpen && (
            <div className="absolute top-8 right-0 w-56 bg-zinc-950 border border-zinc-800 p-2 text-xs text-zinc-300 shadow-md">
              <div className="font-bold text-zinc-500 mb-1.5 pb-1 border-b border-zinc-800">Debug</div>
              
              <div className="space-y-0.5 mb-2">
                <div className="flex justify-between">
                  <span className="text-zinc-600">View</span>
                  <span>{activeTab}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600">Theme</span>
                  <span>{theme}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600">Reduced Motion</span>
                  <span>{settings.reducedMotion ? 'Yes' : 'No'}</span>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-zinc-800 mt-2 pt-1.5 mb-1.5">
                <span className="text-zinc-500">Dev Tools</span>
                <button
                  type="button"
                  onClick={() => setIsDevMode(!isDevMode)}
                  className={`px-1.5 py-0.5 border border-zinc-700 text-[10px] font-mono leading-none ${
                    isDevMode ? 'bg-zinc-200 text-black border-zinc-200' : 'bg-transparent text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {isDevMode ? 'ON' : 'OFF'}
                </button>
              </div>

              {isDevMode && (
                <div className="border-t border-zinc-800 pt-1.5">
                  <div className="bg-black border border-zinc-800 p-1 flex flex-col h-28">
                    <div 
                      ref={terminalRef}
                      className="flex-1 overflow-y-auto space-y-0.5 mb-1 font-mono text-[10px] break-words scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent leading-tight"
                    >
                      {terminalHistory.map((line, idx) => (
                        <div key={idx} className={`${line.startsWith('>') ? 'text-zinc-600' : 'text-zinc-300'}`}>
                          {line}
                        </div>
                      ))}
                    </div>
                    <form onSubmit={handleTerminalSubmit} className="flex items-center gap-1 border-t border-zinc-900 pt-1 mt-auto">
                      <span className="text-zinc-600 text-[10px] font-mono">&gt;</span>
                      <input 
                        type="text" 
                        className="bg-transparent border-none outline-none text-zinc-300 text-[10px] w-full font-mono placeholder-zinc-800"
                        placeholder="cmd..."
                        value={commandInput}
                        onChange={(e) => setCommandInput(e.target.value)}
                        autoComplete="off"
                        spellCheck="false"
                      />
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <ErrorBoundary>
            {activeTab === 'home' ? (
              <div key={`home-${reloadKey}`} className="w-full">
                <LandingPage 
                  onSearchTrigger={() => {}} 
                  onTabChange={setActiveTab}
                />
              </div>
            ) : (
              <div key={`${activeTab}-${reloadKey}`} className="w-full">
                <TabPage 
                  tabId={activeTab} 
                  onBack={() => setActiveTab('home')} 
                  onTabChange={setActiveTab}
                />
              </div>
            )}
        </ErrorBoundary>
      </div>
      
      <ScrollToTopButton />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  );
};

export default App;