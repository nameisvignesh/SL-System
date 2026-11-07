import React, { useState, useEffect } from 'react';
import { Player, Quest, QuestDifficulty, QuestType, StatKey } from '../../types';
import { calculateQuestRewards } from '../../utils/gameLogic';
import { sound } from '../../utils/audio';
import { hapticSuccess, hapticTick, hapticWarning } from '../../utils/haptics';
import { SystemWindow } from '../common/SystemWindow';
import { GlowButton } from '../common/GlowButton';
import {
  CheckCircle2,
  Circle,
  Plus,
  Minus,
  Play,
  Pause,
  RotateCcw,
  PlusCircle,
  Coins,
  Sparkles,
  Trash2,
  Flame,
  ShieldAlert,
} from 'lucide-react';

interface QuestsViewProps {
  player: Player;
  quests: Quest[];
  onCompleteQuest: (questId: string) => void;
  onUpdateQuest: (quest: Quest) => void;
  onAddQuest: (quest: Quest) => void;
  onDeleteQuest: (questId: string) => void;
  onTriggerChest: () => void;
}

export const QuestsView: React.FC<QuestsViewProps> = ({
  player,
  quests,
  onCompleteQuest,
  onUpdateQuest,
  onAddQuest,
  onDeleteQuest,
  onTriggerChest,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New quest form state
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState<StatKey>('str');
  const [difficulty, setDifficulty] = useState<QuestDifficulty>('E');
  const [questType, setQuestType] = useState<QuestType>('checkbox');
  const [targetCount, setTargetCount] = useState<number>(30);
  const [unit, setUnit] = useState('reps');
  const [timerMinutes, setTimerMinutes] = useState<number>(25);

  // Active timers interval
  useEffect(() => {
    const timerInterval = setInterval(() => {
      let anyChanged = false;
      const updated = quests.map((q) => {
        if (q.type === 'timer' && q.timerRunning && q.timerRemainingSeconds && q.timerRemainingSeconds > 0) {
          anyChanged = true;
          const nextSec = q.timerRemainingSeconds - 1;
          if (nextSec === 0) {
            sound.playQuestComplete();
            hapticSuccess();
            return {
              ...q,
              timerRemainingSeconds: 0,
              timerRunning: false,
              completed: true,
            };
          }
          return {
            ...q,
            timerRemainingSeconds: nextSec,
          };
        }
        return q;
      });

      if (anyChanged) {
        updated.forEach((q) => {
          if (q.type === 'timer' && q.timerRemainingSeconds === 0 && !q.completed) {
            onCompleteQuest(q.id);
          } else {
            onUpdateQuest(q);
          }
        });
      }
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [quests]);

  const dailies = quests.filter((q) => q.isDaily && !q.isPenalty && !q.isGateQuest);
  const penaltyQuest = quests.find((q) => q.isPenalty && !q.completed);
  const completedCount = dailies.filter((q) => q.completed).length;
  const allDailiesCompleted = dailies.length > 0 && completedCount === dailies.length;

  const filteredQuests = quests.filter((q) => {
    if (q.isPenalty) return true; // always show active penalty
    if (filter === 'pending') return !q.completed;
    if (filter === 'completed') return q.completed;
    return true;
  });

  const handleToggleCheckbox = (quest: Quest) => {
    if (quest.completed) return;
    sound.playQuestComplete();
    hapticSuccess();
    onCompleteQuest(quest.id);
  };

  const handleIncrementCounter = (quest: Quest) => {
    const current = (quest.currentCount || 0) + 5;
    const target = quest.targetCount || 50;
    sound.playButtonTick();
    hapticTick();

    if (current >= target) {
      sound.playQuestComplete();
      hapticSuccess();
      onUpdateQuest({
        ...quest,
        currentCount: target,
        completed: true,
      });
      onCompleteQuest(quest.id);
    } else {
      onUpdateQuest({
        ...quest,
        currentCount: current,
      });
    }
  };

  const handleDecrementCounter = (quest: Quest) => {
    const current = Math.max(0, (quest.currentCount || 0) - 5);
    sound.playButtonTick();
    hapticTick();
    onUpdateQuest({
      ...quest,
      currentCount: current,
      completed: false,
    });
  };

  const handleToggleTimer = (quest: Quest) => {
    sound.playButtonTick();
    hapticTick();
    onUpdateQuest({
      ...quest,
      timerRunning: !quest.timerRunning,
    });
  };

  const handleResetTimer = (quest: Quest) => {
    sound.playButtonTick();
    onUpdateQuest({
      ...quest,
      timerRunning: false,
      timerRemainingSeconds: (quest.timerMinutes || 25) * 60,
      completed: false,
    });
  };

  const handleToggleChecklistItem = (quest: Quest, itemId: string) => {
    if (!quest.checklist) return;
    sound.playButtonTick();
    hapticTick();

    const updatedItems = quest.checklist.map((item) =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    const allDone = updatedItems.every((item) => item.completed);

    if (allDone && !quest.completed) {
      sound.playQuestComplete();
      hapticSuccess();
      onCompleteQuest(quest.id);
    }

    onUpdateQuest({
      ...quest,
      checklist: updatedItems,
      completed: allDone,
    });
  };

  const handleCreateQuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const { xp, gold } = calculateQuestRewards(difficulty, player.streakDays);

    const newQuest: Quest = {
      id: `quest_custom_${Date.now()}`,
      title: title.trim(),
      description: desc.trim() || 'Custom trial registered by the Hunter.',
      category,
      difficulty,
      xpReward: xp,
      goldReward: gold,
      type: questType,
      currentCount: questType === 'counter' ? 0 : undefined,
      targetCount: questType === 'counter' ? targetCount : undefined,
      unit: questType === 'counter' ? unit : undefined,
      timerMinutes: questType === 'timer' ? timerMinutes : undefined,
      timerRemainingSeconds: questType === 'timer' ? timerMinutes * 60 : undefined,
      timerRunning: false,
      completed: false,
      isDaily: true,
    };

    onAddQuest(newQuest);
    setShowAddModal(false);
    setTitle('');
    setDesc('');
    sound.playSystemDing();
    hapticTick();
  };

  const formatTimer = (seconds?: number) => {
    if (seconds === undefined) return '00:00';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const difficultyColors: Record<QuestDifficulty, string> = {
    E: 'text-slate-300 border-slate-500/40 bg-slate-500/10',
    D: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10',
    C: 'text-blue-400 border-blue-500/40 bg-blue-500/10',
    B: 'text-purple-400 border-purple-500/40 bg-purple-500/10',
    A: 'text-amber-400 border-amber-500/40 bg-amber-500/10',
    S: 'text-rose-400 border-rose-500/60 bg-rose-500/20 text-glow-danger',
  };

  return (
    <div className="space-y-3.5 pb-24">
      {/* Active Penalty Quest Banner */}
      {penaltyQuest && (
        <SystemWindow variant="danger" className="animate-pulse">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-orbitron font-bold text-[#FF3B4E]">
                <ShieldAlert className="w-4 h-4" /> [ MANDATORY SURVIVAL TRIAL ]
              </div>
              <h3 className="text-sm font-orbitron font-extrabold text-white mt-1">{penaltyQuest.title}</h3>
              <p className="text-xs font-rajdhani text-slate-300 mt-0.5">{penaltyQuest.description}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="font-mono text-sm text-[#FF3B4E] font-bold">
                  {penaltyQuest.currentCount} / {penaltyQuest.targetCount} {penaltyQuest.unit}
                </span>
                <button
                  onClick={() => handleIncrementCounter(penaltyQuest)}
                  className="px-3 py-1 rounded-xs bg-[#FF3B4E]/20 border border-[#FF3B4E]/60 text-xs font-orbitron font-bold text-[#FF3B4E] hover:bg-[#FF3B4E]/30"
                >
                  LOG +5 REPS
                </button>
              </div>
            </div>
          </div>
        </SystemWindow>
      )}

      {/* Header bar with filters and Add Button */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-orbitron font-extrabold text-white text-glow-blue tracking-wide">
            DAILY QUEST LOG
          </h2>
          <p className="text-[11px] font-rajdhani text-slate-400">
            Progress: {completedCount}/{dailies.length} completed
          </p>
        </div>

        <div className="flex items-center gap-2">
          {allDailiesCompleted && (
            <button
              onClick={onTriggerChest}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xs bg-[#FFC857]/20 border border-[#FFC857]/60 text-xs font-orbitron font-bold text-[#FFC857] shadow-[0_0_15px_rgba(255,200,87,0.3)] animate-bounce"
            >
              <Sparkles className="w-3.5 h-3.5" /> CLAIM CHEST
            </button>
          )}

          <GlowButton
            variant="blue"
            size="sm"
            icon={<PlusCircle className="w-3.5 h-3.5" />}
            onClick={() => setShowAddModal(true)}
          >
            ADD TRIAL
          </GlowButton>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-[#060c18] rounded-xs border border-white/10">
        {(['all', 'pending', 'completed'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              sound.playButtonTick();
              setFilter(tab);
            }}
            className={`flex-1 py-1 text-center text-[10px] font-orbitron uppercase tracking-wider rounded-xs transition-colors ${
              filter === tab
                ? 'bg-[#2D9CFF]/20 text-[#2D9CFF] font-bold border border-[#2D9CFF]/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Quest Cards List */}
      <div className="space-y-2.5">
        {filteredQuests.map((quest) => {
          const isDone = quest.completed;
          return (
            <div
              key={quest.id}
              className={`relative rounded-xs border p-3 transition-all duration-200 ${
                isDone
                  ? 'bg-[#060c18]/60 border-slate-700/50 opacity-75'
                  : 'bg-gradient-to-b from-[#0c1830]/80 to-[#070e1c]/90 border-[#2D9CFF]/30 shadow-[0_0_15px_rgba(45,156,255,0.06)]'
              }`}
            >
              {/* Corner accents */}
              <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#2D9CFF]/40" />
              <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#2D9CFF]/40" />

              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  {/* Category & Difficulty badges */}
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`px-1.5 py-0.5 rounded-xs border text-[9px] font-mono font-bold ${
                        difficultyColors[quest.difficulty]
                      }`}
                    >
                      RANK-{quest.difficulty}
                    </span>
                    <span className="text-[10px] font-orbitron font-semibold text-[#2D9CFF] uppercase">
                      {quest.category}
                    </span>
                    {quest.isGateQuest && (
                      <span className="px-1.5 py-0.5 rounded-xs bg-[#FFC857]/15 border border-[#FFC857]/40 text-[9px] font-orbitron text-[#FFC857]">
                        GATE QUEST
                      </span>
                    )}
                  </div>

                  <h3
                    className={`text-xs font-orbitron font-bold tracking-wide ${
                      isDone ? 'line-through text-slate-400' : 'text-white'
                    }`}
                  >
                    {quest.title}
                  </h3>
                  <p className="text-[11px] font-rajdhani text-slate-300 mt-0.5 line-clamp-2">
                    {quest.description}
                  </p>

                  {/* Rewards preview */}
                  <div className="flex items-center gap-3 mt-2 text-[10px] font-mono">
                    <span className="text-[#2D9CFF]">+{quest.xpReward} EXP</span>
                    <span className="flex items-center gap-1 text-[#FFC857]">
                      <Coins className="w-3 h-3" /> +{quest.goldReward} Gold
                    </span>
                  </div>
                </div>

                {/* Right Action / Control based on Quest Type */}
                <div className="shrink-0 flex items-center gap-1">
                  {/* Checkbox Type */}
                  {quest.type === 'checkbox' && (
                    <button
                      onClick={() => handleToggleCheckbox(quest)}
                      disabled={isDone}
                      className="w-9 h-9 flex items-center justify-center rounded-xs bg-[#2D9CFF]/10 border border-[#2D9CFF]/40 text-[#2D9CFF] hover:bg-[#2D9CFF]/20 active:scale-95 disabled:opacity-50"
                    >
                      {isDone ? <CheckCircle2 className="w-5 h-5 text-[#2DFFB0]" /> : <Circle className="w-5 h-5" />}
                    </button>
                  )}

                  {/* Delete button if user custom quest */}
                  {quest.id.startsWith('quest_custom') && (
                    <button
                      onClick={() => onDeleteQuest(quest.id)}
                      className="w-7 h-7 flex items-center justify-center rounded-xs text-slate-500 hover:text-[#FF3B4E] transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Counter Type Controls */}
              {quest.type === 'counter' && (
                <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                      <span>PROGRESS</span>
                      <span className="text-[#2D9CFF] font-bold">
                        {quest.currentCount || 0} / {quest.targetCount || 50} {quest.unit || 'reps'}
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#2D9CFF] h-full transition-all duration-200"
                        style={{
                          width: `${Math.min(
                            100,
                            (((quest.currentCount || 0) / (quest.targetCount || 50)) * 100)
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleDecrementCounter(quest)}
                      className="w-7 h-7 flex items-center justify-center rounded-xs bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 active:scale-95"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleIncrementCounter(quest)}
                      className="px-2.5 py-1 rounded-xs bg-[#2D9CFF]/20 border border-[#2D9CFF]/50 text-xs font-mono font-bold text-[#2D9CFF] hover:bg-[#2D9CFF]/30 active:scale-95"
                    >
                      +5
                    </button>
                  </div>
                </div>
              )}

              {/* Focus Timer Type Controls */}
              {quest.type === 'timer' && (
                <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-bold text-[#2DFFB0] tabular-nums">
                      {formatTimer(quest.timerRemainingSeconds)}
                    </span>
                    {quest.timerRunning && (
                      <span className="w-2 h-2 rounded-full bg-[#2DFFB0] animate-ping" />
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleResetTimer(quest)}
                      className="p-1.5 rounded-xs bg-white/5 text-slate-400 hover:text-white"
                      title="Reset"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleToggleTimer(quest)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-xs border text-xs font-orbitron font-semibold uppercase ${
                        quest.timerRunning
                          ? 'bg-[#FF3B4E]/15 border-[#FF3B4E]/50 text-[#FF3B4E]'
                          : 'bg-[#2D9CFF]/15 border-[#2D9CFF]/50 text-[#2D9CFF]'
                      }`}
                    >
                      {quest.timerRunning ? (
                        <>
                          <Pause className="w-3 h-3" /> PAUSE
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3" /> START
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Checklist Type items */}
              {quest.type === 'checklist' && quest.checklist && (
                <div className="mt-2.5 pt-2 border-t border-white/5 space-y-1.5">
                  {quest.checklist.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleToggleChecklistItem(quest, item.id)}
                      className="flex items-center gap-2 cursor-pointer p-1 rounded-xs hover:bg-white/5"
                    >
                      {item.completed ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2DFFB0] shrink-0" />
                      ) : (
                        <Circle className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      )}
                      <span
                        className={`text-xs font-rajdhani ${
                          item.completed ? 'line-through text-slate-500' : 'text-slate-200'
                        }`}
                      >
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Custom Quest Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-sm rounded-xs bg-[#081226] border border-[#2D9CFF]/50 p-5 shadow-[0_0_30px_rgba(45,156,255,0.25)]">
            <span className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-[#2D9CFF]" />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-[#2D9CFF]" />

            <h3 className="text-xs font-orbitron font-bold text-[#2D9CFF] tracking-wider uppercase mb-1">
              [ REGISTER CUSTOM TRIAL ]
            </h3>
            <p className="text-[11px] font-rajdhani text-slate-400 mb-3">
              Formulate a real-life quest with authentic accountability.
            </p>

            <form onSubmit={handleCreateQuest} className="space-y-3 text-xs font-rajdhani">
              <div>
                <label className="block text-[10px] font-orbitron text-slate-400 mb-1">TRIAL TITLE</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 40 Diamond Push-ups or Read 20 Pages"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xs bg-[#040810] border border-white/15 text-white focus:outline-none focus:border-[#2D9CFF]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-orbitron text-slate-400 mb-1">DESCRIPTION</label>
                <input
                  type="text"
                  placeholder="Specific parameters and rules"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xs bg-[#040810] border border-white/15 text-white focus:outline-none focus:border-[#2D9CFF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-orbitron text-slate-400 mb-1">ATTRIBUTE</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as StatKey)}
                    className="w-full px-2 py-1.5 rounded-xs bg-[#040810] border border-white/15 text-white font-mono"
                  >
                    <option value="str">STR (Physical)</option>
                    <option value="agi">AGI (Consistency)</option>
                    <option value="int">INT (Study/Skill)</option>
                    <option value="vit">VIT (Health/Diet)</option>
                    <option value="sense">SENSE (Focus)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-orbitron text-slate-400 mb-1">DIFFICULTY</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as QuestDifficulty)}
                    className="w-full px-2 py-1.5 rounded-xs bg-[#040810] border border-white/15 text-white font-mono"
                  >
                    <option value="E">E (Base 10 XP)</option>
                    <option value="D">D (Base 20 XP)</option>
                    <option value="C">C (Base 40 XP)</option>
                    <option value="B">B (Base 80 XP)</option>
                    <option value="A">A (Base 150 XP)</option>
                    <option value="S">S (Base 300 XP)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-orbitron text-slate-400 mb-1">TYPE</label>
                <div className="grid grid-cols-3 gap-1">
                  {(['checkbox', 'counter', 'timer'] as QuestType[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setQuestType(t)}
                      className={`py-1 text-[10px] font-orbitron uppercase rounded-xs border ${
                        questType === t
                          ? 'bg-[#2D9CFF]/20 border-[#2D9CFF] text-[#2D9CFF] font-bold'
                          : 'bg-[#040810] border-white/10 text-slate-400'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {questType === 'counter' && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-orbitron text-slate-400 mb-1">TARGET COUNT</label>
                    <input
                      type="number"
                      min={1}
                      value={targetCount}
                      onChange={(e) => setTargetCount(Number(e.target.value))}
                      className="w-full px-2 py-1.5 rounded-xs bg-[#040810] border border-white/15 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-orbitron text-slate-400 mb-1">UNIT</label>
                    <input
                      type="text"
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      className="w-full px-2 py-1.5 rounded-xs bg-[#040810] border border-white/15 text-white"
                    />
                  </div>
                </div>
              )}

              {questType === 'timer' && (
                <div>
                  <label className="block text-[10px] font-orbitron text-slate-400 mb-1">
                    FOCUS DURATION (MINUTES)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={180}
                    value={timerMinutes}
                    onChange={(e) => setTimerMinutes(Number(e.target.value))}
                    className="w-full px-2 py-1.5 rounded-xs bg-[#040810] border border-white/15 text-white font-mono"
                  />
                </div>
              )}

              <div className="pt-2 flex gap-2">
                <GlowButton variant="ghost" fullWidth onClick={() => setShowAddModal(false)}>
                  CANCEL
                </GlowButton>
                <GlowButton variant="blue" fullWidth type="submit">
                  REGISTER QUEST
                </GlowButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
