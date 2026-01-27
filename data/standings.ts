
export interface StandingRow {
  rank: number;
  team: string;
  w: number | string;
  l: number | string;
  gb: number | string;
}

export const westernStandings: StandingRow[] = [
  { rank: 1, team: 'Oklahoma City Thunder', w: 10, l: 2, gb: '-' },
  { rank: 2, team: 'Minnesota Timberwolves', w: 9, l: 3, gb: '1.0' },
  { rank: 3, team: 'Los Angeles Clippers', w: 8, l: 4, gb: '2.0' },
  { rank: 4, team: 'Denver Nuggets', w: 7, l: 5, gb: '3.0' },
  { rank: 5, team: 'Dallas Mavericks', w: 6, l: 6, gb: '4.0' },
  { rank: 6, team: 'Los Angeles Lakers', w: 4, l: 8, gb: '6.0' },
  { rank: 7, team: 'Memphis Grizzlies', w: 2, l: 10, gb: '8.0' },
];

export const easternStandings: StandingRow[] = [
  { rank: 1, team: 'Miami Heat', w: 11, l: 1, gb: '-' },
  { rank: 2, team: 'Milwaukee Bucks', w: 9, l: 3, gb: '2.0' },
  { rank: 3, team: 'Boston Celtics', w: 8, l: 4, gb: '3.0' },
  { rank: 4, team: 'Chicago Bulls', w: 7, l: 5, gb: '4.0' },
  { rank: 5, team: 'Toronto Raptors', w: 5, l: 7, gb: '6.0' },
  { rank: 6, team: 'Orlando Magic', w: 4, l: 8, gb: '7.0' },
  { rank: 7, team: 'Atlanta Hawks', w: 2, l: 10, gb: '9.0' },
];

export const teamShortNames: Record<string, string> = {
  'Oklahoma City Thunder': 'Thunder',
  'Los Angeles Lakers': 'Lakers',
  'Los Angeles Clippers': 'Clippers',
  'Minnesota Timberwolves': 'Timberwolves',
  'Denver Nuggets': 'Nuggets',
  'Dallas Mavericks': 'Mavericks',
  'Miami Heat': 'Heat',
  'Chicago Bulls': 'Bulls',
  'Boston Celtics': 'Celtics',
  'Milwaukee Bucks': 'Bucks',
  'Toronto Raptors': 'Raptors',
  'Orlando Magic': 'Magic',
  'Memphis Grizzlies': 'Grizzlies',
  'Atlanta Hawks': 'Hawks'
};
