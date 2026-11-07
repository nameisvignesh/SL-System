export type Rank = 'E' | 'D' | 'C' | 'B' | 'A' | 'S';

export type StatKey = 'str' | 'agi' | 'int' | 'vit' | 'sense';

export interface Stats {
  str: number; // Fitness, Strength
  agi: number; // Agility, Habit Speed, Consistency
  int: number; // Intelligence, Study, Skill acquisition
  vit: number; // Vitality, Health, Sleep, Diet
  sense: number; // Perception, Mindfulness, Focus
}

export type StrictnessLevel = 'easy' | 'normal' | 'hunter' | 'monarch';

export interface Player {
  id: string;
  name: string;
  title: string;
  jobClass: string;
  level: number;
  rank: Rank;
  currentXp: number;
  gold: number;
  hp: number; // Discipline (0-100)
  maxHp: number;
  mp: number; // Energy/Focus (0-100)
  maxMp: number;
  statPoints: number;
  stats: Stats;
  streakDays: number;
  bestStreak: number;
  wakeTime: string; // e.g. "06:30"
  sleepTime: string; // e.g. "23:00"
  goals: string[]; // 3 main life objectives
  focusAreas: string[];
  strictness: StrictnessLevel;
  penaltiesActive: boolean;
  isPenalized: boolean; // currently in penalty zone
  lastActiveDate: string; // YYYY-MM-DD
  equippedTitleId: string;
  createdAt: string;
}

export type QuestDifficulty = 'E' | 'D' | 'C' | 'B' | 'A' | 'S';

export type QuestType = 'checkbox' | 'counter' | 'timer' | 'checklist';

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  category: StatKey;
  difficulty: QuestDifficulty;
  xpReward: number;
  goldReward: number;
  type: QuestType;
  // Counter specific
  currentCount?: number;
  targetCount?: number;
  unit?: string;
  // Timer specific (minutes)
  timerMinutes?: number;
  timerRemainingSeconds?: number;
  timerRunning?: boolean;
  // Checklist specific
  checklist?: ChecklistItem[];
  // Status
  completed: boolean;
  failed?: boolean;
  isDaily: boolean;
  isPenalty?: boolean;
  isGateQuest?: boolean; // associated with a reward
  targetRewardId?: string;
  isPromotionQuest?: boolean;
  deadline?: string; // HH:mm or timestamp
  completedAt?: string;
}

export type RewardStatus = 'locked' | 'gate_active' | 'unlocked' | 'claimed' | 'cooldown';

export interface Reward {
  id: string;
  title: string;
  description: string;
  emoji: string;
  goldCost: number;
  category: 'food' | 'entertainment' | 'rest' | 'social' | 'offline_treat' | 'custom';
  status: RewardStatus;
  claimWindowMinutes: number; // e.g. 120 = 2 hours
  claimWindowEndTimestamp?: number; // epoch ms when unlock timer expires
  cooldownHours: number; // e.g. 24 hours
  cooldownEndTimestamp?: number;
  defaultGateQuestTitle?: string;
  defaultGateQuestDescription?: string;
  activeGateQuestId?: string; // current linked gate quest
  totalClaimsCount: number;
  lastClaimedAt?: string;
}

export interface RewardClaimLog {
  id: string;
  rewardId: string;
  rewardTitle: string;
  goldCost: number;
  gateQuestTitle: string;
  claimedAt: string;
  enjoyed: boolean;
}

export interface Dungeon {
  id: string;
  title: string;
  description: string;
  requiredRank: Rank;
  durationDays: number;
  currentDay: number;
  status: 'available' | 'in_progress' | 'completed' | 'failed';
  dailyObjective: string;
  checkedInToday: boolean;
  xpReward: number;
  goldReward: number;
  titleReward?: string;
  itemReward?: string;
  startedAt?: string;
  completedAt?: string;
}

export interface BossRaid {
  id: string;
  bossName: string;
  title: string;
  maxHp: number;
  currentHp: number;
  weekNumber: number;
  status: 'active' | 'defeated' | 'expired';
  rewardXp: number;
  rewardGold: number;
  rewardTitle: string;
  deadlineDate: string; // End of week
}

export interface Title {
  id: string;
  name: string;
  description: string;
  buffDescription: string;
  statBonus?: Partial<Stats>;
  unlocked: boolean;
  unlockedAt?: string;
  requirement: string;
}

export interface Skill {
  id: string;
  name: string;
  category: 'passive' | 'active';
  description: string;
  statRequirement: {
    stat: StatKey;
    value: number;
  };
  unlocked: boolean;
  effect: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'xp_boost' | 'penalty_skip' | 'streak_shield' | 'reroll_quest' | 'potion';
  quantity: number;
  effectValue?: number; // e.g., 2 for 2x XP
  durationMinutes?: number; // e.g., 60 for 1 hr
  expiresAt?: number;
}

export interface Shadow {
  id: string;
  habitName: string;
  shadowName: string; // e.g., "Shadow Igris", "Shadow Iron"
  rank: Rank;
  level: number;
  currentStreak: number;
  isDormant: boolean;
  passiveBuff: string;
  extractedAt: string;
}

export interface AppSettings {
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  scanlinesEnabled: boolean;
  glowIntensity: 'low' | 'medium' | 'high';
  language: 'en' | 'ta'; // English or Tamil
  morningNotificationTime: string; // e.g. "07:00"
  eveningNotificationTime: string; // e.g. "21:00"
  desktopPhoneFrame: boolean; // toggle mobile simulator bezel on desktop
}

export interface XpEvent {
  id: string;
  timestamp: string;
  amount: number;
  gold: number;
  reason: string;
  category: StatKey;
}

export interface SystemNotification {
  id: string;
  title: string;
  header: string; // e.g. "[ QUEST ALERT ]"
  message: string;
  type: 'info' | 'warning' | 'level_up' | 'reward' | 'penalty' | 'promotion';
  timestamp: number;
  read: boolean;
}
