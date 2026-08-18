import { useMemo, useState } from 'react';
import { calculateStability, draftFromDisplacement, Inputs } from './stability';
import { ShipScene } from './ShipScene';
import { LongitudinalScene } from './LongitudinalScene';
import { StabilityChart } from './StabilityChart';
import { Slider } from './Slider';
import { LoadPlan } from './LoadPlan';
import { calculateLoadSummary, defaultLoadWeights, LoadWeights } from './loadData';

const initialState: Inputs = { draft: 5.8, kg: 5.39, freeSurfaceMoment: 0, shiftedWeight: 0, shiftDistance: 0, loadTransverseMoment: 0 };

const lessons = [
  { title: '1. Flotación', tag: 'Δ y calado', text: 'Al aumentar el calado crece el volumen de carena y, por Arquímedes, el desplazamiento. La tabla hidrostática vincula ambos valores.' },
  { title: '2. Equilibrio inicial', tag: 'KB, KM y GM', text: 'KB ubica el centro de carena. KM ubica el metacentro. GM = KM − KG corregido indica la tendencia inicial a volver a adrizarse.' },
  { title: '3. Superficies libres', tag: 'Corrección de KG', text: 'El líquido en un tanque parcialmente lleno se desplaza y reduce la estabilidad. Se representa elevando virtualmente G: FSC = momento de superficie libre / Δ.' },
  { title: '4. Traslado de pesos', tag: 'Momento escorante', text: 'Mover un peso transversalmente desplaza G. El momento es w·d y el corrimiento GG′ = w·d / Δ.' },
  { title: '5. Grandes ángulos', tag: 'KN y GZ', text: 'Las pantocarenas proporcionan KN para cada desplazamiento y ángulo. El brazo adrizante se obtiene con GZ = KN − KG·sen θ.' },
];

const presets: Array<{ label: string; values: Inputs }> = [
  { label: 'Condición normal', values: initialState },
  { label: 'Tanque parcialmente lleno', values: { ...initialState, freeSurfaceMoment: 4000 } },
  { label: 'Peso a estribor', values: { ...initialState, shiftedWeight: 400, shiftDistance: 8 } },
  { label: 'KG elevado', values: { ...initialState, kg: 7.3 } },
];

const number = (value: number, digits = 2) => value.toLocaleString('es-UY', { minimumFractionDigits: digits, maximumFractionDigits: digits });

