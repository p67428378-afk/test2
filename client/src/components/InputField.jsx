import React from 'react';

const InputField = ({ id, label, value, onChange, type = 'number', placeholder, symbol }) => {
  return (
    <div className="flex flex-col gap-sm">
      <label className="font-label-md text-label-md text-on-surface-variant" htmlFor={id}>
        {label}
      </label>
      <div className="relative group">
        {symbol && <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-body-base">{symbol}</span>}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full ${symbol ? 'pl-8' : 'pl-4'} pr-4 py-3 bg-white border border-[#D1D5DB] rounded-lg focus:ring-0 focus:border-[#3B82F6] transition-all outline-none font-body-base text-[#1F2937]`}
        />
      </div>
    </div>
  );
};

export default InputField;
