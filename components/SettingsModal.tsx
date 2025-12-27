
import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { teamShortNames } from '../data/standings';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings, resetSettings } = useSettings();

  if (!isOpen) return null;

  const teams = Object.keys(teamShortNames).sort();

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
          
          {/* Appearance */}
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

            {/* Monochrome Theme Toggle */}
            <div className="flex items-center justify-between pt-2">
              <div className="space-y-1">
                <p className="font-bold text-zinc-800 dark:text-zinc-200">Monochrome Theme</p>
                <p className="text-xs text-zinc-500">Grayscale palette across the site.</p>
              </div>
              <button 
                onClick={() => updateSettings({ monochromeTheme: !settings.monochromeTheme })}
                className={`w-12 h-7 rounded-full transition-colors relative ${settings.monochromeTheme ? 'bg-zinc-800 dark:bg-zinc-200' : 'bg-zinc-200 dark:bg-zinc-800'}`}
              >
                <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform shadow-sm ${settings.monochromeTheme ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          </section>

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

          {/* Personalization */}
          <section className="space-y-4">
            <h3 className="text-xs font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-widest">Personalization</h3>
            <div className="space-y-3">
              <p className="font-bold text-zinc-800 dark:text-zinc-200">Favorite Team</p>
              <select 
                value={settings.favoriteTeam} 
                onChange={(e) => updateSettings({ favoriteTeam: e.target.value })}
                className="w-full p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-bold text-zinc-700 dark:text-zinc-300 outline-none focus:border-[#D60A07]/50 transition-colors"
              >
                <option value="">None selected</option>
                {teams.map(team => (
                  <option key={team} value={team}>{team}</option>
                ))}
              </select>
            </div>
          </section>

          {/* Search */}
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

          {/* Special Themes Section */}
          <section className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
             <div className="flex items-center justify-between">
               <div className="space-y-1">
                 <p className="font-bold text-zinc-800 dark:text-zinc-200 text-sm">RahBizzy Special Theme</p>
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

        </div>
      </div>
      
      <style>{`
        @keyframes slide-in-right {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default SettingsModal;

