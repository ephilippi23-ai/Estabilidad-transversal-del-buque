import { StabilityResult, Inputs } from './stability';

type ShipSceneProps = {
  data: StabilityResult;
  inputs: Inputs;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export function ShipScene({ data, inputs }: ShipSceneProps) {
  const heel = clamp(data.heelAngle / 25, 0, 1);
  const beam = inputs.beam;
  const draft = inputs.draft;
  const depth = inputs.depth;
  const beamScale = clamp(beam * 6.5, 160, 340);
  const hullTop = 98;
  const hullBottom = 228;
  const centerX = 260;
  const centerY = 190;
  const waterY = 210;
  const keelY = hullBottom - draft * 7;
  const deckY = hullTop - 36;
  const kgX = centerX + data.gOffset * 12;
  const ballastX = centerX + inputs.ballastOffset * 10;
  const cargoX = centerX + inputs.cargoOffset * 8;
  const ballastFill = clamp(inputs.ballast / 5000, 0, 1);
  const hullHalf = beamScale / 2;
  const flare = clamp(beamScale * 0.28, 48, 96);
  const vesselPath = `M${centerX - hullHalf},${hullBottom}
    C${centerX - hullHalf + flare * 0.3},${keelY + 12}
     ${centerX - hullHalf + flare * 0.65},${deckY + 4}
     ${centerX},${deckY}
    C${centerX + hullHalf - flare * 0.65},${deckY + 4}
     ${centerX + hullHalf - flare * 0.3},${keelY + 12}
     ${centerX + hullHalf},${hullBottom} Z`;
  const deckPath = `M${centerX - hullHalf + 12},${deckY} L${centerX + hullHalf - 12},${deckY}`;
  const waterlinePath = `M${centerX - hullHalf + 20},${waterY} C${centerX - hullHalf + 70},${waterY - 8} ${centerX + hullHalf - 70},${waterY - 10} ${centerX + hullHalf - 20},${waterY}`;

  return (
    <div className="ship-scene">
      <div className="ship-card">
        <div className="ship-caption">Vista de sección transversal</div>
        <div className="ship-canvas">
          <svg viewBox="0 0 520 360" width="100%" height="100%" aria-label="Sección transversal del barco">
            <defs>
              <linearGradient id="hull-gradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#1f3f70" />
                <stop offset="100%" stopColor="#0f2546" />
              </linearGradient>
              <linearGradient id="water-gradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#4da0ff" stopOpacity="0.88" />
                <stop offset="100%" stopColor="#033c83" stopOpacity="0.95" />
              </linearGradient>
              <linearGradient id="ballast-gradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#ffcc8b" />
                <stop offset="100%" stopColor="#ff823f" />
              </linearGradient>
            </defs>

            <rect x="0" y="0" width="520" height="360" fill="transparent" />
            <rect x="0" y={waterY} width="520" height="360" fill="url(#water-gradient)" />
            <line x1="40" y1={waterY} x2="480" y2={waterY} stroke="#f4fbff" strokeWidth="4" opacity="0.78" />
            <path d={waterlinePath} fill="none" stroke="#cde9ff" strokeWidth="2" opacity="0.85" strokeDasharray="6 5" />
            <text x="430" y={waterY - 10} fill="#d9edff" fontSize="12">Línea de flotación</text>

            <g transform={`translate(${centerX} ${centerY}) rotate(${-data.heelAngle}) translate(${-centerX} ${-centerY})`}>
              <path d={vesselPath} fill="url(#hull-gradient)" stroke="#7ea8ff" strokeWidth="3" />
              <path d={deckPath} fill="none" stroke="#d9e7ff" strokeWidth="2" opacity="0.7" />
              <path d={`M${centerX - hullHalf + 26},${hullBottom - 18} L${centerX - hullHalf + 36},${hullBottom - 26} M${centerX + hullHalf - 26},${hullBottom - 18} L${centerX + hullHalf - 36},${hullBottom - 26}`} fill="none" stroke="#acc7ff" strokeWidth="2" opacity="0.75" />
            </g>

            <g>
              <path d={`M${centerX - hullHalf + 46},${hullBottom - 12} L${centerX - hullHalf + 130},${hullTop - 24}`} fill="none" stroke="#92c8ff" strokeWidth="1.4" opacity="0.7" />
              <path d={`M${centerX + hullHalf - 46},${hullBottom - 12} L${centerX + hullHalf - 130},${hullTop - 24}`} fill="none" stroke="#92c8ff" strokeWidth="1.4" opacity="0.7" />
            </g>

            <g>
              <line x1={kgX} y1={deckY - 6} x2={kgX} y2={keelY + 8} stroke="#f5d547" strokeWidth="3" />
              <circle cx={kgX} cy={deckY - 6} r="7" fill="#f5d547" stroke="#fff" strokeWidth="2" />
              <text x={kgX + 12} y={deckY + 4} className="label-text">G</text>
            </g>

            <g>
              <line x1={centerX} y1={deckY + 4} x2={centerX} y2={keelY + 8} stroke="#58c8ff" strokeWidth="3" />
              <circle cx={centerX} cy={deckY + 4} r="7" fill="#58c8ff" stroke="#fff" strokeWidth="2" />
              <text x={centerX + 12} y={deckY + 14} className="label-text">B</text>
            </g>

            <g>
              <line x1={centerX} y1={deckY - 40} x2={centerX} y2={deckY + 4} stroke="#ffffff" strokeDasharray="4 4" strokeWidth="2" />
              <circle cx={centerX} cy={deckY - 40} r="7" fill="#ffffff" stroke="#064d88" strokeWidth="2" />
              <text x={centerX + 12} y={deckY - 30} className="label-text">M</text>
            </g>

            <g>
              <line x1={kgX} y1={deckY - 6} x2={centerX} y2={deckY - 40} stroke="#ff8c50" strokeWidth="2" opacity="0.95" />
              <text x={(kgX + centerX) / 2 + 14} y={deckY - 44} className="label-text">GZ</text>
            </g>

            <g>
              <rect x={ballastX - 20} y={hullBottom - 40} width="40" height="28" fill="url(#ballast-gradient)" opacity="0.95" rx="6" />
              <rect x={ballastX - 20} y={hullBottom - 40 + 28 * (1 - ballastFill)} width="40" height={28 * ballastFill} fill="#fff7e3" rx="6" />
              <text x={ballastX + 24} y={hullBottom - 10} className="label-text">Lastre</text>
            </g>

            <g>
              <rect x={cargoX - 16} y={hullTop + 30} width="32" height="24" fill="#93d37f" stroke="#fff" strokeWidth="2" rx="6" />
              <text x={cargoX + 18} y={hullTop + 46} className="label-text">Carga</text>
            </g>

            <g>
              <circle cx={64} cy={62} r="34" fill="rgba(255,255,255,0.07)" />
              <path d={`M45,62 A20,20 0 0,1 85,62`} fill="none" stroke="#ffcf75" strokeWidth="3" />
              <text x="64" y="70" className="small-label">{data.heelAngle.toFixed(1)}°</text>
              <text x="64" y="84" className="small-label">Escora</text>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
