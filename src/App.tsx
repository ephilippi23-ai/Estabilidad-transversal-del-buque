import { useMemo, useState } from 'react';
import { Activity, Anchor, Box, Gauge, Info, MoveHorizontal, RotateCcw, Waves } from 'lucide-react';
import { calculateStability, type Inputs } from './stability';
import { ShipScene } from './ShipScene';
import { StabilityChart } from './StabilityChart';
import { Slider } from './Slider';

const initialInputs: Inputs = {
  displacement: 11800,
  length: 142,
  beam: 21.5,
  draft: 7.1,
  depth: 11.8,
  kg: 8.6,
  kgOffset: 0,
  kb: 3.65,
  cargoWeight: 420,
  cargoOffset: 4,
  cargoHeight: 9.5,
  ballastLevel: 52,
  ballastOffset: -1.2,
};

const presets: Array<{ label: string; className: string; values: Partial<Inputs> }> = [
  { label: 'Equilibrado', className: 'good', values: initialInputs },
  { label: 'Carga alta', className: 'reduced', values: { kg: 9.3, cargoWeight: 780, cargoHeight: 10.8, cargoOffset: 5.8, ballastLevel: 18, ballastOffset: 0 } },
  { label: 'Lastre bajo', className: 'stiff', values: { kg: 6.2, cargoWeight: 180, cargoHeight: 5.2, cargoOffset: 0, ballastLevel: 100, ballastOffset: 0 } },
];

const format = (value: number, digits = 2) => value.toLocaleString('es-ES', { maximumFractionDigits: digits, minimumFractionDigits: digits });

function Metric({ label, value, unit, detail, tone }: { label: string; value: string; unit: string; detail: string; tone?: string }) {
  return (
    <article className={`metric ${tone ?? ''}`}>
      <span>{label}</span>
      <strong>{value}<small>{unit}</small></strong>
      <p>{detail}</p>
    </article>
  );
}

