
import React from 'react';
import { useSettings } from '../context/SettingsContext';

interface HistorySeason {
  id: number;
  champion: string;
  mvp: string;
  isPending?: boolean;
}

const historyData: HistorySeason[] = [
  { id: 11, champion: 'Milwaukee Bucks', mvp: 'Aim' },
  { id: 10, champion: 'Miami Heat', mvp: 'Pansho' },
  { id: 9, champion: 'Cleveland Cavaliers', mvp: 'Packed' },
  { id: 8, champion: 'New York Knicks', mvp: 'Aim' },
  { id: 7, champion: 'Sacramento Kings', mvp: 'Rah' },
  { id: 6, champion: 'Cleveland Cavaliers', mvp: 'Dannygreen' },
  { id: 5, champion: 'OKC Thunder', mvp: 'Pansho' },
  { id: 4, champion: 'Houston Rockets', mvp: 'PunkMonk' },
  { id: 3, champion: 'Golden State Warriors', mvp: 'Marsh' },
  { id: 2, champion: 'Chicago Bulls', mvp: 'Tend' },
  { id: 1, champion: 'Chicago Bulls', mvp: 'Tend' },
];

const HistoryPage: React.FC = () => {
  const { getThemeColors } = useSettings();
  const colors = getThemeColors();
  const accentBg = colors.bg;

  return (
    <div className="pt-8 pb-20 relative animate-page-enter">
      {/* Timeline spine - Aligned left (left-2 to center nodes in padding area) */}
      <div className="absolute left-2 md:left-2 top-0 bottom-0 w-px bg-zinc-200 dark:bg-zinc-800" />

      <div className="space-y-8 md:space-y-12">
        {historyData.map((season) => (
          <div key={season.id} className="relative flex flex-col md:flex-row items-start md:items-center">
            
            {/* Timeline Node - Aligned to spine */}
            <div className={`absolute left-2 md:left-2 w-4 h-4 rounded-full border-4 border-white dark:border-zinc-950 ${accentBg} shadow-sm z-10 -translate-x-1/2 mt-8 md:mt-0`} />

            {/* Content Card Side - Less margin to align left */}
            <div className="ml-10 md:ml-16 w-[calc(100%-2.5rem)] md:w-auto md:flex-1">
              <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-shadow group">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tighter">
                    S{season.id}
                  </h3>
                  <div className={`px-3 py-1 rounded-full ${colors.bgSoft}`}>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${colors.text}`}>
                      Season {season.id}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800/50 group-hover:border-zinc-200 dark:group-hover:border-zinc-700 transition-colors">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-0.5">Champion</span>
                      <span className={`text-sm font-bold ${season.isPending ? 'text-zinc-400 dark:text-zinc-600 italic' : 'text-zinc-900 dark:text-zinc-100'}`}>
                        {season.champion}
                      </span>
                    </div>
                    <svg className={`w-5 h-5 ${season.isPending ? 'text-zinc-200 dark:text-zinc-700' : 'text-zinc-300 dark:text-zinc-600'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800/50 group-hover:border-zinc-200 dark:group-hover:border-zinc-700 transition-colors">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-0.5">Finals MVP</span>
                      <span className={`text-sm font-bold ${season.isPending ? 'text-zinc-400 dark:text-zinc-600 italic' : 'text-zinc-900 dark:text-zinc-100'}`}>
                        {season.mvp}
                      </span>
                    </div>
                    <svg className={`w-5 h-5 ${season.isPending ? 'text-zinc-200 dark:text-zinc-700' : 'text-zinc-300 dark:text-zinc-600'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* End Node */}
      <div className="absolute left-2 md:left-2 bottom-10 w-3 h-3 -translate-x-1/2 rounded-full bg-zinc-200 dark:bg-zinc-800" />
    </div>
  );
};

export default HistoryPage;
