
import { Achievement, CATEGORY_MAP } from './achievements';
import { PlayerStats } from './statsFetcher';

export interface PlayerAchievementStatus {
  achievement: Achievement;
  isEarned: boolean;
}

/**
 * Generates badges for the All-Time dataset with precise renames and thresholds.
 */
export const generateAllTimeBadges = (players: PlayerStats[]): Achievement[] => {
  const badges: Achievement[] = [];

  // 1. POINTS (PTS)
  const ptsMilestones = [
    { m: 250, title: 'Rookie Scorer' },
    { m: 500, title: 'Novice Scorer' },
    { m: 1000, title: 'Pro Scorer' },
    { m: 2000, title: 'Expert Scorer' },
    { m: 3000, title: 'Master Scorer' },
    { m: 4000, title: 'EQUALIZER' },
  ];
  ptsMilestones.forEach(item => {
    badges.push({
      id: `at-pts-${item.m}`,
      name: item.title,
      description: `Scored at least ${item.m.toLocaleString()} points in your career.`,
      requirementText: `${item.m.toLocaleString()} PTS`,
      category: 'Points',
      check: (s) => (s['pts'] as number || 0) >= item.m
    });
  });

  // 2. ASSISTS (AST)
  const astMilestones = [
    { m: 100, title: 'Rookie Passer' },
    { m: 250, title: 'Novice Passer' },
    { m: 500, title: 'Pro Passer' },
    { m: 750, title: 'Expert Passer' },
    { m: 1000, title: 'Master Passer' },
    { m: 1250, title: 'MAESTRO' },
  ];
  astMilestones.forEach(item => {
    badges.push({
      id: `at-ast-${item.m}`,
      name: item.title,
      description: `Recorded at least ${item.m.toLocaleString()} assists in your career.`,
      requirementText: `${item.m.toLocaleString()} AST`,
      category: 'Assists',
      check: (s) => (s['ast'] as number || 0) >= item.m
    });
  });

  // 3. REBOUNDS (REB) - Updated titles to "Rebounder" per user request edit
  const rebMilestones = [
    { m: 50, title: 'Rookie Rebounder' },
    { m: 100, title: 'Novice Rebounder' },
    { m: 150, title: 'Pro Rebounder' },
    { m: 200, title: 'Expert Rebounder' },
    { m: 250, title: 'Master Rebounder' },
    { m: 300, title: 'RODMAN' },
  ];
  rebMilestones.forEach(item => {
    badges.push({
      id: `at-reb-${item.m}`,
      name: item.title,
      description: `Collected at least ${item.m.toLocaleString()} rebounds in your career.`,
      requirementText: `${item.m.toLocaleString()} REB`,
      category: 'Rebounds',
      check: (s) => (s['reb'] as number || 0) >= item.m
    });
  });

  // 4. STEALS (STL)
  const stlMilestones = [
    { m: 50, title: 'Rookie Thief' },
    { m: 100, title: 'Novice Thief' },
    { m: 200, title: 'Pro Thief' },
    { m: 300, title: 'Expert Thief' },
    { m: 400, title: 'Master Thief' },
    { m: 500, title: 'BALLHAWK' },
  ];
  stlMilestones.forEach(item => {
    badges.push({
      id: `at-stl-${item.m}`,
      name: item.title,
      description: `Secured at least ${item.m.toLocaleString()} steals in your career.`,
      requirementText: `${item.m.toLocaleString()} STL`,
      category: 'Steals',
      check: (s) => (s['stl'] as number || 0) >= item.m
    });
  });

  // 5. EFFICIENCY (EFF)
  const effMilestones = [
    { m: 200, title: 'Efficiency I' },
    { m: 300, title: 'Efficiency II' },
    { m: 400, title: 'PERFECTION' },
  ];
  effMilestones.forEach(item => {
    badges.push({
      id: `at-eff-${item.m}`,
      name: item.title,
      description: `Maintained a career efficiency rating of ${item.m} or higher.`,
      requirementText: `${item.m}+ EFF`,
      category: 'Efficiency',
      check: (s) => (s['eff'] as number || 0) >= item.m
    });
  });

  // 6. LEGACY (Awards-based)
  badges.push({
    id: 'at-champion',
    name: 'Champion',
    description: 'Reached the top and secured a league title.',
    requirementText: 'Won at least 1 ring.',
    category: 'Legacy',
    check: (_, a) => {
      if (!a) return false;
      // Accessing 'rings' key which is standardized to lowercase in fetchAwards
      const ringsVal = a['rings'];
      if (ringsVal === undefined || ringsVal === null || ringsVal === '') return false;
      
      const numericRings = parseFloat(String(ringsVal).replace(/[^0-9.-]/g, ''));
      return !isNaN(numericRings) && numericRings > 0;
    }
  });

  badges.push({
    id: 'at-roty',
    name: 'Rookie of the Year',
    description: 'Acknowledged as the top newcomer in your debut season.',
    requirementText: 'ROTY Winner',
    category: 'Legacy',
    check: (_, a) => {
      if (!a) return false;
      // Checking both just in case, though standardize is lowercase
      const val = String(a['roty'] ?? a['ROTY'] ?? '').toLowerCase().trim();
      return val === 'yes' || val === 'y' || val === 'true';
    }
  });

  badges.push({
    id: 'at-hof',
    name: 'Hall of Fame',
    description: 'One of the greatest to ever play the game.',
    requirementText: 'HOF Inductee',
    category: 'Legacy',
    check: (_, a) => {
      if (!a) return false;
      // Checking both just in case, though standardize is lowercase
      const val = String(a['hof'] ?? a['HOF'] ?? '').toLowerCase().trim();
      return val === 'yes' || val === 'y' || val === 'true';
    }
  });

  return badges;
};

export const getTopBadgeEarners = (players: PlayerStats[], currentBadges: Achievement[], awardsByPlayer?: Record<string, any>) => {
  const ranked = players.map(p => {
    const normalizedName = p.player.trim().toLowerCase().replace(/\s+/g, '');
    const awards = awardsByPlayer ? awardsByPlayer[normalizedName] : undefined;
    const earnedCount = currentBadges.filter(ach => ach.check(p, awards)).length;
    return { player: p.player, earnedCount };
  });

  return ranked.sort((a, b) => b.earnedCount - a.earnedCount).slice(0, 10);
};

/**
 * Returns the highest tier badge earned in each category for a player.
 */
export const getHighestBadgesByCategory = (player: PlayerStats, awards: any, allBadges: Achievement[]) => {
  const earned = allBadges.filter(b => b.check(player, awards));
  const byCat: Record<string, Achievement> = {};
  
  // Badges in generateAllTimeBadges are defined in ascending order.
  // We iterate through them, and the last one seen for a category will be the highest.
  earned.forEach(b => {
    byCat[b.category] = b;
  });
  
  return Object.values(byCat);
};
