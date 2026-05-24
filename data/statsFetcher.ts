
import Papa from 'papaparse';

export const POSITIONS = ['QB', 'WR', 'RB', 'TE', 'DB', 'OL', 'K'] as const;
export type PositionID = typeof POSITIONS[number];

export const getAvailablePositionsForSeason = (season: SeasonID): PositionID[] => {
  const normSeason = String(season).toLowerCase() as SeasonID;
  const seasonColumns = footballStatColumnsBySeason[normSeason];
  const seasonLinks = STAT_SOURCES[normSeason];

  if (!seasonColumns) {
    return ["QB"];
  }

  const globalStatus = STAT_STATUS_MESSAGES[normSeason];
  if (typeof globalStatus === 'string') {
    return ["QB"];
  }

  const available = POSITIONS.filter((position) => {
    const seasonNum = parseInt(normSeason.replace('s', ''));
    if (seasonNum <= 10 && position === 'OL') return false;
    if (seasonNum <= 12 && position === 'TE') return false;

    if (globalStatus && typeof globalStatus !== 'string' && globalStatus[position]) {
      return false;
    }

    const columns = seasonColumns[position];
    const link = seasonLinks?.[position];

    return Array.isArray(columns) && columns.length > 0 && typeof link === "string" && link.trim().startsWith("http");
  });

  return available.length > 0 ? available : ["QB"];
};

export const SEASONS = [
  's1', 's2', 's3', 's4', 's5', 's6', 's7', 's8',
  's9', 's10', 's11', 's12', 's13', 's14', 's15', 's16'
] as const;
export type SeasonID = typeof SEASONS[number];
export type SeasonOrAllTime = SeasonID | 'all-time';

type StatSourcesMap = {
  [K in SeasonID]: Partial<Record<PositionID, string>>;
} & {
  'all-time'?: Partial<Record<PositionID, string>>;
};

