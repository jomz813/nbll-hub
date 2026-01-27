import React, { useState, useEffect, useMemo } from 'react';
import { fetchS10Stats, S10Row } from '../data/s10Stats';
import { useSettings } from '../context/SettingsContext';

type SortKey = keyof S10Row;

interface S10StatsTableProps {
  isEmbedded?: boolean;
}

const S10StatsTable: React.FC<S10StatsTableProps> = ({ isEmbedded = false }) => {
  const { settings, getThemeColors } = useSettings();
  const colors = getThemeColors();
  const accentText = colors.text;
  const accentBg = colors.bg;

  const [data, setData] = useState<S10Row[]>([]);
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
        const stats = await fetchS10Stats({ signal: controller.signal });
        if (alive) {
          setData(stats);
        }
      } catch (err: any) {
        if (alive) {
          if (err.name === 'AbortError') return;
          setError(err.message || 'Failed to load S10 stats');
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
          loading s10 stats...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500">
          Error loading s10 stats
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
  ];

  const containerClasses = isEmbedded 
    ? "space-y-12" 
    : "animate-page-enter pt-4 space-y-12 pb-20";

  return (
    <div className={containerClasses}>
      <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-sm">
        <div className="w-full overflow-x-auto no-scrollbar">
          <div className="min-w-[500px]">
            {/* Table Header */}
            <div className="grid grid-cols-[1.5fr_repeat(4,1fr)] px-6 py-4 bg-zinc-50 dark:bg-zinc-800 border-b border-zinc-100 dark:border-zinc-800 text-[9px] md:text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
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

            {/* Table Body */}
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
              {sortedData.map((row, idx) => (
                <div 
                  key={idx}
                  className="grid grid-cols-[1.5fr_repeat(4,1fr)] px-6 py-4 items-center hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors"
                >
                  <div className="text-xs md:text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate pr-4">
                    {row.player}
                  </div>
                  <div className="text-xs md:text-sm font-black text-zinc-900 dark:text-zinc-100 text-center tabular-nums">{row.pts}</div>
                  <div className="text-xs md:text-sm font-bold text-zinc-500 dark:text-zinc-400 text-center tabular-nums">{row.ast}</div>
                  <div className="text-xs md:text-sm font-bold text-zinc-500 dark:text-zinc-400 text-center tabular-nums">{row.reb}</div>
                  <div className="text-xs md:text-sm font-bold text-zinc-500 dark:text-zinc-400 text-center tabular-nums">{row.stl}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {!isEmbedded && (
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 opacity-50 px-4">
          <div className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${accentBg} animate-pulse`} />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
              Season 10 Registry
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default S10StatsTable;