import {
  AppSettings,
  BossRaid,
  Dungeon,
  InventoryItem,
  Player,
  Quest,
  Reward,
  RewardClaimLog,
  Shadow,
  Skill,
  SystemNotification,
  Title,
  XpEvent,
} from '../types';
import {
  checkRankPromotion,
  createPenaltyQuest,
  createPromotionQuest,
  evaluateDailyCompletion,
  STRICTNESS_SETTINGS,
  xpNeededForLevel,
} from '../utils/gameLogic';

const STORAGE_KEYS = {
  PLAYER: 'system_player_v1',
  QUESTS: 'system_quests_v1',
  REWARDS: 'system_rewards_v1',
  REWARD_CLAIMS: 'system_reward_claims_v1',
  DUNGEONS: 'system_dungeons_v1',
  BOSS_RAID: 'system_boss_raid_v1',
  TITLES: 'system_titles_v1',
  SKILLS: 'system_skills_v1',
  INVENTORY: 'system_inventory_v1',
  SHADOWS: 'system_shadows_v1',
  SETTINGS: 'system_settings_v1',
  XP_EVENTS: 'system_xp_events_v1',
  NOTIFICATIONS: 'system_notifications_v1',
};

// Initial Player Seed
export const DEFAULT_PLAYER: Player = {
  id: 'player_monarch',
  name: 'Sung Jin-Woo',
  title: 'The Awakened',
  jobClass: 'Shadow Monarch',
  level: 1,
  rank: 'E',
  currentXp: 0,
  gold: 150, // Initial starting gold
  hp: 100,
  maxHp: 100,
  mp: 100,
  maxMp: 100,
  statPoints: 5,
  stats: {
    str: 10,
    agi: 10,
    int: 10,
    vit: 10,
    sense: 10,
  },
  streakDays: 3,
  bestStreak: 7,
  wakeTime: '06:00',
  sleepTime: '23:00',
  goals: ['Build peak physical strength', 'Master full-stack engineering', 'Daily deep mindfulness'],
  focusAreas: ['Fitness', 'Coding', 'Discipline'],
  strictness: 'normal',
  penaltiesActive: true,
  isPenalized: false,
  lastActiveDate: new Date().toISOString().split('T')[0],
  equippedTitleId: 'title_awakened',
  createdAt: new Date().toISOString(),
};

// Initial Quests Seed
export const DEFAULT_QUESTS: Quest[] = [
  {
    id: 'quest_pushups_1',
    title: 'Daily Conditioning: 50 Push-ups',
    description: 'Physical vessel reinforcement. Split into sets if necessary.',
    category: 'str',
    difficulty: 'E',
    xpReward: 15,
    goldReward: 10,
    type: 'counter',
    currentCount: 0,
    targetCount: 50,
    unit: 'reps',
    completed: false,
    isDaily: true,
  },
  {
    id: 'quest_focus_study',
    title: 'Deep Focus: 45 Min Skill Mastery',
    description: 'Zero distractions. Put phone on DND and enter deep work state.',
    category: 'int',
    difficulty: 'D',
    xpReward: 25,
    goldReward: 15,
    type: 'timer',
    timerMinutes: 45,
    timerRemainingSeconds: 45 * 60,
    timerRunning: false,
    completed: false,
    isDaily: true,
  },
  {
    id: 'quest_hydration_vit',
    title: 'Hydration & Nutrition Protocol: 3L Water',
    description: 'Drink at least 3 liters of water throughout the day. Avoid sugary drinks.',
    category: 'vit',
    difficulty: 'E',
    xpReward: 12,
    goldReward: 8,
    type: 'counter',
    currentCount: 0,
    targetCount: 6,
    unit: 'glasses (500ml)',
    completed: false,
    isDaily: true,
  },
  {
    id: 'quest_mindfulness_sense',
    title: 'Mindfulness & Evening Reflection: 10 Min',
    description: 'Breathe and audit your mental state. No screen stimulation.',
    category: 'sense',
    difficulty: 'E',
    xpReward: 15,
    goldReward: 10,
    type: 'timer',
    timerMinutes: 10,
    timerRemainingSeconds: 10 * 60,
    timerRunning: false,
    completed: false,
    isDaily: true,
  },
  {
    id: 'quest_morning_checklist',
    title: 'Awakening Routine Protocol',
    description: 'Complete the 3-step morning ritual immediately upon waking.',
    category: 'agi',
    difficulty: 'E',
    xpReward: 15,
    goldReward: 10,
    type: 'checklist',
    checklist: [
      { id: 'c1', text: 'Wake up before 06:30 without snooze', completed: false },
      { id: 'c2', text: 'Make bed and drink 500ml water', completed: false },
      { id: 'c3', text: '5 min cold rinse or stretching', completed: false },
    ],
    completed: false,
    isDaily: true,
  },
];

