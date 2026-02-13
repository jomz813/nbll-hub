
import React, { useState, useEffect } from 'react';
import { useSettings, SiteThemeAccent } from '../context/SettingsContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const THEME_OPTIONS: { id: SiteThemeAccent; label: string; color: string }[] = [
  { id: "default", label: "Default", color: "#D60A07" },
  { id: "malachite", label: "Malachite", color: "#45C089" },
  { id: "citrine", label: "Citrine", color: "#E4D007" },
  { id: "marigold", label: "Marigold", color: "#EAA221" },
  { id: "aquamarine", label: "Aquamarine", color: "#7FFFD4" },
  { id: "byzantium", label: "Byzantium", color: "#702963" },
  { id: "mulberry", label: "Mulberry", color: "#C64B8C" },
  { id: "taupe", label: "Taupe", color: "#B9A281" },
  { id: "monochrome", label: "Monochrome", color: "#9CA3AF" },
];

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings, resetSettings } = useSettings();
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer */}
      <div className="relative w-full max-w-md h-full bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col animate-slide-in-right">
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-white/50 dark:bg-zinc-950/50 backdrop-blur-md z-10">
          <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">Settings</h2>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
            <svg className="w-5 h-5 text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-10 custom-scrollbar">
          
          {/* Site Color Themes */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-widest">Site Color Themes</h3>
              <span className="text-[10px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
                {THEME_OPTIONS.find(o => o.id === settings.siteThemeAccent)?.label || "Default"}
              </span>
            </div>
            
            <div className="flex flex-nowrap items-center justify-between gap-1 py-2 overflow-x-hidden">
              {THEME_OPTIONS.map((option) => {
                const isSelected = settings.siteThemeAccent === option.id;
                
                return (
                  <button
                    key={option.id}
                    onClick={() => updateSettings({ siteThemeAccent: option.id })}
                    className={`
                      relative w-[34px] h-[34px] rounded-full transition-all duration-300 p-[2px] border-2 flex items-center justify-center flex-shrink-0
                      ${isSelected 
                        ? 'border-zinc-900 dark:border-zinc-100 scale-110 shadow-lg ring-4 ring-zinc-900/10 dark:ring-zinc-100/10 z-10' 
                        : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:scale-105 active:scale-95 shadow-sm'}
                    `}
                    title={option.label}
                  >
                    <div 
                      className="w-full h-full rounded-full border border-black/5 dark:border-white/10"
                      style={{ backgroundColor: option.color }}
                    />
                    
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-zinc-900 dark:bg-zinc-100 rounded-full flex items-center justify-center border-[1.5px] border-white dark:border-zinc-950 shadow-sm animate-pop-in">
                        <svg className="w-2 h-2 text-white dark:text-zinc-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Appearance - Desktop Only */}
          {!isMobile && (
            <section className="space-y-4">
              <h3 className="text-xs font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-widest">Appearance</h3>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-bold text-zinc-800 dark:text-zinc-200">Font Size</p>
                  <p className="text-xs text-zinc-500">Adjust the global text size.</p>
                </div>
                <div className="flex bg-zinc-100 dark:bg-zinc-900 rounded-lg p-1">
                  <button
                    onClick={() => updateSettings({ fontSize: 'normal' })}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${settings.fontSize === 'normal' ? 'bg-white dark:bg-zinc-800 shadow-sm text-zinc-900 dark:text-zinc-100' : 'text-zinc-400 dark:text-zinc-600'}`}
                  >
                    Normal
                  </button>
                  <button
                    onClick={() => updateSettings({ fontSize: 'large' })}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${settings.fontSize === 'large' ? 'bg-white dark:bg-zinc-800 shadow-sm text-zinc-900 dark:text-zinc-100' : 'text-zinc-400 dark:text-zinc-600'}`}
                  >
                    Large
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* Accessibility */}
          <section className="space-y-4">
            <h3 className="text-xs font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-widest">Accessibility</h3>
            
            {/* Reduced Motion */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-bold text-zinc-800 dark:text-zinc-200">Reduced Motion</p>
                <p className="text-xs text-zinc-500">Disables animations and transitions.</p>
              </div>
              <button 
                onClick={() => updateSettings({ reducedMotion: !settings.reducedMotion })}
                className={`w-12 h-7 rounded-full transition-colors relative ${settings.reducedMotion ? 'bg-zinc-800 dark:bg-zinc-200' : 'bg-zinc-200 dark:bg-zinc-800'}`}
              >
                <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform shadow-sm ${settings.reducedMotion ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* High Contrast */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-bold text-zinc-800 dark:text-zinc-200">High Contrast</p>
                <p className="text-xs text-zinc-500">Increases visibility of text and borders.</p>
              </div>
              <button 
                onClick={() => updateSettings({ highContrast: !settings.highContrast })}
                className={`w-12 h-7 rounded-full transition-colors relative ${settings.highContrast ? 'bg-zinc-800 dark:bg-zinc-200' : 'bg-zinc-200 dark:bg-zinc-800'}`}
              >
                <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform shadow-sm ${settings.highContrast ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          </section>

          {/* Layout */}
          <section className="space-y-4">
            <h3 className="text-xs font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-widest">Layout</h3>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-bold text-zinc-800 dark:text-zinc-200">Sticky Header</p>
                <p className="text-xs text-zinc-500">Keep navbar visible while scrolling.</p>
              </div>
              <button 
                onClick={() => updateSettings({ stickyHeader: !settings.stickyHeader })}
                className={`w-12 h-7 rounded-full transition-colors relative ${settings.stickyHeader ? 'bg-zinc-800 dark:bg-zinc-200' : 'bg-zinc-200 dark:bg-zinc-800'}`}
              >
                <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform shadow-sm ${settings.stickyHeader ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          </section>

          {/* Search - Desktop Only */}
          {!isMobile && (
            <section className="space-y-4">
              <h3 className="text-xs font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-widest">Search</h3>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-bold text-zinc-800 dark:text-zinc-200">Press / to Open</p>
                </div>
                <button 
                  onClick={() => updateSettings({ searchSlashOpens: !settings.searchSlashOpens })}
                  className={`w-12 h-7 rounded-full transition-colors relative ${settings.searchSlashOpens ? 'bg-zinc-800 dark:bg-zinc-200' : 'bg-zinc-200 dark:bg-zinc-800'}`}
                >
                  <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform shadow-sm ${settings.searchSlashOpens ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </section>
          )}

          {/* Data */}
          <section className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <h3 className="text-xs font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-widest">Data</h3>
            <button 
              onClick={resetSettings}
              className="w-full py-3 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 font-bold rounded-xl border border-red-100 dark:border-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
            >
              Clear saved prefs & Reload
            </button>
          </section>

          {/* JewBizzy Special Theme (Hidden/Bottom) */}
          <section className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
             <div className="flex items-center justify-between">
               <div className="space-y-1">
                 <p className="font-bold text-zinc-800 dark:text-zinc-200 text-sm">JewBizzy Special Theme</p>
                 <p className="text-[10px] text-zinc-400">Forces site theme to Blue + White.</p>
               </div>
               <button 
                 onClick={() => updateSettings({ rahBizzyTheme: !settings.rahBizzyTheme })}
                 className={`w-12 h-7 rounded-full transition-colors relative ${settings.rahBizzyTheme ? 'bg-[#3B82F6]' : 'bg-zinc-200 dark:bg-zinc-800'}`}
               >
                 <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform shadow-sm ${settings.rahBizzyTheme ? 'translate-x-5' : 'translate-x-0'}`} />
               </button>
             </div>
          </section>

          {/* Version Footer - Desktop Only */}
          {!isMobile && (
            <div className="pt-8 pb-2 text-center opacity-40">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-600">
                Current version 1.5.2
              </span>
            </div>
          )}

        </div>
      </div>
      
      <style>{`
        @keyframes slide-in-right {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes pop-in {
          0% { transform: scale(0); opacity: 0; }
          70% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-pop-in {
          animation: pop-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default SettingsModal;
