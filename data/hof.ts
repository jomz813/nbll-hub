
export interface HOFMember {
  name: string;
  image?: string;
  awards?: string[];
  stats?: string;
}

export const hallOfFameMembers: HOFMember[] = [
  { 
    name: 'Pansho',
    image: '/hof/pansho.gif',
    awards: ['HOF', '5x CHAMP', '1x MVP', '2x FMVP', '3x OPOTY', '1x ROTY', '4x AS', '7x POTS', '25x+ POTG', '13x DPOTG'],
    stats: '2,278 PTS • 341 AST • 134 REB • 177 STL'
  },
  { 
    name: 'Tend',
    image: '/hof/tend.gif',
    awards: ['HOF', '2x CHAMP', '2x FMVP', '1x ROTY', '1x MIP', '3x AS', '2x RS', '2x POTS', '15x+ POTG', '15x+ DPOTG'],
    stats: '1,712 PTS • 745 AST • 192 REB • 140 STL'
  },
  { 
    name: 'Packed',
    image: '/hof/packed2.gif',
    awards: ['HOF', '2x CHAMP', '1x FMVP', '4x AS', '25x+ POTG', '3x DPOTG'],
    stats: '2,784 PTS • 153 AST • 140 REB • 126 STL'
  },
  { 
    name: 'Marsh',
    image: '/hof/marsh2.gif',
    awards: ['HOF', '2x CHAMP', '1x MVP', '1x FMVP', '1x DPOTY', '1x POTS', '15x+ DPOTG'],
    stats: '1,712 PTS • 745 AST • 192 REB • 140 STL'
  },
  { 
    name: 'Dannygreen',
    image: '/hof/dannygreen.gif',
    awards: ['HOF', '1x CHAMP', '1x FMVP', '2x AS', '15x+ POTG', '7x DPOTG'],
    stats: '1,007 PTS • 674 AST • 145 REB • 132 STL'
  },
  { 
    name: '1luv',
    image: '/hof/1luv.gif',
    awards: ['HOF', '3x CHAMP', '4x AS', '2x POTG', '15x+ DPOTG'],
    stats: '351 PTS • 479 AST • 106 REB • 113 STL'
  },
  { 
    name: 'Rah',
    image: '/hof/rah.gif',
    awards: ['HOF', '2x CHAMP', '1x FMVP', '4x AS', '2x RS', '7x POTS', '25x+ POTG', '15x+ DPOTG'],
    stats: '1,900 PTS • 194 AST • 183 REB • 239 STL'
  },
  { 
    name: 'Dre',
    image: '/hof/dre2.gif',
    awards: ['HOF', '2x CHAMP', '1x 5MOTY', '1x MIP', '3x AS', '2x RS', '1x POTS', '19x POTG', '5x DPOTG', '1X VEINY DIH'],
    stats: '2,076 PTS • 169 AST • 111 REB • 74 STL'
  },
  { 
    name: 'Soulz',
    image: '/hof/soulz.gif',
    awards: ['HOF', '2x CHAMP', '1x DPOTY', '3x AS', '3x RS', '25x+ POTG', '5x DPOTG'],
    stats: '3,453 PTS • 811 AST • 191 REB • 209 STL'
  },
  { 
    name: 'TBD',
    awards: ['TBD'],
    stats: '— PTS • — AST • — REB • — STL'
  }
];
