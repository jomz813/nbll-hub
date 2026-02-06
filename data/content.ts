
export interface TabItem {
  label: string;
  category: string;
}

export interface TabContent {
  title: string;
  description: string;
  items: TabItem[];
}

export const contentMap: Record<string, TabContent> = {
  schedule: {
    title: 'empty page',
    description: '',
    items: [] 
  },
  stats: {
    title: 'player statistics',
    description: '',
    items: []
  },
  legacy: {
    title: 'legacy vault',
    description: "",
    items: [
      { label: 'Hall of Fame', category: 'Greats' },
      { label: 'Records', category: 'History' }
    ]
  },
  'hall-of-fame': {
    title: 'hall of fame',
    description: '',
    items: []
  },
  'league-history': {
    title: 'history',
    description: "",
    items: []
  },
  rules: {
    title: 'Rules',
    description: '',
    items: [] 
  },
  more: {
    title: 'Discover More',
    description: '',
    items: [
      { label: 'Achievements', category: 'Legacy' },
      { label: 'Milestones', category: 'Legacy' },
      { label: 'Leaders', category: 'Season' },
      { label: 'History', category: 'Archives' },
      { label: 'Rules', category: 'Official' },
      { label: 'Credits', category: 'Team' }
    ]
  },
  'partner-hub': {
    title: 'Partner Hub',
    description: '',
    items: [
      { label: 'Sponsor Portal', category: 'Network' },
      { label: 'Brand Assets', category: 'Media' }
    ]
  },
  'credits': {
    title: 'credits',
    description: '',
    items: []
  },
  records: {
    title: 'league records',
    description: '',
    items: []
  },
  compare: {
    title: 'Player Comparison',
    description: 'Reference-style side-by-side stats.',
    items: []
  }
};