
import React from 'react';

export interface RecordItem {
  id: string;
  title: string;
  valueLabel: string;
  value: string;
  holder: string;
  context?: string;
  team?: string;
}

export interface RecordSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  items: RecordItem[];
}

export const recordsData: RecordSection[] = [
  {
    id: 'game',
    title: 'Game Records',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    items: [
      { id: 'game-pts', title: 'Most points in a game', valueLabel: 'PTS', value: '163', holder: 'Dre' },
      { id: 'game-ast', title: 'Most assists in a game', valueLabel: 'AST', value: '55', holder: 'Chicken' },
      { id: 'game-reb', title: 'Most rebounds in a game', valueLabel: 'REB', value: '11', holder: 'Rah', context: 'achieved 2x' },
      { id: 'game-stl', title: 'Most steals in a game', valueLabel: 'STL', value: '15', holder: 'Rah', context: 'achieved 2x' },
    ]
  },
  {
    id: 'season-totals',
    title: 'Season Records (Totals)',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    items: [
      { id: 'season-pts', title: 'Most points in a season', valueLabel: 'PTS', value: '689+', holder: 'Soulz', context: 'and counting' },
      { id: 'season-ast', title: 'Most assists in a season', valueLabel: 'AST', value: '253', holder: 'Marsh' },
      { id: 'season-reb', title: 'Most rebounds in a season', valueLabel: 'REB', value: '40', holder: 'Phattie' },
      { id: 'season-stl', title: 'Most steals in a season', valueLabel: 'STL', value: '74', holder: 'Marsh' },
    ]
  },
  {
    id: 'season-avgs',
    title: 'Season Records (Averages)',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    items: [
      { id: 'avg-ppg', title: 'Highest PPG in a season', valueLabel: 'PPG', value: '86.1+', holder: 'Soulz', context: 'and counting' },
      { id: 'avg-apg', title: 'Highest APG in a season', valueLabel: 'APG', value: '28.1+', holder: 'Dre', context: 'and counting' },
      { id: 'avg-rpg', title: 'Highest RPG in a season', valueLabel: 'RPG', value: '4.8+', holder: 'Rah', context: 'and counting' },
      { id: 'avg-spg', title: 'Highest SPG in a season', valueLabel: 'SPG', value: '6.5+', holder: 'Doge', context: 'and counting' },
    ]
  },
  {
    id: 'career-totals',
    title: 'Career Records (Totals)',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
        <line x1="12" y1="20" x2="12" y2="10" />
      </svg>
    ),
    items: [
      { id: 'career-pts', title: 'Most points in career', valueLabel: 'PTS', value: '4,000+', holder: 'Soulz', context: 'and counting' },
      { id: 'career-ast', title: 'Most assists in career', valueLabel: 'AST', value: '1,180+', holder: 'Ghost', context: 'and counting' },
      { id: 'career-reb', title: 'Most rebounds in career', valueLabel: 'REB', value: '254+', holder: 'Ghost', context: 'and counting' },
      { id: 'career-stl', title: 'Most steals in career', valueLabel: 'STL', value: '365', holder: 'Marsh' },
    ]
  },
  {
    id: 'career-adv',
    title: 'Career Records (Advanced)',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    items: [
      { id: 'adv-eff', title: 'Highest career efficiency', valueLabel: 'EFF', value: '381.8', holder: 'Ghost' },
      { id: 'adv-off', title: 'Highest career offensive impact', valueLabel: 'O-IMP', value: '312.2', holder: 'Ghost' },
      { id: 'adv-def', title: 'Highest career defensive impact', valueLabel: 'D-IMP', value: '87.6', holder: 'Marsh' },
    ]
  },
  {
    id: 'awards',
    title: 'Awards / Titles',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="7" />
        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
      </svg>
    ),
    items: [
      { id: 'awd-rings', title: 'Most championship rings', valueLabel: 'RINGS', value: '5x', holder: 'Pansho' },
      { id: 'awd-mvp', title: 'Most MVP awards', valueLabel: 'MVP', value: 'N/A', holder: 'N/A' },
      { id: 'awd-fmvp', title: 'Most FMVP awards', valueLabel: 'FMVP', value: '2x', holder: 'Pansho & Tend' },
      { id: 'awd-opoty', title: 'Most OPOTY awards', valueLabel: 'OPOTY', value: '3x', holder: 'Pansho' },
      { id: 'awd-dpoty', title: 'Most DPOTY awards', valueLabel: 'DPOTY', value: 'N/A', holder: 'N/A' },
    ]
  },
  {
    id: 'fun',
    title: 'Fun',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a5 5 0 0 0-5 5v2a5 5 0 0 0 10 0V7a5 5 0 0 0-5-5Z"/>
        <path d="M5 11v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8"/>
      </svg>
    ),
    items: [
      { id: 'fun-veiny', title: 'Veiniest player award', valueLabel: 'VEINS', value: '∞', holder: 'Dre' },
    ]
  }
];
