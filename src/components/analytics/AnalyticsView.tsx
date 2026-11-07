import React from 'react';
import { Player, Quest, RewardClaimLog, XpEvent } from '../../types';
import { SystemWindow } from '../common/SystemWindow';
import { BarChart2, Calendar, Flame, Coins, CheckCircle, TrendingUp } from 'lucide-react';

interface AnalyticsViewProps {
  player: Player;
  quests: Quest[];
  xpEvents: XpEvent[];
  rewardClaims: RewardClaimLog[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  player,
  quests,
  xpEvents,
  rewardClaims,
}) => {
  const totalGoldSpent = rewardClaims.reduce((acc, c) => acc + c.goldCost, 0);
  const totalGoldEarned = xpEvents.reduce((acc, e) => acc + e.gold, 0) + player.gold;
  const completedQuestsCount = quests.filter((q) => q.completed).length;

  // 30-day activity heatmap simulation
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    const isPassing = i >= 20 || i % 3 !== 0; // realistic mock streak history
    return {
      date: d.toISOString().split('T')[0],
      dayNum: d.getDate(),
      passing: isPassing,
    };
  });

  // Category XP breakdown
  const categoryXp: Record<string, number> = {
    str: 0,
    agi: 0,
    int: 0,
    vit: 0,
    sense: 0,
  };
  xpEvents.forEach((ev) => {
    if (categoryXp[ev.category] !== undefined) {
      categoryXp[ev.category] += ev.amount;
    }
  });

  return (
    <div className="space-y-4 pb-24">
      <div>
        <h2 className="text-sm font-orbitron font-extrabold text-[#2DFFB0] text-glow-blue tracking-wide uppercase">
          HUNTER ANALYTICS &amp; TELEMETRY
        </h2>
        <p className="text-[11px] font-rajdhani text-slate-400">
          Discipline consistency, XP velocity, and real-life reward expenditures.
        </p>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="p-3 rounded-xs bg-[#091224] border border-[#2D9CFF]/30">
          <div className="flex items-center gap-1.5 text-[10px] font-orbitron text-slate-400">
            <Flame className="w-3.5 h-3.5 text-[#FF3B4E]" /> STREAK
          </div>
          <div className="text-lg font-orbitron font-bold text-white mt-1">
            {player.streakDays} <span className="text-xs font-normal text-slate-400">Days</span>
          </div>
          <p className="text-[9px] font-mono text-slate-500">Record: {player.bestStreak}d</p>
        </div>

        <div className="p-3 rounded-xs bg-[#091224] border border-[#FFC857]/30">
          <div className="flex items-center gap-1.5 text-[10px] font-orbitron text-slate-400">
            <Coins className="w-3.5 h-3.5 text-[#FFC857]" /> GOLD FLOW
          </div>
          <div className="text-lg font-orbitron font-bold text-[#FFC857] mt-1">
            {player.gold} <span className="text-xs font-normal text-slate-400">Pts</span>
          </div>
          <p className="text-[9px] font-mono text-slate-500">Spent: {totalGoldSpent}g</p>
        </div>

        <div className="p-3 rounded-xs bg-[#091224] border border-[#2DFFB0]/30">
          <div className="flex items-center gap-1.5 text-[10px] font-orbitron text-slate-400">
            <CheckCircle className="w-3.5 h-3.5 text-[#2DFFB0]" /> TASKS DONE
          </div>
          <div className="text-lg font-orbitron font-bold text-white mt-1">
            {completedQuestsCount}
          </div>
          <p className="text-[9px] font-mono text-slate-500">Active: {quests.length}</p>
        </div>

        <div className="p-3 rounded-xs bg-[#091224] border border-[#7B5CFF]/30">
          <div className="flex items-center gap-1.5 text-[10px] font-orbitron text-slate-400">
            <TrendingUp className="w-3.5 h-3.5 text-[#7B5CFF]" /> REWARDS
          </div>
          <div className="text-lg font-orbitron font-bold text-white mt-1">
            {rewardClaims.length}
          </div>
          <p className="text-[9px] font-mono text-slate-500">Guilt-free</p>
        </div>
      </div>

      {/* 30-Day Streak Calendar Heatmap */}
      <SystemWindow
        variant="blue"
        title="30-DAY DISCIPLINE HEATMAP"
        subHeader="Consistency Audit Log"
      >
        <div className="grid grid-cols-10 gap-1.5 my-2">
          {last30Days.map((d, i) => (
            <div
              key={d.date}
              title={`${d.date}: ${d.passing ? 'Discipline maintained' : 'Threshold missed'}`}
              className={`h-7 rounded-xs border flex items-center justify-center font-mono text-[10px] ${
                d.passing
                  ? 'bg-[#2DFFB0]/20 border-[#2DFFB0]/50 text-[#2DFFB0]'
                  : 'bg-[#FF3B4E]/15 border-[#FF3B4E]/30 text-[#FF3B4E]'
              }`}
            >
              {d.dayNum}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between text-[10px] font-rajdhani text-slate-400 mt-2">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#2DFFB0]/30 border border-[#2DFFB0]" /> ≥80% Objectives Met
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#FF3B4E]/30 border border-[#FF3B4E]" /> Missed / Rest
          </span>
        </div>
      </SystemWindow>

      {/* Attribute XP Distribution */}
      <SystemWindow
        variant="gold"
        title="ATTRIBUTE REINFORCEMENT"
        subHeader="XP Distribution Across Disciplines"
      >
        <div className="space-y-2.5 my-1">
          {[
            { key: 'str', label: 'STR (Physical Power & Reps)', color: 'bg-[#FF3B4E]' },
            { key: 'agi', label: 'AGI (Habits & Morning Velocity)', color: 'bg-[#2D9CFF]' },
            { key: 'int', label: 'INT (Study & Engineering Focus)', color: 'bg-[#7B5CFF]' },
            { key: 'vit', label: 'VIT (Health, Water & Recovery)', color: 'bg-[#2DFFB0]' },
            { key: 'sense', label: 'SENSE (Mindfulness & Willpower)', color: 'bg-[#FFC857]' },
          ].map((cat) => {
            const xp = categoryXp[cat.key] || 15;
            const maxVal = Math.max(...Object.values(categoryXp), 50);
            const pct = Math.min(100, Math.max(10, (xp / maxVal) * 100));

            return (
              <div key={cat.key} className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-rajdhani font-semibold">
                  <span className="text-slate-300">{cat.label}</span>
                  <span className="font-mono text-white text-[10px]">{xp} XP</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-xs overflow-hidden">
                  <div
                    className={`${cat.color} h-full rounded-xs transition-all duration-300`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </SystemWindow>
    </div>
  );
};
