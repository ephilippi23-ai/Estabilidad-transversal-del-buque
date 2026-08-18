type SliderProps = {
  label: string; value: number; min: number; max: number; step: number;
  unit: string; help: string; onChange: (value: number) => void;
};

export function Slider({ label, value, min, max, step, unit, help, onChange }: SliderProps) {
  const update = (raw: string) => {
    const next = Number(raw);
    if (Number.isFinite(next)) onChange(Math.min(max, Math.max(min, next)));
  };
  return (
    <div className="slider-row">
      <div className="slider-label"><label htmlFor={`slider-${label}`}>{label}</label><output>{value.toLocaleString('es-UY')} <small>{unit}</small></output></div>
      <input id={`slider-${label}`} type="range" value={value} min={min} max={max} step={step} onChange={(event) => update(event.target.value)} />
      <p>{help}</p>
    </div>
  );
}
