import React from 'react';

const RadioGroup = ({ name, options, selectedValue, onChange, label }) => {
  return (
    <div className="space-y-md">
      <span className="text-label-md font-label-md text-on-surface block">{label}</span>
      <div className="flex gap-xl">
        {options.map(option => (
          <label key={option.value} className="flex items-center gap-base cursor-pointer group">
            <div className="relative w-5 h-5">
              <input 
                className="peer sr-only" 
                name={name} 
                type="radio" 
                value={option.value} 
                checked={selectedValue === option.value}
                onChange={(e) => onChange(e.target.value)}
              />
              <div className="w-5 h-5 border-2 border-outline rounded-full peer-checked:border-primary peer-checked:border-[6px] transition-all"></div>
            </div>
            <span className="text-body-md font-body-md text-on-surface-variant group-hover:text-on-surface">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default RadioGroup;
