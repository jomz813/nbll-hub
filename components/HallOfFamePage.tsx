
import React, { useState, useMemo } from 'react';
import { hallOfFameMembers, HOFMember } from '../data/hof';

/**
 * Fisher-Yates shuffle algorithm to ensure an unbiased randomization
 * of the player array.
 */
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

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

const HOFCard: React.FC<{ member: HOFMember }> = ({ member }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="group relative h-[400px] lg:h-[460px] w-full perspective-1000 cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={`
          relative w-full h-full duration-700 transform-style-3d transition-all ease-[cubic-bezier(0.23,1,0.32,1)]
          ${isFlipped ? 'rotate-y-180 scale-[1.02] shadow-[0_0_40px_rgba(212,175,55,0.3)]' : 'shadow-xl hover:-translate-y-2 hover:shadow-2xl'}
          rounded-[2rem]
        `}
      >
        {/* Front Face */}
        <div className="absolute inset-0 backface-hidden bg-white dark:bg-zinc-900 border-2 border-zinc-100 dark:border-zinc-800 rounded-[2rem] overflow-hidden flex flex-col transition-colors">
           {/* Image Section - Now takes 100% space */}
           <div className="relative h-full bg-zinc-50 dark:bg-zinc-800 overflow-hidden shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-100 via-zinc-200 to-zinc-300 dark:from-zinc-800 dark:via-zinc-900 dark:to-black opacity-50" />
              {member.image ? (
                <img
                  src={member.image}
                  alt={`${member.name} headshot`}
                  className="absolute inset-0 h-full w-full object-cover object-top"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-[11px] font-black text-[#D4AF37]/50 uppercase tracking-[0.2em] text-center px-4">
                    Image coming soon
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#D4AF37]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Floating Badge */}
              <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 dark:bg-black/80 backdrop-blur-md rounded-full border border-zinc-200 dark:border-zinc-700 shadow-sm">
                <span className="text-[9px] font-black text-zinc-500 dark:text-zinc-300 tracking-widest uppercase">flip</span>
              </div>
              
              {/* Name Overlay (Bottom of Image) */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent pt-12">
                <h4 className="text-3xl font-black text-[#D4AF37] tracking-tighter drop-shadow-md truncate">
                  {member.name}
                </h4>
              </div>
           </div>
        </div>

        {/* Back Face - Optimized to Fill Space */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-zinc-950 border-2 border-[#D4AF37] rounded-[2rem] overflow-hidden flex flex-col p-6 text-center shadow-[inset_0_0_80px_rgba(0,0,0,0.8)]">
           {/* Decorative Top Fade */}
           <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#D4AF37]/20 to-transparent pointer-events-none" />
           
           {/* 1. Header Area - Top Pinned */}
           <div className="relative z-10 shrink-0 mb-4">
               <h4 className="text-3xl md:text-4xl font-black text-[#D4AF37] tracking-tight mb-2 drop-shadow-sm">{member.name}</h4>
               <div className="w-10 h-0.5 bg-[#D4AF37] mx-auto rounded-full shadow-[0_0_8px_#D4AF37]" />
           </div>

           {/* 2. Content Area - Fills remaining height */}
           <div className="flex-1 relative z-10 flex flex-col min-h-0 gap-6">
              
              {/* Accolades - Compact but clean */}
              <div className="shrink-0 flex flex-col gap-2">
                 <h5 className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em]">Accolades</h5>
                 <div className="flex flex-wrap justify-center content-center gap-1.5">
                   {member.awards?.slice(0, 10).map((award, aIdx) => (
                     <span key={aIdx} className="px-2 py-1 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 rounded-[4px] text-[9px] font-bold uppercase tracking-wide shadow-sm backdrop-blur-sm">
                       {award}
                     </span>
                   )) || <span className="text-zinc-600 text-xs italic">No awards listed</span>}
                   {(member.awards?.length || 0) > 10 && (
                     <span className="px-2 py-1 bg-zinc-800 text-zinc-500 rounded text-[9px] font-bold">+{(member.awards?.length || 0) - 10}</span>
                   )}
                 </div>
              </div>

              {/* Stats Panel - Grows to fill space */}
              <div className="flex-1 flex flex-col min-h-0">
                 <div className="h-full w-full bg-black/40 border border-[#D4AF37]/20 rounded-2xl p-2 md:p-3 backdrop-blur-sm shadow-inner flex flex-col">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 md:gap-y-2 flex-1 items-center content-center">
                       {member.stats?.split(' • ').map((stat, sIdx) => {
                         const [val, label] = stat.split(' ');
                         return (
                           <div key={sIdx} className="flex flex-col items-center justify-center p-1 md:p-0">
                             <span className="text-3xl md:text-3xl lg:text-3xl xl:text-4xl font-black text-white leading-none tracking-tight drop-shadow-md">{val}</span>
                             <span className="text-[9px] md:text-[10px] font-black text-[#D4AF37] uppercase tracking-widest opacity-90 mt-1">{label}</span>
                           </div>
                         );
                       })}
                    </div>
                 </div>
              </div>
           </div>
           
           {/* 3. Footer - Bottom Pinned */}
           <div className="mt-4 pt-3 border-t border-white/10 relative z-10 shrink-0">
             <span className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em]">nbll hall of fame</span>
           </div>
        </div>
      </div>
    </div>
  );
};

const HallOfFamePage: React.FC = () => {
  /**
   * We initialize the shuffled order on component mount (visit).
   * Since this component is conditionally rendered by the parent router,
   * a remount (visiting the page) will trigger a new shuffle.
   */
  const shuffledMembers = useMemo(() => shuffleArray(hallOfFameMembers), []);

  return (
    <div className="space-y-16 animate-page-enter pt-4">

      {/* Inducted Members Section */}
      <div className="space-y-10">
        <div className="flex items-center gap-4">
          <h3 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tighter">Inducted Members</h3>
          <div className="h-px bg-zinc-100 dark:bg-zinc-800 flex-1" />
        </div>

        {/* 1 col mobile, 2 col tablet, 3 col desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {shuffledMembers.map((member) => (
            <HOFCard key={member.name} member={member} />
          ))}
        </div>
      </div>

      <HOFEligibility />
    </div>
  );
};

export default HallOfFamePage;
