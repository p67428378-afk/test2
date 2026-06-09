import React from 'react';

const SearchBar = ({ value, onChange, placeholder = 'Search...' }) => {
  return (
    <div className='relative'>
      <span className='material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm'>
        search
      </span>
      <input
        type='text'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className='bg-background border border-outline-variant text-on-surface text-xs rounded-md pl-8 pr-4 py-1 focus:ring-1 focus:ring-primary-container focus:border-primary-container w-full placeholder:text-on-surface-variant transition-colors'
        placeholder={placeholder}
      />
    </div>
  );
};

export default SearchBar;