// Initial Real-Life Task-Gated Rewards Seed
export const DEFAULT_REWARDS: Reward[] = [
  {
    id: 'reward_biryani',
    title: 'Aromatic Chicken/Mutton Biryani',
    description: 'A steaming hot, fragrant Biryani feast from your favorite restaurant. 100% guilt-free.',
    emoji: '🍛',
    goldCost: 150,
    category: 'food',
    status: 'locked',
    claimWindowMinutes: 120, // 2-hour window
    cooldownHours: 24,
    defaultGateQuestTitle: '30 Push-ups + 20 Min Focused Study',
    defaultGateQuestDescription: 'Pay the toll in sweat and focus before indulging in the feast.',
    totalClaimsCount: 1,
  },
  {
    id: 'reward_gaming_1h',
    title: '1 Hour Gaming Session',
    description: 'Immerse in your favorite video game without a single drop of guilt or stress.',
    emoji: '🎮',
    goldCost: 100,
    category: 'entertainment',
    status: 'locked',
    claimWindowMinutes: 90,
    cooldownHours: 12,
    defaultGateQuestTitle: 'Complete Today’s Work / Study Goal',
    defaultGateQuestDescription: 'Finish your high-priority daily study objective first.',
    totalClaimsCount: 2,
  },
  {
    id: 'reward_anime_movie',
    title: 'Anime Marathon / Movie Night',
    description: 'Watch 2 episodes of your favorite anime series or a full feature film.',
    emoji: '🎬',
    goldCost: 120,
    category: 'entertainment',
    status: 'locked',
    claimWindowMinutes: 180,
    cooldownHours: 24,
    defaultGateQuestTitle: '50 Squats + Room Deep Clean',
    defaultGateQuestDescription: 'Organize your physical vessel and space before entertainment.',
    totalClaimsCount: 0,
  },
  {
    id: 'reward_social_media_30m',
    title: '30 Min Social Media Browsing',
    description: 'Scroll Twitter/X, Instagram, or YouTube without an ounce of regret.',
    emoji: '📱',
    goldCost: 60,
    category: 'entertainment',
    status: 'locked',
    claimWindowMinutes: 45,
    cooldownHours: 6,
    defaultGateQuestTitle: '20 Min Book Reading',
    defaultGateQuestDescription: 'Feed the mind with quality prose before consuming algorithm feeds.',
    totalClaimsCount: 3,
  },
  {
    id: 'reward_special_coffee',
    title: 'Artisan Latte / Specialty Coffee',
    description: 'Treat yourself to a top-tier barista brew at a local cafe.',
    emoji: '☕',
    goldCost: 80,
    category: 'food',
    status: 'locked',
    claimWindowMinutes: 60,
    cooldownHours: 12,
    defaultGateQuestTitle: '30 Min Morning Workout',
    defaultGateQuestDescription: 'Earn your caffeine spike with honest physical exertion.',
    totalClaimsCount: 1,
  },
  {
    id: 'reward_rest_nap',
    title: 'Guilt-Free Afternoon Power Nap',
    description: '45 minutes of undisturbed restorative slumber.',
    emoji: '😴',
    goldCost: 75,
    category: 'rest',
    status: 'locked',
    claimWindowMinutes: 60,
    cooldownHours: 24,
    defaultGateQuestTitle: 'Clear Inbox & Finish Top 2 Tasks',
    defaultGateQuestDescription: 'Clear your active cognitive load so your rest is truly deep.',
    totalClaimsCount: 0,
  },
];

