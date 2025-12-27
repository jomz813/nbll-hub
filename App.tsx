
import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import TabPage from './components/TabPage';
import Navbar from './components/Navbar';
import SearchOverlay from './components/SearchOverlay';
import SettingsModal from './components/SettingsModal';
import { SettingsProvider, useSettings } from './context/SettingsContext';

export type TabID = 'home' | 'standings' | 'schedule' | 'stats' | 'legacy' | 'rules' | 'more' | 'partner-hub' | 'hall-of-fame' | 'league-history' | 'credits' | 'records' | string;

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabID>('home');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const { settings } = useSettings();

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
    if (settings.rahBizzyTheme) {
      root.classList.add('rahbizzy-theme');
    } else {
      root.classList.remove('rahbizzy-theme');
    }

    // Monochrome Theme
    if (settings.monochromeTheme) {
      root.classList.add('monochrome-theme');
    } else {
      root.classList.remove('monochrome-theme');
    }

  }, [settings]);

  // Global Keyboard Shortcut for Search
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Check if feature enabled, key is '/', and no modifiers pressed
      if (settings.searchSlashOpens && e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        // Only trigger if not typing in a form field
        const target = e.target as HTMLElement;
        const tagName = target.tagName;
        if (!target.isContentEditable && tagName !== 'INPUT' && tagName !== 'TEXTAREA' && tagName !== 'SELECT') {
          e.preventDefault();
          setIsSearchOpen(true);
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [settings.searchSlashOpens]);

  // HOF Theme class
  useEffect(() => {
    document.body.classList.remove('theme-hof');
    if (activeTab === 'hall-of-fame') {
      document.body.classList.add('theme-hof');
    }
  }, [activeTab]);

  const toggleTheme = () => {
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
        .monochrome-theme {
          --accent: #52525b !important; /* zinc-600 */
          --accent-soft: rgba(82, 82, 91, 0.05) !important;
          --accent-soft-dark: rgba(82, 82, 91, 0.10) !important;
          --accent-shadow: rgba(0, 0, 0, 0.05) !important;
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

      {settings.monochromeTheme && (
        <style>{`
          ::selection {
            background: #27272a !important; /* zinc-800 */
            color: white !important;
          }
          .theme-hof .accent-line, .theme-hof ::selection {
             background: #3f3f46 !important; /* zinc-700 */
             color: white !important;
          }
        `}</style>
      )}

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      <SearchOverlay 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        onSelectTab={setActiveTab}
      />

      <Navbar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onSearchTrigger={() => setIsSearchOpen(true)} 
        onOpenSettings={() => setIsSettingsOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {activeTab === 'home' ? (
        <LandingPage 
          onSearchTrigger={() => setIsSearchOpen(true)}
          onTabChange={setActiveTab}
        />
      ) : (
        <TabPage 
          tabId={activeTab} 
          onBack={() => setActiveTab('home')} 
          onTabChange={setActiveTab}
        />
      )}
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
