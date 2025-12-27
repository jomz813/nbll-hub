
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Settings {
  rahBizzyTheme: boolean;
  monochromeTheme: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
  fontSize: 'normal' | 'large';
  stickyHeader: boolean;
  favoriteTeam: string;
  searchSlashOpens: boolean;
}

interface ThemeColors {
  text: string;
  bg: string;
  bgSoft: string;
  border: string;
  shadow: string;
  hoverShadow: string;
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  resetSettings: () => void;
  getThemeColors: (isHOF?: boolean) => ThemeColors;
}

const defaultSettings: Settings = {
  rahBizzyTheme: false,
  monochromeTheme: false,
  reducedMotion: false,
  highContrast: false,
  fontSize: 'normal',
  stickyHeader: true,
  favoriteTeam: '',
  searchSlashOpens: true,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    const saved = localStorage.getItem('nbll_settings');
    if (saved) {
      try {
        setSettings({ ...defaultSettings, ...JSON.parse(saved) });
      } catch (e) {
        console.error('Failed to parse settings', e);
      }
    }
  }, []);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('nbll_settings', JSON.stringify(updated));
      return updated;
    });
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem('nbll_settings');
    window.location.reload();
  };

  const getThemeColors = (isHOF = false): ThemeColors => {
    // Monochrome overrides all other themes for colored accents
    if (settings.monochromeTheme) {
      return {
        text: 'text-zinc-600 dark:text-zinc-400',
        bg: 'bg-zinc-800 dark:bg-zinc-200',
        bgSoft: 'bg-zinc-100 dark:bg-zinc-800',
        border: 'border-zinc-300 dark:border-zinc-600',
        shadow: 'shadow-[0_4px_12px_rgba(0,0,0,0.1)]',
        hoverShadow: 'hover:shadow-zinc-500/5'
      };
    }

    if (settings.rahBizzyTheme) {
      return {
        text: 'text-[#3B82F6]',
        bg: 'bg-[#3B82F6]',
        bgSoft: 'bg-[#3B82F6]/5 dark:bg-[#3B82F6]/10',
        border: 'border-[#3B82F6]/30',
        shadow: 'shadow-[0_4px_12px_rgba(59,130,246,0.2)]',
        hoverShadow: 'hover:shadow-[#3B82F6]/5'
      };
    }
    
    if (isHOF) {
      return {
        text: 'text-[#D4AF37]',
        bg: 'bg-[#D4AF37]',
        bgSoft: 'bg-[#D4AF37]/10 dark:bg-[#D4AF37]/20',
        border: 'border-[#D4AF37]/50',
        shadow: 'shadow-[0_4px_12px_rgba(212,175,55,0.2)]',
        hoverShadow: 'hover:shadow-[#D4AF37]/5'
      };
    }

    // Default Red
    return {
      text: 'text-[#D60A07]',
      bg: 'bg-[#D60A07]',
      bgSoft: 'bg-[#D60A07]/5 dark:bg-[#D60A07]/10',
      border: 'border-[#D60A07]/30',
      shadow: 'shadow-[0_4px_12px_rgba(214,10,7,0.2)]',
      hoverShadow: 'hover:shadow-[#D60A07]/5'
    };
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings, getThemeColors }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
