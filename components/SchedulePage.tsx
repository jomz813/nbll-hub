
import React, { useState } from 'react';
import { scheduleData } from '../data/schedule';
import { teamShortNames } from '../data/standings';
import { useSettings } from '../context/SettingsContext';

const SEASON_PREFIX = 'S11';

const SchedulePage: React.FC = () => {
  const { settings, getThemeColors } = useSettings();
  const [openWeeks, setOpenWeeks] = useState<number[]>([5]);
  const colors = getThemeColors();
  const accentText = colors.text;

  const toggleWeek = (week: number) => {
    setOpenWeeks(prev => 
      prev.includes(week) ? prev.filter(w => w !== week) : [...prev, week]
    );
  };

  const isFavoriteGame = (matchup: string) => {
    if (!settings.favoriteTeam) return false;
    return matchup.includes(settings.favoriteTeam);
  };

  const cardPadding = 'px-8 py-6';
  const gameSpacing = 'gap-12';

  return (
    <div className={`pt-8 pb-12 space-y-6`}>
      {scheduleData.map((weekItem) => {
        const isOpen = openWeeks.includes(weekItem.week);
        return (
          <div 
            key={weekItem.week}
            className="border border-zinc-100 dark:border-zinc-800 rounded-[2rem] overflow-hidden bg-white dark:bg-zinc-900 shadow-sm transition-all duration-300"
          >
            <button 
              onClick={() => toggleWeek(weekItem.week)}
              className={`w-full ${cardPadding} flex items-center justify-between text-left hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors border-l-8 ${settings.rahBizzyTheme ? 'border-[#3B82F6]' : 'border-[#D60A07]'}`}
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tighter">
                  {SEASON_PREFIX} WEEK {weekItem.week}
                </span>
              </div>
              <svg 
                className={`w-6 h-6 text-zinc-300 dark:text-zinc-600 transition-transform duration-500 ${isOpen ? `rotate-180 ${accentText}` : ''}`} 
                viewBox="0 0 24 24" 
                fill="none"  stroke="currentColor" strokeWidth="3" 
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {isOpen && (
              <div className={`px-8 pb-8 pt-2 animate-page-enter`}>
                <div className={`grid grid-cols-1 lg:grid-cols-2 ${gameSpacing}`}>
                  {weekItem.games.map((game, gIdx) => (
                    <div key={gIdx} className="space-y-6">
                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] font-black ${accentText} uppercase tracking-[0.3em]`}>
                          {game.title}
                        </span>
                        <div className="h-px bg-zinc-100 dark:bg-zinc-800 flex-1" />
                      </div>
                      <div className="space-y-2">
                        {game.matchups.map((matchup, mIdx) => {
                          const [away, home] = matchup.split(' @ ');
                          const isFav = isFavoriteGame(matchup);
                          return (
                            <div 
                              key={mIdx}
                              className={`group flex items-center justify-between p-4 rounded-2xl border border-transparent hover:border-zinc-100 dark:hover:border-zinc-700 hover:bg-white dark:hover:bg-zinc-800/80 transition-all duration-300
                                ${isFav 
                                  ? 'bg-[#FFFF00]/10 dark:bg-[#FFFF00]/10 ring-1 ring-[#FFFF00]/30' 
                                  : 'bg-zinc-50/50 dark:bg-zinc-800/30'
                                }
                              `}
                            >
                              <div className={`flex-1 text-sm font-bold text-left ${settings.favoriteTeam === away ? 'text-[#D60A07] dark:text-[#FF4040]' : 'text-zinc-800 dark:text-zinc-300'}`}>
                                <span className="hidden md:inline">{away}</span>
                                <span className="md:hidden">{teamShortNames[away] || away}</span>
                              </div>
                              <div className="px-3 py-1 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-full shadow-sm">
                                <span className={`text-[10px] font-black ${accentText}`}>@</span>
                              </div>
                              <div className={`flex-1 text-sm font-bold text-right ${settings.favoriteTeam === home ? 'text-[#D60A07] dark:text-[#FF4040]' : 'text-zinc-800 dark:text-zinc-300'}`}>
                                <span className="hidden md:inline">{home}</span>
                                <span className="md:hidden">{teamShortNames[home] || home}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SchedulePage;
