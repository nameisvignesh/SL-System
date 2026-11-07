import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Player, StatKey } from '../../types';
import { sound } from '../../utils/audio';
import { hapticLevelUp, hapticTick } from '../../utils/haptics';
import { GlowButton } from './GlowButton';
import { Plus, Minus, Zap } from 'lucide-react';

interface LevelUpOverlayProps {
  isOpen: boolean;
  player: Player;
  onConfirm: (updatedPlayer: Player) => void;
}

export const LevelUpOverlay: React.FC<LevelUpOverlayProps> = ({ isOpen, player, onConfirm }) => {
  const [allocatedStats, setAllocatedStats] = useState<Record<StatKey, number>>({
    str: 0,
    agi: 0,
    int: 0,
    vit: 0,
    sense: 0,
  });
  const [remainingPoints, setRemainingPoints] = useState(player.statPoints);

  useEffect(() => {
    if (isOpen) {
      sound.playLevelUp();
      hapticLevelUp();
      setRemainingPoints(player.statPoints);
      setAllocatedStats({ str: 0, agi: 0, int: 0, vit: 0, sense: 0 });

      // Trigger blue electric confetti burst
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#2D9CFF', '#7B5CFF', '#2DFFB0', '#FFFFFF'],
        });
      } catch {
        // Confetti fallback
      }
    }
  }, [isOpen, player.statPoints]);

  if (!isOpen) return null;

  const handleIncrement = (stat: StatKey) => {
    if (remainingPoints <= 0) return;
    sound.playButtonTick();
    hapticTick();
    setRemainingPoints((prev) => prev - 1);
    setAllocatedStats((prev) => ({ ...prev, [stat]: prev[stat] + 1 }));
  };

  const handleDecrement = (stat: StatKey) => {
    if (allocatedStats[stat] <= 0) return;
    sound.playButtonTick();
    hapticTick();
    setRemainingPoints((prev) => prev + 1);
    setAllocatedStats((prev) => ({ ...prev, [stat]: prev[stat] - 1 }));
  };

  const handleSave = () => {
    const updated: Player = {
      ...player,
      statPoints: remainingPoints,
      stats: {
        str: player.stats.str + allocatedStats.str,
        agi: player.stats.agi + allocatedStats.agi,
        int: player.stats.int + allocatedStats.int,
        vit: player.stats.vit + allocatedStats.vit,
        sense: player.stats.sense + allocatedStats.sense,
      },
      hp: player.maxHp,
      mp: player.maxMp,
    };
    onConfirm(updated);
  };

  const statLabels: { key: StatKey; label: string; desc: string }[] = [
    { key: 'str', label: 'STR', desc: 'Physical power & endurance' },
    { key: 'agi', label: 'AGI', desc: 'Habit execution & speed' },
    { key: 'int', label: 'INT', desc: 'Deep focus & mental study' },
    { key: 'vit', label: 'VIT', desc: 'Sleep, nutrition & resilience' },
    { key: 'sense', label: 'SENSE', desc: 'Mindfulness & alertness' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in zoom-in-95 duration-300">
      <div className="relative w-full max-w-sm rounded-xs bg-gradient-to-b from-[#0c1a36] via-[#070e1c] to-[#040810] border border-[#2D9CFF] shadow-[0_0_50px_rgba(45,156,255,0.4)] p-5">
        {/* Corner Accents */}
        <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#2D9CFF]" />
        <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#2D9CFF]" />
        <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#2D9CFF]" />
        <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#2D9CFF]" />

        {/* Header Burst */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-1 text-[11px] font-orbitron font-bold text-[#2DFFB0] tracking-widest uppercase mb-1">
            <Zap className="w-3.5 h-3.5" /> [ SYSTEM NOTIFICATION ]
          </div>
          <h1 className="text-2xl font-orbitron font-black text-transparent bg-clip-text bg-gradient-to-r from-[#2D9CFF] via-[#FFFFFF] to-[#2DFFB0] tracking-widest text-glow-blue animate-pulse">
            LEVEL UP!
          </h1>
          <p className="text-xs font-rajdhani text-slate-300 mt-1">
            You have reached <span className="text-[#2D9CFF] font-bold">Level {player.level}</span>
          </p>
          <div className="mt-2 inline-block px-3 py-1 bg-[#2D9CFF]/15 border border-[#2D9CFF]/30 text-xs font-mono text-[#2D9CFF]">
            Available Stat Points: <span className="font-bold text-white text-sm">{remainingPoints}</span>
          </div>
        </div>

        {/* Stat Allocation List */}
        <div className="space-y-2 mb-5">
          {statLabels.map((s) => {
            const currentTotal = player.stats[s.key] + allocatedStats[s.key];
            const added = allocatedStats[s.key];

            return (
              <div
                key={s.key}
                className="flex items-center justify-between p-2 rounded-xs bg-[#081226]/80 border border-white/10"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-orbitron font-bold text-xs text-[#2D9CFF]">{s.label}</span>
                    <span className="font-mono text-xs text-white font-bold">{currentTotal}</span>
                    {added > 0 && (
                      <span className="text-[11px] font-mono text-[#2DFFB0] font-semibold">+{added}</span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 font-rajdhani">{s.desc}</p>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleDecrement(s.key)}
                    disabled={added <= 0}
                    className="w-7 h-7 flex items-center justify-center rounded-xs bg-white/5 border border-white/10 text-slate-300 disabled:opacity-20 hover:bg-white/10 active:scale-95"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleIncrement(s.key)}
                    disabled={remainingPoints <= 0}
                    className="w-7 h-7 flex items-center justify-center rounded-xs bg-[#2D9CFF]/20 border border-[#2D9CFF]/40 text-[#2D9CFF] disabled:opacity-20 hover:bg-[#2D9CFF]/30 active:scale-95 shadow-[0_0_10px_rgba(45,156,255,0.2)]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom confirmation */}
        <GlowButton variant="blue" size="lg" fullWidth onClick={handleSave}>
          CONFIRM ATTRIBUTES
        </GlowButton>
      </div>
    </div>
  );
};
