import React from 'react';

const MovieInfo = ({ movie }) => {
  return (
    <div className='text-on-surface'>
      <h1 className='font-display text-5xl mb-4 leading-tight'>{movie.title}</h1>
      <div className='flex items-center gap-3 mb-4'>
        <span className='flex items-center gap-1 text-secondary font-bold'>
          <span className='material-symbols-outlined text-sm' style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
          {movie.vote_average}
        </span>
        <span className='text-on-surface-variant'>{new Date(movie.release_date).getFullYear()}</span>
      </div>
      <p className='font-body-lg text-body-lg text-on-surface-variant mb-6'>{movie.description}</p>
      {/* Add more details like cast, director, etc. here */}
    </div>
  );
};

export default MovieInfo;
