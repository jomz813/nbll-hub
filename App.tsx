import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import LandingPage from './components/LandingPage';
import TabPage from './components/TabPage';
import Navbar from './components/Navbar';
import SettingsModal from './components/SettingsModal';
import RouteTransition from './components/RouteTransition';
import ScrollToTopButton from './components/ScrollToTopButton';
import { SettingsProvider, useSettings } from './context/SettingsContext';

export type TabID = 'home' | 'schedule' | 'stats' | 'legacy' | 'rules' | 'more' | 'partner-hub' | 'hall-of-fame' | 'league-history' | 'credits' | 'records' | string;

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabID>('home');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const { settings } = useSettings();

  // Track previous RahBizzy theme state to trigger transitions only on change
  const prevRahBizzyTheme = useRef(settings.rahBizzyTheme);

  // Initialize theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
      if (!savedTheme) {
        localStorage.setItem('theme', 'light');
      }
    }
  }, []);

  // Helper to trigger smooth transition
  const triggerThemeTransition = () => {
    if (settings.reducedMotion) return;
    
    document.documentElement.classList.add('theme-transition');
    
    // Remove class after transition completes (250ms to match CSS)
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
    
    // Reduced Motion
    if (settings.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }

    // High Contrast
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Font Size
    if (settings.fontSize === 'large') {
      root.classList.add('font-large');
    } else {
      root.classList.remove('font-large');
    }

    // RahBizzy Theme
    // Check if changed
    if (prevRahBizzyTheme.current !== settings.rahBizzyTheme) {
      triggerThemeTransition();
      prevRahBizzyTheme.current = settings.rahBizzyTheme;
    }

    if (settings.rahBizzyTheme) {
      root.classList.add('rahbizzy-theme');
    } else {
      root.classList.remove('rahbizzy-theme');
    }

  }, [settings]);

  // HOF Theme class
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

  return (
    <div className="min-h-screen transition-colors duration-300">
      {/* Dynamic Theme Variables */}
      <style>{`
        :root {
          --accent: #D60A07;
          --accent-soft: rgba(214, 10, 7, 0.05);
          --accent-soft-dark: rgba(214, 10, 7, 0.10);
          --accent-shadow: rgba(214, 10, 7, 0.05);
        }
        .rahbizzy-theme {
          --accent: #3B82F6 !important;
          --accent-soft: rgba(59, 130, 246, 0.05) !important;
          --accent-soft-dark: rgba(59, 130, 246, 0.10) !important;
          --accent-shadow: rgba(59, 130, 246, 0.05) !important;
        }
        
        /* Smooth Theme Transition Class */
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

      {/* Global Style Overrides based on Settings */}
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

      {settings.highContrast && (
        <style>{`
          .high-contrast {
            --tw-text-opacity: 1 !important;
          }
          /* Light Mode Overrides */
          .high-contrast .text-zinc-400, 
          .high-contrast .text-zinc-500, 
          .high-contrast .text-zinc-600 {
            color: #18181b !important; /* zinc-900 */
          }
          .high-contrast .border-zinc-100, 
          .high-contrast .border-zinc-200 {
            border-color: #a1a1aa !important; /* zinc-400 */
          }
          .high-contrast .bg-zinc-50 {
            background-color: #f4f4f5 !important; /* zinc-100 */
          }

          /* Dark Mode Overrides */
          .dark.high-contrast .text-zinc-400, 
          .dark.high-contrast .text-zinc-500, 
          .dark.high-contrast .text-zinc-600 {
            color: #f4f4f5 !important; /* zinc-100 */
          }
          .dark.high-contrast .border-zinc-800, 
          .dark.high-contrast .border-zinc-700 {
            border-color: #71717a !important; /* zinc-500 */
          }
          .dark.high-contrast .bg-zinc-900 {
            background-color: #09090b !important; /* zinc-950 for deeper contrast against content */
          }
        `}</style>
      )}

      {settings.fontSize === 'large' && (
        <style>{`
          html.font-large {
            font-size: 112.5%; /* Approx 18px base */
          }
        `}</style>
      )}
      
      {settings.rahBizzyTheme && (
        <style>{`
          ::selection {
            background: #3B82F6 !important;
            color: white !important;
          }
          /* Override HOF selection if RahBizzy is active */
          .theme-hof ::selection {
            background: #3B82F6 !important;
            color: white !important;
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

      <AnimatePresence mode="wait">
        {activeTab === 'home' ? (
          <RouteTransition key="home">
            <LandingPage 
              onSearchTrigger={() => {}} // Legacy prop handler if needed by LandingPage, but functionality moved to Navbar
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