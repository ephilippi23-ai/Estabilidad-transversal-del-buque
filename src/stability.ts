export type Inputs = { draft: number; kg: number; freeSurfaceMoment: number; shiftedWeight: number; shiftDistance: number };
export type StabilityPoint = { angle: number; gz: number };
export type HydrostaticPoint = { draft: number; displacement: number; tpc: number; kb: number; km: number; lcf: number; lcb: number; mct1cm: number };
export type StabilityResult = {
  hydro: HydrostaticPoint; correctedKg: number; freeSurfaceCorrection: number; gm: number;
  transverseG: number; heelingMoment: number; heelAngle: number; gzAtHeel: number;
  maxGz: number; maxGzAngle: number; positiveRange: number; curve: StabilityPoint[];
  statusLabel: string; statusColor: 'good' | 'reduced' | 'danger'; interpretation: string;
};

// Tabla hidrostática entregada para el Buque Echo. Los valores intermedios
// se obtienen por interpolación lineal, igual que al trabajar manualmente.
const hydroRows: HydrostaticPoint[] = [
  [2.2,2773,14.25,1.17,11.54],[2.3,2916,14.30,1.22,11.19],[2.4,3059,14.35,1.28,10.84],
  [2.5,3203,14.40,1.33,10.49],[2.6,3347,14.45,1.38,10.20],[2.7,3492,14.50,1.43,9.93],
  [2.8,3637,14.56,1.49,9.68],[2.9,3783,14.61,1.54,9.45],[3.0,3929,14.66,1.59,9.24],
  [3.1,4076,14.71,1.64,9.05],[3.2,4223,14.76,1.70,8.88],[3.3,4371,14.80,1.75,8.73],
  [3.4,4519,14.84,1.80,8.59],[3.5,4667,14.88,1.85,8.46],[3.6,4816,14.92,1.91,8.34],
  [3.7,4965,14.97,1.96,8.23],[3.8,5115,15.01,2.01,8.12],[3.9,5265,15.05,2.06,8.02],
  [4.0,5416,15.09,2.12,7.93],[4.1,5567,15.13,2.17,7.84],[4.2,5718,15.17,2.22,7.76],
  [4.3,5870,15.21,2.27,7.69],[4.4,6022,15.25,2.33,7.63],[4.5,6175,15.29,2.38,7.58],
  [4.6,6328,15.33,2.43,7.54],[4.7,6481,15.38,2.48,7.50],[4.8,6635,15.43,2.54,7.46],
  [4.9,6789,15.48,2.59,7.42],[5.0,6944,15.53,2.64,7.38],[5.1,7099,15.58,2.69,7.35],
  [5.2,7255,15.63,2.75,7.32],[5.3,7411,15.68,2.80,7.29],[5.4,7568,15.73,2.85,7.26],
  [5.5,7725,15.79,2.90,7.24],[5.6,7883,15.84,2.96,7.22],[5.7,8041,15.89,3.01,7.20],
  [5.8,8200,15.94,3.06,7.19],[5.9,8359,15.99,3.11,7.18],[6.0,8519,16.04,3.17,7.17],
  [6.1,8679,16.09,3.22,7.16],[6.2,8840,16.14,3.27,7.15],
].map(([draft, displacement, tpc, kb, km]) => ({ draft, displacement, tpc, kb, km, lcf: 0, lcb: 0, mct1cm: 0 }));

// Posiciones longitudinales respecto de la sección de referencia y momento
// necesario para cambiar un centímetro el asiento (tabla del curso).
const longitudinalRows = [
  { draft: 2.2, lcf: -2.10, lcb: -2.42, mct1cm: 80.9 },
  { draft: 3.0, lcf: -1.77, lcb: -2.31, mct1cm: 85.6 },
  { draft: 4.0, lcf: -1.17, lcb: -2.06, mct1cm: 90.6 },
  { draft: 5.0, lcf: -0.19, lcb: -1.75, mct1cm: 98.6 },
  { draft: 5.8, lcf: 0.76, lcb: -1.47, mct1cm: 106.1 },
  { draft: 6.2, lcf: 1.19, lcb: -1.32, mct1cm: 109.6 },
];

