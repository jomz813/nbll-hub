
export type AchievementCategory = 'Points' | 'Assists' | 'Rebounds' | 'Steals' | 'Averages' | 'Efficiency' | 'Legacy' | 'Value';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  requirementText: string;
  category: AchievementCategory;
  check: (stats: any, awards?: any) => boolean;
}

// Tier metadata for dynamic generation
export const SEASON_TIERS = [
  { suffix: 'Starter', percentile: 0.50, desc: 'Established yourself as a rotation mainstay.' },
  { suffix: 'Standout', percentile: 0.75, desc: 'A significant contributor making an impact nightly.' },
  { suffix: 'Elite', percentile: 0.90, desc: 'One of the top statistical performers in the league.' },
  { suffix: 'Historic', percentile: 0.97, desc: 'A season performance that will be remembered.' }
];

export const METRIC_LABELS: Record<string, string> = {
  pts: 'PTS',
  ast: 'AST',
  reb: 'REB',
  stl: 'STL',
  gp: 'GP',
  ppg: 'PPG',
  apg: 'APG',
  rpg: 'RPG',
  spg: 'SPG',
  eff: 'EFF',
  off: 'OFF',
  def: 'DEF'
};

export const CATEGORY_MAP: Record<string, AchievementCategory> = {
  pts: 'Points',
  ast: 'Assists',
  reb: 'Rebounds',
  stl: 'Steals',
  gp: 'Averages',
  ppg: 'Averages',
  apg: 'Averages',
  rpg: 'Averages',
  spg: 'Averages',
  eff: 'Efficiency',
  off: 'Efficiency',
  def: 'Efficiency'
};
