import { useMemo, useState } from 'react';
import { calculateStability } from './stability';
import { ShipScene } from './ShipScene';
import { StabilityChart } from './StabilityChart';
import { Slider } from './Slider';

const initialState = {
  displacement: 12000,
  beam: 20,
  draft: 7.5,
  depth: 12,
  kg: 6.3,
  kgOffset: 0,
  kb: 2.1,
  ballast: 1000,
  ballastOffset: 0,
  cargoWeight: 300,
  cargoOffset: 4,
};

const stateBounds = {
  displacement: { min: 5000, max: 30000, step: 100 },
  beam: { min: 10, max: 40, step: 0.1 },
  draft: { min: 3, max: 12, step: 0.1 },
  depth: { min: 8, max: 20, step: 0.1 },
  kg: { min: 2, max: 12, step: 0.05 },
  kgOffset: { min: -5, max: 5, step: 0.1 },
  kb: { min: 1, max: 6, step: 0.05 },
  ballast: { min: 0, max: 5000, step: 50 },
  ballastOffset: { min: -5, max: 5, step: 0.1 },
  cargoWeight: { min: 0, max: 1000, step: 10 },
  cargoOffset: { min: -8, max: 8, step: 0.1 },
};

const metricLabel = (value: number, unit = '') => `${value.toFixed(2)}${unit}`;

function App() {
  const [inputs, setInputs] = useState(initialState);

  const stability = useMemo(() => calculateStability(inputs), [inputs]);

  return (
    <div className="page-shell">
      <header className="hero-panel">
        <div>
          <p className="eyebrow">Simulador educativo</p>
          <h1>Estabilidad transversal de un buque</h1>
          <p className="hero-copy">
            Explora cómo cambian la escora, el metacentro y el brazo adrizante cuando ajustas los parámetros clave del barco.
          </p>
        </div>
        <div className={`status-badge status-${stability.statusColor}`}>
          <span>{stability.statusLabel}</span>
        </div>
      </header>

      <main className="layout-grid">
        <section className="visual-panel">
          <ShipScene data={stability} inputs={inputs} />
          <div className="cards-grid">
            <div className="card">
              <h2>GM</h2>
              <p>{metricLabel(stability.gm, ' m')}</p>
            </div>
            <div className="card">
              <h2>GZ actual</h2>
              <p>{metricLabel(stability.gz, ' m')}</p>
            </div>
            <div className="card">
              <h2>Metacentro M</h2>
              <p>{metricLabel(stability.metalCenterHeight, ' m')}</p>
            </div>
            <div className="card">
              <h2>Ángulo de escora</h2>
              <p>{metricLabel(stability.heelAngle, '°')}</p>
            </div>
            <div className="card">
              <h2>KB</h2>
              <p>{metricLabel(stability.bHeight, ' m')}</p>
            </div>
            <div className="card">
              <h2>BM</h2>
              <p>{metricLabel(stability.bm, ' m')}</p>
            </div>
            <div className="card">
              <h2>Max GZ</h2>
              <p>{metricLabel(stability.maxGz, ' m')}</p>
            </div>
            <div className="card">
              <h2>Centro de gravedad G</h2>
              <p>{metricLabel(stability.gHeight, ' m')} / {metricLabel(stability.gOffset, ' m')}</p>
            </div>
            <div className="card">
              <h2>Desplazamiento</h2>
              <p>{metricLabel(inputs.displacement, ' t')}</p>
            </div>
          </div>
        </section>

        <section className="controls-panel">
          <div className="panel-section">
            <h2>Parámetros del buque</h2>
            <Slider label="Desplazamiento (t)" value={inputs.displacement} min={stateBounds.displacement.min} max={stateBounds.displacement.max} step={stateBounds.displacement.step} onChange={(value) => setInputs((prev) => ({ ...prev, displacement: value }))} />
            <Slider label="Manga (m)" value={inputs.beam} min={stateBounds.beam.min} max={stateBounds.beam.max} step={stateBounds.beam.step} onChange={(value) => setInputs((prev) => ({ ...prev, beam: value }))} />
            <Slider label="Calado (m)" value={inputs.draft} min={stateBounds.draft.min} max={stateBounds.draft.max} step={stateBounds.draft.step} onChange={(value) => setInputs((prev) => ({ ...prev, draft: value }))} />
            <Slider label="Puntal / francobordo (m)" value={inputs.depth} min={stateBounds.depth.min} max={stateBounds.depth.max} step={stateBounds.depth.step} onChange={(value) => setInputs((prev) => ({ ...prev, depth: value }))} />
            <Slider label="Altura KG (m)" value={inputs.kg} min={stateBounds.kg.min} max={stateBounds.kg.max} step={stateBounds.kg.step} onChange={(value) => setInputs((prev) => ({ ...prev, kg: value }))} />
          </div>

          <div className="panel-section">
            <h2>Centro de gravedad</h2>
            <Slider label="Posición transversal G (m)" value={inputs.kgOffset} min={stateBounds.kgOffset.min} max={stateBounds.kgOffset.max} step={stateBounds.kgOffset.step} onChange={(value) => setInputs((prev) => ({ ...prev, kgOffset: value }))} />
            <Slider label="Altura KB (m)" value={inputs.kb} min={stateBounds.kb.min} max={stateBounds.kb.max} step={stateBounds.kb.step} onChange={(value) => setInputs((prev) => ({ ...prev, kb: value }))} />
            <Slider label="Peso lastre (t)" value={inputs.ballast} min={stateBounds.ballast.min} max={stateBounds.ballast.max} step={stateBounds.ballast.step} onChange={(value) => setInputs((prev) => ({ ...prev, ballast: value }))} />
            <Slider label="Offset transversal lastre (m)" value={inputs.ballastOffset} min={stateBounds.ballastOffset.min} max={stateBounds.ballastOffset.max} step={stateBounds.ballastOffset.step} onChange={(value) => setInputs((prev) => ({ ...prev, ballastOffset: value }))} />
            <Slider label="Peso de carga móvil (t)" value={inputs.cargoWeight} min={stateBounds.cargoWeight.min} max={stateBounds.cargoWeight.max} step={stateBounds.cargoWeight.step} onChange={(value) => setInputs((prev) => ({ ...prev, cargoWeight: value }))} />
            <Slider label="Posición transversal carga (m)" value={inputs.cargoOffset} min={stateBounds.cargoOffset.min} max={stateBounds.cargoOffset.max} step={stateBounds.cargoOffset.step} onChange={(value) => setInputs((prev) => ({ ...prev, cargoOffset: value }))} />
          </div>

          <div className={`legend-box status-panel status-${stability.statusColor}`}>
            <p><strong>Interpretación:</strong></p>
            <p>{stability.interpretation}</p>
          </div>
        </section>

        <section className="chart-panel">
          <h2>Curva de estabilidad GZ</h2>
          <StabilityChart data={stability.curve} currentAngle={stability.heelAngle} />
        </section>
      </main>
    </div>
  );
}

export default App;
