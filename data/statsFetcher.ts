
import Papa from 'papaparse';

export const STAT_SOURCES = {
  'all-time': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQpbI0iBshMjG0A-ilbu2Tc0OEJuHGYZlIjH9e2mPCIGX2vGp6HfMPVBsglH1givd9AGTWRKxaH0_Ek/pub?gid=329257056&single=true&output=csv',
  's14': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRJOo3GZSlEW7E4Mqmn7-ktNP7zQKM4djiwi0_4ptjmZKn2imY7FihYWln4kV6_MGAFi2asPuCx77F9/pub?gid=0&single=true&output=csv',
  's13': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSXs54PAbDnp_PgxYIigdldr72bC0Pm3BSYzm5f7acohgjTv342vA0n87GsonKu82P2A3mg6x45v7iV/pub?gid=0&single=true&output=csv',
  's12': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRt0_--RlgbIXxVLV67Qi1q50iM9apZoG7aaXc-HHYCDWSX55EcsA27u9-pNqnUJqRWart-DuyEmkuF/pub?gid=0&single=true&output=csv',
  's11': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ40oM4VxQKSbZoD6NQXO3vb9GYVP6bQvZczPVAYaw-6lcLsGlWIdEhJUshk2lOe5wp2flh3QsLP4As/pub?gid=0&single=true&output=csv',
  's10': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTDYSvY-GvrxjLiRr_HHiY1pFurZxa86Oeg2yE8FiURFwmjpFO7xd1BJI27DJQCodpYGSoxRO3g95cd/pub?gid=0&single=true&output=csv'
};

export type SeasonID = keyof typeof STAT_SOURCES;

export interface PlayerStats {
  player: string;
  gp: number;
  pts: number;
  ast: number;
  reb: number;
  stl: number;
  eff: number;
  off: number;
  def: number;
  // Added val property for all-time value analysis as seen in database
  val?: number;
  // Per game fields (calculated)
  ppg?: number;
  apg?: number;
  rpg?: number;
  spg?: number;
}

const cache: Record<string, PlayerStats[]> = {};

const normalizeKey = (k: string) => k.toLowerCase().trim().replace(/[^a-z0-9]/g, '');

const toNumber = (v: any): number => {
  if (typeof v === 'number') return v;
  if (typeof v === 'string') {
    const clean = v.trim().replace(/,/g, '').replace(/\s/g, '').replace(/[^0-9.-]/g, '');
    const val = parseFloat(clean);
    return isNaN(val) ? 0 : val;
  }
  return 0;
};

/**
 * Specialized parser for currency strings like "$74.4M", "$10K", etc.
 * Replicated from allTimeStats.ts logic to maintain consistency across unified fetcher.
 */
const parseValAav = (v: any): number => {
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

export const fetchSeasonStats = async (season: SeasonID, signal?: AbortSignal): Promise<PlayerStats[]> => {
  if (cache[season]) return cache[season];

  const response = await fetch(STAT_SOURCES[season], { signal });
  if (!response.ok) throw new Error(`Failed to fetch ${season} stats`);
  const csvData = await response.text();

  return new Promise((resolve, reject) => {
    Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const stats = results.data
          .map((raw: any) => {
            const findValue = (keys: string[], parser = toNumber) => {
              const key = Object.keys(raw).find(k => keys.includes(normalizeKey(k)));
              return key ? parser(raw[key]) : 0;
            };

            const playerKey = Object.keys(raw).find(k => normalizeKey(k) === 'player');
            const player = playerKey ? String(raw[playerKey]).trim() : '';
            
            const s: PlayerStats = {
              player,
              gp: findValue(['gp', 'gamesplayed', 'games']),
              pts: findValue(['pts', 'points']),
              ast: findValue(['ast', 'assists']),
              reb: findValue(['reb', 'rebounds']),
              stl: findValue(['stl', 'steals']),
              eff: findValue(['eff', 'efficiency']),
              off: findValue(['off', 'offensiveimpact', 'oimp', 'o']),
              def: findValue(['def', 'defensiveimpact', 'dimp', 'd']),
              // Added mapping for market value / aav primarily used in all-time datasets
              val: findValue(['valaav', 'val', 'value'], parseValAav),
            };

            // Calculate averages if GP exists
            if (s.gp > 0) {
              s.ppg = Number((s.pts / s.gp).toFixed(1));
              s.apg = Number((s.ast / s.gp).toFixed(1));
              s.rpg = Number((s.reb / s.gp).toFixed(1));
              s.spg = Number((s.stl / s.gp).toFixed(1));
            }

            return s;
          })
          .filter(s => s.player && !['total values', 'highest value in each col.'].includes(s.player.toLowerCase()));
        
        cache[season] = stats;
        resolve(stats);
      },
      error: reject
    });
  });
};
