import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getMovieById } from '../services/api';
import MovieHeader from '../components/Movies/MovieHeader';
import MovieInfo from '../components/Movies/MovieInfo';
import Spinner from '../components/UI/Spinner';

const MovieDetailPage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMovie = async () => {
      setIsLoading(true);
      try {
        const { data } = await getMovieById(id);
        setMovie(data);
      } catch (err) {
        setError('Failed to load movie details.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  if (isLoading) return <Spinner />;
  if (error) return <p className='text-red-500'>{error}</p>;
  if (!movie) return <p>Movie not found.</p>;

  return (
    <div className='flex flex-col gap-section-gap'>
      <MovieHeader movie={movie} />
      <MovieInfo movie={movie} />
      {/* Potentially add sections for cast, reviews, related movies etc. */}
    </div>
  );
};

export default MovieDetailPage;
