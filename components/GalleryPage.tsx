import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const images = [
  '/hof/gfx1.png',
  '/hof/gfx2.png',
  '/hof/gfx3.png',
  '/hof/gfx4.png',
  '/hof/gfx5.png',
  '/hof/gfx6.png',
  '/hof/gfx7.png',
  '/hof/gfx8.png',
];

const GalleryPage: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const setIndex = (index: number) => {
    if (index === currentIndex) return;
    const diff = (index - currentIndex + images.length) % images.length;
    setDirection(diff > images.length / 2 ? -1 : 1);
    setCurrentIndex(index);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <div className="w-full mt-8 animate-fade-in flex flex-col items-center">
      {/* Main Image Container */}
      <div className="relative w-full aspect-video bg-zinc-100 dark:bg-zinc-900 rounded-2xl overflow-hidden mb-12 group border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-center">
        <AnimatePresence initial={false} custom={direction}>
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="absolute inset-0 w-full h-full object-contain"
            alt={`UFL Graphic ${currentIndex + 1}`}
          />
        </AnimatePresence>

        {/* Controls */}
        <button
          onClick={handlePrev}
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-zinc-400 hover:text-[var(--accent)] hover:scale-110 md:opacity-0 md:group-hover:opacity-100 drop-shadow-md transition-all duration-300 z-10 focus:outline-none text-5xl font-light select-none"
          aria-label="Previous graphic"
        >
          ‹
        </button>
        <button
          onClick={handleNext}
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-zinc-400 hover:text-[var(--accent)] hover:scale-110 md:opacity-0 md:group-hover:opacity-100 drop-shadow-md transition-all duration-300 z-10 focus:outline-none text-5xl font-light select-none"
          aria-label="Next graphic"
        >
          ›
        </button>
      </div>

      {/* Rotary Dial / Coverflow Selector */}
      <div className="relative w-full max-w-4xl h-32 md:h-40 flex justify-center items-center mb-8 overflow-hidden pointer-events-none">
        {images.map((src, idx) => {
          let diff = idx - currentIndex;
          const len = images.length;
          if (diff > len / 2) diff -= len;
          if (diff < -len / 2) diff += len;

          const isVisible = diff >= -2 && diff <= 2;
          
          let scale = 0.4;
          let xPos = diff < 0 ? "-300%" : "300%";
          let yPos = 20;
          let zIndex = 0;
          let opacity = 0;
          
          if (isVisible) {
            if (diff === 0) {
              scale = 1;
              xPos = "0%";
              yPos = -10;
              zIndex = 30;
              opacity = 1;
            } else if (Math.abs(diff) === 1) {
              scale = 0.8;
              xPos = diff < 0 ? "-110%" : "110%";
              yPos = 0;
              zIndex = 20;
              opacity = 0.6;
            } else if (Math.abs(diff) === 2) {
              scale = 0.6;
              xPos = diff < 0 ? "-200%" : "200%";
              yPos = 10;
              zIndex = 10;
              opacity = 0.3;
            }
          }

          return (
            <motion.button
              key={src}
              onClick={() => setIndex(idx)}
              className={`absolute w-24 sm:w-32 lg:w-40 aspect-video rounded-xl overflow-hidden outline-none pointer-events-auto transition-shadow ${
                diff === 0 
                  ? 'ring-2 ring-[var(--accent)] ring-offset-2 ring-offset-white dark:ring-offset-zinc-950 shadow-[0_0_15px_rgba(var(--accent-rgb),0.5)]'
                  : 'border border-zinc-200 dark:border-zinc-800 hover:opacity-80'
              }`}
              animate={{
                x: xPos,
                y: yPos,
                scale: scale,
                opacity: opacity,
                zIndex: zIndex
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                mass: 0.8
              }}
              aria-label={`Select graphic ${idx + 1}`}
              aria-current={diff === 0}
            >
              <img src={src} className="w-full h-full object-cover" alt={`Thumbnail ${idx + 1}`} />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default GalleryPage;
