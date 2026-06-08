import React, { useState, useEffect } from 'react';
import { getWatchHistory } from '../services/api';
import MovieCard from '../components/Movies/MovieCard';
import Spinner from '../components/UI/Spinner';

const WatchHistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        const { data } = await getWatchHistory();
        // The API returns watch history entries, we might need to map them to movie objects
        // This assumes the API returns movie objects directly or populated
        setHistory(data.map(item => item.movie)); 
      } catch (err) {
        setError('Failed to load watch history.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (isLoading) return <Spinner />;
  if (error) return <p className='text-red-500'>{error}</p>;

  return (
    <div>
      <h1 className='font-h1 text-h1 text-on-background mb-8'>Watch History</h1>
      {history.length > 0 ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter'>
          {history.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <p>You haven't watched any movies yet.</p>
      )}
    </div>
  );
};

export default WatchHistoryPage;
