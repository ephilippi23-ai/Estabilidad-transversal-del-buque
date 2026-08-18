import type { StabilityResult } from './stability';

const number=(value:number,digits=2)=>value.toLocaleString('es-UY',{minimumFractionDigits:digits,maximumFractionDigits:digits});

export function DynamicLesson({result}:{result:StabilityResult}) {
  const heeled=Math.abs(result.transverseG)>.0001;
  return <section className="dynamic-lesson">
    <div className="lesson-intro"><p className="eyebrow">Lectura guiada</p><h2>Del brazo a la energía, paso a paso</h2><p>Alterna las dos vistas del gráfico y sigue esta historia física.</p></div>
    <div className="learning-story-grid">
      <article><span>1 · Mira el brazo</span><h3>¿Qué quiere hacer ahora?</h3><p>GZ positivo produce un momento adrizante. El máximo es <b>{number(result.maxGz)} m</b> a {number(result.maxGzAngle,1)}°.</p></article>
      <article><span>2 · Suma las áreas</span><h3>¿Cuánta energía resiste?</h3><p><code>ED(θ) = ∫ GZ · dθ</code></p><p>La reserva acumulada máxima es <b>{number(result.maxDynamic,3)} m·rad</b>.</p></article>
      <article><span>3 · Encuentra los límites</span><h3>¿Dónde cambia el equilibrio?</h3><p>{heeled?<>Equilibrio estático a <b>{number(result.staticEquilibrium,1)}°</b>{result.dynamicEquilibrium!==null&&<> y dinámico a <b>{number(result.dynamicEquilibrium,1)}°</b></>}.</>:<>Sin momento escorante inicial, el buque parte en equilibrio. El brazo se extingue cerca de <b>{number(result.vanishingAngle,1)}°</b>.</>}</p></article>
    </div>
    <p className="lesson-note">Idea clave: dos curvas pueden tener el mismo GZ máximo y distinta estabilidad dinámica. La diferencia está en el área completa, no sólo en la altura del pico.</p>
  </section>;
}
