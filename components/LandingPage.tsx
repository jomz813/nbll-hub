
import React, { useEffect, useState } from 'react';
import FluidBackground from './FluidBackground';
import { TabID } from '../App';

interface LandingPageProps {
  onSearchTrigger: () => void;
  onTabChange: (tabId: TabID) => void;
}

const HERO_TITLES = [
  "nah drexel is so strong and veiny rn",
  "pansho is lowkey moving different today",
  "$5 to sleep on call with punkmonk monday - friday",
  "rahbizzy is the greatest jumpstealer of all time",
  "qotd: who has the most aura? answer: blixer",
  "dm cola for sinful freaky pics and vids",
  "i think it's safe to say we all have a crush on coves",
  "why is polar the main character of basketball legends",
];

const LandingPage: React.FC<LandingPageProps> = ({ onSearchTrigger, onTabChange }) => {
  // Randomly select title on initial render
  const [heroTitle] = useState(() => {
    const randomIndex = Math.floor(Math.random() * HERO_TITLES.length);
    return HERO_TITLES[randomIndex];
  });

  // Lock scroll on Home page
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="relative h-screen bg-black selection:bg-[#D60A07] selection:text-white overflow-hidden">
      <FluidBackground />

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
        <div className="max-w-5xl space-y-10 animate-fade-in-up">
          {/* Main Headline Group */}
          <div className="space-y-3">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight leading-[1.05] text-white transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.01] hover:text-zinc-300 cursor-default select-none">
              {heroTitle}
            </h1>
          </div>

          {/* CTA Buttons Stack */}
          <div className="flex flex-col items-center gap-4 pt-6">
            {/* Join Discord Button */}
            <a
              href="https://discord.gg/nbll"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center justify-center gap-2.5 px-6 py-2.5 bg-white text-[#5865F2] border border-[#5865F2]/30 rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105 hover:border-[#5865F2] hover:shadow-[0_0_20px_rgba(88,101,242,0.2)] active:scale-95 no-underline overflow-hidden"
            >
              <div className="absolute inset-0 w-full h-full bg-[#5865F2]/0 group-hover:bg-[#5865F2]/5 transition-colors duration-500" />
              <svg className="w-5 h-5 fill-[#5865F2] relative z-10 transition-transform group-hover:rotate-6" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037 19.736 19.736 0 0 0-4.885 1.515.069.069 0 0 0-.032.027C.533 9.048-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.052-.102.001-.226-.112-.269a13.05 13.05 0 0 1-1.872-.894.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.29a.074.074 0 0 1 .077-.01c3.927 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .077.01c.12.098.246.196.373.29a.077.077 0 0 1-.007.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.11.27c.357.698.769 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.419 0 1.334-.956 2.419-2.157 2.419zm7.974 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.419 0 1.334-.946 2.419-2.157 2.419z"/>
              </svg>
              <span className="font-bold text-sm tracking-tight relative z-10 select-none">get started</span>
            </a>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