// Constants for Football Categories
export const footballStatColumnsBySeason: Record<string, Partial<Record<PositionID, string[]>>> = {
  s1: {
    QB: ["PLAYER", "GP", "CMP", "ATT", "YDS", "TD", "LONG", "INT", "SK"],
    WR: ["PLAYER", "GP", "REC", "YDS", "TD", "LONG"],
    RB: ["PLAYER", "GP", "ATT", "YDS", "TD", "LONG"],
    DB: ["PLAYER", "GP", "TKL", "INT", "SFTY", "SK"],
    K: ["PLAYER", "GP", "FGM", "FGA", "LONG"]
  },
  s2: {
    QB: ["PLAYER", "GP", "CMP", "ATT", "CMP%", "YDS", "TD", "LONG", "INT", "SK"],
    WR: ["PLAYER", "GP", "REC", "YDS", "TD", "LONG", "YDS/G", "YDS/REC"],
    RB: ["PLAYER", "GP", "ATT", "YDS", "TD", "LONG", "YDS/ATT"],
    DB: ["PLAYER", "GP", "TKL", "INT", "SFTY", "SK", "TKL/G"],
    K: ["PLAYER", "GP", "FGM", "FGA", "LONG", "FG%"]
  },
  s3: { QB: [], WR: [], RB: [], DB: [], K: [] },
  s4: { QB: [], WR: [], RB: [], DB: [], K: [] },
  s5: {
    QB: ["PLAYER", "GP", "CMP", "ATT", "CMP%", "YDS", "TD", "LONG", "INT", "SK"],
    WR: ["PLAYER", "GP", "REC", "YDS", "TD", "LONG", "REC/G", "YDS/G", "YDS/REC"],
    RB: ["PLAYER", "GP", "ATT", "YDS", "TD", "LONG", "YDS/ATT"],
    DB: ["PLAYER", "GP", "TKL", "INT", "SFTY", "SK", "TKL/G"],
    K: ["PLAYER", "GP", "FGM", "FGA", "LONG", "FG%"]
  },
  s6: { QB: [], WR: [], RB: [], DB: [], K: [] },
  s7: { QB: [], WR: [], RB: [], DB: [], K: [] },
  s8: { QB: [], WR: [], RB: [], DB: [], K: [] },
  s9: {
    QB: ["PLAYER", "GP", "CMP", "ATT", "CMP%", "YDS", "TD", "LONG", "INT", "SK", "YDS/G", "YDS/ATT"],
    WR: ["PLAYER", "GP", "REC", "YDS", "TD", "LONG", "REC/G", "YDS/G", "YDS/REC"],
    RB: ["PLAYER", "GP", "ATT", "YDS", "TD", "LONG", "YDS/ATT", "YDS/G"],
    DB: ["PLAYER", "GP", "TKL", "INT", "SFTY", "SK", "TKL/G"],
    K: [] 
  },
  s10: {
    QB: ["PLAYER", "GP", "CMP", "ATT", "CMP%", "YDS", "TD", "LONG", "INT", "SK", "YDS/G", "YDS/ATT"],
    WR: ["PLAYER", "GP", "REC", "YDS", "TD", "LONG", "REC/G", "YDS/G", "YDS/REC", "TD/G"],
    RB: [],
    DB: ["PLAYER", "GP", "TKL", "INT", "SFTY", "SK", "TKL/G"],
    OL: [],
    K: []
  },
  s11: {
    QB: ["PLAYER", "GP", "CMP", "ATT", "CMP%", "YDS", "TD", "LONG", "INT", "SK", "YDS/G", "YDS/ATT", "QBR"],
    WR: ["PLAYER", "GP", "REC", "YDS", "TD", "LONG", "REC/G", "YDS/G", "YDS/REC", "TD/G", "WRR"],
    RB: ["PLAYER", "GP", "ATT", "YDS", "TD", "LONG", "YDS/ATT", "YDS/G"],
    DB: ["PLAYER", "GP", "TKL", "INT", "SFTY", "SK", "TKL/G"],
    OL: ["PLAYER", "GP", "SNAP", "BLK", "SK/A", "SFTY/A", "SK/A%", "OLR"],
    K: ["PLAYER", "GP", "FGM", "FGA", "LONG", "FG%", "FGA/G", "FGM/G"]
  },
  s12: {
    QB: ["PLAYER", "GP", "CMP", "ATT", "CMP%", "YDS", "TD", "LONG", "INT", "SK", "YDS/G", "YDS/ATT", "QBR"],
    WR: ["PLAYER", "GP", "REC", "YDS", "TD", "LONG", "REC/G", "YDS/G", "YDS/REC", "TD/G", "WRR"],
    RB: ["PLAYER", "GP", "ATT", "YDS", "TD", "LONG", "YDS/ATT", "YDS/G"],
    TE: [],
    DB: ["PLAYER", "GP", "TKL", "INT", "SFTY", "SK", "TKL/G", "INT/G"],
    OL: ["PLAYER", "GP", "SNAP", "BLK", "SK/A", "SFTY/A", "SK/A%", "OLR"],
    K: ["PLAYER", "GP", "FGM", "FGA", "LONG", "FG%", "FGA/G", "FGM/G"]
  },
  s13: {
    QB: ["PLAYER", "GP", "CMP", "ATT", "CMP%", "YDS", "TD", "LONG", "INT", "SK", "YDS/G", "YDS/ATT", "QBR"],
    WR: ["PLAYER", "GP", "REC", "YDS", "TD", "LONG", "REC/G", "YDS/G", "YDS/REC", "TD/G", "WRR"],
    RB: ["PLAYER", "GP", "ATT", "YDS", "TD", "LONG", "YDS/ATT", "YDS/G"],
    TE: ["PLAYER", "GP", "REC", "YDS", "TD", "LONG", "REC/G", "YDS/G", "YDS/REC"],
    DB: ["PLAYER", "GP", "TKL", "INT", "SFTY", "SK", "TKL/G", "INT/G"],
    OL: ["PLAYER", "GP", "SNAP", "BLK", "SK/A", "SFTY/A", "SK/A%", "OLR"],
    K: ["PLAYER", "GP", "FGM", "FGA", "LONG", "FG%", "FGA/G", "FGM/G"]
  },
  s14: {
    QB: ["PLAYER", "GP", "CMP", "ATT", "CMP%", "YDS", "TD", "LONG", "INT", "SK", "YDS/G", "YDS/ATT", "QBR"],
    WR: ["PLAYER", "GP", "REC", "YDS", "TD", "LONG", "REC/G", "YDS/G", "YDS/REC", "TD/G", "WRR"],
    RB: [],
    TE: ["PLAYER", "GP", "REC", "YDS", "TD", "LONG", "REC/G", "YDS/G", "YDS/REC"],
    DB: ["PLAYER", "GP", "TKL", "INT", "SFTY", "SK", "TKL/G", "INT/G"],
    OL: ["PLAYER", "GP", "SNAP", "BLK", "SK/A", "SFTY/A", "SK/A%", "OLR"],
    K: ["PLAYER", "GP", "FGM", "FGA", "LONG", "FG%", "FGA/G", "FGM/G"]
  },
  s15: {
    QB: ["PLAYER", "GP", "CMP", "ATT", "CMP%", "YDS", "TD", "LONG", "INT", "SK", "YDS/G", "YDS/ATT", "QBR"],
    WR: ["PLAYER", "GP", "REC", "YDS", "TD", "LONG", "REC/G", "YDS/G", "YDS/REC", "TD/G", "WRR"],
    RB: [],
    TE: ["PLAYER", "GP", "REC", "YDS", "TD", "LONG", "REC/G", "YDS/G", "YDS/REC"],
    DB: ["PLAYER", "GP", "TKL", "INT", "SK", "TKL/G", "INT/G"],
    OL: ["PLAYER", "GP", "SNAP", "BLK", "SK/A", "SFTY/A", "SK/A%", "OLR"],
    K: ["PLAYER", "GP", "FGM", "FGA", "LONG", "FG%", "FGA/G", "FGM/G"]
  },
  s16: {
    QB: ["PLAYER", "GP", "CMP", "ATT", "CMP%", "YDS", "TD", "LONG", "INT", "SK", "YDS/G", "YDS/ATT", "QBR"],
    WR: ["PLAYER", "GP", "REC", "YDS", "TD", "LONG", "REC/G", "YDS/G", "YDS/REC", "TD/G", "WRR"],
    RB: [],
    TE: ["PLAYER", "GP", "REC", "YDS", "TD", "LONG", "REC/G", "YDS/G", "YDS/REC"],
    DB: ["PLAYER", "GP", "TKL", "INT", "SK", "TKL/G", "INT/G"],
    OL: ["PLAYER", "GP", "SNAP", "BLK", "SK/A", "SFTY/A", "SK/A%", "OLR"],
    K: ["PLAYER", "GP", "FGM", "FGA", "LONG", "FG%", "FGA/G", "FGM/G"]
  }
};

