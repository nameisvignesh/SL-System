import React from 'react';
import { Player } from '../../types';
import { Coins, Flame, Volume2, VolumeX, Bell } from 'lucide-react';
import { sound } from '../../utils/audio';

interface MobileHeaderProps {
  player: Player;
  unreadCount?: number;
  onOpenNotifications: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  player,
  unreadCount = 0,
  onOpenNotifications,
  soundEnabled,
  onToggleSound,
}) => {
  const rankColors: Record<Player['rank'], string> = {
    E: 'text-slate-300 border-slate-500/50 bg-slate-500/10',
    D: 'text-emerald-400 border-emerald-500/50 bg-emerald-500/10',
    C: 'text-blue-400 border-blue-500/50 bg-blue-500/10',
    B: 'text-purple-400 border-purple-500/50 bg-purple-500/10',
    A: 'text-amber-400 border-amber-500/50 bg-amber-500/10',
    S: 'text-rose-400 border-rose-500/60 bg-rose-500/20 text-glow-danger',
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-[#050810]/95 backdrop-blur-md border-b border-[#2D9CFF]/20 px-3.5 py-2.5 flex items-center justify-between gap-2">
      {/* Left: System identity */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xs bg-[#2D9CFF]/15 border border-[#2D9CFF]/50 flex items-center justify-center shadow-[0_0_10px_rgba(45,156,255,0.2)]">
          <span className="font-orbitron font-black text-xs text-[#2D9CFF]">SYS</span>
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-orbitron font-extrabold text-xs tracking-wider text-white">SYSTEM</span>
            <span
              className={`px-1.5 py-0.5 rounded-xs border text-[10px] font-mono font-bold ${rankColors[player.rank]}`}
            >
              RANK-{player.rank}
            </span>
          </div>
          <div className="text-[10px] font-mono text-slate-400">
            LVL <span className="text-[#2D9CFF] font-bold">{player.level}</span> · {player.name}
          </div>
        </div>
      </div>

      {/* Right: Metrics & quick controls */}
      <div className="flex items-center gap-2.5">
        {/* Streak */}
        <div className="flex items-center gap-1 px-2 py-1 rounded-xs bg-[#FF3B4E]/10 border border-[#FF3B4E]/25">
          <Flame className="w-3.5 h-3.5 text-[#FF3B4E]" />
          <span className="font-mono text-xs font-bold text-slate-100">{player.streakDays}d</span>
        </div>

        {/* Gold */}
        <div className="flex items-center gap-1 px-2 py-1 rounded-xs bg-[#FFC857]/10 border border-[#FFC857]/25">
          <Coins className="w-3.5 h-3.5 text-[#FFC857]" />
          <span className="font-mono text-xs font-bold text-[#FFC857] tabular-nums">{player.gold}</span>
        </div>

        {/* Sound toggle */}
        <button
          onClick={onToggleSound}
          aria-label="Toggle sound"
          className="w-8 h-8 flex items-center justify-center rounded-xs bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 active:scale-95"
        >
          {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-[#2D9CFF]" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
        </button>

        {/* Notifications */}
        <button
          onClick={onOpenNotifications}
          aria-label="View notifications"
          className="relative w-8 h-8 flex items-center justify-center rounded-xs bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 active:scale-95"
        >
          <Bell className="w-3.5 h-3.5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FF3B4E] text-white text-[9px] font-mono font-bold flex items-center justify-center animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
