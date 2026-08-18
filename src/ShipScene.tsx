import type { Inputs, StabilityResult } from './stability';

type Props = { data: StabilityResult; inputs: Inputs };
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function ShipScene({ data, inputs }: Props) {
  const cx = 410;
  const pivotY = 318;
  const deckY = 192;
  const keelY = 416;
  const beamPixels = clamp(inputs.beam * 13.5, 220, 440);
  const half = beamPixels / 2;
  const heel = data.heelAngle;
  const pxPerMeter = 190 / Math.max(inputs.depth, 1);
  const localG = { x: cx + data.effectiveGOffset * pxPerMeter, y: keelY - data.effectiveKg * pxPerMeter };
  const localB = { x: cx + Math.sin(heel * Math.PI / 180) * data.bm * pxPerMeter, y: keelY - data.kb * pxPerMeter };
  const localM = { x: cx, y: keelY - data.km * pxPerMeter };
  const cargoX = cx + inputs.cargoOffset * pxPerMeter;
  const cargoY = keelY - inputs.cargoHeight * pxPerMeter;
  const tankX = cx + inputs.ballastOffset * pxPerMeter;

  const rotate = (point: { x: number; y: number }) => {
    const angle = heel * Math.PI / 180;
    const dx = point.x - cx;
    const dy = point.y - pivotY;
    return { x: cx + dx * Math.cos(angle) - dy * Math.sin(angle), y: pivotY + dx * Math.sin(angle) + dy * Math.cos(angle) };
  };
  const g = rotate(localG);
  const b = rotate(localB);
  const m = rotate(localM);
  const gzLeft = Math.min(g.x, b.x);
  const gzWidth = Math.abs(g.x - b.x);
  const fillHeight = 40 * inputs.ballastLevel / 100;

  const hullPath = `M ${cx - half} ${deckY} Q ${cx - half + 15} 344 ${cx - 54} ${keelY} Q ${cx} 444 ${cx + 54} ${keelY} Q ${cx + half - 15} 344 ${cx + half} ${deckY} Z`;

  return (
    <section className="ship-viewport" aria-label="Vista transversal animada del buque">
      <div className="viewport-heading">
        <div><span className="section-kicker">SECCION MAESTRA</span><h2>Equilibrio transversal</h2></div>
        <div className="heel-display"><span>ESCORA</span><strong>{data.heelAngle > 0 ? 'E' : data.heelAngle < 0 ? 'B' : ''} {Math.abs(data.heelAngle).toFixed(1)}°</strong></div>
      </div>
      <svg viewBox="0 0 820 500" role="img" aria-label={`Buque con ${Math.abs(data.heelAngle).toFixed(1)} grados de escora`}>
        <defs>
          <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#137f9b" stopOpacity=".5"/><stop offset="1" stopColor="#073746" stopOpacity=".9"/></linearGradient>
          <linearGradient id="hull" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e8edf0"/><stop offset=".12" stopColor="#9caab0"/><stop offset=".14" stopColor="#182c35"/><stop offset="1" stopColor="#091b23"/></linearGradient>
          <linearGradient id="tank" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#39c7df"/><stop offset="1" stopColor="#10728a"/></linearGradient>
          <pattern id="grid" width="36" height="36" patternUnits="userSpaceOnUse"><path d="M36 0H0V36" fill="none" stroke="#8ec5d0" strokeOpacity=".06"/></pattern>
          <marker id="arrowGold" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10Z" fill="#f1b84b"/></marker>
          <marker id="arrowCyan" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10Z" fill="#53d3e7"/></marker>
          <clipPath id="hullClip"><path d={hullPath}/></clipPath>
        </defs>
        <rect width="820" height="500" fill="url(#grid)"/>
        <g opacity=".65"><path d="M0 304 Q55 295 110 304T220 304T330 304T440 304T550 304T660 304T770 304T880 304V500H0Z" fill="url(#sea)"/><path d="M0 304 Q55 295 110 304T220 304T330 304T440 304T550 304T660 304T770 304T880 304" fill="none" stroke="#8ee3ee" strokeWidth="2"/></g>
        <text x="22" y="291" className="scene-muted">LINEA DE FLOTACION</text>

        <g className="vessel" style={{ transform: `rotate(${heel}deg)`, transformOrigin: `${cx}px ${pivotY}px` }}>
          <path d={hullPath} fill="url(#hull)" stroke="#b8d1d5" strokeWidth="2"/>
          <path d={`M${cx - half + 14} ${deckY}H${cx + half - 14}`} stroke="#f4f6f2" strokeWidth="5"/>
          <path d={`M${cx - half + 30} 230H${cx + half - 30}M${cx - half + 50} 275H${cx + half - 50}`} stroke="#91a8ae" strokeOpacity=".28"/>
          <g clipPath="url(#hullClip)">
            <rect x={tankX - 68} y={keelY - 53} width="136" height="46" rx="3" fill="#071b24" stroke="#3a8290"/>
            <rect x={tankX - 66} y={keelY - 9 - fillHeight} width="132" height={fillHeight} fill="url(#tank)" opacity=".9"/>
            {inputs.ballastLevel > 2 && inputs.ballastLevel < 98 && <path d={`M${tankX - 64} ${keelY - 10 - fillHeight}q22 -4 44 0t44 0t44 0`} fill="none" stroke="#b2f3fa" strokeWidth="1.5"/>}
          </g>
          <g transform={`translate(${cargoX} ${cargoY})`} className="cargo"><rect x="-23" y="-19" width="46" height="38" rx="3" fill="#cf8248" stroke="#ffd2a6" strokeWidth="2"/><path d="M-23 -4H23M0 -19V19" stroke="#6f3a21" opacity=".65"/><text y="5" textAnchor="middle">C</text></g>
          <circle cx={localG.x} cy={localG.y} r="7" className="point point-g"/>
          <circle cx={localB.x} cy={localB.y} r="7" className="point point-b"/>
          <circle cx={localM.x} cy={localM.y} r="7" className="point point-m"/>
        </g>

        <line x1={g.x} y1={g.y - 1} x2={g.x} y2={465} stroke="#f1b84b" strokeWidth="2.5" markerEnd="url(#arrowGold)"/>
        <line x1={b.x} y1={b.y + 1} x2={b.x} y2={94} stroke="#53d3e7" strokeWidth="2.5" markerEnd="url(#arrowCyan)"/>
        <line x1={g.x} y1={g.y} x2={m.x} y2={m.y} stroke="#d8e5e7" strokeDasharray="5 5"/>
        {gzWidth > 2 && <g><line x1={gzLeft} y1={151} x2={gzLeft + gzWidth} y2={151} stroke="#ed806b" strokeWidth="3"/><path d={`M${gzLeft} 145v12M${gzLeft + gzWidth} 145v12`} stroke="#ed806b"/><text x={gzLeft + gzWidth / 2} y="139" textAnchor="middle" className="gz-label">GZ {data.gz.toFixed(2)} m</text></g>}

        <g transform={`translate(${g.x + 12} ${g.y - 10})`}><rect className="tag-bg" width="31" height="23"/><text x="15.5" y="16" textAnchor="middle" className="tag tag-g">G</text></g>
        <g transform={`translate(${b.x + 12} ${b.y + 8})`}><rect className="tag-bg" width="31" height="23"/><text x="15.5" y="16" textAnchor="middle" className="tag tag-b">B</text></g>
        <g transform={`translate(${m.x + 12} ${m.y - 12})`}><rect className="tag-bg" width="31" height="23"/><text x="15.5" y="16" textAnchor="middle" className="tag tag-m">M</text></g>
        <g transform="translate(24 443)" className="scene-legend"><circle cx="5" cy="5" r="5" className="point-g"/><text x="17" y="9">G gravedad</text><circle cx="116" cy="5" r="5" className="point-b"/><text x="128" y="9">B carena</text><circle cx="213" cy="5" r="5" className="point-m"/><text x="225" y="9">M metacentro</text></g>
        <text x="796" y="482" textAnchor="end" className="scene-muted">BABOR ←  |  → ESTRIBOR</text>
      </svg>
    </section>
  );
}
