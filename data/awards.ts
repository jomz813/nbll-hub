import Papa from 'papaparse';

export const AWARDS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTQrkbQdWxK9-XyDweqAu7xwj1V0IkXftFtue7RKUwdoj1wYxDURAGI_IlkXMnc07AArP4ptehQc9Az/pub?gid=0&single=true&output=csv';

export interface AwardsData {
  categories: string[];
  byPlayer: Record<string, Record<string, any>>;
}

let awardsCache: AwardsData | null = null;

export const fetchAwards = async (signal?: AbortSignal): Promise<AwardsData> => {
  if (awardsCache) return awardsCache;

  const response = await fetch(AWARDS_CSV_URL, { signal });
  if (!response.ok) throw new Error('Failed to fetch awards data');
  const csvData = await response.text();

  return new Promise((resolve, reject) => {
    Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data.length === 0) {
          resolve({ categories: [], byPlayer: {} });
          return;
        }

        const headers = results.meta.fields || [];
        // Find player column: "PLAYER", "USERNAME", or the first column
        const playerCol = headers.find(h => {
          const norm = h.toUpperCase().trim();
          return norm === 'PLAYER' || norm === 'USERNAME';
        }) || headers[0];

        const categories = headers.filter(h => h !== playerCol);
        const byPlayer: Record<string, Record<string, any>> = {};

        results.data.forEach((row: any) => {
          const playerName = String(row[playerCol] || '').trim().toLowerCase();
          if (!playerName) return;

          const playerAwards: Record<string, any> = {};
          categories.forEach(cat => {
            playerAwards[cat] = row[cat];
          });

          byPlayer[playerName] = playerAwards;
        });

        const data = { categories, byPlayer };
        awardsCache = data;
        resolve(data);
      },
      error: reject
    });
  });
};