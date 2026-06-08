import React from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  return (
    <Link to={`/movies/${movie.id}`} className='movie-card group glass-card rounded-2xl overflow-hidden flex flex-col'>
      <div className='movie-poster-container'>
        <img alt={`${movie.title} Poster`} src={movie.poster_url || 'https://via.placeholder.com/500x750'} />
        <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6'>
          <button className='w-full py-3 bg-primary text-on-primary rounded-xl font-bold flex items-center justify-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform'>
            <span className='material-symbols-outlined'>play_circle</span> Watch Now
          </button>
        </div>
        {movie.rating && (
          <div className='absolute top-4 right-4 rating-badge px-3 py-1 rounded-lg flex items-center gap-1'>
            <span className='material-symbols-outlined text-secondary text-sm' style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            <span className='text-sm font-bold text-white'>{movie.rating}</span>
          </div>
        )}
      </div>
      <div className='p-5 flex flex-col gap-1'>
        <h4 className='font-h3 text-on-surface truncate'>{movie.title}</h4>
        <div className='flex items-center gap-2 text-xs text-on-surface-variant font-medium'>
          <span>{new Date(movie.release_date).getFullYear()}</span>
          {/* Additional details like genre can be added here */}
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
