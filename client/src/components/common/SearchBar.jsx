import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ placeholder, value, onChange }) => {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="pl-10 pr-4 py-2 border rounded-lg w-full"
      />
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        <Search size={20} />
      </div>
    </div>
  );
};

export default SearchBar;
