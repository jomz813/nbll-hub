
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
    awards: ['6x CHAMP', '1x MVP', '2x FMVP', '3x OPOTY', '1x ROTY', '4x AS', '7x POTS', '25x+ POTG', '13x DPOTG'],
    stats: '2,332 PTS • 351 AST • 139 REB • 180 STL'
  },
  { 
    name: 'Tend',
    image: '/hof/tend.gif',
    awards: ['2x CHAMP', '2x FMVP', '1x ROTY', '1x MIP', '3x AS', '2x RS', '2x POTS', '15x+ POTG', '15x+ DPOTG'],
    stats: '1,805 PTS • 1,012 AST • 224 REB • 181 STL'
  },
  { 
    name: 'Packed',
    image: '/hof/packed2.gif',
    awards: ['2x CHAMP', '1x FMVP', '4x AS', '25x+ POTG', '3x DPOTG'],
    stats: '3,413 PTS • 199 AST • 180 REB • 149 STL'
  },
  { 
    name: 'Marsh',
    image: '/hof/marsh2.gif',
    awards: ['2x CHAMP', '1x MVP', '1x FMVP', '1x DPOTY', '1x POTS', '15x+ DPOTG'],
    stats: '2,527 PTS • 1,108 AST • 191 REB • 441 STL'
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
    stats: '481 PTS • 672 AST • 151 REB • 180 STL'
  },
  { 
    name: 'Rah',
    image: '/hof/rah.gif',
    awards: ['2x CHAMP', '1x MVP', '1x FMVP', '4x AS', '2x RS', '7x POTS', '25x+ POTG', '15x+ DPOTG'],
    stats: '3,271 PTS • 285 AST • 297 REB • 343 STL'
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
    stats: '4,556 PTS • 894 AST • 227 REB • 254 STL'
  },
  { 
    name: 'Polar',
    image: '/hof/polar.gif',
    awards: ['4x CHAMP', '1x DPOTY', '2x 1st Team','4x AS', '1x POTG', '20x+ DPOTG'],
    stats: '487 PTS • 1,028 AST • 155 REB • 187 STL'
  },
  { 
    name: 'Aim',
    image: '/hof/aim.gif',
    awards: ['2x CHAMP', '2x FMVP', '1x MIP', '1x AS', '4x POTS', '25x+ POTG', '7x DPOTG' ],
    stats: '2,563 PTS • 312 AST • 126 REB • 128 STL'
  },
  { 
    name: 'Cam',
    image: '/hof/cam.gif',
    awards: ['1x CHAMP', '1x AS', '4x RS', '2x POTS', '1x ECF MVP', '21x POTG', '7x DPOTG' ],
    stats: '1,933 PTS • 502 AST • 197 REB • 128 STL'
  },
];
