import React, { useState } from 'react';
import { InventoryItem, Player, Shadow, Skill, Title } from '../../types';
import { sound } from '../../utils/audio';
import { hapticLevelUp, hapticSuccess, hapticTick } from '../../utils/haptics';
import { SystemWindow } from '../common/SystemWindow';
import { GlowButton } from '../common/GlowButton';
import { Award, Zap, Shield, Sparkles, Check, Lock, Ghost } from 'lucide-react';

interface ArsenalViewProps {
  player: Player;
  titles: Title[];
  skills: Skill[];
  inventory: InventoryItem[];
  shadows: Shadow[];
  onEquipTitle: (title: Title) => void;
  onUseItem: (item: InventoryItem) => void;
}

export const ArsenalView: React.FC<ArsenalViewProps> = ({
  player,
  titles,
  skills,
  inventory,
  shadows,
  onEquipTitle,
  onUseItem,
}) => {
  const [section, setSection] = useState<'inventory' | 'shadows' | 'titles' | 'skills'>('inventory');

  const handleUseItem = (item: InventoryItem) => {
    if (item.quantity <= 0) return;
    sound.playRewardUnlock();
    hapticSuccess();
    onUseItem(item);
  };

  const handleEquipTitle = (title: Title) => {
    if (!title.unlocked) return;
    sound.playButtonTick();
    hapticTick();
    onEquipTitle(title);
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Top Header */}
      <div>
        <h2 className="text-sm font-orbitron font-extrabold text-[#7B5CFF] text-glow-blue tracking-wide uppercase">
          HUNTER ARSENAL &amp; SHADOW ARMY
        </h2>
        <p className="text-[11px] font-rajdhani text-slate-400">
          Equipped titles, unlocked skills, consumable items, and extracted shadows.
        </p>
      </div>

      {/* Segmented Section Switcher */}
      <div className="grid grid-cols-4 gap-1 p-1 bg-[#060c18] rounded-xs border border-white/10">
        {(
          [
            { key: 'inventory', label: 'ITEMS' },
            { key: 'shadows', label: 'SHADOWS' },
            { key: 'titles', label: 'TITLES' },
            { key: 'skills', label: 'SKILLS' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              sound.playButtonTick();
              setSection(tab.key);
            }}
            className={`py-1 text-center text-[10px] font-orbitron uppercase rounded-xs transition-colors ${
              section === tab.key
                ? 'bg-[#7B5CFF]/25 text-[#7B5CFF] font-bold border border-[#7B5CFF]/50 shadow-[0_0_10px_rgba(123,92,255,0.2)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* SECTION 1: INVENTORY ITEMS */}
      {section === 'inventory' && (
        <div className="space-y-2.5">
          {inventory.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 rounded-xs bg-[#081226]/80 border border-white/10"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl p-2 rounded-xs bg-white/5 border border-white/10 shrink-0">
                  {item.icon}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-orbitron font-bold text-white">{item.name}</h3>
                    <span className="px-1.5 py-0.5 rounded-xs bg-[#2D9CFF]/15 border border-[#2D9CFF]/40 text-[10px] font-mono text-[#2D9CFF] font-bold">
                      x{item.quantity}
                    </span>
                  </div>
                  <p className="text-[11px] font-rajdhani text-slate-300 mt-0.5">{item.description}</p>
                </div>
              </div>

              <GlowButton
                variant="blue"
                size="sm"
                disabled={item.quantity <= 0}
                onClick={() => handleUseItem(item)}
              >
                USE
              </GlowButton>
            </div>
          ))}
        </div>
      )}

      {/* SECTION 2: SHADOW ARMY */}
      {section === 'shadows' && (
        <div className="space-y-3">
          <div className="p-3 rounded-xs bg-[#090d1c] border border-[#7B5CFF]/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Ghost className="w-4 h-4 text-[#7B5CFF]" />
              <span className="text-xs font-orbitron font-bold text-white">ARMY COUNT:</span>
            </div>
            <span className="text-xs font-mono font-bold text-[#7B5CFF]">
              {shadows.filter((s) => !s.isDormant).length} Active Shadows
            </span>
          </div>

          <div className="space-y-2.5">
            {shadows.map((shadow) => (
              <div
                key={shadow.id}
                className={`p-3.5 rounded-xs border transition-all ${
                  shadow.isDormant
                    ? 'bg-[#050810]/70 border-slate-800 opacity-60'
                    : 'bg-gradient-to-b from-[#140e2c] to-[#080514] border-[#7B5CFF]/50 shadow-[0_0_20px_rgba(123,92,255,0.2)]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-1.5 py-0.5 rounded-xs bg-[#7B5CFF]/20 border border-[#7B5CFF]/50 text-[9px] font-mono font-bold text-[#A38BFF]">
                        RANK-{shadow.rank} · LVL {shadow.level}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {shadow.currentStreak}d Streak
                      </span>
                    </div>

                    <h3 className="text-xs font-orbitron font-extrabold text-white tracking-wide">
                      {shadow.shadowName}
                    </h3>
                    <p className="text-[11px] font-rajdhani text-slate-300 mt-0.5">
                      Forged from habit: <span className="text-[#2DFFB0]">{shadow.habitName}</span>
                    </p>

                    <div className="mt-2 text-[10px] font-mono text-[#7B5CFF] font-semibold">
                      Passive Buff: {shadow.passiveBuff}
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 text-[9px] font-orbitron uppercase rounded-xs border ${
                      shadow.isDormant
                        ? 'border-slate-700 text-slate-500'
                        : 'border-[#2DFFB0]/40 text-[#2DFFB0] bg-[#2DFFB0]/10'
                    }`}
                  >
                    {shadow.isDormant ? 'DORMANT' : 'ARISE'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: TITLES */}
      {section === 'titles' && (
        <div className="space-y-2.5">
          {titles.map((title) => {
            const isEquipped = player.equippedTitleId === title.id;
            return (
              <div
                key={title.id}
                className={`p-3 rounded-xs border transition-all ${
                  isEquipped
                    ? 'bg-[#1a1406]/80 border-[#FFC857]/60 shadow-[0_0_15px_rgba(255,200,87,0.2)]'
                    : title.unlocked
                    ? 'bg-[#081226]/80 border-white/10'
                    : 'bg-[#050810]/60 border-slate-800 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Award className="w-3.5 h-3.5 text-[#FFC857]" />
                      <h3 className="text-xs font-orbitron font-bold text-white">{title.name}</h3>
                      {isEquipped && (
                        <span className="text-[9px] font-orbitron font-bold text-[#FFC857] px-1.5 py-0.5 rounded-xs bg-[#FFC857]/20 border border-[#FFC857]/40">
                          EQUIPPED
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] font-rajdhani text-slate-300 mt-0.5">{title.description}</p>
                    <div className="mt-1.5 text-[10px] font-mono text-[#2DFFB0]">
                      Buff: {title.buffDescription}
                    </div>
                    {!title.unlocked && (
                      <p className="text-[10px] font-rajdhani text-slate-500 mt-1">
                        Unlock requirement: {title.requirement}
                      </p>
                    )}
                  </div>

                  {title.unlocked && !isEquipped && (
                    <GlowButton
                      variant="gold"
                      size="sm"
                      onClick={() => handleEquipTitle(title)}
                    >
                      EQUIP
                    </GlowButton>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SECTION 4: SKILLS */}
      {section === 'skills' && (
        <div className="space-y-2.5">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className={`p-3 rounded-xs border transition-all ${
                skill.unlocked
                  ? 'bg-gradient-to-b from-[#0c1a36] to-[#070e1c] border-[#2D9CFF]/50 shadow-[0_0_15px_rgba(45,156,255,0.15)]'
                  : 'bg-[#050810]/60 border-slate-800 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-[#2D9CFF]" />
                    <h3 className="text-xs font-orbitron font-bold text-white">{skill.name}</h3>
                    <span className="text-[9px] font-mono uppercase text-slate-400">
                      [{skill.category}]
                    </span>
                  </div>
                  <p className="text-[11px] font-rajdhani text-slate-300 mt-0.5">{skill.description}</p>
                  <div className="mt-1.5 text-[10px] font-mono text-[#2DFFB0]">
                    Effect: {skill.effect}
                  </div>
                  {!skill.unlocked && (
                    <p className="text-[10px] font-mono text-slate-500 mt-1">
                      Requires: {skill.statRequirement.value} {skill.statRequirement.stat.toUpperCase()}
                    </p>
                  )}
                </div>

                <div className="shrink-0">
                  {skill.unlocked ? (
                    <span className="text-[10px] font-orbitron font-bold text-[#2DFFB0]">ACTIVE</span>
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-slate-600" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
