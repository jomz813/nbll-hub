
export interface HOFMember {
  name: string;
  image?: string;
  awards?: string[];
  stats?: string;
  description?: string;
}

export const hallOfFameMembers: HOFMember[] = [
  { 
    name: 'Pansho',
    image: '/hof/pansho.gif',
    awards: ['5x CHAMP', '1x MVP', '2x FMVP', '3x OPOTY', '1x ROTY', '4x AS', '7x POTS', '25x+ POTG', '13x DPOTG'],
    stats: '2,332 PTS • 351 AST • 139 REB • 180 STL',
    description: "Pansho is one of the most prolific scorers in BL history. His five rings are more than any other player’s, and his 2,250+ career points rank him 8th on the all-time scoring list. Pansho is arguably the greatest to ever touch the game. (I’m glazing)."
  },
  { 
    name: 'Tend',
    image: '/hof/tend.gif',
    awards: ['2x CHAMP', '2x FMVP', '1x ROTY', '1x MIP', '3x AS', '2x RS', '2x POTS', '15x+ POTG', '15x+ DPOTG'],
    stats: '1,757 PTS • 869 AST • 205 REB • 158 STL'
  },
  { 
    name: 'Packed',
    image: '/hof/packed2.gif',
    awards: ['2x CHAMP', '1x FMVP', '4x AS', '25x+ POTG', '3x DPOTG'],
    stats: '3,008 PTS • 170 AST • 161 REB • 136 STL'
  },
  { 
    name: 'Marsh',
    image: '/hof/marsh2.gif',
    awards: ['2x CHAMP', '1x MVP', '1x FMVP', '1x DPOTY', '1x POTS', '15x+ DPOTG'],
    stats: '2,489 PTS • 1,062 AST • 186 REB • 423 STL'
  },
  { 
    name: 'Dannygreen',
    image: '/hof/dannygreen.gif',
    awards: ['1x CHAMP', '1x FMVP', '2x AS', '15x+ POTG', '7x DPOTG'],
    stats: '1,007 PTS • 674 AST • 145 REB • 132 STL'
  },
  { 
    name: '1luv',
    image: '/hof/1luv.gif',
    awards: ['3x CHAMP', '4x AS', '2x POTG', '15x+ DPOTG'],
    stats: '463 PTS • 589 AST • 135 REB • 165 STL'
  },
  { 
    name: 'Rah',
    image: '/hof/rah.gif',
    awards: ['2x CHAMP', '1x MVP', '1x FMVP', '4x AS', '2x RS', '7x POTS', '25x+ POTG', '15x+ DPOTG'],
    stats: '2,743 PTS • 221 AST • 244 REB • 315 STL'
  },
  { 
    name: 'Dre',
    image: '/hof/dre2.gif',
    awards: ['2x CHAMP', '1x 5MOTY', '1x TMOTY', '1x MIP', '3x AS', '2x RS', '1x POTS', '19x POTG', '5x DPOTG'],
    stats: '2,286 PTS • 429 AST • 151 REB • 124 STL'
  },
  { 
    name: 'Soulz',
    image: '/hof/soulz.gif',
    awards: ['2x CHAMP', '1x OPOTY', '1x DPOTY', '3x AS', '3x RS', '25x+ POTG', '5x DPOTG'],
    stats: '4,307 PTS • 852 AST • 208 REB • 236 STL'
  },
  { 
    name: 'Polar',
    image: '/hof/polar.gif',
    awards: ['4x CHAMP', '1x DPOTY', '2x 1st Team','4x AS', '1x POTG', '20x+ DPOTG'],
    stats: '414 PTS • 769 AST • 103 REB • 125 STL'
  },
  { 
    name: 'Aim',
    image: '/hof/aim.gif',
    awards: ['2x CHAMP', '2x FMVP', '1x MIP', '1x AS', '4x POTS', '25x+ POTG', '7x DPOTG' ],
    stats: '2,461 PTS • 299 AST • 121 REB • 125 STL'
  },
];
