import React from 'react';
import MovieCard from './MovieCard';
import Spinner from '../UI/Spinner';

const MovieGrid = ({ movies, isLoading }) => {
  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter'>
      {movies.map(movie => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
};

export default MovieGrid;
