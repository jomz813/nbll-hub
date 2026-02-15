
import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import LandingPage from './components/LandingPage';
import TabPage from './components/TabPage';
import Navbar from './components/Navbar';
import SettingsModal from './components/SettingsModal';
import RouteTransition from './components/RouteTransition';
import ScrollToTopButton from './components/ScrollToTopButton';
import { SettingsProvider, useSettings } from './context/SettingsContext';

export type TabID = 'home' | 'stats' | 'legacy' | 'rules' | 'more' | 'partner-hub' | 'hall-of-fame' | 'league-history' | 'credits' | 'records' | 'compare' | 'achievements' | string;

const DevLock: React.FC<{ onUnlock: () => void }> = ({ onUnlock }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === '5207') {
      localStorage.setItem('devUnlocked', 'true');
      onUnlock();
    } else {
      setError(true);
      setCode('');
      setTimeout(() => setError(false), 500);
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="fixed inset-0 z-[99999] bg-black flex flex-col items-center justify-center pointer-events-auto p-6 text-center">
      <div className={`space-y-8 w-full max-w-xs transition-transform duration-100 ${error ? 'animate-shake' : ''}`}>
        <div className="space-y-2">
          <h2 className="text-white text-3xl font-black tracking-tighter uppercase">Dev Lock</h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">Enter code to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={4}
            value={code}
            onChange={(e) => {
              setError(false);
              setCode(e.target.value.replace(/[^0-9]/g, ''));
            }}
            placeholder="••••"
            className={`w-full bg-zinc-900 border-2 ${error ? 'border-red-500' : 'border-zinc-800 focus:border-white'} rounded-2xl py-4 px-6 text-center text-2xl font-black text-white tracking-[1em] outline-none transition-all placeholder:text-zinc-800 placeholder:tracking-normal`}
          />
          
          <button
            type="submit"
            className="w-full py-4 bg-white text-black rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-zinc-200 active:scale-95 transition-all"
          >
            Dev Unlock
          </button>
        </form>

        {error && (
          <p className="text-red-500 text-[10px] font-black uppercase tracking-widest animate-pulse">Incorrect Code</p>
        )}
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        .animate-shake {
          animation: shake 0.2s cubic-bezier(.36,.07,.19,.97) both;
          animation-iteration-count: 2;
        }
      `}</style>
    </div>
  );
};

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabID>('home');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const { settings, getThemeColors } = useSettings();
  const [isUnlocked, setIsUnlocked] = useState(() => {
    return localStorage.getItem('devUnlocked') === 'true';
  });

  const colors = getThemeColors();

  // Track previous RahBizzy or Accent theme state to trigger transitions
  const prevAccentTheme = useRef(settings.siteThemeAccent);
  const prevRahBizzyTheme = useRef(settings.rahBizzyTheme);

  // Initialize theme from localStorage on mount
  useEffect(() => {
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
  }, []);

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
    localStorage.setItem('theme', theme);
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

    if (settings.fontSize === 'large') root.classList.add('font-large');
    else root.classList.remove('font-large');

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
      {!isUnlocked && <DevLock onUnlock={() => setIsUnlocked(true)} />}

      <style>{`
        :root {
          --accent: ${effectiveAccent};
          --accent-rgb: ${accentRgb};
          --accent-soft: rgba(${accentRgb}, 0.05);
          --accent-soft-dark: rgba(${accentRgb}, 0.10);
          --accent-shadow: rgba(${accentRgb}, 0.05);
          --fluid-opacity: ${fluidOpacity};
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

      <Navbar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onOpenSettings={() => setIsSettingsOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <div className="relative flex-1">
        <AnimatePresence mode="wait">
          {activeTab === 'home' ? (
            <RouteTransition key="home">
              <LandingPage 
                onSearchTrigger={() => {}} 
                onTabChange={setActiveTab}
              />
            </RouteTransition>
          ) : (
            <RouteTransition key={activeTab}>
              <TabPage 
                tabId={activeTab} 
                onBack={() => setActiveTab('home')} 
                onTabChange={setActiveTab}
              />
            </RouteTransition>
          )}
        </AnimatePresence>
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
