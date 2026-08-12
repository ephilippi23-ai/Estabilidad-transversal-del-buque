type SliderProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
};

export function Slider({ label, value, min, max, step, onChange }: SliderProps) {
  return (
    <div className="slider-row">
      <label>
        <span>{label}</span>
        <div className="slider-inputs">
          <input type="range" value={value} min={min} max={max} step={step} onChange={(event) => onChange(Number(event.target.value))} />
          <input
            type="number"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(event) => onChange(Number(event.target.value))}
          />
        </div>
      </label>
    </div>
  );
}
