import Papa from 'papaparse';

export const ALL_TIME_STATS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQpbI0iBshMjG0A-ilbu2Tc0OEJuHGYZlIjH9e2mPCIGX2vGp6HfMPVBsglH1givd9AGTWRKxaH0_Ek/pub?gid=329257056&single=true&output=csv';

export type AllTimeRow = {
  player: string;
  pts: number;
  ast: number;
  reb: number;
  stl: number;
  eff: number;
  off: number;
  def: number;
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

export const mapRow = (raw: Record<string, any>): AllTimeRow => {
  const findValue = (keys: string[]) => {
    const key = Object.keys(raw).find(k => keys.includes(normalizeKey(k)));
    if (!key) return 0;
    return toNumber(raw[key]);
  };

  const findPlayer = () => {
    const key = Object.keys(raw).find(k => normalizeKey(k) === 'player');
    return key ? String(raw[key]).trim() : '';
  };

  return {
    player: findPlayer(),
    pts: findValue(['pts', 'points']),
    ast: findValue(['ast', 'assists']),
    reb: findValue(['reb', 'rebounds']),
    stl: findValue(['stl', 'steals']),
    eff: findValue(['eff', 'efficiency']),
    off: findValue(['off', 'offensiveimpact', 'oimp', 'o']),
    def: findValue(['def', 'defensiveimpact', 'dimp', 'd']),
  };
};

export const fetchAllTimeStats = async (opts?: { signal?: AbortSignal }): Promise<AllTimeRow[]> => {
  try {
    const response = await fetch(ALL_TIME_STATS_CSV_URL, { signal: opts?.signal });
    if (!response.ok) throw new Error('Failed to fetch stats');
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
            .filter((row: AllTimeRow) => {
              const p = row.player.toLowerCase().trim();
              return (
                p !== '' && 
                p !== 'total values' && 
                p !== 'highest value in each col.'
              );
            });
          
          rows.sort((a: AllTimeRow, b: AllTimeRow) => b.pts - a.pts);
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
    console.error('All-Time Stats Fetch Error:', err);
    throw err;
  }
};