import React, { useState, useEffect, useMemo } from 'react';
import { fetchSeasonStats, PlayerStats } from '../data/statsFetcher';
import { useSettings } from '../context/SettingsContext';

type SortKey = keyof PlayerStats;

interface AllTimeStatsTableProps {
  season?: string;
  onSeasonChange?: (s: any) => void;
  searchQuery?: string;
  externalSortKey?: string;
  showStat?: string;
}

const TableSkeleton: React.FC = () => (
  <div className="w-full space-y-4 animate-pulse">
    <div className="hidden md:grid grid-cols-[1.5fr_repeat(7,1fr)] gap-4 px-6 py-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-full">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
      ))}
    </div>
    <div className="space-y-3">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="grid grid-cols-1 md:grid-cols-[1.5fr_repeat(7,1fr)] gap-4 px-6 py-5 bg-white dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 rounded-[1.5rem]">
          <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full w-32" />
          <div className="hidden md:flex justify-between md:contents">
             {Array.from({ length: 7 }).map((_, j) => (
               <div key={j} className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full w-10 mx-auto" />
             ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const getColumnMaxes = (rows: PlayerStats[], keys: (keyof PlayerStats)[]) => {
  const maxes: Partial<Record<keyof PlayerStats, number>> = {};
  keys.forEach(key => {
    const values = rows
      .map(row => row[key] as number)
      .filter(val => typeof val === 'number' && !isNaN(val) && val > 0);
    if (values.length > 0) {
      maxes[key] = Math.max(...values);
    }
  });
  return maxes;
};

const AllTimeStatsTable: React.FC<AllTimeStatsTableProps> = ({ season, onSeasonChange, searchQuery = '', externalSortKey, showStat = 'ALL' }) => {
  const { settings, getThemeColors } = useSettings();
  const colors = getThemeColors();
  const accentBg = colors.bg;
  const accentText = colors.text;

  const [data, setData] = useState<PlayerStats[]>([]);
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
        const stats = await fetchSeasonStats('all-time', controller.signal);
        if (alive) {
          setData(stats);
        }
      } catch (err: any) {
        if (alive) {
          if (err.name === 'AbortError') return;
          setError(err.message || 'Failed to load stats');
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

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return sortedData;
    const q = searchQuery.toLowerCase().trim();
    return sortedData.filter(row => row.player.toLowerCase().includes(q));
  }, [sortedData, searchQuery]);

  const columnMaxes = useMemo(() => {
    const numericKeys: (keyof PlayerStats)[] = ['pts', 'ast', 'reb', 'stl', 'eff', 'off', 'def'];
    return getColumnMaxes(filteredData, numericKeys);
  }, [filteredData]);

  const requestSort = (key: SortKey) => {
    let direction: 'asc' | 'desc' = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  const HighlightedCell = ({ value, colKey, isBold = false }: { value: number, colKey: keyof PlayerStats, isBold?: boolean }) => {
    const isLeader = value > 0 && value === columnMaxes[colKey];
    
    // Logic for high contrast EFF in light mode
    const isEff = colKey === 'eff';
    const leaderColorClass = isEff && settings.siteThemeAccent !== 'monochrome'
      ? `text-zinc-900 dark:${accentText}`
      : accentText;

    return (
      <div className="flex items-center justify-center h-full">
        <span className={`
          tabular-nums transition-all duration-300
          ${isLeader ? `px-2 py-0.5 rounded-full bg-[var(--accent)]/10 font-black ${leaderColorClass} shadow-[0_0_12px_rgba(var(--accent-rgb),0.15)]` : (isBold ? 'font-black' : 'font-bold')}
        `}>
          {value}
        </span>
      </div>
    );
  };

  if (loading) {
    return <TableSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500">
          Error loading stats
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
    { key: 'eff', label: 'EFF' },
    { key: 'off', label: 'OFF' },
    { key: 'def', label: 'DEF' },
  ];

  const formatCurrency = (val: number) => {
    if (val >= 1_000_000_000) return `$${(val / 1_000_000_000).toFixed(1)}B`;
    if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`;
    if (val >= 1_000) return `$${(val / 1_000).toFixed(1)}K`;
    return `$${val.toFixed(0)}`;
  };

  const StatGroup = ({ label, value }: { label: string, value: string | number }) => (
    <div className="flex items-center gap-1.5 whitespace-nowrap">
      <span className="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-tight">{label}</span>
      <span className="text-xs font-black text-zinc-900 dark:text-zinc-100 tabular-nums">{value}</span>
    </div>
  );

  return (
    <div className="w-full overflow-x-hidden touch-pan-y">
      {/* DESKTOP TABLE */}
      <div className="hidden md:block bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2rem] overflow-hidden shadow-sm">
        <div className="w-full overflow-x-auto overflow-y-auto max-h-[70vh] no-scrollbar">
          <div className="min-w-[640px]">
            <div className="sticky top-0 z-20 grid grid-cols-[1.5fr_repeat(7,1fr)] px-6 py-4 bg-zinc-50/95 dark:bg-zinc-800/95 backdrop-blur-sm border-b border-zinc-100 dark:border-zinc-800 text-[9px] md:text-[10px] font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-widest shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
              {columns.map((col) => (
                <button
                  key={col.key}
                  onClick={() => requestSort(col.key)}
                  className={`flex items-center gap-1.5 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors ${col.key !== 'player' ? 'justify-center' : 'justify-start'}`}
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
                  <div 
                    key={idx}
                    className="grid grid-cols-[1.5fr_repeat(7,1fr)] px-6 py-4 items-center hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors"
                  >
                    <div className="text-xs md:text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate pr-4">{row.player}</div>
                    <div className="text-xs md:text-sm text-zinc-900 dark:text-zinc-100 text-center tabular-nums"><HighlightedCell value={row.pts} colKey="pts" isBold={true} /></div>
                    <div className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 text-center tabular-nums"><HighlightedCell value={row.ast} colKey="ast" /></div>
                    <div className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 text-center tabular-nums"><HighlightedCell value={row.reb} colKey="reb" /></div>
                    <div className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 text-center tabular-nums"><HighlightedCell value={row.stl} colKey="stl" /></div>
                    <div className={`text-xs md:text-sm text-zinc-900 dark:text-zinc-100 text-center tabular-nums`}><HighlightedCell value={row.eff} colKey="eff" isBold={true} /></div>
                    <div className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 text-center tabular-nums"><HighlightedCell value={row.off} colKey="off" /></div>
                    <div className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 text-center tabular-nums"><HighlightedCell value={row.def} colKey="def" /></div>
                  </div>
                ))
              ) : (
                <div className="py-24 text-center">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 dark:text-zinc-600">
                    {searchQuery ? `No players found matching "${searchQuery}"` : "No stats loaded."}
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
              const val = row[showStat as keyof PlayerStats];
              const label = showStat.toUpperCase();
              const displayVal = showStat === 'val' ? formatCurrency(val as number) : (typeof val === 'number' ? val : '—');
              
              // Mobile specific color logic for EFF contrast
              const isEffStat = showStat === 'eff';
              const mobileColorClass = isEffStat && settings.siteThemeAccent !== 'monochrome'
                ? `text-zinc-900 dark:${accentText}`
                : isEffStat ? 'text-zinc-900 dark:text-zinc-100' : (showStat === 'eff' ? accentText : 'text-zinc-900 dark:text-zinc-100');

              return (
                <div key={idx} className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-xl p-3 shadow-sm flex items-center justify-between">
                  <span className="text-sm font-black text-zinc-900 dark:text-zinc-100 truncate pr-4">{row.player}</span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-tight">{label}</span>
                    <span className={`text-sm font-black tabular-nums ${mobileColorClass}`}>
                      {displayVal}
                    </span>
                  </div>
                </div>
              );
            }
            return (
              <div key={idx} className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-2xl p-4 shadow-sm">
                <div className="mb-3 border-b border-zinc-50 dark:border-zinc-900/50 pb-2">
                  <h4 className="text-sm font-black text-zinc-900 dark:text-zinc-100 truncate">{row.player}</h4>
                </div>
                
                <div className="grid grid-cols-4 gap-y-3">
                  {/* Row 1: Totals */}
                  <StatGroup label="PTS" value={row.pts} />
                  <StatGroup label="AST" value={row.ast} />
                  <StatGroup label="REB" value={row.reb} />
                  <StatGroup label="STL" value={row.stl} />
                  
                  {/* Row 2: Advanced & Value */}
                  <StatGroup label="EFF" value={row.eff} />
                  <StatGroup label="OFF" value={row.off} />
                  <StatGroup label="DEF" value={row.def} />
                  <StatGroup label="VAL" value={formatCurrency(row.val ?? 0)} />
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
    </div>
  );
};

export default AllTimeStatsTable;