import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/audio';
import { hapticSuccess } from '../../utils/haptics';
import { GlowButton } from './GlowButton';
import { Gift, Sparkles, Coins } from 'lucide-react';

interface BonusChestModalProps {
  isOpen: boolean;
  onClaim: (goldEarned: number, itemName?: string) => void;
}

export const BonusChestModal: React.FC<BonusChestModalProps> = ({ isOpen, onClaim }) => {
  const [opened, setOpened] = useState(false);
  const [goldReward, setGoldReward] = useState(0);
  const [itemReward, setItemReward] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleOpenChest = () => {
    sound.playRewardUnlock();
    hapticSuccess();

    const gold = Math.floor(Math.random() * 80) + 60; // 60-140 gold
    const bonusItems = ['Streak Shield', 'Elixir of 2x XP', 'Vitality Tonic', 'Dice of Fate'];
    const getsItem = Math.random() > 0.4;
    const item = getsItem ? bonusItems[Math.floor(Math.random() * bonusItems.length)] : null;

    setGoldReward(gold);
    setItemReward(item);
    setOpened(true);

    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.5 },
        colors: ['#FFC857', '#2D9CFF', '#FFFFFF'],
      });
    } catch {
      // ignore
    }
  };

  const handleCollect = () => {
    onClaim(goldReward, itemReward || undefined);
    setOpened(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm rounded-xs bg-[#091224] border border-[#FFC857]/60 shadow-[0_0_40px_rgba(255,200,87,0.3)] p-5 text-center">
        {/* Corner Accents */}
        <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#FFC857]" />
        <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#FFC857]" />
        <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#FFC857]" />
        <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#FFC857]" />

        <div className="text-[11px] font-orbitron font-bold text-[#FFC857] tracking-widest uppercase mb-1">
          [ DAILY ALL-CLEAR BONUS ]
        </div>
        <h2 className="text-xl font-orbitron font-extrabold text-white text-glow-gold">
          {opened ? 'CHEST UNSEALED!' : 'SYSTEM CHEST'}
        </h2>

        {/* Chest Display */}
        <div className="my-6 flex flex-col items-center justify-center min-h-[120px]">
          {!opened ? (
            <div className="relative group cursor-pointer" onClick={handleOpenChest}>
              <div className="w-24 h-24 rounded-lg bg-gradient-to-b from-[#2a1e06] to-[#120c02] border-2 border-[#FFC857] flex items-center justify-center shadow-[0_0_25px_rgba(255,200,87,0.4)] transition-transform duration-300 hover:scale-105 active:scale-95">
                <Gift className="w-12 h-12 text-[#FFC857] animate-bounce" />
              </div>
              <p className="text-xs font-rajdhani text-slate-300 mt-3 animate-pulse">
                Tap to unlock the System’s spoils
              </p>
            </div>
          ) : (
            <div className="space-y-3 animate-in zoom-in-95 duration-200">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xs bg-[#FFC857]/15 border border-[#FFC857]/40 text-[#FFC857] font-mono text-lg font-bold">
                <Coins className="w-5 h-5 text-[#FFC857]" /> +{goldReward} Gold Points
              </div>
              {itemReward && (
                <div className="flex items-center justify-center gap-1.5 text-xs font-rajdhani text-[#2DFFB0]">
                  <Sparkles className="w-4 h-4" /> Dropped: <span className="font-bold underline">{itemReward}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        {!opened ? (
          <GlowButton variant="gold" size="lg" fullWidth onClick={handleOpenChest}>
            OPEN REWARD CHEST
          </GlowButton>
        ) : (
          <GlowButton variant="gold" size="lg" fullWidth onClick={handleCollect}>
            COLLECT SPOILS
          </GlowButton>
        )}
      </div>
    </div>
  );
};
