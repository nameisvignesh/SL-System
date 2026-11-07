import React from 'react';
import { Player, Quest, StatKey } from '../../types';
import { xpNeededForLevel } from '../../utils/gameLogic';
import { SystemWindow } from '../common/SystemWindow';
import { StatBar } from '../common/StatBar';
import { RadarChart } from '../common/RadarChart';
import { GlowButton } from '../common/GlowButton';
import { Plus, ShieldAlert, Award, Flame, Coins, Zap } from 'lucide-react';
import { sound } from '../../utils/audio';
import { hapticTick } from '../../utils/haptics';

interface StatusWindowProps {
  player: Player;
  quests: Quest[];
  onAllocateStat: (stat: StatKey) => void;
  onNavigateToQuests: () => void;
  onNavigateToVault: () => void;
}

export const StatusWindow: React.FC<StatusWindowProps> = ({
  player,
  quests,
  onAllocateStat,
  onNavigateToQuests,
  onNavigateToVault,
}) => {
  const nextXp = xpNeededForLevel(player.level);
  const dailies = quests.filter((q) => q.isDaily && !q.isPenalty && !q.isGateQuest);
  const completedDailies = dailies.filter((q) => q.completed).length;
  const questProgressPct = dailies.length > 0 ? (completedDailies / dailies.length) * 100 : 0;

  const handlePlus = (stat: StatKey) => {
    if (player.statPoints <= 0) return;
    sound.playButtonTick();
    hapticTick();
    onAllocateStat(stat);
  };

  const statLabels: { key: StatKey; label: string; desc: string }[] = [
    { key: 'str', label: 'STR', desc: 'Strength & Fitness' },
    { key: 'agi', label: 'AGI', desc: 'Habits & Agility' },
    { key: 'int', label: 'INT', desc: 'Intelligence & Study' },
    { key: 'vit', label: 'VIT', desc: 'Vitality & Health' },
    { key: 'sense', label: 'SENSE', desc: 'Perception & Mindfulness' },
  ];

  return (
    <div className="space-y-3.5 pb-20">
      {/* Penalty Alert Banner if penalized */}
      {player.isPenalized && (
        <SystemWindow variant="danger" className="animate-pulse">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-[#FF3B4E] shrink-0" />
              <div>
                <h4 className="text-xs font-orbitron font-bold text-[#FF3B4E]">PENALTY ZONE ENGAGED</h4>
                <p className="text-[11px] font-rajdhani text-slate-300">
                  Discipline compromised. Complete the Survival Quest to restore full access.
                </p>
              </div>
            </div>
            <GlowButton variant="danger" size="sm" onClick={onNavigateToQuests}>
              SURVIVE
            </GlowButton>
          </div>
        </SystemWindow>
      )}

      {/* Main Status Window */}
      <SystemWindow
        variant="blue"
        title="HUNTER STATUS WINDOW"
        subHeader="System Authorization Registry"
        headerRight={
          <span className="text-[10px] font-mono font-bold text-[#2D9CFF] px-2 py-0.5 rounded-xs bg-[#2D9CFF]/15 border border-[#2D9CFF]/40">
            RANK {player.rank}
          </span>
        }
      >
        {/* Hunter Identity Overview */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-orbitron font-extrabold text-white text-glow-blue tracking-wide">
                {player.name}
              </h2>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Award className="w-3.5 h-3.5 text-[#FFC857]" />
              <span className="text-xs font-rajdhani font-semibold text-[#FFC857]">{player.title}</span>
              <span className="text-slate-600">·</span>
              <span className="text-[11px] font-rajdhani text-slate-400">{player.jobClass}</span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] font-orbitron text-slate-400">LEVEL</div>
            <div className="text-2xl font-orbitron font-black text-[#2DFFB0] text-glow-blue leading-none">
              {player.level}
            </div>
          </div>
        </div>

        {/* Vitality & Energy Bars */}
        <div className="py-3 space-y-2 border-b border-white/10">
          <StatBar
            label="HP"
            subLabel="Discipline"
            current={player.hp}
            max={player.maxHp}
            variant="hp"
          />
          <StatBar
            label="MP"
            subLabel="Focus Reserve"
            current={player.mp}
            max={player.maxMp}
            variant="mp"
          />
          <StatBar
            label="EXP"
            subLabel="Ascension"
            current={player.currentXp}
            max={nextXp}
            variant="xp"
          />
        </div>

        {/* 5-Axis Spider Radar Chart */}
        <div className="py-3 flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-1 px-1">
            <span className="text-[10px] font-orbitron font-bold text-slate-400 uppercase tracking-wider">
              ATTRIBUTE MATRIX
            </span>
            {player.statPoints > 0 ? (
              <span className="text-[10px] font-mono font-bold text-[#2DFFB0] px-2 py-0.5 rounded-xs bg-[#2DFFB0]/15 border border-[#2DFFB0]/40 animate-pulse">
                +{player.statPoints} STAT PTS UNALLOCATED
              </span>
            ) : (
              <span className="text-[10px] font-mono text-slate-500">MAX 50</span>
            )}
          </div>

          <RadarChart stats={player.stats} maxStat={50} size={250} />
        </div>

        {/* Stat Allocator / Value rows */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-2">
          {statLabels.map((s) => (
            <div
              key={s.key}
              className="flex items-center justify-between px-2.5 py-1.5 rounded-xs bg-[#060c18] border border-white/5"
            >
              <div>
                <span className="font-orbitron font-bold text-xs text-[#2D9CFF] mr-2">{s.label}</span>
                <span className="font-mono text-xs text-slate-200 font-bold">{player.stats[s.key]}</span>
              </div>
              {player.statPoints > 0 && (
                <button
                  onClick={() => handlePlus(s.key)}
                  className="w-6 h-6 flex items-center justify-center rounded-xs bg-[#2D9CFF]/20 border border-[#2D9CFF]/40 text-[#2D9CFF] hover:bg-[#2D9CFF]/30 active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </SystemWindow>

      {/* Quick Summary Strip: Daily Ring & Vault Access */}
      <div className="grid grid-cols-2 gap-3">
        {/* Today's Daily Ring */}
        <div
          onClick={onNavigateToQuests}
          className="cursor-pointer group relative rounded-xs bg-[#091224]/80 border border-[#2D9CFF]/30 p-3 hover:border-[#2D9CFF]/60 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-orbitron font-bold text-slate-300">DAILY TRIALS</span>
            <span className="text-[10px] font-mono text-[#2D9CFF]">
              {completedDailies}/{dailies.length}
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#2D9CFF] h-full transition-all duration-300"
              style={{ width: `${questProgressPct}%` }}
            />
          </div>
          <p className="text-[10px] font-rajdhani text-slate-400 mt-2">
            {questProgressPct === 100
              ? 'All daily objectives conquered!'
              : `${dailies.length - completedDailies} tasks remaining today.`}
          </p>
        </div>

        {/* Task-Gated Vault Shortcut */}
        <div
          onClick={onNavigateToVault}
          className="cursor-pointer group relative rounded-xs bg-[#1a1406]/60 border border-[#FFC857]/30 p-3 hover:border-[#FFC857]/60 transition-all"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-orbitron font-bold text-[#FFC857]">REWARD VAULT</span>
            <Coins className="w-3.5 h-3.5 text-[#FFC857]" />
          </div>
          <div className="text-base font-orbitron font-black text-white text-glow-gold">
            {player.gold} <span className="text-xs font-normal text-slate-400">GOLD</span>
          </div>
          <p className="text-[10px] font-rajdhani text-slate-400 mt-1">
            Unlock real-life rewards with gate quests.
          </p>
        </div>
      </div>
    </div>
  );
};