function App() {
  const [inputs, setInputs] = useState(initialState);
  const [lesson, setLesson] = useState(0);
  const [view, setView] = useState<'transverse' | 'longitudinal'>('transverse');
  const [mode, setMode] = useState<'explore' | 'load'>('explore');
  const [loadWeights, setLoadWeights] = useState<LoadWeights>(defaultLoadWeights);
  const loadSummary = useMemo(() => calculateLoadSummary(loadWeights), [loadWeights]);
  const effectiveInputs = useMemo<Inputs>(() => mode === 'explore' ? inputs : ({
    draft: draftFromDisplacement(loadSummary.displacement), kg: loadSummary.kg,
    freeSurfaceMoment: loadSummary.freeSurfaceMoment, shiftedWeight: 0, shiftDistance: 0,
    loadTransverseMoment: loadSummary.tcg * loadSummary.displacement,
  }), [mode, inputs, loadSummary]);
  const stability = useMemo(() => calculateStability(effectiveInputs), [effectiveInputs]);
  const set = (field: keyof Inputs) => (value: number) => setInputs((current) => ({ ...current, [field]: value }));
  const updateLoad = (id: string, value: number) => setLoadWeights((current) => ({ ...current, [id]: Number.isFinite(value) ? value : 0 }));

  return (
    <div className="page-shell">
      <header className="hero-panel">
        <div>
          <p className="eyebrow">Laboratorio interactivo · Buque Echo</p>
          <h1>Entender la estabilidad, paso a paso</h1>
          <p className="hero-copy">Experimenta con datos reales del buque tipo E y observa cómo cada decisión modifica G, M, GM y la curva de brazos adrizantes.</p>
          <div className="hero-guide"><span><b>1</b> Elige un concepto</span><span><b>2</b> Mueve un control</span><span><b>3</b> Observa y explica</span></div>
        </div>
        <div className={`status-badge status-${stability.statusColor}`}><span className="status-dot" />{stability.statusLabel}</div>
      </header>

      <div className="mode-switcher" role="group" aria-label="Modo del simulador">
        <button className={mode === 'explore' ? 'active' : ''} onClick={() => setMode('explore')}><b>Explorador rápido</b><span>Controla las variables directamente</span></button>
        <button className={mode === 'load' ? 'active' : ''} onClick={() => setMode('load')}><b>Cuadro de carga</b><span>Calcula Δ y G desde pesos reales</span><em>Nuevo</em></button>
      </div>

      <nav className="lesson-strip" aria-label="Recorrido de aprendizaje">
        {lessons.map((item, index) => <button key={item.title} className={lesson === index ? 'active' : ''} onClick={() => setLesson(index)}><span>{item.title}</span><small>{item.tag}</small></button>)}
      </nav>

      <section className="lesson-callout">
        <div className="lesson-number">0{lesson + 1}</div>
        <div><p className="eyebrow">Concepto activo</p><h2>{lessons[lesson].title}</h2><p>{lessons[lesson].text}</p></div>
        <button className="next-lesson" onClick={() => setLesson((lesson + 1) % lessons.length)}>{lesson === lessons.length - 1 ? 'Volver al inicio' : 'Siguiente concepto'} <span>→</span></button>
      </section>

      <main className="layout-grid">
        <section className="visual-panel">
          <div className="view-switcher" role="group" aria-label="Seleccionar vista del buque">
            <button className={view === 'transverse' ? 'active' : ''} onClick={() => setView('transverse')}><span>↔</span><div><b>Vista transversal</b><small>Escora, G, B, M y GM</small></div></button>
            <button className={view === 'longitudinal' ? 'active' : ''} onClick={() => setView('longitudinal')}><span>⇄</span><div><b>Vista longitudinal</b><small>Flotación, asiento, Xb y Xf</small></div></button>
          </div>
          {view === 'transverse' ? <ShipScene data={stability} inputs={effectiveInputs} /> : <LongitudinalScene data={stability} inputs={effectiveInputs} lcg={mode === 'load' ? loadSummary.lcg : undefined} />}
          <div className="metric-grid">
            <article><span>Desplazamiento Δ</span><strong>{number(stability.hydro.displacement, 0)} t</strong><small>Interpolado de la tabla</small></article>
            <article><span>KB</span><strong>{number(stability.hydro.kb)} m</strong><small>Quilla → centro de carena</small></article>
            <article><span>KM</span><strong>{number(stability.hydro.km)} m</strong><small>Quilla → metacentro</small></article>
            <article className={stability.gm <= 0 ? 'metric-alert' : ''}><span>GM corregido</span><strong>{number(stability.gm)} m</strong><small>KM − KG corregido</small></article>
          </div>
          <div className="live-insight">
            <div className="pulse-icon">↗</div>
            <div><span>Lectura rápida</span><strong>{stability.gm > 1 ? 'G está claramente por debajo de M: hay una reserva inicial amplia.' : stability.gm > 0 ? 'G aún está debajo de M, pero el margen se está reduciendo.' : 'G superó a M: prueba bajar KG o eliminar superficie libre.'}</strong></div>
            <div className="gm-scale"><span>GM</span><div><i style={{ width: `${Math.max(0, Math.min(100, stability.gm / 2 * 100))}%` }} /></div><b>{number(stability.gm)} m</b></div>
          </div>
          {mode === 'explore' && <div className="missions-panel">
            <div className="missions-heading"><div><p className="eyebrow">Aprende haciendo</p><h3>Misiones rápidas</h3></div><span>{[inputs.freeSurfaceMoment >= 3000, inputs.shiftedWeight >= 300 && inputs.shiftDistance >= 6, stability.gm <= 0].filter(Boolean).length}/3</span></div>
            <div className="missions-grid">
              <button className={inputs.freeSurfaceMoment >= 3000 ? 'done' : ''} onClick={() => setInputs({ ...initialState, freeSurfaceMoment: 4000 })}><i>{inputs.freeSurfaceMoment >= 3000 ? '✓' : '1'}</i><span><b>Haz visible la superficie libre</b><small>¿Cuánto GM se pierde?</small></span></button>
              <button className={inputs.shiftedWeight >= 300 && inputs.shiftDistance >= 6 ? 'done' : ''} onClick={() => setInputs({ ...initialState, shiftedWeight: 400, shiftDistance: 8 })}><i>{inputs.shiftedWeight >= 300 && inputs.shiftDistance >= 6 ? '✓' : '2'}</i><span><b>Provoca una escora</b><small>Sigue el desplazamiento de G.</small></span></button>
              <button className={stability.gm <= 0 ? 'done danger-done' : ''} onClick={() => setInputs({ ...initialState, kg: 7.3 })}><i>{stability.gm <= 0 ? '✓' : '3'}</i><span><b>Encuentra el límite</b><small>Eleva KG hasta superar M.</small></span></button>
            </div>
          </div>}
        </section>

        <aside className="controls-panel">
          {mode === 'explore' ? <>
          <div className="panel-section">
            <div className="section-heading"><div><p className="eyebrow">Experimenta</p><h2>Condición de carga</h2></div><button className="reset-button" onClick={() => setInputs(initialState)}>Restablecer</button></div>
            <Slider label="Calado medio" value={inputs.draft} min={2.3} max={5.9} step={0.1} unit="m" help="Rango común cubierto por las tablas hidrostática y KN." onChange={set('draft')} />
            <Slider label="Altura KG" value={inputs.kg} min={3} max={7.5} step={0.01} unit="m" help="Subir G reduce GM y normalmente reduce GZ." onChange={set('kg')} />
            <Slider label="Momento de superficie libre" value={inputs.freeSurfaceMoment} min={0} max={4000} step={50} unit="t·m" help="Suma una elevación virtual a KG: FSM / Δ." onChange={set('freeSurfaceMoment')} />
            <Slider label="Peso trasladado" value={inputs.shiftedWeight} min={0} max={500} step={10} unit="t" help="Peso que se mueve transversalmente." onChange={set('shiftedWeight')} />
            <Slider label="Distancia hacia estribor" value={inputs.shiftDistance} min={0} max={8} step={0.1} unit="m" help="Genera un momento escorante w·d." onChange={set('shiftDistance')} />
          </div>

          <div className="preset-panel"><p className="eyebrow">Casos para comparar</p><div className="preset-grid">{presets.map((preset) => <button key={preset.label} onClick={() => setInputs(preset.values)}>{preset.label}</button>)}</div></div>

          <div className={`interpretation status-${stability.statusColor}`}><strong>{stability.statusLabel}</strong><p>{stability.interpretation}</p></div>
          </> : <>
            <div className="load-side-card">
              <p className="eyebrow">Resultado del cuadro</p><h2>G calculado por momentos</h2>
              <div className="load-g"><span>KG</span><strong>{number(loadSummary.kg,3)} m</strong><small>corregido: {number(loadSummary.correctedKg,3)} m</small></div>
              <div className="load-position"><span><b>LCG</b>{number(loadSummary.lcg,2)} m</span><span><b>TCG</b>{number(loadSummary.tcg,3)} m</span></div>
              <p>Modifica el cuadro de carga que aparece debajo. El calado y toda la estabilidad responderán automáticamente.</p>
            </div>
            <div className={`interpretation status-${stability.statusColor}`}><strong>{stability.statusLabel}</strong><p>{stability.interpretation}</p></div>
          </>}
        </aside>

        {mode === 'load' && <LoadPlan weights={loadWeights} summary={loadSummary} onChange={updateLoad} onReset={() => setLoadWeights(defaultLoadWeights)} />}

        <section className="chart-panel">
          <div className="chart-heading"><div><p className="eyebrow">Pantocarenas del Buque Echo</p><h2>Curva de brazos adrizantes</h2></div><div className="formula-pill">GZ = KN − KG<sub>corr</sub> · sen θ − GG′ · cos θ</div></div>
          <StabilityChart data={stability.curve} currentAngle={stability.heelAngle} />
          <div className="chart-stats"><span><b>{number(stability.maxGz)} m</b> GZ máximo a {number(stability.maxGzAngle, 1)}°</span><span><b>{number(stability.positiveRange, 1)}°</b> rango positivo</span><span><b>{number(stability.heelAngle, 1)}°</b> escora de equilibrio</span></div>
        </section>

        <section className="calculation-panel">
          <div><p className="eyebrow">Cuaderno de cálculo</p><h2>De los datos al resultado</h2><p>Cada tarjeta muestra la operación usada. Cambia un control y sigue la cadena de efectos.</p></div>
          <div className="calculation-grid">
            <article><span>01 · Tabla hidrostática</span><code>{mode === 'load' ? `Δ = ${number(loadSummary.displacement,0)} t → T = ${number(effectiveInputs.draft,2)} m` : `T = ${number(effectiveInputs.draft,1)} m → Δ = ${number(stability.hydro.displacement,0)} t`}</code><p>También obtenemos KM = {number(stability.hydro.km)} m y TPC = {number(stability.hydro.tpc)} t/cm.</p></article>
            <article><span>02 · Superficie libre</span><code>FSC = {number(effectiveInputs.freeSurfaceMoment, 0)} / {number(stability.hydro.displacement, 0)} = {number(stability.freeSurfaceCorrection, 3)} m</code><p>KG corregido = {number(effectiveInputs.kg)} + {number(stability.freeSurfaceCorrection, 3)} = {number(stability.correctedKg, 3)} m.</p></article>
            <article><span>03 · Altura metacéntrica</span><code>GM = {number(stability.hydro.km)} − {number(stability.correctedKg, 3)} = {number(stability.gm, 3)} m</code><p>El signo de GM describe la estabilidad para inclinaciones pequeñas.</p></article>
            <article><span>04 · Momento transversal</span><code>{mode === 'load' ? `TCG = Σ(w·y) / Δ = ${number(loadSummary.tcg,3)} m` : `GG′ = (${number(inputs.shiftedWeight,0)} × ${number(inputs.shiftDistance,1)}) / ${number(stability.hydro.displacement,0)} = ${number(stability.transverseG,3)} m`}</code><p>Momento escorante: {number(stability.heelingMoment, 0)} t·m.</p></article>
          </div>
        </section>

        <section className="reference-panel">
          <div><p className="eyebrow">Ficha del buque</p><h2>Buque Echo · condición de verano</h2></div>
          <dl><div><dt>Eslora entre PP</dt><dd>110 m</dd></div><div><dt>Manga</dt><dd>17,30 m</dd></div><div><dt>Puntal</dt><dd>6,15 m</dd></div><div><dt>Calado</dt><dd>5,80 m</dd></div><div><dt>Desplazamiento</dt><dd>8.200 t</dd></div><div><dt>KG normal</dt><dd>5,39 m</dd></div></dl>
          <p className="source-note">Modelo educativo basado en las tablas hidrostáticas, tabla KN y ficha de centros de gravedad suministradas para el curso. La interpolación es lineal; no sustituye el cuaderno de estabilidad aprobado del buque.</p>
        </section>
      </main>
    </div>
  );
}

export default App;
