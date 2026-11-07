/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
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
} from './types';
import { db, DEFAULT_PLAYER } from './db/storage';
import { sound } from './utils/audio';
import { getRandomSystemMessage } from './utils/systemMessages';
import { MobileHeader } from './components/common/MobileHeader';
import { BottomTabBar, TabKey } from './components/common/BottomTabBar';
import { LevelUpOverlay } from './components/common/LevelUpOverlay';
import { BonusChestModal } from './components/common/BonusChestModal';
import { SystemNotificationModal } from './components/common/SystemNotificationModal';
import { CinematicOnboarding } from './components/onboarding/CinematicOnboarding';
import { StatusWindow } from './components/status/StatusWindow';
import { QuestsView } from './components/quests/QuestsView';
import { RewardVaultView } from './components/vault/RewardVaultView';
import { DungeonsView } from './components/dungeons/DungeonsView';
import { ArsenalView } from './components/arsenal/ArsenalView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { SettingsView } from './components/settings/SettingsView';
import { PWAInstallButton } from './components/pwa/PWAInstallButton';
import { Smartphone, Monitor } from 'lucide-react';

export default function App() {
  // Database Entities
  const [player, setPlayer] = useState<Player>(() => db.getPlayer());
  const [quests, setQuests] = useState<Quest[]>(() => db.getQuests());
  const [rewards, setRewards] = useState<Reward[]>(() => db.getRewards());
  const [rewardClaims, setRewardClaims] = useState<RewardClaimLog[]>(() => db.getRewardClaims());
  const [dungeons, setDungeons] = useState<Dungeon[]>(() => db.getDungeons());
  const [bossRaid, setBossRaid] = useState<BossRaid>(() => db.getBossRaid());
  const [titles, setTitles] = useState<Title[]>(() => db.getTitles());
  const [skills, setSkills] = useState<Skill[]>(() => db.getSkills());
  const [inventory, setInventory] = useState<InventoryItem[]>(() => db.getInventory());
  const [shadows, setShadows] = useState<Shadow[]>(() => db.getShadows());
  const [settings, setSettings] = useState<AppSettings>(() => db.getSettings());
  const [notifications, setNotifications] = useState<SystemNotification[]>(() => db.getNotifications());
  const [xpEvents, setXpEvents] = useState<XpEvent[]>(() => db.getXpEvents());

  // UI Navigation & Modals
  const [activeTab, setActiveTab] = useState<TabKey>('status');
  const [isOnboarding, setIsOnboarding] = useState<boolean>(() => {
    // If player has never completed onboarding, show intro
    return !localStorage.getItem('system_player_v1');
  });

  const [levelUpModalOpen, setLevelUpModalOpen] = useState(false);
  const [bonusChestModalOpen, setBonusChestModalOpen] = useState(false);
  const [systemNotificationModal, setSystemNotificationModal] = useState<{
    isOpen: boolean;
    header: string;
    message: string;
    type: 'info' | 'warning' | 'level_up' | 'reward' | 'penalty' | 'promotion';
  }>({
    isOpen: false,
    header: '',
    message: '',
    type: 'info',
  });

  // Desktop Phone Frame simulator toggle
  const [phoneFrameActive, setPhoneFrameActive] = useState<boolean>(() => {
    return settings.desktopPhoneFrame;
  });

  // Sync sound setting on load
  useEffect(() => {
    sound.setEnabled(settings.soundEnabled);
  }, [settings.soundEnabled]);

  const handleToggleSound = () => {
    const nextVal = !settings.soundEnabled;
    sound.setEnabled(nextVal);
    const updatedSettings = { ...settings, soundEnabled: nextVal };
    db.saveSettings(updatedSettings);
    setSettings(updatedSettings);
  };

  // Initial rollover check on app start
  useEffect(() => {
    const rolloverResult = db.performRolloverCheck();
    if (rolloverResult.rolledOver) {
      setPlayer(db.getPlayer());
      setQuests(db.getQuests());
      if (rolloverResult.penaltyApplied) {
        setSystemNotificationModal({
          isOpen: true,
          header: '[ SYSTEM ROLLOVER AUDIT ]',
          message:
            rolloverResult.message ||
            'Daily criteria was not met. Penalty applied and Survival Quest initiated.',
          type: 'penalty',
        });
      }
    }
  }, []);

  // ----------------------------------------------------
  // QUEST HANDLERS
  // ----------------------------------------------------
  const handleCompleteQuest = (questId: string) => {
    const target = quests.find((q) => q.id === questId);
    if (!target) return;

    // Check if this is a gate quest for a reward!
    if (target.isGateQuest && target.targetRewardId) {
      const reward = rewards.find((r) => r.id === target.targetRewardId);
      if (reward) {
        handleUnlockReward(reward);
      }
    }

    // Award XP and Gold
    const { player: updatedPlayer, leveledUp } = db.addXpAndGold(
      target.xpReward,
      target.goldReward,
      target.category,
      `Completed: ${target.title}`
    );

    // Update quest as completed
    const updatedQuests = quests.map((q) =>
      q.id === questId ? { ...q, completed: true, completedAt: new Date().toISOString() } : q
    );
    db.saveQuests(updatedQuests);

    setPlayer(updatedPlayer);
    setQuests(updatedQuests);
    setBossRaid(db.getBossRaid());
    setXpEvents(db.getXpEvents());

    // Check if all dailies completed
    const dailies = updatedQuests.filter((q) => q.isDaily && !q.isPenalty && !q.isGateQuest);
    if (dailies.length > 0 && dailies.every((q) => q.completed)) {
      setBonusChestModalOpen(true);
    }

    // Level up trigger
    if (leveledUp) {
      setLevelUpModalOpen(true);
    }
  };

  const handleUpdateQuest = (updated: Quest) => {
    const updatedList = quests.map((q) => (q.id === updated.id ? updated : q));
    db.saveQuests(updatedList);
    setQuests(updatedList);
  };

  const handleAddQuest = (newQuest: Quest) => {
    const updatedList = [newQuest, ...quests];
    db.saveQuests(updatedList);
    setQuests(updatedList);
  };

  const handleDeleteQuest = (questId: string) => {
    const updatedList = quests.filter((q) => q.id !== questId);
    db.saveQuests(updatedList);
    setQuests(updatedList);
  };

  // ----------------------------------------------------
  // TASK-GATED REAL-LIFE REWARD VAULT HANDLERS (§1 & §4.4)
  // ----------------------------------------------------
  const handleInitiateGateQuest = (
    reward: Reward,
    gateQuestTitle: string,
    gateQuestDesc: string
  ) => {
    // 1. Create the associated Gate Quest
    const gateQuest: Quest = {
      id: `gate_${reward.id}_${Date.now()}`,
      title: `[GATE QUEST] ${gateQuestTitle}`,
      description: `Complete to unlock real-life reward: ${reward.title}. ${gateQuestDesc}`,
      category: 'str',
      difficulty: 'C',
      xpReward: 35,
      goldReward: 0, // Gate quest earns reward unlock rather than gold
      type: 'checkbox',
      completed: false,
      isDaily: false,
      isGateQuest: true,
      targetRewardId: reward.id,
    };

    // 2. Add Gate Quest to Quests list
    const updatedQuests = [gateQuest, ...quests];
    db.saveQuests(updatedQuests);
    setQuests(updatedQuests);

    // 3. Update Reward status to 'gate_active'
    const updatedRewards = rewards.map((r) =>
      r.id === reward.id ? { ...r, status: 'gate_active' as const, activeGateQuestId: gateQuest.id } : r
    );
    db.saveRewards(updatedRewards);
    setRewards(updatedRewards);

    // 4. Cold System notification
    const msg = getRandomSystemMessage('rewardGateAssigned', settings.language);
    setSystemNotificationModal({
      isOpen: true,
      header: msg.header,
      message: `${msg.text} Objective: "${gateQuestTitle}".`,
      type: 'info',
    });
  };

  const handleUnlockReward = (reward: Reward) => {
    // 1. Deduct Gold atomically
    const newGold = Math.max(0, player.gold - reward.goldCost);
    const updatedPlayer = db.updatePlayer({ gold: newGold });
    setPlayer(updatedPlayer);

    // 2. Start Claim Window countdown timer
    const claimWindowMs = reward.claimWindowMinutes * 60 * 1000;
    const endTimestamp = Date.now() + claimWindowMs;

    const updatedRewards = rewards.map((r) =>
      r.id === reward.id
        ? {
            ...r,
            status: 'unlocked' as const,
            claimWindowEndTimestamp: endTimestamp,
          }
        : r
    );
    db.saveRewards(updatedRewards);
    setRewards(updatedRewards);

    sound.playRewardUnlock();

    // 3. System Unlocked Announcement
    const msg = getRandomSystemMessage('rewardUnlocked', settings.language);
    setSystemNotificationModal({
      isOpen: true,
      header: msg.header,
      message: `${msg.text} Reward: "${reward.title}". Duration: ${reward.claimWindowMinutes}m.`,
      type: 'reward',
    });
  };

  const handleMarkRewardEnjoyed = (reward: Reward) => {
    sound.playQuestComplete();

    // 1. Log to Claim History
    const claims = db.getRewardClaims();
    const newClaim: RewardClaimLog = {
      id: `claim_${Date.now()}`,
      rewardId: reward.id,
      rewardTitle: reward.title,
      goldCost: reward.goldCost,
      gateQuestTitle: reward.defaultGateQuestTitle || 'Gate Trial Completed',
      claimedAt: new Date().toISOString(),
      enjoyed: true,
    };
    claims.unshift(newClaim);
    db.saveRewardClaims(claims);
    setRewardClaims(claims);

    // 2. Set reward back to locked (or cooldown)
    const updatedRewards = rewards.map((r) =>
      r.id === reward.id
        ? {
            ...r,
            status: 'locked' as const,
            claimWindowEndTimestamp: undefined,
            totalClaimsCount: r.totalClaimsCount + 1,
            lastClaimedAt: new Date().toISOString(),
          }
        : r
    );
    db.saveRewards(updatedRewards);
    setRewards(updatedRewards);

    // Remove gate quest if present
    const updatedQuests = quests.filter((q) => !(q.isGateQuest && q.targetRewardId === reward.id));
    db.saveQuests(updatedQuests);
    setQuests(updatedQuests);
  };

  const handleAddReward = (newReward: Reward) => {
    const updated = [newReward, ...rewards];
    db.saveRewards(updated);
    setRewards(updated);
  };

  // ----------------------------------------------------
  // DUNGEON & BOSS RAID HANDLERS
  // ----------------------------------------------------
  const handleCheckInDungeon = (dungeonId: string) => {
    const updated = dungeons.map((d) => {
      if (d.id === dungeonId) {
        const nextDay = d.currentDay + 1;
        const isCompleted = nextDay >= d.durationDays;
        if (isCompleted) {
          // Dungeon cleared!
          db.addXpAndGold(d.xpReward, d.goldReward, 'str', `Dungeon Conquered: ${d.title}`);
          setPlayer(db.getPlayer());
        }
        return {
          ...d,
          currentDay: nextDay,
          checkedInToday: true,
          status: isCompleted ? ('completed' as const) : d.status,
        };
      }
      return d;
    });
    db.saveDungeons(updated);
    setDungeons(updated);
  };

  const handleEnterDungeon = (dungeonId: string) => {
    const updated = dungeons.map((d) =>
      d.id === dungeonId ? { ...d, status: 'in_progress' as const, currentDay: 1, checkedInToday: true } : d
    );
    db.saveDungeons(updated);
    setDungeons(updated);
  };

  const handleAttackBoss = () => {
    if (!bossRaid || bossRaid.currentHp <= 0) return;
    sound.playQuestComplete();
    const newHp = Math.max(0, bossRaid.currentHp - 25);
    const isDefeated = newHp === 0;

    const updatedRaid: BossRaid = {
      ...bossRaid,
      currentHp: newHp,
      status: isDefeated ? 'defeated' : 'active',
    };
    db.saveBossRaid(updatedRaid);
    setBossRaid(updatedRaid);

    if (isDefeated) {
      db.addXpAndGold(bossRaid.rewardXp, bossRaid.rewardGold, 'sense', `Boss Raid Victory: ${bossRaid.bossName}`);
      setPlayer(db.getPlayer());
      setSystemNotificationModal({
        isOpen: true,
        header: '[ CALAMITY CONQUERED ]',
        message: `Boss Raid Complete! ${bossRaid.bossName} has been slain. You earned +${bossRaid.rewardXp} EXP and +${bossRaid.rewardGold} Gold!`,
        type: 'level_up',
      });
    }
  };

  // ----------------------------------------------------
  // ARSENAL HANDLERS
  // ----------------------------------------------------
  const handleEquipTitle = (title: Title) => {
    const updatedPlayer = db.updatePlayer({
      title: title.name,
      equippedTitleId: title.id,
    });
    setPlayer(updatedPlayer);
  };

  const handleUseItem = (item: InventoryItem) => {
    const updatedInv = inventory.map((inv) =>
      inv.id === item.id ? { ...inv, quantity: Math.max(0, inv.quantity - 1) } : inv
    );
    db.saveInventory(updatedInv);
    setInventory(updatedInv);

    if (item.type === 'potion') {
      const updatedPlayer = db.updatePlayer({ hp: player.maxHp, mp: player.maxMp });
      setPlayer(updatedPlayer);
    } else if (item.type === 'penalty_skip') {
      const updatedPlayer = db.updatePlayer({ isPenalized: false });
      setPlayer(updatedPlayer);
      const updatedQuests = quests.filter((q) => !q.isPenalty);
      db.saveQuests(updatedQuests);
      setQuests(updatedQuests);
    }
  };

  // ----------------------------------------------------
  // STAT ALLOCATION HANDLERS
  // ----------------------------------------------------
  const handleAllocateStat = (statKey: Player['stats'] extends infer T ? keyof T : 'str') => {
    if (player.statPoints <= 0) return;
    const updated = db.updatePlayer({
      statPoints: player.statPoints - 1,
      stats: {
        ...player.stats,
        [statKey]: player.stats[statKey] + 1,
      },
    });
    setPlayer(updated);
    setSkills(db.getSkills());
  };

  // ----------------------------------------------------
  // EXPORT / IMPORT / RESET
  // ----------------------------------------------------
  const handleExportData = () => {
    sound.playButtonTick();
    const json = db.exportDataJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system_data_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (jsonStr: string) => {
    const success = db.importDataJson(jsonStr);
    if (success) {
      sound.playLevelUp();
      setPlayer(db.getPlayer());
      setQuests(db.getQuests());
      setRewards(db.getRewards());
      setRewardClaims(db.getRewardClaims());
      setDungeons(db.getDungeons());
      setBossRaid(db.getBossRaid());
      setTitles(db.getTitles());
      setSkills(db.getSkills());
      setInventory(db.getInventory());
      setShadows(db.getShadows());
      setSettings(db.getSettings());
      setSystemNotificationModal({
        isOpen: true,
        header: '[ DATA RESTORED ]',
        message: 'System database successfully synchronized from backup archive.',
        type: 'info',
      });
    } else {
      sound.playWarning();
      alert('Invalid System backup JSON.');
    }
  };

  const handleResetFactory = () => {
    db.resetToFactory();
    setPlayer(DEFAULT_PLAYER);
    setIsOnboarding(true);
  };

  const handleClaimChest = (gold: number, item?: string) => {
    const updatedPlayer = db.updatePlayer({ gold: player.gold + gold });
    if (item) {
      const inv = db.getInventory();
      const existing = inv.find((i) => i.name.toLowerCase().includes(item.toLowerCase()));
      if (existing) {
        existing.quantity += 1;
        db.saveInventory(inv);
        setInventory(inv);
      }
    }
    setPlayer(updatedPlayer);
    setBonusChestModalOpen(false);
  };

  // Unclaimed dailies count for badge
  const unclaimedDailiesCount = quests.filter((q) => q.isDaily && !q.completed).length;
  const activeGateRewardCount = rewards.filter((r) => r.status === 'gate_active' || r.status === 'unlocked').length;

  return (
    <div className="min-h-screen bg-[#03060c] text-slate-100 flex flex-col items-center justify-start relative select-none">
      {/* CRT Scanline overlay if enabled */}
      {settings.scanlinesEnabled && (
        <div className="fixed inset-0 pointer-events-none z-50 scanlines-overlay opacity-30" />
      )}

      {/* Top Desktop Controls Bar (Simulator Switcher & PWA) */}
      <aside aria-label="Device simulation toolbar" className="w-full bg-[#050810] border-b border-white/10 px-4 py-1.5 flex items-center justify-between text-xs text-slate-400 z-40">
        <div className="flex items-center gap-3">
          <span className="font-orbitron text-[10px] text-[#2D9CFF] font-bold tracking-widest hidden sm:inline">
            [ SYSTEM PROTOCOL: HUNTER EDITION ]
          </span>
          <PWAInstallButton />
        </div>

        <div className="flex items-center gap-2">
          {/* Phone Frame vs Fullscreen view toggle on larger screens */}
          <button
            onClick={() => {
              sound.playButtonTick();
              const nextVal = !phoneFrameActive;
              setPhoneFrameActive(nextVal);
              db.saveSettings({ ...settings, desktopPhoneFrame: nextVal });
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xs bg-white/5 border border-white/10 text-slate-300 hover:text-white text-[10px] font-orbitron"
          >
            {phoneFrameActive ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-[#2D9CFF]" /> FULL VIEW
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-[#2D9CFF]" /> MOBILE FRAME
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Main View Container (responsive mobile canvas or framed mobile viewport) */}
      <main
        className={`w-full transition-all duration-300 flex-1 flex flex-col ${
          phoneFrameActive
            ? 'max-w-[440px] my-0 sm:my-4 sm:rounded-2xl border-0 sm:border sm:border-[#2D9CFF]/30 shadow-[0_0_50px_rgba(45,156,255,0.15)] bg-[#050810] overflow-hidden'
            : 'max-w-3xl my-0 sm:my-2 bg-[#050810]'
        }`}
      >
        {/* Mobile App Header */}
        <MobileHeader
          player={player}
          unreadCount={notifications.filter((n) => !n.read).length}
          soundEnabled={settings.soundEnabled}
          onToggleSound={handleToggleSound}
          onOpenNotifications={() => {
            db.markNotificationsRead();
            setNotifications(db.getNotifications());
            const latest = notifications[0];
            if (latest) {
              setSystemNotificationModal({
                isOpen: true,
                header: latest.header,
                message: latest.message,
                type: latest.type,
              });
            }
          }}
        />

        {/* Content View Routing based on activeTab */}
        <div className="flex-1 p-3.5 overflow-y-auto">
          {activeTab === 'status' && (
            <StatusWindow
              player={player}
              quests={quests}
              onAllocateStat={handleAllocateStat}
              onNavigateToQuests={() => setActiveTab('quests')}
              onNavigateToVault={() => setActiveTab('vault')}
            />
          )}

          {activeTab === 'quests' && (
            <QuestsView
              player={player}
              quests={quests}
              onCompleteQuest={handleCompleteQuest}
              onUpdateQuest={handleUpdateQuest}
              onAddQuest={handleAddQuest}
              onDeleteQuest={handleDeleteQuest}
              onTriggerChest={() => setBonusChestModalOpen(true)}
            />
          )}

          {activeTab === 'vault' && (
            <RewardVaultView
              player={player}
              rewards={rewards}
              quests={quests}
              rewardClaims={rewardClaims}
              onInitiateGateQuest={handleInitiateGateQuest}
              onCompleteGateQuest={(reward) => handleUnlockReward(reward)}
              onMarkEnjoyed={handleMarkRewardEnjoyed}
              onAddReward={handleAddReward}
              onNavigateToQuests={() => setActiveTab('quests')}
            />
          )}

          {activeTab === 'dungeons' && (
            <DungeonsView
              player={player}
              dungeons={dungeons}
              bossRaid={bossRaid}
              onCheckInDungeon={handleCheckInDungeon}
              onEnterDungeon={handleEnterDungeon}
              onAttackBoss={handleAttackBoss}
            />
          )}

          {activeTab === 'arsenal' && (
            <ArsenalView
              player={player}
              titles={titles}
              skills={skills}
              inventory={inventory}
              shadows={shadows}
              onEquipTitle={handleEquipTitle}
              onUseItem={handleUseItem}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView
              player={player}
              quests={quests}
              xpEvents={xpEvents}
              rewardClaims={rewardClaims}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              player={player}
              settings={settings}
              onUpdateSettings={(s) => {
                db.saveSettings(s);
                setSettings(s);
              }}
              onUpdatePlayer={(p) => {
                const updated = db.updatePlayer(p);
                setPlayer(updated);
              }}
              onExportData={handleExportData}
              onImportData={handleImportData}
              onResetFactory={handleResetFactory}
            />
          )}
        </div>

        {/* Bottom Mobile Tab Bar */}
        <BottomTabBar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          activeGateRewardCount={activeGateRewardCount}
          unclaimedDailiesCount={unclaimedDailiesCount}
        />
      </main>

      {/* Global Modals */}
      {/* 1. Cinematic Onboarding Flow */}
      {isOnboarding && (
        <CinematicOnboarding
          onComplete={(newPlayer) => {
            db.updatePlayer(newPlayer);
            setPlayer(newPlayer);
            setIsOnboarding(false);
          }}
        />
      )}

      {/* 2. Fullscreen Level Up Burst & Stat Allocation Overlay */}
      <LevelUpOverlay
        isOpen={levelUpModalOpen}
        player={player}
        onConfirm={(updated) => {
          db.updatePlayer(updated);
          setPlayer(updated);
          setLevelUpModalOpen(false);
        }}
      />

      {/* 3. Daily All-Clear Bonus Chest */}
      <BonusChestModal
        isOpen={bonusChestModalOpen}
        onClaim={handleClaimChest}
      />

      {/* 4. Solo Leveling System Notification Dialog */}
      <SystemNotificationModal
        isOpen={systemNotificationModal.isOpen}
        header={systemNotificationModal.header}
        message={systemNotificationModal.message}
        type={systemNotificationModal.type}
        onConfirm={() =>
          setSystemNotificationModal((prev) => ({ ...prev, isOpen: false }))
        }
      />
    </div>
  );
}
