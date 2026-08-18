export type LoadCategory = 'Buque' | 'Combustible' | 'Agua y consumos' | 'Carga' | 'Lastre';

export type LoadItem = {
  id: string; category: LoadCategory; name: string; maxWeight: number; defaultWeight: number;
  vcg: number; lcg: number; tcg: number; liquid?: boolean; freeSurfaceCm?: number; locked?: boolean;
  vcgModel?: 'proportional' | 'end-tank-065';
};

export type LoadWeights = Record<string, number>;

// Transcripción del archivo “Tabla CG - BUQUE ECHO.xls”. Posiciones:
// vertical sobre la línea de construcción; longitudinal (+) a popa;
// transversal (+) a estribor y (-) a babor.
export const loadItems: LoadItem[] = [
  { id:'lightship', category:'Buque', name:'Buque vacío', maxWeight:3050, defaultWeight:3050, vcg:6.45, lcg:9.5, tcg:0, locked:true },
  { id:'fuel11', category:'Combustible', name:'Tanque Nº 11', maxWeight:60, defaultWeight:60, vcg:.6, lcg:20.7, tcg:3.5, liquid:true, freeSurfaceCm:4, vcgModel:'proportional' },
  { id:'fuel12', category:'Combustible', name:'Tanque Nº 12', maxWeight:60, defaultWeight:60, vcg:.6, lcg:20.7, tcg:-3.5, liquid:true, freeSurfaceCm:4, vcgModel:'proportional' },
  { id:'fuel13', category:'Combustible', name:'Tanque Nº 13', maxWeight:90, defaultWeight:90, vcg:.75, lcg:34.4, tcg:3, liquid:true, freeSurfaceCm:3, vcgModel:'proportional' },
  { id:'fuel14', category:'Combustible', name:'Tanque Nº 14', maxWeight:90, defaultWeight:90, vcg:.75, lcg:34.4, tcg:-3, liquid:true, freeSurfaceCm:3, vcgModel:'proportional' },
  { id:'fuel15', category:'Combustible', name:'Tanque Nº 15', maxWeight:38, defaultWeight:0, vcg:7.7, lcg:22.2, tcg:-1.5, liquid:true },
  { id:'fuel16', category:'Combustible', name:'Tanque Nº 16', maxWeight:38, defaultWeight:0, vcg:7.7, lcg:22.2, tcg:1.5, liquid:true },
  { id:'lube', category:'Combustible', name:'Aceite lubricante', maxWeight:20, defaultWeight:20, vcg:7.5, lcg:28.3, tcg:0, liquid:true },
  { id:'water7', category:'Agua y consumos', name:'Agua · Tanque Nº 7', maxWeight:100, defaultWeight:100, vcg:.6, lcg:7.8, tcg:-4, liquid:true, freeSurfaceCm:9, vcgModel:'proportional' },
  { id:'water8', category:'Agua y consumos', name:'Agua · Tanque Nº 8', maxWeight:100, defaultWeight:100, vcg:.6, lcg:7.8, tcg:4, liquid:true, freeSurfaceCm:9, vcgModel:'proportional' },
  { id:'water9', category:'Agua y consumos', name:'Agua · Tanque Nº 9', maxWeight:20, defaultWeight:0, vcg:10.4, lcg:24, tcg:-5.1, liquid:true },
  { id:'water10', category:'Agua y consumos', name:'Agua · Tanque Nº 10', maxWeight:20, defaultWeight:0, vcg:10.4, lcg:24, tcg:5.1, liquid:true },
  { id:'stores', category:'Agua y consumos', name:'Provisiones y víveres', maxWeight:15, defaultWeight:15, vcg:7.7, lcg:32.4, tcg:0 },
  { id:'crew', category:'Agua y consumos', name:'Tripulación y efectos', maxWeight:5, defaultWeight:5, vcg:13, lcg:38, tcg:0 },
  { id:'hold1', category:'Carga', name:'Bodega Nº 1', maxWeight:700, defaultWeight:700, vcg:4.3, lcg:-32, tcg:0 },
  { id:'hold2', category:'Carga', name:'Bodega Nº 2', maxWeight:810, defaultWeight:810, vcg:3.7, lcg:-16.3, tcg:0 },
  { id:'hold3', category:'Carga', name:'Bodega Nº 3', maxWeight:1100, defaultWeight:1100, vcg:3.7, lcg:12.7, tcg:0 },
  { id:'tweendeck1', category:'Carga', name:'Entrepuente Nº 1', maxWeight:460, defaultWeight:460, vcg:7.4, lcg:-35, tcg:0 },
  { id:'tweendeck2', category:'Carga', name:'Entrepuente Nº 2', maxWeight:660, defaultWeight:660, vcg:7.7, lcg:-13, tcg:0 },
  { id:'tweendeck3', category:'Carga', name:'Entrepuente Nº 3', maxWeight:530, defaultWeight:530, vcg:7.7, lcg:12.8, tcg:0 },
  { id:'deepPort', category:'Carga', name:'Deep tank centro · Babor', maxWeight:175, defaultWeight:175, vcg:3.65, lcg:-3.3, tcg:-4, liquid:true, freeSurfaceCm:5 },
  { id:'deepStarboard', category:'Carga', name:'Deep tank centro · Estribor', maxWeight:175, defaultWeight:175, vcg:3.65, lcg:-3.3, tcg:4, liquid:true, freeSurfaceCm:5 },
  { id:'forepeak', category:'Lastre', name:'Pique de proa', maxWeight:103, defaultWeight:0, vcg:4.1, lcg:-50, tcg:0, liquid:true, freeSurfaceCm:.25, vcgModel:'end-tank-065' },
  { id:'foreDeep', category:'Lastre', name:'Deep tank de proa', maxWeight:369, defaultWeight:0, vcg:3.97, lcg:-44.7, tcg:0, liquid:true, freeSurfaceCm:3 },
  { id:'afterpeak', category:'Lastre', name:'Pique de popa', maxWeight:41, defaultWeight:0, vcg:5.23, lcg:51.5, tcg:0, liquid:true, freeSurfaceCm:1, vcgModel:'end-tank-065' },
  { id:'ballast1', category:'Lastre', name:'Tanque Nº 1 · Estribor', maxWeight:92, defaultWeight:0, vcg:.65, lcg:-32.1, tcg:3.2, liquid:true, freeSurfaceCm:4.5, vcgModel:'proportional' },
  { id:'ballast2', category:'Lastre', name:'Tanque Nº 2 · Babor', maxWeight:92, defaultWeight:0, vcg:.65, lcg:-32.1, tcg:-3.2, liquid:true, freeSurfaceCm:4.5, vcgModel:'proportional' },
  { id:'ballast3', category:'Lastre', name:'Tanque Nº 3 · Estribor', maxWeight:133, defaultWeight:0, vcg:.6, lcg:-16.4, tcg:3.9, liquid:true, freeSurfaceCm:11, vcgModel:'proportional' },
  { id:'ballast4', category:'Lastre', name:'Tanque Nº 4 · Babor', maxWeight:133, defaultWeight:0, vcg:.6, lcg:-16.4, tcg:-3.9, liquid:true, freeSurfaceCm:11, vcgModel:'proportional' },
  { id:'ballast5', category:'Lastre', name:'Tanque Nº 5 · Estribor', maxWeight:62, defaultWeight:0, vcg:.6, lcg:-3.3, tcg:3.9, liquid:true, freeSurfaceCm:5, vcgModel:'proportional' },
  { id:'ballast6', category:'Lastre', name:'Tanque Nº 6 · Babor', maxWeight:62, defaultWeight:0, vcg:.6, lcg:-3.3, tcg:-3.9, liquid:true, freeSurfaceCm:5, vcgModel:'proportional' },
];

