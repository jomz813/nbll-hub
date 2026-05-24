
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
    title: 'league history',
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
      { label: 'awards', category: 'Legacy' },
      { label: 'gallery', category: 'Media' },
      { label: 'history', category: 'Archives' },
      { label: 'rules', category: 'Official' }
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
  records: {
    title: 'league records',
    description: '',
    items: []
  },
  compare: {
    title: 'Player Comparison',
    description: 'Reference-style side-by-side stats.',
    items: []
  },
  awards: {
    title: 'award history',
    description: '',
    items: []
  },
  gallery: {
    title: 'gfx gallery',
    description: '',
    items: []
  }
};
