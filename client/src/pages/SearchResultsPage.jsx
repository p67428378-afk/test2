import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getMovies } from '../services/api';
import MovieGrid from '../components/Movies/MovieGrid';
import Spinner from '../components/UI/Spinner';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SearchResultsPage = () => {
  const query = useQuery();
  const searchQuery = query.get('q');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!searchQuery) return;

    const fetchResults = async () => {
      setIsLoading(true);
      setError('');
      try {
        // Assuming the backend can filter movies by a search query parameter
        const { data } = await getMovies({ search: searchQuery });
        setResults(data);
      } catch (err) {
        setError('Failed to fetch search results.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [searchQuery]);

  if (isLoading) return <Spinner />;
  if (error) return <p className='text-red-500'>{error}</p>;

  return (
    <div>
      <h1 className='font-h1 text-h1 text-on-background mb-8'>
        Search Results for: <span className='text-primary'>{searchQuery}</span>
      </h1>
      {results.length > 0 ? (
        <MovieGrid movies={results} />
      ) : (
        <p>No movies found matching your search.</p>
      )}
    </div>
  );
};

export default SearchResultsPage;
