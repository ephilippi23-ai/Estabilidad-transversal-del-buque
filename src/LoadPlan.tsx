import { useState } from 'react';
import { effectiveTankVcg, LoadCategory, LoadSummary, LoadWeights, loadItems } from './loadData';

type Props = { weights: LoadWeights; summary: LoadSummary; onChange: (id: string, value: number) => void; onReset: () => void };
const categories: Array<LoadCategory | 'Todos'> = ['Todos','Combustible','Agua y consumos','Carga','Lastre'];
const format = (value: number, digits = 2) => value.toLocaleString('es-UY', { minimumFractionDigits: digits, maximumFractionDigits: digits });

export function LoadPlan({ weights, summary, onChange, onReset }: Props) {
  const [category, setCategory] = useState<LoadCategory | 'Todos'>('Carga');
  const visible = loadItems.filter((item) => !item.locked && (category === 'Todos' || item.category === category));
  const warning = summary.displacement < 2800 || summary.displacement > 8400;

  return (
    <section className="load-panel">
      <div className="load-header">
        <div><p className="eyebrow">Cuadro de carga interactivo</p><h2>Construye una condición de carga</h2><p>Ajusta pesos y tanques. El simulador recalcula automáticamente Δ y la posición tridimensional de G.</p></div>
        <button className="reset-button" onClick={onReset}>Restaurar condición normal</button>
      </div>
      <div className="load-summary">
        <article><span>Desplazamiento</span><strong>{format(summary.displacement,0)} t</strong><small>Σ pesos</small></article>
        <article><span>KG sin corregir</span><strong>{format(summary.kg,3)} m</strong><small>Σ momentos verticales / Δ</small></article>
        <article><span>LCG</span><strong>{format(summary.lcg,2)} m</strong><small>{summary.lcg >= 0 ? 'A popa' : 'A proa'}</small></article>
        <article><span>TCG</span><strong>{format(Math.abs(summary.tcg),3)} m</strong><small>{Math.abs(summary.tcg) < .001 ? 'En crujía' : summary.tcg > 0 ? 'A estribor' : 'A babor'}</small></article>
        <article><span>KG corregido</span><strong>{format(summary.correctedKg,3)} m</strong><small>Incluye superficie libre</small></article>
      </div>
      {warning && <div className="load-warning">Esta condición queda fuera del rango común de la tabla KN (2.800–8.400 t). Los valores extremos se limitan al dato disponible más próximo.</div>}
      <div className="load-toolbar">
        <div className="category-tabs">{categories.map((item) => <button key={item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)}>{item}</button>)}</div>
        <div className="load-legend"><span><i className="liquid-symbol"/> Líquido</span><span>Posiciones: + popa / estribor</span></div>
      </div>
      <div className="load-table" role="table" aria-label="Pesos del cuadro de carga">
        <div className="load-table-head" role="row"><span>Espacio</span><span>Peso</span><span>Llenado</span><span>KG actual</span><span>Long.</span><span>Transv.</span></div>
        {visible.map((item) => {
          const weight = weights[item.id] ?? 0; const fill = item.maxWeight ? weight/item.maxWeight*100 : 0;
          const effectiveVcg = effectiveTankVcg(item, weight);
          return <div className="load-row" role="row" key={item.id}>
            <div className="load-name"><b>{item.name}</b><small>{item.category}{item.liquid ? ' · tanque' : ''}</small></div>
            <label><input type="number" min="0" max={item.maxWeight} step="1" value={Math.round(weight*10)/10} onChange={(event) => onChange(item.id, Number(event.target.value))}/><span>t</span></label>
            <div className="fill-control"><input aria-label={`Llenado de ${item.name}`} type="range" min="0" max={item.maxWeight} step="1" value={weight} onChange={(event) => onChange(item.id, Number(event.target.value))}/><small>{format(fill,0)}%</small></div>
            <code className={item.vcgModel ? 'calculated-vcg' : ''} title={item.vcgModel === 'end-tank-065' ? '65% de la altura estimada del nivel' : item.vcgModel ? 'KG lleno × porcentaje de llenado' : 'KG fijo del cuadro'}>{format(effectiveVcg,2)} m{item.vcgModel && <small> de {format(item.vcg,2)}</small>}</code><code>{format(item.lcg,1)} m</code><code>{format(item.tcg,1)} m</code>
          </div>;
        })}
      </div>
      <div className="load-footnote"><p><b>KG variable:</b> en doblefondos, KG = KG lleno × llenado; en piques extremos, KG ≈ 0,65 × altura del nivel. Los demás espacios conservan el KG del cuadro.</p><p><b>Superficie libre:</b> se calcula aparte; crece desde cero, alcanza el máximo al 50% y vuelve a cero con el tanque lleno.</p></div>
    </section>
  );
}
