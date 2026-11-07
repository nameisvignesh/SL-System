import React from 'react';

interface SystemWindowProps {
  title?: string;
  subHeader?: string;
  variant?: 'blue' | 'gold' | 'danger' | 'success';
  className?: string;
  children: React.ReactNode;
  headerRight?: React.ReactNode;
}

export const SystemWindow: React.FC<SystemWindowProps> = ({
  title,
  subHeader,
  variant = 'blue',
  className = '',
  children,
  headerRight,
}) => {
  const borderColors = {
    blue: 'border-[#2D9CFF]/40 shadow-[0_0_20px_rgba(45,156,255,0.12)]',
    gold: 'border-[#FFC857]/45 shadow-[0_0_20px_rgba(255,200,87,0.15)]',
    danger: 'border-[#FF3B4E]/45 shadow-[0_0_20px_rgba(255,59,78,0.15)]',
    success: 'border-[#2DFFB0]/45 shadow-[0_0_20px_rgba(45,255,176,0.15)]',
  };

  const cornerColors = {
    blue: '#2D9CFF',
    gold: '#FFC857',
    danger: '#FF3B4E',
    success: '#2DFFB0',
  };

  const titleColors = {
    blue: 'text-[#2D9CFF] text-glow-blue',
    gold: 'text-[#FFC857] text-glow-gold',
    danger: 'text-[#FF3B4E] text-glow-danger',
    success: 'text-[#2DFFB0]',
  };

  const cornerColor = cornerColors[variant];

  return (
    <div
      className={`relative rounded-sm bg-gradient-to-b from-[#0e1c38]/85 via-[#081224]/90 to-[#040814]/95 backdrop-blur-md border ${borderColors[variant]} p-3.5 transition-all duration-200 ${className}`}
    >
      {/* Corner Bracket Accents ┌ ┐ └ ┘ */}
      <span
        className="absolute top-0 left-0 w-2.5 h-2.5 pointer-events-none"
        style={{ borderTop: `2px solid ${cornerColor}`, borderLeft: `2px solid ${cornerColor}` }}
      />
      <span
        className="absolute top-0 right-0 w-2.5 h-2.5 pointer-events-none"
        style={{ borderTop: `2px solid ${cornerColor}`, borderRight: `2px solid ${cornerColor}` }}
      />
      <span
        className="absolute bottom-0 left-0 w-2.5 h-2.5 pointer-events-none"
        style={{ borderBottom: `2px solid ${cornerColor}`, borderLeft: `2px solid ${cornerColor}` }}
      />
      <span
        className="absolute bottom-0 right-0 w-2.5 h-2.5 pointer-events-none"
        style={{ borderBottom: `2px solid ${cornerColor}`, borderRight: `2px solid ${cornerColor}` }}
      />

      {/* Header if present */}
      {(title || headerRight) && (
        <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/10">
          <div>
            {title && (
              <h3 className={`text-xs uppercase font-orbitron font-bold tracking-wider ${titleColors[variant]}`}>
                {title}
              </h3>
            )}
            {subHeader && <p className="text-[10px] text-slate-400 font-rajdhani uppercase tracking-widest">{subHeader}</p>}
          </div>
          {headerRight && <div className="shrink-0">{headerRight}</div>}
        </div>
      )}

      {children}
    </div>
  );
};
