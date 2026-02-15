import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type SiteThemeAccent = "malachite" | "citrine" | "marigold" | "aquamarine" | "byzantium" | "mulberry" | "taupe" | "monochrome" | "default";

export interface Settings {
  rahBizzyTheme: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
  stickyHeader: boolean;
  searchSlashOpens: boolean;
  siteThemeAccent: SiteThemeAccent;
}

interface ThemeColors {
  text: string;
  bg: string;
  bgSoft: string;
  border: string;
  shadow: string;
  hoverShadow: string;
  hex: string;
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  resetSettings: () => void;
  getThemeColors: (isHOF?: boolean) => ThemeColors;
}

const defaultSettings: Settings = {
  rahBizzyTheme: false,
  reducedMotion: false,
  highContrast: false,
  stickyHeader: true,
  searchSlashOpens: true,
  siteThemeAccent: "default",
};

const THEME_ACCENTS: Record<SiteThemeAccent, string> = {
  default: "#D60A07",
  malachite: "#45C089",
  citrine: "#E4D007",
  marigold: "#EAA221",
  aquamarine: "#7FFFD4",
  byzantium: "#702963",
  mulberry: "#C64B8C",
  taupe: "#B9A281",
  monochrome: "#71717a", // Fallback, monochrome logic is handled specifically
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
    // Priority 1: RahBizzy Theme (Blue)
    if (settings.rahBizzyTheme) {
      return {
        text: 'text-[#3B82F6]',
        bg: 'bg-[#3B82F6]',
        bgSoft: 'bg-[#3B82F6]/5 dark:bg-[#3B82F6]/10',
        border: 'border-[#3B82F6]/30',
        shadow: 'shadow-[0_4px_12px_rgba(59,130,246,0.2)]',
        hoverShadow: 'hover:shadow-[#3B82F6]/5',
        hex: "#3B82F6"
      };
    }
    
    // Priority 2: HOF Override (Gold) - Only if not forced by global theme? 
    // Usually HOF pages have a specific look.
    if (isHOF) {
      return {
        text: 'text-[#D4AF37]',
        bg: 'bg-[#D4AF37]',
        bgSoft: 'bg-[#D4AF37]/10 dark:bg-[#D4AF37]/20',
        border: 'border-[#D4AF37]/50',
        shadow: 'shadow-[0_4px_12px_rgba(212,175,55,0.2)]',
        hoverShadow: 'hover:shadow-[#D4AF37]/5',
        hex: "#D4AF37"
      };
    }

    // Priority 3: Custom Site Accent
    if (settings.siteThemeAccent && settings.siteThemeAccent !== "default") {
      const hex = THEME_ACCENTS[settings.siteThemeAccent];
      const isMonochrome = settings.siteThemeAccent === "monochrome";
      
      return {
        text: isMonochrome ? 'text-zinc-900 dark:text-zinc-100' : `text-[${hex}]`,
        bg: isMonochrome ? 'bg-zinc-900 dark:bg-zinc-100' : `bg-[${hex}]`,
        bgSoft: `bg-zinc-400/5 dark:bg-zinc-400/10`,
        border: isMonochrome ? 'border-zinc-900/30 dark:border-zinc-100/30' : `border-[${hex}]/30`,
        shadow: `shadow-[0_4px_12px_rgba(0,0,0,0.1)]`,
        hoverShadow: 'hover:shadow-zinc-400/5',
        hex: hex
      };
    }

    // Default Red
    return {
      text: 'text-[#D60A07]',
      bg: 'bg-[#D60A07]',
      bgSoft: 'bg-[#D60A07]/5 dark:bg-[#D60A07]/10',
      border: 'border-[#D60A07]/30',
      shadow: 'shadow-[0_4px_12px_rgba(214,10,7,0.2)]',
      hoverShadow: 'hover:shadow-[#D60A07]/5',
      hex: "#D60A07"
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