import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${query}`);
      setQuery('');
    }
  };

  return (
    <form onSubmit={handleSearch} className='relative flex items-center'>
      <span className='material-symbols-outlined absolute left-3 text-on-surface-variant'>search</span>
      <input 
        className='bg-surface-container-high border-none rounded-full pl-10 pr-4 py-2 text-sm w-80 focus:ring-2 focus:ring-primary transition-all' 
        placeholder='Search movies, actors, directors...' 
        type='text'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </form>
  );
};

export default SearchBar;