// Initial Dungeons Seed
export const DEFAULT_DUNGEONS: Dungeon[] = [
  {
    id: 'dungeon_7day_clean_diet',
    title: 'C-Rank Dungeon: 7-Day Zero Junk Food',
    description: 'Cleanse the physical vessel. Consume zero refined sugars or processed fast foods for 7 consecutive days.',
    requiredRank: 'E',
    durationDays: 7,
    currentDay: 3,
    status: 'in_progress',
    dailyObjective: 'Strict home-cooked whole meals, zero soda, zero candy.',
    checkedInToday: false,
    xpReward: 350,
    goldReward: 200,
    titleReward: 'Iron Stomach',
    startedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: 'dungeon_14day_morning_warrior',
    title: 'B-Rank Dungeon: 14-Day Dawn Breaker',
    description: 'Awaken at or before 06:00 AM every single morning for 14 days without exception.',
    requiredRank: 'D',
    durationDays: 14,
    currentDay: 0,
    status: 'available',
    dailyObjective: 'Feet on the floor at 06:00 AM. Log proof.',
    checkedInToday: false,
    xpReward: 700,
    goldReward: 400,
    titleReward: 'Sun Chaser',
  },
  {
    id: 'dungeon_30day_monarch_code',
    title: 'A-Rank Dungeon: 30-Day Engineering Grimoire',
    description: 'Write, debug, and commit production code or technical study for 30 consecutive days.',
    requiredRank: 'C',
    durationDays: 30,
    currentDay: 0,
    status: 'available',
    dailyObjective: 'At least 1 hour of deep coding or computer science study daily.',
    checkedInToday: false,
    xpReward: 1800,
    goldReward: 1000,
    titleReward: 'Architect of Shadows',
  },
];

// Boss Raid Seed
export const DEFAULT_BOSS_RAID: BossRaid = {
  id: 'boss_week_1',
  bossName: 'Baruka — Warlord of the White Phantoms',
  title: 'Weekly Boss Raid: Crush Procrastination',
  maxHp: 500,
  currentHp: 280,
  weekNumber: 1,
  status: 'active',
  rewardXp: 800,
  rewardGold: 500,
  rewardTitle: 'Slayer of Baruka',
  deadlineDate: new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0],
};

// Initial Titles Seed
export const DEFAULT_TITLES: Title[] = [
  {
    id: 'title_awakened',
    name: 'The Awakened',
    description: 'Given to those who stepped out of mundane comfort and accepted the System.',
    buffDescription: '+5% XP on all daily quests',
    statBonus: { str: 1, int: 1 },
    unlocked: true,
    requirement: 'Accept the System during onboarding.',
  },
  {
    id: 'title_early_riser',
    name: 'Early Riser',
    description: 'Master of the dawn. Awaken before the world stirs.',
    buffDescription: '+10% Gold from morning quests',
    statBonus: { agi: 3 },
    unlocked: false,
    requirement: 'Maintain a 7-day wake up streak.',
  },
  {
    id: 'title_biryani_conqueror',
    name: 'Biryani Sovereign',
    description: 'A warrior whose hunger for real-life feasts is matched only by their iron discipline.',
    buffDescription: '-10% Gold cost on Food Vault rewards',
    unlocked: true,
    requirement: 'Unlock and claim your first gated food reward.',
  },
  {
    id: 'title_iron_will',
    name: 'Iron Will',
    description: 'Unyielding resolution in the face of physical exhaustion.',
    buffDescription: '+10% STR XP gains',
    statBonus: { str: 4, vit: 2 },
    unlocked: false,
    requirement: 'Accumulate 25 STR.',
  },
  {
    id: 'title_shadow_monarch',
    name: 'Shadow Monarch',
    description: 'The supreme ruler who commands legions of forged habits.',
    buffDescription: '+20% XP & Gold on all tasks',
    statBonus: { str: 5, agi: 5, int: 5, vit: 5, sense: 5 },
    unlocked: false,
    requirement: 'Extract 3 Shadows and reach Rank A.',
  },
];

