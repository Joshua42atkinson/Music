import React, { useMemo } from 'react';

export default function PitchTelemetryMap({ telemetryData }) {
  const points = useMemo(() => {
    if (!telemetryData) return [];
    if (typeof telemetryData === 'string') {
      try {
        return JSON.parse(telemetryData);
      } catch {
        return [];
      }
    }
    return telemetryData;
  }, [telemetryData]);

  if (points.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 border border-cf-border/40 rounded-xl bg-white/5 text-center">
        <p className="text-sm text-white/50">No pitch telemetry calculated yet.</p>
        <p className="text-xs text-white/30 mt-1">Check pitch accuracy.</p>
      </div>
    );
  }

  // Calculate scales
  const maxTime = Math.max(...points.map(p => p.time), 1.0);
  const minTime = 0;
  
  const width = 600;
  const height = 150;
  const padding = 20;

  const xScale = (time) => {
    return padding + ((time - minTime) / (maxTime - minTime)) * (width - 2 * padding);
  };

  const yScale = (cents) => {
    // cents is -50 to +50
    const clamped = Math.max(-50, Math.min(50, cents));
    return height / 2 - (clamped / 50.0) * (height / 2 - padding);
  };

  return (
    <div className="pitch-telemetry-container bg-cf-deep border border-cf-border/60 rounded-xl p-4">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-xs font-mono uppercase tracking-wider text-white/80">Pythagoras Microtonal Pitch Deviation Map</h4>
        <span className="text-[9px] font-mono text-cf-gold px-2 py-0.5 bg-cf-gold/10 rounded-full">
          ±50 Cents Target
        </span>
      </div>

      <div className="relative overflow-x-auto">
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
          {/* Central perfect-pitch zero line */}
          <line
            x1={padding}
            y1={height / 2}
            x2={width - padding}
            y2={height / 2}
            stroke="rgba(201, 169, 110, 0.25)"
            strokeDasharray="4 4"
            strokeWidth={1.5}
          />
          {/* Zero line tag */}
          <text x={padding + 5} y={height / 2 - 5} fill="rgba(var(--cf-gold-rgb),0.5)" className="text-[8px] font-mono">
            Perfect Pitch (0 cents)
          </text>

          {/* Upper Limit line (+50 cents) */}
          <line
            x1={padding}
            y1={padding}
            x2={width - padding}
            y2={padding}
            stroke="rgba(232, 85, 85, 0.15)"
            strokeWidth={1}
          />
          <text x={width - padding - 40} y={padding + 10} fill="rgba(232, 85, 85, 0.4)" className="text-[7px] font-mono">
            +50 Cents (Sharp)
          </text>

          {/* Lower Limit line (-50 cents) */}
          <line
            x1={padding}
            y1={height - padding}
            x2={width - padding}
            y2={height - padding}
            stroke="rgba(123, 106, 170, 0.15)"
            strokeWidth={1}
          />
          <text x={width - padding - 40} y={height - padding - 5} fill="rgba(123, 106, 170, 0.4)" className="text-[7px] font-mono">
            -50 Cents (Flat)
          </text>

          {/* Render points */}
          {points.map((pt, idx) => {
            const cx = xScale(pt.time);
            const cy = yScale(pt.deviation_cents);
            const isAccurate = Math.abs(pt.deviation_cents) <= 15.0;
            const dotColor = isAccurate ? 'var(--cf-gold)' : '#7b6aaa'; // Gold if accurate, violet if flat/sharp
            const glowColor = isAccurate ? 'rgba(var(--cf-gold-rgb),0.4)' : 'rgba(123,106,170,0.4)';

            return (
              <g key={idx} className="group cursor-pointer">
                <title>
                  {`${pt.note} (${pt.deviation_cents > 0 ? '+' : ''}${pt.deviation_cents.toFixed(1)}c) at ${pt.time.toFixed(2)}s`}
                </title>
                {/* Glow ring */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={4}
                  fill={glowColor}
                  className="transition-all duration-200 group-hover:r-6"
                />
                {/* Core dot */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={2}
                  fill={dotColor}
                />
                {/* Note Label on hover/high intensity */}
                {(idx % 5 === 0 || pt.amplitude > 0.05) && (
                  <text
                    x={cx}
                    y={cy - 6}
                    fill="rgba(255,255,255,0.4)"
                    textAnchor="middle"
                    className="text-[7px] font-mono select-none pointer-events-none"
                  >
                    {pt.note}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="flex gap-4 items-center justify-center mt-2 text-[9px] font-mono text-white/50">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cf-gold" />
          <span>©PLING! Sweetspot (≤15 cents deviation)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#7b6aaa]" />
          <span>Microtonal Tension (&gt;15 cents deviation)</span>
        </div>
      </div>
    </div>
  );
}
