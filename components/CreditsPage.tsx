import React from 'react';
import { creditsData } from '../data/credits';

const CreditsPage: React.FC = () => {
  return (
    <div className="animate-page-enter pt-4 pb-20">
       <div className="w-full space-y-16">
          {/* Main League Credits */}
          {creditsData.map((section, idx) => (
            <div key={idx} className="space-y-6">
               <div className="flex items-center gap-4">
                  <h3 className="text-xl md:text-2xl font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tighter shrink-0">{section.title}</h3>
                  <div className="h-px bg-zinc-100 dark:bg-zinc-800 flex-1" />
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {section.names.map((name, iIdx) => (
                    <div key={iIdx} className="p-5 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/50 hover:bg-white dark:hover:bg-zinc-900 hover:border-zinc-200 dark:hover:border-zinc-700 transition-all duration-300">
                      <h4 className="text-base font-bold text-zinc-800 dark:text-zinc-200">{name}</h4>
                    </div>
                  ))}
               </div>
            </div>
          ))}

          {/* Site Meta Divider */}
          <div className="pt-8 opacity-40">
            <div className="h-px bg-zinc-200 dark:bg-zinc-800 w-full" />
          </div>

          {/* Site Information Section */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <h3 className="text-xl md:text-2xl font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tighter shrink-0">Site Information</h3>
              <div className="h-px bg-zinc-100 dark:bg-zinc-800 flex-1" />
            </div>
            <div className="space-y-4 px-1">
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-[0.2em]">site deployed:</span>
                <div className="flex items-center gap-2 px-3 py-1 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-full">
                  <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">GitHub</span>
                  <svg className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-[0.2em]">site hosted:</span>
                <div className="flex items-center gap-2 px-3 py-1 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-full">
                  <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Netlify</span>
                  <svg className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" viewBox="0 0 512 512" fill="currentColor">
                    <path d="M410.6 289.4c-6 0-11 3.5-13.3 8.7L363.5 373c-1.3 2.9-3.9 4.7-7 4.7h-36.8c-3.1 0-5.8-1.8-7-4.7l-33.8-75c-2.3-5.2-7.4-8.7-13.3-8.7H256c-5.9 0-11 3.5-13.3 8.7L208.9 373c-1.3 2.9-3.9 4.7-7 4.7h-36.8c-3.1 0-5.8-1.8-7-4.7l-33.8-75c-2.3-5.2-7.4-8.7-13.3-8.7H96c-8.8 0-16 7.2-16 16v128c0 8.8 7.2 16 16 16h320c8.8 0 16-7.2 16-16V305.4c0-8.8-7.2-16-16-16zm-3.1-23.7c-5.9 0-11-3.5-13.3-8.7L360.5 182c-1.3-2.9-3.9-4.7-7-4.7h-36.8c-3.1 0-5.8 1.8-7 4.7l-33.8 75c-2.3 5.2-7.4 8.7-13.3 8.7H256c-5.9 0-11-3.5-13.3-8.7l-33.8-75c-1.3-2.9-3.9-4.7-7-4.7h-36.8c-3.1 0-5.8 1.8-7 4.7L124.3 257c-2.3 5.2-7.4 8.7-13.3 8.7H96c-8.8 0-16-7.2-16-16V121.4c0-8.8 7.2-16 16-16h320c8.8 0 16 7.2 16 16V249.7c0 8.8-7.2 16-16 16zM256 0l114 96H142l114-96z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Site Contributions Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <h3 className="text-xl md:text-2xl font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tighter shrink-0">Site Contributions</h3>
              <div className="h-px bg-zinc-100 dark:bg-zinc-800 flex-1" />
            </div>
            <div className="space-y-4 sm:space-y-2 px-1">
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-2">
                <span className="text-[11px] font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-[0.2em]">creator:</span>
                <span className="text-base font-bold text-zinc-800 dark:text-zinc-200">jomz</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-2">
                <span className="text-[11px] font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-[0.2em]">contributors:</span>
                <span className="text-base font-bold text-zinc-800 dark:text-zinc-200 tracking-tight">nyx, aym8, silver, lumie</span>
              </div>
            </div>
          </div>

           <div className="pt-12 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-600">
            <span>© NBLL</span>
            <span>pansho is the goat</span>
          </div>
       </div>
    </div>
  );
};

export default CreditsPage;