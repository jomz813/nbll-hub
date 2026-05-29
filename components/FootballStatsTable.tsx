import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { fetchSeasonStats, PlayerStats, SeasonID, PositionID, getFootballStatColumns, getStatStatusMessage, defaultSortByPosition, getMobileFootballStatColumns } from '../data/statsFetcher';
import { useSettings } from '../context/SettingsContext';

type SortKey = keyof PlayerStats;

interface FootballStatsTableProps {
  isEmbedded?: boolean;
  season: SeasonID;
  position: PositionID;
  onSeasonChange?: (s: any) => void;
  searchQuery?: string;
  externalSortKey?: string;
  showStat?: string;
  onCompare?: (players: string[], comparisonSeason: string, comparisonPosition: string) => void;
  onSelectionChange?: (players: string[]) => void;
}

const TableSkeleton: React.FC<{ columnsCount?: number }> = ({ columnsCount = 10 }) => (
  <div className="w-full space-y-4 animate-pulse">
    <div className="hidden md:grid gap-4 px-6 py-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-full" style={{ gridTemplateColumns: `1.4fr repeat(${columnsCount}, 1fr)` }}>
      {Array.from({ length: columnsCount + 1 }).map((_, i) => (
        <div key={i} className="h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
      ))}
    </div>
    <div className="space-y-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="grid grid-cols-1 md:grid-cols-none gap-4 px-6 py-5 bg-white dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 rounded-[1.5rem]" style={{ gridTemplateColumns: `1.4fr repeat(${columnsCount}, 1fr)` }}>
          <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full w-24" />
          <div className="hidden md:flex justify-between md:contents">
             {Array.from({ length: columnsCount }).map((_, j) => (
               <div key={j} className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full w-8 mx-auto" />
             ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const footballStatHeaderLabels: Record<string, string | Record<string, string>> = {
  PLAYER: "player name",
  GP: "games played",
  CMP: "pass completions",
  ATT: {
    QB: "pass attempts",
    RB: "rush attempts"
  },
  YDS: {
    QB: "passing yards",
    WR: "recieving yards",
    RB: "rushing yards",
    TE: "recieving yards"
  },
  TD: {
    QB: "passing touchdowns",
    WR: "recieving touchdowns",
    RB: "rushing touchdowns",
    TE: "recieving touchdowns"
  },
  LONG: {
    QB: "longest pass",
    WR: "longest reception",
    RB: "longest rush",
    K: "longest field goal made",
    TE: "longest reception"
  },
  SK: {
    QB: "sacks taken",
    DB: "leading sack"
  },
  INT: {
    QB: "interceptions thrown",
    DB: "interceptions caught"
  },
  "CMP%": "completion rate",
  "YDS/ATT": {
    QB: "average passing yards per pass",
    RB: "average rushing yards per carry"
  },
  QBR: "quarterback rating",
  REC: "receptions",
  "REC/G": "receptions per game",
  "TD/G": "touchdowns per game played",
  "YDS/G": {
    QB: "passing yards per game",
    WR: "recieving yards per game",
    RB: "average rushing yards per game",
    TE: "recieving yards per game"
  },
  "INT/G": "interceptions per game",
  "SK/A%": "sack allowed rate",
  "FGA/G": "field goal attempts per game",
  "FGM/G": "field goals made per game",
  "YDS/REC": "average recieving yards per reception",
  WRR: "wide reciever rating",
  TKL: "leading tackle",
  SFTY: "safeties caused",
  "TKL/G": "leading tackles per game",
  "SK/A": "sacks allowed",
  "SFTY/A": "safeties allowed",
  SNAP: "snaps played",
  BLK: "successful quarterback protections",
  OLR: "offensive lineman rating",
  FGM: "field goals made",
  FGA: "field goals attempted",
  "FG%": "field goal success rate"
};

const BOLD_COLUMNS = ["YDS", "TD", "QBR", "WRR", "TKL", "BLK", "OLR", "FGM", "FG%"];

const getHeaderLabel = (colLabel: string, pos: PositionID): string | null => {
  const mapValue = footballStatHeaderLabels[colLabel];
  if (!mapValue) return null;
  if (typeof mapValue === 'string') return mapValue;
  return (mapValue as any)[pos] || null;
};

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

const FootballStatsTable: React.FC<FootballStatsTableProps> = ({ isEmbedded = false, season, position, onSeasonChange, searchQuery = '', externalSortKey, showStat = 'ALL', onCompare, onSelectionChange }) => {
  const { settings, getThemeColors } = useSettings();
  const colors = getThemeColors();
  const accentBg = colors.bg;
  const accentText = colors.text;

  const defaultSort = defaultSortByPosition[position]?.toLowerCase() as SortKey || 'gp';

  const [data, setData] = useState<PlayerStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTooltip, setActiveTooltip] = useState<{ text: string; rect: DOMRect } | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'asc' | 'desc' }>({
    key: defaultSort,
    direction: 'desc'
  });
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);

  useEffect(() => {
    setSelectedPlayers([]);
  }, [season, position]);

  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(selectedPlayers);
    }
  }, [selectedPlayers, onSelectionChange]);

  const togglePlayer = (player: string) => {
    setSelectedPlayers(prev => {
      if (prev.includes(player)) return prev.filter(p => p !== player);
      if (prev.length < 2) return [...prev, player];
      return prev;
    });
  };

  const currentColumns = useMemo(() => getFootballStatColumns(season, position), [season, position]);
  const statKeys = useMemo(() => currentColumns.filter(k => k !== 'PLAYER').map(k => k.toLowerCase()), [currentColumns]);
  const columns = useMemo(() => currentColumns.map(k => ({ key: k.toLowerCase() as SortKey, label: k })), [currentColumns]);
  const gridStyle = { gridTemplateColumns: `1.4fr repeat(${statKeys.length}, 1fr)` };

  useEffect(() => {
    const controller = new AbortController();
    let alive = true;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const stats = await fetchSeasonStats(season, position, controller.signal);
        if (alive) {
          setData(stats);
        }
      } catch (err: any) {
        if (alive) {
          if (err.name === 'AbortError') return;
          setError(err.message || `Failed to load ${season} stats`);
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
  }, [season, position]);

  useEffect(() => {
    if (externalSortKey && externalSortKey !== sortConfig.key && currentColumns.map((c) => c.toLowerCase()).includes(externalSortKey.toLowerCase())) {
      setSortConfig({ key: externalSortKey as SortKey, direction: 'desc' });
    } else if (!externalSortKey) {
        setSortConfig({ key: defaultSort, direction: 'desc' });
    }
  }, [externalSortKey, position, season, defaultSort, currentColumns]);

  const sortedData = useMemo(() => {
    const sorted = [...data].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      
      const isAEmpty = aVal === undefined || aVal === null || aVal === '';
      const isBEmpty = bVal === undefined || bVal === null || bVal === '';
      
      if (isAEmpty && isBEmpty) return 0;
      if (isAEmpty) return 1;
      if (isBEmpty) return -1;

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        const val = aVal.localeCompare(bVal);
        return sortConfig.direction === 'asc' ? val : -val;
      }

      const numA = (aVal as number) || 0;
      const numB = (bVal as number) || 0;
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
    return getColumnMaxes(filteredData, statKeys as (keyof PlayerStats)[]);
  }, [filteredData, statKeys]);

  const columnAverages = useMemo(() => {
    const averages: Partial<Record<keyof PlayerStats, number>> = {};
    const validPlayers = data.filter(p => p.gp === undefined || p.gp > 0);
    const pool = validPlayers.length > 0 ? validPlayers : data;

    statKeys.forEach(key => {
      const values = pool
        .map(row => row[key] as number)
        .filter(val => typeof val === 'number' && !isNaN(val));
      if (values.length > 0) {
        averages[key] = values.reduce((a, b) => a + b, 0) / values.length;
      } else {
        averages[key] = 0;
      }
    });
    return averages;
  }, [data, statKeys]);

  const requestSort = (key: SortKey) => {
    let direction: 'asc' | 'desc' = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  const HighlightedCell = ({ value, colKey, isBold = false }: { value: number | string | undefined, colKey: keyof PlayerStats, isBold?: boolean }) => {
    const val = typeof value === 'number' ? value : 0;
    const isLeader = typeof value === 'number' && val > 0 && val === columnMaxes[colKey];
    const displayValue = value === undefined || value === null || value === '' ? '' : value;
    
    const colAvg = columnAverages[colKey] || 0;
    const hasAvg = typeof colAvg === 'number' && colAvg > 0;
    const isAboveAverage = settings.advancedAnalytics && typeof value === 'number' && value > 0 && hasAvg && value > colAvg;
    const isBelowAverage = settings.advancedAnalytics && typeof value === 'number' && hasAvg && value < colAvg;
    
    return (
      <div className="flex items-center justify-center h-full gap-0.5">
        <span className={`
          tabular-nums transition-all duration-300
          ${isLeader ? `px-2 py-0.5 rounded-full bg-emerald-500/10 font-black text-emerald-600 dark:text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.15)]` : (isBold ? 'font-black' : 'font-bold')}
        `}>
          {displayValue}
        </span>
        {isAboveAverage && !isLeader && (
          <svg className="w-2.5 h-2.5 text-emerald-500 dark:text-emerald-400 shrink-0 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19V5M5 12l7-7 7 7"/>
          </svg>
        )}
        {isAboveAverage && isLeader && (
          <svg className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400 shrink-0 opacity-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19V5M5 12l7-7 7 7"/>
          </svg>
        )}
        {isBelowAverage && value !== 0 && (
          <svg className="w-2.5 h-2.5 text-red-500/70 dark:text-red-400/70 shrink-0 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M19 12l-7 7-7-7"/>
          </svg>
        )}
      </div>
    );
  };

  const statusMessage = getStatStatusMessage(season, position);

  if (statusMessage) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center px-4">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 dark:text-zinc-600">
          {statusMessage}
        </span>
      </div>
    );
  }

  if (loading) {
    return <TableSkeleton columnsCount={statKeys.length} />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 dark:text-zinc-600">
          No stats found
        </span>
      </div>
    );
  }

  const containerClasses = isEmbedded 
    ? "md:space-y-4 w-full overflow-x-hidden touch-pan-y" 
    : "animate-page-enter pt-2 md:space-y-6 pb-20 w-full overflow-x-hidden touch-pan-y";

  const StatGroup = ({ label, value }: { label: string, value: string | number }) => (
    <div className="flex items-center gap-1.5 whitespace-nowrap">
      <span className="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-tight">{label}</span>
      <span className="text-xs font-black text-zinc-900 dark:text-zinc-100 tabular-nums">{value}</span>
    </div>
  );

  return (
    <div className={containerClasses}>
      {/* DESKTOP COMPARE BUTTON (HIDDEN) */}

      {/* DESKTOP TABLE */}
      <div className="hidden md:block bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-sm">
        <div className="w-full overflow-x-auto overflow-y-auto max-h-[70vh] no-scrollbar">
          <div className="min-w-full">
            <div className="sticky top-0 z-20 grid px-4 py-4 bg-zinc-50/95 dark:bg-zinc-800/95 backdrop-blur-sm border-b border-zinc-100 dark:border-zinc-800 text-[8px] lg:text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest shadow-[0_2px_4px_rgba(0,0,0,0.02)]" style={gridStyle}>
              {columns.map((col) => {
                const tooltipText = getHeaderLabel(col.label, position);
                const isBoldCol = BOLD_COLUMNS.includes(col.label.toUpperCase());
                return (
                  <div 
                    key={col.key} 
                    className={`flex items-center ${col.key !== 'player' ? 'justify-center' : 'justify-start'} ${isBoldCol ? 'font-black text-zinc-600 dark:text-zinc-300' : ''}`}
                    onMouseEnter={(e) => {
                      if (tooltipText) {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setActiveTooltip({ text: tooltipText, rect });
                      }
                    }}
                    onMouseLeave={() => setActiveTooltip(null)}
                  >
                    <button
                      onClick={() => requestSort(col.key)}
                      className={`flex items-center gap-1 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors`}
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
                  </div>
                );
              })}
            </div>
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
              {filteredData.length > 0 ? (
                filteredData.map((row, idx) => (
                  <div key={idx} onClick={() => togglePlayer(row.player)} className={`grid px-4 py-3.5 items-center hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors cursor-pointer select-none ${selectedPlayers.includes(row.player) ? 'bg-zinc-50 dark:bg-zinc-800' : ''}`} style={gridStyle}>
                    <div className="flex items-center gap-2.5 pr-2 truncate">
                       <div className={`flex-none shrink-0 w-[14px] h-[14px] rounded-[4px] border flex items-center justify-center transition-colors ${selectedPlayers.includes(row.player) ? 'bg-zinc-900 border-zinc-900 dark:bg-zinc-100 dark:border-zinc-100' : 'bg-white border-zinc-300 dark:bg-zinc-900 dark:border-zinc-700'}`}>
                         {selectedPlayers.includes(row.player) && (
                            <svg className="w-2.5 h-2.5 text-white dark:text-zinc-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                         )}
                       </div>
                       <div className="text-[11px] lg:text-[13px] font-bold text-zinc-900 dark:text-zinc-100 truncate">{row.player}</div>
                    </div>
                    {statKeys.map(k => (
                      <div key={k} className="text-[11px] lg:text-[13px] text-zinc-500 dark:text-zinc-400 text-center tabular-nums">
                        <HighlightedCell value={row[k]} colKey={k as keyof PlayerStats} isBold={BOLD_COLUMNS.includes(k.toUpperCase())} />
                      </div>
                    ))}
                  </div>
                ))
              ) : (
                <div className="py-24 text-center">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 dark:text-zinc-600">
                    {searchQuery ? `No players found matching "${searchQuery}"` : "No stats found"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* DESKTOP TABLE KEY NOTE */}
      <div className="hidden md:flex items-center justify-end gap-4 mt-2 px-6 text-[10px] text-zinc-400 dark:text-zinc-500 font-bold select-none">
        {!settings.advancedAnalytics && (
          <span className="mr-auto text-[10px] text-zinc-400/60 dark:text-zinc-500/50 font-bold lowercase tracking-wider">
            enable advanced analytics in settings
          </span>
        )}
        <span className="flex items-center gap-1">
          <svg className="w-2.5 h-2.5 text-emerald-500 dark:text-emerald-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19V5M5 12l7-7 7 7"/>
          </svg>
          above league average
        </span>
        <span className="flex items-center gap-1">
          <svg className="w-2.5 h-2.5 text-red-500/70 dark:text-red-400/70 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M19 12l-7 7-7-7"/>
          </svg>
          below league average
        </span>
      </div>

      {/* MOBILE LIST */}
      <div className="md:hidden space-y-2 px-2">
        <div className="text-center pb-2 pt-1 text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 select-none">
          use desktop site for stats pro view
        </div>
        {filteredData.length > 0 ? (
          filteredData.map((row, idx) => {
            if (showStat !== 'ALL') {
              const val = row[showStat as keyof PlayerStats];
              const label = showStat.toUpperCase();
              
              return (
                <div key={idx} className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-xl p-3 shadow-sm flex items-center justify-between">
                  <span className="text-sm font-black text-zinc-900 dark:text-zinc-100 truncate pr-4">{row.player}</span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-tight">{label}</span>
                    <span className={`text-sm font-black tabular-nums text-zinc-900 dark:text-zinc-100`}>
                      {val !== undefined ? val : '—'}
                    </span>
                  </div>
                </div>
              );
            }

            const rawMobileCols = getMobileFootballStatColumns(season, position);
            // Fallback to desktop columns if not defined (though our config has almost all)
            const mobileCols = rawMobileCols.length > 0 
                ? rawMobileCols.map(k => k.toLowerCase()) 
                : statKeys.filter(k => k !== 'gp').slice(0, 6);

            const renderMobileStats = () => {
              const renderStat = (k: string) => {
                const val = row[k];
                return <StatGroup key={k} label={k.toUpperCase()} value={val || 0} />;
              };

              if (mobileCols.length === 6) {
                return (
                  <div className="grid grid-cols-3 gap-y-3">
                    {mobileCols.map(k => renderStat(k))}
                  </div>
                );
              } else if (mobileCols.length === 5) {
                return (
                  <div className="flex flex-col gap-y-3">
                    <div className="grid grid-cols-3 gap-x-2">
                      {mobileCols.slice(0, 3).map(k => renderStat(k))}
                    </div>
                    <div className="grid grid-cols-2 gap-x-2 max-w-[66%] mx-auto w-full">
                      {mobileCols.slice(3, 5).map(k => (
                        <div key={k} className="flex justify-center">
                          {renderStat(k)}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              } else if (mobileCols.length === 4) {
                return (
                  <div className="grid grid-cols-2 gap-y-3 max-w-[80%] mx-auto w-full">
                     {mobileCols.map(k => (
                       <div key={k} className="flex justify-center">
                         {renderStat(k)}
                       </div>
                     ))}
                  </div>
                );
              } else {
                return (
                  <div className="grid grid-cols-3 gap-y-3">
                    {mobileCols.slice(0, 3).map(k => renderStat(k))}
                  </div>
                );
              }
            };

            return (
              <div key={idx} className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3 border-b border-zinc-50 dark:border-zinc-900/50 pb-2 gap-2">
                  <h4 className="text-sm font-black text-zinc-900 dark:text-zinc-100 truncate pr-4">{row.player}</h4>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">GP</span>
                    <span className="text-sm font-black text-zinc-900 dark:text-zinc-100 tabular-nums">{row.gp !== undefined ? row.gp : 0}</span>
                  </div>
                </div>
                
                {renderMobileStats()}
              </div>
            );
          })
        ) : (
          <div className="py-12 text-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-600">
              No stats found
            </span>
          </div>
        )}
      </div>
      
      {!isEmbedded && (
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 opacity-50 px-4 pt-4">
          <div className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${accentBg} animate-pulse`} />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Season {season.replace('s', '')} Registry</span>
          </div>
        </div>
      )}

      {activeTooltip && typeof document !== 'undefined' && createPortal(
        <div 
          className="pointer-events-none fixed z-[9999] transition-opacity duration-200"
          style={{ 
            top: activeTooltip.rect.top - 8,
            left: activeTooltip.rect.left + activeTooltip.rect.width / 2,
            transform: 'translate(-50%, -100%)'
          }}
        >
          <div className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-[10px] lowercase font-bold tracking-normal px-2.5 py-1 rounded-full whitespace-nowrap shadow-md border border-zinc-200 dark:border-zinc-700">
            {activeTooltip.text}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default FootballStatsTable;
