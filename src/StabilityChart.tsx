import { StabilityPoint } from './stability';

type StabilityChartProps = {
  data: StabilityPoint[];
  currentAngle: number;
};

export function StabilityChart({ data, currentAngle }: StabilityChartProps) {
  const maxGz = Math.max(...data.map((point) => point.gz), 0.5);
  const maxAngle = Math.max(...data.map((point) => point.angle), 30);
  const width = 620;
  const height = 260;
  const padding = 40;

  const points = data
    .map((point) => {
      const x = padding + ((width - padding * 2) * point.angle) / maxAngle;
      const y = height - padding - ((height - padding * 2) * point.gz) / maxGz;
      return `${x},${y}`;
    })
    .join(' ');

  const currentAngleClamped = Math.min(currentAngle, maxAngle);
  const currentX = padding + ((width - padding * 2) * currentAngleClamped) / maxAngle;
  const currentY = height - padding - ((height - padding * 2) * (Math.max(0, data.find((point) => point.angle >= currentAngleClamped)?.gz ?? 0))) / maxGz;

  return (
    <div className="chart-card">
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%" aria-label="Curva de estabilidad GZ">
        <defs>
          <linearGradient id="curve-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#6bf8ed" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#0f1f3c" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" rx="18" fill="#0c1531" />
        <g>
          {Array.from({ length: 5 }).map((_, index) => {
            const y = padding + ((height - padding * 2) / 4) * index;
            return (
              <line key={index} x1={padding} y1={y} x2={width - padding} y2={y} stroke="#4e77ff" opacity="0.12" />
            );
          })}
          {Array.from({ length: 7 }).map((_, index) => {
            const x = padding + ((width - padding * 2) / 6) * index;
            return (
              <line key={index} x1={x} y1={padding} x2={x} y2={height - padding} stroke="#4e77ff" opacity="0.12" />
            );
          })}
          <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#4e77ff" opacity="0.35" />
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#4e77ff" opacity="0.35" />
        </g>
        <path d={`M${padding},${height - padding} ${points} L${currentX},${height - padding} Z`} fill="url(#curve-fill)" opacity="0.9" />
        <polyline points={points} fill="none" stroke="#6bf8ed" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={currentX} cy={currentY} r="9" fill="#ffbf4d" stroke="#fff" strokeWidth="2" />
        <line x1={currentX} y1={currentY} x2={currentX} y2={height - padding} stroke="#ffbf4d" strokeDasharray="4 4" />
        <line x1={padding} y1={currentY} x2={currentX} y2={currentY} stroke="#84c9ff" strokeDasharray="3 4" opacity="0.8" />
        <text x={currentX + 12} y={currentY - 12} className="chart-label">Actual</text>
        <text x={width / 2} y={padding - 12} fill="#fff" fontSize="14" fontWeight="700" textAnchor="middle">
          Curva de estabilidad GZ
        </text>
        <text x={width - padding} y={height - padding + 24} fill="#a5b7ff" fontSize="12" textAnchor="end">
          0° — 30°
        </text>
        <text x={padding} y={padding - 12} fill="#a5b7ff" fontSize="12" textAnchor="start">
          GZ (m)
        </text>
      </svg>
    </div>
  );
}
