
import React, { useState, useMemo, useEffect } from 'react';
import { hallOfFameMembers, HOFMember } from '../data/hof';
import { fetchSeasonStats, PlayerStats } from '../data/statsFetcher';

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
          <ul className="space-y-2 border-l pl-4 ml-1" style={{ borderColor: 'var(--divider)' }}>
            {[
              "1x Championship Ring",
              "2x Finals Appearances",
              "25x+ POTG // DPOTG Total",
              "4x Seasons Played",
              "5x Awards",
              "Ring Riding Excluded",
              "Exceptions can be made at any time"
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

const HOFCard: React.FC<{ member: HOFMember; statsData?: PlayerStats }> = ({ member, statsData }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showPhoto, setShowPhoto] = useState(false);
  const [gifError, setGifError] = useState(false);
  const [photoError, setPhotoError] = useState(false);

  const displayStats = useMemo(() => {
    if (statsData) {
      return [
        { label: 'PTS', val: statsData.pts.toLocaleString() },
        { label: 'AST', val: statsData.ast.toLocaleString() },
        { label: 'REB', val: statsData.reb.toLocaleString() },
        { label: 'STL', val: statsData.stl.toLocaleString() }
      ];
    }
    // Fallback to hardcoded stats if data fetch fails or player not found
    return (member.stats || '0 PTS • 0 AST • 0 REB • 0 STL').split(' • ').map(s => {
      const [val, label] = s.split(' ');
      return { label, val };
    });
  }, [statsData, member.stats]);

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
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-100 via-zinc-200 to-zinc-300 dark:from-zinc-800 dark:via-zinc-900 dark:to-black opacity-50 z-0" />
              
              <div className="absolute inset-0 flex transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] z-0" style={{ transform: showPhoto ? 'translateX(-100%)' : 'translateX(0)' }}>
                {/* Slide 1: GIF */}
                <div className="relative w-full h-full shrink-0 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800/80">
                  {member.image && !gifError ? (
                    <img
                      src={member.image}
                      alt={`${member.name} gif`}
                      className="absolute inset-0 h-full w-full object-cover object-top"
                      onError={() => setGifError(true)}
                    />
                  ) : null}
                </div>

                {/* Slide 2: Photo */}
                <div className="relative w-full h-full shrink-0 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800/80">
                  {member.photo && !photoError ? (
                    <img
                      src={member.photo}
                      alt={`${member.name} photo`}
                      className="absolute inset-0 h-full w-full object-cover object-top"
                      onError={() => setPhotoError(true)}
                    />
                  ) : null}
                </div>
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-[#D4AF37]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />
              
              {/* Floating Badge */}
              <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 dark:bg-black/80 backdrop-blur-md rounded-full border border-zinc-200 dark:border-zinc-700 shadow-sm z-20 pointer-events-none">
                <span className="text-[9px] font-black text-zinc-500 dark:text-zinc-300 tracking-widest uppercase">flip</span>
              </div>
              
              {/* Arrows */}
              <button
                className={`absolute left-2 top-1/2 -translate-y-1/2 p-2 transition-opacity z-20 ${!showPhoto ? 'opacity-30 cursor-not-allowed' : 'opacity-70 hover:opacity-100'}`}
                onClick={(e) => { e.stopPropagation(); setShowPhoto(false); }}
                disabled={!showPhoto}
              >
                <svg className="w-6 h-6 text-white drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 transition-opacity z-20 ${showPhoto ? 'opacity-30 cursor-not-allowed' : 'opacity-70 hover:opacity-100'}`}
                onClick={(e) => { e.stopPropagation(); setShowPhoto(true); }}
                disabled={showPhoto}
              >
                <svg className="w-6 h-6 text-white drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Name Overlay & Dots */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-12 z-20 flex items-end justify-between">
                <h4 className="text-3xl font-black text-[#D4AF37] tracking-tighter drop-shadow-md truncate flex-1 pr-4">
                  {member.name}
                </h4>

                <div className="flex items-center gap-2 pb-1" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={(e) => { e.preventDefault(); setShowPhoto(false); }}
                    className="p-1 -m-1 focus:outline-none"
                    aria-label="View GIF"
                  >
                    <div className={`w-1.5 h-1.5 rounded-full transition-all ${!showPhoto ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'}`} />
                  </button>
                  <button
                    onClick={(e) => { e.preventDefault(); setShowPhoto(true); }}
                    className="p-1 -m-1 focus:outline-none"
                    aria-label="View Photo"
                  >
                    <div className={`w-1.5 h-1.5 rounded-full transition-all ${showPhoto ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'}`} />
                  </button>
                </div>
              </div>
           </div>
        </div>

        {/* Back Face - Optimized to Fill Space */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-zinc-950 border-2 border-[#D4AF37] rounded-[2rem] overflow-hidden flex flex-col p-6 text-center shadow-[inset_0_0_80px_rgba(0,0,0,0.8)]">
           {/* Decorative Top Fade */}
           <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#D4AF37]/20 to-transparent pointer-events-none" />
           
           {/* 1. Header Area - Top Pinned */}
           <div className="relative z-10 shrink-0 mb-3 md:mb-4">
               <h4 className="text-3xl md:text-4xl font-black text-[#D4AF37] tracking-tight drop-shadow-sm">{member.name}</h4>
           </div>

           {/* 2. Content Area - Fills remaining height */}
           <div className="flex-1 relative z-10 flex flex-col min-h-0 gap-5 md:gap-6">
              
              {/* Accolades - Elegant Text Layout */}
              <div className="shrink-0 flex flex-wrap justify-center items-center gap-x-4 gap-y-2.5 px-2">
                 {member.awards?.slice(0, 12).map((award, aIdx) => {
                   const match = award.match(/^(\d+x\+?)\s+(.*)$/i);
                   const count = match ? match[1] : '';
                   const title = match ? match[2] : award;
                   return (
                     <div key={aIdx} className="flex items-baseline gap-1.5 whitespace-nowrap">
                       {count && <span className="text-[#D4AF37] font-black text-[11px] md:text-xs tracking-tight">{count}</span>}
                       <span className="text-zinc-300 font-bold text-[9px] md:text-[10px] tracking-widest uppercase">{title}</span>
                     </div>
                   );
                 }) || <span className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">No awards listed</span>}
                 {(member.awards?.length || 0) > 12 && (
                   <div className="flex items-baseline gap-1.5 whitespace-nowrap">
                     <span className="text-zinc-500 font-black text-[11px] md:text-xs tracking-tight">+{(member.awards?.length || 0) - 12}</span>
                     <span className="text-zinc-500 font-bold text-[9px] md:text-[10px] tracking-widest uppercase">MORE</span>
                   </div>
                 )}
              </div>

              {/* Stats Panel - 2x2 Grid of Individual Cards */}
              <div className="flex-1 flex flex-col min-h-0">
                 <div className="grid grid-cols-2 grid-rows-2 gap-3 h-full">
                    {displayStats.map((stat, sIdx) => {
                      return (
                        <div key={sIdx} className="w-full h-full bg-black/40 border border-[#D4AF37]/20 rounded-2xl flex flex-col items-center justify-center p-2 backdrop-blur-sm shadow-[inset_0_0_15px_rgba(212,175,55,0.05)] transition-colors hover:bg-black/50">
                          <span className="text-2xl md:text-3xl font-black text-white leading-none tracking-tight drop-shadow-md">{stat.val}</span>
                          <span className="text-[9px] md:text-[10px] font-black text-[#D4AF37] uppercase tracking-widest opacity-90 mt-1.5">{stat.label}</span>
                        </div>
                      );
                    })}
                 </div>
              </div>
           </div>
           
           {/* 3. Footer - Bottom Pinned */}
           <div className="mt-4 pt-3 subtle-divider relative z-10 shrink-0" style={{ borderTop: '1px solid var(--divider)', background: 'transparent' }}>
             <span className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em]">nbll hall of fame</span>
           </div>
        </div>
      </div>
    </div>
  );
};

const HallOfFamePage: React.FC = () => {
  const [allTimeStats, setAllTimeStats] = useState<PlayerStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const stats = await fetchSeasonStats('all-time');
        setAllTimeStats(stats);
      } catch (err) {
        console.error('Failed to fetch all-time stats for HOF:', err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  /**
   * We initialize the shuffled order on component mount (visit).
   * Since this component is conditionally rendered by the parent router,
   * a remount (visiting the page) will trigger a new shuffle.
   */
  const shuffledMembers = useMemo(() => shuffleArray(hallOfFameMembers), []);

  const getStatsForMember = (member: HOFMember) => {
    if (!member.username) return undefined;
    const playerStat = allTimeStats.find(s => s.player.toLowerCase() === member.username?.toLowerCase());
    
    if (!playerStat && !loading && process.env.NODE_ENV === 'development') {
      console.warn(`HOF member ${member.name} with username ${member.username} not found in all-time stats.`);
    }
    
    return playerStat;
  };

  return (
    <div className="space-y-16 animate-page-enter pt-4">

      {/* Inducted Members Section */}
      <div className="space-y-10">
        <div className="flex items-center gap-4">
          <h3 className="text-xl md:text-2xl font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tighter">
            Inducted Members
          </h3>
          <div className="h-px header-divider flex-1" />
        </div>

        {/* 1 col mobile, 2 col tablet, 3 col desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {shuffledMembers.map((member) => (
            <HOFCard 
              key={member.name} 
              member={member} 
              statsData={getStatsForMember(member)}
            />
          ))}
        </div>
      </div>

      <HOFEligibility />

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