// Initial Skills Seed
export const DEFAULT_SKILLS: Skill[] = [
  {
    id: 'skill_sprint',
    name: 'Sprint: Flow Velocity',
    category: 'passive',
    description: 'Increases the rate of habit completion.',
    statRequirement: { stat: 'agi', value: 12 },
    unlocked: false,
    effect: '+10% AGI quest XP',
  },
  {
    id: 'skill_hyperfocus',
    name: 'Hyperfocus: Ruler’s Mind',
    category: 'passive',
    description: 'Deepened cognitive absorption during focus timers.',
    statRequirement: { stat: 'int', value: 15 },
    unlocked: false,
    effect: '+15% INT XP on timer quests',
  },
  {
    id: 'skill_rulers_authority',
    name: 'Ruler’s Authority',
    category: 'active',
    description: 'Commands the Vault door with telekinetic willpower.',
    statRequirement: { stat: 'sense', value: 14 },
    unlocked: false,
    effect: '10% Gold discount on all Vault rewards',
  },
  {
    id: 'skill_iron_body',
    name: 'Iron Body: Steel Vessel',
    category: 'passive',
    description: 'Reduces the physical toll of fatigue and penalties.',
    statRequirement: { stat: 'vit', value: 16 },
    unlocked: false,
    effect: 'HP loss from missed days reduced by 50%',
  },
  {
    id: 'skill_shadow_extraction',
    name: 'Shadow Extraction',
    category: 'active',
    description: 'Arise! Extract long-standing habits into eternal Shadows.',
    statRequirement: { stat: 'sense', value: 20 },
    unlocked: false,
    effect: 'Converts 21-day habit streaks into permanent Shadows',
  },
];

// Initial Inventory Seed
export const DEFAULT_INVENTORY: InventoryItem[] = [
  {
    id: 'item_xp_boost',
    name: 'Elixir of the Double Moon (2x XP)',
    description: 'Doubles all XP earned from quests for the next 60 minutes.',
    icon: '🧪',
    type: 'xp_boost',
    quantity: 2,
    effectValue: 2,
    durationMinutes: 60,
  },
  {
    id: 'item_streak_shield',
    name: 'Monarch’s Aegis (Streak Shield)',
    description: 'Automatically prevents your daily streak from breaking if you miss a day.',
    icon: '🛡️',
    type: 'streak_shield',
    quantity: 1,
  },
  {
    id: 'item_penalty_skip',
    name: 'Pardon of the System (Penalty Skip)',
    description: 'Instantly dismisses an active Penalty Zone survival quest without HP loss.',
    icon: '📜',
    type: 'penalty_skip',
    quantity: 1,
  },
  {
    id: 'item_reroll_quest',
    name: 'Dice of Fate (Reroll)',
    description: 'Replaces any undesirable daily quest with an alternate objective.',
    icon: '🎲',
    type: 'reroll_quest',
    quantity: 3,
  },
  {
    id: 'item_energy_potion',
    name: 'Vitality Tonic (Full HP/MP)',
    description: 'Restores Discipline (HP) and Focus (MP) to 100%.',
    icon: '🍷',
    type: 'potion',
    quantity: 1,
  },
];

