import React from 'react';
import { sound } from '../../utils/audio';
import { hapticTick } from '../../utils/haptics';

interface GlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'blue' | 'gold' | 'danger' | 'ghost' | 'emerald';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  glow?: boolean;
  icon?: React.ReactNode;
}

export const GlowButton: React.FC<GlowButtonProps> = ({
  children,
  variant = 'blue',
  size = 'md',
  fullWidth = false,
  glow = true,
  icon,
  className = '',
  onClick,
  disabled,
  ...rest
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    sound.playButtonTick();
    hapticTick();
    if (onClick) onClick(e);
  };

  const sizeClasses = {
    sm: 'text-xs py-1.5 px-3 min-h-[36px]',
    md: 'text-xs py-2.5 px-4 min-h-[44px]',
    lg: 'text-sm py-3 px-5 min-h-[48px]',
  };

  const variantClasses = {
    blue: `bg-[#2D9CFF]/15 text-[#2D9CFF] border border-[#2D9CFF]/60 hover:bg-[#2D9CFF]/25 active:bg-[#2D9CFF]/35 ${
      glow ? 'shadow-[0_0_15px_rgba(45,156,255,0.25)]' : ''
    }`,
    gold: `bg-[#FFC857]/15 text-[#FFC857] border border-[#FFC857]/60 hover:bg-[#FFC857]/25 active:bg-[#FFC857]/35 ${
      glow ? 'shadow-[0_0_15px_rgba(255,200,87,0.25)]' : ''
    }`,
    danger: `bg-[#FF3B4E]/15 text-[#FF3B4E] border border-[#FF3B4E]/60 hover:bg-[#FF3B4E]/25 active:bg-[#FF3B4E]/35 ${
      glow ? 'shadow-[0_0_15px_rgba(255,59,78,0.25)]' : ''
    }`,
    emerald: `bg-[#2DFFB0]/15 text-[#2DFFB0] border border-[#2DFFB0]/60 hover:bg-[#2DFFB0]/25 active:bg-[#2DFFB0]/35 ${
      glow ? 'shadow-[0_0_15px_rgba(45,255,176,0.25)]' : ''
    }`,
    ghost: 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 active:bg-white/15',
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`relative inline-flex items-center justify-center gap-2 font-orbitron font-semibold tracking-wider uppercase transition-all duration-150 active:scale-[0.98] select-none rounded-xs disabled:opacity-40 disabled:pointer-events-none ${
        fullWidth ? 'w-full' : ''
      } ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...rest}
    >
      {/* Corner bracket accent */}
      <span className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-current pointer-events-none" />
      <span className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-current pointer-events-none" />

      {icon && <span className="shrink-0">{icon}</span>}
      <span className="truncate">{children}</span>
    </button>
  );
};
