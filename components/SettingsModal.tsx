import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants, useDragControls } from 'framer-motion';
import { useSettings, THEME_OPTIONS, SiteThemeAccent } from '../context/SettingsContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings, resetSettings } = useSettings();
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  const dragControls = useDragControls();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Esc to close
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Prevent scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const reducedMotion = settings.reducedMotion;

  const modalVariants: Variants = {
    hidden: { 
      opacity: isMobile ? 1 : 0, 
      x: isMobile ? 0 : '100%',
      y: isMobile ? '100%' : 0,
      scale: 1,
      transition: { duration: 0.25, ease: [0.32, 0, 0.67, 0] as any }
    },
    visible: { 
      opacity: 1, 
      x: 0,
      y: 0, 
      scale: 1,
      transition: { 
        duration: reducedMotion ? 0.05 : 0.35, 
        ease: [0.16, 1, 0.3, 1] as any
      }
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } }
  };

  const SettingRow = ({ label, desc, children, isLast = false, rightElement }: { label: string, desc?: string, children: React.ReactNode, isLast?: boolean, rightElement?: React.ReactNode }) => (
    <div className={`flex flex-col py-4 ${!isLast ? 'border-b border-zinc-100/50 dark:border-zinc-800/30' : ''}`}>
      <div className="flex items-center justify-between w-full mb-3">
        <div className="space-y-0.5 pr-4">
          <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">{label}</p>
          {desc && <p className="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium leading-tight">{desc}</p>}
        </div>
        <div className="shrink-0">
          {rightElement}
        </div>
      </div>
      {children}
    </div>
  );

  const ControlRow = ({ label, desc, children, isLast = false }: { label: string, desc?: string, children: React.ReactNode, isLast?: boolean }) => (
    <div className={`flex items-center justify-between py-4 ${!isLast ? 'border-b border-zinc-100/50 dark:border-zinc-800/30' : ''}`}>
      <div className="space-y-0.5 pr-4">
        <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">{label}</p>
        {desc && <p className="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium leading-tight">{desc}</p>}
      </div>
      <div className="shrink-0">
        {children}
      </div>
    </div>
  );

  const Toggle = ({ active, onToggle, color = 'bg-zinc-900 dark:bg-zinc-100' }: { active: boolean, onToggle: () => void, color?: string }) => (
    <button 
      onClick={onToggle}
      className={`w-10 h-6 rounded-full transition-all duration-300 relative ${active ? color : 'bg-zinc-200 dark:bg-zinc-800'}`}
    >
      <motion.div 
        initial={false}
        animate={{ x: active ? 18 : 4 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute top-1 w-4 h-4 bg-white dark:bg-zinc-950 rounded-full shadow-sm" 
      />
    </button>
  );

  const currentThemeOption = THEME_OPTIONS.find(opt => opt.id === settings.siteThemeAccent) || THEME_OPTIONS[0];
  const currentThemeLabel = currentThemeOption.label || 'ufl red';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-end overflow-hidden">
          {/* Backdrop */}
          <motion.div 
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="absolute inset-0 bg-zinc-950/40 backdrop-blur-[2px]" 
            onClick={onClose} 
          />

          {/* Modal/Drawer Container */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            drag={isMobile && !reducedMotion ? "y" : false}
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragEnd={(_: unknown, info: { offset: { x: number; y: number }; velocity: { x: number; y: number } }) => {
              if (info.offset.y > 80 || info.velocity.y > 500) {
                onClose();
              }
            }}
            className={`
              relative flex flex-col w-full bg-white/80 dark:bg-zinc-950/85 backdrop-blur-2xl
              border-l border-white/20 dark:border-zinc-800/50 shadow-2xl
              ${isMobile ? 'h-[85vh] bottom-0 rounded-t-[2.5rem] mt-auto border-t border-l-0' : 'h-full max-w-md rounded-l-[3rem]'}
              overflow-hidden ring-1 ring-inset ring-white/10
            `}
          >
            {/* Liquid-Glass Highlight */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

            {/* Sticky Header */}
            <div 
              className={`sticky top-0 z-20 px-8 py-6 flex flex-col items-center border-b border-zinc-100/50 dark:border-zinc-800/50 bg-white/30 dark:bg-zinc-950/30 backdrop-blur-md ${isMobile ? 'cursor-grab active:cursor-grabbing touch-none' : ''}`}
              onPointerDown={(e) => isMobile && dragControls.start(e)}
            >
              {isMobile && (
                <div className="w-12 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full mb-4 opacity-50" />
              )}
              <div className="flex items-center justify-between w-full">
                <h2 className="text-lg font-black text-zinc-900 dark:text-zinc-100 tracking-tighter uppercase italic">Settings</h2>
                <button 
                  onClick={onClose} 
                  className="p-2 -mr-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-all active:scale-90"
                  aria-label="Close settings"
                  onPointerDown={(e) => e.stopPropagation()} // Prevent drag when clicking the X
                >
                  <svg className="w-5 h-5 text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>s

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-8 pt-6 space-y-8 custom-scrollbar">
              
              {/* Appearance Section */}
              <section className="space-y-4">
                <h3 className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.3em]">Appearance</h3>
                
                <div className="space-y-0">
                  <SettingRow 
                    label="Site Accent Color" 
                    desc="Choose your accent color."
                    rightElement={
                      <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                        {currentThemeLabel}
                      </span>
                    }
                  >
                    <div className="grid grid-cols-5 gap-3 md:gap-4 py-1">
                      {/* Static "Selected" Preview Swatch - Non-clickable */}
                      <div
                        className="relative aspect-square rounded-full border-2 border-zinc-900 dark:border-zinc-100 scale-105 shadow-md flex items-center justify-center cursor-default pointer-events-none"
                        title="Selected Color"
                      >
                        <div 
                          className="w-full h-full rounded-full border border-black/5 dark:border-white/10 flex items-center justify-center"
                          style={{ backgroundColor: currentThemeOption.color }}
                        >
                          <div className="text-white drop-shadow-sm">
                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Selectable Swatches */}
                      {THEME_OPTIONS.map((option) => {
                        const isSelected = settings.siteThemeAccent === option.id;
                        return (
                          <button
                            key={option.id}
                            onClick={() => updateSettings({ siteThemeAccent: option.id })}
                            className={`
                              relative aspect-square rounded-full transition-all duration-300 p-0.5 border-2 flex items-center justify-center
                              ${isSelected 
                                ? 'border-zinc-900 dark:border-zinc-100 scale-105 shadow-md' 
                                : 'border-transparent hover:scale-105 active:scale-95'}
                            `}
                            title={option.label}
                          >
                            <div 
                              className="w-full h-full rounded-full border border-black/5 dark:border-white/10 flex items-center justify-center"
                              style={{ backgroundColor: option.color }}
                            >
                              {isSelected && (
                                <motion.div 
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  className="text-white drop-shadow-sm"
                                >
                                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                  </svg>
                                </motion.div>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </SettingRow>

                  <ControlRow label="Sticky Header" desc="Keep navigation visible while scrolling.">
                    <Toggle active={settings.stickyHeader} onToggle={() => updateSettings({ stickyHeader: !settings.stickyHeader })} />
                  </ControlRow>
                </div>
              </section>

              {/* Accessibility Section */}
              <section className="space-y-4">
                <h3 className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.3em]">Accessibility</h3>
                <div className="space-y-0">
                  <ControlRow label="Reduced Motion" desc="Disables non-essential animations.">
                    <Toggle active={settings.reducedMotion} onToggle={() => updateSettings({ reducedMotion: !settings.reducedMotion })} />
                  </ControlRow>
                  <ControlRow label="High Contrast" desc="Enhances text and border visibility.">
                    <Toggle active={settings.highContrast} onToggle={() => updateSettings({ highContrast: !settings.highContrast })} />
                  </ControlRow>
                  <ControlRow label="Quick Search" desc="Enable '/' keyboard shortcut." isLast={isMobile}>
                    <Toggle active={settings.searchSlashOpens} onToggle={() => updateSettings({ searchSlashOpens: !settings.searchSlashOpens })} />
                  </ControlRow>
                </div>
              </section>

              {/* Special Themes */}
              <section className="space-y-4">
                <h3 className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.3em]">Special</h3>
                <ControlRow label="JewBizzy Special Theme" desc="Secret theme for JewBizzy lovers." isLast>
                  <Toggle 
                    active={settings.rahBizzyTheme} 
                    onToggle={() => updateSettings({ rahBizzyTheme: !settings.rahBizzyTheme })}
                    color="bg-[#3B82F6]"
                  />
                </ControlRow>
              </section>

              {/* Danger Zone */}
              <section className="space-y-4 pt-4 border-t border-zinc-100/50 dark:border-zinc-800/30">
                <button 
                  onClick={resetSettings}
                  className="w-full h-11 bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" />
                  </svg>
                  Reset preferences
                </button>
                <div className="text-center">
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400 dark:text-zinc-600 opacity-40">Version 1.5.2 *giggles cutely*</span>
                </div>
              </section>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SettingsModal;