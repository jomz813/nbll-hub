
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



const HOFCard: React.FC<{ member: HOFMember }> = ({ member }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const displayStats = useMemo(() => {
    return member.stats || [];
  }, [member.stats]);

  const nameLength = member.name.length;
  let nameSizeClass = "text-4xl md:text-5xl";
  if (nameLength > 14) {
    nameSizeClass = "text-2xl md:text-3xl";
  } else if (nameLength > 10) {
    nameSizeClass = "text-3xl md:text-4xl";
  }

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
           {/* Image Section */}
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
           <div className="relative z-10 shrink-0 mb-3 sm:mb-4 text-center">
               <h4 className={`${nameSizeClass} font-black text-[#D4AF37] tracking-tight mb-0.5 drop-shadow-sm uppercase leading-none`}>{member.name}</h4>
           </div>

           {/* 2. Content Area - Fills remaining height */}
           <div className="flex-1 relative z-10 flex flex-col min-h-0 gap-4 sm:gap-5">
              
              {/* Accolades - Refined styling without header */}
              <div className="shrink-0 px-1 lg:px-2">
                 <div className="flex flex-wrap justify-center content-center gap-x-3 gap-y-1.5">
                   {member.accolades?.slice(0, 10).map((award, aIdx) => {
                     const match = award.match(/^(\d+x\+?)\s+(.*)$/i);
                     if (match) {
                       return (
                         <span key={aIdx} className="text-[9px] md:text-[10px] font-black uppercase tracking-wider leading-none flex items-center">
                           <span className="text-[#D4AF37] mr-1">{match[1]}</span>
                           <span className="text-zinc-300">{match[2]}</span>
                         </span>
                       );
                     }
                     return (
                         <span key={aIdx} className="text-[9px] md:text-[10px] font-black uppercase tracking-wider text-[#D4AF37] leading-none">
                           {award}
                         </span>
                     );
                   }) || <span className="text-zinc-600 text-xs italic">No accolades listed</span>}
                   {(member.accolades?.length || 0) > 10 && (
                     <span className="text-[9px] md:text-[10px] font-black uppercase tracking-wider text-zinc-500 leading-none">
                       +{(member.accolades?.length || 0) - 10} MORE
                     </span>
                   )}
                 </div>
              </div>

              {/* Stats Panel - Clean Text-Based System */}
              <div className="flex-1 flex min-h-0 items-center justify-center pb-2 w-full px-2 sm:px-4 lg:px-6">
                  {displayStats.length > 0 && (
                    <div className="flex flex-col items-center justify-center gap-y-4 sm:gap-y-5 lg:gap-y-6 w-full max-w-[95%] sm:max-w-[90%] mx-auto relative z-10">
                      {(() => {
                        const statCount = displayStats.length;
                        
                        let rows: typeof displayStats[] = [];
                        if (statCount === 2) rows = [displayStats.slice(0, 2)];
                        else if (statCount === 3) rows = [displayStats.slice(0, 3)];
                        else if (statCount === 4) rows = [displayStats.slice(0, 2), displayStats.slice(2, 4)];
                        else if (statCount === 5) rows = [displayStats.slice(0, 3), displayStats.slice(3, 5)];
                        else if (statCount === 6) rows = [displayStats.slice(0, 3), displayStats.slice(3, 6)];
                        else if (statCount === 7) rows = [displayStats.slice(0, 3), displayStats.slice(3, 6), displayStats.slice(6, 7)];
                        else {
                          for (let i = 0; i < statCount; i += 3) {
                            rows.push(displayStats.slice(i, i + 3));
                          }
                        }

                        let valSize, labelSize;
                        if (statCount <= 3) {
                          valSize = "text-3xl sm:text-4xl lg:text-[38px]";
                          labelSize = "text-[10px] sm:text-[11px] lg:text-[13px]";
                        } else if (statCount <= 5) {
                          valSize = "text-2xl sm:text-[28px] lg:text-[32px]";
                          labelSize = "text-[9px] sm:text-[10px] lg:text-[11px]";
                        } else {
                          valSize = "text-xl sm:text-2xl lg:text-[28px]";
                          labelSize = "text-[8px] sm:text-[9px] lg:text-[10px]";
                        }

                        return rows.map((row, rIdx) => (
                          <div 
                            key={rIdx} 
                            className="flex flex-row items-center justify-center gap-x-4 sm:gap-x-6 lg:gap-x-10 w-full"
                          >
                            {row.map((stat, sIdx) => (
                              <div key={sIdx} className="flex flex-col items-center justify-center shrink-0">
                                <span className={`${valSize} font-black text-white leading-none tracking-tight tabular-nums drop-shadow-md`}>
                                  {stat.value}
                                </span>
                                <span className={`${labelSize} font-bold text-[#D4AF37] uppercase tracking-widest opacity-90 leading-none drop-shadow-sm mt-1 sm:mt-1.5 lg:mt-2`}>
                                  {stat.label}
                                </span>
                              </div>
                            ))}
                          </div>
                        ));
                      })()}
                    </div>
                  )}
              </div>
           </div>
           
            {/* 3. Footer - Bottom Pinned */}
            <div className="mt-2 sm:mt-3 pt-3 subtle-divider relative z-10 shrink-0 text-center" style={{ borderTop: '1px solid var(--divider)', background: 'transparent' }}>
              <span className="text-[10px] md:text-[11px] font-black text-zinc-500 uppercase tracking-widest">{member.position}</span>
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
          <h3 className="text-xl md:text-2xl font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tighter shrink-0">
            Inducted Members
          </h3>
          <span className="hidden md:inline text-xs font-medium text-zinc-400 dark:text-zinc-500 lowercase tracking-normal">
            — temporary card layout, subject to change often
          </span>
          <div className="h-px header-divider flex-1" />
        </div>

        {/* 1 col mobile, 2 col tablet, 3 col desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {shuffledMembers.map((member) => (
            <HOFCard 
              key={member.name} 
              member={member} 
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes page-enter {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-page-enter {
          animation: page-enter 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        /* Flip Card Support */
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
      `}</style>
    </div>
  );
};

export default HallOfFamePage;
