import React from 'react';
import { motion, type Transition } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';

interface RouteTransitionProps {
  children: React.ReactNode;
  className?: string;
}

const RouteTransition: React.FC<RouteTransitionProps> = ({ children, className }) => {
  const { settings } = useSettings();
  const shouldReduceMotion = settings.reducedMotion;

  const variants = {
    initial: { 
      opacity: shouldReduceMotion ? 1 : 0, 
      y: shouldReduceMotion ? 0 : 8 
    },
    animate: { 
      opacity: 1, 
      y: 0 
    },
    exit: { 
      opacity: shouldReduceMotion ? 1 : 0, 
      y: shouldReduceMotion ? 0 : -6 
    }
  };

  const transition: Transition = {
    duration: shouldReduceMotion ? 0 : 0.18,
    ease: "easeOut"
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      transition={transition}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default RouteTransition;