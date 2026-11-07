import React, { useState } from 'react';
import { BossRaid, Dungeon, Player } from '../../types';
import { sound } from '../../utils/audio';
import { hapticLevelUp, hapticSuccess, hapticTick, hapticWarning } from '../../utils/haptics';
import { SystemWindow } from '../common/SystemWindow';
import { GlowButton } from '../common/GlowButton';
import { ShieldAlert, Skull, CheckCircle, Lock, Trophy, Flame, Coins, Zap } from 'lucide-react';

interface DungeonsViewProps {
  player: Player;
  dungeons: Dungeon[];
  bossRaid: BossRaid;
  onCheckInDungeon: (dungeonId: string) => void;
  onEnterDungeon: (dungeonId: string) => void;
  onAttackBoss: () => void;
}

export const DungeonsView: React.FC<DungeonsViewProps> = ({
  player,
  dungeons,
  bossRaid,
  onCheckInDungeon,
  onEnterDungeon,
  onAttackBoss,
}) => {
  const [filter, setFilter] = useState<'all' | 'in_progress'>('all');

  const rankOrder: Record<Player['rank'], number> = {
    E: 1,
    D: 2,
    C: 3,
    B: 4,
    A: 5,
    S: 6,
  };

  const handleCheckIn = (dungeon: Dungeon) => {
    if (dungeon.checkedInToday) return;
    sound.playQuestComplete();
    hapticSuccess();
    onCheckInDungeon(dungeon.id);
  };

  const handleEnter = (dungeon: Dungeon) => {
    sound.playSystemDing();
    hapticTick();
    onEnterDungeon(dungeon.id);
  };

  const bossHpPct = Math.max(0, Math.min(100, (bossRaid.currentHp / bossRaid.maxHp) * 100));

  return (
    <div className="space-y-4 pb-24">
      {/* Weekly Boss Raid System Window */}
      <SystemWindow
        variant="danger"
        title="WEEKLY BOSS RAID EVENT"
        subHeader="System Calamity Threat"
        headerRight={
          <span className="text-[10px] font-mono font-bold text-[#FF3B4E] px-2 py-0.5 rounded-xs bg-[#FF3B4E]/15 border border-[#FF3B4E]/40 animate-pulse">
            WEEK #{bossRaid.weekNumber}
          </span>
        }
      >
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-orbitron font-extrabold text-[#FF3B4E]">
              <Skull className="w-4 h-4 text-[#FF3B4E]" /> {bossRaid.bossName}
            </div>
            <p className="text-[11px] font-rajdhani text-slate-300 mt-0.5">{bossRaid.title}</p>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-mono text-slate-400">DEADLINE:</span>
            <div className="text-[11px] font-mono text-[#FF3B4E] font-bold">{bossRaid.deadlineDate}</div>
          </div>
        </div>

        {/* Boss HP Bar */}
        <div className="space-y-1 mb-3">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-400">CALAMITY HP</span>
            <span className="text-[#FF3B4E] font-bold">
              {bossRaid.currentHp} / {bossRaid.maxHp} ({bossHpPct.toFixed(0)}%)
            </span>
          </div>
          <div className="w-full bg-[#1a080a] h-3 rounded-xs border border-[#FF3B4E]/40 p-[1px] overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#FF3B4E] to-[#FF8591] h-full rounded-xs transition-all duration-300 shadow-[0_0_12px_rgba(255,59,78,0.5)]"
              style={{ width: `${bossHpPct}%` }}
            />
          </div>
        </div>

        {/* Boss Raid Spoils & Attack CTA */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[11px] font-mono">
          <div className="flex items-center gap-3">
            <span className="text-[#2D9CFF]">+{bossRaid.rewardXp} EXP</span>
            <span className="text-[#FFC857] flex items-center gap-1">
              <Coins className="w-3 h-3" /> +{bossRaid.rewardGold} Gold
            </span>
            <span className="text-[#2DFFB0] text-[10px] hidden sm:inline">[{bossRaid.rewardTitle}]</span>
          </div>

          {bossRaid.currentHp > 0 ? (
            <button
              onClick={() => {
                sound.playButtonTick();
                onAttackBoss();
              }}
              className="px-3 py-1 rounded-xs bg-[#FF3B4E]/20 border border-[#FF3B4E]/60 text-xs font-orbitron font-bold text-[#FF3B4E] hover:bg-[#FF3B4E]/30 active:scale-95"
            >
              FOCUS STRIKE (-25 HP)
            </button>
          ) : (
            <span className="text-xs font-orbitron font-bold text-[#2DFFB0]">DEFEATED!</span>
          )}
        </div>
      </SystemWindow>

      {/* Multi-Day Dungeons Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-orbitron font-extrabold text-[#2D9CFF] text-glow-blue tracking-wide">
            DUNGEON GATES
          </h2>
          <p className="text-[11px] font-rajdhani text-slate-400">
            Endurance trials spanning multiple days. Clear for massive spoils & titles.
          </p>
        </div>
      </div>

      {/* Dungeons List */}
      <div className="space-y-3">
        {dungeons.map((dungeon) => {
          const isUnlocked = rankOrder[player.rank] >= rankOrder[dungeon.requiredRank];
          const isInProgress = dungeon.status === 'in_progress';
          const isDone = dungeon.status === 'completed';
          const progressPct = (dungeon.currentDay / dungeon.durationDays) * 100;

          return (
            <div
              key={dungeon.id}
              className={`relative rounded-xs border p-3.5 transition-all duration-200 ${
                isInProgress
                  ? 'bg-gradient-to-b from-[#0c1830] to-[#070e1c] border-[#2D9CFF]/60 shadow-[0_0_20px_rgba(45,156,255,0.15)]'
                  : !isUnlocked
                  ? 'bg-[#050810]/60 border-slate-800 opacity-60'
                  : 'bg-[#091224]/70 border-white/10'
              }`}
            >
              <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-current opacity-40" />
              <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-current opacity-40" />

              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-1.5 py-0.5 rounded-xs bg-[#2D9CFF]/15 border border-[#2D9CFF]/40 text-[9px] font-mono font-bold text-[#2D9CFF]">
                      REQ: RANK-{dungeon.requiredRank}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {dungeon.durationDays} Days Trial
                    </span>
                    {isInProgress && (
                      <span className="px-1.5 py-0.5 rounded-xs bg-[#2DFFB0]/15 border border-[#2DFFB0]/40 text-[9px] font-orbitron font-bold text-[#2DFFB0]">
                        DAY {dungeon.currentDay}/{dungeon.durationDays}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xs font-orbitron font-bold text-white tracking-wide">
                    {dungeon.title}
                  </h3>
                  <p className="text-[11px] font-rajdhani text-slate-300 mt-0.5">{dungeon.description}</p>

                  <div className="mt-2 text-[10px] font-rajdhani text-slate-400">
                    <span className="text-[#2D9CFF] font-bold">Daily Rule:</span> {dungeon.dailyObjective}
                  </div>

                  {/* Rewards preview */}
                  <div className="flex items-center gap-3 mt-2 text-[11px] font-mono">
                    <span className="text-[#2D9CFF]">+{dungeon.xpReward} EXP</span>
                    <span className="text-[#FFC857] flex items-center gap-1">
                      <Coins className="w-3 h-3" /> +{dungeon.goldReward} Gold
                    </span>
                    {dungeon.titleReward && (
                      <span className="text-[#2DFFB0] text-[10px]">Title: {dungeon.titleReward}</span>
                    )}
                  </div>
                </div>

                {/* Right Action */}
                <div className="shrink-0 flex flex-col items-end justify-center">
                  {!isUnlocked ? (
                    <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-xs bg-slate-900 border border-slate-700 text-[10px] font-orbitron text-slate-500">
                      <Lock className="w-3 h-3" /> RANK GATED
                    </div>
                  ) : isDone ? (
                    <span className="text-xs font-orbitron font-bold text-[#2DFFB0]">CONQUERED</span>
                  ) : isInProgress ? (
                    <GlowButton
                      variant={dungeon.checkedInToday ? 'ghost' : 'emerald'}
                      size="sm"
                      icon={<CheckCircle className="w-3 h-3" />}
                      disabled={dungeon.checkedInToday}
                      onClick={() => handleCheckIn(dungeon)}
                    >
                      {dungeon.checkedInToday ? 'CHECKED IN' : 'CHECK IN'}
                    </GlowButton>
                  ) : (
                    <GlowButton
                      variant="blue"
                      size="sm"
                      onClick={() => handleEnter(dungeon)}
                    >
                      ENTER GATE
                    </GlowButton>
                  )}
                </div>
              </div>

              {/* Progress bar if in progress */}
              {isInProgress && (
                <div className="mt-3 pt-2 border-t border-white/5">
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#2DFFB0] h-full transition-all duration-300"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