export const defaultLoadWeights: LoadWeights = Object.fromEntries(loadItems.map((item) => [item.id, item.defaultWeight]));

export type LoadSummary = {
  displacement: number; kg: number; lcg: number; tcg: number; freeSurfaceMoment: number;
  freeSurfaceCorrection: number; correctedKg: number; verticalMoment: number;
};

export function effectiveTankVcg(item: LoadItem, weight: number): number {
  if (!item.vcgModel || item.maxWeight <= 0) return item.vcg;
  const fill = Math.max(0, Math.min(1, weight / item.maxWeight));
  if (item.vcgModel === 'end-tank-065') {
    const fullLiquidLevel = item.vcg / .65;
    return .65 * fullLiquidLevel * fill;
  }
  return item.vcg * fill;
}

export function calculateLoadSummary(weights: LoadWeights): LoadSummary {
  let displacement = 0; let verticalMoment = 0; let longitudinalMoment = 0; let transverseMoment = 0; let freeSurfaceMoment = 0;
  for (const item of loadItems) {
    const weight = Math.max(0, Math.min(item.maxWeight, weights[item.id] ?? 0));
    const effectiveVcg = effectiveTankVcg(item, weight);
    displacement += weight; verticalMoment += weight * effectiveVcg; longitudinalMoment += weight * item.lcg; transverseMoment += weight * item.tcg;
    if (item.liquid && item.freeSurfaceCm && item.maxWeight > 0) {
      const fill = weight / item.maxWeight;
      const partialFactor = 4 * fill * (1 - fill);
      freeSurfaceMoment += (item.freeSurfaceCm / 100) * 8200 * partialFactor;
    }
  }
  const kg = verticalMoment / displacement; const freeSurfaceCorrection = freeSurfaceMoment / displacement;
  return { displacement, kg, lcg: longitudinalMoment / displacement, tcg: transverseMoment / displacement,
    freeSurfaceMoment, freeSurfaceCorrection, correctedKg: kg + freeSurfaceCorrection, verticalMoment };
}

