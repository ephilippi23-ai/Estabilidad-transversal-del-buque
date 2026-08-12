export type Inputs = {
  displacement: number;
  beam: number;
  draft: number;
  depth: number;
  kg: number;
  kgOffset: number;
  kb: number;
  ballast: number;
  ballastOffset: number;
  cargoWeight: number;
  cargoOffset: number;
};

export type StabilityPoint = { angle: number; gz: number };

export type StabilityResult = {
  gHeight: number;
  gOffset: number;
  bHeight: number;
  bOffset: number;
  metalCenterHeight: number;
  gm: number;
  bm: number;
  maxGz: number;
  heelAngle: number;
  gz: number;
  kg: number;
  curve: StabilityPoint[];
  statusLabel: string;
  statusColor: 'good' | 'stiff' | 'reduced' | 'neutral' | 'danger';
  interpretation: string;
};

type StabilityStatus = {
  label: string;
  color: 'good' | 'stiff' | 'reduced' | 'neutral' | 'danger';
  interpretation: string;
};

const getStatus = (gm: number): StabilityStatus => {
  if (gm < 0.1) return { label: 'Condición inestable', color: 'danger', interpretation: 'El metacentro está por debajo del centro de gravedad: riesgo crítico de pérdida de estabilidad.' };
  if (gm < 0.4) return { label: 'Estabilidad reducida', color: 'neutral', interpretation: 'Buque con estabilidad baja: la recuperación es lenta y puede ser peligrosa en marejada.' };
  if (gm < 1.0) return { label: 'Estabilidad adecuada', color: 'good', interpretation: 'Buque con buena estabilidad transversal y recuperación confortable.' };
  return { label: 'Buque excesivamente rígido', color: 'stiff', interpretation: 'El buque es muy rígido: escora rápida pero puede ser incómoda y transmitir fuerzas altas a la estructura.' };
};

export function calculateStability(inputs: Inputs): StabilityResult {
  const totalWeight = inputs.displacement + inputs.ballast + inputs.cargoWeight;
  const gHeight = (inputs.kg * inputs.displacement + (inputs.kg + 0.1) * inputs.ballast + (inputs.kg + 0.05) * inputs.cargoWeight) / totalWeight;
  const gOffset = (inputs.kgOffset * inputs.displacement + inputs.ballastOffset * inputs.ballast + inputs.cargoOffset * inputs.cargoWeight) / totalWeight;
  const bHeight = inputs.kb;
  const bOffset = 0;
  const displacementVolume = inputs.displacement; // m³ aproximado, 1 t = 1 m³ para simplificar
  const transverseBM = Math.max(0.15, (Math.pow(inputs.beam, 3) * 0.95) / (12 * displacementVolume));
  const metalCenterHeight = bHeight + transverseBM;
  const gm = metalCenterHeight - gHeight;
  const heelAngle = Math.min(40, Math.max(0, 4 + gOffset * 1.8 - (gm - 0.35) * 2.1));
  const curve = Array.from({ length: 81 }, (_, index) => {
    const angle = index * 0.5;
    const radians = (angle * Math.PI) / 180;
    const reduction = 1 - Math.min(0.4, angle / 45);
    const gz = Math.max(0, Math.sin(radians) * Math.max(0, gm) * reduction - 0.00045 * angle * angle);
    return { angle, gz };
  });
  const currentPoint = curve.find((point) => point.angle >= heelAngle) ?? curve[curve.length - 1];
  const gz = currentPoint.gz;
  const maxGz = Math.max(...curve.map((point) => point.gz));
  const bm = transverseBM;
  const status = getStatus(gm);

  return {
    gHeight,
    gOffset,
    bHeight,
    bOffset,
    metalCenterHeight,
    gm,
    heelAngle,
    gz,
    kg: inputs.kg,
    curve,
    statusLabel: status.label,
    statusColor: status.color,
    interpretation: status.interpretation,
    bm,
    maxGz,
  };
}