export const mobileFullViewStatsBySeason: Record<string, Partial<Record<PositionID, string[]>>> = {
  s1: {
    QB: ["CMP", "ATT", "YDS", "TD", "INT", "SK"],
    WR: ["REC", "YDS", "TD", "LONG"],
    RB: ["ATT", "YDS", "TD", "LONG"],
    DB: ["TKL", "INT", "SFTY", "SK"],
    K: ["FGM", "FGA", "LONG"]
  },
  s2: {
    QB: ["CMP", "ATT", "YDS", "TD", "INT", "SK"],
    WR: ["REC", "YDS", "TD", "LONG", "YDS/G", "YDS/REC"],
    RB: ["ATT", "YDS", "TD", "LONG"],
    DB: ["TKL", "INT", "SFTY", "SK"],
    K: ["FGM", "FGA", "LONG", "FG%"]
  },
  s3: { QB: [], WR: [], RB: [], DB: [], K: [] },
  s4: { QB: [], WR: [], RB: [], DB: [], K: [] },
  s5: {
    QB: ["CMP", "ATT", "YDS", "TD", "INT", "SK"],
    WR: ["REC", "YDS", "TD", "LONG", "YDS/G", "YDS/REC"],
    RB: ["ATT", "YDS", "TD", "LONG"],
    DB: ["TKL", "INT", "SFTY", "SK"],
    K: ["FGM", "FGA", "LONG", "FG%"]
  },
  s6: { QB: [], WR: [], RB: [], DB: [], K: [] },
  s7: { QB: [], WR: [], RB: [], DB: [], K: [] },
  s8: { QB: [], WR: [], RB: [], DB: [], K: [] },
  s9: {
    QB: ["CMP", "ATT", "YDS", "TD", "INT", "SK"],
    WR: ["REC", "YDS", "TD", "LONG", "YDS/G", "YDS/REC"],
    RB: ["ATT", "YDS", "TD", "LONG", "YDS/ATT", "YDS/G"],
    DB: ["TKL", "INT", "SFTY", "SK"]
  },
  s10: {
    QB: ["CMP", "ATT", "YDS", "TD", "INT", "SK"],
    WR: ["REC", "YDS", "TD", "LONG", "YDS/G", "YDS/REC"],
    DB: ["TKL", "INT", "SFTY", "SK"]
  },
  s11: {
    QB: ["CMP", "ATT", "YDS", "TD", "INT", "SK"],
    WR: ["REC", "YDS", "TD", "LONG", "YDS/G", "YDS/REC"],
    RB: ["ATT", "YDS", "TD", "LONG", "YDS/ATT", "YDS/G"],
    DB: ["TKL", "INT", "SFTY", "SK"],
    OL: ["SNAP", "BLK", "SK/A", "SFTY/A", "SK/A%", "OLR"],
    K: ["FGM", "FGA", "LONG", "FG%", "FGA/G", "FGM/G"]
  },
  s12: {
    QB: ["CMP", "ATT", "YDS", "TD", "INT", "SK"],
    WR: ["REC", "YDS", "TD", "LONG", "YDS/G", "YDS/REC"],
    RB: ["ATT", "YDS", "TD", "LONG", "YDS/ATT", "YDS/G"],
    DB: ["TKL", "INT", "SFTY", "SK", "TKL/G", "INT/G"],
    OL: ["SNAP", "BLK", "SK/A", "SFTY/A", "SK/A%", "OLR"],
    K: ["FGM", "FGA", "LONG", "FG%", "FGA/G", "FGM/G"]
  },
  s13: {
    QB: ["CMP", "ATT", "YDS", "TD", "INT", "SK"],
    WR: ["REC", "YDS", "TD", "LONG", "YDS/G", "YDS/REC"],
    RB: ["ATT", "YDS", "TD", "LONG", "YDS/ATT", "YDS/G"],
    TE: ["REC", "YDS", "TD", "LONG", "YDS/G", "YDS/REC"],
    DB: ["TKL", "INT", "SFTY", "SK", "TKL/G", "INT/G"],
    OL: ["SNAP", "BLK", "SK/A", "SFTY/A", "SK/A%", "OLR"],
    K: ["FGM", "FGA", "LONG", "FG%", "FGA/G", "FGM/G"]
  },
  s14: {
    QB: ["CMP", "ATT", "YDS", "TD", "INT", "SK"],
    WR: ["REC", "YDS", "TD", "LONG", "YDS/G", "YDS/REC"],
    TE: ["REC", "YDS", "TD", "LONG", "YDS/G", "YDS/REC"],
    DB: ["TKL", "INT", "SFTY", "SK", "TKL/G", "INT/G"],
    OL: ["SNAP", "BLK", "SK/A", "SFTY/A", "SK/A%", "OLR"],
    K: ["FGM", "FGA", "LONG", "FG%", "FGA/G", "FGM/G"]
  },
  s15: {
    QB: ["CMP", "ATT", "YDS", "TD", "INT", "SK"],
    WR: ["REC", "YDS", "TD", "REC/G", "YDS/G", "YDS/REC"],
    TE: ["REC", "YDS", "TD", "LONG", "YDS/G", "YDS/REC"],
    DB: ["TKL", "INT", "SK", "TKL/G"],
    OL: ["SNAP", "BLK", "SK/A", "SFTY/A", "SK/A%", "OLR"],
    K: ["FGM", "FGA", "LONG", "FG%", "FGA/G", "FGM/G"]
  },
  s16: {
    QB: ["CMP", "ATT", "YDS", "TD", "INT", "SK"],
    WR: ["REC", "YDS", "TD", "LONG", "YDS/G", "YDS/REC"],
    TE: ["REC", "YDS", "TD", "LONG", "YDS/G", "YDS/REC"],
    DB: ["TKL", "INT", "SK", "TKL/G"],
    OL: ["SNAP", "BLK", "SK/A", "SFTY/A", "SK/A%", "OLR"],
    K: ["FGM", "FGA", "LONG", "FG%", "FGA/G", "FGM/G"]
  }
};

