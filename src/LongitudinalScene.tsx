import { Inputs, StabilityResult } from './stability';

type Props = { data: StabilityResult; inputs: Inputs };

export function LongitudinalScene({ data, inputs }: Props) {
  const midshipX = 310;
  const metersToPixels = 18;
  const longitudinalX = (meters: number) => midshipX + meters * metersToPixels;
  const waterY = 235 - (inputs.draft - 2.3) * 12;

  return (
    <div className="ship-card longitudinal-card">
      <div className="ship-card-heading">
        <div><p className="eyebrow">Perfil longitudinal</p><h2>¿Dónde actúan B y F a lo largo del buque?</h2></div>
        <div className="heel-readout"><b>{inputs.draft.toFixed(1)} m</b><span>calado medio</span></div>
      </div>
      <div className="ship-canvas longitudinal-canvas">
        <svg viewBox="0 0 620 390" role="img" aria-label="Vista longitudinal didáctica del Buque Echo">
          <defs>
            <linearGradient id="sideHull" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#edf3f3"/><stop offset="1" stopColor="#81939a"/></linearGradient>
            <linearGradient id="sideSea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#187b98" stopOpacity=".75"/><stop offset="1" stopColor="#07334a"/></linearGradient>
          </defs>
          <rect x="0" y={waterY} width="620" height={390-waterY} fill="url(#sideSea)"/>
          <path d={`M0 ${waterY} Q80 ${waterY-5} 160 ${waterY} T320 ${waterY} T480 ${waterY} T640 ${waterY}`} fill="none" stroke="#7ae0f2" strokeWidth="3"/>
          <path d="M67 135 L525 135 L570 172 L548 231 Q530 277 420 291 L165 291 Q96 272 75 224 Z" fill="url(#sideHull)" stroke="#edf7f8" strokeWidth="3"/>
          <path d="M116 134 L141 91 L407 91 L434 134" fill="#253f49" stroke="#8aa1a8" strokeWidth="2"/>
          <rect x="178" y="65" width="112" height="68" rx="4" fill="#345461" stroke="#90a8af" strokeWidth="2"/>
          <rect x="205" y="42" width="58" height="23" rx="3" fill="#426774"/>
          <line x1="234" y1="42" x2="234" y2="18" stroke="#8eb9c0" strokeWidth="3"/>
          <path d="M455 134 L477 105 L510 134" fill="#345461"/>
          <line x1={midshipX} y1="52" x2={midshipX} y2="310" stroke="#b9d2d5" strokeDasharray="5 6" opacity=".45"/>
          <text x={midshipX} y="329" textAnchor="middle" className="svg-muted">Sección de referencia</text>

          <g className="longitudinal-marker marker-b">
            <line x1={longitudinalX(data.hydro.lcb)} y1="184" x2={longitudinalX(data.hydro.lcb)} y2="264"/>
            <circle cx={longitudinalX(data.hydro.lcb)} cy="224" r="11"/><text x={longitudinalX(data.hydro.lcb)-14} y="174" textAnchor="end">B · Xb {data.hydro.lcb.toFixed(2)} m</text>
          </g>
          <g className="longitudinal-marker marker-f">
            <line x1={longitudinalX(data.hydro.lcf)} y1="150" x2={longitudinalX(data.hydro.lcf)} y2="258"/>
            <circle cx={longitudinalX(data.hydro.lcf)} cy={waterY} r="11"/><text x={longitudinalX(data.hydro.lcf)+14} y="154">F · Xf {data.hydro.lcf.toFixed(2)} m</text>
          </g>

          <line x1="76" y1="344" x2="548" y2="344" stroke="#6f959b"/>
          <line x1="76" y1="337" x2="76" y2="351" stroke="#6f959b"/><line x1="548" y1="337" x2="548" y2="351" stroke="#6f959b"/>
          <text x="312" y="365" textAnchor="middle" className="svg-label">Eslora entre PP · 110 m</text>
          <text x="30" y={waterY-12} className="svg-muted">Línea de flotación</text>
          <text x="590" y="382" textAnchor="end" className="svg-muted">Separación Xb–Xf ampliada para facilitar la lectura</text>
        </svg>
      </div>
      <div className="longitudinal-explainer">
        <article><i className="dot-b"/><div><b>Centro de carena longitudinal (B)</b><p>Punto de aplicación del empuje. Su posición es Xb = {data.hydro.lcb.toFixed(2)} m.</p></div></article>
        <article><i className="dot-f"/><div><b>Centro de flotación (F)</b><p>El buque cambia su asiento alrededor de F. Xf = {data.hydro.lcf.toFixed(2)} m.</p></div></article>
        <article><i className="dot-mct"/><div><b>Momento para cambiar 1 cm</b><p>MCT 1 cm = {data.hydro.mct1cm.toFixed(1)} t·m/cm.</p></div></article>
      </div>
    </div>
  );
}
