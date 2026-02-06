
import Papa from 'papaparse';

export const S11_STATS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ40oM4VxQKSbZoD6NQXO3vb9GYVP6bQvZczPVAYaw-6lcLsGlWIdEhJUshk2lOe5wp2flh3QsLP4As/pub?gid=0&single=true&output=csv';

export type S11Row = {
  player: string;
  gp: number;
  pts: number;
  ast: number;
  reb: number;
  stl: number;
  eff: number;
  ppg: number;
  apg: number;
  rpg: number;
  spg: number;
};

export const normalizeKey = (k: string) => {
  return k.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
};

export const toNumber = (v: any): number => {
  if (typeof v === 'number') return v;
  if (typeof v === 'string') {
    const s = v.trim().replace(/,/g, '').replace(/\s/g, '');
    const cleanS = s.replace(/[^0-9.-]/g, '');
    const val = parseFloat(cleanS);
    return isNaN(val) ? 0 : val;
  }
  return 0;
};

export const mapRow = (raw: Record<string, any>): S11Row => {
  const findValue = (keys: string[]) => {
    const key = Object.keys(raw).find(k => keys.includes(normalizeKey(k)));
    if (!key) return 0;
    return toNumber(raw[key]);
  };

  const findPlayer = () => {
    const key = Object.keys(raw).find(k => normalizeKey(k) === 'player');
    return key ? String(raw[key]).trim() : '';
  };

  const gp = findValue(['gp', 'gamesplayed', 'games']);
  const pts = findValue(['pts', 'points']);
  const ast = findValue(['ast', 'assists']);
  const reb = findValue(['reb', 'rebounds']);
  const stl = findValue(['stl', 'steals']);
  const eff = findValue(['eff', 'efficiency']);

  return {
    player: findPlayer(),
    gp,
    pts,
    ast,
    reb,
    stl,
    eff,
    ppg: gp > 0 ? Number((pts / gp).toFixed(1)) : 0.0,
    apg: gp > 0 ? Number((ast / gp).toFixed(1)) : 0.0,
    rpg: gp > 0 ? Number((reb / gp).toFixed(1)) : 0.0,
    spg: gp > 0 ? Number((stl / gp).toFixed(1)) : 0.0,
  };
};

export const fetchS11Stats = async (opts?: { signal?: AbortSignal }): Promise<S11Row[]> => {
  try {
    const response = await fetch(S11_STATS_CSV_URL, { signal: opts?.signal });
    if (!response.ok) throw new Error('Failed to fetch S11 stats');
    const csvData = await response.text();

    return new Promise((resolve, reject) => {
      const parseFn = (Papa as any).parse || (Papa as any).default?.parse || Papa;

      if (typeof parseFn !== 'function') {
        reject(new Error('PapaParse not loaded correctly'));
        return;
      }

      parseFn(csvData, {
        header: true,
        dynamicTyping: false,
        skipEmptyLines: true,
        complete: (results: any) => {
          const rows = results.data
            .map(mapRow)
            .filter((row: S11Row) => {
              const p = row.player.toLowerCase().trim();
              return (
                p !== '' && 
                p !== 'total values' && 
                p !== 'highest value in each col.'
              );
            });
          
          rows.sort((a: S11Row, b: S11Row) => b.pts - a.pts);
          resolve(rows);
        },
        error: (error: any) => {
          reject(error);
        }
      });
    });
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw err;
    }
    console.error('S11 Stats Fetch Error:', err);
    throw err;
  }
};