// Initial Shadows Seed
export const DEFAULT_SHADOWS: Shadow[] = [
  {
    id: 'shadow_igris',
    habitName: 'Morning Push-ups & Physical Grind',
    shadowName: 'Shadow Igris (Knight Commander)',
    rank: 'C',
    level: 5,
    currentStreak: 24,
    isDormant: false,
    passiveBuff: '+10% Physical Quest XP',
    extractedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: 'shadow_tank',
    habitName: 'Daily 3L Hydration Protocol',
    shadowName: 'Shadow Tank (Iron Bear)',
    rank: 'D',
    level: 3,
    currentStreak: 21,
    isDormant: false,
    passiveBuff: '+5 HP recovery bonus',
    extractedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
];

// Initial Settings
export const DEFAULT_SETTINGS: AppSettings = {
  soundEnabled: true,
  hapticsEnabled: true,
  scanlinesEnabled: true,
  glowIntensity: 'high',
  language: 'en',
  morningNotificationTime: '06:30',
  eveningNotificationTime: '21:30',
  desktopPhoneFrame: true,
};

// Initial Notifications
export const DEFAULT_NOTIFICATIONS: SystemNotification[] = [
  {
    id: 'notif_welcome',
    title: 'The System',
    header: '[ SYSTEM INITIALIZED ]',
    message: 'Welcome, Player. You have been selected. Complete real-life quests to unlock real-life rewards.',
    type: 'info',
    timestamp: Date.now(),
    read: false,
  },
];

/**
 * Storage Engine
 */
class SystemStorageEngine {
  private get<T>(key: string, fallback: T): T {
    if (typeof window === 'undefined') return fallback;
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch {
      return fallback;
    }
  }

  private set<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Failsafe
    }
  }

  // Player Repository
  public getPlayer(): Player {
    return this.get<Player>(STORAGE_KEYS.PLAYER, DEFAULT_PLAYER);
  }

  public updatePlayer(updater: Partial<Player> | ((prev: Player) => Player)): Player {
    const prev = this.getPlayer();
    const updated = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
    this.set(STORAGE_KEYS.PLAYER, updated);
    return updated;
  }

  // Quests Repository
  public getQuests(): Quest[] {
    return this.get<Quest[]>(STORAGE_KEYS.QUESTS, DEFAULT_QUESTS);
  }

  public saveQuests(quests: Quest[]): void {
    this.set(STORAGE_KEYS.QUESTS, quests);
  }

  // Rewards Repository
  public getRewards(): Reward[] {
    return this.get<Reward[]>(STORAGE_KEYS.REWARDS, DEFAULT_REWARDS);
  }

  public saveRewards(rewards: Reward[]): void {
    this.set(STORAGE_KEYS.REWARDS, rewards);
  }

  public getRewardClaims(): RewardClaimLog[] {
    return this.get<RewardClaimLog[]>(STORAGE_KEYS.REWARD_CLAIMS, [
      {
        id: 'claim_1',
        rewardId: 'reward_biryani',
        rewardTitle: 'Aromatic Chicken/Mutton Biryani',
        goldCost: 150,
        gateQuestTitle: '30 Push-ups + 20 Min Focused Study',
        claimedAt: new Date(Date.now() - 86400000).toISOString(),
        enjoyed: true,
      },
    ]);
  }

  public saveRewardClaims(claims: RewardClaimLog[]): void {
    this.set(STORAGE_KEYS.REWARD_CLAIMS, claims);
  }

  // Dungeons Repository
  public getDungeons(): Dungeon[] {
    return this.get<Dungeon[]>(STORAGE_KEYS.DUNGEONS, DEFAULT_DUNGEONS);
  }

  public saveDungeons(dungeons: Dungeon[]): void {
    this.set(STORAGE_KEYS.DUNGEONS, dungeons);
  }

  // Boss Raid Repository
  public getBossRaid(): BossRaid {
    return this.get<BossRaid>(STORAGE_KEYS.BOSS_RAID, DEFAULT_BOSS_RAID);
  }

  public saveBossRaid(raid: BossRaid): void {
    this.set(STORAGE_KEYS.BOSS_RAID, raid);
  }

  // Titles Repository
  public getTitles(): Title[] {
    return this.get<Title[]>(STORAGE_KEYS.TITLES, DEFAULT_TITLES);
  }

  public saveTitles(titles: Title[]): void {
    this.set(STORAGE_KEYS.TITLES, titles);
  }

  // Skills Repository
  public getSkills(): Skill[] {
    return this.get<Skill[]>(STORAGE_KEYS.SKILLS, DEFAULT_SKILLS);
  }

  public saveSkills(skills: Skill[]): void {
    this.set(STORAGE_KEYS.SKILLS, skills);
  }

  // Inventory Repository
  public getInventory(): InventoryItem[] {
    return this.get<InventoryItem[]>(STORAGE_KEYS.INVENTORY, DEFAULT_INVENTORY);
  }

  public saveInventory(items: InventoryItem[]): void {
    this.set(STORAGE_KEYS.INVENTORY, items);
  }

  // Shadows Repository
  public getShadows(): Shadow[] {
    return this.get<Shadow[]>(STORAGE_KEYS.SHADOWS, DEFAULT_SHADOWS);
  }

  public saveShadows(shadows: Shadow[]): void {
    this.set(STORAGE_KEYS.SHADOWS, shadows);
  }

  // Settings Repository
  public getSettings(): AppSettings {
    return this.get<AppSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  }

  public saveSettings(settings: AppSettings): void {
    this.set(STORAGE_KEYS.SETTINGS, settings);
  }

  // XP Events
  public getXpEvents(): XpEvent[] {
    return this.get<XpEvent[]>(STORAGE_KEYS.XP_EVENTS, [
      {
        id: 'xp_1',
        timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
        amount: 80,
        gold: 48,
        reason: 'Daily conditioning clear',
        category: 'str',
      },
      {
        id: 'xp_2',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        amount: 120,
        gold: 72,
        reason: 'Mastery focus block',
        category: 'int',
      },
    ]);
  }

  public logXpEvent(event: Omit<XpEvent, 'id' | 'timestamp'>): void {
    const events = this.getXpEvents();
    events.unshift({
      ...event,
      id: `xp_${Date.now()}`,
      timestamp: new Date().toISOString(),
    });
    this.set(STORAGE_KEYS.XP_EVENTS, events.slice(0, 100)); // retain last 100
  }

  // Notifications Repository
  public getNotifications(): SystemNotification[] {
    return this.get<SystemNotification[]>(STORAGE_KEYS.NOTIFICATIONS, DEFAULT_NOTIFICATIONS);
  }

  public addNotification(notif: Omit<SystemNotification, 'id' | 'timestamp' | 'read'>): SystemNotification {
    const list = this.getNotifications();
    const created: SystemNotification = {
      ...notif,
      id: `notif_${Date.now()}`,
      timestamp: Date.now(),
      read: false,
    };
    list.unshift(created);
    this.set(STORAGE_KEYS.NOTIFICATIONS, list.slice(0, 50));
    return created;
  }

  public markNotificationsRead(): void {
    const list = this.getNotifications().map((n) => ({ ...n, read: true }));
    this.set(STORAGE_KEYS.NOTIFICATIONS, list);
  }

  /**
   * Atomic XP/Gold gain with automatic level up & rank promotion handling
   */
  public addXpAndGold(
    xp: number,
    gold: number,
    category: Player['stats'] extends infer T ? keyof T : 'str',
    reason: string
  ): { player: Player; leveledUp: boolean; newLevel: number; promoted: boolean; newRank: Player['rank'] } {
    let player = this.getPlayer();
    const prevLevel = player.level;
    let currentXp = player.currentXp + xp;
    let level = player.level;
    let statPoints = player.statPoints;
    let leveledUp = false;

    // Check multiple level ups if huge XP
    while (currentXp >= xpNeededForLevel(level)) {
      currentXp -= xpNeededForLevel(level);
      level += 1;
      statPoints += 5;
      leveledUp = true;
    }

    const { promoted, newRank } = checkRankPromotion(prevLevel, level);

    player = {
      ...player,
      level,
      currentXp,
      gold: player.gold + gold,
      statPoints,
      rank: newRank,
      hp: leveledUp ? player.maxHp : player.hp,
      mp: leveledUp ? player.maxMp : player.mp,
    };

    this.updatePlayer(player);
    this.logXpEvent({ amount: xp, gold, category, reason });

    // Check skill unlocks if stats changed
    this.checkSkillUnlocks(player.stats);

    // If promoted, auto-create promotion quest
    if (promoted) {
      const quests = this.getQuests();
      const promoQuest = createPromotionQuest(newRank);
      quests.unshift(promoQuest);
      this.saveQuests(quests);
      this.addNotification({
        title: 'Promotion Quest',
        header: '[ PROMOTION ALERT ]',
        message: `Rank ${newRank} threshold reached! Complete the promotion trial to formalize your ascension.`,
        type: 'promotion',
      });
    }

    // Damage Boss Raid if active
    if (xp > 0) {
      const boss = this.getBossRaid();
      if (boss && boss.status === 'active') {
        const dmg = Math.max(5, Math.round(xp * 0.4));
        const newHp = Math.max(0, boss.currentHp - dmg);
        this.saveBossRaid({
          ...boss,
          currentHp: newHp,
          status: newHp === 0 ? 'defeated' : 'active',
        });
      }
    }

    return { player, leveledUp, newLevel: level, promoted, newRank };
  }

  /**
   * Check and unlock skills when player stats increase
   */
  public checkSkillUnlocks(stats: Player['stats']): void {
    const skills = this.getSkills();
    let updated = false;
    const modified = skills.map((skill) => {
      if (!skill.unlocked && stats[skill.statRequirement.stat] >= skill.statRequirement.value) {
        updated = true;
        this.addNotification({
          title: 'Skill Unlocked',
          header: '[ SKILL AWAKENED ]',
          message: `You unlocked the ${skill.name} skill! Passive effect activated.`,
          type: 'info',
        });
        return { ...skill, unlocked: true };
      }
      return skill;
    });
    if (updated) {
      this.saveSkills(modified);
    }
  }

  /**
   * Midnight / Sleep Rollover Logic
   * Evaluates yesterday's completion rate, applies penalties, updates streaks, and regenerates dailies.
   */
  public performRolloverCheck(): { rolledOver: boolean; penaltyApplied: boolean; message?: string } {
    const player = this.getPlayer();
    const today = new Date().toISOString().split('T')[0];

    if (player.lastActiveDate === today) {
      return { rolledOver: false, penaltyApplied: false };
    }

    // Rollover has occurred!
    const quests = this.getQuests();
    const evalResult = evaluateDailyCompletion(quests);
    let penaltyApplied = false;
    let message = '';

    const inventory = this.getInventory();
    const streakShield = inventory.find((i) => i.type === 'streak_shield' && i.quantity > 0);

    let newStreak = player.streakDays;
    let newBestStreak = player.bestStreak;
    let newHp = player.hp;
    let newGold = player.gold;
    let isPenalized = player.isPenalized;

    if (evalResult.isPassing) {
      // Completed >= 80%
      newStreak += 1;
      if (newStreak > newBestStreak) {
        newBestStreak = newStreak;
      }
      // Check if any habit hit 21 days for Shadow Army extraction!
      this.checkShadowExtraction(newStreak);
    } else {
      // Failed daily criteria
      if (streakShield) {
        // Shield used!
        streakShield.quantity -= 1;
        this.saveInventory(inventory);
        message = 'Streak Shield consumed. Your streak was protected from reset.';
      } else {
        // Apply strictness penalty
        const penaltyInfo = STRICTNESS_SETTINGS[player.strictness];
        newHp = Math.max(0, newHp - penaltyInfo.hpLoss);
        const goldLost = Math.round(newGold * penaltyInfo.goldLossPct);
        newGold = Math.max(0, newGold - goldLost);

        if (player.strictness === 'monarch') {
          newStreak = 0;
        } else if (player.strictness === 'hunter') {
          newStreak = Math.max(0, newStreak - 1);
        }

        penaltyApplied = true;
        isPenalized = true;

        // Auto-spawn Penalty Zone quest
        const penaltyQuest = createPenaltyQuest(player.strictness);
        quests.unshift(penaltyQuest);

        message = `Daily criteria missed. Penalty applied: -${penaltyInfo.hpLoss} HP, -${goldLost} Gold. Penalty Zone survival quest active.`;
        this.addNotification({
          title: 'Penalty Zone',
          header: '[ PENALTY ZONE ENGAGED ]',
          message,
          type: 'penalty',
        });
      }
    }

    // Reset dailies for today
    const updatedQuests = quests.map((q) => {
      if (q.isDaily) {
        return {
          ...q,
          completed: false,
          currentCount: 0,
          timerRemainingSeconds: (q.timerMinutes || 25) * 60,
          timerRunning: false,
          checklist: q.checklist?.map((c) => ({ ...c, completed: false })),
        };
      }
      return q;
    });

    this.saveQuests(updatedQuests);

    this.updatePlayer({
      lastActiveDate: today,
      streakDays: newStreak,
      bestStreak: newBestStreak,
      hp: newHp,
      gold: newGold,
      isPenalized,
    });

    return { rolledOver: true, penaltyApplied, message };
  }

  /**
   * Shadow extraction when a habit reaches 21 days
   */
  private checkShadowExtraction(streak: number): void {
    if (streak >= 21) {
      const shadows = this.getShadows();
      const shadowNames = ['Shadow Iron (Iron Berserker)', 'Shadow Beru (Ant King)', 'Shadow Tusk (High Shaman)'];
      const unextracted = shadowNames.find((name) => !shadows.some((s) => s.shadowName === name));
      if (unextracted) {
        shadows.push({
          id: `shadow_${Date.now()}`,
          habitName: `Consecutive Grind (${streak} Days)`,
          shadowName: unextracted,
          rank: 'B',
          level: 1,
          currentStreak: streak,
          isDormant: false,
          passiveBuff: '+15% Habit Discipline & +10% Gold',
          extractedAt: new Date().toISOString(),
        });
        this.saveShadows(shadows);
        this.addNotification({
          title: 'Shadow Extraction',
          header: '[ SHADOW EXTRACTION ]',
          message: `Arise! A new Shadow has answered your call: ${unextracted}.`,
          type: 'level_up',
        });
      }
    }
  }

  /**
   * Export all user data as formatted JSON
   */
  public exportDataJson(): string {
    const data = {
      player: this.getPlayer(),
      quests: this.getQuests(),
      rewards: this.getRewards(),
      rewardClaims: this.getRewardClaims(),
      dungeons: this.getDungeons(),
      bossRaid: this.getBossRaid(),
      titles: this.getTitles(),
      skills: this.getSkills(),
      inventory: this.getInventory(),
      shadows: this.getShadows(),
      settings: this.getSettings(),
      xpEvents: this.getXpEvents(),
      exportedAt: new Date().toISOString(),
      version: '1.0.0',
    };
    return JSON.stringify(data, null, 2);
  }

  /**
   * Import data from JSON backup
   */
  public importDataJson(jsonStr: string): boolean {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.player) this.set(STORAGE_KEYS.PLAYER, parsed.player);
      if (parsed.quests) this.set(STORAGE_KEYS.QUESTS, parsed.quests);
      if (parsed.rewards) this.set(STORAGE_KEYS.REWARDS, parsed.rewards);
      if (parsed.rewardClaims) this.set(STORAGE_KEYS.REWARD_CLAIMS, parsed.rewardClaims);
      if (parsed.dungeons) this.set(STORAGE_KEYS.DUNGEONS, parsed.dungeons);
      if (parsed.bossRaid) this.set(STORAGE_KEYS.BOSS_RAID, parsed.bossRaid);
      if (parsed.titles) this.set(STORAGE_KEYS.TITLES, parsed.titles);
      if (parsed.skills) this.set(STORAGE_KEYS.SKILLS, parsed.skills);
      if (parsed.inventory) this.set(STORAGE_KEYS.INVENTORY, parsed.inventory);
      if (parsed.shadows) this.set(STORAGE_KEYS.SHADOWS, parsed.shadows);
      if (parsed.settings) this.set(STORAGE_KEYS.SETTINGS, parsed.settings);
      if (parsed.xpEvents) this.set(STORAGE_KEYS.XP_EVENTS, parsed.xpEvents);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Reset everything to factory defaults
   */
  public resetToFactory(): void {
    if (typeof window === 'undefined') return;
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
  }
}

export const db = new SystemStorageEngine();