export const defaultSortByPosition: Record<PositionID, string> = {
  QB: "YDS",
  WR: "YDS",
  RB: "YDS",
  TE: "YDS",
  DB: "TKL",
  OL: "BLK",
  K: "FGM"
};

export const STAT_STATUS_MESSAGES: Partial<Record<SeasonID, string | Partial<Record<PositionID, string>>>> = {
  s3: "MISSING STAT DATA",
  s4: "INCORRECT SHEET FORMAT",
  s6: "MISSING STAT DATA",
  s7: "MISSING STAT DATA",
  s8: "MISSING STAT DATA",
  s9: {
    K: "MISSING STAT DATA"
  },
  s10: {
    RB: "MISSING STAT DATA",
    K: "MISSING STAT DATA"
  },
  s12: {
    RB: "MISSING STAT DATA"
  },
  s14: {
    RB: "MISSING STAT DATA"
  },
  s15: {
    RB: "MISSING STAT DATA"
  },
  s16: {
    RB: "MISSING STAT DATA"
  },
};

export const getStatStatusMessage = (season: SeasonID, position: PositionID): string | null => {
  const normSeason = String(season).toLowerCase() as SeasonID;
  const normPosition = String(position).toUpperCase() as PositionID;

  const seasonNum = parseInt(normSeason.replace('s', ''));
  if (seasonNum <= 10 && normPosition === 'OL') {
    return "OL STAT TRACKING BEGINS S11";
  }
  if (seasonNum <= 12 && normPosition === 'TE') {
    return "TE STAT TRACKING BEGINS S13";
  }

  const status = STAT_STATUS_MESSAGES[normSeason];
  if (typeof status === 'string') return status;
  if (status && status[normPosition]) return status[normPosition] as string;
  return null;
};

export const getFootballStatColumns = (season: SeasonID, position: PositionID) => {
  const normSeason = String(season).toLowerCase();
  const normPosition = String(position).toUpperCase() as PositionID;
  return footballStatColumnsBySeason[normSeason]?.[normPosition] || [];
};

export const getMobileFootballStatColumns = (season: SeasonID, position: PositionID) => {
  const normSeason = String(season).toLowerCase();
  const normPosition = String(position).toUpperCase() as PositionID;
  return mobileFullViewStatsBySeason[normSeason]?.[normPosition] || [];
};

