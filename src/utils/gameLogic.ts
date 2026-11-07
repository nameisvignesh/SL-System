import { Player, Quest, QuestDifficulty, Rank, StrictnessLevel } from '../types';

/**
 * Formula: xpNeeded(L) = 100 + 50 * L + 10 * L^2
 */
export function xpNeededForLevel(level: number): number {
  return 100 + 50 * level + 10 * Math.pow(level, 2);
}

/**
 * Difficulty base XP lookup
 */
export const DIFFICULTY_BASE_XP: Record<QuestDifficulty, number> = {
  E: 10,
  D: 20,
  C: 40,
  B: 80,
  A: 150,
  S: 300,
};

/**
 * Streak multiplier: min(1 + 0.02 * streakDays, 1.5)
 */
export function calculateStreakMultiplier(streakDays: number): number {
  return Math.min(1 + 0.02 * Math.max(0, streakDays), 1.5);
}

/**
 * Calculate Quest XP & Gold rewards
 */
export function calculateQuestRewards(
  difficulty: QuestDifficulty,
  streakDays: number,
  categoryMultiplier: number = 1.0,
  xpBoostActive: boolean = false
): { xp: number; gold: number } {
  const base = DIFFICULTY_BASE_XP[difficulty] || 10;
  const streakMult = calculateStreakMultiplier(streakDays);
  let totalXp = Math.round(base * categoryMultiplier * streakMult);
  if (xpBoostActive) {
    totalXp *= 2;
  }
  const gold = Math.round(totalXp * 0.6);
  return { xp: totalXp, gold };
}

/**
 * Determine Rank from Level
 * E: 1-9, D: 10-19, C: 20-34, B: 35-54, A: 55-79, S: 80+
 */
export function getRankFromLevel(level: number): Rank {
  if (level >= 80) return 'S';
  if (level >= 55) return 'A';
  if (level >= 35) return 'B';
  if (level >= 20) return 'C';
  if (level >= 10) return 'D';
  return 'E';
}

/**
 * Check if current level qualifies for a promotion quest to the next rank
 */
export function checkRankPromotion(prevLevel: number, newLevel: number): { promoted: boolean; newRank: Rank } {
  const oldRank = getRankFromLevel(prevLevel);
  const newRank = getRankFromLevel(newLevel);
  return {
    promoted: newRank !== oldRank,
    newRank,
  };
}

/**
 * Strictness configuration penalties
 */
export const STRICTNESS_SETTINGS: Record<StrictnessLevel, { hpLoss: number; goldLossPct: number; label: string }> = {
  easy: { hpLoss: 15, goldLossPct: 0.1, label: 'Easy' },
  normal: { hpLoss: 30, goldLossPct: 0.2, label: 'Normal' },
  hunter: { hpLoss: 45, goldLossPct: 0.35, label: 'Hunter' },
  monarch: { hpLoss: 60, goldLossPct: 0.5, label: 'Monarch' },
};

/**
 * Evaluate daily quest completion rate (must be >= 80% to maintain/advance streak)
 */
export function evaluateDailyCompletion(quests: Quest[]): {
  total: number;
  completed: number;
  rate: number;
  isPassing: boolean;
} {
  const dailies = quests.filter((q) => q.isDaily && !q.isPenalty && !q.isGateQuest);
  if (dailies.length === 0) {
    return { total: 0, completed: 0, rate: 1.0, isPassing: true };
  }
  const completed = dailies.filter((q) => q.completed).length;
  const rate = completed / dailies.length;
  return {
    total: dailies.length,
    completed,
    rate,
    isPassing: rate >= 0.8,
  };
}

/**
 * Generate promotion quest for rank up
 */
export function createPromotionQuest(targetRank: Rank): Quest {
  const rankTitles: Record<Rank, { title: string; desc: string }> = {
    E: { title: 'Rank-E Awakening', desc: 'Survive the initial assessment.' },
    D: { title: 'Rank-D Trial: Iron Discipline', desc: 'Complete 60 Push-ups and 30m Deep Focus session.' },
    C: { title: 'Rank-C Trial: Red Gate Infiltration', desc: '100 Push-ups, 5km Run/Walk, and 45m Focused Study without distraction.' },
    B: { title: 'Rank-B Trial: Dungeon Break Defense', desc: '150 Push-ups, 100 Squats, and 60m Skill Mastery session.' },
    A: { title: 'Rank-A Trial: High Orc Lair', desc: '200 Reps total workout and 90m Intense Work/Study session with zero deviations.' },
    S: { title: 'Rank-S Trial: Monarch Ascension', desc: 'Total physical and mental test: 250 Reps, 10km run, 2h Deep Mastery.' },
  };

  const info = rankTitles[targetRank] || rankTitles.D;
  return {
    id: `promo_${targetRank}_${Date.now()}`,
    title: `[PROMOTION QUEST] ${info.title}`,
    description: info.desc,
    category: 'str',
    difficulty: targetRank,
    xpReward: targetRank === 'S' ? 1000 : targetRank === 'A' ? 600 : targetRank === 'B' ? 400 : 250,
    goldReward: targetRank === 'S' ? 500 : 200,
    type: 'checklist',
    checklist: [
      { id: '1', text: 'Initiate physical conditioning trial', completed: false },
      { id: '2', text: 'Execute uninterrupted focus requirement', completed: false },
      { id: '3', text: 'Refuse all comfort excuses and temptations', completed: false },
    ],
    completed: false,
    isDaily: false,
    isPromotionQuest: true,
  };
}

/**
 * Generate Survival/Penalty Quest if player fails daily quests or HP drops to 0
 */
export function createPenaltyQuest(strictness: StrictnessLevel): Quest {
  const penaltyReps = strictness === 'monarch' ? 100 : strictness === 'hunter' ? 75 : 50;
  return {
    id: `penalty_${Date.now()}`,
    title: '[PENALTY ZONE] Survival Quest: Escape The Desert',
    description: `Discipline failed. Survive by completing ${penaltyReps} push-ups or squats before any rewards can be accessed.`,
    category: 'str',
    difficulty: 'C',
    xpReward: 0,
    goldReward: 0,
    type: 'counter',
    currentCount: 0,
    targetCount: penaltyReps,
    unit: 'reps',
    completed: false,
    isDaily: false,
    isPenalty: true,
  };
}
