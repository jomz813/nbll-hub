
import React, { useState, useEffect, useMemo } from 'react';
import { fetchS12Stats, S12Row } from '../data/s12Stats';
import { useSettings } from '../context/SettingsContext';

type SortKey = keyof S12Row;

interface S12StatsTableProps {
  isEmbedded?: boolean;
  season?: string;
  onSeasonChange?: (s: any) => void;
  searchQuery?: string;
  externalSortKey?: string;
  showStat?: string;
}

const TableSkeleton: React.FC = () => (
  <div className="w-full space-y-4 animate-pulse">
    <div className="hidden md:grid grid-cols-[1.4fr_repeat(10,1fr)] gap-4 px-6 py-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-full">
      {Array.from({ length: 11 }).map((_, i) => (
        <div key={i} className="h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
      ))}
    </div>
    <div className="space-y-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="grid grid-cols-1 md:grid-cols-[1.4fr_repeat(10,1fr)] gap-4 px-6 py-5 bg-white dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 rounded-[1.5rem]">
          <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full w-24" />
          <div className="hidden md:flex justify-between md:contents">
             {Array.from({ length: 10 }).map((_, j) => (
               <div key={j} className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full w-8 mx-auto" />
             ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const S12StatsTable: React.FC<S12StatsTableProps> = ({ isEmbedded = false, season, onSeasonChange, searchQuery = '', externalSortKey, showStat = 'ALL' }) => {
  const { settings, getThemeColors } = useSettings();
  const colors = getThemeColors();
  const accentBg = colors.bg;
  const accentText = colors.text;

  const [data, setData] = useState<S12Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'asc' | 'desc' }>({
    key: 'pts',
    direction: 'desc'
  });

  useEffect(() => {
    const controller = new AbortController();
    let alive = true;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const stats = await fetchS12Stats({ signal: controller.signal });
        if (alive) {
          setData(stats);
        }
      } catch (err: any) {
        if (alive) {
          if (err.name === 'AbortError') return;
          setError(err.message || 'Failed to load S12 stats');
        }
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      alive = false;
      controller.abort();
    };
  }, []);

  // Update internal sort config if external key changes (mobile)
  useEffect(() => {
    if (externalSortKey && externalSortKey !== sortConfig.key) {
      setSortConfig({ key: externalSortKey as SortKey, direction: 'desc' });
    }
  }, [externalSortKey]);

  const sortedData = useMemo(() => {
    const sorted = [...data].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortConfig.direction === 'asc' 
          ? aVal.localeCompare(bVal) 
          : bVal.localeCompare(aVal);
      }

      const numA = aVal as number;
      const numB = bVal as number;
      return sortConfig.direction === 'asc' ? numA - numB : numB - numA;
    });
    return sorted;
  }, [data, sortConfig]);

  // Apply Search Filter
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return sortedData;
    const q = searchQuery.toLowerCase().trim();
    return sortedData.filter(row => row.player.toLowerCase().includes(q));
  }, [sortedData, searchQuery]);

  const requestSort = (key: SortKey) => {
    let direction: 'asc' | 'desc' = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  if (loading) {
    return <TableSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500">
          Error loading s12 stats
        </span>
        <p className="text-xs text-zinc-500 max-w-xs text-center">{error}</p>
      </div>
    );
  }

  const columns: { key: SortKey; label: string }[] = [
    { key: 'player', label: 'PLAYER' },
    { key: 'pts', label: 'PTS' },
    { key: 'ast', label: 'AST' },
    { key: 'reb', label: 'REB' },
    { key: 'stl', label: 'STL' },
    { key: 'gp', label: 'GP' },
    { key: 'ppg', label: 'PPG' },
    { key: 'apg', label: 'APG' },
    { key: 'rpg', label: 'RPG' },
    { key: 'spg', label: 'SPG' },
    { key: 'eff', label: 'EFF' },
  ];

  const containerClasses = isEmbedded 
    ? "space-y-4 w-full overflow-x-hidden touch-pan-y" 
    : "animate-page-enter pt-2 space-y-6 pb-20 w-full overflow-x-hidden touch-pan-y";

  const StatGroup = ({ label, value }: { label: string, value: string | number }) => (
    <div className="flex items-center gap-1.5 whitespace-nowrap">
      <span className="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-tight">{label}</span>
      <span className="text-xs font-black text-zinc-900 dark:text-zinc-100 tabular-nums">{value}</span>
    </div>
  );

  return (
    <div className={containerClasses}>
      {/* DESKTOP TABLE */}
      <div className="hidden md:block bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-sm">
        <div className="w-full overflow-x-auto overflow-y-auto max-h-[70vh] no-scrollbar">
          <div className="min-w-full">
            <div className="sticky top-0 z-20 grid grid-cols-[1.4fr_repeat(10,1fr)] px-4 py-4 bg-zinc-50/95 dark:bg-zinc-800/95 backdrop-blur-sm border-b border-zinc-100 dark:border-zinc-800 text-[8px] lg:text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
              {columns.map((col) => (
                <button
                  key={col.key}
                  onClick={() => requestSort(col.key)}
                  className={`flex items-center gap-1 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors ${col.key !== 'player' ? 'justify-center' : 'justify-start'}`}
                >
                  {col.label}
                  {sortConfig.key === col.key && (
                    <svg 
                      className={`w-3 h-3 transition-transform duration-300 ${sortConfig.direction === 'asc' ? 'rotate-180' : ''}`} 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="3.5"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
              {filteredData.length > 0 ? (
                filteredData.map((row, idx) => (
                  <div key={idx} className="grid grid-cols-[1.4fr_repeat(10,1fr)] px-4 py-3.5 items-center hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                    <div className="text-[11px] lg:text-[13px] font-bold text-zinc-900 dark:text-zinc-100 truncate pr-2">{row.player}</div>
                    <div className="text-[11px] lg:text-[13px] font-black text-zinc-900 dark:text-zinc-100 text-center tabular-nums">{row.pts}</div>
                    <div className="text-[11px] lg:text-[13px] font-bold text-zinc-500 dark:text-zinc-400 text-center tabular-nums">{row.ast}</div>
                    <div className="text-[11px] lg:text-[13px] font-bold text-zinc-500 dark:text-zinc-400 text-center tabular-nums">{row.reb}</div>
                    <div className="text-[11px] lg:text-[13px] font-bold text-zinc-500 dark:text-zinc-400 text-center tabular-nums">{row.stl}</div>
                    <div className="text-[11px] lg:text-[13px] font-medium text-zinc-500 dark:text-zinc-400 text-center tabular-nums">{row.gp}</div>
                    <div className="text-[11px] lg:text-[13px] font-bold text-zinc-900 dark:text-zinc-100 text-center tabular-nums">{row.ppg.toFixed(1)}</div>
                    <div className="text-[11px] lg:text-[13px] font-medium text-zinc-500 dark:text-zinc-400 text-center tabular-nums">{row.apg.toFixed(1)}</div>
                    <div className="text-[11px] lg:text-[13px] font-medium text-zinc-500 dark:text-zinc-400 text-center tabular-nums">{row.rpg.toFixed(1)}</div>
                    <div className="text-[11px] lg:text-[13px] font-medium text-zinc-500 dark:text-zinc-400 text-center tabular-nums">{row.spg.toFixed(1)}</div>
                    <div className={`text-[11px] lg:text-[13px] font-black ${accentText} text-center tabular-nums`}>{row.eff}</div>
                  </div>
                ))
              ) : (
                <div className="py-24 text-center">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 dark:text-zinc-600">
                    {searchQuery ? `No players found matching "${searchQuery}"` : "No S12 stats yet."}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE LIST */}
      <div className="md:hidden space-y-2 px-2">
        {filteredData.length > 0 ? (
          filteredData.map((row, idx) => {
            if (showStat !== 'ALL') {
              const val = row[showStat as keyof S12Row];
              const isAvg = ['ppg', 'apg', 'rpg', 'spg'].includes(showStat);
              const label = showStat.toUpperCase();
              return (
                <div key={idx} className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-xl p-3 shadow-sm flex items-center justify-between">
                  <span className="text-sm font-black text-zinc-900 dark:text-zinc-100 truncate pr-4">{row.player}</span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-tight">{label}</span>
                    <span className={`text-sm font-black tabular-nums ${showStat === 'eff' ? accentText : 'text-zinc-900 dark:text-zinc-100'}`}>
                      {typeof val === 'number' ? (isAvg ? val.toFixed(1) : val) : '—'}
                    </span>
                  </div>
                </div>
              );
            }
            return (
              <div key={idx} className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-2xl p-4 shadow-sm">
                <div className="flex items-baseline justify-between mb-3 border-b border-zinc-50 dark:border-zinc-900/50 pb-2">
                  <h4 className="text-sm font-black text-zinc-900 dark:text-zinc-100 truncate pr-4">{row.player}</h4>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">GP</span>
                    <span className="text-sm font-black text-zinc-900 dark:text-zinc-100 tabular-nums">{row.gp}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-y-3">
                  {/* Row 1: Totals */}
                  <StatGroup label="PTS" value={row.pts} />
                  <StatGroup label="AST" value={row.ast} />
                  <StatGroup label="REB" value={row.reb} />
                  <StatGroup label="STL" value={row.stl} />
                  
                  {/* Row 2: Averages */}
                  <StatGroup label="PPG" value={row.ppg.toFixed(1)} />
                  <StatGroup label="APG" value={row.apg.toFixed(1)} />
                  <StatGroup label="RPG" value={row.rpg.toFixed(1)} />
                  <StatGroup label="SPG" value={row.spg.toFixed(1)} />
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-12 text-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-600">
              No players found matching "{searchQuery}"
            </span>
          </div>
        )}
      </div>
      
      {!isEmbedded && (
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 opacity-50 px-4 pt-4">
          <div className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${accentBg} animate-pulse`} />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Season 12 Registry</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default S12StatsTable;
