import React from 'react';
import { seasonAwardsData, PlayerAward } from '../data/seasonAwardsData';
import { useSettings } from '../context/SettingsContext';

const formatAwardLabel = (rawName: string | undefined): string => {
  if (!rawName) return '';
  let name = rawName.trim();
  
  // Clean up obvious spelling mistakes:
  name = name.replace(/Wide Reciever/gi, 'Wide Receiver');
  name = name.replace(/Tide End/gi, 'Tight End');

  // If there's a colon, like "WROTY: Wide Receiver of the Year" -> "WROTY"
  if (name.includes(':')) {
    return name.split(':')[0].trim();
  }

  const nameUpper = name.toUpperCase();
  if (nameUpper === 'MOST VALUABLE PLAYER') return 'MVP';
  if (nameUpper === 'OFFENSIVE PLAYER OF THE YEAR') return 'OPOTY';
  if (nameUpper === 'DEFENSIVE PLAYER OF THE YEAR') return 'DPOTY';
  if (nameUpper === 'QUARTERBACK OF THE YEAR') return 'QBOTY';
  if (nameUpper === 'DEFENSIVE BACK OF THE YEAR') return 'DBOTY';
  if (nameUpper === 'DEFENSIVE END OF THE YEAR') return 'DEOTY';
  if (nameUpper === 'COACH OF THE YEAR') return 'COTY';
  if (nameUpper === 'TIGHT END OF THE YEAR') return 'TEOTY';
  if (nameUpper === 'ROOKIE OF THE YEAR') return 'ROTY';
  if (nameUpper === 'KICKER OF THE YEAR') return 'KOTY';
  
  return rawName;
};

const AwardCard: React.FC<{ award: PlayerAward; defaultAwardName?: string }> = ({ award, defaultAwardName }) => {
  const displayTeam = award.team && award.team.trim() !== '' ? award.team.trim() : 'TEAM N/A';
  const displayPosition = award.position && award.position.trim() !== '' ? award.position.trim() : 'N/A';
  const displayPlayer = award.player ? award.player.replace(/@/g, '').trim() : '';
  const displayAwardName = formatAwardLabel(award.awardName || defaultAwardName);

  return (
    <div className="flex flex-col py-3 px-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800/60 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors shadow-sm group">
      <div className="flex flex-col">
        <span className="text-[10px] font-black tracking-widest text-zinc-400 dark:text-zinc-500 uppercase mb-1">
          {displayTeam}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 shrink-0">
            {displayPosition}
          </span>
          <span className={`text-[15px] font-bold tracking-tight text-zinc-900 dark:text-zinc-100 transition-colors group-hover:text-[var(--accent)] line-clamp-1`}>
            {displayPlayer}
          </span>
        </div>
        {displayAwardName && (
          <span className="text-[13px] font-semibold text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-1 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors">
            {displayAwardName}
          </span>
        )}
      </div>
    </div>
  );
};

const AwardsPage: React.FC = () => {
  const sortedSeasonAwardsData = React.useMemo(() => {
    return [...seasonAwardsData].sort((a, b) => b.season - a.season);
  }, []);

  return (
    <div className="w-full animate-fade-in pb-12 mt-2">
      <div className="flex flex-col gap-16 md:gap-20">
        {sortedSeasonAwardsData.map((seasonData) => (
          <section key={seasonData.season} className="flex flex-col gap-6 relative">
            {/* Season Header */}
            <div className="flex items-center gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <h3 className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-tighter">
                S{seasonData.season} AWARDS
              </h3>
              {seasonData.label && (
                <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-widest rounded bg-[var(--accent)] text-white shadow-sm mt-0.5">
                  {seasonData.label}
                </span>
              )}
            </div>

            {/* Regular Awards */}
            {seasonData.regularAwards && seasonData.regularAwards.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                {seasonData.regularAwards.map((award, idx) => (
                  <AwardCard key={`reg-${idx}`} award={award} />
                ))}
              </div>
            )}

            {/* Teams */}
            {(seasonData.firstTeam || seasonData.secondTeam) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mt-4">
                {seasonData.firstTeam && (
                  <div className="flex flex-col gap-4">
                    <h4 className="text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1">
                      First Team
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {seasonData.firstTeam.map((award, idx) => (
                        <AwardCard key={`ft-${idx}`} award={award} defaultAwardName="First Team" />
                      ))}
                    </div>
                  </div>
                )}
                {seasonData.secondTeam && (
                  <div className="flex flex-col gap-4">
                    <h4 className="text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1">
                      Second Team
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {seasonData.secondTeam.map((award, idx) => (
                        <AwardCard key={`st-${idx}`} award={award} defaultAwardName="Second Team" />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
};

export default AwardsPage;
