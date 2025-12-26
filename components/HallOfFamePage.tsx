
import React, { useState } from 'react';
import { hallOfFameMembers } from '../data/hof';

const HOFEligibility: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full max-w-2xl">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-3 text-left focus:outline-none"
      >
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600 group-hover:text-[#D4AF37] transition-colors">
          Eligibility Requirements
        </span>
        <svg 
          className={`w-3 h-3 text-zinc-400 dark:text-zinc-600 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} group-hover:text-[#D4AF37]`} 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="3"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      
      <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0 mt-0'}`}>
        <div className="overflow-hidden">
          <ul className="space-y-2 border-l border-zinc-200 dark:border-zinc-800 pl-4 ml-1">
            {[
              "1x Championship Ring",
              "2x Finals Appearances",
              "25x+ POTG // DPOTG Total",
              "4x Seasons Played",
              "5x Awards",
              "Ring Riding Excluded"
            ].map((item, idx) => (
              <li key={idx} className="text-xs font-bold text-zinc-500 dark:text-zinc-400">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const HallOfFamePage: React.FC = () => {
  const [flippedMemberIdx, setFlippedMemberIdx] = useState<number | null>(null);

  return (
    <div className="space-y-16 animate-page-enter">

      {/* Inducted Members Section */}
      <div className="space-y-10">
        <div className="flex items-center gap-4">
          <h3 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tighter">Inducted Members</h3>
          <div className="h-px bg-zinc-100 dark:bg-zinc-800 flex-1" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 items-stretch">
          {hallOfFameMembers.map((member, idx) => {
            const isFlipped = flippedMemberIdx === idx;
            
            return (
              <div 
                key={idx} 
                className="group relative h-full min-h-[500px] lg:min-h-0 lg:h-[440px] perspective-1000 cursor-pointer"
                onClick={() => setFlippedMemberIdx(isFlipped ? null : idx)}
              >
                <div className={`
                    relative w-full h-full duration-700 transform-style-3d transition-all ease-[cubic-bezier(0.23,1,0.32,1)]
                    ${isFlipped ? 'rotate-y-180 scale-[1.05] shadow-[0_0_40px_rgba(212,175,55,0.4)]' : 'shadow-xl hover:-translate-y-2 hover:shadow-2xl'}
                    rounded-[2rem]
                  `}
                >
                  {/* Front Face */}
                  <div className="absolute inset-0 backface-hidden bg-white dark:bg-zinc-900 border-2 border-zinc-100 dark:border-zinc-800 rounded-[2rem] overflow-hidden flex flex-col h-full transition-colors">
                     <div className="aspect-[16/11] bg-zinc-50 dark:bg-zinc-800 relative overflow-hidden shrink-0">
                        <div className="absolute inset-0 bg-gradient-to-br from-zinc-100 via-zinc-200 to-zinc-300 dark:from-zinc-800 dark:via-zinc-900 dark:to-black opacity-50" />
                        {member.image ? (
                          <img
                            src={member.image}
                            alt={`${member.name} headshot`}
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span className="text-[11px] font-black text-[#D4AF37]/50 uppercase tracking-[0.2em] text-center px-4">
                              Image coming soon
                            </span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#D4AF37]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute top-4 right-4 px-3 py-1 bg-white/80 dark:bg-black/60 backdrop-blur-md rounded-full border border-zinc-200 dark:border-zinc-700">
                          <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-300 tracking-widest uppercase">legend</span>
                        </div>
                        <div className="absolute bottom-4 left-6 right-6">
                          <h4 className="text-2xl font-black text-[#D4AF37] tracking-tighter drop-shadow-sm">
                            {member.name}
                          </h4>
                        </div>
                     </div>
                     <div className="p-6 lg:p-5 bg-white dark:bg-zinc-900 border-t border-zinc-50 dark:border-zinc-800 flex flex-col flex-1">
                        <div className="space-y-4 lg:space-y-2 flex-1">
                           <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-300 dark:text-zinc-600">About</span>
                              <div className="w-1.5 h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                           </div>
                           <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 italic leading-relaxed lg:line-clamp-2 overflow-hidden">
                             Description coming soon.
                           </p>
                        </div>
                     </div>
                     <div className="absolute bottom-3 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-[9px] font-black text-zinc-300 dark:text-zinc-600 uppercase tracking-widest pointer-events-none">
                       tap to flip
                     </div>
                  </div>

                  {/* Back Face */}
                  <div className="absolute inset-0 backface-hidden rotate-y-180 bg-zinc-900 border-2 border-[#D4AF37] rounded-[2rem] overflow-hidden flex flex-col p-8 lg:p-6 text-center shadow-inner">
                     <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#D4AF37]/20 to-transparent pointer-events-none" />
                     
                     <h4 className="text-4xl font-black text-[#D4AF37] mb-2 relative z-10">{member.name}</h4>
                     <div className="w-16 h-1 bg-[#D4AF37] mx-auto rounded-full mb-8 relative z-10" />

                     <div className="flex-1 overflow-y-auto no-scrollbar relative z-10 space-y-8">
                        <div>
                           <h5 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-4">Accolades</h5>
                           <div className="flex flex-wrap justify-center gap-1.5">
                             {member.awards?.map((award, aIdx) => (
                               <span key={aIdx} className="px-2.5 py-1 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 rounded-md text-[10px] font-bold uppercase tracking-wide leading-none">
                                 {award}
                               </span>
                             )) || <span className="text-zinc-600 text-xs italic">No awards listed</span>}
                           </div>
                        </div>

                        <div>
                           <h5 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-4">All-Time Stats</h5>
                           <div className="bg-black/40 border border-[#D4AF37]/30 rounded-2xl p-6">
                              <div className="grid grid-cols-2 gap-4">
                                 {member.stats?.split(' • ').map((stat, sIdx) => {
                                   const [val, label] = stat.split(' ');
                                   return (
                                     <div key={sIdx} className="flex flex-col">
                                       <span className="text-2xl font-black text-white">{val}</span>
                                       <span className="text-[9px] font-black text-[#D4AF37] uppercase tracking-widest">{label}</span>
                                     </div>
                                   );
                                 })}
                              </div>
                           </div>
                        </div>
                     </div>
                     
                     <div className="mt-6 pt-4 border-t border-white/5 relative z-10">
                       <span className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em]">nbll hall of fame</span>
                     </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <HOFEligibility />

      <div className="pt-8 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-600">
        <span className="hover:text-[#D4AF37] transition-colors">© NBLL Hall of Fame</span>
        <span className="hover:text-[#D4AF37] transition-colors">Archives Updated Q4 2025</span>
      </div>
    </div>
  );
};

export default HallOfFamePage;
