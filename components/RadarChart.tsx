import React from 'react';

interface RadarChartProps {
  player1: any;
  player2: any;
  player1Name: string;
  player2Name: string;
  fields: string[];
  maxes: Partial<Record<string, number>>;
  themeHex: string;
}

const RadarChart: React.FC<RadarChartProps> = ({ player1, player2, player1Name, player2Name, fields, maxes, themeHex }) => {
  if (!fields.length || (!player1 && !player2)) return null;

  const size = 260; // Base size
  const center = size / 2;
  const radius = center - 45; // Leave room for labels
  const levels = 4;

  const getPosition = (value: number, max: number, index: number, total: number) => {
    const scale = max > 0 ? Math.max(0, Math.min(1, value / max)) : 0;
    const r = radius * scale;
    // Start at top (-PI/2), go clockwise
    const angle = -Math.PI / 2 + (2 * Math.PI * index) / total;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle)
    };
  };

  const getPath = (player: any) => {
    if (!player) return '';
    return fields.map((f, i) => {
      const val = player[f.toLowerCase()] || 0;
      const max = maxes[f.toLowerCase()] || 1;
      const { x, y } = getPosition(val, max, i, fields.length);
      return `${x},${y}`;
    }).join(' L ') + ' Z';
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-[320px] mx-auto flex justify-center items-center isolate relative aspect-square text-zinc-900 dark:text-zinc-100 mb-4">
        <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
          {/* Background Grids */}
          {Array.from({ length: levels }).map((_, level) => {
            const rLine = (radius / levels) * (level + 1);
            const points = fields.map((_, i) => {
              const angle = -Math.PI / 2 + (2 * Math.PI * i) / fields.length;
              const x = center + rLine * Math.cos(angle);
              const y = center + rLine * Math.sin(angle);
              return `${x},${y}`;
            }).join(' L ') + ' Z';
            
            return (
              <path key={level} d={`M ${points}`} fill="none" stroke="currentColor" strokeWidth="1" className="text-zinc-200 dark:text-zinc-800" />
            );
          })}

          {/* Axis Lines & Labels */}
          {fields.map((f, i) => {
            const angle = -Math.PI / 2 + (2 * Math.PI * i) / fields.length;
            const x = center + radius * Math.cos(angle);
            const y = center + radius * Math.sin(angle);
            
            // Label pos slightly further out
            const lx = center + (radius + 20) * Math.cos(angle);
            const ly = center + (radius + 20) * Math.sin(angle);

            // Adjust text anchor
            let textAnchor: "middle" | "start" | "end" = "middle";
            if (Math.abs(Math.cos(angle)) > 0.1) {
              textAnchor = Math.cos(angle) > 0 ? "start" : "end";
            }
            let dominantBaseline: "middle" | "hanging" | "alphabetic" = "middle";
            if (Math.abs(Math.sin(angle)) > 0.1) {
              dominantBaseline = Math.sin(angle) > 0 ? "hanging" : "alphabetic";
            }

            return (
              <g key={f}>
                <line 
                  x1={center} y1={center}
                  x2={x} y2={y}
                  stroke="currentColor" 
                  strokeWidth="1" 
                  className="text-zinc-200 dark:text-zinc-800"
                />
                <text
                  x={lx}
                  y={ly}
                  textAnchor={textAnchor}
                  dominantBaseline={dominantBaseline}
                  className="text-[9px] font-black uppercase tracking-widest fill-zinc-500 dark:fill-zinc-400 select-none"
                >
                  {f}
                </text>
              </g>
            );
          })}

          {/* Player 1 Path */}
          {player1 && (
            <path
              d={`M ${getPath(player1)}`}
              fill={themeHex}
              fillOpacity="0.4"
              stroke={themeHex}
              strokeWidth="2.5"
              strokeLinejoin="round"
              className="transition-all duration-500 hover:fill-opacity-60 z-10 hover:stroke-[3.5px]"
            />
          )}

          {/* Player 2 Path (Gray/Contrast) */}
          {player2 && (
            <path
              d={`M ${getPath(player2)}`}
              fill="currentColor"
              fillOpacity="0.15"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinejoin="round"
              className="text-zinc-900 dark:text-zinc-50 transition-all duration-500 hover:fill-opacity-30 z-20 hover:stroke-[3.5px]"
            />
          )}
        </svg>
      </div>

      <div className="flex items-center justify-center gap-6 text-[10px] uppercase tracking-widest font-black select-none">
        {player1Name && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm opacity-80" style={{ backgroundColor: themeHex }}></div>
            <span className="text-zinc-900 dark:text-zinc-100">{player1Name}</span>
          </div>
        )}
        {player2Name && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-zinc-900/30 dark:bg-zinc-100/30"></div>
            <span className="text-zinc-900 dark:text-zinc-100">{player2Name}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default RadarChart;
