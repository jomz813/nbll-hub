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
  val: number;
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

/**
 * Specialized parser for currency strings like "$74.4M", "$10K", etc.
 */
export const parseValAav = (v: any): number => {
  if (v === null || v === undefined || v === '') return 0;
  
  let s = String(v).trim().toUpperCase();
  // Remove currency symbol and commas
  s = s.replace('$', '').replace(/,/g, '');
  
  let multiplier = 1;
  if (s.endsWith('M')) {
    multiplier = 1_000_000;
    s = s.slice(0, -1);
  } else if (s.endsWith('K')) {
    multiplier = 1_000;
    s = s.slice(0, -1);
  } else if (s.endsWith('B')) {
    multiplier = 1_000_000_000;
    s = s.slice(0, -1);
  }
  
  const num = parseFloat(s);
  return isNaN(num) ? 0 : num * multiplier;
};

export const mapRow = (raw: Record<string, any>): AllTimeRow => {
  const findValue = (keys: string[], parser = toNumber) => {
    const key = Object.keys(raw).find(k => keys.includes(normalizeKey(k)));
    if (!key) return 0;
    return parser(raw[key]);
  };

  const findPlayer = () => {
    const key = Object.keys(raw).find(k => normalizeKey(k) === 'player');
    return key ? String(raw[key]).trim() : '';
  };

  const mapped = {
    player: findPlayer(),
    pts: findValue(['pts', 'points']),
    ast: findValue(['ast', 'assists']),
    reb: findValue(['reb', 'rebounds']),
    stl: findValue(['stl', 'steals']),
    eff: findValue(['eff', 'efficiency']),
    off: findValue(['off', 'offensiveimpact', 'oimp', 'o']),
    def: findValue(['def', 'defensiveimpact', 'dimp', 'd']),
    val: findValue(['valaav', 'val', 'value'], parseValAav),
  };

  return mapped;
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
          // One-time debug log to verify headers and VAL parsing
          if (results.data.length > 0) {
            const firstRow = results.data[0];
            const valKey = Object.keys(firstRow).find(k => normalizeKey(k) === 'valaav');
            console.debug('[AllTime Debug]', {
              headers: results.meta.fields,
              sampleRawVal: valKey ? firstRow[valKey] : 'N/A',
              sampleParsedVal: mapRow(firstRow).val
            });
          }

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