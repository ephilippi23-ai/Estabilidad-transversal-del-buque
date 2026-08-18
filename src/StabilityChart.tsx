import type { StabilityPoint } from './stability';

type Props = { data: StabilityPoint[]; currentAngle: number; downfloodAngle: number };

export function StabilityChart({ data, currentAngle, downfloodAngle }: Props) {
  const width = 760;
  const height = 310;
  const pad = { left: 58, right: 28, top: 28, bottom: 45 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;
  const minGz = Math.min(0, ...data.map((point) => point.gz));
  const maxGz = Math.max(0.2, ...data.map((point) => point.gz));
  const range = maxGz - minGz;
  const x = (angle: number) => pad.left + angle / 60 * plotW;
  const y = (gz: number) => pad.top + (maxGz - gz) / range * plotH;
  const zeroY = y(0);
  const line = data.map((point, index) => `${index === 0 ? 'M' : 'L'}${x(point.angle)} ${y(point.gz)}`).join(' ');
  const area = `${line} L${x(60)} ${zeroY} L${x(0)} ${zeroY} Z`;
  const current = data[Math.min(data.length - 1, Math.round(currentAngle * 2))];

  return (
    <div className="chart-wrap">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Curva GZ entre cero y sesenta grados">
        <defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4bd2c7" stopOpacity=".32"/><stop offset="1" stopColor="#4bd2c7" stopOpacity=".02"/></linearGradient></defs>
        {[0, 15, 30, 45, 60].map((angle) => <g key={angle}><line x1={x(angle)} y1={pad.top} x2={x(angle)} y2={height - pad.bottom} className="chart-grid"/><text x={x(angle)} y={height - 18} textAnchor="middle" className="axis-label">{angle}°</text></g>)}
        {[0, .25, .5, .75, 1].map((ratio) => { const value = minGz + range * ratio; return <g key={ratio}><line x1={pad.left} y1={y(value)} x2={width - pad.right} y2={y(value)} className="chart-grid"/><text x={pad.left - 10} y={y(value) + 4} textAnchor="end" className="axis-label">{value.toFixed(1)}</text></g>; })}
        <rect x={x(downfloodAngle)} y={pad.top} width={Math.max(0, x(60) - x(downfloodAngle))} height={plotH} className="risk-zone"/>
        <line x1={pad.left} y1={zeroY} x2={width - pad.right} y2={zeroY} className="axis-zero"/>
        <path d={area} fill="url(#area)"/>
        <path d={line} className="gz-curve"/>
        <line x1={x(currentAngle)} y1={pad.top} x2={x(currentAngle)} y2={height - pad.bottom} className="current-line"/>
        <circle cx={x(currentAngle)} cy={y(current.gz)} r="7" className="current-dot"/>
        <g transform={`translate(${Math.min(x(currentAngle) + 11, width - 105)} ${Math.max(y(current.gz) - 34, 12)})`}><rect width="90" height="25" rx="3" className="chart-tag"/><text x="45" y="17" textAnchor="middle" className="chart-tag-text">GZ {current.gz.toFixed(2)} m</text></g>
        <text x={x(downfloodAngle) + 8} y={pad.top + 16} className="risk-label">INUNDACION</text>
        <text x="18" y="20" className="axis-title">GZ (m)</text>
        <text x={width - pad.right} y={height - 18} textAnchor="end" className="axis-title">ESCORA</text>
      </svg>
    </div>
  );
}
