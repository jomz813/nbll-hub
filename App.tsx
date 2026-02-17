import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import LandingPage from './components/LandingPage';
import TabPage from './components/TabPage';
import Navbar from '././components/Navbar';
import SettingsModal from './components/SettingsModal';
import ThemeOnboardingModal from './components/ThemeOnboardingModal';
import RouteTransition from './components/RouteTransition';
import ScrollToTopButton from './components/ScrollToTopButton';
import { SettingsProvider, useSettings } from './context/SettingsContext';

export type TabID = 'home' | 'stats' | 'legacy' | 'rules' | 'more' | 'partner-hub' | 'hall-of-fame' | 'league-history' | 'credits' | 'records' | 'compare' | 'achievements' | string;

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabID>('home');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const { settings, getThemeColors } = useSettings();

  const colors = getThemeColors();

  // Track previous RahBizzy or Accent theme state to trigger transitions
  const prevAccentTheme = useRef(settings.siteThemeAccent);
  const prevRahBizzyTheme = useRef(settings.rahBizzyTheme);

  // Initialize theme and onboarding status from localStorage
  useEffect(() => {
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
  }, []);

  const handleOnboardingComplete = () => {
    setIsOnboardingOpen(false);
    localStorage.setItem('nbll_theme_onboarded', '1');
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