
import React from 'react';
import { creditsData } from '../data/credits';

const CreditsPage: React.FC = () => {
  return (
    <div className="animate-page-enter pt-4 pb-20">
       <div className="w-full space-y-16">
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
           <div className="pt-12 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-600">
            <span>© NBLL</span>
            <span>i want to marry pansho</span>
          </div>
       </div>
    </div>
  );
};

export default CreditsPage;
