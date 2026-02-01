
import React, { useState, useEffect, useMemo } from 'react';
import { fetchS12Stats, S12Row } from '../data/s12Stats';
import { useSettings } from '../context/SettingsContext';

type SortKey = keyof S12Row;

interface S12StatsTableProps {
  isEmbedded?: boolean;
  season?: string;
  onSeasonChange?: (s: any) => void;
  searchQuery?: string;
}

const S12StatsTable: React.FC<S12StatsTableProps> = ({ isEmbedded = false, season, onSeasonChange, searchQuery = '' }) => {
  const { settings, getThemeColors } = useSettings();
  const colors = getThemeColors();
  const accentText = colors.text;
  const accentBg = colors.bg;

  const [data, setData] = useState<S12Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
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

  const toggleRow = (idx: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(idx)) newExpanded.delete(idx);
    else newExpanded.add(idx);
    setExpandedRows(newExpanded);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 dark:text-zinc-600 animate-pulse">
          loading s12 stats...
        </span>
      </div>
    );
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
    { key: 'eff', label: 'EFF' },
    { key: 'off', label: 'OFF' },
    { key: 'def', label: 'DEF' },
  ];

  const DropdownIcon = () => (
    <svg className="w-3 h-3 text-zinc-400 dark:text-zinc-500 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );

  const containerClasses = isEmbedded 
    ? "space-y-6 w-full overflow-x-hidden touch-pan-y" 
    : "animate-page-enter pt-4 space-y-6 pb-20 w-full overflow-x-hidden touch-pan-y";

  return (
    <div className={containerClasses}>
      {/* Mobile Controls Row: Season Left, Sort Right */}
      <div className="md:hidden flex items-center justify-between px-2 gap-4">
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
      <div className="hidden md:block bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-sm">
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
                  <div key={idx} className="grid grid-cols-[1.5fr_repeat(7,1fr)] px-6 py-4 items-center hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                    <div className="text-xs md:text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate pr-4">{row.player}</div>
                    <div className="text-xs md:text-sm font-black text-zinc-900 dark:text-zinc-100 text-center tabular-nums">{row.pts}</div>
                    <div className="text-xs md:text-sm font-bold text-zinc-500 dark:text-zinc-400 text-center tabular-nums">{row.ast}</div>
                    <div className="text-xs md:text-sm font-bold text-zinc-500 dark:text-zinc-400 text-center tabular-nums">{row.reb}</div>
                    <div className="text-xs md:text-sm font-bold text-zinc-500 dark:text-zinc-400 text-center tabular-nums">{row.stl}</div>
                    <div className={`text-xs md:text-sm font-black ${accentText} text-center tabular-nums`}>{row.eff}</div>
                    <div className="text-xs md:text-sm font-medium text-zinc-500 dark:text-zinc-400 text-center tabular-nums">{row.off}</div>
                    <div className="text-xs md:text-sm font-medium text-zinc-500 dark:text-zinc-400 text-center tabular-nums">{row.def}</div>
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
      <div className="md:hidden space-y-4">
        {filteredData.length > 0 ? (
          filteredData.map((row, idx) => {
            const isExpanded = expandedRows.has(idx);
            const statValueClass = "text-sm font-black text-zinc-900 dark:text-zinc-100";
            return (
              <div key={idx} className="bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden">
                <div className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 truncate flex-1 pr-4">{row.player}</h4>
                    <span className={`text-xl font-black ${accentText} tabular-nums leading-none`}>{row.eff} <span className="text-[8px] font-black uppercase tracking-tighter opacity-40 ml-0.5">EFF</span></span>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-2">
                    <div className="flex flex-col items-center p-2 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-100 dark:border-zinc-700/50">
                      <span className="text-[8px] font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-1">PTS</span>
                      <span className={statValueClass}>{row.pts}</span>
                    </div>
                    <div className="flex flex-col items-center p-2 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-100 dark:border-zinc-700/50">
                      <span className="text-[8px] font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-1">AST</span>
                      <span className={statValueClass}>{row.ast}</span>
                    </div>
                    <div className="flex flex-col items-center p-2 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-100 dark:border-zinc-700/50">
                      <span className="text-[8px] font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-1">REB</span>
                      <span className={statValueClass}>{row.reb}</span>
                    </div>
                    <div className="flex flex-col items-center p-2 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-100 dark:border-zinc-700/50">
                      <span className="text-[8px] font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-1">STL</span>
                      <span className={statValueClass}>{row.stl}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => toggleRow(idx)}
                    className="w-full mt-4 flex items-center justify-between px-1 text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-600 transition-colors"
                  >
                    <span>Advanced</span>
                    <svg className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="6 9 12 15 18 9"/></svg>
                  </button>

                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-dashed border-zinc-200 dark:border-zinc-800 grid grid-cols-2 gap-4 animate-page-enter">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">OFF IMPACT</span>
                        <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{row.off}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">DEF IMPACT</span>
                        <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{row.def}</span>
                      </div>
                    </div>
                  )}
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