const knAngles = [0, 15, 30, 45, 60, 75, 90];
const knRows: Array<{ displacement: number; values: number[] }> = [
  [2800,0,2.900,4.810,5.820,6.380,6.156,5.238],[3000,0,2.800,4.730,5.810,6.375,6.149,5.240],
  [3200,0,2.700,4.660,5.800,6.370,6.142,5.242],[3400,0,2.600,4.590,5.790,6.365,6.135,5.244],
  [3600,0,2.500,4.542,5.780,6.360,6.128,5.246],[3800,0,2.445,4.495,5.770,6.355,6.121,5.248],
  [4000,0,2.390,4.447,5.760,6.350,6.114,5.250],[4200,0,2.335,4.400,5.730,6.330,6.107,5.252],
  [4400,0,2.280,4.366,5.700,6.310,6.100,5.254],[4600,0,2.225,4.332,5.670,6.290,6.078,5.256],
  [4800,0,2.192,4.298,5.640,6.270,6.056,5.258],[5000,0,2.160,4.264,5.610,6.250,6.034,5.260],
  [5200,0,2.128,4.230,5.580,6.222,6.012,5.270],[5400,0,2.096,4.196,5.550,6.194,5.990,5.280],
  [5600,0,2.064,4.164,5.520,6.166,5.968,5.290],[5800,0,2.032,4.132,5.490,6.138,5.946,5.300],
  [6000,0,2.000,4.100,5.460,6.110,5.924,5.310],[6200,0,1.983,4.070,5.430,6.082,5.902,5.320],
  [6400,0,1.966,4.040,5.400,6.054,5.880,5.330],[6600,0,1.949,4.010,5.370,6.026,5.858,5.340],
  [6800,0,1.932,3.980,5.340,5.998,5.836,5.350],[7000,0,1.915,3.950,5.310,5.970,5.814,5.360],
  [7200,0,1.898,3.922,5.280,5.942,5.792,5.365],[7400,0,1.881,3.894,5.250,5.914,5.770,5.370],
  [7600,0,1.864,3.866,5.220,5.886,5.748,5.372],[7800,0,1.847,3.838,5.190,5.858,5.726,5.374],
  [8000,0,1.830,3.810,5.160,5.830,5.704,5.376],[8200,0,1.813,3.782,5.130,5.802,5.682,5.378],
  [8400,0,1.800,3.754,5.100,5.774,5.668,5.380],
].map(([displacement, ...values]) => ({ displacement, values }));

const lerp = (a: number, b: number, ratio: number) => a + (b - a) * ratio;
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

// Interpolación cúbica monótona (Hermite). Suaviza los tramos entre ángulos
// tabulados sin crear máximos o mínimos artificiales entre dos puntos KN.
function monotoneCubic(xs: number[], ys: number[], x: number): number {
  if (x <= xs[0]) return ys[0];
  if (x >= xs[xs.length - 1]) return ys[ys.length - 1];
  const slopes = xs.slice(0, -1).map((value, index) => (ys[index + 1] - ys[index]) / (xs[index + 1] - value));
  const tangents = new Array<number>(xs.length);
  tangents[0] = slopes[0];
  tangents[tangents.length - 1] = slopes[slopes.length - 1];
  for (let index = 1; index < tangents.length - 1; index += 1) {
    tangents[index] = slopes[index - 1] * slopes[index] <= 0 ? 0 : (slopes[index - 1] + slopes[index]) / 2;
  }
  for (let index = 0; index < slopes.length; index += 1) {
    if (slopes[index] === 0) { tangents[index] = 0; tangents[index + 1] = 0; continue; }
    const alpha = tangents[index] / slopes[index]; const beta = tangents[index + 1] / slopes[index];
    const magnitude = alpha * alpha + beta * beta;
    if (magnitude > 9) {
      const scale = 3 / Math.sqrt(magnitude);
      tangents[index] = scale * alpha * slopes[index]; tangents[index + 1] = scale * beta * slopes[index];
    }
  }
  const high = xs.findIndex((value) => value >= x); const low = high - 1;
  const interval = xs[high] - xs[low]; const t = (x - xs[low]) / interval;
  const h00 = 2*t*t*t - 3*t*t + 1; const h10 = t*t*t - 2*t*t + t;
  const h01 = -2*t*t*t + 3*t*t; const h11 = t*t*t - t*t;
  return h00*ys[low] + h10*interval*tangents[low] + h01*ys[high] + h11*interval*tangents[high];
}

