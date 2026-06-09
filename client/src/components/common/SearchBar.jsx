import React from 'react';

export default function SearchBar({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div className='relative w-full'>
      <span className='material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline'>search</span>
      <input
        className='w-full pl-10 pr-4 py-2 bg-surface rounded border border-outline-variant focus:outline-none focus:border-on-surface focus:ring-2 focus:ring-primary-container focus:ring-offset-2 text-on-surface transition-all'
        placeholder={placeholder}
        type='text'
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