export type InverseTarget = { displacement: number; kg: number; lcg: number; tcg: number };
export type LoadMovement = { item: LoadItem; from: number; to: number; delta: number };
export type InverseSolution = {
  weights: LoadWeights; summary: LoadSummary; movements: LoadMovement[];
  quality: 'exact' | 'close' | 'unreachable'; score: number;
};

function targetScore(summary: LoadSummary, target: InverseTarget): number {
  const displacementError = (summary.displacement - target.displacement) / 2;
  const kgError = (summary.kg - target.kg) / .04;
  const lcgError = (summary.lcg - target.lcg) / .25;
  const tcgError = (summary.tcg - target.tcg) / .035;
  return displacementError*displacementError + kgError*kgError + lcgError*lcgError + tcgError*tcgError;
}

// Búsqueda didáctica por transferencias de igual peso: quita de un espacio y
// agrega a otro. Así mantiene Δ mientras aproxima las tres coordenadas de G.
export function solveInverseLoad(currentWeights: LoadWeights, target: InverseTarget): InverseSolution {
  const solution = { ...currentWeights };
  const editable = loadItems.filter((item) => !item.locked && item.id !== 'crew' && item.id !== 'stores');
  let summary = calculateLoadSummary(solution);
  let score = targetScore(summary, target);

  for (const step of [100, 50, 20, 10, 5, 2, 1]) {
    for (let iteration = 0; iteration < 45; iteration += 1) {
      let best: { donor: LoadItem; receiver: LoadItem; amount: number; summary: LoadSummary; score: number } | undefined;
      for (const donor of editable) {
        const available = solution[donor.id] ?? 0;
        if (available < 1) continue;
        for (const receiver of editable) {
          if (receiver.id === donor.id) continue;
          const capacity = receiver.maxWeight - (solution[receiver.id] ?? 0);
          const amount = Math.min(step, available, capacity);
          if (amount < Math.min(1, step*.2)) continue;
          solution[donor.id] -= amount; solution[receiver.id] = (solution[receiver.id] ?? 0) + amount;
          const candidateSummary = calculateLoadSummary(solution);
          const candidateScore = targetScore(candidateSummary, target);
          solution[donor.id] += amount; solution[receiver.id] -= amount;
          if (candidateScore + 1e-6 < (best?.score ?? score)) best = { donor, receiver, amount, summary: candidateSummary, score: candidateScore };
        }
      }
      if (!best) break;
      solution[best.donor.id] -= best.amount;
      solution[best.receiver.id] = (solution[best.receiver.id] ?? 0) + best.amount;
      summary = best.summary; score = best.score;
      if (score < .04) break;
    }
  }

  const movements = editable.map((item) => ({ item, from: currentWeights[item.id] ?? 0, to: solution[item.id] ?? 0,
    delta: (solution[item.id] ?? 0) - (currentWeights[item.id] ?? 0) })).filter((movement) => Math.abs(movement.delta) >= .5).sort((a,b) => Math.abs(b.delta)-Math.abs(a.delta));
  const kgError = Math.abs(summary.kg-target.kg); const lcgError = Math.abs(summary.lcg-target.lcg); const tcgError = Math.abs(summary.tcg-target.tcg);
  const quality = kgError <= .03 && lcgError <= .15 && tcgError <= .025 ? 'exact' : kgError <= .1 && lcgError <= .6 && tcgError <= .08 ? 'close' : 'unreachable';
  return { weights: solution, summary, movements, quality, score };
}
