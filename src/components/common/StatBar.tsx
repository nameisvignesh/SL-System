import React from 'react';

interface StatBarProps {
  label: string;
  subLabel?: string;
  current: number;
  max: number;
  variant: 'hp' | 'mp' | 'xp';
  showValues?: boolean;
  className?: string;
}

export const StatBar: React.FC<StatBarProps> = ({
  label,
  subLabel,
  current,
  max,
  variant,
  showValues = true,
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, (current / (max || 1)) * 100));

  const variants = {
    hp: {
      bar: 'bg-gradient-to-r from-[#FF3B4E] to-[#FF6B7A] shadow-[0_0_12px_rgba(255,59,78,0.5)]',
      text: 'text-[#FF6B7A]',
      bg: 'bg-[#FF3B4E]/10 border-[#FF3B4E]/25',
    },
    mp: {
      bar: 'bg-gradient-to-r from-[#7B5CFF] to-[#2D9CFF] shadow-[0_0_12px_rgba(123,92,255,0.5)]',
      text: 'text-[#A38BFF]',
      bg: 'bg-[#7B5CFF]/10 border-[#7B5CFF]/25',
    },
    xp: {
      bar: 'bg-gradient-to-r from-[#2D9CFF] to-[#2DFFB0] shadow-[0_0_12px_rgba(45,156,255,0.5)]',
      text: 'text-[#2D9CFF]',
      bg: 'bg-[#2D9CFF]/10 border-[#2D9CFF]/25',
    },
  };

  const style = variants[variant];

  return (
    <div className={`space-y-1 ${className}`}>
      <div className="flex items-center justify-between text-xs font-rajdhani font-semibold">
        <div className="flex items-center gap-1.5">
          <span className={`font-orbitron font-bold tracking-wider ${style.text}`}>{label}</span>
          {subLabel && <span className="text-[10px] text-slate-400 font-normal">({subLabel})</span>}
        </div>
        {showValues && (
          <span className="font-mono text-[11px] text-slate-300 tabular-nums">
            {Math.round(current)} / {Math.round(max)}{' '}
            <span className="text-slate-500 text-[10px]">({percentage.toFixed(0)}%)</span>
          </span>
        )}
      </div>

      {/* Progress container */}
      <div className={`h-2.5 w-full rounded-xs border p-[1px] ${style.bg} relative overflow-hidden`}>
        <div
          className={`h-full rounded-xs transition-all duration-300 ease-out ${style.bar}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
