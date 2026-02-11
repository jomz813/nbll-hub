import React from 'react';
import { motion, Variants } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';

interface RouteTransitionProps {
  children: React.ReactNode;
  className?: string;
}

const RouteTransition: React.FC<RouteTransitionProps> = ({ children, className }) => {
  const { settings } = useSettings();
  const shouldReduceMotion = settings.reducedMotion;

  const variants: Variants = {
    initial: { 
      opacity: shouldReduceMotion ? 1 : 0, 
      y: shouldReduceMotion ? 0 : 6,
      filter: shouldReduceMotion ? 'none' : 'blur(4px)',
    },
    animate: { 
      opacity: 1, 
      y: 0,
      filter: 'none',
      transition: {
        duration: shouldReduceMotion ? 0 : 0.3,
        ease: [0.22, 1, 0.36, 1], // easeOutQuint
      }
    },
    exit: { 
      opacity: shouldReduceMotion ? 1 : 0, 
      y: shouldReduceMotion ? 0 : -6,
      filter: shouldReduceMotion ? 'none' : 'blur(4px)',
      transition: {
        duration: shouldReduceMotion ? 0 : 0.2,
        ease: [0.32, 0, 0.67, 0], // easeInQuint
      }
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      className={`${className} w-full`}
    >
      {children}
    </motion.div>
  );
};

export default RouteTransition;