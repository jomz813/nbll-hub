import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useSettings, THEME_OPTIONS, SiteThemeAccent } from '../context/SettingsContext';

interface ThemeOnboardingModalProps {
  isOpen: boolean;
  onComplete: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const ThemeOnboardingModal: React.FC<ThemeOnboardingModalProps> = ({ isOpen, onComplete, theme, onToggleTheme }) => {
  const { settings, updateSettings } = useSettings();
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Local state for live previewing before confirm
  const [previewAccentId, setPreviewAccentId] = useState<SiteThemeAccent>(settings.siteThemeAccent || 'default');

  const previewTheme = THEME_OPTIONS.find(t => t.id === previewAccentId) || THEME_OPTIONS[0];
  const previewHex = previewTheme.color;

  const handleConfirm = () => {
    updateSettings({ siteThemeAccent: previewAccentId });
    onComplete();
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15, scale: 0.95 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring", stiffness: 400, damping: 30 } as any
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/85 backdrop-blur-3xl"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 } as any}
            style={{ 
              borderColor: `${previewHex}66`, // Live preview border with alpha
              borderWidth: '2px'
            }}
            className="relative w-full max-w-lg bg-white dark:bg-zinc-950 border rounded-[2.5rem] shadow-2xl overflow-hidden backdrop-blur-md flex flex-col max-h-full transition-all duration-500"
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-900/10 dark:via-white/20 to-transparent pointer-events-none" />
            
            <div className="px-6 py-8 md:px-10 md:py-8 text-center flex-1 overflow-hidden flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-6"
              >
                <h2 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase italic leading-none mb-3 transition-colors duration-500">personalize</h2>
                <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-widest leading-relaxed">
                  you can always change this later in settings
                </p>
              </motion.div>

              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-3 gap-3 md:gap-4 px-1"
              >
                {THEME_OPTIONS.map((option) => {
                  const isSelected = previewAccentId === option.id;
                  const displayLabel = option.label.toLowerCase();
                  return (
                    <motion.button
                      key={option.id}
                      variants={itemVariants}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setPreviewAccentId(option.id)}
                      className={`
                        relative group flex flex-col items-center justify-center py-4 px-2 rounded-3xl transition-all duration-300
                        ${isSelected 
                          ? 'bg-zinc-900/5 dark:bg-white/10 border-zinc-900/10 dark:border-white/20 shadow-lg' 
                          : 'bg-zinc-100/50 dark:bg-white/5 hover:bg-zinc-200/50 dark:hover:bg-white/[0.08] border-zinc-200/50 dark:border-white/5'}
                        border
                      `}
                    >
                      <div 
                        className="w-10 h-10 md:w-12 md:h-12 rounded-full mb-2 shadow-lg border border-black/20 flex items-center justify-center transition-transform group-hover:scale-105"
                        style={{ backgroundColor: option.color }}
                      >
                         {isSelected && (
                           <motion.svg 
                             initial={{ scale: 0 }} 
                             animate={{ scale: 1 }} 
                             className="w-5 h-5 text-white drop-shadow-md" 
                             fill="none" 
                             viewBox="0 0 24 24" 
                             stroke="currentColor" 
                             strokeWidth="5"
                           >
                             <polyline points="20 6 9 17 4 12" />
                           </motion.svg>
                         )}
                      </div>
                      <span className={`text-[9px] font-black uppercase tracking-widest truncate w-full px-1 transition-colors duration-300 ${isSelected ? 'text-zinc-900 dark:text-white' : 'text-zinc-400 dark:text-zinc-500'}`}>
                        {displayLabel}
                      </span>
                    </motion.button>
                  );
                })}
              </motion.div>
            </div>

            {/* Bottom Control Row */}
            <div className="px-8 py-6 border-t border-zinc-100 dark:border-white/5 bg-zinc-50/50 dark:bg-black/20 flex items-center transition-colors duration-500">
               {/* Bottom-left toggle */}
               <div className="w-12 h-12 flex items-center justify-start shrink-0">
                  <button 
                    onClick={onToggleTheme}
                    className="p-3 rounded-full hover:bg-zinc-900/5 dark:hover:bg-white/5 transition-colors text-zinc-400 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white active:scale-90"
                    aria-label="Toggle dark mode preview"
                  >
                    {theme === 'dark' ? (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="5" />
                        <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                        <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                      </svg>
                    )}
                  </button>
               </div>

               {/* Center: Action Button */}
               <div className="flex-1 flex justify-center">
                 <button 
                   onClick={handleConfirm}
                   style={{ 
                     backgroundColor: previewHex,
                     boxShadow: `0 8px 24px -6px ${previewHex}66`
                   }}
                   className="px-10 py-2.5 rounded-full text-white text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 hover:scale-105 active:scale-95 shadow-lg"
                 >
                   confirm
                 </button>
               </div>

               {/* Right Spacer to keep Confirm centered */}
               <div className="w-12 shrink-0" />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ThemeOnboardingModal;