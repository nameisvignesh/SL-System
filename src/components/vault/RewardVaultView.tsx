import React, { useState, useEffect } from 'react';
import { Player, Quest, Reward, RewardClaimLog } from '../../types';
import { sound } from '../../utils/audio';
import { hapticSuccess, hapticTick, hapticWarning } from '../../utils/haptics';
import { SystemWindow } from '../common/SystemWindow';
import { GlowButton } from '../common/GlowButton';
import {
  Lock,
  Unlock,
  Clock,
  Sparkles,
  Coins,
  PlusCircle,
  History,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Flame,
} from 'lucide-react';

interface RewardVaultViewProps {
  player: Player;
  rewards: Reward[];
  quests: Quest[];
  rewardClaims: RewardClaimLog[];
  onInitiateGateQuest: (reward: Reward, gateQuestTitle: string, gateQuestDesc: string) => void;
  onCompleteGateQuest: (reward: Reward) => void;
  onMarkEnjoyed: (reward: Reward) => void;
  onAddReward: (reward: Reward) => void;
  onNavigateToQuests: () => void;
}

export const RewardVaultView: React.FC<RewardVaultViewProps> = ({
  player,
  rewards,
  quests,
  rewardClaims,
  onInitiateGateQuest,
  onCompleteGateQuest,
  onMarkEnjoyed,
  onAddReward,
  onNavigateToQuests,
}) => {
  const [selectedRewardForGate, setSelectedRewardForGate] = useState<Reward | null>(null);
  const [customGateTitle, setCustomGateTitle] = useState('');
  const [customGateDesc, setCustomGateDesc] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [insufficientGoldReward, setInsufficientGoldReward] = useState<Reward | null>(null);

  // New reward form
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newEmoji, setNewEmoji] = useState('🍛');
  const [newCost, setNewCost] = useState(100);
  const [newCategory, setNewCategory] = useState<Reward['category']>('food');
  const [newWindowMinutes, setNewWindowMinutes] = useState(120);

  // Periodic tick for countdowns
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const activeUnlockedRewards = rewards.filter(
    (r) => r.status === 'unlocked' && r.claimWindowEndTimestamp && r.claimWindowEndTimestamp > now
  );

  const formatCountdown = (targetMs: number) => {
    const diff = Math.max(0, targetMs - now);
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  };

  const handleStartGateSelection = (reward: Reward) => {
    sound.playButtonTick();
    hapticTick();

    // Check Gold balance
    if (player.gold < reward.goldCost) {
      sound.playWarning();
      hapticWarning();
      setInsufficientGoldReward(reward);
      return;
    }

    setSelectedRewardForGate(reward);
    setCustomGateTitle(reward.defaultGateQuestTitle || '30 Push-ups + 20 Min Focused Study');
    setCustomGateDesc(reward.defaultGateQuestDescription || 'Discipline toll required to earn this reward.');
  };

  const handleConfirmGateQuest = () => {
    if (!selectedRewardForGate) return;
    sound.playSystemDing();
    hapticTick();
    onInitiateGateQuest(selectedRewardForGate, customGateTitle, customGateDesc);
    setSelectedRewardForGate(null);
  };

  const handleCreateNewReward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const reward: Reward = {
      id: `reward_${Date.now()}`,
      title: newTitle.trim(),
      description: newDesc.trim() || 'A real-life indulgence granted upon discipline fulfillment.',
      emoji: newEmoji || '⭐',
      goldCost: newCost,
      category: newCategory,
      status: 'locked',
      claimWindowMinutes: newWindowMinutes,
      cooldownHours: 24,
      defaultGateQuestTitle: '30 Reps + 20 Min Deep Focus',
      defaultGateQuestDescription: 'Clear the toll of effort before enjoying.',
      totalClaimsCount: 0,
    };

    onAddReward(reward);
    setShowAddModal(false);
    setNewTitle('');
    setNewDesc('');
    sound.playSystemDing();
    hapticTick();
  };

  const templates: { emoji: string; title: string; cost: number; cat: Reward['category'] }[] = [
    { emoji: '🍛', title: 'Aromatic Biryani Feast', cost: 150, cat: 'food' },
    { emoji: '🍕', title: 'Pizza Slice & Cheesy Garlic Bread', cost: 120, cat: 'food' },
    { emoji: '🎮', title: '1 Hour Immersive Gaming', cost: 100, cat: 'entertainment' },
    { emoji: '🎬', title: 'Watch 2 Anime Episodes', cost: 90, cat: 'entertainment' },
    { emoji: '📱', title: '30 Min Social Media Scroll', cost: 60, cat: 'social' },
    { emoji: '☕', title: 'Artisan Cafe Coffee Treat', cost: 80, cat: 'food' },
    { emoji: '😴', title: '45 Min Restorative Power Nap', cost: 75, cat: 'rest' },
    { emoji: '📚', title: 'Offline Book / Manga Purchase', cost: 200, cat: 'offline_treat' },
  ];

  return (
    <div className="space-y-4 pb-24">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-orbitron font-extrabold text-[#FFC857] text-glow-gold tracking-wide">
            TASK-GATED REWARD VAULT
          </h2>
          <p className="text-[11px] font-rajdhani text-slate-300">
            Real-life rewards unlocked strictly by completing Gate Quests.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playButtonTick();
              setShowHistoryModal(true);
            }}
            className="w-8 h-8 flex items-center justify-center rounded-xs bg-white/5 border border-white/10 text-slate-300 hover:text-white"
            title="Reward Claim History"
          >
            <History className="w-3.5 h-3.5" />
          </button>
          <GlowButton
            variant="gold"
            size="sm"
            icon={<PlusCircle className="w-3.5 h-3.5" />}
            onClick={() => {
              sound.playButtonTick();
              setShowAddModal(true);
            }}
          >
            NEW REWARD
          </GlowButton>
        </div>
      </div>

      {/* Active Unlocked Reward Banners (Claim Window Running!) */}
      {activeUnlockedRewards.map((reward) => (
        <SystemWindow key={`active_${reward.id}`} variant="gold" className="animate-pulse">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <span className="text-2xl shrink-0">{reward.emoji}</span>
              <div>
                <div className="flex items-center gap-1.5 text-[10px] font-orbitron font-bold text-[#FFC857]">
                  <Sparkles className="w-3 h-3 text-[#FFC857]" /> [ REWARD CLAIM WINDOW ACTIVE ]
                </div>
                <h3 className="text-sm font-orbitron font-extrabold text-white mt-0.5">{reward.title}</h3>
                <p className="text-[11px] font-rajdhani text-slate-300">
                  Gate cleared! Enjoy your reward guilt-free before the timer expires.
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="px-2.5 py-1 rounded-xs bg-[#FFC857]/20 border border-[#FFC857]/50 font-mono text-xs font-bold text-[#FFC857] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 animate-spin" />{' '}
                    {formatCountdown(reward.claimWindowEndTimestamp || 0)}
                  </div>
                </div>
              </div>
            </div>

            <GlowButton
              variant="gold"
              size="sm"
              icon={<CheckCircle className="w-3.5 h-3.5" />}
              onClick={() => onMarkEnjoyed(reward)}
            >
              ENJOYED!
            </GlowButton>
          </div>
        </SystemWindow>
      ))}

      {/* Vault Rewards List */}
      <div className="space-y-3">
        {rewards.map((reward) => {
          const isGateActive = reward.status === 'gate_active';
          const isUnlocked = reward.status === 'unlocked';
          const isCooldown = reward.status === 'cooldown';
          const canAfford = player.gold >= reward.goldCost;

          return (
            <div
              key={reward.id}
              className={`relative rounded-xs border p-3.5 transition-all duration-200 ${
                isUnlocked
                  ? 'bg-gradient-to-b from-[#2a1e06] to-[#0e0a02] border-[#FFC857]/60 shadow-[0_0_20px_rgba(255,200,87,0.2)]'
                  : isGateActive
                  ? 'bg-gradient-to-b from-[#101e38] to-[#081224] border-[#2D9CFF]/60 shadow-[0_0_20px_rgba(45,156,255,0.2)]'
                  : 'bg-[#091224]/70 border-white/10 hover:border-white/20'
              }`}
            >
              {/* Corner accents */}
              <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-current opacity-40" />
              <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-current opacity-40" />

              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <span className="text-2xl p-2 rounded-xs bg-white/5 border border-white/10 shrink-0">
                    {reward.emoji}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-orbitron font-semibold text-[#FFC857] uppercase">
                        {reward.category}
                      </span>
                      <span className="text-slate-600">·</span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {reward.claimWindowMinutes}m window
                      </span>
                    </div>

                    <h3 className="text-xs font-orbitron font-bold text-white tracking-wide truncate">
                      {reward.title}
                    </h3>
                    <p className="text-[11px] font-rajdhani text-slate-300 mt-0.5 line-clamp-2">
                      {reward.description}
                    </p>

                    {/* Gold Cost & Claims */}
                    <div className="flex items-center gap-3 mt-2 text-[11px] font-mono">
                      <span
                        className={`flex items-center gap-1 font-bold ${
                          canAfford ? 'text-[#FFC857]' : 'text-slate-500'
                        }`}
                      >
                        <Coins className="w-3.5 h-3.5 text-[#FFC857]" /> {reward.goldCost} Gold
                      </span>
                      <span className="text-slate-500 text-[10px]">
                        Claimed: {reward.totalClaimsCount} times
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Action Button according to Reward State */}
                <div className="shrink-0 flex flex-col items-end justify-center">
                  {/* State 1: Locked */}
                  {reward.status === 'locked' && (
                    <GlowButton
                      variant={canAfford ? 'gold' : 'ghost'}
                      size="sm"
                      icon={<Lock className="w-3 h-3" />}
                      onClick={() => handleStartGateSelection(reward)}
                    >
                      {canAfford ? 'UNLOCK' : 'NEED GOLD'}
                    </GlowButton>
                  )}

                  {/* State 2: Gate Active */}
                  {isGateActive && (
                    <div className="space-y-1 text-right">
                      <GlowButton
                        variant="emerald"
                        size="sm"
                        icon={<Unlock className="w-3 h-3" />}
                        onClick={() => onCompleteGateQuest(reward)}
                      >
                        CLEAR GATE
                      </GlowButton>
                      <button
                        onClick={onNavigateToQuests}
                        className="text-[9px] font-orbitron text-[#2D9CFF] hover:underline block w-full text-right"
                      >
                        VIEW QUEST →
                      </button>
                    </div>
                  )}

                  {/* State 3: Unlocked */}
                  {isUnlocked && (
                    <GlowButton
                      variant="gold"
                      size="sm"
                      icon={<CheckCircle className="w-3 h-3" />}
                      onClick={() => onMarkEnjoyed(reward)}
                    >
                      ENJOYED
                    </GlowButton>
                  )}

                  {/* State 4: Cooldown */}
                  {isCooldown && (
                    <div className="px-2 py-1 rounded-xs bg-white/5 border border-white/10 text-[10px] font-mono text-slate-400">
                      RESTING
                    </div>
                  )}
                </div>
              </div>

              {/* Gated Quest info strip if locked or active */}
              {reward.defaultGateQuestTitle && !isUnlocked && (
                <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-rajdhani text-slate-400">
                  <span className="flex items-center gap-1">
                    <span className="text-[#2D9CFF] font-orbitron font-bold">GATE TOLL:</span>{' '}
                    {reward.defaultGateQuestTitle}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Gate Quest Assignment Modal (When user taps "UNLOCK") */}
      {selectedRewardForGate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-sm rounded-xs bg-[#091224] border border-[#FFC857]/60 p-5 shadow-[0_0_35px_rgba(255,200,87,0.3)]">
            <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#FFC857]" />
            <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#FFC857]" />

            <div className="text-center mb-3">
              <span className="text-[10px] font-orbitron font-bold text-[#FFC857] tracking-widest uppercase">
                [ SYSTEM GATE PROTOCOL ]
              </span>
              <h3 className="text-base font-orbitron font-bold text-white mt-1">
                UNLOCK: {selectedRewardForGate.title}
              </h3>
              <p className="text-xs font-rajdhani text-slate-300 mt-1">
                To claim this reward, you must first clear the System Gate Quest.
              </p>
            </div>

            <div className="my-3 p-3 rounded-xs bg-[#050810] border border-white/10 space-y-2 text-xs font-rajdhani">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-orbitron text-[10px]">GOLD COST:</span>
                <span className="font-mono text-[#FFC857] font-bold">
                  {selectedRewardForGate.goldCost} Gold (Deducted upon clear)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-orbitron text-[10px]">CLAIM WINDOW:</span>
                <span className="font-mono text-[#2DFFB0] font-bold">
                  {selectedRewardForGate.claimWindowMinutes} Minutes
                </span>
              </div>
            </div>

            {/* Gate Quest details - customizable */}
            <div className="space-y-2 mb-4 text-xs font-rajdhani">
              <label className="block text-[10px] font-orbitron text-[#2D9CFF] font-semibold">
                ASSIGNED GATE QUEST
              </label>
              <input
                type="text"
                value={customGateTitle}
                onChange={(e) => setCustomGateTitle(e.target.value)}
                placeholder="e.g. 30 Push-ups + 20 Min Focused Study"
                className="w-full px-2.5 py-1.5 rounded-xs bg-[#040810] border border-[#2D9CFF]/40 text-white font-mono text-xs focus:outline-none focus:border-[#2D9CFF]"
              />
              <textarea
                rows={2}
                value={customGateDesc}
                onChange={(e) => setCustomGateDesc(e.target.value)}
                placeholder="Requirement details"
                className="w-full px-2.5 py-1.5 rounded-xs bg-[#040810] border border-white/15 text-slate-300 text-xs focus:outline-none focus:border-[#2D9CFF]"
              />
            </div>

            <div className="flex gap-2">
              <GlowButton
                variant="ghost"
                fullWidth
                onClick={() => setSelectedRewardForGate(null)}
              >
                CANCEL
              </GlowButton>
              <GlowButton
                variant="gold"
                fullWidth
                onClick={handleConfirmGateQuest}
              >
                INITIATE GATE
              </GlowButton>
            </div>
          </div>
        </div>
      )}

      {/* Insufficient Gold Recommendation Modal */}
      {insufficientGoldReward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-sm rounded-xs bg-[#120a06] border border-[#FF3B4E]/60 p-5 shadow-[0_0_30px_rgba(255,59,78,0.3)]">
            <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#FF3B4E]" />
            <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#FF3B4E]" />

            <div className="text-center mb-3">
              <div className="inline-flex items-center gap-1 text-[10px] font-orbitron font-bold text-[#FF3B4E] tracking-widest uppercase">
                <AlertTriangle className="w-3.5 h-3.5" /> [ INSUFFICIENT GOLD RESERVES ]
              </div>
              <h3 className="text-sm font-orbitron font-extrabold text-white mt-1">
                SHORT BY {insufficientGoldReward.goldCost - player.gold} GOLD
              </h3>
              <p className="text-xs font-rajdhani text-slate-300 mt-1">
                You have <span className="font-mono text-[#FFC857]">{player.gold} Gold</span>. The System demands{' '}
                <span className="font-mono text-white">{insufficientGoldReward.goldCost} Gold</span> for{' '}
                {insufficientGoldReward.title}.
              </p>
            </div>

            <div className="my-3 p-3 rounded-xs bg-[#060404] border border-white/10 space-y-1.5">
              <span className="text-[10px] font-orbitron text-[#2D9CFF] font-semibold block">
                RECOMMENDED TRIALS TO EARN GOLD:
              </span>
              {quests
                .filter((q) => !q.completed)
                .slice(0, 3)
                .map((q) => (
                  <div key={q.id} className="flex items-center justify-between text-xs font-rajdhani text-slate-300">
                    <span className="truncate max-w-[180px]">{q.title}</span>
                    <span className="font-mono text-[#FFC857] shrink-0">+{q.goldReward} Gold</span>
                  </div>
                ))}
            </div>

            <div className="flex gap-2">
              <GlowButton variant="ghost" fullWidth onClick={() => setInsufficientGoldReward(null)}>
                CLOSE
              </GlowButton>
              <GlowButton
                variant="blue"
                fullWidth
                onClick={() => {
                  setInsufficientGoldReward(null);
                  onNavigateToQuests();
                }}
              >
                GO TO QUESTS <ArrowRight className="w-3.5 h-3.5 ml-1 inline" />
              </GlowButton>
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Reward Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-sm rounded-xs bg-[#091224] border border-[#FFC857]/60 p-5 shadow-[0_0_30px_rgba(255,200,87,0.3)] max-h-[90vh] overflow-y-auto">
            <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#FFC857]" />
            <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#FFC857]" />

            <h3 className="text-xs font-orbitron font-bold text-[#FFC857] tracking-wider uppercase mb-1">
              [ REGISTER VAULT REWARD ]
            </h3>
            <p className="text-[11px] font-rajdhani text-slate-400 mb-3">
              Define a real-life indulgence to gate behind effort.
            </p>

            {/* Quick Templates */}
            <div className="mb-3">
              <span className="text-[10px] font-orbitron text-slate-400 block mb-1.5">QUICK TEMPLATES</span>
              <div className="grid grid-cols-2 gap-1.5">
                {templates.slice(0, 4).map((t) => (
                  <button
                    key={t.title}
                    type="button"
                    onClick={() => {
                      setNewTitle(t.title);
                      setNewEmoji(t.emoji);
                      setNewCost(t.cost);
                      setNewCategory(t.cat);
                    }}
                    className="flex items-center gap-1.5 p-1.5 rounded-xs bg-[#050810] border border-white/10 text-left hover:border-[#FFC857]/40 text-xs"
                  >
                    <span>{t.emoji}</span>
                    <span className="truncate text-[10px] font-rajdhani text-slate-300">{t.title}</span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleCreateNewReward} className="space-y-3 text-xs font-rajdhani">
              <div>
                <label className="block text-[10px] font-orbitron text-slate-400 mb-1">REWARD TITLE</label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={newEmoji}
                    onChange={(e) => setNewEmoji(e.target.value)}
                    className="w-10 px-1 py-1 rounded-xs bg-[#040810] border border-white/15 text-center text-base"
                    placeholder="🍔"
                  />
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Biryani Feast or 1h Gaming"
                    className="flex-1 px-2.5 py-1.5 rounded-xs bg-[#040810] border border-white/15 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-orbitron text-slate-400 mb-1">DESCRIPTION</label>
                <input
                  type="text"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Guilt-free indulgence conditions"
                  className="w-full px-2.5 py-1.5 rounded-xs bg-[#040810] border border-white/15 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-orbitron text-slate-400 mb-1">GOLD COST</label>
                  <input
                    type="number"
                    min={10}
                    value={newCost}
                    onChange={(e) => setNewCost(Number(e.target.value))}
                    className="w-full px-2 py-1.5 rounded-xs bg-[#040810] border border-white/15 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-orbitron text-slate-400 mb-1">CLAIM WINDOW (MIN)</label>
                  <input
                    type="number"
                    min={15}
                    max={480}
                    value={newWindowMinutes}
                    onChange={(e) => setNewWindowMinutes(Number(e.target.value))}
                    className="w-full px-2 py-1.5 rounded-xs bg-[#040810] border border-white/15 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-orbitron text-slate-400 mb-1">CATEGORY</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as Reward['category'])}
                  className="w-full px-2 py-1.5 rounded-xs bg-[#040810] border border-white/15 text-white"
                >
                  <option value="food">Food & Dining</option>
                  <option value="entertainment">Gaming & Entertainment</option>
                  <option value="rest">Rest & Sleep</option>
                  <option value="social">Social & Media</option>
                  <option value="offline_treat">Offline Purchase Treat</option>
                </select>
              </div>

              <div className="pt-2 flex gap-2">
                <GlowButton variant="ghost" fullWidth onClick={() => setShowAddModal(false)}>
                  CANCEL
                </GlowButton>
                <GlowButton variant="gold" fullWidth type="submit">
                  REGISTER REWARD
                </GlowButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reward Claims History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-sm rounded-xs bg-[#091224] border border-[#2D9CFF]/50 p-5 shadow-[0_0_30px_rgba(45,156,255,0.25)] max-h-[80vh] flex flex-col">
            <h3 className="text-xs font-orbitron font-bold text-[#2D9CFF] tracking-wider uppercase mb-2">
              [ REWARD CONQUEST LOG ]
            </h3>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1 my-2">
              {rewardClaims.length === 0 ? (
                <p className="text-xs font-rajdhani text-slate-400 text-center py-6">
                  No rewards conquered yet. Complete your first gate quest!
                </p>
              ) : (
                rewardClaims.map((claim) => (
                  <div key={claim.id} className="p-2.5 rounded-xs bg-[#050810] border border-white/10 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-orbitron font-bold text-white">{claim.rewardTitle}</span>
                      <span className="font-mono text-[#FFC857]">-{claim.goldCost} Gold</span>
                    </div>
                    <p className="text-[10px] font-rajdhani text-slate-400">
                      Cleared: {claim.gateQuestTitle}
                    </p>
                    <div className="flex items-center justify-between text-[9px] font-mono text-slate-500">
                      <span>{new Date(claim.claimedAt).toLocaleDateString()}</span>
                      <span className="text-[#2DFFB0]">Enjoyed Guilt-Free</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <GlowButton variant="blue" fullWidth onClick={() => setShowHistoryModal(false)}>
              CLOSE LOG
            </GlowButton>
          </div>
        </div>
      )}
    </div>
  );
};