function App() {
  const [inputs, setInputs] = useState(initialInputs);
  const [controlGroup, setControlGroup] = useState<'ship' | 'loads'>('ship');
  const stability = useMemo(() => calculateStability(inputs), [inputs]);
  const update = (key: keyof Inputs) => (value: number) => setInputs((current) => ({ ...current, [key]: value }));

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-mark"><Anchor size={21} /></div>
        <div className="brand-copy">
          <strong>TRIMLAB</strong>
          <span>Estabilidad transversal</span>
        </div>
        <div className="topbar-spacer" />
        <span className="live-indicator"><i /> SIMULACION ACTIVA</span>
        <button className="icon-button" title="Restablecer escenario" aria-label="Restablecer escenario" onClick={() => setInputs(initialInputs)}><RotateCcw size={18} /></button>
      </header>

      <main>
        <section className="intro-row">
          <div>
            <span className="section-kicker">LABORATORIO INTERACTIVO</span>
            <h1>Comprende por que un buque vuelve a adrizarse.</h1>
          </div>
          <div className={`condition condition-${stability.status}`}>
              <Activity size={19} />
            <div><span>CONDICION ACTUAL</span><strong>{stability.statusLabel}</strong></div>
          </div>
        </section>

        <section className="workbench">
          <div className="simulation-column">
            <ShipScene data={stability} inputs={inputs} />
            <div className="formula-strip">
              <span><b>KM</b> = KB + BM</span><i />
              <span><b>GM</b> = KM - KG - FSC</span><i />
              <span><b>GZ</b> ≈ GM · sen θ</span>
            </div>
          </div>

          <aside className="controls-panel">
            <div className="panel-heading">
              <div><span className="section-kicker">PARAMETROS</span><h2>Configura el escenario</h2></div>
              <Gauge size={22} />
            </div>

            <div className="preset-row" aria-label="Escenarios predefinidos">
              {presets.map((preset) => <button key={preset.label} className={`preset preset-${preset.className}`} onClick={() => setInputs((current) => ({ ...current, ...preset.values }))}>{preset.label}</button>)}
            </div>

            <div className="control-tabs">
              <button className={controlGroup === 'ship' ? 'active' : ''} onClick={() => setControlGroup('ship')}><Waves size={16} /> Buque</button>
              <button className={controlGroup === 'loads' ? 'active' : ''} onClick={() => setControlGroup('loads')}><Box size={16} /> Carga y lastre</button>
            </div>

            <div className="controls-scroll">
              {controlGroup === 'ship' ? <>
                <Slider label="Desplazamiento base" value={inputs.displacement} min={4000} max={26000} step={100} unit="t" onChange={update('displacement')} />
                <Slider label="Eslora" value={inputs.length} min={70} max={220} step={1} unit="m" onChange={update('length')} />
                <Slider label="Manga" value={inputs.beam} min={12} max={36} step={0.1} unit="m" hint="Aumentarla eleva fuertemente BM" onChange={update('beam')} />
                <Slider label="Calado" value={inputs.draft} min={3} max={11} step={0.1} unit="m" onChange={update('draft')} />
                <Slider label="Puntal" value={inputs.depth} min={7} max={16} step={0.1} unit="m" onChange={update('depth')} />
                <Slider label="Altura del centro G (KG)" value={inputs.kg} min={2.5} max={12} step={0.05} unit="m" onChange={update('kg')} />
                <Slider label="Posición transversal de G" value={inputs.kgOffset} min={-5} max={5} step={0.1} unit="m" onChange={update('kgOffset')} />
                <Slider label="Altura del centro B (KB)" value={inputs.kb} min={1.5} max={5.5} step={0.05} unit="m" onChange={update('kb')} />
              </> : <>
                <Slider label="Peso de la carga movil" value={inputs.cargoWeight} min={0} max={1200} step={10} unit="t" onChange={update('cargoWeight')} />
                <Slider label="Posición transversal carga" value={inputs.cargoOffset} min={-9} max={9} step={0.1} unit="m" hint="Negativo: babor · Positivo: estribor" onChange={update('cargoOffset')} />
                <Slider label="Altura de la carga" value={inputs.cargoHeight} min={0.8} max={inputs.depth} step={0.1} unit="m" onChange={update('cargoHeight')} />
                <Slider label="Nivel del tanque de lastre" value={inputs.ballastLevel} min={0} max={100} step={1} unit="%" hint={`${format(stability.ballastWeight, 0)} t de lastre`} onChange={update('ballastLevel')} />
                <Slider label="Posición transversal lastre" value={inputs.ballastOffset} min={-7} max={7} step={0.1} unit="m" onChange={update('ballastOffset')} />
                <div className="free-surface-note"><Info size={17} /><p><strong>Efecto de superficie libre</strong>Un tanque parcialmente lleno reduce GM en {format(stability.freeSurfaceCorrection)} m.</p></div>
              </>}
            </div>
          </aside>
        </section>

        <section className="metrics-grid">
          <Metric label="ALTURA METACENTRICA" value={format(stability.gm)} unit="m" detail={`KM ${format(stability.km)} m - KG efectivo ${format(stability.effectiveKg)} m`} tone={stability.gm < 0.45 ? 'warning' : ''} />
          <Metric label="BRAZO ADRIZANTE" value={format(stability.gz)} unit="m" detail={`A ${format(Math.abs(stability.heelAngle), 1)}° de escora`} />
          <Metric label="MOMENTO ADRIZANTE" value={format(stability.rightingMoment / 1000, 1)} unit="MN·m" detail={`Desplazamiento total ${format(stability.totalDisplacement, 0)} t`} />
          <Metric label="RADIO METACÉNTRICO" value={format(stability.bm)} unit="m" detail="BM = I de flotación / volumen" />
          <Metric label="GZ MÁXIMO" value={format(stability.maxGz)} unit="m" detail={`Máximo cerca de ${format(stability.maxGzAngle, 1)}°`} />
        </section>

        <section className="analysis-grid">
          <div className="chart-section">
            <div className="section-heading"><div><span className="section-kicker">RESERVA DE ESTABILIDAD</span><h2>Curva de brazos adrizantes</h2></div><span className="angle-readout">θ {format(Math.abs(stability.heelAngle), 1)}°</span></div>
            <StabilityChart data={stability.curve} currentAngle={Math.abs(stability.heelAngle)} downfloodAngle={stability.downfloodAngle} />
          </div>
          <aside className={`assessment assessment-${stability.status}`}>
            <div className="assessment-icon"><MoveHorizontal size={23} /></div>
            <span className="section-kicker">LECTURA DEL ESCENARIO</span>
            <h2>{stability.statusLabel}</h2>
            <p>{stability.interpretation}</p>
            <dl>
              <div><dt>Escora de equilibrio</dt><dd>{format(stability.heelAngle, 1)}°</dd></div>
              <div><dt>Ángulo de inundación</dt><dd>{format(stability.downfloodAngle, 1)}°</dd></div>
              <div><dt>Rango positivo estimado</dt><dd>{format(stability.rangeOfStability, 1)}°</dd></div>
            </dl>
          </aside>
        </section>

        <footer><Info size={15} /> Modelo educativo simplificado. No utilizar para decisiones operativas: consulte la información de estabilidad aprobada del buque.</footer>
      </main>
    </div>
  );
}

export default App;
