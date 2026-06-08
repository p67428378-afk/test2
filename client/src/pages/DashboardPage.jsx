import React, { useState, useEffect } from 'react';
import { getRecommendations, getMovies } from '../services/api';
import MovieGrid from '../components/Movies/MovieGrid';
import Spinner from '../components/UI/Spinner';

const DashboardPage = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [trending, setTrending] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError('');
      try {
        const [recs, trendingMovies] = await Promise.all([
          getRecommendations(),
          getMovies({ limit: 4 }) // Assuming the generic endpoint can serve as trending
        ]);
        setRecommendations(recs.data);
        setTrending(trendingMovies.data);
      } catch (err) {
        setError('Could not fetch dashboard data.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <Spinner />;
  if (error) return <p className='text-red-500'>{error}</p>;

  return (
    <div className='flex flex-col gap-section-gap'>
      {/* Hero section can be a static component or based on a specific movie */}
      <section>
        <div className='flex items-center justify-between mb-8'>
          <div>
            <h2 className='font-h1 text-h1 text-on-background'>For You</h2>
            <p className='text-on-surface-variant font-body-md opacity-70'>Based on your recent interests</p>
          </div>
        </div>
        <MovieGrid movies={recommendations} isLoading={isLoading} />
      </section>

      <section>
        <div className='flex items-center justify-between mb-8'>
          <h2 className='font-h1 text-h1 text-on-background'>Trending Now</h2>
        </div>
        <MovieGrid movies={trending} isLoading={isLoading} />
      </section>
    </div>
  );
};

export default DashboardPage;
