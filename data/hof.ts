
export interface HOFMember {
  name: string;
  position: string;
  image?: string;
  stats: { label: string; value: string }[];
  accolades: string[];
  username?: string;
}

export const hallOfFameMembers: HOFMember[] = [
  {
    name: "scalphunter",
    position: "QB",
    image: '/hof/scalphunter.gif',
    username: 'ff2frss',
    stats: [
      { label: "YDS", value: "26,883" },
      { label: "TD", value: "320" }
    ],
    accolades: ["2x champ", "1x mvp", "2x opoty", "1x qboty", "2x 1st Team AP"]
  },
  {
    name: "jalenramsey2199",
    position: "QB/DE/MLB",
    image: '/hof/jalenramsey2199.gif',
    username: 'aaronthekiii',
    stats: [
      { label: "YDS", value: "20,325" },
      { label: "TDS", value: "260" }
    ],
    accolades: ["2x champ", "1x mvp", "2x qboty", "2x 2nd Team AP"]
  },
  {
    name: "wary",
    position: "WR/DEEP/FS",
    image: '/hof/wary.gif',
    username: 'lalpack125',
    stats: [
      { label: "REC", value: "426" },
      { label: "YDS", value: "12,489" },
      { label: "TDS", value: "178" },
      { label: "INT", value: "65" }
    ],
    accolades: ["4x champ", "1x mvp", "2x opoty", "2x wroty", "2x dboty", "1x koty", "5x 1st Team AP"]
  },
  {
    name: "mirmir",
    position: "OL/DE",
    image: '/hof/mirmir.gif',
    username: 'Urmarshboi77',
    stats: [
      { label: "TCK", value: "121" },
      { label: "INT", value: "9" },
      { label: "SFTY", value: "15" },
      { label: "SK", value: "64" }
    ],
    accolades: ["5x champ", "1x dpoty", "4x oloty", "1x deoty", "2x koty", "6x 1st Team AP", "4x 2nd Team AP"]
  },
  {
    name: "silver",
    position: "WR/DEEP/FS/DE",
    image: '/hof/silver.gif',
    username: 'qleerinsGoon1',
    stats: [
      { label: "REC", value: "358" },
      { label: "YDS", value: "8,531" },
      { label: "TDS", value: "103" },
      { label: "TCK", value: "234" },
      { label: "INT", value: "36" },
      { label: "SK", value: "26" }
    ],
    accolades: ["1x champ", "1x mvp", "2x wroty", "1x dboty", "1x deoty", "2x koty", "5x 1st Team AP", "1x 2nd Team AP"]
  },
  {
    name: "rino",
    position: "TE/DE",
    image: '/hof/rino.gif',
    username: 'D4NNYGREEN',
    stats: [
      { label: "TCK", value: "175" },
      { label: "SK", value: "65" },
      { label: "SFTY", value: "20" }
    ],
    accolades: ["3x champ", "1x dpoy", "6x deoty", "6x 1st Team AP", "3x 2nd Team AP"]
  },
  {
    name: "rahbizzy",
    position: "STREAK/SHORT/DEEP/FS",
    image: '/hof/rahbizzy.gif',
    username: 'xr1r0',
    stats: [
      { label: "REC", value: "251" },
      { label: "YDS", value: "6,217" },
      { label: "TDS", value: "98" },
      { label: "INT", value: "55" }
    ],
    accolades: ["4x champ", "2x mvp", "1x sb mvp", "1x opoy", "1x dpoy", "1x wroty", "1x dboty", "4x 1st Team AP"]
  },
  {
    name: "missingspray",
    position: "STREAK/MLB/FS/QB",
    image: '/hof/missingspray.gif',
    username: 'alwayzbizzy41',
    stats: [
      { label: "REC", value: "124" },
      { label: "REC YDS", value: "2,485" },
      { label: "REC TDS", value: "30" },
      { label: "PASS YDS", value: "4,985" },
      { label: "PASS TDS", value: "61" },
      { label: "INT", value: "24" }
    ],
    accolades: ["3x champ", "2x dboty", "1x wroty", "1x 1st Team AP", "2x 2nd Team AP"]
  },
  {
    name: "st breezy",
    position: "STREAK/FOLD/DEEP/SHORT",
    image: '/hof/stbreezy.gif',
    username: 'aDrexelAvenue886',
    stats: [
      { label: "REC", value: "155" },
      { label: "YDS", value: "4,599" },
      { label: "TDS", value: "69" },
      { label: "INT", value: "23" }
    ],
    accolades: ["4x champ", "1x opoy", "1x wroty", "2x 1st Team AP", "1x 2nd Team AP"]
  },
  {
    name: "wx",
    position: "FOLD/STREAK/DEEP/FS",
    image: '/hof/wx.gif',
    username: 'qleerinsGoon1',
    stats: [
      { label: "REC", value: "138" },
      { label: "YDS", value: "3,410" },
      { label: "TDS", value: "49" },
      { label: "INT", value: "39" }
    ],
    accolades: ["2x wroty", "2x dboty", "4x 1st Team AP"]
  },
  {
    name: "oxy",
    position: "STREAK/FOLD/DEEP",
    image: '/hof/oxy.gif',
    username: 'polurhx',
    stats: [
      { label: "REC", value: "181" },
      { label: "YDS", value: "4,831" },
      { label: "TDS", value: "84" },
      { label: "INT", value: "31" }
    ],
    accolades: ["1x champ", "1x opoy", "1x dpoy", "1x dboty", "1x wroty", "2x 1st Team AP", "1x 2nd Team AP"]
  }
];
