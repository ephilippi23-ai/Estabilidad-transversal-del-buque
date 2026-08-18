import { InverseSolution, InverseTarget, LoadSummary } from './loadData';

type Props = {
  current: LoadSummary; target: InverseTarget; solution?: InverseSolution;
  onTargetChange: (target: InverseTarget) => void; onSolve: () => void; onApply: () => void; onResetTarget: () => void;
};
const format = (value: number, digits = 2) => value.toLocaleString('es-UY', { minimumFractionDigits: digits, maximumFractionDigits: digits });

export function InversePlanner({ current, target, solution, onTargetChange, onSolve, onApply, onResetTarget }: Props) {
  const status = solution?.quality === 'exact' ? ['Objetivo alcanzado','exact'] : solution?.quality === 'close' ? ['Mejor aproximación','close'] : ['Objetivo fuera de alcance','unreachable'];
  const set = (field: 'kg'|'lcg'|'tcg', value: number) => onTargetChange({ ...target, [field]: value });
  return (
    <section className="inverse-panel">
      <div className="inverse-header">
        <div><p className="eyebrow">Modo inverso · del resultado a la carga</p><h2>¿Cómo llegamos a ese G?</h2><p>Arrastra el objetivo en los diagramas o escribe sus coordenadas. El solucionador conserva el desplazamiento y busca una distribución posible.</p></div>
        <button className="reset-button" onClick={onResetTarget}>Igualar al G actual</button>
      </div>
      <div className="inverse-workspace">
        <div className="target-editor">
          <p className="inverse-kicker">G objetivo</p>
          <label><span>KG <small>altura</small></span><div><input type="number" step="0.01" min="0" max="14" value={target.kg} onChange={(event) => set('kg',Number(event.target.value))}/><b>m</b></div></label>
          <label><span>LCG <small>+ popa</small></span><div><input type="number" step="0.1" min="-50" max="50" value={target.lcg} onChange={(event) => set('lcg',Number(event.target.value))}/><b>m</b></div></label>
          <label><span>TCG <small>+ estribor</small></span><div><input type="number" step="0.01" min="-8" max="8" value={target.tcg} onChange={(event) => set('tcg',Number(event.target.value))}/><b>m</b></div></label>
          <button className="solve-button" onClick={onSolve}><span>Encontrar condición</span><b>→</b></button>
        </div>
        <div className="target-delta">
          <p className="inverse-kicker">Cambio solicitado</p>
          <div><span>ΔKG</span><b>{format(target.kg-current.kg,3)} m</b></div>
          <div><span>ΔLCG</span><b>{format(target.lcg-current.lcg,3)} m</b></div>
          <div><span>ΔTCG</span><b>{format(target.tcg-current.tcg,3)} m</b></div>
          <small>Δ permanece en {format(target.displacement,0)} t</small>
        </div>
        <div className="inverse-result">
          {!solution ? <div className="empty-solution"><span>◎</span><b>Aún no hay propuesta</b><p>Mueve G y pulsa “Encontrar condición”.</p></div> : <>
            <div className={`solution-status ${status[1]}`}><span>{status[0]}</span><b>{solution.movements.length} movimientos</b></div>
            <div className="solution-coordinates"><span><b>{format(solution.summary.kg,3)}</b> KG</span><span><b>{format(solution.summary.lcg,3)}</b> LCG</span><span><b>{format(solution.summary.tcg,3)}</b> TCG</span></div>
            <div className="movement-list">{solution.movements.slice(0,8).map((movement) => <div key={movement.item.id}><i className={movement.delta>0?'add':'remove'}>{movement.delta>0?'+':'−'}</i><span><b>{movement.item.name}</b><small>{format(movement.from,0)} → {format(movement.to,0)} t</small></span><strong>{movement.delta>0?'+':''}{format(movement.delta,0)} t</strong></div>)}</div>
            {solution.movements.length > 8 && <p className="more-movements">+ {solution.movements.length-8} movimientos menores</p>}
            {solution.quality !== 'unreachable' && <button className="apply-solution" onClick={onApply}>Aplicar propuesta al cuadro</button>}
            {solution.quality === 'unreachable' && <p className="unreachable-note">Las capacidades disponibles no permiten llegar suficientemente cerca. Acerca el objetivo al G actual.</p>}
          </>}
        </div>
      </div>
      <div className="inverse-note"><b>Importante:</b> no existe una única solución. El algoritmo ofrece una condición posible con transferencias de igual peso; debe interpretarse como ejercicio didáctico.</div>
    </section>
  );
}
