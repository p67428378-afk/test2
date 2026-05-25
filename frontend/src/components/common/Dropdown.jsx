import React from 'react';

const Dropdown = ({ options, onSelect, selectedOption, placeholder }) => {
  return (
    <select
      value={selectedOption}
      onChange={(e) => onSelect(e.target.value)}
      className='w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-blue-500'
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Dropdown;