export const STAT_SOURCES: StatSourcesMap = {
  s1: {
    QB: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSsDmuHVQFoQm2Gt6Mb3skJjUDhqYgN_MtkdrpxskN7S3o6V5HDzQvIs77FTmHf0QZ83m1y6AqNz3Fw/pub?gid=1605036085&single=true&output=csv",
    WR: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSsDmuHVQFoQm2Gt6Mb3skJjUDhqYgN_MtkdrpxskN7S3o6V5HDzQvIs77FTmHf0QZ83m1y6AqNz3Fw/pub?gid=1124487881&single=true&output=csv",
    RB: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSsDmuHVQFoQm2Gt6Mb3skJjUDhqYgN_MtkdrpxskN7S3o6V5HDzQvIs77FTmHf0QZ83m1y6AqNz3Fw/pub?gid=338484897&single=true&output=csv",
    DB: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSsDmuHVQFoQm2Gt6Mb3skJjUDhqYgN_MtkdrpxskN7S3o6V5HDzQvIs77FTmHf0QZ83m1y6AqNz3Fw/pub?gid=538189173&single=true&output=csv",
    K: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSsDmuHVQFoQm2Gt6Mb3skJjUDhqYgN_MtkdrpxskN7S3o6V5HDzQvIs77FTmHf0QZ83m1y6AqNz3Fw/pub?gid=2138095599&single=true&output=csv"
  },
  s2: {
    QB: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTqMw5NcUAWc33XWd-tY9mSGrppj5st6Sp0ie9_xztrI4LCOgCCW10aF1zyfMoB7AKK8uk_e1xfuHHH/pub?gid=1630335620&single=true&output=csv",
    WR: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTqMw5NcUAWc33XWd-tY9mSGrppj5st6Sp0ie9_xztrI4LCOgCCW10aF1zyfMoB7AKK8uk_e1xfuHHH/pub?gid=1294402845&single=true&output=csv",
    RB: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTqMw5NcUAWc33XWd-tY9mSGrppj5st6Sp0ie9_xztrI4LCOgCCW10aF1zyfMoB7AKK8uk_e1xfuHHH/pub?gid=1501824588&single=true&output=csv",
    DB: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTqMw5NcUAWc33XWd-tY9mSGrppj5st6Sp0ie9_xztrI4LCOgCCW10aF1zyfMoB7AKK8uk_e1xfuHHH/pub?gid=78111589&single=true&output=csv",
    K: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTqMw5NcUAWc33XWd-tY9mSGrppj5st6Sp0ie9_xztrI4LCOgCCW10aF1zyfMoB7AKK8uk_e1xfuHHH/pub?gid=268598839&single=true&output=csv"
  },
  s3: { QB: "", WR: "", RB: "", DB: "", K: "" },
  s4: { QB: "", WR: "", RB: "", DB: "", K: "" },
  s5: {
    QB: "https://docs.google.com/spreadsheets/d/e/2PACX-1vR5jRfmdBBqBYFWv1mj2ZEtepEIru7TurcBM6lkkCmGA33lu5c49o2SZPVDg7Ra1yWiPKODbbsIFJo5/pub?gid=1630335620&single=true&output=csv",
    WR: "https://docs.google.com/spreadsheets/d/e/2PACX-1vR5jRfmdBBqBYFWv1mj2ZEtepEIru7TurcBM6lkkCmGA33lu5c49o2SZPVDg7Ra1yWiPKODbbsIFJo5/pub?gid=1294402845&single=true&output=csv",
    RB: "https://docs.google.com/spreadsheets/d/e/2PACX-1vR5jRfmdBBqBYFWv1mj2ZEtepEIru7TurcBM6lkkCmGA33lu5c49o2SZPVDg7Ra1yWiPKODbbsIFJo5/pub?gid=1501824588&single=true&output=csv",
    DB: "https://docs.google.com/spreadsheets/d/e/2PACX-1vR5jRfmdBBqBYFWv1mj2ZEtepEIru7TurcBM6lkkCmGA33lu5c49o2SZPVDg7Ra1yWiPKODbbsIFJo5/pub?gid=78111589&single=true&output=csv",
    K: "https://docs.google.com/spreadsheets/d/e/2PACX-1vR5jRfmdBBqBYFWv1mj2ZEtepEIru7TurcBM6lkkCmGA33lu5c49o2SZPVDg7Ra1yWiPKODbbsIFJo5/pub?gid=268598839&single=true&output=csv"
  },
  s6: { QB: "", WR: "", RB: "", DB: "", K: "" },
  s7: { QB: "", WR: "", RB: "", DB: "", K: "" },
  s8: { QB: "", WR: "", RB: "", DB: "", K: "" },
  s9: {
    QB: "https://docs.google.com/spreadsheets/d/e/2PACX-1vT-rN3_VI6noI-PdF6m8Fx7DNyvhz47MrQTMFQ0pEEmPDnsj7BzHVOTm14dx8FPsfvOExWyxr8Ijq_x/pub?gid=1630335620&single=true&output=csv",
    WR: "https://docs.google.com/spreadsheets/d/e/2PACX-1vT-rN3_VI6noI-PdF6m8Fx7DNyvhz47MrQTMFQ0pEEmPDnsj7BzHVOTm14dx8FPsfvOExWyxr8Ijq_x/pub?gid=1294402845&single=true&output=csv",
    RB: "https://docs.google.com/spreadsheets/d/e/2PACX-1vT-rN3_VI6noI-PdF6m8Fx7DNyvhz47MrQTMFQ0pEEmPDnsj7BzHVOTm14dx8FPsfvOExWyxr8Ijq_x/pub?gid=1501824588&single=true&output=csv",
    DB: "https://docs.google.com/spreadsheets/d/e/2PACX-1vT-rN3_VI6noI-PdF6m8Fx7DNyvhz47MrQTMFQ0pEEmPDnsj7BzHVOTm14dx8FPsfvOExWyxr8Ijq_x/pub?gid=78111589&single=true&output=csv",
    K: ""
  },
  s10: {
    QB: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQpSYylbNq7J6TEt3SwSyfZ9BrSIUIX9XzKBVTq0h3EdKJM7jZOzdePYko61Uk2jaI9_NqueOYcMPB7/pub?gid=1630335620&single=true&output=csv",
    WR: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQpSYylbNq7J6TEt3SwSyfZ9BrSIUIX9XzKBVTq0h3EdKJM7jZOzdePYko61Uk2jaI9_NqueOYcMPB7/pub?gid=1294402845&single=true&output=csv",
    RB: "",
    DB: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQpSYylbNq7J6TEt3SwSyfZ9BrSIUIX9XzKBVTq0h3EdKJM7jZOzdePYko61Uk2jaI9_NqueOYcMPB7/pub?gid=78111589&single=true&output=csv",
    OL: "",
    K: ""
  },
  s11: {
    QB: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTtAfYPdH-p-k4l47wIPjQcMZ-cbajeLsCRavdfSooUvJAZgzyxhDq4cb_8900fCzGMA3SAR7p1VNcO/pub?gid=1630335620&single=true&output=csv",
    WR: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTtAfYPdH-p-k4l47wIPjQcMZ-cbajeLsCRavdfSooUvJAZgzyxhDq4cb_8900fCzGMA3SAR7p1VNcO/pub?gid=1294402845&single=true&output=csv",
    RB: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTtAfYPdH-p-k4l47wIPjQcMZ-cbajeLsCRavdfSooUvJAZgzyxhDq4cb_8900fCzGMA3SAR7p1VNcO/pub?gid=1501824588&single=true&output=csv",
    DB: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTtAfYPdH-p-k4l47wIPjQcMZ-cbajeLsCRavdfSooUvJAZgzyxhDq4cb_8900fCzGMA3SAR7p1VNcO/pub?gid=78111589&single=true&output=csv",
    OL: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTtAfYPdH-p-k4l47wIPjQcMZ-cbajeLsCRavdfSooUvJAZgzyxhDq4cb_8900fCzGMA3SAR7p1VNcO/pub?gid=299948230&single=true&output=csv",
    K: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTtAfYPdH-p-k4l47wIPjQcMZ-cbajeLsCRavdfSooUvJAZgzyxhDq4cb_8900fCzGMA3SAR7p1VNcO/pub?gid=268598839&single=true&output=csv"
  },
  s12: {
    QB: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTxxBCGVcO7f5BqL4tMalXenlZIlGgk7G9duGSvMnp9BUHcN5LvFtjBxQNZoBOILI57GPt1JPEg05ya/pub?gid=1630335620&single=true&output=csv",
    WR: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTxxBCGVcO7f5BqL4tMalXenlZIlGgk7G9duGSvMnp9BUHcN5LvFtjBxQNZoBOILI57GPt1JPEg05ya/pub?gid=1294402845&single=true&output=csv",
    RB: "",
    TE: "",
    DB: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTxxBCGVcO7f5BqL4tMalXenlZIlGgk7G9duGSvMnp9BUHcN5LvFtjBxQNZoBOILI57GPt1JPEg05ya/pub?gid=78111589&single=true&output=csv",
    OL: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTxxBCGVcO7f5BqL4tMalXenlZIlGgk7G9duGSvMnp9BUHcN5LvFtjBxQNZoBOILI57GPt1JPEg05ya/pub?gid=299948230&single=true&output=csv",
    K: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTxxBCGVcO7f5BqL4tMalXenlZIlGgk7G9duGSvMnp9BUHcN5LvFtjBxQNZoBOILI57GPt1JPEg05ya/pub?gid=268598839&single=true&output=csv"
  },
  s13: {
    QB: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQtO72iB4_3jQ44xMNJGvg9tMtUiJutcWDSvFu56qedX9LQeW9cMktK4IhTcB3IlVFnpWyyHplynILU/pub?gid=1630335620&single=true&output=csv",
    WR: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQtO72iB4_3jQ44xMNJGvg9tMtUiJutcWDSvFu56qedX9LQeW9cMktK4IhTcB3IlVFnpWyyHplynILU/pub?gid=1294402845&single=true&output=csv",
    RB: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQtO72iB4_3jQ44xMNJGvg9tMtUiJutcWDSvFu56qedX9LQeW9cMktK4IhTcB3IlVFnpWyyHplynILU/pub?gid=1501824588&single=true&output=csv",
    TE: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQtO72iB4_3jQ44xMNJGvg9tMtUiJutcWDSvFu56qedX9LQeW9cMktK4IhTcB3IlVFnpWyyHplynILU/pub?gid=2078359724&single=true&output=csv",
    DB: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQtO72iB4_3jQ44xMNJGvg9tMtUiJutcWDSvFu56qedX9LQeW9cMktK4IhTcB3IlVFnpWyyHplynILU/pub?gid=78111589&single=true&output=csv",
    OL: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQtO72iB4_3jQ44xMNJGvg9tMtUiJutcWDSvFu56qedX9LQeW9cMktK4IhTcB3IlVFnpWyyHplynILU/pub?gid=299948230&single=true&output=csv",
    K: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQtO72iB4_3jQ44xMNJGvg9tMtUiJutcWDSvFu56qedX9LQeW9cMktK4IhTcB3IlVFnpWyyHplynILU/pub?gid=268598839&single=true&output=csv"
  },
  s14: {
    QB: "https://docs.google.com/spreadsheets/d/e/2PACX-1vR1qRzepC5cviVQz9jQQxsqNubPBxqK_KUTzykDXzamGpBbAC0RJDMqsYDc4foq8DAJ8GsSAKIKJ8Ih/pub?gid=1630335620&single=true&output=csv",
    WR: "https://docs.google.com/spreadsheets/d/e/2PACX-1vR1qRzepC5cviVQz9jQQxsqNubPBxqK_KUTzykDXzamGpBbAC0RJDMqsYDc4foq8DAJ8GsSAKIKJ8Ih/pub?gid=1294402845&single=true&output=csv",
    RB: "",
    TE: "https://docs.google.com/spreadsheets/d/e/2PACX-1vR1qRzepC5cviVQz9jQQxsqNubPBxqK_KUTzykDXzamGpBbAC0RJDMqsYDc4foq8DAJ8GsSAKIKJ8Ih/pub?gid=2078359724&single=true&output=csv",
    DB: "https://docs.google.com/spreadsheets/d/e/2PACX-1vR1qRzepC5cviVQz9jQQxsqNubPBxqK_KUTzykDXzamGpBbAC0RJDMqsYDc4foq8DAJ8GsSAKIKJ8Ih/pub?gid=78111589&single=true&output=csv",
    OL: "https://docs.google.com/spreadsheets/d/e/2PACX-1vR1qRzepC5cviVQz9jQQxsqNubPBxqK_KUTzykDXzamGpBbAC0RJDMqsYDc4foq8DAJ8GsSAKIKJ8Ih/pub?gid=299948230&single=true&output=csv",
    K: "https://docs.google.com/spreadsheets/d/e/2PACX-1vR1qRzepC5cviVQz9jQQxsqNubPBxqK_KUTzykDXzamGpBbAC0RJDMqsYDc4foq8DAJ8GsSAKIKJ8Ih/pub?gid=268598839&single=true&output=csv"
  },
  s15: {
    QB: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSmgohkIbv2pPGbkvrZX7nUS6aK_pOgmu8qTgRrIEfEOy0bHrYnqDHCkwgHRzNiubIUm6HDN4kKRK40/pub?gid=1630335620&single=true&output=csv",
    WR: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSmgohkIbv2pPGbkvrZX7nUS6aK_pOgmu8qTgRrIEfEOy0bHrYnqDHCkwgHRzNiubIUm6HDN4kKRK40/pub?gid=1294402845&single=true&output=csv",
    RB: "",
    TE: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSmgohkIbv2pPGbkvrZX7nUS6aK_pOgmu8qTgRrIEfEOy0bHrYnqDHCkwgHRzNiubIUm6HDN4kKRK40/pub?gid=2078359724&single=true&output=csv",
    DB: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSmgohkIbv2pPGbkvrZX7nUS6aK_pOgmu8qTgRrIEfEOy0bHrYnqDHCkwgHRzNiubIUm6HDN4kKRK40/pub?gid=78111589&single=true&output=csv",
    OL: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSmgohkIbv2pPGbkvrZX7nUS6aK_pOgmu8qTgRrIEfEOy0bHrYnqDHCkwgHRzNiubIUm6HDN4kKRK40/pub?gid=299948230&single=true&output=csv",
    K: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSmgohkIbv2pPGbkvrZX7nUS6aK_pOgmu8qTgRrIEfEOy0bHrYnqDHCkwgHRzNiubIUm6HDN4kKRK40/pub?gid=268598839&single=true&output=csv"
  },
  s16: {
    QB: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ6hKxVjsYKwCQLxFBJqUb3wUMHzcwi_njw1EByR6zoPESssshw-bGvXmad-qo4VduIk0CRWiWJYfs8/pub?gid=1630335620&single=true&output=csv",
    WR: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ6hKxVjsYKwCQLxFBJqUb3wUMHzcwi_njw1EByR6zoPESssshw-bGvXmad-qo4VduIk0CRWiWJYfs8/pub?gid=1294402845&single=true&output=csv",
    RB: "",
    TE: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ6hKxVjsYKwCQLxFBJqUb3wUMHzcwi_njw1EByR6zoPESssshw-bGvXmad-qo4VduIk0CRWiWJYfs8/pub?gid=2078359724&single=true&output=csv",
    DB: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ6hKxVjsYKwCQLxFBJqUb3wUMHzcwi_njw1EByR6zoPESssshw-bGvXmad-qo4VduIk0CRWiWJYfs8/pub?gid=78111589&single=true&output=csv",
    OL: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ6hKxVjsYKwCQLxFBJqUb3wUMHzcwi_njw1EByR6zoPESssshw-bGvXmad-qo4VduIk0CRWiWJYfs8/pub?gid=299948230&single=true&output=csv",
    K: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ6hKxVjsYKwCQLxFBJqUb3wUMHzcwi_njw1EByR6zoPESssshw-bGvXmad-qo4VduIk0CRWiWJYfs8/pub?gid=268598839&single=true&output=csv"
  },
};