function bracket<T>(rows: T[], value: number, accessor: (row: T) => number): [T, T, number] {
  if (value <= accessor(rows[0])) return [rows[0], rows[0], 0];
  if (value >= accessor(rows[rows.length - 1])) return [rows[rows.length - 1], rows[rows.length - 1], 0];
  const upperIndex = rows.findIndex((row) => accessor(row) >= value);
  const lower = rows[upperIndex - 1]; const upper = rows[upperIndex];
  return [lower, upper, (value - accessor(lower)) / (accessor(upper) - accessor(lower))];
}

export function interpolateHydrostatics(draft: number): HydrostaticPoint {
  const [a, b, ratio] = bracket(hydroRows, draft, (row) => row.draft);
  const [la, lb, longitudinalRatio] = bracket(longitudinalRows, draft, (row) => row.draft);
  return { draft: lerp(a.draft,b.draft,ratio), displacement: lerp(a.displacement,b.displacement,ratio),
    tpc: lerp(a.tpc,b.tpc,ratio), kb: lerp(a.kb,b.kb,ratio), km: lerp(a.km,b.km,ratio),
    lcf: lerp(la.lcf,lb.lcf,longitudinalRatio), lcb: lerp(la.lcb,lb.lcb,longitudinalRatio),
    mct1cm: lerp(la.mct1cm,lb.mct1cm,longitudinalRatio) };
}

export function interpolateKn(displacement: number, angle: number): number {
  const [a, b, dr] = bracket(knRows, clamp(displacement, 2800, 8400), (row) => row.displacement);
  const boundedAngle = clamp(Math.abs(angle), 0, 90);
  const lowerKn = monotoneCubic(knAngles, a.values, boundedAngle);
  const upperKn = monotoneCubic(knAngles, b.values, boundedAngle);
  return lerp(lowerKn, upperKn, dr);
}

function getStatus(gm: number, positiveRange: number) {
  if (gm <= 0) return { label: 'Equilibrio inicial inestable', color: 'danger' as const,
    interpretation: 'G queda por encima de M. Una pequeña inclinación genera un brazo escorante en vez de uno adrizante.' };
  if (gm < 0.35 || positiveRange < 30) return { label: 'Margen de estabilidad reducido', color: 'reduced' as const,
    interpretation: 'El buque recupera la vertical, pero con un margen pequeño. Observa cómo superficies libres y KG consumen GM.' };
  return { label: 'Estabilidad inicial positiva', color: 'good' as const,
    interpretation: 'M está por encima de G y existe brazo adrizante. La curva completa permite estudiar grandes ángulos.' };
}

export function calculateStability(inputs: Inputs): StabilityResult {
  const hydro = interpolateHydrostatics(inputs.draft);
  const freeSurfaceCorrection = inputs.freeSurfaceMoment / hydro.displacement;
  const correctedKg = inputs.kg + freeSurfaceCorrection;
  const gm = hydro.km - correctedKg;
  const heelingMoment = inputs.shiftedWeight * inputs.shiftDistance;
  const transverseG = heelingMoment / hydro.displacement;
  const curve = Array.from({ length: 181 }, (_, index) => {
    const angle = index * 0.5; const radians = angle * Math.PI / 180;
    const gz = interpolateKn(hydro.displacement, angle) - correctedKg * Math.sin(radians) - transverseG * Math.cos(radians);
    return { angle, gz };
  });
  const crossing = transverseG === 0 ? undefined : curve.find((point, index) => index > 0 && point.gz >= 0 && curve[index - 1].gz < 0);
  const heelAngle = transverseG === 0 ? 0 : crossing?.angle ?? 90;
  const gzAtHeel = curve.find((point) => point.angle >= heelAngle)?.gz ?? 0;
  const maxPoint = curve.reduce((best, point) => point.gz > best.gz ? point : best, curve[0]);
  const positiveRange = [...curve].reverse().find((point) => point.gz > 0)?.angle ?? 0;
  const status = getStatus(gm, positiveRange);
  return { hydro, correctedKg, freeSurfaceCorrection, gm, transverseG, heelingMoment, heelAngle, gzAtHeel,
    maxGz: maxPoint.gz, maxGzAngle: maxPoint.angle, positiveRange, curve,
    statusLabel: status.label, statusColor: status.color, interpretation: status.interpretation };
}
