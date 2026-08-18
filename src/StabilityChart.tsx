import { useState } from 'react';
import type { StabilityResult } from './stability';

type Mode = 'static' | 'dynamic';

export function StabilityChart({ result }: { result: StabilityResult }) {
  const [mode, setMode] = useState<Mode>('static');
  const width=900, height=330, left=58, right=20, top=26, bottom=46;
  const plotWidth=width-left-right, plotHeight=height-top-bottom;
  const source=mode==='static'?result.curve.map(({angle,gz})=>({angle,value:gz})):result.dynamicCurve.map(({angle,energy})=>({angle,value:energy}));
  const values=source.map(point=>point.value), padding=Math.max(.03,(Math.max(...values)-Math.min(...values))*.12);
  const yMin=Math.min(0,Math.min(...values)-padding), yMax=Math.max(.05,Math.max(...values)+padding);
  const x=(angle:number)=>left+angle/90*plotWidth;
  const y=(value:number)=>top+(yMax-value)/(yMax-yMin)*plotHeight;
  const line=(points:{angle:number;value:number}[])=>points.map(point=>`${x(point.angle)},${y(point.value)}`).join(' ');
  const area=(positive:boolean)=>`${x(0)},${y(0)} ${source.map(point=>`${x(point.angle)},${y(positive?Math.max(0,point.value):Math.min(0,point.value))}`).join(' ')} ${x(90)},${y(0)}`;
  const showHeel=Math.abs(result.transverseG)>.0001;
  const markers=mode==='static'
    ? [{angle:result.staticEquilibrium,label:'Equilibrio estático'},{angle:result.maxGzAngle,label:'GZ máximo'},{angle:result.vanishingAngle,label:'Extinción'}]
    : [{angle:result.maxDynamicAngle,label:'Reserva máxima'},...(result.dynamicEquilibrium!==null?[{angle:result.dynamicEquilibrium,label:'Equilibrio dinámico'}]:[])];

  return <div className="chart-card">
    <div className="chart-mode-toggle" role="group" aria-label="Tipo de estabilidad">
      <button className={mode==='static'?'active':''} onClick={()=>setMode('static')}>Estática · brazo</button>
      <button className={mode==='dynamic'?'active':''} onClick={()=>setMode('dynamic')}>Dinámica · energía</button>
    </div>
    <div className="chart-legend">
      <span><i className="legend-resultant"/> {mode==='static'?'GZ resultante':'Energía acumulada'}</span>
      {mode==='static'&&showHeel&&<><span><i className="legend-upright"/> GZ adrizante</span><span><i className="legend-heeling"/> Brazo escorante</span></>}
      <span><i className="legend-positive"/> Reserva positiva</span>
    </div>
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={mode==='static'?'Curva de brazos de estabilidad':'Curva de estabilidad dinámica'}>
      {[0,15,30,45,60,75,90].map(tick=><g key={tick}><line className="grid-line" x1={x(tick)} x2={x(tick)} y1={top} y2={height-bottom}/><text x={x(tick)} y={height-18} textAnchor="middle">{tick}°</text></g>)}
      <line className="zero-line" x1={left} x2={width-right} y1={y(0)} y2={y(0)}/>
      <text className="axis-unit" x={12} y={18}>{mode==='static'?'GZ (m)':'ED (m·rad)'}</text>
      <polygon className="area-positive" points={area(true)}/><polygon className="area-negative" points={area(false)}/>
      {mode==='static'&&showHeel&&<><polyline className="curve-upright" points={line(result.uprightCurve.map(({angle,gz})=>({angle,value:gz})))}/><polyline className="curve-heeling" points={line(result.heelingCurve.map(({angle,gz})=>({angle,value:gz})))}/></>}
      <polyline className="curve-resultant" points={line(source)}/>
      {markers.filter(marker=>marker.angle>0&&marker.angle<=90).map((marker,index)=><g className="chart-marker" key={marker.label}><line x1={x(marker.angle)} x2={x(marker.angle)} y1={top+8} y2={height-bottom}/><circle cx={x(marker.angle)} cy={y(source[Math.round(marker.angle*2)]?.value??0)} r="5"/><text x={x(marker.angle)+(index%2?6:-6)} y={top+14+index*17} textAnchor={index%2?'start':'end'}>{marker.label} · {marker.angle.toFixed(1)}°</text></g>)}
    </svg>
    <p className="chart-help">{mode==='static'?'La altura indica la tendencia instantánea a adrizar. El área verde muestra dónde existe brazo favorable.':'Esta curva suma el área bajo GZ: representa el trabajo acumulado que puede absorber el buque antes del equilibrio dinámico.'}</p>
  </div>;
}
