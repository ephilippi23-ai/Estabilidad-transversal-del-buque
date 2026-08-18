import { Inputs, StabilityResult } from './stability';

type Props = { data: StabilityResult; inputs: Inputs };
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function ShipScene({ data, inputs }: Props) {
  const centerX = 300; const keelY = 275; const pxPerMeter = 22;
  const pointY = (height: number) => clamp(keelY - height * pxPerMeter, 34, keelY);
  const waterY = pointY(inputs.draft);
  const heel = clamp(data.heelAngle, -28, 28);
  const cargoX = centerX + (inputs.shiftDistance / 8) * 118;
  const tankLevel = clamp(inputs.freeSurfaceMoment / 4000, 0, 1);

  return (
    <div className="ship-card">
      <div className="ship-card-heading"><div><p className="eyebrow">Sección transversal</p><h2>¿Dónde están G, B y M?</h2></div><div className="heel-readout"><b>{data.heelAngle.toFixed(1)}°</b><span>escora</span></div></div>
      <div className="ship-canvas">
        <svg viewBox="0 0 600 390" role="img" aria-label="Sección transversal didáctica del Buque Echo">
          <defs>
            <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#187b98" stopOpacity=".7"/><stop offset="1" stopColor="#062e48" stopOpacity=".95"/></linearGradient>
            <linearGradient id="hull" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e8edf0"/><stop offset="1" stopColor="#788892"/></linearGradient>
            <marker id="arrowBlue" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0,8 L4,0 L8,8" fill="none" stroke="#58d9ff" strokeWidth="1.5"/></marker>
            <marker id="arrowGold" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0,0 L4,8 L8,0" fill="none" stroke="#ffd166" strokeWidth="1.5"/></marker>
          </defs>
          <rect x="0" y={waterY} width="600" height={390-waterY} fill="url(#sea)"/>
          <path d={`M0 ${waterY} Q75 ${waterY-5} 150 ${waterY} T300 ${waterY} T450 ${waterY} T600 ${waterY}`} fill="none" stroke="#80ddf2" strokeWidth="3"/>
          <text x="24" y={waterY-12} className="svg-muted">Flotación · T = {inputs.draft.toFixed(1)} m</text>

          <g transform={`rotate(${heel} ${centerX} ${waterY})`}>
            <path d="M155 112 L445 112 L430 202 Q412 270 300 292 Q188 270 170 202 Z" fill="url(#hull)" stroke="#eef7fb" strokeWidth="3"/>
            <path d="M172 202 Q300 224 428 202" fill="none" stroke="#273c47" strokeWidth="2" opacity=".45"/>
            <rect x="185" y="122" width="230" height="24" rx="5" fill="#233b48" opacity=".75"/>
            <rect x="209" y="239" width="72" height="34" rx="5" fill="#143f55" stroke="#62c9e6"/>
            {tankLevel > 0 && <rect x="212" y={268-25*tankLevel} width="66" height={25*tankLevel} rx="3" fill="#5bc9e8" opacity=".8"/>}
            <line x1="212" y1={252-tankLevel*4} x2="278" y2={252+tankLevel*4} stroke="#c8f5ff" strokeWidth="2"/>
            <text x="245" y="288" textAnchor="middle" className="svg-muted">tanque</text>
            {inputs.shiftedWeight > 0 && <g><rect x={cargoX-18} y="151" width="36" height="30" rx="5" fill="#f4a261"/><text x={cargoX} y="171" textAnchor="middle" className="svg-dark">w</text></g>}
          </g>

          <line x1={centerX} y1={pointY(data.hydro.kb)+42} x2={centerX} y2={pointY(data.hydro.kb)-42} stroke="#58d9ff" strokeWidth="2" markerEnd="url(#arrowBlue)"/>
          <line x1={centerX+data.transverseG*150} y1={pointY(data.correctedKg)-42} x2={centerX+data.transverseG*150} y2={pointY(data.correctedKg)+42} stroke="#ffd166" strokeWidth="2" markerEnd="url(#arrowGold)"/>
          <g className="point point-b"><circle cx={centerX} cy={pointY(data.hydro.kb)} r="10"/><text x={centerX+16} y={pointY(data.hydro.kb)+5}>B · {data.hydro.kb.toFixed(2)} m</text></g>
          <g className="point point-g"><circle cx={centerX+data.transverseG*150} cy={pointY(data.correctedKg)} r="10"/><text x={centerX+16+data.transverseG*150} y={pointY(data.correctedKg)-12}>G · {data.correctedKg.toFixed(2)} m</text></g>
          <g className="point point-m"><circle cx={centerX} cy={pointY(data.hydro.km)} r="10"/><text x={centerX+16} y={pointY(data.hydro.km)+5}>M · {data.hydro.km.toFixed(2)} m</text></g>
          <line x1="500" y1={pointY(data.correctedKg)} x2="500" y2={pointY(data.hydro.km)} stroke={data.gm >= 0 ? '#6ee7a0' : '#ff6b6b'} strokeWidth="5"/>
          <text x="515" y={(pointY(data.correctedKg)+pointY(data.hydro.km))/2+4} className="svg-label">GM</text>
          <text x="22" y="365" className="svg-muted">Las alturas se representan desde la quilla; la rotación se amplifica solo hasta 28° para facilitar la lectura.</text>
        </svg>
      </div>
    </div>
  );
}
