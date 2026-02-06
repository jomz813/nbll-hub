import React, { useState, useEffect, useMemo } from 'react';
import { fetchAllTimeStats, AllTimeRow } from '../data/allTimeStats';
import { useSettings } from '../context/SettingsContext';

type SortKey = keyof AllTimeRow;

interface AllTimeStatsTableProps {
  season?: string;
  onSeasonChange?: (s: any) => void;
  searchQuery?: string;
}

const AllTimeStatsTable: React.FC<AllTimeStatsTableProps> = ({ season, onSeasonChange, searchQuery = '' }) => {
  const { settings, getThemeColors } = useSettings();
  const colors = getThemeColors();
  const accentBg = colors.bg;

  const [data, setData] = useState<AllTimeRow[]>([]);
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
        const stats = await fetchAllTimeStats({ signal: controller.signal });
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
    return (
      <div className="flex items-center justify-center py-24">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 dark:text-zinc-600 animate-pulse">
          loading all-time stats...
        </span>
      </div>
    );
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

  const DropdownIcon = () => (
    <svg className="w-3 h-3 text-zinc-400 dark:text-zinc-500 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );

  const StatGroup = ({ label, value }: { label: string, value: string | number }) => (
    <div className="flex items-center gap-1.5 whitespace-nowrap">
      <span className="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-tight">{label}</span>
      <span className="text-xs font-black text-zinc-900 dark:text-zinc-100 tabular-nums">{value}</span>
    </div>
  );

  return (
    <div className="w-full overflow-x-hidden touch-pan-y">
      {/* Mobile Controls Row: Season Left, Sort Right */}
      <div className="md:hidden mb-6 flex items-center justify-between px-2 gap-4">
        <div className="flex flex-1 items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 shrink-0">Season</span>
          <div className="relative flex-1">
            <select 
              value={season}
              onChange={(e) => onSeasonChange?.(e.target.value)}
              className="w-full bg-zinc-100 dark:bg-zinc-800 border-none rounded-lg py-2 pl-3 pr-8 text-xs font-bold text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-[#D60A07]/20 outline-none appearance-none"
            >
              <option value="s10">S10</option>
              <option value="s11">S11</option>
              <option value="s12">S12</option>
              <option value="all-time">ALL-TIME</option>
            </select>
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
              <DropdownIcon />
            </div>
          </div>
        </div>

        <div className="flex flex-1 items-center gap-2 justify-end">
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 shrink-0">Sort By</span>
          <div className="relative flex-1">
            <select 
              value={sortConfig.key}
              onChange={(e) => requestSort(e.target.value as SortKey)}
              className="w-full bg-zinc-100 dark:bg-zinc-800 border-none rounded-lg py-2 pl-3 pr-8 text-xs font-bold text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-[#D60A07]/20 outline-none appearance-none"
            >
              {columns.map(col => (
                <option key={col.key} value={col.key}>{col.label}</option>
              ))}
            </select>
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
              <DropdownIcon />
            </div>
          </div>
        </div>
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2rem] overflow-hidden shadow-sm">
        <div className="w-full overflow-x-auto overflow-y-auto max-h-[70vh] no-scrollbar">
          <div className="min-w-[640px]">
            <div className="sticky top-0 z-20 grid grid-cols-[1.5fr_repeat(7,1fr)] px-6 py-4 bg-zinc-50/95 dark:bg-zinc-800/95 backdrop-blur-sm border-b border-zinc-100 dark:border-zinc-800 text-[9px] md:text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
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
                    <div className="text-xs md:text-sm font-black text-zinc-900 dark:text-zinc-100 text-center tabular-nums">{row.pts}</div>
                    <div className="text-xs md:text-sm font-bold text-zinc-500 dark:text-zinc-400 text-center tabular-nums">{row.ast}</div>
                    <div className="text-xs md:text-sm font-bold text-zinc-500 dark:text-zinc-400 text-center tabular-nums">{row.reb}</div>
                    <div className="text-xs md:text-sm font-bold text-zinc-500 dark:text-zinc-400 text-center tabular-nums">{row.stl}</div>
                    <div className={`text-xs md:text-sm font-black ${colors.text} text-center tabular-nums`}>{row.eff}</div>
                    <div className="text-xs md:text-sm font-medium text-zinc-500 dark:text-zinc-400 text-center tabular-nums">{row.off}</div>
                    <div className="text-xs md:text-sm font-medium text-zinc-500 dark:text-zinc-400 text-center tabular-nums">{row.def}</div>
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
      <div className="md:hidden space-y-3 px-2">
        {filteredData.length > 0 ? (
          filteredData.map((row, idx) => {
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
                  <StatGroup label="VAL" value={formatCurrency(row.val)} />
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