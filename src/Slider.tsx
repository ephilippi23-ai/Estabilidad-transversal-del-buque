type SliderProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  hint?: string;
  onChange: (value: number) => void;
};

export function Slider({ label, value, min, max, step, unit, hint, onChange }: SliderProps) {
  const progress = ((value - min) / (max - min)) * 100;
  return (
    <label className="control-row">
      <span className="control-copy">
        <strong>{label}</strong>
        {hint && <small>{hint}</small>}
      </span>
      <span className="control-value">
        <input type="number" value={value} min={min} max={max} step={step} aria-label={`${label} en ${unit}`} onChange={(event) => onChange(Number(event.target.value))} />
        <span>{unit}</span>
      </span>
      <input className="range" type="range" value={value} min={min} max={max} step={step} style={{ '--progress': `${progress}%` } as React.CSSProperties} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}