export interface PlayerStats {
  player: string;
  gp: number;
  [key: string]: any;
}

const cache: Record<string, PlayerStats[]> = {};

export const clearCache = () => {
  for (const key in cache) {
    delete cache[key];
  }
};

export const getCacheInfo = () => {
  const info: Record<string, number> = {};
  for (const key in cache) {
    info[key] = cache[key].length;
  }
  return info;
};

const normalizeKey = (k: string) => k.toLowerCase().trim().replace(/[^a-z0-9%/]/g, '');

const toNumber = (v: any): number => {
  if (typeof v === 'number') return v;
  if (typeof v === 'string') {
    const clean = v.trim().replace(/,/g, '').replace(/\s/g, '').replace(/[^0-9.-]/g, '');
    const val = parseFloat(clean);
    return isNaN(val) ? 0 : val;
  }
  return 0;
};

/**
 * Specialized parser for currency strings like "$74.4M", "$10K", etc.
 */
const parseValAav = (v: any): number => {
  if (v === null || v === undefined || v === '') return 0;
  
  let s = String(v).trim().toUpperCase();
  s = s.replace('$', '').replace(/,/g, '');
  
  let multiplier = 1;
  if (s.endsWith('M')) {
    multiplier = 1_000_000;
    s = s.slice(0, -1);
  } else if (s.endsWith('K')) {
    multiplier = 1_000;
    s = s.slice(0, -1);
  } else if (s.endsWith('B')) {
    multiplier = 1_000_000_000;
    s = s.slice(0, -1);
  }
  
  const num = parseFloat(s);
  return isNaN(num) ? 0 : num * multiplier;
};

