import { StabilityPoint } from './stability';

type Props = { data: StabilityPoint[]; currentAngle: number };

export function StabilityChart({ data, currentAngle }: Props) {
  const width = 900; const height = 330; const left = 62; const right = 24; const top = 28; const bottom = 48;
  const minGz = Math.min(-0.25, ...data.map((point) => point.gz));
  const maxGz = Math.max(0.5, ...data.map((point) => point.gz));
  const x = (angle: number) => left + angle / 90 * (width-left-right);
  const y = (gz: number) => top + (maxGz-gz)/(maxGz-minGz)*(height-top-bottom);
  const zeroY = y(0);
  const points = data.map((point) => `${x(point.angle)},${y(point.gz)}`).join(' ');
  const positiveArea = data.map((point) => `${x(point.angle)},${y(Math.max(0, point.gz))}`).join(' ');
  const current = data.find((point) => point.angle >= Math.abs(currentAngle)) ?? data[0];
  const yTicks = Array.from({ length: 5 }, (_, index) => minGz + (maxGz-minGz)*index/4);

  return (
    <div className="chart-card">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Curva GZ entre cero y noventa grados">
        <defs><linearGradient id="positiveArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#55d6be" stopOpacity=".42"/><stop offset="1" stopColor="#55d6be" stopOpacity=".04"/></linearGradient></defs>
        {yTicks.map((tick) => <g key={tick}><line x1={left} y1={y(tick)} x2={width-right} y2={y(tick)} className="grid-line"/><text x={left-10} y={y(tick)+4} textAnchor="end" className="axis-label">{tick.toFixed(2)}</text></g>)}
        {[0,15,30,45,60,75,90].map((tick) => <g key={tick}><line x1={x(tick)} y1={top} x2={x(tick)} y2={height-bottom} className="grid-line"/><text x={x(tick)} y={height-bottom+25} textAnchor="middle" className="axis-label">{tick}°</text></g>)}
        <path d={`M${x(0)},${zeroY} L${positiveArea} L${x(90)},${zeroY} Z`} fill="url(#positiveArea)"/>
        <line x1={left} y1={zeroY} x2={width-right} y2={zeroY} className="zero-line"/>
        <polyline points={points} fill="none" stroke="#6ee7d8" strokeWidth="4" strokeLinejoin="round"/>
        <line x1={x(current.angle)} y1={top} x2={x(current.angle)} y2={height-bottom} stroke="#ffd166" strokeDasharray="6 6"/>
        <circle cx={x(current.angle)} cy={y(current.gz)} r="8" fill="#ffd166" stroke="#fff" strokeWidth="2"/>
        <text x={left} y="17" className="axis-title">GZ (m)</text><text x={width-right} y={height-8} textAnchor="end" className="axis-title">Ángulo de escora θ</text>
      </svg>
    </div>
  );
}
