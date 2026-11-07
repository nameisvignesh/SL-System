import React, { useEffect } from 'react';
import { sound } from '../../utils/audio';
import { hapticTick, hapticWarning } from '../../utils/haptics';
import { GlowButton } from './GlowButton';
import { TypewriterText } from './TypewriterText';

interface SystemNotificationModalProps {
  isOpen: boolean;
  header: string; // e.g. "[ NOTIFICATION ]"
  message: string;
  type?: 'info' | 'warning' | 'level_up' | 'reward' | 'penalty' | 'promotion';
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

export const SystemNotificationModal: React.FC<SystemNotificationModalProps> = ({
  isOpen,
  header,
  message,
  type = 'info',
  confirmText = 'ACCEPT',
  cancelText,
  onConfirm,
  onCancel,
}) => {
  useEffect(() => {
    if (isOpen) {
      if (type === 'warning' || type === 'penalty') {
        sound.playWarning();
        hapticWarning();
      } else {
        sound.playSystemDing();
        hapticTick();
      }
    }
  }, [isOpen, type]);

  if (!isOpen) return null;

  const headerColors = {
    info: 'text-[#2D9CFF] text-glow-blue',
    reward: 'text-[#FFC857] text-glow-gold',
    level_up: 'text-[#2DFFB0]',
    warning: 'text-[#FF3B4E] text-glow-danger',
    penalty: 'text-[#FF3B4E] text-glow-danger',
    promotion: 'text-[#7B5CFF]',
  };

  const borderColors = {
    info: 'border-[#2D9CFF]/60 shadow-[0_0_30px_rgba(45,156,255,0.25)]',
    reward: 'border-[#FFC857]/60 shadow-[0_0_30px_rgba(255,200,87,0.25)]',
    level_up: 'border-[#2DFFB0]/60 shadow-[0_0_30px_rgba(45,255,176,0.25)]',
    warning: 'border-[#FF3B4E]/70 shadow-[0_0_30px_rgba(255,59,78,0.3)]',
    penalty: 'border-[#FF3B4E]/70 shadow-[0_0_30px_rgba(255,59,78,0.3)]',
    promotion: 'border-[#7B5CFF]/70 shadow-[0_0_30px_rgba(123,92,255,0.3)]',
  };

  const cornerColor = type === 'reward' ? '#FFC857' : type === 'warning' || type === 'penalty' ? '#FF3B4E' : '#2D9CFF';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-sm rounded-xs bg-[#070e1c] border p-5 ${borderColors[type]} transition-all`}
      >
        {/* Corner Brackets */}
        <span
          className="absolute top-0 left-0 w-3 h-3 pointer-events-none"
          style={{ borderTop: `2px solid ${cornerColor}`, borderLeft: `2px solid ${cornerColor}` }}
        />
        <span
          className="absolute top-0 right-0 w-3 h-3 pointer-events-none"
          style={{ borderTop: `2px solid ${cornerColor}`, borderRight: `2px solid ${cornerColor}` }}
        />
        <span
          className="absolute bottom-0 left-0 w-3 h-3 pointer-events-none"
          style={{ borderBottom: `2px solid ${cornerColor}`, borderLeft: `2px solid ${cornerColor}` }}
        />
        <span
          className="absolute bottom-0 right-0 w-3 h-3 pointer-events-none"
          style={{ borderBottom: `2px solid ${cornerColor}`, borderRight: `2px solid ${cornerColor}` }}
        />

        {/* Header */}
        <div className="text-center mb-3">
          <h2 className={`text-sm font-orbitron font-extrabold tracking-widest uppercase ${headerColors[type]}`}>
            {header}
          </h2>
          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#2D9CFF]/50 to-transparent mx-auto mt-1" />
        </div>

        {/* Content with Typewriter effect */}
        <div className="my-4 min-h-[54px] text-xs font-rajdhani text-slate-200 leading-relaxed text-center px-1">
          <TypewriterText text={message} speed={12} />
        </div>

        {/* Action Buttons */}
        <div className="mt-5 flex gap-2">
          {cancelText && onCancel && (
            <GlowButton
              variant="ghost"
              size="md"
              fullWidth
              onClick={onCancel}
            >
              {cancelText}
            </GlowButton>
          )}
          <GlowButton
            variant={type === 'reward' ? 'gold' : type === 'warning' || type === 'penalty' ? 'danger' : 'blue'}
            size="md"
            fullWidth
            onClick={onConfirm}
          >
            {confirmText}
          </GlowButton>
        </div>
      </div>
    </div>
  );
};
