import React from 'react';
import { Stats } from '../../types';

interface RadarChartProps {
  stats: Stats;
  maxStat?: number;
  size?: number;
}

export const RadarChart: React.FC<RadarChartProps> = ({ stats, maxStat = 50, size = 260 }) => {
  const center = size / 2;
  const radius = (size / 2) - 42; // Leave room for labels

  const axes: { key: keyof Stats; label: string; sub: string }[] = [
    { key: 'str', label: 'STR', sub: 'Strength' },
    { key: 'agi', label: 'AGI', sub: 'Agility' },
    { key: 'int', label: 'INT', sub: 'Intelligence' },
    { key: 'vit', label: 'VIT', sub: 'Vitality' },
    { key: 'sense', label: 'SENSE', sub: 'Perception' },
  ];

  const totalAxes = axes.length;
  const angleStep = (Math.PI * 2) / totalAxes;
  // Rotate so first axis points directly straight up (-PI / 2)
  const startAngle = -Math.PI / 2;

  // Calculate polygon points for grid rings (e.g. 25%, 50%, 75%, 100%)
  const gridLevels = [0.25, 0.5, 0.75, 1.0];

  const getCoordinates = (valueNormalized: number, index: number) => {
    const angle = startAngle + index * angleStep;
    const r = radius * Math.min(1.0, Math.max(0.08, valueNormalized));
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Generate data polygon points
  const points = axes.map((axis, i) => {
    const raw = stats[axis.key] || 10;
    const normalized = raw / maxStat;
    const { x, y } = getCoordinates(normalized, i);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="relative flex items-center justify-center select-none py-1">
      <svg width={size} height={size} className="overflow-visible">
        <defs>
          {/* Glowing gradient for data area */}
          <radialGradient id="radarFill" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#2D9CFF" stop-opacity="0.4" />
            <stop offset="70%" stop-color="#7B5CFF" stop-opacity="0.25" />
            <stop offset="100%" stop-color="#050810" stop-opacity="0.1" />
          </radialGradient>
          <filter id="radarGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Concentric Pentagonal Web Grid */}
        {gridLevels.map((lvl) => {
          const ringPoints = axes.map((_, i) => {
            const { x, y } = getCoordinates(lvl, i);
            return `${x},${y}`;
          }).join(' ');

          return (
            <polygon
              key={`grid-${lvl}`}
              points={ringPoints}
              fill="none"
              stroke="#2D9CFF"
              strokeWidth={lvl === 1.0 ? 1.5 : 0.75}
              strokeOpacity={lvl === 1.0 ? 0.4 : 0.15}
              strokeDasharray={lvl === 1.0 ? undefined : '2,2'}
            />
          );
        })}

        {/* Axis Spokes radiating from center */}
        {axes.map((_, i) => {
          const outer = getCoordinates(1.0, i);
          return (
            <line
              key={`spoke-${i}`}
              x1={center}
              y1={center}
              x2={outer.x}
              y2={outer.y}
              stroke="#2D9CFF"
              strokeWidth={1}
              strokeOpacity={0.25}
            />
          );
        })}

        {/* Center core point */}
        <circle cx={center} cy={center} r={3} fill="#2D9CFF" opacity={0.6} />

        {/* Player Stats Data Polygon */}
        <polygon
          points={points}
          fill="url(#radarFill)"
          stroke="#2D9CFF"
          strokeWidth={2}
          filter="url(#radarGlow)"
        />

        {/* Data Vertices (Glowing dots & values) */}
        {axes.map((axis, i) => {
          const raw = stats[axis.key] || 10;
          const normalized = raw / maxStat;
          const { x, y } = getCoordinates(normalized, i);
          return (
            <g key={`vertex-${axis.key}`}>
              <circle cx={x} cy={y} r={4.5} fill="#050810" stroke="#2DFFB0" strokeWidth={2} />
              <circle cx={x} cy={y} r={2} fill="#2DFFB0" />
            </g>
          );
        })}

        {/* Outer Axis Labels */}
        {axes.map((axis, i) => {
          const angle = startAngle + i * angleStep;
          const labelDist = radius + 24;
          const lx = center + labelDist * Math.cos(angle);
          const ly = center + labelDist * Math.sin(angle);
          const statVal = stats[axis.key];

          return (
            <g key={`label-${axis.key}`} className="cursor-default">
              <text
                x={lx}
                y={ly - 4}
                textAnchor="middle"
                dominantBaseline="central"
                fill="#2D9CFF"
                className="text-[12px] font-bold tracking-wider font-orbitron"
              >
                {axis.label}
              </text>
              <text
                x={lx}
                y={ly + 10}
                textAnchor="middle"
                dominantBaseline="central"
                fill="#94a3b8"
                className="text-[10px] font-mono font-medium"
              >
                {statVal}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