export const fetchSeasonStats = async (season: SeasonOrAllTime, position: PositionID | 'ALL' = 'QB', signal?: AbortSignal): Promise<PlayerStats[]> => {
  const normSeason = String(season).toLowerCase() as SeasonOrAllTime;
  const normPosition = String(position).toUpperCase() as PositionID;
  const cacheKey = `${normSeason}-${normPosition}`;
  
  if (cache[cacheKey]) return cache[cacheKey];

  let sourceUrl = '';
  if (normSeason === 'all-time') {
    sourceUrl = STAT_SOURCES['s1']?.['QB'] || '';
  } else {
    sourceUrl = STAT_SOURCES[normSeason as SeasonID]?.[normPosition] || '';
  }

  if (!sourceUrl) {
    console.warn(`[Stats Fetch] No source URL found for ${normSeason} - ${normPosition}`);
    return [];
  }

  try {
    console.log(`[Stats Fetch] Requesting ${normSeason.toUpperCase()} - ${normPosition}`);
    console.log(`[Stats Fetch] URL: ${sourceUrl}`);
    
    const fetchUrl = `${sourceUrl}&t=${Date.now()}`;
    console.log(`[Stats Fetch] FetchUrl: ${fetchUrl}`);
    
    const response = await fetch(fetchUrl, { signal });
    if (!response.ok) {
      console.warn(`[Stats Fetch] Failed with status ${response.status}`);
      return [];
    }
    const csvData = await response.text();
    console.log(`[Stats Fetch] Raw CSV preview:`, csvData.substring(0, 200));

    return new Promise((resolve, reject) => {
      Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          console.log(`[Stats Fetch] Parsed headers:`, results.meta.fields);
          const stats = results.data
            .map((raw: any) => {
              const playerKey = Object.keys(raw).find(k => normalizeKey(k) === 'player');
              const player = playerKey ? String(raw[playerKey]).trim() : '';

              const s: PlayerStats = { player, gp: 0 };
              
              Object.keys(raw).forEach(k => {
                const normK = normalizeKey(k);
                if (normK === 'player') return;
                const parser = normK === 'val' || normK === 'valaav' ? parseValAav : toNumber;
                s[normK] = parser(raw[k]);
              });

              return s;
            })
            .filter(s => s.player && !['total values', 'highest value in each col.'].includes(s.player.toLowerCase()));
          
          console.log(`[Stats Fetch] Parsed ${stats.length} rows for ${season.toUpperCase()} - ${position}`);
          cache[cacheKey] = stats;
          resolve(stats);
        },
        error: (error: any) => {
          console.error(`[Stats Fetch] Parse error:`, error);
          reject(error);
        }
      });
    });
  } catch (err: any) {
    if (err.name !== 'AbortError') {
      console.error(`[Stats Fetch] Request failed:`, err);
    }
    return [];
  }
};
