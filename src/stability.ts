export type Inputs = {
  displacement: number;
  length: number;
  beam: number;
  draft: number;
  depth: number;
  kg: number;
  kgOffset: number;
  kb: number;
  cargoWeight: number;
  cargoOffset: number;
  cargoHeight: number;
  ballastLevel: number;
  ballastOffset: number;
};

export type StabilityPoint = { angle: number; gz: number };

export type StabilityResult = {
  totalDisplacement: number;
  effectiveKg: number;
  effectiveGOffset: number;
  kb: number;
  bm: number;
  km: number;
  gm: number;
  heelAngle: number;
  gz: number;
  rightingMoment: number;
  heelingMoment: number;
  ballastWeight: number;
  freeSurfaceCorrection: number;
  downfloodAngle: number;
  rangeOfStability: number;
  maxGz: number;
  maxGzAngle: number;
  curve: StabilityPoint[];
  status: 'good' | 'stiff' | 'reduced' | 'neutral' | 'danger' | 'risk';
  statusLabel: string;
  interpretation: string;
};

const WATER_DENSITY = 1.025;
const GRAVITY = 9.81;
const radians = (value: number) => value * Math.PI / 180;
const degrees = (value: number) => value * 180 / Math.PI;
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function getStatus(gm: number, heel: number, downflood: number, maxGz: number) {
  if (gm < -0.02) return { status: 'danger' as const, label: 'Condición inestable', text: 'G está por encima de M. Una perturbación aumenta la escora en vez de corregirla.' };
  if (gm <= 0.08) return { status: 'neutral' as const, label: 'Equilibrio indiferente', text: 'La capacidad inicial de adrizarse es prácticamente nula.' };
  if (Math.abs(heel) > downflood * 0.78 || maxGz < 0.12) return { status: 'risk' as const, label: 'Riesgo de pérdida de estabilidad', text: 'La escora se aproxima al límite estimado o la reserva GZ es pequeña.' };
  if (gm < 0.45) return { status: 'reduced' as const, label: 'Estabilidad reducida', text: 'El retorno será lento y existe poca reserva ante viento, oleaje o movimiento de carga.' };
  if (gm > 2.4) return { status: 'stiff' as const, label: 'Buque excesivamente rígido', text: 'La respuesta es rápida y brusca; aumentan la incomodidad y los esfuerzos sobre la carga.' };
  return { status: 'good' as const, label: 'Estabilidad adecuada', text: 'Existe una respuesta adrizante positiva y una reserva confortable para este escenario.' };
}

export function calculateStability(input: Inputs): StabilityResult {
  const ballastCapacity = input.displacement * 0.14;
  const ballastWeight = ballastCapacity * input.ballastLevel / 100;
  const totalDisplacement = input.displacement + ballastWeight + input.cargoWeight;
  const volume = totalDisplacement / WATER_DENSITY;

  const ballastHeight = Math.max(0.35, input.draft * 0.13);
  const verticalMoment = input.displacement * input.kg + ballastWeight * ballastHeight + input.cargoWeight * input.cargoHeight;
  const effectiveKg = verticalMoment / Math.max(totalDisplacement, 1);
  const transverseMoment = input.displacement * input.kgOffset + ballastWeight * input.ballastOffset + input.cargoWeight * input.cargoOffset;
  const effectiveGOffset = transverseMoment / Math.max(totalDisplacement, 1);

  const blockCoefficient = clamp(volume / Math.max(input.length * input.beam * input.draft, 1), 0.45, 0.88);
  const waterplaneCoefficient = clamp(0.62 + blockCoefficient * 0.18, 0.68, 0.8);
  const waterplaneInertia = waterplaneCoefficient * input.length * Math.pow(input.beam, 3) / 12;
  const bm = waterplaneInertia / Math.max(volume, 1);

  const fill = input.ballastLevel / 100;
  const freeSurfaceFactor = 4 * fill * (1 - fill);
  const tankBreadth = input.beam * 0.62;
  const tankLength = input.length * 0.16;
  const tankInertia = tankLength * Math.pow(tankBreadth, 3) / 12;
  const freeSurfaceCorrection = input.ballastLevel > 1 && input.ballastLevel < 99
    ? WATER_DENSITY * tankInertia * freeSurfaceFactor / Math.max(totalDisplacement, 1)
    : 0;

  const kb = input.kb;
  const km = kb + bm;
  const gm = km - effectiveKg - freeSurfaceCorrection;
  const heelingMoment = transverseMoment * GRAVITY;

  let heelAngle: number;
  if (gm <= 0) {
    const direction = effectiveGOffset === 0 ? 1 : Math.sign(effectiveGOffset);
    heelAngle = direction * clamp(18 + Math.abs(gm) * 10, 18, 36);
  } else {
    heelAngle = clamp(degrees(Math.atan2(effectiveGOffset, gm)), -36, 36);
  }

  const freeboard = Math.max(0.3, input.depth - input.draft);
  const downfloodAngle = clamp(degrees(Math.atan2(2 * freeboard, input.beam)) + 22, 34, 68);
  const rangeOfStability = clamp(downfloodAngle + 14 - Math.max(0, effectiveKg - kb) * 1.1, 32, 78);
  const curve = Array.from({ length: 121 }, (_, index) => {
    const angle = index * 0.5;
    const decay = 1 - Math.pow(angle / rangeOfStability, 1.75);
    const formArm = 0.055 * input.beam * Math.pow(Math.sin(radians(angle)), 2) * Math.cos(radians(angle));
    const value = gm * Math.sin(radians(angle)) * decay + formArm * Math.max(0, decay);
    return { angle, gz: angle >= rangeOfStability ? Math.min(0, value) : value };
  });

  const currentIndex = clamp(Math.round(Math.abs(heelAngle) * 2), 0, curve.length - 1);
  const gz = curve[currentIndex].gz;
  const rightingMoment = totalDisplacement * GRAVITY * gz;
  const positiveCurve = curve.filter((point) => point.angle <= rangeOfStability);
  const peak = positiveCurve.reduce((best, point) => point.gz > best.gz ? point : best, positiveCurve[0]);
  const status = getStatus(gm, heelAngle, downfloodAngle, peak.gz);

  return {
    totalDisplacement, effectiveKg, effectiveGOffset, kb, bm, km, gm, heelAngle, gz,
    rightingMoment, heelingMoment, ballastWeight, freeSurfaceCorrection, downfloodAngle,
    rangeOfStability, maxGz: peak.gz, maxGzAngle: peak.angle, curve,
    status: status.status, statusLabel: status.label, interpretation: status.text,
  };
}
