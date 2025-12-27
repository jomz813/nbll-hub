
import React, { useState, useRef } from 'react';
import { hallOfFameMembers } from '../data/hof';
import { useSettings } from '../context/SettingsContext';

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

const RingIcon = () => (
  <svg 
    className="text-[#D4AF37]" 
    style={{ width: 'clamp(22px, 7vw, 42px)', height: 'clamp(22px, 7vw, 42px)' }}
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="7" />
    <path d="M12 9v1" />
    <path d="M12 14v1" />
    <path d="M12 5V2" />
    <path d="M12 22v-3" />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
  </svg>
);

const HallOfFamePage: React.FC = () => {
  const { settings } = useSettings();
  const [flippedMemberIdx, setFlippedMemberIdx] = useState<number | null>(null);
  const [sparklingIdx, setSparklingIdx] = useState<number | null>(null);
  const clickTimestamps = useRef<Record<number, number[]>>({});
  const cooldowns = useRef<Record<number, number>>({});

  const handleRingRowClick = (e: React.MouseEvent | React.TouchEvent, idx: number) => {
    if (settings.reducedMotion) return;
    
    // Prevent event bubbling to avoid flipping the card back to front immediately if clicking specific area
    e.stopPropagation();

    const now = Date.now();
    const cooldown = cooldowns.current[idx] || 0;
    if (now < cooldown) return;

    if (!clickTimestamps.current[idx]) {
      clickTimestamps.current[idx] = [];
    }

    // Filter to keep only clicks within last 2 seconds
    const recentClicks = clickTimestamps.current[idx].filter(ts => now - ts < 2000);
    recentClicks.push(now);
    clickTimestamps.current[idx] = recentClicks;

    if (recentClicks.length >= 3) {
      setSparklingIdx(idx);
      cooldowns.current[idx] = now + 3000; // 3s cooldown
      clickTimestamps.current[idx] = [];
      
      setTimeout(() => {
        setSparklingIdx(null);
      }, 900); // match animation duration
    }
  };

  return (
    <div className="space-y-16 animate-page-enter">
      {/* Inducted Members Section */}
      <div className="space-y-10">
        <div className="flex items-center gap-4">
          <h3 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tighter">Inducted Members</h3>
          <div className="h-px bg-zinc-100 dark:bg-zinc-800 flex-1" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {hallOfFameMembers.map((member, idx) => {
            const isFlipped = flippedMemberIdx === idx;
            const isSparkling = sparklingIdx === idx;
            
            return (
              <div 
                key={idx} 
                className="group relative h-full min-h-[460px] sm:min-h-[460px] lg:min-h-[480px] perspective-1000 cursor-pointer"
                onClick={() => setFlippedMemberIdx(isFlipped ? null : idx)}
              >
                <div className={`
                    relative w-full h-full duration-700 transform-style-3d transition-all ease-[cubic-bezier(0.23,1,0.32,1)]
                    ${isFlipped ? 'rotate-y-180 scale-[1.05] shadow-[0_0_40px_rgba(212,175,55,0.4)]' : 'shadow-xl hover:-translate-y-2 hover:shadow-2xl'}
                    rounded-[2rem]
                  `}
                >
                  {/* Front Face */}
                  <div className="absolute inset-0 backface-hidden bg-white dark:bg-zinc-900 border-2 border-zinc-100 dark:border-zinc-800 rounded-[2rem] flex flex-col h-full transition-colors overflow-hidden">
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
                     <div className="p-6 lg:p-5 flex flex-col flex-1 min-h-0">
                        <div className="flex-1 min-h-0 space-y-4 lg:space-y-2">
                           <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-300 dark:text-zinc-600">About</span>
                              <div className="w-1.5 h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                           </div>
                           <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 italic leading-relaxed line-clamp-4 lg:line-clamp-3">
                             Description coming soon.
                           </p>
                        </div>
                        
                        <div className="mt-auto pt-4 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/50">
                          <span className="text-[9px] font-black text-zinc-300 dark:text-zinc-600 uppercase tracking-widest">Inductee No. {idx + 1}</span>
                          <span className="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest opacity-60 sm:opacity-0 group-hover:opacity-100 transition-opacity">tap to flip</span>
                        </div>
                     </div>
                  </div>

                  {/* Back Face */}
                  <div className="absolute inset-0 backface-hidden rotate-y-180 bg-zinc-900 border-2 border-[#D4AF37] rounded-[2rem] overflow-hidden flex flex-col p-6 text-center shadow-inner h-full">
                     <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#D4AF37]/20 to-transparent pointer-events-none" />
                     
                     <div className="relative z-10 shrink-0 mb-4">
                        <h4 className="text-2xl lg:text-3xl font-black text-[#D4AF37] mb-1 leading-tight">{member.name}</h4>
                        <div className="w-12 h-1 bg-[#D4AF37] mx-auto rounded-full" />
                     </div>

                     <div className="flex-1 relative z-10 flex flex-col justify-between min-h-0 overflow-hidden py-1">
                        {/* Accolades Section */}
                        <div className="flex flex-col justify-center flex-1">
                           <h5 className="text-[8px] lg:text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-2 lg:mb-3 shrink-0">Accolades</h5>
                           <div className="flex flex-wrap justify-center gap-1.5 overflow-hidden">
                             {member.awards?.map((award, aIdx) => (
                               <span key={aIdx} className="px-1.5 lg:px-2 py-0.5 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 rounded-md text-[8px] lg:text-[9px] font-bold uppercase tracking-wide leading-snug">
                                 {award}
                               </span>
                             )) || <span className="text-zinc-600 text-[10px] italic">No awards listed</span>}
                           </div>
                        </div>

                        {/* Career Milestones Section */}
                        <div className="flex flex-col justify-center flex-[1.5] py-4">
                           <h5 className="text-[8px] lg:text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-2 lg:mb-3 shrink-0">Career Milestones</h5>
                           <div className="bg-black/40 border border-[#D4AF37]/20 rounded-xl p-3 lg:p-4 mx-auto w-full max-w-[95%]">
                              <div className="grid grid-cols-2 gap-x-2 gap-y-3 lg:gap-y-4">
                                 {member.stats?.split(' • ').map((stat, sIdx) => {
                                   const [val, label] = stat.split(' ');
                                   return (
                                     <div key={sIdx} className="flex flex-col items-center">
                                       <span className="text-xl lg:text-2xl font-black text-white leading-none">{val}</span>
                                       <span className="text-[7px] lg:text-[8px] font-black text-[#D4AF37] uppercase tracking-widest mt-0.5">{label}</span>
                                     </div>
                                   );
                                 })}
                              </div>
                           </div>
                        </div>

                        {/* Rings Display Section - Centered and Filling Space */}
                        <div 
                          className="flex flex-col justify-center items-center flex-1 relative overflow-hidden rounded-xl"
                          onClick={(e) => handleRingRowClick(e, idx)}
                          onTouchStart={(e) => handleRingRowClick(e, idx)}
                        >
                           <div className="flex justify-center gap-3 md:gap-4 lg:gap-5 flex-nowrap max-w-[95%] items-center h-full relative z-10">
                             {Array.from({ length: member.rings }).map((_, rIdx) => (
                               <RingIcon key={rIdx} />
                             ))}
                           </div>

                           {/* Sparkle Easter Egg Overlay */}
                           {isSparkling && (
                             <>
                               <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg] animate-ring-shimmer" />
                               <div className="absolute inset-0 z-20 pointer-events-none">
                                  {Array.from({ length: 12 }).map((_, sIdx) => (
                                    <div 
                                      key={sIdx}
                                      className="absolute w-1 h-1 bg-white rounded-full opacity-0 animate-tiny-sparkle"
                                      style={{
                                        top: `${Math.random() * 100}%`,
                                        left: `${Math.random() * 100}%`,
                                        animationDelay: `${Math.random() * 0.4}s`
                                      }}
                                    />
                                  ))}
                               </div>
                             </>
                           )}
                        </div>
                     </div>
                     
                     <div className="mt-auto pt-4 border-t border-white/5 relative z-10 shrink-0">
                       <span className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.2em]">nbll hall of fame inductee</span>
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

      <style>{`
        @keyframes ring-shimmer {
          0% { transform: translateX(-150%) skewX(-20deg); }
          100% { transform: translateX(250%) skewX(-20deg); }
        }
        @keyframes tiny-sparkle {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.5); opacity: 0.6; }
          100% { transform: scale(0); opacity: 0; }
        }
        .animate-ring-shimmer {
          animation: ring-shimmer 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-tiny-sparkle {
          animation: tiny-sparkle 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default HallOfFamePage;
