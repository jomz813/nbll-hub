import Papa from 'papaparse';

export const S10_STATS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTDYSvY-GvrxjLiRr_HHiY1pFurZxa86Oeg2yE8FiURFwmjpFO7xd1BJI27DJQCodpYGSoxRO3g95cd/pub?gid=0&single=true&output=csv';

export type S10Row = {
  player: string;
  pts: number;
  ast: number;
  reb: number;
  stl: number;
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

export const mapRow = (raw: Record<string, any>): S10Row => {
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
  };
};

export const fetchS10Stats = async (opts?: { signal?: AbortSignal }): Promise<S10Row[]> => {
  try {
    const response = await fetch(S10_STATS_CSV_URL, { signal: opts?.signal });
    if (!response.ok) throw new Error('Failed to fetch S10 stats');
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
            .filter((row: S10Row) => {
              const p = row.player.toLowerCase().trim();
              return (
                p !== '' && 
                p !== 'total values' && 
                p !== 'highest value in each col.'
              );
            });
          
          rows.sort((a: S10Row, b: S10Row) => b.pts - a.pts);
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
    console.error('S10 Stats Fetch Error:', err);
    throw err;
  }
};