import React from 'react';

const Dropdown = ({ options, selected, onSelect, placeholder }) => {
  return (
    <select
      value={selected}
      onChange={(e) => onSelect(e.target.value)}
      className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
    >
      <option value="">{placeholder}</option>
      {options.map(option => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
  );
};

export default Dropdown;
