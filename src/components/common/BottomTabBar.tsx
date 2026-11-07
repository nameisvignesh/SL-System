import React from 'react';
import { User, CheckSquare, Gift, ShieldAlert, Sparkles, BarChart2, Settings } from 'lucide-react';
import { sound } from '../../utils/audio';
import { hapticTick } from '../../utils/haptics';

export type TabKey = 'status' | 'quests' | 'vault' | 'dungeons' | 'arsenal' | 'analytics' | 'settings';

interface BottomTabBarProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  activeGateRewardCount?: number;
  unclaimedDailiesCount?: number;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeTab,
  onTabChange,
  activeGateRewardCount = 0,
  unclaimedDailiesCount = 0,
}) => {
  const tabs: { key: TabKey; label: string; icon: React.ReactNode; badge?: number }[] = [
    { key: 'status', label: 'STATUS', icon: <User className="w-4 h-4" /> },
    { key: 'quests', label: 'QUESTS', icon: <CheckSquare className="w-4 h-4" />, badge: unclaimedDailiesCount },
    { key: 'vault', label: 'VAULT', icon: <Gift className="w-4 h-4" />, badge: activeGateRewardCount },
    { key: 'dungeons', label: 'DUNGEON', icon: <ShieldAlert className="w-4 h-4" /> },
    { key: 'arsenal', label: 'ARSENAL', icon: <Sparkles className="w-4 h-4" /> },
    { key: 'analytics', label: 'STATS', icon: <BarChart2 className="w-4 h-4" /> },
    { key: 'settings', label: 'CONFIG', icon: <Settings className="w-4 h-4" /> },
  ];

  const handleSelect = (tab: TabKey) => {
    if (tab === activeTab) return;
    sound.playButtonTick();
    hapticTick();
    onTabChange(tab);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#050810]/95 backdrop-blur-md border-t border-[#2D9CFF]/20 px-1 py-1">
      <div className="max-w-md mx-auto grid grid-cols-7 gap-0.5 items-center">
        {tabs.map((t) => {
          const isActive = activeTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => handleSelect(t.key)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xs transition-colors min-h-[48px] ${
                isActive
                  ? 'text-[#2D9CFF] font-bold bg-[#2D9CFF]/10 shadow-[inset_0_0_8px_rgba(45,156,255,0.2)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {/* Active top line indicator */}
              {isActive && (
                <span className="absolute top-0 left-1 right-1 h-[2px] bg-[#2D9CFF] shadow-[0_0_6px_#2D9CFF]" />
              )}

              {/* Icon with optional badge */}
              <div className="relative mb-0.5">
                {t.icon}
                {t.badge && t.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 px-1 min-w-[12px] h-3 rounded-full bg-[#FFC857] text-black text-[8px] font-mono font-bold flex items-center justify-center">
                    {t.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span className="text-[9px] font-orbitron tracking-tight leading-none truncate max-w-full">
                {t.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
