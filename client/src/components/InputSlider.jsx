import React from 'react';

const InputSlider = ({ id, label, min, max, step, value, onChange, displayValue }) => {
  return (
    <div className="flex flex-col gap-sm">
      <div className="flex justify-between items-center">
        <label className="font-label-md text-label-md text-on-surface-variant" htmlFor={id}>
          {label}
        </label>
        <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-label-md text-label-md">
          {displayValue}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className="cursor-pointer"
      />
      <div className="flex justify-between font-label-caps text-label-caps text-outline uppercase tracking-widest">
        <span>{min}{displayValue.includes('x') ? 'x' : '%'}</span>
        <span>{max}{displayValue.includes('x') ? 'x' : '%'}</span>
      </div>
    </div>
  );
};

export default InputSlider;
