
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';

const ScrollToTopButton: React.FC = () => {
  const { settings, getThemeColors } = useSettings();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Check scroll position (450px threshold)
          setIsVisible(window.scrollY > 450);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: settings.reducedMotion ? 'auto' : 'smooth'
    });
  };

  const colors = getThemeColors();
  const accentText = colors.text;
  
  // Base classes for positioning, size, shape, shadow, border, colors
  const baseClasses = `
    fixed z-40 flex items-center justify-center w-12 h-12 rounded-full 
    bg-white dark:bg-zinc-900 
    border border-zinc-200 dark:border-zinc-800
    shadow-lg hover:shadow-xl
    ${accentText}
    hover:bg-zinc-50 dark:hover:bg-zinc-800
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current
    transition-colors
    cursor-pointer
  `;

  // Inline styles for safe area
  const style: React.CSSProperties = {
    bottom: 'calc(16px + env(safe-area-inset-bottom))',
    right: 'calc(16px + env(safe-area-inset-right))',
  };

  return (
    <AnimatePresence>
      {isVisible && (
        settings.reducedMotion ? (
          <button
            onClick={scrollToTop}
            className={baseClasses}
            style={style}
            aria-label="Scroll to top"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="19" x2="12" y2="5"></line>
              <polyline points="5 12 12 5 19 12"></polyline>
            </svg>
          </button>
        ) : (
          <motion.button
            onClick={scrollToTop}
            className={baseClasses}
            style={style}
            aria-label="Scroll to top"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
             <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="19" x2="12" y2="5"></line>
              <polyline points="5 12 12 5 19 12"></polyline>
            </svg>
          </motion.button>
        )
      )}
    </AnimatePresence>
  );
};

export default ScrollToTopButton;
