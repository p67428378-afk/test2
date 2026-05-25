import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ onSearch, placeholder }) => {
  return (
    <div className='relative'>
      <input
        type='text'
        placeholder={placeholder || 'Search...'}
        onChange={(e) => onSearch(e.target.value)}
        className='w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:border-blue-500'
      />
      <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
        <Search className='h-5 w-5 text-gray-400' />
      </div>
    </div>
  );
};

export default SearchBar;
