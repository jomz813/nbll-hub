
import React from 'react';
import { westernStandings, easternStandings } from '../data/standings';
import { useSettings } from '../context/SettingsContext';

const StandingsPage: React.FC = () => {
  const { settings, getThemeColors } = useSettings();
  const colors = getThemeColors();
  const accentBgSoft = colors.bgSoft;
  const accentBg = colors.bg;

  const formatWinPct = (w: number, l: number) => {
    if (w + l === 0) return '.000';
    const pct = (w / (w + l)).toFixed(3);
    return pct.startsWith('0') ? pct.substring(1) : pct;
  };

  const paddingY = 'py-3 md:py-5';
  const containerRounding = 'rounded-[1.5rem] md:rounded-[2rem]';
  const gapSize = 'space-y-8 md:space-y-16';

  return (
    <div className={`${gapSize} pt-4 md:pt-8 pb-12`}>
      {[
        { title: 'Western Conference', data: westernStandings },
        { title: 'Eastern Conference', data: easternStandings }
      ].map((conf) => (
        <div key={conf.title} className="space-y-4 md:space-y-6">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-xl md:text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight uppercase">
              {conf.title}
            </h3>
            <div className="h-px bg-zinc-100 dark:bg-zinc-800 flex-1 hidden sm:block" />
          </div>
          <div className={`bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 ${containerRounding} overflow-hidden shadow-sm transition-colors`}>
            <div className="w-full">
              <div className={`grid grid-cols-[2.5rem_1fr_2.5rem_2.5rem_3.5rem] md:grid-cols-[3rem_1fr_4rem_4rem_5rem_4rem] px-4 md:px-6 py-3 md:py-4 bg-zinc-50 dark:bg-zinc-800 border-b border-zinc-100 dark:border-zinc-800 text-[9px] md:text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest`}>
                <div>rank</div>
                <div>team</div>
                <div className="text-center">w</div>
                <div className="text-center">l</div>
                <div className="hidden md:block text-center">win%</div>
                <div className="text-right">gb</div>
              </div>
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                {conf.data.map((row) => {
                  const isFavorite = settings.favoriteTeam === row.team;
                  // If favorite, add specific highlighting
                  const favClass = isFavorite 
                    ? `bg-[#FFFF00]/10 dark:bg-[#FFFF00]/10 ring-1 ring-inset ring-[#FFFF00]/30 z-10 relative` 
                    : row.rank <= 4 
                      ? `${accentBgSoft} shadow-[inset_4px_0_0_currentColor] text-inherit` // accent color handled by text color inheritance if needed, but accentBgSoft sets bg
                      : '';
                  
                  // For the shadow strip color in rank <=4, use inline style or specific class if dynamic
                  const stripStyle = row.rank <= 4 && !isFavorite ? { boxShadow: `inset 4px 0 0 ${settings.rahBizzyTheme ? '#3B82F6' : '#D60A07'}` } : {};

                  return (
                    <React.Fragment key={row.team}>
                      <div 
                        className={`grid grid-cols-[2.5rem_1fr_2.5rem_2.5rem_3.5rem] md:grid-cols-[3rem_1fr_4rem_4rem_5rem_4rem] px-4 md:px-6 ${paddingY} items-center hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors ${favClass} ${!isFavorite && row.rank <= 4 ? accentBgSoft : ''}`}
                        style={stripStyle}
                      >
                        <div className="text-xs md:text-sm font-black text-zinc-300 dark:text-zinc-600">
                          {row.rank.toString().padStart(2, '0')}
                        </div>
                        <div className="text-xs md:text-sm font-bold text-zinc-800 dark:text-zinc-200 truncate flex items-center gap-2">
                          {row.team}
                          {isFavorite && <span className="text-[8px] bg-yellow-400 text-black px-1.5 py-0.5 rounded font-black uppercase">MY TEAM</span>}
                        </div>
                        <div className="text-xs md:text-sm font-black text-zinc-900 dark:text-zinc-100 text-center tabular-nums">{row.w}</div>
                        <div className="text-xs md:text-sm font-black text-zinc-900 dark:text-zinc-100 text-center tabular-nums">{row.l}</div>
                        <div className="hidden md:block text-sm font-medium text-zinc-500 dark:text-zinc-400 text-center tabular-nums">
                          {formatWinPct(row.w, row.l)}
                        </div>
                        <div className="text-xs md:text-sm font-black text-zinc-900 dark:text-zinc-100 text-right tabular-nums">{row.gb}</div>
                      </div>
                      {row.rank === 4 && (
                        <div className="relative py-2 flex items-center justify-center bg-zinc-50/30 dark:bg-zinc-900/50 overflow-hidden">
                          <div className="absolute inset-0 flex items-center px-4" aria-hidden="true">
                            <div className="w-full border-t-2 border-dashed border-zinc-200 dark:border-zinc-700"></div>
                          </div>
                          <div className="relative px-4 bg-[#fcfcfc] dark:bg-zinc-900 rounded-full border border-zinc-100 dark:border-zinc-800">
                            <span className="text-[8px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.25em]">playoff cutoff</span>
                          </div>
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className="flex items-center gap-4 pt-4">
        <div className="h-px bg-zinc-100 dark:bg-zinc-800 flex-1" />
        <div className="flex items-center gap-2 px-6 py-3 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800">
          <div className={`w-2.5 h-2.5 rounded-full ${accentBg} shadow-sm`} />
          <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
            Key: Top 4 teams in each conference make playoffs.
          </span>
        </div>
        <div className="h-px bg-zinc-100 dark:bg-zinc-800 flex-1" />
      </div>
    </div>
  );
};

export default StandingsPage;
